var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/game.ts
import { createClient } from "npm:@supabase/supabase-js@2";

// src/engine/game.ts
var game_exports = {};
__export(game_exports, {
  ACADEMY_LEVELS: () => ACADEMY_LEVELS,
  AMATEUR_MAX_AGE: () => AMATEUR_MAX_AGE,
  BACKROOM: () => BACKROOM,
  CAMPS: () => CAMPS,
  CONTRACT_ASKS: () => CONTRACT_ASKS,
  DAGESTAN_GAINS: () => DAGESTAN_GAINS,
  DEPOSIT_RATE: () => DEPOSIT_RATE,
  DIET: () => DIET,
  DONATIONS: () => DONATIONS,
  EXPEDITIONS: () => EXPEDITIONS,
  LABS_SPONSOR: () => LABS_SPONSOR,
  LUXURY: () => LUXURY,
  METHOD_SHORT: () => METHOD_SHORT,
  OVERDRAFT: () => OVERDRAFT,
  PITCH_SLOTS: () => PITCH_SLOTS,
  PRESS_OPTIONS: () => PRESS_OPTIONS,
  SAVE_VERSION: () => SAVE_VERSION,
  SPONSOR_POSTS: () => SPONSOR_POSTS,
  YEAR_GOALS: () => YEAR_GOALS,
  academyIncome: () => academyIncome,
  academyName: () => academyName,
  academyNext: () => academyNext,
  acceptAllOffers: () => acceptAllOffers,
  acceptInvite: () => acceptInvite,
  acceptOffer: () => acceptOffer,
  acceptShadyDeal: () => acceptShadyDeal,
  acceptSponsorOffer: () => acceptSponsorOffer,
  afterNext: () => afterNext,
  afterPaths: () => afterPaths,
  afterPending: () => afterPending,
  amLevel: () => amLevel,
  announceAnswer: () => announceAnswer,
  answerMessage: () => answerMessage,
  answerPhoneAll: () => answerPhoneAll,
  applyEffects: () => applyEffects,
  backroomAvailable: () => backroomAvailable,
  backroomCost: () => backroomCost,
  backroomOpen: () => backroomOpen,
  breakDeposit: () => breakDeposit,
  breakPreview: () => breakPreview,
  budgetBalance: () => budgetBalance,
  budgetLines: () => budgetLines,
  buildMarket: () => buildMarket,
  buildTuneup: () => buildTuneup,
  buyGear: () => buyGear,
  campBlocked: () => campBlocked,
  campCost: () => campCost,
  campGain: () => campGain,
  campGo: () => campGo,
  campOptions: () => campOptions,
  campWeek: () => campWeek,
  canStartSeason: () => canStartSeason,
  careerStory: () => careerStory,
  chanceOf: () => chanceOf,
  changeDivision: () => changeDivision,
  cheaperClub: () => cheaperClub,
  checkEnd: () => checkEnd,
  choiceChance: () => choiceChance,
  chooseAfter: () => chooseAfter,
  chooseEvent: () => chooseEvent,
  claimErrand: () => claimErrand,
  clone: () => clone,
  clubAvailability: () => clubAvailability,
  clubLimits: () => clubLimits,
  confirmMarket: () => confirmMarket,
  continueAfterEvent: () => continueAfterEvent,
  contractNegoChance: () => contractNegoChance,
  contractPurse: () => contractPurse,
  currentYearGoal: () => currentYearGoal,
  cutChance: () => cutChance,
  dagestanBlocked: () => dagestanBlocked,
  dagestanCost: () => dagestanCost,
  debutCheck: () => debutCheck,
  decide: () => decide,
  declineBlocked: () => declineBlocked,
  declineInvite: () => declineInvite,
  declineOffer: () => declineOffer,
  depositOptions: () => depositOptions,
  depositPayout: () => depositPayout,
  dietCost: () => dietCost,
  dietForm: () => dietForm,
  displayName: () => displayName,
  divisionKey: () => divisionKey,
  divisionOptions: () => divisionOptions,
  doTraining: () => doTraining,
  donate: () => donate,
  downgradeClub: () => downgradeClub,
  effectChips: () => effectChips,
  effectiveStats: () => effectiveStats,
  entryAnswer: () => entryAnswer,
  entryGo: () => entryGo,
  errandMs: () => errandMs,
  errandOptions: () => errandOptions,
  errandsLeft: () => errandsLeft,
  expectedPurses: () => expectedPurses,
  expeditionBlocked: () => expeditionBlocked,
  expeditionById: () => expeditionById,
  expeditionCost: () => expeditionCost,
  familyForm: () => familyForm,
  familyHelpOffer: () => familyHelpOffer,
  farewellAvailable: () => farewellAvailable,
  fightRange: () => fightRange,
  fighterName: () => fighterName,
  fotoPost: () => fotoPost,
  fotoPostOptions: () => fotoPostOptions,
  foundationLegacy: () => foundationLegacy,
  foundationOpen: () => foundationOpen,
  fullName: () => fullName,
  gearCost: () => gearCost,
  gearMod: () => gearMod,
  goDagestan: () => goDagestan,
  goExpedition: () => goExpedition,
  h2hWords: () => h2hWords,
  hasLabs: () => hasLabs,
  introText: () => introText,
  investAcademy: () => investAcademy,
  inviteChance: () => inviteChance,
  isAmateurRun: () => isAmateurRun,
  isDoubleChamp: () => isDoubleChamp,
  isExclusiveContract: () => isExclusiveContract,
  jobSalary: () => jobSalary,
  kebabIncome: () => kebabIncome,
  legacyScore: () => legacyScore,
  loanOffer: () => loanOffer,
  loanRefusal: () => loanRefusal,
  mainRecord: () => mainRecord,
  mainRecordLabel: () => mainRecordLabel,
  marketWarnings: () => marketWarnings,
  medalCount: () => medalCount,
  momentTone: () => momentTone,
  msgChance: () => msgChance,
  negotiateChance: () => negotiateChance,
  negotiateContract: () => negotiateContract,
  negotiateOffer: () => negotiateOffer,
  nemesisFighter: () => nemesisFighter,
  newGame: () => newGame,
  openDeposit: () => openDeposit,
  phoneUnread: () => phoneUnread,
  pickClub: () => pickClub,
  pickContract: () => pickContract,
  pitchBlocked: () => pitchBlocked,
  pitchChance: () => pitchChance,
  pitchPay: () => pitchPay,
  pitchSponsor: () => pitchSponsor,
  pl: () => pl,
  plannedFights: () => plannedFights,
  playerOvr: () => playerOvr,
  podcastListen: () => podcastListen,
  podcastRival: () => podcastRival,
  pointEffects: () => pointEffects,
  postAnswer: () => postAnswer,
  prepCost: () => prepCost,
  pressAnswer: () => pressAnswer,
  pressContext: () => pressContext,
  pressEligible: () => pressEligible,
  projectedAfter: () => projectedAfter,
  quickAmateur: () => quickAmateur,
  quickNeedsBudget: () => quickNeedsBudget,
  randomProfile: () => randomProfile,
  rankStr: () => rankStr,
  rankingTable: () => rankingTable,
  rawLegacy: () => rawLegacy,
  recStr: () => recStr,
  refuseShadyDeal: () => refuseShadyDeal,
  rehabCost: () => rehabCost,
  rehabYear: () => rehabYear,
  repNego: () => repNego,
  retire: () => retire,
  retireBonus: () => retireBonus,
  seasonNext: () => seasonNext,
  seasonSkip: () => seasonSkip,
  setBackroom: () => setBackroom,
  setCoach: () => setCoach,
  setDiet: () => setDiet,
  setFarewell: () => setFarewell,
  setJob: () => setJob,
  setManager: () => setManager,
  setPerks: () => setPerks,
  setSocial: () => setSocial,
  setTickets: () => setTickets,
  setWantFights: () => setWantFights,
  setYearGoal: () => setYearGoal,
  signingAmount: () => signingAmount,
  sponsorCap: () => sponsorCap,
  sponsorHalf: () => sponsorHalf,
  sponsorPoolOf: () => sponsorPoolOf,
  startErrand: () => startErrand,
  startSeason: () => startSeason,
  syncRival: () => syncRival,
  takeBreakYear: () => takeBreakYear,
  takeFamilyHelp: () => takeFamilyHelp,
  takeLoan: () => takeLoan,
  tasmaDeal: () => tasmaDeal,
  tasmaItems: () => tasmaItems,
  testPreview: () => testPreview,
  tierLabel: () => tierLabel,
  toMarket: () => toMarket,
  toSummary: () => toSummary,
  totalWins: () => totalWins,
  tourneyResultText: () => tourneyResultText,
  trainingForecast: () => trainingForecast,
  trainingPreview: () => trainingPreview,
  upcomingOffer: () => upcomingOffer,
  vary: () => vary6,
  weekAnswer: () => weekAnswer,
  weekChance: () => weekChance,
  weekGo: () => weekGo,
  weighIn: () => weighIn,
  weightLabel: () => weightLabel,
  weightMissChance: () => weightMissChance,
  weightShift: () => weightShift,
  yearGoalOptions: () => yearGoalOptions,
  yearGoalReward: () => yearGoalReward
});

// src/engine/managers.ts
var MANAGERS = [
  {
    id: "zdzisiek",
    name: "Mirek \u201ETelefon\u201D Kaczmarek",
    desc: "Stara szko\u0142a. Walki za\u0142atwia jednym telefonem do kolegi z federacji. Tani i zawsze odbiera.",
    cut: 0.05,
    purse: 1.1,
    negotiate: 5,
    quality: 0,
    focus: 0.95,
    promo: 0,
    sponsor: 3
  },
  {
    id: "okulary",
    name: "Kamil Wro\u0144ski \xB7 KW Fight",
    desc: "Okulary przeciws\u0142oneczne o 23:00 i trzy telefony naraz. Twierdzi, \u017Ce zna wszystkich w federacji.",
    cut: 0.15,
    purse: 1.22,
    negotiate: 10,
    quality: 1,
    focus: 0.65,
    promo: 2,
    sponsor: 0,
    stable: ["jakiego\u015B rapera, kt\xF3ry chce walczy\u0107", "kuzyna z \u0141odzi"]
  },
  {
    id: "spinacz",
    name: "Agencja Naro\u017Cnik",
    desc: "Porz\u0105dne umowy, Excel i kawa z ekspresu. Sponsorzy ich lubi\u0105.",
    cut: 0.1,
    purse: 1.2,
    negotiate: 12,
    quality: 1,
    focus: 0.85,
    promo: 1,
    sponsor: 10,
    stable: ["trzech zawodnik\xF3w z Krakowa", "dziewczyn\u0119, kt\xF3ra w\u0142a\u015Bnie dosta\u0142a kontrakt w Ameryce"]
  },
  {
    id: "paradygmat",
    name: "Hype Media Group",
    desc: "Media i sponsorzy na pierwszym miejscu, walki troch\u0119 dalej.",
    cut: 0.12,
    purse: 1.15,
    negotiate: 8,
    quality: 0,
    focus: 0.8,
    promo: 1,
    sponsor: 18,
    stable: ["dw\xF3ch youtuber\xF3w", "by\u0142ego pi\u0142karza, kt\xF3ry zaczyna MMA"]
  },
  {
    id: "dominacja",
    name: "Apex Fight Management",
    desc: "Stajnia mistrz\xF3w z Florydy. Wywalcz\u0105 ci walk\u0119 o pas, ale jeste\u015B jednym z czterdziestu.",
    cut: 0.18,
    purse: 1.45,
    negotiate: 25,
    quality: 2,
    focus: 0.5,
    promo: 2,
    sponsor: 8,
    titleShot: true,
    stable: ["trzech mistrz\xF3w wagi lekkiej", "Dagesta\u0144czyka, kt\xF3ry nie przegra\u0142 od siedmiu lat", "by\u0142ego mistrza po zawieszeniu"]
  }
];
function managerById(id) {
  if (!id) return null;
  return MANAGERS.find((m) => m.id === id) ?? null;
}
function currentManager(s) {
  if (s.manager !== void 0) return managerById(s.manager);
  return s.flags.manager ? managerById("okulary") : null;
}
function activeManager(s) {
  const m = currentManager(s);
  if (!m) return null;
  if (s.run && s.run.mgrFocus === false) return null;
  return m;
}
function managerBlocked(s, m) {
  if (s.tier < 1) return "Mened\u017Cerowie bior\u0105 zawodowc\xF3w, nie amator\xF3w.";
  if (m.id === "spinacz" && s.tier < 2 && s.media < 25) return "Bior\u0105 zawodnik\xF3w z ligi krajowej albo z nazwiskiem (media 25+).";
  if (m.id === "paradygmat" && s.media < 35) return "Bior\u0105 tylko rozpoznawalnych (media 35+).";
  if (m.id === "dominacja" && !(s.tier >= 4 || s.tier === 3 && s.rank !== null && s.rank <= 10)) return "Bior\u0105 tylko top 10 w du\u017Cej federacji.";
  return null;
}

// src/engine/rng.ts
function createRng(seed) {
  let s = seed >>> 0;
  const next = () => {
    s = s + 1831565813 >>> 0;
    let t = s;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const rng = {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    d20: () => 1 + Math.floor(next() * 20),
    chance: (p) => next() < p,
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    weighted: (items) => {
      const total = items.reduce((a, b) => a + Math.max(0, b.w), 0);
      let r = next() * total;
      for (const it of items) {
        r -= Math.max(0, it.w);
        if (r <= 0) return it.item;
      }
      return items[items.length - 1].item;
    },
    shuffle: (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    state: () => s
  };
  return rng;
}

// src/engine/threads.ts
var sc = (s) => [1, 1.5, 3, 5, 8][Math.min(4, Math.max(0, s.tier))] ?? 1;
var zl = (s, n) => Math.max(50, Math.round(n * sc(s) / 50) * 50);
var pro = (s) => s.tier >= 1 && !!s.proDebut;
var lastWin = (s) => s.history[s.history.length - 1]?.result === "W";
function twistName(n) {
  if (n.endsWith("ski")) return `${n.slice(0, -3)}cki`;
  if (n.endsWith("cki")) return `${n.slice(0, -3)}ski`;
  if (n.endsWith("ak")) return `${n.slice(0, -2)}ek`;
  if (n.endsWith("ek")) return `${n.slice(0, -2)}ak`;
  return `${n.slice(0, -1)}o`;
}
var THREADS = [
  // ---------- Torba z szatni ----------
  {
    id: "torba.start",
    app: "gym",
    from: "Mietek",
    title: "Kto\u015B zwin\u0105\u0142 twoj\u0105 torb\u0119",
    start: { weight: 6, cond: () => true },
    text: () => "Ziomek, twojej torby nie ma w szatni. R\u0119kawice, ochraniacz, nawet te klapki w kropki. Kamera nad wej\u015Bciem od 2019 roku jest atrap\u0105, sam j\u0105 wiesza\u0142em.",
    choices: (s) => [
      { label: "Kupujesz nowy sprz\u0119t", desc: "Boli w portfelu, ale masz porz\u0105dne rzeczy.", effects: { money: -zl(s, 600), gear: -40, follow: { step: "torba.tasma", after: 2 } } },
      { label: "Po\u017Cyczasz stary z klubu", desc: "R\u0119kawice pami\u0119taj\u0105 jeszcze poprzedniego trenera.", effects: { gear: 30, note: "r\u0119kawice pachn\u0105 rokiem 2009", follow: { step: "torba.tasma", after: 2 } } },
      { label: "Zg\u0142aszasz na policj\u0119", desc: "Dzielnicowy obiecuje \u201Eprzyjrze\u0107 si\u0119 sprawie\u201D.", effects: { gear: 20, follow: { step: "torba.policja", after: 3 } } }
    ]
  },
  {
    id: "torba.tasma",
    note: true,
    app: "tasma",
    from: "Sporty walki \u2014 kupi\u0119/sprzedam",
    title: "Ta torba wygl\u0105da znajomo",
    text: () => "Nowe og\u0142oszenie: \u201ETorba sportowa z wyposa\u017Ceniem, r\u0119kawice prawie nowe, klapki gratis. Cena do negocjacji. Odbi\xF3r osobisty, osiedle S\u0142oneczne.\u201D Na zdj\u0119ciu twoje klapki w kropki.",
    choices: (s) => [
      { label: "Odkupujesz swoj\u0105 torb\u0119", desc: "P\u0142acisz z\u0142odziejowi za w\u0142asne rzeczy.", effects: { money: -zl(s, 300), gear: -25, note: "sprzedawca m\xF3wi \u201Edobry wyb\xF3r, szefie\u201D" } },
      {
        label: "Umawiasz si\u0119 i \u201Eodbierasz\u201D",
        desc: "Idziesz na odbi\xF3r w bluzie klubowej.",
        chance: 60,
        success: { gear: -30, rep: 2 },
        successText: "Sprzedawca widzi twoje uszy, oddaje torb\u0119 i dorzuca przeprosiny. Klapki wyprane.",
        fail: { rep: -4, media: 2, nextFight: -2 },
        failText: "Okazuje si\u0119, \u017Ce sprzedawca te\u017C trenuje. Kickboxing. Wracasz z torb\u0105 i podbitym okiem, a nagranie l\u0105duje w KlatkaNews."
      },
      { label: "Wysy\u0142asz link dzielnicowemu", desc: "Niech prawo dzia\u0142a.", effects: { follow: { step: "torba.policja", after: 1 } } }
    ]
  },
  {
    id: "torba.policja",
    app: "sms",
    from: "Dzielnicowy Zbyszek",
    title: "Odzyskali\u015Bmy torb\u0119",
    text: () => "Dzie\u0144 dobry, tu dzielnicowy. Odzyskali\u015Bmy pana torb\u0119. R\u0119kawice niestety kto\u015B ju\u017C przetestowa\u0142 na z\u0142odzieju rower\xF3w, ale klapki s\u0105 ca\u0142e.",
    choices: () => [
      { label: "Odbierasz i dzi\u0119kujesz", desc: "Przynosisz p\u0105czki na komisariat.", effects: { gear: -15, rep: 1 } },
      { label: "Zostawiasz klapki jako dow\xF3d", desc: "Niech s\u0142u\u017C\u0105 sprawiedliwo\u015Bci.", effects: { media: 1, note: "klapki w aktach sprawy" } }
    ]
  },
  // ---------- Okazja na Oliksie ----------
  {
    id: "okazja.start",
    note: true,
    app: "tasma",
    from: "Sporty walki \u2014 kupi\u0119/sprzedam",
    title: "R\u0119kawice za p\xF3\u0142 ceny",
    start: { weight: 5, cond: (s) => (s.gear ?? 0) >= 20 },
    text: () => "Og\u0142oszenie: \u201ER\u0119kawice FAJRTEKS 16 oz, NOWE, orygina\u0142 100%, za p\xF3\u0142 ceny, bo kupi\u0142em za du\u017Ce. Wysy\u0142ka po wp\u0142acie zaliczki albo odbi\xF3r pod Biedronk\u0105.\u201D",
    choices: (s) => [
      {
        label: "Wp\u0142acasz zaliczk\u0119",
        desc: "Sprzedawca ma 3 pozytywne opinie. Z czego 2 od siebie.",
        chance: 40,
        success: { money: -zl(s, 250), gear: -35 },
        successText: "Paczka przychodzi. R\u0119kawice prawdziwe, sprzedawca nawet dorzuci\u0142 naklejk\u0119. Czasem si\u0119 udaje.",
        fail: { money: -zl(s, 250), follow: { step: "okazja.scam", after: 1 } },
        failText: "Paczka nie przychodzi. Sprzedawca od wczoraj \u201Enie ma zasi\u0119gu\u201D."
      },
      {
        label: "Tylko odbi\xF3r osobisty",
        desc: "Pod Biedronk\u0105, o 21:00, got\xF3wka.",
        chance: 55,
        success: { money: -zl(s, 500), gear: -35 },
        successText: "R\u0119kawice jak nowe. Sprzedawca naprawd\u0119 kupi\u0142 za du\u017Ce.",
        fail: { money: -zl(s, 500), gear: -10, follow: { step: "okazja.fake", after: 1 } },
        failText: "Na \u017Cywo wygl\u0105daj\u0105 dobrze. Logo troch\u0119 krzywe, ale kto by si\u0119 przygl\u0105da\u0142."
      },
      { label: "Kupujesz w sklepie", desc: "Dro\u017Cej, ale z paragonem.", effects: { money: -zl(s, 900), gear: -40 } }
    ]
  },
  {
    id: "okazja.scam",
    note: true,
    app: "bank",
    from: "Rewolwer",
    title: "Reklamacja odrzucona",
    text: () => "\u201ETwoja reklamacja przelewu zosta\u0142a odrzucona. Przelew wykonano zgodnie z dyspozycj\u0105.\u201D Na Oliksie pi\u0119\u0107 os\xF3b pisze, \u017Ce te\u017C wp\u0142aci\u0142o zaliczk\u0119 temu samemu go\u015Bciowi.",
    choices: (s) => [
      { label: "Ostrzegasz innych na grupie", desc: "Przynajmniej nikt wi\u0119cej si\u0119 nie nabierze.", effects: { rep: 1, media: 1, note: "admin banuje sprzedawc\u0119 po trzech dniach" } },
      { label: "Kupujesz r\u0119kawice w sklepie", desc: "Nauczka kosztuje podw\xF3jnie.", effects: { money: -zl(s, 900), gear: -35 } },
      { label: "Trenujesz w starych", desc: "Jeszcze troch\u0119 wytrzymaj\u0105.", effects: { gear: 15 } }
    ]
  },
  {
    id: "okazja.fake",
    app: "gym",
    from: "Mietek",
    title: "Z r\u0119kawicy wysz\u0142a g\u0105bka",
    text: () => "Stary, z twojej nowej r\u0119kawicy wysz\u0142a \u017C\xF3\u0142ta g\u0105bka. Le\u017Cy na macie. To jaki\u015B nowy model, \u017Ce si\u0119 sam rozbiera? \u{1F602}",
    choices: (s) => [
      { label: "Kupujesz porz\u0105dne", desc: "Tym razem w sklepie.", effects: { money: -zl(s, 900), gear: -40 } },
      {
        label: "Sklejasz ta\u015Bm\u0105",
        desc: "Srebrna ta\u015Bma naprawi wszystko.",
        chance: 70,
        success: { gear: 15 },
        successText: "Trzyma. Wygl\u0105da jak z filmu o Rockym, ale trzyma.",
        fail: { gear: 20, nextFight: -2, wear: 2 },
        failText: "Na sparingu ta\u015Bma puszcza i rozcinasz koledze \u0142uk brwiowy. Potem on tobie."
      }
    ]
  },
  // ---------- Dojazd na galę ----------
  {
    id: "dojazd.start",
    note: true,
    app: "mapka",
    from: "Gugle Mapy",
    title: "Jak dojedziesz na gal\u0119?",
    start: { weight: 4, cond: (s) => pro(s) && s.tier <= 2, repeat: true },
    text: () => "Gala w drugim ko\u0144cu Polski. Organizator nie zapewnia transportu. Gugle Mapy pokazuj\u0105 6 godzin drogi i trzy objazdy.",
    choices: (s) => [
      {
        label: "Poci\u0105g InterTrz\u0119\u015B",
        desc: "Tanio i mo\u017Cna si\u0119 przespa\u0107. Je\u015Bli przyjedzie.",
        chance: 70,
        success: { money: -zl(s, 150), nextFight: 1 },
        successText: "Poci\u0105g na czas. Przesypiasz ca\u0142\u0105 drog\u0119 i wysiadasz wypocz\u0119ty.",
        fail: { money: -zl(s, 150), nextFight: -3 },
        failText: "Op\xF3\u017Anienie 140 minut z powodu \u201Eutrudnie\u0144\u201D. Na wa\u017Cenie wbiegasz w kurtce."
      },
      {
        label: "Aplikacja Podw\xF3zka",
        desc: "Obcy kierowca, 80 z\u0142, \u201Eklima jest\u201D.",
        chance: 60,
        success: { money: -zl(s, 80) },
        successText: "Kierowca s\u0142ucha disco polo, ale jedzie r\xF3wno i nie gada.",
        fail: { money: -zl(s, 80), nextFight: -2 },
        failText: "Kierowca przez 6 godzin opowiada o te\u015Bciowej. Nie \u015Bpisz ani minuty."
      },
      {
        label: "Autem kumpla Seby",
        desc: "Seba jedzie dopingowa\u0107. Auto ma 21 lat.",
        chance: 55,
        success: { money: -zl(s, 100), nextFight: 1, follow: { step: "dojazd.mandat", after: 2 } },
        successText: "Seba prowadzi jak kierowca rajdowy. Jeste\u015Bcie dwie godziny przed czasem.",
        fail: { money: -zl(s, 100), follow: { step: "dojazd.laweta", after: 1 } },
        failText: "Doje\u017Cd\u017Cacie, ale pod koniec co\u015B zaczyna stuka\u0107 w silniku. Seba m\xF3wi, \u017Ce \u201Etak ma\u201D."
      }
    ]
  },
  {
    id: "dojazd.laweta",
    app: "sms",
    from: "Seba",
    title: "Laweta",
    text: () => "Mordo, w drodze powrotnej silnik pad\u0142 pod \u0141odzi\u0105. Laweta to 900 z\u0142. Dzielimy na p\xF3\u0142? Ty przecie\u017C zarabiasz w klatce.",
    choices: (s) => [
      { label: "P\u0142acisz po\u0142ow\u0119", desc: "Sprawiedliwie.", effects: { money: -zl(s, 450) } },
      { label: "P\u0142acisz ca\u0142o\u015B\u0107", desc: "Jechali\u015Bcie na twoj\u0105 walk\u0119.", effects: { money: -zl(s, 900), rep: 1, note: "Seba m\xF3wi o tobie \u201Ebrat\u201D" } },
      { label: "To jego auto, jego problem", desc: "Formalnie masz racj\u0119.", effects: { follow: { step: "dojazd.seba", after: 2 } } }
    ]
  },
  {
    id: "dojazd.mandat",
    app: "sms",
    from: "Seba",
    title: "Fotoradar",
    text: () => "Mordo, przysz\u0142o zdj\u0119cie z fotoradaru. 87 na godzin\u0119 w terenie zabudowanym, a ty na fotelu pasa\u017Cera \u015Bpisz z otwart\u0105 buzi\u0105 \u{1F602} Mandat 500 z\u0142 na mnie, ale jechali\u015Bmy na TWOJ\u0104 gal\u0119. Dorzucisz si\u0119?",
    choices: (s) => [
      { label: "Oddajesz ca\u0142o\u015B\u0107", desc: "Bez dyskusji.", effects: { money: -zl(s, 500) } },
      { label: "Oddajesz po\u0142ow\u0119", desc: "To on trzyma\u0142 nog\u0119 na gazie.", effects: { money: -zl(s, 250) } },
      { label: "Wrzucasz zdj\u0119cie na Instagrym", desc: "\u201EPrzygotowanie mentalne przed walk\u0105\u201D.", effects: { media: 2, follow: { step: "dojazd.seba", after: 1 } } }
    ]
  },
  {
    id: "dojazd.seba",
    app: "gym",
    from: "Seba",
    title: "Niekt\xF3rzy zapominaj\u0105",
    text: () => "niekt\xF3rzy zapominaj\u0105 kto ich wozi\u0142 na gale \u{1F642}",
    choices: (s) => [
      { label: "Przepraszasz i oddajesz kas\u0119", desc: "Kumpel jest jeden.", effects: { money: -zl(s, 400), rep: 1 } },
      { label: "Ignorujesz", desc: "Przejdzie mu.", effects: { rep: -1, note: "Seba nie przyjdzie na nast\u0119pn\u0105 gal\u0119" } }
    ]
  },
  // ---------- Auto pod halą ----------
  {
    id: "parking.start",
    note: true,
    app: "mapka",
    from: "Gugle Mapy",
    title: "Parking pod hal\u0105",
    start: { weight: 4, cond: (s) => pro(s) },
    text: () => "Parking pod hal\u0105 pe\u0142ny. Jest jedno miejsce przy zakazie, tu\u017C przy wej\u015Bciu dla zawodnik\xF3w.",
    choices: () => [
      {
        label: "Stajesz na zakazie",
        desc: "Przecie\u017C tylko na chwil\u0119. Na cztery godziny.",
        chance: 35,
        success: { note: "nikt si\u0119 nie przyczepi\u0142" },
        successText: "Auto stoi tam, gdzie je zostawi\u0142e\u015B. Tym razem si\u0119 uda\u0142o.",
        fail: { follow: { step: "parking.holownik", after: 1 } },
        failText: "Biegn\u0105c na rozgrzewk\u0119, widzisz stra\u017Cnika miejskiego z notesem."
      },
      { label: "Parkujesz 2 km dalej", desc: "Idziesz z torb\u0105 przez p\xF3\u0142 miasta.", effects: { wear: 1, note: "rozgrzewka gratis" } }
    ]
  },
  {
    id: "parking.holownik",
    app: "sms",
    from: "Stra\u017C Miejska",
    title: "Pojazd odholowany",
    text: () => "Informujemy, \u017Ce pojazd zosta\u0142 odholowany na parking depozytowy. Op\u0142ata 600 z\u0142 plus 50 z\u0142 za ka\u017Cd\u0105 rozpocz\u0119t\u0105 dob\u0119. Godziny otwarcia: pn\u2013pt 8:00\u201315:00.",
    choices: (s) => [
      { label: "P\u0142acisz od razu", desc: "Taks\xF3wka na parking depozytowy te\u017C kosztuje.", effects: { money: -zl(s, 650) } },
      { label: "Odbierasz za tydzie\u0144", desc: "Nie masz czasu, masz treningi.", effects: { money: -zl(s, 1e3) } },
      {
        label: "Piszesz odwo\u0142anie",
        desc: "Znak by\u0142 zas\u0142oni\u0119ty przez kibica z flag\u0105.",
        chance: 20,
        success: { note: "odwo\u0142anie uwzgl\u0119dnione" },
        successText: "Odwo\u0142anie uwzgl\u0119dnione. Urz\u0119dnik okaza\u0142 si\u0119 twoim kibicem.",
        fail: { money: -zl(s, 850) },
        failText: "Odwo\u0142anie odrzucone. Za czas odwo\u0142ania naliczyli kolejne doby."
      }
    ]
  },
  // ---------- Podkast ----------
  {
    id: "podkast.start",
    app: "sms",
    from: "Na Macie u Zdzicha",
    title: "Zaproszenie do podcastu",
    start: { weight: 5, cond: (s) => pro(s) && s.media >= 5 },
    text: () => "Siema, tu Zdzichu z \u201ENa Macie\u201D. Nagrywamy w czwartek u mnie w piwnicy, dwa mikrofony, lampka jest, pe\u0142en profesjonalizm. Na koniec i tak ci\u0119 zapytam, jaki masz plan na najbli\u017Csz\u0105 walk\u0119, wi\u0119c przygotuj co\u015B dobrego \u{1F399}\uFE0F",
    choices: (s) => [
      { label: "Opowiadasz plan ze szczeg\xF3\u0142ami", desc: "Ludzie lubi\u0105 konkrety.", effects: { media: 3, nextFight: -3, note: "rywal ogl\u0105da odcinek dwa razy" } },
      { label: "Jedziesz po organizatorze gali", desc: "\u201EP\u0142ac\u0105 grosze i robi\u0105 cyrk.\u201D", effects: { media: 5, rep: -2, follow: { step: "podkast.gala", after: 1 } } },
      s.sponsors.length ? { label: "Chwalisz sponsora i trenera", desc: "\u0141adnie, z nazwy.", effects: { rep: 2, media: 1, follow: { step: "podkast.sponsor", after: 1 } } } : { label: "Chwalisz trenera i klub", desc: "Bez nich by ci\u0119 nie by\u0142o.", effects: { rep: 2, media: 1 } },
      { label: "\u201EPlan? Wygra\u0107.\u201D", desc: "Zdzichu wzdycha do mikrofonu.", effects: { media: 1 } }
    ]
  },
  {
    id: "podkast.gala",
    app: "sms",
    from: "Organizator gali",
    title: "S\u0142ysza\u0142em podcast",
    text: () => "\u201ES\u0142ysza\u0142em tw\xF3j podcast. Nast\u0119pn\u0105 walk\u0119 masz na karcie wst\u0119pnej o 17:30, przy pustej hali. Pozdrawiam.\u201D",
    choices: () => [
      { label: "Przepraszasz publicznie", desc: "Nagranie z przeprosinami na Instagrym.", effects: { rep: 2, media: -1 } },
      { label: "Podtrzymujesz zdanie", desc: "Prawda w oczy kole.", effects: { media: 2, rep: -2, nextFight: -1, note: "\u0142atka \u201Etrudnego zawodnika\u201D" } }
    ]
  },
  {
    id: "podkast.sponsor",
    app: "sms",
    from: (s) => s.sponsors[0]?.name ?? "Sponsor",
    title: "Premia za reklam\u0119",
    cond: (s) => s.sponsors.length > 0,
    text: () => "\u201EWidzieli\u015Bmy podcast! Sprzeda\u017C w tym tygodniu w g\xF3r\u0119. Przelewamy premi\u0119, tylko powt\xF3rz to jeszcze kiedy\u015B.\u201D",
    choices: (s) => [
      { label: "Dzi\u0119kujesz", desc: "I obiecujesz kolejn\u0105 reklam\u0119.", effects: { money: zl(s, 400) } },
      { label: "Prosisz o d\u0142u\u017Csz\u0105 umow\u0119", desc: "Kuj \u017Celazo, p\xF3ki gor\u0105ce.", chance: 40, success: { money: zl(s, 900) }, successText: "Zgadzaj\u0105 si\u0119 i dorzucaj\u0105 wi\u0119cej.", fail: { money: zl(s, 200) }, failText: "Daj\u0105 mniejsz\u0105 premi\u0119 i \u201Ewr\xF3c\u0105 do tematu\u201D." }
    ]
  },
  // ---------- Wpis po wygranej ----------
  {
    id: "wpis.start",
    note: true,
    app: "fotogram",
    from: "Instagrym",
    title: "Wpis po wygranej",
    start: { weight: 7, cond: (s, c) => pro(s) && !c.pre && lastWin(s), repeat: true },
    text: () => "Po wygranej telefon nie przestaje wibrowa\u0107. Masz u\u0142amek sekundy na wpis, zanim emocje opadn\u0105.",
    choices: (s) => [
      s.rank !== null && s.rank <= 10 ? { label: "Wyzywasz mistrza", desc: "\u201EJeste\u015B nast\u0119pny.\u201D", effects: { media: 4, follow: { step: "wpis.mistrz", after: 1 } } } : { label: "Wyzywasz kogo\u015B z rankingu", desc: "Oznaczasz pierwszego z brzegu.", effects: { media: 3, rep: -1 } },
      { label: "Dzi\u0119kujesz ekipie i mamie", desc: "Zdj\u0119cie z naro\u017Cnikiem.", effects: { relations: 2, rep: 1 } },
      { label: "Zdj\u0119cie z kebabem", desc: "Podpis: \u201Ezas\u0142u\u017Cone\u201D.", effects: { media: 2, follow: { step: "kebab.collab", after: 1 } } }
    ]
  },
  {
    id: "wpis.mistrz",
    app: "fotogram",
    from: "Mistrz federacji",
    title: "Mistrz odpisa\u0142",
    text: () => "\u201ENie znam go\u015Bcia. Ale ch\u0119tnie poznam w klatce.\u201D Pod spodem 3 tysi\u0105ce komentarzy i kto\u015B ju\u017C robi grafik\u0119 z waszymi twarzami.",
    choices: () => [
      { label: "Odpisujesz ostro", desc: "Internet p\u0142onie.", effects: { media: 3, nextFight: -1, note: "nie \u015Bpisz przez komentarze" } },
      { label: "Ignorujesz", desc: "Najpierw najbli\u017Csza walka.", effects: { rep: 1 } }
    ]
  },
  // ---------- Ważka ----------
  {
    id: "wazka.start",
    note: true,
    app: "wazka",
    from: "Wa\u017Cka",
    title: "Za du\u017Co na wadze",
    start: { weight: 4, cond: (s) => pro(s), repeat: true },
    text: (s) => ["\u201EDo wa\u017Cenia 10 dni. Jeste\u015B 3,2 kg nad limitem. Dzisiejsza sugestia: ry\u017C z kurczakiem (posi\u0142ek nr 412).\u201D", "\u201EDo wa\u017Cenia 9 dni. 2,8 kg nad limitem. Wczorajsze pierogi zosta\u0142y zapisane w historii.\u201D", "\u201EDo wa\u017Cenia 11 dni. 3,5 kg nad limitem. Wa\u017Cka przypomina: piwo to te\u017C kalorie.\u201D"][s.season % 3],
    choices: () => [
      { label: "Dieta, powoli i bez cud\xF3w", desc: "Ry\u017C, kurczak, ry\u017C.", effects: { nextFight: 1, note: "ry\u017C \u015Bni ci si\u0119 po nocach" } },
      {
        label: "Sauna i worek na \u015Bmieci",
        desc: "Na ostatnie dni.",
        chance: 70,
        success: {},
        successText: "Mie\u015Bcisz si\u0119 co do grama. Woda wraca wieczorem.",
        fail: { nextFight: -4, wear: 2 },
        failText: "Na wadze si\u0119 mie\u015Bcisz, ale na walk\u0119 wychodzisz jak z suszarki."
      },
      {
        label: "\u201EZbij\u0119 w tydzie\u0144\u201D, a teraz pizza",
        desc: "Co ma by\u0107, to b\u0119dzie.",
        chance: 35,
        success: { note: "jakim\u015B cudem" },
        successText: "Jakim\u015B cudem waga si\u0119 zgadza. Nikt nie wie jak, ty te\u017C nie.",
        fail: { money: -400, nextFight: -3, follow: { step: "kebab.start", after: 1 } },
        failText: "P\xF3\u0142 kilo za du\u017Co. Cz\u0119\u015B\u0107 ga\u017Cy idzie do rywala, a ty idziesz na kebaba z \u017Calu."
      }
    ]
  },
  // ---------- Kebab o północy ----------
  {
    id: "kebab.start",
    note: true,
    app: "klatka",
    from: "KlatkaNews",
    title: "Nagranie z kebaba",
    start: { weight: 3, cond: (s) => pro(s) && s.media >= 8 },
    text: (s) => `\u201E${s.profile.lastName} w trakcie ci\u0119cia wagi zajada kebaba o 1:12 w nocy. WIDEO!\u201D Nagra\u0142 ci\u0119 kto\u015B z kolejki. Wida\u0107 nawet sos czosnkowy.`,
    choices: () => [
      { label: "\u201ETo by\u0142 kebab na wodzie\u201D", desc: "Obracasz w \u017Cart.", effects: { media: 3, follow: { step: "kebab.collab", after: 1 } } },
      {
        label: "M\xF3wisz, \u017Ce to by\u0142 brat",
        desc: "Jeste\u015Bcie troch\u0119 podobni.",
        chance: 40,
        success: { media: 1 },
        successText: "Ludzie wierz\u0105. Brat nie bardzo.",
        fail: { rep: -2, media: 2 },
        failText: "Brat wrzuca zdj\u0119cie z innego miasta z tego samego wieczoru."
      },
      { label: "Milczysz", desc: "Za tydzie\u0144 nikt nie b\u0119dzie pami\u0119ta\u0142.", effects: {} }
    ]
  },
  {
    id: "kebab.collab",
    app: "sms",
    from: "Kebab \u201ESu\u0142tan\u201D z Rynku",
    title: "Rollo twojego imienia?",
    cond: (s) => !s.sponsors.some((x) => x.name.includes("Su\u0142tan")),
    text: (s) => `\u201EPanie ${s.profile.lastName}, by\u0142 pan u nas! Robimy rollo twojego imienia, z podw\xF3jnym mi\u0119sem. P\u0142acimy za ka\u017Cd\u0105 wygran\u0105 i dajemy je\u015B\u0107 za darmo.\u201D`,
    choices: (s) => [
      {
        label: "Zgoda",
        desc: "Logo kebaba na spodenkach.",
        effects: { sponsor: { name: "Kebab \u201ESu\u0142tan\u201D", perSeason: zl(s, 1200), seasonsLeft: 2, clause: "zdj\u0119cie z rollo po ka\u017Cdej wygranej" }, media: 2 }
      },
      { label: "Odmawiasz, jeste\u015B na diecie", desc: "Z b\xF3lem serca.", effects: { rep: 1 } }
    ]
  },
  // ---------- Mietek prosi o pomoc ----------
  {
    id: "mietek.start",
    app: "gym",
    from: "Mietek",
    title: "Pomo\u017Cesz przed walk\u0105?",
    start: { weight: 6, cond: () => true },
    text: () => "Ej, za dwa tygodnie walcz\u0119 z ma\u0144kutem, zapa\u015Bnikiem. Porobisz ze mn\u0105 sparingi pod niego? Obalasz i dociskasz, pi\u0119\u0107 rund. Wiem, \u017Ce to katorga, postawi\u0119 kebaba.",
    choices: () => [
      { label: "Pomagasz", desc: "Twoje plecy b\u0119d\u0105 to pami\u0119ta\u0107.", effects: { wear: 2, follow: { step: "mietek.cynk", after: 2 } } },
      { label: "Odmawiasz, masz sw\xF3j ob\xF3z", desc: "Ka\u017Cdy ma swoje sprawy.", effects: { follow: { step: "mietek.foch", after: 1 } } }
    ]
  },
  {
    id: "mietek.cynk",
    app: "gym",
    from: "Mietek",
    title: "Cynk o rywalu",
    text: () => "\u201EPami\u0119tam, jak mi pomog\u0142e\u015B. Sparowa\u0142em kiedy\u015B z twoim najbli\u017Cszym rywalem. Po kopni\u0119ciu zawsze opuszcza lew\u0105 r\u0119k\u0119. Zawsze.\u201D",
    choices: () => [
      { label: "Wpisujesz to w plan", desc: "Trener rozrysowuje to na tablicy.", effects: { nextFight: 4 } },
      { label: "Dzi\u0119kujesz, ale robisz swoje", desc: "Nie zmienia si\u0119 planu przed walk\u0105.", effects: { nextFight: 1, rep: 1 } }
    ]
  },
  {
    id: "mietek.foch",
    app: "gym",
    from: "Mietek",
    title: "Ka\u017Cdy sobie",
    text: () => "ka\u017Cdy sobie.",
    choices: (s) => [
      { label: "Stawiasz piwo i przepraszasz", desc: "Bezalkoholowe, ob\xF3z trwa.", effects: { money: -zl(s, 60) } },
      { label: "Szukasz innego partnera", desc: "Nowy jest o 20 kg ci\u0119\u017Cszy.", effects: { nextFight: -2 } }
    ]
  },
  // ---------- Mama pożycza na obóz ----------
  {
    id: "mama.start",
    app: "sms",
    from: "Mama",
    title: "Pieni\u0105dze na ob\xF3z",
    start: { weight: 6, cond: (s, c) => c.pre && s.money < zl(s, 1500) && s.relations >= 0 },
    text: (s) => `Synek, s\u0142ysza\u0142am, \u017Ce nie masz na ob\xF3z. Mamy z tat\u0105 od\u0142o\u017Cone na Chorwacj\u0119. We\u017A ${zl(s, 2e3).toLocaleString("pl-PL")} z\u0142, oddasz, jak wygrasz.`,
    choices: (s) => [
      { label: "Bierzesz", desc: "Lepszy ob\xF3z, wi\u0119kszy d\u0142ug.", effects: { money: zl(s, 2e3), nextFight: 1, follow: { step: "mama.zwrot", after: 3 } } },
      { label: "Odmawiasz", desc: "Niech jad\u0105 nad morze.", effects: { relations: 1, note: "tata m\xF3wi, \u017Ce jeste\u015B honorowy" } }
    ]
  },
  {
    id: "mama.zwrot",
    app: "sms",
    from: "Mama",
    title: "O tych pieni\u0105dzach",
    text: () => "Synek, nie naciskam, ale pani z biura podr\xF3\u017Cy dzwoni\u0142a, \u017Ce zosta\u0142y ostatnie miejsca na wrzesie\u0144.",
    choices: (s) => [
      { label: "Oddajesz ca\u0142o\u015B\u0107", desc: "S\u0142owo to s\u0142owo.", effects: { money: -zl(s, 2e3), relations: 3 } },
      { label: "Oddajesz po\u0142ow\u0119", desc: "I obiecujesz reszt\u0119.", effects: { money: -zl(s, 1e3) } },
      { label: "\u201EPo nast\u0119pnej walce\u201D", desc: "Mama m\xF3wi \u201Edobrze\u201D, ale inaczej ni\u017C zwykle.", effects: { relations: -3, follow: { step: "mama.tata", after: 2 } } }
    ]
  },
  {
    id: "mama.tata",
    app: "sms",
    from: "Tata",
    title: "Matka nie \u015Bpi",
    text: () => "Matka nie \u015Bpi przez te pieni\u0105dze. Wiesz, co masz zrobi\u0107.",
    choices: (s) => [
      { label: "Oddajesz od razu", desc: "Nawet je\u015Bli boli.", effects: { money: -zl(s, 2e3), relations: 1 } },
      { label: "Znowu przek\u0142adasz", desc: "Wigilia b\u0119dzie cicha.", effects: { relations: -5 } }
    ]
  },
  // ---------- Wujek z Niemiec ----------
  {
    id: "wujek.start",
    app: "sms",
    from: "Wujek Heniek",
    title: "Wujek ma znajomo\u015Bci",
    start: { weight: 3, cond: (s) => s.tier <= 2 },
    text: () => "S\u0142uchaj, ja tu w Niemczech mam znajomo\u015Bci. Daj\u0119 ci pieni\u0105dze i jestem twoim mened\u017Cerem. Tylko na papierze, nic nie musisz robi\u0107.",
    choices: (s) => [
      { label: "Bierzesz pieni\u0105dze", desc: "Co mo\u017Ce p\xF3j\u015B\u0107 nie tak?", effects: { money: zl(s, 2500), follow: { step: "wujek.umowa", after: 2 } } },
      { label: "Dzi\u0119kujesz, ale nie", desc: "Wujek m\xF3wi \u201Ejak chcesz\u201D i roz\u0142\u0105cza si\u0119.", effects: { relations: -1 } }
    ]
  },
  {
    id: "wujek.umowa",
    app: "sms",
    from: "Wujek Heniek",
    title: "Za\u0142atwione!",
    text: () => "\u201EZa\u0142atwi\u0142em! Walka w Niemczech na gali K\xC4FIG KRIEG. Przeciwnik to kulturysta z internetu, 130 kg. P\u0142ac\u0105 dobrze. Wyjazd w pi\u0105tek, bus spod ko\u015Bcio\u0142a.\u201D",
    choices: (s) => [
      {
        label: "Jedziesz",
        desc: "Kasa jest kasa.",
        chance: 75,
        success: { money: zl(s, 4e3), media: 4, rep: -3 },
        successText: "Kulturysta pada po 40 sekundach. Niemiecki internet szaleje, polski si\u0119 \u015Bmieje.",
        fail: { money: zl(s, 2e3), media: 3, rep: -5, wear: 3 },
        failText: "Kulturysta przygniata ci\u0119 do siatki na trzy rundy. Przegrywasz na punkty z kim\u015B, kto nie umie kopa\u0107."
      },
      { label: "Odmawiasz i oddajesz pieni\u0105dze", desc: "Kariera sportowa wa\u017Cniejsza.", effects: { money: -zl(s, 2500), relations: -2, rep: 1 } },
      { label: "Odmawiasz i nie oddajesz", desc: "Przecie\u017C to by\u0142 prezent.", effects: { relations: -6, note: "wigilia b\u0119dzie ciekawa" } }
    ]
  },
  // ---------- Bramka w „Prestiżu” ----------
  {
    id: "bramka.start",
    app: "gym",
    from: "Dawid z bramki",
    title: "Fucha na sobot\u0119",
    start: { weight: 5, cond: (s) => s.tier <= 2 && s.age >= 18 },
    text: (s) => `Potrzebuj\u0119 kogo\u015B na bramk\u0119 w klubie \u201EPresti\u017C\u201D w sobot\u0119. ${zl(s, 400)} z\u0142 za noc, do 4:00. Krawat dam.`,
    choices: (s) => [
      { label: "Bierzesz zmian\u0119", desc: "Kasa si\u0119 przyda, sen mniej.", effects: { money: zl(s, 400), nextFight: -1, follow: { step: "bramka.film", after: 1 } } },
      { label: "Odmawiasz", desc: "Sobota to sparingi.", effects: { nextFight: 1 } }
    ]
  },
  {
    id: "bramka.film",
    note: true,
    app: "klatka",
    from: "KlatkaNews",
    title: "Wideo z bramki",
    text: () => "\u201EZawodnik MMA wynosi awanturnika z klubu jak worek ziemniak\xF3w.\u201D Kto\u015B nagra\u0142, jak wynosisz go\u015Bcia w r\xF3\u017Cowej koszuli. 40 tysi\u0119cy wy\u015Bwietle\u0144.",
    choices: () => [
      {
        label: "Udost\u0119pniasz z dopiskiem",
        desc: "\u201EBez przemocy, sama technika.\u201D",
        chance: 70,
        success: { media: 4, rep: 1, follow: { step: "bramka.wlasciciel", after: 1 } },
        successText: "Internet ci\u0119 kocha. Kto\u015B robi z tego mem z muzyk\u0105 z westernu.",
        fail: { media: 3, rep: -3 },
        failText: "Okazuje si\u0119, \u017Ce go\u015B\u0107 w r\xF3\u017Cowej koszuli to syn radnego. Radny pisze list otwarty."
      },
      { label: "Prosisz o usuni\u0119cie", desc: "Nie chcesz \u0142atki ochroniarza.", effects: { rep: 1 } }
    ]
  },
  {
    id: "bramka.wlasciciel",
    app: "sms",
    from: "W\u0142a\u015Bciciel klubu \u201EPresti\u017C\u201D",
    title: "Podoba mi si\u0119, jak pracujesz",
    cond: (s) => !s.sponsors.some((x) => x.name.includes("Presti\u017C")),
    text: () => "\u201EWidzia\u0142em film. Chcesz logo \xBBPresti\u017Cu\xAB na spodenkach? P\u0142ac\u0119 i masz wej\u015Bcie VIP do ko\u0144ca \u017Cycia.\u201D",
    choices: (s) => [
      { label: "Bierzesz", desc: "Logo dyskoteki na spodenkach.", effects: { sponsor: { name: "Klub \u201EPresti\u017C\u201D", perSeason: zl(s, 1500), seasonsLeft: 2, clause: "raz w miesi\u0105cu stoisz na bramce" }, media: 1 } },
      { label: "Odmawiasz", desc: "Nie chcesz kojarzy\u0107 si\u0119 z dyskotek\u0105.", effects: { rep: 1 } }
    ]
  },
  // ---------- „Witaminki” ----------
  {
    id: "witaminki.start",
    app: "fotogram",
    from: "@mass_monster_pl",
    title: "Co\u015B na regeneracj\u0119",
    start: { weight: 4, cond: (s) => pro(s) && !s.flags.witaminki },
    text: (s) => `Brachu, mam co\u015B na regeneracj\u0119. Zero wykrywalno\u015Bci, wszyscy w federacji bior\u0105. Kuracja ${zl(s, 800)} z\u0142, wysy\u0142ka dyskretna.`,
    choices: (s) => [
      { label: "Bierzesz", desc: "Wszyscy bior\u0105, prawda?", effects: { money: -zl(s, 800), nextFight: 3, flag: "witaminki", follow: { step: "witaminki.test", after: 2 } } },
      { label: "Blokujesz konto", desc: "Nie ten sport.", effects: { rep: 1 } },
      { label: "Zg\u0142aszasz do federacji", desc: "Ze zrzutami ekranu.", effects: { rep: 2, media: 1, note: "federacja dzi\u0119kuje i nic nie robi" } }
    ]
  },
  {
    id: "witaminki.test",
    app: "sms",
    from: "Komisja Antydopingowa",
    title: "Wynik kontroli",
    text: () => "Kontrola antydopingowa po ostatniej walce. Pr\xF3bka A zosta\u0142a zbadana. Wynik w za\u0142\u0105czniku. Prosimy usi\u0105\u015B\u0107 przed otwarciem.",
    choices: (s) => [
      {
        label: "Otwierasz za\u0142\u0105cznik",
        desc: "R\u0119ce si\u0119 trz\u0119s\u0105.",
        chance: 35,
        success: { note: "wynik negatywny" },
        successText: "Wynik negatywny. Tym razem si\u0119 uda\u0142o. Nast\u0119pnym razem mo\u017Ce nie.",
        fail: { rep: -10, media: 3, money: -zl(s, 2e3), nextFight: -4, note: "wpadka dopingowa" },
        failText: "Wynik pozytywny. Kara finansowa, zawieszenie i nag\u0142\xF3wek \u201ESKANDAL\u201D na KlatkaNews. Sponsorzy przestaj\u0105 odbiera\u0107 telefony."
      },
      {
        label: "\u017B\u0105dasz badania pr\xF3bki B",
        desc: "P\u0142acisz za drugie badanie.",
        chance: 20,
        success: { money: -zl(s, 1500), note: "pr\xF3bka B czysta" },
        successText: "Pr\xF3bka B czysta. Laboratorium przeprasza za \u201Ezanieczyszczenie\u201D.",
        fail: { money: -zl(s, 3500), rep: -11, media: 3, nextFight: -4, note: "pr\xF3bka B potwierdza" },
        failText: "Pr\xF3bka B r\xF3wnie\u017C pozytywna. Teraz jeszcze p\u0142acisz za badanie."
      }
    ]
  },
  // ---------- Gala nie płaci ----------
  {
    id: "przelew.start",
    note: true,
    app: "bank",
    from: "Rewolwer",
    title: "Ga\u017Ca nie wp\u0142yn\u0119\u0142a",
    start: { weight: 3, cond: (s, c) => pro(s) && !c.pre && s.tier <= 2 },
    text: () => "Brak wp\u0142ywu ga\u017Cy z ostatniej gali. Min\u0119\u0142y trzy tygodnie. Organizator odpisuje: \u201Ew tym tygodniu na pewno\u201D.",
    choices: (s) => [
      {
        label: "Czekasz cierpliwie",
        desc: "Ka\u017Cdemu mo\u017Ce si\u0119 zdarzy\u0107.",
        chance: 50,
        success: {},
        successText: "Pieni\u0105dze przychodz\u0105 w pi\u0105tek o 23:58.",
        fail: { money: -zl(s, 700), follow: { step: "przelew.upada", after: 1 } },
        failText: "Przychodzi po\u0142owa. W tytule przelewu: \u201Ereszta wkr\xF3tce\u201D."
      },
      {
        label: "Piszesz codziennie",
        desc: "Rano, w po\u0142udnie i wieczorem.",
        chance: 70,
        success: {},
        successText: "P\u0142ac\u0105 ca\u0142o\u015B\u0107, \u017Ceby si\u0119 od ciebie odczepi\u0107.",
        fail: { money: -zl(s, 700), rep: -1 },
        failText: "Organizator blokuje ci\u0119 wsz\u0119dzie. Przychodzi po\u0142owa."
      },
      { label: "Idziesz do prawnika", desc: "Prawnik bierze zaliczk\u0119.", effects: { money: -zl(s, 500), follow: { step: "przelew.prawnik", after: 2 } } }
    ]
  },
  {
    id: "przelew.upada",
    note: true,
    app: "klatka",
    from: "KlatkaNews",
    title: "Gala og\u0142asza upad\u0142o\u015B\u0107",
    text: () => "\u201EOrganizator gali og\u0142asza zawieszenie dzia\u0142alno\u015Bci.\u201D W komentarzach dwudziestu zawodnik\xF3w pisze, \u017Ce te\u017C czeka na pieni\u0105dze.",
    choices: (s) => [
      { label: "Do\u0142\u0105czasz do pozwu zbiorowego", desc: "Mo\u017Ce za dwa lata co\u015B odzyskacie.", effects: { money: -zl(s, 200), note: "sprawa w toku" } },
      { label: "Odpuszczasz", desc: "Szkoda nerw\xF3w.", effects: { rep: 1 } }
    ]
  },
  {
    id: "przelew.prawnik",
    app: "sms",
    from: "Mecenas Wies\u0142aw",
    title: "Sprawa wygrana",
    text: () => "\u201EWygrali\u015Bmy. Organizator zap\u0142aci z odsetkami. Moja faktura w za\u0142\u0105czniku.\u201D",
    choices: (s) => [{ label: "Otwierasz faktur\u0119", desc: "Z bij\u0105cym sercem.", effects: { money: zl(s, 900) } }]
  },
  // ---------- Skarbówka ----------
  {
    id: "skarb.start",
    app: "sms",
    from: "Ksi\u0119gowa kuzyna",
    title: "Premia w kopercie",
    start: { weight: 3, cond: (s) => pro(s) && s.tier >= 1 && s.totalEarned > 2e4 },
    text: () => "Dzie\u0144 dobry, robi\u0119 panu rozliczenie. Premi\u0119 za nokaut wpisa\u0107? Bo to w kopercie by\u0142o, prawda? \u{1F609}",
    choices: (s) => [
      { label: "Wpisujesz wszystko", desc: "Spokojny sen jest bezcenny.", effects: { money: -zl(s, 400), rep: 1 } },
      {
        label: "Nie wpisujesz",
        desc: "Kto by sprawdza\u0142.",
        chance: 60,
        success: {},
        successText: "Nikt nie pyta. Na razie.",
        fail: { follow: { step: "skarb.kontrola", after: 2 } },
        failText: "Ksi\u0119gowa m\xF3wi \u201Ejak chcesz\u201D i robi min\u0119, kt\xF3rej nie lubisz."
      }
    ]
  },
  {
    id: "skarb.kontrola",
    app: "sms",
    from: "Urz\u0105d Skarbowy",
    title: "Wezwanie",
    text: () => "Wezwanie do z\u0142o\u017Cenia wyja\u015Bnie\u0144 w sprawie przychod\xF3w z gal sport\xF3w walki. Prosimy zabra\u0107 dokumenty i dobry humor.",
    choices: (s) => [
      { label: "P\u0142acisz z odsetkami", desc: "Szybko i bez dyskusji.", effects: { money: -zl(s, 1200) } },
      {
        label: "Idziesz z doradc\u0105",
        desc: "Doradca bierze swoje, ale zna przepisy.",
        chance: 50,
        success: { money: -zl(s, 500) },
        successText: "Doradca znajduje ulg\u0119 dla sportowc\xF3w. P\u0142acisz tylko jego faktur\u0119.",
        fail: { money: -zl(s, 1700) },
        failText: "Doradca m\xF3wi, \u017Ce \u201Emog\u0142o by\u0107 gorzej\u201D. P\u0142acisz podatek, odsetki i jego."
      }
    ]
  },
  // ---------- Kwatera w górach ----------
  {
    id: "kwatera.start",
    app: "sms",
    from: "Trener",
    title: "Ob\xF3z w g\xF3rach",
    start: { weight: 6, cond: (_s, c) => c.pre },
    text: () => "Przed sezonem jedziemy na ob\xF3z w g\xF3ry. Znalaz\u0142em pok\xF3j u g\xF3rala po 60 z\u0142 za dob\u0119 albo hotel ze spa po 300. Ty wybierasz, ty p\u0142acisz.",
    choices: (s) => [
      {
        label: "U g\xF3rala",
        desc: "Tanio i swojsko.",
        chance: 60,
        success: { money: -zl(s, 600), nextFight: 2, follow: { step: "kwatera.goral", after: 1 } },
        successText: "G\xF3ral karmi jak na weselu, a rano budzi ci\u0119 koguta. Forma ro\u015Bnie.",
        fail: { money: -zl(s, 600), wear: 2, nextFight: -1 },
        failText: "W pokoju grzyb na \u015Bcianie i pierzyna z lat 70. Kaszlesz p\xF3\u0142 obozu."
      },
      { label: "Hotel ze spa", desc: "Basen, sauna, zero grzyba.", effects: { money: -zl(s, 2800), nextFight: 2 } },
      { label: "Trenujesz w domu", desc: "Za darmo, ale bez g\xF3r.", effects: {} }
    ]
  },
  {
    id: "kwatera.goral",
    app: "sms",
    from: "G\xF3ral J\xF3zek",
    title: "Sprawdzimy si\u0119?",
    text: () => "\u201EJo tyz trenuje! Zapasy g\xF3ralskie, od dziecka. Sprawdzimy si\u0119 na \u0142\u0105ce za stodo\u0142\u0105?\u201D",
    choices: () => [
      {
        label: "Sparujecie",
        desc: "Co mo\u017Ce g\xF3ral?",
        chance: 50,
        success: { stats: { wrest: 1 } },
        successText: "J\xF3zek rzuca tob\u0105 jak snopkiem siana, ale uczysz si\u0119 wi\u0119cej ni\u017C przez miesi\u0105c na sali.",
        fail: { wear: 2 },
        failText: "J\xF3zek dociska ci\u0119 do \u0142\u0105ki tak, \u017Ce Giewont widzisz od spodu."
      },
      { label: "Grzecznie odmawiasz", desc: "J\xF3zek m\xF3wi, \u017Ce \u201Emioztowi sie boj\u0105\u201D.", effects: { media: 0, note: "J\xF3zek opowiada o tym ca\u0142ej wsi" } }
    ]
  },
  // ---------- Grzybica ----------
  {
    id: "grzyb.start",
    app: "gym",
    from: "Mietek",
    title: "Co\u015B ci wysz\u0142o na \u0142ydce",
    start: { weight: 4, cond: () => true },
    text: () => "Pokaza\u0142e\u015B mi t\u0119 plam\u0119 na \u0142ydce, nie? Czerwona, w k\xF3\u0142ko? Stary, to grzybica. Maty nie myte od Wielkanocy. Nie przychod\u017A na parter, b\u0142agam.",
    choices: (s) => [
      { label: "Ma\u015B\u0107 i w\u0142asne kimono", desc: "Apteka i sklep sportowy.", effects: { money: -zl(s, 250) } },
      {
        label: "Olewasz, samo przejdzie",
        desc: "Zawsze przechodzi\u0142o.",
        chance: 30,
        success: {},
        successText: "Rzeczywi\u015Bcie schodzi. Masz szcz\u0119\u015Bcie.",
        fail: { follow: { step: "grzyb.grupa", after: 1 } },
        failText: "Plama ro\u015Bnie i robi si\u0119 z niej mapa Europy."
      },
      { label: "Myjesz ca\u0142\u0105 sal\u0119", desc: "Sam, w niedziel\u0119, z wiadrem.", effects: { wear: 1, rep: 2, note: "klub stawia ci obiad" } }
    ]
  },
  {
    id: "grzyb.grupa",
    app: "gym",
    from: "Mietek",
    title: "Kto mi to przyni\xF3s\u0142???",
    text: () => "[zdj\u0119cie \u0142ydki] KTO MI TO PRZYNI\xD3S\u0141???",
    choices: (s) => [
      { label: "Przyznajesz si\u0119 i kupujesz ma\u015B\u0107 dla wszystkich", desc: "Hurtowo.", effects: { money: -zl(s, 400), rep: 1 } },
      { label: "Milczysz", desc: "Mo\u017Ce nie skojarz\u0105.", effects: { nextFight: -1, note: "nikt nie chce z tob\u0105 sparowa\u0107" } }
    ]
  },
  // ---------- Telefon skradziony ----------
  {
    id: "telefon.start",
    app: "sms",
    from: "Nieznany numer",
    title: "Kto\u015B ukrad\u0142 telefon",
    start: { weight: 3, cond: (s, c) => pro(s) && !c.pre },
    text: () => "To ja, pisz\u0119 od brata. M\xF3j telefon znikn\u0105\u0142 z szatni w czasie walki. Kontakty, zdj\u0119cia, Instagrym, wszystko. Co teraz?",
    choices: (s) => [
      { label: "Kupujesz nowy telefon", desc: "I przywracasz kopi\u0119 zapasow\u0105.", effects: { money: -zl(s, 1200) } },
      { label: "Stary telefon brata", desc: "P\u0119kni\u0119ty ekran i 12 GB pami\u0119ci.", effects: { follow: { step: "telefon.menedzer", after: 1 } } }
    ]
  },
  {
    id: "telefon.menedzer",
    app: "sms",
    from: "Mened\u017Cer",
    title: "Dzwoni\u0142em trzy dni!",
    text: () => "\u201EDzwoni\u0142em do ciebie trzy dni! Mia\u0142em walk\u0119 na zast\u0119pstwo za trzy razy wy\u017Csz\u0105 ga\u017C\u0119. Wzi\u0105\u0142 j\u0105 kto inny.\u201D",
    choices: () => [
      { label: "Przepraszasz", desc: "I wysy\u0142asz nowy numer.", effects: { rep: -1, note: "stracona okazja" } },
      { label: "M\xF3wisz, \u017Ceby pisa\u0142 na Instagrym", desc: "Tam zawsze odpiszesz.", effects: { media: 1 } }
    ]
  },
  // ---------- Kolega z podstawówki ----------
  {
    id: "kolega.start",
    app: "fotogram",
    from: "@motywacja_kamil",
    title: "Rewan\u017C z podstaw\xF3wki",
    start: { weight: 3, cond: (s) => pro(s) && s.media >= 10 },
    text: () => "Pami\u0119tasz mnie? Podstaw\xF3wka, przerwy, ja ci\u0119 la\u0142em \u{1F60E} Teraz mam 300 tysi\u0119cy obserwuj\u0105cych. Rewan\u017C na gali freak? Kasa jest, i to du\u017Ca. Wrzucam film, czekam na odpowied\u017A.",
    choices: (s) => [
      { label: "Przyjmujesz wyzwanie", desc: "Kasa jest. Kamil te\u017C.", effects: { money: zl(s, 2500), media: 3, rep: -2, follow: { step: "kolega.konferencja", after: 1 } } },
      { label: "Wy\u015Bmiewasz go w komentarzu", desc: "\u201ELa\u0142e\u015B mnie? Pami\u0119tam inaczej.\u201D", effects: { media: 2 } },
      { label: "Ignorujesz", desc: "Nie dla freak\xF3w.", effects: { rep: 1 } }
    ]
  },
  {
    id: "kolega.konferencja",
    note: true,
    app: "klatka",
    from: "KlatkaNews",
    title: "Konferencja freak",
    text: () => "Konferencja przed gal\u0105 freak. Kamil rzuca w ciebie butelk\u0105 wody i krzyczy co\u015B o twojej mamie.",
    choices: () => [
      { label: "Siedzisz spokojnie", desc: "Woda sp\u0142ywa po twarzy.", effects: { rep: 2, media: 1, note: "w walce Kamil pada po 40 sekundach" } },
      { label: "Rzucasz krzes\u0142em", desc: "Freak to freak.", effects: { media: 5, rep: -4, note: "krzes\u0142o trafia ochroniarza" } },
      { label: "Wychodzisz", desc: "Nie b\u0119dziesz bra\u0142 w tym udzia\u0142u.", effects: { rep: 1, media: -1 } }
    ]
  },
  // ---------- Gazeta powiatowa ----------
  {
    id: "gazeta.start",
    note: true,
    app: "klatka",
    from: "Gazeta Powiatowa",
    title: "Pisz\u0105 o tobie!",
    start: { weight: 4, cond: (s) => s.history.length >= 2 },
    text: (s) => `\u201EGazeta Powiatowa\u201D pisze o tobie na stronie 7, obok og\u0142osze\u0144 o sprzeda\u017Cy k\xF3z. Tylko nazwisko przekr\u0119cili: \u201E${twistName(s.profile.lastName)}\u201D.`,
    choices: (s) => [
      { label: "Prosisz o sprostowanie", desc: "Grzecznie, przez telefon.", effects: { rep: 1, media: 1, note: "sprostowanie na stronie 12" } },
      { label: "Odpuszczasz", desc: "Najwa\u017Cniejsze, \u017Ce pisz\u0105.", effects: { follow: { step: "gazeta.ksywa", after: 2 } } },
      { label: "Wrzucasz na Instagrym", desc: `\u201EPozdrawiam, ${twistName(s.profile.lastName)}\u201D.`, effects: { media: 2 } }
    ]
  },
  {
    id: "gazeta.ksywa",
    app: "gym",
    from: "Trener",
    title: "Nowa ksywka",
    text: (s) => `S\u0142uchaj, \u201E${twistName(s.profile.lastName)}\u201D, bo tak ju\u017C na ciebie wszyscy m\xF3wi\u0105 na sali, nawet ja. Organizator wpisa\u0142 to na plakat. Poprawiamy czy zostaje?`,
    choices: () => [
      { label: "Przyjmujesz ksywk\u0119", desc: "Lepiej si\u0119 nie da.", effects: { media: 2, note: "nowa ksywka" } },
      { label: "Walczysz z tym", desc: "Bez szans, ale walczysz.", effects: { rep: 1 } }
    ]
  },
  // ---------- Zużyty sprzęt ----------
  {
    id: "sprzet.start",
    app: "gym",
    from: "Trener",
    title: "Twoje r\u0119kawice",
    start: { weight: 14, cond: (s) => (s.gear ?? 0) >= 55, repeat: true },
    text: (s) => `${["Twoje r\u0119kawice \u015Bmierdz\u0105 tak, \u017Ce Mietek trenuje w masce.", "Ochraniacz na z\u0119by ma ju\u017C kolor herbaty. Na szcz\u0119\u015Bcie nie smak.", "Nakolanniki trzymaj\u0105 si\u0119 na dw\xF3ch nitkach i nadziei.", "Kask ma p\u0119kni\u0119cie, przez kt\xF3re wida\u0107 przysz\u0142o\u015B\u0107. S\u0142ab\u0105."][s.season % 4]} Na oko sprz\u0119t jest zajechany w ${Math.round(s.gear ?? 0)}%. Kup nowy, zanim co\u015B p\u0119knie na sparingu.`,
    choices: (s) => [
      { label: "Kupujesz nowy komplet", desc: "R\u0119kawice, ochraniacze, kask.", effects: { money: -zl(s, 700), gear: -55 } },
      {
        label: "Pierzesz w pralce z sod\u0105",
        desc: "Patent z internetu.",
        chance: 50,
        success: { gear: -15 },
        successText: ["Pachn\u0105 prawie normalnie. Prawie.", "Soda dzia\u0142a. Mietek zdejmuje mask\u0119 po raz pierwszy od miesi\u0105ca.", "Wygl\u0105daj\u0105 jak nowe. Z daleka. W s\u0142abym \u015Bwietle."][s.season % 3],
        fail: { gear: -10, relations: -1 },
        failText: ["Pralka mamy ju\u017C nigdy nie b\u0119dzie taka sama.", "Pralka wydaje d\u017Awi\u0119k jak przy nokaucie. Mama dzwoni do serwisu.", "Ca\u0142a \u0142azienka pachnie szatni\u0105. Mama m\xF3wi, \u017Ce to tw\xF3j ostatni raz z pralk\u0105."][s.season % 3]
      },
      { label: "Trenujesz w tym, co masz", desc: "Jeszcze poci\u0105gn\u0105.", effects: { gear: 5, nextFight: -1 } }
    ]
  },
  // ---------- Fryzjer przed galą ----------
  {
    id: "fryzjer.start",
    app: "sms",
    from: "Salon u Gra\u017Cyny",
    title: "Wzorek przed gal\u0105",
    start: { weight: 3, cond: (s, c) => pro(s) && !c.pre },
    text: () => "Dzie\u0144 dobry, tu Gra\u017Cyna z salonu \u{1F487} Przed gal\u0105 zrobi\u0119 panu wzorek na boku g\u0142owy: b\u0142yskawica albo inicja\u0142y. Robi\u0142am ju\u017C dla pi\u0142karzy z czwartej ligi!",
    choices: () => [
      {
        label: "B\u0142yskawica",
        desc: "Gro\u017Anie.",
        chance: 50,
        success: { media: 3 },
        successText: "Wygl\u0105da gro\u017Anie. Kto\u015B robi z tego mema, ale w dobrym sensie.",
        fail: { media: 2, rep: -1 },
        failText: "Wysz\u0142o co\u015B pomi\u0119dzy b\u0142yskawic\u0105 a logo pizzerii."
      },
      { label: "Zwyk\u0142e ci\u0119cie", desc: "Kr\xF3tko po bokach.", effects: { note: "pani Gra\u017Cyna rozczarowana" } }
    ]
  },
  // ---------- Białko „bubble gum” ----------
  {
    id: "bialko.start",
    app: "sms",
    from: "MegaMass",
    title: "Wsp\xF3\u0142praca w naturze",
    start: { weight: 3, cond: (s) => pro(s) && s.media >= 6 },
    text: () => "\u201EProponujemy wsp\xF3\u0142prac\u0119! Zamiast pieni\u0119dzy 40 puszek bia\u0142ka o smaku bubble gum. Wystarczy oznacza\u0107 nas w relacjach.\u201D",
    choices: (s) => [
      { label: "Bierzesz", desc: "Zaoszcz\u0119dzisz na od\u017Cywkach.", effects: { money: zl(s, 300), follow: { step: "bialko.piwnica", after: 2 } } },
      {
        label: "Prosisz o pieni\u0105dze",
        desc: "Puszki nie p\u0142ac\u0105 rachunk\xF3w.",
        chance: 30,
        success: { money: zl(s, 1e3) },
        successText: "Zgadzaj\u0105 si\u0119. Pierwszy przelew przychodzi z dopiskiem \u201Ebubble gum\u201D.",
        fail: {},
        failText: "Nie odpisuj\u0105. Widzisz, \u017Ce inny zawodnik ju\u017C pozuje z puszk\u0105."
      }
    ]
  },
  {
    id: "bialko.piwnica",
    note: true,
    app: "tasma",
    from: "Sporty walki \u2014 kupi\u0119/sprzedam",
    title: "34 puszki w piwnicy",
    text: () => "W piwnicy wci\u0105\u017C 34 puszki. Smak bubble gum da si\u0119 pi\u0107 tylko z zamkni\u0119tymi oczami. Wystawiasz na Oliksie?",
    choices: (s) => [
      {
        label: "Sprzedajesz",
        desc: "Po 40 z\u0142 za puszk\u0119.",
        chance: 60,
        success: { money: zl(s, 500) },
        successText: "Schodzi wszystko. Kupuj\u0105cy pyta, czy b\u0119dzie smak \u201Ewata cukrowa\u201D.",
        fail: { money: zl(s, 150), rep: -1 },
        failText: "Sprzedajesz trzy. Kupuj\u0105cy pisze, \u017Ce od tego bia\u0142ka \u015Bwieci mu si\u0119 j\u0119zyk."
      },
      { label: "Rozdajesz w klubie", desc: "Niech wszyscy cierpi\u0105 razem.", effects: { rep: 2 } }
    ]
  },
  // ---------- Sparing z JuTuberem ----------
  {
    id: "youtuber.start",
    app: "fotogram",
    from: "@sparingi_z_gwiazdami",
    title: "Sparing na lajcie?",
    start: { weight: 4, cond: (s) => pro(s) && s.media >= 8 },
    text: () => "Siema! Robi\u0119 seri\u0119 \u201ESparuj\u0119 z zawodowcami\u201D. Pi\u0119\u0107 minut, na lajcie, bez spiny. Kamera tylko dla pami\u0105tki.",
    choices: () => [
      {
        label: "Idziesz",
        desc: "Co mo\u017Ce p\xF3j\u015B\u0107 nie tak?",
        chance: 50,
        success: { media: 3, follow: { step: "youtuber.collab", after: 2 } },
        successText: "JuTuber naprawd\u0119 idzie na lajcie. Film ma milion wy\u015Bwietle\u0144, a ty wygl\u0105dasz jak profesor.",
        fail: { media: 2, rep: -2 },
        failText: "Po 30 sekundach \u201Elajtu\u201D go\u015B\u0107 wali z ca\u0142ej si\u0142y. Do filmu wchodzi tylko moment, w kt\xF3rym trafia ciebie."
      },
      { label: "Odmawiasz", desc: "Nie jeste\u015B rekwizytem.", effects: { rep: 1 } }
    ]
  },
  {
    id: "youtuber.collab",
    app: "fotogram",
    from: "@sparingi_z_gwiazdami",
    title: "Zr\xF3bmy co\u015B razem",
    text: () => "Film zrobi\u0142 robot\u0119! Mam sponsora na drugi odcinek. Dzielimy si\u0119 po po\u0142owie. Tym razem ty uczysz mnie kopni\u0119\u0107.",
    choices: (s) => [
      { label: "Wchodzisz w to", desc: "Pieni\u0105dze za uczenie kopni\u0119\u0107.", effects: { money: zl(s, 800), media: 2 } },
      { label: "Wystarczy jeden odcinek", desc: "Wracasz do sali.", effects: { rep: 1 } }
    ]
  },
  // ---------- Suspensor ----------
  {
    id: "suspensor.start",
    app: "gym",
    from: "Trener",
    title: "Godzina do walki",
    start: { weight: 4, cond: (s, c) => pro(s) && !c.pre },
    text: () => "Godzina do wej\u015Bcia. Grzebi\u0119 ci w torbie. GDZIE JEST SUSPENSOR?",
    choices: (s) => [
      {
        label: "Po\u017Cyczasz od kogo\u015B z karty",
        desc: "Kto\u015B zawsze ma zapasowy.",
        chance: 70,
        success: { note: "zawodnik z karty wst\u0119pnej ratuje ci wiecz\xF3r" },
        successText: "Zawodnik z karty wst\u0119pnej ma zapasowy. Pasuje. Nie pytasz o histori\u0119.",
        fail: { nextFight: -2 },
        failText: "Jedyny zapasowy jest o dwa rozmiary za ma\u0142y. Wchodzisz do klatki, my\u015Bl\u0105c tylko o tym."
      },
      { label: "Kolega biegnie do sklepu sportowego", desc: "Taks\xF3wka w dwie strony.", effects: { money: -zl(s, 150), nextFight: -1, note: "rozgrzewka w nerwach" } },
      {
        label: "Walczysz bez",
        desc: "Kto nie ryzykuje\u2026",
        chance: 80,
        success: {},
        successText: "Rywal nie kopie nisko. Masz szcz\u0119\u015Bcie, o kt\xF3rym nikomu nie powiesz.",
        fail: { nextFight: -3, media: 1 },
        failText: "Pierwsze kopni\u0119cie rywala l\u0105duje dok\u0142adnie tam. S\u0119dzia daje ci pi\u0119\u0107 minut. Wszyscy w hali sycz\u0105 razem z tob\u0105."
      }
    ]
  },
  // ---------- Ochraniacz zębów ----------
  {
    id: "zeby.start",
    app: "gym",
    from: "Mietek",
    title: "Ochraniacz zgin\u0105\u0142",
    start: { weight: 3, cond: (s, c) => pro(s) && !c.pre },
    text: () => "Masz sw\xF3j ochraniacz na z\u0119by? Bo w torbie nie ma. Dwie godziny do walki. Ostatnio by\u0142 chyba w kieszeni bluzy, a bluz\u0119 twoja mama wczoraj pra\u0142a\u2026",
    choices: (s) => [
      {
        label: "Formujesz nowy w czajniku",
        desc: "Czajnik z szatni, gor\u0105ca woda, z\u0119by.",
        chance: 65,
        success: {},
        successText: "Wyszed\u0142 krzywo, ale trzyma. Smakuje jak czajnik z szatni.",
        fail: { nextFight: -1 },
        failText: "Za d\u0142ugo w wodzie. Ochraniacz jest mi\u0119kki jak guma do \u017Cucia i co rund\u0119 wypada."
      },
      {
        label: "Walczysz bez ochraniacza",
        desc: "Jak w dawnych czasach.",
        chance: 75,
        success: {},
        successText: "\u017Badnego czystego trafienia w szcz\u0119k\u0119. Dentysta b\u0119dzie musia\u0142 poczeka\u0107.",
        fail: { money: -zl(s, 800), note: "nowa jedynka" },
        failText: "Jedno trafienie i jedynka zostaje w klatce. Dentysta liczy jak gala."
      }
    ]
  },
  // ---------- Mama w pierwszym rzędzie ----------
  {
    id: "mamarzad.start",
    app: "sms",
    from: "Mama",
    title: "Kupi\u0142am bilet!",
    start: { weight: 4, cond: (s, c) => pro(s) && !c.pre && s.relations >= -2 },
    text: () => "Synek! Kupi\u0142am bilet w pierwszym rz\u0119dzie. Bior\u0119 cioci\u0119 Halin\u0119 i transparent. Nie m\xF3w nie.",
    choices: () => [
      {
        label: "Cieszysz si\u0119",
        desc: "Mama w pierwszym rz\u0119dzie to doping.",
        chance: 70,
        success: { relations: 2, nextFight: 1 },
        successText: "S\u0142yszysz mam\u0119 przez ca\u0142\u0105 walk\u0119. To pomaga bardziej ni\u017C naro\u017Cnik.",
        fail: { relations: 1, media: 2, nextFight: -1 },
        failText: "Mama krzyczy na s\u0119dziego tak, \u017Ce ochrona prosi j\u0105 o spok\xF3j. Kamera telewizji pokazuje to dwa razy."
      },
      { label: "Prosisz, \u017Ceby ogl\u0105da\u0142a w domu", desc: "Nie chcesz jej stresowa\u0107.", effects: { relations: -2, nextFight: 1, note: "mama ogl\u0105da przez palce" } }
    ]
  },
  // ---------- Urodziny tydzień przed walką ----------
  {
    id: "urodziny.start",
    app: "sms",
    from: "Kumpel Kamil",
    title: "Urodziny w sobot\u0119",
    start: { weight: 5, cond: (s) => s.age <= 30 },
    text: () => "Stary, w sobot\u0119 moje 30. urodziny w \u201EPresti\u017Cu\u201D. Tydzie\u0144 przed twoj\u0105 walk\u0105, ale na chwil\u0119 wpadniesz, nie? Bez ciebie to nie to samo.",
    choices: () => [
      {
        label: "Wpadasz na chwil\u0119",
        desc: "Do 23:00, s\u0142owo.",
        chance: 40,
        success: { note: "wychodzisz o 23:00, jak obieca\u0142e\u015B" },
        successText: "Wychodzisz o 23:00, jak obieca\u0142e\u015B. Kamil szcz\u0119\u015Bliwy, trener nie wie.",
        fail: { nextFight: -3, media: 1 },
        failText: "Wychodzisz o 5:00. Trener wie, bo kto\u015B wrzuci\u0142 relacj\u0119."
      },
      { label: "Idziesz i pijesz tylko wod\u0119", desc: "Najtrze\u017Awiejszy go\u015B\u0107 w historii \u201EPresti\u017Cu\u201D.", effects: { nextFight: -1, rep: 1 } },
      { label: "Odmawiasz", desc: "Najpierw walka.", effects: { nextFight: 1, note: "Kamil m\xF3wi, \u017Ce jeste\u015B nudziarz" } }
    ]
  },
  // ---------- Festyn parafialny ----------
  {
    id: "festyn.start",
    app: "sms",
    from: "Ksi\u0105dz proboszcz",
    title: "Pokaz na festynie",
    start: { weight: 3, cond: (s) => s.history.length >= 3 && s.tier <= 2 },
    text: () => "Szcz\u0119\u015B\u0107 Bo\u017Ce. Na festynie parafialnym chcieliby\u015Bmy pokaz sztuk walki. Honorarium skromne: kie\u0142basa i b\u0142ogos\u0142awie\u0144stwo.",
    choices: () => [
      { label: "Robisz pokaz", desc: "Z wikarym jako przeciwnikiem.", effects: { rep: 2, relations: 2, media: 1, follow: { step: "festyn.ciasto", after: 1 } } },
      { label: "Grzecznie odmawiasz", desc: "Ob\xF3z trwa.", effects: { relations: -1 } }
    ]
  },
  {
    id: "festyn.ciasto",
    note: true,
    app: "wazka",
    from: "Wa\u017Cka",
    title: "Ciasto od Ko\u0142a Gospody\u0144",
    text: () => "Panie z Ko\u0142a Gospody\u0144 Wiejskich da\u0142y ci na drog\u0119 p\xF3\u0142 blachy dro\u017Cd\u017Cowego z kruszonk\u0105. Wa\u017Cka pyta, czy wpisa\u0107 \u201Eciasto, 1 sztuka\u201D.",
    choices: () => [
      { label: "Zjadasz", desc: "Nie godzi si\u0119 odm\xF3wi\u0107.", effects: { relations: 1, nextFight: -1, note: "+1,2 kg na wadze" } },
      { label: "Oddajesz trenerowi", desc: "Trener te\u017C cz\u0142owiek.", effects: { rep: 1, note: "trener zjada ca\u0142\u0105 blach\u0119" } }
    ]
  },
  // ---------- Radny przed wyborami ----------
  {
    id: "radny.start",
    app: "sms",
    from: "Radny Kazimierz",
    title: "Zdj\u0119cie z pasem?",
    start: { weight: 3, cond: (s) => s.belts.length > 0 || s.medals.gold > 0 },
    text: () => "Dzie\u0144 dobry, radny Kazimierz. Chcia\u0142bym zdj\u0119cie z panem i pasem. W zamian za\u0142atwi\u0119 nowe maty dla klubu, s\u0142owo radnego.",
    choices: () => [
      {
        label: "Robisz zdj\u0119cie",
        desc: "Klub potrzebuje mat.",
        chance: 55,
        success: { nextFight: 1, rep: 1, note: "klub dostaje nowe maty" },
        successText: "Maty przychodz\u0105 po tygodniu. Radny nawet przyjecha\u0142 je rozpakowa\u0107.",
        fail: { rep: -2, media: 1 },
        failText: "Maty nie przysz\u0142y, a twoje zdj\u0119cie wisi na plakacie wyborczym przy ka\u017Cdym przystanku."
      },
      { label: "Odmawiasz", desc: "Sport to nie polityka.", effects: { rep: 1 } }
    ]
  },
  // ---------- Telewizja śniadaniowa ----------
  {
    id: "tv.start",
    app: "sms",
    from: "Kawa z Mlekiem TV",
    title: "Telewizja \u015Bniadaniowa",
    start: { weight: 3, cond: (s) => pro(s) && s.media >= 15 },
    text: () => "Dzie\u0144 dobry, redakcja \u201EKawy z Mlekiem\u201D! Zapraszamy na pi\u0119\u0107 minut o samoobronie dla kobiet, prezenterka zagra napastnika \u{1F604} Na \u017Cywo, o 8:15. B\u0119dzie pan?",
    choices: () => [
      {
        label: "Jedziesz do studia",
        desc: "Pobudka o 5:00.",
        chance: 70,
        success: { media: 4, rep: 1 },
        successText: "Prezenterka zachwycona, a twoja mama nagrywa telewizor telefonem.",
        fail: { media: 3, rep: -1 },
        failText: "Rzucasz prezenterk\u0119 troch\u0119 za mocno. Ona si\u0119 \u015Bmieje, internet nie."
      },
      { label: "Odmawiasz", desc: "\u015Apisz do 9:00.", effects: { nextFight: 1 } }
    ]
  },
  // ---------- Fan z tatuażem ----------
  {
    id: "tatuaz.start",
    app: "fotogram",
    from: "@fan_nr1",
    title: "Mam ci\u0119 na \u0142ydce!",
    start: { weight: 3, cond: (s) => pro(s) && s.media >= 12 },
    text: () => "[zdj\u0119cie \u0142ydki] ZROBI\u0141EM TO!!! Twoja twarz na ca\u0142e \u017Cycie \u{1F525} Oznaczysz mnie?",
    choices: () => [
      { label: "Repost z podzi\u0119kowaniem", desc: "Szacunek dla kibica.", effects: { media: 3, rep: 1, follow: { step: "tatuaz.gala", after: 1 } } },
      { label: "\u201ETo nie ja\u201D", desc: "Bo troch\u0119 nie ty.", effects: { media: 2, rep: -1 } }
    ]
  },
  {
    id: "tatuaz.gala",
    app: "fotogram",
    from: "@fan_nr1",
    title: "B\u0119d\u0119 na gali!",
    text: () => "Mam bilet!!! Bior\u0119 transparent, tr\u0105bk\u0119 i ca\u0142\u0105 klas\u0119 maturaln\u0105 z 2009. Pomachasz nam po walce? \u{1F4E3}",
    choices: () => [
      { label: "Za\u0142atwiasz im wej\u015Bcie do szatni", desc: "Zdj\u0119cie po walce.", effects: { nextFight: 1, media: 1 } },
      { label: "Dzi\u0119kujesz i tyle", desc: "Skupienie przed walk\u0105.", effects: { nextFight: 1 } }
    ]
  },
  // ---------- Darek pożycza ----------
  {
    id: "darek.start",
    app: "sms",
    from: "Darek z podstaw\xF3wki",
    title: "Po\u017Cyczysz do pi\u0105tku?",
    start: { weight: 4, cond: (s) => s.money > zl(s, 1e3) },
    text: (s) => `Stary, po\u017Cycz ${zl(s, 500)} z\u0142 do pi\u0105tku. Oddam co do grosza, wiesz, \u017Ce jestem s\u0142owny.`,
    choices: (s) => [
      { label: "Po\u017Cyczasz", desc: "Kumpel to kumpel.", effects: { money: -zl(s, 500), follow: { step: "darek.piatek", after: 2 } } },
      { label: "Odmawiasz", desc: "Pami\u0119tasz rower z 2011 roku.", effects: { note: "Darek pisze \u201Espoko\u201D i nic wi\u0119cej" } }
    ]
  },
  {
    id: "darek.piatek",
    app: "sms",
    from: "Darek z podstaw\xF3wki",
    title: "Ten pi\u0105tek",
    text: () => "[zdj\u0119cie z basenu] Egipt \u{1F334}\u2600\uFE0F zas\u0142u\u017Cony odpoczynek!",
    choices: (s) => [
      {
        label: "Przypominasz si\u0119",
        desc: "Komentarz pod zdj\u0119ciem z basenu.",
        chance: 45,
        success: { money: zl(s, 500) },
        successText: "Darek oddaje ca\u0142o\u015B\u0107 i dorzuca magnes na lod\xF3wk\u0119 z wielb\u0142\u0105dem.",
        fail: { note: "Darek zmieni\u0142 numer" },
        failText: "Darek odpisuje \u201Ejutro\u201D. Potem zmienia numer."
      },
      { label: "Odpuszczasz", desc: "Lekcja kosztuje.", effects: { rep: 1 } }
    ]
  },
  // ---------- Klucze do sali ----------
  {
    id: "klucze.start",
    app: "gym",
    from: "Trener",
    title: "Kto zamyka\u0142 sal\u0119?",
    start: { weight: 3, cond: (s) => s.clubSeasons >= 1 },
    text: () => "Rano sala otwarta, klucze w zamku, nie ma dw\xF3ch work\xF3w i czajnika. Kto wczoraj zamyka\u0142?",
    choices: (s) => [
      { label: "Przyznajesz si\u0119 i odkupujesz", desc: "Worki i czajnik.", effects: { money: -zl(s, 700), rep: 1 } },
      {
        label: "M\xF3wisz, \u017Ce to nie ty",
        desc: "Kamera przecie\u017C jest atrap\u0105.",
        chance: 30,
        success: {},
        successText: "Nikt nie dochodzi prawdy. Czajnika i tak nikt nie lubi\u0142.",
        fail: { rep: -2, nextFight: -1 },
        failText: "Okazuje si\u0119, \u017Ce trener w ko\u0144cu pod\u0142\u0105czy\u0142 kamer\u0119. Tydzie\u0144 zbierasz r\u0119czniki po wszystkich."
      }
    ]
  },
  // ---------- Ola i weekend ----------
  {
    id: "ola.start",
    app: "sms",
    from: "Ola",
    title: "Weekend w g\xF3rach?",
    start: { weight: 4, cond: (s) => s.age >= 19 && s.age <= 34 },
    text: () => "Kochanie, mam wolny weekend. Jedziemy w g\xF3ry? Wiem, \u017Ce za tydzie\u0144 masz walk\u0119, ale ostatnio widzimy si\u0119 tylko na Instagrymie.",
    choices: (s) => [
      { label: "Jedziecie", desc: "G\xF3ry, schronisko, zero trening\xF3w.", effects: { relations: 2, nextFight: -1 } },
      {
        label: "Proponujesz po walce",
        desc: "Obiecujesz najlepszy weekend w \u017Cyciu.",
        chance: 60,
        success: { relations: 1 },
        successText: "Ola rozumie i rezerwuje pok\xF3j na termin po walce.",
        fail: { relations: -2 },
        failText: "Ola jedzie z kole\u017Cank\u0105. Zdj\u0119cia z g\xF3r ogl\u0105dasz mi\u0119dzy sparingami."
      },
      { label: "Zabierasz j\u0105 na ob\xF3z", desc: "Ona czyta, ty biegasz po g\xF3rach.", effects: { money: -zl(s, 400), relations: 1 } }
    ]
  },
  // ---------- Rywal pisze ----------
  {
    id: "rywal.start",
    app: "fotogram",
    from: "Najbli\u017Cszy rywal",
    title: "Wiadomo\u015B\u0107 od rywala",
    start: { weight: 3, cond: (s, c) => pro(s) && !c.pre },
    text: () => "Tw\xF3j najbli\u017Cszy rywal pisze prywatnie: \u201ESzacunek, nic osobistego. Po walce piwo, niezale\u017Cnie od wyniku?\u201D",
    choices: () => [
      { label: "\u201EJasne, szacunek\u201D", desc: "Sport to sport.", effects: { rep: 2 } },
      { label: "Wrzucasz zrzut z dopiskiem \u201Eboi si\u0119\u201D", desc: "Psychologia przed walk\u0105.", effects: { media: 3, rep: -2, nextFight: 1 } },
      { label: "Nie odpisujesz", desc: "Skupienie.", effects: {} }
    ]
  },
  // ---------- Zgubiony bagaż ----------
  {
    id: "bagaz.start",
    app: "sms",
    from: "Linie lotnicze",
    title: "Baga\u017C nie dolecia\u0142",
    start: { weight: 4, cond: (s, c) => s.tier >= 3 && !c.pre },
    text: () => "\u201EPrzepraszamy, Tw\xF3j baga\u017C polecia\u0142 do Lizbony. Zwr\xF3cimy go w ci\u0105gu 3\u20135 dni roboczych.\u201D Gala za 2 dni. W baga\u017Cu ca\u0142y sprz\u0119t.",
    choices: (s) => [
      { label: "Kupujesz wszystko na miejscu", desc: "Ceny jak w strefie wolnoc\u0142owej.", effects: { money: -zl(s, 1e3), gear: -30 } },
      { label: "Po\u017Cyczasz od miejscowego klubu", desc: "R\u0119kawice z histori\u0105.", effects: { gear: 15, nextFight: -1 } }
    ]
  },
  // ---------- Dwie wagi ----------
  {
    id: "waga.start",
    note: true,
    app: "wazka",
    from: "Wa\u017Cka",
    title: "Kt\xF3ra waga k\u0142amie?",
    start: { weight: 3, cond: (s) => pro(s) },
    text: () => "Waga w \u0142azience pokazuje 2 kg mniej ni\u017C waga na sali. Wa\u017Cka grzecznie pyta, kt\xF3rej wadze wierzysz.",
    choices: (s) => [
      {
        label: "Wierzysz \u0142azienkowej",
        desc: "Jest nowsza.",
        chance: 30,
        success: {},
        successText: "K\u0142ama\u0142a waga na sali. Trener j\u0105 wyrzuca.",
        fail: { nextFight: -3 },
        failText: "K\u0142ama\u0142a \u0142azienkowa. Ostatnie trzy dni zbijasz wag\u0119 w saunie."
      },
      { label: "Kupujesz wag\u0119 z atestem", desc: "Koniec zgadywania.", effects: { money: -zl(s, 300), nextFight: 1 } }
    ]
  },
  // ---------- Ustawka ----------
  {
    id: "ustawka.start",
    app: "sms",
    from: "Pan Zbigniew",
    title: "Propozycja nie do odrzucenia",
    start: { weight: 3, cond: (s, c) => pro(s) && !c.pre && s.tier >= 1 && s.tier <= 2 && !s.flags.ustawka },
    text: (s) => `Dzie\u0144 dobry, Zbigniew, \u201Eznajomy organizatora\u201D. Najbli\u017Csza walka: przegrywa pan w drugiej rundzie, a dostaje ${zl(s, 5e3).toLocaleString("pl-PL")} z\u0142 w kopercie. Nikt si\u0119 nie dowie. Prosz\u0119 odpisa\u0107 \u201Etak\u201D albo zapomnie\u0107 o tej wiadomo\u015Bci.`,
    choices: (s) => [
      { label: "\u201ETak\u201D", desc: "Koperta jest gruba.", effects: { money: zl(s, 5e3), nextFight: -8, flag: "ustawka", follow: { step: "ustawka.przeciek", after: 2 } } },
      { label: "Kasujesz wiadomo\u015B\u0107", desc: "Nie widzia\u0142e\u015B, nie by\u0142o.", effects: { follow: { step: "ustawka.zemsta", after: 1 } } },
      { label: "Zg\u0142aszasz do federacji", desc: "Ze zrzutem ekranu.", effects: { rep: 3, media: 2, note: "federacja wszczyna post\u0119powanie" } }
    ]
  },
  {
    id: "ustawka.przeciek",
    note: true,
    app: "klatka",
    from: "KlatkaNews",
    title: "Dziwne zak\u0142ady na twoj\u0105 walk\u0119",
    text: () => "\u201ENa kilka godzin przed gal\u0105 kto\u015B postawi\u0142 du\u017Ce pieni\u0105dze na pora\u017Ck\u0119 faworyta w drugiej rundzie. Federacja przygl\u0105da si\u0119 sprawie.\u201D W tek\u015Bcie jest twoje nazwisko.",
    choices: () => [
      {
        label: "Milczysz i czekasz",
        desc: "Mo\u017Ce przycichnie.",
        chance: 35,
        success: { note: "sprawa przycich\u0142a" },
        successText: "Po tygodniu portal pisze o czym\u015B innym. Tym razem si\u0119 uda\u0142o. Zbigniew ju\u017C nie odpisuje.",
        fail: { rep: -15, media: 4, flag: "banned" },
        failText: "Zbigniew sypie wszystkich, \u017Ceby ratowa\u0107 siebie. Federacja rozwi\u0105zuje z tob\u0105 kontrakt."
      },
      {
        label: "Przyznajesz si\u0119 i wsp\xF3\u0142pracujesz",
        desc: "Lepiej samemu ni\u017C p\xF3\u017Aniej.",
        effects: { rep: -8, media: 3, money: -2e3, note: "kara, ale bez do\u017Cywocia" }
      }
    ]
  },
  {
    id: "ustawka.zemsta",
    app: "sms",
    from: "Nieznany numer",
    title: "Szkoda",
    text: () => "\u201ESzkoda. \u0141adne masz auto.\u201D Rano na drzwiach kierowcy kto\u015B wydrapa\u0142 co\u015B, czego nie da si\u0119 powt\xF3rzy\u0107 przy dzieciach.",
    choices: (s) => [
      { label: "Lakiernik", desc: "Pan Rysiu zrobi taniej.", effects: { money: -zl(s, 600) } },
      { label: "Zg\u0142aszasz na policj\u0119", desc: "Z wiadomo\u015Bci\u0105 od Zbigniewa.", effects: { rep: 1, note: "dzielnicowy Zbyszek znowu w akcji" } }
    ]
  },
  // ---------- Grupa rodzinna ----------
  {
    id: "ciocia.start",
    app: "sms",
    from: "Rodzinka",
    title: "\u0141a\u0144cuszek od cioci Haliny",
    start: { weight: 4, cond: () => true },
    text: () => "Ciocia Halina na grupie rodzinnej: \u201EPRZE\u015ALIJ DO 10 OS\xD3B, A W NAJBLI\u017BSZEJ WALCE B\u0118DZIESZ MIA\u0141 SZCZ\u0118\u015ACIE!!! nie przes\u0142a\u0142 Zdzisiek i przegra\u0142 w warcaby\u201D.",
    choices: () => [
      { label: "Przesy\u0142asz dalej", desc: "Na wszelki wypadek.", effects: { relations: 1, note: "dziesi\u0119ciu znajomych ci\u0119 nienawidzi" } },
      { label: "Ignorujesz", desc: "Nie wierzysz w \u0142a\u0144cuszki.", effects: { follow: { step: "ciocia.obraza", after: 2 } } },
      { label: "Odpisujesz z emotk\u0105", desc: "Kompromis.", effects: { relations: 1 } }
    ]
  },
  {
    id: "ciocia.obraza",
    app: "sms",
    from: "Rodzinka",
    title: "A nie m\xF3wi\u0142am",
    cond: (s) => s.history[s.history.length - 1]?.result === "L",
    text: () => "Ciocia Halina po twojej pora\u017Cce: \u201EA nie m\xF3wi\u0142am, \u017Ceby przes\u0142a\u0107\u201D. Siedemna\u015Bcie reakcji. Babcia te\u017C da\u0142a serduszko.",
    choices: () => [
      { label: "Przesy\u0142asz nast\u0119pny \u0142a\u0144cuszek", desc: "Kto wie.", effects: { relations: 2 } },
      { label: "Wychodzisz z grupy", desc: "Na tydzie\u0144.", effects: { relations: -3, note: "mama dodaje ci\u0119 z powrotem" } }
    ]
  },
  // ---------- Sąsiad spod czwórki ----------
  {
    id: "sasiad.start",
    app: "sms",
    from: "S\u0105siad spod 4",
    title: "Skakanka o 6 rano",
    start: { weight: 4, cond: (s) => s.tier <= 2 },
    text: () => "Panie, skakanka o sz\xF3stej rano nad moj\u0105 g\u0142ow\u0105 to nie jest sport, to jest tortura. Nast\u0119pnym razem dzwoni\u0119 do sp\xF3\u0142dzielni.",
    choices: (s) => [
      { label: "Kupujesz mat\u0119 wyciszaj\u0105c\u0105", desc: "Dla \u015Bwi\u0119tego spokoju.", effects: { money: -zl(s, 200) } },
      { label: "Skaczesz w piwnicy", desc: "Mi\u0119dzy rowerami i s\u0142oikami.", effects: { note: "piwnica pachnie og\xF3rkami" } },
      { label: "Ignorujesz", desc: "Sport to zdrowie.", effects: { follow: { step: "sasiad.gala", after: 2 } } }
    ]
  },
  {
    id: "sasiad.gala",
    app: "sms",
    from: "S\u0105siad spod 4",
    title: "Widzia\u0142em walk\u0119",
    text: () => "Widzia\u0142em pana walk\u0119 w telewizji. No dobra, niech pan skacze. Ale mo\u017Ce jaki\u015B bilet dla wnuka?",
    choices: () => [
      { label: "Dajesz dwa bilety", desc: "Dla wnuka i dla niego.", effects: { rep: 2, note: "s\u0105siad drze si\u0119 najg\u0142o\u015Bniej w hali" } },
      { label: "\u201EPo sp\xF3\u0142dzielni? Nie.\u201D", desc: "Pami\u0119tasz gro\u017Aby.", effects: { rep: -1, note: "sp\xF3\u0142dzielnia przysy\u0142a pismo" } }
    ]
  },
  // ---------- Dieta pudełkowa ----------
  {
    id: "pudelka.start",
    note: true,
    app: "wazka",
    from: "Wa\u017Cka",
    title: "Dieta pude\u0142kowa?",
    start: { weight: 4, cond: (s, c) => c.pre && s.tier >= 1 },
    text: (s) => `Wa\u017Cka poleca diet\u0119 pude\u0142kow\u0105 \u201EFitFighter\u201D na ca\u0142y ob\xF3z: pi\u0119\u0107 posi\u0142k\xF3w dziennie, ${zl(s, 500)} z\u0142 miesi\u0119cznie. Albo gotuje mama.`,
    choices: (s) => [
      { label: "Bierzesz pude\u0142ka", desc: "Wygodnie i co do grama.", effects: { money: -zl(s, 500), nextFight: 2 } },
      {
        label: "Gotuje mama",
        desc: "Za darmo i z mi\u0142o\u015Bci\u0105.",
        chance: 55,
        success: { relations: 1, nextFight: 1 },
        successText: "Mama wa\u017Cy wszystko na kuchennej wadze i pilnuje lepiej ni\u017C dietetyk.",
        fail: { relations: 1, nextFight: -1 },
        failText: "Mama \u201Etylko troch\u0119\u201D dosma\u017Ca. Kotlet na obozie to nie jest ry\u017C z kurczakiem."
      }
    ]
  },
  // ---------- Szpital dziecięcy ----------
  {
    id: "szpital.start",
    app: "sms",
    from: "Fundacja \u201EMa\u0142y Wojownik\u201D",
    title: "Odwiedzisz dzieci?",
    start: { weight: 3, cond: (s) => s.media >= 10 },
    text: () => "Dzie\u0144 dobry, pisz\u0119 z fundacji. Na oddziale dzieci\u0119cym le\u017Cy Franek, osiem lat. Ogl\u0105da wszystkie pana walki i ma pana plakat nad \u0142\xF3\u017Ckiem. Czy znalaz\u0142by pan godzin\u0119?",
    choices: () => [
      { label: "Jedziesz z pasem i r\u0119kawicami", desc: "Godzina, kt\xF3ra zostaje na zawsze.", effects: { rep: 3, relations: 1, nextFight: 1, note: "Franek da\u0142 ci rysunek na szcz\u0119\u015Bcie" } },
      { label: "Nagrywasz filmik dla Franka", desc: "Ob\xF3z trwa, ale filmik to co\u015B.", effects: { rep: 1 } }
    ]
  },
  // ---------- Kibice rywala ----------
  {
    id: "hejt.start",
    note: true,
    app: "fotogram",
    from: "Komentarze",
    title: "Kibice rywala",
    start: { weight: 3, cond: (s, c) => pro(s) && !c.pre && s.media >= 8 },
    text: () => "Pod twoim ostatnim zdj\u0119ciem 400 komentarzy od kibic\xF3w rywala. Naj\u0142agodniejszy: \u201Ezabierzcie mu telefon i r\u0119kawice\u201D.",
    choices: () => [
      { label: "Zg\u0142aszasz i blokujesz", desc: "Nie karmi si\u0119 trolli.", effects: { rep: 1 } },
      { label: "Odpisujesz ka\u017Cdemu", desc: "Do trzeciej w nocy.", effects: { media: 2, rep: -2, nextFight: -1 } },
      { label: "Robisz z tego film", desc: "Czytasz komentarze z kamienn\u0105 twarz\u0105.", effects: { media: 3 } }
    ]
  },
  // ---------- Fałszywe konto ----------
  {
    id: "fake.start",
    note: true,
    app: "fotogram",
    from: "Instagrym",
    title: "Kto\u015B si\u0119 pod ciebie podszywa",
    start: { weight: 3, cond: (s) => pro(s) && s.media >= 12 },
    text: (s) => `Konto \u201E${s.profile.lastName.toLowerCase()}_oficjalne_mma\u201D zbiera pieni\u0105dze na \u201Eoperacj\u0119 kolana\u201D. Ma twoje zdj\u0119cia i wi\u0119cej obserwuj\u0105cych ni\u017C ty.`,
    choices: () => [
      {
        label: "Zg\u0142aszasz do Instagryma",
        desc: "Formularz ma osiem krok\xF3w.",
        chance: 55,
        success: { rep: 1 },
        successText: "Konto znika po dw\xF3ch dniach. Kolano masz zdrowe.",
        fail: { rep: -2, follow: { step: "fake.fani", after: 1 } },
        failText: "Instagrym odpisuje, \u017Ce \u201Ekonto nie narusza zasad\u201D. Zbi\xF3rka trwa."
      },
      { label: "Nagrywasz ostrze\u017Cenie", desc: "Twarz, imi\u0119, \u201Eto nie ja\u201D.", effects: { media: 2, rep: 1 } }
    ]
  },
  {
    id: "fake.fani",
    app: "sms",
    from: "Pani Krystyna",
    title: "Wp\u0142aci\u0142am na kolano",
    text: () => "Dzie\u0144 dobry, wp\u0142aci\u0142am 200 z\u0142 na pana kolano. Jak si\u0119 pan czuje po operacji? Modlimy si\u0119 z m\u0119\u017Cem.",
    choices: (s) => [
      { label: "Oddajesz pani Krystynie pieni\u0105dze", desc: "Z w\u0142asnej kieszeni.", effects: { money: -zl(s, 200), rep: 2, note: "pani Krystyna przysy\u0142a s\u0142oik konfitur" } },
      { label: "T\u0142umaczysz, \u017Ce to oszustwo", desc: "Pani Krystyna nie do ko\u0144ca wierzy.", effects: { rep: -1 } }
    ]
  },
  // ---------- Pies trenera ----------
  {
    id: "pies.start",
    app: "gym",
    from: "Trener",
    title: "Wyprowadzisz Bruna?",
    start: { weight: 3, cond: () => true },
    text: () => "Wyje\u017Cd\u017Cam na weekend. Wyprowadzisz Bruna? To spokojny pies, tylko ci\u0105gnie jak ci\u0119\u017Car\xF3wka. W zamian dwa treningi indywidualne.",
    choices: () => [
      {
        label: "Bierzesz Bruna",
        desc: "Co mo\u017Ce zrobi\u0107 jeden pies?",
        chance: 70,
        success: { stats: { iq: 1 }, rep: 1 },
        successText: "Bruno okazuje si\u0119 anio\u0142em. Trener dotrzymuje s\u0142owa: dwie godziny taktyki jeden na jeden.",
        fail: { stats: { iq: 1 }, money: -150 },
        failText: "Bruno zjada twoje ochraniacze i p\xF3\u0142 kanapy. Treningi i tak by\u0142y warte."
      },
      { label: "Odmawiasz", desc: "Masz alergi\u0119 na psy. Podobno.", effects: {} }
    ]
  },
  // ---------- Plakat ze zdjęciem z 2016 ----------
  {
    id: "plakat.start",
    app: "fotogram",
    from: "Organizator gali",
    title: "Plakat gali gotowy",
    start: { weight: 3, cond: (s, c) => pro(s) && !c.pre },
    text: () => "Plakat gali gotowy! [plakat] Wzi\u0119li\u015Bmy zdj\u0119cie z internetu, wysz\u0142o super, prawda? (grzywka, w\u0105sik, koszulka szkolnego klubu)",
    choices: () => [
      { label: "Prosisz o zmian\u0119 zdj\u0119cia", desc: "Wysy\u0142asz nowe.", effects: { note: "nowy plakat po dw\xF3ch dniach" } },
      { label: "Udost\u0119pniasz z dopiskiem", desc: "\u201EW\u0105sik wraca na t\u0119 walk\u0119\u201D.", effects: { media: 3 } }
    ]
  },
  // ---------- Klub reaguje na wyniki ----------
  {
    id: "klub.pas",
    app: "gym",
    from: "Trener",
    title: "Grill w klubie",
    start: { weight: 40, cond: (s, c) => !c.pre && !!s.history.length && s.history[s.history.length - 1].title && s.history[s.history.length - 1].result === "W" && s.history[s.history.length - 1].season === s.season, repeat: true },
    text: () => "MISTRZU!!! \u{1F3C6} Ca\u0142a sala ogl\u0105da\u0142a na rzutniku. W sobot\u0119 grill w klubie, przynie\u015B pas, dzieciaki z grupy junior\xF3w nie \u015Bpi\u0105 z emocji.",
    choices: (s) => [
      { label: "Stawiasz pizz\u0119 ca\u0142emu klubowi", desc: "Dwadzie\u015Bcia pizz i cola. Klub zapami\u0119ta.", effects: { money: -zl(s, 400), relations: 2, rep: 1 } },
      { label: "Przychodzisz z pasem na zdj\u0119cia", desc: "Ka\u017Cdy junior chce zdj\u0119cie z pasem. Ka\u017Cdy.", effects: { media: 1, relations: 1 } },
      { label: "Odpoczywasz, nie dasz rady", desc: "Cia\u0142o m\xF3wi \u201Edo\u015B\u0107\u201D. Trener rozumie, dzieciaki troch\u0119 mniej.", effects: { wear: -1, relations: -1 } }
    ]
  },
  {
    id: "klub.seria",
    app: "gym",
    from: "Trener",
    title: "Dwie pora\u017Cki z rz\u0119du",
    start: { weight: 30, cond: (s, c) => !c.pre && pro(s) && s.history.length >= 2 && s.history.slice(-2).every((h) => h.result === "L" && !h.amateur), repeat: true },
    text: () => "Dwie pora\u017Cki z rz\u0119du. Jutro 7:00 w klubie, pogadamy. Bez telefonu, bez wym\xF3wek.",
    choices: () => [
      { label: "Przychodzisz i gadacie szczerze", desc: "Godzina rozmowy, nagrania, nowy plan. Boli, ale pomaga.", effects: { nextFight: 2, relations: 1 } },
      { label: "Bierzesz tydzie\u0144 wolnego", desc: "G\u0142owa musi odpocz\u0105\u0107. Trener kr\u0119ci nosem.", effects: { wear: -2, nextFight: -1 } },
      {
        label: "M\xF3wisz, \u017Ce to wina s\u0119dzi\xF3w",
        desc: "Trener patrzy na ciebie d\u0142ugo i nic nie m\xF3wi.",
        chance: 30,
        success: { relations: 0, note: "trener odpuszcza, ale zapami\u0119ta" },
        successText: "Trener wzdycha: \u201EDobra. Ale w nast\u0119pnej walce nie zostawiasz decyzji s\u0119dziom\u201D.",
        fail: { relations: -2, nextFight: -1 },
        failText: "Trener wychodzi z sali bez s\u0142owa. Mietek m\xF3wi, \u017Ce jeszcze go takim nie widzia\u0142."
      }
    ]
  },
  {
    id: "klub.nokaut",
    app: "gym",
    from: "Mietek",
    title: "WIDZIELI\u015ACIE TO?!",
    start: { weight: 12, cond: (s, c) => !c.pre && !!s.history.length && s.history[s.history.length - 1].result === "W" && s.history[s.history.length - 1].method === "KO/TKO" && !s.history[s.history.length - 1].title && s.history[s.history.length - 1].season === s.season, repeat: true },
    text: () => "WIDZIELI\u015ACIE TEN LEWY?!?! \u{1F631}\u{1F631} Puszczam w p\u0119tli od wczoraj. Ty, to po sparingach ze mn\u0105 taki lewy, nie?",
    choices: () => [
      { label: "\u201EJasne, to twoja zas\u0142uga\u201D", desc: "Mietek b\u0119dzie to powtarza\u0142 do ko\u0144ca \u017Cycia.", effects: { relations: 1, note: "Mietek drukuje sobie zdj\u0119cie" } },
      { label: "Wrzucasz film na Instagrym", desc: "Nokaut w zwolnionym tempie, z muzyk\u0105 z \u201ERocky\u2019ego\u201D.", effects: { media: 1 } },
      { label: "\u201E\u0106wiczy\u0142em go sam\u201D", desc: "Mietek odpisuje tylko \u201Eok\u201D.", effects: { relations: -1, rep: 1 } }
    ]
  },
  // ---------- Recenzja klubu na Gugle Mapach ----------
  {
    id: "recenzja.start",
    note: true,
    app: "mapka",
    from: "Gugle Mapy",
    title: "Nowa recenzja twojego klubu",
    start: { weight: 4, cond: () => true },
    text: (s) => `${s.club.name}: nowa recenzja \u2605\u2606\u2606\u2606\u2606 od \u201EGra\u017Cyna_z_Bloku\u201D: \u201ECi\u0105gle krzycz\u0105, jakby kto\u015B kogo\u015B bi\u0142. Okaza\u0142o si\u0119, \u017Ce bij\u0105. Nie polecam\u201D. Pod spodem 14 os\xF3b klikn\u0119\u0142o \u201Eprzydatne\u201D.`,
    choices: () => [
      { label: "Odpowiadasz z humorem", desc: "\u201EPani Gra\u017Cyno, pierwszy trening gratis\u201D.", effects: { media: 2, rep: 1, note: "pani Gra\u017Cyna przysz\u0142a na zaj\u0119cia dla senior\xF3w" } },
      { label: "Prosisz ekip\u0119 o pi\u0119\u0107 gwiazdek", desc: "Dwadzie\u015Bcia recenzji w godzin\u0119.", chance: 60, success: { media: 1 }, successText: "\u015Arednia skacze do 4,9. Kto\u015B pisze: \u201ESeba robi najlepsze kanapki w szatni\u201D.", fail: { rep: -1 }, failText: "Gugle usuwa recenzje jako \u201Epodejrzane\u201D. Zostaje tylko ta od Gra\u017Cyny." },
      { label: "Ignorujesz", desc: "Trener m\xF3wi, \u017Ce to jego s\u0105siadka.", effects: {} }
    ]
  },
  // ---------- Podejrzana transakcja w banku ----------
  {
    id: "bank_kebab.start",
    note: true,
    app: "bank",
    from: "Rewolwer",
    title: "Podejrzana transakcja",
    start: { weight: 3, cond: (_s, c) => c.pre },
    text: () => "Zauwa\u017Cyli\u015Bmy nietypow\u0105 aktywno\u015B\u0107 na koncie: 3 \xD7 \u201EKebab u Ahmeda\u201D, godz. 2:14, 2:31 i 2:58. Czy to Ty? Je\u015Bli nie, zablokujemy kart\u0119.",
    choices: (s) => [
      { label: "To ja. Dieta od poniedzia\u0142ku", desc: "Szczero\u015B\u0107 z bankiem.", effects: { nextFight: -1, note: "bank wysy\u0142a emotk\u0119 z kciukiem" } },
      { label: "\u201ETo nie ja\u201D, blokujesz kart\u0119", desc: "Lepiej dmucha\u0107 na zimne.", effects: { money: -zl(s, 50), note: "nowa karta przychodzi po tygodniu" } }
    ]
  },
  // ---------- Zjazd rocznika na Fejsbuku (w WhatsApce) ----------
  {
    id: "zjazd.start",
    app: "sms",
    from: "Kumpel z rocznika",
    title: "Zjazd rocznika",
    start: { weight: 3, cond: (s) => s.age >= 20 },
    text: () => "Stary, robimy zjazd ch\u0142opak\xF3w z amatorki. Grill, piwo, wspominki o pucharze w Gliwicach. W sobot\u0119. Wiem, \u017Ce masz ob\xF3z, ale raz si\u0119 \u017Cyje.",
    choices: () => [
      { label: "Wpadasz na godzin\u0119, bez piwa", desc: "Kie\u0142baska i wspomnienia.", effects: { relations: 1, rep: 1 } },
      { label: "Zostajesz do rana", desc: "Raz si\u0119 \u017Cyje, m\xF3wi\u0105.", chance: 40, success: { media: 2, rep: 1 }, successText: "Najlepsza noc od lat. Kto\u015B wrzuca wsp\xF3lne zdj\u0119cie, internet szaleje: \u201ERocznik 2010 wci\u0105\u017C razem\u201D.", fail: { nextFight: -2, wear: 1 }, failText: "Si\u0142owanie na r\u0119k\u0119 z by\u0142ym zapa\u015Bnikiem o trzeciej w nocy. \u0141okie\u0107 pami\u0119ta to do walki." },
      { label: "Odmawiasz, ob\xF3z to ob\xF3z", desc: "Ch\u0142opaki zrozumiej\u0105. Mo\u017Ce.", effects: { nextFight: 1, relations: -1 } }
    ]
  },
  // ---------- Juniorzy w klubie (Mesendżer) ----------
  {
    id: "juniorzy.start",
    app: "gym",
    from: "Trener",
    title: "Zast\u0119pstwo na juniorach",
    start: { weight: 4, cond: (s) => s.age >= 19 },
    text: () => "Mam w sobot\u0119 wesele szwagra. Poprowadzisz zaj\u0119cia dla dzieciak\xF3w o 10:00? Dwudziestu o\u015Bmiolatk\xF3w, jeden z nich gryzie. P\u0142ac\u0119 obiadem.",
    choices: () => [
      { label: "Prowadzisz zaj\u0119cia", desc: "Dzieciaki ci\u0119 uwielbiaj\u0105. Prawie wszystkie.", effects: { rep: 2, relations: 1, note: "ten, kt\xF3ry gryzie, zosta\u0142 twoim fanem" } },
      { label: "Robisz z tego nagranie na Instagrym", desc: "Zaj\u0119cia plus tre\u015B\u0107.", chance: 65, success: { media: 3, rep: 1 }, successText: "Rolka \u201Eucz\u0119 o\u015Bmiolatk\xF3w d\u017Awigni\u201D ma 80 tys. wy\u015Bwietle\u0144. Rodzice zapisuj\u0105 dzieci do klubu.", fail: { rep: -1, media: 1 }, failText: "Jedna mama pisze, \u017Ce nie zgadza\u0142a si\u0119 na nagrywanie. Usuwasz rolk\u0119 i przepraszasz." },
      { label: "Odmawiasz", desc: "Sobota to dzie\u0144 regeneracji.", effects: { nextFight: 1 } }
    ]
  },
  // ---------- Oliks: ktoś chce kupić twoje rzeczy ----------
  {
    id: "oliks_fan.start",
    note: true,
    app: "tasma",
    from: "Oliks \xB7 wiadomo\u015B\u0107 od kupuj\u0105cego",
    title: "Pytanie o og\u0142oszenie",
    start: { weight: 3, cond: (s) => s.record.w >= 3 },
    text: (s) => `Kupuj\u0105cy \u201EKolekcjoner_MMA\u201D pyta: \u201ECzy sprzedasz spodenki z ostatniej wygranej walki (rywal: ${s.history.filter((h) => !h.amateur && h.result === "W").slice(-1)[0]?.opponent ?? "niewa\u017Cne"})? Najlepiej nieprane. P\u0142ac\u0119 dobrze, nie pytaj dlaczego\u201D.`,
    choices: (s) => [
      { label: "Sprzedajesz, i to nieprane", desc: "Nie pytasz dlaczego.", effects: { money: zl(s, 500), media: 1, note: "nie pytasz dlaczego" } },
      { label: "Oddajesz na licytacj\u0119 charytatywn\u0105", desc: "Dzieci zamiast dziwaka.", effects: { rep: 3, media: 1 } },
      { label: "Blokujesz u\u017Cytkownika", desc: "S\u0105 granice.", effects: {} }
    ]
  },
  // ---------- Spotifaj: hejt w podcaście ----------
  {
    id: "podkast_hejt.start",
    app: "sms",
    from: "Kolega z klubu",
    title: "S\u0142ysza\u0142e\u015B ten podcast?",
    start: { weight: 3, cond: (s) => s.tier >= 1 },
    text: (s) => `S\u0142ucha\u0142e\u015B najnowszego odcinka \u201ERozbi\xF3rki MMA\u201D? Przez 12 minut gadaj\u0105, \u017Ce ${s.profile.lastName} to \u201Enajbardziej przereklamowany zawodnik w kraju\u201D. Wrzuci\u0142em ci link na Spotifaju.`,
    choices: () => [
      { label: "Dzwonisz do studia na \u017Cywo", desc: "Raz si\u0119 \u017Cyje.", chance: 50, success: { media: 4, rep: 1 }, successText: "Prowadz\u0105cy zaskoczony, rozmowa na luzie, ko\u0144czy si\u0119 zaproszeniem do studia. Fragment kr\u0105\u017Cy po sieci.", fail: { media: 2, rep: -2 }, failText: "Puszczaj\u0105 ci nerwy na antenie. Klip \u201Ezawodnik dzwoni z p\u0142aczem\u201D ma ju\u017C remixy." },
      { label: "Odpowiadasz wygran\u0105", desc: "Najlepsza odpowied\u017A to klatka.", effects: { nextFight: 1, note: "link zapisany do motywacji" } },
      { label: "Nie s\u0142uchasz", desc: "Zdrowie psychiczne.", effects: {} }
    ]
  }
];
function findStep(id) {
  return THREADS.find((t) => t.id === id);
}

// src/engine/errands.ts
var sc2 = (s) => [1, 1.5, 3, 5, 8][Math.min(4, Math.max(0, s.tier))] ?? 1;
var zl2 = (s, n) => Math.max(50, Math.round(n * sc2(s) / 50) * 50);
var ERRANDS_PER_YEAR = 2;
var ERRANDS = [
  {
    id: "bramka",
    name: "Zmiana na bramce",
    hours: 3,
    desc: "Noc w klubie \u201EPresti\u017C\u201D. Kasa do r\u0119ki, sen w plecy.",
    cond: (s) => s.age >= 18 && s.tier <= 2,
    outcomes: (s) => [
      { w: 6, text: "Spokojna noc. Najgro\u017Aniejszy by\u0142 pan w garniturze, kt\xF3ry chcia\u0142 wej\u015B\u0107 z kotem.", effects: { money: zl2(s, 400), wear: 1 } },
      { w: 3, text: "O 3:40 trzech go\u015Bci pr\xF3buje wej\u015B\u0107 bez kolejki. Wychodz\u0105 szybciej, ni\u017C przyszli. Szef bramki dorzuca premi\u0119.", effects: { money: zl2(s, 550), rep: 1, wear: 1 } },
      { w: 2, text: "Kto\u015B nagrywa, jak wyprowadzasz awanturnika. Film kr\u0105\u017Cy po osiedlowych grupach.", effects: { money: zl2(s, 400), media: 2, rep: -1 } },
      { w: 1, text: "Awanturnik okaza\u0142 si\u0119 zapa\u015Bnikiem. Wygrywasz, ale nadgarstek boli przez tydzie\u0144.", effects: { money: zl2(s, 400), wear: 2, nextFight: -1 } }
    ]
  },
  {
    id: "seminarium",
    name: "Seminarium parterowe",
    hours: 2,
    desc: "Czarny pas z Brazylii, sala gimnastyczna w liceum, 40 os\xF3b na macie.",
    cost: (s) => zl2(s, 250),
    outcomes: () => [
      { w: 5, text: "Trzy nowe wej\u015Bcia w tr\xF3jk\u0105t i jedno, kt\xF3rego nikt nie umia\u0142 powt\xF3rzy\u0107. Ty umia\u0142e\u015B.", effects: { stats: { bjj: 1 } } },
      { w: 2, text: "Instruktor bierze ci\u0119 do pokaz\xF3w. Dwie godziny bycia manekinem ucz\u0105 wi\u0119cej ni\u017C tydzie\u0144 na sali.", effects: { stats: { bjj: 1, iq: 1 }, wear: 1 } },
      { w: 1, text: "Po\u0142owa seminarium o oddychaniu i \u201Eflow\u201D. Wychodzisz zrelaksowany i bez nowych technik.", effects: { wear: -2 } }
    ]
  },
  {
    id: "fizjo",
    name: "Fizjoterapeuta",
    hours: 1,
    desc: "Pani Ewa ma r\u0119ce jak imad\u0142o i zero lito\u015Bci.",
    cost: (s) => zl2(s, 200),
    outcomes: () => [
      { w: 6, text: "Pani Ewa znajduje trzy spi\u0119cia, o kt\xF3rych nie wiedzia\u0142e\u015B. Wychodzisz l\u017Cejszy o pi\u0119\u0107 lat.", effects: { wear: -5 } },
      { w: 2, text: "Godzina, po kt\xF3rej nie mo\u017Cesz podnie\u015B\u0107 r\u0119ki do telefonu. Nast\u0119pnego dnia czujesz si\u0119 jak nowy.", effects: { wear: -7 } }
    ]
  },
  {
    id: "budowa",
    name: "Fucha na budowie",
    hours: 2,
    desc: "Kuzyn wylewa fundament i potrzebuje kogo\u015B do taczki.",
    cond: (s) => s.tier <= 1,
    outcomes: (s) => [
      { w: 5, text: "Dwie godziny taczki. Kuzyn p\u0142aci got\xF3wk\u0105 i m\xF3wi, \u017Ce jeste\u015B \u201Esilny jak ko\u0144, ale wolny\u201D.", effects: { money: zl2(s, 300), wear: 1 } },
      { w: 2, text: "Betoniarka si\u0119 psuje, wi\u0119c mieszasz \u0142opat\u0105. Plecy pami\u0119taj\u0105 to do wieczora.", effects: { money: zl2(s, 350), wear: 2 } },
      { w: 1, text: "Kierownik budowy rozpoznaje ci\u0119 z gali i ka\u017Ce tylko robi\u0107 sobie z nim zdj\u0119cia. P\u0142aci tak samo.", effects: { money: zl2(s, 300), media: 1 } }
    ]
  },
  {
    id: "dzieci",
    name: "Trening dla dzieci",
    hours: 1,
    desc: "Grupa 7\u201310 lat. Dwunastu ma\u0142ych zawodnik\xF3w i jeden plan zaj\u0119\u0107.",
    outcomes: (s) => [
      { w: 5, text: "Dzieci ucz\u0105 si\u0119 przewrot\xF3w, ty uczysz si\u0119 cierpliwo\u015Bci. Rodzice robi\u0105 zdj\u0119cia.", effects: { money: zl2(s, 150), rep: 1 } },
      { w: 2, text: "Ma\u0142y Antek zak\u0142ada ci duszenie zza plec\xF3w. Ca\u0142a grupa krzyczy, a ty udajesz, \u017Ce klepiesz.", effects: { money: zl2(s, 150), rep: 1, relations: 1 } },
      { w: 1, text: "Jedno dziecko p\u0142acze, drugie gryzie, trzecie pyta, ile zarabiasz. Wychodzisz zm\u0119czony bardziej ni\u017C po sparingu.", effects: { money: zl2(s, 150), wear: 1 } }
    ]
  },
  {
    id: "openmat",
    name: "Open mat w obcym klubie",
    hours: 2,
    desc: "Klub z drugiego ko\u0144ca miasta. Nikt ci\u0119 nie zna, wszyscy chc\u0105 ci\u0119 sprawdzi\u0107.",
    outcomes: () => [
      { w: 4, text: "Miejscowy \u201Eniebieski pas\u201D chcia\u0142 si\u0119 sprawdzi\u0107. Sprawdzi\u0142. Wymieniacie si\u0119 numerami.", effects: { stats: { wrest: 1 }, rep: 1 } },
      { w: 3, text: "Trafiasz na by\u0142ego zapa\u015Bnika kadry. Godzina pod nim to lekcja, kt\xF3rej nie kupisz.", effects: { stats: { wrest: 1 }, wear: 1 } },
      { w: 1, text: "Kto\u015B idzie na sto procent i trafia ci\u0119 \u0142okciem. \u0141uk brwiowy do szycia.", effects: { wear: 2, nextFight: -1 } }
    ]
  },
  {
    id: "sesja",
    name: "Sesja zdj\u0119ciowa sponsora",
    hours: 1,
    desc: "Fotograf, o\u015Bwietlenie i produkt sponsora w ka\u017Cdym kadrze.",
    cond: (s) => s.sponsors.length > 0,
    outcomes: (s) => [
      { w: 5, text: "Godzina pozowania z produktem. Zdj\u0119cia wychodz\u0105 \u015Bwietnie, sponsor zadowolony.", effects: { money: zl2(s, 300), media: 2 } },
      { w: 2, text: "Fotograf ka\u017Ce ci \u201Epatrze\u0107 gro\u017Anie, ale przyja\u017Anie\u201D. Po 200 zdj\u0119ciach jedno si\u0119 nadaje. To wystarczy.", effects: { money: zl2(s, 300), media: 1 } }
    ]
  }
];
function findErrand(id) {
  return ERRANDS.find((e) => e.id === id);
}

// src/engine/camp.ts
var CAMP_WEEKS = 3;
var CAMP_BASE = 2;
var sc3 = (s) => [1, 1.5, 3, 5, 8][Math.min(4, Math.max(0, s.tier))] ?? 1;
var zl3 = (s, n) => Math.max(50, Math.round(n * sc3(s) / 50) * 50);
var STAT_NAME = { stand: "st\xF3jk\u0119", wrest: "zapasy", bjj: "parter", cardio: "kondycj\u0119", chin: "szcz\u0119k\u0119", iq: "taktyk\u0119" };
function weakest(s) {
  return ["stand", "wrest", "bjj"].sort((a, b) => s.stats[a] - s.stats[b])[0];
}
var CAMP_ACTS = [
  {
    id: "sparingi",
    name: "Twarde sparingi",
    desc: "Pe\u0142ne rundy z mocniejszymi od siebie.",
    hint: "du\u017Co formy, zu\u017Cycie",
    roll: (_s, rng) => {
      const r = rng.next();
      if (r < 0.15)
        return { text: rng.pick(["Mietek trafia ci\u0119 \u0142okciem w \u0142uk brwiowy. Trzy szwy i tydzie\u0144 ostro\u017Cno\u015Bci.", "Sparingpartner o 15 kg ci\u0119\u017Cszy siada ci na \u017Cebrach. Oddychasz ostro\u017Cnie do ko\u0144ca tygodnia."]), effects: { wear: 1 }, mod: 0 };
      if (r < 0.45)
        return { text: rng.pick(["Pi\u0119\u0107 rund z by\u0142ym mistrzem regionu. Ko\u0144czysz na kolanach, ale co\u015B zaskoczy\u0142o.", "Trzech sparingpartner\xF3w na zmian\u0119, co minut\u0119 \u015Bwie\u017Cy. Pod koniec przestajesz my\u015Ble\u0107 i zaczynasz walczy\u0107."]), effects: {}, mod: 3 };
      return { text: rng.pick(["Twarde rundy, czyste trafienia z obu stron. Tak ma wygl\u0105da\u0107 ob\xF3z.", "Sparingi do zm\u0119czenia. Trener tylko kiwa g\u0142ow\u0105, co u niego znaczy \u201Edobrze\u201D.", "Mietek w formie \u017Cycia, ty te\u017C. Nikt nie odpuszcza."]), effects: {}, mod: 2 };
    }
  },
  {
    id: "technika",
    name: "Technika z trenerem",
    desc: "Powt\xF3rzenia, poprawki, tablica z rozrysowanym planem.",
    hint: "forma, czasem punkt umiej\u0119tno\u015Bci",
    roll: (s, rng) => {
      const k = weakest(s);
      if (rng.chance(0.22)) return { text: `Tydzie\u0144 d\u0142ubania w detalach. Trener w ko\u0144cu przestaje poprawia\u0107 ci ${STAT_NAME[k]}.`, effects: { stats: { [k]: 1 } }, mod: 1 };
      return { text: rng.pick(["Sto powt\xF3rze\u0144 tego samego wej\u015Bcia. Na sto pierwszym trener m\xF3wi \u201Eno\u201D.", "Godziny przy tarczach i nagraniach. Mniej efektowne ni\u017C sparingi, ale wchodzi w nawyk.", "Trener rozrysowuje plan na tablicy. Tym razem rozumiesz ka\u017Cd\u0105 strza\u0142k\u0119.", "Lustro, cie\u0144 i trener, kt\xF3ry powtarza \u201E\u0142okie\u0107\u201D czterdzie\u015Bci razy dziennie.", "Ca\u0142y tydzie\u0144 jednej kombinacji. W pi\u0105tek robisz j\u0105 przez sen.", "Trener przynosi stare kasety VHS z walk z lat dziewi\u0119\u0107dziesi\u0105tych. Dzia\u0142a."]), effects: {}, mod: 2 };
    }
  },
  {
    id: "kondycja",
    name: "Kondycja",
    desc: "Interwa\u0142y, g\xF3ry, schody na stadionie.",
    hint: "forma, czasem kondycja",
    roll: (_s, rng) => {
      if (rng.chance(0.2)) return { text: "Schody na stadionie, sto razy w g\xF3r\u0119. W trzeciej rundzie b\u0119dziesz \u015Bwie\u017Cy.", effects: { stats: { cardio: 1 } }, mod: 1 };
      return { text: rng.pick(["Interwa\u0142y na bie\u017Cni, a\u017C ci si\u0119 czarno przed oczami robi. Trener m\xF3wi, \u017Ce to dopiero rozgrzewka.", "Bieganie po lesie z kamizelk\u0105 obci\u0105\u017Ceniow\u0105. Grzybiarze patrz\u0105 dziwnie.", "P\u0142ywalnia o sz\xF3stej rano. Ratownik ju\u017C ci\u0119 zna.", "Rower stacjonarny w piwnicy klubu. Sto minut, zero widok\xF3w, jeden plakat Rocky\u2019ego.", "Sprinty pod g\xF3r\u0119 za klubem. S\u0105siad z dzia\u0142ki dopinguje z le\u017Caka.", "Skakanka, pi\u0119\u0107 rund po pi\u0119\u0107 minut. Sufit w szatni ma now\u0105 plam\u0119 po twoim pocie."]), effects: {}, mod: 2 };
    }
  },
  {
    id: "rywal",
    name: "Analiza rywala",
    desc: "Nagrania jego walk, nawyki, ulubione kombinacje.",
    hint: "forma na t\u0119 walk\u0119",
    roll: (s, rng, opp, _w, picks) => {
      const again = picks.includes("rywal");
      const smart = s.stats.iq >= 50;
      if (again) return { text: `Drugi tydzie\u0144 nagra\u0144 tego samego rywala. ${opp.firstName} ${opp.lastName} \u015Bni ci si\u0119 po nocach, ale nic nowego nie widzisz.`, effects: {}, mod: 0 };
      return {
        text: rng.pick([
          `${opp.lastName} przed ka\u017Cdym kopni\u0119ciem opuszcza prawy bark. Trener zatrzymuje nagranie i pokazuje palcem.`,
          `Dziesi\u0119\u0107 walk rywala w tydzie\u0144. Wiesz ju\u017C, co ${opp.lastName} robi, kiedy si\u0119 zm\u0119czy.`,
          `${opp.lastName} nie lubi, jak si\u0119 go spycha pod siatk\u0119. Ca\u0142y plan staje si\u0119 prosty.`
        ]),
        effects: {},
        mod: smart ? 3 : 2
      };
    }
  },
  {
    id: "regeneracja",
    name: "Regeneracja",
    desc: "Fizjo, sauna, sen. Mniej treningu, wi\u0119cej cia\u0142a.",
    hint: "mniej zu\u017Cycia",
    roll: (s, rng) => {
      if (s.wear < 10) return { text: rng.pick(["Regenerujesz si\u0119, cho\u0107 nie by\u0142o z czego. Nudzisz si\u0119 i ogl\u0105dasz seriale.", "Tydzie\u0144 odpoczynku od niczego. Obejrza\u0142e\u015B trzy sezony serialu o mafii.", "Le\u017Cysz i odpoczywasz. Cia\u0142o nie wie, od czego, ale si\u0119 zgadza."]), effects: { wear: -1 }, mod: 0 };
      return { text: rng.pick(["Pani Ewa z fizjoterapii robi z twoich plec\xF3w nowe plecy.", "Tydzie\u0144 snu, sauny i lekkiego ruchu. Pierwszy raz od miesi\u0119cy nic nie boli.", "Krioterapia w Spale. Trzy minuty w minus stu dziesi\u0119ciu i nagle wszystko jest prostsze.", "Masa\u017C, joga z dziewczyn\u0105 trenera i dziesi\u0119\u0107 godzin snu. Cia\u0142o dzi\u0119kuje.", "Basen, rozci\u0105ganie i drzemki. Trener m\xF3wi, \u017Ce to te\u017C trening. Wierzysz mu na s\u0142owo."]), effects: { wear: -2 }, mod: 1 };
    }
  },
  {
    id: "fucha",
    name: "Fucha po treningach",
    desc: "Bramka, budowa, kurier. Pieni\u0105dze si\u0119 przydadz\u0105.",
    hint: "pieni\u0105dze, mniej formy",
    cond: (s) => s.tier <= 2,
    roll: (s, rng) => ({
      text: rng.pick(["Trzy nocki na bramce w \u201EPresti\u017Cu\u201D. Kasa jest, snu brak.", "Kuzyn potrzebowa\u0142 r\u0105k na budowie. Plecy bol\u0105, portfel pe\u0142niejszy.", "Kurier po treningach. Znasz ju\u017C ka\u017Cdy domofon na osiedlu.", "Wnoszenie mebli z koleg\u0105. Szafa trzydrzwiowa na czwarte pi\u0119tro to te\u017C trening.", "Ochrona na festynie w gminie. Najgro\u017Aniejszy by\u0142 pan z wat\u0105 cukrow\u0105.", "Roz\u0142adunek w hurtowni. Kierownik pyta, czy nie chcesz etatu."]),
      effects: { money: zl3(s, 400) },
      mod: 0
    })
  },
  {
    id: "media",
    name: "Media i sponsorzy",
    desc: "Wywiady, nagrania, zdj\u0119cia z produktem.",
    hint: "media, mniej formy",
    roll: (s, rng) => ({
      text: rng.pick(["Trzy wywiady, dwa podcasty i sesja zdj\u0119ciowa. Trening wciskasz mi\u0119dzy nagrania.", "Tydzie\u0144 jak w telewizji: kamera wsz\u0119dzie, nawet na rozci\u0105ganiu.", "Spotkanie ze sponsorem i rolka na Instagrym. Telefon \u0142adujesz cz\u0119\u015Bciej ni\u017C siebie.", "Nagranie reklamy suplementu. Dwadzie\u015Bcia dubli, w ka\u017Cdym udajesz, \u017Ce smakuje.", "Wywiad do lokalnej gazety. Dziennikarz pyta g\u0142\xF3wnie o twoj\u0105 mam\u0119.", "Sesja zdj\u0119ciowa w hali. Fotograf ka\u017Ce ci \u201Epatrze\u0107 gro\u017Anie, ale przyja\u017Anie\u201D."]),
      effects: { media: 2, money: s.sponsors.length ? zl3(s, 200) : 0 },
      mod: 0
    })
  }
];
function findCampAct(id) {
  return CAMP_ACTS.find((a) => a.id === id);
}

// src/engine/fightweek.ts
var sc4 = (s) => [1, 1.5, 3, 5, 8][Math.min(4, Math.max(0, s.tier))] ?? 1;
var zl4 = (s, n) => Math.max(50, Math.round(n * sc4(s) / 50) * 50);
var WEEK_EVENTS = [
  {
    id: "hotel",
    title: "Wesele za \u015Bcian\u0105",
    w: 5,
    text: (_s, o) => `Hotel organizatora przy obwodnicy. Za \u015Bcian\u0105 wesele do czwartej rano, a za trzy dni walka. Rywal: ${o.opp.lastName}. Disco polo przez \u015Bcian\u0119 s\u0142ycha\u0107 tak, jakby zesp\xF3\u0142 gra\u0142 w \u0142azience.`,
    choices: (s) => [
      { label: "Zmieniasz hotel na w\u0142asny koszt", desc: "Cisza, ale portfel cierpi.", effects: { money: -zl4(s, 400) } },
      { label: "Zatyczki do uszu i medytacja", desc: "Albo zadzia\u0142a, albo nie.", chance: 55, success: { nextFight: 0, note: "\u015Bpisz jak dziecko" }, successText: "Zatyczki daj\u0105 rad\u0119. Budzisz si\u0119 wyspany i lekko nucisz \u201EBayer full\u201D.", fail: { nextFight: -2 }, failText: "O trzeciej orkiestra gra \u201ESoko\u0142y\u201D. Nie \u015Bpisz do rana." },
      { label: "Idziesz na wesele", desc: "Skoro i tak nie za\u015Bniesz\u2026", chance: 30, success: { media: 2, nextFight: 1, note: "pan m\u0142ody stawia ci bilet na gal\u0119" }, successText: "Ta\u0144czysz z babci\u0105 panny m\u0142odej, a go\u015Bcie obiecuj\u0105, \u017Ce przyjd\u0105 kibicowa\u0107. Wracasz o p\xF3\u0142nocy, na\u0142adowany.", fail: { nextFight: -3, wear: 1 }, failText: "Wujek pana m\u0142odego chce si\u0119 si\u0142owa\u0107 na r\u0119k\u0119. Potem drugi wujek. Wracasz o pi\u0105tej." }
    ]
  },
  {
    id: "zatrucie",
    title: "Co\u015B by\u0142o nie tak z kebabem",
    w: 4,
    text: () => "Dwa dni przed walk\u0105 budzisz si\u0119 o drugiej w nocy. Kebab z dworca okaza\u0142 si\u0119 b\u0142\u0119dem. \u017Bo\u0142\u0105dek robi salta, a wa\u017Cenie jutro rano.",
    choices: (s) => [
      { label: "Lekarz gali i kropl\xF3wka", desc: "Pewne, ale kosztuje i troch\u0119 os\u0142abia.", effects: { money: -zl4(s, 300), nextFight: -1 } },
      { label: "Przetrzymujesz na wodzie z sol\u0105", desc: "Domowy spos\xF3b babci.", chance: 60, success: { nextFight: 0, note: "babcia mia\u0142a racj\u0119" }, successText: "Rano jak nowy. Babcia na Mesend\u017Cerze pisze \u201Ea nie m\xF3wi\u0142am\u201D.", fail: { nextFight: -3 }, failText: "Do walki wchodzisz blady jak \u015Bciana. Naro\u017Cnik pyta, czy na pewno dasz rad\u0119." }
    ]
  },
  {
    id: "waga_rywala",
    title: "Rywal nie zrobi\u0142 wagi",
    w: 4,
    cond: (s, o) => !o.title && !o.wantPress && s.tier >= 1,
    text: (_s, o) => `${o.opp.firstName} ${o.opp.lastName} na wa\u017Ceniu: p\xF3\u0142tora kilo za du\u017Co. Organizator pyta, czy mimo to wychodzisz do walki. Rywal oddaje ci 20% swojej ga\u017Cy.`,
    choices: (_s, o) => [
      { label: "Walczysz i bierzesz jego pieni\u0105dze", desc: "B\u0119dzie ci\u0119\u017Cszy, ale kasa jest kasa.", effects: { money: Math.round(o.purse * 0.2 / 100) * 100, nextFight: -1 } },
      { label: "\u017B\u0105dasz premii od organizatora", desc: "Albo dop\u0142ac\u0105, albo uznaj\u0105 ci\u0119 za kapry\u015Bnego.", chance: 50, success: { money: Math.round(o.purse * 0.4 / 100) * 100, nextFight: -1 }, successText: "Organizator wzdycha i dop\u0142aca. Rywal nawet nie patrzy ci w oczy na face to face.", fail: { rep: -2, money: Math.round(o.purse * 0.2 / 100) * 100, nextFight: -1 }, failText: "Organizator m\xF3wi, \u017Ce \u201Egwiazdorzysz\u201D. Dostajesz tylko te 20%, a w mediach kto\u015B nazywa ci\u0119 primadonn\u0105." },
      { label: "\u201ENiech je, mnie to nie robi r\xF3\u017Cnicy\u201D", desc: "Pokaz pewno\u015Bci siebie przed kamerami.", effects: { rep: 2, nextFight: -1, media: 1 } }
    ]
  },
  {
    id: "kibice",
    title: "Autokar z twojego miasta",
    w: 4,
    text: (s) => `Pod hotel podje\u017Cd\u017Ca autokar. Tablica: ${s.profile.hometown}. Pi\u0119\u0107dziesi\u0105t os\xF3b w koszulkach z twoj\u0105 twarz\u0105, transparent i b\u0119ben. Chc\u0105 zdj\u0119cie. Ka\u017Cdy.`,
    choices: () => [
      { label: "Wychodzisz do nich na godzin\u0119", desc: "Zdj\u0119cia, autografy, u\u015Bciski od cio\u0107.", effects: { rep: 2, media: 1, nextFight: 1, note: "ciocia p\u0142acze ze wzruszenia" } },
      { label: "Machasz z okna i wracasz do planu", desc: "Skupienie przed walk\u0105 jest wa\u017Cniejsze.", effects: { nextFight: 1, rep: -1 } }
    ]
  },
  {
    id: "trener_chory",
    title: "Trener z gor\u0105czk\u0105",
    w: 3,
    text: () => "Trzy dni przed gal\u0105 trener dzwoni z \u0142\xF3\u017Cka: 39 stopni. W naro\u017Cniku stanie asystent, kt\xF3ry dwa razy w \u017Cyciu trzyma\u0142 tarcze.",
    choices: (s) => [
      { label: "Bierzesz asystenta", desc: "M\u0142ody, ch\u0119tny, przera\u017Cony.", effects: { nextFight: -2 } },
      { label: "Dzwonisz do swojego pierwszego trenera", desc: "Przyjedzie, ale trzeba mu op\u0142aci\u0107 podr\xF3\u017C i nocleg.", effects: { money: -zl4(s, 500), relations: 1, nextFight: 0, note: "stary trener m\xF3wi \u201Ejak za dawnych lat\u201D" } }
    ]
  },
  {
    id: "grozba",
    title: "Ten sam samoch\xF3d pod hotelem",
    w: 4,
    cond: (_s, o) => !!o.hype?.dm || !!o.opp.freak || !!o.rival,
    text: () => "Trzeci dzie\u0144 z rz\u0119du pod hotelem stoi ten sam czarny samoch\xF3d z przyciemnianymi szybami. Kto\u015B robi zdj\u0119cia, jak wychodzisz na rozruch.",
    choices: () => [
      { label: "Zg\u0142aszasz ochronie federacji", desc: "Niech si\u0119 tym zajm\u0105 profesjonali\u015Bci.", effects: { nextFight: 0, note: "ochrona spisuje numery" } },
      { label: "Podchodzisz i pukasz w szyb\u0119", desc: "Raz si\u0119 \u017Cyje.", chance: 60, success: { nextFight: 1, media: 1 }, successText: "W \u015Brodku fan z aparatem. Przeprasza, prosi o autograf i odje\u017Cd\u017Ca. \u015Amiejesz si\u0119 ca\u0142y dzie\u0144.", fail: { nextFight: -2 }, failText: "Samoch\xF3d odje\u017Cd\u017Ca z piskiem opon. Nie \u015Bpisz do rana, ka\u017Cdy d\u017Awi\u0119k na korytarzu brzmi jak kroki." },
      { label: "Ignorujesz", desc: "Nie dajesz si\u0119 wci\u0105gn\u0105\u0107 w gierki.", chance: 70, success: { nextFight: 0 }, successText: "Samoch\xF3d znika po dniu. Pewnie nic takiego.", fail: { nextFight: -1 }, failText: "Niby ignorujesz, ale w g\u0142owie siedzi. Na rozruchu jeste\u015B spi\u0119ty." }
    ]
  },
  {
    id: "media_day",
    title: "Media day",
    w: 5,
    text: (_s, o) => `Media day przed gal\u0105. Dziennikarka z telewizji pyta, czy to prawda, \u017Ce ${o.opp.lastName} sparowa\u0142 z twoim by\u0142ym klubem i \u201Ezna wszystkie twoje sekrety\u201D.`,
    choices: () => [
      { label: "\u201ENiech zna. I tak go zaskocz\u0119.\u201D", desc: "Pewno\u015B\u0107 siebie dobrze wygl\u0105da w telewizji.", effects: { media: 1, rep: 1 } },
      { label: "Zmieniasz plan na ostatni\u0105 chwil\u0119", desc: "Nowa taktyka trzy dni przed walk\u0105. Ryzykowne.", chance: 50, success: { nextFight: 2 }, successText: "Trener rysuje nowy plan na serwetce. Rywal b\u0119dzie zaskoczony.", fail: { nextFight: -2 }, failText: "Nowy plan miesza ci w g\u0142owie. Na rozgrzewce mylisz kombinacje." },
      { label: "Wychodzisz z wywiadu", desc: "Nie b\u0119dziesz odpowiada\u0142 na plotki.", effects: { media: 2, rep: -1 } }
    ]
  },
  {
    id: "sauna",
    title: "Sauna nieczynna",
    w: 5,
    cond: (s) => (s.diet ?? "norma") !== "catering" && (s.division ?? s.profile.weight) !== "ciezka",
    text: () => "Dzie\u0144 przed wa\u017Ceniem, a hotelowa sauna \u201Ew remoncie\u201D. Do limitu brakuje ci jeszcze kilograma.",
    choices: (s) => [
      { label: "Szukasz prywatnej sauny w mie\u015Bcie", desc: "Taks\xF3wka, p\u0142atne wej\u015Bcie, ale waga zejdzie.", effects: { money: -zl4(s, 200) } },
      { label: "Gor\u0105ca k\u0105piel i folia", desc: "Stary spos\xF3b zawodnik\xF3w.", chance: 65, success: { nextFight: 0 }, successText: "Kilogram schodzi do rana. Hotelowa wanna nigdy nie widzia\u0142a tyle potu.", fail: { nextFight: -2, wear: 1 }, failText: "Waga schodzi, ale razem z si\u0142ami. Na wa\u017Ceniu kr\u0119ci ci si\u0119 w g\u0142owie." }
    ]
  },
  {
    id: "walizka",
    title: "Baga\u017C polecia\u0142 do Lizbony",
    w: 3,
    text: (s) => `Na lotnisku ta\u015Bma kr\u0119ci si\u0119 pusta. Twoja torba z r\u0119kawicami, spodenkami i ochraniaczem polecia\u0142a podobno do Lizbony. Walka za dwa dni. ${s.profile.firstName}, masz na sobie dres i klapki.`,
    choices: (s) => [
      { label: "Kupujesz wszystko od nowa", desc: "Sklep sportowy przy galerii, ceny jak na lotnisku.", effects: { money: -zl4(s, 450) } },
      { label: "Po\u017Cyczasz od ch\u0142opak\xF3w z innych klub\xF3w", desc: "Spodenki dwa rozmiary za du\u017Ce, ale s\u0105.", chance: 70, success: { rep: 1, note: "p\xF3\u0142 szatni ma u ciebie piwo" }, successText: "Kto\u015B po\u017Cycza r\u0119kawice, kto\u015B spodenki, kto\u015B ochraniacz (\u201Ewygotowany, przysi\u0119gam\u201D). Szatnia dawno nie by\u0142a tak zgrana.", fail: { nextFight: -1 }, failText: "Spodenki spadaj\u0105 przy ka\u017Cdym kopni\u0119ciu. Na rozgrzewce trzymasz je jedn\u0105 r\u0119k\u0105." },
      { label: "Piszesz posta z p\u0142aczem do linii lotniczych", desc: "Mo\u017Ce si\u0119 rozniesie.", chance: 45, success: { media: 3, note: "linia lotnicza przeprasza na Instagrymie" }, successText: "Post wybucha. Linia lotnicza przysy\u0142a kuriera z torb\u0105 i voucher na lot. Ludzie pisz\u0105, \u017Ce to lepsze ni\u017C serial.", fail: { money: -zl4(s, 450), media: 1 }, failText: "Linia odpisuje automatem: \u201ETwoje zg\u0142oszenie jest dla nas wa\u017Cne\u201D. Kupujesz wszystko od nowa." }
    ]
  },
  {
    id: "byla",
    title: "\u201EPowodzenia \u2764\uFE0F\u201D",
    w: 3,
    text: () => "Trzy dni przed walk\u0105, 23:47. By\u0142a pisze \u201Epowodzenia \u2764\uFE0F\u201D. Pierwsza wiadomo\u015B\u0107 od dw\xF3ch lat. Telefon le\u017Cy na ko\u0142drze i \u015Bwieci.",
    choices: () => [
      { label: "Odpisujesz \u201Edzi\u0119ki\u201D", desc: "Kr\xF3tko i kulturalnie.", chance: 55, success: { nextFight: 0 }, successText: "Odpisuje kciukiem. Koniec rozmowy. Zasypiasz po godzinie gapienia si\u0119 w sufit.", fail: { nextFight: -1 }, failText: "Odpisuje elaboratem. Ko\u0144czycie o trzeciej, a ty nie wiesz ju\u017C, kto kogo zostawi\u0142." },
      { label: "Blokujesz numer", desc: "Tydzie\u0144 walki to tydzie\u0144 walki.", effects: { nextFight: 1, note: "telefon na noc do szuflady" } },
      { label: "Pokazujesz trenerowi", desc: "On wie, co z tym zrobi\u0107.", effects: { nextFight: 1, relations: 1, note: "trener: \u201Eusu\u0144 i spa\u0107\u201D" } }
    ]
  },
  {
    id: "paczek",
    title: "Zdj\u0119cie z p\u0105czkiem",
    w: 3,
    text: (s) => `Portal plotkarski wrzuca zdj\u0119cie: ${s.profile.firstName} ${s.profile.lastName} przed piekarni\u0105, z p\u0105czkiem w r\u0119ce. Tytu\u0142: \u201ETak si\u0119 przygotowuje do walki?!\u201D. To by\u0142 p\u0105czek dla mamy.`,
    choices: () => [
      { label: "Wrzucasz zdj\u0119cie mamy z tym p\u0105czkiem", desc: "Dow\xF3d rzeczowy.", effects: { media: 3, rep: 1, note: "mama ma 4 tys. polubie\u0144" } },
      { label: "Zjadasz p\u0105czka na live\u2019ie", desc: "Skoro i tak ju\u017C o tym pisz\u0105.", chance: 50, success: { media: 4 }, successText: "Live ogl\u0105da dziesi\u0119\u0107 tysi\u0119cy ludzi. Kto\u015B robi z tego remix. Nawet rywal pisze \u201Eszacun\u201D.", fail: { media: 2, nextFight: -1 }, failText: "\u015Amieszne by\u0142o przez minut\u0119. Waga nast\u0119pnego dnia: p\xF3\u0142 kilo wi\u0119cej. Trener nie odzywa si\u0119 do wieczora." },
      { label: "Nie komentujesz", desc: "P\u0105czek zniesie wszystko.", effects: {} }
    ]
  },
  {
    id: "sloiki",
    title: "Mama w recepcji",
    w: 3,
    text: () => "Recepcja dzwoni do pokoju: \u201EPana mama przyjecha\u0142a. Ma ze sob\u0105\u2026 du\u017Co s\u0142oik\xF3w\u201D. Ros\xF3\u0142, go\u0142\u0105bki, pierogi i bigos na wszelki wypadek.",
    choices: () => [
      { label: "Jesz ros\xF3\u0142, reszt\u0119 rozdajesz w szatni", desc: "Ros\xF3\u0142 to nie dieta, to lekarstwo.", effects: { nextFight: 1, rep: 1, relations: 1, note: "ca\u0142a karta walk zna twoj\u0105 mam\u0119" } },
      { label: "Wszystko zjadasz po wa\u017Ceniu", desc: "Po wa\u017Ceniu wolno.", chance: 60, success: { nextFight: 2, relations: 1 }, successText: "Po wa\u017Ceniu ros\xF3\u0142, go\u0142\u0105bki i pierogi. Na walk\u0119 wchodzisz jak po trzech tygodniach wakacji.", fail: { nextFight: -2 }, failText: "Bigos by\u0142 b\u0142\u0119dem. Wiedzia\u0142e\u015B, \u017Ce bigos b\u0119dzie b\u0142\u0119dem." },
      { label: "Odsy\u0142asz z pozdrowieniami", desc: "Dieta to dieta.", effects: { relations: -1, nextFight: 0 } }
    ]
  },
  {
    id: "propozycja",
    title: "Propozycja przy automacie z kaw\u0105",
    w: 2,
    cond: (s) => s.tier >= 1,
    text: (s) => `Przy automacie z kaw\u0105 podchodzi go\u015B\u0107 w za du\u017Cej marynarce. M\xF3wi, \u017Ce \u201Ema znajomych w zak\u0142adach\u201D i \u017Ce ${zl4(s, 4e3)} z\u0142 czeka, je\u015Bli \u201Ezm\u0119czysz si\u0119\u201D w drugiej rundzie.`,
    choices: () => [
      { label: "Odmawiasz i zg\u0142aszasz federacji", desc: "Tak si\u0119 to robi.", effects: { rep: 3, media: 1, note: "federacja dzi\u0119kuje i prosi o dyskrecj\u0119" } },
      { label: "Udajesz zainteresowanie i nagrywasz", desc: "Dziennikarze \u015Bledczy by si\u0119 ucieszyli.", chance: 45, success: { media: 5, rep: 2, note: "nagranie trafia do medi\xF3w" }, successText: "Nagranie trafia do medi\xF3w. P\xF3\u0142 Polski pisze o \u201Emafii w MMA\u201D, a ty jeste\u015B bohaterem dnia.", fail: { nextFight: -2, rep: -1 }, failText: "Go\u015B\u0107 orientuje si\u0119 i znika. Do walki ogl\u0105dasz si\u0119 przez rami\u0119, a w sieci kto\u015B pisze, \u017Ce \u201Eco\u015B wiedzia\u0142e\u015B\u201D." },
      { label: "Odchodzisz bez s\u0142owa", desc: "Nie twoja sprawa.", effects: { nextFight: -1 } }
    ]
  },
  {
    id: "open_workout",
    title: "Trening otwarty w galerii",
    w: 4,
    text: (s) => `Organizator robi trening otwarty w galerii handlowej, mi\u0119dzy drogeri\u0105 a budk\u0105 z kebabem. Dwie\u015Bcie os\xF3b, dzieci z telefonami i babcia, kt\xF3ra my\u015Bli, \u017Ce to pokaz ${s.tier >= 2 ? "zumby" : "odkurzaczy"}.`,
    choices: () => [
      { label: "Robisz salto na zako\u0144czenie", desc: "Ostatni raz robi\u0142e\u015B je w gimnazjum.", chance: 40, success: { media: 4, nextFight: 1 }, successText: "L\u0105duje! Galeria bije brawo, a nagranie kr\u0105\u017Cy po sieci. Babcia pyta, gdzie mo\u017Cna kupi\u0107 ten odkurzacz.", fail: { media: 2, wear: 2, nextFight: -1 }, failText: "L\u0105dujesz na pupie. Nagranie i tak kr\u0105\u017Cy po sieci, tylko z inn\u0105 muzyk\u0105." },
      { label: "Spokojne tarcze z trenerem", desc: "Pokaz, nie cyrk.", effects: { rep: 1, media: 1 } },
      { label: "Uczysz dzieciaki d\u017Awigni na tacie", desc: "Tata si\u0119 zg\u0142osi\u0142 sam.", effects: { media: 2, rep: 2, note: "tata klepie po trzech sekundach" } }
    ]
  },
  {
    id: "sedzia",
    title: "Wiesz ju\u017C, kto s\u0119dziuje",
    w: 3,
    text: (_s, o) => `Lista s\u0119dzi\xF3w wisi na drzwiach szatni. Twoj\u0105 walk\u0119 (rywal: ${o.opp.lastName}) prowadzi \u201ESzybki Zdzis\u0142aw\u201D, kt\xF3ry przerywa, zanim ktokolwiek zd\u0105\u017Cy upa\u015B\u0107.`,
    choices: () => [
      { label: "Ustawiasz plan na szybki finisz", desc: "Jak trafisz, on przerwie.", effects: { nextFight: 1, note: "pierwsza seria ma by\u0107 mocna" } },
      { label: "Plan: zero ryzyka w st\xF3jce", desc: "Jak ci\u0119 trafi\u0105, on te\u017C przerwie.", effects: { nextFight: 1 } },
      { label: "Idziesz pogada\u0107 z s\u0119dzi\u0105", desc: "Grzecznie, o zasadach.", chance: 50, success: { rep: 1, nextFight: 1 }, successText: "S\u0119dzia okazuje si\u0119 mi\u0142ym panem, kt\xF3ry trenowa\u0142 judo. Wiesz ju\u017C, czego si\u0119 spodziewa\u0107.", fail: { rep: -2 }, failText: "S\u0119dzia patrzy na ciebie jak na kogo\u015B, kto pr\xF3buje co\u015B za\u0142atwi\u0107. Federacja dostaje notatk\u0119." }
    ]
  },
  {
    id: "sponsor_tylek",
    title: "Logo na po\u015Bladku",
    w: 3,
    text: (s) => `Dzwoni lokalna hurtownia p\u0142ytek (${s.profile.hometown}): ${zl4(s, 600)} z\u0142 za logo na spodenkach. Jedyne wolne miejsce: ty\u0142. Nazwa firmy: \u201EKafel-Max\u201D.`,
    choices: (s) => [
      { label: "Bierzesz, pieni\u0105dz nie \u015Bmierdzi", desc: "Kafel-Max na po\u015Bladku.", effects: { money: zl4(s, 600), media: 1, note: "komentator czyta logo na g\u0142os" } },
      { label: "Negocjujesz prz\xF3d spodenek za wi\u0119cej", desc: "Prz\xF3d to presti\u017C.", chance: 45, success: { money: zl4(s, 1100) }, successText: "Pan Mirek z Kafel-Maxu m\xF3wi \u201Edobra, niech pan ma\u201D. Prz\xF3d spodenek wyceniony.", fail: { money: 0 }, failText: "Pan Mirek si\u0119 obra\u017Ca i dzwoni do twojego rywala." },
      { label: "Odmawiasz", desc: "Szacunek do siebie.", effects: { rep: 1 } }
    ]
  },
  {
    id: "korek",
    title: "Korek na A2",
    w: 3,
    cond: (_s, o) => !o.abroad,
    text: () => "Autobus z klubu stoi na A2 od trzech godzin. Wypadek, objazdu brak, odprawa przed wa\u017Ceniem za cztery godziny. Kierowca w\u0142\u0105cza radio i rozk\u0142ada r\u0119ce.",
    choices: (s) => [
      { label: "Taks\xF3wka z najbli\u017Cszego zjazdu", desc: "Przez pole do zjazdu, potem 180 km.", effects: { money: -zl4(s, 500) } },
      { label: "Czekasz i rozci\u0105gasz si\u0119 na poboczu", desc: "Kierowcy tr\u0105bi\u0105, kto\u015B nagrywa.", chance: 60, success: { media: 1 }, successText: "Ruszacie po godzinie. Na odpraw\u0119 wpadasz w ostatniej minucie, rozci\u0105gni\u0119ty jak nigdy.", fail: { nextFight: -2 }, failText: "Na wa\u017Cenie docierasz w ostatniej chwili, zestresowany i g\u0142odny. Ten dzie\u0144 siedzi w nogach." }
    ]
  },
  {
    id: "popchniecie",
    title: "Popchni\u0119cie na face to face",
    w: 4,
    cond: (s) => s.tier >= 1,
    text: (_s, o) => `Face to face po wa\u017Ceniu. ${o.opp.lastName} podchodzi za blisko i popycha ci\u0119 obur\u0105cz. Flesze, ochrona ju\u017C biegnie, a prowadz\u0105cy krzyczy \u201Epanowie, w klatce!\u201D.`,
    choices: () => [
      { label: "Stoisz i si\u0119 u\u015Bmiechasz", desc: "Najbardziej wkurzaj\u0105ce, co mo\u017Cesz zrobi\u0107.", effects: { rep: 2, nextFight: 1 } },
      { label: "Oddajesz", desc: "Nikt ci\u0119 nie b\u0119dzie popycha\u0142.", chance: 55, success: { media: 4 }, successText: "Zdj\u0119cie z przepychanki jest na ok\u0142adce ka\u017Cdego portalu. Bilety na gal\u0119 schodz\u0105 jak ciep\u0142e bu\u0142ki.", fail: { media: 3, money: -500, rep: -2 }, failText: "Federacja karze was obu grzywn\u0105, a nagranie wygl\u0105da tak, jakby\u015B zacz\u0105\u0142." },
      { label: "M\xF3wisz mu co\u015B do ucha", desc: "Nikt nie us\u0142yszy, on zapami\u0119ta.", chance: 60, success: { nextFight: 2 }, successText: "Rywal czerwienieje i rzuca si\u0119 do przodu. Ochrona go trzyma. Wygra\u0142e\u015B pierwsz\u0105 rund\u0119, zanim si\u0119 zacz\u0119\u0142a.", fail: { nextFight: -1 }, failText: "Odpowiada co\u015B o twojej mamie. Ca\u0142\u0105 noc wymy\u015Blasz ripost\u0119." }
    ]
  },
  {
    id: "dzieciak",
    title: "List od dzieciaka",
    w: 3,
    text: () => "Na recepcji czeka koperta. W \u015Brodku rysunek: ty z pasem i podpis krzywymi literami: \u201EJak wygrasz, dasz mi r\u0119kawice? Mam 9 lat i trenuj\u0119 od wtorku. Kuba\u201D.",
    choices: () => [
      { label: "Obiecujesz r\u0119kawice niezale\u017Cnie od wyniku", desc: "Wygrana czy nie, Kuba je dostanie.", effects: { rep: 2, nextFight: 1, note: "rysunek przyklejony w szafce" } },
      { label: "Zapraszasz Kub\u0119 na rozgrzewk\u0119", desc: "Niech zobaczy szatni\u0119 od \u015Brodka.", effects: { media: 2, rep: 2, nextFight: 1 } }
    ]
  },
  {
    id: "antydoping",
    title: "Kontrola antydopingowa, 6:00",
    w: 3,
    cond: (s) => s.tier >= 1,
    text: () => "Sz\xF3sta rano. Pukanie do drzwi: kontrola antydopingowa. Pan z kontroli ma w\u0105sy, termos i du\u017Co czasu. Ty po wieczornym zbijaniu wagi nie masz w sobie ani kropli wody.",
    choices: (s) => [
      { label: "Pijesz i czekasz", desc: "Trzy godziny z panem z w\u0105sami.", effects: { nextFight: -1, note: "pan z w\u0105sami opowiada o w\u0119dkowaniu" } },
      { label: "Puszczasz wod\u0119 w kranie", desc: "Stara sztuczka.", chance: 70, success: { nextFight: 0 }, successText: "Dzia\u0142a po dziesi\u0119ciu minutach. Pan z w\u0105sami zostawia ci wizyt\xF3wk\u0119 \u201Egdyby\u015B chcia\u0142 na ryby\u201D.", fail: { nextFight: -2 }, failText: "Nie dzia\u0142a. Siedzicie do jedenastej. Znasz ju\u017C wszystkie jego wnuki z imienia." },
      ...s.flags.labsAutoSupps || s.backroom?.supps ? [{ label: "Nerwowo sprawdzasz sk\u0142ad od\u017Cywek", desc: "Te od sponsora z dziwnymi nazwami\u2026", chance: 75, success: { nextFight: 0 }, successText: "Wszystko czyste. Wynik przychodzi po tygodniu: zero uwag.", fail: { rep: -4, media: 2 }, failText: "Jeden ze sk\u0142adnik\xF3w jest \u201Ena pograniczu\u201D. Ko\u0144czy si\u0119 upomnieniem, ale portale ju\u017C pisz\u0105." }] : []
    ]
  },
  {
    id: "kolano",
    title: "Kolano strzyka na rozruchu",
    w: 3,
    text: () => "Lekki rozruch dzie\u0144 przed walk\u0105 i nagle kolano strzela. Nie boli bardzo, ale strzela przy ka\u017Cdym przysiadzie. Trener udaje, \u017Ce nie widzi.",
    choices: (s) => [
      { label: "Lekarz gali i zastrzyk", desc: "Bezpiecznie, ale p\u0142atnie.", effects: { money: -zl4(s, 300) } },
      { label: "Taping i jedziesz", desc: "Kolano jest twarde. Chyba.", chance: 65, success: { nextFight: 0 }, successText: "Taping trzyma, kolano w walce w og\xF3le si\u0119 nie odzywa.", fail: { nextFight: -2, wear: 2 }, failText: "Kolano daje zna\u0107 przy ka\u017Cdym kopni\u0119ciu. Kopiesz mniej, ni\u017C planowa\u0142e\u015B." }
    ]
  },
  {
    id: "emo",
    title: "Zdj\u0119cie z gimnazjum",
    w: 3,
    text: (s) => `Kto\u015B wygrzeba\u0142 twoje zdj\u0119cie z gimnazjum: grzywka na p\xF3\u0142 twarzy, kolczyk i podpis \u201E${s.profile.firstName}xD\u201D. Fani rywala robi\u0105 z tego memy szybciej, ni\u017C zd\u0105\u017Cysz si\u0119 zarumieni\u0107.`,
    choices: () => [
      { label: "Ustawiasz to zdj\u0119cie jako profilowe", desc: "Najlepsza obrona to atak.", effects: { media: 3, rep: 1, note: "rywal nie ma ju\u017C czym ci\u0119 zaczepi\u0107" } },
      { label: "Wrzucasz zdj\u0119cie rywala z komunii", desc: "Kumpel z jego szko\u0142y podes\u0142a\u0142.", chance: 60, success: { media: 4 }, successText: "Wojna mem\xF3w wygrana. Komentarze: \u201E0:1 dla emo\u201D.", fail: { media: 2, rep: -2 }, failText: "Internet uznaje, \u017Ce przesadzi\u0142e\u015B. Komunia to \u015Bwi\u0119to\u015B\u0107." },
      { label: "Udajesz, \u017Ce to nie ty", desc: "Grzywka zmienia twarz.", effects: { media: 1 } }
    ]
  },
  {
    id: "live_wywiad",
    title: "Wywiad na \u017Cywo",
    w: 3,
    text: () => "Wywiad na \u017Cywo dla kana\u0142u federacji. Prowadz\u0105cy, zamiast o walk\u0119, pyta, co my\u015Blisz o nowym zwi\u0105zku pewnej celebrytki i czy \u201Eto prawda, \u017Ce jeste\u015Bcie znajomymi\u201D.",
    choices: () => [
      { label: "\u201ENie znam pani, ale \u017Cycz\u0119 szcz\u0119\u015Bcia\u201D", desc: "Dyplomacja.", effects: { rep: 1 } },
      { label: "Udajesz tajemniczego", desc: "\u201ENie mog\u0119 o tym m\xF3wi\u0107\u201D.", chance: 50, success: { media: 5 }, successText: "Plotkarskie portale szalej\u0105 przez trzy dni. Twoje nazwisko pierwszy raz w zak\u0142adce \u201Egwiazdy\u201D.", fail: { media: 2, rep: -2 }, failText: "Celebrytka dementuje na Instagrymie: \u201Ekto to w og\xF3le jest?\u201D. P\xF3\u0142 internetu pyta to samo." },
      { label: "Wracasz do tematu walki", desc: "Jeste\u015B tu, \u017Ceby si\u0119 bi\u0107.", effects: { nextFight: 1 } }
    ]
  },
  {
    id: "koledzy_z_bloku",
    title: "Ekipa robi wyjazd",
    w: 3,
    text: () => `Ekipa z twojego miasta pisze na grupie, \u017Ce jedzie na gal\u0119. Busem. Z grillem. \u201EOdpalimy ci race przy wej\u015Bciu, spoko, nikt nie zauwa\u017Cy\u201D.`,
    choices: () => [
      { label: "Zakazujesz rac", desc: "Federacja i tak by zauwa\u017Cy\u0142a.", effects: { rep: 1, note: "race zostaj\u0105 w busie" } },
      { label: "Niech b\u0119dzie klimat", desc: "Raz si\u0119 \u017Cyje.", chance: 40, success: { media: 3, nextFight: 1 }, successText: "Race, dym, sektor \u015Bpiewa twoje nazwisko. Wchodzisz do klatki jak na derby.", fail: { money: -800, rep: -2, media: 2 }, failText: "Ochrona wyprowadza p\xF3\u0142 ekipy, a federacja wysy\u0142a ci faktur\u0119 za \u201Eszkody w obiekcie\u201D." },
      { label: "Za\u0142atwiasz im bilety w twoim sektorze", desc: "B\u0119d\u0105 blisko i pod kontrol\u0105.", effects: { rep: 1, relations: 1 } }
    ]
  }
];
function buildWeek(rng, s, o) {
  const pool = WEEK_EVENTS.filter((e) => !e.cond || e.cond(s, o)).map((e) => ({ e, w: e.w / (1 + 4 * (s.flags[`wk:${e.id}`] ?? 0)) }));
  const tot = pool.reduce((a, x) => a + x.w, 0);
  let r = rng.next() * tot;
  let pick = pool[0].e;
  for (const x of pool) {
    r -= x.w;
    if (r <= 0) {
      pick = x.e;
      break;
    }
  }
  s.flags[`wk:${pick.id}`] = (s.flags[`wk:${pick.id}`] ?? 0) + 1;
  return pick;
}

// src/engine/prolog.ts
var COACH_NAMES = ["Mirek", "Waldek", "Heniek", "Zbyszek", "Rafa\u0142", "Grzesiek"];
var STREETS = ["Przemys\u0142owa 4, wej\u015Bcie od gara\u017Cy", "Kolejowa 12, piwnica pod si\u0142owni\u0105", "Polna 3, za Biedronk\u0105", "Sportowa 1, hala po starym PGR-ze", "Fabryczna 8, drugie pi\u0119tro, bez windy"];
function hash(t) {
  let h = 7;
  for (const c of t) h = h * 31 + c.charCodeAt(0) >>> 0;
  return h;
}
function clubCoachName(club) {
  return `Trener ${COACH_NAMES[hash(club.name) % COACH_NAMES.length]}`;
}
function clubStreet(club) {
  return `ul. ${STREETS[hash(club.city + club.name) % STREETS.length]}`;
}
var monthly = (c) => Math.max(100, Math.round(c.cost / 12 / 10) * 10);
var PROLOG_EVENTS = [
  {
    id: "prolog_ekipa",
    title: "Grupa",
    once: true,
    weight: 0,
    cond: () => false,
    text: (s) => {
      const me = s.profile.firstName;
      const c = s.club.name;
      switch (s.profile.start) {
        case "biznes":
          return [
            `Tata: Zapisa\u0142em ci\u0119 na MMA. ${c}. Prezes klubu kupuje u nas panele, wi\u0119c traktuj to powa\u017Cnie.`,
            "Mama: Andrzej, on ma szesna\u015Bcie lat!",
            "Tata: No w\u0142a\u015Bnie. Ja w jego wieku mia\u0142em ju\u017C pierwsz\u0105 hurtowni\u0119.",
            "Ola: a mog\u0119 przyj\u015B\u0107 popatrze\u0107 jak mu lej\u0105? \u{1F37F}",
            `Tata: ${me}, kierowca b\u0119dzie o 17:30. Nie przynie\u015B wstydu.`
          ].join("\n");
        case "junior":
          return [
            `Bartek: s\u0142yszeli\u015Bcie? w ${c} szukaj\u0105 zapa\u015Bnik\xF3w do MMA. m\xF3wi\u0105 \u017Ce w klatce zapa\u015Bnik to kr\xF3l`,
            `Trener Zenek: Bartek, nie m\u0105\u0107 mu w g\u0142owie. ${me} w marcu jedzie na mistrzostwa.`,
            "Bartek: trenerze, w MMA p\u0142ac\u0105",
            "Trener Zenek: W MMA bij\u0105 po g\u0142owie. Dlatego p\u0142ac\u0105.",
            `Bartek: ${me} idziesz ze mn\u0105 na pr\xF3bny? wtorek 18:00`
          ].join("\n");
        case "wybraniec":
          return [
            `Nieznany numer: Dzie\u0144 dobry. M\xF3wi ${clubCoachName(s.club)}, ${c}.`,
            "Nieznany numer: Kto\u015B mi podes\u0142a\u0142 nagranie z WF-u, jak po\u0142o\u017Cy\u0142e\u015B wuefist\u0119 na materac. Trzy razy.",
            "Nieznany numer: Pan Andrzej twierdzi, \u017Ce si\u0119 po\u015Blizgn\u0105\u0142. Obejrza\u0142em to dziesi\u0119\u0107 razy. Nie po\u015Blizgn\u0105\u0142 si\u0119.",
            "Nieznany numer: Mam dla ciebie miejsce w grupie zawodniczej. Za darmo. Wtorek 18:00."
          ].join("\n");
        default:
          return [
            `Seba: widzieli\u015Bcie? w ${c} ruszy\u0142 nab\xF3r na MMA. pierwszy trening gratis \u{1F94A}`,
            "Dawid: seba ty by\u015B si\u0119 bi\u0142 z kim? z go\u0142\u0119biem?",
            `Seba: nie ja. ${me} idzie. ci\u0105gle gada \u017Ce by ka\u017Cdego po\u0142o\u017Cy\u0142`,
            "Krzychu: \u{1F602}\u{1F602} nagrywamy",
            `Seba: ${me}? wtorek 18:00. idziesz czy p\u0119kasz`
          ].join("\n");
      }
    },
    choices: (s) => {
      switch (s.profile.start) {
        case "biznes":
          return [
            { label: "B\u0119d\u0119 gotowy o 17:20.", desc: "Tata: Tak si\u0119 rozmawia.\nMama: We\u017A chocia\u017C kanapki.\nOla: wys\u0142a\u0142am ci link do ochraniaczy na z\u0119by, r\xF3\u017Cowe", effects: { rep: 1 } },
            { label: "Mo\u017Ce pojad\u0119 rowerem? \u017Beby nie by\u0142o gadania.", desc: "Tata: Rowerem? Ludzie pomy\u015Bl\u0105, \u017Ce zbankrutowali\u015Bmy.\nMama: Ja tam uwa\u017Cam, \u017Ce to \u0142adnie.\nTata: Kierowca. 17:30.", effects: { relations: 1 } },
            { label: "Ola, nie przychod\u017A.", desc: "Ola: ju\u017C wrzuci\u0142am na story \u017Ce idziesz \u{1F607}\nOla: 48 wy\u015Bwietle\u0144\nTata: Ola, skasuj to. Natychmiast.\nOla: 112 wy\u015Bwietle\u0144", effects: { media: 1 } }
          ];
        case "junior":
          return [
            { label: "Id\u0119. Zobacz\u0119, co to za klatka.", desc: "Bartek: TAK\nTrener Zenek: Zobaczysz. I wr\xF3cisz.\nBartek: trenerze to brzmi jak gro\u017Aba\nTrener Zenek: Bo to jest gro\u017Aba.", effects: { rep: 1 } },
            { label: "Id\u0119, ale z mistrzostw nie rezygnuj\u0119, trenerze.", desc: "Trener Zenek: Trzymam za s\u0142owo.\nTrener Zenek: I \u017Cadnych kopni\u0119\u0107 w kolana. Kolana masz zapa\u015Bnicze, nie do kopania.\nBartek: \u{1F44D}", effects: { relations: 1 } },
            { label: "Zapa\u015Bnik w klatce to kr\xF3l. Id\u0119.", desc: "Trener Zenek: Kr\xF3l. Do pierwszego kopni\u0119cia w g\u0142ow\u0119.\nBartek: kr\xF3l i jego wierny giermek \u{1F451}\nTrener Zenek: Bartek, ty te\u017C jedziesz w marcu. Pami\u0119taj.", effects: { media: 1 } }
          ];
        case "wybraniec":
          return [
            { label: "B\u0119d\u0119.", desc: "Nieznany numer: Kr\xF3tko. Lubi\u0119.\nNieznany numer: We\u017A ochraniacz na z\u0119by. I nie m\xF3w nikomu, \u017Ce za darmo, bo reszta p\u0142aci.", effects: { rep: 1 } },
            { label: "Sk\u0105d pan ma m\xF3j numer?", desc: "Nieznany numer: Od twojej babci. Bardzo mi\u0142a pani.\nNieznany numer: Powiedzia\u0142a, \u017Ce jeste\u015B grzeczny ch\u0142opak i \u017Cebym ci\u0119 za mocno nie bi\u0142.\nNieznany numer: Nie obieca\u0142em.", effects: { relations: 1 } },
            { label: "To on si\u0119 naprawd\u0119 po\u015Blizgn\u0105\u0142.", desc: "Nieznany numer: Trzy razy?\nNieznany numer: Wtorek, 18:00. Przynie\u015B te po\u015Blizgi.", effects: { media: 1 } }
          ];
        default:
          return [
            { label: "Id\u0119. Wtorek 18:00.", desc: "Dawid: o kurde, serio\nSeba: bior\u0119 popcorn\nKrzychu: jak ci\u0119 po\u0142o\u017C\u0105 to nie p\u0142acz w grupie", effects: { rep: 1 } },
            { label: "Id\u0119, ale jak mnie po\u0142o\u017C\u0105, stawiacie kebaba.", desc: "Seba: deal \u{1F32F}\nDawid: du\u017Cy, podw\xF3jne mi\u0119so, zapisuj\u0119\nKrzychu: ju\u017C wiemy kto p\u0142aci \u{1F602}", effects: { media: 1 } },
            { label: "P\xF3jd\u0119, jak kto\u015B p\xF3jdzie ze mn\u0105.", desc: "Seba: dobra id\u0119 z tob\u0105. na rozgrzewk\u0119\nDawid: Seba na MMA. to b\u0119dzie film\nSeba: zamknij si\u0119", effects: { relations: 1 } }
          ];
      }
    }
  },
  {
    id: "prolog_trener",
    title: "Trener",
    once: true,
    weight: 0,
    cond: () => false,
    text: (s) => {
      const t = clubCoachName(s.club).replace("Trener ", "");
      const lines = s.profile.start === "wybraniec" ? [`${clubCoachName(s.club)}: To ja jeszcze raz. Zapisz sobie numer: ${t}, trener.`] : [`${clubCoachName(s.club)}: Cze\u015B\u0107, tu ${t}, trener z ${s.club.name}. Dosta\u0142em tw\xF3j numer, \u017Ce chcesz przyj\u015B\u0107.`];
      lines.push(
        `${clubCoachName(s.club)}: Wtorek 18:00, ${clubStreet(s.club)}.`,
        `${clubCoachName(s.club)}: We\u017A wod\u0119, r\u0119cznik i ochraniacz na z\u0119by. Pierwszy trening gratis, potem ${monthly(s.club)} z\u0142 miesi\u0119cznie.`,
        `${clubCoachName(s.club)}: Jak prze\u017Cyjesz rozgrzewk\u0119, to po kilku tygodniach zrobimy sparing kontrolny. Zobacz\u0119, gdzie ci\u0119 wys\u0142a\u0107.`
      );
      return lines.join("\n");
    },
    choices: (s) => {
      const t = clubCoachName(s.club);
      return [
        { label: "B\u0119d\u0119 17:45.", desc: `${t}: Dobrze. Sp\xF3\u017Anialscy robi\u0105 burpees. Du\u017Co burpees.`, effects: { rep: 1 } },
        { label: "A ochraniacz na z\u0119by to jaki?", desc: `${t}: Taki, \u017Ceby z\u0119by zosta\u0142y w buzi.
${t}: Za 30 z\u0142 w Decathlonie. Wrzucasz do wrz\u0105tku i gryziesz. Nie odwrotnie.`, effects: { media: 1 } },
        { label: "Trenerze, a da si\u0119 bez biegania?", desc: `${t}: \u{1F602}
${t}: Nie.`, effects: { relations: 1 } }
      ];
    }
  }
];

// src/engine/data.ts
var STAT_LABELS = {
  stand: "St\xF3jka",
  wrest: "Zapasy",
  bjj: "Parter",
  cardio: "Kondycja",
  chin: "Szcz\u0119ka",
  iq: "Taktyka"
};
var STAT_KEYS = ["stand", "wrest", "bjj", "cardio", "chin", "iq"];
var STYLE_PROFILE = {
  boxer: { stand: 10, wrest: -3, bjj: -6, cardio: 2, chin: 1, iq: 3 },
  kickboxer: { stand: 10, wrest: -4, bjj: -4, cardio: 4, chin: 0, iq: 2 },
  wrestler: { stand: -5, wrest: 11, bjj: 1, cardio: 3, chin: 0, iq: 0 },
  grappler: { stand: -6, wrest: 3, bjj: 12, cardio: 0, chin: -2, iq: 2 },
  brawler: { stand: 8, wrest: -2, bjj: -6, cardio: -1, chin: 10, iq: -2 },
  allround: { stand: 2, wrest: 2, bjj: 2, cardio: 1, chin: 0, iq: 1 }
};
var WEIGHTS = {
  piorkowa: { label: "Waga pi\xF3rkowa", short: "pi\xF3rkowa", kg: 66, mod: { cardio: 3, chin: -2 } },
  lekka: { label: "Waga lekka", short: "lekka", kg: 70, mod: { cardio: 2, chin: -1 } },
  polsrednia: { label: "Waga p\xF3\u0142\u015Brednia", short: "p\xF3\u0142\u015Brednia", kg: 77, mod: {} },
  srednia: { label: "Waga \u015Brednia", short: "\u015Brednia", kg: 84, mod: { chin: 1, cardio: -1 } },
  polciezka: { label: "Waga p\xF3\u0142ci\u0119\u017Cka", short: "p\xF3\u0142ci\u0119\u017Cka", kg: 93, mod: { chin: 2, stand: 1, cardio: -2 } },
  ciezka: { label: "Waga ci\u0119\u017Cka", short: "ci\u0119\u017Cka", kg: 120, mod: { chin: 3, stand: 2, cardio: -4 } }
};
var WEIGHT_KEYS = ["piorkowa", "lekka", "polsrednia", "srednia", "polciezka", "ciezka"];
var STAGE_LABELS = {
  qf: "\u0106wier\u0107fina\u0142",
  sf: "P\xF3\u0142fina\u0142",
  f: "Fina\u0142",
  b: "Walka o br\u0105z"
};
var AMATEUR_TOURNEYS = ["Amatorski Puchar Polski MMA", "Amatorskie Mistrzostwa Polski MMA"];
var AMATEUR_TOURNEYS_LOCAL = ["Amatorska Liga Wojew\xF3dzka MMA", "Amatorski Turniej o Puchar Wojewody"];
var TOURNEY_CITIES = ["Gliwice", "\u0141\xF3d\u017A", "Pu\u0142awy", "Warszawa", "Grodzisk Mazowiecki", "Lublin", "Pozna\u0144", "Wroc\u0142aw"];
function amateurDivision(age, amFights) {
  if (amFights < 3) return "pierwszy krok";
  if (age < 18) return "kadeci";
  if (age < 21) return "juniorzy";
  return "seniorzy";
}
var START_PROFILES = {
  osiedle: {
    label: "Ch\u0142opak z osiedla",
    desc: "Talent jak wypadnie, w kieszeni pusto.",
    mult: 1,
    money: 1500,
    talent: [0.15, 0.85],
    intro: "Masz 16 lat. Mama wyj\u0119\u0142a z koperty w szafie trzy st\xF3wy na pierwsze r\u0119kawice. Ojciec m\xF3wi, \u017Ce to sport dla patus\xF3w, ale na pierwszy trening i tak ci\u0119 podwozi."
  },
  biznes: {
    label: "Syn biznesmena",
    desc: "Kasa i znajomo\u015Bci s\u0105, talent jak wypadnie.",
    mult: 0.9,
    money: 45e3,
    talent: [0.1, 0.75],
    intro: "Masz 16 lat. Ojciec ma trzy hurtownie paneli i koleg\u0119, kt\xF3ry zna kogo\u015B z federacji. Na pierwszy trening podje\u017Cd\u017Casz Audi. Na macie nikogo to nie obchodzi."
  },
  junior: {
    label: "Zapa\u015Bnik z kadry junior\xF3w",
    desc: "Talent ponad \u015Bredni\u0105 i zapasy we krwi. Kasy tyle, ile trzeba.",
    mult: 0.6,
    money: 5e3,
    talent: [0.55, 0.9],
    intro: "Masz 16 lat i z\u0142oto mistrzostw Polski junior\xF3w w zapasach. Trener z sekcji ma \u017Cal, \u017Ce zamieniasz mat\u0119 na klatk\u0119. Ty ju\u017C wiesz swoje."
  },
  wybraniec: {
    label: "Wybraniec",
    desc: "Talent nie z tej ziemi, ale wszyscy chc\u0105 ci\u0119 pokona\u0107, a cia\u0142o szybciej si\u0119 zu\u017Cywa. Punkty dorobku si\u0119 nie licz\u0105.",
    mult: null,
    money: 1e4,
    talent: [0.86, 0.98],
    intro: "Masz 16 lat. Na pierwszym sparingu przewracasz trenera. Na drugim jego brata. Na trzecim pod klubem stoi go\u015B\u0107 w kurtce du\u017Cej federacji i nagrywa ci\u0119 telefonem."
  }
};
var DIFFICULTY = {
  normal: { label: "Normalny", desc: "Tak, jak to sobie wymy\u015Blili\u015Bmy.", mult: 1 },
  hard: { label: "Trudny", desc: "Sponsorzy sk\u0105pi\u0105, rywale s\u0105 twardsi.", mult: 1.3 }
};
var SEASON_FORMS = [
  { label: "Forma \u017Cycia", mod: 9, w: 5, tone: "purple" },
  { label: "\u015Awietna forma", mod: 5, w: 12, tone: "good" },
  { label: "Dobra forma", mod: 2, w: 23, tone: "good" },
  { label: "Normalna forma", mod: 0, w: 30, tone: "neutral" },
  { label: "S\u0142abszy rok", mod: -4, w: 20, tone: "bad" },
  { label: "Kryzys", mod: -8, w: 10, tone: "bad" }
];
var GOOD_FORMS = ["Forma \u017Cycia", "\u015Awietna forma", "Sezon \u017Cycia"];
var BAD_FORMS = ["S\u0142abszy rok", "Kryzys"];
var VOIVODESHIPS = [
  "Dolno\u015Bl\u0105skie",
  "Kujawsko-pomorskie",
  "Lubelskie",
  "Lubuskie",
  "\u0141\xF3dzkie",
  "Ma\u0142opolskie",
  "Mazowieckie",
  "Opolskie",
  "Podkarpackie",
  "Podlaskie",
  "Pomorskie",
  "\u015Al\u0105skie",
  "\u015Awi\u0119tokrzyskie",
  "Warmi\u0144sko-mazurskie",
  "Wielkopolskie",
  "Zachodniopomorskie"
];
var HOMETOWNS = {
  Dolno\u015Bl\u0105skie: ["Wroc\u0142aw", "Wa\u0142brzych", "Legnica", "O\u0142awa"],
  "Kujawsko-pomorskie": ["Bydgoszcz", "Toru\u0144", "W\u0142oc\u0142awek", "Inowroc\u0142aw"],
  Lubelskie: ["Lublin", "Zamo\u015B\u0107", "Bia\u0142a Podlaska", "Pu\u0142awy"],
  Lubuskie: ["Zielona G\xF3ra", "Gorz\xF3w Wielkopolski", "Sulech\xF3w", "\u017Bary"],
  \u0141\u00F3dzkie: ["\u0141\xF3d\u017A", "Piotrk\xF3w Trybunalski", "Pabianice", "Kutno"],
  Ma\u0142opolskie: ["Krak\xF3w", "Tarn\xF3w", "Nowy S\u0105cz", "Zakopane"],
  Mazowieckie: ["Warszawa", "Radom", "P\u0142ock", "Siedlce"],
  Opolskie: ["Opole", "K\u0119dzierzyn-Ko\u017Ale", "Nysa", "Brzeg"],
  Podkarpackie: ["Rzesz\xF3w", "Przemy\u015Bl", "Krosno", "Mielec"],
  Podlaskie: ["Bia\u0142ystok", "Suwa\u0142ki", "\u0141om\u017Ca", "August\xF3w"],
  Pomorskie: ["Gda\u0144sk", "Gdynia", "S\u0142upsk", "Wejherowo"],
  \u015Al\u0105skie: ["Katowice", "Bytom", "Cz\u0119stochowa", "Rybnik"],
  \u015Awi\u0119tokrzyskie: ["Kielce", "Ostrowiec \u015Awi\u0119tokrzyski", "Skar\u017Cysko-Kamienna", "Sandomierz"],
  "Warmi\u0144sko-mazurskie": ["Olsztyn", "Elbl\u0105g", "E\u0142k", "Gi\u017Cycko"],
  Wielkopolskie: ["Pozna\u0144", "Kalisz", "Konin", "Pi\u0142a"],
  Zachodniopomorskie: ["Szczecin", "Koszalin", "\u015Awinouj\u015Bcie", "Stargard"]
};
var TIER_NAMES = ["Amatorka", "Gale regionalne", "Polska federacja", "Europa", "\u015Awiatowa federacja"];
var TIER_FEDS = [
  ["Mistrzostwa MMA amator\xF3w"],
  // parodie jak auta w GTA: brzmią znajomo, ale to nie te gale
  ["Babel MMA", "Armada Fight Night", "Thunderbolt Fight League"],
  ["XSW \u2013 Ekstremalne Starcia Wojownik\xF3w", "FAN \u2013 Fight Absolute Night"],
  ["Cage Worriers", "Hexagon MMA", "Brava CF", "Oktagram MMA"],
  ["UFL \u2013 Ultimate Fighting League", "Balettor MMA", "TWO FC \u2013 Two Fighting Championship", "PLF \u2013 Professional League of Fighters"]
];
var EXCLUSIVE_FEDS = ["XSW \u2013 Ekstremalne Starcia Wojownik\xF3w", "Cage Worriers", "UFL \u2013 Ultimate Fighting League", "TWO FC \u2013 Two Fighting Championship"];
var EXCLUSIVE_BONUS = 1.08;
function isExclusiveFed(fed) {
  return EXCLUSIVE_FEDS.some((f) => fed.startsWith(f));
}
var FED_NOTES = {
  "Oktagram MMA": "Czesko-s\u0142owacka federacja: hale pe\u0142ne, piwo tanie, a kibice \u015Bpiewaj\u0105 przez ca\u0142\u0105 walk\u0119.",
  "Brava CF": "Gale od Bahrajnu po Brazyli\u0119. Du\u017Co latania, dobre hotele.",
  "Cage Worriers": "Ku\u017Ania talent\xF3w z Wysp. P\u0142ac\u0105 skromnie, ale st\u0105d najcz\u0119\u015Bciej idzie si\u0119 do UFL.",
  "Hexagon MMA": "Francusko-belgijska gala w sze\u015Bciok\u0105tnej klatce. S\u0119dziowie lubi\u0105 parter.",
  "UFL \u2013 Ultimate Fighting League": "Najbardziej znana liga na \u015Bwiecie. Pieni\u0105dze i s\u0142awa, ale rywale z samego topu.",
  "Balettor MMA": "Ameryka\u0144ska liga, co druga gala w kasynie. P\u0142ac\u0105 wyra\u017Anie mniej ni\u017C UFL, ale turnieje Grand Prix to szansa na szybki pas.",
  "TWO FC \u2013 Two Fighting Championship": "Azja: Singapur, Bangkok, Manila. Hale na 20 tysi\u0119cy, wa\u017Cenie z badaniem nawodnienia i najni\u017Csze ga\u017Ce w \u015Bwiatowej czo\u0142\xF3wce.",
  "PLF \u2013 Professional League of Fighters": "Liga z turniejem i play-offami. Ga\u017Ce ni\u017Csze ni\u017C w UFL, ale wygrany turniej to czek na milion."
};
var FED_VENUES = {
  "Oktagram MMA": [
    { city: "Praga", venue: "Hala na Libni" },
    { city: "Bratys\u0142awa", venue: "Zimn\xFD \u0161tadi\xF3n" },
    { city: "Ostrawa", venue: "Hala w Witkowicach" }
  ],
  "Balettor MMA": [
    { city: "Uncasville", venue: "Arena w kasynie" },
    { city: "Los Angeles", venue: "Forum" },
    { city: "Dublin", venue: "Arena Liffey" }
  ],
  "TWO FC \u2013 Two Fighting Championship": [
    { city: "Singapur", venue: "Indoor Stadium" },
    { city: "Bangkok", venue: "Lumpinee Arena" },
    { city: "Manila", venue: "Mall of Asia Arena" },
    { city: "D\u017Cakarta", venue: "Istora Senayan" }
  ],
  "PLF \u2013 Professional League of Fighters": [
    { city: "Nowy Jork", venue: "Hulu Theater" },
    { city: "Rijad", venue: "Kingdom Arena" },
    { city: "Atlanta", venue: "Overtime Elite Arena" }
  ]
};
var TUNEUP_GALAS = [
  { gala: "Tatra Fight Night 4", city: "Poprad", venue: "Hala zimowego stadionu" },
  { gala: "Bitka pod Hradem 9", city: "Trenczyn", venue: "Hala sportowa przy zamku" },
  { gala: "Kemping Fight Show", city: "Liptowski Miku\u0142asz", venue: "Namiot przy aquaparku" },
  { gala: "Noc Wojownik\xF3w 2", city: "Dolny Kubin", venue: "Sala gimnastyczna gimnazjum" },
  { gala: "Halu\u0161ky Fight Club 11", city: "\u017Bylina", venue: "Hala targowa" },
  { gala: "Granica Cup", city: "Czadca", venue: "Dyskoteka Galaxy" },
  { gala: "Klatka 3", city: "Martin", venue: "Hala zimowa przy basenie" }
];
var SHADY_SPONSORS = [
  { name: "Ulga dla Siedz\u0105cych", product: "ma\u015B\u0107 na hemoroidy", pitch: "W wywiadzie po ka\u017Cdej walce m\xF3wisz do kamery: \u201EPo walce siadam bez b\xF3lu. Dzi\u0119ki, Ulga dla Siedz\u0105cych\u201D." },
  { name: "Senior Komfort", product: "pieluchomajtki dla doros\u0142ych", pitch: "Wchodzisz do klatki w koszulce z has\u0142em \u201EKomfort na ka\u017Cd\u0105 rund\u0119\u201D. Na wa\u017Ceniu te\u017C." },
  { name: "Stopa Wojownika", product: "spray na grzybic\u0119 st\xF3p", pitch: "Co tydzie\u0144 filmik: zbli\u017Cenie na twoj\u0105 bos\u0105 stop\u0119 i psik. Na koniec m\xF3wisz \u201ESw\u0119dzi? Ju\u017C nie\u201D." },
  { name: "B\u0105bel-Stop", product: "syrop na wzd\u0119cia", pitch: "Na konferencji przed walk\u0105 wypijasz \u0142y\u017Ck\u0119 syropu i m\xF3wisz: \u201EJestem lekki jak nigdy\u201D. Rywal b\u0119dzie mia\u0142 u\u017Cywanie." },
  { name: "Pan Fryzura", product: "tupeciki i doczepiane grzywki", pitch: "Na face to face poprawiasz grzywk\u0119 z ich kolekcji. Grzywka jest r\xF3\u017Cowa." },
  { name: "Babcine Ciep\u0142o", product: "kalesony z we\u0142ny owczej", pitch: "Pozujesz w kalesonach do plakatu gali. Plakat zawi\u015Bnie w ka\u017Cdym kiosku w wojew\xF3dztwie." },
  { name: "Talia Osy", product: "gorset wyszczuplaj\u0105cy dla pan\xF3w", pitch: "Wa\u017Cysz si\u0119 w gorsecie i m\xF3wisz do kamery, \u017Ce to \u201Esekret zbijania wagi\u201D. Komentatorzy p\u0142acz\u0105 ze \u015Bmiechu." },
  { name: "Cud-Pi\u0119ta", product: "krem na odciski i zrogowacenia", pitch: "Reklama w telewizji \u015Bniadaniowej: smarujesz pi\u0119t\u0119 prowadz\u0105cej. Na \u017Cywo." },
  { name: "\u015Awie\u017Cy Oddech Mamuta", product: "pastylki na nie\u015Bwie\u017Cy oddech", pitch: "Przed ka\u017Cd\u0105 walk\u0105 chuchasz do kamery i m\xF3wisz \u201EMamut poleca\u201D. Tw\xF3j trener nie chce na to patrze\u0107." },
  { name: "Burek & Ty", product: "szampon 2w1 dla psa i w\u0142a\u015Bciciela", pitch: "Filmik z k\u0105pieli: ty i pies, ta sama butelka. Pies wygl\u0105da na bardziej zadowolonego." }
];
var NAMES_TUNEUP = [
  { country: "S\u0142owacja", flag: "\u{1F1F8}\u{1F1F0}", first: ["Marek", "Jozef", "Peter", "\u013Dubo\u0161", "Miroslav", "Du\u0161an", "Igor"], last: ["Horv\xE1th", "Kov\xE1\u010D", "Bal\xE1\u017E", "Varga", "T\xF3th", "\u0160imko", "Hud\xE1k"] },
  { country: "Czechy", flag: "\u{1F1E8}\u{1F1FF}", first: ["Pavel", "Radek", "Zden\u011Bk", "Ji\u0159\xED", "Libor"], last: ["Dvo\u0159\xE1k", "Proch\xE1zka", "Kratochv\xEDl", "Vesel\xFD", "Pokorn\xFD"] }
];
var TUNEUP_NICKS = ["Dziadek", "Weteran", "Tatransk\xFD Medve\u010F", "Kotlina", "Ostatni Mohikanin", "Bulwa", "Taxi", "Pan Kanapka"];
var FREAK_FEDS = ["Flame MMA", "Primo MMA", "Hype League", "Klout MMA"];
var BELT_NAMES = [
  "Mistrz Polski amator\xF3w",
  "Pas gali regionalnej",
  "Pas mistrza Polski",
  "Pas mistrza Europy",
  "Pas mistrza \u015Bwiata"
];
var RANK_SIZE = [10, 10, 15, 15, 15];
var TIER_LEVEL = [28, 40, 54, 66, 78];
var TIER_PURSE = [
  [0, 0],
  [1e3, 6e3],
  [8e3, 45e3],
  [12e3, 7e4],
  [5e4, 35e4]
];
var FED_PAY = {
  "XSW \u2013 Ekstremalne Starcia Wojownik\xF3w": 1.15,
  "FAN \u2013 Fight Absolute Night": 1,
  "Oktagram MMA": 1.2,
  "Brava CF": 1.1,
  "Hexagon MMA": 0.95,
  "Cage Worriers": 0.7,
  "UFL \u2013 Ultimate Fighting League": 1,
  "PLF \u2013 Professional League of Fighters": 0.75,
  "Balettor MMA": 0.7,
  "TWO FC \u2013 Two Fighting Championship": 0.65
};
function fedPay(fed) {
  const k = Object.keys(FED_PAY).find((f) => fed.startsWith(f));
  return k ? FED_PAY[k] : 1;
}
function winRatio(tier, fed) {
  if (fed.startsWith("UFL")) return 1;
  return [0, 0.5, 0.6, 0.6, 0.8][tier] ?? 0.6;
}
var TIER_FIGHTS = [4, 3, 3, 3, 2];
var TIER_ENTRY = [1200, 800, 0, 0, 0];
var TIER_SHORT = ["AMA", "REG", "PL", "EU", "\u015AW"];
function galaPrefix(fed) {
  if (fed.includes(" \u2013 ")) return fed.split(" \u2013 ")[0];
  return fed;
}
var REGION_CITY = {
  Dolno\u015Bl\u0105skie: "Wroc\u0142aw",
  "Kujawsko-pomorskie": "Bydgoszcz",
  Lubelskie: "Lublin",
  Lubuskie: "Zielona G\xF3ra",
  \u0141\u00F3dzkie: "\u0141\xF3d\u017A",
  Ma\u0142opolskie: "Krak\xF3w",
  Mazowieckie: "Warszawa",
  Opolskie: "Opole",
  Podkarpackie: "Rzesz\xF3w",
  Podlaskie: "Bia\u0142ystok",
  Pomorskie: "Gda\u0144sk",
  \u015Al\u0105skie: "Katowice",
  \u015Awi\u0119tokrzyskie: "Kielce",
  "Warmi\u0144sko-mazurskie": "Olsztyn",
  Wielkopolskie: "Pozna\u0144",
  Zachodniopomorskie: "Szczecin"
};
function regionalFedName(base, region) {
  return `${base} ${REGION_CITY[region] ?? region}`;
}
function livingCost(age) {
  if (age < 19) return 0;
  if (age < 22) return 14e3;
  if (age < 26) return 26e3;
  return 36e3;
}
var NAMES_PL = {
  country: "Polska",
  flag: "\u{1F1F5}\u{1F1F1}",
  first: [
    "Kamil",
    "Damian",
    "Patryk",
    "Mateusz",
    "Kacper",
    "Szymon",
    "Dawid",
    "Krystian",
    "Marcin",
    "\u0141ukasz",
    "Micha\u0142",
    "Bartek",
    "Adrian",
    "Sebastian",
    "Pawe\u0142",
    "Piotr",
    "Konrad",
    "Rafa\u0142",
    "Arkadiusz",
    "Norbert",
    "Grzegorz",
    "Mariusz",
    "Daniel",
    "Tomasz",
    "Hubert",
    "Oskar",
    "Igor",
    "Wiktor",
    "Dominik",
    "Przemek",
    "Jakub",
    "Filip",
    "Wojciech",
    "Jaros\u0142aw",
    "Zbigniew",
    "Rados\u0142aw",
    "S\u0142awomir",
    "Bartosz",
    "Artur",
    "Krzysztof",
    "Maciej",
    "Robert",
    "Andrzej",
    "Jacek",
    "Karol",
    "Kordian",
    "Janusz",
    "Leszek",
    "Ireneusz",
    "Bogdan",
    "Marek",
    "Waldemar",
    "Remigiusz",
    "Eryk",
    "Fabian",
    "Olaf",
    "Ksawery",
    "Antoni",
    "Tymon",
    "Bruno"
  ],
  last: [
    "Nowak",
    "Kowalczyk",
    "Wi\u015Bniewski",
    "W\xF3jcik",
    "Kami\u0144ski",
    "Lewandowski",
    "Zieli\u0144ski",
    "Szyma\u0144ski",
    "Wo\u017Aniak",
    "D\u0105browski",
    "Koz\u0142owski",
    "Jankowski",
    "Mazur",
    "Kwiatkowski",
    "Krawczyk",
    "Piotrowski",
    "Grabowski",
    "Pawlak",
    "Michalski",
    "Zaj\u0105c",
    "Wr\xF3bel",
    "Jab\u0142o\u0144ski",
    "Majewski",
    "Olszewski",
    "St\u0119pie\u0144",
    "Malinowski",
    "Jaworski",
    "Adamczyk",
    "Dudek",
    "Nowicki",
    "Pietrzak",
    "Wieczorek",
    "Sikora",
    "Baran",
    "Rutkowski",
    "Michalak",
    "Szewczyk",
    "Ostrowski",
    "Tomaszewski",
    "Pietrzyk",
    "Duda",
    "Zalewski",
    "Wr\xF3blewski",
    "Jasi\u0144ski",
    "Marciniak",
    "B\u0105k",
    "Kaczmarczyk",
    "Sadowski",
    "Zawadzki",
    "Chmielewski",
    "Kubiak",
    "Sobczak",
    "Wilk",
    "Lis",
    "Kaczor",
    "Kot",
    "Bielecki",
    "Kalinowski",
    "G\xF3rski",
    "Mazurek",
    "Czarnecki",
    "Sowa",
    "Ko\u0142odziej",
    "Wawrzyniak",
    "Szulc",
    "Zi\xF3\u0142kowski",
    "Borkowski",
    "Gajewski",
    "Laskowski",
    "Mroczek",
    "Cie\u015Blak",
    "Kurek",
    "Wrona",
    "Kruk",
    "Sroka",
    "Dziedzic",
    "Paj\u0105k",
    "Wr\xF3bel-Kosmala",
    "Sosnowski",
    "Szczepa\u0144ski",
    "Kowalewski",
    "G\u0142owacki",
    "Urba\u0144ski",
    "Go\u0142\u0119biowski",
    "Przybylski",
    "Rogalski",
    "Kozak",
    "Siwiec",
    "Furman",
    "Kowal",
    "Bednarz",
    "Kasprzak",
    "Tokarski",
    "\u015Alusarczyk",
    "Bocian",
    "\u017Bak",
    "Le\u015Bniak",
    "Grzelak",
    "Kulesza",
    "Ptak"
  ]
};
var NAMES_EU = [
  { country: "Niemcy", flag: "\u{1F1E9}\u{1F1EA}", first: ["Lukas", "Jonas", "Maximilian", "Felix", "Tobias", "Niklas"], last: ["Becker", "Hoffmann", "Sch\xE4fer", "Kr\xFCger", "Wagner", "Braun", "Vogel"] },
  { country: "Czechy", flag: "\u{1F1E8}\u{1F1FF}", first: ["Jakub", "Ond\u0159ej", "Tom\xE1\u0161", "Vojt\u011Bch", "Mat\u011Bj", "Luk\xE1\u0161"], last: ["Dvo\u0159\xE1k", "Novotn\xFD", "Proch\xE1zka", "Ku\u010Dera", "Vesel\xFD", "Hor\xE1k"] },
  { country: "Francja", flag: "\u{1F1EB}\u{1F1F7}", first: ["Mathieu", "Kevin", "Yanis", "Th\xE9o", "Julien", "Karim"], last: ["Lef\xE8vre", "Moreau", "Girard", "Benali", "Rousseau", "Fontaine"] },
  { country: "Anglia", flag: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", first: ["Liam", "Callum", "Jack", "Kyle", "Reece", "Danny"], last: ["Walsh", "Hughes", "Barker", "Fletcher", "Doyle", "Turner"] },
  { country: "Irlandia", flag: "\u{1F1EE}\u{1F1EA}", first: ["Se\xE1n", "Ciar\xE1n", "Darragh", "Cillian", "Eoin"], last: ["Byrne", "O'Brien", "Kavanagh", "Gallagher", "Brennan"] },
  { country: "Szwecja", flag: "\u{1F1F8}\u{1F1EA}", first: ["Erik", "Oskar", "Viktor", "Anton", "Linus"], last: ["Lindqvist", "Bergstr\xF6m", "Holm", "Ekstr\xF6m", "Nyberg"] },
  { country: "Gruzja", flag: "\u{1F1EC}\u{1F1EA}", first: ["Giorgi", "Levan", "Davit", "Irakli", "Nika"], last: ["Beridze", "Kapanadze", "Tsiklauri", "Gelashvili", "Jabua"] },
  { country: "Hiszpania", flag: "\u{1F1EA}\u{1F1F8}", first: ["\xC1lvaro", "Pablo", "Sergio", "Iker", "Ra\xFAl"], last: ["Navarro", "Romero", "Castillo", "Ortega", "Delgado"] },
  { country: "Ukraina", flag: "\u{1F1FA}\u{1F1E6}", first: ["Andrij", "O\u0142eh", "Maksym", "Bohdan", "Taras"], last: ["Kowalenko", "Szewczenko", "Bondarenko", "Tkaczuk", "Melnyk"] },
  { country: "Holandia", flag: "\u{1F1F3}\u{1F1F1}", first: ["Daan", "Sem", "Bram", "Ruben", "Jesse"], last: ["de Vries", "van Dijk", "Bakker", "Visser", "Smit"] }
];
var NAMES_WORLD = [
  { country: "USA", flag: "\u{1F1FA}\u{1F1F8}", first: ["Tyler", "Brandon", "Jake", "Marcus", "Cody", "Derrick", "Trey"], last: ["Johnson", "Miller", "Carter", "Hayes", "Brooks", "Reed", "Coleman"] },
  { country: "Brazylia", flag: "\u{1F1E7}\u{1F1F7}", first: ["Thiago", "Rafael", "Gilberto", "Fabr\xEDcio", "Jailton", "Renato"], last: ["Silva", "Santos", "Oliveira", "Souza", "Barbosa", "Nunes", "Moraes"] },
  { country: "Dagestan", flag: "\u{1F1F7}\u{1F1FA}", first: ["Magomed", "Islam", "Abubakar", "Shamil", "Zaur"], last: ["Gadzhiev", "Abdulaev", "Magomedov", "Aliev", "Omarov"] },
  { country: "Meksyk", flag: "\u{1F1F2}\u{1F1FD}", first: ["Diego", "Alejandro", "Brandon", "Jes\xFAs", "Yair"], last: ["Ram\xEDrez", "Hern\xE1ndez", "Guzm\xE1n", "Torres", "Vargas"] },
  { country: "Australia", flag: "\u{1F1E6}\u{1F1FA}", first: ["Jai", "Brody", "Kai", "Lachlan", "Mitch"], last: ["Whittaker", "Ryan", "Morrison", "Kerr", "Doolan"] },
  { country: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}", first: ["Kamaru", "Israel", "Chidi", "Emeka", "Tunde"], last: ["Adeyemi", "Okafor", "Eze", "Balogun", "Nwosu"] },
  { country: "Japonia", flag: "\u{1F1EF}\u{1F1F5}", first: ["Kai", "Ryo", "Takeru", "Yuto", "Shinji"], last: ["Tanaka", "Horiguchi", "Sato", "Kimura", "Nakamura"] },
  { country: "Kazachstan", flag: "\u{1F1F0}\u{1F1FF}", first: ["Shavkat", "Yerlan", "Nurlan", "Arman", "Daulet"], last: ["Rakhimov", "Seitkali", "Zhumagulov", "Akhmetov", "Bekov"] }
];
var NICKNAMES = [
  "Pitbull",
  "M\u0142ot",
  "Cichy",
  "Kosa",
  "Byk",
  "Dzik",
  "Grizzly",
  "Snajper",
  "Tytan",
  "Pirania",
  "Wilk",
  "Skorpion",
  "Buldo\u017Cer",
  "\u017Belazny",
  "Kowal",
  "Tajfun",
  "Bestia",
  "Szakal",
  "Spokojny",
  "Profesor",
  "Doktor",
  "Kat",
  "Gladiator",
  "Rze\u017Anik",
  "\u0141o\u015B",
  "Rekin",
  "Kobra",
  "Anakonda",
  "Turbo",
  "Diesel",
  "Ma\u0142y",
  "G\xF3ral",
  "Baca",
  "Ksi\u0105\u017C\u0119",
  "Genera\u0142",
  "Dynamit",
  "Grom",
  "Huragan",
  "Zadyma",
  "Bazooka",
  "Kamikaze",
  "Hydraulik",
  "Ksi\u0105dz",
  "Og\xF3rek",
  "Kie\u0142basa",
  "Hrabia",
  "Wiking",
  "S\u0119k",
  "Kret",
  "Bober",
  "\u017Bubr",
  "Sok\xF3\u0142",
  "Ry\u015B",
  "Szwagier",
  "So\u0142tys",
  "Prezes",
  "Kombajn",
  "Traktor",
  "P\u0105czek",
  "Czo\u0142g",
  "Rambo",
  "Komornik",
  "Mechanik",
  "Taks\xF3wkarz",
  "Dzi\u0119cio\u0142",
  "Borsuk",
  "Je\u017C",
  "Kowboj",
  "Szeryf",
  "Mi\u015B",
  "Zb\xF3j",
  "Janosik",
  "Harna\u015B",
  "Lord",
  "Barbarzy\u0144ca",
  "Wulkan",
  "Lawina",
  "Kafar",
  "D\u017Awig",
  "Siekiera",
  "Kilof",
  "\u015Awider",
  "Kaskader",
  "Bramkarz",
  "Stra\u017Cak",
  "Listonosz",
  "Kaloryfer",
  "Betoniarka",
  "Piero\u017Cek",
  "Chrzan",
  "Pikachu",
  "Nocny Marek",
  "Go\u0142\u0105b"
];
var INTL_NICKNAMES = [
  "The Hammer",
  "Bad Boy",
  "The Machine",
  "Iceman",
  "Cyborg",
  "The Spider",
  "Bonecrusher",
  "The Eagle",
  "Hurricane",
  "The Natural",
  "Mad Dog",
  "Thunder",
  "The Prodigy",
  "El Diablo",
  "Tank",
  "The Reaper",
  "Kid Dynamite",
  "Showtime",
  "The Assassin",
  "Wolverine",
  "The Problem",
  "No Love",
  "The Count",
  "The Eraser",
  "The Gentleman",
  "Big Ben",
  "Lightning",
  "The Bull",
  "Scorpion King",
  "Tarzan",
  "The Professor",
  "Chaos",
  "The Butcher",
  "Ironside",
  "The Viking",
  "Night Train",
  "Hitman",
  "Jackhammer",
  "The Surgeon",
  "Captain"
];
var FREAK_TYPES = [
  { title: "raper z Radomia", nick: "Rymowany" },
  { title: "youtuber od prank\xF3w", nick: "Prankster" },
  { title: "by\u0142y strongman", nick: "Lod\xF3wka" },
  { title: "gwiazda reality show", nick: "Celebryta" },
  { title: "influencer fitness", nick: "Klata" },
  { title: "streamer od gier", nick: "Laguj\u0105cy" },
  { title: "by\u0142y pi\u0142karz IV ligi", nick: "Spalony" },
  { title: "tiktoker od ta\u0144c\xF3w", nick: "Trend" },
  { title: "pose\u0142 na urlopie", nick: "Immunitet" },
  { title: "kulturysta po czterdziestce", nick: "Pompka" },
  { title: "uczestnik randkowego reality show", nick: "Amant" },
  { title: "cukiernik z TikTaka", nick: "Babeczka" },
  { title: "trener personalny celebryt\xF3w", nick: "Coach" },
  { title: "youtuber od survivalu", nick: "Przetrwaniec" },
  { title: "prezenter pogody", nick: "Ni\u017C" },
  { title: "kulturysta \u201Enaturalny\u201D (podobno)", nick: "Natural" },
  { title: "wokalista disco polo", nick: "Refren" },
  { title: "youtuber, kt\xF3ry nigdy nie walczy\u0142", nick: "Teoretyk" },
  { title: "m\xF3wca motywacyjny", nick: "Mindset" },
  { title: "mistrz w jedzeniu pierog\xF3w", nick: "Farsz" },
  { title: "by\u0142y cz\u0142onek boysbandu", nick: "Falset" },
  { title: "kierowca tira z TikTaka", nick: "Kabina" },
  { title: "radny gminy", nick: "Uchwa\u0142a" },
  { title: "barber gwiazd", nick: "Fade" },
  { title: "zawodowy gracz komputerowy", nick: "Kamper" }
];
var CLUB_TEMPLATES = [
  { name: "Remiza Team", city: "{home}", quality: 1, cost: 0, specialty: "chin", injuryMod: 1.2, desc: "Mata w remizie OSP, worek po dziadku. Trener kiedy\u015B sta\u0142 na bramce w dyskotece.", minTier: 0, crest: { shape: "shield", bg: "#b91c1c", fg: "#fde68a", icon: "flame", text: "RT" } },
  { name: "Sparta Fight Club", city: "{home}", quality: 2, cost: 3e3, specialty: "stand", injuryMod: 1, desc: "Sala w piwnicy pod blokiem, ale ring, klatka i trener z licencj\u0105 s\u0105.", minTier: 0, crest: { shape: "circle", bg: "#1e3a8a", fg: "#facc15", icon: "fist", text: "SFC" } },
  { name: "Hutnik Bytom", city: "Bytom", quality: 2, cost: 4e3, specialty: "wrest", injuryMod: 1.1, desc: "Sekcja zapas\xF3w przy starym klubie hutniczym. Kondycj\u0119 robi si\u0119 tu przez cierpienie.", minTier: 0, crest: { shape: "shield", bg: "#18181b", fg: "#f97316", icon: "gear", text: "KSH" } },
  { name: "Meduza \u0141\xF3d\u017A", city: "\u0141\xF3d\u017A", quality: 3, cost: 9e3, specialty: "bjj", injuryMod: 0.9, desc: "Czarne pasy na ka\u017Cdej macie, sala w starej prz\u0119dzalni. Tu naucz\u0105 ci\u0119 dusi\u0107.", minTier: 1, crest: { shape: "hex", bg: "#581c87", fg: "#f5f5f5", icon: "wave", text: "M\u0141" } },
  { name: "Berzerker Brothers", city: "Wroc\u0142aw", quality: 3, cost: 11e3, specialty: "stand", injuryMod: 0.9, desc: "Mocna st\xF3jka, twarde sparingi z zawodowcami i dietetyczka, kt\xF3ra odbiera telefon.", minTier: 1, crest: { shape: "circle", bg: "#166534", fg: "#fca5a5", icon: "bolt", text: "BB" } },
  { name: "WZA Fight Team", city: "Warszawa", quality: 4, cost: 28e3, specialty: "wrest", injuryMod: 0.85, desc: "Czo\u0142owy klub w kraju. Na treningach mijasz si\u0119 z mistrzami najwi\u0119kszych gal.", minTier: 2, crest: { shape: "shield", bg: "#111827", fg: "#01aeee", icon: "star", text: "WZA" } },
  { name: "Barracuda Top Team", city: "Gdynia", quality: 4, cost: 25e3, specialty: "cardio", injuryMod: 0.85, desc: "Obozy nad morzem, bieganie po pla\u017Cy o sz\xF3stej rano i przygotowanie motoryczne na serio.", minTier: 2, crest: { shape: "circle", bg: "#0c4a6e", fg: "#f8fafc", icon: "wave", text: "BTT" } },
  { name: "Czerwony W\u0105\u017C", city: "Pozna\u0144", quality: 4, cost: 24e3, specialty: "iq", injuryMod: 0.85, desc: "Klub od lat robi\u0105cy mistrz\xF3w. Tu ucz\u0105, jak wygrywa\u0107 walki g\u0142ow\u0105, a nie tylko pi\u0119\u015Bciami.", minTier: 2, crest: { shape: "hex", bg: "#991b1b", fg: "#fef2f2", icon: "snake", text: "CW" } },
  { name: "Phuket Top Camp", city: "Tajlandia", quality: 4, cost: 3e4, specialty: "stand", injuryMod: 1.1, desc: "Muay thai dwa razy dziennie w 35 stopniach. Wracasz opalony i ostry jak brzytwa.", minTier: 2, crest: { shape: "diamond", bg: "#c2410c", fg: "#fef3c7", icon: "palm", text: "PTC" } },
  { name: "American Top Dog", city: "Floryda, USA", quality: 5, cost: 6e4, specialty: "iq", injuryMod: 0.8, desc: "\u015Awiatowa czo\u0142\xF3wka. Pasy wisz\u0105 na \u015Bcianie, rachunek te\u017C robi wra\u017Cenie.", minTier: 3, crest: { shape: "hex", bg: "#0f766e", fg: "#fde047", icon: "sun", text: "ATD" } },
  { name: "Altitude Fight Lab", city: "Kolorado, USA", quality: 5, cost: 55e3, specialty: "cardio", injuryMod: 0.8, desc: "Ob\xF3z w g\xF3rach, sztab naukowc\xF3w i kondycja z kosmosu.", minTier: 3, crest: { shape: "shield", bg: "#1f2937", fg: "#93c5fd", icon: "mountain", text: "AFL" } },
  { name: "Gara\u017C u Zbyszka", city: "{home}", quality: 1, cost: 0, specialty: "cardio", injuryMod: 1.25, desc: "Mata roz\u0142o\u017Cona mi\u0119dzy kosiark\u0105 a starym fiatem. Zbyszek ogl\u0105da\u0142 ka\u017Cd\u0105 gal\u0119 w telewizji i ma swoje teorie.", minTier: 0, crest: { shape: "badge", bg: "#78350f", fg: "#fde68a", icon: "wrench", text: "GZ" } },
  { name: "LZS K\u0142os Fight", city: "{home}", quality: 1, cost: 500, specialty: "wrest", injuryMod: 1.15, desc: "Ludowy Zesp\xF3\u0142 Sportowy. Mata le\u017Cy w \u015Bwietlicy po do\u017Cynkach, a so\u0142tys przychodzi kibicowa\u0107 na sparingi.", minTier: 0, crest: { shape: "shield", bg: "#3f6212", fg: "#fef08a", icon: "wheat", text: "LZS" } },
  { name: "Akademia Kimura Krak\xF3w", city: "Krak\xF3w", quality: 2, cost: 5e3, specialty: "bjj", injuryMod: 1, desc: "Kimona, maty i zdj\u0119cia brazylijskich mistrz\xF3w na \u015Bcianie. Trener m\xF3wi \u201Eoss\u201D nawet do kuriera.", minTier: 0, crest: { shape: "circle", bg: "#f8fafc", fg: "#1e3a8a", icon: "fist", text: "AK" } },
  { name: "Dziki Zach\xF3d Szczecin", city: "Szczecin", quality: 2, cost: 4500, specialty: "chin", injuryMod: 1.15, desc: "Port, wiatr i sparingi bez przerw na wod\u0119. Kto przetrwa tu rok, nie boi si\u0119 ju\u017C niczego.", minTier: 0, crest: { shape: "badge", bg: "#1c1917", fg: "#fb923c", icon: "boar", text: "DZ" } },
  { name: "Arachnion Olsztyn", city: "Olsztyn", quality: 3, cost: 8500, specialty: "wrest", injuryMod: 0.95, desc: "Klub z jeziorami za oknem i zapa\u015Bnikami na ka\u017Cdej macie. Biegi wok\xF3\u0142 jeziora o \u015Bwicie gratis.", minTier: 1, crest: { shape: "hex", bg: "#0f172a", fg: "#a3e635", icon: "snake", text: "AO" } },
  { name: "Lubelskie Lwy", city: "Lublin", quality: 3, cost: 9500, specialty: "chin", injuryMod: 0.95, desc: "Twarde sparingi i jeszcze twardszy trener. Po treningu wszyscy id\u0105 na cebularza.", minTier: 1, crest: { shape: "shield", bg: "#7f1d1d", fg: "#fcd34d", icon: "crown", text: "LL" } },
  { name: "Gracje Barra Rio", city: "Rio de Janeiro", quality: 4, cost: 38e3, specialty: "bjj", injuryMod: 0.9, desc: "Kimona, pla\u017Ca i churrasco po treningu. Ka\u017Cdy tu jest czyim\u015B kuzynem, a ka\u017Cdy kuzyn ma czarny pas.", minTier: 2, crest: { shape: "diamond", bg: "#15803d", fg: "#fde047", icon: "wave", text: "GB" } },
  { name: "Straight Blarney Gym", city: "Dublin", quality: 4, cost: 36e3, specialty: "stand", injuryMod: 0.9, desc: "Trener m\xF3wi, \u017Ce nie ma talentu, jest tylko obsesja. Po sparingach ca\u0142a ekipa idzie do pubu na wod\u0119.", minTier: 2, crest: { shape: "shield", bg: "#166534", fg: "#f8fafc", icon: "mug", text: "SBG" } },
  { name: "All-Gwiazdy Sztokholm", city: "Sztokholm", quality: 4, cost: 34e3, specialty: "iq", injuryMod: 0.85, desc: "Skandynawski spok\xF3j, analiza wideo i sauna po ka\u017Cdym treningu. Nikt tu nie krzyczy.", minTier: 2, crest: { shape: "circle", bg: "#1d4ed8", fg: "#fde047", icon: "star", text: "AG" } },
  { name: "Miasto Kickboxing", city: "Auckland", quality: 4, cost: 35e3, specialty: "stand", injuryMod: 0.85, desc: "Najlu\u017Aniejsza sala na \u015Bwiecie: muzyka, taniec na rozgrzewce i st\xF3jka jak z filmu. Lot trwa 30 godzin.", minTier: 2, crest: { shape: "diamond", bg: "#0a0a0a", fg: "#f472b6", icon: "bolt", text: "MK" } },
  { name: "Team Alfa Samiec", city: "Sacramento, USA", quality: 5, cost: 45e3, specialty: "wrest", injuryMod: 0.85, desc: "Wszyscy niewysocy, wszyscy zapa\u015Bnicy, wszyscy z rozja\u015Bnionymi w\u0142osami. Obalenia ucz\u0105 tu jak alfabetu.", minTier: 3, crest: { shape: "badge", bg: "#111827", fg: "#facc15", icon: "wolf", text: "TAS" } },
  { name: "Or\u0142y Machaczka\u0142a", city: "Dagestan", quality: 5, cost: 3e4, specialty: "wrest", injuryMod: 0.9, desc: "Rozgrzewka to noszenie si\u0119 na barana pod g\xF3r\u0119. Ojca g\u0142\xF3wnego trenera lepiej nie denerwowa\u0107.", minTier: 3, crest: { shape: "shield", bg: "#1e3a8a", fg: "#f8fafc", icon: "eagle", text: "OM" } },
  { name: "Jackman-Wonk", city: "Albuquerque, USA", quality: 5, cost: 55e3, specialty: "iq", injuryMod: 0.8, desc: "Trener rozpisuje walki na tablicy jak parti\u0119 szach\xF3w. Sala na wysoko\u015Bci 1600 m, oddycha si\u0119 ci\u0119\u017Cko.", minTier: 3, crest: { shape: "hex", bg: "#7c2d12", fg: "#fef3c7", icon: "mountain", text: "JW" } },
  { name: "Kill Klif FC", city: "Floryda, USA", quality: 5, cost: 5e4, specialty: "cardio", injuryMod: 0.85, desc: "Upa\u0142, sprinty po pla\u017Cy i sparingi z po\u0142ow\u0105 topowej dziesi\u0105tki \u015Bwiata. Klimatyzacja tylko w szatni.", minTier: 3, crest: { shape: "circle", bg: "#0e7490", fg: "#fef9c3", icon: "sun", text: "KK" } }
];
var WIN_DETAILS = {
  KO: [
    { nom: "prawy prosty", form: "prawym prostym" },
    { nom: "lewy sierpowy", form: "lewym sierpowym" },
    { nom: "kopni\u0119cie na g\u0142ow\u0119", form: "kopni\u0119ciem na g\u0142ow\u0119" },
    { nom: "kolano z wyskoku", form: "kolanem z wyskoku" },
    { nom: "\u0142okie\u0107 z klinczu", form: "\u0142okciem z klinczu" },
    { nom: "prawa kontra", form: "praw\u0105 kontr\u0105" },
    { nom: "seria przy siatce", form: "seri\u0105 przy siatce" },
    { nom: "podbr\xF3dkowy", form: "podbr\xF3dkowym" },
    { nom: "kopni\u0119cie na w\u0105trob\u0119", form: "kopni\u0119ciem na w\u0105trob\u0119" },
    { nom: "lewy hak", form: "lewym hakiem" }
  ],
  SUB: [
    { nom: "duszenie zza plec\xF3w", form: "duszenie zza plec\xF3w" },
    { nom: "gilotyna", form: "gilotyn\u0119" },
    { nom: "tr\xF3jk\u0105t nogami", form: "tr\xF3jk\u0105t nogami" },
    { nom: "omoplata", form: "omoplat\u0119" },
    { nom: "duszenie d'arce", form: "duszenie d'arce" },
    { nom: "kimura", form: "kimur\u0119" },
    { nom: "anakonda", form: "anakond\u0119" },
    { nom: "tr\xF3jk\u0105t r\u0119kami", form: "tr\xF3jk\u0105t r\u0119kami" },
    { nom: "d\u017Awignia na kolano", form: "d\u017Awigni\u0119 na kolano" },
    { nom: "balacha", form: "balach\u0119" }
  ]
};

// src/engine/fighter.ts
var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
var OVR_W = { stand: 0.2, wrest: 0.18, bjj: 0.16, cardio: 0.16, chin: 0.15, iq: 0.15 };
function ovr(stats) {
  let s = 0;
  for (const k of STAT_KEYS) s += stats[k] * OVR_W[k];
  return Math.round(s);
}
function mapStats(fn) {
  return {
    stand: fn("stand"),
    wrest: fn("wrest"),
    bjj: fn("bjj"),
    cardio: fn("cardio"),
    chin: fn("chin"),
    iq: fn("iq")
  };
}
var uid = (rng, p = "f") => `${p}${rng.int(0, 1e9).toString(36)}${rng.int(0, 1e6).toString(36)}`;
function pickPool(rng, tier) {
  const r = rng.next();
  if (tier <= 1) return NAMES_PL;
  if (tier === 2) return r < 0.82 ? NAMES_PL : rng.pick(NAMES_EU);
  if (tier === 3) return r < 0.3 ? NAMES_PL : rng.pick(NAMES_EU);
  return r < 0.12 ? NAMES_PL : r < 0.35 ? rng.pick(NAMES_EU) : rng.pick(NAMES_WORLD);
}
function randomName(rng, pool = NAMES_PL) {
  return { firstName: rng.pick(pool.first), lastName: rng.pick(pool.last) };
}
function rankBonus(tier, rank) {
  if (rank === 0) return 8;
  if (rank === null) return -4;
  const size = RANK_SIZE[tier];
  return (size - rank) / size * 8 - 2;
}
function randomRecord(rng, tier, rank) {
  const base = [0, 4, 9, 14, 17][tier];
  const spread = [5, 7, 9, 10, 12][tier];
  const quality = rank === 0 ? 1 : rank === null ? 0.3 : 1 - rank / (RANK_SIZE[tier] + 2);
  const w = Math.max(tier === 0 ? 0 : 1, base + rng.int(0, spread) + Math.round(quality * 4));
  const l = Math.max(0, Math.round(rng.int(0, Math.max(1, Math.round(w * 0.45))) * (1.2 - quality)));
  const d = rng.chance(0.15) ? 1 : 0;
  return { w, l, d };
}
function generateOpponent(rng, tier, rank, hard) {
  const pool = pickPool(rng, tier);
  const { firstName, lastName } = randomName(rng, pool);
  const style = rng.weighted([
    { item: "boxer", w: 16 },
    { item: "kickboxer", w: 16 },
    { item: "wrestler", w: pool.country === "Dagestan" ? 60 : 18 },
    { item: "grappler", w: pool.country === "Brazylia" ? 40 : 15 },
    { item: "brawler", w: tier <= 1 ? 22 : 10 },
    { item: "allround", w: 10 + tier * 4 }
  ]);
  const level = TIER_LEVEL[tier] + rankBonus(tier, rank) + rng.int(-5, 5) + (hard ? 3 : 0);
  const prof = STYLE_PROFILE[style];
  const stats = mapStats((k) => clamp(Math.round(level + prof[k] + rng.int(-5, 5)), 8, 99));
  const nickPool = pool === NAMES_PL ? NICKNAMES : INTL_NICKNAMES;
  return {
    id: uid(rng, "o"),
    firstName,
    lastName,
    nickname: rng.chance(0.75) ? rng.pick(nickPool) : "",
    country: pool.country,
    flag: pool.flag,
    age: rng.int(20, 34),
    style,
    stats,
    record: randomRecord(rng, tier, rank),
    rank
  };
}
function generateFreak(rng) {
  const f = rng.pick(FREAK_TYPES);
  const { firstName, lastName } = randomName(rng);
  const level = rng.int(24, 50);
  const style = rng.pick(["brawler", "boxer", "brawler", "allround", "wrestler"]);
  const prof = STYLE_PROFILE[style];
  return {
    id: uid(rng, "x"),
    firstName,
    lastName,
    nickname: f.nick,
    country: "Polska",
    flag: "\u{1F1F5}\u{1F1F1}",
    age: rng.int(22, 44),
    style,
    stats: mapStats((k) => clamp(Math.round(level + prof[k] + rng.int(-6, 6)), 5, 75)),
    record: { w: rng.int(0, 4), l: rng.int(0, 4), d: 0 },
    rank: null,
    freak: f.title
  };
}
function createPeers(rng, n, age) {
  const peers = [];
  for (let i = 0; i < n; i++) {
    const { firstName, lastName } = randomName(rng);
    const style = rng.pick(["boxer", "kickboxer", "wrestler", "grappler", "brawler", "allround"]);
    const talent = rng.next() ** 1.3;
    const base = 18 + talent * 12 + rng.int(-3, 3);
    const prof = STYLE_PROFILE[style];
    peers.push({
      id: uid(rng, "p"),
      firstName,
      lastName,
      nickname: rng.chance(0.6) ? rng.pick(NICKNAMES) : "",
      country: "Polska",
      flag: "\u{1F1F5}\u{1F1F1}",
      age,
      style,
      stats: mapStats((k) => clamp(Math.round(base + prof[k] * 0.6 + rng.int(-3, 3)), 5, 60)),
      record: { w: 0, l: 0, d: 0 },
      rank: null,
      peer: true,
      tier: 0,
      talent,
      belts: 0,
      retired: false,
      metCount: 0,
      h2h: { w: 0, l: 0, d: 0 }
    });
  }
  return peers;
}
function ageRate(age) {
  if (age <= 19) return 0.16;
  if (age <= 23) return 0.12;
  if (age <= 27) return 0.08;
  if (age <= 30) return 0.045;
  if (age <= 32) return 0.015;
  return 0;
}
function progressPeer(rng, p) {
  if (p.retired) return;
  p.age += 1;
  const pot = 48 + p.talent * 46;
  const rate = ageRate(p.age) * (0.8 + rng.next() * 0.5);
  for (const k of STAT_KEYS) {
    const target = pot + STYLE_PROFILE[p.style][k];
    p.stats[k] = clamp(Math.round(p.stats[k] + Math.max(0, target - p.stats[k]) * rate + rng.int(-1, 1)), 5, 99);
    if (p.age >= 32) p.stats[k] = clamp(p.stats[k] - rng.int(0, 2), 5, 99);
  }
  const fights = [4, 3, 3, 3, 2][p.tier];
  const level = TIER_LEVEL[p.tier];
  const o = ovr(p.stats);
  let w = 0;
  let l = 0;
  for (let i = 0; i < fights; i++) {
    const pw = 1 / (1 + Math.exp(-(o - level) / 5));
    if (rng.chance(pw)) w++;
    else l++;
  }
  p.record.w += w;
  p.record.l += l;
  if (p.tier < 4 && (p.tier > 0 || p.age >= 18) && w >= fights - (p.tier === 0 ? 1 : 0) && o > TIER_LEVEL[p.tier + 1] - 7) {
    if (p.tier === 0) p.record = { w: 0, l: 0, d: 0 };
    p.tier++;
    p.rank = rng.int(9, RANK_SIZE[p.tier]);
  } else if (p.tier > 0 && l >= Math.ceil(fights * 0.67) && o < level - 3) {
    p.tier--;
    p.rank = null;
  } else {
    const size = RANK_SIZE[p.tier];
    const cur = p.rank ?? size + 2;
    p.rank = clamp(cur - (w - l) * rng.int(1, 3), 0, size + 2);
    if (p.rank > size) p.rank = null;
  }
  if (p.rank === 0) {
    if (rng.chance(0.6)) p.belts++;
    p.rank = 1;
  }
  if (p.age >= 30 && rng.chance((p.age - 29) * 0.07 + (o < level ? 0.08 : 0))) p.retired = true;
  if (p.age < 24 && o < 30 && rng.chance(0.12)) p.retired = true;
}
function makeClub(rng, idx, home) {
  const t = CLUB_TEMPLATES[idx];
  const strength = clamp(t.quality * 18 + rng.int(-6, 6), 8, 99);
  return {
    id: `c${idx}`,
    name: t.name,
    city: t.city.replace("{home}", home),
    quality: t.quality,
    strength,
    cost: t.cost,
    specialty: t.specialty,
    injuryMod: t.injuryMod,
    desc: t.desc
  };
}
var CLUB_MULT = [0, 0.6, 0.8, 1, 1.2, 1.4];
var CLUB_CAP = [0, 16, 10, 5, 1, 0];

// src/engine/perks.ts
var PERKS = [
  { id: "sierp", name: "Prawy sierp", desc: "+9% do ryzykownych akcji w st\xF3jce (szukanie nokautu).", req: { stat: "stand", min: 45 }, bonus: (o) => o.stat === "stand" && o.kind === "risk" ? 9 : 0 },
  { id: "kombinacje", name: "Kombinacje", desc: "+6% do zwyk\u0142ych akcji w st\xF3jce.", req: { stat: "stand", min: 40 }, bonus: (o) => o.stat === "stand" && o.kind !== "risk" ? 6 : 0 },
  { id: "nogi", name: "Wej\u015Bcie w nogi", desc: "+7% do wszystkich akcji zapa\u015Bniczych.", req: { stat: "wrest", min: 40 }, bonus: (o) => o.stat === "wrest" ? 7 : 0 },
  { id: "duszenie", name: "Duszenie zza plec\xF3w", desc: "+9% do akcji w parterze.", req: { stat: "bjj", min: 45 }, bonus: (o) => o.stat === "bjj" ? 9 : 0 },
  { id: "piec", name: "P\u0142uca jak piec", desc: "+5% do ka\u017Cdej decyzji od 3. rundy.", req: { stat: "cardio", min: 45 }, bonus: (_o, r) => r >= 3 ? 5 : 0 },
  { id: "glowa", name: "Ch\u0142odna g\u0142owa", desc: "+7% do bezpiecznych opcji (odpoczynek, trzymanie planu).", req: { stat: "iq", min: 40 }, bonus: (o) => o.kind === "safe" ? 7 : 0 }
];
var MAX_PERKS = 2;
function perkUnlocked(s, p) {
  return s.stats[p.req.stat] >= p.req.min;
}
function activePerks(s) {
  return (s.perks ?? []).map((id) => PERKS.find((p) => p.id === id)).filter((p) => !!p && perkUnlocked(s, p)).slice(0, MAX_PERKS);
}
function applyPerks(dp, perks, chanceToDist) {
  if (!perks.length) return;
  for (const o of dp.options) {
    let b = 0;
    const names = [];
    for (const p of perks) {
      const v = p.bonus(o, dp.round);
      if (v > 0) {
        b += v;
        names.push(p.name);
      }
    }
    if (b > 0) {
      o.chance = Math.min(95, o.chance + b);
      o.dist = chanceToDist(o.chance);
      o.perk = names.join(", ");
    }
  }
}

// src/engine/fight.ts
function chanceFrom(atk, def, mod = 0) {
  return Math.round(clamp(50 + 46 * Math.tanh((atk - def) / 27) + mod, 5, 95));
}
function distFrom(p) {
  const sup = Math.round(clamp((p - 30) * 0.22, 2, 28));
  const s = Math.min(sup, p - 1);
  return [s, p - s, 100 - p];
}
function rollOutcome(rng, p) {
  const [sup, suc] = distFrom(p);
  const r = rng.next() * 100;
  if (r < sup) return "super";
  if (r < sup + suc) return "success";
  return "fail";
}
function rollExchange(rng, p) {
  const sup = clamp((p - 22) * 0.32, 4, 36);
  const r = rng.next() * 100;
  if (r < sup) return "super";
  if (r < p) return "success";
  return "fail";
}
var CORNER_LINES = [
  "Trener kl\u0119ka przed tob\u0105 i \u0142apie ci\u0119 za kark: \u201EPatrz na mnie. S\u0142uchaj.\u201D",
  "Cutman przyk\u0142ada l\xF3d do karku, trener m\xF3wi szybko i cicho.",
  "Hala huczy. Trener musi krzycze\u0107 ci prosto do ucha.",
  "Woda, wazelina, r\u0119cznik. Trener ma minut\u0119 i dwa zdania."
];
function eff(base, dmg, stam) {
  const dmgF = 1 - dmg / 260;
  const stamF = stam < 60 ? 0.74 + stam / 230 : 1;
  const f = dmgF * stamF;
  return {
    stand: base.stand * f,
    wrest: base.wrest * f,
    bjj: base.bjj * f,
    cardio: base.cardio,
    chin: base.chin * (1 - dmg / 400),
    iq: base.iq * dmgF
  };
}
function shortName(opp) {
  return opp.lastName;
}
function pickAction(rng, a, d, style, groundBias) {
  const adv = (x, y) => Math.max(0.2, 1 + (x - y) / 25);
  const styleW = {
    boxer: { strike: 7, takedown: 1, sub: 0.5, clinch: 1.5 },
    kickboxer: { strike: 7, takedown: 0.7, sub: 0.4, clinch: 2 },
    wrestler: { strike: 2.5, takedown: 6, sub: 1.5, clinch: 3 },
    grappler: { strike: 2, takedown: 4, sub: 5, clinch: 1.5 },
    brawler: { strike: 8, takedown: 1, sub: 0.3, clinch: 1.5 },
    allround: { strike: 4, takedown: 3, sub: 2, clinch: 2 }
  };
  const w = styleW[style] ?? styleW.allround;
  return rng.weighted([
    { item: "strike", w: w.strike * adv(a.stand, (d.stand + d.iq) / 2) },
    { item: "takedown", w: w.takedown * adv(a.wrest, d.wrest) },
    { item: "sub", w: (w.sub + groundBias) * adv(a.bjj, d.bjj) },
    { item: "clinch", w: w.clinch * adv((a.wrest + a.cardio) / 2, (d.wrest + d.cardio) / 2) }
  ]);
}
function styleOfStats(s) {
  const max = Math.max(s.stand, s.wrest, s.bjj);
  if (max === s.wrest && s.wrest > s.stand + 5) return "wrestler";
  if (max === s.bjj && s.bjj > s.stand + 5) return "grappler";
  if (s.stand > s.wrest + 5) return s.chin > s.iq + 6 ? "brawler" : "boxer";
  return "allround";
}
function predictability(st) {
  const off = ["stand", "wrest", "bjj"];
  const top = off.reduce((a, b) => st[b] > st[a] ? b : a, "stand");
  const rest = (st.stand + st.wrest + st.bjj + st.cardio + st.chin + st.iq - st[top]) / 5;
  return { stat: top, spike: Math.max(0, st[top] - rest - 10) };
}
var READ_K = 1.3;
var PLAN_STYLE = { stand: "boxer", wrest: "wrestler", bjj: "grappler" };
var PLAN_OPEN = [
  "Dziesi\u0119\u0107 minut do wyj\u015Bcia. Trener siada obok i pyta o plan.",
  "Szatnia. Kto\u015B za \u015Bcian\u0105 puszcza disco polo, trener zamyka drzwi i pyta, jak to rozgrywamy.",
  "R\u0119kawice ju\u017C zawi\u0105zane. Trener kuca przed tob\u0105: \u201EDobra, jaki plan?\u201D.",
  "Organizator puka: pi\u0119\u0107 minut. Trener nie odrywa wzroku od kartki z nagraniami rywala.",
  "Ostatnia rozgrzewka na tarczach. Trener \u0142apie ci\u0119 za kark: \u201ES\u0142uchaj mnie teraz\u201D.",
  "W szatni cisza, s\u0142ycha\u0107 tylko hal\u0119. Trener rysuje co\u015B palcem na macie."
];
function planText(opp) {
  const k = (opp.lastName.length * 7 + opp.firstName.length * 3 + opp.record.w) % PLAN_OPEN.length;
  return `${PLAN_OPEN[k]} ${styleNote(opp)} Plan ustawia, jak walczysz przez ca\u0142\u0105 walk\u0119.`;
}
function newSim(maxRounds) {
  return {
    round: 0,
    maxRounds,
    me: { dmg: 0, stam: 100 },
    opp: { dmg: 0, stam: 100 },
    momentum: 0,
    cards: [
      [0, 0],
      [0, 0],
      [0, 0]
    ],
    pending: null,
    decisionUsed: false,
    finished: false
  };
}
function finishFight(rep, sim, winner, method, detail) {
  sim.finished = true;
  rep.result = winner === "me" ? "W" : "L";
  rep.method = method;
  rep.round = Math.max(1, sim.round);
  rep.detail = detail;
}
function decideOnCards(rep, sim) {
  sim.finished = true;
  let meW = 0;
  let oppW = 0;
  for (const [a, b] of sim.cards) {
    if (a > b) meW++;
    else if (b > a) oppW++;
  }
  rep.cards = sim.cards.map((c) => [c[0], c[1]]);
  rep.round = sim.maxRounds;
  if (meW === 3 || oppW === 3) {
    rep.result = meW === 3 ? "W" : "L";
    rep.method = "Decyzja jednog\u0142o\u015Bna";
  } else if (meW === 2 && oppW === 1) {
    rep.result = "W";
    rep.method = "Decyzja niejednog\u0142o\u015Bna";
  } else if (oppW === 2 && meW === 1) {
    rep.result = "L";
    rep.method = "Decyzja niejednog\u0142o\u015Bna";
  } else if (meW === 2 || oppW === 2) {
    rep.result = meW === 2 ? "W" : "L";
    rep.method = "Decyzja wi\u0119kszo\u015Bciowa";
  } else {
    rep.result = "D";
    rep.method = "Remis";
  }
  rep.detail = rep.cards.map((c) => rep.result === "L" ? `${c[1]}\u2013${c[0]}` : `${c[0]}\u2013${c[1]}`).join(", ");
}
function pickFresh(rng, rep, arr) {
  const used = new Set(rep.moments.map((m) => m.text));
  const fresh = arr.filter((t) => !used.has(t));
  return rng.pick(fresh.length ? fresh : arr);
}
function addMoment(rep, m) {
  rep.moments.push(m);
}
function snapRound(sim) {
  const t = sim.track ??= [];
  const k = (n) => Math.round(Math.max(0, Math.min(100, n)));
  t[sim.round] = [k(100 - sim.me.dmg), k(sim.me.stam), k(100 - sim.opp.dmg), k(sim.opp.stam)];
}
function simulateRound(rng, ctx, sim, rep) {
  simulateRoundInner(rng, ctx, sim, rep);
  snapRound(sim);
  if (sim.finished) {
    const t = sim.track[sim.round];
    if (rep.result === "W" && rep.method !== "Lekarz") t[2] = 0;
    if (rep.result === "L" && rep.method !== "Lekarz") t[0] = 0;
  }
}
function simulateRoundInner(rng, ctx, sim, rep) {
  sim.round += 1;
  const r = sim.round;
  const opp = ctx.opp;
  const oppStyle = opp.style;
  const meStyle = sim.plan ? PLAN_STYLE[sim.plan] : styleOfStats(ctx.me);
  let pts = { me: 0, opp: 0 };
  const exchanges = 3;
  let groundMe = 0;
  let groundOpp = 0;
  const myMod = ctx.form - ctx.penalty + sim.momentum;
  const predMe = predictability(ctx.me);
  const predOpp = predictability(opp.stats);
  const readBonus = (atkWho, stat) => {
    if (!sim.pro) return 0;
    const pr = atkWho === "me" ? predMe : predOpp;
    return pr.stat === stat ? pr.spike * READ_K : 0;
  };
  for (let x = 0; x < exchanges && !sim.finished; x++) {
    const meE = eff(ctx.me, sim.me.dmg, sim.me.stam);
    const opE = eff(opp.stats, sim.opp.dmg, sim.opp.stam);
    const initP = clamp(50 + (meE.iq - opE.iq) * 0.6 + (sim.me.stam - sim.opp.stam) * 0.25 + myMod * 0.6, 15, 85);
    const who = rng.chance(initP / 100) ? "me" : "opp";
    const A = who === "me" ? meE : opE;
    const D = who === "me" ? opE : meE;
    const aSide = who === "me" ? sim.me : sim.opp;
    const dSide = who === "me" ? sim.opp : sim.me;
    const action = pickAction(rng, A, D, who === "me" ? meStyle : oppStyle, who === "me" ? groundMe : groundOpp);
    const mod = (who === "me" ? myMod : -myMod * 0.5) + (aSide.stam - dSide.stam) * 0.15;
    let p;
    let defStat;
    switch (action) {
      case "strike": {
        defStat = D.stand * 0.55 + D.iq * 0.45 + readBonus(who, "stand");
        const underneath = who === "me" ? groundOpp > 0 : groundMe > 0;
        p = chanceFrom(A.stand, defStat, mod - (underneath ? 14 : 0));
        break;
      }
      case "takedown":
        defStat = D.wrest * 0.85 + D.cardio * 0.15 + readBonus(who, "wrest");
        p = chanceFrom(A.wrest, defStat, mod);
        break;
      case "sub":
        defStat = D.bjj * 0.8 + D.wrest * 0.2 + readBonus(who, "bjj");
        p = chanceFrom(A.bjj, defStat, mod - 6 + (who === "me" ? groundMe : groundOpp) * 8);
        break;
      default:
        defStat = (D.wrest + D.cardio) / 2;
        p = chanceFrom((A.wrest + A.cardio) / 2, defStat, mod);
    }
    const out = rollExchange(rng, p);
    aSide.stam -= (action === "strike" ? 3 : 5) * (1.45 - A.cardio / 110);
    const add = (n) => {
      if (who === "me") pts.me += n;
      else pts.opp += n;
    };
    if (out === "fail") {
      if (action === "takedown") {
        aSide.stam -= 4;
        add(-0.5);
      } else if (action === "strike" && D.wrest > A.wrest + 10 && rng.chance(0.35)) {
        aSide.stam -= 5;
        add(-1.5);
        if (who === "me") {
          groundOpp++;
          groundMe = 0;
        } else {
          groundMe++;
          groundOpp = 0;
        }
      } else if (action === "strike" && rng.chance(0.35)) {
        aSide.dmg += rng.int(3, 7);
        add(-1);
      } else if (action === "sub") {
        if (who === "me") groundMe = 0;
        else groundOpp = 0;
        add(-1);
      }
      continue;
    }
    const big = out === "super";
    if (action === "strike") {
      dSide.dmg += Math.round((big ? rng.int(14, 22) : rng.int(6, 11)) * (1.3 - D.chin / 160));
      add(big ? 4 : 2);
      if (big || dSide.dmg >= 55 && rng.chance(0.45)) {
        const chin = who === "me" ? D.chin : D.chin;
        const pf = Math.round(clamp(14 + (A.stand - chin * 1.15 + 7) * 0.8 + dSide.dmg * 0.5, 5, 85));
        const fin = rng.chance(pf / 100);
        const d = rng.pick(WIN_DETAILS.KO);
        const detail = d.nom;
        const n = shortName(opp);
        if (who === "me") {
          addMoment(rep, {
            round: r,
            title: fin ? "Nokaut!" : "Rywal le\u017Cy!",
            text: fin ? pickFresh(rng, rep, [
              `Trafiasz go ${d.form} i ${n} pada jak d\u0142ugi. S\u0119dzia od razu przerywa.`,
              `${d.nom.charAt(0).toUpperCase() + d.nom.slice(1)} l\u0105duje idealnie. ${n} jeszcze stoi, ale oczy ma ju\u017C puste. S\u0119dzia wchodzi mi\u0119dzy was.`,
              `Widzisz, \u017Ce ${n} opuszcza r\u0119ce, i trafiasz go ${d.form}. Hala wstaje, zanim cia\u0142o dotknie maty.`,
              `Jedno trafienie ${d.form} i po wszystkim. ${n} szuka siatki, \u017Ceby si\u0119 podeprze\u0107, ale s\u0119dzia ju\u017C macha r\u0119kami.`
            ]) : pickFresh(rng, rep, [
              `Trafiasz go ${d.form}. ${n} l\u0105duje na macie, ale zd\u0105\u017Cy si\u0119 pozbiera\u0107, zanim do niego dopadniesz.`,
              `${n} siada na macie po trafieniu ${d.form}. Wstaje na liczenie, ale nogi mu si\u0119 trz\u0119s\u0105.`,
              `Trafiasz ${d.form} i ${n} przykl\u0119ka. Podnosi si\u0119, ale nogi ma jak z galarety.`,
              `${n} pada po trafieniu ${d.form}. S\u0119dzia patrzy mu w oczy d\u0142u\u017Cej, ni\u017C ${n} by chcia\u0142.`
            ]),
            stat: "stand",
            chance: pf,
            outcome: fin ? "super" : "success",
            effect: fin ? "koniec walki" : "rywal mocno obity",
            tone: fin ? "purple" : "good"
          });
        } else {
          addMoment(rep, {
            round: r,
            title: fin ? "Zgas\u0142o \u015Bwiat\u0142o" : "Podnosisz si\u0119 po nokdaunie",
            text: fin ? pickFresh(rng, rep, [
              `${n} trafia ci\u0119 ${d.form}. Budzisz si\u0119 na sto\u0142ku w naro\u017Cniku i pytasz, kt\xF3ra runda.`,
              `Nie widzia\u0142e\u015B tego ciosu. ${n} trafia ${d.form}, a nast\u0119pne, co pami\u0119tasz, to lekarz \u015Bwiec\u0105cy ci latark\u0105 w oczy.`,
              `${n} \u0142apie ci\u0119 ${d.form} w momencie, gdy wchodzi\u0142e\u015B z kombinacj\u0105. S\u0119dzia przerywa, zanim zd\u0105\u017Cysz zaprotestowa\u0107.`
            ]) : pickFresh(rng, rep, [
              `${n} trafia ci\u0119 ${d.form} i l\u0105dujesz na macie. Szcz\u0119ka wytrzyma\u0142a, zbierasz si\u0119.`,
              `Trafienie ${d.form} i nagle patrzysz w \u015Bwiat\u0142a hali. Wstajesz na sze\u015B\u0107, trener krzyczy, \u017Ceby\u015B trzyma\u0142 gard\u0119.`,
              `${n} rzuca ci\u0119 na mat\u0119 ${d.form}. Przez sekund\u0119 nie wiesz, gdzie jeste\u015B, ale wstajesz.`,
              `Trafienie ${d.form} sadza ci\u0119 na macie. S\u0142yszysz, jak mama w trzecim rz\u0119dzie zas\u0142ania oczy. Wstajesz.`,
              `${n} trafia ${d.form}, kolana mi\u0119kn\u0105. \u0141apiesz si\u0119 siatki i wracasz do gardy, zanim s\u0119dzia zd\u0105\u017Cy doliczy\u0107 do pi\u0119ciu.`
            ]),
            stat: "chin",
            chance: 100 - pf,
            outcome: fin ? "fail" : "success",
            effect: fin ? "koniec walki" : "jeste\u015B mocno obity",
            tone: fin ? "bad" : "neutral"
          });
        }
        if (fin) {
          finishFight(rep, sim, who, "KO/TKO", detail);
          break;
        }
      }
    } else if (action === "takedown") {
      dSide.stam -= big ? 10 : 6;
      dSide.dmg += rng.int(2, 5);
      add(big ? 3 : 2);
      if (who === "me") {
        groundMe++;
        groundOpp = 0;
      } else {
        groundOpp++;
        groundMe = 0;
      }
      const control = who === "me" ? groundMe : groundOpp;
      const transition = big || rng.chance(0.2 + control * 0.1);
      const tf = big ? 1 : 0.7;
      if (transition && A.bjj > A.stand + 3) {
        const pf = Math.round(clamp((26 + (A.bjj - D.bjj) * 1.5 + (100 - dSide.stam) * 0.3) * tf, 5, 80));
        if (rng.chance(pf / 100)) {
          const detail = "duszenie zza plec\xF3w";
          addMoment(rep, who === "me" ? { round: r, title: "Plecy i duszenie", text: rng.pick([`Obalasz, bierzesz plecy, haki w \u015Brodku. ${shortName(opp)} klepie po kilku sekundach.`, `${shortName(opp)} odwraca si\u0119, \u017Ceby wsta\u0107, i to jego b\u0142\u0105d. Plecy, rami\u0119 pod brod\u0119, klepni\u0119cie.`, `Z dosiadu przechodzisz na plecy jak na treningu. ${shortName(opp)} walczy z d\u0142o\u0144mi, ale duszenie ju\u017C siedzi.`]), stat: "bjj", chance: pf, outcome: "super", effect: "koniec walki", tone: "purple" } : { round: r, title: "Odda\u0142e\u015B plecy", text: rng.pick([`${shortName(opp)} obala ci\u0119 i wskakuje na plecy. Duszenie zza plec\xF3w, klepiesz.`, `Pr\xF3bujesz wsta\u0107 przy siatce, a ${shortName(opp)} tylko na to czeka\u0142. Rami\u0119 pod brod\u0119 i po walce.`, `${shortName(opp)} siedzi ci na plecach jak plecak. Bronisz si\u0119 d\u0142o\u0144mi, ale w ko\u0144cu musisz klepn\u0105\u0107.`]), stat: "bjj", chance: 100 - pf, outcome: "fail", effect: "koniec walki", tone: "bad" });
          finishFight(rep, sim, who, "Poddanie", detail);
          break;
        }
      } else if (transition) {
        dSide.dmg += big ? rng.int(8, 15) : rng.int(4, 9);
        const pf = Math.round(clamp((10 + (A.wrest * 1.2 + A.stand * 0.8 - D.chin * 2) * 0.6 + dSide.dmg * 0.45) * tf, 4, 70));
        if (rng.chance(pf / 100)) {
          if (who === "me") {
            addMoment(rep, {
              round: r,
              title: "Ground and pound",
              text: `Obalasz, wchodzisz w dosiad i rozbijasz go z g\xF3ry. ${shortName(opp)} ju\u017C si\u0119 nie broni, s\u0119dzia odci\u0105ga ci\u0119 od rywala.`,
              stat: "wrest",
              chance: pf,
              outcome: "super",
              effect: "koniec walki",
              tone: "purple"
            });
          } else {
            addMoment(rep, {
              round: r,
              title: "Rozbity z g\xF3ry",
              text: `${shortName(opp)} obala ci\u0119, siada w dosiadzie i leje z g\xF3ry. S\u0119dzia przerywa.`,
              stat: "wrest",
              chance: 100 - pf,
              outcome: "fail",
              effect: "koniec walki",
              tone: "bad"
            });
          }
          finishFight(rep, sim, who, "KO/TKO", "ciosy w parterze");
          break;
        }
      }
    } else if (action === "sub") {
      dSide.stam -= 6;
      add(big ? 3 : 1.5);
      if (big || rng.chance(dSide.stam < 30 ? 0.5 : 0.3)) {
        const pf = Math.round(clamp((34 + (A.bjj - D.bjj) * 1.6 + (100 - dSide.stam) * 0.35) * (big ? 1 : 0.8), 6, 88));
        const fin = rng.chance(pf / 100);
        const d = rng.pick(WIN_DETAILS.SUB);
        const detail = d.nom;
        const n = shortName(opp);
        if (who === "me") {
          addMoment(rep, {
            round: r,
            title: fin ? "Odklepa\u0142!" : "By\u0142o blisko",
            text: fin ? `Zapinasz ${d.form} i ${n} klepie po kilku sekundach.` : `Zapinasz ${d.form}, ale ${n} w ostatniej chwili si\u0119 wyrywa.`,
            stat: "bjj",
            chance: pf,
            outcome: fin ? "super" : "success",
            effect: fin ? "koniec walki" : "rywal s\u0142abnie",
            tone: fin ? "purple" : "good"
          });
        } else {
          addMoment(rep, {
            round: r,
            title: fin ? "Klepiesz" : "Wyrwa\u0142e\u015B si\u0119",
            text: fin ? `${n} zapina ${d.form}. Nie ma wyj\u015Bcia, klepiesz.` : `${n} zapina ${d.form}, ale na spokojnie si\u0119 wykr\u0119casz.`,
            stat: "bjj",
            chance: 100 - pf,
            outcome: fin ? "fail" : "success",
            effect: fin ? "koniec walki" : "przetrwane",
            tone: fin ? "bad" : "neutral"
          });
        }
        if (fin) {
          finishFight(rep, sim, who, "Poddanie", detail);
          break;
        }
      }
    } else {
      dSide.stam -= big ? 9 : 6;
      dSide.dmg += rng.int(2, 6);
      add(big ? 2.5 : 1.5);
    }
    if (dSide.dmg >= 100) {
      finishFight(rep, sim, who, "KO/TKO", "ciosy");
      break;
    }
  }
  const drain = (c) => Math.max(6, 27 - c / 3.6);
  sim.me.stam = clamp(sim.me.stam - drain(ctx.me.cardio), 0, 100);
  sim.opp.stam = clamp(sim.opp.stam - drain(opp.stats.cardio), 0, 100);
  sim.momentum = Math.round(sim.momentum * 0.4);
  if (sim.finished) return;
  if (r < sim.maxRounds && sim.opp.dmg >= 85 && sim.opp.dmg > sim.me.dmg && rng.chance(0.4)) {
    addMoment(rep, {
      round: r,
      title: "Lekarz przerywa",
      text: `${shortName(opp)} ma rozci\u0119ty \u0142uk, krew zalewa mu oko. Lekarz ogl\u0105da ran\u0119 i macha r\u0119kami. Wygrywasz.`,
      tone: "good"
    });
    finishFight(rep, sim, "me", "Lekarz", "rozci\u0119cie");
    return;
  }
  if (r < sim.maxRounds && sim.me.dmg >= 85 && rng.chance(0.4)) {
    addMoment(rep, {
      round: r,
      title: "Lekarz przerywa",
      text: "Rozci\u0119ty \u0142uk, krew zalewa oko. Lekarz patrzy dwie sekundy i macha r\u0119kami. Koniec.",
      tone: "bad"
    });
    finishFight(rep, sim, "opp", "Lekarz", "rozci\u0119cie");
    return;
  }
  const diff = pts.me - pts.opp;
  for (const card of sim.cards) {
    let meWins;
    let ten = false;
    const ad = Math.abs(diff);
    if (ad >= 2.5) meWins = diff > 0 ? !rng.chance(0.06) : rng.chance(0.06);
    else if (ad < 0.5 && rng.chance(0.12)) {
      ten = true;
      meWins = false;
    } else meWins = rng.chance(clamp(0.5 + diff * 0.17, 0.08, 0.92));
    if (ten) {
      card[0] += 10;
      card[1] += 10;
    } else {
      const eight = ad >= 7 && rng.chance(0.6);
      if (meWins) {
        card[0] += 10;
        card[1] += eight ? 8 : 9;
      } else {
        card[1] += 10;
        card[0] += eight ? 8 : 9;
      }
    }
  }
  sim.me.stam = clamp(sim.me.stam + 12, 0, 100);
  sim.opp.stam = clamp(sim.opp.stam + 12, 0, 100);
}
var KIND_OF = {};
function option(key, kind, label, desc, stat, atk, def, mod, win, lose) {
  KIND_OF[key] = kind;
  const chance = chanceFrom(atk, def, mod + (kind === "safe" ? 5 : 0));
  return { key, kind, label, desc, stat, chance, dist: distFrom(chance), win, lose };
}
function cardsLead(sim) {
  let lead = 0;
  for (const [a, b] of sim.cards) lead += Math.sign(a - b);
  return lead;
}
function styleNote(opp) {
  if (opp.freak) return `Rywal to ${opp.freak}. Na papierze nie ma si\u0119 czego ba\u0107.`;
  return {
    boxer: "Rywal to bokser z szybkimi r\u0119kami, ale na plecach si\u0119 gubi.",
    kickboxer: "Rywal kopie z dystansu, za to s\u0142abo broni obale\u0144.",
    wrestler: "Rywal to zapa\u015Bnik. B\u0119dzie wchodzi\u0142 w nogi od pierwszego gongu.",
    grappler: "Rywal jest gro\u017Any w parterze i tylko czeka, \u017Ceby ci\u0119 tam sprowadzi\u0107.",
    brawler: "Rywal to zadymiarz. Twarda g\u0142owa, ci\u0119\u017Cka r\u0119ka, techniki niewiele.",
    allround: "Rywal jest wszechstronny, bez wyra\u017Anych dziur."
  }[opp.style];
}
function buildDecision(rng, ctx, sim) {
  let dp = buildDecisionRaw(rng, ctx, sim);
  if (sim.big) {
    const seen = sim.seen ?? [];
    if (!dp || dp.id !== "hurt" && seen.includes(dp.id) || dp.id === "hurt" && seen[seen.length - 1] === "hurt") {
      const me = eff(ctx.me, sim.me.dmg, sim.me.stam);
      const op = eff(ctx.opp.stats, sim.opp.dmg, sim.opp.stam);
      const base = ctx.form - ctx.penalty;
      const safe = (key, label, desc, win, lose, stat = "iq") => option(key, "safe", label, desc, stat, me[stat], op[stat], base, win, lose);
      dp = cornerFallback(sim, me, op, shortName(ctx.opp), sim.round + 1, base, safe, rng.pick(CORNER_LINES));
    }
    sim.seen = [...seen, dp.id];
    dp.corner = dp.corner || sim.round > 0;
  }
  if (dp && ctx.perks?.length) applyPerks(dp, ctx.perks, distFrom);
  if (dp)
    dp.status = {
      lead: sim.round === 0 ? null : cardsLead(sim),
      stam: Math.round(sim.me.stam),
      hurt: Math.round(sim.me.dmg),
      oppStam: Math.round(sim.opp.stam),
      oppHurt: Math.round(sim.opp.dmg)
    };
  return dp;
}
function buildDecisionRaw(rng, ctx, sim) {
  const me = eff(ctx.me, sim.me.dmg, sim.me.stam);
  const op = eff(ctx.opp.stats, sim.opp.dmg, sim.opp.stam);
  const n = shortName(ctx.opp);
  const next = sim.round + 1;
  const base = ctx.form - ctx.penalty;
  const pm = predictability(ctx.me);
  const rd = (k) => sim.pro && pm.stat === k ? pm.spike * READ_K : 0;
  const safe = (key, label, desc, win, lose, stat = "iq") => option(key, "safe", label, desc, stat, me[stat], op[stat], base, win, lose);
  if (sim.round === 0) {
    return {
      id: "plan",
      round: 1,
      title: "Plan na walk\u0119",
      text: planText(ctx.opp),
      options: [
        option("plan_stand", "normal", "Bijemy si\u0119 w st\xF3jce", "Na nogach, szukamy czystych trafie\u0144.", "stand", me.stand, op.stand * 0.6 + op.iq * 0.4 + rd("stand"), base, "obijasz go od pierwszej rundy", "\u0142atwiej nadzia\u0107 si\u0119 na kontr\u0119"),
        option("plan_wrest", "normal", "Obalamy i dociskamy", "Zapasy, kontrola z g\xF3ry, rundy na punkty.", "wrest", me.wrest, op.wrest + rd("wrest"), base, "kontrolujesz rundy z g\xF3ry", "tracisz si\u0142y na nieudanych wej\u015Bciach"),
        option("plan_bjj", "risk", "Szukamy poddania", "Sprowadzamy do parteru i polujemy na szyj\u0119.", "bjj", me.bjj, op.bjj * 0.8 + op.wrest * 0.2 + rd("bjj"), base - 4, "szansa na szybkie poddanie", "l\u0105dujesz pod nim")
      ]
    };
  }
  if (sim.big) {
    const special = bigDecision(rng, ctx, sim, me, op, n, next, base, safe);
    if (special) return special;
  }
  if (sim.me.dmg >= 40) {
    return {
      id: "hurt",
      round: next,
      title: "Mocno obity",
      text: `Przerwa przed ${next}. rund\u0105. Krew w ustach, nogi jak z waty, a ${n} to widzi. Trener krzyczy, \u017Ceby\u015B co\u015B zmieni\u0142.`,
      options: [
        option("hurt_wrest", "normal", "Klincz i zapasy", "Wi\u0105\u017Cesz go przy siatce i kupujesz czas.", "wrest", me.wrest, op.wrest, base, "przetrwasz i zabierzesz mu tempo", "dalej obrywasz"),
        option("hurt_stand", "risk", "Wszystko na jedn\u0105 kart\u0119", "Stajesz na \u015Brodku i odpowiadasz bombami.", "stand", me.stand, op.stand, base - 10, "szansa na nokaut z niczego", "mo\u017Cesz zgasn\u0105\u0107"),
        safe("hurt_safe", "Przeczekujesz rund\u0119", "Ruch na nogach, garda wysoko, oddech.", "dochodzisz do siebie", "oddajesz mu inicjatyw\u0119", "chin")
      ]
    };
  }
  if (sim.opp.stam < 50 || sim.opp.dmg >= 40) {
    return {
      id: "finish",
      round: next,
      title: "Rywal siada",
      text: `${n} ci\u0119\u017Cko dyszy w naro\u017Cniku i ledwo podnosi r\u0119ce. To jest moment, \u017Ceby to sko\u0144czy\u0107.`,
      options: [
        option("fin_stand", "risk", "Idziesz po nokaut", "Ci\u015Bniesz od pierwszej sekundy rundy.", "stand", me.stand, op.chin, base + 4, "szansa na nokaut", "zm\u0119czysz si\u0119 i nadziejesz na kontr\u0119"),
        option("fin_bjj", "risk", "Obalasz i szukasz szyi", "Obalenie, plecy, duszenie.", "bjj", me.bjj, op.bjj, base + 2, "szansa na poddanie", "wy\u015Blizgnie ci si\u0119 i wstanie"),
        safe("fin_safe", "Wygrywasz na punkty", "Bez ryzyka, kontrolujesz dystans.", "pewna runda", "oddajesz mu inicjatyw\u0119")
      ]
    };
  }
  if (next === sim.maxRounds && sim.maxRounds > 1 && cardsLead(sim) < 0) {
    return {
      id: "losing",
      round: next,
      title: "Przegrywasz na kartach",
      text: "Ostatnia runda. Naro\u017Cnik m\xF3wi wprost: na punkty przegrywamy, trzeba go sko\u0144czy\u0107 albo wyra\u017Anie wygra\u0107 t\u0119 rund\u0119.",
      options: [
        option("lose_all", "risk", "Wszystko albo nic", "Rzucasz wszystko, co masz.", "stand", me.stand, op.chin, base - 4, "szansa na nokaut", "mo\u017Cesz zosta\u0107 skontrowany"),
        option("lose_bjj", "risk", "Szukasz poddania", "Ryzykowne przej\u015Bcie do parteru.", "bjj", me.bjj, op.bjj, base - 4, "szansa na poddanie", "stracisz pozycj\u0119"),
        option("lose_wrest", "normal", "Wygrywasz rund\u0119 zapasami", "Obalenia i kontrola, reszta w r\u0119kach s\u0119dzi\xF3w.", "wrest", me.wrest, op.wrest, base, "punkty po twojej stronie", "punkty znowu uciekaj\u0105")
      ]
    };
  }
  const os = ctx.opp.style;
  if ((os === "wrestler" || os === "grappler") && rng.chance(0.6)) {
    return {
      id: "grounded",
      round: next,
      title: "Znowu na plecach",
      text: `${n} obala ci\u0119 co rund\u0119 i le\u017Cy na tobie jak mokry koc. W naro\u017Cniku: \u201EMusisz co\u015B z tym zrobi\u0107!\u201D`,
      options: [
        option("gr_sprawl", "normal", "Bronisz obale\u0144 i bijesz", "Sprawl, odej\u015Bcie od siatki, ciosy na wej\u015Bciu.", "wrest", me.wrest, op.wrest, base, "zostajecie w st\xF3jce", "znowu l\u0105dujesz na plecach"),
        option("gr_guard", "risk", "Atakujesz z plec\xF3w", "Gilotyna, tr\xF3jk\u0105t, cokolwiek z\u0142apiesz.", "bjj", me.bjj, op.bjj, base - 6, "szansa na poddanie z do\u0142u", "oddajesz mu dosiad"),
        safe("gr_cardio", "Wstajesz za ka\u017Cdym razem", "M\u0119czysz go ci\u0105g\u0142ym wstawaniem.", "on traci si\u0142y szybciej ni\u017C ty", "oddajesz mu inicjatyw\u0119", "cardio")
      ]
    };
  }
  if ((os === "boxer" || os === "kickboxer" || os === "brawler") && rng.chance(0.6)) {
    return {
      id: "striker",
      round: next,
      title: "Rozbija ci\u0119 w st\xF3jce",
      text: `${n} trafia ci\u0119 z dystansu i nie mo\u017Cesz go z\u0142apa\u0107. Trener krzyczy: \u201ESkr\xF3\u0107 dystans!\u201D`,
      options: [
        option("st_shot", "normal", "Skracasz i obalasz", "Schodzisz do n\xF3g i sprowadzasz go do parteru.", "wrest", me.wrest, op.wrest, base + 3, "przenosisz walk\u0119 tam, gdzie mu \u017Ale", "nadziewasz si\u0119 na kolano"),
        option("st_brawl", "risk", "Odpowiadasz ogniem", "Stajesz z nim na wymian\u0119.", "stand", me.stand, op.stand, base - 6, "szansa na nokaut", "on jest w tym lepszy"),
        safe("st_clinch", "Klincz i kolana", "Wi\u0105\u017Cesz go przy siatce.", "odbierasz mu dystans", "oddajesz mu inicjatyw\u0119", "cardio")
      ]
    };
  }
  if (rng.chance(0.5)) {
    return {
      id: "mid",
      round: next,
      title: "Naro\u017Cnik pyta",
      text: `Przerwa przed ${next}. rund\u0105. Wyr\xF3wnana walka. Trener pyta, gdzie czujesz przewag\u0119.`,
      options: [
        option("mid_stand", "normal", "Podkr\u0119casz tempo w st\xF3jce", "Wi\u0119cej kombinacji, wi\u0119cej ryzyka.", "stand", me.stand, op.stand * 0.6 + op.iq * 0.4 + rd("stand"), base, "obijasz go i zabierasz mu rund\u0119", "\u0142apiesz kontr\u0119"),
        option("mid_wrest", "normal", "Schodzisz do n\xF3g i obalasz", "Zapasy i kontrola przy siatce.", "wrest", me.wrest, op.wrest + rd("wrest"), base, "rundy z g\xF3ry", "tracisz si\u0142y"),
        safe("mid_safe", "Trzymasz plan", "Robisz swoje, bez kombinowania.", "ma\u0142a przewaga", "nic si\u0119 nie zmienia")
      ]
    };
  }
  return null;
}
function bigDecision(rng, _ctx, sim, me, op, n, next, base, safe) {
  const seen = new Set(sim.seen ?? []);
  const line = rng.pick(CORNER_LINES);
  const lead = cardsLead(sim);
  if (!seen.has("cut") && sim.me.dmg >= 22 && rng.chance(0.75)) {
    return {
      id: "cut",
      corner: true,
      round: next,
      title: "Rozci\u0119ty \u0142uk",
      text: `Krew zalewa ci oko. Lekarz zagl\u0105da do naro\u017Cnika i patrzy na ran\u0119 d\u0142u\u017Cej, ni\u017C by\u015B chcia\u0142. Cutman ma sze\u015B\u0107dziesi\u0105t sekund.`,
      options: [
        safe("cut_close", "Cutman zamyka ran\u0119", "Ca\u0142a przerwa na \u0142uk. Na taktyk\u0119 nie zostaje czasu.", "rana trzyma, odzyskujesz spok\xF3j", "krew dalej leci", "chin"),
        option("cut_press", "normal", "Wazelina i ko\u0144czymy rund\u0119 z przodu", "Nie dajesz lekarzowi powodu, \u017Ceby przerwa\u0142.", "iq", me.iq, op.iq, base, "s\u0119dziowie widz\u0105, \u017Ce to ty dyktujesz warunki", "rana si\u0119 otwiera"),
        option("cut_rush", "risk", "Ko\u0144czysz, zanim przerwie lekarz", "Wszystko w tej rundzie, p\xF3ki widzisz.", "stand", me.stand, op.chin, base - 6, "szansa na nokaut", "lekarz mo\u017Ce przerwa\u0107 walk\u0119")
      ]
    };
  }
  if (!seen.has("champ") && next >= 4 && sim.maxRounds >= 5) {
    const tired = sim.opp.stam < sim.me.stam;
    return {
      id: "champ",
      corner: true,
      round: next,
      title: "Rundy mistrzowskie",
      text: `${line} \u201ETo s\u0105 rundy, w kt\xF3rych rodz\u0105 si\u0119 mistrzowie. ${tired ? `${n} jest bardziej zm\u0119czony od ciebie.` : `Jeste\u015B zm\u0119czony, ale on te\u017C.`}${lead > 0 ? " Prowadzisz na kartach." : lead < 0 ? " Na kartach przegrywasz." : ""}\u201D`,
      options: [
        option("ch_pace", "normal", "Podkr\u0119casz tempo", "Zalewasz go akcjami, niech si\u0119 dusi.", "cardio", me.cardio, op.cardio, base + (tired ? 4 : 0), "on ga\u015Bnie, ty ro\u015Bniesz", "paliwo ko\u0144czy si\u0119 tobie"),
        option("ch_finish", "risk", "Idziesz po sko\u0144czenie", "Pas zdobywa si\u0119 w klatce, nie na kartach.", "stand", me.stand, op.chin, base - 2 + (tired ? 3 : 0), "szansa na nokaut w rundzie mistrzowskiej", "zostawiasz otwart\u0105 szcz\u0119k\u0119"),
        safe("ch_smart", "M\u0105dra runda", "Dystans, kontry, \u017Cadnych g\u0142upich b\u0142\u0119d\xF3w.", "spokojnie zabierasz rund\u0119", "oddajesz mu inicjatyw\u0119")
      ]
    };
  }
  if (!seen.has("ahead") && sim.round >= 2 && lead >= 2 && next < sim.maxRounds) {
    return {
      id: "ahead",
      corner: true,
      round: next,
      title: "Prowadzisz wyra\u017Anie",
      text: `${line} \u201EMasz te rundy. Nie musisz nic udowadnia\u0107. Ale ${n} b\u0119dzie teraz szuka\u0142 jednej bomby.\u201D`,
      options: [
        safe("ah_safe", "Je\u017Adzisz na nogach", "Dystans, jab, odej\u015Bcie. Niech goni.", "kolejna spokojna runda", "pasywno\u015B\u0107 mo\u017Ce kosztowa\u0107 rund\u0119", "iq"),
        option("ah_wrest", "normal", "Obalasz i kontrolujesz", "Le\u017Cysz na nim i zabierasz czas.", "wrest", me.wrest, op.wrest, base, "runda z g\xF3ry, zero ryzyka", "wstaje i jest wkurzony"),
        option("ah_kill", "risk", "Ko\u0144czysz to teraz", "Skoro jest tw\xF3j, to go zamknij.", "stand", me.stand, op.chin, base, "sko\u0144czenie przed czasem", "jedna kontra zmienia wszystko")
      ]
    };
  }
  if (!seen.has("behind") && sim.round >= 2 && lead <= -2 && next < sim.maxRounds) {
    return {
      id: "behind",
      corner: true,
      round: next,
      title: "Uciekaj\u0105 ci rundy",
      text: `${line} \u201EOddajesz mu te rundy. Dalej tak i przegrasz na kartach. Musimy co\u015B zmieni\u0107.\u201D`,
      options: [
        option("bh_wrest", "normal", "Zmieniasz plan na zapasy", "Nogi, siatka, g\xF3ra. Co\u015B, czego si\u0119 nie spodziewa.", "wrest", me.wrest, op.wrest, base + 2, "przejmujesz rund\u0119", "on jest na to gotowy"),
        option("bh_bjj", "risk", "Polujesz na poddanie", "Ka\u017Cda okazja na szyj\u0119 albo r\u0119k\u0119.", "bjj", me.bjj, op.bjj, base - 4, "szansa na poddanie", "tracisz pozycj\u0119 i rund\u0119"),
        option("bh_stand", "risk", "Wymiana na \u015Brodku", "Stajesz i bijesz si\u0119, ile wlezie.", "stand", me.stand, op.stand, base - 4, "szansa na nokaut", "mo\u017Cesz zgasn\u0105\u0107")
      ]
    };
  }
  return null;
}
function cornerFallback(sim, me, op, n, next, base, safe, line) {
  return {
    id: `corner${next}`,
    corner: true,
    round: next,
    title: `Przerwa przed ${next}. rund\u0105`,
    text: `${line} \u201E${n} ${sim.opp.stam < 70 ? "zwalnia" : "jest \u015Bwie\u017Cy"}, ty ${sim.me.stam < 70 ? "te\u017C czujesz ju\u017C nogi" : "masz jeszcze paliwo"}. Gdzie go \u0142amiemy?\u201D`,
    options: [
      option(`cr_stand${next}`, "normal", "St\xF3jka, wi\u0119cej kombinacji", "Podkr\u0119casz r\u0119ce, szukasz czystych trafie\u0144.", "stand", me.stand, op.stand * 0.6 + op.iq * 0.4, base, "obijasz go, ro\u015Bnie szansa na sko\u0144czenie", "\u0142apiesz kontr\u0119"),
      option(`cr_wrest${next}`, "normal", "Zapasy i kontrola", "Obalenia, siatka, ci\u0119\u017Car cia\u0142a.", "wrest", me.wrest, op.wrest, base, "runda z g\xF3ry", "tracisz si\u0142y na wej\u015Bciach"),
      safe(`cr_safe${next}`, "Trzymasz plan", "Robisz swoje i oddychasz.", "ma\u0142a przewaga i odpoczynek", "nic si\u0119 nie zmienia")
    ]
  };
}
var POOL = {
  riskOk: [
    "Ryzyko si\u0119 op\u0142aca. Kto\u015B z pierwszego rz\u0119du rozlewa piwo z wra\u017Cenia.",
    "Wchodzi! {n} cofa si\u0119 pod siatk\u0119 i szuka ratunku.",
    "Trafiasz. {n} pierwszy raz w tej walce wygl\u0105da na przestraszonego.",
    "Hala wstaje z miejsc. {n} chwieje si\u0119 i \u0142apie ci\u0119 w klincz, \u017Ceby przetrwa\u0107.",
    "Ryzyko si\u0119 op\u0142aci\u0142o. {n} krwawi z \u0142uku i patrzy na zegar.",
    "Naro\u017Cnik krzyczy \u201Ejeszcze!\u201D. {n} ledwo trzyma gard\u0119."
  ],
  riskFail: [
    "Szar\u017Cujesz jak dzik na ziemniaki. {n} tylko si\u0119 odsuwa.",
    "{n} tylko na to czeka\u0142. \u0141apiesz kontr\u0119 i teraz to ty masz problem.",
    "Nie wysz\u0142o. Tracisz pozycj\u0119 i zbierasz kilka mocnych cios\xF3w.",
    "Za szeroko. {n} wchodzi w \u015Brodek i trafia ci\u0119 czysto.",
    "Przeszar\u017Cowa\u0142e\u015B. R\u0119ce opadaj\u0105, a {n} to widzi."
  ],
  normalOk: [
    "Robisz swoje. Komentator m\xF3wi, \u017Ce \u201Eto jest szachy, tylko z \u0142okciami\u201D.",
    "Plan dzia\u0142a. Punkty zbierasz ty.",
    "Robisz swoje, a {n} nie ma na to odpowiedzi.",
    "Spokojnie i konsekwentnie. S\u0119dziowie maj\u0105 co zapisywa\u0107 po twojej stronie.",
    "Trener w naro\u017Cniku tylko kiwa g\u0142ow\u0105. Tak ma by\u0107.",
    "{n} zaczyna si\u0119 frustrowa\u0107 i szuka\u0107 pomys\u0142u, kt\xF3rego nie ma."
  ],
  normalSuper: [
    "Wszystko idzie jak z nut. {n} wygl\u0105da, jakby chcia\u0142 ju\u017C do domu.",
    "Runda jak z podr\u0119cznika. {n} wraca do naro\u017Cnika ze spuszczon\u0105 g\u0142ow\u0105.",
    "Dominacja. Komentator m\xF3wi, \u017Ce \u201Eto jest lekcja MMA\u201D."
  ],
  normalFail: [
    "Nic nie wchodzi. Trener w naro\u017Cniku zaczyna liczy\u0107 na palcach, ile zosta\u0142o do gongu.",
    "{n} czyta to bez problemu. Trzeba szuka\u0107 czego\u015B innego.",
    "Nie klei si\u0119. {n} by\u0142 na to przygotowany.",
    "Trener w naro\u017Cniku \u0142apie si\u0119 za g\u0142ow\u0119. Plan nie dzia\u0142a.",
    "{n} odpowiada na ka\u017Cd\u0105 twoj\u0105 akcj\u0119. Punkty uciekaj\u0105."
  ],
  safeOk: [
    "Spokojnie, bez szale\u0144stw. Kto\u015B z trybun krzyczy \u201Enudy!\u201D, ale to nie on dostaje w twarz.",
    "Spokojnie, bez szale\u0144stw. Zbierasz punkty.",
    "Trzymasz dystans i nie dajesz mu niczego za darmo.",
    "Pracujesz na nogach, k\u0105sasz i odchodzisz. {n} bije powietrze.",
    "Nudno dla kibic\xF3w, skutecznie dla s\u0119dzi\xF3w."
  ],
  safeFail: [
    "Za ostro\u017Cnie. S\u0119dziowie widz\u0105, \u017Ce {n} jest aktywniejszy.",
    "Hala gwi\u017Cd\u017Ce na pasywno\u015B\u0107. Ta runda raczej dla niego.",
    "Czekasz na sw\xF3j moment, ale {n} zbiera punkty."
  ]
};
function applyDecision(rng, ctx, sim, rep, key) {
  const dp = sim.pending;
  if (!dp) return;
  const opt = dp.options.find((o) => o.key === key) ?? dp.options[0];
  sim.pending = null;
  if (dp.id === "plan" && (opt.stat === "stand" || opt.stat === "wrest" || opt.stat === "bjj")) sim.plan = opt.stat;
  if (!(dp.id === "plan" && sim.pro)) sim.decisionUsed = true;
  const out = rollOutcome(rng, opt.chance);
  const n = shortName(ctx.opp);
  const kind = opt.kind ?? KIND_OF[opt.key] ?? "normal";
  const say = (pool) => pickFresh(rng, rep, pool.map((t) => t.replace("{n}", n)));
  let text = "";
  let effect = "";
  let tone = out === "super" ? "purple" : out === "success" ? "good" : "bad";
  const finishTry = dp.id !== "plan" && kind === "risk" && out === "success" && rng.chance(0.28 + Math.min(0.35, sim.opp.dmg / 120));
  if ((out === "super" || finishTry) && kind === "risk" && dp.id !== "plan") {
    sim.round = Math.max(sim.round, dp.round);
    let method = "KO/TKO";
    let detail;
    if (opt.stat === "bjj") {
      const d = rng.pick(WIN_DETAILS.SUB);
      method = "Poddanie";
      detail = d.nom;
      text = `Zapinasz ${d.form} i ${n} od razu klepie.`;
    } else if (opt.stat === "wrest") {
      detail = "ciosy w parterze";
      text = `Obalasz go i zasypujesz ciosami z g\xF3ry. S\u0119dzia przerywa.`;
    } else {
      const d = rng.pick(WIN_DETAILS.KO);
      detail = d.nom;
      text = `Wchodzi idealnie. Trafiasz go ${d.form} i ${n} pada.`;
    }
    rep.moments.push({ round: dp.round, title: dp.title, text: `Wybierasz: ${opt.label.charAt(0).toLowerCase() + opt.label.slice(1)}. ${text}`, stat: opt.stat, chance: opt.chance, dist: opt.dist, outcome: out, effect: "koniec walki", tone: "purple", decision: true });
    finishFight(rep, sim, "me", method, detail);
    return;
  }
  if (kind === "risk") {
    if (out !== "fail") {
      sim.momentum += 12;
      sim.opp.dmg += 12;
      text = say(POOL.riskOk);
      effect = "du\u017Ca przewaga w tej rundzie";
    } else {
      sim.momentum -= 12;
      sim.me.dmg += rng.int(10, 16);
      sim.me.stam = clamp(sim.me.stam - 12, 0, 100);
      text = say(POOL.riskFail);
      effect = "obrywasz i tracisz rund\u0119";
    }
  } else if (kind === "normal" && opt.stat === "stand") {
    if (out === "super") {
      sim.momentum += 12;
      sim.opp.dmg += 16;
      text = say(POOL.normalSuper);
      effect = "rywal mocno obity";
    } else if (out === "success") {
      sim.momentum += 5;
      sim.opp.dmg += 10;
      text = say(POOL.normalOk);
      effect = "obijasz go, ma rozbity nos";
    } else {
      sim.momentum -= 5;
      sim.me.dmg += 8;
      text = say(POOL.normalFail);
      effect = "\u0142apiesz kontr\u0119";
    }
  } else if (kind === "normal" && (opt.stat === "wrest" || opt.stat === "cardio" || opt.stat === "iq")) {
    if (out === "super") {
      sim.momentum += 15;
      sim.opp.stam = clamp(sim.opp.stam - 16, 0, 100);
      text = say(POOL.normalSuper);
      effect = "s\u0119dziowie maj\u0105 co punktowa\u0107";
    } else if (out === "success") {
      sim.momentum += 9;
      sim.opp.stam = clamp(sim.opp.stam - 10, 0, 100);
      text = say(POOL.normalOk);
      effect = "punkty dla ciebie, rywal s\u0142abnie";
    } else {
      sim.momentum -= 3;
      sim.me.stam = clamp(sim.me.stam - 10, 0, 100);
      text = say(POOL.normalFail);
      effect = "tracisz si\u0142y na nieudanych pr\xF3bach";
    }
  } else if (kind === "normal") {
    if (out === "super") {
      sim.momentum += 14;
      sim.opp.dmg += 10;
      text = say(POOL.normalSuper);
      effect = "wyra\u017Ana przewaga";
    } else if (out === "success") {
      sim.momentum += 7;
      sim.opp.dmg += 3;
      text = say(POOL.normalOk);
      effect = "przewaga w tej rundzie";
    } else {
      sim.momentum -= 5;
      text = say(POOL.normalFail);
      effect = "runda pod g\xF3rk\u0119";
    }
  } else {
    const needRest = sim.me.dmg >= 20 || sim.me.stam < 60;
    if (out !== "fail" && !needRest) {
      sim.momentum += 2;
      text = say(POOL.safeOk);
      effect = "spokojna runda, ale bez przewagi";
    } else if (out !== "fail") {
      sim.momentum += 3;
      sim.me.stam = clamp(sim.me.stam + 18, 0, 100);
      sim.me.dmg = Math.max(0, sim.me.dmg - 8);
      text = say(POOL.safeOk);
      effect = "\u0142apiesz oddech i ma\u0142\u0105 przewag\u0119";
    } else {
      sim.momentum -= 3;
      sim.me.stam = clamp(sim.me.stam + 8, 0, 100);
      text = say(POOL.safeFail);
      effect = "oddajesz mu inicjatyw\u0119, ale odpoczywasz";
      tone = "neutral";
    }
  }
  if (opt.key === "cut_close" && out !== "fail") {
    sim.me.dmg = Math.max(0, sim.me.dmg - 8);
    effect = "rana zamkni\u0119ta, krew nie leci";
  }
  if (opt.key === "cut_rush" && out === "fail" && rng.chance(0.45)) {
    sim.round = Math.max(sim.round, dp.round);
    rep.moments.push({ round: dp.round, title: dp.title, text: `Wybierasz: ${opt.label.charAt(0).toLowerCase() + opt.label.slice(1)}. Rzucasz si\u0119 do przodu, ale ${n} trafia prosto w ran\u0119. S\u0119dzia wo\u0142a lekarza, a ten tylko kr\u0119ci g\u0142ow\u0105.`, stat: opt.stat, chance: opt.chance, dist: opt.dist, outcome: out, effect: "lekarz przerywa walk\u0119", tone: "bad", decision: true });
    finishFight(rep, sim, "opp", "Lekarz", "rozci\u0119cie");
    return;
  }
  rep.moments.push({ round: dp.round, title: dp.title, text: `Wybierasz: ${opt.label.charAt(0).toLowerCase() + opt.label.slice(1)}. ${text}`, stat: opt.stat, chance: opt.chance, dist: opt.dist, outcome: out, effect, tone, decision: true });
}
function advanceFight(rng, ctx, sim, rep) {
  while (!sim.finished && !sim.pending) {
    const bigTurn = !!sim.big && ctx.allowDecision && (sim.asked ?? -1) !== sim.round;
    const planTurn = !!sim.pro && ctx.allowDecision && sim.round === 0 && !sim.plan && (sim.asked ?? -1) !== 0;
    if (bigTurn || planTurn || ctx.allowDecision && !sim.decisionUsed && (sim.asked ?? -1) !== sim.round && !(sim.pro && sim.round === 0) && rng.chance(sim.round === 0 ? ctx.decisionChance * 0.45 : ctx.decisionChance * 0.4)) {
      if (sim.round < sim.maxRounds) {
        const dp = buildDecision(rng, ctx, sim);
        if (dp) {
          sim.pending = dp;
          sim.asked = sim.round;
          return;
        }
      }
    }
    if (sim.round >= sim.maxRounds) {
      decideOnCards(rep, sim);
      return;
    }
    simulateRound(rng, ctx, sim, rep);
  }
}

// src/engine/events_money.ts
var vary = (s, arr) => arr[(s.season * 5 + s.age) % arr.length];
function seasonIncome(s) {
  const floor = [2500, 9e3, 4e4, 12e4, 3e5][s.tier] ?? 2500;
  if (s.tier === 0) return floor;
  const c = s.contract;
  const purses = c.purse * c.fights + c.winBonus * Math.ceil(c.fights / 2);
  const sponsors = s.sponsors.reduce((a, b) => a + b.perSeason, 0);
  return Math.max(floor, purses + sponsors);
}
function cash(s, frac, min = 100, max = Infinity) {
  const raw = Math.min(max, Math.max(min, seasonIncome(s) * frac));
  const step = raw < 1e3 ? 50 : raw < 1e4 ? 100 : raw < 1e5 ? 500 : 1e3;
  return Math.round(raw / step) * step;
}
var inBanda = (s) => s.sponsors.some((x) => x.name === "Ground Game");
var zl5 = (n) => `${n.toLocaleString("pl-PL")} z\u0142`;
var MONEY_EVENTS = [
  {
    id: "skrzynia_passat",
    title: "Skrzynia bieg\xF3w",
    weight: 2,
    cond: (s) => s.age >= 19 && s.tier <= 2,
    text: (s) => vary(s, [
      `Znowu pad\u0142a skrzynia bieg\xF3w w passacie. Mechanik kr\u0119ci g\u0142ow\u0105: \u201E${zl5(cash(s, 0.09, 600, 9e3))} i b\u0119dzie jak nowa. Prawie.\u201D`,
      `W drodze na trening passat wydaje d\u017Awi\u0119k, kt\xF3rego nie powinien wydawa\u0107 \u017Caden samoch\xF3d. Diagnoza: skrzynia. Wycena: ${zl5(cash(s, 0.09, 600, 9e3))}.`
    ]),
    choices: (s) => [
      { label: "Naprawiasz u mechanika", desc: "Drogo, ale na gwarancji.", effects: { money: -cash(s, 0.09, 600, 9e3) } },
      {
        label: "Szwagier \u201Eogarnie\u201D",
        desc: "Taniej, w gara\u017Cu, przy grillu.",
        chance: 55,
        success: { money: -cash(s, 0.03, 200, 3e3), note: "je\u017Adzi, nie pytaj jak" },
        fail: { money: -cash(s, 0.12, 800, 12e3), note: "szwagier rozkr\u0119ci\u0142, nie skr\u0119ci\u0142" },
        successText: "Szwagier wymienia skrzyni\u0119 ze szrotu w jedno popo\u0142udnie. Je\u017Adzi. Nie pytasz jak.",
        failText: "Po tygodniu skrzynia ze szrotu si\u0119 sypie. Ko\u0144czy si\u0119 u mechanika i to jeszcze dro\u017Cej."
      },
      { label: "Je\u017Adzisz autobusem", desc: "Za darmo, ale godzina w jedn\u0105 stron\u0119.", effects: { form: -1, note: "MPK zamiast passata" } }
    ]
  },
  {
    id: "kumpel_z_maty_firma",
    title: "Kumpel z maty",
    weight: 4,
    cond: (s) => s.tier >= 1,
    text: (s) => vary(s, [
      `Kumpel, z kt\xF3rym kiedy\u015B rolowa\u0142e\u015B na ka\u017Cdym treningu, otworzy\u0142 firm\u0119 z oknami. Chce ci\u0119 wesprze\u0107 przed najbli\u017Csz\u0105 walk\u0105: ${zl5(cash(s, 0.08, 600, 25e3))} za logo na banerze.`,
      `Stary znajomy z maty prowadzi teraz warsztat. Dzwoni: \u201ES\u0142uchaj, mam ${zl5(cash(s, 0.08, 600, 25e3))}, wrzuc\u0119 ci\u0119 na naklejki i jedziemy\u201D.`
    ]),
    choices: (s) => [
      { label: "Bierzesz i dzi\u0119kujesz", desc: "Logo na banerze, zdj\u0119cie z ekip\u0105.", effects: { money: cash(s, 0.08, 600, 25e3), relations: 1 } },
      { label: "Bierzesz i robisz relacj\u0119", desc: "Filmik z warsztatu, oznaczasz firm\u0119.", effects: { money: cash(s, 0.08, 600, 25e3), media: 1 } },
      { label: "Odmawiasz", desc: "Kumpel dopiero zaczyna, niech si\u0119 rozkr\u0119ci.", effects: { rep: 1, relations: 2 } }
    ]
  },
  {
    id: "fotoradar",
    title: "List z fotoradaru",
    weight: 2,
    cond: (s) => s.age >= 19,
    text: (s) => `W skrzynce koperta: zdj\u0119cie twojego auta, 82 km/h w terenie zabudowanym, w drodze na sparing. Do zap\u0142aty ${zl5(cash(s, 0.02, 200, 1500))}.`,
    choices: (s) => [
      { label: "P\u0142acisz", desc: "Lekcja kosztuje.", effects: { money: -cash(s, 0.02, 200, 1500) } },
      { label: "Odwo\u0142ujesz si\u0119", desc: "Piszesz pismo, \u017Ce to nie ty prowadzi\u0142e\u015B.", chance: 30, success: { note: "umorzone" }, fail: { money: -cash(s, 0.03, 300, 2500), note: "z odsetkami" }, successText: "Sprawa umorzona. Nie pytaj, jak.", failText: "Odwo\u0142anie odrzucone. P\u0142acisz wi\u0119cej, z kosztami." }
    ]
  },
  {
    id: "zwrot_podatku",
    title: "Zwrot podatku",
    weight: 4,
    cond: (s) => s.tier >= 1,
    text: (s) => `Ksi\u0119gowa dzwoni z dobr\u0105 wiadomo\u015Bci\u0105: z rozliczenia wychodzi zwrot ${zl5(cash(s, 0.06, 400))}. Pierwszy raz w \u017Cyciu urz\u0105d co\u015B ci oddaje.`,
    choices: (s) => [
      { label: "Odk\u0142adasz", desc: "Na gorsze czasy.", effects: { money: cash(s, 0.06, 400) } },
      { label: "Nowy sprz\u0119t dla klubu", desc: "Worki dla dzieciak\xF3w z sekcji.", effects: { money: Math.round(cash(s, 0.06, 400) / 3), rep: 2, relations: 1 } }
    ]
  },
  {
    id: "korekta_pit",
    title: "Pismo z urz\u0119du",
    weight: 2,
    cond: (s) => s.tier >= 2,
    text: (s) => `Urz\u0105d skarbowy znalaz\u0142 b\u0142\u0105d w twoim zeznaniu sprzed dw\xF3ch lat. Dop\u0142ata z odsetkami: ${zl5(cash(s, 0.05, 1e3))}.`,
    choices: (s) => [
      { label: "P\u0142acisz od razu", desc: "\u015Awi\u0119ty spok\xF3j.", effects: { money: -cash(s, 0.05, 1e3) } },
      { label: "Bierzesz doradc\u0119", desc: "Kosztuje, ale mo\u017Ce co\u015B wywalczy.", chance: 50, success: { money: -cash(s, 0.02, 500), note: "cz\u0119\u015B\u0107 umorzona" }, fail: { money: -cash(s, 0.07, 1500), note: "doradca te\u017C chce zap\u0142aty" }, successText: "Doradca znajduje ulg\u0119, o kt\xF3rej nie mia\u0142e\u015B poj\u0119cia. P\u0142acisz mniej ni\u017C po\u0142ow\u0119.", failText: "Urz\u0105d si\u0119 nie ugina, a doradca wystawia faktur\u0119." }
    ]
  },
  {
    id: "zalane_mieszkanie",
    title: "S\u0105siad z g\xF3ry",
    weight: 2,
    cond: (s) => s.age >= 20,
    text: () => "Wracasz z treningu, a z sufitu w kuchni kapie. S\u0105siad z g\xF3ry zostawi\u0142 odkr\u0119con\u0105 pralk\u0119 i wyjecha\u0142 na Mazury.",
    choices: (s) => [
      { label: "Remontujesz sam", desc: "Szpachla, farba i weekend z g\u0142owy.", effects: { money: -cash(s, 0.03, 300, 2500), form: -1 } },
      { label: "Ubezpieczenie", desc: "Formularze, rzeczoznawca, czekanie.", chance: 60, success: { money: cash(s, 0.02, 200, 1500), note: "nawet co\u015B zosta\u0142o" }, fail: { money: -cash(s, 0.05, 500, 25e3), note: "nie obejmuje zalania z g\xF3ry" }, successText: "Ubezpieczyciel p\u0142aci wi\u0119cej, ni\u017C kosztowa\u0142 remont. Pierwszy raz w historii.", failText: "Okazuje si\u0119, \u017Ce polisa nie obejmuje zalania z g\xF3ry. P\u0142acisz sam, i to wi\u0119cej." }
    ]
  },
  {
    id: "seminarium",
    title: "Seminarium w klubie",
    weight: 4,
    cond: (s) => s.tier >= 1 && s.media >= 12,
    text: (s) => `Klub z twojego wojew\xF3dztwa zaprasza ci\u0119 na seminarium. Dwie godziny techniki i zdj\u0119cia z dzieciakami, ${zl5(cash(s, 0.07, 500, 35e3))} do r\u0119ki.`,
    choices: (s) => [
      { label: "Jedziesz", desc: "Pokazujesz swoje ulubione techniki.", effects: { money: cash(s, 0.07, 500, 35e3), rep: 1, stats: { iq: 1 } } },
      { label: "Odpuszczasz", desc: "Weekend na regeneracj\u0119.", effects: { wear: -2 } }
    ]
  },
  {
    id: "wesele_kuzyna",
    title: "Wesele kuzyna",
    weight: 2,
    cond: (s) => s.age >= 20,
    text: () => "Kuzyn si\u0119 \u017Ceni. Ciocia ju\u017C rozpowiada, \u017Ce \u201Eten od bijatyk\u201D na pewno da porz\u0105dn\u0105 kopert\u0119.",
    choices: (s) => [
      { label: "Gruba koperta", desc: "Rodzina pami\u0119ta takie rzeczy.", effects: { money: -cash(s, 0.04, 400, 15e3), relations: 3 } },
      { label: "Skromna koperta", desc: "Ciocia zrobi min\u0119.", effects: { money: -cash(s, 0.015, 150, 3e3), relations: -1 } },
      { label: "Nie jedziesz, ob\xF3z", desc: "Wysy\u0142asz \u017Cyczenia na Mesend\u017Cerze.", effects: { relations: -3, form: 1 } }
    ]
  },
  {
    id: "zbiorka_kibicow",
    title: "Zrzutka kibic\xF3w",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.media >= 30,
    text: (s) => `Kibice z twojego miasta za\u0142o\u017Cyli zrzutk\u0119 \u201Ena ob\xF3z dla naszego ch\u0142opaka\u201D. Zebrali ${zl5(cash(s, 0.08, 800, 5e4))}.`,
    choices: (s) => [
      { label: "Przyjmujesz", desc: "Dzi\u0119kujesz w filmiku i obiecujesz walk\u0119 na ca\u0142ego.", effects: { money: cash(s, 0.08, 800, 5e4), media: 2, form: 1 } },
      { label: "Przekazujesz na sekcj\u0119 dzieci", desc: "Niech m\u0142odzi maj\u0105 r\u0119kawice.", effects: { rep: 4, media: 3, relations: 1 } }
    ]
  },
  {
    id: "kradziez_torby",
    title: "Skradziona torba",
    weight: 2,
    cond: (s) => !inBanda(s),
    text: () => "Kto\u015B wyni\xF3s\u0142 z szatni twoj\u0105 torb\u0119. R\u0119kawice, ochraniacze, rashguard i s\u0142uchawki. Kamera na korytarzu \u201Eakurat nie dzia\u0142a\u0142a\u201D.",
    choices: (s) => [
      { label: "Kupujesz wszystko nowe", desc: "Przynajmniej pachnie nowo\u015Bci\u0105.", effects: { money: -cash(s, 0.03, 250, 4e3), form: 1 } },
      { label: "Po\u017Cyczasz od klubowicz\xF3w", desc: "Za du\u017Ce r\u0119kawice, za ciasny rashguard.", effects: { money: -cash(s, 8e-3, 50, 500), form: -1, relations: 1 } }
    ]
  },
  // ---------- Sprzęt: bez sponsora płacisz, w Ground Game Bandzie sponsor pokrywa ----------
  {
    id: "pies_rekawice",
    title: "Pies i r\u0119kawice",
    weight: 2,
    cond: (s) => s.age >= 19 && !inBanda(s),
    text: () => "Zostawi\u0142e\u015B torb\u0119 w przedpokoju. Pies uzna\u0142, \u017Ce r\u0119kawice sparingowe pachn\u0105 najlepiej w ca\u0142ym mieszkaniu. Zosta\u0142y z nich strz\u0119py i zadowolony pies.",
    choices: (s) => [
      { label: "Kupujesz nowe", desc: "Dobre r\u0119kawice to dobre r\u0119ce.", effects: { money: -cash(s, 0.02, 350, 1500) } },
      { label: "Sklejasz ta\u015Bm\u0105", desc: "Jako\u015B to b\u0119dzie.", effects: { form: -1, note: "ta\u015Bma odkleja si\u0119 na trzecim sparingu" } }
    ]
  },
  {
    id: "pies_rekawice_gg",
    title: "Pies i r\u0119kawice",
    brand: "banda",
    weight: 3,
    cond: (s) => s.age >= 19 && inBanda(s),
    text: () => "Pies pogryz\u0142 ci r\u0119kawice sparingowe na strz\u0119py. Na szcz\u0119\u015Bcie jeste\u015B w Ground Game Bandzie: piszesz do sponsora i nowe s\u0105 u ciebie po dw\xF3ch dniach. Za darmo.",
    choices: () => [
      { label: "Wrzucasz unboxing", desc: "Pies w roli g\u0142\xF3wnej, oznaczasz Ground Game.", effects: { media: 2, form: 1, note: "nowe r\u0119kawice od sponsora" } },
      { label: "Po prostu dzi\u0119kujesz", desc: "Kr\xF3tka wiadomo\u015B\u0107 i na trening.", effects: { form: 1, note: "nowe r\u0119kawice od sponsora" } }
    ]
  },
  {
    id: "kradziez_torby_gg",
    title: "Skradziona torba",
    brand: "banda",
    weight: 2,
    cond: (s) => inBanda(s),
    text: () => "Kto\u015B wyni\xF3s\u0142 z szatni twoj\u0105 torb\u0119 ze sprz\u0119tem. Dzwonisz do Ground Game. P\xF3\u0142 godziny p\xF3\u017Aniej masz potwierdzenie: nowy rashguard, spodenki i r\u0119kawice jad\u0105 do ciebie kurierem.",
    choices: () => [
      { label: "Trenujesz w nowym", desc: "Pachnie nowo\u015Bci\u0105, le\u017Cy jak ula\u0142.", effects: { form: 1, note: "sponsor pokry\u0142 ca\u0142y sprz\u0119t" } }
    ]
  },
  {
    id: "rashguard_rozdarty",
    title: "Rozdarty rashguard",
    weight: 2,
    cond: (s) => s.tier >= 1,
    text: (s) => inBanda(s) ? "Na ostatnim sparingu rozdar\u0142e\u015B rashguard od szyi do pasa. Ground Game wysy\u0142a nowy komplet przed obozem, z twoim nazwiskiem na r\u0119kawie." : "Na ostatnim sparingu rozdar\u0142e\u015B rashguard od szyi do pasa. Drugi, ten na wag\u0119, te\u017C ju\u017C pami\u0119ta lepsze czasy.",
    choices: (s) => inBanda(s) ? [{ label: "Odbierasz paczk\u0119", desc: "Komplet na walk\u0119 od sponsora.", effects: { form: 1, media: 1, note: "sprz\u0119t od Ground Game" } }] : [
      { label: "Kupujesz nowy komplet", desc: "Rashguard i spodenki na walk\u0119.", effects: { money: -cash(s, 0.015, 300, 1200) } },
      { label: "Walczysz w starym", desc: "Zszyty przez mam\u0119.", effects: { form: -1, relations: 1 } }
    ]
  },
  {
    id: "pizzeria_reklama",
    title: "Pizzeria spod bloku",
    weight: 4,
    cond: (s) => s.tier >= 1 && s.tier <= 2,
    text: (s) => `W\u0142a\u015Bciciel pizzerii spod bloku chce ci\u0119 na plakacie: \u201EPizza Mistrza\u201D z podw\xF3jnym salami. P\u0142aci ${zl5(cash(s, 0.04, 400, 15e3))} i do\u017Cywotni\u0105 darmow\u0105 pizz\u0119.`,
    choices: (s) => [
      { label: "Robisz zdj\u0119cie z pizz\u0105", desc: "Z min\u0105 zwyci\u0119zcy.", effects: { money: cash(s, 0.04, 400, 15e3), media: 1, rep: -1, form: -1 } },
      { label: "Tylko kasa, bez pizzy", desc: "Dieta przed walk\u0105.", effects: { money: cash(s, 0.04, 400, 15e3), rep: -1 } },
      { label: "Odmawiasz", desc: "Dietetyk by ci\u0119 zabi\u0142.", effects: { form: 1 } }
    ]
  },
  {
    id: "stypendium_miasta",
    title: "Stypendium sportowe",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.tier <= 3 && s.rep >= 20,
    text: (s) => `Rada miasta przyznaje ci stypendium sportowe: ${zl5(cash(s, 0.09, 1500, 25e3))}. Trzeba tylko przyj\u015B\u0107 na sesj\u0119 i potrzyma\u0107 czek.`,
    choices: (s) => [
      { label: "Idziesz na sesj\u0119", desc: "Garnitur, u\u015Bmiech, zdj\u0119cie z burmistrzem.", effects: { money: cash(s, 0.09, 1500, 25e3), rep: 2 } },
      { label: "Wysy\u0142asz trenera", desc: "Ty masz trening.", effects: { money: cash(s, 0.09, 1500, 25e3), relations: -1 } }
    ]
  },
  {
    id: "odszkodowanie",
    title: "St\u0142uczka na parkingu",
    weight: 4,
    cond: (s) => s.age >= 19,
    text: () => "Kto\u015B przytar\u0142 ci auto na parkingu pod hal\u0105. Zostawi\u0142 kartk\u0119 z numerem i przeprosinami. Uczciwo\u015B\u0107 jeszcze istnieje.",
    choices: (s) => [
      { label: "Bierzesz odszkodowanie", desc: "Z jego OC.", effects: { money: cash(s, 0.03, 400, 6e3), note: "rysa zostaje" } },
      { label: "Machasz r\u0119k\u0105", desc: "To tylko rysa, a go\u015B\u0107 by\u0142 mi\u0142y.", effects: { rep: 1, relations: 1 } }
    ]
  },
  {
    id: "zus_dzialalnosc",
    title: "ZUS",
    weight: 2,
    cond: (s) => s.tier >= 1,
    text: (s) => `Pierwszy raz widzisz na koncie, ile kosztuje ZUS za dzia\u0142alno\u015B\u0107. Ksi\u0119gowa m\xF3wi, \u017Ce ${zl5(cash(s, 0.03, 400, 6e3))} zaleg\u0142o\u015Bci trzeba wp\u0142aci\u0107 do ko\u0144ca miesi\u0105ca.`,
    choices: (s) => [
      { label: "P\u0142acisz", desc: "Z ci\u0119\u017Ckim sercem.", effects: { money: -cash(s, 0.03, 400, 6e3) } },
      { label: "Negocjujesz z ZUS-em", desc: "Pismo o roz\u0142o\u017Cenie i umorzenie odsetek.", chance: 50, success: { money: -Math.round(cash(s, 0.03, 400, 6e3) * 0.7 / 10) * 10, note: "umorzone odsetki" }, fail: { money: -Math.round(cash(s, 0.03, 400, 6e3) * 1.2 / 10) * 10, note: "odsetki za zw\u0142ok\u0119" }, successText: "ZUS umarza odsetki. P\u0142acisz mniej, ni\u017C si\u0119 ba\u0142e\u015B.", failText: "Odmowa, a w mi\u0119dzyczasie naliczy\u0142y si\u0119 odsetki za zw\u0142ok\u0119." }
    ]
  }
];

// src/engine/events_extra.ts
var vary2 = (s, arr) => arr[(s.season * 7 + s.age * 3) % arr.length];
var rivalOf = (s) => s.peers.find((p) => p.id === s.rivalId && !p.retired);
var rivalHere = (s) => {
  const r = rivalOf(s);
  return !!r && r.tier === s.tier && s.tier > 0;
};
var rn = (s) => {
  const r = rivalOf(s);
  return r ? `${r.firstName} ${r.lastName}` : "tw\xF3j rywal";
};
var EXTRA_EVENTS = [
  // ---------- Amatorka ----------
  {
    id: "kask_pozyczony",
    title: "Po\u017Cyczony kask",
    once: true,
    weight: 4,
    cond: (s) => s.tier === 0,
    text: () => "Dzie\u0144 przed turniejem p\u0119ka ci kask. Kolega z klubu po\u017Cycza sw\xF3j. Pachnie jak szatnia po trzech latach, ale innego nie ma.",
    choices: () => [
      { label: "Bierzesz po\u017Cyczony", desc: "Byle chroni\u0142.", effects: { form: -1, note: "zapach zostaje na d\u0142ugo" } },
      { label: "Kupujesz nowy", desc: "Sklep sportowy otwiera si\u0119 o dziewi\u0105tej.", effects: { money: -350, form: 1 } }
    ]
  },
  {
    id: "wf_zwolnienie",
    title: "Zwolnienie z WF-u",
    once: true,
    weight: 4,
    cond: (s) => s.tier === 0 && s.age <= 18,
    text: () => "Wuefista nie wierzy, \u017Ce trenujesz MMA. Ka\u017Ce ci gra\u0107 w siatk\xF3wk\u0119 z reszt\u0105 klasy, \u201Ebo zasady s\u0105 dla wszystkich\u201D.",
    choices: () => [
      { label: "Grasz w siatk\u0119", desc: "Atakujesz pi\u0142k\u0119 jak rywala.", effects: { stats: { cardio: 1 }, relations: 1 } },
      { label: "Pokazujesz medal", desc: "Wuefista robi zdj\u0119cie i wrzuca na stron\u0119 szko\u0142y.", effects: { media: 2, rep: 1 } }
    ]
  },
  {
    id: "bus_na_turniej",
    title: "Bus na turniej",
    weight: 4,
    cond: (s) => s.tier === 0 && !!s.quick,
    // w pełnej karierze dojazd ustalasz w wiadomości od trenera przed turniejem
    text: (s) => vary2(s, [
      "Klubowy bus na turniej to stary ducato trenera. Siedem godzin w jedn\u0105 stron\u0119, ogrzewanie dzia\u0142a tylko na pe\u0142nej mocy.",
      "Bus klubowy znowu nie odpala. Trener m\xF3wi \u201Espokojnie, popchniemy\u201D. Popychacie go ca\u0142\u0105 dru\u017Cyn\u0105.",
      "Na turniej jedziecie w dziewi\u0119ciu w busie na osiem os\xF3b. Ty siedzisz na skrzynce z r\u0119kawicami."
    ]),
    choices: () => [
      { label: "Jedziesz z ekip\u0105", desc: "\u015Apiewy, kanapki z jajkiem i drzemka na torbie.", effects: { relations: 1, form: -1, rep: 1 } },
      { label: "Jedziesz poci\u0105giem", desc: "Wygodniej, ale za swoje.", effects: { money: -300, form: 1 } }
    ]
  },
  {
    id: "sedzia_kolega",
    title: "S\u0119dzia z s\u0105siedniego klubu",
    once: true,
    weight: 3,
    cond: (s) => s.tier === 0 && s.amRecord.w + s.amRecord.l >= 2,
    text: () => "Na turnieju okazuje si\u0119, \u017Ce twoj\u0105 walk\u0119 b\u0119dzie s\u0119dziowa\u0142 trener klubu twojego rywala. Organizator twierdzi, \u017Ce \u201Enie ma innego\u201D.",
    choices: () => [
      { label: "Sk\u0142adasz protest", desc: "Grzecznie, na pi\u015Bmie.", chance: 50, success: { form: 2, note: "zmieniaj\u0105 s\u0119dziego" }, fail: { rep: -1, form: -1, note: "protest odrzucony" }, successText: "Organizator \u015Bci\u0105ga s\u0119dziego z innej maty. Sprawiedliwo\u015Bci sta\u0142o si\u0119 zado\u015B\u0107.", failText: "Protest l\u0105duje w koszu, a s\u0119dzia patrzy na ciebie spode \u0142ba przez ca\u0142y turniej." },
      { label: "Ko\u0144czysz przed czasem", desc: "Jak nie b\u0119dzie decyzji, nie b\u0119dzie problemu.", effects: { form: 1, note: "motywacja na plus" } }
    ]
  },
  {
    id: "pierwszy_wywiad",
    title: "Pierwszy wywiad",
    once: true,
    weight: 4,
    cond: (s) => s.amRecord.w >= 3 && s.tier <= 1,
    text: () => "Lokalny portal chce zrobi\u0107 z tob\u0105 wywiad. Redaktor ma 19 lat, nagrywa telefonem i pyta, czy \u201EMMA to nie jest bicie si\u0119 na ulicy\u201D.",
    choices: () => [
      { label: "Spokojnie t\u0142umaczysz", desc: "Sport, zasady, s\u0119dziowie, badania.", effects: { rep: 2, media: 1 } },
      { label: "Rzucasz wyzwanie mistrzowi kraju", desc: "Klikalno\u015B\u0107 gwarantowana.", effects: { media: 4, rep: -2, note: "nag\u0142\xF3wek: \u201EM\u0142ody wilk chce pasa!\u201D" } }
    ]
  },
  // ---------- Gale regionalne ----------
  {
    id: "walkout_disco",
    title: "Muzyka na wej\u015Bcie",
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 1,
    text: () => "Organizator gali pyta o utw\xF3r na wej\u015Bcie. Kumple z osiedla namawiaj\u0105 na disco polo. Trener woli co\u015B \u201Egro\u017Anego\u201D.",
    choices: () => [
      { label: "Disco polo", desc: "Hala \u015Bpiewa razem z tob\u0105.", effects: { media: 4, rep: -1, note: "hala zna refren" } },
      { label: "Ci\u0119\u017Cki metal", desc: "Klasyka gatunku.", effects: { form: 1 } },
      { label: "Hymn klubu", desc: "Trener wzruszony.", effects: { rep: 1, relations: 1 } }
    ]
  },
  {
    id: "face_off_pchniecie",
    title: "Face to face",
    weight: 4,
    cond: (s) => s.tier >= 1,
    text: (s) => vary2(s, [
      "Face to face przed gal\u0105. Rywal podchodzi tak blisko, \u017Ce czujesz jego gum\u0119 mi\u0119tow\u0105.",
      "Na face to face rywal zak\u0142ada okulary przeciws\u0142oneczne, cho\u0107 jeste\u015Bcie w hali bez okien.",
      "Rywal na face to face nic nie m\xF3wi, tylko powoli kiwa g\u0142ow\u0105. Fotografowie szalej\u0105."
    ]),
    choices: () => [
      { label: "Stoisz spokojnie", desc: "Patrzysz przez niego jak przez szyb\u0119.", effects: { rep: 1, form: 1 } },
      { label: "Pchasz go", desc: "Ochrona rozdziela, kamery kr\u0119c\u0105.", effects: { media: 3, rep: -2, note: "kara od organizatora", money: -500 } }
    ]
  },
  {
    id: "masarnia_sponsor",
    title: "Masarnia chce logo",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.tier <= 2,
    text: () => "Lokalna masarnia chce sponsorowa\u0107 twoj\u0105 walk\u0119. Warunek: po wygranej wznosisz do kamery p\u0119to kie\u0142basy jak pas mistrzowski.",
    choices: () => [
      { label: "Wznosisz kie\u0142bas\u0119", desc: "Godno\u015B\u0107 to rzecz wzgl\u0119dna.", effects: { sponsor: { name: "Masarnia u Grzesia", perSeason: 3500, seasonsLeft: 2, clause: "p\u0119to kie\u0142basy w g\xF3r\u0119 po wygranej" }, media: 2 } },
      { label: "Odmawiasz", desc: "Jeste\u015B sportowcem, nie reklam\u0105.", effects: { rep: 1 } }
    ]
  },
  {
    id: "zbijanie_sauna",
    title: "Zbijanie wagi",
    weight: 5,
    cond: (s) => s.tier >= 1 && (s.division ?? s.profile.weight) !== "ciezka",
    text: (s) => vary2(s, [
      "Dzie\u0144 przed wa\u017Ceniem brakuje ci dw\xF3ch kilo. Trener przynosi worki na \u015Bmieci i w\u0142\u0105cza saun\u0119 na maksa.",
      "Waga pokazuje 1,8 kg za du\u017Co. Kolega z klubu proponuje \u201Esprawdzony spos\xF3b\u201D: wanna z gor\u0105c\u0105 wod\u0105 i s\xF3l Epsom.",
      "Do wa\u017Cenia zosta\u0142o 12 godzin, a ty dalej jeste\u015B ponad limitem. Dietetyk nie odbiera telefonu."
    ]),
    choices: (s) => [
      { label: "Zbijasz do ko\u0144ca", desc: "Wa\u017Cysz si\u0119 na styk, potem nawadniasz.", chance: 65, success: { form: 1, note: "waga zrobiona" }, fail: { form: -4, wear: 2, note: "zbijanie ci\u0119 wypompowa\u0142o" }, successText: "R\xF3wno na limicie. Po wa\u017Ceniu pijesz trzy litry wody i czujesz si\u0119 jak nowy.", failText: "Wchodzisz na wag\u0119 na styk, ale wieczorem ledwo stoisz. Organizm pami\u0119ta takie rzeczy." },
      { label: "P\u0142acisz kar\u0119 za wag\u0119", desc: "Cz\u0119\u015B\u0107 ga\u017Cy idzie do rywala.", effects: { money: -Math.max(1e3, Math.round(s.contract.purse * 0.2 / 100) * 100), rep: -1, form: 1 } }
    ]
  },
  {
    id: "trener_youtube",
    title: "Kr\u0119cio\u0142ek z JuTub",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.tier <= 2,
    text: () => "Trener obejrza\u0142 kompilacj\u0119 najlepszych nokaut\xF3w z obrotowego kopni\u0119cia i chce, \u017Ceby\u015B przez ca\u0142y ob\xF3z \u0107wiczy\u0142 \u201Ekr\u0119cio\u0142ka\u201D.",
    choices: () => [
      { label: "\u0106wiczysz kr\u0119cio\u0142ka", desc: "Albo spektakularny nokaut, albo spektakularny upadek.", test: "stand", success: { stats: { stand: 2 }, media: 2, note: "kr\u0119cio\u0142ek wchodzi na treningach" }, fail: { wear: 2, form: -1, note: "naci\u0105gni\u0119ta pachwina" }, successText: "Po trzech tygodniach kr\u0119cio\u0142ek wchodzi na tarcz\u0119 z takim hukiem, \u017Ce ludzie wychodz\u0105 z szatni popatrze\u0107.", failText: "Przy setnej pr\xF3bie co\u015B strzela w pachwinie. Trener m\xF3wi, \u017Ce \u201Etak te\u017C ucz\u0105 si\u0119 mistrzowie\u201D." },
      { label: "Zostajecie przy podstawach", desc: "Prosty, prawy, obalenie.", effects: { stats: { iq: 1 } } }
    ]
  },
  {
    id: "osir_gala",
    title: "Gala w OSiR-ze",
    weight: 3,
    cond: (s) => s.tier === 1,
    text: (s) => vary2(s, [
      "Gala w hali OSiR. Szatnia to sala do przyrody, a tw\xF3j naro\u017Cnik dzieli \u0142awk\u0119 z ko\u0142em gospody\u0144 wiejskich, kt\xF3re robi\u0105 catering.",
      "Na gali w OSiR-ze klatka stoi na boisku do kosza. W przerwie mi\u0119dzy walkami gra szkolna orkiestra d\u0119ta."
    ]),
    choices: () => [
      { label: "Jesz pierogi od KGW", desc: "Grzech odm\xF3wi\u0107.", effects: { relations: 1, form: -1, note: "pierogi z kapust\u0105" } },
      { label: "Zostajesz przy ry\u017Cu z kurczakiem", desc: "Dieta to dieta.", effects: { form: 1 } }
    ]
  },
  {
    id: "sasiad_bilety",
    title: "Bilety dla rodziny",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.tier <= 2,
    text: () => "Ca\u0142a rodzina chce przyj\u015B\u0107 na gal\u0119. Organizator daje dwa darmowe bilety. Na li\u015Bcie ch\u0119tnych jest czterna\u015Bcie os\xF3b, w tym ciocia z Kanady.",
    choices: () => [
      { label: "Kupujesz bilety wszystkim", desc: "Rodzina na trybunach to rodzina na trybunach.", effects: { money: -1800, relations: 3, form: 1 } },
      { label: "Dwa bilety dla rodzic\xF3w", desc: "Reszta obejrzy transmisj\u0119.", effects: { relations: -1 } }
    ]
  },
  // ---------- Krajówka ----------
  {
    id: "kto_to_jest",
    title: "\u201EA to kto?\u201D",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 2,
    text: () => "Na konferencji gwiazda gali patrzy na ciebie i pyta do mikrofonu: \u201EA to kto w og\xF3le jest?\u201D. Sala wybucha \u015Bmiechem.",
    choices: () => [
      { label: "Odpowiadasz ripost\u0105", desc: "Albo przejdzie do historii, albo zrobi si\u0119 niezr\u0119cznie.", test: "iq", success: { media: 6, rep: 2, note: "riposta dnia" }, fail: { media: 2, rep: -2, note: "zrobi\u0142o si\u0119 niezr\u0119cznie" }, successText: "\u201ETen, z kim b\u0119dziesz walczy\u0142 za rok\u201D \u2014 sala klaszcze, a gwiazda pierwszy raz od dawna nie wie, co powiedzie\u0107.", failText: "M\xF3wisz co\u015B o tym, \u017Ce \u201Ejeszcze zobaczymy\u201D. Nikt nie s\u0142yszy, bo mikrofon by\u0142 wy\u0142\u0105czony." },
      { label: "U\u015Bmiechasz si\u0119 i milczysz", desc: "Odpowiesz w klatce.", effects: { rep: 1, form: 1 } }
    ]
  },
  {
    id: "kanal_youtube",
    title: "Kana\u0142 na JuTub",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 2 && s.media >= 15,
    text: () => "Kolega monta\u017Cysta namawia ci\u0119 na w\u0142asny kana\u0142: vlogi z obozu, \u201Edzie\u0144 z \u017Cycia zawodnika\u201D, unboxing r\u0119kawic.",
    choices: (s) => [
      { label: "Zak\u0142adasz kana\u0142", desc: "Kamera wsz\u0119dzie, nawet w saunie.", effects: { media: 5, form: -1, money: cash(s, 0.02, 1500), note: "pierwszy film: 40 tys. wy\u015Bwietle\u0144" } },
      { label: "Nie masz na to g\u0142owy", desc: "Trenujesz, nie nagrywasz.", effects: { form: 1 } }
    ]
  },
  {
    id: "pasztet_rywal",
    title: "Trash talk w internecie",
    weight: 4,
    cond: (s) => s.tier >= 2,
    text: (s) => vary2(s, [
      "Tw\xF3j najbli\u017Cszy rywal napisa\u0142 o tobie wierszyk. Rymuje \u201EPolska\u201D z \u201Eniedoros\u0142a\u201D. Internet ma u\u017Cywanie.",
      "Rywal wrzuci\u0142 film, na kt\xF3rym ok\u0142ada manekina w koszulce z twoim nazwiskiem.",
      "Rywal twierdzi w podca\u015Bcie, \u017Ce \u201Ewidzia\u0142 ci\u0119 na sparingach i nic nie pokaza\u0142e\u015B\u201D. Nigdy z nim nie sparowa\u0142e\u015B."
    ]),
    choices: () => [
      { label: "Odpisujesz", desc: "Nikt nie b\u0119dzie si\u0119 z ciebie \u015Bmia\u0142.", effects: { media: 3, rep: -1 } },
      { label: "Ignorujesz", desc: "Klatka zweryfikuje.", effects: { form: 1 } }
    ]
  },
  {
    id: "stadion_wejscie",
    title: "Wej\u015Bcie z fajerwerkami",
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 2 && s.media >= 25,
    text: () => "Organizator proponuje ci wej\u015Bcie z pirotechnik\u0105, ogniem i ch\xF3rem gregoria\u0144skim. Za dop\u0142at\u0105 z twojej ga\u017Cy.",
    choices: (s) => [
      { label: "Ogie\u0144 i ch\xF3r", desc: "Raz si\u0119 \u017Cyje.", effects: { money: -cash(s, 0.02, 3e3), media: 5, note: "wej\u015Bcie roku" } },
      { label: "Wchodzisz po cichu", desc: "Kaptur na g\u0142ow\u0119 i do klatki.", effects: { rep: 1 } }
    ]
  },
  {
    id: "reklama_tv",
    title: "Reklama telewizyjna",
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 2 && s.media >= 30,
    text: () => "Sie\u0107 sklep\xF3w z elektronarz\u0119dziami chce ci\u0119 do reklamy. Scenariusz: wiercisz dziur\u0119 w \u015Bcianie jednym ciosem.",
    choices: (s) => [
      { label: "Kr\u0119cisz reklam\u0119", desc: "Trzy dni na planie, osiem dubli z wiertark\u0105.", effects: { money: cash(s, 0.08, 12e3), media: 4, form: -1 } },
      { label: "Odmawiasz", desc: "Nie jeste\u015B aktorem.", effects: { rep: 1 } }
    ]
  },
  {
    id: "mlody_hype",
    title: "Nowy cudowny dzieciak",
    weight: 3,
    cond: (s) => s.tier >= 2 && s.age >= 26,
    text: () => "Media zachwycaj\u0105 si\u0119 20-latkiem z twojej kategorii, \u201Eprzysz\u0142ym mistrzem \u015Bwiata\u201D. Na jego profilu twoje zdj\u0119cie z podpisem \u201Enast\u0119pny\u201D.",
    choices: () => [
      { label: "Wo\u0142asz go do walki", desc: "Poka\u017Cesz mu, gdzie jego miejsce.", effects: { media: 4, form: 1, note: "promocja si\u0119 cieszy" } },
      { label: "Nie dajesz mu rozg\u0142osu", desc: "Niech najpierw co\u015B wygra.", effects: { rep: 1 } }
    ]
  },
  {
    id: "sponsor_krypto",
    title: "Sponsor p\u0142aci tokenami",
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 2,
    text: () => "Start-up kryptowalutowy \u201EPunchCoin\u201D chce ci\u0119 sponsorowa\u0107. P\u0142aci wy\u0142\u0105cznie w swoich tokenach. Prezes ma 22 lata i jacht na zdj\u0119ciu profilowym.",
    choices: (s) => [
      { label: "Bierzesz tokeny", desc: "Mo\u017Ce to przysz\u0142o\u015B\u0107 finans\xF3w.", chance: 30, success: { money: cash(s, 0.1, 2e4), note: "tokeny wystrzeli\u0142y" }, fail: { media: -1, note: "tokeny warte tyle, co nic" }, successText: "Po p\xF3\u0142 roku tokeny s\u0105 warte dziesi\u0119\u0107 razy wi\u0119cej. Sprzedajesz wszystko w dniu, w kt\xF3rym prezes zamyka konta.", failText: "Tydzie\u0144 po podpisaniu umowy strona PunchCoin znika. Na pami\u0105tk\u0119 zostaje ci naszywka na spodenkach." },
      { label: "Prosisz o z\u0142ot\xF3wki", desc: "Prezes si\u0119 obra\u017Ca.", effects: { rep: 1 } }
    ]
  },
  {
    id: "kibic_dziecko",
    title: "Kibic z dzieckiem",
    weight: 3,
    cond: (s) => s.tier >= 2 && s.media >= 20,
    text: (s) => vary2(s, [
      "Kibic na lotnisku prosi, \u017Ceby\u015B potrzyma\u0142 jego syna do zdj\u0119cia. Syn p\u0142acze, kibic jest zachwycony.",
      "Pod hal\u0105 czeka dziewi\u0119ciolatek z twoim plakatem i kartk\u0105: \u201EJak dorosn\u0119, b\u0119d\u0119 jak ty\u201D."
    ]),
    choices: () => [
      { label: "Masz czas dla kibic\xF3w", desc: "Zdj\u0119cia, autografy, u\u015Bmiech.", effects: { media: 2, rep: 2, relations: 1 } },
      { label: "Spieszysz si\u0119 na trening", desc: "Nast\u0119pnym razem.", effects: { form: 1, media: -1 } }
    ]
  },
  // ---------- Europa i świat ----------
  {
    id: "papa_dagestan",
    title: "Ob\xF3z w g\xF3rach",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 3,
    text: () => "Znajomy za\u0142atwia ci ob\xF3z w g\xF3rach Dagestanu. Starszy trener na powitanie ka\u017Ce ci nie\u015B\u0107 go na barana pod g\xF3r\u0119. M\xF3wi, \u017Ce to rozgrzewka.",
    choices: () => [
      { label: "Niesiesz", desc: "Dwa kilometry pod g\xF3r\u0119 z trenerem na plecach.", test: "cardio", success: { stats: { wrest: 3, cardio: 2 }, rep: 2, note: "trener m\xF3wi \u201Edobrze\u201D" }, fail: { stats: { wrest: 1 }, wear: 3, note: "trener m\xF3wi \u201Es\u0142abo\u201D" }, successText: "Na szczycie trener klepie ci\u0119 w policzek i m\xF3wi jedno s\u0142owo: \u201Edobrze\u201D. W Dagestanie to prawie jak medal.", failText: "Po kilometrze trener zsiada i idzie dalej sam. Ty jeszcze godzin\u0119 \u0142apiesz oddech." },
      { label: "Zostajesz w Polsce", desc: "W g\xF3rach nie ma zasi\u0119gu.", effects: {} }
    ]
  },
  {
    id: "las_vegas",
    title: "Tydzie\u0144 walk w Vegas",
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 3,
    text: () => "Federacja zaprasza ci\u0119 na tydzie\u0144 mi\u0119dzynarodowych walk w Las Vegas, \u017Ceby\u015B pokaza\u0142 si\u0119 mediom. Kasyno jest na parterze hotelu.",
    choices: (s) => [
      { label: "Tylko media i si\u0142ownia", desc: "Wywiady, zdj\u0119cia, trening.", effects: { media: 4, rep: 1 } },
      { label: "Jedna partyjka ruletki", desc: "Na czerwone.", chance: 47, success: { money: cash(s, 0.04, 6e3), media: 3, note: "wypad\u0142o czerwone" }, fail: { money: -cash(s, 0.04, 6e3), note: "wypad\u0142o zero" }, successText: "Czerwone. Krupier gratuluje, a federacyjny fotograf ma zdj\u0119cie dnia.", failText: "Zero. Krupier wzrusza ramionami. Wracasz do pokoju i robisz sto pompek ze z\u0142o\u015Bci." }
    ]
  },
  {
    id: "tlumacz",
    title: "T\u0142umacz na konferencji",
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 3,
    text: () => "Na konferencji w Londynie t\u0142umacz przek\u0142ada twoje \u201Eb\u0119dzie ci\u0119\u017Cko, ale damy rad\u0119\u201D jako \u201EI will destroy him in the first round\u201D.",
    choices: () => [
      { label: "Idziesz w to", desc: "Skoro ju\u017C tak powiedzia\u0142e\u015B.", effects: { media: 5, rep: -1, form: 1, note: "nag\u0142\xF3wki po angielsku" } },
      { label: "Prostujesz po angielsku", desc: "\u201ENo, no. Hard fight. Respect.\u201D", effects: { rep: 2 } }
    ]
  },
  {
    id: "walka_zastepstwo_ko",
    title: "Telefon w \u015Brodku nocy",
    weight: 3,
    cond: (s) => s.tier >= 3,
    text: () => "Druga w nocy, dzwoni matchmaker federacji: rywal z main eventu wypad\u0142, organizator pyta, czy wejdziesz za niego na wy\u017Cszej wadze za dziesi\u0119\u0107 dni.",
    choices: (s) => [
      { label: "Wchodzisz", desc: "Takie szanse si\u0119 nie powtarzaj\u0105.", chance: 55, success: { money: cash(s, 0.12, 25e3), media: 6, rep: 2, note: "bohater wieczoru" }, fail: { money: cash(s, 0.05, 1e4), wear: 4, form: -2, note: "za ci\u0119\u017Cki rywal" }, successText: "Wchodzisz na dziesi\u0119\u0107 dni przed gal\u0105 i robisz najlepsz\u0105 walk\u0119 wieczoru. Prezes federacji osobi\u015Bcie \u015Bciska ci r\u0119k\u0119.", failText: "Rywal jest o klas\u0119 ci\u0119\u017Cszy. Przetrwa\u0142e\u015B do ko\u0144ca, ale cia\u0142o pami\u0119ta ka\u017Cd\u0105 rund\u0119." },
      { label: "Odmawiasz", desc: "Zostajesz przy swoim planie.", effects: { form: 1 } }
    ]
  },
  {
    id: "film_hollywood",
    title: "Rola w filmie akcji",
    once: true,
    weight: 2,
    cond: (s) => s.tier >= 3 && s.media >= 45,
    text: () => "Re\u017Cyser filmu akcji szuka \u201Egro\u017Anego S\u0142owianina\u201D do roli trzeciego ochroniarza z\u0142oczy\u0144cy. Masz jedn\u0105 kwesti\u0119: \u201ENie przejdziesz\u201D.",
    choices: (s) => [
      { label: "Grasz", desc: "Dwa tygodnie na planie w Budapeszcie.", effects: { money: cash(s, 0.1, 15e3), media: 6, form: -2, note: "\u201ENie przejdziesz\u201D" } },
      { label: "Odmawiasz", desc: "Kariera w klatce jest wa\u017Cniejsza.", effects: { rep: 1, form: 1 } }
    ]
  },
  {
    id: "pas_mlodosci",
    title: "Wizyta w starym klubie",
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 3 && s.age >= 25,
    text: () => "Pierwszy trener zaprasza ci\u0119 do starego klubu. Dzieciaki ustawiaj\u0105 si\u0119 w kolejce do zdj\u0119\u0107, a na \u015Bcianie wisi twoje zdj\u0119cie z pierwszego turnieju.",
    choices: (s) => [
      { label: "Prowadzisz trening", desc: "Dwie godziny z dzieciakami.", effects: { rep: 3, relations: 1, media: 1 } },
      { label: "Fundujesz nowe maty", desc: "Stare pami\u0119taj\u0105 jeszcze ciebie.", effects: { money: -cash(s, 0.02, 4e3), rep: 4, media: 2 } }
    ]
  },
  // ---------- Życie (każdy etap) ----------
  {
    id: "pies_spacer",
    title: "Pies s\u0105siada",
    once: true,
    weight: 3,
    cond: (s) => s.age >= 18,
    text: () => "S\u0105siad wyje\u017Cd\u017Ca na dwa tygodnie i prosi, \u017Ceby\u015B wyprowadza\u0142 jego owczarka. Pies ci\u0105gnie jak ci\u0119\u017Car\xF3wka i nie s\u0142ucha nikogo.",
    choices: () => [
      { label: "Wyprowadzasz psa", desc: "Dwa razy dziennie, po pi\u0119\u0107 kilometr\xF3w.", effects: { stats: { cardio: 1 }, relations: 1 } },
      { label: "Odmawiasz", desc: "Masz treningi.", effects: { relations: -1 } }
    ]
  },
  {
    id: "mama_facebook",
    title: "Mama na Fejsbuku",
    weight: 3,
    cond: (s) => s.media >= 10,
    text: (s) => vary2(s, [
      "Mama komentuje ka\u017Cdy post o tobie. Pod zapowiedzi\u0105 walki napisa\u0142a: \u201ESynku, uwa\u017Caj na buzi\u0119, ubierz si\u0119 ciep\u0142o\u201D.",
      "Mama za\u0142o\u017Cy\u0142a na Fejsbuku fanpage \u201EMama zawodnika\u201D. Ma wi\u0119cej obserwuj\u0105cych ni\u017C ty.",
      "Mama wda\u0142a si\u0119 w k\u0142\xF3tni\u0119 w komentarzach z hejterem. Hejter przeprosi\u0142."
    ]),
    choices: () => [
      { label: "Zostawiasz to", desc: "Mama to mama.", effects: { relations: 2, media: 1 } },
      { label: "Prosisz, \u017Ceby przesta\u0142a", desc: "Delikatnie.", effects: { relations: -1 } }
    ]
  },
  {
    id: "dieta_mieso",
    title: "Dieta samego mi\u0119sa",
    once: true,
    weight: 3,
    cond: (s) => s.age >= 19 && s.media >= 5,
    text: () => "Kolega z si\u0142owni przysi\u0119ga, \u017Ce dieta samego mi\u0119sa i surowych jajek to sekret mistrz\xF3w. Pokazuje filmik cz\u0142owieka, kt\xF3ry je w\u0105tr\xF3bk\u0119 na surowo.",
    choices: () => [
      { label: "Pr\xF3bujesz przez miesi\u0105c", desc: "Steki na \u015Bniadanie, obiad i kolacj\u0119.", chance: 40, success: { form: 2, note: "czujesz si\u0119 jak lew" }, fail: { form: -3, note: "\u017Co\u0142\u0105dek protestuje" }, successText: "Ku zaskoczeniu wszystkich czujesz si\u0119 \u015Bwietnie. Rachunek u rze\u017Anika ju\u017C mniej.", failText: "Po tygodniu \u017Co\u0142\u0105dek odmawia wsp\xF3\u0142pracy. Wracasz do ry\u017Cu z kurczakiem." },
      { label: "Zostajesz przy swojej diecie", desc: "Dietetyczka by ci\u0119 zabi\u0142a.", effects: {} }
    ]
  },
  {
    id: "lodowka_kapiel",
    title: "Morsowanie",
    once: true,
    weight: 3,
    cond: (s) => s.age >= 18,
    text: () => "Ekipa z klubu morsuje w ka\u017Cd\u0105 niedziel\u0119. Twierdz\u0105, \u017Ce zimna woda to najlepsza regeneracja. Jest minus osiem.",
    choices: () => [
      { label: "Wchodzisz do jeziora", desc: "Na trzy minuty.", chance: 75, success: { stats: { chin: 1 }, form: 1, note: "zahartowany" }, fail: { form: -2, note: "tydzie\u0144 z katarem" }, successText: "Po trzech minutach czujesz si\u0119, jakby\u015B m\xF3g\u0142 przebiec maraton. Ekipa przyjmuje ci\u0119 do klubu mors\xF3w.", failText: "Nast\u0119pnego dnia le\u017Cysz pod kocem z gor\u0105czk\u0105. Morsy m\xF3wi\u0105, \u017Ce \u201Etrzeba si\u0119 przyzwyczai\u0107\u201D." },
      { label: "Patrzysz z brzegu", desc: "Trzymasz r\u0119czniki.", effects: { relations: 1 } }
    ]
  },
  {
    id: "mandat_rower",
    title: "Bieganie po ciemku",
    once: true,
    weight: 2,
    cond: (s) => s.age >= 17,
    text: () => "Biegasz o pi\u0105tej rano w ciemnej kurtce. Kierowca \u015Bmieciarki prawie ci\u0119 potr\u0105ca, a potem opieprza przez okno przez dwie minuty.",
    choices: () => [
      { label: "Kupujesz kamizelk\u0119 odblaskow\u0105", desc: "Bezpiecze\u0144stwo przede wszystkim.", effects: { money: -60, note: "wygl\u0105dasz jak drogowiec" } },
      { label: "Biegasz w dzie\u0144", desc: "Kosztem snu.", effects: { form: -1 } }
    ]
  },
  {
    id: "rodzinna_impreza",
    title: "Imieniny wujka",
    weight: 3,
    cond: (s) => s.age >= 18,
    text: (s) => vary2(s, [
      "Imieniny wujka. Wujek po trzecim kieliszku chce si\u0119 z tob\u0105 \u201Esi\u0142owa\u0107 na r\u0119k\u0119, tak dla zabawy\u201D.",
      "Rodzinny grill. Szwagier przekonuje wszystkich, \u017Ce \u201Eza m\u0142odu te\u017C by tak potrafi\u0142\u201D i chce pokaza\u0107, jak si\u0119 dusi.",
      "Komunia chrze\u015Bniaka. Ciocia pyta, kiedy wreszcie znajdziesz \u201Enormaln\u0105 prac\u0119\u201D."
    ]),
    choices: () => [
      { label: "Bawisz si\u0119 z rodzin\u0105", desc: "Raz na jaki\u015B czas trzeba.", effects: { relations: 2, form: -1 } },
      { label: "Wychodzisz wcze\u015Bniej na trening", desc: "Ob\xF3z to ob\xF3z.", effects: { relations: -1, form: 1 } }
    ]
  },
  {
    id: "auto_awaria",
    title: "Awaria auta",
    weight: 3,
    cond: (s) => s.age >= 19 && s.tier <= 2,
    text: (s) => vary2(s, [
      "Pada skrzynia bieg\xF3w w twoim starym passacie. Mechanik kr\u0119ci g\u0142ow\u0105 i m\xF3wi \u201Eno, b\u0119dzie kosztowa\u0107\u201D.",
      "Turbo w aucie zaczyna \u015Bwiszcze\u0107 jak czajnik. Do klubu masz 30 kilometr\xF3w."
    ]),
    choices: () => [
      { label: "Naprawiasz", desc: "Bez auta ani rusz.", effects: { money: -3500 } },
      { label: "Doje\u017Cd\u017Casz autobusem", desc: "Dwie przesiadki, godzina w jedn\u0105 stron\u0119.", effects: { form: -2, stats: { cardio: 1 } } }
    ]
  },
  {
    id: "kontrola_antydoping",
    title: "Kontrola antydopingowa",
    weight: 2,
    cond: (s) => s.tier >= 2,
    text: () => "O sz\xF3stej rano dzwonek do drzwi. Kontrola antydopingowa. Wczoraj wieczorem pi\u0142e\u015B syrop na kaszel od babci.",
    choices: (s) => [
      { label: "Zg\u0142aszasz syrop w formularzu", desc: "Lepiej powiedzie\u0107 wszystko.", effects: { rep: 1, note: "wynik czysty" } },
      { label: "Nic nie m\xF3wisz", desc: "To przecie\u017C tylko syrop.", chance: 85, success: { note: "wynik czysty" }, fail: { rep: -6, money: -cash(s, 0.02, 3e3), note: "wyja\u015Bnienia trwa\u0142y p\xF3\u0142 roku" }, successText: "Wynik czysty. Babcia dumna, \u017Ce jej syrop przeszed\u0142 kontrol\u0119.", failText: "Syrop zawiera\u0142 co\u015B z listy zakazanej. Wyja\u015Bnienia trwaj\u0105 p\xF3\u0142 roku i kosztuj\u0105 fortun\u0119." }
    ]
  },
  {
    id: "dzieciak_pyta",
    title: "Pytanie na spotkaniu w szkole",
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 1 && s.media >= 10,
    text: () => "Szko\u0142a zaprasza ci\u0119 na spotkanie z uczniami. Pierwsze pytanie z sali: \u201EIle pan zarabia?\u201D. Drugie: \u201EA pan by pokona\u0142 tego strongmana z telewizji?\u201D.",
    choices: () => [
      { label: "Odpowiadasz na wszystko", desc: "Szczerze i z humorem.", effects: { rep: 2, media: 2 } },
      { label: "Opowiadasz o ci\u0119\u017Ckiej pracy", desc: "Dzieciaki ziewaj\u0105.", effects: { rep: 1 } }
    ]
  },
  {
    id: "kontuzja_dziecko",
    title: "Kontuzja na placu zabaw",
    once: true,
    weight: 2,
    cond: (s) => (s.flags.kid ?? 0) > 0,
    text: () => "Bawisz si\u0119 z dzieckiem na placu zabaw. Zje\u017Cd\u017Calnia by\u0142a ni\u017Csza, ni\u017C my\u015Bla\u0142e\u015B. Kostka puchnie jak balon.",
    choices: () => [
      { label: "Idziesz do lekarza", desc: "Lepiej sprawdzi\u0107.", effects: { money: -400, form: -1 } },
      { label: "Zaciskasz z\u0119by", desc: "L\xF3d i b\u0119dzie dobrze.", chance: 50, success: { note: "przesz\u0142o samo" }, fail: { injury: { name: "skr\u0119cona kostka", seasons: 1, penalty: 4 } }, successText: "Po trzech dniach kostka wraca do normy. Dziecko zje\u017Cd\u017Ca dalej, ty patrzysz z \u0142awki.", failText: "Kostka nie przechodzi. Lekarz po tygodniu m\xF3wi, \u017Ce trzeba by\u0142o przyj\u015B\u0107 od razu." }
    ]
  },
  // ---------- Odwieczny rywal ----------
  {
    id: "rywal_social",
    title: "Rywal w internecie",
    weight: 7,
    cond: rivalHere,
    text: (s) => vary2(s, [
      `${rn(s)} wrzuca filmik, na kt\xF3rym przewraca si\u0119 manekin w twojej koszulce. Podpis: \u201Esezon na dziki otwarty\u201D.`,
      `${rn(s)} w podca\u015Bcie opowiada, \u017Ce w waszej ostatniej walce \u201Es\u0119dziowie ci pomogli\u201D. Klip ma \u0107wier\u0107 miliona wy\u015Bwietle\u0144.`,
      `${rn(s)} nagrywa relacj\u0119 spod twojej sali treningowej. \u201EPuk, puk, jest kto\u015B odwa\u017Cny?\u201D`
    ]),
    choices: () => [
      { label: "Odpowiadasz i wyzywasz go", desc: "Niech organizator zrobi t\u0119 walk\u0119.", effects: { media: 4, rep: -1, flag: "rivalCallout", note: "w tym roku si\u0119 spotkacie" } },
      { label: "Nagrywasz parodi\u0119", desc: "\u015Amiech to te\u017C bro\u0144.", effects: { media: 3, relations: 1 } },
      { label: "Ignorujesz", desc: "Odpowiesz w klatce.", effects: { rep: 2, form: 1 } }
    ]
  },
  {
    id: "rywal_nagrania",
    title: "By\u0142y sparingpartner rywala",
    weight: 4,
    cond: rivalHere,
    text: (s) => `Odzywa si\u0119 ch\u0142opak, kt\xF3ry przez rok sparowa\u0142 z ${rn(s)}. Za dwa tysi\u0105ce odda pendrive z nagraniami jego trening\xF3w.`,
    choices: () => [
      { label: "Kupujesz nagrania", desc: "Wiedza to przewaga.", effects: { money: -2e3, form: 2, note: "znasz jego nawyki" } },
      { label: "Odmawiasz", desc: "Nie tak si\u0119 wygrywa.", effects: { rep: 2 } }
    ]
  },
  {
    id: "rywal_konferencja",
    title: "Face to face z rywalem",
    weight: 5,
    cond: rivalHere,
    text: (s) => `Konferencja przed gal\u0105. ${rn(s)} staje centymetr od twojej twarzy i co\u015B szepcze. Kamery czekaj\u0105, co zrobisz.`,
    choices: () => [
      {
        label: "Odpychasz go",
        desc: "Show musi trwa\u0107.",
        chance: 50,
        success: { media: 5, form: 1, note: "klip dnia" },
        fail: { media: 3, form: -2, money: -1500, note: "kara od federacji" },
        successText: "Ochrona was rozdziela, a klip z konferencji leci we wszystkich serwisach. Bilety schodz\u0105 w godzin\u0119.",
        failText: "Federacja nak\u0142ada kar\u0119 za naruszenie nietykalno\u015Bci. On si\u0119 tylko u\u015Bmiecha. Wyprowadzi\u0142 ci\u0119 z r\xF3wnowagi."
      },
      { label: "U\u015Bmiechasz si\u0119 i milczysz", desc: "Zimna krew.", effects: { rep: 2, form: 1 } }
    ]
  }
];

// src/engine/events_fun.ts
var vary3 = (s, arr) => arr[(s.season * 11 + s.age * 5) % arr.length];
var FUN_EVENTS = [
  {
    id: "babcia_rosol",
    title: "Babcia i dieta",
    weight: 4,
    cond: (s) => s.tier >= 0,
    text: (s) => vary3(s, [
      "Tydzie\u0144 przed walk\u0105 babcia stawia przed tob\u0105 talerz roso\u0142u, schabowego i trzy rodzaje ciasta. \u201ETy taki chudy, jak ty si\u0119 bi\u0107 b\u0119dziesz?\u201D",
      "Niedzielny obiad u babci. Na stole pierogi w czterech smakach. Dietetyk pisze na WhatsAppie: \u201EMam nadziej\u0119, \u017Ce trzymasz makro\u201D."
    ]),
    choices: () => [
      { label: "Jesz wszystko", desc: "Babci si\u0119 nie odmawia.", effects: { relations: 2, form: -1, note: "waga skacze, babcia szcz\u0119\u015Bliwa" } },
      { label: "T\u0142umaczysz, czym jest makro", desc: "P\xF3\u0142 godziny wyk\u0142adu o bia\u0142ku.", chance: 35, success: { relations: 1, form: 1, note: "babcia robi ci kurczaka na parze" }, fail: { relations: -1, note: "babcia obra\u017Cona do \u015Bwi\u0105t" }, successText: "Babcia s\u0142ucha, kiwa g\u0142ow\u0105 i w \u015Brod\u0119 przynosi ci pude\u0142ko kurczaka z ry\u017Cem. Podpisane: \u201Emakro\u201D.", failText: "Babcia wychodzi do kuchni i trzaska drzwiami. Mama m\xF3wi, \u017Ce to przez ciebie nie b\u0119dzie sernika na \u015Bwi\u0119ta." }
    ]
  },
  {
    id: "sasiad_wiertarka",
    title: "S\u0105siad z wiertark\u0105",
    weight: 3,
    cond: (s) => s.age >= 18,
    text: () => "\u015Arodek ci\u0119\u017Ckiego obozu, rano masz sparingi, a s\u0105siad zza \u015Bciany zaczyna remont. O 23:40 wiertarka udarowa, o 0:15 m\u0142otek. \u201EMusz\u0119 sko\u0144czy\u0107 p\xF3\u0142k\u0119 przed weekendem\u201D.",
    choices: () => [
      { label: "Idziesz porozmawia\u0107", desc: "Grzecznie, ale stanowczo.", chance: 60, success: { form: 1, note: "s\u0105siad przeprasza i przynosi ciasto" }, fail: { media: 1, rep: -1, note: "s\u0105siad nagrywa ci\u0119 telefonem" }, successText: "S\u0105siad okazuje si\u0119 twoim kibicem, przeprasza i zostawia pod drzwiami blach\u0119 szarlotki. \u015Apisz jak dziecko.", failText: "S\u0105siad nagrywa rozmow\u0119 i wrzuca do grupy osiedlowej z podpisem \u201Ezawodnik MMA grozi emerytowi\u201D. Nikt nie grozi, ale komentarze s\u0105." },
      { label: "Zatyczki i sen", desc: "Nie dasz si\u0119 wyprowadzi\u0107 z r\xF3wnowagi.", effects: { form: -1, note: "spa\u0142e\u015B cztery godziny" } }
    ]
  },
  {
    id: "tiktok_trend",
    title: "Trend na TikTaku",
    weight: 4,
    cond: (s) => s.tier >= 1,
    text: (s) => vary3(s, [
      "Klubowy social media manager chce, \u017Ceby\u015B nagra\u0142 taniec do modnego trendu. W r\u0119kawicach. \u201EAlgorytm to kocha\u201D.",
      "M\u0142odsi koledzy z klubu nagrywaj\u0105 filmik \u201Ezawodnik MMA ocenia pierogi z r\xF3\u017Cnych miast\u201D. Chc\u0105, \u017Ceby\u015B by\u0142 jurorem."
    ]),
    choices: () => [
      { label: "Wchodzisz w to", desc: "Raz si\u0119 \u017Cyje.", chance: 55, success: { media: 3, note: "filmik ma milion wy\u015Bwietle\u0144" }, fail: { media: 1, rep: -2, note: "internet si\u0119 \u015Bmieje, ale nie z tob\u0105" }, successText: "Filmik ma milion wy\u015Bwietle\u0144 w dwa dni. W komentarzach kto\u015B pisze, \u017Ce \u201Eta\u0144czy lepiej, ni\u017C si\u0119 bije\u201D. Trener udaje, \u017Ce nie widzia\u0142.", failText: "Ruszasz si\u0119 jak szafa na k\xF3\u0142kach. Komentarze bezlitosne, a rywal udost\u0119pnia filmik z trzema emotkami p\u0142aczu ze \u015Bmiechu." },
      { label: "Odmawiasz", desc: "Jeste\u015B tu, \u017Ceby si\u0119 bi\u0107.", effects: { rep: 1 } }
    ]
  },
  {
    id: "mama_w_hali",
    title: "Mama na trybunach",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && !!s.proDebut,
    text: () => "Mama po raz pierwszy przychodzi na twoj\u0105 gal\u0119. Przynios\u0142a transparent \u201ESYNKU, NIE DAJ SI\u0118\u201D i kanapki dla ca\u0142ego sektora.",
    choices: () => [
      { label: "Machasz do niej przed walk\u0105", desc: "Kamera to \u0142apie.", effects: { relations: 2, media: 2, form: 1, note: "ca\u0142a hala bije brawo mamie" } },
      { label: "Prosisz, \u017Ceby schowa\u0142a transparent", desc: "Skupienie przede wszystkim.", effects: { relations: -2, form: 1 } }
    ]
  },
  {
    id: "kot_trenera",
    title: "Kot trenera",
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 0,
    text: () => "Trener przyprowadza na sal\u0119 kota, bo \u201Esam w domu si\u0119 nudzi\u201D. Kot \u015Bpi na macie do parteru, dok\u0142adnie tam, gdzie macie robi\u0107 drille.",
    choices: () => [
      { label: "Trenujecie wok\xF3\u0142 kota", desc: "Kot ma pierwsze\u0144stwo.", effects: { stats: { iq: 1 }, relations: 1, note: "uczysz si\u0119 kontroli pozycji w ograniczonej przestrzeni" } },
      { label: "Przenosisz kota", desc: "Delikatnie.", chance: 50, success: { media: 2, note: "zdj\u0119cie z kotem robi furor\u0119" }, fail: { wear: 1, note: "kot nie by\u0142 zachwycony" }, successText: "Kot mruczy ci w ramionach. Kto\u015B robi zdj\u0119cie, a profil klubu ma rekord polubie\u0144.", failText: "Kot wyra\u017Anie nie zgadza si\u0119 z decyzj\u0105. Trzy zadrapania na przedramieniu wygl\u0105daj\u0105 gorzej ni\u017C po sparingu." }
    ]
  },
  {
    id: "reklama_pierogi",
    title: "Reklama pierogarni",
    weight: 3,
    cond: (s) => s.tier >= 1 && s.tier <= 3 && s.media >= 10,
    text: () => "Lokalna pierogarnia chce nakr\u0119ci\u0107 z tob\u0105 reklam\u0119: rozbijasz desk\u0119 r\u0119k\u0105, a z deski wypadaj\u0105 pierogi. Has\u0142o: \u201ESi\u0142a z ciasta\u201D.",
    choices: (s) => [
      { label: "Kr\u0119cisz", desc: "Pieni\u0105dze i pierogi gratis do ko\u0144ca roku.", effects: { money: cash(s, 0.03, 1500), media: 2, rep: -1, note: "koledzy wo\u0142aj\u0105 na ciebie \u201EPiero\u017Cek\u201D" } },
      { label: "Odmawiasz", desc: "Godno\u015B\u0107 ponad pierogi.", effects: { rep: 1 } }
    ]
  },
  {
    id: "pomylka_hotel",
    title: "Pomy\u0142ka w hotelu",
    weight: 3,
    cond: (s) => s.tier >= 2,
    text: () => "Organizator gali zakwaterowa\u0142 ci\u0119 w jednym pokoju z rywalem z karty wst\u0119pnej. Dwa \u0142\xF3\u017Cka, jedna \u0142azienka, zero planu.",
    choices: () => [
      { label: "Zostajesz", desc: "Jak doro\u015Bli ludzie.", chance: 60, success: { rep: 2, media: 1, note: "wsp\xF3lne zdj\u0119cie z rywalem obiega internet" }, fail: { form: -2, note: "rywal chrapie jak traktor" }, successText: "Wieczorem gracie razem w karty, rano robicie sobie zdj\u0119cie w szlafrokach. Kibice pisz\u0105, \u017Ce \u201Etak powinien wygl\u0105da\u0107 sport\u201D.", failText: "Rywal chrapie jak traktor w \u017Cniwa. Zasypiasz o czwartej z poduszk\u0105 na g\u0142owie." },
      { label: "\u017B\u0105dasz innego pokoju", desc: "Organizator si\u0119 krzywi.", effects: { form: 1, rep: -1 } }
    ]
  },
  {
    id: "ochroniarz_wejscie",
    title: "Ochroniarz ci\u0119 nie wpuszcza",
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: () => "Federacja zaprasza ci\u0119 na gal\u0119, \u017Ceby\u015B pokaza\u0142 si\u0119 kibicom z klatki. Ochroniarz przy wej\u015Bciu dla zawodnik\xF3w nie wierzy, \u017Ce jeste\u015B na li\u015Bcie. \u201EKa\u017Cdy tak m\xF3wi. Bilet?\u201D",
    choices: () => [
      { label: "Pokazujesz plakat na telefonie", desc: "Twoja twarz, jego zdziwienie.", effects: { media: 1, note: "ochroniarz prosi o autograf dla syna" } },
      { label: "Dzwonisz do organizatora", desc: "Dwadzie\u015Bcia minut czekania na zimnie.", effects: { form: -1, note: "katar po czekaniu na zimnie" } }
    ]
  },
  {
    id: "auto_cofka",
    title: "Spodenki w praniu",
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: () => "Dwie godziny przed walk\u0105 okazuje si\u0119, \u017Ce spodenki walkowe zosta\u0142y w pralce. W hotelu. W innym mie\u015Bcie.",
    choices: () => [
      { label: "Po\u017Cyczasz od kolegi z klubu", desc: "Dwa rozmiary za du\u017Ce.", effects: { media: 2, form: -1, note: "w klatce trzymasz spodenki jedn\u0105 r\u0119k\u0105" } },
      { label: "Kupujesz w sklepie przy hali", desc: "Jedyne, jakie maj\u0105: r\xF3\u017Cowe z jednoro\u017Ccem.", effects: { media: 3, rep: 1, note: "jednoro\u017Cec staje si\u0119 twoim znakiem" } }
    ]
  },
  {
    id: "wujek_rada",
    title: "Wujek ekspert",
    weight: 3,
    cond: (s) => s.age >= 17,
    text: () => "Na imieninach wujek, kt\xF3ry ostatni raz \u0107wiczy\u0142 w wojsku w 1989, t\u0142umaczy ci przy stole, jak \u201Epowiniene\u015B by\u0142\u201D wygra\u0107 ostatni\u0105 walk\u0119. Z rysunkami na serwetce.",
    choices: () => [
      { label: "S\u0142uchasz z u\u015Bmiechem", desc: "Rodzina jest najwa\u017Cniejsza.", effects: { relations: 2, note: "wujek rozpowiada, \u017Ce to jego taktyka" } },
      { label: "Zapraszasz go na sparing", desc: "Lekki, techniczny.", chance: 85, success: { relations: -1, media: 2, note: "wujek przyznaje, \u017Ce to nie takie proste" }, fail: { relations: -3, note: "wujek obrazi\u0142 si\u0119 na ca\u0142\u0105 rodzin\u0119" }, successText: "Po trzydziestu sekundach wujek le\u017Cy na macie i m\xF3wi, \u017Ce \u201Ekolano mu si\u0119 odezwa\u0142o\u201D. Filmik ma tysi\u0105ce wy\u015Bwietle\u0144.", failText: "Wujek wychodzi z imienin, a ciocia przez telefon wyja\u015Bnia twojej mamie, \u017Ce \u201Esyn ma za du\u017Co w g\u0142owie\u201D." }
    ]
  },
  {
    id: "kanapka_waga",
    title: "Kanapka na wadze",
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: () => "Przy oficjalnym wa\u017Ceniu rywal wyjmuje z kieszeni kanapk\u0119 ze schabowym i je j\u0105 ci przed nosem. Ty nie pi\u0142e\u015B wody od wczoraj.",
    choices: () => [
      { label: "Patrzysz mu w oczy", desc: "Kamie\u0144.", effects: { rep: 2, form: 1 } },
      { label: "Zabierasz mu kanapk\u0119", desc: "I zjadasz.", chance: 50, success: { media: 4, note: "klip roku" }, fail: { media: 2, rep: -2, form: -1, note: "kara od komisji i b\xF3l brzucha" }, successText: "Hala wybucha \u015Bmiechem, rywal stoi z pust\u0105 r\u0119k\u0105. Klip trafia do wszystkich podsumowa\u0144 tygodnia.", failText: "Komisja nie widzi w tym nic \u015Bmiesznego, a schabowy po dw\xF3ch dniach g\u0142od\xF3wki to by\u0142 z\u0142y pomys\u0142." }
    ]
  },
  {
    id: "fan_tatuaz",
    title: "Tatua\u017C fana",
    once: true,
    weight: 3,
    cond: (s) => s.media >= 30,
    text: () => "Fan wrzuca zdj\u0119cie: wytatuowa\u0142 sobie twoj\u0105 twarz na \u0142ydce. Podobie\u0144stwo jest\u2026 umowne. Bardziej przypominasz na nim ziemniaka w r\u0119kawicach.",
    choices: () => [
      { label: "Udost\u0119pniasz z sercem", desc: "Szacunek dla oddania.", effects: { media: 3, rep: 1, note: "fan zostaje lokaln\u0105 gwiazd\u0105" } },
      { label: "Fundujesz mu poprawk\u0119", desc: "U dobrego tatua\u017Cysty.", effects: { money: -800, media: 4, rep: 2, note: "ziemniak zamienia si\u0119 w ciebie" } }
    ]
  },
  {
    id: "komentator_myli",
    title: "Komentator myli nazwisko",
    weight: 3,
    cond: (s) => s.tier >= 2,
    text: (s) => `Przez ca\u0142\u0105 transmisj\u0119 komentator nazywa ci\u0119 \u201E${s.profile.lastName.slice(0, -1)}${s.profile.lastName.endsWith("a") ? "o" : "a"}\u201D. Internet podchwytuje to szybciej ni\u017C ty wstajesz z maty.`,
    choices: () => [
      { label: "Przyjmujesz now\u0105 ksywk\u0119", desc: "Skoro tak m\xF3wi\u0105.", effects: { media: 3, note: "kibice skanduj\u0105 przekr\u0119cone nazwisko" } },
      { label: "Prostujesz w wywiadzie", desc: "Z u\u015Bmiechem.", effects: { rep: 1, media: 1 } }
    ]
  },
  {
    id: "reklama_bank",
    title: "Klient banku",
    weight: 2,
    cond: (s) => s.tier >= 2 && s.money >= 5e4,
    text: () => "Doradca w banku, widz\u0105c saldo, proponuje ci \u201Eprodukt inwestycyjny dla sportowc\xF3w\u201D: fundusz oparty na cenach karmy dla ps\xF3w.",
    choices: (s) => [
      { label: "Wchodzisz w to", desc: "Psy zawsze b\u0119d\u0105 je\u015B\u0107.", chance: 45, success: { money: cash(s, 0.06, 4e3), note: "karma dla ps\xF3w idzie w g\xF3r\u0119" }, fail: { money: -cash(s, 0.05, 3e3), note: "kryzys na rynku karmy" }, successText: "Po p\xF3\u0142 roku dostajesz list z banku. Wszystko w g\xF3r\u0119. Doradca pisze, \u017Ce \u201Ezawsze wierzy\u0142 w psy\u201D.", failText: "Wielka sie\u0107 sklep\xF3w wprowadza w\u0142asn\u0105 karm\u0119 i fundusz leci w d\xF3\u0142. Doradca jest na urlopie." },
      { label: "Dzi\u0119kujesz", desc: "Pieni\u0105dze lubi\u0105 spok\xF3j.", effects: { note: "doradca wysy\u0142a ci kalendarz z psami" } }
    ]
  },
  {
    id: "dziecko_autograf",
    title: "Ma\u0142y kibic",
    weight: 3,
    cond: (s) => s.tier >= 1 && s.media >= 15,
    text: () => "Po treningu czeka na ciebie ch\u0142opiec z mam\u0105. Pokazuje ci sw\xF3j rysunek: ty w klatce, z pasem, a obok smok. \u201ESmok to tw\xF3j trener\u201D.",
    choices: () => [
      { label: "Zapraszasz go na trening", desc: "Niech pozna smoka osobi\u015Bcie.", effects: { rep: 3, relations: 1, form: -1, note: "trener zaczyna m\xF3wi\u0107 o sobie \u201Esmok\u201D" } },
      { label: "Podpisujesz rysunek", desc: "I robicie zdj\u0119cie.", effects: { rep: 1, media: 1 } }
    ]
  },
  {
    id: "sponsor_gadzet",
    title: "Gad\u017Cet od sponsora",
    weight: 3,
    cond: (s) => s.sponsors.length >= 2,
    text: () => "Sponsor przysy\u0142a paczk\u0119: elektryczny pas na brzuch, kt\xF3ry \u201Ezast\u0119puje 300 brzuszk\xF3w\u201D. W instrukcji po polsku tylko jedno zdanie: \u201ENie u\u017Cywa\u0107 w wannie\u201D.",
    choices: () => [
      { label: "Testujesz na nagraniu", desc: "Dla sponsora.", chance: 60, success: { media: 2, note: "sponsor zachwycony recenzj\u0105" }, fail: { wear: 1, media: 2, note: "pas kopie mocniej ni\u017C rywale" }, successText: "Robisz powa\u017Cn\u0105 min\u0119, pas buczy. Sponsor zamawia od razu drugi film.", failText: "Pas uruchamia si\u0119 na maksymalnej mocy. Tw\xF3j krzyk s\u0142ycha\u0107 na s\u0105siedniej ulicy, a nagranie ma setki tysi\u0119cy wy\u015Bwietle\u0144." },
      { label: "Oddajesz bratu", desc: "Niech on si\u0119 m\u0119czy.", effects: { relations: 1 } }
    ]
  },
  {
    id: "rap_wejscie",
    title: "Piosenka na wej\u015Bcie",
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: (s) => vary3(s, [
      "Kuzyn nagra\u0142 dla ciebie piosenk\u0119 na wej\u015Bcie. Disco polo o tym, jak \u201Ezgasisz \u015Bwiat\u0142o ka\u017Cdemu rywalowi\u201D. Refren wpada w ucho, niestety.",
      "Lokalny raper proponuje numer na twoje wej\u015Bcie. Rymuje twoje nazwisko z \u201Ekombajn\u201D. Nikt nie wie dlaczego."
    ]),
    choices: () => [
      { label: "Wchodzisz przy tym", desc: "Hala to pokocha. Albo nie.", chance: 55, success: { media: 3, relations: 1, note: "ca\u0142a hala \u015Bpiewa refren" }, fail: { rep: -2, media: 2, note: "hala w ciszy, rywal si\u0119 \u015Bmieje" }, successText: "Przy drugim refrenie \u015Bpiewa ca\u0142a hala. Nast\u0119pnego dnia piosenka jest w lokalnym radiu.", failText: "Cisz\u0119 przerywa tylko tw\xF3j kuzyn, \u015Bpiewaj\u0105cy z pierwszego rz\u0119du. Rywal na face to face nie mo\u017Ce powstrzyma\u0107 u\u015Bmiechu." },
      { label: "Zostajesz przy klasyku", desc: "Sprawdzony numer.", effects: { form: 1 } }
    ]
  }
];

// src/engine/events_rep.ts
var vary4 = (s, arr) => arr[(s.season * 3 + s.age * 7) % arr.length];
var REP_EVENTS = [
  {
    id: "silownia_nagranie",
    title: "Nagranie z si\u0142owni",
    weight: 3,
    cond: (s) => s.age >= 18,
    text: (s) => vary4(s, [
      "Na si\u0142owni kole\u015B od kwadransa siedzi na \u0142awce z telefonem. Prosisz grzecznie, a on rzuca: \u201EA co, my\u015Blisz, \u017Ce jak bijesz si\u0119 w klatce, to wszystko ci wolno?\u201D. Kto\u015B obok wyci\u0105ga telefon i nagrywa.",
      "Typ na si\u0142owni zaczepia ci\u0119 przy sztandze: \u201ETy jeste\u015B tym zawodnikiem? Poka\u017C, co umiesz\u201D. Jego kolega ju\u017C nagrywa telefonem."
    ]),
    choices: () => [
      { label: "Odpuszczasz z u\u015Bmiechem", desc: "M\xF3wisz \u201Emi\u0142ego treningu\u201D i idziesz na inn\u0105 \u0142awk\u0119.", effects: { rep: 2, note: "filmik \u201Ezawodnik z klas\u0105\u201D" } },
      { label: "M\xF3wisz mu, co my\u015Blisz", desc: "G\u0142o\u015Bno i dosadnie.", effects: { rep: -2, media: 2, note: "filmik kr\u0105\u017Cy po grupach" } }
    ]
  },
  {
    id: "babcia_zakupy",
    title: "Ci\u0119\u017Ckie zakupy",
    weight: 3,
    cond: () => true,
    text: () => "Wracasz z treningu. Starsza pani pod blokiem mocuje si\u0119 z dwiema siatkami ziemniak\xF3w i zgrzewk\u0105 wody. Czwarte pi\u0119tro, bez windy.",
    choices: () => [
      { label: "Wnosisz zakupy", desc: "Po treningu nogi i tak ju\u017C bol\u0105.", effects: { rep: 1, relations: 1, note: "s\u0105siadka wrzuca zdj\u0119cie na grup\u0119 osiedla" } },
      { label: "Spieszysz si\u0119", desc: "Za godzin\u0119 drugi trening.", effects: { form: 1 } }
    ]
  },
  {
    id: "hejter_komentarz",
    title: "Komentarz pod postem",
    weight: 3,
    cond: (s) => s.tier >= 1 && s.media >= 10,
    text: () => "Pod twoim zdj\u0119ciem z treningu kto\u015B pisze: \u201ENic nie umiesz, wygrywasz tylko z emerytami\u201D. Ma czterdzie\u015Bci polubie\u0144.",
    choices: () => [
      { label: "Ignorujesz", desc: "Telefon do torby, wracasz do treningu.", effects: { form: 1 } },
      { label: "Odpisujesz z humorem", desc: "\u201EZapraszam na sparing, emeryci te\u017C trenuj\u0105.\u201D", effects: { media: 2, rep: 1 } },
      { label: "Odpisujesz ostro", desc: "Trzy akapity, wielkie litery.", effects: { media: 2, rep: -2 } }
    ]
  },
  {
    id: "bojka_pod_klubem",
    title: "Awantura pod klubem",
    weight: 2,
    cond: (s) => s.age >= 19,
    text: () => "Wychodzisz z urodzin kolegi. Przed lokalem dw\xF3ch pijanych zaczepia ch\u0142opaka, kt\xF3ry nie wygl\u0105da, jakby umia\u0142 si\u0119 broni\u0107.",
    choices: () => [
      { label: "Rozdzielasz ich spokojnie", desc: "Stajesz pomi\u0119dzy i rozmawiasz.", test: "iq", success: { rep: 2, note: "obesz\u0142o si\u0119 bez cios\xF3w" }, fail: { rep: -1, wear: 2, note: "policja spisuje wszystkich" }, successText: "Wystarcza, \u017Ce staniesz pomi\u0119dzy i spokojnie powiesz kilka s\u0142\xF3w. Pijani odchodz\u0105, a ch\u0142opak dzi\u0119kuje ci \u0142ami\u0105cym si\u0119 g\u0142osem.", failText: "Jeden z pijanych rzuca si\u0119 na ciebie. Ko\u0144czy si\u0119 przepychank\u0105, a policja spisuje wszystkich, tak\u017Ce ciebie." },
      { label: "Dzwonisz po policj\u0119", desc: "Od tego oni s\u0105.", effects: { rep: -6 } },
      { label: "Idziesz do domu", desc: "To nie twoja sprawa.", effects: {} }
    ]
  },
  {
    id: "trening_charytatywny",
    title: "Trening dla fundacji",
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: () => "Fundacja dla dzieci z domu dziecka prosi, \u017Ceby\u015B poprowadzi\u0142 otwarty trening. Bez honorarium, ca\u0142y doch\xF3d z bilet\xF3w idzie na fundacj\u0119.",
    choices: () => [
      { label: "Prowadzisz trening", desc: "Sobota rano zamiast odpoczynku.", effects: { rep: 3, wear: 1 } },
      { label: "Przekazujesz r\u0119kawice na licytacj\u0119", desc: "Z autografem.", effects: { rep: 1 } },
      { label: "Odmawiasz", desc: "Ob\xF3z, nie ma kiedy.", effects: { form: 1 } }
    ]
  },
  {
    id: "stacja_benzynowa",
    title: "Na stacji benzynowej",
    weight: 2,
    cond: (s) => s.tier >= 1 && s.media >= 15,
    text: () => "O drugiej w nocy na stacji poznaje ci\u0119 grupka kibic\xF3w po meczu. Chc\u0105 zdj\u0119cie, a jeden koniecznie chce \u201Esprawdzi\u0107, jak mocno bijesz\u201D.",
    choices: () => [
      { label: "Zdj\u0119cie i do domu", desc: "U\u015Bmiech, pi\u0105tka, kluczyki.", effects: { rep: 1, media: 1 } },
      { label: "Dajesz mu \u201Esprawdzi\u0107\u201D", desc: "Lekki cios w \u0142ap\u0119.", chance: 50, success: { media: 2, note: "filmik \u201Epokaza\u0142, jak bije\u201D" }, fail: { rep: -2, media: 1, note: "kto\u015B nagra\u0142 tylko ko\u0144c\xF3wk\u0119" }, successText: "Lekki cios w otwart\u0105 d\u0142o\u0144, wszyscy si\u0119 \u015Bmiej\u0105. Filmik kr\u0105\u017Cy, ale w dobrym tonie.", failText: "Kibic si\u0119 przewraca, a w internecie l\u0105duje tylko ko\u0144c\xF3wka filmiku. Wygl\u0105da gorzej, ni\u017C by\u0142o." }
    ]
  },
  {
    id: "sedzia_krytyka",
    title: "Pytanie o s\u0119dzi\xF3w",
    weight: 2,
    cond: (s) => s.tier >= 1 && s.record.l >= 1,
    text: () => "Dziennikarz pyta o twoj\u0105 ostatni\u0105 pora\u017Ck\u0119 na punkty. \u201ECzy s\u0119dziowie dobrze to widzieli?\u201D",
    choices: () => [
      { label: "Bierzesz to na siebie", desc: "\u201ETrzeba by\u0142o zrobi\u0107 wi\u0119cej.\u201D", effects: { rep: 2 } },
      { label: "Krytykujesz s\u0119dzi\xF3w", desc: "\u201EZ\u0142odziejstwo, trzeba to powiedzie\u0107 g\u0142o\u015Bno.\u201D", effects: { media: 2, rep: -2 } }
    ]
  },
  {
    id: "pomoc_wypadek",
    title: "Wypadek na drodze",
    once: true,
    weight: 2,
    cond: (s) => s.age >= 19,
    text: () => "W drodze na trening widzisz auto w rowie. Kierowca jest przytomny, ale zakleszczony. Nikt si\u0119 nie zatrzymuje.",
    choices: () => [
      { label: "Zatrzymujesz si\u0119 i pomagasz", desc: "Sp\xF3\u017Anisz si\u0119 na trening.", effects: { rep: 3, form: -1, note: "lokalna gazeta pisze o \u201Ezawodniku na ratunek\u201D" } },
      { label: "Dzwonisz pod 112 i jedziesz dalej", desc: "Pomoc jest w drodze.", effects: { rep: 1 } }
    ]
  },
  {
    id: "prank_youtuber",
    title: "Youtuber z kamer\u0105",
    weight: 2,
    cond: (s) => s.tier >= 1 && s.media >= 20,
    text: () => "Znany youtuber chce nagra\u0107 z tob\u0105 \u201Eprank\u201D: udajesz ochroniarza w galerii i \u201Ewyprowadzasz\u201D przypadkowych ludzi. Obiecuje milion wy\u015Bwietle\u0144.",
    choices: () => [
      { label: "Nagrywasz", desc: "Milion wy\u015Bwietle\u0144 to milion wy\u015Bwietle\u0144.", effects: { media: 4, rep: -3 } },
      { label: "Proponujesz trening zamiast pranku", desc: "Niech on spr\xF3buje sparingu.", effects: { media: 2, rep: 1 } },
      { label: "Odmawiasz", desc: "Nie twoja bajka.", effects: {} }
    ]
  },
  {
    id: "sekcja_dzieci",
    title: "Zast\u0119pstwo w sekcji dzieci",
    weight: 3,
    cond: (s) => s.age >= 18,
    text: () => "Trener prosi, \u017Ceby\u015B przez miesi\u0105c poprowadzi\u0142 zaj\u0119cia dla dzieciak\xF3w. Dwa razy w tygodniu, za symboliczne pieni\u0105dze.",
    choices: () => [
      { label: "Prowadzisz zaj\u0119cia", desc: "Dzieciaki nazywaj\u0105 ci\u0119 \u201Etrenerem\u201D.", effects: { rep: 2, relations: 1, money: 300, wear: 1 } },
      { label: "Odmawiasz", desc: "W\u0142asny trening wa\u017Cniejszy.", effects: { form: 1 } }
    ]
  },
  {
    id: "parkowanie",
    title: "Miejsce dla niepe\u0142nosprawnych",
    weight: 2,
    cond: (s) => s.age >= 19 && s.media >= 15,
    text: () => "Sp\xF3\u017Aniony na wywiad, widzisz jedno wolne miejsce pod studiem. Dla niepe\u0142nosprawnych. Przed wej\u015Bciem stoi fotoreporter.",
    choices: () => [
      { label: "Szukasz innego miejsca", desc: "Sp\xF3\u017Anisz si\u0119 dziesi\u0119\u0107 minut.", effects: { rep: 1, media: -1 } },
      { label: "Parkujesz \u201Ena chwil\u0119\u201D", desc: "Przecie\u017C zaraz wychodzisz.", chance: 40, success: { note: "nikt nie zauwa\u017Cy\u0142" }, fail: { rep: -3, media: 1, note: "zdj\u0119cie w portalu plotkarskim" }, successText: "Nikt nie robi zdj\u0119cia. Tym razem.", failText: "Wieczorem twoje auto na miejscu dla niepe\u0142nosprawnych jest na g\u0142\xF3wnej portalu plotkarskiego." }
    ]
  }
];

// src/engine/events_stage.ts
var vary5 = (s, arr) => arr[(s.season * 7 + s.age * 3) % arr.length];
var zl6 = (n) => `${n.toLocaleString("pl-PL")} z\u0142`;
var mid = (s) => s.tier >= 1 && s.tier <= 3 && s.contract.kind !== "freak";
var STAGE_EVENTS = [
  // ---------- Narodziny rywalizacji ----------
  {
    id: "rywal_narodziny",
    title: "Kto\u015B ci\u0119 zapami\u0119ta\u0142",
    once: true,
    weight: 6,
    cond: (s) => !s.rivalId && s.season >= 2 && s.peers.some((p) => !p.retired && Math.abs(p.tier - s.tier) <= 1),
    text: (s) => {
      const p = [...s.peers].filter((x) => !x.retired && Math.abs(x.tier - s.tier) <= 1).sort((a, b) => b.talent - a.talent)[0];
      return `${p.firstName} ${p.lastName} z twojego rocznika w wywiadzie po wygranej m\xF3wi: \u201EW Polsce w tej wadze liczy si\u0119 tylko jeden zawodnik i to nie jest ${s.profile.lastName}\u201D. Klip wrzucaj\u0105 wszystkie grupy o MMA. Od tej chwili kibice maj\u0105 was za rywali.`;
    },
    choices: () => [
      { label: "Odpowiadasz w mediach", desc: "\u201EPowt\xF3rz to w klatce.\u201D", effects: { media: 3, flag: "rivalPick", note: "masz rywala na lata" } },
      { label: "Zapisujesz to sobie", desc: "Zdj\u0119cie wywiadu wisi teraz nad workiem.", effects: { form: 2, flag: "rivalPick", note: "masz rywala na lata" } }
    ]
  },
  // ---------- Środek kariery ----------
  {
    id: "trener_konflikt",
    title: "Spi\u0119cie z trenerem",
    weight: 3,
    cond: (s) => mid(s) && s.clubSeasons >= 3,
    text: (s) => vary5(s, [
      "Trener po sparingu bierze ci\u0119 na bok: \u201EOd roku robisz po swojemu. Albo s\u0142uchasz, albo szukaj sobie innej sali\u201D. Reszta grupy udaje, \u017Ce nie s\u0142yszy.",
      "Trener nie zgadza si\u0119 z twoim planem na ten rok. Uwa\u017Ca, \u017Ce za cz\u0119sto bierzesz walki i za ma\u0142o trenujesz. Rozmowa robi si\u0119 g\u0142o\u015Bna."
    ]),
    choices: () => [
      { label: "Przyznajesz mu racj\u0119", desc: "Ego zostaje w szatni.", effects: { relations: 2, form: 2 } },
      { label: "Stawiasz na swoim", desc: "To twoja kariera.", effects: { relations: -3, media: 1, note: "w klubie zrobi\u0142o si\u0119 ch\u0142odno" } },
      { label: "Dobierasz trenera od st\xF3jki", desc: "Prywatne treningi poza klubem.", effects: { money: -4e3, relations: -1, stats: { stand: 1 } } }
    ]
  },
  {
    id: "naro\u017Cnik_mlody",
    title: "Naro\u017Cnik dla m\u0142odego",
    weight: 3,
    cond: (s) => s.tier >= 2 && s.age >= 25,
    text: () => "Dziewi\u0119tnastolatek z twojego klubu jedzie na pierwsze amatorskie zawody. Prosi, \u017Ceby\u015B stan\u0105\u0142 mu w naro\u017Cniku. M\xF3wi, \u017Ce ogl\u0105da wszystkie twoje walki.",
    choices: () => [
      { label: "Jedziesz z nim", desc: "Sobota w hali sportowej zamiast regeneracji.", test: "iq", success: { rep: 3, relations: 2, note: "m\u0142ody wygrywa, w naro\u017Cniku si\u0119 pop\u0142aka\u0142" }, fail: { rep: 1, relations: 1, note: "przegra\u0142, ale wie, \u017Ce nie by\u0142 sam" }, successText: "Mi\u0119dzy rundami m\xF3wisz mu trzy zdania. W trzeciej rundzie obala i wygrywa na punkty. Rzuca ci si\u0119 na szyj\u0119.", failText: "M\u0142ody przegrywa na punkty, ale po walce m\xF3wi, \u017Ce twoje wskaz\xF3wki to by\u0142a najlepsza lekcja w jego \u017Cyciu." },
      { label: "Odmawiasz", desc: "Masz w\u0142asny ob\xF3z.", effects: { form: 1, relations: -1 } }
    ]
  },
  {
    id: "antydoping",
    title: "Kontrola antydopingowa",
    weight: 2,
    cond: (s) => s.tier >= 2,
    text: () => "Sz\xF3sta rano, dzwonek do drzwi. Dw\xF3ch pan\xF3w z walizeczk\u0105: kontrola antydopingowa poza zawodami. S\u0105siadka wygl\u0105da przez wizjer i pyta, czy to kurier, bo ona te\u017C czeka na paczk\u0119.",
    choices: () => [
      { label: "Otwierasz i oddajesz pr\xF3bk\u0119", desc: "Nie masz nic do ukrycia.", effects: { rep: 1, note: "wynik czysty" } },
      { label: "Prosisz o dziesi\u0119\u0107 minut", desc: "Musisz si\u0119 ogarn\u0105\u0107.", chance: 65, success: { note: "kontrolerzy czekaj\u0105, wynik czysty" }, fail: { rep: -4, media: 2, note: "portal pisze o \u201Eunikaniu kontroli\u201D" }, successText: "Kontrolerzy czekaj\u0105 na klatce schodowej. Wynik jest czysty i nikt o tym nie s\u0142yszy.", failText: "Dziesi\u0119\u0107 minut wystarcza, \u017Ceby kto\u015B z s\u0105siad\xF3w zrobi\u0142 zdj\u0119cie. Tydzie\u0144 p\xF3\u017Aniej portal pisze o \u201Eunikaniu kontroli\u201D." }
    ]
  },
  {
    id: "sparing_nowy",
    title: "Nowy na sparingach",
    weight: 3,
    cond: (s) => mid(s),
    text: () => "Na sparingi przychodzi nowy, ci\u0119\u017Cki ch\u0142opak z Ukrainy. Od pierwszej minuty idzie na sto procent, jakby to by\u0142 fina\u0142 mistrzostw.",
    choices: () => [
      { label: "Odpowiadasz tym samym", desc: "Poka\u017Cesz mu, gdzie jest.", test: "chin", success: { stats: { chin: 1, stand: 1 }, wear: 2, note: "od jutra sparuje spokojniej" }, fail: { wear: 6, form: -2, note: "tydzie\u0144 z b\xF3lem g\u0142owy" }, successText: "Po dw\xF3ch rundach on \u0142apie oddech, a ty dalej idziesz. Od jutra sparuje spokojniej i szanuje ci\u0119 na sali.", failText: "\u0141apiesz czysty prawy i siadasz na macie. Przez tydzie\u0144 boli ci\u0119 g\u0142owa." },
      { label: "M\xF3wisz mu, \u017Ceby zwolni\u0142", desc: "Sparing to nie walka.", effects: { relations: 1, form: 1 } },
      { label: "Robisz z nim tylko zapasy", desc: "Bez uderze\u0144, technika.", effects: { stats: { wrest: 1 } } }
    ]
  },
  {
    id: "oboz_wielki_klub",
    title: "Zaproszenie na ob\xF3z",
    weight: 2,
    cond: (s) => s.tier >= 2 && s.rank !== null && s.rank <= 6,
    text: (s) => `Najmocniejszy klub w kraju zaprasza ci\u0119 na dwa tygodnie obozu z ich czo\u0142\xF3wk\u0105. Koszty pobytu po twojej stronie: ${zl6(cash(s, 0.05, 2e3, 15e3))}. Tw\xF3j trener udaje, \u017Ce si\u0119 cieszy.`,
    choices: (s) => [
      { label: "Jedziesz", desc: "Sparingi z najlepszymi w Polsce.", effects: { money: -cash(s, 0.05, 2e3, 15e3), stats: { wrest: 1, iq: 1 }, relations: -1 } },
      { label: "Zostajesz w swoim klubie", desc: "Lojalno\u015B\u0107 te\u017C co\u015B znaczy.", effects: { relations: 3 } }
    ]
  },
  {
    id: "weteran_mentor",
    title: "Rada od weterana",
    weight: 2,
    cond: (s) => s.tier >= 1 && s.tier <= 3 && s.age >= 22 && s.age <= 29,
    text: () => "Po gali w kuluarach zaczepia ci\u0119 by\u0142y mistrz Europy, dzi\u015B trener. \u201EMasz papiery, ale bijesz si\u0119 g\u0142upio. Przyjed\u017A do mnie na tydzie\u0144, poka\u017C\u0119 ci, gdzie tracisz rundy\u201D.",
    choices: () => [
      { label: "Jedziesz na tydzie\u0144", desc: "Kanapa u niego w salonie, trening trzy razy dziennie.", effects: { stats: { iq: 2 }, form: 1, money: -1500 } },
      { label: "Dzi\u0119kujesz grzecznie", desc: "Masz swojego trenera.", effects: { relations: 1 } }
    ]
  },
  {
    id: "podcast_duzy",
    title: "Zaproszenie do podcastu",
    weight: 2,
    cond: (s) => s.tier >= 2 && s.media >= 25,
    text: () => "Najpopularniejszy podcast o sportach walki chce trzygodzinn\u0105 rozmow\u0119. Prowadz\u0105cy lubi pyta\u0107 o pieni\u0105dze, s\u0119dzi\xF3w i konflikty.",
    choices: () => [
      { label: "M\xF3wisz szczerze", desc: "O wyrzeczeniach, d\u0142ugach i pierwszych walkach.", effects: { rep: 2, media: 3 } },
      { label: "Rzucasz kontrowersyjne teksty", desc: "Klipy same si\u0119 zrobi\u0105.", effects: { media: 6, rep: -3 } },
      { label: "Odmawiasz", desc: "Trzy godziny to ca\u0142y trening.", effects: { form: 1 } }
    ]
  },
  {
    id: "kontuzja_sparing_mid",
    title: "Kolano na sparingu",
    weight: 2,
    cond: (s) => s.tier >= 1 && s.age >= 24 && !s.injury,
    text: () => "Przy obronie obalenia co\u015B strzela w kolanie. Ortopeda m\xF3wi, \u017Ce to naci\u0105gni\u0119cie, ale \u201Elepiej odpu\u015Bci\u0107 na kilka tygodni\u201D.",
    choices: () => [
      { label: "Odpuszczasz cztery tygodnie", desc: "Rehabilitacja i rower stacjonarny.", effects: { form: -2, wear: -2 } },
      { label: "Trenujesz z ortez\u0105", desc: "Ob\xF3z nie poczeka.", chance: 55, success: { form: 1, note: "kolano wytrzyma\u0142o" }, fail: { injury: { name: "naderwane wi\u0119zad\u0142o w kolanie", seasons: 1, penalty: 6 }, note: "kolano nie wytrzyma\u0142o" }, successText: "Orteza trzyma, kolano te\u017C. Po obozie nikt nie pami\u0119ta, \u017Ce co\u015B strzeli\u0142o.", failText: "Na trzecim treningu kolano ucieka w bok. Tym razem to naderwane wi\u0119zad\u0142o." }
    ]
  },
  // ---------- Schyłek kariery ----------
  {
    id: "mlody_wilk",
    title: "M\u0142ody wilk",
    weight: 3,
    cond: (s) => s.age >= 31 && s.tier >= 1 && s.contract.kind !== "freak",
    text: () => "Dwudziestolatek z niepokonanym rekordem nagrywa filmik: \u201ESzanuj\u0119 weteran\xF3w, ale czas ust\u0105pi\u0107 miejsca. Daj mi walk\u0119 albo id\u017A na emerytur\u0119\u201D.",
    choices: () => [
      { label: "Przyjmujesz wyzwanie", desc: "Poka\u017Cesz mu, czym jest do\u015Bwiadczenie.", effects: { media: 3, form: 2, note: "motywacja na ca\u0142y rok" } },
      { label: "Odpowiadasz z klas\u0105", desc: "\u201EPowodzenia, m\u0142ody. Zobaczymy si\u0119 kiedy\u015B.\u201D", effects: { rep: 2 } },
      { label: "Wy\u015Bmiewasz go", desc: "\u201EJak sko\u0144czysz liceum, pogadamy.\u201D", effects: { media: 2, rep: -1 } }
    ]
  },
  {
    id: "cialo_mowi_dosc",
    title: "Cia\u0142o m\xF3wi swoje",
    weight: 3,
    cond: (s) => s.age >= 32 && s.wear >= 30,
    text: () => "Rano schodzenie z \u0142\xF3\u017Cka zajmuje ci dwie minuty. Barki strzelaj\u0105, kolana trzeszcz\u0105, a po sparingu potrzebujesz trzech dni zamiast jednego.",
    choices: (s) => [
      { label: "Fizjoterapia i joga", desc: `Dwa razy w tygodniu, ${zl6(cash(s, 0.03, 1e3, 12e3))} za rok.`, effects: { money: -cash(s, 0.03, 1e3, 12e3), wear: -6 } },
      { label: "Mniej sparing\xF3w", desc: "Wi\u0119cej techniki, mniej wojny.", effects: { wear: -3, form: -1 } },
      { label: "Zaciskasz z\u0119by", desc: "Odpoczniesz na emeryturze.", effects: { wear: 3, form: 1 } }
    ]
  },
  {
    id: "oferta_trenerska",
    title: "Propozycja trenerska",
    weight: 2,
    cond: (s) => s.age >= 33 && s.tier >= 2,
    text: () => "Klub z twojego wojew\xF3dztwa proponuje ci prowadzenie grupy zawodniczej. Na razie dwa razy w tygodniu, a po karierze pe\u0142en etat.",
    choices: (s) => [
      { label: "Bierzesz grup\u0119", desc: "Pierwsze kroki jako trener.", effects: { money: cash(s, 0.03, 2e3, 2e4), relations: 2, stats: { iq: 1 }, form: -1 } },
      { label: "Jeszcze nie teraz", desc: "Najpierw kariera.", effects: { form: 1 } }
    ]
  },
  {
    id: "pozegnanie_pytanie",
    title: "Pytanie o emerytur\u0119",
    weight: 2,
    cond: (s) => s.age >= 34 && s.tier >= 1,
    text: () => "Na konferencji dziennikarz pyta wprost: \u201EIle jeszcze walk przed tob\u0105? Nie my\u015Blisz o tym, \u017Ceby sko\u0144czy\u0107, p\xF3ki jeste\u015B zdrowy?\u201D. Na sali robi si\u0119 cicho.",
    choices: () => [
      { label: "\u201ESko\u0144cz\u0119, kiedy przestan\u0119 wygrywa\u0107\u201D", desc: "Pewnie i bez wahania.", effects: { media: 2, form: 1 } },
      { label: "\u201EMy\u015Bl\u0119 o tym codziennie\u201D", desc: "Szczerze, jak nigdy.", effects: { rep: 2, note: "kibice doceniaj\u0105 szczero\u015B\u0107" } }
    ]
  }
];

// src/engine/events.ts
var tys = (n) => n;
var EVENTS = [
  // ---------- Młodość ----------
  {
    id: "matura",
    title: "Matura",
    once: true,
    weight: 6,
    cond: (s) => s.age >= 17 && s.age <= 18,
    text: () => "Matura za pasem. Mama stawia spraw\u0119 jasno: do maja \u017Cadnych trening\xF3w, bo \u201Ez klatki rachunk\xF3w nie zap\u0142acisz\u201D.",
    choices: () => [
      { label: "Odpuszczasz do matury", desc: "Ksi\u0105\u017Cki zamiast worka. Mama p\u0142acze ze szcz\u0119\u015Bcia.", effects: { relations: 2, form: -3, note: "\u015Bwiadectwo w ramce" } },
      { label: "Trenujesz po kryjomu", desc: "M\xF3wisz, \u017Ce idziesz na korepetycje z matmy.", effects: { relations: -2, stats: { cardio: 2 } } }
    ]
  },
  {
    id: "kebab_sponsor",
    title: "Sponsor spod bloku",
    once: true,
    weight: 7,
    cond: (s) => s.age <= 21 && s.tier <= 1,
    text: () => "Pan Ahmed z kebaba pod blokiem widzia\u0142 twoj\u0105 walk\u0119 na telefonie siostrze\u0144ca. Chce da\u0107 logo na spodenki.",
    choices: () => [
      {
        label: "Bierzesz",
        desc: "Kasa niedu\u017Ca, ale pita po ka\u017Cdej walce gratis.",
        effects: { sponsor: { name: "Kebab u Ahmeda", perSeason: tys(1500), seasonsLeft: 2, clause: "zdj\u0119cie z rollo po ka\u017Cdej wygranej" }, media: 1 }
      },
      { label: "Dzi\u0119kujesz i odmawiasz", desc: "Czekasz na powa\u017Cniejszego sponsora.", effects: { rep: 1 } }
    ]
  },
  {
    id: "dyskoteka",
    title: "Zadyma na dyskotece",
    once: true,
    weight: 5,
    cond: (s) => s.age >= 17 && s.age <= 23,
    text: () => "Sobota, dyskoteka w s\u0105siedniej gminie. Trzech go\u015Bci zaczepia kole\u017Cank\u0119 z twojej paczki. Patrz\u0105 na ciebie, bo \u201Ety niby od tego MMA\u201D.",
    choices: () => [
      { label: "Zabierasz j\u0105 i wychodzicie", desc: "Trener zawsze powtarza, \u017Ce prawdziwa walka jest w klatce.", effects: { rep: 2, relations: 1 } },
      {
        label: "Pokazujesz, czego si\u0119 nauczy\u0142e\u015B",
        desc: "Kto\u015B na pewno nagrywa.",
        chance: 45,
        success: { media: 4, rep: -2, note: "nagranie leci po grupach" },
        fail: { rep: -6, injury: { name: "z\u0142amana r\u0119ka", seasons: 1, penalty: 6 }, note: "trener w\u015Bciek\u0142y" },
        successText: "Trzy ruchy, trzech na ziemi. Nagranie ma 200 tys. wy\u015Bwietle\u0144, trener udaje, \u017Ce nie widzia\u0142.",
        failText: "Czwarty kolega wyszed\u0142 z toalety. R\u0119ka w gipsie, a trener nie odbiera telefonu."
      }
    ]
  },
  {
    id: "kadra_zapasy",
    title: "Zgrupowanie w Spale",
    once: true,
    weight: 5,
    cond: (s) => s.age <= 20,
    text: () => "Trener kadry zapa\u015Bniczej junior\xF3w zaprasza na dwutygodniowe zgrupowanie w Spale. Za ob\xF3z trzeba dop\u0142aci\u0107.",
    choices: () => [
      { label: "Jedziesz", desc: "Dwa tygodnie wylewania potu i zupy pomidorowej.", effects: { money: -2e3, stats: { wrest: 4, cardio: 1 } } },
      { label: "Zostajesz w klubie", desc: "Szkoda kasy.", effects: {} }
    ]
  },
  {
    id: "holandia",
    title: "Lato w Holandii",
    once: true,
    weight: 6,
    cond: (s) => s.age >= 18 && s.age <= 22 && s.money < 8e3,
    text: () => "Wujek za\u0142atwia robot\u0119 przy pomidorach w Holandii na ca\u0142e lato. P\u0142ac\u0105 w euro, ale treningi trzeba zawiesi\u0107.",
    choices: () => [
      { label: "Jedziesz na pomidory", desc: "Kasa si\u0119 zgadza, forma niekoniecznie.", effects: { money: 9e3, form: -4 } },
      { label: "Zostajesz trenowa\u0107", desc: "Wujek obra\u017Cony do Wigilii.", effects: { relations: -1, stats: { cardio: 1, stand: 1 } } }
    ]
  },
  {
    id: "sparingpartner_rzuca",
    title: "Kolega rzuca MMA",
    once: true,
    weight: 4,
    cond: (s) => s.age <= 22,
    text: () => "Tw\xF3j najlepszy sparingpartner rzuca MMA. Teraz robi \u201Emas\u0119\u201D na si\u0142owni i namawia ci\u0119, \u017Ceby\u015B te\u017C odpu\u015Bci\u0142 techniczne treningi.",
    choices: () => [
      { label: "Zostajesz przy macie", desc: "Technika ponad bicepsy.", effects: { stats: { bjj: 1, iq: 1 } } },
      { label: "Idziesz z nim na mas\u0119", desc: "Lepiej wygl\u0105dasz na pla\u017Cy.", effects: { stats: { chin: 2, cardio: -2 }, media: 2 } }
    ]
  },
  {
    id: "ojciec_przekonany",
    title: "Ojciec na trybunach",
    once: true,
    weight: 5,
    cond: (s) => s.record.w + s.amRecord.w >= 3 && s.age <= 21,
    text: () => "Ojciec pierwszy raz przyszed\u0142 na twoj\u0105 walk\u0119. Po wszystkim m\xF3wi tylko \u201Eno dobra\u201D i wciska ci do r\u0119ki kopert\u0119.",
    choices: () => [
      { label: "Bierzesz kopert\u0119", desc: "Nie wypada odm\xF3wi\u0107.", effects: { money: 3e3, relations: 2 } },
      { label: "\u201ETato, nie trzeba\u201D", desc: "Duma te\u017C co\u015B znaczy.", effects: { relations: 3, rep: 1 } }
    ]
  },
  {
    id: "wazenie_amator",
    title: "Wa\u017Cenie o si\xF3dmej rano",
    weight: 5,
    cond: (s) => s.tier === 0,
    text: () => "Wa\u017Cenie przed turniejem, tolerancja zerowa. Waga pokazuje 300 gram\xF3w za du\u017Co, a do zamkni\u0119cia listy zosta\u0142o czterdzie\u015Bci minut.",
    choices: () => [
      { label: "Skakanka w kurtce", desc: "Pocisz si\u0119 w toalecie i wchodzisz na wag\u0119 na styk.", effects: { form: -1 } },
      {
        label: "Startujesz kategori\u0119 wy\u017Cej",
        desc: "Bez zbijania, ale rywale b\u0119d\u0105 wi\u0119ksi.",
        chance: 50,
        success: { form: 2, note: "wy\u017Cej czujesz si\u0119 jak u siebie" },
        fail: { form: -4, note: "rywale wi\u0119ksi o g\u0142ow\u0119" },
        successText: "Pe\u0142ny brzuch, pe\u0142no si\u0142y. W wy\u017Cszej wadze nikt nie jest szybszy od ciebie.",
        failText: "Pierwszy rywal jest o g\u0142ow\u0119 wy\u017Cszy i o osiem kilo ci\u0119\u017Cszy. Czujesz ka\u017Cdy jego cios."
      }
    ]
  },
  {
    id: "otwarta_mata",
    title: "Otwarta mata w niedziele",
    once: true,
    weight: 4,
    cond: (s) => s.tier === 0,
    text: () => "Czarny pas BJJ z innego klubu robi w niedziele otwart\u0105 mat\u0119. Za darmo, tylko trzeba dojecha\u0107 godzin\u0119 w jedn\u0105 stron\u0119.",
    choices: () => [
      { label: "Je\u017Adzisz co tydzie\u0144", desc: "Niedziele w kimonie zamiast obiadu u babci.", effects: { stats: { bjj: 3 }, relations: -1 } },
      { label: "Szkoda niedziel", desc: "Raz w tygodniu trzeba odpocz\u0105\u0107.", effects: { relations: 1 } }
    ]
  },
  {
    id: "zawody_szkolne",
    title: "Zawody szkolne",
    once: true,
    weight: 4,
    cond: (s) => s.tier === 0 && s.age <= 18,
    text: () => "Wuefista chce, \u017Ceby\u015B reprezentowa\u0142 szko\u0142\u0119 na powiatowych zawodach w zapasach. Termin wypada tydzie\u0144 przed Pucharem Polski.",
    choices: () => [
      { label: "Jedziesz za szko\u0142\u0119", desc: "Dyrektor wspomni o tobie na apelu.", effects: { stats: { wrest: 1 }, relations: 1, rep: 1, form: -1 } },
      { label: "Odmawiasz", desc: "Liczy si\u0119 Puchar.", effects: { form: 1 } }
    ]
  },
  {
    id: "gg_cup",
    title: "Ground Game Cup",
    brand: "cup",
    once: true,
    weight: 5,
    cond: (s) => s.tier <= 2 && s.age <= 30,
    text: () => "Ground Game robi turniej grapplingowy bez uderze\u0144: Ground Game Cup. Wpisowe 150 z\u0142, medale i nagrody od marki. Trener m\xF3wi, \u017Ce lepszego sparingu w parterze nie znajdziesz.",
    choices: () => [
      {
        label: "Startujesz",
        desc: "Kimono do torby i jazda.",
        test: "bjj",
        success: { money: -150, stats: { bjj: 2 }, media: 2, rep: 1, note: "z\u0142oto Ground Game Cup" },
        fail: { money: -150, stats: { bjj: 1 }, note: "wiesz ju\u017C, nad czym pracowa\u0107" },
        successText: "Cztery walki, trzy poddania. Z\u0142oty medal i nowa bluza z logo marki.",
        failText: "Odpadasz w drugiej rundzie po ciasnej gilotynie. Przynajmniej wiesz, czego si\u0119 uczy\u0107."
      },
      { label: "Odpuszczasz", desc: "Ten weekend na odpoczynek.", effects: {} }
    ]
  },
  {
    id: "gg_camp",
    title: "Ground Game Camp",
    brand: "camp",
    once: true,
    weight: 5,
    cond: (s) => s.tier <= 3 && s.money >= 3e3,
    text: () => "Letni ob\xF3z Ground Game Camp: tydzie\u0144 trening\xF3w z zawodnikami z ca\u0142ej Polski. Zapasy rano, parter wieczorem, a w \u015Brodku ognisko. Koszt 2500 z\u0142 z noclegiem.",
    choices: () => [
      { label: "Jedziesz", desc: "Tydzie\u0144, po kt\xF3rym ledwo chodzisz.", effects: { money: -2500, stats: { wrest: 2, bjj: 2 }, form: 1 } },
      { label: "Zostajesz w domu", desc: "Szkoda pieni\u0119dzy.", effects: {} }
    ]
  },
  {
    id: "gg_academy",
    title: "Seminarium w Ground Game Academy",
    brand: "academy",
    once: true,
    weight: 4,
    cond: (s) => s.tier <= 2,
    text: () => "Ground Game Academy robi seminarium z czarnym pasem z Brazylii. Trzy godziny walki z do\u0142u i obron przed duszeniami. Wej\u015Bcie 300 z\u0142.",
    choices: () => [
      { label: "Idziesz", desc: "Notes w torbie, kimono wyprane.", effects: { money: -300, stats: { bjj: 2 } } },
      { label: "Nie dzi\u015B", desc: "Masz sw\xF3j plan treningowy.", effects: {} }
    ]
  },
  {
    id: "gg_labs",
    title: "Ground Game Labs",
    brand: "labs",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.media >= 8,
    text: () => "Ground Game Labs szuka zawodnik\xF3w do testowania nowych spodenek przed premier\u0105. Trzeba w nich trenowa\u0107 przez miesi\u0105c i napisa\u0107 szczer\u0105 opini\u0119.",
    choices: () => [
      { label: "Zg\u0142aszasz si\u0119", desc: "Nowy sprz\u0119t, zanim trafi do sklepu.", effects: { media: 2, rep: 1, note: "spodenki przed premier\u0105" } },
      { label: "Nie masz czasu", desc: "Ob\xF3z si\u0119 sam nie zrobi.", effects: {} }
    ]
  },
  // ---------- Start kariery: sparing kontrolny u trenera (kolejkowany przy pierwszym roku) ----------
  {
    id: "sparing_kontrolny",
    title: "Sparing kontrolny",
    once: true,
    weight: 0,
    cond: () => false,
    text: (s) => {
      const partners = [
        ["Markiem z sekcji BJJ", "Br\u0105zowy pas, na macie sp\u0119dzi\u0142 wi\u0119cej czasu ni\u017C ty na \u015Bwiecie."],
        ["Darkiem, by\u0142ym bokserem z ligi okr\u0119gowej", "Nos \u0142amany trzy razy, za ka\u017Cdym razem si\u0119 nie przej\u0105\u0142."],
        ["Kub\u0105, zapa\u015Bnikiem z AZS", "Podobno rozgrzewa si\u0119 z workami piasku."],
        ["Paw\u0142em, kickbokserem z amatorskim pasem K-1", "Szybszy, ni\u017C wygl\u0105da."]
      ];
      const [who, about] = partners[(s.profile.lastName.length + s.profile.firstName.length) % partners.length];
      if (s.seenEvents.includes("prolog_ekipa")) {
        const t = clubCoachName(s.club);
        return [
          `${t}: ${s.profile.firstName}, sze\u015B\u0107 tygodni min\u0119\u0142o. W czwartek sparing kontrolny.`,
          `${t}: Staniesz z ${who}. ${about}`,
          `${t}: Trzy rundy, zasady MMA. Nie musisz wygra\u0107. Chc\u0119 zobaczy\u0107, co w tobie siedzi, bo od tego zale\u017Cy, gdzie pojedziesz na pierwsze zawody.`,
          `${t}: Masz jaki\u015B plan?`
        ].join("\n");
      }
      return `${START_PROFILES[s.profile.start].intro}

Po kilku tygodniach trening\xF3w trener ka\u017Ce ci wyj\u015B\u0107 na sparing z ${who}. ${about} \u201ETrzy rundy, zasady MMA. Nie musisz wygra\u0107, chc\u0119 zobaczy\u0107, co w tobie siedzi. Od tego zale\u017Cy, gdzie ci\u0119 wy\u015Bl\u0119 na pierwsze amatorskie zawody.\u201D`;
    },
    choices: (s) => {
      const ch = (v) => Math.max(25, Math.min(80, Math.round(30 + (v - 20) * 3.5)));
      const ok = { flag: "amTalent", form: 1, rep: 1, note: "od razu zawody og\xF3lnopolskie" };
      const slow = { flag: "amLocal", note: "najpierw zawody wojew\xF3dzkie" };
      if (s.seenEvents.includes("prolog_ekipa")) {
        const t = clubCoachName(s.club);
        const okText2 = `czwartek, po sparingu
${t}: D\u0142ugo nic nie m\xF3wi\u0142em, bo my\u015Bla\u0142em.
${t}: Masz to co\u015B. Jedziesz od razu na Amatorski Puchar Polski.
${t}: Tylko si\u0119 nie podniecaj. Jutro 7:00, bieganie.`;
        const slowText2 = `czwartek, po sparingu
${t}: Dosta\u0142e\u015B, ale wstawa\u0142e\u015B. To si\u0119 liczy.
${t}: Na pocz\u0105tek zawody wojew\xF3dzkie, tam si\u0119 otrzaskasz. Za rok pogadamy o Pucharze Polski.
${t}: I przy\u0142\xF3\u017C l\xF3d na to oko.`;
        return [
          { label: "Wymieni\u0119 z nim w st\xF3jce. R\u0119ce wysoko.", desc: "st\xF3jka", chance: ch(s.stats.stand), success: ok, fail: slow, successText: okText2, failText: slowText2 },
          { label: "P\xF3jd\u0119 w nogi i przycisn\u0119 go do siatki.", desc: "zapasy", chance: ch(s.stats.wrest), success: ok, fail: slow, successText: okText2, failText: slowText2 },
          { label: "Na spokojnie. Poczytam go i skontruj\u0119.", desc: "taktyka", chance: ch(s.stats.iq), success: ok, fail: slow, successText: okText2, failText: slowText2 }
        ];
      }
      const okText = "Trener d\u0142ugo nic nie m\xF3wi, potem kiwa g\u0142ow\u0105: \u201EMasz to co\u015B. Jedziesz od razu na Amatorski Puchar Polski.\u201D";
      const slowText = "Trener klepie ci\u0119 w rami\u0119: \u201EDobra, wyrobisz si\u0119. Na pocz\u0105tek wy\u015Blemy ci\u0119 na zawody wojew\xF3dzkie, tam si\u0119 otrzaskasz. Za rok pogadamy.\u201D";
      return [
        { label: "Wymieniasz w st\xF3jce", desc: "R\u0119ce wysoko, kombinacje, praca na nogach.", chance: ch(s.stats.stand), success: ok, fail: slow, successText: okText, failText: slowText },
        { label: "Idziesz w zapasy", desc: "Wej\u015Bcie w nogi i kontrola przy siatce.", chance: ch(s.stats.wrest), success: ok, fail: slow, successText: okText, failText: slowText },
        { label: "Walczysz g\u0142ow\u0105", desc: "Spokojnie, czytasz go i kontrujesz.", chance: ch(s.stats.iq), success: ok, fail: slow, successText: okText, failText: slowText }
      ];
    }
  },
  // ---------- Kariera ----------
  {
    id: "menedzer",
    title: "Mened\u017Cer po gali",
    once: true,
    weight: 6,
    cond: (s) => s.tier >= 1 && s.tier <= 2 && s.record.w >= 3 && !s.manager && !s.flags.manager,
    text: () => "Po gali podchodzi Kamil Wro\u0144ski z KW Fight: okulary przeciws\u0142oneczne, cho\u0107 jest 23:00, i dwa telefony w r\u0119ku. M\xF3wi, \u017Ce \u201Ezna wszystkich w federacji\u201D i chce 15% od ka\u017Cdej ga\u017Cy.",
    choices: () => [
      {
        label: "Podpisujesz",
        desc: "Mo\u017Ce faktycznie zna.",
        chance: 55,
        success: { media: 5, flag: "manager", note: "lepsze oferty kontrakt\xF3w" },
        fail: { money: -4e3, rep: -2, note: "znikn\u0105\u0142 z zaliczk\u0105" },
        successText: "Faktycznie zna. Telefon dzwoni cz\u0119\u015Bciej, a ga\u017Ce rosn\u0105.",
        failText: "Po tygodniu zablokowa\u0142 tw\xF3j numer. Zaliczka 4 tys. z\u0142 przepad\u0142a."
      },
      { label: "Odmawiasz", desc: "Sam ogarniesz swoje kontrakty.", effects: { rep: 1 } }
    ]
  },
  {
    id: "konferencja",
    title: "Konferencja przed gal\u0105",
    weight: 5,
    cond: (s) => s.tier >= 1,
    text: () => "Konferencja przed gal\u0105. Rywal na \u017Cywo obra\u017Ca twoj\u0105 mam\u0119 i rzuca w ciebie butelk\u0105 wody.",
    choices: (s) => [
      { label: "Odpowiadasz klas\u0105", desc: "\u201EPogadamy w klatce\u201D. Dziennikarze kiwaj\u0105 g\u0142owami.", effects: { rep: 3 } },
      { label: "Wywracasz st\xF3\u0142", desc: "Ochrona ledwo was rozdziela. Klipy lec\u0105 wsz\u0119dzie.", effects: { media: 6, rep: -3, money: -cash(s, 0.015, 1e3), note: "kara od federacji" } }
    ]
  },
  {
    id: "dieta_influencer",
    title: "Dieta z Instagryma",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.media >= 10,
    text: () => "Influencerka fitness oferuje \u201Eautorski plan zbijania wagi na sucho\u201D w zamian za reklam\u0119 na twoim profilu.",
    choices: () => [
      {
        label: "Wchodzisz w to",
        desc: "Dieta z Instagryma, co mo\u017Ce p\xF3j\u015B\u0107 nie tak.",
        chance: 55,
        success: { money: 3e3, form: 2, media: 2 },
        fail: { money: 3e3, form: -5, note: "wa\u017Cenie na granicy omdlenia" },
        successText: "O dziwo dzia\u0142a. Wchodzisz w wag\u0119 lekko jak pi\xF3rko.",
        failText: "Na wa\u017Ceniu widzisz trzy wagi i dw\xF3ch s\u0119dzi\xF3w. Forma leci w d\xF3\u0142."
      },
      { label: "Zostajesz przy dietetyku z klubu", desc: "Nudne, ale sprawdzone.", effects: { rep: 1 } }
    ]
  },
  {
    id: "kolano",
    title: "Kolano",
    weight: 4,
    cond: (s) => s.age >= 21 && !s.injury,
    text: () => "Na ostatnim sparingu przed startem kolano strzela jak ga\u0142\u0105\u017A. Lekarz m\xF3wi o \u0142\u0105kotce.",
    choices: () => [
      { label: "Operacja", desc: "Kosztuje i troch\u0119 potrwa, ale kolano b\u0119dzie jak nowe.", effects: { money: -12e3, form: -3, healInjury: true } },
      { label: "Walczysz na blokadzie", desc: "Jako\u015B to b\u0119dzie.", effects: { injury: { name: "kolano na blokadzie", seasons: 1, penalty: 5 }, wear: 6 } }
    ]
  },
  {
    id: "suplement",
    title: "Suplement z Turcji",
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: () => "Kolega z si\u0142owni daje ci \u201Eca\u0142kowicie legalny\u201D suplement z Turcji. Na opakowaniu same krzaczki i zdj\u0119cie byka.",
    choices: () => [
      { label: "Wyrzucasz do kosza", desc: "Kontrole antydopingowe nie wybaczaj\u0105.", effects: { rep: 1 } },
      {
        label: "Pr\xF3bujesz raz",
        desc: "Byk na opakowaniu wygl\u0105da przekonuj\u0105co.",
        chance: 65,
        success: { stats: { cardio: 3, chin: 1 } },
        fail: { rep: -15, media: 6, form: -8, note: "pozytywny test, zawieszenie" },
        successText: "Nic si\u0119 nie sta\u0142o. Mo\u017Ce to by\u0142a po prostu kreatyna. Mo\u017Ce.",
        failText: "Kontrola o 6 rano. Wynik pozytywny. P\xF3\u0142 Polski pisze o tobie memy."
      }
    ]
  },
  {
    id: "kielbasa_reklama",
    title: "Reklama kie\u0142basy",
    once: true,
    weight: 6,
    cond: (s) => s.media >= 25,
    text: () => "Zak\u0142ady Mi\u0119sne \u201EDzik\u201D chc\u0105 ci\u0119 do reklamy kie\u0142basy grillowej. Masz ugry\u017A\u0107 kie\u0142bas\u0119 i powiedzie\u0107 \u201Esi\u0142a z natury\u201D.",
    choices: () => [
      {
        label: "Gryziesz kie\u0142bas\u0119",
        desc: "Nikt nie przeczyta umowy do ko\u0144ca.",
        effects: { sponsor: { name: "ZM \u201EDzik\u201D", perSeason: tys(2e4), seasonsLeft: 3, clause: "\u201Esi\u0142a z natury\u201D w ka\u017Cdym wywiadzie" }, media: 3, rep: -1 }
      },
      { label: "Jeste\u015B wegetarianinem od wczoraj", desc: "Godno\u015B\u0107 nie na sprzeda\u017C.", effects: { rep: 2 } }
    ]
  },
  {
    id: "wesele",
    title: "Wesele siostry",
    once: true,
    weight: 5,
    cond: (s) => s.age >= 20,
    text: () => "Siostra bierze \u015Blub. Termin? Dok\u0142adnie w dniu wa\u017Cenia przed wa\u017Cn\u0105 walk\u0105. Rodzina m\xF3wi, \u017Ce nie wybaczy.",
    choices: () => [
      { label: "Idziesz na wesele", desc: "Woda zamiast w\xF3dki, ale i tak ta\u0144czysz do 4 rano.", effects: { relations: 4, form: -4 } },
      { label: "Jedziesz na wa\u017Cenie", desc: "Siostra wysy\u0142a ci tort na Mesend\u017Cerze.", effects: { relations: -4, rep: 1 } }
    ]
  },
  {
    id: "podcast",
    title: "Zaproszenie na podcast",
    weight: 4,
    cond: (s) => s.media >= 15,
    text: () => "Popularny podcaster zaprasza ci\u0119 na trzygodzinn\u0105 rozmow\u0119. Pytania o \u201Espiski federacji\u201D i \u201Eprawdziwych m\u0119\u017Cczyzn\u201D.",
    choices: () => [
      {
        label: "Idziesz i m\xF3wisz, co my\u015Blisz",
        desc: "Bez filtra.",
        chance: 55,
        success: { media: 6, rep: 1 },
        fail: { media: 4, rep: -4, note: "cytat wyrwany z kontekstu" },
        successText: "Wychodzisz na normalnego go\u015Bcia. Obserwuj\u0105cy lec\u0105 w g\xF3r\u0119.",
        failText: "Jedno zdanie o s\u0119dziach posz\u0142o w \u015Bwiat. Federacja nie jest zachwycona."
      },
      { label: "Odmawiasz", desc: "Czas na trening.", effects: { stats: { iq: 1 } } }
    ]
  },
  {
    id: "trener_dubaj",
    title: "Trener dostaje ofert\u0119",
    once: true,
    weight: 4,
    cond: (s) => s.club.quality >= 2 && s.clubSeasons >= 2,
    text: () => "Tw\xF3j trener dosta\u0142 ofert\u0119 z Dubaju: ma uczy\u0107 MMA syna szejka. Pyta, czy ma jecha\u0107.",
    choices: () => [
      { label: "Prosisz, \u017Ceby zosta\u0142", desc: "Dok\u0142adasz mu do pensji z w\u0142asnej kieszeni.", effects: { money: -6e3, relations: 1, form: 2 } },
      { label: "\u201EJed\u017A, trenerze\u201D", desc: "Szejkowie te\u017C musz\u0105 si\u0119 nauczy\u0107 d\u017Awigni.", effects: { form: -3, rep: 1 } }
    ]
  },
  {
    id: "sparing_mistrz",
    title: "Sparing z mistrzem \u015Bwiata",
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 2,
    text: () => "Mistrz \u015Bwiata przylatuje do Polski na seminarium i szuka mocnych sparingpartner\xF3w na trzy rundy.",
    choices: () => [
      {
        label: "Zg\u0142aszasz si\u0119",
        desc: "Albo si\u0119 czego\u015B nauczysz, albo obudzisz si\u0119 w karetce.",
        test: "chin",
        success: { stats: { stand: 2, iq: 3 }, media: 3 },
        fail: { injury: { name: "wstrz\u0105\u015Bnienie m\xF3zgu", seasons: 1, penalty: 5 }, wear: 6 },
        successText: "Wytrzyma\u0142e\u015B trzy rundy. Mistrz klepie ci\u0119 po plecach i m\xF3wi \u201Egood boy\u201D.",
        failText: "Druga minuta, lewy hak, sufit. Lekarz zabrania sparing\xF3w na miesi\u0105c."
      },
      { label: "Patrzysz z boku", desc: "Notatki te\u017C si\u0119 licz\u0105.", effects: { stats: { iq: 1 } } }
    ]
  },
  {
    id: "polozenie",
    title: "Propozycja w szatni",
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 1 && s.tier <= 3,
    text: () => "W szatni podchodzi typ w dresie z \u201Epropozycj\u0105 biznesow\u0105\u201D: 30 tys. z\u0142, je\u015Bli po\u0142o\u017Cysz si\u0119 w drugiej rundzie.",
    choices: (s) => [
      { label: "Odmawiasz i zg\u0142aszasz federacji", desc: "Sport ma by\u0107 czysty.", effects: { rep: 6, media: 2 } },
      { label: "Odmawiasz po cichu", desc: "Nie chcesz problem\xF3w.", effects: {} },
      {
        label: "Bierzesz kas\u0119",
        desc: "Jedna walka, nikt si\u0119 nie dowie.",
        chance: 50,
        success: { money: cash(s, 0.15, 2e4), rep: -10, form: -6, note: "przegrywasz walk\u0119 i szacunek do siebie" },
        fail: { money: cash(s, 0.15, 2e4), rep: -40, media: 10, flag: "banned", note: "afera, federacja zrywa kontrakt" },
        successText: "Nikt si\u0119 nie dowiedzia\u0142. Ty wiesz.",
        failText: "Nagranie z szatni wycieka. Afera na p\xF3\u0142 kraju, federacja rozwi\u0105zuje kontrakt."
      }
    ]
  },
  {
    id: "ultimatum",
    title: "Ultimatum",
    once: true,
    weight: 4,
    cond: (s) => s.age >= 21 && s.age <= 28,
    text: () => "Dziewczyna stawia spraw\u0119 jasno: \u201EAlbo ja, albo ta twoja klatka. Mam do\u015B\u0107 weekend\xF3w na galach w Pcimiu\u201D.",
    choices: () => [
      { label: "Wybierasz j\u0105", desc: "Mniej oboz\xF3w, wi\u0119cej wsp\xF3lnych niedziel.", effects: { relations: 4, form: -2, flag: "partner" } },
      { label: "Wybierasz klatk\u0119", desc: "Pakujesz torb\u0119 na trening.", effects: { relations: -3, stats: { iq: 1 }, form: 2 } }
    ]
  },
  {
    id: "ojciec_zostaniesz",
    title: "B\u0119dziesz ojcem",
    once: true,
    weight: 4,
    cond: (s) => s.age >= 24 && (s.flags.partner ?? 0) > 0,
    text: () => "Zostaniesz ojcem! Te\u015Bciowa ju\u017C planuje chrzciny, a ty liczysz, ile kosztuj\u0105 pieluchy.",
    choices: () => [
      { label: "Bierzesz wi\u0119cej walk", desc: "Dziecko musi mie\u0107 na buty.", effects: { relations: 2, flag: "kid", form: 2, note: "koszty \u017Cycia rosn\u0105" } },
      { label: "Zwalniasz tempo", desc: "Pierwsze kroki dziecka s\u0105 wa\u017Cniejsze.", effects: { relations: 5, flag: "kid", form: -3, note: "koszty \u017Cycia rosn\u0105" } }
    ]
  },
  {
    id: "kredyt_mieszkanie",
    title: "Kredyt na mieszkanie",
    once: true,
    weight: 4,
    cond: (s) => s.age >= 25 && s.money > 3e4,
    text: () => "Doradca w banku przekonuje, \u017Ce \u201Emieszkanie to najlepsza inwestycja\u201D i proponuje kredyt na 30 lat.",
    choices: () => [
      { label: "Podpisujesz", desc: "W\u0142asne cztery k\u0105ty. Raty co roku.", effects: { money: -25e3, loan: { amount: 0, installment: 9e3, count: 6 }, relations: 3, note: "wk\u0142ad w\u0142asny + raty" } },
      { label: "Wynajmujesz dalej", desc: "Elastyczno\u015B\u0107 przede wszystkim.", effects: {} }
    ]
  },
  {
    id: "myjnia",
    title: "Myjnia kumpla",
    once: true,
    weight: 4,
    cond: (s) => s.money >= 2e4,
    text: () => "Kumpel z osiedla otwiera myjni\u0119 bezdotykow\u0105 i proponuje, \u017Ceby\u015B wszed\u0142 jako wsp\xF3lnik za 15 tys. z\u0142.",
    choices: () => [
      {
        label: "Inwestujesz",
        desc: "\u201ESamochody zawsze b\u0119d\u0105 brudne\u201D.",
        chance: 50,
        success: { money: 25e3, note: "myjnia zarabia" },
        fail: { money: -15e3, relations: -1, note: "myjnia splajtowa\u0142a" },
        successText: "Myjnia zarabia lepiej ni\u017C ty w klatce. Kumpel stawia kolacj\u0119.",
        failText: "Po p\xF3\u0142 roku na myjni wisi kartka \u201Elokal do wynaj\u0119cia\u201D. Kumpel nie odbiera."
      },
      { label: "Odmawiasz", desc: "Skupiasz si\u0119 na sporcie.", effects: {} }
    ]
  },
  {
    id: "insta_3am",
    title: "Wpis o trzeciej w nocy",
    weight: 4,
    cond: (s) => s.media >= 10,
    text: () => "O trzeciej w nocy wrzuci\u0142e\u015B na Instagryma d\u0142ugi wpis o tym, \u017Ce \u201Ewszyscy w polskim MMA to leszcze\u201D. Rano ma 4 tys. komentarzy.",
    choices: () => [
      { label: "Przepraszasz", desc: "\u201ETo nie ja, to emocje\u201D.", effects: { rep: 1, media: -1 } },
      { label: "Brniesz dalej", desc: "Nagrywasz drug\u0105 cz\u0119\u015B\u0107.", effects: { media: 6, rep: -4 } }
    ]
  },
  {
    id: "nagroda_gminy",
    title: "Sportowiec roku",
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 2,
    text: (s) => `${s.profile.hometown} jest z ciebie dumny. Burmistrz chce ci wr\u0119czy\u0107 statuetk\u0119 \u201ESportowiec Roku\u201D. Uroczysto\u015B\u0107 w domu kultury, b\u0119dzie orkiestra d\u0119ta.`,
    choices: () => [
      { label: "Jedziesz odebra\u0107", desc: "Lokalna telewizja, ciocie, tort.", effects: { media: 3, relations: 3, rep: 2 } },
      { label: "Masz ob\xF3z", desc: "Prosisz, \u017Ceby statuetk\u0119 odebra\u0142a mama.", effects: { relations: -1, form: 1 } }
    ]
  },
  {
    id: "trener_mentalny",
    title: "Trener mentalny",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1,
    text: () => "Trener mentalny po weekendowym kursie online proponuje sesje \u201Eprzeprogramowania umys\u0142u zwyci\u0119zcy\u201D. 4 tys. z\u0142 za pakiet.",
    choices: (s) => [
      {
        label: "Kupujesz pakiet",
        desc: "Wizualizacje, oddechy i afirmacje.",
        chance: 45,
        success: { money: -cash(s, 0.015, 2e3), stats: { iq: 4 } },
        fail: { money: -cash(s, 0.015, 2e3), note: "umys\u0142 nie przeprogramowany" },
        successText: "Zaskakuj\u0105co dzia\u0142a. Pierwszy raz w \u017Cyciu nie trz\u0119s\u0105 ci si\u0119 r\u0119ce w szatni.",
        failText: "Po trzech sesjach umiesz tylko oddycha\u0107 przez lew\u0105 dziurk\u0119 od nosa."
      },
      { label: "Wolisz psychologa sportowego z klubu", desc: "Darmowy i z prawdziwym dyplomem.", effects: { stats: { iq: 1 } } }
    ]
  },
  {
    id: "tajlandia",
    title: "Miesi\u0105c w Tajlandii",
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 1 && s.money >= 12e3,
    text: () => "Znajomy z klubu jedzie na miesi\u0105c do Tajlandii trenowa\u0107 muay thai. Bilet i ob\xF3z to ok. 10 tys. z\u0142.",
    choices: (s) => [
      {
        label: "Lecisz z nim",
        desc: "Dwa treningi dziennie w 35 stopniach.",
        chance: 80,
        success: { money: -cash(s, 0.03, 6e3), stats: { stand: 4, cardio: 2 } },
        fail: { money: -cash(s, 0.03, 6e3), form: -4, note: "denga w drugim tygodniu" },
        successText: "Wracasz opalony, z kolanami jak no\u017Ce i nowym tatua\u017Cem, kt\xF3rego nie umiesz przeczyta\u0107.",
        failText: "Komar okaza\u0142 si\u0119 szybszy od ciebie. Dwa tygodnie w szpitalu w Phuket."
      },
      { label: "Zostajesz", desc: "Polska zima te\u017C hartuje.", effects: {} }
    ]
  },
  {
    id: "parafia",
    title: "Zaj\u0119cia przy parafii",
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: () => "Proboszcz prosi, \u017Ceby\u015B poprowadzi\u0142 darmowe zaj\u0119cia dla dzieciak\xF3w z parafii. Dwa razy w tygodniu, w salce katechetycznej.",
    choices: () => [
      { label: "Prowadzisz zaj\u0119cia", desc: "Dzieciaki zapami\u0119taj\u0105 to na ca\u0142e \u017Cycie.", effects: { rep: 3, relations: 2, form: -1 } },
      { label: "Nie masz czasu", desc: "Proboszcz rozumie. Chyba.", effects: {} }
    ]
  },
  {
    id: "sniadaniowa",
    title: "Telewizja \u015Bniadaniowa",
    once: true,
    weight: 4,
    cond: (s) => s.media >= 35,
    text: () => "Zaproszenie do telewizji \u015Bniadaniowej. Scenariusz: pompki na wy\u015Bcigi z prowadz\u0105cym i gotowanie owsianki \u201Emistrza\u201D.",
    choices: () => [
      { label: "Idziesz", desc: "P\xF3\u0142 Polski zobaczy ci\u0119 przy kawie.", effects: { media: 6, rep: -1 } },
      { label: "Odmawiasz", desc: "Nie jeste\u015B pajacem.", effects: { rep: 1 } }
    ]
  },
  {
    id: "reality",
    title: "Reality show",
    once: true,
    weight: 4,
    cond: (s) => s.media >= 45,
    text: () => "Stacja telewizyjna proponuje udzia\u0142 w reality show na bezludnej wyspie. Dwa miesi\u0105ce bez treningu, ale 60 tys. z\u0142.",
    choices: (s) => [
      { label: "Lecisz na wysp\u0119", desc: "Kokosy, kamery i dramy.", effects: { money: cash(s, 0.2, 3e4), media: 12, rep: -6, form: -6 } },
      { label: "Odmawiasz", desc: "Sport przede wszystkim.", effects: { rep: 3 } }
    ]
  },
  {
    id: "lojalnosc_klub",
    title: "Propozycja w\u0142a\u015Bciciela klubu",
    once: true,
    weight: 4,
    cond: (s) => s.club.cost > 0 && s.tier <= 2,
    text: () => "W\u0142a\u015Bciciel klubu proponuje ci darmowe sk\u0142adki na ten rok. Warunek: zostajesz u niego jeszcze przez dwa lata.",
    choices: (s) => [
      {
        label: "Obiecujesz",
        desc: "Pieni\u0105dze zostaj\u0105 w kieszeni.",
        effects: { money: s.club.cost, promise: { text: `Obieca\u0142e\u015B, \u017Ce zostaniesz w klubie ${s.club.name}.`, untilSeason: s.season + 2, kind: "stayClub" }, relations: 1 }
      },
      { label: "Wolisz by\u0107 wolny", desc: "P\u0142acisz sk\u0142adki jak wszyscy.", effects: {} }
    ]
  },
  {
    id: "firma_regionu",
    title: "Sponsor z regionu",
    once: true,
    weight: 5,
    cond: (s) => s.tier <= 2 && s.tier < 4,
    text: (s) => `Firma z twojego regionu chce do\u0142o\u017Cy\u0107 si\u0119 do twoich start\xF3w. Stawia jeden warunek: na koniec roku ${s.tier === 0 ? "nie przechodzisz jeszcze na zawodowstwo" : "nie przechodzisz do wi\u0119kszej federacji"}.`,
    choices: (s) => [
      {
        label: "Podpisujesz umow\u0119",
        desc: "Pieni\u0105dze od razu. Je\u015Bli na koniec roku p\xF3jdziesz wy\u017Cej, z\u0142amiesz s\u0142owo.",
        effects: { money: [5e3, 8e3, 2e4][s.tier] ?? 8e3, relations: 1, promise: { text: "Obieca\u0142e\u015B, \u017Ce po tym roku nie p\xF3jdziesz wy\u017Cej.", untilSeason: s.season, kind: "noPromotion" } }
      },
      { label: "Dzi\u0119kujesz i odmawiasz", desc: "Nie masz \u017Cadnych zobowi\u0105za\u0144.", effects: {} }
    ]
  },
  {
    id: "charytatywna",
    title: "Licytacja dla fundacji",
    weight: 3,
    cond: (s) => s.media >= 15,
    text: () => "Fundacja dla chorych dzieci prosi o twoje r\u0119kawice z ostatniej walki na licytacj\u0119.",
    choices: () => [
      { label: "Oddajesz r\u0119kawice", desc: "I dorzucasz trening z najwy\u017Csz\u0105 ofert\u0105. To ca\u0142a sobota.", effects: { rep: 3, media: 2, form: -1 } },
      { label: "Masz do nich sentyment", desc: "Wisz\u0105 nad \u0142\xF3\u017Ckiem i daj\u0105 ci kopa przed ka\u017Cdym obozem.", effects: { form: 1 } }
    ]
  },
  {
    id: "kebab_challenge",
    title: "Kebab challenge",
    once: true,
    weight: 3,
    cond: (s) => s.media >= 10,
    text: () => "Streamer proponuje challenge na \u017Cywo: 3 kg kebaba w 20 minut. \u201EMistrzowie jedz\u0105 jak mistrzowie\u201D.",
    choices: () => [
      { label: "Jesz", desc: "Dla ludu.", effects: { media: 4, form: -2 } },
      { label: "Odmawiasz", desc: "Wa\u017Cenie za 6 tygodni.", effects: { form: 1 } }
    ]
  },
  {
    id: "hejter",
    title: "Hejter",
    weight: 3,
    cond: (s) => s.media >= 8,
    text: () => "Anonimowy u\u017Cytkownik \u201EKibic_MMA_1987\u201D pod ka\u017Cdym twoim postem pisze, \u017Ce jeste\u015B \u201Epapierowym zawodnikiem\u201D.",
    choices: () => [
      { label: "Odpisujesz", desc: "K\u0142\xF3tnia na 300 komentarzy.", effects: { media: 2, rep: -1 } },
      { label: "Ignorujesz", desc: "Najlepsza odpowied\u017A to wygrana.", effects: { stats: { iq: 1 } } }
    ]
  },
  {
    id: "gala_w_miescie",
    title: "Gala w rodzinnym mie\u015Bcie",
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 1 && s.tier <= 2,
    text: (s) => `Organizator robi gal\u0119 w hali OSiR u ciebie w domu: ${s.profile.hometown}. Chce ci\u0119 na plakacie i w walce wieczoru.`,
    choices: () => [
      { label: "Zgadzasz si\u0119", desc: "Pe\u0142na hala, ca\u0142a rodzina w pierwszym rz\u0119dzie. Presja jak nigdy.", test: "iq", success: { media: 5, money: 5e3, form: 2 }, fail: { media: 3, money: 5e3, form: -3, note: "presja przed swoimi zjad\u0142a ci\u0119 na obozie" }, successText: "Bilety schodz\u0105 w dwa dni. Ca\u0142y ob\xF3z czujesz wsparcie miasta.", failText: "Bilety schodz\u0105 w dwa dni, ale ty nie \u015Bpisz po nocach. Wszyscy pytaj\u0105 tylko o t\u0119 walk\u0119." },
      { label: "Wolisz spok\xF3j", desc: "Presja przed swoimi to za du\u017Co. Skupiasz si\u0119 na treningu.", effects: { form: 1 } }
    ]
  },
  {
    id: "rywal_rocznik",
    title: "Wyzwanie z rocznika",
    weight: 5,
    cond: (s) => s.peers.some((p) => !p.retired && p.tier === s.tier),
    text: (s) => {
      const p = s.peers.find((x) => !x.retired && x.tier === s.tier);
      return `${p.firstName} ${p.lastName}, z kt\xF3rym znacie si\u0119 jeszcze z amatorki, wrzuca filmik: \u201EOn si\u0119 mnie po prostu boi\u201D.`;
    },
    choices: () => [
      { label: "Przyjmujesz wyzwanie", desc: "W tym roku musicie si\u0119 spotka\u0107.", effects: { media: 3, flag: "peerCallout" } },
      { label: "Ignorujesz", desc: "Nie dajesz mu rozg\u0142osu.", effects: { rep: 1 } }
    ]
  },
  {
    id: "koniec_namowy",
    title: "Niedzielny obiad",
    weight: 6,
    cond: (s) => s.age >= 34,
    text: () => "Przy niedzielnym obiedzie rodzina zaczyna temat: \u201EMo\u017Ce ju\u017C wystarczy? G\u0142owa jedna, a ty coraz wolniej m\xF3wisz\u201D.",
    choices: () => [
      { label: "Jeszcze jeden rok", desc: "Czujesz, \u017Ce masz jeszcze co\u015B do udowodnienia.", effects: { relations: -3 } },
      { label: "Ko\u0144czysz po tym roku", desc: "Ostatni taniec.", effects: { relations: 4, flag: "lastSeason", note: "ostatni rok kariery" } }
    ]
  },
  {
    id: "wlasny_klub",
    title: "W\u0142asny klub",
    once: true,
    weight: 4,
    cond: (s) => s.age >= 27 && s.money >= 6e4,
    text: () => "Lokal po starej hurtowni jest do wynaj\u0119cia. Mo\u017Cesz otworzy\u0107 w\u0142asny klub ze swoim nazwiskiem na szyldzie.",
    choices: () => [
      {
        label: "Otwierasz klub",
        desc: "Inwestycja teraz, sk\u0142adki od kursant\xF3w potem.",
        effects: { money: -5e4, rep: 5, sponsor: { name: "Tw\xF3j klub (sk\u0142adki)", perSeason: 18e3, seasonsLeft: 30, clause: "prowadzisz zaj\u0119cia dla dzieci we wtorki" }, form: -2 }
      },
      { label: "Jeszcze nie teraz", desc: "Najpierw kariera.", effects: {} }
    ]
  },
  {
    id: "akademia_mlodziez",
    title: "Spotkanie w podstaw\xF3wce",
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 2 && s.age <= 30,
    text: () => "Twoja stara podstaw\xF3wka zaprasza ci\u0119 na spotkanie z dzieciakami. Pani dyrektor pami\u0119ta, jak bi\u0142e\u015B si\u0119 na przerwach.",
    choices: () => [
      { label: "Idziesz", desc: "Autografy na zeszytach do matmy.", effects: { rep: 2, relations: 1, media: 1 } },
      { label: "Nie masz czasu", desc: "Ob\xF3z si\u0119 sam nie zrobi.", effects: {} }
    ]
  },
  {
    id: "kontuzja_reki",
    title: "Nadgarstek",
    weight: 3,
    cond: (s) => !s.injury && s.age >= 19,
    text: () => "Na worku co\u015B trzasn\u0119\u0142o w nadgarstku. R\u0119ka puchnie jak bu\u0142ka. Do pierwszej walki roku zosta\u0142o sze\u015B\u0107 tygodni.",
    choices: () => [
      { label: "Odpuszczasz sparingi i leczysz", desc: "Fizjoterapeuta, l\xF3d, cierpliwo\u015B\u0107.", effects: { money: -3e3, form: -2, healInjury: true } },
      { label: "Zaciskasz z\u0119by", desc: "Usztywniasz ta\u015Bm\u0105 i jedziesz dalej.", effects: { injury: { name: "nadgarstek", seasons: 1, penalty: 4 }, stats: { iq: 1 } } }
    ]
  },
  {
    id: "brat_tez",
    title: "M\u0142odszy brat",
    once: true,
    weight: 4,
    cond: (s) => s.age <= 22,
    text: () => "Tw\xF3j m\u0142odszy brat je\u017Adzi z tob\u0105 na ka\u017Cde zawody. Teraz sam chce trenowa\u0107, a rodzice m\xF3wi\u0105 wprost, \u017Ce na dw\xF3ch nie starczy.",
    choices: () => [
      { label: "P\u0142acisz za brata ze swoich", desc: "Rodzina jest najwa\u017Cniejsza.", effects: { money: -3e3, relations: 4 } },
      { label: "M\xF3wisz, \u017Ce jeszcze nie teraz", desc: "Najpierw ty musisz si\u0119 przebi\u0107.", effects: { relations: -3 } }
    ]
  },
  {
    id: "stary_trener",
    title: "Telefon od starego trenera",
    once: true,
    weight: 4,
    cond: (s) => s.age >= 20,
    text: () => "Dzwoni weteran, kt\xF3ry uczy\u0142 ci\u0119 pierwszych krok\xF3w w parterze. Organizuje turniej dla dzieciak\xF3w i prosi o pomoc.",
    choices: () => [
      { label: "Pomagasz", desc: "Dok\u0142adasz pieni\u0105dze i sw\xF3j czas. O akcji m\xF3wi ca\u0142e \u015Brodowisko.", effects: { rep: 3, relations: 1, money: -2e3 } },
      { label: "Odmawiasz", desc: "Masz swoje sprawy.", effects: { relations: -1 } }
    ]
  },
  {
    id: "oferta_pracy",
    title: "Praca na bramce",
    once: true,
    weight: 4,
    cond: (s) => s.age >= 20 && s.tier <= 1 && s.money < 5e3,
    text: () => "Kolega za\u0142atwia etat na bramce w klubie nocnym. Pewna kasa co miesi\u0105c, ale noce zarwane.",
    choices: () => [
      { label: "Bierzesz etat", desc: "Kasa na sk\u0142adki b\u0119dzie.", effects: { money: 14e3, form: -3, wear: 2 } },
      { label: "Zostajesz przy sporcie", desc: "Jako\u015B prze\u017Cyjesz na makaronie.", effects: { form: 1 } }
    ]
  },
  {
    id: "wywiad_zly",
    title: "Wywiad przed wa\u017Ceniem",
    weight: 3,
    cond: (s) => s.tier >= 2,
    text: () => "Dziennikarz pyta o twoj\u0105 ostatni\u0105 walk\u0119, a ty po 14 godzinach bez jedzenia przed wa\u017Ceniem odpowiadasz\u2026 r\xF3\u017Cnie.",
    choices: () => [
      {
        label: "M\xF3wisz, co my\u015Blisz o s\u0119dziach",
        desc: "Nikt ci nie zabroni.",
        chance: 50,
        success: { media: 4 },
        fail: { media: 3, rep: -3 },
        successText: "Ludzie przyznaj\u0105 ci racj\u0119. Klip ma milion wy\u015Bwietle\u0144.",
        failText: "Federacja wysy\u0142a pismo \u201Ez pro\u015Bb\u0105 o wyja\u015Bnienia\u201D."
      },
      { label: "\u201ESkupiam si\u0119 na sobie\u201D", desc: "Najnudniejsza odpowied\u017A w historii.", effects: { rep: 1 } }
    ]
  },
  {
    id: "sponsor_suple",
    title: "Sponsor od suplement\xF3w",
    once: true,
    weight: 5,
    cond: (s) => s.media >= 18 && s.tier >= 1,
    text: () => "Marka suplement\xF3w \u201EMegaMass Polska\u201D proponuje kontrakt. Musisz pokazywa\u0107 si\u0119 z shakerem na ka\u017Cdym wa\u017Ceniu.",
    choices: (s) => [
      {
        label: "Podpisujesz",
        desc: "Shaker w ka\u017Cdym kadrze.",
        effects: { sponsor: { name: "MegaMass Polska", perSeason: 4e3 + s.tier * 5e3, seasonsLeft: 2, clause: "shaker w ka\u017Cdym kadrze" }, media: 1 }
      },
      { label: "Odmawiasz", desc: "Nie lubisz smaku truskawki.", effects: {} }
    ]
  },
  {
    id: "gg_banda",
    title: "Ground Game si\u0119 odzywa",
    brand: "banda",
    once: true,
    weight: 9,
    cond: (s) => s.tier >= 1 && s.media >= 12 && !s.sponsors.some((x) => x.name === "Ground Game"),
    text: () => "Na Instagrymie odzywa si\u0119 Ground Game. Widzieli twoj\u0105 ostatni\u0105 walk\u0119 i chc\u0105 ci\u0119 w ekipie: rashguardy, spodenki na walki i kod rabatowy z twoim nazwiskiem.",
    choices: (s) => [
      {
        label: "Do\u0142\u0105czasz do Bandy",
        desc: "Wychodzisz do klatki w spodenkach GG, ludzie kupuj\u0105 z twoim kodem, a sprz\u0119t masz z g\u0142owy.",
        effects: {
          sponsor: { name: "Ground Game", perSeason: [2e3, 3e3, 9e3, 2e4, 45e3][s.tier], seasonsLeft: 4, clause: "kod rabatowy z twoim nazwiskiem, sprz\u0119t na koszt sponsora" },
          media: 3,
          rep: 1
        }
      },
      { label: "Czekasz na wi\u0119ksz\u0105 mark\u0119", desc: "Mo\u017Ce kiedy\u015B zadzwoni kto\u015B z Ameryki.", effects: {} }
    ]
  },
  {
    id: "gg_labs_supps",
    title: "Ground Game Labs",
    brand: "labs",
    once: true,
    weight: 6,
    cond: (s) => s.tier >= 2 && s.media >= 18 && !s.sponsors.some((x) => x.name === "Ground Game Labs"),
    text: () => "Odzywa si\u0119 Ground Game Labs, linia od\u017Cywek Ground Game. Chc\u0105, \u017Ceby\u015B testowa\u0142 ich bia\u0142ko, elektrolity i kreatyn\u0119, a w zamian bior\u0105 na siebie ca\u0142\u0105 twoj\u0105 suplementacj\u0119.",
    choices: (s) => [
      {
        label: "Wchodzisz w to",
        desc: "Shaker Labs na ka\u017Cdym treningu, suplementacja za darmo.",
        effects: {
          sponsor: { name: "Ground Game Labs", perSeason: [0, 0, 2e3, 5e3, 1e4][s.tier], seasonsLeft: 3, clause: "suplementacja na koszt sponsora" },
          media: 1,
          note: "suplementacja za darmo"
        }
      },
      { label: "Zostajesz przy swoich", desc: "Przyzwyczai\u0142e\u015B si\u0119 do bia\u0142ka z hurtowni.", effects: {} }
    ]
  },
  // ---------- Wyższe szczeble i późna kariera ----------
  {
    id: "londyn",
    title: "Walka w Londynie",
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 3,
    text: () => "Pierwsza walka roku w Londynie. Federacja kupi\u0142a ci lot z przesiadk\u0105 w Dubaju i hotel przy lotnisku. Mo\u017Cesz dop\u0142aci\u0107 za wcze\u015Bniejszy przylot.",
    choices: (s) => [
      { label: "Lecisz tydzie\u0144 wcze\u015Bniej", desc: "Aklimatyzacja, spokojny sen, w\u0142asny dietetyk.", effects: { money: -cash(s, 0.03, 6e3), form: 2 } },
      { label: "Lecisz z federacj\u0105", desc: "Jet lag to dla s\u0142abych.", effects: { form: -2 } }
    ]
  },
  {
    id: "stadion",
    title: "Gala na stadionie",
    once: true,
    weight: 6,
    cond: (s) => s.tier === 2 && s.rank !== null && s.rank <= 5,
    text: () => "Polska federacja robi gal\u0119 na stadionie. 50 tysi\u0119cy ludzi. Proponuj\u0105 ci walk\u0119 w karcie g\u0142\xF3wnej, ale z rywalem z wy\u017Cszej p\xF3\u0142ki.",
    choices: () => [
      { label: "Bierzesz to", desc: "Takie wieczory zdarzaj\u0105 si\u0119 raz w \u017Cyciu.", effects: { media: 8, money: 15e3, form: 1 } },
      { label: "Wolisz bezpieczniejsz\u0105 walk\u0119", desc: "Stadion poczeka.", effects: { rep: 1 } }
    ]
  },
  {
    id: "zastepstwo",
    title: "Zast\u0119pstwo z marszu",
    weight: 4,
    cond: (s) => s.tier >= 1,
    text: () => "Dzwoni matchmaker. Na gali za dwa tygodnie wypad\u0142 zawodnik z karty g\u0142\xF3wnej. Potrzebuj\u0105 zast\u0119pstwa i p\u0142ac\u0105 podw\xF3jnie.",
    choices: (s) => [
      {
        label: "Bierzesz walk\u0119 z marszu",
        desc: "Bez obozu, ale kasa i wdzi\u0119czno\u015B\u0107 federacji.",
        chance: 55,
        success: { money: [0, 6e3, 4e4, 9e4, 3e5][s.tier], rep: 3, media: 3 },
        fail: { money: [0, 3e3, 2e4, 45e3, 15e4][s.tier], wear: 5, form: -3, note: "dosta\u0142e\u015B lanie, ale kasa jest" },
        successText: "Wygrywasz w drugiej rundzie. Prezes federacji osobi\u015Bcie dzi\u0119kuje ci w szatni.",
        failText: "Kondycja sko\u0144czy\u0142a si\u0119 po pi\u0119ciu minutach. Kasa si\u0119 zgadza, twarz ju\u017C mniej."
      },
      { label: "Odmawiasz", desc: "Bez obozu to proszenie si\u0119 o k\u0142opoty.", effects: {} }
    ]
  },
  {
    id: "kontrakt_tv",
    title: "Serial dokumentalny",
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 2 && s.media >= 30,
    text: () => "Stacja telewizyjna chce zrobi\u0107 o tobie serial dokumentalny \u201EDroga do pasa\u201D. Kamery b\u0119d\u0105 na ka\u017Cdym treningu.",
    choices: (s) => [
      { label: "Zgadzasz si\u0119", desc: "S\u0142awa i pieni\u0105dze, ale prywatno\u015Bci zero.", effects: { money: cash(s, 0.08, 15e3), media: 10, relations: -2, form: -1 } },
      { label: "Odmawiasz", desc: "Trening to nie reality show.", effects: { form: 1 } }
    ]
  },
  {
    id: "kontrola_federacji",
    title: "Kontrola antydopingowa",
    weight: 3,
    cond: (s) => s.tier >= 3,
    text: () => "Federacja wprowadza losowe kontrole antydopingowe. Kontroler zjawia si\u0119 o 6:30 w niedziel\u0119, akurat po urodzinach brata.",
    choices: () => [
      { label: "Oddajesz pr\xF3bk\u0119 bez dyskusji", desc: "Nie masz nic do ukrycia.", effects: { rep: 2 } },
      { label: "Prosisz o godzin\u0119 na kaw\u0119", desc: "Kontroler patrzy na zegarek.", chance: 70, success: { note: "kontroler by\u0142 wyrozumia\u0142y" }, fail: { rep: -5, note: "raport o utrudnianiu kontroli" } }
    ]
  },
  {
    id: "rywal_trash",
    title: "Wyzwanie w internecie",
    weight: 4,
    cond: (s) => s.tier >= 2,
    text: () => "Zawodnik z twojej kategorii nagra\u0142 film, w kt\xF3rym nazywa ci\u0119 \u201Eemerytem z przeterminowan\u0105 szcz\u0119k\u0105\u201D. Federacja proponuje walk\u0119 z nim.",
    choices: () => [
      { label: "\u017B\u0105dasz walki", desc: "Sprawa honorowa.", effects: { media: 5, flag: "grudge", form: 2 } },
      { label: "Ignorujesz", desc: "Nie zni\u017Casz si\u0119 do jego poziomu.", effects: { rep: 2 } }
    ]
  },
  {
    id: "dagestan",
    title: "Ob\xF3z w Dagestanie",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 3,
    text: () => "Dostajesz zaproszenie na ob\xF3z zapa\u015Bniczy w g\xF3rach Dagestanu. Treningi trzy razy dziennie, jedzenie proste, sauny brak.",
    choices: (s) => [
      {
        label: "Jedziesz",
        desc: "Wracasz albo zapa\u015Bnikiem, albo w trumnie.",
        chance: 75,
        success: { stats: { wrest: 4, cardio: 2 }, money: -cash(s, 0.03, 6e3) },
        fail: { injury: { name: "naderwany bark", seasons: 1, penalty: 5 }, money: -cash(s, 0.03, 6e3) },
        successText: "Po miesi\u0105cu obalasz ludzi, zanim zd\u0105\u017C\u0105 pomy\u015Ble\u0107 o gardzie.",
        failText: "Trzeci dzie\u0144, rzut przez biodro na beton. Bark m\xF3wi \u201Edo\u015B\u0107\u201D."
      },
      { label: "Zostajesz w kraju", desc: "Polskie zapasy te\u017C co\u015B znacz\u0105.", effects: {} }
    ]
  },
  {
    id: "gala_rodzina",
    title: "Gala w Las Vegas",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 3,
    text: () => "Twoja walka b\u0119dzie na gali w Las Vegas. Federacja daje bilety tylko dla ciebie i trenera. Rodzina pyta, czy mog\u0105 lecie\u0107.",
    choices: (s) => [
      { label: "Fundujesz im lot", desc: "Mama pierwszy raz w samolocie.", effects: { money: -cash(s, 0.05, 15e3), relations: 5, form: 2 } },
      { label: "Obejrz\u0105 w telewizji", desc: "Skupienie przede wszystkim.", effects: { relations: -2 } }
    ]
  },
  {
    id: "operacja_lokcia",
    title: "\u0141okie\u0107",
    weight: 3,
    cond: (s) => s.age >= 28 && !s.injury,
    text: () => "\u0141okie\u0107 strzela przy ka\u017Cdym prostym. Ortopeda daje wyb\xF3r: zastrzyki i b\xF3l do ko\u0144ca kariery albo operacja.",
    choices: () => [
      { label: "Operacja", desc: "P\xF3\u0142 roku rehabilitacji i spok\xF3j.", effects: { money: -15e3, form: -4, wear: -5 } },
      { label: "Zastrzyki i jedziemy", desc: "Doktor z si\u0142owni zna dobre specyfiki.", effects: { injury: { name: "\u0142okie\u0107 na zastrzykach", seasons: 2, penalty: 3 }, wear: 4 } }
    ]
  },
  {
    id: "mlodszy_zawodnik",
    title: "M\u0142ody w klubie",
    once: true,
    weight: 5,
    cond: (s) => s.age >= 29,
    text: () => "W klubie pojawia si\u0119 18-latek, kt\xF3ry na sparingach robi ci problemy. Trener pyta, czy we\u017Amiesz go pod skrzyd\u0142a.",
    choices: () => [
      { label: "Zostajesz mentorem", desc: "Uczysz go wszystkiego, co wiesz. Twoje treningi schodz\u0105 na drugi plan.", effects: { rep: 3, stats: { iq: 1 }, relations: 1, form: -2 } },
      { label: "Pokazujesz mu, gdzie jego miejsce", desc: "Na sparingu bez lito\u015Bci.", effects: { stats: { stand: 1 }, rep: -1, form: 1 } }
    ]
  },
  {
    id: "komentator",
    title: "Propozycja z telewizji",
    once: true,
    weight: 4,
    cond: (s) => s.age >= 30 && s.media >= 25,
    text: () => "Telewizja proponuje ci rol\u0119 eksperta przy komentowaniu gal. Dobra kasa, ale weekendy w studiu.",
    choices: () => [
      { label: "Bierzesz mikrofon", desc: "Przysz\u0142o\u015B\u0107 po karierze sama si\u0119 nie zbuduje.", effects: { sponsor: { name: "Studio telewizyjne", perSeason: 25e3, seasonsLeft: 10, clause: "komentowanie gal w weekendy" }, form: -2, media: 3 } },
      { label: "Jeszcze nie teraz", desc: "Najpierw kariera.", effects: { form: 1 } }
    ]
  },
  {
    id: "kategoria_nizej",
    title: "Kategoria ni\u017Cej?",
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 2 && s.age <= 30,
    text: () => "Trener przekonuje, \u017Ce w ni\u017Cszej kategorii wagowej by\u0142by\u015B \u201Egigantem\u201D. Tylko trzeba zrzuci\u0107 dodatkowe 7 kilo, a zbijanie wagi to katorga.",
    choices: () => [
      {
        label: "Schodzisz kategori\u0119 ni\u017Cej",
        desc: "Jeste\u015B silniejszy od rywali, ale wa\u017Cenie to piek\u0142o.",
        test: "cardio",
        success: { stats: { stand: 2, wrest: 2, cardio: -1 }, form: 2 },
        fail: { form: -6, wear: 4, note: "zbijanie wagi ci\u0119 wyko\u0144czy\u0142o" },
        successText: "Wchodzisz w wag\u0119 i w klatce czujesz si\u0119 jak nied\u017Awied\u017A w\u015Br\xF3d lis\xF3w.",
        failText: "Saunowanie do upad\u0142ego. W walce nie masz si\u0142y unie\u015B\u0107 r\u0105k."
      },
      { label: "Zostajesz w swojej wadze", desc: "Zdrowie przede wszystkim.", effects: { rep: 1 } }
    ]
  },
  {
    id: "pas_kradziony",
    title: "Skradziona walka?",
    weight: 3,
    cond: (s) => s.tier >= 2 && s.history.slice(-3).some((h) => h.result === "L" && h.method === "Decyzja niejednog\u0142o\u015Bna"),
    text: () => "Po ostatniej niejednog\u0142o\u015Bnej decyzji internet huczy, \u017Ce ci\u0119 okradli. Mo\u017Cesz z\u0142o\u017Cy\u0107 oficjalny protest albo odpu\u015Bci\u0107 i odpowiedzie\u0107 w klatce.",
    choices: () => [
      { label: "Sk\u0142adasz protest", desc: "Sprawiedliwo\u015B\u0107 musi by\u0107.", chance: 30, success: { rep: 3, media: 3, note: "komisja przyznaje, \u017Ce s\u0119dziowie si\u0119 pomylili" }, fail: { rep: -1, note: "protest odrzucony" } },
      { label: "Wygrasz to w klatce", desc: "Bez protest\xF3w. Odpowiesz wynikami w kolejnych walkach.", effects: { media: 4, form: 2 } }
    ]
  },
  {
    id: "kryptowaluty",
    title: "ClinchCoin",
    once: true,
    weight: 4,
    cond: (s) => s.money >= 8e4,
    text: () => "Znajomy z si\u0142owni namawia ci\u0119 na inwestycj\u0119 w now\u0105 kryptowalut\u0119 \u201EClinchCoin\u201D. Ma pierwsze zyski i zrzuty ekranu.",
    choices: () => [
      {
        label: "Wchodzisz za 40 tys. z\u0142",
        desc: "Do ksi\u0119\u017Cyca.",
        chance: 25,
        success: { money: 9e4, note: "ClinchCoin wystrzeli\u0142" },
        fail: { money: -4e4, note: "ClinchCoin znikn\u0105\u0142 z gie\u0142dy" },
        successText: "Sprzedajesz na szczycie. Znajomy zostaje i traci wszystko.",
        failText: "Tw\xF3rcy ClinchCoina wyjechali na Dominikan\u0119. Z twoimi pieni\u0119dzmi."
      },
      { label: "Odmawiasz", desc: "Pieni\u0105dze lubi\u0105 cisz\u0119.", effects: {} }
    ]
  },
  {
    id: "biografia",
    title: "Biografia",
    once: true,
    weight: 3,
    cond: (s) => s.belts.length >= 2 && s.age >= 27,
    text: () => "Wydawnictwo chce wyda\u0107 twoj\u0105 biografi\u0119. Ghostwriter zadaje pytania o dzieci\u0144stwo, pora\u017Cki i pierwsze r\u0119kawice.",
    choices: (s) => [
      { label: "Opowiadasz wszystko", desc: "Bez upi\u0119kszania.", effects: { money: cash(s, 0.1, 25e3), media: 5, rep: 2 } },
      { label: "Odk\u0142adasz to na emerytur\u0119", desc: "Historia jeszcze si\u0119 pisze.", effects: { form: 1 } }
    ]
  },
  {
    id: "kontuzja_trenera",
    title: "Trener w szpitalu",
    weight: 3,
    cond: (s) => s.club.quality >= 3,
    text: () => "Tw\xF3j trener trafia do szpitala z zawa\u0142em tu\u017C przed obozem. Asystent ma 24 lata i du\u017Co zapa\u0142u.",
    choices: () => [
      { label: "Dajesz szans\u0119 asystentowi", desc: "M\u0142ody, ale g\u0142odny.", chance: 50, success: { form: 2, stats: { iq: 1 } }, fail: { form: -3 } },
      { label: "Robisz ob\xF3z w innym klubie", desc: "Kosztuje, ale pewniej.", effects: { money: -1e4, form: 1 } }
    ]
  },
  {
    id: "sauna_pomysl",
    title: "Sauna w ogrodzie",
    once: true,
    weight: 3,
    cond: (s) => s.money >= 3e4 && s.age >= 24,
    text: () => "Fizjoterapeuta przekonuje, \u017Ce w\u0142asna sauna i balia z lodem w ogrodzie to \u201Enajlepsza inwestycja w regeneracj\u0119\u201D.",
    choices: () => [
      { label: "Stawiasz saun\u0119", desc: "S\u0105siedzi patrz\u0105 zza p\u0142otu.", effects: { money: -25e3, wear: -6, relations: 2 } },
      { label: "Wystarczy si\u0142ownia", desc: "Kiedy\u015B. Mo\u017Ce.", effects: {} }
    ]
  },
  {
    id: "rekord_wagi",
    title: "Waga nie schodzi",
    weight: 3,
    cond: (s) => s.tier >= 1 && (s.division ?? s.profile.weight) !== "ciezka",
    text: () => "Dzie\u0144 przed wa\u017Ceniem waga pokazuje 1,5 kg za du\u017Co. Trener patrzy na saun\u0119, dietetyk na ciebie.",
    choices: (s) => [
      { label: "Sauna do ostatniej kropli", desc: "Wchodzisz w limit, ale suchy jak wi\xF3r.", effects: { form: -2, wear: 2 } },
      { label: "Przyjmujesz kar\u0119 20% ga\u017Cy", desc: "Zdrowie wa\u017Cniejsze.", effects: { money: -Math.max(1e3, Math.round(s.contract.purse * 0.2 / 100) * 100), rep: -2, form: 1 } }
    ]
  },
  {
    id: "ojciec_dumny",
    title: "Plakat w warsztacie",
    once: true,
    weight: 6,
    cond: (s) => s.belts.some((b) => !b.name.startsWith(BELT_NAMES[0])),
    text: () => "Ojciec, kt\xF3ry kiedy\u015B m\xF3wi\u0142, \u017Ce to \u201Ezabawa dla patus\xF3w\u201D, wiesza tw\xF3j plakat w warsztacie i pokazuje go ka\u017Cdemu klientowi.",
    choices: () => [
      { label: "Dzwonisz do niego", desc: "Rozmowa trwa dwie godziny.", effects: { relations: 5, form: 2 } },
      { label: "Udajesz, \u017Ce nie wiesz", desc: "Ale w \u015Brodku co\u015B ci\u0119 \u015Bciska.", effects: { relations: 1 } }
    ]
  },
  {
    id: "obi_stacja",
    title: "Twarz na kubkach",
    once: true,
    weight: 4,
    cond: (s) => s.media >= 30 && s.tier >= 2,
    text: () => "Sie\u0107 stacji paliw chce da\u0107 twoje zdj\u0119cie na kubki do kawy w ca\u0142ej Polsce. \u201ETankuj jak mistrz\u201D.",
    choices: (s) => [
      {
        label: "Bierzesz",
        desc: "Twoja twarz przy ka\u017Cdym hot-dogu.",
        effects: { sponsor: { name: "Stacje \u201EOrlik Paliwa\u201D", perSeason: 3e4 + s.tier * 1e4, seasonsLeft: 2, clause: "twoja twarz na kubkach" }, media: 4 }
      },
      { label: "Odmawiasz", desc: "Kubki to nie tw\xF3j styl.", effects: {} }
    ]
  },
  ...PROLOG_EVENTS,
  ...EXTRA_EVENTS,
  ...MONEY_EVENTS,
  ...FUN_EVENTS,
  ...REP_EVENTS,
  ...STAGE_EVENTS
];
function eventWeight(e, s) {
  if (e.once && s.seenEvents.includes(e.id)) return 0;
  if (!e.once && s.seenEvents.slice(-6).includes(e.id)) return 0;
  if (!e.cond(s)) return 0;
  return e.weight;
}
function findEvent(id) {
  return EVENTS.find((e) => e.id === id);
}

// src/engine/side.ts
var clamp2 = (v, a, b) => Math.max(a, Math.min(b, v));
var FEE = [0, 300, 800, 2e3, 5e3];
var GRAPPLING_PRIZE = [0, 1500, 6e3, 18e3, 45e3];
var BOXING_PURSE = [0, 3e3, 12e3, 35e3, 9e4];
var SEMINAR_PAY = [0, 1500, 6e3, 16e3, 4e4];
var GRAPPLE1_PRIZE = [0, 4e3, 12e3, 3e4, 7e4];
var KICK_PURSE = [0, 3500, 12e3, 3e4, 8e4];
var FILM_PAY = [0, 6e3, 18e3, 45e3, 12e4];
var CAMP_FEE = [0, 2500, 6e3, 15e3, 3e4];
var PODCAST_PAY = [0, 500, 2e3, 6e3, 15e3];
var CELEB_PAY = [0, 8e3, 25e3, 6e4, 14e4];
var GRAPPLING_NAMES = [
  ["Puchar Polski No-Gi", "Grappling Open"],
  ["Puchar Polski No-Gi", "Mistrzostwa Polski Grapplingu", "Submission Only Krak\xF3w"],
  ["Grappling Masters Europe", "Euro No-Gi Open", "Polaris Pro Invitational"],
  ["World No-Gi Invitational", "Submission Kings Abu Zabi", "Grappling Masters World"]
];
function inviteKinds(s) {
  const k = [];
  if (s.tier >= 1) k.push("grappling");
  if (s.tier >= 1) k.push("boxing");
  if (s.tier >= 2 || s.media >= 25) k.push("seminar");
  if (s.tier >= 2 && s.stats.bjj >= 50) k.push("grapple1");
  if (s.tier >= 1) k.push("kick");
  if (s.media >= 35) k.push("film");
  if (s.tier >= 2) k.push("camp");
  k.push("charity");
  if (s.media >= 15 || s.tier >= 2) k.push("podcast");
  if (s.tier >= 2 && s.media >= 30) k.push("celebrity");
  return k;
}
function pickCity(rng, s) {
  return s.tier >= 3 ? rng.pick(["Londyn", "Amsterdam", "Praga", "Berlin", "Sztokholm", "Barcelona"]) : rng.pick(TOURNEY_CITIES);
}
function buildInvite(rng, s) {
  const kinds = inviteKinds(s);
  if (!kinds.length) return null;
  const W = { grappling: 3, boxing: 2, kick: 1.5, seminar: 1.6, grapple1: 1.2, film: 1, camp: 1.4, charity: 1.2, podcast: 1.4, celebrity: 0.9 };
  const kind = rng.weighted(kinds.map((k) => ({ item: k, w: W[k] })));
  const city = pickCity(rng, s);
  const t = s.tier;
  if (kind === "grappling") {
    const name = rng.pick(GRAPPLING_NAMES[Math.min(3, Math.max(0, t - 1))]);
    return {
      kind,
      title: name,
      place: city,
      fee: FEE[t],
      prize: GRAPPLING_PRIZE[t],
      text: `Zaproszenie na ${name} w mie\u015Bcie ${city}. Bez cios\xF3w, tylko chwyty i duszenia: trzy walki w drabince. Wygrana nauczy ci\u0119 wi\u0119cej w parterze ni\u017C miesi\u0105c na macie.`
    };
  }
  if (kind === "boxing") {
    return {
      kind,
      title: `Gala bokserska \xB7 ${city}`,
      place: city,
      fee: 0,
      prize: BOXING_PURSE[t],
      text: `Promotor boksu szuka kogo\u015B z MMA do walki na swojej gali w mie\u015Bcie ${city}. Cztery rundy, tylko pi\u0119\u015Bci, r\u0119kawice 10 uncji. Dobra lekcja st\xF3jki i niez\u0142a kasa, ale bokser b\u0119dzie u siebie.`
    };
  }
  if (kind === "grapple1") {
    const who = rng.pick(["brazylijskim mistrzem \u015Bwiata w BJJ", "zapa\u015Bnikiem z kadry olimpijskiej", "legend\u0105 submission only", "mistrzem Europy w no-gi"]);
    return {
      kind,
      title: `Superfight grapplingowy \xB7 ${city}`,
      place: city,
      fee: 0,
      prize: GRAPPLE1_PRIZE[t],
      text: `Gala grapplingowa w mie\u015Bcie ${city} chce pojedynku jeden na jeden z ${who}. Dziesi\u0119\u0107 minut, wygrana tylko przez poddanie albo na punkty. Za samo wyj\u015Bcie po\u0142owa stawki.`
    };
  }
  if (kind === "kick") {
    return {
      kind,
      title: `Gala kickboxingu \xB7 ${city}`,
      place: city,
      fee: 0,
      prize: KICK_PURSE[t],
      text: `Federacja kickboxingu robi gal\u0119 w mie\u015Bcie ${city} i chce kogo\u015B z MMA. Trzy rundy, ciosy, kopni\u0119cia i kolana, bez obale\u0144. Kondycja i szcz\u0119ka zostan\u0105 sprawdzone.`
    };
  }
  if (kind === "camp") {
    const who = rng.pick([
      { t: "Ob\xF3z zapa\u015Bniczy w Dagestanie", pl: "Machaczka\u0142a", st: "wrest", txt: "Tydzie\u0144 w g\xF3rach u trenera, kt\xF3ry wychowa\u0142 trzech mistrz\xF3w \u015Bwiata. Biegi pod g\xF3r\u0119 o pi\u0105tej rano i sparingi z ch\u0142opakami, kt\xF3rzy nie znaj\u0105 s\u0142owa \u201Eodpu\u015B\u0107\u201D." },
      { t: "Tydzie\u0144 w tajskim campie", pl: "Phuket", st: "stand", txt: "Phuket, dwa treningi dziennie z by\u0142ymi mistrzami Lumpinee. Klincz, \u0142okcie i tarcze w czterdziestostopniowym upale." },
      { t: "Tydzie\u0144 u legendy BJJ w Rio", pl: "Rio de Janeiro", st: "bjj", txt: "Mata w Rio, czarne pasy na ka\u017Cdym rogu i trener, kt\xF3ry pami\u0119ta pierwsze turnieje vale tudo. Ka\u017Cdy dzie\u0144 ko\u0144czy si\u0119 czyim\u015B duszeniem." },
      { t: "Ob\xF3z kondycyjny w Alpach", pl: "Alpy", st: "cardio", txt: "Trening na wysoko\u015Bci: rower, biegi i interwa\u0142y w rozrzedzonym powietrzu. P\u0142uca pal\u0105, ale serce b\u0119dzie jak dzwon." }
    ]);
    return { kind, title: who.t, place: who.pl, fee: CAMP_FEE[t], prize: 0, stat: who.st, text: `${who.txt} Bez walki, bez nagrody, tylko praca.` };
  }
  if (kind === "charity") {
    const ev = rng.pick([
      { t: "Gala charytatywna dla szpitala dzieci\u0119cego", txt: "Pokazowa walka w r\u0119kawicach 16 uncji, licytacja twoich spodenek i zdj\u0119cia z dzieciakami. Zero pieni\u0119dzy, za to du\u017Co dobrego." },
      { t: "Trening z dzieciakami z domu dziecka", txt: "Sobota w sali gimnastycznej z trzydziestk\u0105 dzieciak\xF3w. Pokazujesz podstawy, rozdajesz r\u0119kawice od Ground Game i s\u0142uchasz, jak jeden chce zosta\u0107 \u201Etakim jak ty\u201D." },
      { t: "Bieg dla hospicjum", txt: "Dziesi\u0119\u0107 kilometr\xF3w w koszulce z numerem i z kamer\u0105 lokalnej telewizji obok. Ludzie zbieraj\u0105 pieni\u0105dze za ka\u017Cdy tw\xF3j kilometr." }
    ]);
    return { kind, title: ev.t, place: pickCity(rng, s), fee: 0, prize: 0, text: ev.txt };
  }
  if (kind === "podcast") {
    const show = rng.pick(["\u201EPo gongu\u201D", "\u201EKlatka bez cenzury\u201D", "\u201ESzatnia\u201D", "\u201ERozmowy przy macie\u201D"]);
    return { kind, title: `Podcast ${show}`, place: "Warszawa", fee: 0, prize: PODCAST_PAY[t], text: `Trzy godziny rozmowy w podca\u015Bcie ${show}. Prowadz\u0105cy lubi dopytywa\u0107 o rywali, pieni\u0105dze i kulisy federacji. Jedno nieostro\u017Cne zdanie i klip \u017Cyje w\u0142asnym \u017Cyciem.` };
  }
  if (kind === "celebrity") {
    const who = rng.pick(["raper z pierwszej tr\xF3jki listy przeboj\xF3w", "aktor z serialu, kt\xF3ry ma walczy\u0107 na gali freak fight\xF3w", "pi\u0142karz po karierze, kt\xF3ry chce \u201Espr\xF3bowa\u0107 MMA\u201D", "youtuber z dwoma milionami subskrypcji"]);
    return { kind, title: "Trenujesz celebryt\u0119", place: "Warszawa", fee: 0, prize: Math.round(CELEB_PAY[t] * (1 + s.media / 150) / 500) * 500, text: `Dzwoni mened\u017Cer: ${who} chce, \u017Ceby\u015B przez miesi\u0105c by\u0142 jego trenerem personalnym. Kasa \u015Bwietna, nagrania p\xF3jd\u0105 w internet, a w \u015Brodowisku powiedz\u0105, \u017Ce uczysz cyrk.` };
  }
  if (kind === "film") {
    const role = rng.pick([
      { title: "Rola w filmie akcji", text: "Re\u017Cyser kina akcji szuka prawdziwego wojownika do roli ochroniarza g\u0142\xF3wnego bohatera. Trzy dni na planie, jedna scena walki i kwestia do zapami\u0119tania." },
      { title: "Reklama napoju energetycznego", text: "Marka napoj\xF3w chce ci\u0119 w reklamie: biegasz po schodach o \u015Bwicie i otwierasz puszk\u0119 do kamery. Kasa dobra, koledzy z klubu b\u0119d\u0105 mieli memy." },
      { title: "Go\u015Bcinny wyst\u0119p w serialu", text: "Serial obyczajowy chce ci\u0119 w odcinku o \u201Egro\u017Anym zawodniku z s\u0105siedztwa\u201D. Grasz siebie, tylko bardziej." }
    ]);
    return { kind, title: role.title, place: city, fee: 0, prize: Math.round(FILM_PAY[t] * (1 + s.media / 120) / 500) * 500, text: role.text };
  }
  return {
    kind,
    title: `Seminarium \xB7 ${city}`,
    place: city,
    fee: 0,
    prize: Math.round(SEMINAR_PAY[t] * (1 + s.media / 100) / 500) * 500,
    text: rng.pick([
      `Klub z miasta ${city} zaprasza ci\u0119 na weekendowe seminarium. Pokazujesz swoje techniki, robisz zdj\u0119cia z lud\u017Ami i wracasz z kas\u0105. Tylko \u017Ce to weekend bez treningu tu\u017C przed walk\u0105.`,
      `Sie\u0107 klub\xF3w z miasta ${city} robi zjazd zawodnik\xF3w i chce, \u017Ceby\u015B poprowadzi\u0142 dwie godziny o swojej specjalno\u015Bci. Sala na sto os\xF3b ju\u017C wyprzedana.`,
      `Policja w mie\u015Bcie ${city} szuka instruktora na szkolenie z obezw\u0142adniania. Dzie\u0144 z antyterrorystami, kawa z termosu i dobra kasa.`
    ])
  };
}
function sideChance(s, kind, form = 0) {
  const st = s.stats;
  const lvl = TIER_LEVEL[Math.max(1, s.tier)];
  if (kind === "grappling") return clamp2(0.5 + (st.bjj * 0.65 + st.wrest * 0.35 - (lvl + 4)) / 28 + form / 100, 0.12, 0.88);
  if (kind === "boxing") return clamp2(0.5 + (st.stand * 0.7 + st.chin * 0.3 - (lvl + 2)) / 28 + form / 100, 0.1, 0.85);
  if (kind === "grapple1") return clamp2(0.5 + (st.bjj * 0.75 + st.wrest * 0.25 - (lvl + 8)) / 26 + form / 100, 0.1, 0.85);
  if (kind === "kick") return clamp2(0.5 + (st.stand * 0.6 + st.cardio * 0.2 + st.chin * 0.2 - (lvl + 3)) / 28 + form / 100, 0.1, 0.85);
  return 1;
}
function bump(s, k, n) {
  s.stats[k] = clamp2(s.stats[k] + n, 1, 99);
  s.potential[k] = Math.max(s.potential[k], s.stats[k]);
}
function resolveInvite(rng, s, inv, form) {
  s.flags.sideTired = 1;
  s.flags.sideEvents = (s.flags.sideEvents ?? 0) + 1;
  if (inv.kind === "seminar") {
    s.money += inv.prize;
    s.totalEarned += inv.prize;
    s.rep = clamp2(s.rep + 1, 0, 100);
    s.media = clamp2(s.media + 1, 0, 100);
    return {
      title: inv.title,
      lines: [`Wyp\u0142ata: ${inv.prize.toLocaleString("pl-PL")} z\u0142`, "Reputacja +1, media +1"],
      text: "Sala pe\u0142na, ludzie zachwyceni, a ty wracasz z kopert\u0105. Tylko nogi bol\u0105 od stania ca\u0142y weekend.",
      tone: "good",
      win: true
    };
  }
  if (inv.kind === "camp") {
    s.money -= inv.fee;
    const st = inv.stat ?? "wrest";
    bump(s, st, 2);
    s.potential[st] = clamp2(s.potential[st] + 1, 1, 99);
    s.wear = clamp2(s.wear + 1, 0, 100);
    const name = { stand: "St\xF3jka", wrest: "Zapasy", bjj: "Parter", cardio: "Kondycja", chin: "Szcz\u0119ka", iq: "Taktyka" }[st];
    return { title: inv.title, lines: [`${name} +2, potencja\u0142 +1`, `Koszt: ${inv.fee.toLocaleString("pl-PL")} z\u0142`, "Zu\u017Cycie +1"], text: "Wracasz zm\u0119czony jak nigdy, ale z rzeczami, kt\xF3rych w swojej sali nie da\u0142oby si\u0119 nauczy\u0107.", tone: "purple", win: true };
  }
  if (inv.kind === "charity") {
    s.rep = clamp2(s.rep + 4, 0, 100);
    s.media = clamp2(s.media + 2, 0, 100);
    s.flags.charity = (s.flags.charity ?? 0) + 1;
    return { title: inv.title, lines: ["Reputacja +4, media +2", "Bez pieni\u0119dzy"], text: "Zdj\u0119cie z dzieciakami obiega lokalne media. Kilku sponsor\xF3w pisze, \u017Ce \u201Etakich ludzi chc\u0105 wspiera\u0107\u201D.", tone: "good", win: true };
  }
  if (inv.kind === "podcast") {
    s.money += inv.prize;
    s.totalEarned += inv.prize;
    const gaffe = rng.chance(0.25);
    s.media = clamp2(s.media + (gaffe ? 4 : 2), 0, 100);
    if (gaffe) s.rep = clamp2(s.rep - 3, 0, 100);
    return {
      title: inv.title,
      lines: [gaffe ? "Media +4, reputacja \u22123 (klip z nieostro\u017Cnym zdaniem)" : "Media +2", `Wyp\u0142ata: ${inv.prize.toLocaleString("pl-PL")} z\u0142`],
      text: gaffe ? "Po trzech godzinach m\xF3wisz o jedno zdanie za du\u017Co o federacji. Klip ma p\xF3\u0142 miliona wy\u015Bwietle\u0144, a prezes nie odbiera od ciebie telefonu." : "Spokojna, m\u0105dra rozmowa. W komentarzach ludzie pisz\u0105, \u017Ce nie spodziewali si\u0119 takiej g\u0142owy po \u201Ezawodniku MMA\u201D.",
      tone: gaffe ? "neutral" : "good",
      win: !gaffe
    };
  }
  if (inv.kind === "celebrity") {
    s.money += inv.prize;
    s.totalEarned += inv.prize;
    s.media = clamp2(s.media + 3, 0, 100);
    s.rep = clamp2(s.rep - 2, 0, 100);
    return { title: inv.title, lines: [`Wyp\u0142ata: ${inv.prize.toLocaleString("pl-PL")} z\u0142`, "Media +3, reputacja \u22122"], text: "Miesi\u0105c trening\xF3w z kim\u015B, kto po pi\u0119ciu minutach siada na \u0142awce. Nagrania maj\u0105 miliony wy\u015Bwietle\u0144, a w twoim klubie nikt o tym nie rozmawia.", tone: "good", win: true };
  }
  if (inv.kind === "film") {
    s.money += inv.prize;
    s.totalEarned += inv.prize;
    s.media = clamp2(s.media + 3, 0, 100);
    s.rep = clamp2(s.rep - 1, 0, 100);
    s.flags.filmRoles = (s.flags.filmRoles ?? 0) + 1;
    return {
      title: inv.title,
      lines: [`Wyp\u0142ata: ${inv.prize.toLocaleString("pl-PL")} z\u0142`, "Media +3, reputacja \u22121 (\u015Brodowisko si\u0119 pod\u015Bmiewa)"],
      text: "Na planie wszyscy m\xF3wi\u0105 do ciebie \u201Epanie mistrzu\u201D. W internecie klip robi furor\u0119, a w szatni s\u0142yszysz \u201Eo, aktor przyszed\u0142\u201D.",
      tone: "good",
      win: true
    };
  }
  s.money -= inv.fee;
  if (inv.kind === "grapple1") {
    const p2 = sideChance(s, "grapple1", form);
    const ok2 = rng.chance(p2);
    const show = Math.round(inv.prize / 2 / 100) * 100;
    s.money += show + (ok2 ? inv.prize - show : 0);
    s.totalEarned += show + (ok2 ? inv.prize - show : 0);
    if (ok2) {
      bump(s, "bjj", 1);
      s.media = clamp2(s.media + 2, 0, 100);
      s.rep = clamp2(s.rep + 2, 0, 100);
      s.flags.grapplingGold = (s.flags.grapplingGold ?? 0) + 1;
    }
    const lines2 = [ok2 ? rng.chance(0.5) ? "Wygrana przez duszenie w 7. minucie" : "Wygrana na punkty po dziesi\u0119ciu minutach" : rng.chance(0.5) ? "Odklepujesz d\u017Awigni\u0119 na kolano" : "Przegrana na punkty", ok2 ? `Parter +1, media +2, reputacja +2, ca\u0142a stawka ${inv.prize.toLocaleString("pl-PL")} z\u0142` : `Za wyj\u015Bcie: ${show.toLocaleString("pl-PL")} z\u0142`];
    if (!s.injury && rng.chance(0.05)) {
      s.injury = { name: "naci\u0105gni\u0119te wi\u0119zad\u0142o w kolanie", seasons: 1, penalty: 3 };
      lines2.push("Kontuzja: naci\u0105gni\u0119te wi\u0119zad\u0142o w kolanie (testy \u22123 pkt)");
    }
    return { title: inv.title, lines: lines2, text: ok2 ? "Specjalista od chwyt\xF3w musia\u0142 uzna\u0107 wy\u017Cszo\u015B\u0107 \u201Etego z MMA\u201D. Klip z duszenia kr\u0105\u017Cy po wszystkich grupach grapplingowych." : "Na macie bez cios\xF3w to by\u0142 jego \u015Bwiat. Ale pieni\u0105dze za wyj\u015Bcie s\u0105 w kieszeni, a lekcja bezcenna.", tone: ok2 ? "purple" : "neutral", win: ok2 };
  }
  if (inv.kind === "kick") {
    const p2 = sideChance(s, "kick", form);
    const ok2 = rng.chance(p2);
    if (ok2) {
      bump(s, rng.chance(0.5) ? "stand" : "cardio", 1);
      s.money += inv.prize;
      s.totalEarned += inv.prize;
      s.media = clamp2(s.media + 2, 0, 100);
      s.flags.kickWins = (s.flags.kickWins ?? 0) + 1;
      return { title: inv.title, lines: [rng.chance(0.3) ? "Wygrana przez nokaut kolanem" : "Wygrana na punkty po trzech rundach", `St\xF3jka albo kondycja +1, ga\u017Ca ${inv.prize.toLocaleString("pl-PL")} z\u0142, media +2`], text: "Kickbokserzy my\u015Bleli, \u017Ce \u201Eten z MMA\u201D umie tylko obala\u0107. My\u015Bleli \u017Ale.", tone: "good", win: true };
    }
    const half = Math.round(inv.prize / 2 / 100) * 100;
    s.money += half;
    s.totalEarned += half;
    const ko = rng.chance(0.25);
    s.wear = clamp2(s.wear + (ko ? 5 : 3), 0, 100);
    s.rep = clamp2(s.rep - 1, 0, 100);
    return { title: inv.title, lines: [ko ? "Przegrana przez nokaut po kopni\u0119ciu na g\u0142ow\u0119" : "Przegrana na punkty", `Po\u0142owa ga\u017Cy: ${half.toLocaleString("pl-PL")} z\u0142, zu\u017Cycie +${ko ? 5 : 3}`], text: ko ? "Wysokie kopni\u0119cie, kt\xF3rego nie widzia\u0142e\u015B. Obudzi\u0142e\u015B si\u0119 ju\u017C w naro\u017Cniku." : "Kickbokser by\u0142 szybszy na nogach i lepiej czyta\u0142 dystans.", tone: "bad", win: false };
  }
  if (inv.kind === "grappling") {
    const p2 = sideChance(s, "grappling", form);
    const stages = ["\u0107wier\u0107fina\u0142", "p\xF3\u0142fina\u0142", "fina\u0142"];
    const lines2 = [];
    let won = 0;
    for (const st of stages) {
      const ok2 = rng.chance(p2);
      lines2.push(`${st}: ${ok2 ? rng.chance(0.5) ? "wygrana przez duszenie" : "wygrana na punkty" : rng.chance(0.5) ? "odklepujesz" : "przegrana na punkty"}`);
      if (!ok2) break;
      won++;
    }
    let text2;
    let tone2;
    if (won === 3) {
      bump(s, "bjj", 2);
      bump(s, "wrest", 1);
      s.money += inv.prize;
      s.totalEarned += inv.prize;
      s.rep = clamp2(s.rep + 2, 0, 100);
      s.media = clamp2(s.media + 1, 0, 100);
      s.flags.grapplingGold = (s.flags.grapplingGold ?? 0) + 1;
      lines2.push(`Z\u0142oto! Parter +2, zapasy +1, nagroda ${inv.prize.toLocaleString("pl-PL")} z\u0142`);
      text2 = `Z\u0142oto na ${inv.title}. Trzy walki, trzy wygrane, a ludzie z grapplingu pytaj\u0105, czemu marnujesz si\u0119 w MMA.`;
      tone2 = "purple";
    } else if (won === 2) {
      bump(s, "bjj", 1);
      const pr = Math.round(inv.prize / 3 / 100) * 100;
      s.money += pr;
      s.totalEarned += pr;
      lines2.push(`Srebro: parter +1${pr ? `, nagroda ${pr.toLocaleString("pl-PL")} z\u0142` : ""}`);
      text2 = "Srebro. Fina\u0142 przegrany ze specjalist\u0105, ale w parterze czujesz si\u0119 pewniej ni\u017C kiedykolwiek.";
      tone2 = "good";
    } else {
      lines2.push(won === 1 ? "Odpadasz w p\xF3\u0142finale. Co\u015B tam zostaje w g\u0142owie." : "Odpadasz w pierwszej walce.");
      if (won === 1 && rng.chance(0.5)) bump(s, "bjj", 1);
      text2 = won === 1 ? "P\xF3\u0142fina\u0142. Specjali\u015Bci od grapplingu to inna liga, ale wiesz ju\u017C, czego ci brakuje." : "Pierwsza walka i koniec. Ch\u0142opak w kimonie zrobi\u0142 z tob\u0105, co chcia\u0142.";
      tone2 = "bad";
    }
    if (!s.injury && rng.chance(0.06)) {
      s.injury = { name: "naci\u0105gni\u0119te wi\u0119zad\u0142o w \u0142okciu", seasons: 1, penalty: 3 };
      lines2.push("Kontuzja: naci\u0105gni\u0119te wi\u0119zad\u0142o w \u0142okciu (testy \u22123 pkt)");
    }
    return { title: inv.title, lines: lines2, text: text2, tone: tone2, win: won === 3 };
  }
  const p = sideChance(s, "boxing", form);
  const ok = rng.chance(p);
  const lines = [];
  let text;
  let tone;
  if (ok) {
    bump(s, "stand", 1);
    s.money += inv.prize;
    s.totalEarned += inv.prize;
    s.media = clamp2(s.media + 2, 0, 100);
    s.flags.boxingWins = (s.flags.boxingWins ?? 0) + 1;
    const ko = rng.chance(0.35);
    lines.push(ko ? "Wygrana przez nokaut w 3. rundzie" : "Wygrana na punkty po czterech rundach", `St\xF3jka +1, ga\u017Ca ${inv.prize.toLocaleString("pl-PL")} z\u0142, media +2`);
    text = ko ? "Bokser nie spodziewa\u0142 si\u0119 takiej si\u0142y od \u201Ezapa\u015Bnika z klatki\u201D. Hala wstaje." : "Cztery rundy nauki boksu za pieni\u0105dze. S\u0119dziowie widz\u0105 to po twojej stronie.";
    tone = "good";
  } else {
    const half = Math.round(inv.prize / 2 / 100) * 100;
    s.money += half;
    s.totalEarned += half;
    const ko = rng.chance(0.3);
    s.wear = clamp2(s.wear + (ko ? 6 : 3), 0, 100);
    s.rep = clamp2(s.rep - 1, 0, 100);
    if (ko) s.media = clamp2(s.media - 1, 0, 100);
    lines.push(ko ? "Przegrana przez nokaut w 2. rundzie" : "Przegrana na punkty", `Po\u0142owa ga\u017Cy: ${half.toLocaleString("pl-PL")} z\u0142, zu\u017Cycie +${ko ? 6 : 3}`);
    text = ko ? "Bokser trafi\u0142 ci\u0119 czysto w szcz\u0119k\u0119. W boksie nie ma obale\u0144, kt\xF3re by ci\u0119 uratowa\u0142y." : "Bokser by\u0142 szybszy na nogach i lepszy w wymianach. Cenna, cho\u0107 bolesna lekcja.";
    tone = "bad";
  }
  return { title: inv.title, lines, text, tone, win: ok };
}

// src/engine/coaches.ts
var COACHES = [
  { id: "club", name: "Trener klubowy", role: "prowadzi ca\u0142\u0105 grup\u0119", desc: "Bez fajerwerk\xF3w, za to za darmo. Na treningu ma pod opiek\u0105 dwudziestu ch\u0142opak\xF3w naraz.", growth: {} },
  { id: "boks", name: "Zbigniew \u201ELewy\u201D Maci\u0105g", role: "trener boksu", desc: "By\u0142y olimpijczyk. Tarcze, worki i sparingi z bokserami: st\xF3jka i szcz\u0119ka rosn\u0105 szybciej.", growth: { stand: 1.2, chin: 1.1 } },
  { id: "parter", name: "Paulo \u201EGringo\u201D Souza", role: "trener BJJ i zapas\xF3w", desc: "Czarny pas z Rio, od lat w Polsce. Zapasy i parter rosn\u0105 szybciej.", growth: { wrest: 1.2, bjj: 1.3 } },
  { id: "naroznik", name: "Ryszard \u201EProfesor\u201D Bielak", role: "taktyk w naro\u017Cniku", desc: "Mi\u0119dzy rundami m\xF3wi trzy zdania i ka\u017Cde trafia. +3% do ka\u017Cdej decyzji od 2. rundy, taktyka ro\u015Bnie szybciej.", growth: { iq: 1.3 }, corner: { from: 2, bonus: 3 } },
  { id: "kontakty", name: "Marek \u201EPaszport\u201D Wilk", role: "trener z kontaktami", desc: "Zna promotor\xF3w od Dubaju po Tokio. Cz\u0119\u015Bciej dostajesz zaproszenia na gale za granic\u0105 i turnieje grapplingowe, kondycja ro\u015Bnie szybciej.", growth: { cardio: 1.2 }, contacts: true }
];
var COACH_COST = [0, 2500, 6e3, 14e3, 32e3];
function coachOf(s) {
  if (s.tier < 1 || !s.proDebut) return COACHES[0];
  return COACHES.find((c) => c.id === (s.coach ?? "club")) ?? COACHES[0];
}
function coachCost(s, id) {
  const c = id ?? coachOf(s).id;
  if (c === "club" || s.tier < 1) return 0;
  return COACH_COST[s.tier] ?? 0;
}
function coachGrowth(s, k) {
  return coachOf(s).growth[k] ?? 1;
}
function coachOpen(s) {
  return s.tier >= 1 && !!s.proDebut && s.contract.kind !== "freak";
}

// src/engine/roster.ts
var clamp3 = (v, a, b) => Math.max(a, Math.min(b, v));
var divOf = (s) => s.division ?? s.profile.weight ?? "polsrednia";
var matches = (r, s) => r.fed === s.fed && r.tier === s.tier && (r.div ?? divOf(s)) === divOf(s);
var ARCHIVE_MAX = 6;
function rosterFor(s) {
  if (s.tier < 1 || s.contract.kind === "freak") return null;
  const r = s.roster;
  if (r && matches(r, s)) return r;
  return null;
}
function archiveRoster(s) {
  const r = s.roster;
  if (!r) return;
  if (!r.div) r.div = divOf(s);
  if (r.season === void 0) r.season = s.season;
  const arch = (s.rosterArchive ?? []).filter((x) => !(x.fed === r.fed && x.tier === r.tier && x.div === r.div));
  arch.unshift(r);
  s.rosterArchive = arch.slice(0, ARCHIVE_MAX);
  s.roster = null;
}
function ensureRoster(rng, s) {
  if (s.tier < 1 || s.contract.kind === "freak") return null;
  const have = rosterFor(s);
  if (have) {
    if (!have.div) have.div = divOf(s);
    normalize(have, s);
    return have;
  }
  if (s.roster) archiveRoster(s);
  const ai = (s.rosterArchive ?? []).findIndex((x) => matches(x, s));
  if (ai >= 0) {
    const r = s.rosterArchive.splice(ai, 1)[0];
    const years = Math.min(4, Math.max(0, s.season - (r.season ?? s.season)));
    for (let y = 0; y < years; y++) tickRoster(rng, r, s, false);
    r.season = s.season;
    s.roster = r;
    normalize(r, s);
    pruneNemesis(s, r);
    return r;
  }
  const size = RANK_SIZE[s.tier];
  const list = [];
  for (let r = 0; r <= size; r++) {
    const o = generateOpponent(rng, s.tier, r, s.profile.difficulty === "hard");
    list.push({ ...o, rank: r, h2h: { w: 0, l: 0, d: 0 }, champSince: r === 0 ? s.season - rng.int(0, 2) : void 0 });
  }
  s.roster = { fed: s.fed, tier: s.tier, div: divOf(s), season: s.season, list };
  normalize(s.roster, s);
  pruneNemesis(s, s.roster);
  return s.roster;
}
function normalize(r, s) {
  const playerChamp = s.rank === 0 && matches(r, s);
  let champ = r.list.find((f) => f.rank === 0);
  if (playerChamp && champ) champ.rank = 1;
  if (!playerChamp && !champ) {
    const best = [...r.list].sort((a, b) => a.rank - b.rank)[0];
    if (best) {
      best.rank = 0;
      best.champSince = s.season;
    }
  }
  champ = playerChamp ? void 0 : r.list.find((f) => f.rank === 0);
  const rest = r.list.filter((f) => f !== champ).sort((a, b) => a.rank - b.rank);
  rest.forEach((f, i) => f.rank = i + 1);
  if (champ) champ.rank = 0;
}
function rosterOpp(rng, s, rank, exclude) {
  const r = ensureRoster(rng, s);
  if (r) {
    const size = RANK_SIZE[s.tier];
    const want = clamp3(rank, 0, size);
    const cands = r.list.filter((f) => !exclude.has(f.id) && (want === 0 || f.rank !== 0));
    const exact = cands.find((f) => f.rank === want);
    const near = exact ?? [...cands].sort((a, b) => Math.abs(a.rank - want) - Math.abs(b.rank - want))[0];
    if (near && (want !== 0 || near.rank === 0)) {
      const { h2h: _h, champSince: _c, ...f } = near;
      void _h;
      void _c;
      const mine = s.rank;
      const shown = mine !== null && mine > 0 && f.rank >= mine ? f.rank + 1 : f.rank;
      return { ...f, rank: shown, stats: { ...near.stats }, record: { ...near.record } };
    }
  }
  return generateOpponent(rng, s.tier, rank, s.profile.difficulty === "hard");
}
function rosterFighter(s, id) {
  return rosterFor(s)?.list.find((f) => f.id === id);
}
function rosterAfterFight(s, oppId, res, title, defense, rankBefore) {
  const r = rosterFor(s);
  if (!r) return;
  const f = r.list.find((x) => x.id === oppId);
  if (!f) return;
  const size = RANK_SIZE[s.tier];
  if (res === "W") {
    f.h2h.w++;
    f.record.l++;
    if (title && !defense) f.rank = 1;
    else if (defense) f.rank = Math.min(size, Math.max(f.rank, 1) + 3);
    else f.rank = rankBefore === null ? Math.min(size, f.rank + 3) : Math.max(f.rank, rankBefore);
  } else if (res === "L") {
    f.h2h.l++;
    f.record.w++;
    if (title && defense) {
      f.rank = 0;
      f.champSince = s.season;
    } else if (!title) f.rank = Math.max(1, f.rank - 1);
  } else {
    f.h2h.d++;
    f.record.d++;
  }
  normalize(r, s);
}
function rosterYear(rng, s) {
  const r = rosterFor(s);
  if (!r) return null;
  const note = tickRoster(rng, r, s, s.rank === 0);
  r.season = s.season + 1;
  normalize(r, s);
  const n = s.nemesis;
  if (n && n.fed === r.fed && n.tier === r.tier && n.div === r.div && !r.list.some((f) => f.id === n.id)) {
    s.nemesis = null;
    return `${note ? note + " " : ""}${n.name} ko\u0144czy karier\u0119. Rachunku z nim ju\u017C nie wyr\xF3wnasz.`;
  }
  return note;
}
function tickRoster(rng, r, s, playerChamp) {
  const size = RANK_SIZE[r.tier];
  let note = null;
  for (const f of r.list) {
    f.age += 1;
    const w = rng.int(1, 3);
    const l = rng.int(0, 2);
    f.record.w += w;
    f.record.l += l;
    if (f.rank > 0) f.rank = clamp3(f.rank + rng.int(-2, 2), 1, size);
  }
  const champ = r.list.find((f) => f.rank === 0);
  if (!playerChamp && champ && rng.chance(0.3)) {
    const contenders = r.list.filter((f) => f.rank >= 1 && f.rank <= 3);
    const nc = rng.pick(contenders.length ? contenders : r.list.filter((f) => f !== champ));
    if (nc) {
      champ.rank = rng.int(2, 4);
      nc.rank = 0;
      nc.champSince = s.season + 1;
      note = `W federacji nowy mistrz: ${nc.firstName} ${nc.lastName}. Dotychczasowy mistrz, ${champ.firstName} ${champ.lastName}, spada w rankingu.`;
    }
  } else if (!playerChamp && champ) {
    const yrs = s.season + 1 - (champ.champSince ?? s.season);
    if (yrs >= 2) note = `${champ.firstName} ${champ.lastName} dalej trzyma pas, ju\u017C ${yrs} ${yrs < 5 ? "lata" : "lat"} z rz\u0119du.`;
  }
  for (let i = 0; i < r.list.length; i++) {
    const f = r.list[i];
    if (f.rank === 0) continue;
    const keep = s.nemesis?.id === f.id ? 0.5 : 1;
    if (f.age >= 36 && rng.chance(0.4 * keep) || rng.chance(0.05 * keep)) {
      const n = generateOpponent(rng, r.tier, size, s.profile.difficulty === "hard");
      r.list[i] = { ...n, rank: size + 1, h2h: { w: 0, l: 0, d: 0 } };
    }
  }
  return note;
}
function rosterSync(s) {
  const r = rosterFor(s);
  if (r) {
    normalize(r, s);
    pruneNemesis(s, r);
  }
}
function pruneNemesis(s, r) {
  const n = s.nemesis;
  if (n && n.fed === r.fed && n.tier === r.tier && n.div === (r.div ?? divOf(s)) && !r.list.some((f) => f.id === n.id)) s.nemesis = null;
}
var METHODS = [
  (w, l, r) => `${w} kontra ${l}: nokaut w ${r}. rundzie, g\xF3r\u0105 ${w.split(" ").pop()}`,
  (w, l, r) => `${w} kontra ${l}: duszenie w ${r}. rundzie, wygrywa ${w.split(" ").pop()}`,
  (w, l) => `${w} kontra ${l}: wojna do ostatniego gongu, na punkty wygrywa ${w.split(" ").pop()}`,
  (w, l, r) => `${w} kontra ${l}: s\u0119dzia przerywa w ${r}. rundzie, wygrywa ${w.split(" ").pop()}`,
  (w, l) => `${w} kontra ${l}: niejednog\u0142o\u015Bna decyzja, wygrywa ${w.split(" ").pop()}, hala gwi\u017Cd\u017Ce`
];
var INJURIES = ["zerwane wi\u0119zad\u0142o w kolanie", "z\u0142aman\u0105 r\u0119k\u0119", "kontuzj\u0119 barku", "p\u0119kni\u0119ty oczod\xF3\u0142", "operacj\u0119 \u0142okcia"];
var QUOTES = [
  "m\xF3wi, \u017Ce ma ci\u0119 na li\u015Bcie i nie zamierza czeka\u0107",
  "w podca\u015Bcie opowiada, \u017Ce wasza walka by\u0142a \u201Erozgrzewk\u0105\u201D",
  "wrzuca nagranie waszej walki z podpisem \u201Epowt\xF3rka?\u201D",
  "na konferencji pyta, czemu unikasz rewan\u017Cu",
  "twierdzi, \u017Ce wygra\u0142 z tob\u0105 na p\xF3\u0142 gwizdka"
];
var nm = (f) => `${f.firstName} ${f.lastName}`;
function rosterNews(rng, s, after) {
  const r = rosterFor(s);
  if (!r || r.list.length < 4) return null;
  const size = RANK_SIZE[r.tier];
  const nem = s.nemesis && matches(r, s) ? r.list.find((f) => f.id === s.nemesis.id) : void 0;
  const roll = rng.next();
  if (nem && roll < 0.2) {
    s.flags.nemesisHeat = 1;
    return { after, kind: "nemesis", text: `${nm(nem)} ${rng.pick(QUOTES)}.` };
  }
  const champ = r.list.find((f) => f.rank === 0);
  const r2 = rng.next();
  if (champ && s.rank !== 0 && !(s.flags.interim ?? 0) && !s.run?.fights.some((f) => f.interim) && r2 < 0.25) {
    const ch = r.list.filter((f) => f.rank >= 1 && f.rank <= 3);
    const c = rng.pick(ch.length ? ch : r.list.filter((f) => f !== champ));
    if (!c) return null;
    const rd2 = rng.int(1, 5);
    if (rng.chance(0.25)) {
      c.record.w++;
      champ.record.l++;
      c.rank = 0;
      c.champSince = s.season;
      champ.rank = rng.int(2, 4);
      normalize(r, s);
      return { after, kind: "title", text: `Nowy mistrz! ${rng.pick(METHODS)(nm(c), nm(champ), rd2)}. Pas zmienia w\u0142a\u015Bciciela.` };
    }
    champ.record.w++;
    c.record.l++;
    c.rank = Math.min(size, c.rank + rng.int(1, 3));
    normalize(r, s);
    return { after, kind: "title", text: `Obrona pasa. ${rng.pick(METHODS)(nm(champ), nm(c), rd2)}.` };
  }
  if (r2 < 0.37) {
    const f = rng.pick(r.list.filter((x) => x.rank >= 1 && x.rank <= Math.min(size, 8)));
    if (!f) return null;
    f.rank = size;
    normalize(r, s);
    return { after, kind: "injury", text: `${nm(f)} ma ${rng.pick(INJURIES)} i wypada z czo\u0142\xF3wki rankingu.` };
  }
  if (r2 < 0.5 && s.rank !== null && s.rank > 0) {
    const f = rng.pick(r.list.filter((x) => x.rank >= 1 && Math.abs(x.rank - s.rank) <= 3));
    if (f) {
      return { after, kind: "callout", text: `${nm(f)} (nr ${f.rank} rankingu) wywo\u0142uje ci\u0119 w wywiadzie: \u201ENiech przyjdzie, je\u015Bli si\u0119 nie boi\u201D.` };
    }
  }
  const pool = r.list.filter((x) => x.rank >= 1).sort((a2, b2) => a2.rank - b2.rank);
  if (pool.length < 2) return null;
  const i = rng.int(0, Math.max(0, pool.length - 2));
  const a = pool[i];
  const b = pool[Math.min(pool.length - 1, i + rng.int(1, 3))];
  const upset = rng.chance(0.4);
  const w = upset ? b : a;
  const l = upset ? a : b;
  w.record.w++;
  l.record.l++;
  if (w.rank > l.rank) {
    const tmp = w.rank;
    w.rank = l.rank;
    l.rank = tmp;
  }
  normalize(r, s);
  const rd = rng.int(1, 3);
  return { after, kind: "result", text: `${rng.pick(METHODS)(nm(w), nm(l), rd)}${upset ? " (niespodzianka, by\u0142 ni\u017Cej w rankingu)" : ""}.` };
}

// src/engine/extras.ts
var JOB_OPTIONS = [
  { id: "full", label: "Pe\u0142ny etat", short: "etat", living: 0.15, form: -2, desc: "Praca pokrywa prawie ca\u0142e \u017Cycie. Trenujesz po o\u015Bmiu godzinach w robocie, wi\u0119c forma cierpi." },
  { id: "half", label: "P\xF3\u0142 etatu", short: "p\xF3\u0142 etatu", living: 0.5, form: 0, desc: "Po\u0142owa koszt\xF3w z pensji, rano trening, popo\u0142udniu praca." },
  { id: "none", label: "Tylko trening", short: "bez pracy", living: 1, form: 4, desc: "\u017Byjesz z walk i oszcz\u0119dno\u015Bci. Dwa treningi dziennie i regeneracja, ale ka\u017Cda z\u0142ot\xF3wka si\u0119 liczy." }
];
function jobAvailable(s) {
  return s.age >= 19 && s.tier <= 2 && s.contract.kind !== "freak";
}
function defaultJob(s) {
  if (s.tier <= 1) return "full";
  if (s.tier === 2 && (s.rank === null || s.rank > 3)) return "half";
  return "none";
}
function jobMode(s) {
  const jy = s.flags.jobYear ?? 0;
  if (s.phase === "season" && jy && Math.floor(jy / 10) === s.season) return ["full", "half", "none"][jy % 10 - 1] ?? null;
  if (!jobAvailable(s)) return null;
  return s.job ?? defaultJob(s);
}
function jobDef(s) {
  const m = jobMode(s);
  return m ? JOB_OPTIONS.find((j) => j.id === m) : null;
}
function jobForm(s) {
  return jobDef(s)?.form ?? 0;
}
var SOCIAL_OPTIONS = [
  { id: "off", label: "Wcale", desc: "Telefon w szafce, pe\u0142ne skupienie na treningu (forma +1). Obserwuj\u0105cy przybywaj\u0105 tylko po g\u0142o\u015Bnych walkach, a rozpoznawalno\u015B\u0107 sama nie ro\u015Bnie.", gain: 0.6, form: 1 },
  { id: "self", label: "Sam", desc: "Relacje z trening\xF3w i odpowiadanie na komentarze. Co rok ro\u015Bnie rozpoznawalno\u015B\u0107, przybywa ludzi, a marki p\u0142ac\u0105 za posty. Kosztuje tylko skupienie, kt\xF3re da\u0142by telefon w szafce.", gain: 1.3, form: 0 },
  { id: "pro", label: "Social media manager", desc: "Kto\u015B montuje filmy i ogarnia wsp\xF3\u0142prace. P\u0142acisz, ale obserwuj\u0105cych przybywa najszybciej, a wsp\xF3\u0142prace s\u0105 lepiej p\u0142atne.", gain: 2.1, form: 0 }
];
var SMM_COST = [3e3, 4e3, 9e3, 24e3, 6e4];
function followersOf(s) {
  if (typeof s.followers === "number") return s.followers;
  return Math.round(150 + s.media * s.media * 60);
}
function socialMode(s) {
  return s.social ?? "off";
}
function socialDef(s) {
  return SOCIAL_OPTIONS.find((o) => o.id === socialMode(s));
}
function socialCost(s) {
  return socialMode(s) === "pro" ? SMM_COST[s.tier] ?? 9e3 : 0;
}
function socialIncome(s) {
  const m = socialMode(s);
  if (m === "off") return 0;
  const k = followersOf(s) / 1e3;
  if (k < 2) return 0;
  return Math.round(k * (m === "pro" ? 420 : 300) / 500) * 500;
}
function socialForm(s) {
  return socialDef(s).form;
}
var FAN_BASE = [25, 120, 700, 3500, 22e3];
function fanGain(s, r, roll) {
  const base = FAN_BASE[r.tier] ?? 100;
  let g = r.result === "W" ? base * (r.finish ? 2.2 : 1) : r.result === "D" ? base * 0.4 : base * (r.finish ? 0.15 : 0.3);
  if (r.title) g *= 2;
  if (r.bonus) g *= 1.4;
  if (r.freak) g *= 4;
  if (r.amateur) g *= 0.4;
  g *= socialDef(s).gain * (0.75 + roll * 0.5);
  return Math.max(0, Math.round(g));
}
function addFans(s, n) {
  s.followers = Math.max(0, followersOf(s) + Math.round(n));
}
function fmtFans(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(".", ",")} mln`;
  if (n >= 1e4) return `${Math.round(n / 1e3)} tys.`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1).replace(".", ",")} tys.`;
  return String(n);
}
var TICKET_PRICE = 80;
var TICKET_CUT = 0.25;
function ticketsAvailable(s, o) {
  return s.tier === 1 && s.contract.kind !== "freak" && !o.tuneup && !o.short && !o.opp.freak;
}
function ticketForecast(s, plan) {
  if (plan === "none") return 0;
  const fans = followersOf(s);
  const base = 18 + s.media * 0.7 + Math.min(40, fans / 150) + Math.max(0, s.streak) * 3 + (s.relations >= 3 ? 6 : 0);
  return Math.round(base * (plan === "push" ? 1.75 : 1));
}
function ticketSale(s, plan, roll) {
  const sold = Math.round(ticketForecast(s, plan) * (0.75 + roll * 0.5));
  return { sold, cut: Math.round(sold * TICKET_PRICE * TICKET_CUT / 50) * 50 };
}
function ticketRep(s) {
  return s.flags.ticketRep ?? 0;
}

// src/engine/game.ts
var SAVE_VERSION = 2;
function withRng(s, fn) {
  const rng = createRng(s.rngState);
  const out = fn(rng);
  s.rngState = rng.state();
  return out;
}
function clone(s) {
  return structuredClone(s);
}
function fullName(s) {
  return `${s.profile.firstName} ${s.profile.lastName}`;
}
function displayName(s) {
  const p = s.profile;
  return p.nickname ? `${p.firstName} \u201E${p.nickname}\u201D ${p.lastName}` : `${p.firstName} ${p.lastName}`;
}
function fighterName(f) {
  return f.nickname ? `${f.firstName} \u201E${f.nickname}\u201D ${f.lastName}` : `${f.firstName} ${f.lastName}`;
}
function recStr(r) {
  return `${r.w}-${r.l}-${r.d}`;
}
function mainRecord(s) {
  return s.proDebut ? s.record : s.amRecord;
}
function mainRecordLabel(s) {
  return s.proDebut ? "rekord zawodowy" : "rekord amatorski";
}
function totalWins(s) {
  return s.record.w + s.amRecord.w;
}
function medalCount(s) {
  return s.medals.gold + s.medals.silver + s.medals.bronze;
}
function weightLabel(s) {
  return WEIGHTS[divisionKey(s)].label;
}
function divisionKey(s) {
  return s.division ?? s.profile.weight ?? "polsrednia";
}
function weightShift(s) {
  return WEIGHT_KEYS.indexOf(divisionKey(s)) - WEIGHT_KEYS.indexOf(s.profile.weight ?? "polsrednia");
}
function divisionOptions(s) {
  const n = WEIGHT_KEYS.indexOf(s.profile.weight ?? "polsrednia");
  return [n - 1, n, n + 1].filter((i) => i >= 0 && i < WEIGHT_KEYS.length).map((i) => WEIGHT_KEYS[i]);
}
function weightMissChance(s) {
  if (weightShift(s) >= 0) return 0;
  return Math.round(clamp(7 + Math.max(0, s.age - 28) * 1.2 + (s.stats.cardio < 35 ? 4 : 0) + DIET[s.diet ?? "norma"].miss, 2, 30));
}
var DIET = {
  luz: { label: "Jem, co chc\u0119", desc: "Pierogi babci, kebab po treningu. G\u0142owa wypocz\u0119ta, ale waga ucieka.", miss: 6, cut: -8, form: 1, formCut: -1, cost: 0 },
  norma: { label: "Rozs\u0105dnie", desc: "Ry\u017C, kurczak, czasem pizza w niedziel\u0119. Bez szale\u0144stw w \u017Cadn\u0105 stron\u0119.", miss: 0, cut: 0, form: 0, formCut: 0, cost: 0 },
  strict: { label: "Ostra dieta", desc: "Liczysz ka\u017Cdy gram. Wag\u0119 robisz \u0142atwiej, ale na treningu brakuje paliwa.", miss: -4, cut: 6, form: -1, formCut: 0, cost: 0 },
  catering: { label: "Catering FitFighter", desc: "Pi\u0119\u0107 pude\u0142ek dziennie od dietetyka. Waga pod kontrol\u0105 i si\u0142y na treningu. P\u0142atne za ca\u0142y rok z g\xF3ry.", miss: -6, cut: 10, form: 1, formCut: 1, cost: 1200 }
};
function dietCost(s) {
  return Math.round(DIET.catering.cost * ([1, 1.5, 3, 5, 8][Math.min(4, Math.max(0, s.tier))] ?? 1) / 50) * 50;
}
function dietForm(s) {
  const d = DIET[s.diet ?? "norma"];
  return weightShift(s) < 0 ? d.formCut : d.form;
}
function setDiet(s0, mode) {
  if (!DIET[mode] || s0.phase === "ended" || (s0.diet ?? "norma") === mode) return s0;
  const midYear = s0.phase !== "budget" && s0.phase !== "training";
  const paid = !!s0.flags[`dietPaid:${s0.season}`];
  if (mode === "catering" && midYear && !paid && s0.money < dietCost(s0)) return s0;
  const s = clone(s0);
  if (mode === "catering" && midYear && !paid) {
    s.money -= dietCost(s);
    s.flags[`dietPaid:${s.season}`] = 1;
    log(s, `Wa\u017Cka: catering FitFighter na ca\u0142y rok (${dietCost(s)} z\u0142).`);
  }
  s.diet = mode;
  return s;
}
function changeDivision(s0, key) {
  if (!divisionOptions(s0).includes(key) || key === divisionKey(s0) || s0.tier < 1) return s0;
  const s = clone(s0);
  archiveRoster(s);
  s.division = key;
  clearCallFlags(s);
  if (s.rank !== null) {
    s.rank = null;
    s.titleDefenses = 0;
  }
  log(s, `Zmiana kategorii: ${WEIGHTS[key].label.toLowerCase()}.`);
  return s;
}
function rankStr(rank, tier) {
  if (rank === 0) return "Mistrz";
  if (rank === null) return "poza rankingiem";
  return `#${rank}${tier !== void 0 ? ` ${TIER_SHORT[tier]}` : ""}`;
}
function playerOvr(s) {
  return ovr(s.stats);
}
function effectiveStats(s) {
  return mapStats((k) => {
    let v = s.stats[k];
    if (k === "chin") v -= s.wear * 0.3;
    if (k === "cardio") v -= s.wear * 0.1;
    return Math.max(5, v);
  });
}
function log(s, text) {
  s.timeline.push({ season: s.season, age: s.age, text });
}
function fedFor(rng, tier, region) {
  const base = rng.pick(TIER_FEDS[tier]);
  return tier === 1 && region ? regionalFedName(base, region) : base;
}
function pl(n, one, few, many) {
  if (n === 1) return one;
  const d = n % 10;
  const t = n % 100;
  if (d >= 2 && d <= 4 && (t < 12 || t > 14)) return few;
  return many;
}
function randomProfile(rng) {
  const { firstName, lastName } = randomName(rng);
  const region = rng.pick(VOIVODESHIPS);
  return {
    firstName,
    lastName,
    nickname: "",
    region,
    hometown: rng.pick(HOMETOWNS[region]),
    style: rng.pick(["boxer", "kickboxer", "wrestler", "grappler", "brawler", "allround"]),
    weight: rng.pick(WEIGHT_KEYS),
    start: "osiedle",
    difficulty: "normal"
  };
}
function newGame(opts) {
  const rng = createRng(opts.seed);
  const p = opts.profile;
  const sp = START_PROFILES[p.start];
  const talent = sp.talent[0] + rng.next() * (sp.talent[1] - sp.talent[0]);
  const prof = STYLE_PROFILE[p.style];
  const potBase = 50 + talent * 44;
  const potential = mapStats((k) => clamp(Math.round(potBase + prof[k] * 0.8 + rng.int(-5, 5)), 35, 99));
  const startBase = 17 + talent * 9;
  const stats = mapStats((k) => clamp(Math.round(startBase + prof[k] * 0.6 + rng.int(-3, 3)), 6, 60));
  if (p.start === "wybraniec") for (const k of STAT_KEYS) potential[k] = clamp(potential[k] + 3, 35, 99);
  if (p.start === "junior") {
    stats.wrest = clamp(stats.wrest + 10, 6, 60);
    potential.wrest = clamp(potential.wrest + 6, 35, 99);
  }
  const wmod = WEIGHTS[p.weight ?? "polsrednia"].mod;
  for (const [k, v] of Object.entries(wmod)) {
    stats[k] = clamp(stats[k] + v, 6, 60);
    potential[k] = clamp(potential[k] + v, 35, 99);
  }
  const clubIdx = p.start === "biznes" ? 1 : 0;
  const club = makeClub(rng, clubIdx, p.hometown);
  const tier = 0;
  const contract = {
    id: "c0",
    tier,
    fed: TIER_FEDS[0][0],
    kind: "stay",
    seasons: 1,
    fights: TIER_FIGHTS[0],
    purse: 0,
    winBonus: 0,
    entryCost: TIER_ENTRY[0],
    startRank: null,
    note: "",
    available: true
  };
  const s = {
    v: SAVE_VERSION,
    slot: opts.slot,
    rngState: rng.state(),
    mode: opts.mode,
    quick: opts.quick || void 0,
    dailyLabel: opts.dailyLabel,
    createdAt: Date.now(),
    profile: { ...p },
    stats,
    potential,
    age: 16,
    season: 1,
    year: 2026,
    money: sp.money,
    totalEarned: 0,
    media: p.start === "biznes" ? 12 : p.start === "wybraniec" ? 10 : 3,
    rep: p.start === "junior" ? 30 : 20,
    relations: 5,
    wear: 0,
    injury: null,
    sponsors: [],
    loans: [],
    promises: [],
    brokenPromises: 0,
    tier,
    fed: contract.fed,
    rank: null,
    titleDefenses: 0,
    belts: [],
    peakTier: 0,
    peakRank: null,
    peakOvr: ovr(stats),
    club,
    clubSeasons: 0,
    contract,
    contractSeasonsLeft: 1,
    trainingPick: null,
    lastGains: {},
    record: { w: 0, l: 0, d: 0 },
    amRecord: { w: 0, l: 0, d: 0 },
    medals: { gold: 0, silver: 0, bronze: 0 },
    proDebut: null,
    finishes: { ko: 0, sub: 0, koLosses: 0, subLosses: 0 },
    streak: 0,
    freakFights: 0,
    history: [],
    seasons: [],
    timeline: [],
    peers: [],
    phase: "training",
    event: null,
    eventQueue: [],
    run: null,
    lastSummary: null,
    market: null,
    // nowa kariera zaczyna się od sparingu kontrolnego u trenera
    flags: { amLevel: 0, tryoutPending: 1 },
    seenEvents: [],
    ending: null
  };
  s.peers = createPeers(rng, 10, 16);
  for (const peer of s.peers) if (peer.lastName === p.lastName) peer.lastName = otherLastName(rng, p.lastName);
  s.rngState = rng.state();
  log(s, `Pierwszy trening: ${club.name}, ${club.city}.`);
  if (!s.quick) {
    s.eventQueue = ["prolog_ekipa", "prolog_trener", "sparing_kontrolny"];
    return nextEventOrSeason(s);
  }
  const tryout = findEvent("sparing_kontrolny");
  if (tryout) {
    s.phase = "event";
    s.event = { id: tryout.id, brand: tryout.brand, title: tryout.title ?? "Sparing kontrolny", text: tryout.text(s), choices: tryout.choices(s) };
  }
  return s;
}
function otherLastName(rng, avoid) {
  for (let i = 0; i < 20; i++) {
    const n = randomName(rng).lastName;
    if (n !== avoid) return n;
  }
  return avoid === "Nowak" ? "Kowalski" : "Nowak";
}
function introText(s) {
  if (s.flags.tryout === 2) return "Po sparingu trener nie ma w\u0105tpliwo\u015Bci: jedziesz od razu na Amatorski Puchar Polski. Ale najpierw ob\xF3z przygotowawczy, bo tam nikt nie da ci for\xF3w.";
  if (s.flags.tryout === 1) return "Po sparingu trener m\xF3wi wprost: na start zawody wojew\xF3dzkie, tam si\u0119 otrzaskasz. Najpierw ob\xF3z przygotowawczy, \u017Ceby by\u0142o z czym jecha\u0107.";
  return START_PROFILES[s.profile.start].intro;
}
function trainingPreview(s, k) {
  const room = Math.max(0, s.potential[k] - CLUB_CAP[s.club.quality] - s.stats[k]);
  let g = room * 0.13 + 2.2;
  if (k === s.club.specialty) g *= 1.15;
  g *= coachGrowth(s, k);
  if (s.age >= 33) g *= 0.5;
  if (room <= 0) g = 0.5;
  return Math.max(0.5, Math.round(g * 10) / 10);
}
function growthRate(s) {
  return ageRate(s.age) * CLUB_MULT[s.club.quality] * (s.flags.debt ? 0.75 : 1) * (s.tier <= 1 && s.age >= 19 ? 0.9 : 1);
}
function trainingForecast(s, k, focused, camp) {
  const room = Math.max(0, s.potential[k] - CLUB_CAP[s.club.quality] - s.stats[k]);
  let g = room * growthRate(s) * 0.85;
  if (k === s.club.specialty) g *= 1.25;
  g *= coachGrowth(s, k);
  if (focused) g += trainingPreview(s, k);
  const v = clamp(Math.round(s.stats[k] + g), 1, 99);
  return camp ? clamp(v + Math.max(0, Math.min(campGain(s, camp, k), s.potential[k] - v)), 1, 99) : v;
}
function clubLimits(s) {
  if (s.club.quality >= 5) return false;
  const near = STAT_KEYS.filter((k) => s.potential[k] - CLUB_CAP[s.club.quality] - s.stats[k] <= 4 && s.potential[k] - s.stats[k] > 6).length;
  return near >= 2;
}
var CAMPS = [
  { id: "tajlandia", name: "Tajlandia", place: "ob\xF3z muay thai pod Phuketem", desc: "Dwa treningi dziennie, 35 stopni i \u0142okcie od rana.", main: "stand", second: "cardio" },
  { id: "dagestan", name: "Dagestan", place: "sala zapa\u015Bnicza w g\xF3rach", desc: "Nikt nie m\xF3wi po polsku, za to ka\u017Cdy obala.", main: "wrest", second: "chin" },
  { id: "usa", name: "Floryda", place: "Top Squad na Florydzie", desc: "Sparingi z gwiazdami, analiza nagra\u0144 i najlepsza dieta.", main: "bjj", second: "iq" }
];
var CAMP_COST = [0, 0, 15e3, 5e4, 12e4];
function campCost(s) {
  return CAMP_COST[s.tier] ?? 0;
}
function campBlocked(s) {
  if (s.tier < 2) return "Obozy za granic\u0105 od ligi krajowej w g\xF3r\u0119.";
  if (s.injury) return "Najpierw wylecz kontuzj\u0119.";
  if (s.money < campCost(s)) return `Brakuje pieni\u0119dzy: ob\xF3z kosztuje ${campCost(s).toLocaleString("pl-PL")} z\u0142.`;
  return null;
}
function campGain(s, camp, k) {
  if (!camp) return 0;
  const base = k === camp.main ? 2 : k === camp.second ? 1 : 0;
  const g = s.age >= 33 ? Math.ceil(base / 2) : base;
  return Math.max(0, Math.min(g, s.potential[k] - s.stats[k]));
}
function doTraining(s0, k, campId) {
  if (s0.injury?.out) return rehabYear(s0);
  const s = clone(s0);
  const camp = campId && !campBlocked(s0) ? CAMPS.find((c) => c.id === campId) ?? null : null;
  s.flags.ovrStart = ovr(s.stats);
  s.flags.moneyStart = s.money;
  withRng(s, (rng) => {
    const before = { ...s.stats };
    const rate = growthRate(s);
    for (const key of STAT_KEYS) {
      const room = Math.max(0, s.potential[key] - CLUB_CAP[s.club.quality] - s.stats[key]);
      let g = room * rate * 0.85;
      if (key === s.club.specialty) g *= 1.25;
      g *= coachGrowth(s, key);
      if (key === k) {
        let focus = room * 0.13 + 2.2 + rng.next() * 0.8 - 0.4;
        if (key === s.club.specialty) focus *= 1.15;
        focus *= coachGrowth(s, key);
        if (s.age >= 33) focus *= 0.5;
        if (room <= 0) focus = 0.5;
        g += focus;
      }
      s.stats[key] = clamp(Math.round(s.stats[key] + g), 1, 99);
    }
    s.camp = null;
    if (camp) {
      const cost = campCost(s);
      for (const key of [camp.main, camp.second]) s.stats[key] = clamp(s.stats[key] + campGain(s, camp, key), 1, 99);
      s.money -= cost;
      s.media = clamp(s.media + 1, 0, 100);
      s.camp = camp.id;
      log(s, `Ob\xF3z: ${camp.name} (${camp.place}), ${cost.toLocaleString("pl-PL")} z\u0142.`);
    }
    if (s.history.length >= 15 && s.age < 34 && rng.chance(0.5)) s.stats.iq = clamp(s.stats.iq + 1, 1, 99);
    s.lastGains = mapStats((key) => s.stats[key] - before[key]);
    s.trainingPick = k;
    s.peakOvr = Math.max(s.peakOvr, ovr(s.stats));
    offerShadyDeal(rng, s);
    makeSponsorOffers(rng, s);
  });
  s.phase = "budget";
  if (s.quick && !quickNeedsBudget(s)) return startSeason(s);
  if (s.quick) s.flags.quickBudgetTier = s.tier;
  return s;
}
function offerShadyDeal(rng, s) {
  s.shadyDeal = null;
  if (s.tier < 1 || s.contract.kind === "freak") return;
  if (s.sponsors.some((x) => SHADY_SPONSORS.some((d2) => d2.name === x.name))) return;
  if (s.sponsors.length >= sponsorCap(s)) return;
  const tight = budgetBalance(s) + s.money < 5e3 + s.tier * 8e3;
  const mgr = currentManager(s);
  if (!tight || !rng.chance(0.65)) return;
  const d = rng.pick(SHADY_SPONSORS);
  const base = [0, 2800, 9e3, 21e3, 48e3][s.tier];
  const perSeason = Math.round(base * (1 + s.media / 150) * (0.85 + rng.next() * 0.3) / 500) * 500;
  s.shadyDeal = {
    season: s.season,
    name: d.name,
    product: d.product,
    pitch: d.pitch,
    perSeason,
    seasons: rng.chance(0.5) ? 1 : 2,
    rep: -rng.int(5, 8),
    media: 2,
    from: mgr ? mgr.name : "Kolega z si\u0142owni",
    status: "open"
  };
}
var OFFER_KINDS = [
  { kind: "image", title: "Kontrakt wizerunkowy", pay: 1, seasons: [1, 2], clause: ["twoja twarz w kampanii", "logo na spodenkach i na wa\u017Ceniu", "billboardy w twoim mie\u015Bcie"], media: 2 },
  { kind: "events", title: "Eventy i sesje zdj\u0119ciowe", pay: 1.35, seasons: [1, 1], clause: ["sze\u015B\u0107 event\xF3w firmowych w roku", "sesje zdj\u0119ciowe w trakcie obozu", "objazd po salonach firmy"], media: 3, form: -1 },
  { kind: "ambassador", title: "Ambasador na lata", pay: 0.8, seasons: [3, 3], clause: ["ambasador marki przez trzy lata", "twoja linia produkt\xF3w", "kod rabatowy z twoim nazwiskiem"] },
  { kind: "charity", title: "Kampania spo\u0142eczna", pay: 0.4, seasons: [1, 2], clause: ["treningi dla dzieciak\xF3w z domu dziecka", "twarz kampanii \u201ENie hejtuj\u201D", "zbi\xF3rka na szpital dzieci\u0119cy"], rep: 3, media: 1 }
];
function makeSponsorOffers(rng, s) {
  s.sponsorOffers = null;
  if (s.tier < 1 || s.contract.kind === "freak") return;
  const room = sponsorCap(s) - s.sponsors.length;
  if (room <= 0) return;
  const n = Math.min(3, rng.chance(clamp(0.25 + s.media / 120 + s.tier * 0.08, 0, 0.95)) ? 1 + (rng.chance(s.media / 110) ? 1 : 0) + (s.tier >= 3 && rng.chance(0.4) ? 1 : 0) : 0);
  if (!n) return;
  const kinds = [...OFFER_KINDS].sort(() => rng.next() - 0.5).slice(0, n);
  const list = kinds.map((k) => {
    const pool = sponsorPoolCapped(s, sponsorPool(rng, s));
    const name = pickSponsorName(rng, s, pool);
    const seasons = rng.int(k.seasons[0], k.seasons[1]);
    const per = Math.max(500, Math.round(poolPay(s, pool) * k.pay * (0.85 + rng.next() * 0.3) / 500) * 500);
    return { id: uid(rng, "o"), name, pool, kind: k.kind, title: k.title, perSeason: per, seasons, clause: rng.pick(k.clause), media: k.media, rep: k.rep, form: k.form };
  });
  s.sponsorOffers = { season: s.season, list: list.filter((o, i) => list.findIndex((x) => x.name === o.name) === i) };
}
function acceptSponsorOffer(s0, id) {
  const so = s0.sponsorOffers;
  if (!so || so.season !== s0.season || so.picked || s0.sponsors.length >= sponsorCap(s0)) return s0;
  const o = so.list.find((x) => x.id === id);
  if (!o) return s0;
  const s = clone(s0);
  s.sponsorOffers.picked = id;
  s.sponsors.push({ id: `of-${o.id}`, name: o.name, perSeason: o.perSeason, seasonsLeft: o.seasons, clause: o.clause });
  if (o.media) s.media = clamp(s.media + o.media, 0, 100);
  if (o.rep) s.rep = clamp(s.rep + o.rep, 0, 100);
  if (o.form) s.flags.formBonus = (s.flags.formBonus ?? 0) + o.form;
  log(s, `Nowy sponsor: ${o.name} (${o.title.toLowerCase()}).`);
  return s;
}
function sponsorPoolOf(name) {
  return SPONSOR_GLOBAL.includes(name) ? "global" : SPONSOR_NATIONAL.includes(name) ? "national" : "local";
}
function acceptShadyDeal(s0) {
  const d = s0.shadyDeal;
  if (!d || d.status !== "open" || d.season !== s0.season || s0.sponsors.length >= sponsorCap(s0)) return s0;
  const s = clone(s0);
  const x = s.shadyDeal;
  x.status = "taken";
  s.sponsors.push({ id: `shady-${s.season}`, name: x.name, perSeason: x.perSeason, seasonsLeft: x.seasons, clause: `reklamujesz: ${x.product}` });
  s.rep = clamp(s.rep + x.rep, 0, 100);
  s.media = clamp(s.media + x.media, 0, 100);
  s.flags.shadyDeals = (s.flags.shadyDeals ?? 0) + 1;
  log(s, `Sponsor: ${x.name} (${x.product}). Kasa jest, \u015Brodowisko si\u0119 \u015Bmieje.`);
  return s;
}
function refuseShadyDeal(s0) {
  if (!s0.shadyDeal || s0.shadyDeal.status !== "open") return s0;
  const s = clone(s0);
  s.shadyDeal.status = "refused";
  return s;
}
function budgetLines(s) {
  const lines = [];
  if (s.club.cost > 0) lines.push({ label: "Sk\u0142adki i trenerzy", sub: s.club.name, amount: -s.club.cost, logo: { kind: "club", name: s.club.name } });
  if (s.contract.entryCost > 0)
    lines.push(
      s.tier === 0 ? { label: "Op\u0142aty startowe i dojazdy", sub: amLevel(s) === 0 ? "zawody wojew\xF3dzkie" : "Amatorski Puchar i Mistrzostwa Polski", amount: -s.contract.entryCost, icon: "receipt" } : { label: "Badania, licencja, dojazdy", sub: s.contract.fed, amount: -s.contract.entryCost, icon: "receipt" }
    );
  const dep = depositPayout(s);
  if (dep) lines.push({ label: "Lokata Wojownik: zwrot z odsetkami", sub: `${s.deposit.amount.toLocaleString("pl-PL")} z\u0142 + ${Math.round(DEPOSIT_RATE * 100)}%`, amount: dep, icon: "trend" });
  if (s.diet === "catering") lines.push({ label: "Catering FitFighter", sub: "dieta z Wa\u017Cki, ca\u0142y rok", amount: -dietCost(s), icon: "receipt" });
  const staff = [0, 0, 2500, 6e3, 3e4][s.tier];
  if (staff > 0 && s.contract.kind !== "freak")
    lines.push({ label: "Sztab", sub: "trener przygotowania, dietetyk", amount: -staff, icon: "users" });
  const cc = coachOpen(s) ? coachCost(s) : 0;
  if (cc > 0) lines.push({ label: "Trener g\u0142\xF3wny", sub: `${coachOf(s).name} \xB7 ${coachOf(s).role}`, amount: -cc, icon: "users" });
  if (backroomOpen(s)) {
    for (const b of BACKROOM) {
      if (!s.backroom?.[b.id] || !backroomAvailable(s, b.id)) continue;
      const c = backroomCost(s, b.id);
      lines.push({ label: b.name, sub: c === 0 ? "pokrywa Ground Game Labs" : b.short, amount: -c, icon: b.icon });
    }
  }
  const jd = jobDef(s);
  const living = Math.round(livingCost(s.age) * (jd ? jd.living : 1) * (s.flags["own:dom"] ? 0.6 : 1) / 500) * 500 + (s.flags.kid ? 1e4 : 0);
  if (living > 0)
    lines.push({
      label: "\u017Bycie",
      sub: jd?.id === "full" ? "etat pokrywa wi\u0119kszo\u015B\u0107, trenujesz po pracy" : jd?.id === "half" ? "p\xF3\u0142 etatu pokrywa po\u0142ow\u0119 koszt\xF3w" : s.flags["own:dom"] ? "w\u0142asny dom: pr\u0105d, jedzenie, karma dla alpak s\u0105siada" : s.flags.kid ? "mieszkanie, jedzenie, dziecko" : "mieszkanie i jedzenie",
      amount: -living,
      icon: "home"
    });
  const smm = socialCost(s);
  if (smm > 0) lines.push({ label: "Social media manager", sub: "monta\u017C film\xF3w i wsp\xF3\u0142prace", amount: -smm, icon: "phone" });
  const si = socialIncome(s);
  if (si > 0) lines.push({ label: "Wsp\xF3\u0142prace w social mediach", sub: `${fmtFans(followersOf(s))} obserwuj\u0105cych`, amount: si, icon: "phone" });
  for (const l of s.loans) lines.push({ label: "Rata kredytu", sub: `${l.left === 1 ? "ostatnia rata" : `zosta\u0142o ${l.left} ${pl(l.left, "rata", "raty", "rat")}`}`, amount: -l.installment, icon: "card" });
  for (const sp of s.sponsors)
    lines.push({ label: sp.name, sub: `${sp.clause} \xB7 ${sp.seasonsLeft === 1 ? "ostatni rok" : `jeszcze ${sp.seasonsLeft} ${pl(sp.seasonsLeft, "rok", "lata", "lat")}`}`, amount: sp.perSeason, logo: { kind: "sponsor", name: sp.name } });
  const kb = kebabIncome(s);
  if (kb) lines.push({ label: "Kebab \u201EPod Klatk\u0105\u201D", sub: vary6(s, ["udzia\u0142y: nowy sos czosnkowy podbi\u0142 osiedle", "udzia\u0142y: sanepid by\u0142, wyszed\u0142 najedzony", "udzia\u0142y: wsp\xF3lnik kupi\u0142 drugi ro\u017Cen", "udzia\u0142y: studenci w sesji jedz\u0105 za trzech"], 3), amount: kb, icon: "trend" });
  if (s.academy) lines.push({ label: academyName(s), sub: `twoja akademia \xB7 ${ACADEMY_LEVELS[s.academy - 1].name}`, amount: academyIncome(s), icon: "home" });
  if (s.age < 19 && s.relations >= 3) lines.push({ label: "Rodzice dok\u0142adaj\u0105", sub: "z trzynastki", amount: 2e3 + s.relations * 300, icon: "heart" });
  return lines;
}
var ACADEMY_LEVELS = [
  { cost: 15e4, income: 1e4, name: "sala w wynaj\u0119tej hali", note: "grupy dzieci i amator\xF3w" },
  { cost: 4e5, income: 25e3, name: "w\u0142asny klub z klatk\u0105", note: "sekcja zawodnicza i obozy letnie" },
  { cost: 1e6, income: 5e4, name: "akademia z filiami", note: "trzy miasta, w\u0142asna gala amatorska" },
  { cost: 3e6, income: 12e4, name: "sie\u0107 akademii w ca\u0142ym kraju", note: "franczyza, liga junior\xF3w i program w telewizji" }
];
function academyName(s) {
  return `${s.profile.lastName} Team`;
}
function academyIncome(s) {
  const lvl = s.academy ?? 0;
  if (!lvl) return 0;
  return Math.round(ACADEMY_LEVELS[lvl - 1].income * (0.7 + s.media / 150) / 500) * 500;
}
function academyNext(s) {
  const lvl = s.academy ?? 0;
  if (lvl >= ACADEMY_LEVELS.length) return null;
  const L = ACADEMY_LEVELS[lvl];
  let blocked = null;
  if (s.tier < 2 && lvl === 0) blocked = "Najpierw zr\xF3b nazwisko w lidze krajowej.";
  else if (s.age < 22) blocked = "Masz za ma\u0142o lat, \u017Ceby kto\u015B ci powierzy\u0142 dzieci na treningach.";
  else if (s.loans.length) blocked = "Bank nie da drugiego zobowi\u0105zania, najpierw sp\u0142a\u0107 kredyt.";
  else if (s.money < L.cost) blocked = `Potrzebujesz ${L.cost.toLocaleString("pl-PL")} z\u0142.`;
  const income = Math.round(L.income * (0.7 + s.media / 150) / 500) * 500;
  return { cost: L.cost, name: L.name, note: L.note, income, blocked };
}
function investAcademy(s0) {
  const n = academyNext(s0);
  if (!n || n.blocked) return s0;
  const s = clone(s0);
  s.money -= n.cost;
  s.academy = (s.academy ?? 0) + 1;
  s.rep = clamp(s.rep + 2, 0, 100);
  s.media = clamp(s.media + 2, 0, 100);
  log(s, s.academy === 1 ? `Otwierasz ${academyName(s)}: ${n.name}.` : `${academyName(s)} ro\u015Bnie: ${n.name}.`);
  return s;
}
var BACKROOM = [
  { id: "physio", name: "Fizjoterapeuta", short: "masa\u017Ce, rozlu\u017Anianie, taping", effect: "Organizm wolniej si\u0119 zu\u017Cywa, kariera trwa d\u0142u\u017Cej.", icon: "heart", cost: [0, 1500, 3e3, 7e3, 2e4] },
  { id: "doctor", name: "Lekarz sportowy", short: "badania i opieka przed walk\u0105", effect: "Rzadsze kontuzje, a je\u015Bli ju\u017C, to l\u017Cejsze.", icon: "bandage", cost: [0, 2e3, 4e3, 9e3, 18e3] },
  { id: "supps", name: "Suplementacja", short: "od\u017Cywki, witaminy, elektrolity", effect: "Lekko lepsza forma w ka\u017Cdej walce.", icon: "flame", cost: [0, 1500, 3e3, 5e3, 8e3] },
  { id: "sparring", name: "Elitarni sparingpartnerzy", short: "sparingpartnerzy z czo\u0142\xF3wki, \u015Bci\u0105gani na ob\xF3z", effect: "Wyra\u017Anie lepsza forma w ka\u017Cdej walce. Drogo, ale na tym poziomie liczy si\u0119 ka\u017Cdy procent.", icon: "glove", cost: [0, 0, 0, 25e3, 45e3], minTier: 3 },
  { id: "clinic", name: "Klinika regeneracyjna", short: "kriokomora, osocze, prywatny ortopeda", effect: "Co roku organizm regeneruje si\u0119 wyra\u017Anie bardziej (zu\u017Cycie \u22124), kariera trwa d\u0142u\u017Cej. Dla tych, kt\xF3rych sta\u0107.", icon: "heart", cost: [0, 0, 0, 3e4, 6e4], minTier: 3 }
];
function backroomAvailable(s, id) {
  return s.tier >= (BACKROOM.find((b) => b.id === id).minTier ?? 1);
}
var LABS_SPONSOR = "Ground Game Labs";
function hasLabs(s) {
  return s.sponsors.some((x) => x.name === LABS_SPONSOR);
}
function backroomOpen(s) {
  return s.tier >= 1;
}
function backroomCost(s, id) {
  if (id === "supps" && hasLabs(s)) return 0;
  return BACKROOM.find((b) => b.id === id).cost[s.tier] ?? 0;
}
function hasBackroom(s, id) {
  return backroomOpen(s) && backroomAvailable(s, id) && !!s.backroom?.[id];
}
function setBackroom(s0, id, on) {
  const s = clone(s0);
  s.backroom = { ...s.backroom ?? {}, [id]: on };
  return s;
}
function budgetBalance(s) {
  return budgetLines(s).reduce((a, b) => a + b.amount, 0);
}
function expectedPurses(s) {
  return (s.contract.purse + s.contract.winBonus * 0.5) * plannedFights(s) * (1 - (currentManager(s)?.cut ?? 0));
}
var LOAN_CAP = [2e4, 4e4, 12e4, 3e5, 8e5];
var OVERDRAFT = 5e3;
function loanRefusal(s) {
  const active = s.loans.filter((l) => l.left > 0);
  if (active.length) {
    const left = active.reduce((a, l) => a + l.left, 0);
    return `Bank odmawia: najpierw sp\u0142a\u0107 obecny kredyt (zosta\u0142o ${left} ${pl(left, "rata", "raty", "rat")}).`;
  }
  if (s.money < -3e4) return "Bank odmawia: masz za du\u017Ce d\u0142ugi.";
  return null;
}
function familyHelpOffer(s) {
  const short = -(s.money + budgetBalance(s));
  if (short <= 0) return null;
  const used = s.flags.familyHelp ?? 0;
  if ((s.flags.familyHelpSeason ?? -9) === s.season) return null;
  if (s.profile.start === "biznes") {
    if (used >= 3) return null;
    const amount2 = Math.ceil((short + 5e3) / 1e3) * 1e3;
    const cap = [2e4, 4e4, 12e4, 25e4, 4e5][s.tier] ?? 4e4;
    if (amount2 > cap) return null;
    const text = used === 0 ? `Tata przeleje ${amount2.toLocaleString("pl-PL")} z\u0142. Powie tylko, \u017Ce \u201Ew hurtowni te\u017C by si\u0119 przyda\u0142 kto\u015B z charakterem\u201D.` : used === 1 ? `Tata przeleje ${amount2.toLocaleString("pl-PL")} z\u0142, ale przy obiedzie wszyscy us\u0142ysz\u0105, ile ci\u0119 kosztuje to \u201Ebicie si\u0119 po klatkach\u201D.` : `Ostatni raz. Tata przeleje ${amount2.toLocaleString("pl-PL")} z\u0142 i jasno m\xF3wi, \u017Ce nast\u0119pnej pomocy nie b\u0119dzie.`;
    return { amount: amount2, who: "Dzwonisz do taty", text, cost: used === 0 ? "rodzina \u22121" : "rodzina \u22122, reputacja \u22122 (syn tatusia)" };
  }
  if (used >= 1 || s.relations < 3 || short > 8e3) return null;
  const amount = Math.ceil((short + 1e3) / 500) * 500;
  return { amount, who: "Prosisz rodzic\xF3w o pomoc", text: `Mama wyjmuje kopert\u0119 z szafy: ${amount.toLocaleString("pl-PL")} z\u0142. Ojciec udaje, \u017Ce nic nie widzi.`, cost: "rodzina \u22121, tylko raz w karierze" };
}
function takeFamilyHelp(s0) {
  const o = familyHelpOffer(s0);
  if (!o) return s0;
  const s = clone(s0);
  const used = s.flags.familyHelp ?? 0;
  s.money += o.amount;
  s.flags.familyHelp = used + 1;
  s.flags.familyHelpSeason = s.season;
  s.relations -= s.profile.start === "biznes" && used >= 1 ? 2 : 1;
  if (s.profile.start === "biznes" && used >= 1) s.rep = clamp(s.rep - 2, 0, 100);
  log(s, `${o.who}: ${o.amount.toLocaleString("pl-PL")} z\u0142.`);
  return s;
}
function loanOffer(s) {
  const short = -(s.money + budgetBalance(s));
  if (short <= 0) return null;
  if (loanRefusal(s)) return null;
  const amount = Math.min(LOAN_CAP[s.tier], Math.ceil((short + 2e3) / 1e3) * 1e3);
  const count = 3;
  const installment = Math.ceil(amount * 1.18 / count / 1e3) * 1e3;
  return { amount, installment, count };
}
function takeLoan(s0) {
  const s = clone(s0);
  const o = loanOffer(s);
  if (!o) return s;
  s.money += o.amount;
  s.loans.push({ installment: o.installment, left: o.count });
  log(s, `Kredyt na ${o.amount.toLocaleString("pl-PL")} z\u0142.`);
  return s;
}
function cheaperClub(s) {
  if (s.club.cost <= 0) return null;
  const room = s.club.cost + s.money + budgetBalance(s) + OVERDRAFT;
  const cands = CLUB_TEMPLATES.map((t, idx) => ({ t, idx })).filter(({ t }) => t.cost < s.club.cost && t.minTier <= s.tier && t.cost <= Math.max(0, room)).sort((a, b) => b.t.quality - a.t.quality || a.t.cost - b.t.cost);
  const pick = cands[0] ?? { t: CLUB_TEMPLATES[0], idx: 0 };
  return { idx: pick.idx, name: pick.t.name, cost: pick.t.cost, quality: pick.t.quality };
}
function downgradeClub(s0) {
  const c = cheaperClub(s0);
  if (!c) return s0;
  const s = clone(s0);
  withRng(s, (rng) => {
    const prev = s.club.name;
    s.club = makeClub(rng, c.idx, s.profile.hometown);
    s.clubSeasons = 0;
    log(s, `Na sk\u0142adki w ${prev} nie starcza. Przenosisz si\u0119 do ${s.club.name}.`);
  });
  return s;
}
function projectedAfter(s, clubCost) {
  const base = s.money + budgetBalance(s) + s.club.cost - clubCost;
  return base + Math.round(expectedPurses(s) * 0.8);
}
function canStartSeason(s) {
  return s.money + budgetBalance(s) >= -OVERDRAFT;
}
function jobSalary(age) {
  if (age < 19) return 9e3;
  if (age < 22) return 42e3;
  if (age < 26) return 54e3;
  return 6e4;
}
function sponsorHalf(s) {
  return Math.round(s.sponsors.reduce((a, b) => a + b.perSeason, 0) * 0.5 / 500) * 500;
}
function breakPreview(s) {
  const installments = s.loans.filter((l) => l.left > 0).reduce((a, l) => a + l.installment, 0);
  const living = livingCost(s.age) + (s.flags.kid ? 1e4 : 0);
  const salary = jobSalary(s.age);
  const sponsors = sponsorHalf(s);
  const net = salary + sponsors - living - installments;
  return { salary, sponsors, living, installments, net, after: s.money + net };
}
function takeBreakYear(s0) {
  const s = clone(s0);
  withRng(s, (rng) => {
    const pv = breakPreview(s);
    const ovrFrom = s.flags.ovrStart ?? ovr(s.stats);
    const moneyFrom = s.money;
    s.money = pv.after;
    for (const l of s.loans) l.left -= 1;
    s.loans = s.loans.filter((l) => l.left > 0);
    for (const k of Object.keys(s.stats)) {
      const gain = s.lastGains[k] ?? 0;
      const drop = k === "cardio" ? rng.int(4, 6) : k === "iq" ? rng.int(0, 1) : k === "chin" ? rng.int(0, 2) : rng.int(2, 4);
      s.stats[k] = clamp(s.stats[k] - gain - drop, 1, 99);
    }
    s.lastGains = {};
    s.media = clamp(s.media - 6, 0, 100);
    s.rep = clamp(s.rep - 3, 0, 100);
    s.relations += 1;
    const wasRanked = s.tier > 0 && s.rank !== null && s.contract.kind !== "freak";
    if (s.tier > 0 && s.rank === 0 && s.contract.kind !== "freak") {
      s.titleDefenses = 0;
      s.flags.stripped = (s.flags.stripped ?? 0) + 1;
      log(s, "Federacja odbiera pas: rok przerwy mistrza to za du\u017Co.");
    }
    if (s.tier > 0) s.rank = null;
    s.flags.interim = 0;
    rosterSync(s);
    const job = s.age < 19 ? "Rok przerwy od turniej\xF3w. Weekendy na zmywaku i przy roz\u0142adunku, w tygodniu szko\u0142a." : rng.pick([
      "Rok na budowie. Rano szalunki, wieczorem nie masz si\u0142y nawet na rozci\u0105ganie.",
      "Rok w magazynie na trzy zmiany. Kasa si\u0119 zgadza, kondycja ju\u017C nie.",
      "Rok jako ochroniarz w galerii. Stoisz osiem godzin dziennie i tyjesz.",
      "Rok na kurierce. Trzysta paczek dziennie, na sal\u0119 wpadasz raz w tygodniu."
    ]);
    const summary = {
      season: s.season,
      year: s.year,
      age: s.age,
      tier: s.tier,
      fed: s.fed,
      club: s.club.name,
      w: 0,
      l: 0,
      d: 0,
      rank: s.rank,
      champion: false,
      beltWon: false,
      moneyDelta: s.money - moneyFrom,
      ovrFrom,
      ovrTo: ovr(s.stats),
      form: "Rok przerwy",
      grade: "Rok przerwy",
      bars: [
        { label: "Pieni\u0105dze", value: Math.round(clamp(50 + pv.net / 3e4 * 40, 5, 100)), note: fmtK(s.money - moneyFrom) },
        { label: "Forma fizyczna", value: 15, note: "umiej\u0119tno\u015Bci spad\u0142y" }
      ],
      story: `${job} D\u0142ugi s\u0105 mniejsze, ale treningi przepad\u0142y.${pv.sponsors ? ` Sponsorzy p\u0142ac\u0105 po\u0142ow\u0119 um\xF3w: ${pv.sponsors.toLocaleString("pl-PL")} z\u0142.` : ""}${wasRanked ? " Wypadasz z rankingu." : ""}`
    };
    s.seasons.push(summary);
    s.lastSummary = summary;
    s.run = null;
    s.event = null;
    s.eventQueue = [];
    s.flags.breakYears = (s.flags.breakYears ?? 0) + 1;
    log(s, "Rok przerwy: praca zamiast walk.");
    for (const p of s.peers) progressPeer(rng, p);
  });
  s.phase = "summary";
  return s;
}
var INJ_MINOR = ["z\u0142amany nos", "rozci\u0119ty \u0142uk brwiowy", "skr\u0119cona kostka", "z\u0142amany palec u stopy", "st\u0142uczone \u017Cebro", "naci\u0105gni\u0119ty mi\u0119sie\u0144 dwug\u0142owy", "obity piszczel"];
var INJ_SEVERE = ["p\u0119kni\u0119ty oczod\xF3\u0142", "z\u0142amana r\u0119ka", "p\u0119kni\u0119te \u017Cebro", "wybity bark", "naderwane wi\u0119zad\u0142o w kolanie", "z\u0142amana szcz\u0119ka"];
var INJ_OUT = ["zerwane wi\u0119zad\u0142o krzy\u017Cowe", "zerwany biceps", "przepuklina dysku", "zerwane \u015Bci\u0119gno Achillesa"];
function rehabCost(s) {
  return [3e3, 8e3, 15e3, 3e4, 6e4][s.tier] + livingCost(s.age) + (s.flags.kid ? 1e4 : 0);
}
function rehabYear(s0) {
  if (!s0.injury?.out) return s0;
  const s = clone(s0);
  withRng(s, (rng) => {
    const ovrFrom = ovr(s.stats);
    const moneyFrom = s.money;
    const name = s.injury.name;
    const installments = s.loans.reduce((a, l) => a + l.installment, 0);
    const full = rehabCost(s) + installments;
    const half = sponsorHalf(s);
    s.money += half;
    s.totalEarned += half;
    let avail = Math.max(0, s.money + OVERDRAFT);
    const nfz = avail < full;
    const care = Math.min(rehabCost(s), avail);
    s.money -= care;
    avail -= care;
    for (const l of s.loans) {
      if (avail < l.installment) continue;
      s.money -= l.installment;
      avail -= l.installment;
      l.left -= 1;
    }
    s.loans = s.loans.filter((l) => l.left > 0);
    for (const k of STAT_KEYS) {
      const drop = (k === "cardio" ? rng.int(3, 5) : k === "iq" ? -rng.int(0, 1) : k === "chin" ? rng.int(0, 2) : rng.int(1, 3)) + (nfz && k !== "iq" ? 1 : 0);
      s.stats[k] = clamp(s.stats[k] - drop, 1, 99);
    }
    s.lastGains = {};
    s.wear = clamp(s.wear - 12, 0, 100);
    s.media = clamp(s.media - 5, 0, 100);
    const wasRanked = s.tier > 0 && s.rank !== null;
    const wasChamp = s.tier > 0 && s.rank === 0 && s.contract.kind !== "freak";
    if (s.tier > 0) s.rank = wasChamp ? 2 : null;
    s.flags.interim = 0;
    rosterSync(s);
    if (wasChamp) {
      s.titleDefenses = 0;
      s.flags.stripped = (s.flags.stripped ?? 0) + 1;
      log(s, "Federacja odbiera pas: mistrz nie mo\u017Ce pauzowa\u0107 przez ca\u0142y rok.");
    }
    s.injury = { name: `${name} (powr\xF3t po urazie)`, seasons: 2, penalty: 3 };
    const story = rng.pick([
      "Rok na rowerku stacjonarnym i gumach. Najgorsze s\u0105 wieczory, kiedy koledzy wrzucaj\u0105 zdj\u0119cia z gal.",
      "Operacja, kule, potem fizjo trzy razy w tygodniu. Ogl\u0105dasz walki z kanapy i notujesz b\u0142\u0119dy rywali.",
      "Rehabilitacja idzie wolniej, ni\u017C obiecywa\u0142 lekarz. Za to pierwszy raz od lat nic ci\u0119 nie boli rano."
    ]);
    const summary = {
      season: s.season,
      year: s.year,
      age: s.age,
      tier: s.tier,
      fed: s.fed,
      club: s.club.name,
      w: 0,
      l: 0,
      d: 0,
      rank: s.rank,
      champion: false,
      beltWon: false,
      moneyDelta: s.money - moneyFrom,
      ovrFrom,
      ovrTo: ovr(s.stats),
      form: "Rehabilitacja",
      grade: "Rok rehabilitacji",
      bars: [
        { label: "Zdrowie", value: 60, note: "zu\u017Cycie organizmu spad\u0142o" },
        { label: "Forma fizyczna", value: 20, note: "umiej\u0119tno\u015Bci spad\u0142y" }
      ],
      story: `${name.charAt(0).toUpperCase() + name.slice(1)}. ${half ? `Sponsorzy p\u0142ac\u0105 po\u0142ow\u0119 um\xF3w (${half.toLocaleString("pl-PL")} z\u0142), bo nie pokazujesz si\u0119 w klatce. ` : ""}${nfz ? "Na prywatn\u0105 klinik\u0119 ci\u0119 nie sta\u0107, wi\u0119c kolejka na NFZ i \u0107wiczenia z filmik\xF3w. " : ""}${story}${wasChamp ? " Federacja nie mo\u017Ce czeka\u0107 rok: odbiera ci pas i robi walk\u0119 o wakat. Wracasz jako numer 2 w rankingu, z prawem do walki o tytu\u0142." : wasRanked ? " Wypadasz z rankingu." : ""}`
    };
    s.seasons.push(summary);
    s.lastSummary = summary;
    s.run = null;
    s.event = null;
    s.eventQueue = [];
    log(s, `Rok rehabilitacji: ${name}.`);
    for (const p of s.peers) progressPeer(rng, p);
  });
  s.phase = "summary";
  return s;
}
var EXPEDITIONS = [
  {
    id: "dagestan",
    name: "2-3 years Dagestan and forget",
    place: "Dagestan \xB7 sala w g\xF3rach",
    years: 2,
    maxAge: 30,
    cost: [0, 3e4, 7e4, 16e4, 36e4],
    gains: { wrest: [12, 16], cardio: [9, 12], chin: [5, 7], bjj: [5, 8], iq: [3, 5], stand: [1, 3] },
    ceiling: { wrest: 12, cardio: 10, chin: 6, bjj: 6, iq: 2 },
    media: -8,
    rep: 4,
    wear: -10,
    desc: "Dwa lata w g\xF3rach (trzeci to powr\xF3t do formy). Zapasy pi\u0119\u0107 razy dziennie, bez internetu i bez cukru.",
    minus: "Kibice o tobie zapominaj\u0105, a w rankingu spadasz o kilka miejsc. Za to w pierwszym roku po powrocie jeste\u015B w \u017Cyciowej formie.",
    log: "Dwa lata w Dagestanie. Zapasy, g\xF3ry i cisza.",
    stories: [
      "Wyje\u017Cd\u017Casz w wieku {from} lat, wracasz po dw\xF3ch. Bez internetu, bez cukru, z zapasami pi\u0119\u0107 razy dziennie. W hali nikt nie pami\u0119ta twojego nazwiska, za to ty pami\u0119tasz ka\u017Cde obalenie.",
      "Dwie zimy w g\xF3rach. Stary trener m\xF3wi\u0142 do ciebie tylko \u201Ejeszcze raz\u201D. Wracasz twardszy, cichszy i nikt w Polsce nie wie, czego si\u0119 spodziewa\u0107.",
      "Dwa lata, jedna sala i baran na ka\u017Cde \u015Bwi\u0119to. Media pytaj\u0105, czy w og\xF3le jeszcze walczysz. Zaraz si\u0119 przekonaj\u0105."
    ]
  },
  {
    id: "floryda",
    name: "Floryda: Top Squad",
    place: "USA \xB7 stajnia mistrz\xF3w",
    years: 2,
    maxAge: 33,
    cost: [0, 35e3, 75e3, 17e4, 36e4],
    gains: { stand: [8, 11], wrest: [8, 11], bjj: [8, 11], cardio: [5, 7], iq: [5, 7], chin: [2, 4] },
    ceiling: { stand: 8, wrest: 8, bjj: 8, iq: 4, cardio: 3 },
    media: -4,
    rep: 3,
    wear: -6,
    desc: "Dwa lata w najwi\u0119kszej ameryka\u0144skiej stajni. Sparingi z mistrzami i trenerzy od wszystkiego.",
    minus: "Najdro\u017Cszy wyjazd. W rankingu spadasz o kilka miejsc, ale wracasz w \u017Cyciowej formie i z filmikami z sali.",
    log: "Dwa lata na Florydzie. Upa\u0142, sparingi i trenerzy od wszystkiego.",
    stories: [
      "Dwa lata w Top Squad. Codziennie kto\u015B z pasem leje ci\u0119 na sparingu, a ty coraz cz\u0119\u015Bciej oddajesz. Wracasz jako zawodnik kompletny.",
      "Upa\u0142, aligatory przy parkingu i sparingi z mistrzami. Po dw\xF3ch latach trener m\xF3wi, \u017Ce mo\u017Cesz walczy\u0107 z ka\u017Cdym. Kibice widzieli tylko twoje filmiki z sali."
    ]
  },
  {
    id: "trondheim",
    name: "Trondheim",
    place: "Norwegia \xB7 sala nad fiordem",
    years: 1,
    maxAge: 36,
    cost: [0, 25e3, 55e3, 12e4, 25e4],
    gains: { cardio: [6, 9], stand: [3, 6], chin: [2, 4], iq: [2, 4], wrest: [2, 3], bjj: [1, 3] },
    ceiling: { cardio: 6, chin: 3, stand: 3 },
    media: -2,
    rep: 2,
    wear: -10,
    desc: "Jeden rok na p\xF3\u0142nocy: biegi po \u015Bniegu, sauna, przer\u0119bel i sparingi z Norwegami, kt\xF3rzy nigdy si\u0119 nie m\u0119cz\u0105.",
    minus: "Rok bez walk i bez ga\u017C, w rankingu spadasz o kilka miejsc.",
    log: "Rok w Trondheim. \u015Anieg, sauna i kondycja nie z tej ziemi.",
    stories: [
      "Rok w Trondheim. S\u0142o\u0144ce widzia\u0142e\u015B mo\u017Ce dwa razy, za to biega\u0142e\u015B po \u015Bniegu codziennie. Wracasz z p\u0142ucami, kt\xF3re nie znaj\u0105 zm\u0119czenia.",
      "Sauna, przer\u0119bel, sparing i znowu sauna. Norwegowie m\xF3wi\u0105 ma\u0142o, ale bij\u0105 r\xF3wno przez pi\u0119\u0107 rund. Teraz ty te\u017C tak umiesz."
    ]
  }
];
function expeditionById(id) {
  return EXPEDITIONS.find((e) => e.id === id) ?? null;
}
function expeditionCost(s, e) {
  return e.cost[s.tier] ?? 0;
}
function expeditionDone(s, e) {
  return e.id === "dagestan" ? !!s.flags.dagestan : !!s.flags[`exp_${e.id}`];
}
function expeditionBlocked(s, e) {
  if (expeditionDone(s, e)) return "Ju\u017C tam by\u0142e\u015B.";
  if (s.tier < 1) return "Najpierw przejd\u017A na zawodowstwo.";
  if (s.age > e.maxAge) return `Do ${e.maxAge} lat. Potem to ju\u017C za du\u017Co dla organizmu.`;
  if (s.injury) return "Najpierw wylecz kontuzj\u0119.";
  if (s.loans.length) return "Najpierw sp\u0142a\u0107 kredyt, rat z wyjazdu nie zap\u0142acisz.";
  const c = expeditionCost(s, e);
  if (s.money < c) return `Potrzebujesz ${c.toLocaleString("pl-PL")} z\u0142.`;
  return null;
}
function goExpedition(s0, id) {
  const e = expeditionById(id);
  if (!e || expeditionBlocked(s0, e)) return s0;
  const s = clone(s0);
  withRng(s, (rng) => {
    const ovrFrom = ovr(s.stats);
    const moneyFrom = s.money;
    const ageFrom = s.age;
    s.money -= expeditionCost(s, e);
    const m = s.age >= 28 ? 0.7 : 1;
    const before = { ...s.stats };
    for (const k of STAT_KEYS) s.potential[k] = clamp(s.potential[k] + (e.ceiling[k] ?? 0), 1, 99);
    for (const k of STAT_KEYS) {
      const [a, b] = e.gains[k];
      const g = Math.round(rng.int(a, b) * m);
      s.stats[k] = clamp(Math.min(s.stats[k] + g, Math.max(s.stats[k], s.potential[k])), 1, 99);
    }
    s.lastGains = mapStats((k) => s.stats[k] - before[k]);
    const livingAbroad = Math.round(livingCost(s.age) / 500) * 500;
    const ovrTo = ovr(s.stats);
    const lata = e.years === 1 ? "rok" : `${e.years} lata`;
    const stories = [...e.stories];
    const yearSummary = (i, mFrom) => {
      const half = sponsorHalf(s);
      s.money += half;
      s.totalEarned += half;
      const last = i === e.years - 1;
      const oFrom = i === 0 ? ovrFrom : Math.round(ovrFrom + (ovrTo - ovrFrom) * (i / e.years));
      const oTo = last ? ovrTo : Math.round(ovrFrom + (ovrTo - ovrFrom) * ((i + 1) / e.years));
      const st = stories.length ? stories.splice(rng.int(0, stories.length - 1), 1)[0] : e.stories[0];
      return {
        season: s.season,
        year: s.year,
        age: s.age,
        tier: s.tier,
        fed: s.fed,
        club: s.club.name,
        w: 0,
        l: 0,
        d: 0,
        rank: s.rank,
        champion: false,
        beltWon: false,
        moneyDelta: s.money - mFrom,
        ovrFrom: oFrom,
        ovrTo: oTo,
        form: e.id === "dagestan" ? "Dagestan" : e.name,
        grade: e.years > 1 ? `${e.name} \xB7 rok ${i + 1} z ${e.years}` : e.name,
        bars: [
          { label: "Forma fizyczna", value: 95, note: `OVR ${oFrom} \u2192 ${oTo}` },
          { label: "Rozpoznawalno\u015B\u0107", value: Math.max(10, 60 + e.media * 3), note: e.media <= -10 ? "kibice o tobie zapomnieli" : `${lata} poza klatk\u0105` }
        ],
        story: `${st.replace("{from}", String(ageFrom))}${half ? ` Sponsorzy p\u0142ac\u0105 po\u0142ow\u0119 um\xF3w: ${half.toLocaleString("pl-PL")} z\u0142.` : ""}`
      };
    };
    let yearFrom = moneyFrom;
    for (let i = 0; i < e.years - 1; i++) {
      const sm = yearSummary(i, yearFrom);
      s.seasons.push(sm);
      ageOneYear(rng, s);
      s.money -= livingAbroad;
      yearFrom = s.money;
    }
    for (let i = 0; i < e.years; i++) for (const p of s.peers) progressPeer(rng, p);
    s.media = clamp(s.media + e.media, 0, 100);
    s.rep = clamp(s.rep + e.rep, 0, 100);
    s.wear = clamp(s.wear + e.wear, 0, 100);
    if (s.tier > 0 && s.rank === 0) {
      s.titleDefenses = 0;
      s.flags.doubleActive = 0;
      log(s, `Wyjazd mistrza: ${galaPrefix(s.fed)} og\u0142asza wakat, pas trafia do kogo\u015B innego.`);
    }
    if (s.tier > 0 && s.rank !== null) s.rank = s.rank === 0 ? 2 : Math.min(RANK_SIZE[s.tier], s.rank + 3 + e.years);
    clearCallFlags(s);
    s.contractSeasonsLeft = 0;
    s.flags.expBoost = 1;
    if (e.id === "dagestan") s.flags.dagestan = 1;
    else s.flags[`exp_${e.id}`] = 1;
    s.peakOvr = Math.max(s.peakOvr, ovr(s.stats));
    const summary = yearSummary(e.years - 1, yearFrom);
    if (e.years > 1) summary.moneyDelta = s.money - yearFrom;
    s.seasons.push(summary);
    s.lastSummary = summary;
    s.run = null;
    s.event = null;
    s.eventQueue = [];
    log(s, e.log);
  });
  rosterSync(s);
  s.phase = "summary";
  return s;
}
var DAGESTAN_GAINS = EXPEDITIONS[0].gains;
function dagestanCost(s) {
  return expeditionCost(s, EXPEDITIONS[0]);
}
function dagestanBlocked(s) {
  return expeditionBlocked(s, EXPEDITIONS[0]);
}
function goDagestan(s0) {
  return goExpedition(s0, "dagestan");
}
var SPONSOR_NAMES = [
  "Hurtownia Paneli Bogdan-Pol",
  "Myjnia B\u0105belek",
  "Bar mleczny Pod Kogutem",
  "Skup z\u0142omu Metal-Heniek",
  "Si\u0142ownia \u017Belazny Wiesiek",
  "Auto-komis Ig\u0142a",
  "Okna PCV Szymon-Plast",
  "Piekarnia Z\u0142oty K\u0142os",
  "Agroturystyka U Bacy",
  "Kantor Euro-Max",
  "Szko\u0142a jazdy Zielona Strza\u0142ka",
  "Firma remontowa Panel-Bud",
  "Pizzeria Mamma Gra\u017Cyna",
  "Warsztat Turbo-Zdzich",
  "Lody Bambino-Bis",
  "Kebab Su\u0142tan Premium",
  "Hurtownia \u015Arubek Gwint-Pol",
  "Studio Paznokci Diamond",
  "Pralnia Ekspres u Basi",
  "Stolarnia D\u0105b-Mar",
  "Ubezpieczenia Spokojna G\u0142owa",
  "Sklep W\u0119dkarski Szczupak",
  "Kwiaciarnia R\xF3\u017Ca Wiatr\xF3w",
  "Pizzeria Neapol z Kutna",
  "Agencja Nieruchomo\u015Bci Klucz",
  "Ferma Drobiu Z\u0142ote Jajo",
  "Hydraulika Kran-Bud",
  "Si\u0142ownia Dzik Gym",
  "Solarium Tropikana",
  "Sklep Monopolowy Pod Lip\u0105",
  "Gabinet Weterynaryjny Burek",
  "Autolawety Holownik 24h",
  "Bar Grill Pod Krow\u0105",
  "Szko\u0142a Ta\u0144ca Salsa-Pol",
  "Fryzjer Brzytwa",
  "Warzywniak Pomidorek",
  "Elektro-Mont Zbigniew",
  "Przedszkole S\u0142oneczko",
  "Lodziarnia Polarna"
];
var SPONSOR_CLAUSES = [
  "logo na ty\u0142ku spodenek",
  "zdj\u0119cie z szefem po ka\u017Cdej wygranej",
  "pozdrowienia dla prezesa w wywiadzie",
  "darmowe mycie auta za ka\u017Cde KO",
  "koszulka firmowa na wa\u017Ceniu",
  "wizyta na firmowym grillu",
  "nazwa firmy w walkoutowej piosence",
  "logo na r\u0119kawicach do walkout",
  "pozdrowienia dla za\u0142ogi w wywiadzie",
  "kartonowa figura w sklepie",
  "wizyta na otwarciu nowego punktu",
  "naklejka na kasku na treningach",
  "zdj\u0119cie w firmowej czapce na wa\u017Ceniu",
  "rabat dla fan\xF3w z twoim kodem"
];
var SPONSOR_NATIONAL = ["Telekom Vistula", "Bank Orli", "Energetyk Grom", "FitFabryka si\u0142ownie", "Budmax Hurtownie", "Mleczarnia Kr\xF3wka Mazurska", "Kurier Strza\u0142a", "Meble Kowal", "Nap\xF3j Turbo D\u0105b", "Ubezpieczenia Tarcza", "Market Bociek", "Wody Kryniczanka Zdr\xF3j"];
var SPONSOR_GLOBAL = ["Volt Rush Energy", "Kaiju Fightwear", "Nomad Chrono", "Apex Fuel Nutrition", "Stratos Airways", "Ironclad Trucks", "Raptor Audio", "Monarch Motors", "Helix Smartwatch", "Titan Grip"];
var POOL_BASE = {
  local: [1500, 3e3, 6e3, 9e3, 12e3],
  national: [0, 0, 25e3, 4e4, 5e4],
  global: [0, 0, 0, 7e4, 12e4]
};
function sponsorPool(rng, s) {
  const r = rng.next();
  if (s.tier <= 1) return "local";
  if (s.tier === 2) return r < 0.65 ? "local" : "national";
  if (s.tier === 3) return r < 0.15 ? "local" : r < 0.7 ? "national" : "global";
  return r < 0.4 ? "national" : "global";
}
function poolNames(pool) {
  return pool === "global" ? SPONSOR_GLOBAL : pool === "national" ? SPONSOR_NATIONAL : SPONSOR_NAMES;
}
function sponsorPoolCapped(s, pool) {
  return pool === "global" && s.sponsors.filter((x) => SPONSOR_GLOBAL.includes(x.name)).length >= 2 ? "national" : pool;
}
function pickSponsorName(rng, s, pool) {
  const all = poolNames(pool);
  const free = all.filter((n) => !s.sponsors.some((x) => x.name === n));
  return rng.pick(free.length ? free : all);
}
function poolPay(s, pool) {
  return (POOL_BASE[pool][s.tier] ?? 0) * (0.7 + s.media / 100);
}
var SPONSOR_CLAUSES_BIG = ["logo na spodenkach w ka\u017Cdej walce", "reklama w telewizji \u015Bniadaniowej", "twarz na billboardach w du\u017Cych miastach", "dwa eventy firmowe w roku", "logo na banerze za tob\u0105 na konferencjach", "kampania w social mediach z kodem rabatowym"];
var SPONSOR_CLAUSES_GLOBAL = ["twarz globalnej kampanii", "wywiad w magazynie marki", "sesja zdj\u0119ciowa w Los Angeles", "logo na walkoutowej bluzie", "ambasador marki na Europ\u0119 \u015Arodkow\u0105", "film reklamowy z gwiazd\u0105 sportu"];
function maybeAutoSponsor(rng, s) {
  const cap = 1 + s.tier;
  if (s.sponsors.length >= cap) return null;
  const p = clamp((s.media * 0.8 + s.rep * 0.6) / 120 + (currentManager(s)?.sponsor ?? 0) / 100, 0.08, 0.75) * (s.profile.difficulty === "hard" ? 0.6 : 1);
  if (!rng.chance(p)) return null;
  const pool = sponsorPoolCapped(s, sponsorPool(rng, s));
  const name = pickSponsorName(rng, s, pool);
  const per = Math.max(500, Math.round(poolPay(s, pool) * (0.8 + rng.next() * 0.4) / 500) * 500);
  const clauses = pool === "local" ? SPONSOR_CLAUSES : pool === "national" ? SPONSOR_CLAUSES_BIG : SPONSOR_CLAUSES_GLOBAL;
  s.sponsors.push({ id: uid(rng, "s"), name, perSeason: per, seasonsLeft: rng.int(1, 3), clause: rng.pick(clauses) });
  return name;
}
var PITCH_SLOTS = [
  { id: "spodenki", label: "Logo na spodenkach", desc: "Najlepiej wida\u0107 w klatce, firmy p\u0142ac\u0105 najwi\u0119cej, ale trudno przekona\u0107.", base: 0.28, pay: 1, clause: "logo na spodenkach" },
  { id: "plecy", label: "Plecy rashguarda na wa\u017Ceniu", desc: "\u0141atwiej si\u0119 zgodz\u0105, ale zap\u0142ac\u0105 mniej.", base: 0.45, pay: 0.55, clause: "logo na plecach na wa\u017Ceniu i face to face" },
  { id: "social", label: "Posty na Instagrymie", desc: "Licz\u0105 si\u0119 zasi\u0119gi. Im wi\u0119cej medi\xF3w, tym wi\u0119ksza szansa.", base: 0.15, pay: 0.75, clause: "trzy posty w roku z kodem rabatowym" }
];
var PITCH_FAIL = [
  "odpisuje, \u017Ce w tym roku ca\u0142y bud\u017Cet poszed\u0142 na festyn gminny.",
  "nie odpisuje. Wiadomo\u015B\u0107 wisi z dwoma szarymi ptaszkami.",
  "odpisuje, \u017Ce \u201Esporty walki to nie ich klimat\u201D.",
  "chce ci\u0119 wesprze\u0107, ale tylko barterem: karton baton\xF3w proteinowych.",
  "prosi o kontakt za rok, \u201Ejak b\u0119dzie wi\u0119cej wynik\xF3w\u201D.",
  "odpisuje, \u017Ce ich prezes kibicuje twojemu rywalowi.",
  "prosi o portfolio i media kit. Musisz sprawdzi\u0107, co to jest.",
  "odpisuje: \u201Ea pan to gra\u0142 w pi\u0142k\u0119?\u201D.",
  "chce sponsorowa\u0107, ale tylko twojego rywala.",
  "wysy\u0142a ofert\u0119 na 200 z\u0142 rocznie i do\u017Cywotni rabat 5%.",
  "przeprasza, ale prezes jest na urlopie do wrze\u015Bnia.",
  "odpisuje emotk\u0105 kciuka w g\xF3r\u0119. I nic wi\u0119cej."
];
function sponsorCap(s) {
  return 2 + s.tier;
}
function pitchBlocked(s) {
  if (s.pitch && s.pitch.season === s.season) return "W tym roku ju\u017C szuka\u0142e\u015B. Kolejna pr\xF3ba za rok.";
  if (s.sponsors.length >= sponsorCap(s)) return "Masz ju\u017C tylu sponsor\xF3w, ilu da si\u0119 zmie\u015Bci\u0107 na stroju.";
  return null;
}
function pitchChance(s, slot) {
  const sl = PITCH_SLOTS.find((x) => x.id === slot);
  const mediaW = slot === "social" ? 1 / 70 : 1 / 160;
  let c = sl.base + s.media * mediaW + (s.rep - 30) / 220 + s.tier * 0.05 - s.sponsors.length * 0.1 + (currentManager(s)?.sponsor ?? 0) / 200;
  if ((s.flags.freakStigma ?? 0) > 0 && slot !== "social") c -= 0.05;
  if (s.profile.difficulty === "hard") c *= 0.8;
  return Math.round(clamp(c, 0.05, 0.85) * 100);
}
function pitchPool(s) {
  return sponsorPoolCapped(s, s.tier <= 1 ? "local" : s.tier <= 3 ? "national" : "global");
}
function pitchPay(s, slot) {
  const sl = PITCH_SLOTS.find((x) => x.id === slot);
  return Math.max(500, Math.round(poolPay(s, pitchPool(s)) * sl.pay * 0.8 / 500) * 500);
}
function pitchSponsor(s0, slot) {
  const s = clone(s0);
  if (pitchBlocked(s)) return s;
  withRng(s, (rng) => {
    const ch = pitchChance(s, slot) / 100;
    const sl = PITCH_SLOTS.find((x) => x.id === slot);
    const name = pickSponsorName(rng, s, pitchPool(s));
    if (rng.chance(ch)) {
      const per = Math.round(pitchPay(s, slot) * (0.85 + rng.next() * 0.3) / 500) * 500;
      s.sponsors.push({ id: uid(rng, "s"), name, perSeason: per, seasonsLeft: rng.int(1, 2), clause: sl.clause });
      s.pitch = { season: s.season, ok: true, name, slot, text: `${name} si\u0119 zgadza! ${fmtMoney(per).slice(1)} na rok za ${sl.clause}.` };
      log(s, `Nowy sponsor: ${name}.`);
    } else {
      s.pitch = { season: s.season, ok: false, name, slot, text: `${name} ${rng.pick(PITCH_FAIL)}` };
    }
  });
  return s;
}
function startSeason(s0) {
  if (!canStartSeason(s0)) return s0;
  const s = clone(s0);
  withRng(s, (rng) => {
    ensureRoster(rng, s);
    s.money += budgetBalance(s);
    if (depositPayout(s)) {
      log(s, `Lokata wr\xF3ci\u0142a z odsetkami: ${depositPayout(s)} z\u0142.`);
      s.deposit = null;
    }
    if (s.diet === "catering") s.flags[`dietPaid:${s.season}`] = 1;
    if (followersOf(s) >= 2e3 && (s.social === "self" || s.social === "pro")) s.media = clamp(s.media + 2, 0, 100);
    const jm = jobDef(s);
    s.flags.jobYear = jm ? s.season * 10 + ["full", "half", "none"].indexOf(jm.id) + 1 : 0;
    if (jobDef(s)?.id === "none" && !s.flags.quitJob) {
      s.flags.quitJob = 1;
      log(s, "Rzucasz etat. Od teraz \u017Cyjesz z walk.");
    }
    for (const l of s.loans) l.left -= 1;
    s.loans = s.loans.filter((l) => l.left > 0);
    s.gear = clamp((s.gear ?? 0) + 10, 0, 100);
    s.eventQueue = [];
    const n = rng.chance(s.quick ? 0.5 : 0.85) ? 1 : 0;
    const extra = !s.quick && rng.chance(0.18) ? 1 : 0;
    for (let i = 0; i < n + extra; i++) {
      const pool = EVENTS.map((e) => ({ item: e.id, w: eventWeight(e, s) * (s.eventQueue.includes(e.id) ? 0 : 1) })).filter(
        (x) => x.w > 0
      );
      if (!pool.length) break;
      s.eventQueue.push(rng.weighted(pool));
    }
    if ((s.flags.tryoutPending ?? 0) > 0 && s.tier === 0) s.eventQueue.unshift("sparing_kontrolny");
  });
  return nextEventOrSeason(s);
}
function shuffleChoices(arr, key) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ h >>> 13, 2246822507) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function nextEventOrSeason(s) {
  const id = s.eventQueue.shift();
  if (id) {
    const def = findEvent(id);
    s.seenEvents.push(id);
    s.event = { id, brand: def.brand, title: def.title ?? "Wydarzenie", text: def.text(s), choices: shuffleChoices(def.choices(s), `${id}:${s.season}:${s.age}:${s.history.length}`) };
    s.phase = "event";
    return s;
  }
  s.event = null;
  beginRun(s);
  return s;
}
function choiceChance(s, idx) {
  const c = s.event?.choices[idx];
  return c ? chanceOf(s, c) : null;
}
function chanceOf(s, c) {
  if (c.test) return chanceFrom(s.stats[c.test], TIER_LEVEL[s.tier] + 6);
  if (c.chance !== void 0) return c.chance;
  return null;
}
var SUPER_TAIL = ["I to z nawi\u0105zk\u0105.", "Wysz\u0142o lepiej, ni\u017C ktokolwiek zak\u0142ada\u0142.", "Lepiej si\u0119 nie da\u0142o.", "Ludzie jeszcze d\u0142ugo o tym gadaj\u0105."];
var DISASTER_TAIL = ["A do tego wszystko, co mog\u0142o p\xF3j\u015B\u0107 \u017Ale, posz\u0142o jeszcze gorzej.", "Gorzej ju\u017C si\u0119 nie da\u0142o.", "Ta historia b\u0119dzie wraca\u0107 przy ka\u017Cdej wigilii.", "Trener tylko kr\u0119ci g\u0142ow\u0105."];
var LOSS_KEYS = ["money", "media", "rep", "relations", "form"];
function hasLoss(e) {
  if (!e) return false;
  return LOSS_KEYS.some((k) => (e[k] ?? 0) < 0) || (e.wear ?? 0) > 0 || Object.values(e.stats ?? {}).some((v) => (v ?? 0) < 0);
}
function amplify(e, kind) {
  const out = { ...e, stats: e.stats ? { ...e.stats } : void 0 };
  const up = (v) => Math.abs(v) >= 1e3 ? Math.round(v * 1.5 / 500) * 500 : Math.round(v * 1.5);
  for (const k of LOSS_KEYS) {
    const v = e[k];
    if (v === void 0) continue;
    if (kind === "gain" && v > 0 || kind === "loss" && v < 0) out[k] = up(v);
  }
  if (e.wear !== void 0 && (kind === "gain" && e.wear < 0 || kind === "loss" && e.wear > 0)) out.wear = up(e.wear);
  if (out.stats) {
    for (const [k, v] of Object.entries(out.stats)) if (v !== void 0 && (kind === "gain" && v > 0 || kind === "loss" && v < 0)) out.stats[k] = up(v);
  }
  return out;
}
function chooseEvent(s0, idx) {
  const s = clone(s0);
  const ev = s.event;
  if (!ev || ev.picked !== void 0 || !ev.choices[idx]) return s;
  resolveChoice(s, ev, idx);
  return s;
}
function resolveChoice(s, ev, idx) {
  const c = ev.choices[idx];
  ev.picked = idx;
  withRng(s, (rng) => {
    const ch = chanceOf(s, c);
    if (ch !== null && (c.success || c.fail)) {
      const out = rollOutcome(rng, ch);
      const ok = out !== "fail";
      const disaster = !ok && rng.chance(0.2) && hasLoss(c.fail);
      ev.rolled = disaster ? "disaster" : out;
      const base = (ok ? c.success : c.fail) ?? {};
      ev.resultEffects = out === "super" ? amplify(base, "gain") : disaster ? amplify(base, "loss") : base;
      const txt = ok ? c.successText : c.failText;
      ev.resultText = out === "super" ? `${txt ?? ""} ${rng.pick(SUPER_TAIL)}`.trim() : disaster ? `${txt ?? ""} ${rng.pick(DISASTER_TAIL)}`.trim() : txt;
    } else {
      ev.resultEffects = c.effects ?? {};
    }
    applyEffects(s, ev.resultEffects, rng);
  });
}
function ensurePhone(s) {
  if (!s.phone) s.phone = { tick: 0, inbox: [], due: [], started: [], log: [] };
  return s.phone;
}
var threadOf = (stepId) => stepId.split(".")[0];
function deliverStep(s, st) {
  const ph = ensurePhone(s);
  const raw = typeof st.from === "function" ? st.from(s) : st.from;
  const from = raw === "Trener" || raw === "Trener klubowy" ? coachOf(s).id === "club" ? clubCoachName(s.club) : coachOf(s).name : raw;
  if (ph.inbox.some((m) => m.picked === void 0 && m.id.startsWith(`${st.id}#`))) return;
  const msg = {
    id: `${st.id}#${ph.tick}.${ph.inbox.length}`,
    app: st.app,
    from,
    ...st.note ? { note: true } : {},
    title: st.title,
    text: st.text(s),
    choices: shuffleChoices(st.choices(s), `${st.id}:${ph.tick}:${s.season}`),
    tick: ph.tick
  };
  ph.inbox.push(msg);
  if (!ph.started.includes(threadOf(st.id))) ph.started.push(threadOf(st.id));
  if (st.start) ph.lastAt = { ...ph.lastAt ?? {}, [threadOf(st.id)]: ph.tick };
}
function phoneCheck(rng, s, pre) {
  if (s.quick && isAmateurRun(s)) return;
  const ph = ensurePhone(s);
  for (const m of ph.inbox) {
    if (m.picked === void 0) continue;
    ph.log.push({ app: m.app, from: m.from, title: m.title, text: m.text, answer: m.choices[m.picked]?.label ?? "", result: m.resultText, tick: m.tick, ...m.note ? { note: true } : {} });
  }
  ph.inbox = ph.inbox.filter((m) => m.picked === void 0);
  ph.log = ph.log.slice(-40);
  ph.tick += 1;
  const ready = ph.due.filter((d) => d.at <= ph.tick).slice(0, 2);
  ph.due = ph.due.filter((d) => !ready.includes(d));
  for (const d of ready) {
    const st = findStep(d.step);
    if (st && (!st.cond || st.cond(s))) deliverStep(s, st);
  }
  const t = s.run?.tourneys?.[s.run.tIdx ?? 0];
  if (t && s.run.fights.some((f) => f.tourney === `${t.name} \xB7 ${t.city}`)) return;
  const tries = [s.quick ? 0.35 : 0.8, s.quick ? 0 : 0.35];
  for (const p of tries) {
    if (ph.inbox.filter((m) => m.picked === void 0).length >= 2 || !rng.chance(p)) return;
    const busy = /* @__PURE__ */ new Set([...ph.inbox.map((m) => threadOf(m.id)), ...ph.due.map((d) => threadOf(d.step))]);
    const pool = THREADS.filter(
      (t2) => t2.start && !busy.has(threadOf(t2.id)) && (t2.start.repeat ? ph.tick - (ph.lastAt?.[threadOf(t2.id)] ?? -99) >= 8 : !ph.started.includes(threadOf(t2.id))) && t2.start.cond(s, { pre })
    ).map((t2) => ({ item: t2, w: t2.start.weight }));
    if (!pool.length) return;
    deliverStep(s, rng.weighted(pool));
  }
}
function phoneUnread(s) {
  return (s.phone?.inbox ?? []).filter((m) => m.picked === void 0);
}
function msgChance(s, id, idx) {
  const c = s.phone?.inbox.find((m) => m.id === id)?.choices[idx];
  return c ? chanceOf(s, c) : null;
}
function errandsLeft(s) {
  return Math.max(0, ERRANDS_PER_YEAR - (s.flags[`errands:${s.season}`] ?? 0));
}
function errandOptions(s) {
  return ERRANDS.filter((e) => !e.cond || e.cond(s)).map((e) => ({ def: e, cost: e.cost?.(s) ?? 0, ok: (e.cost?.(s) ?? 0) <= Math.max(0, s.money) }));
}
function errandMs(s, id) {
  const d = findErrand(id);
  return s.mode === "ranked" && d ? d.hours * 36e5 : 0;
}
function startErrand(s0, id, now) {
  const d = findErrand(id);
  if (!d || s0.errand || s0.phase === "ended" || errandsLeft(s0) <= 0) return s0;
  if (d.cond && !d.cond(s0)) return s0;
  const cost = d.cost?.(s0) ?? 0;
  if (cost > Math.max(0, s0.money)) return s0;
  const s = clone(s0);
  s.money -= cost;
  s.flags[`errands:${s.season}`] = (s.flags[`errands:${s.season}`] ?? 0) + 1;
  s.errand = { id, endsAt: Math.round(now) + errandMs(s, id), season: s.season };
  s.errandResult = null;
  return s;
}
function claimErrand(s0, now) {
  const e = s0.errand;
  if (!e || now < e.endsAt) return s0;
  const d = findErrand(e.id);
  const s = clone(s0);
  s.errand = null;
  if (!d) return s;
  withRng(s, (rng) => {
    const o = rng.weighted(d.outcomes(s).map((x) => ({ item: x, w: x.w })));
    applyEffects(s, o.effects, rng);
    s.errandResult = { id: d.id, text: o.text, effects: o.effects };
  });
  return s;
}
function campOptions(s) {
  return CAMP_ACTS.filter((a) => !a.cond || a.cond(s));
}
function campWeek(s0, actId) {
  const c0 = s0.run?.camp;
  const act = findCampAct(actId);
  if (!c0 || !act || c0.week >= CAMP_WEEKS || act.cond && !act.cond(s0)) return s0;
  const s = clone(s0);
  const c = s.run.camp;
  withRng(s, (rng) => {
    const r = act.roll(s, rng, c.o.opp, c.week, c.picks);
    applyEffects(s, r.effects, rng);
    c.picks.push(act.id);
    c.log.push({ act: act.id, text: r.text, effects: r.effects, mod: r.mod });
    c.mod += r.mod;
    c.week += 1;
  });
  return s;
}
function campGo(s0) {
  const c0 = s0.run?.camp;
  if (!c0 || c0.week < CAMP_WEEKS) return s0;
  const s = clone(s0);
  const c = s.run.camp;
  s.run.camp = null;
  const o = c.o;
  o.campDone = true;
  o.campMod = clamp(Math.round(c.mod / 2 - CAMP_BASE), -4, 4);
  const names = c.picks.map((p) => findCampAct(p)?.name.toLowerCase() ?? p);
  o.campNote = `Ob\xF3z: ${names.join(", ")}.`;
  withRng(s, (rng) => {
    const d = buildWeek(rng, s, o);
    s.run.week = { o, ev: { id: d.id, title: d.title, text: d.text(s, o), choices: d.choices(s, o) } };
  });
  return s;
}
function weekChance(s, idx) {
  const c = s.run?.week?.ev.choices[idx];
  if (!c || !(c.success || c.fail)) return null;
  return chanceOf(s, c);
}
function weekAnswer(s0, idx) {
  const w0 = s0.run?.week;
  if (!w0 || w0.ev.picked !== void 0 || !w0.ev.choices[idx]) return s0;
  const s = clone(s0);
  resolveChoice(s, s.run.week.ev, idx);
  return s;
}
function weekGo(s0) {
  const w0 = s0.run?.week;
  if (!w0 || w0.ev.picked === void 0) return s0;
  const s = clone(s0);
  const o = s.run.week.o;
  s.run.week = null;
  if (o.wantPress && !o.pressDone) {
    o.pressDone = true;
    s.run.press = o;
    return s;
  }
  withRng(s, (rng) => startFight(rng, s, o));
  return s;
}
function tourneyEntry(s, t, ti) {
  const coach = clubCoachName(s.club);
  const fee = [60, 80, 120][Math.min(2, amLevel(s) + (t.championship ? 1 : 0))];
  const first = s.history.filter((h2) => h2.amateur).length === 0;
  const k = s.season * 3 + ti;
  const h = k * 7 + s.profile.lastName.length + (s.flags.entryN ?? 0);
  const open = t.championship ? `To s\u0105 Mistrzostwa Polski, ${t.city}. Tu nie ma przypadkowych ludzi: ka\u017Cdy w drabince wygra\u0142 ju\u017C swoje wojew\xF3dztwo.` : first ? `Zapisa\u0142em ci\u0119 na ${t.name} w ${t.city}. Twoje pierwsze zawody. Spokojnie, ka\u017Cdy kiedy\u015B debiutowa\u0142.` : [`Zapisa\u0142em ci\u0119 na ${t.name}, ${t.city}.`, `Lista startowa na ${t.name} posz\u0142a. Jeste\u015B na niej. ${t.city}.`, `Nast\u0119pne zawody: ${t.name} w ${t.city}. Ju\u017C ci\u0119 zg\u0142osi\u0142em.`][k % 3];
  const body = `Kategoria: ${t.division}. O\u015Bmiu w drabince, trzy wygrane walki dziel\u0105 ci\u0119 od z\u0142ota. Wa\u017Cenie o 7:00, wpisowe ${fee} z\u0142 p\u0142aci klub.`;
  const tail = ["Jak jedziemy?", "Pisz, jak doje\u017Cd\u017Casz.", "Wyjazd wcze\u015Bnie rano. Albo radzisz sobie sam."][k % 3];
  const local = amLevel(s) === 0;
  const lodging = Math.round((local ? 150 : 300) / 50) * 50;
  return {
    id: `entry_${ti}`,
    title: t.championship ? "Mistrzostwa Polski" : t.name,
    text: `${coach}: ${open}
${coach}: ${body}
${coach}: ${tail}`,
    choices: [
      [
        { label: "Jad\u0119 dzie\u0144 wcze\u015Bniej, \u015Bpi\u0119 przy hali", desc: "Hotel kosztuje, ale rano jeste\u015B wyspany.", effects: { money: -lodging, nextFight: 1, note: "wyspany na wa\u017Ceniu" } },
        { label: "Hostel przy hali, pok\xF3j z trzema judokami", desc: "Tanio, blisko. Judocy chrapi\u0105 w kimonach.", effects: { money: -Math.round(lodging / 2 / 50) * 50, nextFight: 1, note: "judocy po\u017Cyczaj\u0105 ci klapki" } },
        { label: "Pensjonat \u201EPod D\u0119bem\u201D, dwa kilometry od hali", desc: "W\u0142a\u015Bcicielka obiecuje \u015Bniadanie \u201Edla sportowca\u201D.", effects: { money: -lodging, nextFight: 1, note: "jajecznica z sze\u015Bciu jaj" } },
        { label: "Studio na wynajem, \u201Eprzytulne\u201D, ocena 4,2", desc: "Przytulne znaczy: \u0142\xF3\u017Cko stoi w kuchni.", effects: { money: -Math.round(lodging * 0.8 / 50) * 50, nextFight: 1, note: "klucz w skrzynce na listy" } },
        { label: "Internat szko\u0142y sportowej przy hali", desc: "\u0141\xF3\u017Cko pi\u0119trowe, kakao na \u015Bniadanie, cisza nocna od 22:00.", effects: { money: -Math.round(lodging / 3 / 50) * 50, nextFight: 1, note: "kakao jak w podstaw\xF3wce" } },
        { label: "Motel przy kraj\xF3wce", desc: "Tirowcy, schabowy do sufitu i cisza od 23:00 (w teorii).", effects: { money: -Math.round(lodging / 2 / 50) * 50, nextFight: 1, note: "schabowy na kolacj\u0119, ry\u017C na \u015Bniadanie" } }
      ][h % 6],
      [
        {
          label: "Klubowy bus o 4:30",
          desc: "Za darmo. \u015Apiewy, kanapki z jajkiem i drzemka na torbie.",
          chance: 65,
          success: { rep: 1, note: "ekipa w busie trzyma kciuki" },
          successText: "Bus doje\u017Cd\u017Ca na czas. Ca\u0142a dru\u017Cyna \u015Bpiewa ci przed rozgrzewk\u0105. Zbijasz pi\u0105tki z ka\u017Cdym.",
          fail: { nextFight: -1 },
          failText: "Bus \u0142apie gum\u0119 pod Koninem. Na wa\u017Cenie wpadasz w ostatniej minucie, rozgrzewka trwa trzy minuty."
        },
        {
          label: "Mietek bierze ci\u0119 swoim Passatem",
          desc: "Za darmo. Passat ma 400 tys. km i w\u0142asne zdanie.",
          chance: 60,
          success: { relations: 1, note: "Mietek zostaje na trybunach" },
          successText: "Passat doje\u017Cd\u017Ca. Mietek zostaje na ca\u0142e zawody i drze si\u0119 z trybun jak tw\xF3j ojciec.",
          fail: { nextFight: -1 },
          failText: "Passat staje na stacji pod \u0141odzi\u0105. Mietek \u201Ezna go\u015Bcia\u201D. Go\u015B\u0107 przyje\u017Cd\u017Ca po godzinie."
        },
        {
          label: "Poci\u0105g o 5:12 z przesiadk\u0105 w Kutnie",
          desc: "Tanio. Dworzec w Kutnie o sz\xF3stej rano to prze\u017Cycie.",
          chance: 55,
          success: { money: -40, note: "poci\u0105g o dziwo punktualny" },
          successText: "Poci\u0105g punktualny, przesiadka g\u0142adka. Na hali jeste\u015B pierwszy, jeszcze przed s\u0119dziami.",
          fail: { money: -40, nextFight: -1 },
          failText: "Op\xF3\u017Anienie 70 minut \u201Ez przyczyn technicznych\u201D. Wa\u017Cysz si\u0119, ledwo \u0142api\u0105c oddech."
        },
        {
          label: "Tata wiezie ci\u0119 \u201Eskr\xF3tem\u201D",
          desc: "Za darmo. Tata nie ufa nawigacji od 2009 roku.",
          chance: 55,
          success: { relations: 1, note: "tata: \u201Em\xF3wi\u0142em, \u017Ce skr\xF3tem szybciej\u201D" },
          successText: "Skr\xF3t, o dziwo, dzia\u0142a. Tata przez ca\u0142e zawody powtarza ka\u017Cdemu, kto chce s\u0142ucha\u0107, \u017Ce \u201Ezna drogi\u201D.",
          fail: { nextFight: -1 },
          failText: "Skr\xF3t prowadzi przez trzy wsie i przejazd kolejowy, kt\xF3ry stoi zamkni\u0119ty od p\xF3\u0142 godziny. Doje\u017Cd\u017Cacie na styk."
        },
        {
          label: "Wsp\xF3lny przejazd z panem Zdzis\u0142awem",
          desc: "Pi\u0119\u0107 dych. Pan Zdzis\u0142aw w profilu ma \u201Erozmowny\u201D.",
          chance: 70,
          success: { money: -50, note: "znasz ju\u017C histori\u0119 przepukliny pana Zdzis\u0142awa" },
          successText: "Doje\u017Cd\u017Cacie przed czasem. Znasz ju\u017C ca\u0142e \u017Cycie pana Zdzis\u0142awa, z przepuklin\u0105 w\u0142\u0105cznie.",
          fail: { money: -50, nextFight: -1 },
          failText: "Pan Zdzis\u0142aw staje na ka\u017Cdej stacji \u201Ena kawk\u0119\u201D. Na wa\u017Cenie wbiegasz z torb\u0105 w z\u0119bach."
        },
        {
          label: "Rodzice juniora maj\u0105 wolne miejsce w busie",
          desc: "Za darmo. Minivan, trzech junior\xF3w i bajki z tabletu.",
          chance: 65,
          success: { rep: 1, note: "juniorzy patrz\u0105 w ciebie jak w obrazek" },
          successText: "Juniorzy przez ca\u0142\u0105 drog\u0119 pytaj\u0105, ile masz walk. Na hali nios\u0105 ci torb\u0119 jak giermkowie.",
          fail: { nextFight: -1 },
          failText: "Cztery godziny tej samej bajki na p\u0119tli. Na rozgrzewce nucisz czo\u0142\xF3wk\u0119 i nie mo\u017Cesz przesta\u0107."
        }
      ][(h * 5 + 1) % 6],
      [
        {
          label: t.city === s.profile.hometown ? "\u015Api\u0119 w domu, mama robi \u015Bniadanie" : `\u015Api\u0119 u cioci w ${t.city}`,
          desc: t.city === s.profile.hometown ? "W\u0142asne \u0142\xF3\u017Cko. Mamina jajecznica." : "Ciocia obiecuje, \u017Ce \u201Enie b\u0119dzie zamieszania\u201D.",
          chance: 55,
          success: { relations: 1, nextFight: 1 },
          successText: "Ros\xF3\u0142, cisza, osiem godzin snu. Kto\u015B z rodziny odwozi ci\u0119 pod hal\u0119 i macha z parkingu.",
          fail: { relations: 1, nextFight: -1 },
          failText: "Na \u201Echwil\u0119\u201D wpad\u0142y s\u0105siadki. Do p\xF3\u0142nocy ogl\u0105dasz zdj\u0119cia z komunii kuzyna."
        },
        {
          label: "Nocleg u kolegi z kadry",
          desc: "Za darmo. On te\u017C startuje, wi\u0119c b\u0119dzie spok\xF3j. Chyba.",
          chance: 60,
          success: { rep: 1, nextFight: 1 },
          successText: "Rano wsp\xF3lna rozgrzewka i \u015Bniadanie z owsianki. Jedziecie na hal\u0119 jak dru\u017Cyna.",
          fail: { nextFight: -1 },
          failText: "Kolega gra do trzeciej na konsoli. \u201EOstatnia runda\u201D trwa trzy godziny."
        },
        {
          label: "\u015Api\u0119 w samochodzie trenera pod hal\u0105",
          desc: "Za darmo, za to blisko. Trener ma koc i termos.",
          chance: 45,
          success: { rep: 1, note: "trener: \u201Etwardziel\u201D" },
          successText: "\u015Apisz zaskakuj\u0105co dobrze. Trener m\xF3wi, \u017Ce \u201Eprawdziwi zawodnicy tak zaczynali\u201D.",
          fail: { nextFight: -2 },
          failText: "O trzeciej budzi ci\u0119 ochroniarz parkingu. O czwartej znowu. Plecy pami\u0119taj\u0105 skrzyni\u0119 bieg\xF3w."
        },
        {
          label: "Materac na sali klubu gospodarzy",
          desc: "Za darmo. Pachnie matami i p\u0142ynem do dezynfekcji.",
          chance: 55,
          success: { rep: 1, nextFight: 1, note: "gospodarze cz\u0119stuj\u0105 herbat\u0105" },
          successText: "Gospodarze przynosz\u0105 herbat\u0119 i koc. Rano rozgrzewasz si\u0119 tam, gdzie spa\u0142e\u015B. Wygodniej si\u0119 nie da.",
          fail: { nextFight: -1 },
          failText: "Kto\u015B zostawi\u0142 grzejnik na pe\u0142nej mocy. Budzisz si\u0119 mokry jak po saunie, tyle \u017Ce bez zbijania wagi."
        },
        {
          label: "Kanapa u znajomego ze szko\u0142y",
          desc: "Za darmo. Znajomy zapewnia, \u017Ce ma \u201Espokojne mieszkanie\u201D.",
          chance: 50,
          success: { nextFight: 1, relations: 1 },
          successText: "Spokojne mieszkanie naprawd\u0119 jest spokojne. Rano znajomy robi ci jajecznic\u0119 i jedzie kibicowa\u0107.",
          fail: { nextFight: -1 },
          failText: "W spokojnym mieszkaniu wsp\xF3\u0142lokator ma urodziny. Impreza ko\u0144czy si\u0119 o trzeciej, karaoke o czwartej."
        },
        {
          label: "Nocny autobus i drzemka na dworcu",
          desc: "Najtaniej. \u0141awki na dworcu kto\u015B zaprojektowa\u0142 przeciwko spaniu.",
          chance: 40,
          success: { money: -30, note: "\u015Bpisz na torbie jak w busie" },
          successText: "Przysypiasz na dwie godziny w poczekalni. Wystarczy. Na hali czujesz si\u0119 dziwnie lekki.",
          fail: { money: -30, nextFight: -2 },
          failText: "Pod\u0142okietnik co p\xF3\u0142 metra. Nie \u015Bpisz wcale, a o pi\u0105tej sprz\u0105taczka myje pod\u0142og\u0119 pod twoimi nogami."
        }
      ][(h * 11 + 2) % 6]
    ]
  };
}
function entryAnswer(s0, idx) {
  const e0 = s0.run?.entry;
  if (!e0 || e0.ev.picked !== void 0 || !e0.ev.choices[idx]) return s0;
  const s = clone(s0);
  resolveChoice(s, s.run.entry.ev, idx);
  return s;
}
function entryGo(s0) {
  const e0 = s0.run?.entry;
  if (!e0 || e0.ev.picked === void 0) return s0;
  const s = clone(s0);
  s.run.entryDone = e0.tIdx;
  s.run.entry = null;
  return seasonNext(s);
}
function answerPhoneAll(s, pick = () => 0) {
  let out = s;
  for (const m of phoneUnread(s)) out = answerMessage(out, m.id, Math.min(m.choices.length - 1, Math.max(0, pick(m))));
  if (afterPending(out) !== null) out = afterNext(out);
  if (out.run?.announce) out = announceAnswer(out, "ignore");
  if (out.run?.camp) {
    for (let i = 0; i < CAMP_WEEKS && out.run?.camp && out.run.camp.week < CAMP_WEEKS; i++) out = campWeek(out, ["technika", "sparingi", "kondycja"][i]);
    out = campGo(out);
  }
  if (out.run?.week) out = weekGo(weekAnswer(out, 0));
  if (out.run?.entry) out = entryGo(entryAnswer(out, 1));
  return out;
}
function answerMessage(s0, id, idx) {
  const m0 = s0.phone?.inbox.find((m2) => m2.id === id);
  if (!m0 || m0.picked !== void 0 || !m0.choices[idx]) return s0;
  const s = clone(s0);
  const m = s.phone.inbox.find((x) => x.id === id);
  resolveChoice(s, m, idx);
  return s;
}
function continueAfterEvent(s0) {
  const s = clone(s0);
  if (s0.event?.id === "sparing_kontrolny" && !s0.run && s0.eventQueue.length === 0 && s0.event.picked !== void 0) {
    s.event = null;
    s.phase = "training";
    if (s.quick) return quickAmateur(s);
    return s;
  }
  return nextEventOrSeason(s);
}
function applyEffects(s, e, rng) {
  if (e.money) {
    s.money += e.money;
    if (e.money > 0) s.totalEarned += e.money;
  }
  if (e.media) s.media = clamp(s.media + e.media, 0, 100);
  if (e.rep) s.rep = clamp(s.rep + e.rep, 0, 100);
  if (e.relations) s.relations += e.relations;
  if (e.wear) s.wear = clamp(s.wear + e.wear, 0, 100);
  if (e.stats)
    for (const [k, v] of Object.entries(e.stats)) s.stats[k] = clamp(s.stats[k] + v, 1, 99);
  if (e.injury) s.injury = { ...e.injury };
  if (e.healInjury) s.injury = null;
  if (e.promise) {
    s.promises.push({ ...e.promise, id: uid(rng, "pr") });
    s.flags.promisesMade = (s.flags.promisesMade ?? 0) + 1;
  }
  if (e.sponsor) {
    s.sponsors.push({ ...e.sponsor, id: uid(rng, "s") });
    s.flags[`sponsor:${e.sponsor.name}`] = 1;
    if (e.sponsor.name === LABS_SPONSOR && !s.backroom?.supps) {
      s.backroom = { ...s.backroom ?? {}, supps: true };
      s.flags.labsAutoSupps = 1;
    }
  }
  if (e.flag) s.flags[e.flag] = (s.flags[e.flag] ?? 0) + 1;
  if (e.flag === "manager") s.manager = "okulary";
  if (e.flag === "rivalPick" && !s.rivalId) {
    const p = [...s.peers].filter((x) => !x.retired && Math.abs(x.tier - s.tier) <= 1).sort((a, b) => b.talent - a.talent)[0];
    if (p) {
      s.rivalId = p.id;
      log(s, `Rywal na ca\u0142\u0105 karier\u0119: ${p.firstName} ${p.lastName}.`);
    }
  }
  if (e.flag === "amTalent" || e.flag === "amLocal") {
    s.flags.amLevel = e.flag === "amTalent" ? 1 : 0;
    s.flags.tryoutPending = 0;
    s.flags.tryout = e.flag === "amTalent" ? 2 : 1;
  }
  if (e.form) s.flags.formBonus = (s.flags.formBonus ?? 0) + e.form;
  if (e.nextFight) s.flags.nextFightMod = clamp((s.flags.nextFightMod ?? 0) + e.nextFight, -8, 8);
  if (e.gear) s.gear = clamp((s.gear ?? 0) + e.gear, 0, 100);
  if (e.follow) {
    const ph = ensurePhone(s);
    if (!ph.due.some((d) => d.step === e.follow.step)) ph.due.push({ step: e.follow.step, at: ph.tick + Math.max(1, e.follow.after ?? 1) });
  }
  if (e.loan) {
    s.money += e.loan.amount;
    s.loans.push({ installment: e.loan.installment, left: e.loan.count });
  }
  if (e.flag === "banned") {
    s.rank = null;
    s.flags.cut = 1;
    rosterSync(s);
    log(s, "Afera. Federacja rozwi\u0105zuje z tob\u0105 kontrakt.");
  }
}
var fmtMoney = (n) => {
  const a = Math.abs(n);
  const v = a >= 1e3 ? `${(a / 1e3).toLocaleString("pl-PL", { maximumFractionDigits: 1 })} tys. z\u0142` : `${a} z\u0142`;
  return `${n >= 0 ? "+" : "\u2212"}${v}`;
};
function effectChips(e, s) {
  if (!e) return [];
  const out = [];
  const sg = (n) => n > 0 ? `+${n}` : `\u2212${Math.abs(n)}`;
  if (e.money) out.push({ text: fmtMoney(e.money), tone: e.money > 0 ? "good" : "bad", icon: "coins" });
  if (e.stats)
    for (const [k, v] of Object.entries(e.stats))
      out.push({ text: `${STAT_LABELS[k].toLowerCase()} ${sg(v)}`, tone: v > 0 ? "good" : "bad", icon: `stat:${k}` });
  if (e.media) out.push({ text: `media ${sg(e.media)}`, tone: e.media > 0 ? "good" : "bad", icon: "megaphone" });
  if (e.rep) out.push({ text: `reputacja ${sg(e.rep)}`, tone: e.rep > 0 ? "good" : "bad", icon: "star" });
  if (e.relations) out.push({ text: `rodzina ${sg(e.relations)}`, tone: e.relations > 0 ? "good" : "bad", icon: "home" });
  if (e.form) out.push({ text: `forma ${sg(e.form)}`, tone: e.form > 0 ? "good" : "bad", icon: "flame" });
  if (e.wear) out.push({ text: `zu\u017Cycie ${sg(e.wear)}`, tone: e.wear > 0 ? "bad" : "good", icon: "bandage" });
  if (e.injury) out.push({ text: `kontuzja: ${e.injury.name}`, tone: "bad", icon: "bandage" });
  if (e.healInjury) out.push({ text: "kontuzja wyleczona", tone: "good", icon: "heart" });
  if (e.sponsor) out.push({ text: `sponsor ${fmtMoney(e.sponsor.perSeason).slice(1)} na rok`, tone: "good", icon: "briefcase" });
  if (e.promise) out.push({ text: `obietnica do roku ${e.promise.untilSeason}`, tone: "neutral", icon: "pen" });
  if (e.loan && e.loan.installment) out.push({ text: `raty ${e.loan.count} \xD7 ${fmtMoney(e.loan.installment).slice(1)}`, tone: "bad", icon: "card" });
  if (e.nextFight) out.push({ text: `najbli\u017Csza walka ${sg(e.nextFight)}`, tone: e.nextFight > 0 ? "good" : "bad", icon: "target" });
  if (e.gear) out.push({ text: e.gear < 0 ? `sprz\u0119t odnowiony ${Math.abs(e.gear)}%` : `zu\u017Cycie sprz\u0119tu +${e.gear}%`, tone: e.gear < 0 ? "good" : "bad", icon: "glove" });
  if (e.note) out.push({ text: e.note, tone: "neutral" });
  void s;
  return out;
}
function divisionPerson(div) {
  return { "pierwszy krok": "zawodnik pierwszego kroku", kadeci: "kadet", juniorzy: "junior", seniorzy: "senior" }[div] ?? div;
}
function isAmateurRun(s) {
  return s.tier === 0 && s.contract.kind !== "freak";
}
function makeTourneys(rng, s) {
  const div = amateurDivision(s.age, s.amRecord.w + s.amRecord.l + s.amRecord.d);
  const cities = rng.shuffle([...TOURNEY_CITIES]);
  const local = amLevel(s) === 0;
  const home = REGION_CITY[s.profile.region] ?? cities[0];
  return (local ? AMATEUR_TOURNEYS_LOCAL : AMATEUR_TOURNEYS).map((name, i) => ({
    name,
    city: local ? i === 0 ? home : s.profile.hometown || home : cities[i],
    division: div,
    stage: "qf",
    medal: null,
    place: null,
    championship: !local && i === 1
  }));
}
function amLevel(s) {
  return s.flags.amLevel ?? 1;
}
function plannedAmateur(run) {
  const ts = run.tourneys ?? [];
  let left = 0;
  for (let i = run.tIdx ?? 0; i < ts.length; i++) if (ts[i].stage) left++;
  return run.fights.length + left;
}
function beginRun(s) {
  withRng(s, (rng) => {
    const f = rng.weighted(SEASON_FORMS.map((x) => ({ item: x, w: x.w })));
    const fam = familyForm(s);
    const bonus = (s.flags.formBonus ?? 0) + fam;
    s.flags.formBonus = 0;
    const mod = f.mod + bonus;
    const intro = [];
    if (fam > 0) intro.push("Rodzina trzyma kciuki i pilnuje, \u017Ceby\u015B si\u0119 wysypia\u0142: forma +1.");
    if (fam < 0) intro.push("W domu ciche dni i k\u0142\xF3tnie przy obiedzie. G\u0142owa nie jest tam, gdzie powinna: forma \u22121.");
    let tourneys;
    if (isAmateurRun(s)) {
      if (amLevel(s) === 0 && ((s.flags.amPromote ?? 0) > 0 || (s.flags.amLocalSeasons ?? 0) >= 2)) {
        s.flags.amLevel = 1;
        s.flags.amPromote = 0;
        intro.push("Trener: \u201EDo\u015B\u0107 zawod\xF3w wojew\xF3dzkich. W tym roku jedziesz na Amatorski Puchar i Mistrzostwa Polski.\u201D");
      }
      if (amLevel(s) === 0) s.flags.amLocalSeasons = (s.flags.amLocalSeasons ?? 0) + 1;
      tourneys = makeTourneys(rng, s);
      intro.push(
        `${amLevel(s) === 0 ? "Na pocz\u0105tek zawody ni\u017Cszej rangi. " : ""}W tym roku dwa turnieje amatorskie: ${tourneys[0].name} (${tourneys[0].city}) i ${tourneys[1].name} (${tourneys[1].city}). Startujesz ${tourneys[0].division === "pierwszy krok" ? "w\u015Br\xF3d debiutant\xF3w" : `jako ${divisionPerson(tourneys[0].division)}`}, w drabince jest o\u015Bmiu zawodnik\xF3w.`
      );
    }
    const sp = maybeAutoSponsor(rng, s);
    if (sp) intro.push(`Nowy sponsor na spodenkach: ${sp}.`);
    if (s.injury) intro.push(`Zaczynasz rok z kontuzj\u0105: ${s.injury.name}. Ka\u017Cda szansa jest o ${s.injury.penalty} pkt mniejsza.`);
    if (bonus > 0) intro.push(`To, co dzia\u0142o si\u0119 przed startem, dodaje ci pewno\u015Bci: forma +${bonus}.`);
    if (bonus < 0) intro.push(`To, co dzia\u0142o si\u0119 przed startem, siedzi ci w g\u0142owie: forma \u2212${Math.abs(bonus)}.`);
    const planned = plannedFights(s);
    const mgr = currentManager(s);
    const mgrFocus = mgr ? rng.chance(mgr.focus) : void 0;
    if (mgr && s.tier > 0) {
      if (mgrFocus) intro.push(`${mgr.name} za\u0142atwia ci walki w tym roku (bierze ${Math.round(mgr.cut * 100)}% ga\u017Cy).`);
      else intro.push(`${mgr.name} ca\u0142y rok zajmuje si\u0119 ${mgr.stable ? rng.pick(mgr.stable) : "innymi zawodnikami"}. Na ciebie nie ma czasu, ale procent bierze.`);
    }
    if (planned > 3) intro.push(`${planned} walki w roku: wi\u0119cej ga\u017C, ale pod koniec organizm nie nad\u0105\u017Ca.`);
    s.run = {
      tourneys,
      tIdx: 0,
      form: { label: f.label, mod, tone: f.tone },
      fights: [],
      planned,
      done: false,
      startMoney: s.money,
      startOvr: ovr(s.stats),
      startRank: s.rank,
      startMedia: s.media,
      startFans: followersOf(s),
      intro,
      mgrFocus
    };
    if (tourneys) s.run.planned = plannedAmateur(s.run);
  });
  s.phase = "season";
}
function avoidMyName(rng, s, opp) {
  if (opp.lastName === s.profile.lastName) opp.lastName = otherLastName(rng, s.profile.lastName);
}
function amateurOpponent(rng, s, t, stage) {
  const hard = s.profile.difficulty === "hard";
  const rank = stage === "qf" ? null : stage === "sf" ? rng.int(4, 8) : stage === "b" ? rng.int(3, 6) : rng.int(1, 3);
  const opp = generateOpponent(rng, 0, rank, hard);
  opp.rank = null;
  opp.country = "Polska";
  opp.flag = "\u{1F1F5}\u{1F1F1}";
  opp.age = clamp(s.age + rng.int(-1, 2), 16, 34);
  const shift = (t.division === "pierwszy krok" ? -4 : t.division === "kadeci" ? -2 : t.division === "seniorzy" ? 2 : 0) + (amLevel(s) === 0 ? -3 : 0);
  if (shift) opp.stats = mapStats((k) => clamp(opp.stats[k] + shift, 6, 99));
  if (t.division === "pierwszy krok") opp.record = { w: rng.int(0, 1), l: rng.int(0, 1), d: 0 };
  return opp;
}
function pickOpponent(rng, s, idx) {
  const tier = s.tier;
  const size = RANK_SIZE[tier];
  const hard = s.profile.difficulty === "hard";
  const run = s.run;
  if (s.contract.kind === "freak") return { opp: generateFreak(rng), title: false, defense: false, peer: null };
  const metThisSeason = new Set(run.fights.map((f) => f.opp.id));
  if (!run.fights.length && s.history.length) {
    const lastName = s.history[s.history.length - 1].opponent;
    const lastF = rosterFor(s)?.list.find((f) => `${f.firstName} ${f.lastName}` === lastName);
    if (lastF && lastF.rank !== 0) metThisSeason.add(lastF.id);
  }
  const peers = s.peers.filter((p) => !p.retired && p.tier === tier && p.rank !== 0 && !metThisSeason.has(p.id));
  const wantPeer = (s.flags.peerCallout ?? 0) > 0 && peers.length > 0;
  const peerPick = () => {
    if (wantPeer) s.flags.peerCallout = 0;
    const callout = s.peers.find((x) => !x.retired && x.tier === tier && !metThisSeason.has(x.id));
    const p = wantPeer && callout ? callout : rng.pick(peers);
    const opp = { ...p, stats: { ...p.stats }, record: { ...p.record }, rank: tier === 0 ? null : p.rank ?? null, peer: true };
    return { opp, title: false, defense: false, peer: p };
  };
  if (isAmateurRun(s)) {
    const t = run.tourneys[run.tIdx ?? 0];
    if (peers.length && (wantPeer || rng.chance(0.14))) return peerPick();
    return { opp: amateurOpponent(rng, s, t, t.stage ?? "qf"), title: false, defense: false, peer: null };
  }
  const rivalPeer = s.rivalId ? s.peers.find((p) => p.id === s.rivalId && !p.retired && p.tier === tier && tier >= 1 && !metThisSeason.has(p.id)) : void 0;
  const asRival = (p, rank) => ({ ...p, stats: { ...p.stats }, record: { ...p.record }, rank, peer: true });
  if (s.rank === 0) {
    if (rivalPeer && rivalPeer.rank !== null && rivalPeer.rank <= 8 && rng.chance(0.55)) {
      s.flags.superLoss = 0;
      return { opp: asRival(rivalPeer, rivalPeer.rank), title: true, defense: true, peer: rivalPeer };
    }
    const top = (s.flags.superLoss ?? 0) > 0;
    s.flags.superLoss = 0;
    const opp = rosterOpp(rng, s, top ? 1 : rng.int(1, 3), metThisSeason);
    return { opp, title: true, defense: true, peer: null };
  }
  const last = idx === run.planned - 1;
  const streak = proStreak(s);
  const streakShot = s.rank !== null && (streak >= 5 && s.rank <= 4 && (last || rng.chance(0.35)) || streak >= 8 && s.rank <= 7);
  if (s.rank !== null && (s.rank === 1 || s.rank === 2 && last || s.rank <= 3 && last && rng.chance(0.4) || streakShot)) {
    if (rivalPeer && rivalPeer.rank === 0) return { opp: asRival(rivalPeer, 0), title: true, defense: false, peer: rivalPeer };
    const opp = rosterOpp(rng, s, 0, metThisSeason);
    return { opp, title: true, defense: false, peer: null };
  }
  const rival = s.rivalId ? peers.find((p) => p.id === s.rivalId) : void 0;
  const rivalCall = (s.flags.rivalCallout ?? 0) > 0 && !!rival;
  if (rivalCall) s.flags.rivalCallout = 0;
  if (rival && !wantPeer && (rivalCall || rng.chance(0.28))) {
    const opp = { ...rival, stats: { ...rival.stats }, record: { ...rival.record }, rank: rival.rank ?? null, peer: true };
    return { opp, title: false, defense: false, peer: rival };
  }
  if (peers.length && (wantPeer || rng.chance(0.18))) return peerPick();
  const mine = s.rank ?? size + 2;
  const mg = activeManager(s);
  const q = mg?.quality ?? 0;
  if (mg?.titleShot && s.rank !== null && s.rank <= 3 && last) {
    const opp = rosterOpp(rng, s, 0, metThisSeason);
    return { opp, title: true, defense: false, peer: null };
  }
  if ((s.flags.grudge ?? 0) > 0) {
    s.flags.grudge = 0;
    const opp = rosterOpp(rng, s, clamp(mine - rng.int(2, 4), 1, size), metThisSeason);
    opp.nickname = opp.nickname || "Pyskaty";
    return { opp, title: false, defense: false, peer: null, grudge: true };
  }
  let r = clamp(mine + rng.int(-3, 1) - Math.floor(q / 2), 1, size + 3);
  if ((s.flags.callUp ?? 0) > 0) {
    s.flags.callUp = 0;
    r = clamp(mine - rng.int(3, 5), 1, size);
    return { opp: rosterOpp(rng, s, r, metThisSeason), title: false, defense: false, peer: null };
  }
  if (r > size) r = null;
  if (s.rank === null && rng.chance(0.5 - q * 0.1)) r = null;
  return { opp: r === null ? generateOpponent(rng, tier, r, hard) : rosterOpp(rng, s, r, metThisSeason), title: false, defense: false, peer: null };
}
function gearCost(s) {
  return Math.round(700 * ([1, 1.5, 3, 5, 8][Math.min(4, s.tier)] ?? 1) / 50) * 50;
}
var tmScale = (s) => [1, 1.5, 3, 5, 8][Math.min(4, Math.max(0, s.tier))] ?? 1;
var tmZl = (s, n) => Math.max(20, Math.round(n * tmScale(s) / 10) * 10);
var tmKey = (s, id, career) => career ? `tm:${id}` : `tm:${s.season}:${id}`;
var LUXURY = [
  { id: "passat", title: "Passat B5 kombi 1.9 TDI, sprowadzony", desc: ["Niemiec p\u0142aka\u0142, jak sprzedawa\u0142. Przebieg 287 tys. (nie kr\u0119cony, s\u0142owo honoru). Hak, relingi, zapach choinki gratis.", "Auto po dziadku, gara\u017Cowane. Silnik chodzi jak szwajcarski zegarek, tylko troch\u0119 g\u0142o\u015Bniej. Baga\u017Cnik zmie\u015Bci torb\u0119, tarcze i trenera."], seller: "AutoHandel Zbyszek", price: 14e3, minTier: 1, effects: { relations: 1 }, hint: "rodzina +1, koniec z busem spod ko\u015Bcio\u0142a", owned: "Passat B5 kombi, kt\xF3ry prze\u017Cy\u0142 ca\u0142\u0105 twoj\u0105 karier\u0119" },
  { id: "audi", title: "Audi A6, czarne, felgi 19 cali", desc: ["Pierwszy w\u0142a\u015Bciciel w Polsce. Drugi, trzeci i czwarty w Niemczech. Ksenony, sk\xF3ra, podgrzewane wszystko.", "Auto dla kogo\u015B, kto ju\u017C co\u015B osi\u0105gn\u0105\u0142. S\u0105siedzi b\u0119d\u0105 patrze\u0107. Przegl\u0105d do wiosny."], seller: "Premium Cars Radom", price: 85e3, minTier: 2, effects: { media: 2, rep: -1 }, hint: "media +2, reputacja \u22121 (s\u0105siedzi gadaj\u0105)", owned: "czarne Audi, kt\xF3re s\u0105siedzi pami\u0119taj\u0105 do dzi\u015B" },
  { id: "mama", title: "Mieszkanie M3 z wind\u0105, dla mamy", desc: ["Trzy pokoje, balkon na po\u0142udnie, winda (dzia\u0142a). Blok po termomodernizacji, w okolicy Biedronka i przychodnia.", "Mama m\xF3wi, \u017Ce niczego nie potrzebuje. Mama od dwudziestu lat nosi zakupy na czwarte pi\u0119tro. To mieszkanie ma wind\u0119."], seller: "Biuro Nieruchomo\u015Bci \u201EKlucz\u201D", price: 42e4, minTier: 2, effects: { relations: 3 }, hint: "rodzina +3, mama ma wind\u0119", owned: "mieszkanie z wind\u0105, w kt\xF3rym mama pokazuje go\u015Bciom twoje zdj\u0119cia" },
  { id: "kebab", title: "Udzia\u0142y w kebabie \u201EPod Klatk\u0105\u201D", desc: ["Lokal przy p\u0119tli autobusowej, czynny do 4:00. Wsp\xF3lnik zna si\u0119 na ro\u017Cnie, ty masz twarz na szyld. Zysk co roku.", "Kebab z tradycjami: dwa razy sanepid, raz telewizja \u015Bniadaniowa. Szukamy wsp\xF3lnika z rozpoznawaln\u0105 twarz\u0105."], seller: "Mehmet i Wojtek s.c.", price: 16e4, minTier: 2, effects: { media: 1 }, hint: "co rok ok. 18 000 z\u0142 zysku", owned: "kebab \u201EPod Klatk\u0105\u201D, na kt\xF3rego szyldzie wci\u0105\u017C wisi twoja twarz" },
  { id: "dom", title: "Dom pod miastem z sal\u0105 w gara\u017Cu", desc: ["180 m\xB2, dzia\u0142ka 1200 m\xB2, gara\u017C przerobiony na sal\u0119 z matami. Cisza, las, s\u0105siad hoduje alpaki.", "Dom z ogrodem i sal\u0105 treningow\u0105. Poprzedni w\u0142a\u015Bciciel: \u201Eprezes od wszystkiego\u201D. Wyjecha\u0142 nagle, cena do negocjacji."], seller: "Domy Premium Mazowsze", price: 14e5, minTier: 3, effects: { relations: 2, wear: -8 }, hint: "rodzina +2, zu\u017Cycie \u22128, ni\u017Csze koszty \u017Cycia", owned: "dom pod miastem z sal\u0105 w gara\u017Cu" },
  { id: "zegarek", title: "Zegarek \u201Ejak u mistrz\xF3w\u201D", desc: ["Szwajcarski, z papierami i pude\u0142kiem. Na konferencji ka\u017Cdy kamerzysta zrobi zbli\u017Cenie.", "Taki sam nosi\u0142 mistrz UFL na wa\u017Ceniu. Kosztuje jak kawalerka, pokazuje t\u0119 sam\u0105 godzin\u0119 co telefon."], seller: "Jubiler Z\u0142ota R\u0105czka", price: 12e4, minTier: 3, effects: { media: 3 }, hint: "media +3", owned: "zegarek, kt\xF3ry pokazuje t\u0119 sam\u0105 godzin\u0119 co telefon" }
];
function kebabIncome(s) {
  if (!s.flags["own:kebab"]) return 0;
  return 12e3 + (s.season * 3797 + s.profile.lastName.length * 911) % 12 * 1e3;
}
function tasmaItems(s) {
  if (s.phase === "ended") return [];
  const out = [];
  const gc = gearCost(s);
  const gear = s.gear ?? 0;
  const seed = s.season * 7 + s.profile.lastName.length;
  if (gear >= 20) {
    out.push({ id: "rekawice", kind: "buy", title: "R\u0119kawice sparingowe 16 oz, u\u017Cywane raz", desc: "Kupi\u0142em, poszed\u0142em na jeden trening, zrozumia\u0142em, \u017Ce to nie dla mnie. Stan idealny. Pachn\u0105 jak nowe (prawie).", seller: ["Sebastian_92", "Kris z Wroc\u0142awia", "janek.fit"][seed % 3], price: Math.round(gc * 0.35 / 10) * 10, risk: 25, effects: { gear: -35 }, hint: "sprz\u0119t \u221235%" });
    if (gear >= 45) out.push({ id: "komplet", kind: "buy", title: "Komplet po bracie: kask, nagolenniki, suspensor", desc: "Brat sko\u0144czy\u0142 karier\u0119 po pierwszym sparingu. Suspensor nieu\u017Cywany, przysi\u0119gam.", seller: ["Pani Bo\u017Cena", "Marek_Gdynia", "Ania K."][seed % 3], price: Math.round(gc * 0.55 / 10) * 10, risk: 15, effects: { gear: -50 }, hint: "sprz\u0119t \u221250%" });
    out.push({ id: "tasma", kind: "buy", title: "Ta\u015Bma bokserska, 30 rolek, z hurtowni", desc: "Hurt po likwidacji sklepu. Kolor: \u201Ecielisty\u201D. Na dwa lata owijania.", seller: "Hurtownia Banda\u017C-Pol", price: tmZl(s, 60), effects: { gear: -8 }, hint: "sprz\u0119t \u22128%" });
  }
  if (!s.flags[tmKey(s, "worek", true)])
    out.push({ id: "worek", kind: "buy", title: "Worek bokserski 40 kg + \u0142a\u0144cuchy", desc: "Odbi\xF3r osobisty, 4 pi\u0119tro, bez windy. Znoszenie to dodatkowy trening gratis.", seller: "Ryszard (emeryt, by\u0142y tragarz)", price: tmZl(s, 250), effects: { stats: { stand: 1 }, wear: 1 }, hint: "st\xF3jka +1, zu\u017Cycie +1" });
  if (!s.flags[tmKey(s, "rowerek", true)])
    out.push({ id: "rowerek", kind: "buy", title: "Rower stacjonarny, stan idealny", desc: "S\u0142u\u017Cy\u0142 jako wieszak na ubrania przez pi\u0119\u0107 lat. Licznik pokazuje 3 km.", seller: "Gra\u017Cyna_z_Bloku", price: tmZl(s, 300), effects: { stats: { cardio: 1 } }, hint: "kondycja +1" });
  if (s.proDebut) {
    for (const l of LUXURY) if (s.tier >= l.minTier && !s.flags[`own:${l.id}`] && !(l.id === "passat" && s.flags["own:audi"])) out.push({ id: `lux-${l.id}`, kind: "buy", title: l.title, desc: vary6(s, l.desc, l.id.length), seller: l.seller, price: l.price, effects: l.effects, hint: l.hint, big: true });
  }
  const titles = s.history.filter((h) => h.title && h.result === "W");
  for (const h of titles.slice(-3)) {
    const id = `pas-${h.season}-${h.opponent.replace(/\s+/g, "")}`;
    if (s.flags[tmKey(s, id, true)]) continue;
    out.push({ id, kind: "sell", title: `R\u0119kawice z walki o pas vs ${h.opponent}`, desc: `Z autografem, z krwi\u0105 rywala (gratis). Rok ${s.seasons.find((x) => x.season === h.season)?.year ?? ""}.`, seller: "ty", price: Math.round(2500 * tmScale({ ...s, tier: h.tier }) / 50) * 50, effects: { media: 1 }, hint: "media +1" });
  }
  const medals = s.medals.gold + s.medals.silver + s.medals.bronze - (s.flags.medalsSold ?? 0);
  if (medals > 0) out.push({ id: "medal", kind: "sell", title: "Medal z turnieju amatorskiego", desc: "Prawdziwy, wisia\u0142 w pokoju u mamy. Mama jeszcze nie wie.", seller: "ty", price: tmZl(s, 200), effects: { relations: -1 }, hint: "rodzina \u22121" });
  if (s.proDebut && !s.flags[tmKey(s, "koszulka")])
    out.push({ id: "koszulka", kind: "sell", title: "Koszulka z wyj\u015Bcia do klatki, z autografem", desc: "Prana raz. \u015Alady potu autentyczne, certyfikat wystawiony przez mam\u0119.", seller: "ty", price: tmZl(s, 120) + Math.round(Math.min(40, s.media) * 10 * tmScale(s)), effects: { media: 1 }, hint: "media +1" });
  return out.filter((it) => it.big || !s.flags[tmKey(s, it.id, it.id === "worek" || it.id === "rowerek" || it.id.startsWith("pas-"))]);
}
function tasmaDeal(s0, id) {
  const it = tasmaItems(s0).find((x) => x.id === id);
  if (!it) return s0;
  if (it.kind === "buy" && s0.money < it.price) return s0;
  const s = clone(s0);
  const career = id === "worek" || id === "rowerek" || id.startsWith("pas-");
  if (it.big) s.flags[`own:${id.slice(4)}`] = s.season;
  else s.flags[tmKey(s, id, career)] = 1;
  withRng(s, (rng) => {
    if (it.kind === "buy") {
      s.money -= it.price;
      const fake = !!it.risk && rng.chance(it.risk / 100);
      if (fake) {
        applyEffects(s, { gear: -10 }, rng);
        s.flags.tasmaLast = 2;
        log(s, `Oliks: \u201E${it.title}\u201D okaza\u0142y si\u0119 podr\xF3bk\u0105. Logo krzywe, szwy puszczaj\u0105.`);
      } else {
        applyEffects(s, it.effects, rng);
        s.flags.tasmaLast = 1;
        log(s, `Oliks: kupione \u201E${it.title}\u201D.`);
      }
    } else {
      s.money += it.price;
      s.totalEarned += it.price;
      applyEffects(s, it.effects, rng);
      if (id === "medal") s.flags.medalsSold = (s.flags.medalsSold ?? 0) + 1;
      s.flags.tasmaLast = 3;
      log(s, `Oliks: sprzedane \u201E${it.title}\u201D.`);
    }
  });
  return s;
}
function fotoPostOptions(s) {
  const h = s.history[s.history.length - 1];
  if (!h || s.phase === "ended" || !s.proDebut || s.flags[`fp:${s.history.length}`]) return null;
  const opp = h.opponent.split(" ").pop();
  const opts = [
    { id: "respekt", label: "Zdj\u0119cie z rywalem", caption: h.result === "W" ? `${opp}, szacunek. Twarda walka, wielkie serce. \u{1F91D}` : `${opp}, gratulacje. Dzi\u015B by\u0142e\u015B lepszy. Wracam silniejszy. \u{1F91D}`, hint: "reputacja +1, obserwuj\u0105cy +" },
    { id: "trash", label: "Wywo\u0142anie kolejnego rywala", caption: h.result === "W" ? `Nast\u0119pny. Kto chce by\u0107 kolejny? Czekam. \u{1F624}` : `S\u0119dziowie mnie okradli. Rewan\u017C albo nic. \u{1F624}`, hint: "media +2, reputacja \u22121, du\u017Co obserwuj\u0105cych, ryzyko kary" }
  ];
  if (s.sponsors.length) opts.push({ id: "sponsor", label: "Post z produktem sponsora", caption: `Regeneracja po walce tylko z ${s.sponsors[0].name}! Kod rabatowy w bio \u{1F4AA}`, hint: "pieni\u0105dze od sponsor\xF3w, media +1" });
  if (h.result !== "W") opts.push({ id: "kulisy", label: "Szczera relacja z szatni", caption: "Nie b\u0119d\u0119 \u015Bciemnia\u0142. Boli. Ale tak wygl\u0105da ten sport. Dzi\u0119kuj\u0119, \u017Ce jeste\u015Bcie. \u2764\uFE0F", hint: "reputacja +2, obserwuj\u0105cy +" });
  return { fight: h, opts };
}
function fotoPost(s0, kind) {
  const o = fotoPostOptions(s0);
  if (!o || !o.opts.some((x) => x.id === kind)) return s0;
  const s = clone(s0);
  s.flags[`fp:${s.history.length}`] = 1;
  const fans = followersOf(s);
  const win = o.fight.result === "W";
  withRng(s, (rng) => {
    let fine = 0;
    if (kind === "respekt") {
      applyEffects(s, { rep: 1 }, rng);
      addFans(s, fans * (win ? 0.025 : 0.015) + 20);
    } else if (kind === "trash") {
      applyEffects(s, { media: 2, rep: -1 }, rng);
      addFans(s, fans * (win ? 0.05 : 0.03) + 50);
      if (rng.chance(0.25)) {
        fine = Math.round(300 * ([1, 1.5, 3, 5, 8][Math.min(4, s.tier)] ?? 1) / 50) * 50;
        s.money -= fine;
      }
    } else if (kind === "sponsor") {
      const pay = s.sponsors.length * Math.round(150 * ([1, 1.5, 3, 5, 8][Math.min(4, s.tier)] ?? 1) / 50) * 50;
      applyEffects(s, { money: pay, media: 1 }, rng);
      addFans(s, fans * 0.01);
      s.flags[`fpSp:${s.season}`] = (s.flags[`fpSp:${s.season}`] ?? 0) + 1;
    } else {
      applyEffects(s, { rep: 2 }, rng);
      addFans(s, fans * 0.03 + 30);
    }
    s.flags.fpLastFans = followersOf(s) - fans;
    s.flags.fpLastFine = fine;
  });
  return s;
}
function podcastRival(s) {
  if (s.phase !== "season" || !s.run) return null;
  const opp = s.run.offer?.opp ?? s.run.camp?.o.opp ?? null;
  if (!opp || opp.freak || s.flags[`pod:${opp.id}`]) return null;
  return opp;
}
function podcastListen(s0) {
  const opp = podcastRival(s0);
  if (!opp) return s0;
  const s = clone(s0);
  s.flags[`pod:${opp.id}`] = 1;
  withRng(s, (rng) => applyEffects(s, { nextFight: 1 }, rng));
  return s;
}
var DEPOSIT_RATE = 0.06;
function depositOptions(s) {
  if (s.phase !== "budget" || s.deposit) return [];
  const free = s.money + budgetBalance(s);
  return [0.25, 0.5, 0.75].map((k) => Math.floor(free * k / 1e3) * 1e3).filter((a, i, arr) => a >= 1e3 && arr.indexOf(a) === i);
}
function depositPayout(s) {
  const d = s.deposit;
  if (!d || s.season <= d.season) return 0;
  return Math.round(d.amount * (1 + DEPOSIT_RATE));
}
function openDeposit(s0, amount) {
  if (!depositOptions(s0).includes(amount)) return s0;
  const s = clone(s0);
  s.money -= amount;
  s.deposit = { amount, season: s.season };
  log(s, `Lokata Wojownik: ${amount} z\u0142 na rok.`);
  return s;
}
function breakDeposit(s0) {
  if (!s0.deposit || s0.phase === "ended") return s0;
  const s = clone(s0);
  s.money += s.deposit.amount;
  log(s, `Zerwana lokata: ${s.deposit.amount} z\u0142 wraca bez odsetek.`);
  s.deposit = null;
  return s;
}
function buyGear(s0) {
  if (s0.phase !== "budget" || (s0.gear ?? 0) < 20 || s0.money < gearCost(s0)) return s0;
  const s = clone(s0);
  s.money -= gearCost(s);
  s.gear = 0;
  log(s, "Nowy komplet sprz\u0119tu: r\u0119kawice, ochraniacze, kask.");
  return s;
}
function gearMod(s) {
  const g = s.gear ?? 0;
  return g >= 90 ? -2 : g >= 70 ? -1 : 0;
}
function fightMods(s) {
  const cur = s.run?.fights[s.run.fights.length - 1];
  return (cur?.phoneMod ?? 0) + (cur?.campMod ?? 0) + gearMod(s) + proFightMods(s);
}
function proFightMods(s) {
  const cur = s.run?.fights[s.run.fights.length - 1];
  if (!cur || cur.amateur) return 0;
  const sh = weightShift(s);
  let m = sh < 0 ? 4 : sh > 0 ? -2 : 0;
  m += dietForm(s);
  m += cur.weighMod ?? 0;
  if (cur.short) m -= 5;
  if (cur.superfight) m -= 3;
  if (cur.tickets?.plan === "push") m -= 2;
  if (cur.tickets?.plan === "none") m += 1;
  if (cur.tired) m -= 2;
  if (cur.prep === "rival") m += 4;
  if (cur.prep === "hard") m += 3;
  m += cur.pressMod ?? 0;
  if (hasBackroom(s, "supps")) m += 2;
  if (hasBackroom(s, "sparring")) m += 4;
  return m;
}
function fightCtx(s, opp) {
  return {
    me: effectiveStats(s),
    meName: fullName(s),
    opp,
    // czwarta i piąta walka w roku: organizm nie nadąża
    form: s.run.form.mod + jobForm(s) + socialForm(s) + ((s.flags.expBoost ?? 0) > 0 ? 5 : 0) - Math.max(0, s.run.fights.length - 3) * 5 + (s.run.planned < s.contract.fights && s.contract.kind !== "freak" ? 3 : 0) + fightMods(s),
    penalty: s.injury?.penalty ?? 0,
    perks: [...activePerks(s), ...coachPerks(s)],
    allowDecision: true,
    decisionChance: 0.55
  };
}
function purseFor(s, opp, title, spot) {
  const c = s.contract;
  let p = c.purse;
  if (title) p *= 1.8;
  else if (spot === "g\u0142\xF3wna") p *= 1.15;
  else if (spot === "wieczoru") p *= 1.35;
  if (opp.peer) p *= 1.1;
  if (s.tier === 1) p *= 1 + 0.05 * clamp(ticketRep(s), -2, 4);
  const mg = activeManager(s);
  if (mg) p *= mg.purse;
  return Math.round(p / 100) * 100;
}
function galaName(rng, s, fed) {
  const key = `gala:${fed}`;
  const n = s.flags[key] ?? rng.int(8, 52);
  s.flags[key] = n + rng.int(1, 2);
  return `${galaPrefix(fed)} ${n}`;
}
function cardSpot(rng, s, title, opp, freak) {
  if (title) return "wieczoru";
  if (freak) return rng.chance(0.4) ? "wieczoru" : "g\u0142\xF3wna";
  if (s.contract.star) return "wieczoru";
  if (s.tier === 1 && ticketRep(s) >= 4 && s.proDebut) return rng.chance(0.5) ? "wieczoru" : "g\u0142\xF3wna";
  if (s.tier === 1 && ticketRep(s) >= 2 && s.proDebut) return "g\u0142\xF3wna";
  if (s.tier === 1 && ticketRep(s) <= -1) return "wst\u0119pna";
  if (!s.proDebut) return "wst\u0119pna";
  if (s.rank !== null && s.rank <= 3) return rng.chance(0.35) ? "wieczoru" : "g\u0142\xF3wna";
  if (s.rank !== null && s.rank <= 7 || opp.peer || s.media >= 40) return "g\u0142\xF3wna";
  return "wst\u0119pna";
}
var ROUND_MIN = (rep) => rep.amateur ? rep.stage === "qf" || rep.stage === "sf" ? 4 : 3 : 5;
function finishTime(rng, rep) {
  const total = ROUND_MIN(rep) * 60;
  const sec = rng.int(12, total - 3);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}
function buildOffer(rng, s, idx) {
  if (s.flags.farewell && s.tier > 0 && s.contract.kind !== "freak") return farewellOffer(rng, s);
  const special = specialOffer(rng, s);
  if (special) return special;
  const picked = pickOpponent(rng, s, idx);
  const { title, defense, grudge, peer } = picked;
  let opp = picked.opp;
  let interim = false;
  let title2 = title;
  const usedIds = new Set(s.run.fights.map((f) => f.opp.id));
  if (title && !defense && s.rank !== 0 && opp.rank === 0 && !peer && s.tier >= 1 && !s.flags.interim && rng.chance(0.4)) {
    interim = true;
    opp = rosterOpp(rng, s, rng.int(1, 3), usedIds);
  } else if (!title && !defense && !peer && s.tier >= 1 && s.rank !== null && s.rank >= 1 && s.rank <= 3 && !s.flags.interim && !s.run.fights.some((f) => f.interim) && rng.chance(0.12)) {
    interim = true;
    title2 = true;
    const r = rng.int(1, 4);
    opp = rosterOpp(rng, s, r === s.rank ? r === 1 ? 2 : r - 1 : r, usedIds);
  }
  avoidMyName(rng, s, opp);
  const freak = s.contract.kind === "freak";
  const fed = freak ? s.contract.fed : s.fed;
  const spot = cardSpot(rng, s, title2, opp, freak);
  const rival = !!peer && !!s.rivalId && peer.id === s.rivalId;
  const trilogy = rival && !!peer && peer.h2h.w === 1 && peer.h2h.l === 1;
  let purse = purseFor(s, opp, title2, spot) * (rival ? trilogy ? 1.3 : 1.15 : 1);
  purse = Math.round(purse * (0.85 + rng.next() * 0.3) / 100) * 100;
  return {
    opp,
    title: title2,
    defense,
    grudge,
    rival,
    spot,
    gala: galaName(rng, s, fed),
    purse,
    winBonus: Math.round(s.contract.winBonus * (title2 ? 1.8 : 1)),
    negotiated: false,
    hook: !interim && title2 && !defense && !rival && s.rank !== null && s.rank > 1 && proStreak(s) >= 5 ? `Seria ${proStreak(s)} wygranych z rz\u0119du. Federacja nie mo\u017Ce d\u0142u\u017Cej udawa\u0107, \u017Ce ci\u0119 nie widzi: dostajesz walk\u0119 o pas, cho\u0107 w rankingu jeste\u015B #${s.rank}.` : interim ? `Mistrz ${fedShort(s)} jest kontuzjowany i nie wr\xF3ci przed ko\u0144cem roku. Federacja robi walk\u0119 o pas tymczasowy. Wygrany zmierzy si\u0119 z mistrzem w walce unifikacyjnej.` : rival && peer ? rivalHook(peer, title, defense, trilogy) : void 0,
    interim: interim || void 0
  };
}
function farewellAvailable(s) {
  return s.tier > 0 && s.contract.kind !== "freak" && !s.flags.farewell && !!s.proDebut && (s.wear >= 65 && s.age >= 27 || s.age >= 34);
}
function setFarewell(s0, on) {
  const s = clone(s0);
  s.flags.farewell = on ? 1 : 0;
  return s;
}
function farewellOffer(rng, s) {
  const used = /* @__PURE__ */ new Set();
  const peer = s.rivalId ? s.peers.find((p) => p.id === s.rivalId && !p.retired && p.tier === s.tier) : void 0;
  let opp = rosterOpp(rng, s, s.rank === 0 ? 1 : clamp((s.rank ?? 6) - 1, 1, 6), used);
  let hook = `Ostatni raz wchodzisz do klatki. Gala w mie\u015Bcie ${s.profile.hometown}, hala wyprzedana w dwa dni, a w pierwszym rz\u0119dzie siedzi ca\u0142a rodzina.`;
  if (peer) {
    opp = rosterOpp(rng, s, peer.rank ?? 3, used);
    Object.assign(opp, { firstName: peer.firstName, lastName: peer.lastName, nickname: peer.nickname, id: peer.id, peer: true });
    hook = `Na po\u017Cegnanie ten, z kt\xF3rym wszystko si\u0119 zacz\u0119\u0142o: ${peer.firstName} ${peer.lastName}. Gala w mie\u015Bcie ${s.profile.hometown}, hala wyprzedana w dwa dni.`;
  }
  avoidMyName(rng, s, opp);
  const champ = s.rank === 0;
  const spot = "wieczoru";
  const purse = Math.round(purseFor(s, opp, champ, spot) * 1.8 / 100) * 100;
  return { opp, title: champ, defense: champ, spot, gala: `Gala po\u017Cegnalna \xB7 ${s.profile.hometown}`, purse, winBonus: Math.round(s.contract.winBonus * 1.5), negotiated: true, farewell: true, hook };
}
function fedShort(s) {
  return s.fed.split(" \u2013 ")[0];
}
function specialOffer(rng, s) {
  if (s.contract.kind === "freak" || isAmateurRun(s)) return null;
  const tier = s.tier;
  const mk = (opp, extra) => {
    avoidMyName(rng, s, opp);
    const title = !!extra.title;
    const spot = cardSpot(rng, s, title, opp, false);
    const purse = Math.round(purseFor(s, opp, title, spot) * (0.95 + rng.next() * 0.15) * (extra.rematch ? 1.15 : extra.nemesis ? 1.3 : 1) / 100) * 100;
    return { opp, title, defense: false, spot, gala: galaName(rng, s, s.fed), purse, winBonus: Math.round(s.contract.winBonus * (title ? 1.8 : 1)), negotiated: false, ...extra };
  };
  if ((s.flags.interim ?? 0) > 0 && s.rank === 1 && s.season > (s.flags.interimSeason ?? -1)) {
    const opp = rosterOpp(rng, s, 0, new Set(s.run.fights.map((f) => f.opp.id)));
    return mk(opp, { title: true, unify: true, hook: `Mistrz wr\xF3ci\u0142 po kontuzji. Tw\xF3j pas tymczasowy kontra jego pas: walka unifikacyjna, zwyci\u0119zca zostaje jedynym mistrzem.` });
  }
  const rm = s.rematchOpp;
  if (rm) {
    s.rematchOpp = null;
    if (rm.rank === null || rm.rank <= RANK_SIZE[tier] + 3) {
      const opp = { ...rm, stats: { ...rm.stats }, record: { ...rm.record } };
      const defense = s.rank === 0;
      if (defense) opp.rank = clamp(opp.rank || 1, 1, RANK_SIZE[tier]);
      const title = defense || rm.rank === 0 && s.rank !== 0;
      return mk(opp, {
        title,
        defense,
        rematch: true,
        rival: !!s.rivalId && rm.id === s.rivalId,
        hook: `Rewan\u017C, o kt\xF3ry si\u0119 upomnia\u0142e\u015B. ${opp.lastName} wie, \u017Ce pierwsza walka nie przekona\u0142a nikogo.${defense ? " Tym razem bronisz pasa." : title ? " Tym razem o pas." : ""}`
      });
    }
  }
  const nf = nemesisFighter(s);
  const nemesisOk = !!nf && (nf.rank !== 0 || s.rank === 0 || s.rank !== null && s.rank <= 3);
  if (nf && nemesisOk && s.flags.nemesisYear !== s.season && !s.run.fights.some((f) => f.opp.id === nf.id) && rng.chance((s.flags.nemesisHeat ?? 0) > 0 ? 0.6 : 0.3)) {
    s.flags.nemesisYear = s.season;
    s.flags.nemesisHeat = 0;
    const { h2h, champSince: _c, ...base } = nf;
    void _c;
    const opp = { ...base, stats: { ...nf.stats }, record: { ...nf.record } };
    const defense = s.rank === 0;
    if (defense) opp.rank = clamp(opp.rank || 1, 1, RANK_SIZE[tier]);
    const title = defense || nf.rank === 0 && s.rank !== null && s.rank <= 3;
    return mk(opp, {
      title,
      defense,
      nemesis: true,
      hook: `Zadra. ${opp.firstName} ${opp.lastName} od waszej walki nie daje ci spokoju w mediach. Do tej pory ${h2hWords(h2h.w, h2h.l, h2h.d)}. Organizator dok\u0142ada 30% do ga\u017Cy, bo bilety na t\u0119 walk\u0119 sprzedadz\u0105 si\u0119 same.${title ? defense ? " I tym razem bronisz pasa." : " A on ma pas." : ""}`
    });
  }
  if ((s.flags.titleCall ?? 0) > 0 && s.rank !== 0 && s.rank !== null) {
    s.flags.titleCall = 0;
    if (s.rank > 3) {
      s.flags.callUp = 1;
      return null;
    }
    const opp = rosterOpp(rng, s, 0, /* @__PURE__ */ new Set());
    return mk(opp, { title: true, hook: `Twoje wezwanie po ostatniej walce obieg\u0142o internet. Mistrz odpowiedzia\u0142: \u201EChcesz? To masz\u201D. Federacja daje ci walk\u0119 o pas.` });
  }
  return null;
}
var WEIGHT_GEN = { piorkowa: "pi\xF3rkowej", lekka: "lekkiej", polsrednia: "p\xF3\u0142\u015Bredniej", srednia: "\u015Bredniej", polciezka: "p\xF3\u0142ci\u0119\u017Ckiej", ciezka: "ci\u0119\u017Ckiej" };
function superDivision(s) {
  const i = WEIGHT_KEYS.indexOf(divisionKey(s));
  return WEIGHT_KEYS[i < WEIGHT_KEYS.length - 1 ? i + 1 : i - 1];
}
function superfightWanted(rng, s) {
  if (s.rank !== 0 || s.tier < 3 || s.contract.kind === "freak" || s.titleDefenses < 1) return false;
  if ((s.flags.superDone ?? 0) >= 2 || s.flags.superYear === s.season) return false;
  if ((s.flags.superCall ?? 0) > 0) return true;
  return rng.chance(0.18);
}
function buildSuperfight(rng, s) {
  s.flags.superYear = s.season;
  s.flags.superCall = 0;
  const div = superDivision(s);
  const up = WEIGHT_KEYS.indexOf(div) > WEIGHT_KEYS.indexOf(divisionKey(s));
  const opp = generateOpponent(rng, s.tier, 0, s.profile.difficulty === "hard");
  if (up) {
    opp.stats.chin = clamp(opp.stats.chin + 4, 1, 99);
    opp.stats.stand = clamp(opp.stats.stand + 2, 1, 99);
  } else {
    opp.stats.cardio = clamp(opp.stats.cardio + 4, 1, 99);
  }
  avoidMyName(rng, s, opp);
  const mg = activeManager(s);
  const purse = Math.round(s.contract.purse * 2.6 * (mg?.purse ?? 1) * (0.95 + rng.next() * 0.15) / 1e3) * 1e3;
  const label = WEIGHT_GEN[div];
  return {
    opp,
    title: false,
    defense: false,
    spot: "wieczoru",
    gala: galaName(rng, s, s.fed),
    purse,
    winBonus: Math.round(s.contract.winBonus * 2),
    negotiated: false,
    superfight: label,
    hook: `Superfight: mistrz kontra mistrz. ${opp.firstName} ${opp.lastName} trzyma pas wagi ${label}. ${up ? "Idziesz kategori\u0119 wy\u017Cej, rywal b\u0119dzie ci\u0119\u017Cszy." : "Schodzisz kategori\u0119 ni\u017Cej, rywal b\u0119dzie szybszy."} Wygrana to drugi pas i miejsce w historii. Tw\xF3j pas nie jest stawk\u0105, ale po pora\u017Cce reputacja spadnie, a w nast\u0119pnej obronie czeka numer 1 rankingu.`
  };
}
var ABROAD = [
  { city: "Dubaj", venue: "Arena Pustynna", gala: "Desert Kings FC", flag: "\u{1F1E6}\u{1F1EA}" },
  { city: "Rijad", venue: "Hala Kr\xF3lewska", gala: "Arabian Warriors", flag: "\u{1F1F8}\u{1F1E6}" },
  { city: "Makau", venue: "Cotai Arena", gala: "Dragon Gate MMA", flag: "\u{1F1F2}\u{1F1F4}" },
  { city: "Saitama", venue: "Super Arena", gala: "Raizen Sylwester", flag: "\u{1F1EF}\u{1F1F5}" }
];
function abroadWanted(rng, s) {
  const run = s.run;
  if (s.tier < 2 || s.contract.kind === "freak" || run.abroadOffered || run.autoAccept || s.quick) return false;
  if (run.fights.length === 0 || run.planned >= 5) return false;
  if (isExclusiveFed(s.contract.fed)) return false;
  if (s.injury && s.injury.penalty >= 5) return false;
  return rng.chance(coachOf(s).contacts ? 0.2 : 0.11);
}
function buildAbroad(rng, s) {
  s.run.abroadOffered = true;
  const last = s.run.fights.length >= s.run.planned - 1;
  const a = last && rng.chance(0.5) ? ABROAD[3] : rng.pick(ABROAD.slice(0, 3));
  const opp = generateOpponent(rng, s.tier, rng.int(1, 5), s.profile.difficulty === "hard");
  const intl = generateOpponent(rng, 4, null, false);
  Object.assign(opp, { firstName: intl.firstName, lastName: intl.lastName, nickname: intl.nickname, country: intl.country, flag: intl.flag });
  opp.rank = null;
  avoidMyName(rng, s, opp);
  const mg = activeManager(s);
  const purse = Math.round(s.contract.purse * 2.5 * (mg?.purse ?? 1) * (0.95 + rng.next() * 0.15) / 500) * 500;
  const who = currentManager(s)?.name ?? "Szejk z du\u017C\u0105 got\xF3wk\u0105";
  return {
    opp,
    title: false,
    defense: false,
    spot: "g\u0142\xF3wna",
    gala: `${a.gala} \xB7 ${a.city}`,
    purse,
    winBonus: Math.round(s.contract.winBonus * 1.5),
    negotiated: true,
    abroad: a.city,
    tip: `${who}: \u201E${a.gala} robi gal\u0119 w mie\u015Bcie ${a.city} i chce kogo\u015B z Polski. P\u0142ac\u0105 dwa i p\xF3\u0142 raza wi\u0119cej ni\u017C u nas. Ranking si\u0119 nie ruszy, ale wygrana zrobi szum. Rywal mocny: ${opp.firstName} ${opp.lastName}.\u201D`
  };
}
function inviteWanted(rng, s) {
  const run = s.run;
  if (s.tier < 1 || s.contract.kind === "freak" || run.inviteOffered || s.quick) return false;
  if (run.fights.length === 0 || run.fights.length >= run.planned) return false;
  if (s.injury && s.injury.penalty >= 5) return false;
  return rng.chance(coachOf(s).contacts ? 0.8 : 0.62);
}
function isExclusiveContract(s) {
  return isExclusiveFed(s.contract.fed);
}
function acceptInvite(s0) {
  const inv = s0.run?.invite;
  if (!inv) return s0;
  const s = clone(s0);
  withRng(s, (rng) => {
    const res = resolveInvite(rng, s, inv, s.run.form.mod);
    s.run.invite = null;
    (s.run.sideLog ??= []).push({ title: res.title, text: res.text, tone: res.tone, lines: res.lines });
    if (res.win && inv.kind !== "seminar") log(s, `${inv.kind === "grappling" ? "Z\u0142oto" : "Wygrana"}: ${inv.title}.`);
  });
  return s;
}
function declineInvite(s0) {
  if (!s0.run?.invite) return s0;
  const s = clone(s0);
  s.run.invite = null;
  return s;
}
function inviteChance(s) {
  const inv = s.run?.invite;
  if (!inv || !["grappling", "boxing", "grapple1", "kick"].includes(inv.kind)) return null;
  const p = sideChance(s, inv.kind, s.run.form.mod);
  return Math.round((inv.kind === "grappling" ? p * p * p : p) * 100);
}
function shortWanted(rng, s) {
  const run = s.run;
  if (s.tier < 1 || s.contract.kind === "freak" || run.shortOffered || run.autoAccept || s.quick) return false;
  if (s.injury && s.injury.penalty >= 5) return false;
  if (run.fights.length === 0 || run.planned >= 5 || s.rank === 0) return false;
  return rng.chance(0.14);
}
function buildShortNotice(rng, s) {
  s.run.shortOffered = true;
  const size = RANK_SIZE[s.tier];
  const mine = s.rank ?? size + 2;
  const r = clamp(mine - rng.int(3, 5), 1, size);
  const opp = rosterOpp(rng, s, s.rank === null && rng.chance(0.4) ? rng.int(Math.max(1, size - 3), size) : r, new Set(s.run.fights.map((f) => f.opp.id)));
  avoidMyName(rng, s, opp);
  const spot = s.tier <= 1 ? "g\u0142\xF3wna" : rng.chance(0.5) ? "g\u0142\xF3wna" : "wieczoru";
  const base = purseFor(s, opp, false, spot);
  const purse = Math.round(base * 1.6 * (0.95 + rng.next() * 0.1) / 100) * 100;
  const who = currentManager(s)?.name ?? "Organizator";
  return {
    opp,
    title: false,
    defense: false,
    spot,
    gala: galaName(rng, s, s.fed),
    purse,
    winBonus: Math.round(s.contract.winBonus * 1.3),
    negotiated: true,
    short: true,
    tip: `${who}: \u201ERywal z karty g\u0142\xF3wnej wypad\u0142, gala za sze\u015B\u0107 dni. Bierzesz? P\u0142ac\u0105 ponad p\xF3\u0142torej stawki, a ${opp.lastName} ${opp.rank !== null && (s.rank === null || opp.rank < s.rank) ? "jest wy\u017Cej w rankingu" : "to wymagaj\u0105cy rywal"}. Przegrana na zast\u0119pstwie mniej boli. Bez obozu, ${weightShift(s) < 0 ? "wag\u0119 trzeba zbi\u0107 na szybko" : "ale wag\u0119 masz"}.\u201D`
  };
}
function rivalHook(p, title, defense, trilogy) {
  const h = h2hWords(p.h2h.w, p.h2h.l, p.h2h.d);
  if (title && defense) return `Obrona pasa przeciwko odwiecznemu rywalowi. ${p.lastName} czeka\u0142 na to latami, a ty ${h}.`;
  if (title) return `${p.lastName} ma pas. Twoja walka o tytu\u0142 to walka z odwiecznym rywalem, a ty ${h}.`;
  if (trilogy) return `Trylogia. Po jednej wygranej dla ka\u017Cdego, ta walka rozstrzygnie, kto by\u0142 lepszy. Organizator dok\u0142ada 30% do ga\u017Cy.`;
  if (p.metCount === 0) return `${p.lastName}: rywal, o kt\xF3rym m\xF3wi\u0105 wszyscy. Pierwsze starcie zawodowe, ga\u017Ca +15%.`;
  return `Odwieczny rywal, ${h}. Organizator dok\u0142ada 15% do ga\u017Cy.`;
}
function tuneupWanted(rng, s, _idx) {
  const run = s.run;
  if (s.tier < 2 || s.contract.kind === "freak" || run.tuneupOffered || run.autoAccept) return false;
  if (s.rank === 0) return false;
  if (isExclusiveFed(s.contract.fed)) {
    if (s.streak <= -3 && !run.exclNote) {
      run.exclNote = true;
      run.notes = run.notes ?? [];
      run.notes.push(`${s.contract.fed.split(" \u2013 ")[0]} trzyma ci\u0119 na wy\u0142\u0105czno\u015B\u0107. Walki na odbudow\u0119 na innych galach nie wchodz\u0105 w gr\u0119, musisz odbi\u0107 si\u0119 u siebie.`);
    }
    return false;
  }
  if (s.streak <= -3 && s.flags.lastTuneup !== s.season) {
    s.flags.lastTuneup = s.season;
    return true;
  }
  if (s.flags.lastTuneup && s.season - s.flags.lastTuneup < 2) return false;
  const lowRank = s.rank === null || s.rank >= RANK_SIZE[s.tier] - 3;
  const slump = s.streak <= -2 || s.streak <= -1 && lowRank;
  if (!slump) return false;
  const last = s.lastSummary;
  if (last && last.w > last.l && s.streak > -2) return false;
  if (!rng.chance(currentManager(s) ? 0.5 : 0.25)) return false;
  s.flags.lastTuneup = s.season;
  return true;
}
function buildTuneup(rng, s) {
  const g = rng.pick(TUNEUP_GALAS);
  const pool = rng.chance(0.75) ? NAMES_TUNEUP[0] : NAMES_TUNEUP[1];
  const opp = generateOpponent(rng, 1, null, false);
  opp.firstName = rng.pick(pool.first);
  opp.lastName = rng.pick(pool.last);
  opp.country = pool.country;
  opp.flag = pool.flag;
  opp.nickname = rng.chance(0.7) ? rng.pick(TUNEUP_NICKS) : "";
  opp.age = rng.int(34, 42);
  const lvl = ovr(s.stats) - 8;
  const prof = STYLE_PROFILE[opp.style];
  opp.stats = mapStats((k) => clamp(Math.round(lvl + prof[k] * 0.6 + rng.int(-3, 3)), 8, 99));
  const w = rng.int(5, 12);
  opp.record = { w, l: w + rng.int(8, 16), d: 0 };
  opp.rank = null;
  const purse = Math.round(Math.min(s.contract.purse * (0.6 + rng.next() * 0.15), [0, 0, 25e3, 45e3, 7e4][s.tier] ?? 25e3) / 100) * 100;
  const mgr = currentManager(s);
  const who = mgr ? mgr.name : "Znajomy promotor";
  const skad = pool.country === "S\u0142owacja" ? "ze S\u0142owacji" : "z Czech";
  const tip = `${who}: \u201EMam dla ciebie go\u015Bcia ${skad}, ${opp.firstName} ${opp.lastName}, bilans ${recStr(opp.record)}. Wygrasz, odbudujesz rekord, troch\u0119 grosza wpadnie. Ludzie pogadaj\u0105, ale kto by si\u0119 przejmowa\u0142.\u201D`;
  return { opp, title: false, defense: false, spot: "wieczoru", gala: `${g.gala} \xB7 ${g.city}`, purse, winBonus: Math.round(purse * 0.3), negotiated: true, tuneup: true, tip };
}
function seasonNext(s0) {
  const s = clone(s0);
  const run = s.run;
  if (!run || run.done) return s;
  const cur = run.fights[run.fights.length - 1];
  if (cur && !cur.sim.finished) return s;
  if (run.offer || run.press || run.weigh || run.post || run.invite || run.camp || run.announce || run.week || run.entry) return s;
  if (afterPending(s) !== null) return s;
  const midTourney = isAmateurRun(s) && run.tourneys?.[run.tIdx ?? 0]?.stage !== "qf";
  if (run.phoneAt !== run.fights.length && !midTourney) {
    run.phoneAt = run.fights.length;
    withRng(s, (rng) => phoneCheck(rng, s, run.fights.length === 0));
  }
  if (phoneUnread(s).length) return s;
  if (isAmateurRun(s) && !s.quick) {
    const ti = run.tIdx ?? 0;
    const t = run.tourneys?.[ti];
    if (t && t.stage === "qf" && (run.entryDone ?? -1) < ti) {
      run.entry = { tIdx: ti, ev: tourneyEntry(s, t, ti) };
      return s;
    }
  }
  withRng(s, (rng) => {
    const idx = run.fights.length;
    if (!isAmateurRun(s)) {
      if (superfightWanted(rng, s)) {
        run.offer = buildSuperfight(rng, s);
        return;
      }
      if (shortWanted(rng, s)) {
        run.offer = buildShortNotice(rng, s);
        return;
      }
      if (abroadWanted(rng, s)) {
        run.offer = buildAbroad(rng, s);
        return;
      }
      if (inviteWanted(rng, s)) {
        run.inviteOffered = true;
        const inv = buildInvite(rng, s);
        if (inv) {
          run.invite = inv;
          return;
        }
      }
      if (tuneupWanted(rng, s, idx)) {
        run.tuneupOffered = true;
        run.offer = buildTuneup(rng, s);
        return;
      }
      const o = buildOffer(rng, s, idx);
      if (s.quick && !(o.title || o.rival || o.superfight || o.rematch || o.nemesis)) {
        o.prep = "std";
        if (ticketsAvailable(s, o)) o.tickets = "std";
        startFight(rng, s, o);
        return;
      }
      if (run.autoAccept) {
        const p = run.autoPrep ?? "std";
        o.prep = p === "rival" && s.money < prepCost(s, o) ? "std" : p;
        if (ticketsAvailable(s, o)) o.tickets = ["none", "std", "push"][s.flags.autoTickets ?? 1];
        startFight(rng, s, o);
      } else run.offer = o;
      return;
    }
    const { opp, title, defense, grudge } = pickOpponent(rng, s, idx);
    avoidMyName(rng, s, opp);
    startFight(rng, s, { opp, title, defense, grudge, gala: "", purse: 0, winBonus: 0, negotiated: false });
  });
  return s;
}
var VENUES = [
  [],
  [
    { city: "Radom", venue: "Hala MOSiR" },
    { city: "Zielona G\xF3ra", venue: "Hala CRS" },
    { city: "Bydgoszcz", venue: "Hala \u0141uczniczka" },
    { city: "Rzesz\xF3w", venue: "Hala Podpromie" },
    { city: "Olsztyn", venue: "Hala Urania" },
    { city: "Kielce", venue: "Hala Legion\xF3w" }
  ],
  [
    { city: "\u0141\xF3d\u017A", venue: "Atlas Arena" },
    { city: "Katowice", venue: "Spodek" },
    { city: "Wroc\u0142aw", venue: "Hala Stulecia" },
    { city: "Gda\u0144sk", venue: "Arena nad morzem" },
    { city: "Krak\xF3w", venue: "Arena Krak\xF3w" },
    { city: "Warszawa", venue: "Torwar" }
  ],
  [
    { city: "Londyn", venue: "Arena nad Tamiz\u0105" },
    { city: "Pary\u017C", venue: "Hala Bercy" },
    { city: "Dublin", venue: "Arena Liffey" },
    { city: "Praga", venue: "Hala na Libni" },
    { city: "Sztokholm", venue: "Globe" },
    { city: "Berlin", venue: "Arena przy Szprewie" }
  ],
  [
    { city: "Las Vegas", venue: "Arena na pustyni" },
    { city: "Nowy Jork", venue: "Garden" },
    { city: "Abu Zabi", venue: "Arena na wyspie" },
    { city: "Rio de Janeiro", venue: "Hala Jeunesse" },
    { city: "Tokio", venue: "Saitama Arena" },
    { city: "Sydney", venue: "Arena w zatoce" }
  ]
];
function regionalVenue(rng, fed) {
  const city = Object.values(REGION_CITY).find((c) => fed.endsWith(` ${c}`));
  if (!city) return null;
  const known = VENUES[1].filter((v) => v.city === city);
  return known.length ? rng.pick(known) : { city, venue: rng.pick(["Hala widowiskowo-sportowa", "Hala MOSiR", "Arena miejska"]) };
}
function makePoster(rng, s, rep) {
  const tier = Math.max(1, s.tier);
  const tg = rep.tuneup ? TUNEUP_GALAS.find((x) => rep.gala?.startsWith(x.gala)) : void 0;
  const ab = rep.abroad ? ABROAD.find((x) => x.city === rep.abroad) : void 0;
  const v = ab ? { city: ab.city, venue: ab.venue } : rep.freak ? { city: rng.pick(["Warszawa", "\u0141\xF3d\u017A", "Gliwice"]), venue: "Hala Expo" } : tg ? { city: tg.city, venue: tg.venue } : regionalVenue(rng, s.fed) ?? rng.pick(FED_VENUES[s.fed] ?? VENUES[tier]);
  const tags = ["Walka wieczoru", "Co-main event", "Karta g\u0142\xF3wna", "Karta g\u0142\xF3wna", "Karta wst\u0119pna", "Karta wst\u0119pna"];
  const mine = rep.spot === "wieczoru" ? 0 : rep.spot === "g\u0142\xF3wna" ? rng.int(1, 3) : rng.int(4, 5);
  const bouts = [];
  const used = /* @__PURE__ */ new Set([s.profile.lastName, rep.opp.lastName]);
  for (let i = 0; i < 6; i++) {
    if (i === mine) {
      bouts.push({ a: s.profile.lastName, ar: recStr(mainRecord(s)), b: rep.opp.lastName, br: rep.opp.freak ? "debiut" : recStr(rep.opp.record), tag: "" });
      continue;
    }
    const rk = i <= 1 ? rng.int(1, 5) : i <= 3 ? rng.int(4, 12) : null;
    const pt = rep.tuneup ? 1 : rep.abroad ? 4 : tier;
    const fresh = (mk) => {
      let f = mk();
      for (let k = 0; k < 6 && used.has(f.lastName); k++) f = mk();
      used.add(f.lastName);
      return f;
    };
    const x = fresh(() => rep.freak ? generateFreak(rng) : generateOpponent(rng, pt, rk, false));
    const y = fresh(() => rep.freak ? generateFreak(rng) : generateOpponent(rng, pt, rk === null ? null : rk + rng.int(1, 3), false));
    bouts.push({ a: x.lastName, ar: x.freak ? "freak" : recStr(x.record), b: y.lastName, br: y.freak ? "freak" : recStr(y.record), tag: tags[i] });
  }
  bouts[mine].tag = tags[mine];
  return { city: v.city, venue: v.venue, bouts };
}
function startFight(rng, s, o) {
  const run = s.run;
  const idx = run.fights.length;
  const { opp, title, defense, grudge } = o;
  const amateur = isAmateurRun(s);
  if (!o.campDone && !amateur && !o.short && !s.quick && !run.autoAccept) {
    run.camp = { o, week: 0, picks: [], log: [], mod: 0 };
    return;
  }
  if (!amateur && s.contract.kind !== "freak" && !o.weigh && weightShift(s) < 0) {
    const p = weightMissChance(s) * (o.short ? 2 : 1) + (o.short ? 10 : 0);
    if (rng.chance(p / 100)) {
      if (s.quick && !(title || o.rival || o.superfight)) o.weigh = "paid";
      else {
        run.weigh = o;
        return;
      }
    }
  }
  const t = amateur ? run.tourneys[run.tIdx ?? 0] : void 0;
  {
    {
      const freak = s.contract.kind === "freak";
      const fed = freak ? s.contract.fed : s.fed;
      const stage = t?.stage ?? void 0;
      const rounds = amateur ? stage === "qf" || stage === "sf" ? 1 : 3 : title || o.superfight ? 5 : 3;
      const spot = amateur ? void 0 : o.spot;
      const rep = {
        idx,
        amateur,
        stage,
        tourney: t ? `${t.name} \xB7 ${t.city}` : void 0,
        gala: amateur ? void 0 : o.gala,
        spot,
        opp,
        fed,
        title,
        defense,
        freak,
        peer: !!opp.peer,
        rankBefore: s.rank,
        rankAfter: null,
        result: null,
        method: null,
        round: 0,
        detail: "",
        moments: [],
        sim: newSim(rounds),
        purse: amateur ? 0 : o.purse,
        winBonus: amateur ? 0 : o.winBonus,
        rival: o.rival,
        nemesis: o.nemesis,
        tuneup: o.tuneup,
        short: o.short,
        interim: o.interim,
        unify: o.unify,
        superfight: o.superfight,
        abroad: o.abroad,
        farewell: o.farewell,
        announce: o.announceChoice,
        earned: 0
      };
      if (o.tuneup || o.abroad) rep.fed = o.gala.split(" \xB7 ")[0];
      const pm = s.flags.nextFightMod ?? 0;
      if (pm) {
        rep.phoneMod = pm;
        s.flags.nextFightMod = 0;
        rep.moments.push({
          round: 0,
          title: "Sprawy poza klatk\u0105",
          text: pm > 0 ? `${vary6(s, ["To, co dzia\u0142o si\u0119 przed walk\u0105, dzia\u0142a na twoj\u0105 korzy\u015B\u0107.", "Ostatnie dni u\u0142o\u017Cy\u0142y si\u0119 po twojej my\u015Bli.", "Wchodzisz do klatki z czyst\u0105 g\u0142ow\u0105.", "Wszystko poza klatk\u0105 zagra\u0142o."])} Szanse +${pm} pkt.` : `${vary6(s, ["To, co dzia\u0142o si\u0119 przed walk\u0105, siedzi ci w g\u0142owie.", "Ostatnie dni da\u0142y w ko\u015B\u0107.", "G\u0142owa jeszcze jest gdzie\u015B w hotelu.", "My\u015Blami jeste\u015B troch\u0119 obok klatki."])} Szanse \u2212${Math.abs(pm)} pkt.`,
          tone: pm > 0 ? "good" : "bad"
        });
      }
      if (o.campMod !== void 0) {
        rep.campMod = o.campMod;
        rep.moments.push({
          round: 0,
          title: "Ob\xF3z",
          text: `${o.campNote ?? "Trzy tygodnie przygotowa\u0144."} ${o.campMod > 0 ? `Lepiej ni\u017C zwykle: szanse +${o.campMod} pkt.` : o.campMod < 0 ? `S\u0142abiej ni\u017C zwykle: szanse \u2212${Math.abs(o.campMod)} pkt.` : "Normalnie, bez niespodzianek."}`,
          tone: o.campMod > 0 ? "good" : o.campMod < 0 ? "bad" : "neutral"
        });
      }
      if (gearMod(s) < 0)
        rep.moments.push({ round: 0, title: "Zu\u017Cyty sprz\u0119t", text: `Sprz\u0119t zu\u017Cyty w ${Math.round(s.gear ?? 0)}%. ${vary6(s, ["R\u0119kawice sparingowe trzyma ju\u017C tylko ta\u015Bma, a ochraniacz pami\u0119ta poprzedni sezon.", "Ochraniacz na z\u0119by pami\u0119ta czasy amatorki. R\u0119kawice pachn\u0105 jak piwnica.", "Nakolanniki z dziur\u0105, tejpy z odzysku. Nowy sprz\u0119t kupisz na Oliksie albo w zapleczu.", "Sprz\u0119t si\u0119 sypie. Trener patrzy na twoje r\u0119kawice i kr\u0119ci g\u0142ow\u0105."])} Szanse ${gearMod(s)} pkt.`, tone: "bad" });
      if (!amateur && !freak && (s.flags.sideTired ?? 0) > 0) {
        s.flags.sideTired = 0;
        rep.tired = true;
      }
      if (!amateur) rep.poster = makePoster(rng, s, rep);
      if (!amateur) {
        rep.prep = o.prep ?? "std";
        if (o.pressNote) {
          rep.pressMod = o.pressMod ?? 0;
          rep.moments.push({ round: 0, title: "Konferencja", text: o.pressNote, tone: (o.pressMod ?? 0) > 0 ? "good" : (o.pressMod ?? 0) < 0 ? "bad" : "neutral" });
        }
        if (rep.prep === "rival") {
          const cost = prepCost(s, o);
          s.money -= cost;
          rep.moments.push({ round: 0, title: "Ob\xF3z pod rywala", text: `${vary6(s, ["Sparingpartnerzy w stylu rywala i godziny nagra\u0144.", "Sparingpartner z jego stylem przez trzy tygodnie i analityk z laptopem.", "Nagrania, sparingi, notatki. Rywal nie ma ju\u017C przed tob\u0105 tajemnic."])} Kosztuje ${cost.toLocaleString("pl-PL")} z\u0142, ale znasz ka\u017Cdy jego nawyk.`, tone: "good" });
        } else if (rep.prep === "hard") {
          rep.moments.push({
            round: 0,
            title: "Ci\u0119\u017Cki ob\xF3z",
            text: vary6(s, [
              "Dwa treningi dziennie przez sze\u015B\u0107 tygodni. Forma jest, ale cia\u0142o jest zm\u0119czone.",
              "Sze\u015B\u0107 tygodni na dwie zmiany. Mi\u0119\u015Bnie pami\u0119taj\u0105 ka\u017Cdy sprint pod g\xF3r\u0119.",
              "Ob\xF3z, po kt\xF3rym nawet sen boli. Za to kondycja jak nigdy.",
              "Trener wyciska\u0142 z ciebie wszystko. Forma jest, kolana si\u0119 skar\u017C\u0105."
            ]),
            tone: "neutral"
          });
        }
        if (rep.tired) rep.moments.push({ round: 0, title: "Weekend poza sal\u0105", text: vary6(s, ["Wydarzenie poza federacj\u0105 zjad\u0142o kilka dni treningu. Czujesz to w nogach.", "Weekend poza sal\u0105 odbija si\u0119 teraz w nogach.", "Przez ten wyjazd zabrak\u0142o kilku trening\xF3w. W drugiej rundzie to wyjdzie."]), tone: "neutral" });
        if (o.abroad)
          rep.moments.push({ round: 0, title: `Gala w mie\u015Bcie ${o.abroad}`, text: "Lot w biznes klasie, hotel z basenem na dachu i hala pe\u0142na ludzi, kt\xF3rzy nigdy o tobie nie s\u0142yszeli. Dzi\u015B maj\u0105 us\u0142ysze\u0107.", tone: "purple" });
        if (o.short)
          rep.moments.push({ round: 0, title: "Zast\u0119pstwo", text: `Sze\u015B\u0107 dni temu ogl\u0105da\u0142e\u015B t\u0119 gal\u0119 z kanapy. Teraz idziesz w karcie g\u0142\xF3wnej. Bez obozu, bez planu pod rywala, na samej formie z sali.`, tone: "neutral" });
        if (o.weigh === "paid") {
          rep.weightMiss = true;
          rep.weighMod = -5;
          const fine = Math.round(rep.purse * 0.25 / 100) * 100;
          rep.purse -= fine;
          s.rep = clamp(s.rep - 2, 0, 100);
          rep.moments.push({ round: 0, title: "Nie zrobi\u0142e\u015B wagi", text: `Waga pokazuje o 1,2 kg za du\u017Co. ${fine.toLocaleString("pl-PL")} z\u0142 z ga\u017Cy idzie do rywala, a ty wchodzisz do klatki wysuszony.`, tone: "bad" });
        } else if (o.weigh === "cut_ok") {
          rep.weighMod = -2;
          s.wear = clamp(s.wear + 2, 0, 100);
          rep.moments.push({ round: 0, title: "Waga w ostatniej chwili", text: "Godzina w saunie i dwie w foliach. O sz\xF3stej rano waga pokazuje limit co do grama. Ga\u017Ca ca\u0142a, ale nogi jak z waty.", tone: "neutral" });
        } else if (o.weigh === "cut_fail") {
          rep.weightMiss = true;
          rep.weighMod = -9;
          const fine = Math.round(rep.purse * 0.3 / 100) * 100;
          rep.purse -= fine;
          s.wear = clamp(s.wear + 3, 0, 100);
          s.rep = clamp(s.rep - 3, 0, 100);
          rep.moments.push({ round: 0, title: "Sauna nie pomog\u0142a", text: `Po trzech godzinach zbijania dalej brakuje 600 gram\xF3w, a ty ledwo stoisz. ${fine.toLocaleString("pl-PL")} z\u0142 kary i walka z pustym bakiem.`, tone: "bad" });
        }
        if (o.tickets && ticketsAvailable(s, o)) {
          const sale = ticketSale(s, o.tickets, rng.next());
          rep.tickets = { ...sale, plan: o.tickets };
          s.money += sale.cut;
          s.totalEarned += sale.cut;
          const tr = s.flags.ticketRep ?? 0;
          s.flags.ticketRep = clamp(tr + (o.tickets === "none" ? -1 : sale.sold >= 100 ? 2 : sale.sold >= 55 ? 1 : 0), -2, 5);
          if (o.tickets === "push") addFans(s, sale.sold * 3);
          s.flags.ticketsSold = (s.flags.ticketsSold ?? 0) + sale.sold;
          rep.moments.push(
            o.tickets === "none" ? { round: 0, title: "Bilety", text: vary6(s, ["Nie sprzedajesz ani jednego biletu. Organizator nic nie m\xF3wi, ale przy nast\u0119pnej gali o tym pami\u0119ta.", "Zero bilet\xF3w. Organizator patrzy na pusty sektor i co\u015B notuje.", "Tw\xF3j sektor \u015Bwieci pustkami. Organizator ju\u017C wie, kogo przesunie w karcie."]), tone: "neutral" } : {
              round: 0,
              title: "Bilety",
              text: `Sprzedajesz ${sale.sold} ${pl(sale.sold, "bilet", "bilety", "bilet\xF3w")}${o.tickets === "push" ? " po tygodniu objazdu po si\u0142owniach" : ""}. Prowizja: ${sale.cut.toLocaleString("pl-PL")} z\u0142. ${sale.sold >= 100 ? "P\xF3\u0142 hali przysz\u0142o dla ciebie, organizator ju\u017C dzwoni z kolejn\u0105 dat\u0105." : sale.sold >= 55 ? "Organizator zadowolony, b\u0119dzie lepsze miejsce w karcie." : "Mog\u0142o by\u0107 lepiej, ale sektor z twoimi lud\u017Ami s\u0142ycha\u0107."}`,
              tone: sale.sold >= 55 ? "good" : "neutral"
            }
          );
        }
        if (o.superfight)
          rep.moments.push({ round: 0, title: "Superfight", text: `Mistrz kontra mistrz. Pi\u0119\u0107 rund w wadze ${o.superfight}. Tw\xF3j pas zostaje w szatni, stawk\u0105 jest drugi i miejsce w historii.`, tone: "purple" });
        if (o.interim)
          rep.moments.push({ round: 0, title: "Pas tymczasowy", text: "Mistrz leczy kontuzj\u0119, wi\u0119c federacja robi walk\u0119 o pas tymczasowy. Pi\u0119\u0107 rund jak w walce o tytu\u0142.", tone: "purple" });
        if (o.farewell)
          rep.moments.push({ round: 0, title: "Walka po\u017Cegnalna", text: `Ostatni ob\xF3z, ostatnie wa\u017Cenie, ostatnie wyj\u015Bcie. W mie\u015Bcie ${s.profile.hometown} na bilbordach twoja twarz, a w szatni stary trener, kt\xF3ry pami\u0119ta ci\u0119 jako szesnastolatka.`, tone: "purple" });
        if (o.unify)
          rep.moments.push({ round: 0, title: "Unifikacja", text: "Dwa pasy, jeden mistrz. Ty z tymczasowym, on z prawdziwym. Po tej walce zostanie jeden.", tone: "purple" });
      }
      if (!amateur && !freak) rep.sim.pro = true;
      if (!amateur && !freak && (title || o.rival || o.superfight)) {
        rep.sim.big = true;
        rep.moments.push({
          round: 0,
          title: title ? vary6(s, ["Wiecz\xF3r, na kt\xF3ry pracowa\u0142e\u015B", "Pas le\u017Cy na stoliku", "Najwa\u017Cniejsze 25 minut roku", "Tu si\u0119 pisze histori\u0119"]) : vary6(s, ["To nie jest zwyk\u0142a walka", "Osobiste porachunki", "Ca\u0142a hala wie, o co chodzi"]),
          text: `${rounds === 5 ? "Pi\u0119\u0107 rund" : "Trzy rundy"}. W tej walce naro\u017Cnik pyta ci\u0119 o decyzj\u0119 w ka\u017Cdej przerwie. ${title ? vary6(s, ["Ka\u017Cda minuta mo\u017Ce zmieni\u0107 ca\u0142\u0105 karier\u0119.", "Jeden b\u0142\u0105d i zaczynasz od nowa. Jedna dobra decyzja i jeste\u015B mistrzem.", "Komentatorzy ju\u017C m\xF3wi\u0105 o \u201Ewalce roku\u201D. Teraz trzeba j\u0105 wygra\u0107."], 1) : vary6(s, ["Wszyscy wiedz\u0105, \u017Ce tu chodzi o co\u015B wi\u0119cej ni\u017C ranking.", "Ranking nie ma tu nic do rzeczy. Liczy si\u0119, kto wyjdzie z klatki z podniesion\u0105 g\u0142ow\u0105."], 1)}`,
          tone: "purple"
        });
      }
      run.fights.push(rep);
      if (!amateur && !freak && !s.proDebut)
        rep.moments.push({
          round: 0,
          title: "Debiut zawodowy",
          text: `Pierwsza walka za pieni\u0105dze. Rekord zawodowy startuje od zera, amatorskie ${recStr(s.amRecord)} zostaje w szufladzie. Bez kasku, bez ochraniaczy na golenie, rundy po pi\u0119\u0107 minut.`,
          tone: "purple"
        });
      if (freak) {
        const circus = [
          `Konferencja ko\u0144czy si\u0119 bijatyk\u0105. Rywal, ${opp.freak}, rzuca w ciebie krzes\u0142em, a internet ma u\u017Cywanie.`,
          `Na face to face ${opp.lastName} przykleja ci gum\u0119 do brody. Ochrona ledwo was rozdziela.`,
          `${opp.lastName} od tygodnia nagrywa o tobie dissy. Ostatni ma ju\u017C milion wy\u015Bwietle\u0144.`,
          `Wa\u017Cenie w galerii handlowej. ${opp.lastName} przychodzi w stroju dinozaura.`,
          `${opp.lastName} przyprowadza na konferencj\u0119 koz\u0119. Nikt nie wie po co, ale wszyscy nagrywaj\u0105.`,
          `Na face to face ${opp.lastName} czyta wiersz o twojej mamie. Rymy s\u0105 s\u0142abe, wy\u015Bwietlenia ogromne.`,
          `${opp.lastName} twierdzi w wywiadzie, \u017Ce trenowa\u0142 z mnichami w Tybecie. Przez dwa tygodnie, na urlopie.`,
          `Ochrona wyprowadza ekip\u0119 ${opp.lastName} z hotelu za bitw\u0119 na poduszki o trzeciej w nocy.`
        ];
        rep.moments.push({ round: 0, title: "Cyrk przed walk\u0105", text: rng.pick(circus), tone: "neutral" });
      }
      if (grudge)
        rep.moments.push({ round: 0, title: "Z\u0142a krew", text: `${opp.lastName} ca\u0142y tydzie\u0144 obra\u017Ca\u0142 ci\u0119 w internecie. Teraz musi to pokaza\u0107 w klatce.`, tone: "neutral" });
      if (rng.chance(amateur ? 0.04 : 0.03)) {
        if (amateur) {
          rep.moments.push({ round: 0, title: "Walkower", text: `${opp.lastName} nie zrobi\u0142 wagi. Tolerancja jest zerowa, wi\u0119c przechodzisz dalej bez walki.`, tone: "neutral" });
          rep.result = null;
          rep.method = "Walkower";
          rep.sim.finished = true;
          rep.headline = "Walkower, przechodzisz dalej";
          advanceTourney(s, rep, "W");
        } else {
          rep.moments.push({ round: 0, title: "Rywal wypada", text: `${opp.lastName} \u0142apie kontuzj\u0119 na obozie. Organizator p\u0142aci ci po\u0142ow\u0119 ga\u017Cy za gotowo\u015B\u0107, ale walki nie b\u0119dzie.`, tone: "neutral" });
          rep.result = null;
          rep.method = "Walkower";
          rep.sim.finished = true;
          rep.earned = Math.round(rep.purse * 0.5);
          const wm = currentManager(s);
          if (wm && rep.earned > 0) {
            rep.mgrCut = Math.round(rep.earned * wm.cut / 100) * 100;
            rep.earned -= rep.mgrCut;
          }
          s.money += rep.earned;
          s.totalEarned += rep.earned;
          rep.headline = "Rywal wypad\u0142 z gali";
          if (rep.farewell) {
            s.flags.farewellDone = 1;
            rep.moments.push({ round: 0, title: "Po\u017Cegnanie bez walki", text: "Hala i tak wstaje, kiedy wychodzisz na \u015Brodek klatki z mikrofonem. Nie tak to mia\u0142o wygl\u0105da\u0107, ale to tw\xF3j ostatni wiecz\xF3r jako zawodnika.", tone: "neutral" });
          }
          if (run.fights.length >= run.planned) run.done = true;
        }
        return;
      }
      advanceFight(rng, fightCtx(s, opp), rep.sim, rep);
      quickAutoResolve(rng, s, rep);
      if (rep.sim.finished) finalizeFight(rng, s, rep);
    }
  }
}
function quickAutoResolve(rng, s, rep) {
  if (!s.quick || rep.sim.big) return;
  for (let i = 0; i < 12 && rep.sim.pending && !rep.sim.finished; i++) {
    const dp = rep.sim.pending;
    const best = [...dp.options].sort((a, b) => b.chance - a.chance)[0];
    const ctx = fightCtx(s, rep.opp);
    applyDecision(rng, ctx, rep.sim, rep, best.key);
    const m = rep.moments[rep.moments.length - 1];
    if (m?.decision) m.text = m.text.replace(/^Wybierasz:/, "Naro\u017Cnik decyduje:");
    if (!rep.sim.finished) advanceFight(rng, ctx, rep.sim, rep);
  }
}
function decide(s0, key) {
  const s = clone(s0);
  const run = s.run;
  const rep = run?.fights[run.fights.length - 1];
  if (!rep || !rep.sim.pending) return s;
  withRng(s, (rng) => {
    const ctx = fightCtx(s, rep.opp);
    applyDecision(rng, ctx, rep.sim, rep, key);
    if (!rep.sim.finished) advanceFight(rng, ctx, rep.sim, rep);
    if (rep.sim.finished) finalizeFight(rng, s, rep);
  });
  return s;
}
function seasonSkip(s0) {
  let s = s0;
  for (let i = 0; i < 14; i++) {
    const run = s.run;
    if (!run || run.done) break;
    const cur = run.fights[run.fights.length - 1];
    if (cur && cur.sim.pending) break;
    if (run.offer || run.press || run.weigh || run.post || run.invite || run.camp || run.announce || run.week || run.entry) break;
    if (afterPending(s) !== null) s = afterNext(s);
    s = seasonNext(s);
    if (phoneUnread(s).length) break;
    if (s.run?.offer) break;
  }
  return s;
}
function negotiateChance(s) {
  const o = s.run?.offer;
  if (!o) return 0;
  const mg = activeManager(s);
  let c = 28 + (mg?.negotiate ?? 0) + s.media / 4 + repNego(s) + (s.rank !== null && s.rank <= 5 ? 10 : 0) + (o.title ? 10 : 0) + (o.rival ? 8 : 0);
  if (s.tier >= 3 && s.rank === null) c -= 10;
  if (s.contract.kind === "freak") c += 10;
  return Math.round(clamp(c, 10, 85));
}
function declineBlocked(s) {
  const o = s.run?.offer;
  if (!o) return null;
  if (o.farewell) return "Na w\u0142asn\u0105 gal\u0119 po\u017Cegnaln\u0105 si\u0119 nie odmawia.";
  if (o.title) return o.defense ? "Mistrz nie odmawia obrony pasa." : "O pas si\u0119 nie odmawia.";
  return null;
}
function acceptAllOffers(s0, prep = "std", tickets = "std") {
  const s = acceptOffer(s0, prep, tickets);
  if (s.run) {
    s.run.autoAccept = true;
    s.run.autoPrep = prep;
    s.flags.autoTickets = tickets === "none" ? 0 : tickets === "push" ? 2 : 1;
  }
  return s;
}
function pressEligible(o) {
  return !o.tuneup && !o.short && !o.abroad && !!(o.title || o.rival || o.superfight || o.spot === "g\u0142\xF3wna" || o.spot === "wieczoru" || o.opp.freak);
}
var PRESS_QUOTES = [
  "Ten {n} to zawodnik z przypadku. W klatce zobaczy, jak wygl\u0105da prawdziwe MMA.",
  "Szanuj\u0119 ka\u017Cdego rywala. {n} to wyj\u0105tek.",
  "Po tej walce {n} wr\xF3ci do roznoszenia ulotek.",
  "Widzia\u0142em jego walki. Zasn\u0105\u0142em w drugiej rundzie, w klatce b\u0119dzie tak samo, tylko on za\u015Bnie.",
  "M\xF3j trener powiedzia\u0142, \u017Ce {n} ma szcz\u0119k\u0119 ze szk\u0142a. Sprawdz\u0119.",
  "Niech {n} odpocznie przed walk\u0105. Po walce te\u017C b\u0119dzie odpoczywa\u0142. D\u0142ugo.",
  "Pytacie, co wiem o rywalu? \u017Be {n} ma \u0142adne zdj\u0119cia na Instagrymie. I tyle.",
  "Niech {n} lepiej przyniesie r\u0119cznik. Przyda si\u0119, \u017Ceby rzuci\u0107 go na ring.",
  "Nie wiem nawet, jak on si\u0119 nazywa. Za tydzie\u0144 te\u017C nikt nie b\u0119dzie wiedzia\u0142."
];
var PRESS_OPTIONS = [
  { key: "calm", label: "Spokojnie i z klas\u0105", desc: "Szacunek, zero emocji. Kibice ceni\u0105." },
  { key: "provoke", label: "Odbijasz pi\u0142eczk\u0119", desc: "Ostra riposta. Mo\u017Ce wyprowadzi\u0107 go z r\xF3wnowagi albo ciebie." },
  { key: "insult", label: "Jedziesz po bandzie", desc: "Zasi\u0119gi gwarantowane. Federacja mo\u017Ce ukara\u0107, a nerwy mog\u0105 pu\u015Bci\u0107." }
];
function mediaGain(s, base) {
  return Math.max(1, Math.round(base * clamp(1.25 - s.media / 90, 0.3, 1.25)));
}
function h2hWords(w, l, d = 0) {
  const part = (n, a, b, c) => `${n} ${pl(n, a, b, c)}`;
  const bits = [w ? part(w, "wygran\u0105", "wygrane", "wygranych") : "", l ? part(l, "pora\u017Ck\u0119", "pora\u017Cki", "pora\u017Cek") : "", d ? part(d, "remis", "remisy", "remis\xF3w") : ""].filter(Boolean);
  return bits.length ? `masz z nim ${bits.join(bits.length === 2 ? " i " : ", ")}` : "jeszcze si\u0119 nie bili\u015Bcie";
}
function pressContext(s, o, rng) {
  const n = o.opp.lastName;
  const me = s.profile.lastName;
  const pick = (arr) => rng ? rng.pick(arr) : arr[(s.season + s.history.length) % arr.length];
  const peer = o.opp.peer ? s.peers.find((p) => p.id === o.opp.id) : void 0;
  const L = (calm, provoke, insult) => ({ calm, provoke, insult });
  if (o.opp.freak)
    return pick([
      { id: "freak", question: `Dziennikarz: \u201ESportowiec kontra ${o.opp.freak}. Nie wstyd ci?\u201D`, labels: L(["\u201ETo te\u017C praca\u201D", "Spokojnie, bez wchodzenia w cyrk. Kibice MMA to doceni\u0105."], ["Grasz w ich gr\u0119", "Riposta pod klipy. Zasi\u0119gi pewne, nerwy te\u017C."], ["Robisz show", "Przewracasz st\xF3\u0142 i rzucasz butelk\u0105. Dok\u0142adnie tego chc\u0105 organizatorzy."]), provoke: 0.7, insult: 0.65 },
      { id: "freak", question: `${n}: \u201EMam wi\u0119cej obserwuj\u0105cych ni\u017C ty kibic\xF3w na wszystkich galach razem. Kto tu jest gwiazd\u0105?\u201D`, labels: L(["\u201EZobaczymy w klatce\u201D", "Ignorujesz zasi\u0119gi, m\xF3wisz o walce."], ["\u201EPolicz je po walce\u201D", "Szybka riposta pod nagranie."], ["Wylewasz mu wod\u0119 na g\u0142ow\u0119", "Klip roku albo kara od organizatora."]), provoke: 0.68, insult: 0.62 }
    ]);
  if (peer && peer.metCount > 0)
    return pick([
      { id: "rematch", question: `Dziennikarz: \u201EZnacie si\u0119 z klatki: ${h2hWords(peer.h2h.w, peer.h2h.l, peer.h2h.d)}. ${n} m\xF3wi, \u017Ce tym razem nie b\u0119dzie przypadku. Co ty na to?\u201D`, labels: L(["\u201EZnamy si\u0119 na pami\u0119\u0107\u201D", "Szacunek dla historii. Kibice ceni\u0105 klas\u0119."], ["Przypominasz wynik", "Wyci\u0105gasz mu wasze poprzednie starcie. Trafi albo go nakr\u0119ci."], ["Robisz z tego wojn\u0119", "Osobiste wycieczki. Hala b\u0119dzie pe\u0142na, a ochrona w gotowo\u015Bci."]), provoke: peer.h2h.w > peer.h2h.l ? 0.7 : 0.45, insult: 0.4 },
      { id: "rematch", question: `${n}: \u201EZnam ${me} od dzieciaka. Wiem, kiedy si\u0119 boi. Teraz si\u0119 boi.\u201D`, labels: L(["\u201EDoro\u015Bli\u015Bmy obaj\u201D", "Bez wspominek, z szacunkiem."], ["Przypominasz mu dawne czasy", "Historia z szatni, kt\xF3ra go zaboli."], ["Wyci\u0105gasz brudy", "Prywatne sprawy na konferencji. Internet zap\u0142onie, federacja te\u017C."]), provoke: 0.55, insult: 0.38 }
    ]);
  if (s.streak <= -2)
    return pick([
      { id: "losing", question: `Dziennikarz: \u201E${Math.abs(s.streak)} ${pl(Math.abs(s.streak), "pora\u017Cka", "pora\u017Cki", "pora\u017Cek")} z rz\u0119du. Ludzie m\xF3wi\u0105, \u017Ce to ju\u017C koniec. Po co jeszcze walczysz?\u201D`, labels: L(["Bierzesz to na siebie", "\u201EZawali\u0142em, wracam silniejszy.\u201D Kibice lubi\u0105 szczero\u015B\u0107."], ["Odgryzasz si\u0119", "Ostro do dziennikarza. Po serii pora\u017Cek \u0142atwo wyj\u015B\u0107 na sfrustrowanego."], ["Atakujesz rywala", "G\u0142o\u015Bno i agresywnie. Jak przegrasz, internet ci\u0119 zje."]), provoke: 0.4, insult: 0.25 },
      { id: "losing", question: `${n}: \u201EPrzyszed\u0142em po \u0142atwe zwyci\u0119stwo. Po ostatnich walkach ${me} sam to wie.\u201D`, labels: L(["\u201EOceniaj mnie w sobot\u0119\u201D", "Bez t\u0142umaczenia si\u0119, kr\xF3tko."], ["\u201E\u0141atwe? Sprawd\u017A m\xF3j rekord\u201D", "Pewno\u015B\u0107 siebie wbrew wynikom. Ryzykowne."], ["Rzucasz si\u0119 do niego", "Ochrona was rozdziela. Albo ci\u0119 to nakr\u0119ci, albo spali."]), provoke: 0.42, insult: 0.28 }
    ]);
  if (s.streak >= 3)
    return pick([
      { id: "streak", question: `Dziennikarz: \u201ESeria ${s.streak} wygranych. ${n} twierdzi, \u017Ce bi\u0142e\u015B si\u0119 z nikim. Czujesz si\u0119 faworytem?\u201D`, labels: L(["\u201EKa\u017Cda walka jest inna\u201D", "Pokora faworyta. Bez fajerwerk\xF3w."], ["\u201EZapytaj moich ostatnich rywali\u201D", "Pewno\u015B\u0107 siebie na fali. Zwykle dzia\u0142a."], ["Wy\u015Bmiewasz go", "Arogancja zwyci\u0119zcy. Jak si\u0119 potkniesz, wr\xF3ci do ciebie."]), provoke: 0.72, insult: 0.5 },
      { id: "streak", question: `${n}: \u201EKa\u017Cda seria si\u0119 kiedy\u015B ko\u0144czy. Twoja ko\u0144czy si\u0119 w sobot\u0119.\u201D`, labels: L(["\u201EMo\u017Ce tak, mo\u017Ce nie\u201D", "Spok\xF3j kogo\u015B, kto wie, ile jest wart."], ["\u201EUstaw si\u0119 w kolejce\u201D", "Lista pokonanych ro\u015Bnie. M\xF3wisz to z u\u015Bmiechem."], ["Wr\u0119czasz mu list\u0119 pokonanych", "Kartka z nazwiskami i jego na ko\u0144cu. Klip pewny, kara mo\u017Cliwa."]), provoke: 0.7, insult: 0.48 }
    ]);
  if (o.title)
    return pick([
      { id: "title", question: `Dziennikarz: \u201E${o.defense ? "Kolejna obrona. Ile jeszcze utrzymasz ten pas?" : "Walka o pas. Co to dla ciebie znaczy?"}\u201D`, labels: L(["M\xF3wisz o drodze", "\u201EOd pierwszej sali do tego miejsca.\u201D Kibice to kupuj\u0105."], ["\u201EPas ju\u017C jest m\xF3j\u201D", "Pewno\u015B\u0107 siebie przed najwi\u0119ksz\u0105 walk\u0105."], ["Jedziesz po rywalu", "Wszystko albo nic. Federacja patrzy, kibice te\u017C."]), provoke: 0.55, insult: 0.35 },
      { id: "title", question: `${n} k\u0142adzie r\u0119k\u0119 na pasie na stole: \u201E${o.defense ? "Po\u017Cyczy\u0142e\u015B go tylko na chwil\u0119." : "Przyzwyczaj si\u0119, \u017Ce to ja go nosz\u0119."}\u201D`, labels: L(["Zabierasz r\u0119k\u0119 z u\u015Bmiechem", "Bez s\u0142owa, z klas\u0105. Kamery to \u0142api\u0105."], ["\u201EZr\xF3b sobie z nim zdj\u0119cie\u201D", "Riposta, po kt\xF3rej sala wybucha \u015Bmiechem."], ["Wyrywasz mu pas", "Przepychanka przy stole. Hit internetu albo kara i nerwy."]), provoke: 0.58, insult: 0.36 }
    ]);
  const style = o.opp.style;
  const opts = [];
  const STYLE_Q = {
    wrestler: `${me}, po\u0142o\u017C\u0119 ci\u0119 na plecy w pierwszej minucie i b\u0119d\u0119 trzyma\u0142 do gongu.`,
    grappler: `Niech ${me} po\u0107wiczy obron\u0119 dusze\u0144. B\u0119dzie mu potrzebna.`,
    boxer: `Jedno trafienie i ${me} zobaczy sufit hali.`,
    kickboxer: `${me}, moje kopni\u0119cia na korpus ko\u0144czy\u0142y ju\u017C lepszych zawodnik\xF3w.`,
    brawler: `Nie b\u0119d\u0119 biega\u0142. Staniemy na \u015Brodku i zobaczymy, kto ma twardsz\u0105 szcz\u0119k\u0119.`,
    allround: `Jestem lepszy wsz\u0119dzie: w st\xF3jce, w parterze i w g\u0142owie.`
  };
  const STYLE_MOCK = {
    wrestler: "\u201ELe\u017Ce\u0107 na kim\u015B to jeszcze nie walka\u201D",
    grappler: "\u201EPrzytulanie zostaw na randki\u201D",
    boxer: "\u201ETo MMA, nie gala boksu w remizie\u201D",
    kickboxer: "\u201EKopnij mnie, to zobaczysz sufit\u201D",
    brawler: "\u201EMachanie cepami to nie technika\u201D",
    allround: "\u201EWszystko troch\u0119, nic porz\u0105dnie\u201D"
  };
  if (style && STYLE_Q[style])
    opts.push({ id: "style", question: `${n}: \u201E${STYLE_Q[style]}\u201D`, labels: L(["\u201EZobaczymy w klatce\u201D", "Nie dajesz si\u0119 wci\u0105gn\u0105\u0107 w gierki."], [STYLE_MOCK[style] ?? "Wy\u015Bmiewasz jego styl", "Trafiasz w jego dum\u0119. Mo\u017Ce zacz\u0105\u0107 walczy\u0107 na z\u0142o\u015B\u0107."], ["Zapraszasz go na \u015Brodek sceny", "Face to face nos w nos. Sekundanci musz\u0105 was rozdziela\u0107."]), provoke: 0.6, insult: 0.42 });
  if (o.opp.country && o.opp.country !== "Polska")
    opts.push({ id: "foreign", question: `${n}: \u201EPrzyjecha\u0142em do Polski zabra\u0107 to zwyci\u0119stwo do domu. ${me} to tylko przystanek.\u201D`, labels: L(["Witasz go w Polsce", "Go\u015Bcinnie, ale stanowczo. Kibice to lubi\u0105."], ["\u201EBilet powrotny kupi\u0142e\u015B?\u201D", "Riposta pod polsk\u0105 publik\u0119."], ["Podgrzewasz kibic\xF3w przeciw niemu", "Hala b\u0119dzie gwizda\u0107 przez ca\u0142\u0105 walk\u0119. Albo go to z\u0142amie, albo nakr\u0119ci."]), provoke: 0.62, insult: 0.45 });
  if (o.opp.age >= 33 && s.age <= 26)
    opts.push({ id: "veteran", question: `${n}: \u201ETen dzieciak nosi\u0142 pieluchy, kiedy ja walczy\u0142em o pierwszy pas.\u201D`, labels: L(["\u201ESzacunek dla do\u015Bwiadczenia\u201D", "Ucze\u0144 m\xF3wi o mistrzu. \u0141adnie wygl\u0105da w telewizji."], ["\u201EDlatego czas na emerytur\u0119\u201D", "Przypominasz mu jego wiek. Boli ka\u017Cdego weterana."], ["Przynosisz mu lask\u0119", "Rekwizyt na konferencj\u0119. \u015Amiech na sali albo kara."]), provoke: 0.62, insult: 0.42 });
  if (o.opp.age <= 23 && s.age >= 30)
    opts.push({ id: "young", question: `${n}: \u201ENajlepsze lata ${me} ju\u017C min\u0119\u0142y. Czas zrobi\u0107 miejsce m\u0142odym.\u201D`, labels: L(["\u201EJeszcze si\u0119 nauczysz\u201D", "Spok\xF3j weterana. Kibice to szanuj\u0105."], ["\u201EUcz si\u0119, dop\xF3ki mo\u017Cesz\u201D", "Lekcja dla m\u0142odego. Mo\u017Ce go wytr\u0105ci\u0107 z rytmu."], ["Robisz z niego dzieciaka", "Poklepujesz go po g\u0142owie przy kamerach. W\u015Bciek\u0142o\u015B\u0107 gwarantowana."]), provoke: 0.62, insult: 0.44 });
  opts.push({ id: "default", question: `${n} na face to face: \u201E${o.pressQuote ?? ""}\u201D`, labels: L(["Spokojnie i z klas\u0105", "Szacunek, zero emocji. Kibice ceni\u0105."], ["Odbijasz pi\u0142eczk\u0119", "Ostra riposta. Mo\u017Ce wyprowadzi\u0107 go z r\xF3wnowagi albo ciebie."], ["Jedziesz po bandzie", "Zasi\u0119gi gwarantowane. Federacja mo\u017Ce ukara\u0107, a nerwy mog\u0105 pu\u015Bci\u0107."]), provoke: 0.6, insult: 0.4 });
  return pick(opts);
}
function pressAnswer(s0, key) {
  const s = clone(s0);
  const o = s.run?.press;
  if (!o) return s0;
  s.run.press = null;
  const ctx = o.pressCtx ?? pressContext(s, o);
  withRng(s, (rng) => {
    if (key === "calm") {
      s.rep = clamp(s.rep + (ctx.id === "losing" || ctx.id === "title" ? 3 : 2), 0, 100);
      o.pressMod = 1;
      o.pressNote = rng.pick(["Spokojnie odpowiadasz, \u017Ce w sobot\u0119 wszystko si\u0119 wyja\u015Bni. Dziennikarze kiwaj\u0105 g\u0142owami.", "M\xF3wisz o szacunku i ci\u0119\u017Ckiej pracy. Nudne, ale profesjonalne."]);
    } else if (key === "provoke") {
      s.media = clamp(s.media + mediaGain(s, 2), 0, 100);
      if (rng.chance(ctx.provoke)) {
        o.pressMod = 3;
        o.pressNote = rng.pick(["Twoja riposta trafia. Rywal czerwienieje i nie wie, co odpowiedzie\u0107. Sala si\u0119 \u015Bmieje.", "Odbijasz pi\u0142eczk\u0119 tak, \u017Ce rywal schodzi ze sceny w\u015Bciek\u0142y. To ty kontrolujesz emocje."]);
      } else {
        o.pressMod = -3;
        o.pressNote = rng.pick(["Rywal ma odpowied\u017A na wszystko. To ciebie wyprowadzi\u0142 z r\xF3wnowagi.", "Wdajesz si\u0119 w przepychank\u0119 s\u0142own\u0105 i przegrywasz j\u0105. Wracasz do hotelu z\u0142y."]);
      }
    } else {
      s.media = clamp(s.media + mediaGain(s, ctx.id === "freak" ? 5 : 3), 0, 100);
      s.rep = clamp(s.rep - (ctx.id === "freak" ? 1 : ctx.id === "losing" ? 6 : 4), 0, 100);
      if (rng.chance(ctx.insult)) {
        o.pressMod = 4;
        o.pressNote = "Klip z konferencji ma milion wy\u015Bwietle\u0144. Rywal przez ca\u0142y tydzie\u0144 my\u015Bli tylko o tobie, a nie o planie na walk\u0119.";
      } else {
        const fine = [0, 1e3, 3e3, 8e3, 2e4][s.tier] ?? 3e3;
        s.money -= fine;
        o.pressMod = -4;
        o.pressNote = `Przesadzasz. Federacja nak\u0142ada ${fine.toLocaleString("pl-PL")} z\u0142 kary, a ty przez tydzie\u0144 nie \u015Bpisz z nerw\xF3w.`;
      }
    }
    startFight(rng, s, o);
  });
  return s;
}
function cutChance(s) {
  const o = s.run?.weigh;
  let c = 62 + DIET[s.diet ?? "norma"].cut + (hasBackroom(s, "doctor") ? 10 : 0) - (s.age >= 32 ? 10 : 0) - (o?.short ? 15 : 0) - (weightShift(s) < -1 ? 10 : 0) - Math.round(s.wear / 10);
  return Math.round(clamp(c, 20, 85));
}
function weighIn(s0, choice) {
  const s = clone(s0);
  const o = s.run?.weigh;
  if (!o) return s0;
  withRng(s, (rng) => {
    o.weigh = choice === "pay" ? "paid" : rng.chance(cutChance(s0) / 100) ? "cut_ok" : "cut_fail";
    s.run.weigh = null;
    startFight(rng, s, o);
  });
  return s;
}
function postAnswer(s0, key) {
  const s = clone(s0);
  const run = s.run;
  const post = run?.post;
  if (!run || !post) return s0;
  const opt = post.options.find((x) => x.key === key);
  if (!opt) return s0;
  run.post = null;
  const rep = run.fights[run.fights.length - 1];
  withRng(s, (rng) => {
    const ok = opt.chance === void 0 || rng.chance(opt.chance / 100);
    const fansBase = [40, 200, 1200, 6e3, 4e4][s.tier] ?? 200;
    let text = "";
    let tone = ok ? "good" : "bad";
    switch (key) {
      case "champ":
        if (ok) {
          s.flags.titleCall = 1;
          if ((s.rank ?? 99) <= 3) s.flags.micTitle = (s.flags.micTitle ?? 0) + 1;
          s.media = clamp(s.media + 4, 0, 100);
          addFans(s, fansBase * 3);
          text = (s.rank ?? 99) <= 3 ? "Patrzysz prosto w kamer\u0119 i wywo\u0142ujesz mistrza po nazwisku. Hala wybucha, a po godzinie mistrz odpisuje: \u201EChcesz? To masz\u201D. Nast\u0119pna walka: o pas." : "Wywo\u0142ujesz mistrza po nazwisku. Federacja lubi ten szum, ale na pas jeszcze za wcze\u015Bnie: dostaniesz eliminator z kim\u015B z samej czo\u0142\xF3wki.";
          tone = "purple";
        } else {
          s.media = clamp(s.media + 2, 0, 100);
          s.rep = clamp(s.rep - 4, 0, 100);
          addFans(s, fansBase);
          text = "Wywo\u0142ujesz mistrza, a on w wywiadzie tylko si\u0119 \u015Bmieje: \u201ENajpierw niech zas\u0142u\u017Cy\u201D. Internet ma u\u017Cywanie, w federacji kr\u0119c\u0105 g\u0142owami.";
        }
        break;
      case "up":
        if (ok) {
          s.flags.callUp = 1;
          s.media = clamp(s.media + 2, 0, 100);
          addFans(s, fansBase * 1.5);
          text = "Wywo\u0142ujesz kogo\u015B z czo\u0142\xF3wki. Federacja kupuje ten pomys\u0142: nast\u0119pny rywal b\u0119dzie wy\u017Cej w rankingu.";
        } else {
          s.media = clamp(s.media + 1, 0, 100);
          addFans(s, fansBase * 0.5);
          text = "Wywo\u0142any zawodnik odpowiada, \u017Ce ma inne plany. Kibice to zapami\u0119tali, federacja niekoniecznie.";
          tone = "neutral";
        }
        break;
      case "rival":
        s.flags.rivalCallout = 1;
        s.media = clamp(s.media + 3, 0, 100);
        addFans(s, fansBase * 2);
        text = "M\xF3wisz do kamery, \u017Ce czas wyr\xF3wna\u0107 rachunki z odwiecznym rywalem. Organizator ju\u017C liczy bilety.";
        tone = "purple";
        break;
      case "super":
        if (ok) {
          s.flags.superCall = 1;
          s.media = clamp(s.media + 5, 0, 100);
          addFans(s, fansBase * 4);
          text = "Z pasem na ramieniu wywo\u0142ujesz mistrza kategorii obok. Federacja zaciera r\u0119ce: superfight jest w planach.";
          tone = "purple";
        } else {
          s.media = clamp(s.media + 2, 0, 100);
          addFans(s, fansBase);
          text = "Wywo\u0142ujesz mistrza kategorii obok, ale jego ob\xF3z m\xF3wi, \u017Ce \u201Enie walczy w d\xF3\u0142 ani w g\xF3r\u0119\u201D. Mo\u017Ce kiedy\u015B.";
          tone = "neutral";
        }
        break;
      case "thanks":
        s.rep = clamp(s.rep + 2, 0, 100);
        addFans(s, fansBase * 0.6);
        text = vary6(s, [
          "Dzi\u0119kujesz trenerowi, rodzinie i kibicom, kt\xF3rzy przyjechali za tob\u0105. Kr\xF3tko i z klas\u0105.",
          "Pozdrawiasz mam\u0119 przed kamer\u0105 i oddajesz mikrofon. Hala bije brawo.",
          "Dzi\u0119kujesz rywalowi za walk\u0119 i podnosisz mu r\u0119k\u0119. Takie rzeczy ludzie zapami\u0119tuj\u0105.",
          "M\xF3wisz trzy zdania, z czego dwa do trenera. Kr\xF3tko, po ludzku.",
          `Pozdrawiasz swoje miasto, ${s.profile.hometown}, i ekip\u0119 z sektora. Sektor od\u015Bpiewuje ci \u201Esto lat\u201D.`
        ]);
        tone = "good";
        break;
      case "rematch":
        if (ok) {
          s.rematchOpp = { ...rep.opp, stats: { ...rep.opp.stats }, record: { ...rep.opp.record }, rank: rep.defense && rep.result === "L" ? 0 : rep.opp.rank };
          s.media = clamp(s.media + 2, 0, 100);
          addFans(s, fansBase);
          text = "Federacja ogl\u0105da walk\u0119 jeszcze raz i przyznaje: nale\u017Cy si\u0119 rewan\u017C. Wraca przy najbli\u017Cszej okazji.";
          tone = "purple";
        } else {
          s.rep = clamp(s.rep - 1, 0, 100);
          text = "Federacja odpowiada kr\xF3tko: werdykt jest werdyktem, a ona ma inne plany na tego rywala.";
          tone = "neutral";
        }
        break;
      case "class":
        s.rep = clamp(s.rep + 3, 0, 100);
        text = "M\xF3wisz, \u017Ce wr\xF3cisz silniejszy, i gratulujesz rywalowi. \u015Arodowisko to docenia.";
        tone = "good";
        break;
      case "rant":
        s.media = clamp(s.media + 3, 0, 100);
        s.rep = clamp(s.rep - 3, 0, 100);
        addFans(s, fansBase * 3);
        text = "Nagrywasz w\u015Bciek\u0142y film o \u201Eskorumpowanych s\u0119dziach\u201D. Milion wy\u015Bwietle\u0144, ale w federacji nikt si\u0119 nie u\u015Bmiecha.";
        tone = "neutral";
        break;
    }
    if (rep && text) rep.moments.push({ round: rep.round, title: post.kind === "mic" ? "Mikrofon" : "Po werdykcie", text, tone });
    if (rep) rep.postChoice = { key, ok };
  });
  return s;
}
function vary6(s, arr, salt = 0) {
  return arr[(s.history.length * 7 + s.season * 3 + salt) % arr.length];
}
function fanNickFor(rng, s) {
  const proWins = s.history.filter((h) => !h.amateur && !h.freak && h.result === "W");
  const ko = proWins.filter((h) => h.method === "KO/TKO").length;
  const sub = proWins.filter((h) => h.method === "Poddanie").length;
  const dec = proWins.filter((h) => h.method.startsWith("Decyzja")).length;
  if ((s.flags.shortWins ?? 0) >= 2) return "Stra\u017Cak";
  if (ko >= 3 && ko >= sub) return rng.pick(["M\u0142ot", "Kowad\u0142o", "Dynamit", "Kafar"]);
  if (sub >= 3) return rng.pick(["Anakonda", "Pyton", "Imad\u0142o", "Dusiciel"]);
  if (s.flags.offTheCanvas && s.flags.comeback) return "Feniks";
  if (dec >= 6 && ko + sub <= 1) return rng.pick(["Profesor", "Szachista", "Ksi\u0119gowy"]);
  if ((s.flags.grapplingGold ?? 0) >= 2) return "Kimono";
  return null;
}
function buildPost(rng, s, rep) {
  if (rep.amateur || rep.freak || rep.tuneup || rep.abroad || s.tier < 1 || s.contract.kind === "freak") return null;
  if (s.quick && !rep.sim.big) return null;
  const finish = rep.method === "KO/TKO" || rep.method === "Poddanie" || rep.method === "Lekarz";
  if (rep.result === "W") {
    if ((s.flags[`mic:${s.season}`] ?? 0) >= 2) return null;
    const p = finish ? 0.85 : rep.spot === "wst\u0119pna" ? 0.25 : 0.5;
    if (!rep.title && !rep.superfight && !rng.chance(p)) return null;
    s.flags[`mic:${s.season}`] = (s.flags[`mic:${s.season}`] ?? 0) + 1;
    const opts = [];
    const rk = s.rank;
    if (rk === 0 && s.tier >= 3 && s.titleDefenses >= 1 && (s.flags.superDone ?? 0) < 2 && !rep.superfight)
      opts.push({ key: "super", label: "Wywo\u0142aj mistrza kategorii obok", desc: "Superfight o drugi pas. Wielkie pieni\u0105dze, je\u015Bli federacja to kupi.", chance: Math.round(clamp(30 + s.media / 3 + (finish ? 10 : 0), 15, 80)) });
    if (rk !== null && rk !== 0 && rk <= 6 && !(s.flags.interim ?? 0))
      opts.push({ key: "champ", label: "Wywo\u0142aj mistrza", desc: "Uda si\u0119: nast\u0119pna walka o pas. Nie uda: wyjdziesz na pysza\u0142ka.", chance: Math.round(clamp(12 + s.media / 3 + (finish ? 12 : 0) + (rk <= 2 ? 20 : rk <= 4 ? 10 : 0), 8, 80)) });
    if (rk !== 0)
      opts.push({ key: "up", label: rk === null ? "Wywo\u0142aj kogo\u015B z rankingu" : "Wywo\u0142aj kogo\u015B z czo\u0142\xF3wki", desc: "Mocniejszy rywal w nast\u0119pnej walce i wi\u0119kszy skok w rankingu po wygranej.", chance: Math.round(clamp(42 + s.media / 4 + (finish ? 10 : 0), 20, 88)) });
    const rival = s.rivalId ? s.peers.find((x) => x.id === s.rivalId && !x.retired && x.tier === s.tier) : void 0;
    if (rival && rival.id !== rep.opp.id && rk !== 0) opts.push({ key: "rival", label: `Wywo\u0142aj rywala: ${rival.lastName}`, desc: "Pewna walka z odwiecznym rywalem przy najbli\u017Cszej okazji." });
    opts.push(
      vary6(s, [
        { key: "thanks", label: "Podzi\u0119kuj i zejd\u017A z klatki", desc: "Bez show. Troch\u0119 szacunku w \u015Brodowisku." },
        { key: "thanks", label: "Pozdr\xF3w mam\u0119 i oddaj mikrofon", desc: "Najkr\xF3tsze przem\xF3wienie gali. \u015Arodowisko lubi skromnych." },
        { key: "thanks", label: "Podzi\u0119kuj rywalowi", desc: "Klasa zamiast show. Reputacja w g\xF3r\u0119." },
        { key: "thanks", label: "Pozdr\xF3w ekip\u0119 z sektora", desc: "Swoich si\u0119 nie zapomina. Szacunek w \u015Brodowisku." }
      ], 1)
    );
    for (const o of opts)
      if (o.key === "up") o.desc = vary6(s, ["Mocniejszy rywal w nast\u0119pnej walce i wi\u0119kszy skok w rankingu po wygranej.", "Jak federacja to kupi, nast\u0119pny rywal b\u0119dzie z wy\u017Cszej p\xF3\u0142ki.", "Wy\u017Cej mierzysz, wy\u017Cej skaczesz w rankingu. Albo g\u0142o\u015Bniej spadasz."], 2);
      else if (o.key === "champ") o.desc = vary6(s, ["Uda si\u0119: nast\u0119pna walka o pas. Nie uda: wyjdziesz na pysza\u0142ka.", "Pas albo kompromitacja na oczach ca\u0142ej Polski.", "Mistrz siedzi w pierwszym rz\u0119dzie. Patrzy na ciebie."], 3);
    const lead = finish ? vary6(s, [`${rep.opp.lastName} jeszcze dochodzi do siebie, a ty dostajesz mikrofon.`, "Lekarz \u015Bwieci rywalowi latark\u0105 w oczy, a komentator ju\u017C podaje ci mikrofon.", "Hala jeszcze krzyczy po ko\u0144c\xF3wce. Kto\u015B wciska ci mikrofon do r\u0119ki."], 4) : vary6(s, ["R\u0119ka w g\xF3rze. Komentator podaje ci mikrofon.", "S\u0119dzia podnosi ci r\u0119k\u0119, a prowadz\u0105cy ju\u017C stoi obok z mikrofonem.", "Werdykt og\u0142oszony. Mikrofon l\u0105duje w twojej r\u0119kawicy."], 4);
    const tail = vary6(s, ["Ca\u0142a hala i transmisja czekaj\u0105, co powiesz.", "Kamera robi zbli\u017Cenie.", "Sektor twojej ekipy ju\u017C skanduje.", "Masz trzydzie\u015Bci sekund, zanim puszcz\u0105 reklamy."], 5);
    return { kind: "mic", title: "Mikrofon jest tw\xF3j", text: `${lead} ${tail}`, options: opts.slice(0, 4) };
  }
  if (rep.result === "L" && !rep.superfight && (rep.method === "Decyzja niejednog\u0142o\u015Bna" || rep.method === "Decyzja wi\u0119kszo\u015Bciowa")) {
    const chance = Math.round(clamp(35 + s.media / 3 + (rep.title ? 15 : 0) + (rep.opp.peer ? 10 : 0), 15, 85));
    return {
      kind: "robbed",
      title: "Kontrowersyjny werdykt",
      text: "Hala gwi\u017Cd\u017Ce, w internecie wrze. Wielu uwa\u017Ca, \u017Ce to ty wygra\u0142e\u015B. Co robisz?",
      options: [
        { key: "rematch", label: "Domagaj si\u0119 rewan\u017Cu", desc: "Federacja mo\u017Ce da\u0107 ci t\u0119 sam\u0105 walk\u0119 jeszcze raz.", chance },
        { key: "class", label: "Przyjmij werdykt z klas\u0105", desc: "Reputacja w g\xF3r\u0119. Idziesz dalej." },
        { key: "rant", label: "Nagraj w\u015Bciek\u0142y film", desc: "Du\u017Co obserwuj\u0105cych, ale federacja si\u0119 obrazi." }
      ]
    };
  }
  return null;
}
function prepCost(s, o) {
  const cap = [1e3, 2500, 8e3, 18e3, 4e4][s.tier] ?? 8e3;
  return Math.round(clamp(o.purse * 0.15, 800, cap) / 100) * 100;
}
function upcomingOffer(s) {
  const r = s.run;
  if (!r) return null;
  return r.announce ?? r.camp?.o ?? r.week?.o ?? r.press ?? r.weigh ?? null;
}
function setTickets(s0, plan) {
  const o0 = upcomingOffer(s0);
  if (!o0 || !ticketsAvailable(s0, o0) || o0.tickets === plan) return s0;
  const s = clone(s0);
  upcomingOffer(s).tickets = plan;
  return s;
}
function acceptOffer(s0, prep = "std", tickets = "std") {
  const s = clone(s0);
  const o = s.run?.offer;
  if (!o) return s0;
  o.prep = o.short ? "std" : prep === "rival" && s.money < prepCost(s, o) ? "std" : prep;
  if (ticketsAvailable(s, o)) o.tickets = tickets;
  if (o.short || o.abroad) s.run.planned += 1;
  s.run.offer = null;
  const bigPress = !!(o.title || o.rival || o.superfight || o.opp.freak || o.nemesis || o.farewell);
  const lastHadPress = s.run.fights[s.run.fights.length - 1]?.pressMod !== void 0;
  const pressWanted = pressEligible(o) && !s.run.autoAccept && (bigPress || !lastHadPress && (s.run.fights.length + s.season) % 2 === 0);
  if (pressWanted)
    withRng(s, (rng) => {
      o.pressQuote = rng.pick(PRESS_QUOTES).replace("{n}", s.profile.lastName);
      o.pressCtx = pressContext(s, o, rng);
    });
  if (pathOn(s, o)) {
    o.wantPress = pressWanted;
    withRng(s, (rng) => o.hype = buildHype(rng, s, o));
    s.run.announce = o;
    return s;
  }
  if (pressWanted) {
    s.run.press = o;
    return s;
  }
  withRng(s, (rng) => startFight(rng, s, o));
  return s;
}
function pathOn(s, o) {
  return !o.short && !s.quick && !s.run?.autoAccept && !isAmateurRun(s);
}
function buildHype(rng, s, o) {
  const me = s.profile.lastName;
  const op = `${o.opp.firstName} ${o.opp.lastName}`;
  const gala = o.gala.split(" \xB7 ")[0] || "gala";
  const headlines = [
    o.title ? `OFICJALNIE: ${me} vs ${o.opp.lastName} o pas na ${gala}!` : o.superfight ? `Superfight potwierdzony! ${me} i ${o.opp.lastName} na ${gala}` : `${gala}: ${me} kontra ${op}`,
    rng.pick([
      `Bukmacherzy: ${o.opp.lastName} lekkim faworytem. \u201E${me} ma za sob\u0105 s\u0142abszych rywali\u201D`,
      `Eksperci podzieleni. Kto wygra starcie ${me} \u2013 ${o.opp.lastName}?`,
      `${o.opp.lastName}: \u201EPrzygotowuj\u0119 si\u0119 jak na walk\u0119 \u017Cycia\u201D`,
      `Bilety na ${gala} schodz\u0105 w zawrotnym tempie`
    ])
  ];
  const post = o.rival || o.nemesis ? rng.pick([`Znowu ty? My\u015Bla\u0142em, \u017Ce po ostatnim razie zmienisz sport. Do zobaczenia, ${me}. \u{1F608}`, `Rok czeka\u0142em na ten rewan\u017C. Tym razem nie b\u0119dzie s\u0119dzi\xF3w. \u{1F52A}`]) : o.opp.freak ? rng.pick([`Ten \u201Esportowiec\u201D ${me} to papier. Zrobi\u0119 z niego mema na \u017Cywo \u{1F921}`, `${me} tak si\u0119 boi, \u017Ce ju\u017C szuka wym\xF3wek. Ch\u0142opaki, kupujcie PPV \u{1F4B8}`]) : o.title ? rng.pick([`Pas zostaje u mnie. ${me}, szanuj\u0119, ale przyjdziesz po nauczk\u0119. \u{1F3C6}`, `D\u0142ugo czeka\u0142e\u015B na t\u0119 szans\u0119. Szkoda, \u017Ce sko\u0144czy si\u0119 w pierwszej rundzie.`]) : rng.pick([
    `Kolejny rywal z listy. ${me}, nic osobistego. \u{1F94A}`,
    `Widzia\u0142em twoje walki, ${me}. St\xF3jka do poprawy. Poka\u017C\u0119 ci, gdzie.`,
    `${me}? Szacunek. Ale w sobot\u0119 szacunek si\u0119 ko\u0144czy. \u{1F4AA}`,
    `Ob\xF3z idzie \u015Bwietnie. ${me}, mam nadziej\u0119, \u017Ce ty te\u017C trenujesz. \u{1F609}`
  ]);
  const dm = (o.opp.freak || o.rival || o.nemesis) && rng.chance(0.5) ? rng.pick(["\u0141adne masz auto. Szkoda by by\u0142o.", "Wiem, gdzie trenujesz. Do soboty.", "Przegraj w drugiej, b\u0119dzie zdrowiej dla wszystkich."]) : void 0;
  return { headlines, post, dm };
}
function announceAnswer(s0, key) {
  const o0 = s0.run?.announce;
  if (!o0) return s0;
  const s = clone(s0);
  const o = s.run.announce;
  s.run.announce = null;
  o.announceChoice = key;
  withRng(s, (rng) => {
    if (key === "respect") s.rep = clamp(s.rep + 1, 0, 100);
    else if (key === "ignore") s.flags.nextFightMod = (s.flags.nextFightMod ?? 0) + 1;
    else if (key === "trash") {
      s.media = clamp(s.media + mediaGain(s, 2), 0, 100);
      s.rep = clamp(s.rep - 1, 0, 100);
      addFans(s, followersOf(s) * 0.03 + 30);
      if (!o.wantPress && pressEligible(o)) {
        o.wantPress = true;
        o.pressQuote = rng.pick(PRESS_QUOTES).replace("{n}", s.profile.lastName);
        o.pressCtx = pressContext(s, o, rng);
      }
    }
    startFight(rng, s, o);
  });
  return s;
}
function afterNext(s0) {
  const idx = afterPending(s0);
  if (idx === null) return s0;
  const s = clone(s0);
  s.run.afterDone = idx;
  return s;
}
function afterPending(s) {
  const run = s.run;
  if (!run || s.quick || run.autoAccept) return null;
  const cur = run.fights[run.fights.length - 1];
  if (!cur || cur.amateur || !cur.sim.finished || cur.sim.pending || run.post) return null;
  return (run.afterDone ?? -1) < cur.idx ? cur.idx : null;
}
function offerGone(rng, s, lostP, text) {
  const run = s.run;
  run.notes = run.notes ?? [];
  if (rng.chance(lostP)) {
    run.planned -= 1;
    run.notes.push(`${text} Innej oferty nie ma, w tym roku jedna walka mniej.`);
    run.offer = null;
    if (run.fights.length >= run.planned) run.done = true;
    else run.offer = buildOffer(rng, s, run.fights.length);
  } else {
    run.notes.push(`${text} Po kilku dniach przychodzi inna propozycja.`);
    run.offer = buildOffer(rng, s, run.fights.length);
  }
}
function negotiateOffer(s0) {
  const s = clone(s0);
  const o = s.run?.offer;
  if (!o || o.negotiated) return s0;
  withRng(s, (rng) => {
    const ok = rng.chance(negotiateChance(s0) / 100);
    if (ok) {
      o.purse = Math.round(o.purse * 1.25 / 100) * 100;
      o.winBonus = Math.round(o.winBonus * 1.2 / 100) * 100;
      o.negotiated = true;
      o.note = `Organizator podnosi ga\u017C\u0119 do ${o.purse.toLocaleString("pl-PL")} z\u0142.`;
    } else if (!o.title && rng.chance(0.35)) {
      offerGone(rng, s, 0, `Organizator nie podni\xF3s\u0142 stawki i odda\u0142 t\u0119 walk\u0119 komu\u015B innemu (rywal: ${o.opp.firstName} ${o.opp.lastName}).`);
    } else {
      o.negotiated = true;
      o.note = "Organizator nie da ani z\u0142ot\xF3wki wi\u0119cej. Bierzesz albo nie.";
    }
  });
  return s;
}
function declineOffer(s0) {
  if (declineBlocked(s0) || !s0.run?.offer) return s0;
  const o0 = s0.run.offer;
  if (o0.tuneup || o0.short || o0.superfight || o0.abroad) {
    const s2 = clone(s0);
    withRng(s2, (rng) => {
      s2.run.notes = s2.run.notes ?? [];
      s2.run.notes.push(
        o0.abroad ? `Odmawiasz wyjazdu do miasta ${o0.abroad}. Zostajesz przy swojej federacji.` : o0.short ? `Odmawiasz zast\u0119pstwa (${o0.opp.firstName} ${o0.opp.lastName}). Bez obozu to loteria, czekasz na swoj\u0105 walk\u0119.` : o0.superfight ? `Odmawiasz superfightu. Skupiasz si\u0119 na obronie pasa w swojej kategorii.` : `Odmawiasz walki na ${o0.gala.split(" \xB7 ")[0]}. Federacja ma dla ciebie normalnego rywala.`
      );
      s2.run.offer = buildOffer(rng, s2, s2.run.fights.length);
    });
    return s2;
  }
  const s = clone(s0);
  const run = s.run;
  const o = run.offer;
  run.declines = (run.declines ?? 0) + 1;
  if (run.declines >= 2) s.rep = clamp(s.rep - 2, 0, 100);
  withRng(s, (rng) => offerGone(rng, s, 0.2 + 0.15 * (run.declines - 1), `Odrzucasz ofert\u0119 (rywal: ${o.opp.firstName} ${o.opp.lastName}).`));
  return s;
}
function fightRange(s) {
  if (s.tier === 0 || s.contract.kind === "freak") return null;
  if (s.flags.farewell) return [1, 1];
  const f = s.contract.fights;
  return [Math.max(1, f - 1), Math.min(5, f + 1)];
}
function plannedFights(s) {
  if (s.flags.farewell && s.tier > 0 && s.contract.kind !== "freak") return 1;
  const r = fightRange(s);
  if (!r) return s.contract.kind === "freak" ? 2 : s.contract.fights;
  return clamp(s.flags.wantFights || s.contract.fights, r[0], r[1]);
}
function setWantFights(s0, n) {
  const s = clone(s0);
  s.flags.wantFights = n;
  return s;
}
function setManager(s0, id) {
  const m = managerById(id);
  if (m && managerBlocked(s0, m)) return s0;
  const s = clone(s0);
  const prev = currentManager(s0);
  s.manager = id;
  if (!id) s.flags.manager = 0;
  if (m && prev?.id !== m.id) log(s, `Nowy mened\u017Cer: ${m.name}.`);
  if (!m && prev) log(s, `Rozstajesz si\u0119 z mened\u017Cerem (${prev.name}).`);
  return s;
}
var PLACE_TEXT = {
  1: "z\u0142oto",
  2: "srebro",
  3: "br\u0105z",
  4: "czwarte miejsce",
  5: "odpad\u0142e\u015B w \u0107wier\u0107finale"
};
function tourneyResultText(t, short = false) {
  if (t.place === null) return t.stage ? `w grze: ${STAGE_LABELS[t.stage].toLowerCase()}` : "jeszcze przed tob\u0105";
  if (short && t.place === 5) return "\u0107wier\u0107fina\u0142";
  if (short && t.place === 4) return "4. miejsce";
  return PLACE_TEXT[t.place];
}
function advanceTourney(s, rep, res) {
  const run = s.run;
  const t = run.tourneys[run.tIdx ?? 0];
  const won = res === "W";
  const stage = t.stage;
  if (stage === "qf") {
    if (won) t.stage = "sf";
    else {
      t.stage = null;
      t.place = 5;
    }
  } else if (stage === "sf") t.stage = won ? "f" : "b";
  else if (stage === "f") {
    t.stage = null;
    t.place = won ? 1 : 2;
    t.medal = won ? "gold" : "silver";
  } else if (stage === "b") {
    t.stage = null;
    t.place = won ? 3 : 4;
    t.medal = won ? "bronze" : null;
  }
  if (t.stage === null) {
    if (t.medal) s.medals[t.medal]++;
    if (!t.championship && amLevel(s) === 0 && (t.medal === "gold" || t.medal === "silver")) s.flags.amPromote = 1;
    if (t.medal === "gold" && t.championship) {
      s.belts.push({ name: BELT_NAMES[0], season: s.season, age: s.age });
      log(s, `\u{1F947} Mistrz Polski amator\xF3w (${t.city}).`);
      rep.moments.push({ round: rep.round, title: "Mistrz Polski amator\xF3w!", text: `Z\u0142oty medal Amatorskich Mistrzostw Polski. Wieszaj\u0105 ci go na szyi, a trener udaje, \u017Ce co\u015B wpad\u0142o mu do oka.`, tone: "purple" });
    } else if (t.medal) {
      const m = t.medal === "gold" ? "Z\u0142oto" : t.medal === "silver" ? "Srebro" : "Br\u0105z";
      log(s, `${t.medal === "gold" ? "\u{1F947}" : t.medal === "silver" ? "\u{1F948}" : "\u{1F949}"} ${m}: ${t.name} (${t.city}).`);
      rep.moments.push({ round: rep.round, title: `${m}: ${t.name}`, text: t.medal === "gold" ? "Cztery godziny czekania na hali i trzy walki. Medal jest tw\xF3j." : t.medal === "silver" ? "Fina\u0142 przegrany, ale srebro to srebro. Za rok wracasz po wi\u0119cej." : "Br\u0105z wywalczony w walce o trzecie miejsce. Na podium stoisz z u\u015Bmiechem.", tone: "good" });
    }
    run.tIdx = (run.tIdx ?? 0) + 1;
  }
  if ((run.tIdx ?? 0) >= run.tourneys.length) run.done = true;
  run.planned = plannedAmateur(run);
}
function updateRank(s, rep) {
  const size = RANK_SIZE[s.tier];
  const res = rep.result;
  const opp = rep.opp;
  const mine = s.rank;
  if (rep.freak || rep.amateur) return;
  if (rep.abroad) return;
  if (rep.superfight) {
    if (res === "W") {
      s.flags.superDone = (s.flags.superDone ?? 0) + 1;
      s.flags.doubleChamp = 1;
      s.flags.doubleActive = s.season;
      const name = `${BELT_NAMES[s.tier]} wagi ${rep.superfight} (superfight)`;
      s.belts.push({ name, season: s.season, age: s.age });
      log(s, `\u{1F451} Podw\xF3jny mistrz! Superfight wygrany. Rywal: ${opp.firstName} ${opp.lastName} (waga ${rep.superfight}).`);
    } else if (res === "D") {
      s.flags.superDone = (s.flags.superDone ?? 0) + 1;
      log(s, `Remis w superfighcie z ${opp.firstName} ${opp.lastName}.`);
    } else {
      s.flags.superDone = (s.flags.superDone ?? 0) + 1;
      s.flags.superLoss = 1;
      s.rep = clamp(s.rep - 6, 0, 100);
      s.media = clamp(s.media - 2, 0, 100);
      log(s, `Przegrany superfight z ${opp.firstName} ${opp.lastName}. Pas zostaje, ale pozycja mistrza si\u0119 chwieje.`);
    }
    return;
  }
  if ((rep.interim || rep.title && !rep.defense) && rep.weightMiss && res === "W") {
    s.rank = 1;
    if (!rep.interim) s.flags.interim = 0;
    rep.moments.push({ round: rep.round, title: "Pas nie dla ciebie", text: "Wygrywasz, ale nie zrobi\u0142e\u015B wagi, wi\u0119c pas nie mo\u017Ce trafi\u0107 do ciebie. Federacja zostawia go nieobsadzonego, a ty jeste\u015B pierwszy w kolejce.", tone: "bad" });
    log(s, "Wygrana bez pasa: nie zrobi\u0142e\u015B wagi przed walk\u0105 o tytu\u0142.");
    return;
  }
  if (rep.interim) {
    if (res === "W") {
      s.flags.interim = 1;
      s.flags.interimSeason = s.season;
      s.flags.interimBelts = (s.flags.interimBelts ?? 0) + 1;
      s.rank = 1;
      log(s, `Pas tymczasowy (${galaPrefix(rep.fed)}). Pokonany: ${opp.firstName} ${opp.lastName}.`);
    } else s.rank = Math.max(res === "D" ? 2 : 3, rep.rankBefore ?? 0);
    return;
  }
  if (rep.title && !rep.defense) {
    s.flags.interim = 0;
    if (res === "W") {
      s.rank = 0;
      s.titleDefenses = 0;
      const name = `${BELT_NAMES[s.tier]} (${galaPrefix(rep.fed)})`;
      s.belts.push({ name, season: s.season, age: s.age });
      log(s, `\u{1F3C6} ${name}${rep.unify ? " po unifikacji" : ""}. Pokonany mistrz: ${opp.firstName} ${opp.lastName}.`);
    } else if (res === "L") s.rank = Math.max(2, rep.rankBefore ?? 2);
    return;
  }
  if (rep.defense) {
    if (res === "W" || res === "D") {
      if (!rep.weightMiss) {
        s.titleDefenses++;
        s.flags.maxDef = Math.max(s.flags.maxDef ?? 0, s.titleDefenses);
        if (s.tier === 4) s.flags.worldMaxDef = Math.max(s.flags.worldMaxDef ?? 0, s.titleDefenses);
        if (res === "W") log(s, `Obrona pasa nr ${s.titleDefenses} (${opp.lastName}).`);
      }
      if (rep.weightMiss) {
        s.rank = 1;
        s.titleDefenses = 0;
        s.flags.stripped = (s.flags.stripped ?? 0) + 1;
        rep.stripped = true;
        rep.moments.push({ round: rep.round, title: "Pas odebrany", text: "Wygrywasz, ale mistrz, kt\xF3ry nie zrobi\u0142 wagi, nie mo\u017Ce zatrzyma\u0107 pasa. Federacja og\u0142asza wakat, a ty spadasz na pierwsze miejsce w rankingu.", tone: "bad" });
        log(s, "Federacja odbiera pas: mistrz nie zrobi\u0142 wagi przed obron\u0105.");
      }
    } else {
      s.rank = 1;
      s.titleDefenses = 0;
      s.flags.doubleActive = 0;
      log(s, `Pas stracony. Nowy mistrz: ${opp.firstName} ${opp.lastName}.`);
    }
    return;
  }
  if (mine === 0) return;
  const finish = rep.method === "KO/TKO" || rep.method === "Poddanie";
  if (rep.tuneup) {
    if (res === "W") s.rank = mine === null ? size : Math.max(1, mine - 1);
    else if (res === "L") s.rank = (mine ?? size) + 4;
    if (s.rank !== null && s.rank > size) s.rank = null;
    return;
  }
  const cur = mine ?? size + 2;
  if (res === "W") {
    let next;
    if (opp.rank !== null && opp.rank > 0 && opp.rank < cur) next = opp.rank;
    else next = cur - 1 - (finish ? 1 : 0) - (opp.rank !== null ? 1 : 0);
    next -= activeManager(s)?.quality ?? 0;
    if (rep.short) next -= 2;
    s.rank = clamp(next, 1, size + 2);
  } else if (res === "L") {
    s.rank = rep.short ? cur + 1 : cur + 2 + (finish ? 1 : 0);
  }
  if (s.rank !== null && s.rank > size) s.rank = null;
}
function nemesisAfterFight(s, rep, rf, res) {
  const opp = rep.opp;
  const nem = s.nemesis;
  if (nem && nem.id === opp.id) {
    rep.nemesis = true;
    if (res === "W") {
      s.media = clamp(s.media + 4, 0, 100);
      s.rep = clamp(s.rep + 2, 0, 100);
      if (rf.h2h.w >= rf.h2h.l) {
        s.nemesis = null;
        s.flags.nemesisSettled = (s.flags.nemesisSettled ?? 0) + 1;
        rep.moments.push({ round: rep.round, title: "Rachunki wyr\xF3wnane", text: `${opp.firstName} ${opp.lastName} le\u017Cy, a ty patrzysz mu w oczy. Teraz ${h2hWords(rf.h2h.w, rf.h2h.l)}. Zadra wyj\u0119ta, kibice to pami\u0119taj\u0105.`, tone: "good" });
      } else
        rep.moments.push({ round: rep.round, title: "Zadra", text: `Wygrana z rywalem, kt\xF3ry zalaz\u0142 ci za sk\xF3r\u0119. Teraz ${h2hWords(rf.h2h.w, rf.h2h.l)}, jeszcze jedna i rachunki wyr\xF3wnane.`, tone: "good" });
    } else if (res === "L") {
      s.media = clamp(s.media + 1, 0, 100);
      rep.moments.push({ round: rep.round, title: "Zadra", text: `${opp.lastName} znowu g\xF3r\u0105: ${h2hWords(rf.h2h.w, rf.h2h.l)}. W mediach \u015Bmieje si\u0119, \u017Ce ma ci\u0119 \u201Ew kieszeni\u201D.`, tone: "bad" });
    }
    return;
  }
  if (res !== "L" || nem) return;
  const finish = rep.method === "KO/TKO" || rep.method === "Poddanie";
  if (!finish && rf.h2h.l < 2) return;
  s.nemesis = { id: opp.id, name: `${opp.firstName} ${opp.lastName}`, fed: s.fed, tier: s.tier, div: divisionKey(s), since: s.season };
  rep.moments.push({
    round: rep.round,
    title: "Zadra",
    text: `${opp.lastName} po walce nie podaje ci r\u0119ki, a w wywiadzie m\xF3wi, \u017Ce \u201Eto by\u0142o za \u0142atwe\u201D. Od dzi\u015B to sprawa osobista. Rewan\u017C z nim da wi\u0119cej pieni\u0119dzy i rozg\u0142osu.`,
    tone: "bad"
  });
}
function nemesisFighter(s) {
  const n = s.nemesis;
  if (!n || n.fed !== s.fed || n.tier !== s.tier || n.div !== divisionKey(s)) return void 0;
  return rosterFighter(s, n.id);
}
function finalizeFight(rng, s, rep) {
  const opp = rep.opp;
  if (rep.farewell) s.flags.farewellDone = 1;
  if (rep.amateur && rep.result === "D") {
    const edge = (ovr(s.stats) - ovr(opp.stats)) / 40 + rep.sim.momentum / 100 + (s.run.form.mod - (s.injury?.penalty ?? 0)) / 100;
    const won = rng.chance(clamp(0.5 + edge, 0.15, 0.85));
    rep.result = won ? "W" : "L";
    rep.method = "Decyzja niejednog\u0142o\u015Bna";
    rep.detail = "po dogrywce";
    rep.moments.push({
      round: rep.round,
      title: "Dogrywka",
      text: won ? "Po regulaminowym czasie remis, wi\u0119c dogrywka. Ostatnia minuta nale\u017Cy do ciebie i s\u0119dziowie to widz\u0105." : `Po regulaminowym czasie remis, wi\u0119c dogrywka. ${opp.lastName} ma wi\u0119cej paliwa i to jemu s\u0119dzia podnosi r\u0119k\u0119.`,
      tone: won ? "good" : "bad"
    });
  }
  const res = rep.result;
  if ((rep.method === "KO/TKO" || rep.method === "Poddanie" || rep.method === "Lekarz") && !rep.time) rep.time = finishTime(rng, rep);
  const rec = rep.amateur ? s.amRecord : s.record;
  if (res === "W") rec.w++;
  else if (res === "L") rec.l++;
  else rec.d++;
  if (!rep.amateur && !rep.freak && !s.proDebut) {
    s.proDebut = { season: s.season, age: s.age };
    log(s, `Debiut zawodowy na gali ${rep.gala}: ${res === "W" ? "wygrana" : res === "L" ? "pora\u017Cka" : "remis"}, rywal ${opp.firstName} ${opp.lastName}.`);
  }
  s.streak = res === "W" ? Math.max(0, s.streak) + 1 : res === "L" ? Math.min(0, s.streak) - 1 : 0;
  s.flags.bestStreak = Math.max(s.flags.bestStreak ?? 0, s.streak);
  if (res === "W" && rep.moments.some((m) => m.decision && m.title === "Mocno obity")) s.flags.comeback = 1;
  if (res === "W" && rep.moments.some((m) => m.title === "Podnosisz si\u0119 po nokdaunie")) s.flags.offTheCanvas = 1;
  if (res === "L" && rep.method === "Decyzja niejednog\u0142o\u015Bna") s.flags.splitLoss = (s.flags.splitLoss ?? 0) + 1;
  if (res === "W" && rep.method === "KO/TKO" && rep.round === 1) s.flags.koR1 = (s.flags.koR1 ?? 0) + 1;
  if (res === "W" && opp.peer) s.flags.peerWins = (s.flags.peerWins ?? 0) + 1;
  if (res === "W" && rep.freak && opp.freak) s.flags.freakWins = (s.flags.freakWins ?? 0) + 1;
  if (res === "L" && rep.freak) s.flags.freakLoss = 1;
  if (res === "W" && (rep.method === "KO/TKO" || rep.method === "Lekarz")) s.finishes.ko++;
  if (res === "W" && rep.method === "Poddanie") s.finishes.sub++;
  if (res === "L" && (rep.method === "KO/TKO" || rep.method === "Lekarz")) {
    s.finishes.koLosses++;
    const kl = s.finishes.koLosses;
    const drop = rep.amateur ? 0 : kl >= 5 ? 2 : 1;
    s.stats.chin = clamp(s.stats.chin - drop, 1, 99);
    s.potential.chin = Math.max(s.stats.chin, s.potential.chin - drop);
    if (!rep.amateur && (kl === 4 || kl === 7 || kl === 8))
      rep.moments.push({
        round: rep.round,
        title: kl >= 8 ? "Ostatnie ostrze\u017Cenie" : "Szcz\u0119ka s\u0142abnie",
        text: kl >= 8 ? `\xD3smy nokaut w karierze. Lekarz komisji m\xF3wi wprost: przy dziewi\u0105tym nie dostaniesz ju\u017C licencji.` : kl === 7 ? "Si\xF3dmy nokaut. Na sparingach coraz \u0142atwiej ci\u0119 trafi\u0107, a ka\u017Cdy cios w szcz\u0119k\u0119 czujesz bardziej ni\u017C kiedy\u015B." : "Czwarty nokaut w karierze. Neurolog ostrzega: ka\u017Cdy kolejny b\u0119dzie przychodzi\u0142 \u0142atwiej.",
        tone: "bad"
      });
  }
  if (res === "L" && rep.method === "Poddanie") s.finishes.subLosses++;
  if (rep.freak) s.freakFights++;
  let earned = rep.amateur ? 0 : rep.purse + (res === "W" ? rep.winBonus ?? Math.round(s.contract.winBonus * (rep.title ? 1.8 : 1)) : 0);
  if (!rep.amateur && s.tier >= 1) {
    const amount = rep.tuneup ? 1500 : [0, 1500, 1e4, 3e4, 2e5][s.tier];
    let bonus = null;
    if (res === "W" && rep.method === "KO/TKO" && rng.chance(0.3)) bonus = "Nokaut wieczoru";
    else if (res === "W" && rep.method === "Poddanie" && rng.chance(0.35)) bonus = "Poddanie wieczoru";
    else if (rep.sim.me.dmg > 30 && rep.sim.opp.dmg > 30 && rng.chance(0.4)) bonus = "Walka wieczoru";
    if (bonus) {
      rep.bonus = bonus;
      earned += amount;
      s.flags.bonuses = (s.flags.bonuses ?? 0) + 1;
      rep.moments.push({
        round: rep.round,
        brand: bonus === "Nokaut wieczoru" ? "knockout" : void 0,
        title: `Bonus: ${bonus.toLowerCase()}`,
        text: bonus === "Walka wieczoru" ? `Organizator docenia wojn\u0119, jak\u0105 zafundowali\u015Bcie kibicom. Dla ka\u017Cdego z was ${amount.toLocaleString("pl-PL")} z\u0142.` : `Organizator dorzuca ${amount.toLocaleString("pl-PL")} z\u0142 za najlepsze sko\u0144czenie gali.`,
        tone: "purple"
      });
    }
  }
  const mgr = currentManager(s);
  if (mgr && !rep.amateur && earned > 0) {
    const cut = Math.round(earned * mgr.cut / 100) * 100;
    earned -= cut;
    rep.mgrCut = cut;
  }
  rep.earned = earned;
  s.money += earned;
  s.totalEarned += earned;
  const tierM = [1, 1.5, 2.5, 3, 4][s.tier];
  if (res === "W") {
    const titleM = [0.5, 1.5, 4, 6, 10][s.tier];
    const capByTier = [35, 55, 80, 95, 100][s.tier];
    const gain = Math.round((rep.method === "KO/TKO" || rep.method === "Poddanie" ? 2 : 1) * tierM + (rep.title ? titleM : 0));
    if (s.media < capByTier) s.media = clamp(s.media + gain, 0, capByTier);
    const repCap = [45, 60, 85, 100, 100][s.tier];
    if (!rep.freak && s.rep < repCap) s.rep = clamp(s.rep + Math.round(0.5 + tierM / 2 + (rep.title ? titleM / 2 : 0)), 0, repCap);
    if (rep.freak) s.rep = clamp(s.rep - 4, 0, 100);
  } else if (res === "L") {
    s.media = clamp(s.media + (rep.freak ? -3 : 0), 0, 100);
    s.rep = clamp(s.rep - (rep.freak ? 8 : rep.short ? 0 : 1), 0, 100);
  }
  if (rep.freak) {
    s.media = clamp(s.media + 5, 0, 100);
    s.rep = clamp(s.rep - 3, 0, 100);
  }
  if (rep.tuneup) {
    s.rep = clamp(s.rep - (res === "W" ? 2 : 6), 0, 100);
    if (res !== "W") s.media = clamp(s.media - 4, 0, 100);
    s.flags.tuneups = (s.flags.tuneups ?? 0) + 1;
  }
  const dmgTaken = rep.sim.me.dmg;
  s.wear = clamp(s.wear + dmgTaken / 10 * (rep.amateur ? 0.4 : 1) * (hasBackroom(s, "physio") ? 0.7 : 1) + (res === "L" && (rep.method === "KO/TKO" || rep.method === "Lekarz") ? rep.amateur ? 3 : 7 : 0) + (s.age >= 32 ? 1.5 : 0), 0, 100);
  if (s.profile.start === "wybraniec" && !rep.amateur) s.wear = clamp(s.wear + 0.5 + dmgTaken / 70, 0, 100);
  const extra = !rep.amateur && s.run ? Math.max(0, s.run.fights.length - 3) : 0;
  if (!rep.amateur && weightShift(s) < 0) s.wear = clamp(s.wear + 1, 0, 100);
  if (!rep.amateur && weightShift(s) > 0) s.wear = clamp(s.wear - 1.5, 0, 100);
  if (rep.prep === "hard") s.wear = clamp(s.wear + 1, 0, 100);
  if (extra) s.wear = clamp(s.wear + 2 * extra, 0, 100);
  const injP = (extra * 0.03 + (rep.prep === "hard" ? 0.03 : 0) + (dmgTaken > 50 ? 0.22 : dmgTaken > 30 ? 0.07 : 0.02) + s.wear / 600 + (s.age >= 32 ? 0.03 : 0)) * (rep.amateur ? 0.5 : 0.8);
  if (!s.injury && rng.chance(injP * (hasBackroom(s, "doctor") ? 0.65 : 1))) {
    const roll = rng.next() * (hasBackroom(s, "doctor") ? 0.8 : 1);
    if (roll < 0.6) {
      s.injury = { name: rng.pick(INJ_MINOR), seasons: 1, penalty: 4 };
      rep.moments.push({ round: rep.round, title: "Kontuzja", text: `Po walce lekarz ma z\u0142e wie\u015Bci: ${s.injury.name}. Da si\u0119 walczy\u0107, ale nie na sto procent.`, tone: "bad" });
    } else if (roll < 0.88 || rep.amateur) {
      s.injury = { name: rng.pick(INJ_SEVERE), seasons: 2, penalty: 5 };
      s.flags.injuryStop = 1;
      rep.moments.push({ round: rep.round, title: "Powa\u017Cna kontuzja", text: `Diagnoza: ${s.injury.name}. Lekarz skre\u015Bla ci\u0119 do ko\u0144ca roku.`, tone: "bad" });
      log(s, `Powa\u017Cna kontuzja: ${s.injury.name}. Koniec roku.`);
    } else {
      s.injury = { name: rng.pick(INJ_OUT), seasons: 2, penalty: 6, out: 1 };
      s.flags.injuryStop = 1;
      rep.moments.push({ round: rep.round, title: "Uraz na rok", text: `Diagnoza: ${s.injury.name}. Operacja i ca\u0142y nast\u0119pny rok rehabilitacji.`, tone: "bad" });
      log(s, `Uraz na ca\u0142y rok: ${s.injury.name}.`);
    }
  }
  rep.rankBefore = s.rank;
  const rf = !rep.amateur && !rep.freak && !opp.peer ? rosterFighter(s, opp.id) : void 0;
  if (rf && rf.h2h.w + rf.h2h.l + rf.h2h.d > 0)
    rep.moments.unshift({ round: 0, title: "Znowu on", text: `${opp.firstName} ${opp.lastName}. Spotykacie si\u0119 nie pierwszy raz, wasz bilans przed walk\u0105: ${rf.h2h.w}-${rf.h2h.l}${rf.h2h.d ? `-${rf.h2h.d}` : ""}.`, tone: "neutral" });
  updateRank(s, rep);
  if ((s.flags.interim ?? 0) > 0 && s.rank !== 1) {
    s.flags.interim = 0;
    if (s.rank !== 0) log(s, "Pas tymczasowy przepada po pora\u017Cce.");
  }
  rep.rankAfter = s.rank;
  if (rf) rosterAfterFight(s, opp.id, res, rep.title && !rep.interim && !rep.superfight, rep.defense, rep.rankBefore);
  else rosterSync(s);
  if (rf) nemesisAfterFight(s, rep, rf, res);
  if (!rep.amateur && !rep.freak && s.run && rng.chance(0.75)) {
    const n = rosterNews(rng, s, rep.idx + 1);
    if (n) (s.run.news ??= []).push(n);
  }
  if (s.rank !== null) {
    if (s.tier > s.peakTier || s.tier === s.peakTier && (s.peakRank === null || s.rank < s.peakRank)) {
      s.peakTier = s.tier;
      s.peakRank = s.rank;
    }
  }
  if (opp.peer) {
    const p = s.peers.find((x) => x.id === opp.id);
    if (p) {
      p.metCount++;
      if (res === "W") {
        p.h2h.w++;
        p.record.l++;
        if (s.rivalId === p.id) s.media = clamp(s.media + 3, 0, 100);
      } else if (res === "L") {
        p.h2h.l++;
        p.record.w++;
      } else {
        p.h2h.d++;
        p.record.d++;
      }
      if (!s.rivalId && (res === "L" || p.metCount >= 2)) {
        s.rivalId = p.id;
        rep.rival = true;
        rep.moments.push({
          round: rep.round,
          title: "Rywalizacja",
          text: res === "L" ? `${p.lastName} po walce rzuca do kamery, \u017Ce \u201Eto by\u0142 trening\u201D. Od dzi\u015B to tw\xF3j rywal. Jeszcze si\u0119 spotkacie.` : `Drugi raz ${p.lastName}. Kibice ju\u017C m\xF3wi\u0105 o was jak o serialu. Od dzi\u015B to tw\xF3j rywal.`,
          tone: "purple"
        });
        log(s, `Rywal na ca\u0142\u0105 karier\u0119: ${p.firstName} ${p.lastName}.`);
      }
      if (rep.rival && p.metCount > 1)
        rep.moments.unshift({
          round: 0,
          title: "Odwieczny rywal",
          text: `${p.firstName} ${p.lastName}. Przed walk\u0105 ${h2hWords(p.h2h.w - (res === "W" ? 1 : 0), p.h2h.l - (res === "L" ? 1 : 0))}. Hala jest pe\u0142na, bo wszyscy wiedz\u0105, \u017Ce tu nie chodzi tylko o ranking.`,
          tone: "purple"
        });
      else if (p.metCount === 1)
        rep.moments.unshift({ round: 0, title: "Znajoma twarz", text: `${p.firstName} ${p.lastName}. Znacie si\u0119 z pierwszych turniej\xF3w, nieraz jechali\u015Bcie jednym busem. Dzi\u015B kole\u017Ce\u0144stwo zostaje w szatni.`, tone: "neutral" });
      else
        rep.moments.unshift({
          round: 0,
          title: "Rewan\u017C",
          text: `Znowu ${p.lastName}. Przed dzisiejsz\u0105 walk\u0105 wasz bilans to ${p.h2h.w - (res === "W" ? 1 : 0)}-${p.h2h.l - (res === "L" ? 1 : 0)}.`,
          tone: "neutral"
        });
    }
  }
  if (rep.method && rep.method.startsWith("Decyzja") || rep.method === "Remis") {
    const n = opp.lastName;
    const lines = {
      "W:Decyzja jednog\u0142o\u015Bna": [
        `Kontrolowa\u0142e\u015B walk\u0119 od pocz\u0105tku do ko\u0144ca. S\u0119dziowie nie mieli w\u0105tpliwo\u015Bci, ${n} chyba te\u017C nie.`,
        "Bez fajerwerk\xF3w, ale pewnie. S\u0119dziowie zgodni co do zwyci\u0119zcy.",
        `${n} do ko\u0144ca szuka\u0142 jednego ciosu. Nie znalaz\u0142.`,
        "Trzech s\u0119dzi\xF3w, trzy karty po twojej stronie. Trener kiwa g\u0142ow\u0105, czyli jest zadowolony.",
        `${n} po walce m\xF3wi, \u017Ce nast\u0119pnym razem b\u0119dzie inaczej. Ka\u017Cdy tak m\xF3wi.`,
        "Po werdykcie kto\u015B z sektora krzyczy, \u017Ce si\u0119 spodziewa\u0142. To ten sam cz\u0142owiek, kt\xF3ry w drugiej rundzie krzycza\u0142 \u201Ekoniec z tob\u0105\u201D.",
        "Wygrana na kartach. Nie naj\u0142adniejsza, ale do rekordu si\u0119 liczy."
      ],
      "W:Decyzja niejednog\u0142o\u015Bna": ["Tw\xF3j trener ogl\u0105da og\u0142oszenie werdyktu z zamkni\u0119tymi oczami. Otwiera je dopiero, kiedy s\u0142yszy twoje nazwisko.", "Wyr\xF3wnana wojna. Dw\xF3ch s\u0119dzi\xF3w punktuje dla ciebie, jeden dla niego.", `Cz\u0119\u015B\u0107 hali gwi\u017Cd\u017Ce, ${n} kr\u0119ci g\u0142ow\u0105, ale to twoja r\u0119ka idzie w g\xF3r\u0119.`],
      "W:Decyzja wi\u0119kszo\u015Bciowa": ["Jeden s\u0119dzia da\u0142 remis, dw\xF3ch ciebie. Wystarczy.", "S\u0119dzia punktowy numer trzy chyba ogl\u0105da\u0142 inn\u0105 walk\u0119. Na szcz\u0119\u015Bcie pozostali dwaj nie."],
      "L:Decyzja jednog\u0142o\u015Bna": ["W szatni mama dzwoni z pytaniem, czy jad\u0142e\u015B. To jedyna dobra wiadomo\u015B\u0107 tego wieczoru.", `${n} by\u0142 dzi\u015B po prostu lepszy. D\u0142uga droga do szatni.`, "Goni\u0142e\u015B go przez ca\u0142\u0105 walk\u0119 i nie dogoni\u0142e\u015B.", "Trener w szatni m\xF3wi tylko: \u201Ewracamy do roboty\u201D.", `${n} rozbi\u0142 walk\u0119 na kawa\u0142ki. Trzeba to obejrze\u0107 jeszcze raz i wyci\u0105gn\u0105\u0107 wnioski.`],
      "L:Decyzja niejednog\u0142o\u015Bna": [`S\u0119dzia, kt\xF3ry punktowa\u0142 dla ciebie, macha ci z trybun. Pozostali dwaj patrz\u0105 w telefony.`, "Jeden s\u0119dzia by\u0142 z tob\u0105, dw\xF3ch nie. W szatni cisza.", "Kibice krzycz\u0105 twoje nazwisko, ale s\u0119dzia podnosi drug\u0105 r\u0119k\u0119.", "Internet pisze o skandalu, ale w rekordzie i tak zostaje pora\u017Cka."],
      "L:Decyzja wi\u0119kszo\u015Bciowa": ["Remis u jednego s\u0119dziego, pora\u017Cka u dw\xF3ch. Boli."],
      "D:Remis": ["Remis. Babcia przez telefon pyta, kto wygra\u0142. Nie umiesz jej tego wyt\u0142umaczy\u0107.", "Remis. Nikt nie jest zadowolony, wszyscy chc\u0105 rewan\u017Cu.", "Remis. Organizator ju\u017C zaciera r\u0119ce na rewan\u017C."]
    };
    const pool = (lines[`${res}:${rep.method}`] ?? []).filter((t) => rep.sim.maxRounds === 3 || !/Trzy rundy|Każda runda/.test(t));
    if (pool.length && !rep.moments.some((m) => m.title === "Dogrywka"))
      rep.moments.push({ round: rep.round, title: "Werdykt", text: rng.pick(pool), tone: res === "W" ? "good" : res === "L" ? "bad" : "neutral" });
  }
  rep.headline = headlineFor(rep);
  const h = {
    amateur: rep.amateur,
    gala: rep.gala ?? rep.tourney,
    stage: rep.stage,
    time: rep.time,
    season: s.season,
    age: s.age,
    tier: s.tier,
    fed: rep.fed,
    opponent: `${opp.firstName} ${opp.lastName}`,
    oppNick: opp.nickname,
    oppRecord: recStr(opp.record),
    oppRank: opp.rank,
    oppFlag: opp.flag,
    result: res,
    method: rep.method,
    round: rep.round,
    detail: rep.detail,
    title: rep.title,
    freak: rep.freak,
    peer: rep.peer,
    earned
  };
  s.history.push(h);
  if (totalWins(s) === 1 && res === "W") log(s, `Pierwsze zwyci\u0119stwo: ${opp.firstName} ${opp.lastName}.`);
  if (res === "W" && rep.method === "KO/TKO" && s.finishes.ko === 1) log(s, `Pierwszy nokaut (${rep.detail}).`);
  if (rep.freak && s.freakFights === 1) log(s, `Pierwszy freak fight (${opp.freak}).`);
  const fans = fanGain(
    s,
    { result: res, finish: rep.method === "KO/TKO" || rep.method === "Poddanie", title: rep.title || !!rep.superfight, freak: rep.freak, bonus: !!rep.bonus, tier: s.tier, amateur: rep.amateur },
    rng.next()
  );
  if (fans > 0) {
    rep.fans = fans;
    addFans(s, fans);
  }
  if (rep.short && res === "W") {
    s.flags.shortWins = (s.flags.shortWins ?? 0) + 1;
    s.rep = clamp(s.rep + 2, 0, 100);
    s.media = clamp(s.media + 2, 0, 100);
    rep.moments.push({ round: rep.round, title: "Uratowana gala", text: "Wzi\u0105\u0142e\u015B walk\u0119 z sze\u015Bciodniowym wyprzedzeniem i wygra\u0142e\u015B. Organizator nie zapomni, ranking te\u017C nie.", tone: "purple" });
  }
  if (rep.abroad) {
    if (res === "W") {
      s.media = clamp(s.media + 4, 0, 100);
      s.rep = clamp(s.rep + 2, 0, 100);
      s.flags.abroadWins = (s.flags.abroadWins ?? 0) + 1;
    } else if (res === "L") {
      s.rep = clamp(s.rep - 1, 0, 100);
    }
  }
  if (rep.superfight && res === "W") {
    s.media = clamp(s.media + 10, 0, 100);
    s.rep = clamp(s.rep + 8, 0, 100);
    rep.moments.push({ round: rep.round, title: "Podw\xF3jny mistrz", text: `Dwa pasy na dw\xF3ch ramionach. Ma\u0142o komu w historii federacji si\u0119 to uda\u0142o.`, tone: "purple" });
  }
  if (rep.interim && res === "W")
    rep.moments.push({ round: rep.round, title: "Tymczasowy mistrz", text: "Pas tymczasowy jest tw\xF3j. Teraz czeka ci\u0119 walka z prawdziwym mistrzem, gdy wr\xF3ci po kontuzji.", tone: "purple" });
  if (!rep.amateur && !rep.freak && res === "W" && !s.fanNick) {
    const nick = fanNickFor(rng, s);
    if (nick) {
      s.fanNick = nick;
      const had = !!s.profile.nickname;
      if (!had) s.profile.nickname = nick;
      log(s, `Kibice nazywaj\u0105 ci\u0119 \u201E${nick}\u201D.`);
      rep.moments.push({ round: rep.round, title: "Nowa ksywka", text: had ? `Na trybunach kto\u015B krzyczy \u201E${nick}!\u201D i ca\u0142a hala to podchwytuje. Oficjalnie dalej jeste\u015B \u201E${s.profile.nickname}\u201D, ale kibice wiedz\u0105 swoje.` : `Na trybunach kto\u015B krzyczy \u201E${nick}!\u201D i ca\u0142a hala to podchwytuje. Od dzi\u015B na plakatach jeste\u015B \u201E${nick}\u201D.`, tone: "purple" });
    }
  }
  if (rep.amateur) advanceTourney(s, rep, res);
  else if (s.run.fights.length >= s.run.planned) s.run.done = true;
  if (s.flags.injuryStop) {
    s.flags.injuryStop = 0;
    s.run.done = true;
  }
  if (rep.result) s.run.post = buildPost(rng, s, rep);
}
var METHOD_SHORT = {
  "KO/TKO": "KO/TKO",
  Poddanie: "poddanie",
  Lekarz: "TKO (przerwanie przez lekarza)",
  "Decyzja jednog\u0142o\u015Bna": "jednog\u0142o\u015Bna decyzja",
  "Decyzja niejednog\u0142o\u015Bna": "niejednog\u0142o\u015Bna decyzja",
  "Decyzja wi\u0119kszo\u015Bciowa": "decyzja wi\u0119kszo\u015Bciowa",
  Remis: "remis",
  Walkower: "walkower"
};
function headlineFor(rep) {
  const r = rep.result;
  const m = rep.method;
  const word = r === "W" ? "Wygrana" : r === "L" ? "Pora\u017Cka" : "Remis";
  if (m === "Remis") return "Remis";
  if (m === "KO/TKO" || m === "Poddanie" || m === "Lekarz") return `${word} \xB7 ${METHOD_SHORT[m]} \xB7 R${rep.round}${rep.time ? ` ${rep.time}` : ""}`;
  return `${word} \xB7 ${METHOD_SHORT[m]}`;
}
var fmtK = (n) => {
  const a = Math.abs(n);
  const v = a >= 1e6 ? `${(a / 1e6).toLocaleString("pl-PL", { maximumFractionDigits: 2 })} mln z\u0142` : `${Math.round(a / 1e3).toLocaleString("pl-PL")} tys. z\u0142`;
  return `${n >= 0 ? "+" : "\u2212"}${v}`;
};
var proFights = (fights) => fights.filter((f) => f.result && !f.amateur && !f.freak);
var YEAR_GOALS = [
  { id: "wins", label: "Trzy wygrane", desc: "Wygraj co najmniej trzy walki w tym roku.", pay: 1.2, need: 3, progress: (_s, f) => proFights(f).filter((x) => x.result === "W").length },
  { id: "finish", label: "Dwa sko\u0144czenia", desc: "Sko\u0144cz dw\xF3ch rywali przed czasem.", pay: 1.8, extra: "media +3", need: 2, progress: (_s, f) => proFights(f).filter((x) => x.result === "W" && (x.method === "KO/TKO" || x.method === "Poddanie")).length },
  { id: "clean", label: "Rok bez pora\u017Cki", desc: "Co najmniej dwie walki i ani jednej przegranej.", pay: 1.5, extra: "reputacja +3", need: 2, progress: (_s, f) => proFights(f).some((x) => x.result === "L") ? 0 : proFights(f).length },
  { id: "top5", label: "Pokonaj czo\u0142\xF3wk\u0119", desc: "Wygraj z kim\u015B z top 5 rankingu.", pay: 0.7, extra: "media +2", need: 1, progress: (_s, f) => proFights(f).filter((x) => x.result === "W" && x.opp.rank !== null && x.opp.rank <= 5).length },
  { id: "bonus", label: "Bonus wieczoru", desc: "Zgarnij bonus za walk\u0119, nokaut albo poddanie wieczoru.", pay: 1.4, extra: "obserwuj\u0105cy", need: 1, progress: (_s, f) => proFights(f).filter((x) => x.bonus).length },
  { id: "climb", label: "Skok w rankingu", desc: "Sko\u0144cz rok co najmniej trzy miejsca wy\u017Cej ni\u017C zacz\u0105\u0142e\u015B (albo wejd\u017A do rankingu).", pay: 0.7, need: 3, progress: (s) => {
    const st = s.run?.startRank ?? null;
    if (s.rank === null) return 0;
    if (st === null) return 3;
    return Math.max(0, st - s.rank);
  } }
];
function yearGoalOptions(s) {
  if (!s.proDebut || s.tier < 1 || s.contract.kind === "freak") return [];
  const rng = createRng((s.createdAt ^ s.season * 2654435761) >>> 0);
  const pool = YEAR_GOALS.filter((g) => !(g.id === "top5" && (s.rank === null || s.rank > 9)) && !(g.id === "wins" && plannedFights(s) < 3) && !(g.id === "climb" && s.rank !== null && s.rank <= 3));
  const out = [];
  while (out.length < 3 && pool.length) out.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]);
  return out;
}
function yearGoalReward(s, g) {
  return Math.round(s.contract.purse * g.pay / 500) * 500;
}
function setYearGoal(s0, id) {
  const s = clone(s0);
  s.yearGoal = id ? { season: s.season, id } : null;
  return s;
}
function currentYearGoal(s) {
  if (!s.yearGoal || s.yearGoal.season !== s.season) return null;
  return YEAR_GOALS.find((g) => g.id === s.yearGoal.id) ?? null;
}
function settleYearGoal(s, run) {
  const g = currentYearGoal(s);
  if (!g || run.tourneys) return null;
  const ok = Math.min(g.need, g.progress(s, run.fights)) >= g.need;
  const reward = ok ? yearGoalReward(s, g) : 0;
  if (ok) {
    s.money += reward;
    s.totalEarned += reward;
    if (g.id === "finish") s.media = clamp(s.media + 3, 0, 100);
    if (g.id === "clean") s.rep = clamp(s.rep + 3, 0, 100);
    if (g.id === "top5") s.media = clamp(s.media + 2, 0, 100);
    if (g.id === "bonus") addFans(s, [0, 300, 1500, 8e3, 4e4][s.tier] ?? 500);
    s.flags.yearGoals = (s.flags.yearGoals ?? 0) + 1;
  }
  return { label: g.label, ok, reward };
}
var SPONSOR_POSTS = 2;
function settleSponsorPosts(s, run) {
  if (!s.proDebut || run.tourneys || !s.sponsors.length || s.flags[`fpSettled:${s.season}`] || run.fights.filter((f) => !f.amateur && f.sim.finished).length < 2) return null;
  s.flags[`fpSettled:${s.season}`] = 1;
  const n = s.flags[`fpSp:${s.season}`] ?? 0;
  if (n >= SPONSOR_POSTS) {
    const bonus = s.sponsors.length * Math.round(250 * ([1, 1.5, 3, 5, 8][Math.min(4, s.tier)] ?? 1) / 50) * 50;
    s.money += bonus;
    s.totalEarned += bonus;
    return { icon: "check", label: "Sponsorzy zadowoleni z post\xF3w", value: `${n} ${pl(n, "post", "posty", "post\xF3w")} z produktem, premia ${bonus.toLocaleString("pl-PL")} z\u0142` };
  }
  if (n === 0) {
    const sp = [...s.sponsors].sort((a, b) => b.seasonsLeft - a.seasonsLeft)[0];
    if (sp.seasonsLeft > 1) {
      sp.seasonsLeft = 1;
      return { icon: "x", label: `${sp.name} zrywa umow\u0119`, value: "ani jednego posta z produktem przez ca\u0142y rok" };
    }
    return { icon: "x", label: `${sp.name} niezadowolony`, value: "ani jednego posta z produktem, nie przed\u0142u\u017Cy umowy" };
  }
  return { icon: "phone", label: "Posty dla sponsor\xF3w", value: `${n} z ${SPONSOR_POSTS}, bez premii` };
}
function outsideRows(s, run) {
  const rows = [];
  const yg = settleYearGoal(s, run);
  if (yg) rows.push({ icon: yg.ok ? "check" : "x", label: `Cel roku: ${yg.label}`, value: yg.ok ? `zaliczony, premia ${yg.reward.toLocaleString("pl-PL")} z\u0142` : "nie uda\u0142o si\u0119" });
  const sp = settleSponsorPosts(s, run);
  if (sp) rows.push(sp);
  const fans = followersOf(s) - (run.startFans ?? followersOf(s));
  if (fans > 0 && !run.tourneys) rows.push({ icon: "phone", label: "Obserwuj\u0105cy", value: `+${fmtFans(fans)} (razem ${fmtFans(followersOf(s))})` });
  const tix = run.fights.filter((f) => f.tickets);
  if (tix.length) {
    const sold = tix.reduce((a, f) => a + f.tickets.sold, 0);
    const cut = tix.reduce((a, f) => a + f.tickets.cut, 0);
    rows.push({ icon: "ticket", label: "Bilety", value: sold ? `${sold} ${pl(sold, "bilet", "bilety", "bilet\xF3w")}, prowizja ${cut.toLocaleString("pl-PL")} z\u0142` : "nic nie sprzeda\u0142e\u015B" });
  }
  const bonuses = run.fights.filter((f) => f.bonus).length;
  if (bonuses) rows.push({ icon: "star", label: "Bonusy wieczoru", value: run.fights.filter((f) => f.bonus).map((f) => f.bonus.toLowerCase()).join(", ") });
  for (const x of run.sideLog ?? []) rows.push({ icon: x.tone === "bad" ? "x" : "trophy", label: x.title, value: x.lines[x.lines.length - 1] });
  const POST = {
    champ: (ok) => ok ? "wywo\u0142any mistrz przyj\u0105\u0142 wyzwanie" : "mistrz wy\u015Bmia\u0142 wywo\u0142anie",
    up: (ok) => ok ? "wywo\u0142any zawodnik z czo\u0142\xF3wki przyj\u0105\u0142 walk\u0119" : "wywo\u0142anie bez odzewu",
    rival: () => "wywo\u0142any odwieczny rywal",
    super: (ok) => ok ? "superfight w planach" : "mistrz kategorii obok odm\xF3wi\u0142",
    thanks: () => "podzi\u0119kowania bez show",
    rematch: (ok) => ok ? "wywalczony rewan\u017C" : "federacja odm\xF3wi\u0142a rewan\u017Cu",
    class: () => "werdykt przyj\u0119ty z klas\u0105",
    rant: () => "w\u015Bciek\u0142y film w internecie"
  };
  for (const f of run.fights) {
    if (!f.postChoice) continue;
    const isMic = f.moments.some((mm) => mm.title === "Mikrofon");
    rows.push({ icon: isMic ? "mic" : "scale", label: `${isMic ? "Mikrofon" : "Po werdykcie"} \xB7 ${f.opp.lastName}`, value: POST[f.postChoice.key]?.(f.postChoice.ok) ?? "" });
  }
  return rows.length ? rows : void 0;
}
function toSummary(s0) {
  const s = clone(s0);
  s.flags.sideTired = 0;
  if ((s.flags.interim ?? 0) > 0 && s.rank !== 1) s.flags.interim = 0;
  const run = s.run;
  const fights = run.fights.filter((f) => f.result);
  const w = fights.filter((f) => f.result === "W").length;
  const l = fights.filter((f) => f.result === "L").length;
  const d = fights.filter((f) => f.result === "D").length;
  const total = Math.max(1, w + l + d);
  const moneyDelta = s.money - (s.flags.moneyStart ?? run.startMoney);
  const beltWon = fights.some((f) => (f.title && !f.defense && !f.interim && !f.weightMiss || f.superfight) && f.result === "W") || (run.tourneys ?? []).some((t) => t.championship && t.medal === "gold");
  const amateur = !!run.tourneys;
  const winPct = w / total;
  const expected = 1 / (1 + Math.exp(-(ovr(s.stats) - TIER_LEVEL[s.tier]) / 6));
  const overPct = Math.round(clamp(50 + (winPct - expected) * 120, 5, 100));
  const bars = [
    { label: "Wyniki", value: Math.round(winPct * 100), note: `wygrane: ${w} z ${w + l + d}` },
    {
      label: "Na tle oczekiwa\u0144",
      value: overPct,
      note: overPct >= 62 ? "lepiej, ni\u017C wskazywa\u0142 poziom" : overPct >= 40 ? "mniej wi\u0119cej tyle, ile si\u0119 da\u0142o" : "poni\u017Cej mo\u017Cliwo\u015Bci"
    },
    { label: "Bilans kasy", value: Math.round(clamp(50 + moneyDelta / Math.max(5e3, TIER_PURSE[s.tier][1] * 2) * 60, 5, 100)), note: `${fmtK(moneyDelta)} po kosztach` },
    { label: "Forma", value: Math.round(clamp(50 + run.form.mod * 5, 5, 100)), note: run.form.label.toLowerCase() }
  ];
  const medalPts = (run.tourneys ?? []).reduce((a, t) => a + (t.medal === "gold" ? 14 : t.medal === "silver" ? 8 : t.medal === "bronze" ? 5 : 0), 0);
  const score = bars[0].value * 0.5 + bars[1].value * 0.3 + bars[2].value * 0.1 + bars[3].value * 0.1 + (beltWon ? 25 : 0) + medalPts;
  const grade = score >= 80 ? "Rok wybitny" : score >= 62 ? "Udany rok" : score >= 45 ? "Przeci\u0119tny rok" : score >= 28 ? "Rok do zapomnienia" : "Katastrofa";
  const finishes = fights.filter((f) => f.result === "W" && (f.method === "KO/TKO" || f.method === "Lekarz" || f.method === "Poddanie")).length;
  const lines = [];
  const fedShort2 = galaPrefix(s.fed);
  if (amateur) {
    for (const t of run.tourneys) lines.push(`${t.name}: ${tourneyResultText(t)}.`);
    if (beltWon) lines.push("Jeste\u015B mistrzem Polski amator\xF3w i w klubie wszyscy ju\u017C o tym wiedz\u0105.");
  } else if (beltWon) lines.push(`Rok, w kt\xF3rym zdoby\u0142e\u015B pas. ${fedShort2} ma nowego mistrza.`);
  else if (fights.some((f) => !f.amateur && f.rankBefore === 0) && s.rank !== 0)
    lines.push(`Rok, w kt\xF3rym straci\u0142e\u015B pas. ${fedShort2} ma nowego mistrza, a ty zaczynasz od pozycji ${s.rank === null ? "poza rankingiem" : `#${s.rank}`}.`);
  else if (w === total && total > 1) lines.push(`Rok bez pora\u017Cki, ${w} na ${total}.`);
  else if (l === total) lines.push(`Rok do wymazania. ${l} ${pl(l, "pora\u017Cka", "pora\u017Cki", "pora\u017Cek")} i ani jednego powodu do rado\u015Bci.`);
  else lines.push(`Bilans roku: ${w}-${l}${d ? `-${d}` : ""}.`);
  if (!amateur && fights.length === 0) {
    lines.push("Ca\u0142y rok bez walki. Organizatorzy zapominaj\u0105 nazwiska szybciej, ni\u017C my\u015Blisz.");
    if (s.rank !== null && s.rank > 0) s.rank = s.rank + 3 > RANK_SIZE[s.tier] ? null : s.rank + 3;
  }
  if (finishes >= 2) lines.push(`${finishes} ${pl(finishes, "walk\u0119", "walki", "walk")} sko\u0144czy\u0142e\u015B przed czasem.`);
  else if (fights.length >= 2 && fights.every((f) => f.method?.startsWith("Decyzja"))) lines.push("Wszystkie walki do ostatniego gongu, s\u0119dziowie mieli co robi\u0107.");
  const peerFight = fights.find((f) => f.peer);
  if (peerFight) lines.push(`${peerFight.opp.id === s.rivalId ? "Starcie z odwiecznym rywalem" : "Pojedynek z koleg\u0105 z rocznika"} (${peerFight.opp.firstName} ${peerFight.opp.lastName}): ${peerFight.result === "W" ? "wygrany" : peerFight.result === "L" ? "przegrany" : "remis"}.`);
  const goodForm = GOOD_FORMS.includes(run.form.label);
  const badForm = BAD_FORMS.includes(run.form.label);
  if (goodForm && winPct >= 0.6) lines.push("Forma by\u0142a i wszystko wychodzi\u0142o.");
  else if (goodForm) lines.push("Forma by\u0142a, wynik\xF3w zabrak\u0142o.");
  if (badForm && winPct < 0.5) lines.push("Od pierwszego treningu nic si\u0119 nie klei\u0142o.");
  else if (badForm) lines.push("Forma nie dopisywa\u0142a, a mimo to wyniki si\u0119 zgadza\u0142y.");
  if (!amateur && s.rank !== null && s.rank > 0) lines.push(`Ko\u0144czysz rok na ${s.rank}. miejscu w rankingu.`);
  if (s.contract.kind === "freak" && !amateur) {
    withRng(s, (rng) => {
      for (const k of ["stand", "wrest", "bjj", "cardio"]) s.stats[k] = clamp(s.stats[k] - rng.int(1, 3), 1, 99);
    });
    lines.push("Zamiast obozu by\u0142y konferencje, nagrania i sparingi z youtuberami. Forma sportowa posz\u0142a w d\xF3\u0142.");
  }
  const summary = {
    season: s.season,
    year: s.year,
    age: s.age,
    tier: s.tier,
    fed: s.fed,
    club: s.club.name,
    w,
    l,
    d,
    rank: s.rank,
    champion: s.rank === 0,
    beltWon,
    moneyDelta,
    moneyFights: fights.reduce((a, f) => a + (f.earned ?? 0), 0),
    legacyFrom: s.flags.legacyPrev ?? s.seasons[s.seasons.length - 1]?.legacyTo ?? (s.seasons.length ? void 0 : 0),
    legacyTo: legacyScore(s),
    ovrFrom: s.flags.ovrStart ?? run.startOvr,
    ovrTo: ovr(s.stats),
    form: run.form.label,
    grade,
    bars,
    story: lines.join(" "),
    outside: outsideRows(s, run)
  };
  s.seasons.push(summary);
  s.lastSummary = summary;
  s.flags.legacyPrev = summary.legacyTo ?? 0;
  s.phase = "summary";
  withRng(s, (rng) => {
    for (const p of s.peers) progressPeer(rng, p);
    if (s.flags.expBoost) delete s.flags.expBoost;
    const note = syncRival(rng, s);
    if (note) summary.story = `${summary.story} ${note}`.trim();
    const rn2 = rosterYear(rng, s);
    if (rn2) summary.story = `${summary.story} ${rn2}`.trim();
  });
  if (s.tier >= 2 && s.rank === null && l >= Math.ceil(total * 0.6) && s.contract.kind !== "freak") s.flags.cut = 1;
  if (s.tier === 1 && s.rank === null && l >= total && total >= 2) s.flags.cut = 1;
  rosterSync(s);
  return s;
}
function ageOneYear(rng, s) {
  if ((s.flags.doubleActive ?? 0) > 0 && s.season - s.flags.doubleActive >= 1) {
    s.flags.doubleActive = 0;
    log(s, "Federacja ka\u017Ce wybra\u0107 kategori\u0119. Zwalniasz drugi pas, zostajesz przy swoim.");
  }
  if (s.rank !== 0) s.flags.doubleActive = 0;
  s.age += 1;
  s.season += 1;
  s.year += 1;
  s.clubSeasons += 1;
  if (s.age >= 31) {
    const k = s.age - 30;
    s.stats.cardio = clamp(s.stats.cardio - rng.int(1, 2) - Math.floor(k / 3), 1, 99);
    s.stats.stand = clamp(s.stats.stand - (rng.chance(0.5 + k * 0.05) ? 1 : 0), 1, 99);
    s.stats.wrest = clamp(s.stats.wrest - (rng.chance(0.4 + k * 0.05) ? 1 : 0), 1, 99);
    s.stats.chin = clamp(s.stats.chin - rng.int(0, 2), 1, 99);
    if (s.age >= 34) {
      s.stats.stand = clamp(s.stats.stand - rng.int(0, 2), 1, 99);
      s.stats.wrest = clamp(s.stats.wrest - rng.int(0, 1), 1, 99);
      s.stats.bjj = clamp(s.stats.bjj - rng.int(0, 1), 1, 99);
    }
  }
  if (s.age <= 32 && rng.chance(0.35)) s.stats.iq = clamp(s.stats.iq + 1, 1, 99);
  s.wear = clamp(s.wear - (s.age < 28 ? 3 : 1) - (hasBackroom(s, "clinic") ? 4 : 0), 0, 100);
  if (s.injury) {
    s.injury.seasons -= 1;
    if (s.injury.seasons <= 0) s.injury = null;
  }
  for (const sp of s.sponsors) sp.seasonsLeft -= 1;
  const hadLabs = hasLabs(s);
  s.sponsors = s.sponsors.filter((x) => x.seasonsLeft > 0);
  if (hadLabs && !hasLabs(s) && s.flags.labsAutoSupps) {
    s.backroom = { ...s.backroom ?? {}, supps: false };
    s.flags.labsAutoSupps = 0;
  }
  s.media = clamp(s.media - (s.media > 40 ? 3 : 1), 0, 100);
  s.contractSeasonsLeft -= 1;
  s.flags.debt = s.money < -15e3 ? 1 : 0;
  if ((s.flags.freakStigma ?? 0) > 0) s.flags.freakStigma -= 1;
}
function checkEnd(s) {
  if ((s.flags.farewellDone ?? 0) > 0) {
    const h = s.history[s.history.length - 1];
    return h?.result === "W" ? `Walka po\u017Cegnalna wygrana przed w\u0142asn\u0105 publiczno\u015Bci\u0105 w mie\u015Bcie ${s.profile.hometown}. Zdejmujesz r\u0119kawice na \u015Brodku klatki i k\u0142adziesz je na macie.` : h?.result === "D" ? `Walka po\u017Cegnalna ko\u0144czy si\u0119 remisem. Hala i tak wstaje, a ty k\u0142adziesz r\u0119kawice na \u015Brodku klatki.` : `Walka po\u017Cegnalna przegrana, ale hala w mie\u015Bcie ${s.profile.hometown} skanduje twoje nazwisko d\u0142ugo po werdykcie. R\u0119kawice zostaj\u0105 na macie.`;
  }
  if (s.age >= 40) return "Czterdziestka na karku. Komisja lekarska nie przed\u0142u\u017Ca ci licencji.";
  if (s.quick && s.age >= 35) return "Szybka kariera dobiega ko\u0144ca: 35 lat i czas zawiesi\u0107 r\u0119kawice.";
  if (s.wear >= 100) {
    const pick = (a) => a[(s.season * 7 + s.record.w * 3 + s.finishes.ko) % a.length];
    if (s.finishes.koLosses >= 6)
      return pick([
        "Rezonans g\u0142owy po ostatniej walce. Neurolog d\u0142ugo milczy, potem odk\u0142ada wyniki i m\xF3wi tylko: \u201EWystarczy\u201D. Komisja nie przed\u0142u\u017Ca licencji.",
        "Po kolejnym nokaucie lekarz komisji k\u0142adzie ci r\u0119k\u0119 na ramieniu. Szcz\u0119ka i g\u0142owa przyj\u0119\u0142y ju\u017C za du\u017Co. Licencja cofni\u0119ta."
      ]);
    if (s.finishes.subLosses >= 4)
      return pick([
        "Bark wyskakuje przy zwyk\u0142ej rozgrzewce. Trzecia operacja w karierze nie wchodzi w gr\u0119, ortopeda skre\u015Bla dalsze walki.",
        "\u0141okie\u0107 po d\u017Awigniach nie prostuje si\u0119 do ko\u0144ca. Lekarze m\xF3wi\u0105 jasno: albo klatka, albo sprawna r\u0119ka na reszt\u0119 \u017Cycia."
      ]);
    return pick([
      "Lekarze nie daj\u0105 ci zgody na kolejne walki. Za du\u017Co przyj\u0119tych cios\xF3w.",
      "Kolana, kr\u0119gos\u0142up, barki: wyniki bada\u0144 wygl\u0105daj\u0105 jak u pi\u0119\u0107dziesi\u0119ciolatka. Komisja lekarska nie podpisuje zgody na kolejny sezon.",
      "Okulista wykrywa uszkodzenie siatk\xF3wki. Jeden mocny cios i mo\u017Cesz straci\u0107 oko. Licencji ju\u017C nie dostaniesz.",
      "Organizm odmawia pos\u0142usze\u0144stwa: ob\xF3z zaczyna si\u0119 od zastrzyk\xF3w, a ko\u0144czy na rehabilitacji. Lekarz federacji m\xF3wi \u201Edo\u015B\u0107\u201D i tym razem to nie podlega dyskusji."
    ]);
  }
  if (s.finishes.koLosses >= 9 && s.proDebut) return "Dziewi\u0105ty nokaut w karierze. Komisja lekarska cofa licencj\u0119: szcz\u0119ka ju\u017C nie wytrzyma.";
  if ((s.flags.lastSeason ?? 0) > 0) return "Obieca\u0142e\u015B rodzinie, \u017Ce to ostatni rok. Dotrzymujesz s\u0142owa.";
  if (s.age >= 27 && s.finishes.koLosses >= 5 && s.history.slice(-4).filter((h) => h.result === "L" && h.method === "KO/TKO").length >= 3)
    return "Trzy nokauty w czterech walkach. Trener rzuca r\u0119cznik, tym razem za ca\u0142\u0105 karier\u0119.";
  if (s.money < -8e4 && s.age >= 24 && s.tier <= 1) return "D\u0142ugi ci\u0119 przygniot\u0142y. Wyje\u017Cd\u017Casz do pracy w Holandii i do klatki ju\u017C nie wracasz.";
  return null;
}
function contractPurse(tier, fed, rk, mult) {
  const [lo, hi] = TIER_PURSE[tier];
  const excl = isExclusiveFed(fed);
  return Math.round((lo + (hi - lo) * Math.max(0, rk) ** 1.6) * fedPay(fed) * mult * (excl ? EXCLUSIVE_BONUS : 1) / 500) * 500;
}
function contractFor(rng, s, tier, kind, startRank) {
  const rk = startRank === null ? 0 : startRank === 0 ? 1.2 : 1 - startRank / (RANK_SIZE[tier] + 1);
  const mediaF = 1 + s.media / 200;
  const hard = s.profile.difficulty === "hard" ? 0.85 : 1;
  const stigma = kind !== "freak" && (s.flags.freakStigma ?? 0) > 0 ? 0.8 : 1;
  const fed = tier === s.tier && kind === "stay" ? s.fed : fedFor(rng, tier, s.profile.region);
  const excl = kind !== "freak" && isExclusiveFed(fed);
  const purse = contractPurse(tier, fed, rk, mediaF * hard * stigma);
  return {
    id: uid(rng, "k"),
    tier,
    fed,
    exclusive: excl || void 0,
    kind,
    seasons: tier >= 2 ? rng.int(1, 2) : 1,
    fights: TIER_FIGHTS[tier],
    purse,
    winBonus: tier === 0 ? 0 : Math.round(purse * winRatio(tier, fed)),
    entryCost: TIER_ENTRY[tier],
    startRank,
    note: "",
    available: true
  };
}
var AMATEUR_MAX_AGE = 24;
function debutCheck(s) {
  const a = s.amRecord;
  const medals = medalCount(s);
  if (s.age < 18) return { ok: false, reason: `sko\u0144czone 18 lat (masz ${s.age})` };
  if (s.quick) return { ok: true };
  if (s.age >= AMATEUR_MAX_AGE) return { ok: true };
  if (a.w >= 5 && medals >= 1 || a.w >= 4 && ovr(s.stats) >= TIER_LEVEL[1] - 2 || a.w >= 10) return { ok: true };
  if (a.w < 5) return { ok: false, reason: `5 wygranych walk amatorskich (masz ${a.w})` };
  return { ok: false, reason: "medal z turnieju albo wyra\u017Anie lepsze umiej\u0119tno\u015Bci" };
}
function buildMarket(rng, s) {
  const contracts = [];
  const size = RANK_SIZE[s.tier];
  const cut = (s.flags.cut ?? 0) > 0;
  const seasonW = s.lastSummary?.w ?? 0;
  const stay = contractFor(rng, s, s.tier, "stay", s.rank);
  stay.note = s.tier === 0 ? amLevel(s) === 0 && !(s.flags.amPromote ?? 0) && (s.flags.amLocalSeasons ?? 0) < 2 ? "Jeszcze rok turniej\xF3w amatorskich, najpierw zawody wojew\xF3dzkie." : amLevel(s) === 0 ? "Awans z zawod\xF3w wojew\xF3dzkich: w tym roku Amatorski Puchar i Mistrzostwa Polski." : "Jeszcze rok turniej\xF3w amatorskich: Amatorski Puchar i Mistrzostwa Polski." : s.rank === 0 ? "Bronisz pasa. Mistrza si\u0119 nie wypuszcza." : "Kolejny rok w tej samej federacji.";
  if (cut) {
    stay.available = false;
    stay.reason = "federacja nie przed\u0142u\u017Ca z tob\u0105 kontraktu";
  }
  if (s.tier === 0 && !s.proDebut && s.age >= AMATEUR_MAX_AGE) {
    stay.available = false;
    stay.reason = `w wieku ${s.age} lat nikt ju\u017C nie zg\u0142asza ci\u0119 do turniej\xF3w amatorskich`;
  }
  contracts.push(stay);
  if (s.tier === 0 && s.proDebut) {
    const c = contractFor(rng, s, 1, "side", null);
    c.note = "Jeste\u015B ju\u017C zawodowcem, wi\u0119c wracasz na gale regionalne.";
    contracts.push(c);
    stay.available = false;
    stay.reason = "po debiucie zawodowym nie ma powrotu do amatorki";
  }
  if (s.tier === 0 && !s.proDebut) {
    const d = debutCheck(s);
    const c = contractFor(rng, s, 1, "promotion", null);
    if (d.ok) {
      c.note = "Debiut zawodowy na gali regionalnej. Pierwsze pieni\u0105dze za walk\u0119, rundy po pi\u0119\u0107 minut, bez kasku.";
      const amChamp = s.belts.some((b) => b.name === BELT_NAMES[0]);
      const medals = medalCount(s);
      const boost = amChamp ? 1.35 : medals >= 3 ? 1.2 : 1;
      if (boost > 1) {
        c.purse = Math.round(c.purse * boost / 100) * 100;
        c.winBonus = Math.round(c.purse * winRatio(c.tier, c.fed));
        c.note += amChamp ? " Mistrz Polski amator\xF3w: organizator p\u0142aci wi\u0119cej i od razu stawia ci\u0119 wy\u017Cej w karcie." : ` ${medals} ${pl(medals, "medal", "medale", "medali")} w amatorce ${pl(medals, "robi", "robi\u0105", "robi")} wra\u017Cenie: organizator dok\u0142ada do ga\u017Cy.`;
      }
    } else {
      c.available = false;
      c.reason = d.reason;
      c.note = "Debiut zawodowy. Organizator ju\u017C ci\u0119 kojarzy.";
    }
    contracts.push(c);
  }
  const eligible = s.tier >= 1 && s.tier < 4 && !cut && (s.rank === 0 || s.rank !== null && s.rank <= (s.tier >= 2 ? 2 : 3) || (currentManager(s)?.promo ?? 0) > 0 && s.rank !== null && s.rank <= (s.tier >= 2 ? 2 : 3) + (currentManager(s)?.promo ?? 0) || s.tier === 1 && s.media >= 45 && seasonW >= 2 || // wyższa federacja wypatruje wyraźnie lepszych od stawki
  ovr(s.stats) >= TIER_LEVEL[s.tier + 1] + 4 && seasonW >= 2);
  if (eligible) {
    const nt = s.tier + 1;
    const n = 2;
    const used = /* @__PURE__ */ new Set();
    for (let i = 0; i < n; i++) {
      const sr = rng.chance(0.3) && s.rank === 0 ? rng.int(6, RANK_SIZE[nt]) : null;
      const c = contractFor(rng, s, nt, "promotion", sr);
      if (used.has(c.fed)) continue;
      used.add(c.fed);
      c.note = (s.rank === 0 ? "Chc\u0105 sprawdzi\u0107, ile jest wart mistrz z ni\u017Cszej p\xF3\u0142ki." : "Krok wy\u017Cej: mocniejsi rywale i lepsze pieni\u0105dze.") + (FED_NOTES[c.fed] ? ` ${FED_NOTES[c.fed]}` : "");
      if (nt >= 3 && s.rep < 18) {
        c.available = false;
        c.reason = "lepsza reputacja w \u015Brodowisku";
      }
      contracts.push(c);
    }
  } else if (s.tier >= 1 && s.tier < 4 && !cut) {
    const c = contractFor(rng, s, s.tier + 1, "promotion", null);
    c.available = false;
    c.reason = s.rank === null ? "miejsce w rankingu" : `top ${s.tier >= 2 ? 2 : 3} rankingu (teraz jeste\u015B #${s.rank})`;
    c.note = "Wy\u017Csza federacja ci\u0119 obserwuje.";
    contracts.push(c);
  }
  if (s.tier >= 3 && !cut && rng.chance(s.rank !== null && s.rank <= 8 ? 0.6 : 0.35)) {
    const others = TIER_FEDS[s.tier].filter((f) => f !== s.fed && !contracts.some((c) => c.fed === f));
    if (others.length) {
      const hot = proStreak(s) >= 6 ? 3 : proStreak(s) >= 4 ? 1 : 0;
      const sr = s.rank === null ? hot ? RANK_SIZE[s.tier] - 2 * hot : null : clamp(s.rank + rng.int(-2, 3) - hot, 1, RANK_SIZE[s.tier]);
      const c = contractFor(rng, s, s.tier, "side", sr === 0 ? 1 : sr);
      const wasExcl = !!c.exclusive;
      void wasExcl;
      c.fed = rng.pick(others);
      c.exclusive = isExclusiveFed(c.fed) || void 0;
      const rkT = sr === null ? 0 : 1 - sr / (RANK_SIZE[s.tier] + 1);
      c.purse = Math.round(contractPurse(s.tier, c.fed, rkT, (1 + s.media / 200) * (s.profile.difficulty === "hard" ? 0.85 : 1)) * (1 + rng.next() * 0.15) / 500) * 500;
      c.winBonus = Math.round(c.purse * winRatio(s.tier, c.fed));
      c.note = `Transfer: ${sr === null ? "zaczynasz bez rankingu" : `startujesz z miejsca #${sr}`}. ${FED_NOTES[c.fed] ?? "Nowa federacja, nowi rywale."}`;
      contracts.push(c);
    }
  }
  if (s.tier >= 2 && !cut && s.rank !== 0 && s.contract.kind !== "freak" && s.proDebut && rng.chance(0.35)) {
    const lower = s.tier - 1;
    const c = contractFor(rng, s, lower, "demotion", rng.int(1, 2));
    c.star = true;
    c.purse = Math.round(Math.max(s.contract.purse, c.purse) * (1.15 + rng.next() * 0.1) / 500) * 500;
    c.winBonus = Math.round(c.purse * 0.5);
    c.seasons = 1;
    c.note = `Chc\u0105 ci\u0119 jako gwiazd\u0119: walki wieczoru, wi\u0119cej ni\u017C p\u0142ac\u0105 ci teraz i start z miejsca #${c.startRank}. Ale \u015Brodowisko powie, \u017Ce uciekasz od mocnych rywali: reputacja \u22125, a wygrane ni\u017Cej licz\u0105 si\u0119 mniej do legacy. Powr\xF3t wy\u017Cej tylko przez top rankingu.`;
    contracts.push(c);
  }
  if (cut && s.tier > 1) {
    const c = contractFor(rng, s, s.tier - 1, "demotion", rng.int(4, RANK_SIZE[s.tier - 1]));
    c.note = "Krok w ty\u0142, \u017Ceby si\u0119 odbudowa\u0107.";
    contracts.push(c);
  }
  if (cut && s.tier === 1) {
    let c = contractFor(rng, s, 1, "side", null);
    for (let i = 0; i < 5 && c.fed === s.fed; i++) c = contractFor(rng, s, 1, "side", null);
    if (c.fed === s.fed) c.fed = fedFor(rng, 1, rng.pick(VOIVODESHIPS.filter((v) => v !== s.profile.region)));
    c.note = "Tamta gala ci\u0119 nie chce, ta da ci jeszcze szans\u0119.";
    contracts.push(c);
  }
  if (s.tier >= 1 && (s.media >= 28 || rng.chance(0.1)) && rng.chance(s.freakFights > 0 ? 0.35 : 0.45)) {
    const fatigue = Math.pow(0.75, s.flags.freakSeasons ?? 0);
    const fans = (s.followers ?? 0) / 1e3;
    let purse = (3e4 + s.media * s.media * 40 + Math.min(3e5, fans * 300) + rng.int(0, 2e4)) * fatigue;
    if (s.tier <= 3) purse = Math.max(purse, s.contract.purse * (1.5 + rng.next() * 0.4));
    purse = Math.round(purse / 1e3) * 1e3;
    const lessThanSport = purse < s.contract.purse;
    contracts.push({
      id: uid(rng, "k"),
      tier: s.tier,
      fed: rng.pick(FREAK_FEDS),
      kind: "freak",
      seasons: 1,
      fights: 2,
      purse,
      winBonus: Math.round(purse * 0.3),
      entryCost: 0,
      startRank: null,
      note: lessThanSport ? "Raperzy, youtuberzy i celebryci. P\u0142ac\u0105 mniej ni\u017C twoja federacja, wi\u0119c to raczej zabawa i zasi\u0119gi ni\u017C interes. Sportowo rok w plecy." : (s.flags.freakSeasons ?? 0) > 0 ? "Znowu cyrk. Widownia ju\u017C ci\u0119 zna, wi\u0119c p\u0142ac\u0105 mniej ni\u017C ostatnio, ale wci\u0105\u017C wi\u0119cej ni\u017C sport." : "Raperzy, youtuberzy i celebryci. P\u0142ac\u0105 du\u017Co wi\u0119cej ni\u017C sport, ale sportowo to rok w plecy.",
      available: true
    });
  }
  void size;
  const clubs = [{ ...s.club }];
  const pool = CLUB_TEMPLATES.map((t, i) => ({ t, i })).filter(({ t, i }) => `c${i}` !== s.club.id && t.minTier <= s.tier + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const perQuality = {};
  for (const { t, i } of pool) {
    if (clubs.length >= 7) break;
    const n = perQuality[t.quality] ?? 0;
    if (n >= (t.quality <= 2 ? 1 : 2)) continue;
    perQuality[t.quality] = n + 1;
    clubs.push(makeClub(rng, i, s.profile.hometown));
  }
  clubs.sort((a, b) => a.id === s.club.id ? -1 : b.id === s.club.id ? 1 : a.quality - b.quality || a.cost - b.cost);
  const left = s.contractSeasonsLeft ?? 0;
  if (s.tier >= 1 && left > 0 && stay.available && s.contract.kind !== "freak") {
    stay.note = `Kontrakt trwa jeszcze ${left === 1 ? "rok" : `${left} ${pl(left, "rok", "lata", "lat")}`}. ${stay.note ?? ""}`.trim();
    stay.seasons = left;
    stay.underContract = true;
    for (const c of contracts) {
      if (c === stay || !c.available || c.kind === "promotion") continue;
      c.available = false;
      c.reason = `masz wa\u017Cny kontrakt jeszcze na ${left === 1 ? "rok" : `${left} ${pl(left, "rok", "lata", "lat")}`}`;
    }
  }
  const promiseBlocks = s.promises.some((p) => p.kind === "noPromotion" && p.untilSeason >= s.season - 1);
  const promo = contracts.findIndex(
    (c) => c.available && c.kind === "promotion" && (ovr(s.stats) >= TIER_LEVEL[c.tier] - 3 || s.tier === 0 && s.age >= 20) && !promiseBlocks
  );
  s.market = { contracts, clubs, pickedContract: promo >= 0 ? promo : contracts.findIndex((c) => c.available), pickedClub: 0 };
}
function clubAvailability(s, c) {
  if (c.id === s.club.id) return { ok: true };
  const t = CLUB_TEMPLATES[Number(c.id.slice(1))];
  if (t && t.minTier > s.tier && !(t.minTier === s.tier + 1 && s.rank !== null && s.rank <= 3)) return { ok: false, reason: "jeszcze ci\u0119 nie przyjm\u0105, za niski poziom" };
  if (c.cost > Math.max(0, s.money) + s.sponsors.reduce((a, b) => a + b.perSeason, 0) + 2e3) return { ok: false, reason: "nie sta\u0107 ci\u0119 na sk\u0142adki" };
  return { ok: true };
}
function toMarket(s0) {
  const s = clone(s0);
  withRng(s, (rng) => {
    const reason = checkEnd(s);
    if (reason) {
      endCareer(s, reason);
      return;
    }
    ageOneYear(rng, s);
    const reason2 = checkEnd(s);
    if (reason2) {
      endCareer(s, reason2);
      return;
    }
    buildMarket(rng, s);
    rosterSync(s);
    s.phase = "market";
  });
  return s;
}
function pickContract(s0, idx) {
  const s = clone(s0);
  if (s.market && s.market.contracts[idx]?.available) s.market.pickedContract = idx;
  return s;
}
function pickClub(s0, idx) {
  const s = clone(s0);
  if (s.market && clubAvailability(s, s.market.clubs[idx]).ok) s.market.pickedClub = idx;
  return s;
}
function marketWarnings(s) {
  const out = [];
  if (!s.market) return out;
  const c = s.market.contracts[s.market.pickedContract];
  const club = s.market.clubs[s.market.pickedClub];
  for (const p of s.promises) {
    if (p.untilSeason < s.season - 1) continue;
    if (p.kind === "noPromotion" && c?.kind === "promotion") out.push(`\u0141amiesz s\u0142owo. ${p.text}`);
    if (p.kind === "stayClub" && club && club.id !== s.club.id) out.push(`\u0141amiesz s\u0142owo. ${p.text}`);
  }
  if (club && club.id !== s.club.id && club.cost > 0) {
    const living = livingCost(s.age + 1);
    const purses = c ? (c.purse + c.winBonus * 0.5) * c.fights * (1 - (currentManager(s)?.cut ?? 0)) : 0;
    const left = s.money + s.sponsors.reduce((a, b) => a + b.perSeason, 0) + purses - club.cost - living - (c?.entryCost ?? 0) - s.loans.reduce((a, l) => a + l.installment, 0);
    if (left < 0)
      out.push(`Uwaga na bud\u017Cet: ze sk\u0142adkami ${club.cost.toLocaleString("pl-PL")} z\u0142 i kosztami \u017Cycia na koniec roku zabraknie ci ok. ${Math.round(-left / 1e3).toLocaleString("pl-PL")} tys. z\u0142. Grozi kredyt albo rok przerwy.`);
  }
  if (c?.kind === "freak")
    out.push(
      `Freak fight: du\u017Ce pieni\u0105dze i zasi\u0119gi, ale ${s.tier > 0 && s.rank !== null ? "wypadasz z rankingu federacji, " : ""}zamiast obozu masz konferencje (umiej\u0119tno\u015Bci spadn\u0105), a przez dwa lata federacje zap\u0142ac\u0105 ci mniej.`
    );
  return out;
}
var CONTRACT_ASKS = [
  { id: "purse", label: "Wy\u017Csza ga\u017Ca", desc: "+15% za ka\u017Cd\u0105 walk\u0119" },
  { id: "bonus", label: "Premia za wygran\u0105", desc: "premia \xD71,6, p\u0142ac\u0105 za wyniki" },
  { id: "signing", label: "Bonus za podpis", desc: "jednorazowy zastrzyk got\xF3wki" }
];
function contractNegoChance(s, c, ask) {
  const mg = currentManager(s);
  let ch = 35 + (mg?.negotiate ?? 0) + s.media / 4 + repNego(s) + Math.max(0, s.streak) * 3 + (followersOf(s) >= 5e4 ? 5 : 0) - c.tier * 4;
  if (c.kind === "promotion" && s.rank !== null && s.rank <= 2) ch += 10;
  if (c.kind === "freak") ch += 10;
  if (ask === "bonus") ch += 12;
  if (ask === "signing") ch -= 5;
  return Math.round(clamp(ch, 10, 80));
}
function signingAmount(c) {
  return Math.max(2e3, Math.round(c.purse * 1.2 / 1e3) * 1e3);
}
function negotiateContract(s0, idx, ask) {
  const m0 = s0.market;
  if (!m0 || m0.negotiated || !m0.contracts[idx] || m0.contracts[idx].underContract) return s0;
  const s = clone(s0);
  const m = s.market;
  const c = m.contracts[idx];
  withRng(s, (rng) => {
    const ok = rng.chance(contractNegoChance(s0, m0.contracts[idx], ask) / 100);
    m.negotiated = true;
    if (ok) {
      if (ask === "purse") c.purse = Math.round(c.purse * 1.15 / 100) * 100;
      if (ask === "bonus") c.winBonus = Math.round(c.winBonus * 1.6 / 100) * 100;
      if (ask === "signing") c.signing = signingAmount(c);
      const what = ask === "purse" ? `ga\u017Ca ${c.purse.toLocaleString("pl-PL")} z\u0142 za walk\u0119` : ask === "bonus" ? `premia za wygran\u0105 ${c.winBonus.toLocaleString("pl-PL")} z\u0142` : `bonus za podpis ${c.signing.toLocaleString("pl-PL")} z\u0142`;
      c.nego = { ask, ok: true, text: `Federacja si\u0119 zgadza: ${what}. Dopisuj\u0105 to d\u0142ugopisem nad podpisem.` };
    } else if (rng.chance(ask === "purse" ? 0.4 : ask === "signing" ? 0.3 : 0.2)) {
      c.purse = Math.round(c.purse * 0.94 / 100) * 100;
      c.nego = { ask, ok: false, text: `Federacja si\u0119 obra\u017Ca: \u201E${ask === "signing" ? "Pieni\u0105dze za sam podpis? Chyba \u017Cartujesz" : ask === "bonus" ? "Premie mamy takie same dla wszystkich" : "Takie stawki to nie u nas"}\u201D. Nowa wersja umowy ma ga\u017C\u0119 ni\u017Csz\u0105 o 6%.` };
    } else {
      c.nego = { ask, ok: false, text: "Federacja nie ust\u0119puje. Warunki zostaj\u0105, jakie by\u0142y." };
    }
  });
  return s;
}
function setJob(s0, job) {
  const s = clone(s0);
  s.job = job;
  return s;
}
var DONATIONS = [1e5, 3e5, 1e6];
function foundationOpen(s) {
  return s.tier >= 3 || s.money >= 25e4;
}
function foundationLegacy(s) {
  return Math.min(450, Math.round((s.flags.donated ?? 0) / 5e3));
}
function donate(s0, amount) {
  if (!foundationOpen(s0) || s0.money < amount || s0.flags.donatedYear === s0.season) return s0;
  const s = clone(s0);
  s.money -= amount;
  s.flags.donated = (s.flags.donated ?? 0) + amount;
  s.flags.donatedYear = s.season;
  s.rep = clamp(s.rep + (amount >= 1e6 ? 5 : amount >= 3e5 ? 3 : 2), 0, 100);
  log(s, `Fundacja: przekazujesz ${amount.toLocaleString("pl-PL")} z\u0142 na sale treningowe dla dzieci.`);
  return s;
}
function coachPerks(s) {
  const c = coachOf(s);
  if (!c.corner) return [];
  const { from, bonus } = c.corner;
  return [{ id: "coach", name: "Naro\u017Cnik", desc: "", req: { stat: "iq", min: 0 }, bonus: (_o, r) => r >= from ? bonus : 0 }];
}
function setCoach(s0, id) {
  if (!COACHES.some((c) => c.id === id) || !coachOpen(s0)) return s0;
  const s = clone(s0);
  s.coach = id;
  return s;
}
function setPerks(s0, ids) {
  const s = clone(s0);
  s.perks = ids.filter((id) => PERKS.some((p) => p.id === id && perkUnlocked(s, p))).slice(0, MAX_PERKS);
  return s;
}
function setSocial(s0, mode) {
  const s = clone(s0);
  s.social = mode;
  if (s.followers === void 0) s.followers = followersOf(s0);
  return s;
}
function clearCallFlags(s) {
  s.rematchOpp = null;
  s.flags.doubleActive = 0;
  s.flags.titleCall = 0;
  s.flags.callUp = 0;
  s.flags.superCall = 0;
  s.flags.interim = 0;
  s.flags.superLoss = 0;
}
function confirmMarket(s0) {
  const s = clone(s0);
  const m = s.market;
  if (!m) return s;
  const c = m.contracts[m.pickedContract];
  const club = m.clubs[m.pickedClub];
  if (!c) return s;
  if (c.kind === "freak") s.flags.farewell = 0;
  for (const w of marketWarnings(s)) {
    if (w.startsWith("\u0141amiesz")) {
      s.brokenPromises++;
      s.rep = clamp(s.rep - 6, 0, 100);
      s.relations -= 2;
      log(s, `Z\u0142amane s\u0142owo. ${w.replace("\u0141amiesz s\u0142owo. ", "")}`);
    }
  }
  s.promises = s.promises.filter((p) => p.untilSeason >= s.season);
  if (club && club.id !== s.club.id) {
    s.club = club;
    s.clubSeasons = 0;
    log(s, `Zmiana klubu: ${club.name} (${club.city}).`);
  }
  const prevTier = s.tier;
  if (c.kind !== "freak") {
    if (c.tier !== s.tier || c.fed !== s.fed && c.kind === "side") clearCallFlags(s);
    if (c.tier !== s.tier) {
      s.tier = c.tier;
      s.rank = c.startRank;
      s.titleDefenses = 0;
      if (prevTier === 0) log(s, `Przechodzisz na zawodowstwo: ${c.fed}.`);
      else if (c.tier > prevTier) log(s, `Awans: ${c.fed}.`);
      else if (c.star) {
        s.rep = clamp(s.rep - 5, 0, 100);
        s.flags.starDeals = (s.flags.starDeals ?? 0) + 1;
        log(s, `Gwiazda ni\u017Cszej ligi: ${c.fed}. Lepsze pieni\u0105dze, \u0142atwiejsi rywale.`);
      } else log(s, `Krok w ty\u0142: ${c.fed}.`);
    } else if (c.fed !== s.fed && c.kind === "side") {
      s.rank = c.startRank;
      s.titleDefenses = 0;
      log(s, `Transfer: ${c.fed}.`);
    }
    s.fed = c.fed;
  }
  if (c.kind === "freak" && !s.flags.freakLogged) {
    s.flags.freakLogged = 1;
  }
  if (c.kind === "freak") {
    clearCallFlags(s);
    s.flags.freakSeasons = (s.flags.freakSeasons ?? 0) + 1;
    s.flags.freakStigma = 2;
    if (s.tier > 0 && s.rank !== null) {
      s.rank = null;
      log(s, `${s.fed} skre\u015Bla ci\u0119 z rankingu po przej\u015Bciu do freak fight\xF3w.`);
    }
  }
  if (c.signing) {
    s.money += c.signing;
    s.totalEarned += c.signing;
    log(s, `Bonus za podpis: ${c.signing.toLocaleString("pl-PL")} z\u0142 (${c.fed.split(" \u2013 ")[0]}).`);
  }
  s.contract = { ...c, signing: void 0, nego: void 0, underContract: void 0 };
  if (s.rank !== 0) s.titleDefenses = 0;
  s.contractSeasonsLeft = c.seasons;
  if (s.tier > s.peakTier) {
    s.peakTier = s.tier;
    s.peakRank = s.rank;
  } else if (s.tier === s.peakTier && s.rank !== null && (s.peakRank === null || s.rank < s.peakRank)) s.peakRank = s.rank;
  s.flags.cut = 0;
  s.market = null;
  s.run = null;
  s.phase = "training";
  withRng(s, (rng) => ensureRoster(rng, s));
  return s;
}
function safeChoice(choices) {
  const score = (c) => {
    const all = [c.effects, c.success, c.fail].filter(Boolean);
    let v = 0;
    for (const e of all) {
      if (e.promise) v -= 1e3;
      if (e.loan) v -= 1e3;
      if (e.sponsor) v -= 200;
      if (e.flag) v -= 50;
      if (e.injury) v -= 300;
      if (e.money && e.money < 0) v += e.money / 500;
      if (e.wear) v -= e.wear * 3;
      if (e.rep) v += e.rep;
      if (e.form) v += e.form;
    }
    if (c.chance !== void 0 || c.test) v -= 20;
    return v;
  };
  let best = 0;
  choices.forEach((c, i) => {
    if (score(c) > score(choices[best])) best = i;
  });
  return best;
}
function quickAmateur(s0) {
  let s = s0;
  const weakest2 = (x) => [...STAT_KEYS].sort((a, b) => x.stats[a] - x.stats[b])[0];
  for (let guard = 0; guard < 600 && s.phase !== "ended"; guard++) {
    if (s.phase === "market" && s.age >= 18 && s.market?.contracts.some((c) => c.available && c.kind === "promotion")) break;
    switch (s.phase) {
      case "training":
        s = doTraining(s, weakest2(s));
        break;
      case "budget":
        if (s.money + budgetBalance(s) < 0 && loanOffer(s)) s = takeLoan(s);
        s = canStartSeason(s) ? startSeason(s) : takeBreakYear(s);
        break;
      case "event":
        s = s.event.picked === void 0 ? chooseEvent(s, safeChoice(s.event.choices)) : continueAfterEvent(s);
        break;
      case "season": {
        const run = s.run;
        const cur = run.fights[run.fights.length - 1];
        if (run.invite) s = acceptInvite(s);
        else if (run.weigh) s = weighIn(s, "pay");
        else if (run.post) s = postAnswer(s, run.post.options[0].key);
        else if (run.press) s = pressAnswer(s, "calm");
        else if (run.offer) s = acceptOffer(s);
        else if (cur?.sim.pending) s = decide(s, [...cur.sim.pending.options].sort((a, b) => b.chance - a.chance)[0].key);
        else if (run.done) s = toSummary(s);
        else s = seasonSkip(s);
        break;
      }
      case "summary":
        s = toMarket(s);
        break;
      case "market": {
        const ci = s.market.contracts.findIndex((c) => c.available && c.kind !== "freak");
        s = pickContract(s, Math.max(0, ci));
        s = confirmMarket(s);
        break;
      }
    }
  }
  s = clone(s);
  s.flags.quickAm = 1;
  s.promises = [];
  s.brokenPromises = 0;
  s.injury = null;
  s.loans = [];
  if (s.money < 1e3) s.money = 1e3;
  s.wear = Math.min(s.wear, 10);
  if (s.market) {
    const pro2 = s.market.contracts.filter((c) => c.available && c.kind === "promotion");
    if (pro2.length) {
      s.market.contracts = pro2;
      s.market.pickedContract = 0;
    }
  }
  log(s, `Amatorka w skr\xF3cie: ${recStr(s.amRecord)}, ${s.medals.gold + s.medals.silver + s.medals.bronze} ${pl(s.medals.gold + s.medals.silver + s.medals.bronze, "medal", "medale", "medali")}.`);
  return s;
}
function quickNeedsBudget(s) {
  if (!s.quick) return true;
  if (s.shadyDeal?.status === "open") return true;
  if (!canStartSeason(s) || s.money + budgetBalance(s) < 0) return true;
  if ((s.flags.quickBudgetTier ?? -1) !== s.tier) return true;
  return false;
}
function syncRival(rng, s) {
  const rv = s.peers.find((p) => p.id === s.rivalId);
  if (!rv) return null;
  if (rv.retired) {
    if (s.flags.rivalGone) return null;
    s.flags.rivalGone = 1;
    log(s, `${rv.firstName} ${rv.lastName} ko\u0144czy karier\u0119 (${h2hWords(rv.h2h.w, rv.h2h.l, rv.h2h.d)}).`);
    return `${rv.lastName} og\u0142asza koniec kariery. Na zawsze zostaje tak, \u017Ce ${h2hWords(rv.h2h.w, rv.h2h.l, rv.h2h.d)}.`;
  }
  const before = rv.tier;
  const gap = ovr(s.stats) - ovr(rv.stats);
  if (gap > 6) for (const k of STAT_KEYS) rv.stats[k] = clamp(rv.stats[k] + rng.int(1, 3), 5, 99);
  if (rv.tier < s.tier && rng.chance(0.55)) {
    if (rv.tier === 0) rv.record = { w: 0, l: 0, d: 0 };
    rv.tier++;
    rv.rank = rng.int(4, RANK_SIZE[rv.tier]);
  } else if (rv.tier > s.tier && s.tier >= 1 && rv.tier - 1 >= 1 && rng.chance(0.25)) {
    rv.tier--;
    rv.rank = rng.int(1, 6);
  }
  if (rv.tier !== before) {
    const up = rv.tier > before;
    log(s, `Rywal ${rv.lastName}: ${up ? "awans" : "spadek"} do poziomu \u201E${TIER_NAMES[rv.tier]}\u201D.`);
    return rv.tier === s.tier ? `${rv.lastName} ${up ? "awansuje" : "wraca"} do twojej ligi. Pr\u0119dzej czy p\xF3\u017Aniej znowu staniecie naprzeciw siebie.` : `Tw\xF3j rywal ${rv.lastName} ${up ? "awansuje" : "spada"} na poziom \u201E${TIER_NAMES[rv.tier]}\u201D.`;
  }
  if (rv.tier === s.tier && rv.rank === 0) return `${rv.lastName} jest mistrzem twojej federacji. Je\u015Bli chcesz pasa, musisz przej\u015B\u0107 przez niego.`;
  if (rv.tier === s.tier && rv.rank !== null && rv.rank <= 5) return `${rv.lastName} jest w czo\u0142\xF3wce rankingu (#${rv.rank}). Wasza walka wisi w powietrzu.`;
  return null;
}
function proStreak(s) {
  let n = 0;
  for (let i = s.history.length - 1; i >= 0; i--) {
    const h = s.history[i];
    if (h.amateur || h.freak) continue;
    if (h.result !== "W") break;
    n++;
  }
  return n;
}
function retireBonus(s) {
  if (!s.proDebut || s.age < 30 || s.tier < 2) return null;
  const lines = [];
  let pts = 0;
  const champ = s.rank === 0 && s.tier >= 1 && s.contract.kind !== "freak";
  if (champ) {
    const v = [0, 40, 110, 260, 600][s.tier];
    pts += v;
    lines.push(`Odchodzisz jako panuj\u0105cy mistrz: +${v}`);
  }
  const streak = proStreak(s);
  if (streak >= 3) {
    const v = Math.round(TIER_WIN_PTS[s.tier] * Math.min(streak, 8) * 0.8);
    pts += v;
    lines.push(`Seria ${streak} wygranych na koniec: +${v}`);
  }
  if (s.wear < 60 && s.age < 38 && (champ || streak >= 3)) {
    pts += 40;
    lines.push("Schodzisz zdrowy, zanim zdrowie zdecyduje za ciebie: +40");
  }
  if (!pts) return null;
  const sp = START_PROFILES[s.profile.start].mult ?? 0;
  const diff = DIFFICULTY[s.profile.difficulty].mult;
  const total = Math.round(pts * sp * diff);
  const title = champ && streak >= 3 ? "Odszed\u0142 niepokonany" : champ ? "Odszed\u0142 jako mistrz" : "Odszed\u0142 na szczycie";
  return { title, pts: total, lines };
}
function retire(s0) {
  const s = clone(s0);
  const top = retireBonus(s);
  endCareer(s, top ? `${top.title}. Sam decydujesz, \u017Ce to koniec, i schodzisz z klatki w najlepszym momencie.` : "Sam decydujesz, \u017Ce to koniec. Schodzisz z klatki na w\u0142asnych warunkach.");
  if (top && s.ending) {
    s.ending.top = top;
    s.ending.legacy += top.pts;
    s.ending.verdictDesc += ` ${top.title === "Odszed\u0142 niepokonany" ? "Nikt nie zd\u0105\u017Cy\u0142 zabra\u0107 ci pasa ani serii." : "Kibice zapami\u0119taj\u0105 ci\u0119 u szczytu, a nie na r\xF3wni pochy\u0142ej."}`;
  }
  return s;
}
var TIER_WIN_PTS = [3, 8, 20, 45, 90];
var BELT_PTS = [40, 120, 320, 700, 1600];
function legacyScore(s) {
  let pts = 0;
  for (const h of s.history) {
    if (s.quick && h.amateur) continue;
    if (h.result === "W") {
      let p = h.freak ? 10 : h.amateur ? 2 : TIER_WIN_PTS[h.tier];
      if (h.method === "KO/TKO" || h.method === "Poddanie") p *= 1.3;
      if (h.title) p *= 1.5;
      pts += p;
    } else if (h.result === "D") pts += TIER_WIN_PTS[h.tier] * 0.3;
    else if (h.result === "L" && h.age >= 34 && !h.amateur) pts -= TIER_WIN_PTS[h.tier] * 0.6;
  }
  const beltCount = {};
  for (const b of s.belts) {
    const t = Math.max(0, BELT_NAMES.findIndex((n) => b.name.startsWith(n)));
    if (s.quick && t === 0) continue;
    const k = beltCount[t] ?? 0;
    beltCount[t] = k + 1;
    pts += BELT_PTS[t] * (k === 0 ? 1 : t === 0 ? 0.2 : t <= 2 ? 0.25 : 0.6);
  }
  pts += (s.flags.interimBelts ?? 0) * (BELT_PTS[Math.min(4, s.peakTier)] ?? 0) * 0.25;
  if (!s.quick) pts += s.medals.gold * 12 + s.medals.silver * 6 + s.medals.bronze * 4;
  pts += [0, 40, 120, 400, 850][s.peakTier] ?? 0;
  pts += Math.min(400, s.totalEarned / 25e3);
  pts += s.media * 2;
  pts += (s.rep - 30) * 2;
  pts -= s.brokenPromises * 20;
  pts += foundationLegacy(s);
  pts += [0, 60, 160, 320, 550][s.academy ?? 0];
  const rv = s.peers.find((p) => p.id === s.rivalId);
  if (rv) pts += rv.h2h.w * 15 - rv.h2h.l * 5;
  const sp = START_PROFILES[s.profile.start].mult ?? 0;
  const diff = DIFFICULTY[s.profile.difficulty].mult;
  return Math.max(0, Math.round(pts * sp * diff));
}
function rawLegacy(s) {
  const sp = START_PROFILES[s.profile.start].mult;
  if (!sp) return 0;
  return legacyScore(s);
}
function verdictFor(s) {
  const worldBelts = s.belts.filter((b) => b.name.startsWith(BELT_NAMES[4])).length;
  const euBelts = s.belts.filter((b) => b.name.startsWith(BELT_NAMES[3])).length;
  const plBelts = s.belts.filter((b) => b.name.startsWith(BELT_NAMES[2])).length;
  const w = s.record.w;
  const l = s.record.l;
  if (worldBelts >= 1 && Math.max(s.flags.worldMaxDef ?? 0, s.tier === 4 ? s.titleDefenses : 0) >= 2) return { verdict: "Legenda \u015Bwiatowego MMA", desc: "Pas \u015Bwiatowej federacji i kolejne obrony. O takich karierach kr\u0119ci si\u0119 dokumenty." };
  if (worldBelts >= 1) return { verdict: "Mistrz \u015Bwiata", desc: "By\u0142e\u015B na samym szczycie. Pasa UFL nikt ci ju\u017C nie zabierze." };
  if (s.peakTier === 4 && s.peakRank !== null && s.peakRank <= 5) return { verdict: "Puka\u0142 do bram", desc: "Top 5 na \u015Bwiecie. Zabrak\u0142o jednej, mo\u017Ce dw\xF3ch wygranych." };
  if (euBelts >= 1) return { verdict: "Kr\xF3l Europy", desc: "Pas mistrza Europy. W Polsce poznaj\u0105 ci\u0119 na ka\u017Cdej stacji benzynowej." };
  if (s.freakFights >= 4 && s.freakFights > w / 3) return { verdict: "Kr\xF3l freak fight\xF3w", desc: "Sportowo r\xF3\u017Cnie, ale konto i zasi\u0119gi si\u0119 zgadzaj\u0105." };
  if (plBelts >= 2) return { verdict: "Ikona polskiej klatki", desc: "Kilka razy mistrz Polski. W twoim mie\u015Bcie kto\u015B namalowa\u0142 mural." };
  if (plBelts === 1) return { verdict: "Mistrz Polski", desc: "Pas krajowej federacji. Z takiej kariery mo\u017Cna by\u0107 dumnym." };
  if (s.peakTier >= 3) return { verdict: "Europejski wyjadacz", desc: "Bi\u0142e\u015B si\u0119 z najlepszymi w Europie. Niewielu mo\u017Ce to o sobie powiedzie\u0107." };
  if (s.peakTier >= 2 && w > l) return { verdict: "Solidny zawodnik", desc: "Pewny punkt krajowych gal. Kibice pami\u0119taj\u0105 twoje walki." };
  if (s.peakTier >= 2) return { verdict: "Wieczny talent", desc: "Papiery by\u0142y, ale na najwy\u017Cszym poziomie czego\u015B zabrak\u0142o." };
  if (s.peakTier === 1) return { verdict: "Bohater regionalnych gal", desc: "Pe\u0142ne hale OSiR i autografy dla dzieciak\xF3w z osiedla." };
  if (s.belts.length) return { verdict: "Mistrz Polski amator\xF3w", desc: "Z\u0142oto mistrzostw zosta\u0142o w gablocie. Na zawodowstwo ju\u017C nie starczy\u0142o." };
  return { verdict: "Amator z pasj\u0105", desc: "Nie ka\u017Cdy zostaje zawodowcem. Ale kto spr\xF3bowa\u0142, ten wie, jak to smakuje." };
}
function careerStory(s) {
  const parts = [];
  const first = s.history[0];
  const belts = s.belts.length;
  const fights = s.history.length;
  parts.push(`${Math.max(s.season - 1, s.seasons.length)} ${pl(Math.max(s.season - 1, s.seasons.length), "rok", "lata", "lat")}, ${fights} ${pl(fights, "walka", "walki", "walk")}.`);
  if (s.amRecord.w + s.amRecord.l + s.amRecord.d > 0) {
    const m = medalCount(s);
    parts.push(`W amatorce ${recStr(s.amRecord)}${m ? ` i ${m} ${pl(m, "medal", "medale", "medali")}` : ""}.`);
  }
  if (s.proDebut) parts.push(`Zawodowo ${recStr(s.record)}, debiut w wieku ${s.proDebut.age} lat.`);
  if (belts) parts.push(`${belts} ${pl(belts, "tytu\u0142", "tytu\u0142y", "tytu\u0142\xF3w")} w gablocie.`);
  if (s.finishes.ko + s.finishes.sub > s.record.w * 0.6 && s.record.w > 5) parts.push("Ko\u0144czy\u0142e\u015B walki przed czasem jak ma\u0142o kto.");
  const bestPeer = s.peers.find((p) => p.id === s.rivalId) ?? s.peers.filter((p) => p.metCount > 0).sort((a, b) => b.metCount - a.metCount)[0];
  if (bestPeer) parts.push(`Odwieczny rywal: ${bestPeer.firstName} ${bestPeer.lastName}, bilans ${bestPeer.h2h.w}-${bestPeer.h2h.l}.`);
  const mgr = currentManager(s);
  if (mgr) parts.push(`Mened\u017Cer: ${mgr.name}.`);
  if (s.freakFights) parts.push(`Freak fight\xF3w: ${s.freakFights}.`);
  if (s.academy) parts.push(`Po karierze zostaje ${academyName(s)}: ${ACADEMY_LEVELS[s.academy - 1].name}.`);
  if (!first) parts.push("Kariera sko\u0144czy\u0142a si\u0119, zanim na dobre si\u0119 zacz\u0119\u0142a.");
  return parts.join(" ");
}
function endCareer(s, reason) {
  const v = verdictFor(s);
  s.ending = { reason, verdict: v.verdict, verdictDesc: v.desc, legacy: legacyScore(s), story: careerStory(s) };
  if ((s.flags.farewellDone ?? 0) > 0) {
    const h = s.history[s.history.length - 1];
    const won = h?.result === "W";
    const base = [0, 30, 80, 180, 400][s.tier] ?? 30;
    const pts = Math.round((won ? base : base * 0.4) * (START_PROFILES[s.profile.start].mult ?? 0) * DIFFICULTY[s.profile.difficulty].mult);
    s.ending.top = { title: won ? "Po\u017Cegnanie jak z filmu" : "Po\u017Cegnanie z honorem", pts, lines: [won ? `Wygrana walka po\u017Cegnalna: +${pts}` : `Walka po\u017Cegnalna przed w\u0142asn\u0105 publiczno\u015Bci\u0105: +${pts}`] };
    s.ending.legacy += pts;
  }
  log(s, `Koniec kariery w wieku ${s.age} lat.`);
  s.phase = "ended";
}
function tierLabel(t) {
  return TIER_NAMES[t];
}
function testPreview(stat, s) {
  const p = chanceFrom(s.stats[stat], TIER_LEVEL[s.tier] + 6);
  return { p, dist: distFrom(p) };
}
function momentTone(m) {
  return m.tone;
}
function rankingTable(s) {
  const tier = s.tier;
  if (tier === 0) return [];
  const size = RANK_SIZE[tier];
  const rows = [];
  const ro = rosterFor(s);
  if (ro) {
    const list = [...ro.list].sort((a, b) => a.rank - b.rank).map((f) => ({ rank: f.rank, name: `${f.firstName} ${f.lastName}`, record: recStr(f.record), flag: f.flag, country: f.country, met: f.h2h.w + f.h2h.l + f.h2h.d > 0 ? `${f.h2h.w}-${f.h2h.l}` : void 0 }));
    const mine = s.rank;
    const seq = [...list];
    if (mine !== null && mine <= size) seq.splice(mine, 0, null);
    for (let r = 0; r <= size; r++) {
      const x = seq[r];
      if (x) rows.push({ ...x, rank: r });
      else rows.push({ rank: r, name: `${s.profile.firstName} ${s.profile.lastName}`, record: recStr(s.record), flag: "\u{1F1F5}\u{1F1F1}", me: true });
    }
  } else {
    const rng = createRng((s.createdAt ^ s.season * 7919 ^ tier * 104729) >>> 0);
    for (let r = 0; r <= size; r++) {
      const o = generateOpponent(rng, tier, r, false);
      rows.push({ rank: r, name: `${o.firstName} ${o.lastName}`, record: recStr(o.record), flag: o.flag, country: o.country });
    }
  }
  for (const p of s.peers) {
    if (p.retired || p.tier !== tier || p.rank === null || p.rank > size) continue;
    rows[p.rank] = { rank: p.rank, name: `${p.firstName} ${p.lastName}`, record: recStr(p.record), flag: "\u{1F1F5}\u{1F1F1}", peer: true };
  }
  if (s.rank !== null && s.rank <= size) {
    rows[s.rank] = { rank: s.rank, name: `${s.profile.firstName} ${s.profile.lastName}`, record: recStr(s.record), flag: "\u{1F1F5}\u{1F1F1}", me: true };
  }
  return rows;
}
function afterPaths(s) {
  const n = s.profile.lastName;
  const town = s.profile.hometown;
  const champ = s.belts.length > 0;
  const fans = s.followers ?? 0;
  const club = s.club?.name ?? "swoim klubie";
  const list = [
    {
      key: "coach",
      title: "Trener",
      icon: "users",
      desc: `Zostajesz na sali w klubie ${club} i prowadzisz m\u0142odych.`,
      epilogue: `Pi\u0119\u0107 lat p\xF3\u017Aniej w naro\u017Cniku stoi trener ${n}. ${champ ? "Na \u015Bcianie wisi tw\xF3j pas, a pod nim zdj\u0119cie szesnastolatka w za du\u017Cych r\u0119kawicach." : "Uczysz tego, czego sam nauczy\u0142e\u015B si\u0119 za p\xF3\u017Ano."} Jeden z twoich ch\u0142opak\xF3w w\u0142a\u015Bnie podpisa\u0142 pierwszy zawodowy kontrakt.`
    },
    {
      key: "academy",
      title: "W\u0142asna akademia",
      icon: "home",
      desc: `Otwierasz klub pod swoim nazwiskiem w mie\u015Bcie ${town}.`,
      locked: s.academy || s.totalEarned >= 25e4 ? void 0 : "potrzeba 250 tys. z\u0142 zarobionych w karierze",
      epilogue: `Akademia ${n} w mie\u015Bcie ${town} ma dzi\u015B trzysta os\xF3b na zapisach i list\u0119 oczekuj\u0105cych na grup\u0119 dzieci. ${champ ? "Rodzice przyprowadzaj\u0105 syn\xF3w \u201Edo tego od pasa\u201D." : "Nikt nie pyta o tw\xF3j rekord, wszyscy pytaj\u0105 o grafik."}`
    },
    {
      key: "commentator",
      title: "Komentator",
      icon: "mic",
      desc: "Siadasz przy stoliku komentatorskim najwi\u0119kszej federacji w kraju.",
      locked: s.media >= 40 ? void 0 : "potrzeba rozpoznawalno\u015Bci w mediach (40+)",
      epilogue: `\u201ETu si\u0119 ko\u0144czy ta walka!\u201D \u2014 tw\xF3j okrzyk zna ca\u0142a Polska. ${n} przy stoliku komentatorskim to dzi\u015B marka sama w sobie, a zawodnicy prosz\u0105 ci\u0119 o rozbi\xF3r swoich walk.`
    },
    {
      key: "promoter",
      title: "Promotor gal",
      icon: "ticket",
      desc: "Zak\u0142adasz w\u0142asn\u0105 federacj\u0119 i sam uk\u0142adasz karty walk.",
      locked: s.totalEarned >= 8e5 ? void 0 : "potrzeba 800 tys. z\u0142 zarobionych w karierze",
      epilogue: `Twoja federacja robi cztery gale rocznie, a na konferencjach to ty uspokajasz zawodnik\xF3w. Czasem \u0142apiesz si\u0119 na tym, \u017Ce negocjujesz z kim\u015B dok\u0142adnie tak, jak kiedy\u015B negocjowano z tob\u0105.`
    },
    {
      key: "creator",
      title: "Tw\xF3rca internetowy",
      icon: "star",
      desc: "Podcast, kana\u0142 i walki pokazowe dla zasi\u0119g\xF3w.",
      locked: fans >= 8e4 ? void 0 : "potrzeba 80 tys. obserwuj\u0105cych",
      epilogue: `Tw\xF3j podcast \u201EPo gongu\u201D ma milion wy\u015Bwietle\u0144 miesi\u0119cznie. Najch\u0119tniej ogl\u0105dany odcinek to ten, w kt\xF3rym opowiadasz, jak w wieku 16 lat mama wyjmowa\u0142a pieni\u0105dze z koperty na pierwsze r\u0119kawice.`
    },
    {
      key: "firefighter",
      title: "Stra\u017C po\u017Carna",
      icon: "flame",
      desc: "Zdajesz testy sprawno\u015Bciowe i idziesz do jednostki w mie\u015Bcie rodzinnym.",
      epilogue: `Testy sprawno\u015Bciowe zdajesz z najlepszym wynikiem w historii jednostki w mie\u015Bcie ${town}. Na zmianach koledzy wci\u0105\u017C prosz\u0105 o pokazanie duszenia, a na akcji spok\xF3j z klatki przydaje si\u0119 bardziej, ni\u017C my\u015Bla\u0142e\u015B.`
    },
    {
      key: "normal",
      title: "Zwyk\u0142e \u017Cycie",
      icon: "briefcase",
      desc: "Etat, rodzina, weekendy bez wagi i sauny.",
      epilogue: `Praca od \xF3smej do szesnastej, obiad w niedziel\u0119 u rodzic\xF3w i pizza bez liczenia kalorii. Gal\u0119 ogl\u0105dasz z kanapy, a gdy kto\u015B w biurze pyta, sk\u0105d te uszy, tylko si\u0119 u\u015Bmiechasz.`
    }
  ];
  return list;
}
function chooseAfter(s0, key) {
  if (!s0.ending || s0.ending.after) return s0;
  const p = afterPaths(s0).find((x) => x.key === key);
  if (!p || p.locked) return s0;
  const s = clone(s0);
  s.ending.after = key;
  return s;
}
function repNego(s) {
  return Math.round((s.rep - 40) / 4);
}
function familyForm(s) {
  return s.relations >= 6 ? 1 : s.relations <= -2 ? -1 : 0;
}
function pointEffects(s) {
  const mediaPurse = Math.round(s.media / 200 * 100);
  const sponsorP = Math.round(clamp((s.media * 0.8 + s.rep * 0.6) / 120, 0.08, 0.75) * 100);
  const rn2 = repNego(s);
  const fam = familyForm(s);
  const media = [
    `ga\u017Ce z kontrakt\xF3w +${mediaPurse}%`,
    `szansa na nowego sponsora co rok: ${sponsorP}%`,
    s.media >= 28 ? "dostajesz oferty freak fight\xF3w" : "freak fighty od 28 punkt\xF3w",
    s.media >= 35 ? "zaproszenia do filmu i reklam" : "film i reklamy od 35 punkt\xF3w"
  ];
  const rep = [
    `negocjacje ga\u017Cy i kontrakt\xF3w: ${rn2 >= 0 ? "+" : ""}${rn2} pkt szansy`,
    s.tier >= 2 ? s.rep >= 18 ? "Europa i \u015Bwiat chc\u0105 ci\u0119 ogl\u0105da\u0107 (pr\xF3g 18)" : "za ma\u0142a, \u017Ceby wyj\u015B\u0107 do Europy (potrzeba 18)" : "od 18 punkt\xF3w otwiera si\u0119 Europa",
    "razem z mediami przyci\u0105ga sponsor\xF3w"
  ];
  const family = [
    fam > 0 ? "forma +1 na start ka\u017Cdego roku" : fam < 0 ? "forma \u22121 na start ka\u017Cdego roku" : "od 6 punkt\xF3w: forma +1 na start roku (poni\u017Cej \u22121: kara)",
    s.relations >= 3 ? "bliscy kupuj\u0105 bilety i \u015Bci\u0105gaj\u0105 znajomych" : "od 3 punkt\xF3w bliscy pomagaj\u0105 sprzedawa\u0107 bilety"
  ];
  if (s.age < 19) family.push(s.relations >= 3 ? "rodzice dok\u0142adaj\u0105 do bud\u017Cetu" : "od 3 punkt\xF3w rodzice dok\u0142adaj\u0105 do bud\u017Cetu");
  return [
    { key: "media", label: "Media", value: s.media, bar: s.media, lines: media },
    { key: "rep", label: "Reputacja", value: s.rep, bar: s.rep, lines: rep },
    { key: "family", label: "Rodzina", value: s.relations, bar: clamp(50 + s.relations * 5, 0, 100), lines: family }
  ];
}
function isDoubleChamp(s) {
  return (s.flags.doubleActive ?? 0) > 0 && s.rank === 0 && s.tier > 0;
}

// server/game.ts
var ALLOWED = /* @__PURE__ */ new Set([
  "changeDivision",
  "doTraining",
  "acceptSponsorOffer",
  "acceptShadyDeal",
  "refuseShadyDeal",
  "investAcademy",
  "setBackroom",
  "takeFamilyHelp",
  "takeLoan",
  "downgradeClub",
  "takeBreakYear",
  "rehabYear",
  "goExpedition",
  "goDagestan",
  "pitchSponsor",
  "startSeason",
  "chooseEvent",
  "continueAfterEvent",
  "setFarewell",
  "acceptInvite",
  "declineInvite",
  "seasonNext",
  "decide",
  "seasonSkip",
  "acceptAllOffers",
  "pressAnswer",
  "weighIn",
  "postAnswer",
  "acceptOffer",
  "negotiateOffer",
  "declineOffer",
  "setWantFights",
  "setManager",
  "setYearGoal",
  "toSummary",
  "toMarket",
  "pickContract",
  "pickClub",
  "negotiateContract",
  "setJob",
  "donate",
  "setCoach",
  "setPerks",
  "setSocial",
  "confirmMarket",
  "retire",
  "chooseAfter",
  "answerMessage",
  "startErrand",
  "claimErrand",
  "campWeek",
  "campGo",
  "buyGear",
  "tasmaDeal",
  "fotoPost",
  "setDiet",
  "podcastListen",
  "openDeposit",
  "breakDeposit",
  "announceAnswer",
  "afterNext",
  "weekAnswer",
  "weekGo",
  "setTickets",
  "entryAnswer",
  "entryGo"
]);
var YEAR_COST = {
  startSeason: () => 1,
  takeBreakYear: () => 1,
  rehabYear: () => 1,
  goDagestan: () => 2,
  goExpedition: (_s, a) => EXPEDITIONS.find((e) => e.id === a[0])?.years ?? 1
};
var cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
var json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
var DAY = 864e5;
var WAW = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" });
var wawDay = (t) => Math.floor(Date.parse(WAW.format(new Date(t)) + "T00:00:00Z") / DAY);
var dayIndex = (season, t = Date.now()) => wawDay(t) - wawDay(new Date(season.starts_at).getTime());
function dayStart(season, d) {
  const target = wawDay(new Date(season.starts_at).getTime()) + d;
  for (const off of [2, 1]) {
    const t = target * DAY - off * 36e5;
    if (wawDay(t) === target && wawDay(t - 1) === target - 1) return t;
  }
  return target * DAY;
}
function forClient(s) {
  return { ...s, rngState: Math.random() * 4294967296 >>> 0 };
}
function legacyOf(s) {
  return Math.max(0, Math.round(s.ending?.legacy ?? legacyScore(s)));
}
function refill(c, season) {
  const d = Math.min(dayIndex(season), dayIndex(season, new Date(season.ends_at).getTime() - 1));
  if (d > c.refill_day) {
    c.bank = Math.min(season.bank_cap, c.bank + (d - c.refill_day) * season.years_per_day);
    c.refill_day = d;
  }
}
function nextRefillAt(season, c) {
  return new Date(dayStart(season, c.refill_day + 1)).toISOString();
}
var db = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false, autoRefreshToken: false } });
async function userId(jwt) {
  if (!jwt) return null;
  try {
    if (typeof db.auth.getClaims === "function") {
      const { data: data2, error: error2 } = await db.auth.getClaims(jwt);
      const sub = data2?.claims?.sub;
      if (!error2 && typeof sub === "string" && (data2.claims.exp ?? 0) * 1e3 > Date.now()) return sub;
    }
  } catch {
  }
  const { data, error } = await db.auth.getUser(jwt);
  return error || !data?.user ? null : data.user.id;
}
var later = (p) => {
  const rt = globalThis.EdgeRuntime;
  if (rt?.waitUntil) rt.waitUntil(Promise.resolve(p));
  else return p;
};
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const jwt = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const [uid2, body] = await Promise.all([userId(jwt), req.json().catch(() => ({}))]);
    if (!uid2) return json({ error: "Brak sesji gracza." }, 401);
    const op = body.op;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const needCareer = (op === "load" || op === "act") && typeof body.careerId === "string";
    const [{ data: season }, { data: player }, careerRes] = await Promise.all([
      db.from("seasons").select("*").lte("starts_at", now).order("starts_at", { ascending: false }).limit(1).maybeSingle(),
      db.from("players").select("*").eq("id", uid2).maybeSingle(),
      needCareer ? db.from("careers").select("*").eq("id", body.careerId).eq("player_id", uid2).maybeSingle() : Promise.resolve({ data: null })
    ]);
    const leaderboard = async () => {
      if (!season) return [];
      const { data } = await db.from("careers").select("player_id, legacy, finished, players(nick)").eq("season_id", season.id).order("legacy", { ascending: false }).limit(400);
      const best = /* @__PURE__ */ new Map();
      for (const r of data ?? []) if (!best.has(r.player_id)) best.set(r.player_id, { nick: r.players?.nick ?? "?", legacy: r.legacy, finished: r.finished, me: r.player_id === uid2 });
      return [...best.values()].slice(0, 100).map((r, i) => ({ place: i + 1, ...r }));
    };
    if (op === "status") {
      const careers = season && player ? (await db.from("careers").select("id, attempt, legacy, finished, bank, refill_day, state").eq("season_id", season.id).eq("player_id", uid2).order("attempt")).data ?? [] : [];
      for (const c of careers) refill(c, season);
      return json({
        season: season ? { id: season.id, name: season.name, startsAt: season.starts_at, endsAt: season.ends_at, yearsPerDay: season.years_per_day, bankCap: season.bank_cap, maxCareers: season.max_careers, open: now < season.ends_at } : null,
        player: player ? { nick: player.nick } : null,
        careers: careers.map((c) => ({ id: c.id, attempt: c.attempt, legacy: c.legacy, finished: c.finished, bank: c.bank, nextRefillAt: nextRefillAt(season, c), name: `${c.state.profile.firstName} ${c.state.profile.lastName}`, age: c.state.age, phase: c.state.phase })),
        leaderboard: await leaderboard()
      });
    }
    if (op === "setNick") {
      const nick = String(body.nick ?? "").trim().replace(/\s+/g, " ").slice(0, 20);
      if (nick.length < 2) return json({ error: "Ksywka musi mie\u0107 co najmniej 2 znaki." }, 400);
      const { error } = await db.from("players").upsert({ id: uid2, nick });
      if (error) return json({ error: "Nie uda\u0142o si\u0119 zapisa\u0107 ksywki." }, 500);
      return json({ ok: true, nick });
    }
    if (!season || now >= season.ends_at) return json({ error: "Sezon jest zamkni\u0119ty. Nast\u0119pny wkr\xF3tce." }, 409);
    if (!player) return json({ error: "Najpierw wybierz ksywk\u0119." }, 400);
    if (op === "new") {
      const { count } = await db.from("careers").select("id", { count: "exact", head: true }).eq("season_id", season.id).eq("player_id", uid2);
      if ((count ?? 0) >= season.max_careers) return json({ error: `W tym sezonie masz ju\u017C ${season.max_careers} kariery.` }, 409);
      const profile = body.profile;
      if (!profile || !profile.firstName || !profile.lastName || !profile.start || !profile.style) return json({ error: "Niepe\u0142ny profil zawodnika." }, 400);
      const s = newGame({ slot: 9, mode: "ranked", seed: Number(season.seed) >>> 0, profile, quick: false });
      const c = { player_id: uid2, season_id: season.id, attempt: (count ?? 0) + 1, state: s, bank: season.years_per_day, refill_day: dayIndex(season), legacy: legacyOf(s) };
      const { data, error } = await db.from("careers").insert(c).select("id, bank, refill_day").single();
      if (error) return json({ error: "Nie uda\u0142o si\u0119 za\u0142o\u017Cy\u0107 kariery." }, 500);
      return json({ careerId: data.id, state: forClient(s), bank: data.bank, nextRefillAt: nextRefillAt(season, data) });
    }
    if (op === "load" || op === "act") {
      const c = careerRes.data;
      if (!c || c.season_id !== season.id) return json({ error: "Nie ma takiej kariery." }, 404);
      const bank0 = c.bank;
      refill(c, season);
      let s = c.state;
      if (op === "act") {
        const ops = Array.isArray(body.ops) ? body.ops.slice(0, 20) : [];
        const seasonBefore = s.season;
        for (const o of ops) {
          if (!ALLOWED.has(o?.name)) return json({ error: `Niedozwolona akcja: ${o?.name}` }, 400);
          const args = Array.isArray(o.args) ? [...o.args] : [];
          if (o.name === "startErrand") args[1] = Date.now();
          if (o.name === "claimErrand") args[0] = Date.now();
          const cost = YEAR_COST[o.name]?.(s, args) ?? 0;
          if (cost > 0 && c.bank < cost) return json({ error: "limit", bank: c.bank, nextRefillAt: nextRefillAt(season, c), state: forClient(s) }, 429);
          const next = game_exports[o.name](s, ...args);
          if (cost > 0 && next !== s) c.bank -= cost;
          s = next;
        }
        const legacy = legacyOf(s);
        const { data: saved, error } = await db.from("careers").update({ state: s, bank: c.bank, refill_day: c.refill_day, legacy, finished: s.phase === "ended", version: c.version + 1, updated_at: now }).eq("id", c.id).eq("version", c.version).select("id");
        if (error || !saved?.length) return json({ error: "Kariera zmieni\u0142a si\u0119 w innym oknie. Wczytaj j\u0105 jeszcze raz.", stale: true }, 409);
        await later(db.from("career_log").insert({ career_id: c.id, ops, season_before: seasonBefore, season_after: s.season }));
      } else if (c.bank !== bank0) await db.from("careers").update({ bank: c.bank, refill_day: c.refill_day }).eq("id", c.id);
      return json({ state: forClient(s), bank: c.bank, nextRefillAt: nextRefillAt(season, c) });
    }
    return json({ error: "Nieznana operacja." }, 400);
  } catch (e) {
    return json({ error: "B\u0142\u0105d serwera.", detail: String(e?.message ?? e) }, 500);
  }
});
