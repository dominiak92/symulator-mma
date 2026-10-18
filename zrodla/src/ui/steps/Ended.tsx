import { useEffect, useState } from 'react';
import type { GameState } from '../../engine/types';
import { displayName, mainRecord, medalCount, recStr, divisionKey } from '../../engine/game';
import { START_PROFILES } from '../../engine/data';
import { CARD_THEMES, drawCard } from '../card';
import { loadAchievements, loadSettings, saveSettings } from '../../storage';
import { HistoryList, PeersTable } from '../Sheets';
import CareerChart from '../CareerChart';
import { lat, money } from '../../format';
import { SHOP_URL } from '../Logo';
import { GG } from '../brand';
import { ACHIEVEMENTS } from '../../engine/achievements';
import { Confetti, Fighter } from '../Art';
import { clubCrest } from '../Emblem';
import { Icon } from '../Icon';

export default function Ended({ game, onNewCareer, onMenu }: { game: GameState; onNewCareer: () => void; onMenu: () => void }) {
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
          {g.belts.length > 0 && <Confetti />}
          <div className="sum-art">
            <Fighter weight={divisionKey(g)} seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={96} belt={g.belts.length > 0} />
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
      </section>

      {g.seasons.length >= 2 && (
        <section className="step">
          <h3>Wykres kariery</h3>
          <div style={{ marginTop: 10 }}>
            <CareerChart g={g} full />
          </div>
        </section>
      )}

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
        const got = ACHIEVEMENTS.filter((a) => a.check(g));
        if (!got.length) return null;
        return (
          <section className="step">
            <h3>Osiągnięcia tej kariery</h3>
            <div className="chips">
              {got.map((a) => (
                <span key={a.id} className="tag blue" title={a.desc}>
                  ★ {a.title}
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
