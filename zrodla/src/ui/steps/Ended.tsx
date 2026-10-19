import { FlagMark } from '../Flag';
import { afterPaths, chooseAfter } from '../../engine/game';
import { careerMarks } from '../titles';
import { useEffect, useState } from 'react';
import { honours } from '../../engine/extras';
import type { GameState, HistoryEntry } from '../../engine/types';
import { displayName, mainRecord, medalCount, recStr, divisionKey } from '../../engine/game';
import { START_PROFILES } from '../../engine/data';
import { CARD_THEMES, drawCard } from '../card';
import { loadAchievements, loadSettings, saveSettings } from '../../storage';
import { HistoryList, PeersTable } from '../Sheets';
import CareerChart from '../CareerChart';
import { lat, money } from '../../format';
import { SHOP_URL } from '../Logo';
import { GG } from '../brand';
import { ACHIEVEMENTS, achIcon } from '../../engine/achievements';
import { Confetti, Fighter } from '../Art';
import { clubCrest } from '../Emblem';
import { clubLogo } from '../logos';
import hallBg from '../../assets/bg/menu.webp';
import { Icon } from '../Icon';

export default function Ended({ game, setGame, onNewCareer, onMenu }: { game: GameState; setGame?: (s: GameState) => void; onNewCareer: () => void; onMenu: () => void }) {
  const g = game;
  const e = g.ending!;
  const [url, setUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [themeId, setThemeId] = useState(loadSettings().cardTheme);
  const have = loadAchievements();
  const theme = CARD_THEMES.find((t) => t.id === themeId && (!t.unlock || have[t.unlock])) ?? CARD_THEMES[0];

  useEffect(() => {
    let alive = true;
    let objUrl: string | null = null;
    const publish = (cv: HTMLCanvasElement) =>
      cv.toBlob((b) => {
        if (!alive || !b) return;
        objUrl = URL.createObjectURL(b);
        setBlob(b);
        setUrl(objUrl);
      }, 'image/png');
    drawCard(g, true, theme).then((cv) => {
      try {
        publish(cv);
      } catch {
        // logo z innej domeny zablokowało eksport, rysujemy bez niego
        drawCard(g, false, theme).then(publish);
      }
    });
    return () => {
      alive = false;
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [g, theme]);

  const fileName = `kariera-${g.profile.lastName.toLowerCase().replace(/[^a-ząćęłńóśźż0-9]+/gi, '-')}.png`;
  const shareText = `${displayName(g)}: ${recStr(mainRecord(g))}${g.proDebut ? '' : ' w amatorce'}, ${e.verdict}. ${e.legacy} pkt LEGACY${g.quick ? ' (szybka kariera)' : ''} w Symulatorze Polskiego Zawodnika MMA.`;

  const share = async () => {
    if (!blob) return;
    const file = new File([blob], fileName, { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    try {
      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], text: shareText });
        return;
      }
      if (nav.clipboard) {
        await nav.clipboard.writeText(shareText);
        setShareMsg('Skopiowano opis kariery do schowka. Kartę pobierzesz przyciskiem obok.');
      }
    } catch {
      /* użytkownik zamknął okno udostępniania */
    }
  };

  const unranked = START_PROFILES[g.profile.start].mult === null;

  return (
    <>
      <section className="step summary-step">
        <div className={`sum-hero ${g.belts.length ? 'gold' : ''}`}>
          <img className="sum-bg" src={hallBg} alt="" aria-hidden="true" />
          {clubLogo(g.club?.name) && <img className="sum-crest" src={clubLogo(g.club?.name)!} alt="" aria-hidden="true" />}
          {g.belts.length > 0 && <Confetti />}
          <div className="sum-art">
            <Fighter weight={divisionKey(g)} age={g.age} country={g.profile.origin} marks={careerMarks(g)} seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={112} belt={g.belts.length > 0 ? g.tier : false} />
          </div>
          <div className="sum-head">
            <div className="kicker">Koniec {g.quick ? 'szybkiej ' : ''}kariery · {lat(g.age)}</div>
            <h2 className="verdict-big">{e.verdict}</h2>
            <div className="sum-rec">
              {recStr(mainRecord(g))}
              <small>{g.proDebut ? 'rekord zawodowy' : 'rekord amatorski'}</small>
            </div>
          </div>
        </div>
        <p className="muted">{e.reason}</p>
        {e.top && !unranked && (
          <div className="top-exit">
            <div className="top-exit-head">
              <Icon name="trophy" size={16} />
              <b>{e.top.title}</b>
              <span>+{e.top.pts} LEGACY</span>
            </div>
            <ul>
              {e.top.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="lead" style={{ marginTop: 6 }}>
          {e.verdictDesc}
        </p>
        <div className="stats-strip" style={{ marginTop: 16 }}>
          <div>
            <small>{g.proDebut ? 'Rekord zawodowy' : 'Rekord amatorski'}</small>
            <b>{recStr(mainRecord(g))}</b>
          </div>
          <div>
            <small>Przed czasem</small>
            <b>
              {g.finishes.ko} KO · {g.finishes.sub} pod.
            </b>
          </div>
          <div>
            <small>Tytuły i medale</small>
            <b>
              {g.belts.length} · {medalCount(g)}
            </b>
          </div>
          <div>
            <small>LEGACY</small>
            <b style={{ color: 'var(--gold)' }}>{unranked ? 'nie liczy się' : e.legacy}</b>
          </div>
        </div>
        {(honours(g).length > 0 || g.fanNick) && (
          <div className="honours">
            {g.fanNick && (
              <span className="tag purple">
                <Icon name="megaphone" size={12} />
                kibice mówili: „{g.fanNick}”
              </span>
            )}
            {honours(g).map((h) => (
              <span key={h.text} className={`tag ${h.icon === 'x' ? 'bad' : h.icon === 'trophy' ? 'gold' : ''}`}>
                <Icon name={h.icon} size={12} />
                {h.text}
              </span>
            ))}
            {g.finishes.koLosses >= 3 && (
              <span className="tag bad">
                <Icon name="bandage" size={12} />
                {g.finishes.koLosses} przyjęte nokauty
              </span>
            )}
          </div>
        )}
      </section>

      <AfterCareer g={g} setGame={setGame} />

      {g.seasons.length >= 2 && (
        <section className="step">
          <h3>Wykres kariery</h3>
          <div style={{ marginTop: 10 }}>
            <CareerChart g={g} full />
          </div>
        </section>
      )}

      <CareerNumbers g={g} />

      <section className="step">
        <div className="end-grid">
          <div>
            {url ? <img className="card-preview" src={url} alt={`Karta kariery: ${shareText}`} /> : <p className="muted">Rysuję kartę…</p>}
          </div>
          <div>
            <h3>Karta kariery</h3>
            <p className="muted" style={{ marginTop: 6 }}>
              Pobierz ją albo wyślij znajomym. Możesz też wpisać ich nazwiska w nowej karierze i zobaczyć, jak by im poszło.
            </p>
            <div className="panel-title" style={{ marginTop: 14 }}>
              Motyw karty
            </div>
            <div className="chips" role="radiogroup" aria-label="Motyw karty">
              {CARD_THEMES.map((t) => {
                const locked = !!t.unlock && !have[t.unlock];
                return (
                  <button
                    key={t.id}
                    role="radio"
                    aria-checked={theme.id === t.id}
                    disabled={locked}
                    title={locked ? `Odblokujesz: ${t.unlockText}` : t.name}
                    className={`theme-chip ${theme.id === t.id ? 'on' : ''}`}
                    onClick={() => {
                      setThemeId(t.id);
                      saveSettings({ ...loadSettings(), cardTheme: t.id });
                    }}
                  >
                    <i style={{ background: `linear-gradient(90deg, ${t.stripe} 0 30%, ${t.accent} 30% 65%, ${t.bg} 65%)` }} />
                    {locked ? `🔒 ${t.name}` : t.name}
                  </button>
                );
              })}
            </div>
            <div className="menu-list">
              {url && (
                <a className="btn btn-primary btn-block btn-ico" href={url} download={fileName} style={{ textAlign: 'center', textDecoration: 'none' }}>
                  <Icon name="download" />
                  Pobierz kartę (PNG)
                </a>
              )}
              <button className="btn btn-ghost btn-block btn-ico" onClick={share} disabled={!blob}>
                <Icon name="share" />
                Udostępnij
              </button>
              {shareMsg && <p className="muted" style={{ fontSize: '0.9rem' }}>{shareMsg}</p>}
              {g.mode === 'normal' && (
                <button className="btn btn-gold btn-block btn-ico" onClick={onNewCareer}>
                  <Icon name="rotate" />
                  Nowa kariera w tym slocie
                </button>
              )}
              <button className="btn btn-ghost btn-block btn-ico" onClick={onMenu}>
                <Icon name="home" />
                Menu główne
              </button>
            </div>
            <div className="kv" style={{ marginTop: 16 }}>
              <span>Zarobione w karierze</span>
              <b>{money(g.totalEarned)}</b>
            </div>
            <div className="kv">
              <span>Lata kariery</span>
              <b>{g.seasons.length}</b>
            </div>
          </div>
        </div>
      </section>

      {(() => {
        const got = ACHIEVEMENTS.filter((a) => a.check(g) && !(g.quick && (a.id === 'medal' || a.id === 'belt0')));
        if (!got.length) return null;
        return (
          <section className="step">
            <h3>Osiągnięcia tej kariery</h3>
            <div className="chips">
              {got.map((a) => (
                <span key={a.id} className={`tag ach-chip tone-${achIcon(a.id).tone}`} title={a.desc}>
                  <Icon name={achIcon(a.id).icon} size={13} />
                  {a.title}
                </span>
              ))}
            </div>
          </section>
        );
      })()}

      <a className="shop-link" style={{ marginTop: 12 }} href={`${SHOP_URL}koniec_kariery`} target="_blank" rel="noopener">
        <img className="shop-logo" src={GG.stacked} alt="" aria-hidden="true" />
        <div className="shop-text">
          <strong>A ty trenujesz na serio?</strong>
          <small>Rashguardy, spodenki i rękawice od Ground Game. Sprawdź nowości w sklepie.</small>
        </div>
        <span className="btn btn-primary btn-small">groundgame.com</span>
      </a>


      <section className="step">
        <h3>Najważniejsze chwile</h3>
        <ul className="timeline" style={{ marginTop: 10 }}>
          {g.timeline.filter((t) => !/^(Zmiana klubu|Obóz:|Rywal \S+: (awans|spadek))/.test(t.text)).map((t, i) => (
            <li key={i}>
              <span>{lat(t.age)}</span>
              <div>{t.text}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="step">
        <h3>Rocznik</h3>
        <div style={{ marginTop: 10 }}>
          <PeersTable g={g} />
        </div>
      </section>

      <section className="step">
        <details>
          <summary className="details-summary">
            <h3 style={{ display: 'inline' }}>Wszystkie walki ({g.history.length})</h3>
          </summary>
          <div style={{ marginTop: 10 }}>
            <HistoryList g={g} />
          </div>
        </details>
      </section>
      <p className="footer" style={{ marginTop: 16 }}>
        Wszystkie postacie, nazwiska, kluby, gale, federacje i sponsorzy w grze są fikcyjne. Podobieństwo do prawdziwych osób i firm jest przypadkowe. Prawdziwa jest tylko marka Ground Game.
      </p>
    </>
  );
}

/** Kariera w liczbach: najlepsza i najgorsza walka, rekordy i podział zwycięstw. */
function CareerNumbers({ g }: { g: GameState }) {
  const pro = g.history.filter((h) => !h.amateur);
  const pool = pro.length >= 3 ? pro : g.history;
  if (pool.length < 2) return null;
  const rankPts = (h: HistoryEntry) => (h.oppRank === null ? 0 : h.oppRank === 0 ? 14 : Math.max(0, 12 - h.oppRank));
  const fin = (h: HistoryEntry) => h.method === 'KO/TKO' || h.method === 'Poddanie';
  const best = pool
    .filter((h) => h.result === 'W')
    .map((h) => ({ h, sc: (h.title ? 40 : 0) + h.tier * 12 + rankPts(h) + (fin(h) ? 6 : 0) + (fin(h) && h.round === 1 ? 3 : 0) + (h.freak ? -15 : 0) }))
    .sort((a, b) => b.sc - a.sc)[0]?.h;
  const worst = pool
    .filter((h) => h.result === 'L')
    .map((h) => ({ h, sc: (h.oppRank === null ? 14 : 12 - Math.min(12, h.oppRank)) + (h.method === 'KO/TKO' ? 8 : fin(h) ? 5 : 0) + h.tier * 3 + (h.freak ? 10 : 0) + (h.title ? -6 : 0) }))
    .sort((a, b) => b.sc - a.sc)[0]?.h;
  const wins = pool.filter((h) => h.result === 'W');
  const ko = wins.filter((h) => h.method === 'KO/TKO').length;
  const sub = wins.filter((h) => h.method === 'Poddanie').length;
  const dec = wins.length - ko - sub;
  const bySeason = new Map<number, number>();
  for (const h of g.history) bySeason.set(h.season, (bySeason.get(h.season) ?? 0) + (h.earned ?? 0));
  const bestYear = [...bySeason.entries()].sort((a, b) => b[1] - a[1])[0];
  const by = bestYear ? g.seasons.find((s) => s.season === bestYear[0]) : undefined;
  const fastest = wins.filter((h) => fin(h) && h.time).sort((a, b) => a.round - b.round || (a.time ?? '').localeCompare(b.time ?? ''))[0];
  const card = (h: HistoryEntry, kind: 'best' | 'worst') => (
    <div className={`cn-fight ${kind}`}>
      <span className="cn-kicker">
        <Icon name={kind === 'best' ? 'trophy' : 'x'} size={13} />
        {kind === 'best' ? 'Najlepsza walka' : 'Najgorsza wpadka'}
      </span>
      <b>
        {kind === 'best' ? 'Wygrana z ' : 'Porażka z '}
        <FlagMark flag={h.oppFlag} />
          {h.opponent}
      </b>
      <small>
        {h.method}
        {!h.method.startsWith('Decyzja') && h.round ? `, ${h.round}. runda` : ''}
        {h.title ? ' · walka o pas' : ''}
        {h.oppRank !== null ? ` · rywal ${h.oppRank === 0 ? 'mistrz' : `nr ${h.oppRank}`}` : ''}
      </small>
      <small className="cn-when">
        {h.gala ?? h.fed} · rok {h.season} · {lat(h.age)}
      </small>
    </div>
  );
  return (
    <section className="step career-numbers">
      <h3>Kariera w liczbach</h3>
      <div className="cn-fights">
        {best && card(best, 'best')}
        {worst && card(worst, 'worst')}
      </div>
      <div className="cn-grid">
        <div>
          <small>Wygrane przez KO</small>
          <b>{ko}</b>
        </div>
        <div>
          <small>Przez poddanie</small>
          <b>{sub}</b>
        </div>
        <div>
          <small>Na punkty</small>
          <b>{dec}</b>
        </div>
        <div>
          <small>Najdłuższa seria</small>
          <b>{g.flags.bestStreak ?? 0}</b>
        </div>
        {bestYear && bestYear[1] > 0 && (
          <div>
            <small>Najlepszy rok w kasie</small>
            <b>{money(bestYear[1])}</b>
            {by && <em>rok {by.season} · {lat(by.age)}</em>}
          </div>
        )}
        {fastest && (
          <div>
            <small>Najszybsze skończenie</small>
            <b>
              {fastest.round}. runda, {fastest.time}
            </b>
            <em>{fastest.opponent}</em>
          </div>
        )}
      </div>
    </section>
  );
}

/** Co dalej po karierze: jeden wybór, potem epilog. Do klatki się nie wraca. */
function AfterCareer({ g, setGame }: { g: GameState; setGame?: (s: GameState) => void }) {
  const paths = afterPaths(g);
  const chosen = paths.find((p) => p.key === g.ending?.after);
  if (chosen)
    return (
      <section className="step after-step chosen">
        <div className="after-epi">
          <span className="after-ico" aria-hidden="true">
            <Icon name={chosen.icon} size={22} />
          </span>
          <div>
            <div className="kicker">Po karierze · {chosen.title.toLowerCase()}</div>
            <p>{chosen.epilogue}</p>
          </div>
        </div>
      </section>
    );
  if (!setGame) return null;
  return (
    <section className="step after-step">
      <h3>Co dalej?</h3>
      <p className="muted" style={{ marginTop: 4 }}>Rękawice zostają na macie. Wybierz, czym zajmiesz się po karierze. Tego wyboru nie da się cofnąć.</p>
      <div className="after-grid">
        {paths.map((p) => (
          <button key={p.key} className="after-opt" disabled={!!p.locked} onClick={() => setGame(chooseAfter(g, p.key))}>
            <span className="after-ico" aria-hidden="true">
              <Icon name={p.icon} size={20} />
            </span>
            <span className="after-txt">
              <b>{p.title}</b>
              <small>{p.locked ? `Zamknięte: ${p.locked}` : p.desc}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
