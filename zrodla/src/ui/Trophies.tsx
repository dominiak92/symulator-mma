/** Gablota: pasy, medale i najlepsze zwycięstwa tej kariery. */
import type { GameState, HistoryEntry } from '../engine/types';
import { BELT_NAMES } from '../engine/data';
import { METHOD_SHORT } from '../engine/game';
import { SheetHead } from './Game';
import { Medal } from './Art';
import { FlagMark } from './Flag';
import { Icon } from './Icon';
import beltAm from '../assets/belts/amator.webp';
import beltReg from '../assets/belts/regional.webp';
import beltPl from '../assets/belts/polska.webp';
import beltEu from '../assets/belts/europa.webp';
import beltWorld from '../assets/belts/world.webp';
import beltInterim from '../assets/belts/interim.webp';

const BELT_IMG = [beltAm, beltReg, beltPl, beltEu, beltWorld];

export function beltTier(name: string) {
  const i = BELT_NAMES.findIndex((b) => name.startsWith(b));
  return i < 0 ? 1 : i;
}

/** Wartość zwycięstwa do rankingu „najlepszych”: szczebel, pas, pozycja rywala, skończenie. */
function winScore(h: HistoryEntry) {
  let v = h.tier * 100 + (h.title ? 80 : 0) + (h.oppRank !== null ? Math.max(0, 16 - h.oppRank) * 3 : 0);
  if (h.method === 'KO/TKO' || h.method === 'Poddanie') v += 15 + Math.max(0, 4 - h.round) * 3;
  if (h.peer) v += 10;
  if (h.amateur) v -= 60;
  return v;
}

export function TrophySheet({ g, onClose }: { g: GameState; onClose: () => void }) {
  const best = g.history.filter((h) => h.result === 'W' && !h.freak).sort((a, b) => winScore(b) - winScore(a)).slice(0, 5);
  const interim = g.flags.interimBelts ?? 0;
  const m = g.medals;
  const empty = !g.belts.length && !interim && !m.gold && !m.silver && !m.bronze && !best.length;
  return (
    <>
      <SheetHead title="Gablota" onClose={onClose} />
      {empty && <p className="muted">Gablota czeka na pierwsze trofeum. Medal z turnieju amatorskiego też się liczy.</p>}
      {(g.belts.length > 0 || interim > 0) && (
        <section className="tc-sec">
          <h4>Pasy</h4>
          <div className="tc-belts">
            {g.belts.map((b, i) => (
              <figure key={i} className={`tc-belt t${beltTier(b.name)}`}>
                <img src={BELT_IMG[beltTier(b.name)]} alt="" loading="lazy" />
                <figcaption>
                  <b>{b.name}</b>
                  <small>
                    rok {b.season} · {b.age} lat
                  </small>
                </figcaption>
              </figure>
            ))}
            {interim > 0 && (
              <figure className="tc-belt interim">
                <img src={beltInterim} alt="" loading="lazy" />
                <figcaption>
                  <b>Pas tymczasowy{interim > 1 ? ` ×${interim}` : ''}</b>
                  <small>wywalczony, gdy mistrz się leczył</small>
                </figcaption>
              </figure>
            )}
          </div>
        </section>
      )}
      {(m.gold || m.silver || m.bronze) > 0 && (
        <section className="tc-sec">
          <h4>Medale amatorskie</h4>
          <div className="tc-medals">
            {(['gold', 'silver', 'bronze'] as const).map((k) => (
              <div key={k} className={`tc-medal ${m[k] ? '' : 'none'}`}>
                <Medal kind={k} size={46} />
                <b>×{m[k]}</b>
              </div>
            ))}
          </div>
        </section>
      )}
      {best.length > 0 && (
        <section className="tc-sec">
          <h4>Najlepsze zwycięstwa</h4>
          <ol className="tc-wins">
            {best.map((h, i) => (
              <li key={i}>
                <span className="tc-pos">{i + 1}</span>
                <span className="tc-who">
                  <b>
                    <FlagMark flag={h.oppFlag} />
                    {h.opponent}
                    {h.title && <Icon name="trophy" size={13} />}
                  </b>
                  <small>
                    {METHOD_SHORT[h.method] ?? h.method}
                    {h.method === 'KO/TKO' || h.method === 'Poddanie' ? ` · ${h.round}. runda` : ''} · {h.gala ?? h.fed} · {h.age} lat
                  </small>
                </span>
                {h.oppRank !== null && <span className="tc-rank">{h.oppRank === 0 ? 'mistrz' : `#${h.oppRank}`}</span>}
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
