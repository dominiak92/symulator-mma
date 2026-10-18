import type { GameState } from './types';
import { BELT_NAMES } from './data';

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  secret?: boolean;
  check: (s: GameState) => boolean;
}

const belt = (s: GameState, tier: number) => s.belts.some((b) => b.name.startsWith(BELT_NAMES[tier]));
const f = (s: GameState, k: string) => s.flags[k] ?? 0;

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win', title: 'Pierwsza krew', desc: 'Wygraj pierwszą walkę.', check: (s) => s.record.w + s.amRecord.w >= 1 },
  { id: 'first_ko', title: 'Zgaś światło', desc: 'Wygraj przez nokaut.', check: (s) => s.finishes.ko >= 1 },
  { id: 'first_sub', title: 'Klepnij, kolego', desc: 'Wygraj przez poddanie.', check: (s) => s.finishes.sub >= 1 },
  { id: 'ko_r1', title: 'Szybki wieczór', desc: 'Znokautuj rywala w pierwszej rundzie.', check: (s) => f(s, 'koR1') >= 1 },
  { id: 'off_canvas', title: 'Wstał i wygrał', desc: 'Wygraj walkę, w której po ciosie wylądowałeś na macie.', check: (s) => f(s, 'offTheCanvas') >= 1 },
  { id: 'comeback', title: 'Serce wojownika', desc: 'Wygraj walkę, w której narożnik widział, że jesteś mocno obity.', check: (s) => f(s, 'comeback') >= 1 },
  { id: 'medal', title: 'Na podium', desc: 'Zdobądź medal w turnieju amatorskim.', check: (s) => s.medals.gold + s.medals.silver + s.medals.bronze >= 1 },
  { id: 'belt0', title: 'Złoto na szyi', desc: 'Wygraj Mistrzostwa Polski amatorów.', check: (s) => belt(s, 0) },
  { id: 'debut', title: 'Zawodowiec', desc: 'Stocz pierwszą walkę zawodową.', check: (s) => s.proDebut !== null },
  { id: 'bonus', title: 'Bonus wieczoru', desc: 'Zgarnij bonus za najlepszą walkę albo skończenie gali.', check: (s) => f(s, 'bonuses') >= 1 },
  { id: 'belt1', title: 'Król hali OSiR', desc: 'Zdobądź pas regionalnej gali.', check: (s) => belt(s, 1) },
  { id: 'belt2', title: 'Mistrz Polski', desc: 'Zdobądź pas polskiej federacji.', check: (s) => belt(s, 2) },
  { id: 'belt3', title: 'Król Europy', desc: 'Zdobądź pas mistrza Europy.', check: (s) => belt(s, 3) },
  { id: 'belt4', title: 'Mistrz świata', desc: 'Zdobądź pas światowej federacji.', check: (s) => belt(s, 4) },
  { id: 'def3', title: 'Nie do ruszenia', desc: 'Obroń pas trzy razy z rzędu.', check: (s) => f(s, 'maxDef') >= 3 },
  { id: 'streak10', title: 'Maszyna', desc: 'Wygraj 10 walk z rzędu.', check: (s) => f(s, 'bestStreak') >= 10 },
  { id: 'unbeaten10', title: 'Zero w rubryce', desc: 'Zacznij karierę zawodową od rekordu 10-0.', check: (s) => { const pro = s.history.filter((h) => !h.amateur && !h.freak).slice(0, 10); return pro.length === 10 && pro.every((h) => h.result === 'W'); } },
  { id: 'finishes20', title: 'Kat', desc: 'Skończ przed czasem 20 rywali.', check: (s) => s.finishes.ko + s.finishes.sub >= 20 },
  { id: 'fights50', title: 'Weteran klatki', desc: 'Stocz 50 walk.', check: (s) => s.history.length >= 50 },
  { id: 'age40', title: 'Dziadek z klatki', desc: 'Walcz do czterdziestki.', check: (s) => s.age >= 40 && s.phase === 'ended' },
  { id: 'world_tier', title: 'Wielki świat', desc: 'Podpisz kontrakt ze światową federacją.', check: (s) => s.peakTier >= 4 },
  { id: 'million', title: 'Milioner', desc: 'Zarób w karierze milion złotych.', check: (s) => s.totalEarned >= 1_000_000 },
  { id: 'ten_million', title: 'Konto jak u piłkarza', desc: 'Zarób w karierze 10 milionów złotych.', check: (s) => s.totalEarned >= 10_000_000 },
  { id: 'freak1', title: 'Cyrk przyjechał', desc: 'Stocz pierwszy freak fight.', check: (s) => s.freakFights >= 1 },
  { id: 'freak5', title: 'Król cyrku', desc: 'Stocz pięć freak fightów.', check: (s) => s.freakFights >= 5 },
  { id: 'freak_loss', title: 'Przegrał z raperem', desc: 'Przegraj freak fight.', secret: true, check: (s) => f(s, 'freakLoss') >= 1 },
  { id: 'peer3', title: 'Rachunki z dzieciństwa', desc: 'Pokonaj zawodników ze swojego rocznika 3 razy.', check: (s) => f(s, 'peerWins') >= 3 },
  { id: 'split', title: 'Sędziowski skandal', desc: 'Przegraj niejednogłośną decyzją.', check: (s) => f(s, 'splitLoss') >= 1 },
  { id: 'honor', title: 'Człowiek honoru', desc: 'Złóż co najmniej dwie obietnice i żadnej nie złam.', check: (s) => s.phase === 'ended' && f(s, 'promisesMade') >= 2 && s.brokenPromises === 0 },
  { id: 'liar', title: 'Słowo jak wiatr', desc: 'Złam trzy obietnice w jednej karierze.', secret: true, check: (s) => s.brokenPromises >= 3 },
  { id: 'gg', title: 'Banda', desc: 'Dołącz do ekipy Ground Game.', check: (s) => f(s, 'sponsor:Ground Game') >= 1 },
  { id: 'kebab', title: 'Sponsor z rollo', desc: 'Podpisz kontrakt z kebabem spod bloku.', check: (s) => f(s, 'sponsor:Kebab u Ahmeda') >= 1 },
  { id: 'osiedle_world', title: 'Z osiedla na szczyt', desc: 'Zdobądź pas świata, startując jako chłopak z osiedla.', check: (s) => s.profile.start === 'osiedle' && belt(s, 4) },
  { id: 'hard_pl', title: 'Pod wiatr', desc: 'Zostań mistrzem Polski na poziomie trudnym.', check: (s) => s.profile.difficulty === 'hard' && belt(s, 2) },
  { id: 'retire_champ', title: 'Odchodzi niepokonany', desc: 'Zakończ karierę jako panujący mistrz.', check: (s) => s.phase === 'ended' && s.rank === 0 && s.tier >= 2 },
  { id: 'wasted', title: 'Zmarnowany talent', desc: 'Jako Wybraniec nie wyjdź poza polską federację.', secret: true, check: (s) => s.phase === 'ended' && s.profile.start === 'wybraniec' && s.peakTier <= 2 },
  { id: 'daily', title: 'Codzienna dawka', desc: 'Ukończ Karierę dnia.', check: (s) => s.mode === 'daily' && s.phase === 'ended' },
  { id: 'legacy3000', title: 'Legenda', desc: 'Zdobądź 4500 punktów LEGACY w jednej karierze.', check: (s) => (s.ending?.legacy ?? 0) >= 4500 },
  { id: 'double_champ', title: 'Podwójny mistrz', desc: 'Wygraj superfight o pas drugiej kategorii.', check: (s) => f(s, 'doubleChamp') >= 1 },
  { id: 'interim', title: 'Tymczasowo najlepszy', desc: 'Zdobądź pas tymczasowy.', check: (s) => f(s, 'interimBelts') >= 1 },
  { id: 'short_win', title: 'Ratownik gali', desc: 'Wygraj walkę wziętą na zastępstwo.', check: (s) => f(s, 'shortWins') >= 1 },
  { id: 'tickets', title: 'Sam sprzedam halę', desc: 'Sprzedaj w karierze 500 biletów.', check: (s) => f(s, 'ticketsSold') >= 500 },
  { id: 'mic', title: 'Daj mi mikrofon', desc: 'Wywołaj mistrza i dostań walkę o pas.', check: (s) => f(s, 'micTitle') >= 1 },
  { id: 'fans100k', title: 'Influencer', desc: 'Zbierz 100 tysięcy obserwujących.', check: (s) => (s.followers ?? 0) >= 100000 },
  { id: 'grappling_gold', title: 'Złoto bez ciosów', desc: 'Wygraj turniej grapplingowy.', check: (s) => f(s, 'grapplingGold') >= 1 },
  { id: 'boxing_win', title: 'Bokser z klatki', desc: 'Wygraj walkę na gali bokserskiej.', check: (s) => f(s, 'boxingWins') >= 1 },
  { id: 'abroad_win', title: 'Szejk zadowolony', desc: 'Wygraj walkę na gali za granicą.', check: (s) => f(s, 'abroadWins') >= 1 },
  { id: 'top_exit', title: 'Na własnych warunkach', desc: 'Zakończ karierę jako panujący mistrz albo na serii zwycięstw.', check: (s) => !!s.ending?.top },
  { id: 'nemesis', title: 'Rachunki wyrównane', desc: 'Pokonaj zadrę z federacji i wyrównaj bilans.', check: (s) => f(s, 'nemesisSettled') >= 1 },
];

