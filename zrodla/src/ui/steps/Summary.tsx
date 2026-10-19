import { careerMarks, champTitle } from '../titles';
import { toMarket, divisionKey, isDoubleChamp } from '../../engine/game';
import { START_PROFILES } from '../../engine/data';
import { fmtFans, followersOf } from '../../engine/extras';
import { moneyShort, signed } from '../../format';
import type { StepProps } from '../Game';
import CareerChart from '../CareerChart';
import { PeersTable } from '../Sheets';
import { Belt, Confetti, CountUp, Fighter, Medal } from '../Art';
import { clubCrest } from '../Emblem';
import { clubLogo, fedLogo } from '../logos';
import hallBg from '../../assets/bg/menu.webp';
import { Icon } from '../Icon';
import { CoachTip } from '../Tutorial';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { drawPhoto, photoInfo } from '../photo';

const signedMoney = (n: number) => `${n >= 0 ? '+' : '−'}${moneyShort(Math.abs(n))}`;

export default function Summary({ game, setGame, onPeers }: StepProps & { onPeers: () => void }) {
  const g = game;
  const s = g.lastSummary!;
  const gradeTone =
    s.beltWon || s.grade === 'Rok wybitny' || s.grade === 'Sezon wybitny' ? 'gold' : s.grade === 'Udany rok' || s.grade === 'Udany sezon' ? 'good' : s.grade === 'Katastrofa' || s.grade === 'Rok do zapomnienia' || s.grade === 'Sezon do zapomnienia' ? 'bad' : '';
  const activePeers = g.peers.filter((p) => !p.retired);
  const amateur = s.tier === 0;
  // rok freak fightów: logo federacji z kontraktu, nie sportowej
  const sumFed = g.contract.kind === 'freak' && s.season === g.season ? g.contract.fed : s.fed;
  const medals = amateur ? (g.run?.tourneys ?? []).map((t) => t.medal).filter((m): m is 'gold' | 'silver' | 'bronze' => !!m) : [];
  const party = s.beltWon || medals.includes('gold') || s.grade === 'Rok wybitny' || s.grade === 'Sezon wybitny';
  const artRef = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState(false);

  return (
    <section className="step summary-step">
      <div className={`sum-hero ${gradeTone}`}>
        <img className="sum-bg" src={hallBg} alt="" aria-hidden="true" />
        {clubLogo(g.club?.name) && <img className="sum-crest" src={clubLogo(g.club?.name)!} alt="" aria-hidden="true" />}
        {party && <Confetti />}
        <div className="sum-art" ref={artRef}>
          <Fighter weight={divisionKey(g)} age={g.age} country={g.profile.origin} marks={careerMarks(g)} seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={112} belt={s.champion && !amateur ? s.tier : false} hurt={gradeTone === 'bad'} />
          {(s.beltWon || medals.length > 0) && (
            <div className="sum-trophies">
              {s.beltWon && !amateur ? (isDoubleChamp(g) ? <><Belt size={78} tier={s.tier} /><Belt size={78} tier={s.tier} /></> : <Belt size={96} tier={s.tier} />) : medals.map((m, i) => <Medal key={i} kind={m} size={34} />)}
            </div>
          )}
        </div>
        <div className="sum-head">
          <div className="kicker sum-kicker">
            {!amateur && fedLogo(sumFed) && <img className="sum-fed" src={fedLogo(sumFed)!} alt="" aria-hidden="true" />}
            Rok {s.season} kariery · {s.year}
          </div>
          {champTitle(g) && !s.beltWon && <em className="champ-tag" style={{ justifySelf: 'start' }}>{champTitle(g)}</em>}
          <div className={`grade ${gradeTone}`}>{s.beltWon ? (amateur ? 'Mistrz Polski amatorów!' : isDoubleChamp(g) ? 'Podwójny mistrz!' : 'Rok z pasem!') : s.grade}</div>
          <div className="sum-rec">
            {s.w}-{s.l}
            {s.d ? `-${s.d}` : ''}
            <small>{amateur ? 'bilans amatorski' : s.rank === 0 ? 'mistrz' : s.rank === null ? 'poza rankingiem' : `ranking #${s.rank}`}</small>
          </div>
        </div>
      </div>

      <button className={`btn btn-small btn-ico photo-btn ${s.beltWon ? 'btn-gold' : 'btn-ghost'}`} onClick={() => setPhoto(true)}>
        <Icon name={s.beltWon ? 'trophy' : 'share'} size={15} />
        {photoInfo(g, s).kind === 'belt' ? 'Zdjęcie z pasem do udostępnienia' : 'Karta roku do udostępnienia'}
      </button>
      {photo && createPortal(<PhotoModal g={g} onClose={() => setPhoto(false)} svg={artRef.current?.querySelector('svg') ?? null} />, document.body)}

      <div className="tiles">
        <div className="tile">
          <small>
            <Icon name="check" size={11} />
            Wygrane
          </small>
          <b>
            <CountUp to={s.w} />
          </b>
        </div>
        <div className="tile">
          <small>
            <Icon name="trend" size={11} />
            OVR
          </small>
          <b>
            {s.ovrTo}
            {s.ovrTo !== s.ovrFrom && <i className={s.ovrTo > s.ovrFrom ? 'pos' : ''}>{signed(s.ovrTo - s.ovrFrom)}</i>}
          </b>
        </div>
        <div className="tile">
          <small>
            <Icon name="coins" size={11} />
            Zysk roku
          </small>
          <b className={s.moneyDelta >= 0 ? 'pos' : 'neg'}>
            {(() => {
              const [num, unit] = moneyShort(Math.abs(s.moneyDelta)).split(' ');
              return (
                <>
                  {s.moneyDelta >= 0 ? '+' : '−'}
                  {num}
                  <i>{unit ?? 'zł'}</i>
                </>
              );
            })()}
          </b>
        </div>
        <div className="tile">
          <small>
            <Icon name="megaphone" size={11} />
            Media
          </small>
          <b>
            <CountUp to={g.media} />
          </b>
        </div>
      </div>

      {s.legacyTo !== undefined && START_PROFILES[g.profile.start].mult !== null && (
        <div className="legacy-strip">
          <Icon name="museum" size={16} />
          <span>
            Dorobek kariery: <b>{s.legacyTo.toLocaleString('pl-PL')} pkt</b>
          </span>
          {s.legacyFrom !== undefined && s.legacyTo - s.legacyFrom !== 0 && <em className={s.legacyTo - (s.legacyFrom ?? 0) > 0 ? 'pos' : 'neg'}>{s.legacyTo - (s.legacyFrom ?? 0) > 0 ? '+' : '−'}{Math.abs(s.legacyTo - (s.legacyFrom ?? 0)).toLocaleString('pl-PL')} w tym roku</em>}
        </div>
      )}

      <CoachTip id="summary">
        Tak poszedł rok. Dotknij sekcji na dole, żeby zobaczyć szczegóły.
      </CoachTip>
      <p className="story">{s.story}</p>

      <div className="grade-bars">
        {s.bars.map((b, i) => (
          <div key={b.label} className="grade-bar">
            <div className="grade-bar-top">
              <span>{b.label}</span>
              {b.note && <span className="faint">{b.note}</span>}
            </div>
            <div className="bar">
              <i style={{ width: `${b.value}%`, animationDelay: `${i * 0.12}s` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="acc-list">
        <details className="acc">
          <summary>
            <span>
              <Icon name="dumbbell" size={15} />
              Rozwój
            </span>
            <b className={s.ovrTo > s.ovrFrom ? 'pos' : ''}>
              {s.ovrTo === s.ovrFrom ? `OVR ${s.ovrTo}, bez zmian` : `OVR ${s.ovrFrom} → ${s.ovrTo} (${signed(s.ovrTo - s.ovrFrom)})`}
            </b>
          </summary>
          <div className="acc-body">
            <p className="muted small">
              Media {g.media}/100 · reputacja {g.rep}/100 · obserwujący: {fmtFans(followersOf(g))} · forma w tym roku: {s.form.toLowerCase()}
            </p>
            {g.seasons.length >= 2 && <CareerChart g={g} />}
          </div>
        </details>
        {!amateur && s.moneyFights !== undefined && (
          <details className="acc">
            <summary>
              <span>
                <Icon name="coins" size={15} />
                Pieniądze
              </span>
              <b className={s.moneyDelta >= 0 ? 'pos' : 'neg'}>{signedMoney(s.moneyDelta)}</b>
            </summary>
            <div className="acc-body money-rows">
              <div>
                <span>Gaże i premie za walki</span>
                <b className="pos">{signedMoney(s.moneyFights)}</b>
              </div>
              <div>
                <span>Sponsorzy i social media minus koszty (klub, sztab, zaplecze, życie)</span>
                <b className={s.moneyDelta - s.moneyFights >= 0 ? 'pos' : 'neg'}>{signedMoney(s.moneyDelta - s.moneyFights)}</b>
              </div>
              <div className="sum">
                <span>Bilans roku</span>
                <b className={s.moneyDelta >= 0 ? 'pos' : 'neg'}>{signedMoney(s.moneyDelta)}</b>
              </div>
            </div>
          </details>
        )}
        {s.outside && s.outside.length > 0 && (
          <details className="acc" open>
            <summary>
              <span>
                <Icon name="star" size={15} />
                Poza klatką
              </span>
              <b>{s.outside.length}</b>
            </summary>
            <div className="acc-body outside-list">
              {s.outside.map((r, i) => (
                <div key={i} className="outside-row">
                  <Icon name={r.icon} size={14} />
                  <span>{r.label}</span>
                  <b>{r.value}</b>
                </div>
              ))}
            </div>
          </details>
        )}
        <details className="acc">
          <summary>
            <span>
              <Icon name="users" size={15} />
              Twój rocznik
            </span>
            <b>
              {activePeers.length} z {g.peers.length} walczy
            </b>
          </summary>
          <div className="acc-body">
            <PeersTable g={{ ...g, peers: activePeers.slice(0, 5) }} />
            <button className="btn btn-ghost btn-small" style={{ marginTop: 8 }} onClick={onPeers}>
              Cały rocznik
            </button>
          </div>
        </details>
      </div>

      <div className="cta-bar float" style={{ ['--d' as string]: '500ms' }}>
        <button className="btn btn-primary btn-block btn-ico" onClick={() => setGame(toMarket(g))}>
          <Icon name="briefcase" />
          Dalej: kontrakty
        </button>
      </div>
    </section>
  );
}

function PhotoModal({ g, svg, onClose }: { g: StepProps['game']; svg: SVGSVGElement | null; onClose: () => void }) {
  const s = g.lastSummary!;
  const [url, setUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    let obj: string | null = null;
    drawPhoto(g, s, svg).then((cv) =>
      cv.toBlob((b) => {
        if (!alive || !b) return;
        obj = URL.createObjectURL(b);
        setBlob(b);
        setUrl(obj);
      }, 'image/png'),
    );
    return () => {
      alive = false;
      if (obj) URL.revokeObjectURL(obj);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const info = photoInfo(g, s);
  const name = `${info.kind === 'belt' ? 'pas' : 'rok'}-${s.year}-${g.profile.lastName.toLowerCase().replace(/[^a-ząćęłńóśźż0-9]+/gi, '-')}.png`;
  const text = `${g.profile.firstName} ${g.profile.lastName}: ${info.title}, rok ${s.year} w Symulatorze Polskiego Zawodnika MMA.`;
  const share = async () => {
    if (!blob) return;
    const file = new File([blob], name, { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    try {
      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], text });
        return;
      }
      setMsg('Ta przeglądarka nie udostępnia obrazków. Pobierz kartę przyciskiem obok.');
    } catch {
      /* zamknięte okno udostępniania */
    }
  };
  return (
    <div className="fight-intro photo-modal" role="dialog" aria-modal="true" aria-label="Karta do udostępnienia" onClick={onClose}>
      <div className="fi-card" onClick={(e) => e.stopPropagation()}>
        <div className="fi-top">
          <span className="fi-num">{info.kind === 'belt' ? 'Zdjęcie z pasem' : 'Karta roku'}</span>
          <span className="fi-ctx">rok {s.year}</span>
        </div>
        <div className="photo-frame">{url ? <img src={url} alt={text} /> : <span className="muted">Robię zdjęcie…</span>}</div>
        {msg && <p className="muted small">{msg}</p>}
        <div className="photo-actions">
          <button className="btn btn-primary btn-ico" disabled={!blob} onClick={share}>
            <Icon name="share" size={15} />
            Udostępnij
          </button>
          {url ? (
            <a className="btn btn-ghost btn-ico" href={url} download={name}>
              <Icon name="download" size={15} />
              Pobierz
            </a>
          ) : (
            <button className="btn btn-ghost" disabled>
              Pobierz
            </button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
