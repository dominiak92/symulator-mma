// Loga federacji i gal (grafiki przygotowane przez autora gry). Dopasowanie po początku nazwy gali.
import L_babel from '../assets/logos/babel.webp';
import L_armada from '../assets/logos/armada.webp';
import L_thunder from '../assets/logos/thunder.webp';
import L_xsw from '../assets/logos/xsw.webp';
import L_fan from '../assets/logos/fan.webp';
import L_cw from '../assets/logos/cw.webp';
import L_hex from '../assets/logos/hex.webp';
import L_brava from '../assets/logos/brava.webp';
import L_okta from '../assets/logos/okta.webp';
import L_ufl from '../assets/logos/ufl.webp';
import L_bal from '../assets/logos/bal.webp';
import L_raizen from '../assets/logos/raizen.webp';
import L_two from '../assets/logos/two.webp';
import L_plf from '../assets/logos/plf.webp';
import L_flame from '../assets/logos/flame.webp';
import L_primo from '../assets/logos/primo.webp';
import L_hype from '../assets/logos/hype.webp';
import L_klout from '../assets/logos/klout.webp';
import L_desert from '../assets/logos/desert.webp';
import L_arabian from '../assets/logos/arabian.webp';
import L_dragon from '../assets/logos/dragon.webp';
import L_am_mp from '../assets/logos/am-mp.webp';
import L_am_puchar from '../assets/logos/am-puchar.webp';
import L_t_tatra from '../assets/logos/t-tatra.webp';
import L_t_bitka from '../assets/logos/t-bitka.webp';
import L_t_kemping from '../assets/logos/t-kemping.webp';
import L_t_noc from '../assets/logos/t-noc.webp';
import L_t_halusky from '../assets/logos/t-halusky.webp';
import L_t_granica from '../assets/logos/t-granica.webp';
import L_t_klatka from '../assets/logos/t-klatka.webp';

const LOGOS: [string, string][] = [
  ['Babel', L_babel],
  ['Armada', L_armada],
  ['Thunderbolt', L_thunder],
  ['XSW', L_xsw],
  ['FAN', L_fan],
  ['Cage Worriers', L_cw],
  ['Hexagon', L_hex],
  ['Brava', L_brava],
  ['Oktagram', L_okta],
  ['UFL', L_ufl],
  ['Balettor', L_bal],
  ['TWO FC', L_two],
  ['Raizen', L_raizen],
  ['PLF', L_plf],
  ['Flame', L_flame],
  ['Primo', L_primo],
  ['Hype', L_hype],
  ['Klout', L_klout],
  ['Desert Kings', L_desert],
  ['Arabian Warriors', L_arabian],
  ['Dragon Gate', L_dragon],
  ['Amatorskie Mistrzostwa', L_am_mp],
  ['Amatorski Puchar', L_am_puchar],
  ['Tatra Fight Night', L_t_tatra],
  ['Bitka pod Hradem', L_t_bitka],
  ['Kemping Fight Show', L_t_kemping],
  ['Noc Wojowników', L_t_noc],
  ['Halušky Fight Club', L_t_halusky],
  ['Granica Cup', L_t_granica],
  ['Klatka', L_t_klatka],
];

export function fedLogo(name: string | undefined | null): string | null {
  if (!name) return null;
  const hit = LOGOS.find(([k]) => name.startsWith(k));
  return hit ? hit[1] : null;
}
