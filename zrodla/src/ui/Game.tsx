import TextSize from './TextSize';
import { shownRecord, useHudHold } from './hudHold';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { GameState, Phase } from '../engine/types';
import { predictability } from '../engine/fight';
import { goalBlockedInQuick, goalMet, todaysGoals, weekEndsIn } from '../engine/goals';
import { STAT_KEYS, STAT_LABELS, STAT_DESC, START_PROFILES, STYLE_LABELS, TIER_NAMES, DIFFICULTY, WEIGHTS, amateurDivision } from '../engine/data';
import { debutCheck, displayName, rankStr, rankingTable, recStr, tourneyResultText } from '../engine/game';
import { ovr } from '../engine/fighter';
import { money, moneyShort } from '../format';
import Training from './steps/Training';
import Budget from './steps/Budget';
import EventStep from './steps/EventStep';
import Season from './steps/Season';
import Summary from './steps/Summary';
import Market from './steps/Market';
import Ended from './steps/Ended';
import { HistorySheet, PeersSheet, RankingSheet } from './Sheets';
import { GG } from './brand';
import { Icon, STAT_ICON } from './Icon';
import { Medal } from './Art';
import { Tutorial } from './Tutorial';
import { sfxClick, unlockAudio } from './sound';
import { loadGoals, loadSettings, saveSettings } from '../storage';
import { Emblem, SponsorLogo, clubCrest, crestFor } from './Emblem';

const PHASES: Phase[] = ['training', 'budget', 'event', 'season', 'summary', 'market'];
const PHASE_LABEL: Record<Phase, string> = {
  training: 'Okres przygotowawczy',
  budget: 'Budżet',
  event: 'Przed startem',
  season: 'Walki',
  summary: 'Podsumowanie',
  market: 'Kontrakty',
  ended: 'Koniec kariery',
};

export interface StepProps {
  game: GameState;
  setGame: (s: GameState) => void;
}

type SheetName = 'menu' | 'history' | 'peers' | 'ranking' | 'skills' | 'goals';

export function shortName(g: GameState) {
  const p = g.profile;
  return p.nickname ? `„${p.nickname}” ${p.lastName}` : `${p.firstName} ${p.lastName}`;
}

export function careerLine(g: GameState) {
  if (g.contract.kind === 'freak') return 'freak fighty';
  return TIER_NAMES[g.tier];
}

