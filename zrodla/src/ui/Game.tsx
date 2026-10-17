import { useEffect, useState } from 'react';
import type { GameState, Phase } from '../engine/types';
import { STAT_KEYS, STAT_LABELS, STAT_DESC, START_PROFILES, STYLE_LABELS, TIER_NAMES, DIFFICULTY, WEIGHTS, amateurDivision } from '../engine/data';
import { debutCheck, displayName, mainRecord, rankStr, rankingTable, recStr, tourneyResultText } from '../engine/game';
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
import { Emblem, SponsorLogo, clubCrest, crestFor } from './Emblem';

const PHASES: Phase[] = ['training', 'budget', 'event', 'season', 'summary', 'market'];
const PHASE_LABEL: Record<Phase, string> = {
  training: 'Okres przygotowawczy',
  budget: 'Budżet',
  event: 'Przed sezonem',
  season: 'Walki',
  summary: 'Podsumowanie',
  market: 'Rynek',
  ended: 'Koniec kariery',
};

export interface StepProps {
  game: GameState;
  setGame: (s: GameState) => void;
}

type SheetName = 'menu' | 'history' | 'peers' | 'ranking' | 'skills';

export function shortName(g: GameState) {
  const p = g.profile;
  return p.nickname ? `„${p.nickname}” ${p.lastName}` : `${p.firstName} ${p.lastName}`;
}

