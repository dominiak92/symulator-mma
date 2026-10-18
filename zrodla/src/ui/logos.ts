// Loga federacji (grafiki przygotowane przez autora gry). Dopasowanie po początku nazwy gali.
import babel from '../assets/logos/babel.webp';
import armada from '../assets/logos/armada.webp';
import thunder from '../assets/logos/thunder.webp';
import xsw from '../assets/logos/xsw.webp';
import fan from '../assets/logos/fan.webp';
import cw from '../assets/logos/cw.webp';
import hex from '../assets/logos/hex.webp';
import brava from '../assets/logos/brava.webp';
import okta from '../assets/logos/okta.webp';
import ufl from '../assets/logos/ufl.webp';
import bal from '../assets/logos/bal.webp';
import two from '../assets/logos/two.webp';
import plf from '../assets/logos/plf.webp';
import flame from '../assets/logos/flame.webp';
import primo from '../assets/logos/primo.webp';
import hype from '../assets/logos/hype.webp';
import klout from '../assets/logos/klout.webp';
import desert from '../assets/logos/desert.webp';

const LOGOS: [string, string][] = [
  ['Babel', babel],
  ['Armada', armada],
  ['Thunderbolt', thunder],
  ['XSW', xsw],
  ['FAN', fan],
  ['Cage Worriers', cw],
  ['Hexagon', hex],
  ['Brava', brava],
  ['Oktagram', okta],
  ['UFL', ufl],
  ['Balettor', bal],
  ['TWO FC', two],
  ['PLF', plf],
  ['Flame', flame],
  ['Primo', primo],
  ['Hype', hype],
  ['Klout', klout],
  ['Desert Kings', desert],
];

export function fedLogo(name: string | undefined | null): string | null {
  if (!name) return null;
  const hit = LOGOS.find(([k]) => name.startsWith(k));
  return hit ? hit[1] : null;
}