export default function Game({
  game,
  setGame,
  onMenu,
  onNewCareer,
}: {
  game: GameState;
  setGame: (s: GameState) => void;
  onMenu: () => void;
  onNewCareer: () => void;
}) {
  const [sheet, setSheet] = useState<null | SheetName>(null);
  const [tut, setTut] = useState(false);
  const g = game;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    // fokus na nagłówek nowego ekranu (klawiatura i czytniki ekranu nie zostają „w powietrzu”)
    const h = document.querySelector<HTMLElement>('.main h2');
    if (h && (document.activeElement === document.body || !document.activeElement?.isConnected)) {
      h.tabIndex = -1;
      h.focus({ preventScroll: true });
    }
  }, [g.phase, g.season]);

  // blokada podwójnego stuknięcia: zaraz po zmianie ekranu przycisk w tym samym miejscu
  // (np. „Trenuję” → „Zaczynam rok”) nie może przyjąć drugiego kliknięcia
  const clickLock = useRef(0);
  useEffect(() => {
    clickLock.current = Date.now() + 450;
  }, [g.phase, g.season, g.event?.id, g.event?.picked]);
  useEffect(() => {
    const block = (e: Event) => {
      if (Date.now() > clickLock.current) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest('.cta-bar button, .main .choice:not(.train-opt), .main .offer, .icon-pill')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener('click', block, true);
    return () => document.removeEventListener('click', block, true);
  }, []);

  // przycisk „wstecz” w telefonie: zamyka okienko albo otwiera menu gry, zamiast wyrzucać z gry
  const sheetRef = useRef(sheet);
  sheetRef.current = sheet;
  useEffect(() => {
    history.pushState({ spzGame: 1 }, '');
    const onPop = () => {
      setSheet(sheetRef.current ? null : 'menu');
      history.pushState({ spzGame: 1 }, '');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheet]);

  const phaseIdx = PHASES.indexOf(g.phase);
  const hudRef = useRef<HTMLElement>(null);
  // belka chowa się przy przewijaniu w dół, wraca przy ruchu w górę
  const [hudHidden, setHudHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    // belka wraca tylko, gdy to gracz przewija w górę (nie przy automatycznym przewijaniu
    // ani przy skróceniu strony po zwinięciu walki)
    let userAt = 0;
    const markUser = () => {
      userAt = Date.now();
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = hudRef.current?.offsetHeight ?? 100;
        const byUser = Date.now() - userAt < 900;
        if (y < h) setHudHidden(false);
        else if (y > last + 8) setHudHidden(true);
        else if (y < last - 8 && byUser) setHudHidden(false);
        if (Math.abs(y - last) > 8 || y < h) last = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchmove', markUser, { passive: true });
    window.addEventListener('wheel', markUser, { passive: true });
    window.addEventListener('keydown', markUser);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchmove', markUser);
      window.removeEventListener('wheel', markUser);
      window.removeEventListener('keydown', markUser);
      cancelAnimationFrame(raf);
    };
  }, []);
  useLayoutEffect(() => {
    const el = hudRef.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty('--hud-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // miganie budżetu przy zmianie
  const hold = useHudHold();
  const shownMoney = g.money - (hold?.earned ?? 0);
  const prevMoney = useRef(shownMoney);
  const [moneyFlash, setMoneyFlash] = useState<{ dir: 'up' | 'down'; n: number } | null>(null);
  // krótka zwłoka: gdy wynik walki jest jeszcze ukryty, kwota na chwilę skacze tam i z powrotem
  const latestMoney = useRef(shownMoney);
  latestMoney.current = shownMoney;
  useEffect(() => {
    const t = setTimeout(() => {
      const cur = latestMoney.current;
      if (cur === prevMoney.current) return;
      setMoneyFlash((f) => ({ dir: cur > prevMoney.current ? 'up' : 'down', n: (f?.n ?? 0) + 1 }));
      prevMoney.current = cur;
    }, 80);
    return () => clearTimeout(t);
  }, [shownMoney]);
  const rec = shownRecord(g, hold);
  const amateur = !g.proDebut;
  const medals = g.medals.gold + g.medals.silver + g.medals.bronze;

  return (
    <>
      <header className={`hud ${hudHidden && !sheet ? 'hud-hidden' : ''}`} ref={hudRef}>
        <div className="hud-inner">
          <div className="hud-top">
            <button className="hud-who" onClick={() => setSheet('skills')} aria-label="Zawodnik: umiejętności i klub">
              <span className="ovr" title="Ogólna ocena zawodnika: średnia umiejętności, 0–99">
                <span className="num">{ovr(g.stats)}</span>
                <small>OVR</small>
              </span>
              <span className="hud-name">
                <strong className="full">{displayName(g)}</strong>
                <strong className="short">{shortName(g)}</strong>
                <span>
                  Rok {g.season} · {careerLine(g)}
                  {g.quick ? ' · szybka' : ''}
                </span>
              </span>
            </button>
            <img className="hud-logo" src={GG.icon} alt="Ground Game" />
            <button className="icon-btn" aria-label="Menu gry" onClick={() => setSheet('menu')}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="hud-stats">
            <div className="hs" title="Pieniądze na koncie">
              <small>Budżet</small>
              <b key={moneyFlash?.n ?? 0} className={`${shownMoney < 0 ? 'neg' : ''} ${moneyFlash ? `flash-${moneyFlash.dir}` : ''}`}>
                <Icon name="coins" size={14} />
                {moneyShort(shownMoney)}
                <i>zł</i>
              </b>
            </div>
            <button className="hs" onClick={() => setSheet('history')} title={amateur ? 'Rekord amatorski: wygrane-porażki-remisy' : 'Rekord zawodowy: wygrane-porażki-remisy'}>
              <small>
                Rekord{amateur && <span className="am-suffix"> am.</span>}
              </small>
              <b>
                <Icon name="glove" size={14} />
                {recStr(rec)}
              </b>
            </button>
            {g.tier === 0 && g.contract.kind !== 'freak' ? (
              <button className="hs" onClick={() => setSheet('ranking')} title="Medale: złote · srebrne · brązowe">
                <small>Medale</small>
                <b>
                  <Icon name="medal" size={14} />
                  {medals ? `${g.medals.gold}·${g.medals.silver}·${g.medals.bronze}` : '0'}
                </b>
              </button>
            ) : (
              <button className="hs" onClick={() => setSheet('ranking')} title="Miejsce w rankingu federacji">
                <small>Ranking</small>
                <b>
                  <Icon name="trophy" size={14} />
                  {g.rank === 0 ? 'pas' : g.rank === null ? '–' : `#${g.rank}`}
                </b>
              </button>
            )}
            <button className="hs" onClick={() => setSheet('peers')} title={`Wiek zawodnika i zużycie organizmu (${Math.round(g.wear)}/100). Dotknij, żeby zobaczyć swój rocznik`}>
              <small>Wiek</small>
              <b>
                <Icon name="hourglass" size={14} />
                {g.age}
              </b>
              <WearMini wear={g.wear} />
            </button>
          </div>
        </div>
        {g.phase !== 'ended' && (
          <div className="hud-progress" role="progressbar" aria-valuemin={1} aria-valuemax={PHASES.length} aria-valuenow={phaseIdx + 1} aria-label={`Etap roku: ${PHASE_LABEL[g.phase]}`}>
            <i style={{ width: `${((phaseIdx + 1) / PHASES.length) * 100}%` }} />
          </div>
        )}
      </header>


      <div className={`layout ${g.phase === 'ended' ? 'solo' : ''}`}>
        {g.phase !== 'ended' && (
          <aside className="sidebar">
            <SkillsPanel g={g} />
            <CareerPanel g={g} onRanking={() => setSheet('ranking')} />
            <ClubPanel g={g} />
            <div className="row wrap" style={{ gap: 6 }}>
              <button className="btn btn-ghost btn-small btn-ico" onClick={() => setSheet('history')}>
                <Icon name="list" size={15} />
                Historia walk
              </button>
              <button className="btn btn-ghost btn-small btn-ico" onClick={() => setSheet('peers')}>
                <Icon name="users" size={15} />
                Rocznik
              </button>
            </div>
          </aside>
        )}
        <div className="main">
          {g.phase === 'training' && <Training game={g} setGame={setGame} />}
          {g.phase === 'budget' && <Budget game={g} setGame={setGame} />}
          {g.phase === 'event' && <EventStep game={g} setGame={setGame} />}
          {g.phase === 'season' && <Season game={g} setGame={setGame} />}
          {g.phase === 'summary' && <Summary game={g} setGame={setGame} onPeers={() => setSheet('peers')} />}
          {g.phase === 'market' && <Market game={g} setGame={setGame} />}
          {g.phase === 'ended' && <Ended game={g} onNewCareer={onNewCareer} onMenu={onMenu} />}
        </div>
      </div>

      {tut && <Tutorial onDone={() => setTut(false)} />}
      {sheet && (
        <div className="sheet-backdrop" onClick={() => setSheet(null)}>
          <div className="sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            {sheet === 'menu' && (
              <>
                <SheetHead title="Menu" onClose={() => setSheet(null)} />
                <div className="menu-list">
                  <button className="btn btn-ghost btn-block btn-ico" onClick={() => setSheet('skills')}>
                    <Icon name="user" />
                    Umiejętności i klub
                  </button>
                  <button className="btn btn-ghost btn-block btn-ico" onClick={() => setSheet('ranking')}>
                    <Icon name={g.tier === 0 ? 'medal' : 'trophy'} />
                    {g.tier === 0 ? 'Medale i warunki debiutu' : 'Ranking'}
                  </button>
                  <button className="btn btn-ghost btn-block btn-ico" onClick={() => setSheet('history')}>
                    <Icon name="list" />
                    Historia walk
                  </button>
                  <button className="btn btn-ghost btn-block btn-ico" onClick={() => setSheet('peers')}>
                    <Icon name="users" />
                    Twój rocznik
                  </button>
                  <button className="btn btn-ghost btn-block btn-ico" onClick={() => setSheet('goals')}>
                    <Icon name="target" />
                    Cele dnia i wyzwanie tygodnia
                  </button>
                  <SoundToggle />
                  <TextSize />
                  <button
                    className="btn btn-ghost btn-block btn-ico"
                    onClick={() => {
                      setSheet(null);
                      setTut(true);
                    }}
                  >
                    <Icon name="help" />
                    Jak grać
                  </button>
                  <button className="btn btn-ghost btn-block btn-ico" onClick={onMenu}>
                    <Icon name="door" />
                    Wyjdź do menu głównego
                  </button>
                  <p className="muted small">Gra zapisuje się sama po każdym kroku.</p>
                </div>
              </>
            )}
            {sheet === 'skills' && (
              <>
                <SheetHead title="Zawodnik" onClose={() => setSheet(null)} />
                <SkillsPanel g={g} plain />
                <ClubPanel g={g} plain />
              </>
            )}
            {sheet === 'history' && <HistorySheet g={g} onClose={() => setSheet(null)} />}
            {sheet === 'peers' && <PeersSheet g={g} onClose={() => setSheet(null)} />}
            {sheet === 'goals' && <GoalsSheet g={g} onClose={() => setSheet(null)} />}
            {sheet === 'ranking' && <RankingSheet g={g} onClose={() => setSheet(null)} />}
          </div>
        </div>
      )}
    </>
  );
}

function SoundToggle() {
  const [on, setOn] = useState(() => loadSettings().sound);
  return (
    <button
      className="btn btn-ghost btn-block btn-ico"
      role="switch"
      aria-checked={on}
      onClick={() => {
        const st = loadSettings();
        saveSettings({ ...st, sound: !on });
        setOn(!on);
        if (!on) {
          unlockAudio();
          sfxClick();
        }
      }}
    >
      <Icon name={on ? 'volume' : 'mute'} />
      Dźwięki: {on ? 'włączone' : 'wyłączone'}
    </button>
  );
}

export function SheetHead({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="sheet-head">
      <h2>{title}</h2>
      <button className="icon-btn" aria-label="Zamknij" onClick={onClose}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function SkillsPanel({ g, plain }: { g: GameState; plain?: boolean }) {
  return (
    <section className={plain ? 'plain-block' : 'panel'}>
      <div className="panel-title">
        <span className="pt-ico">
          <Icon name="dumbbell" size={15} />
          Umiejętności
        </span>
        <span className="faint">0–99</span>
      </div>
      {STAT_KEYS.map((k) => {
        const gain = g.lastGains[k] ?? 0;
        return (
          <div className="stat-row" key={k} title={STAT_DESC[k]}>
            <span className="stat-name">
              <Icon name={STAT_ICON[k]} size={14} />
              {STAT_LABELS[k]}
            </span>
            <div className="bar">
              <i style={{ width: `${g.stats[k]}%` }} />
            </div>
            <b>
              {g.stats[k]}
              {gain > 0 && g.phase !== 'training' ? <small className="gain-mini">+{gain}</small> : null}
            </b>
          </div>
        );
      })}
      {g.injury && <p className="tag bad" style={{ marginTop: 10 }}><Icon name="bandage" size={13} />Kontuzja: {g.injury.name}, testy −{g.injury.penalty} pkt</p>}
      <PredictNote g={g} />
      <WearBar wear={g.wear} />
      <div className="kv-grid">
        <span>Waga</span>
        <b>{WEIGHTS[g.profile.weight ?? 'polsrednia'].label}</b>
        <span>Styl</span>
        <b>{STYLE_LABELS[g.profile.style]}</b>
        <span>Media / reputacja</span>
        <b>
          {g.media} / {g.rep}
        </b>
        <span>Start</span>
        <b>{START_PROFILES[g.profile.start].label}</b>
        <span>Skąd</span>
        <b>{g.profile.hometown}</b>
        <span>Zarobione</span>
        <b>{money(g.totalEarned)}</b>
        {g.profile.difficulty === 'hard' && (
          <>
            <span>Poziom</span>
            <b>{DIFFICULTY.hard.label}</b>
          </>
        )}
        {g.mode === 'daily' && (
          <>
            <span>Tryb</span>
            <b>Kariera dnia</b>
          </>
        )}
      </div>
    </section>
  );
}

function ClubPanel({ g, plain }: { g: GameState; plain?: boolean }) {
  return (
    <section className={plain ? 'plain-block' : 'panel'}>
      <div className="panel-title">
        <span className="pt-ico">
          <Icon name="home" size={15} />
          Klub
        </span>
        <span className="tag">poziom {g.club.quality} z 5</span>
      </div>
      <div className="club-row">
        <Emblem spec={clubCrest(g.club)} size={46} title={g.club.name} />
        <div>
          <h3 className="panel-h">{g.club.name}</h3>
          <p className="muted small">
            {g.club.city} · specjalność: {STAT_LABELS[g.club.specialty].toLowerCase()}
          </p>
        </div>
      </div>
      {g.sponsors.length > 0 && (
        <div className="sponsor-list">
          <small className="faint pt-ico">
            <Icon name="briefcase" size={13} />
            Sponsorzy
          </small>
          {g.sponsors.map((sp) => (
            <div key={sp.id} className="sponsor-item">
              <SponsorLogo name={sp.name} size={30} />
              <div>
                <b>{sp.name}</b>
                <small>{sp.clause}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function CareerPanel({ g, onRanking }: { g: GameState; onRanking?: () => void }) {
  if (g.tier === 0 && g.contract.kind !== 'freak') {
    const div = amateurDivision(g.age, g.amRecord.w + g.amRecord.l + g.amRecord.d);
    const d = debutCheck(g);
    const ts = g.run?.tourneys;
    return (
      <section className="panel">
        <div className="panel-title">
          <span className="pt-ico">
            <Icon name="medal" size={15} />
            Amatorka
          </span>
          <span className="tag">{div}</span>
        </div>
        <div className="kv-grid">
          <span>Rekord amatorski</span>
          <b>{recStr(g.amRecord)}</b>
          <span>Medale</span>
          <b>
            <span className="medal-row">
              <Medal kind="gold" size={13} /> {g.medals.gold}
              <Medal kind="silver" size={13} /> {g.medals.silver}
              <Medal kind="bronze" size={13} /> {g.medals.bronze}
            </span>
          </b>
        </div>
        {ts && (
          <div className="tourney-list">
            {(g.phase === 'summary' || g.phase === 'market') && <small className="faint">Ostatni rok</small>}
            {ts.map((t) => (
              <div key={t.name} className="tourney-item">
                <span>{t.name.replace(' MMA', '')}</span>
                <b className={t.medal ? 'tone-purple' : ''}>{tourneyResultText(t, true)}</b>
              </div>
            ))}
          </div>
        )}
        <p className="muted small" style={{ marginTop: 10 }}>
          {d.ok
            ? g.phase === 'market'
              ? 'Możesz przejść na zawodowstwo. Oferta czeka w kontraktach.'
              : 'Możesz już przejść na zawodowstwo. Oferta pojawi się w kontraktach na koniec roku.'
            : `Warunek debiutu zawodowego: ${d.reason}.`}
        </p>
      </section>
    );
  }
  const rows = rankingTable(g).filter((r) => r.rank <= 3 || r.me);
  return (
    <section className="panel">
      <div className="panel-title">
        <span className="fed-row">
          <Emblem spec={crestFor(g.contract.kind === 'freak' ? g.contract.fed : g.fed)} size={28} title={g.fed} />
          <span>
            {g.contract.kind === 'freak' ? 'Freak fighty' : TIER_NAMES[g.tier]}
            <small className="fed-name">{g.contract.kind === 'freak' ? g.contract.fed : g.fed}</small>
          </span>
        </span>
        <span className="tag">{rankStr(g.rank)}</span>
      </div>
      {g.contract.kind !== 'freak' && (
        <div className="rank-list">
          {rows.map((r) => (
            <div key={r.rank} className={`rank-item ${r.me ? 'me' : ''}`}>
              <span className="pos">{r.rank === 0 ? 'M' : r.rank}</span>
              <span>
                {r.flag} {r.name}
                {r.peer && <small>z twojego rocznika</small>}
                {r.me && r.rank === 0 && <small>obrony pasa: {g.titleDefenses}</small>}
              </span>
              <span className="num">{r.record}</span>
            </div>
          ))}
          {g.rank === null && (
            <div className="rank-item me">
              <span className="pos">–</span>
              <span>
                {g.profile.lastName}
                <small>poza rankingiem</small>
              </span>
              <span className="num">{recStr(g.record)}</span>
            </div>
          )}
        </div>
      )}
      {g.belts.length > 0 && (
        <div className="chips">
          {g.belts.map((b, i) => (
            <span key={i} className="tag gold">
              <Icon name="trophy" size={12} />
              {b.name.split(' (')[0]}
            </span>
          ))}
        </div>
      )}
      {onRanking && g.contract.kind !== 'freak' && (
        <button className="btn btn-ghost btn-small btn-ico" style={{ marginTop: 10 }} onClick={onRanking}>
          <Icon name="trophy" size={15} />
          Cały ranking
        </button>
      )}
    </section>
  );
}

const wearTone = (w: number) => (w >= 75 ? 'bad' : w >= 40 ? 'warn' : 'ok');

/** Mały pasek zużycia organizmu pod wiekiem w HUD. */
function WearMini({ wear }: { wear: number }) {
  const w = Math.max(0, Math.min(100, Math.round(wear)));
  return (
    <span className={`wear-mini ${wearTone(w)}`} aria-label={`Zużycie organizmu ${w} na 100`}>
      <i style={{ width: `${Math.max(4, w)}%` }} />
    </span>
  );
}

/** Pasek zużycia organizmu z opisem (panel zawodnika). */
function WearBar({ wear }: { wear: number }) {
  const w = Math.max(0, Math.min(100, Math.round(wear)));
  const note =
    w >= 90
      ? 'Jeszcze jedna wojna i lekarze nie dadzą zgody na walki.'
      : w >= 75
        ? 'Lekarze patrzą na ciebie coraz krzywiej. Przy 100 koniec kariery.'
        : w >= 40
          ? 'Szczęka już nie ta co kiedyś. Przy 100 lekarze kończą karierę.'
          : 'Organizm w dobrym stanie. Każda wojna w klatce dokłada tu punkty.';
  return (
    <div className={`wear-bar ${wearTone(w)}`}>
      <div className="wear-head">
        <span>Zużycie organizmu</span>
        <b>{w}/100</b>
      </div>
      <div className="wear-track" aria-hidden="true">
        <i style={{ width: `${w}%` }} />
        <span className="wear-mark" style={{ left: '75%' }} />
      </div>
      <small>{note}</small>
    </div>
  );
}

/** Ostrzeżenie: zawodnik jednowymiarowy jest przewidywalny dla rywali. */
function PredictNote({ g }: { g: GameState }) {
  const pr = predictability(g.stats);
  if (pr.spike < 3 || g.tier < 1) return null;
  const what = { stand: 'stójkę', wrest: 'zapasy', bjj: 'parter' }[pr.stat];
  return (
    <p className={`predict-note ${pr.spike >= 10 ? 'hot' : ''}`}>
      <Icon name="target" size={14} />
      <span>
        Jesteś przewidywalny: rywale szykują się na twoje {what} i bronią się przed nimi lepiej. Podciągnij inne umiejętności, a twoja główna broń znowu zacznie zaskakiwać.
      </span>
    </p>
  );
}

/** Cele dnia i wyzwanie tygodnia w trakcie kariery: co już masz w tej karierze. */
function GoalsSheet({ g, onClose }: { g: GameState; onClose: () => void }) {
  const t = todaysGoals();
  const gs = loadGoals(t.day, t.week);
  const left = weekEndsIn();
  const row = (id: string, title: string, desc: string, check: (s: GameState) => boolean, doneEarlier: boolean, weekly = false) => {
    let now = false;
    try {
      now = check(g);
    } catch {
      now = false;
    }
    return (
      <li key={id} className={`${doneEarlier ? 'done' : now ? 'now' : ''} ${weekly ? 'weekly' : ''}`}>
        <span className="goal-check" aria-hidden="true">
          {doneEarlier || now ? <Icon name="check" size={14} /> : weekly ? <Icon name="star" size={13} /> : ''}
        </span>
        <div>
          <strong>{title}</strong>
          <span>{desc}</span>
        </div>
        <small>{doneEarlier ? 'zaliczone dziś' : now ? 'masz to w tej karierze, zaliczy się na koniec' : weekly ? `wyzwanie tygodnia · ${left.days} d ${left.hours} h` : 'jeszcze nie'}</small>
      </li>
    );
  };
  return (
    <>
      <SheetHead title="Cele" onClose={onClose} />
      <p className="muted" style={{ margin: '0 0 12px' }}>
        Zaliczają się, gdy skończysz karierę. Seria dni: {gs.streak}.
      </p>
      <ul className="goal-list">
        {t.daily.map((x) => row(x.id, x.title, g.quick && goalBlockedInQuick(x.id) ? `${x.desc} Nie liczy się w szybkiej karierze.` : x.desc, (st) => goalMet(x, st), gs.dailyDone.includes(x.id)))}
        {row(t.weekly.id, t.weekly.title, g.quick && goalBlockedInQuick(t.weekly.id) ? `${t.weekly.desc} Nie liczy się w szybkiej karierze.` : t.weekly.desc, (st) => goalMet(t.weekly, st), gs.weeklyDone, true)}
      </ul>
    </>
  );
}