export function careerLine(g: GameState) {
  const w = WEIGHTS[g.profile.weight ?? 'polsrednia'].label;
  if (g.contract.kind === 'freak') return `${w} · freak fighty`;
  return `${w} · ${TIER_NAMES[g.tier]}`;
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
  const g = game;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [g.phase, g.season]);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheet]);

  const phaseIdx = PHASES.indexOf(g.phase);
  const rec = mainRecord(g);
  const amateur = !g.proDebut;
  const medals = g.medals.gold + g.medals.silver + g.medals.bronze;

  return (
    <>
      <header className="hud">
        <div className="hud-inner">
          <div className="hud-top">
            <div className="ovr" title="Ogólna ocena zawodnika (średnia umiejętności)">
              <span className="num">{ovr(g.stats)}</span>
              <small>OVR</small>
            </div>
            <div className="hud-name">
              <strong className="full">{displayName(g)}</strong>
              <strong className="short">{shortName(g)}</strong>
              <span>{careerLine(g)}</span>
            </div>
            <img className="hud-logo" src={GG.icon} alt="Ground Game" />
            <button className="icon-btn" aria-label="Menu gry" onClick={() => setSheet('menu')}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="hud-chips">
            <div className="hud-chip">
              <small>Budżet</small>
              <b className={g.money < 0 ? 'neg' : ''}>{moneyShort(g.money)} zł</b>
            </div>
            <div className="hud-chip">
              <small>{amateur ? 'Rekord am.' : 'Rekord'}</small>
              <b>{recStr(rec)}</b>
            </div>
            <div className="hud-chip">
              {g.tier === 0 && g.contract.kind !== 'freak' ? (
                <>
                  <small>Medale</small>
                  <b>{medals ? `${g.medals.gold}·${g.medals.silver}·${g.medals.bronze}` : '–'}</b>
                </>
              ) : (
                <>
                  <small>Ranking</small>
                  <b>{g.rank === 0 ? 'Mistrz' : g.rank === null ? '–' : `#${g.rank}`}</b>
                </>
              )}
            </div>
            <div className="hud-chip">
              <small>Wiek</small>
              <b>{g.age}</b>
            </div>
          </div>
        </div>
      </header>

      {g.phase !== 'ended' && (
        <div className="progress-wrap">
          <div className="progress-label">
            <b>
              Sezon {g.season} · {g.year}
            </b>
            <span>{PHASE_LABEL[g.phase]}</span>
          </div>
          <div className="progress" aria-label={`Etap sezonu: ${PHASE_LABEL[g.phase]}`}>
            {PHASES.map((p, i) => (
              <span key={p} className={i < phaseIdx ? 'on' : i === phaseIdx ? 'now' : ''} />
            ))}
          </div>
        </div>
      )}

      {g.phase !== 'ended' && (
        <nav className="dock" aria-label="Informacje o zawodniku">
          <button onClick={() => setSheet('skills')}>Zawodnik</button>
          <button onClick={() => setSheet('ranking')}>{g.tier === 0 ? 'Medale' : 'Ranking'}</button>
          <button onClick={() => setSheet('history')}>Walki</button>
          <button onClick={() => setSheet('peers')}>Rocznik</button>
        </nav>
      )}

      <div className={`layout ${g.phase === 'ended' ? 'solo' : ''}`}>
        {g.phase !== 'ended' && (
          <aside className="sidebar">
            <SkillsPanel g={g} />
            <CareerPanel g={g} onRanking={() => setSheet('ranking')} />
            <ClubPanel g={g} />
            <div className="row wrap" style={{ gap: 6 }}>
              <button className="btn btn-ghost btn-small" onClick={() => setSheet('history')}>
                Historia walk
              </button>
              <button className="btn btn-ghost btn-small" onClick={() => setSheet('peers')}>
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

      {sheet && (
        <div className="sheet-backdrop" onClick={() => setSheet(null)}>
          <div className="sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            {sheet === 'menu' && (
              <>
                <SheetHead title="Menu" onClose={() => setSheet(null)} />
                <div className="menu-list">
                  <button className="btn btn-ghost btn-block" onClick={() => setSheet('skills')}>
                    Umiejętności i klub
                  </button>
                  <button className="btn btn-ghost btn-block" onClick={() => setSheet('history')}>
                    Historia walk
                  </button>
                  <button className="btn btn-ghost btn-block" onClick={() => setSheet('peers')}>
                    Twój rocznik
                  </button>
                  <button className="btn btn-ghost btn-block" onClick={onMenu}>
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
            {sheet === 'ranking' && <RankingSheet g={g} onClose={() => setSheet(null)} />}
          </div>
        </div>
      )}
    </>
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
        <span>Umiejętności</span>
        <span className="faint">0–99</span>
      </div>
      {STAT_KEYS.map((k) => {
        const gain = g.lastGains[k] ?? 0;
        return (
          <div className="stat-row" key={k} title={STAT_DESC[k]}>
            <span>{STAT_LABELS[k]}</span>
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
      {g.injury && <p className="tag bad" style={{ marginTop: 10 }}>Kontuzja: {g.injury.name}, testy −{g.injury.penalty} pkt</p>}
      {g.wear >= 40 && (
        <p className="muted small" style={{ marginTop: 8 }}>
          Zużycie organizmu {Math.round(g.wear)}/100. {g.wear >= 75 ? 'Lekarze patrzą na ciebie coraz krzywiej.' : 'Szczęka już nie ta co kiedyś.'}
        </p>
      )}
      <div className="kv-grid">
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
        <span>Klub</span>
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
          <small className="faint">Sponsorzy</small>
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
          <span>Amatorka</span>
          <span className="tag">{div}</span>
        </div>
        <div className="kv-grid">
          <span>Rekord amatorski</span>
          <b>{recStr(g.amRecord)}</b>
          <span>Medale</span>
          <b>
            🥇 {g.medals.gold} · 🥈 {g.medals.silver} · 🥉 {g.medals.bronze}
          </b>
        </div>
        {ts && (
          <div className="tourney-list">
            {(g.phase === 'summary' || g.phase === 'market') && <small className="faint">Ostatni sezon</small>}
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
              ? 'Możesz przejść na zawodowstwo. Oferta jest na rynku.'
              : 'Możesz już przejść na zawodowstwo. Oferta pojawi się na rynku po sezonie.'
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
              🏆 {b.name.split(' (')[0]}
            </span>
          ))}
        </div>
      )}
      {onRanking && g.contract.kind !== 'freak' && (
        <button className="btn btn-ghost btn-small" style={{ marginTop: 10 }} onClick={onRanking}>
          Cały ranking
        </button>
      )}
    </section>
  );
}
