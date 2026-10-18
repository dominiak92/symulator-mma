import type { GameState, HistoryEntry, Peer } from '../engine/types';
import { fedLogo } from './logos';
import { STAGE_LABELS, TIER_NAMES } from '../engine/data';
import { METHOD_SHORT, rankingTable, recStr } from '../engine/game';
import { ovr } from '../engine/fighter';
import { lat, money, plural } from '../format';
import { CareerPanel, SheetHead } from './Game';
import { Icon } from './Icon';
import { Fighter } from './FighterArt';
import { NAMES_EU, NAMES_WORLD } from '../engine/data';

const FLAG_COUNTRY: Record<string, string> = Object.fromEntries([...NAMES_EU, ...NAMES_WORLD].map((p) => [p.flag, p.country]));
/** Twarz zawodnika z historii: to samo ziarno co na plakacie (imię+nazwisko bez spacji). */
function Face({ name, flag, age, size = 36 }: { name: string; flag?: string; age?: number; size?: number }) {
  const sp = name.indexOf(' ');
  const seed = sp > 0 ? name.slice(0, sp) + name.slice(sp + 1) : name;
  return (
    <span className="frow-av" aria-hidden="true" style={{ width: size, height: size }}>
      <Fighter head seed={seed} age={age} country={flag ? FLAG_COUNTRY[flag] : undefined} size={size} />
    </span>
  );
}

export function methodParts(h: { method: string; round: number; time?: string; detail: string }): [string, string] {
  const m = METHOD_SHORT[h.method] ?? h.method;
  if (h.method === 'KO/TKO' || h.method === 'Poddanie' || h.method === 'Lekarz')
    return [`${m}${h.detail && h.method !== 'Lekarz' ? ` (${h.detail})` : ''}`, `R${h.round}${h.time ? ` ${h.time}` : ''}`];
  if (h.method === 'Walkower') return ['walkower', ''];
  return [m, h.detail];
}

export function methodLine(h: { method: string; round: number; time?: string; detail: string }) {
  const [a, b] = methodParts(h);
  return b ? `${a} · ${b}` : a;
}

/** Fragmenty rozdzielone „·”, każdy w jednym kawałku: łamanie tylko między nimi. */
export function Segs({ parts }: { parts: (string | false | null | undefined)[] }) {
  const p = parts.filter(Boolean) as string[];
  return (
    <>
      {p.map((x, i) => (
        <span key={i}>
          <span className="nowrap">{x}</span>
          {i < p.length - 1 ? ' · ' : ''}
        </span>
      ))}
    </>
  );
}

export function MethodText({ h, lead }: { h: { method: string; round: number; time?: string; detail: string }; lead?: string }) {
  const [a, b] = methodParts(h);
  const paren = a.indexOf(' (');
  const name = paren > 0 ? a.slice(0, paren) : a;
  const detail = paren > 0 ? a.slice(paren + 1) : '';
  return (
    <>
      {lead && (
        <>
          <span className="nowrap">{lead}</span>
          {' · '}
        </>
      )}
      <span className="nowrap">{name}</span>
      {detail && (
        <>
          {' '}
          <span className="nowrap">{detail}</span>
        </>
      )}
      {b && (
        <>
          {' · '}
          <span className="nowrap">{b}</span>
        </>
      )}
    </>
  );
}

function HistoryRow({ h }: { h: HistoryEntry }) {
  const where = h.amateur ? `${h.stage ? STAGE_LABELS[h.stage] : 'Turniej'} · ${(h.gala ?? '').split(' · ')[0].replace(' MMA', '')}` : h.gala ?? h.fed;
  return (
    <div className="hist-row">
      <span className={`res-badge ${h.result}`}>{h.result === 'W' ? 'W' : h.result === 'L' ? 'P' : 'R'}</span>
      {!h.freak && <Face name={h.opponent} flag={h.oppFlag} age={h.age} />}
      <div className="hist-main">
        <div className="hist-opp">
          {h.oppFlag} {h.opponent}
          <span className="faint"> ({h.oppRecord})</span>
          {h.title && <span className="tag gold">pas</span>}
          {h.freak && <span className="tag">freak</span>}
          {h.peer && <span className="tag blue">z rocznika</span>}
        </div>
        <div className="hist-how">
          <MethodText h={h} />
        </div>
        <div className="hist-where">
          <Segs parts={[...where.split(' · '), lat(h.age), h.earned > 0 && money(h.earned)]} />
        </div>
      </div>
    </div>
  );
}

export function HistoryList({ g, limit }: { g: GameState; limit?: number }) {
  const rows = [...g.history].reverse().slice(0, limit ?? 999);
  if (!rows.length) return <p className="muted">Jeszcze żadnej walki. Pierwsza już w tym roku.</p>;
  return (
    <div className="hist-list">
      {rows.map((h, i) => (
        <HistoryRow key={i} h={h} />
      ))}
    </div>
  );
}

