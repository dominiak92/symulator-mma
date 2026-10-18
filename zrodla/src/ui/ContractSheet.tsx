import { useEffect, useRef, useState } from 'react';
import { fedLogo } from './logos';
import { createPortal } from 'react-dom';
import type { Club, Contract, GameState } from '../engine/types';
import { money, plural } from '../format';
import { Icon } from './Icon';
import { sfxCash, sfxClick } from './sound';
import { CONTRACT_ASKS, contractNegoChance, signingAmount, type ContractAsk } from '../engine/game';
import { ChanceTag } from './Chance';
import { CoachTip } from './Tutorial';

/** Ile „atramentu” trzeba zostawić, żeby podpis się liczył (w pikselach długości linii). */

/**
 * Kontrakt na kartce: warunki, drobny druk i miejsce na podpis palcem.
 * Zatwierdzić można dopiero po złożeniu podpisu.
 */
export default function ContractSheet({
  g,
  c,
  club,
  onSign,
  onCancel,
  negotiated,
  onNegotiate,
}: {
  g: GameState;
  c: Contract;
  club: Club;
  onSign: () => void;
  onCancel: () => void;
  negotiated?: boolean;
  onNegotiate?: (ask: ContractAsk) => void;
}) {
  const [nego, setNego] = useState(false);
  // strzałka „przewiń do podpisu”, gdy kartka nie mieści się na ekranie
  const paperRef = useRef<HTMLDivElement>(null);
  const [moreBelow, setMoreBelow] = useState(false);
  useEffect(() => {
    const el = paperRef.current;
    if (!el) return;
    let dismissed = false;
    const check = () => setMoreBelow(!dismissed && el.scrollHeight - el.clientHeight - el.scrollTop > 24);
    check();
    const onScroll = () => {
      // po pierwszym przewinięciu strzałka znika na dobre
      if (el.scrollTop > 12) {
        dismissed = true;
        setMoreBelow(false);
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', check);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(check) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', check);
      ro?.disconnect();
    };
  }, []);
  const toSign = () => {
    const el = paperRef.current;
    el?.querySelector('.cp-sign')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    setMoreBelow(false);
  };
  const [asking, setAsking] = useState<ContractAsk | null>(null);
  const prevNego = useRef(c.nego);
  useEffect(() => {
    if (c.nego && !prevNego.current && c.nego.ok) sfxCash();
    prevNego.current = c.nego;
  }, [c.nego]);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !asking && !signed && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel, asking, signed]);

  // podpis jednym przyciskiem: nazwisko wpisuje się w pole, pieczątka i dalej
  const sign = () => {
    if (signed || asking) return;
    sfxClick();
    toSign();
    setSigned(true);
    window.setTimeout(onSign, 1300);
  };

  const fedShort = c.fed.split(' – ')[0];
  const lat = c.seasons === 1 ? 'rok' : `${c.seasons} lata`;
  const date = new Date(g.year, 0, 15).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const name = `${g.profile.firstName} ${g.profile.lastName}`;

  return createPortal(
    <div className="contract-veil" role="dialog" aria-modal="true" aria-label={`Kontrakt: ${c.fed}`}>
      <div ref={paperRef} className={`contract-paper ${signed ? 'signed' : ''}`}>
        <div className="cp-head">
          {fedLogo(c.fed) && <img className="cp-logo" src={fedLogo(c.fed)!} alt="" aria-hidden="true" />}
          <span className="cp-kicker">Umowa o walki zawodowe nr {g.season}/{g.year}</span>
          <h2>Kontrakt zawodniczy</h2>
          <p className="cp-parties">
            zawarty w dniu {date} pomiędzy <b>{c.fed}</b>, zwaną dalej Organizatorem, a <b>{name}</b>
            {g.profile.nickname ? ` „${g.profile.nickname}”` : ''}, zwanym dalej Zawodnikiem.
          </p>
        </div>
        <ol className="cp-terms">
          <li>
            <span>Okres obowiązywania</span>
            <b>{lat}</b>
          </li>
          <li>
            <span>Liczba walk w roku</span>
            <b>{c.fights ? `${c.fights} ${plural(c.fights, 'walka', 'walki', 'walk')}` : 'turnieje'}</b>
          </li>
          <li className={c.nego?.ask === 'purse' ? (c.nego.ok ? 'amended' : 'worse') : ''}>
            <span>Gaża za walkę</span>
            <b>{c.purse ? money(c.purse) : 'brak'}</b>
          </li>
          {c.winBonus > 0 && (
            <li className={c.nego?.ask === 'bonus' && c.nego.ok ? 'amended' : ''}>
              <span>Premia za zwycięstwo</span>
              <b>+{money(c.winBonus)}</b>
            </li>
          )}
          {!!c.signing && (
            <li className="amended">
              <span>Bonus za podpis</span>
              <b>+{money(c.signing)}</b>
            </li>
          )}
          <li>
            <span>Klub i obóz</span>
            <b>{club.name}</b>
          </li>
          {c.exclusive && (
            <li className="cp-excl">
              <span>Wyłączność (bez walk MMA na innych galach)</span>
              <b>tak</b>
            </li>
          )}
        </ol>
        {c.nego && <p className={`cp-note ${c.nego.ok ? 'ok' : 'ko'}`}>{c.nego.text}</p>}
        <p className="cp-fine">
          Postanowienia końcowe: Zawodnik zobowiązuje się stawić na ważeniu w limicie, nie obrażać matki Organizatora na konferencjach i nie publikować relacji z siłowni o 3 w nocy. Organizator zobowiązuje się wypłacić gażę w terminie, a w razie spóźnienia nie tłumaczyć się „księgową na urlopie”.
        </p>
        <div className="cp-sign">
          <div className="cp-sign-org">
            <span className="cp-stamp">{fedShort}</span>
            <small>Organizator</small>
          </div>
          <div className="cp-sign-me">
            <div className="cp-sigline" aria-live="polite">
              {signed ? <span className="cp-sig">{g.profile.firstName[0]}. {g.profile.lastName}</span> : <span className="cp-hint">miejsce na podpis</span>}
            </div>
            <small>Zawodnik</small>
          </div>
        </div>
        {signed && <span className="cp-approved">Podpisane</span>}
        {moreBelow && !signed && (
          <button type="button" className="cp-more" onClick={toSign} aria-label="Przewiń do podpisu">
            <span>Przewiń do podpisu</span>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      {onNegotiate && !negotiated && !signed && c.purse > 0 && (
        <div className={`contract-nego ${nego ? 'open' : ''}`}>
          {nego ? (
            <>
              <div className="cn-head">
                <small className="cn-title">O co walczysz? Masz jedną próbę.</small>
                <button type="button" className="link-btn cn-cancel" disabled={!!asking} onClick={() => setNego(false)}>
                  Jednak nie
                </button>
              </div>
              <div className="cn-opts">
                {CONTRACT_ASKS.map((a) => (
                  <button
                    key={a.id}
                    className="choice cn-opt"
                    disabled={!!asking}
                    onClick={() => {
                      sfxClick();
                      setAsking(a.id);
                      window.setTimeout(() => {
                        setAsking(null);
                        setNego(false);
                        onNegotiate(a.id);
                      }, 900);
                    }}
                  >
                    <span className="opt-top">
                      <span className="title">{asking === a.id ? 'Dzwonisz…' : a.label}</span>
                      <ChanceTag p={contractNegoChance(g, c, a.id)} />
                    </span>
                    <span className="desc">{a.id === 'signing' ? `ok. ${money(signingAmount(c))} od ręki` : a.desc}</span>
                  </button>
                ))}
              </div>
              <CoachTip id="nego">Masz jedną próbę na cały rynek. Wyższa gaża opłaca się przy dłuższym kontrakcie, premia gdy często wygrywasz, a bonus za podpis daje kasę od razu. Każda odmowa grozi gorszą wersją umowy.</CoachTip>
              <small className="cn-risk">Po odmowie federacja może się obrazić i obniżyć gażę o 6% (najczęściej przy żądaniu wyższej gaży, najrzadziej przy premii).</small>
            </>
          ) : (
            <button className="btn btn-ghost btn-small btn-ico cn-open" onClick={() => setNego(true)}>
              <Icon name="coins" size={15} />
              Negocjuj warunki
            </button>
          )}
        </div>
      )}
      <div className="contract-actions">
        <button className="btn btn-ghost btn-small" onClick={onCancel} disabled={signed || !!asking}>
          Jeszcze się zastanowię
        </button>
        <button className="btn btn-primary btn-ico" onClick={sign} disabled={signed || !!asking}>
          <Icon name="pen" />
          {signed ? 'Podpisane' : 'Podpisuję kontrakt'}
        </button>
      </div>
    </div>,
    document.body,
  );
}
