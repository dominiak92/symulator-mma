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
  { id: 'top_exit', title: 'Na własnych warunkach', desc: 'Zakończ karierę jako panujący mistrz albo na serii zwycięstw.', check: (s) => !!s.ending?.top },
];

export function newlyUnlocked(s: GameState, have: Set<string>): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !have.has(a.id) && a.check(s));
}
