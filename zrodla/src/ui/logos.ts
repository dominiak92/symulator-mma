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

import C_gracje from '../assets/clubs/gracje.webp';
import C_blarney from '../assets/clubs/blarney.webp';
import C_allgw from '../assets/clubs/allgw.webp';
import C_barracuda from '../assets/clubs/barracuda.webp';
import C_waz from '../assets/clubs/waz.webp';
import C_phuket from '../assets/clubs/phuket.webp';
import C_alfa from '../assets/clubs/alfa.webp';
import C_orly from '../assets/clubs/orly.webp';
import C_jackman from '../assets/clubs/jackman.webp';
import C_dziki from '../assets/clubs/dziki.webp';
import C_meduza from '../assets/clubs/meduza.webp';
import C_lwy from '../assets/clubs/lwy.webp';
import C_sparta from '../assets/clubs/sparta.webp';
import C_hutnik from '../assets/clubs/hutnik.webp';
import C_kimura from '../assets/clubs/kimura.webp';
import C_miasto from '../assets/clubs/miasto.webp';
import C_atd from '../assets/clubs/atd.webp';
import C_altitude from '../assets/clubs/altitude.webp';
import C_remiza from '../assets/clubs/remiza.webp';
import C_garaz from '../assets/clubs/garaz.webp';
import C_klos from '../assets/clubs/klos.webp';
import C_berzerker from '../assets/clubs/berzerker.webp';
import C_arachnion from '../assets/clubs/arachnion.webp';
import C_wza from '../assets/clubs/wza.webp';
import C_killklif from '../assets/clubs/killklif.webp';
import S_kebab from '../assets/sponsors/kebab.webp';
import S_myjnia from '../assets/sponsors/myjnia.webp';

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

const CLUBS: Record<string, string> = {
  'Gracje Barra Rio': C_gracje,
  'Straight Blarney Gym': C_blarney,
  'All-Gwiazdy Sztokholm': C_allgw,
  'Barracuda Top Team': C_barracuda,
  'Czerwony Wąż': C_waz,
  'Phuket Top Camp': C_phuket,
  'Team Alfa Samiec': C_alfa,
  'Orły Machaczkała': C_orly,
  'Jackman-Wonk': C_jackman,
  'Dziki Zachód Szczecin': C_dziki,
  'Meduza Łódź': C_meduza,
  'Lubelskie Lwy': C_lwy,
  'Sparta Fight Club': C_sparta,
  'Hutnik Bytom': C_hutnik,
  'Akademia Kimura Kraków': C_kimura,
  'Miasto Kickboxing': C_miasto,
  'American Top Dog': C_atd,
  'Altitude Fight Lab': C_altitude,
  'Remiza Team': C_remiza,
  'Garaż u Zbyszka': C_garaz,
  'LZS Kłos Fight': C_klos,
  'Berzerker Brothers': C_berzerker,
  'Arachnion Olsztyn': C_arachnion,
  'WZA Fight Team': C_wza,
  'Kill Klif FC': C_killklif,
};

const CLUBS_PL = ['Dziki Zachód Szczecin', 'Meduza Łódź', 'Lubelskie Lwy', 'Sparta Fight Club', 'Hutnik Bytom', 'Akademia Kimura Kraków', 'Miasto Kickboxing', 'Remiza Team', 'Garaż u Zbyszka', 'LZS Kłos Fight', 'Berzerker Brothers', 'Arachnion Olsztyn', 'WZA Fight Team', 'Kill Klif FC', 'Team Alfa Samiec', 'Czerwony Wąż'];
const CLUBS_BY_COUNTRY: Record<string, string[]> = {
  Brazylia: ['Gracje Barra Rio', 'Barracuda Top Team'],
  Irlandia: ['Straight Blarney Gym'],
  Szwecja: ['All-Gwiazdy Sztokholm'],
  Dagestan: ['Orły Machaczkała'],
  USA: ['Jackman-Wonk', 'American Top Dog', 'Altitude Fight Lab', 'Barracuda Top Team'],
  Anglia: ['Straight Blarney Gym', 'Phuket Top Camp'],
  Australia: ['Phuket Top Camp'],
};
/** Klub rywala na plakat: stały dla danego zawodnika, inny niż klub gracza. */
export function rivalClub(seed: string, country: string | undefined, myClub?: string): string | null {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  h = h >>> 0;
  const pool = !country || country === 'Polska' ? CLUBS_PL.filter((c) => c !== myClub) : CLUBS_BY_COUNTRY[country];
  if (!pool || !pool.length) return null;
  return pool[h % pool.length];
}

/** Herb klubu (grafika), gdy jest. */
export function clubLogo(name: string | undefined | null): string | null {
  return name ? CLUBS[name] ?? null : null;
}

const SPONSORS: [RegExp, string][] = [
  [/^Kebab u Ahmeda/i, S_kebab],
  [/^Myjnia Bąbelek/i, S_myjnia],
];

/** Logo sponsora (grafika), gdy jest. */
export function sponsorLogo(name: string): string | null {
  return SPONSORS.find(([re]) => re.test(name))?.[1] ?? null;
}