/** Osiągnięcia czysto amatorskie: w szybkiej karierze amatorkę gra automat, więc się nie liczą. */
const AMATEUR_ONLY = new Set(['medal', 'belt0']);

export function newlyUnlocked(s: GameState, have: Set<string>): Achievement[] {
  // szybka kariera: nic się nie odblokowuje, zanim gracz sam nie stoczy walki zawodowej
  if (s.quick && !s.proDebut) return [];
  return ACHIEVEMENTS.filter((a) => !have.has(a.id) && !(s.quick && AMATEUR_ONLY.has(a.id)) && a.check(s));
}

export type AchTone = 'gold' | 'red' | 'blue' | 'green' | 'purple';
const ICONS: Record<string, [string, AchTone]> = {
  first_win: ['glove', 'green'], first_ko: ['bolt', 'red'], first_sub: ['knot', 'purple'], ko_r1: ['clock', 'red'],
  off_canvas: ['rotate', 'red'], comeback: ['heart', 'red'], medal: ['medal', 'gold'], belt0: ['medal', 'gold'],
  debut: ['pen', 'blue'], bonus: ['coins', 'gold'], belt1: ['trophy', 'gold'], belt2: ['trophy', 'gold'], belt3: ['trophy', 'gold'],
  belt4: ['trophy', 'gold'], def3: ['shield', 'gold'], streak10: ['flame', 'red'], unbeaten10: ['star', 'gold'],
  finishes20: ['target', 'red'], fights50: ['dumbbell', 'blue'], age40: ['hourglass', 'blue'], world_tier: ['pin', 'blue'],
  million: ['coins', 'green'], ten_million: ['card', 'green'], freak1: ['megaphone', 'purple'], freak5: ['megaphone', 'purple'],
  freak_loss: ['mic', 'purple'], peer3: ['users', 'blue'], split: ['scale', 'red'], honor: ['heart', 'green'], liar: ['x', 'red'],
  gg: ['shirt', 'blue'], kebab: ['receipt', 'gold'], osiedle_world: ['home', 'gold'], hard_pl: ['trend', 'red'],
  retire_champ: ['trophy', 'gold'], wasted: ['hourglass', 'red'], daily: ['calendar', 'blue'], legacy3000: ['museum', 'gold'],
  double_champ: ['trophy', 'gold'], interim: ['trophy', 'blue'], short_win: ['clock', 'green'], tickets: ['ticket', 'green'],
  mic: ['mic', 'purple'], fans100k: ['phone', 'purple'], grappling_gold: ['knot', 'gold'], boxing_win: ['glove', 'red'],
  abroad_win: ['pin', 'gold'], top_exit: ['door', 'gold'], nemesis: ['scale', 'green'],
};
/** Ikona i kolor osiągnięcia (do listy, toastów i ekranu końca kariery). */
export function achIcon(id: string): { icon: string; tone: AchTone } {
  const [icon, tone] = ICONS[id] ?? ['star', 'blue'];
  return { icon, tone };
}
