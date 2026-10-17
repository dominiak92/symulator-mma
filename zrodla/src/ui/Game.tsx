import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { Icon, STAT_ICON } from './Icon';
import { Medal } from './Art';
import { Tutorial } from './Tutorial';
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
  }, [g.phase, g.season]);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheet]);

  const phaseIdx = PHASES.indexOf(g.phase);
  const hudRef = useRef<HTMLElement>(null);
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
  const prevMoney = useRef(g.money);
  const [moneyFlash, setMoneyFlash] = useState<{ dir: 'up' | 'down'; n: number } | null>(null);
  useEffect(() => {
    if (g.money === prevMoney.current) return;
    setMoneyFlash((f) => ({ dir: g.money > prevMoney.current ? 'up' : 'down', n: (f?.n ?? 0) + 1 }));
    prevMoney.current = g.money;
  }, [g.money]);
  const rec = mainRecord(g);
  const amateur = !g.proDebut;
  const medals = g.medals.gold + g.medals.silver + g.medals.bronze;

  return (
    <>
      <header className="hud" ref={hudRef}>
        <div className="hud-inner">
          <div className="hud-top">
            <div className="ovr" title="Ogólna ocena zawodnika: średnia umiejętności, 0–99">
              <span className="num">{ovr(g.stats)}</span>
              <small>OVR</small>
            </div>
            <div className="hud-name">
              <strong className="full">{displayName(g)}</strong>
              <strong className="short">{shortName(g)}</strong>
              <span>
                Sezon {g.season} · {careerLine(g)}
              </span>
            </div>
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
              <b key={moneyFlash?.n ?? 0} className={`${g.money < 0 ? 'neg' : ''} ${moneyFlash ? `flash-${moneyFlash.dir}` : ''}`}>
                <Icon name="coins" size={14} />
                {moneyShort(g.money)}
                <i>zł</i>
              </b>
            </div>
            <div className="hs" title={amateur ? 'Rekord amatorski: wygrane-porażki-remisy' : 'Rekord zawodowy: wygrane-porażki-remisy'}>
              <small>{amateur ? 'Rekord am.' : 'Rekord'}</small>
              <b>
                <Icon name="glove" size={14} />
                {recStr(rec)}
              </b>
            </div>
            {g.tier === 0 && g.contract.kind !== 'freak' ? (
              <div className="hs" title="Medale: złote · srebrne · brązowe">
                <small>Medale</small>
                <b>
                  <Icon name="medal" size={14} />
                  {medals ? `${g.medals.gold}·${g.medals.silver}·${g.medals.bronze}` : '0'}
                </b>
              </div>
            ) : (
              <div className="hs" title="Miejsce w rankingu federacji">
                <small>Ranking</small>
                <b>
                  <Icon name="trophy" size={14} />
                  {g.rank === 0 ? 'pas' : g.rank === null ? '–' : `#${g.rank}`}
                </b>
              </div>
            )}
            <div className="hs" title="Wiek zawodnika">
              <small>Wiek</small>
              <b>
                <Icon name="hourglass" size={14} />
                {g.age}
              </b>
            </div>
          </div>
        </div>
        {g.phase !== 'ended' && (
          <div className="hud-progress" role="progressbar" aria-valuemin={1} aria-valuemax={PHASES.length} aria-valuenow={phaseIdx + 1} aria-label={`Etap sezonu: ${PHASE_LABEL[g.phase]}`}>
            <i style={{ width: `${((phaseIdx + 1) / PHASES.length) * 100}%` }} />
          </div>
        )}
      </header>

      {g.phase !== 'ended' && (
        <nav className="dock" aria-label="Informacje o zawodniku">
          <button onClick={() => setSheet('skills')}>
            <Icon name="user" size={16} />
            Zawodnik
          </button>
          <button onClick={() => setSheet('ranking')}>
            <Icon name={g.tier === 0 ? 'medal' : 'trophy'} size={16} />
            {g.tier === 0 ? 'Medale' : 'Ranking'}
          </button>
          <button onClick={() => setSheet('history')}>
            <Icon name="list" size={16} />
            Walki
          </button>
          <button onClick={() => setSheet('peers')}>
            <Icon name="users" size={16} />
            Rocznik
          </button>
        </nav>
      )}

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
                  <button className="btn btn-ghost btn-block btn-ico" onClick={() => setSheet('history')}>
                    <Icon name="list" />
                    Historia walk
                  </button>
                  <button className="btn btn-ghost btn-block btn-ico" onClick={() => setSheet('peers')}>
                    <Icon name="users" />
                    Twój rocznik
                  </button>
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
      {g.wear >= 40 && (
        <p className="muted small" style={{ marginTop: 8 }}>
          Zużycie organizmu {Math.round(g.wear)}/100. {g.wear >= 75 ? 'Lekarze patrzą na ciebie coraz krzywiej.' : 'Szczęka już nie ta co kiedyś.'}
        </p>
      )}
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
