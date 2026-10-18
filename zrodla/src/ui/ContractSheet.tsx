import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Club, Contract, GameState } from '../engine/types';
import { money, plural } from '../format';
import { Icon } from './Icon';
import { sfxCash, sfxClick } from './sound';
import { CONTRACT_ASKS, contractNegoChance, signingAmount, type ContractAsk } from '../engine/game';
import { ChanceTag } from './Chance';

/** Ile „atramentu” trzeba zostawić, żeby podpis się liczył (w pikselach długości linii). */
const MIN_INK = 120;

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
  const [asking, setAsking] = useState<ContractAsk | null>(null);
  const prevNego = useRef(c.nego);
  useEffect(() => {
    if (c.nego && !prevNego.current && c.nego.ok) sfxCash();
    prevNego.current = c.nego;
  }, [c.nego]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [ink, setInk] = useState(0);
  const [signed, setSigned] = useState(false);

  // płótno w rozdzielczości ekranu, żeby linia była ostra
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const fit = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(3, window.devicePixelRatio || 1);
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      const ctx = cv.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2.6;
      ctx.strokeStyle = '#1b2a6b';
    };
    fit();
    setInk(0);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    setInk((v) => v + Math.hypot(p.x - last.current!.x, p.y - last.current!.y));
    last.current = p;
  };
  const up = () => {
    drawing.current = false;
    last.current = null;
  };
  const clear = () => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext('2d');
    if (cv && ctx) ctx.clearRect(0, 0, cv.width, cv.height);
    setInk(0);
  };
  // dla klawiatury i osób, które nie mogą rysować: podpis inicjałami
  const signInitials = () => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const r = cv.getBoundingClientRect();
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.save();
    ctx.fillStyle = '#1b2a6b';
    ctx.font = `italic 600 ${Math.round(r.height * 0.5)}px Georgia, 'Times New Roman', serif`;
    ctx.textBaseline = 'middle';
    ctx.fillText(`${g.profile.firstName[0]}. ${g.profile.lastName}`, 12, r.height * 0.55);
    ctx.restore();
    setInk(MIN_INK + 1);
  };
  const sign = () => {
    if (ink < MIN_INK || signed) return;
    sfxClick();
    setSigned(true);
    // chwila na pieczątkę, potem dalej
    window.setTimeout(onSign, 650);
  };

  const fedShort = c.fed.split(' – ')[0];
  const lat = c.seasons === 1 ? 'rok' : `${c.seasons} lata`;
  const date = new Date(g.year, 0, 15).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const name = `${g.profile.firstName} ${g.profile.lastName}`;

  return createPortal(
    <div className="contract-veil" role="dialog" aria-modal="true" aria-label={`Kontrakt: ${c.fed}`}>
      <div className={`contract-paper ${signed ? 'signed' : ''}`}>
        <div className="cp-head">
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
              <span>Wyłączność</span>
              <b>tak, bez walk na innych galach</b>
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
            <canvas
              ref={canvasRef}
              className="cp-canvas"
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
              onPointerLeave={up}
              aria-label="Pole na podpis: podpisz się palcem albo myszką"
            />
            {ink === 0 && <span className="cp-hint">podpisz się tutaj palcem</span>}
            <small>
              Zawodnik
              {ink === 0 && (
                <button type="button" className="cp-initials" onClick={signInitials}>
                  podpisz inicjałami
                </button>
              )}
            </small>
          </div>
        </div>
        {signed && <span className="cp-approved">Podpisane</span>}
      </div>
      {onNegotiate && !negotiated && !signed && c.purse > 0 && (
        <div className={`contract-nego ${nego ? 'open' : ''}`}>
          {nego ? (
            <>
              <small className="cn-title">O co walczysz? Masz jedną próbę.</small>
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
              <small className="cn-risk">Przy żądaniu wyższej gaży federacja może się obrazić i dać gorszą wersję.</small>
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
        <button className="btn btn-ghost btn-small" onClick={ink > 0 ? clear : onCancel} disabled={signed}>
          {ink > 0 ? 'Wyczyść podpis' : 'Jeszcze się zastanowię'}
        </button>
        <button className="btn btn-primary btn-ico" onClick={sign} disabled={ink < MIN_INK || signed}>
          <Icon name="pen" />
          {ink < MIN_INK ? 'Najpierw podpis' : 'Zatwierdzam'}
        </button>
      </div>
    </div>,
    document.body,
  );
}
