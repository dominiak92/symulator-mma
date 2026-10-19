/**
 * Funkcja serwera „game” (Supabase Edge Function, Deno).
 * Serwer jest sędzią: trzyma pełny stan kariery (z ziarnem losowania), liczy każdą decyzję
 * tym samym silnikiem co gra, pilnuje limitu lat dziennie i sam liczy dorobek do rankingu.
 * Przeglądarka dostaje stan bez ziarna, więc nie może podejrzeć przyszłości.
 */
// @ts-nocheck — plik budowany esbuildem do supabase/functions/game/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as G from '../src/engine/game';
import type { GameState, Profile } from '../src/engine/types';

const ALLOWED = new Set([
  'changeDivision', 'doTraining', 'acceptSponsorOffer', 'acceptShadyDeal', 'refuseShadyDeal', 'investAcademy', 'setBackroom',
  'takeFamilyHelp', 'takeLoan', 'downgradeClub', 'takeBreakYear', 'rehabYear', 'goExpedition', 'goDagestan', 'pitchSponsor',
  'startSeason', 'chooseEvent', 'continueAfterEvent', 'setFarewell', 'acceptInvite', 'declineInvite', 'seasonNext', 'decide',
  'seasonSkip', 'acceptAllOffers', 'pressAnswer', 'weighIn', 'postAnswer', 'acceptOffer', 'negotiateOffer', 'declineOffer',
  'setWantFights', 'setManager', 'setYearGoal', 'toSummary', 'toMarket', 'pickContract', 'pickClub', 'negotiateContract',
  'setJob', 'donate', 'setCoach', 'setPerks', 'setSocial', 'confirmMarket', 'retire', 'chooseAfter', 'answerMessage', 'startErrand', 'claimErrand',
]);
// akcje, które otwierają nowy rok kariery: zużywają lata z dziennego limitu
const YEAR_COST: Record<string, (s: GameState, args: unknown[]) => number> = {
  startSeason: () => 1,
  takeBreakYear: () => 1,
  rehabYear: () => 1,
  goDagestan: () => 2,
  goExpedition: (_s, a) => (G.EXPEDITIONS.find((e) => e.id === a[0])?.years ?? 1),
};

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const DAY = 86400000;
// doba sezonu liczy się po polskiemu: nowe lata przychodzą o północy czasu warszawskiego
const WAW = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Warsaw', year: 'numeric', month: '2-digit', day: '2-digit' });
const wawDay = (t: number) => Math.floor(Date.parse(WAW.format(new Date(t)) + 'T00:00:00Z') / DAY);
const dayIndex = (season: { starts_at: string }, t = Date.now()) => wawDay(t) - wawDay(new Date(season.starts_at).getTime());
/** Chwila, w której zaczyna się doba `d` sezonu (północ w Warszawie). */
function dayStart(season: { starts_at: string }, d: number): number {
  const target = wawDay(new Date(season.starts_at).getTime()) + d;
  // północ w Warszawie to 22:00 albo 23:00 UTC poprzedniego dnia
  for (const off of [2, 1]) {
    const t = target * DAY - off * 3600000;
    if (wawDay(t) === target && wawDay(t - 1) === target - 1) return t;
  }
  return target * DAY;
}

function forClient(s: GameState): GameState {
  return { ...s, rngState: (Math.random() * 4294967296) >>> 0 };
}
function legacyOf(s: GameState): number {
  return Math.max(0, Math.round(s.ending?.legacy ?? G.legacyScore(s)));
}
function refill(c: { bank: number; refill_day: number }, season: any) {
  const d = Math.min(dayIndex(season), dayIndex(season, new Date(season.ends_at).getTime() - 1));
  if (d > c.refill_day) {
    c.bank = Math.min(season.bank_cap, c.bank + (d - c.refill_day) * season.years_per_day);
    c.refill_day = d;
  }
}
function nextRefillAt(season: any, c: { refill_day: number }) {
  return new Date(dayStart(season, c.refill_day + 1)).toISOString();
}