export function HistorySheet({ g, onClose }: { g: GameState; onClose: () => void }) {
  const am = g.amRecord;
  return (
    <>
      <SheetHead title="Historia walk" onClose={onClose} />
      <div className="kv-grid" style={{ marginBottom: 14 }}>
        {g.proDebut && (
          <>
            <span>Rekord zawodowy</span>
            <b>{recStr(g.record)}</b>
          </>
        )}
        <span>Rekord amatorski</span>
        <b>{recStr(am)}</b>
        <span>Wygrane przed czasem</span>
        <b>
          {g.finishes.ko} KO · {g.finishes.sub} {plural(g.finishes.sub, 'poddanie', 'poddania', 'poddań')}
        </b>
        <span>Przegrane przed czasem</span>
        <b>{g.finishes.koLosses + g.finishes.subLosses}</b>
      </div>
      <HistoryList g={g} />
    </>
  );
}

export function peerStatus(p: Peer) {
  if (p.retired) return 'zakończył karierę';
  if (p.tier === 0) return 'amatorka';
  const rk = p.rank === 0 ? 'mistrz' : p.rank === null ? 'poza rankingiem' : `${p.rank}. w rankingu`;
  return `${TIER_NAMES[p.tier]} · ${rk}`;
}

export function PeersTable({ g }: { g: GameState }) {
  const peers = [...g.peers].sort(
    (a, b) => Number(b.id === g.rivalId) - Number(a.id === g.rivalId) || Number(a.retired) - Number(b.retired) || b.tier - a.tier || ovr(b.stats) - ovr(a.stats),
  );
  return (
    <div className="peer-list">
      {peers.map((p) => (
        <div key={p.id} className={`peer-row ${p.retired ? 'retired' : ''} ${p.id === g.rivalId ? 'rival' : ''}`}>
          <Face name={`${p.firstName} ${p.lastName}`} age={g.age} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <b>
              {p.firstName} {p.lastName}
            </b>
            {p.id === g.rivalId && (
              <span className="tag red rival-tag">
                <Icon name="flame" size={11} />
                rywal
              </span>
            )}
            {p.belts > 0 && (
              <span title="pasy" className="belt-mark">
                <Icon name="trophy" size={13} />
                {p.belts > 1 ? `×${p.belts}` : ''}
              </span>
            )}
            <small>
              {peerStatus(p)} · {recStr(p.record)}
            </small>
          </div>
          <span className="peer-h2h">{p.metCount ? `${p.h2h.w}-${p.h2h.l}` : ''}</span>
        </div>
      ))}
    </div>
  );
}

export function PeersSheet({ g, onClose }: { g: GameState; onClose: () => void }) {
  return (
    <>
      <SheetHead title="Twój rocznik" onClose={onClose} />
      <p className="muted" style={{ margin: '0 0 12px' }}>
        Chłopaki, z którymi zaczynałeś na turniejach amatorskich. Część z nich spotkasz jeszcze w klatce. Liczba po prawej to wasz bilans.
      </p>
      <PeersTable g={g} />
    </>
  );
}

export function RankingSheet({ g, onClose }: { g: GameState; onClose: () => void }) {
  if (g.tier === 0 && g.contract.kind !== 'freak')
    return (
      <>
        <SheetHead title="Amatorka" onClose={onClose} />
        <p className="muted" style={{ marginBottom: 12 }}>
          W amatorce nie ma rankingu. Liczą się medale z Pucharu i Mistrzostw Polski oraz wygrane walki. Złoto Mistrzostw daje tytuł mistrza Polski amatorów.
        </p>
        <CareerPanel g={g} />
      </>
    );
  const rows = rankingTable(g);
  return (
    <>
      <SheetHead title="Ranking" onClose={onClose} />
      <p className="muted rank-fed" style={{ margin: '0 0 12px' }}>
        {fedLogo(g.fed) && <img className="fed-logo" src={fedLogo(g.fed)!} alt="" aria-hidden="true" width={40} height={40} />}
        <span>{g.fed}. Kto wygrywa, idzie w górę. Pierwsze miejsce oznacza walkę o pas.</span>
      </p>
      <div className="rank-list">
        {rows.map((r) => (
          <div key={r.rank} className={`rank-item ${r.me ? 'me' : ''}`}>
            <span className="pos">{r.rank === 0 ? 'M' : r.rank}</span>
            <span>
              {r.flag} {r.name}
              {r.rank === 0 && <small>mistrz</small>}
              {r.peer && <small>z twojego rocznika</small>}
              {r.met && !r.me && <small className="rank-met">wasz bilans {r.met}</small>}
            </span>
            <span className="num">{r.record}</span>
          </div>
        ))}
        {g.rank === null && (
          <div className="rank-item me">
            <span className="pos">–</span>
            <span>
              {g.profile.firstName} {g.profile.lastName}
              <small>poza rankingiem</small>
            </span>
            <span className="num">{recStr(g.record)}</span>
          </div>
        )}
      </div>
    </>
  );
}