// klient bazy tworzony raz na instancję funkcji (oszczędza czas przy każdej akcji)
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false, autoRefreshToken: false } });

/** Kto pyta: podpis tokenu sprawdzany lokalnie (klucze JWKS), a gdy się nie da, pytamy serwer logowania. */
async function userId(jwt: string): Promise<string | null> {
  if (!jwt) return null;
  try {
    if (typeof db.auth.getClaims === 'function') {
      const { data, error } = await db.auth.getClaims(jwt);
      const sub = data?.claims?.sub;
      if (!error && typeof sub === 'string' && (data.claims.exp ?? 0) * 1000 > Date.now()) return sub;
    }
  } catch {
    /* spadamy do getUser */
  }
  const { data, error } = await db.auth.getUser(jwt);
  return error || !data?.user ? null : data.user.id;
}

const later = (p: PromiseLike<unknown>) => {
  const rt = (globalThis as any).EdgeRuntime;
  if (rt?.waitUntil) rt.waitUntil(Promise.resolve(p));
  else return p;
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const jwt = (req.headers.get('Authorization') ?? '').replace('Bearer ', '');
    const [uid, body] = await Promise.all([userId(jwt), req.json().catch(() => ({}))]);
    if (!uid) return json({ error: 'Brak sesji gracza.' }, 401);
    const op = body.op as string;

    const now = new Date().toISOString();
    const needCareer = (op === 'load' || op === 'act') && typeof body.careerId === 'string';
    const [{ data: season }, { data: player }, careerRes] = await Promise.all([
      db.from('seasons').select('*').lte('starts_at', now).order('starts_at', { ascending: false }).limit(1).maybeSingle(),
      db.from('players').select('*').eq('id', uid).maybeSingle(),
      needCareer ? db.from('careers').select('*').eq('id', body.careerId).eq('player_id', uid).maybeSingle() : Promise.resolve({ data: null }),
    ]);

    const leaderboard = async () => {
      if (!season) return [];
      const { data } = await db.from('careers').select('player_id, legacy, finished, players(nick)').eq('season_id', season.id).order('legacy', { ascending: false }).limit(400);
      const best = new Map<string, { nick: string; legacy: number; finished: boolean; me: boolean }>();
      for (const r of data ?? []) if (!best.has(r.player_id)) best.set(r.player_id, { nick: r.players?.nick ?? '?', legacy: r.legacy, finished: r.finished, me: r.player_id === uid });
      return [...best.values()].slice(0, 100).map((r, i) => ({ place: i + 1, ...r }));
    };

    if (op === 'status') {
      const careers = season && player ? (await db.from('careers').select('id, attempt, legacy, finished, bank, refill_day, state').eq('season_id', season.id).eq('player_id', uid).order('attempt')).data ?? [] : [];
      for (const c of careers) refill(c, season);
      return json({
        season: season ? { id: season.id, name: season.name, startsAt: season.starts_at, endsAt: season.ends_at, yearsPerDay: season.years_per_day, bankCap: season.bank_cap, maxCareers: season.max_careers, open: now < season.ends_at } : null,
        player: player ? { nick: player.nick } : null,
        careers: careers.map((c) => ({ id: c.id, attempt: c.attempt, legacy: c.legacy, finished: c.finished, bank: c.bank, nextRefillAt: nextRefillAt(season, c), name: `${c.state.profile.firstName} ${c.state.profile.lastName}`, age: c.state.age, phase: c.state.phase })),
        leaderboard: await leaderboard(),
      });
    }

    if (op === 'setNick') {
      const nick = String(body.nick ?? '').trim().replace(/\s+/g, ' ').slice(0, 20);
      if (nick.length < 2) return json({ error: 'Ksywka musi mieć co najmniej 2 znaki.' }, 400);
      const { error } = await db.from('players').upsert({ id: uid, nick });
      if (error) return json({ error: 'Nie udało się zapisać ksywki.' }, 500);
      return json({ ok: true, nick });
    }

    if (!season || now >= season.ends_at) return json({ error: 'Sezon jest zamknięty. Następny wkrótce.' }, 409);
    if (!player) return json({ error: 'Najpierw wybierz ksywkę.' }, 400);

    if (op === 'new') {
      const { count } = await db.from('careers').select('id', { count: 'exact', head: true }).eq('season_id', season.id).eq('player_id', uid);
      if ((count ?? 0) >= season.max_careers) return json({ error: `W tym sezonie masz już ${season.max_careers} kariery.` }, 409);
      const profile = body.profile as Profile;
      if (!profile || !profile.firstName || !profile.lastName || !profile.start || !profile.style) return json({ error: 'Niepełny profil zawodnika.' }, 400);
      // ten sam start dla wszystkich: ziarno sezonu
      const s = G.newGame({ slot: 9, mode: 'ranked', seed: Number(season.seed) >>> 0, profile, quick: false });
      const c = { player_id: uid, season_id: season.id, attempt: (count ?? 0) + 1, state: s, bank: season.years_per_day, refill_day: dayIndex(season), legacy: legacyOf(s) };
      const { data, error } = await db.from('careers').insert(c).select('id, bank, refill_day').single();
      if (error) return json({ error: 'Nie udało się założyć kariery.' }, 500);
      return json({ careerId: data.id, state: forClient(s), bank: data.bank, nextRefillAt: nextRefillAt(season, data) });
    }

    if (op === 'load' || op === 'act') {
      const c = careerRes.data;
      if (!c || c.season_id !== season.id) return json({ error: 'Nie ma takiej kariery.' }, 404);
      const bank0 = c.bank;
      refill(c, season);
      let s: GameState = c.state;
      if (op === 'act') {
        const ops = Array.isArray(body.ops) ? body.ops.slice(0, 20) : [];
        const seasonBefore = s.season;
        for (const o of ops) {
          if (!ALLOWED.has(o?.name)) return json({ error: `Niedozwolona akcja: ${o?.name}` }, 400);
          const args = Array.isArray(o.args) ? [...o.args] : [];
          // czas sprawy „na mieście” liczy zegar serwera, nie przeglądarki
          if (o.name === 'startErrand') args[1] = Date.now();
          if (o.name === 'claimErrand') args[0] = Date.now();
          const cost = YEAR_COST[o.name]?.(s, args) ?? 0;
          if (cost > 0 && c.bank < cost) return json({ error: 'limit', bank: c.bank, nextRefillAt: nextRefillAt(season, c), state: forClient(s) }, 429);
          const next = (G as any)[o.name](s, ...args);
          if (cost > 0 && next !== s) c.bank -= cost;
          s = next;
        }
        const legacy = legacyOf(s);
        // zapis tylko wtedy, gdy nikt (np. druga karta) nie zmienił kariery w międzyczasie
        const { data: saved, error } = await db.from('careers').update({ state: s, bank: c.bank, refill_day: c.refill_day, legacy, finished: s.phase === 'ended', version: c.version + 1, updated_at: now }).eq('id', c.id).eq('version', c.version).select('id');
        if (error || !saved?.length) return json({ error: 'Kariera zmieniła się w innym oknie. Wczytaj ją jeszcze raz.', stale: true }, 409);
        await later(db.from('career_log').insert({ career_id: c.id, ops, season_before: seasonBefore, season_after: s.season }));
      } else if (c.bank !== bank0) await db.from('careers').update({ bank: c.bank, refill_day: c.refill_day }).eq('id', c.id);
      return json({ state: forClient(s), bank: c.bank, nextRefillAt: nextRefillAt(season, c) });
    }

    return json({ error: 'Nieznana operacja.' }, 400);
  } catch (e) {
    return json({ error: 'Błąd serwera.', detail: String((e as Error)?.message ?? e) }, 500);
  }
});
