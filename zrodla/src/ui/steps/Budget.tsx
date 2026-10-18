import { STAT_LABELS } from '../../engine/data';
import { setJob, setSocial, acceptShadyDeal, refuseShadyDeal, BACKROOM, backroomAvailable, backroomCost, backroomOpen, hasLabs, setBackroom, cheaperClub, downgradeClub, fightRange, plannedFights, setWantFights, ACADEMY_LEVELS, academyName, academyNext, investAcademy, OVERDRAFT, PITCH_SLOTS, pitchBlocked, pitchChance, pitchPay, pitchSponsor, breakPreview, budgetBalance, budgetLines, canStartSeason, expectedPurses, loanOffer, loanRefusal, startSeason, takeBreakYear, takeLoan } from '../../engine/game';
import { useState, type CSSProperties } from 'react';
import type { StatKey } from '../../engine/types';
import { money, plural } from '../../format';
import type { StepProps } from '../Game';
import { Emblem, SponsorLogo, clubCrest } from '../Emblem';
import { Icon, STAT_ICON } from '../Icon';
import { CoachTip } from '../Tutorial';
import { sfxCash } from '../sound';
import { ChanceTag } from '../Chance';
import { JOB_OPTIONS, SMM_COST, SOCIAL_OPTIONS, followersOf, fmtFans, jobMode, socialIncome, socialMode } from '../../engine/extras';
import { livingCost } from '../../engine/data';

export default function Budget({ game, setGame }: StepProps) {
  const g = game;
  const lines = budgetLines(g);
  const bal = budgetBalance(g);
  const after = g.money + bal;
  const loan = loanOffer(g);
  const refusal = loanRefusal(g);
  const brk = breakPreview(g);
  const canStart = canStartSeason(g);
  const cheap = after < 0 ? cheaperClub(g) : null;
  const [confirmBreak, setConfirmBreak] = useState(false);
  const [pitchOpen, setPitchOpen] = useState(false);
  const [confirmAcad, setConfirmAcad] = useState(false);
  const acad = g.academy ?? 0;
  const acadNext = academyNext(g);
  const showAcad = acad > 0 || g.tier >= 2;
  const pitchDone = !!g.pitch && g.pitch.season === g.season;
  const blocked = pitchBlocked(g);
  const purses = expectedPurses(g);
  const range = fightRange(g);
  const want = plannedFights(g);
  const gains = Object.entries(g.lastGains).filter(([, v]) => (v ?? 0) > 0) as [StatKey, number][];

  return (
    <section className="step">
      {gains.length > 0 && (
        <div className="gains">
          <small>Po obozie</small>
          <div className="chips" style={{ marginTop: 4 }}>
            {gains.map(([k, v]) => (
              <span key={k} className={`tag ${k === g.trainingPick ? 'gold' : 'good'}`}>
                <Icon name={STAT_ICON[k]} size={13} />
                {STAT_LABELS[k]} +{v}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="kicker">Budżet</div>
      <h2>Za co płacisz w tym roku</h2>
      <CoachTip id="budget">
        Tyle wydasz w tym roku. W amatorce nikt nie płaci, gaże przyjdą z zawodowstwem.
      </CoachTip>
      <div className="money-line">
        <span className="muted pt-ico">
          <Icon name="coins" size={16} />
          Na koncie
        </span>
        <span className="money-big" style={{ color: g.money < 0 ? 'var(--bad)' : undefined }}>
          {money(g.money)}
        </span>
      </div>

      <div className="ledger">
        {lines.map((l, i) => (
          <div className="ledger-row" key={i} style={{ "--i": i } as CSSProperties}>
            <div className="ledger-label">
              {l.logo ? (
                l.logo.kind === 'club' ? (
                  <Emblem spec={clubCrest(g.club)} size={30} title={l.logo.name} />
                ) : (
                  <SponsorLogo name={l.logo.name} size={30} />
                )
              ) : (
                l.icon && (
                  <span className={`ledger-ico ${l.amount >= 0 ? 'plus' : 'minus'}`}>
                    <Icon name={l.icon} size={16} />
                  </span>
                )
              )}
              <div>
                {l.label}
                {l.sub && <small>{l.sub}</small>}
              </div>
            </div>
            <span className={`amt ${l.amount >= 0 ? 'plus' : 'minus'}`}>{l.amount === 0 ? 'gratis' : money(l.amount, true)}</span>
          </div>
        ))}
        {lines.length === 0 && (
          <div className="ledger-row">
            <span className="muted">Na razie nic nie płacisz. Resztę ogarniają rodzice.</span>
          </div>
        )}
        <div className="ledger-row total">
          <span>Zostanie na koncie</span>
          <span className={`amt ${after >= 0 ? 'plus' : 'minus'}`}>{money(after)}</span>
        </div>
      </div>

      {purses > 0 && g.contract.kind !== 'freak' && (
        <p className="muted" style={{ marginTop: 12 }}>
          Do tego gaże: ok. {money(g.contract.purse)} za walkę
          {g.contract.winBonus ? ` plus ${money(g.contract.winBonus)} premii za wygraną` : ''}. Każdą ofertę walki możesz przyjąć, negocjować albo odrzucić.
        </p>
      )}
      {range && (
        <div className="fights-pick">
          <span className="pt-ico">
            <Icon name="calendar" size={15} />
            Ile walk w tym roku?
          </span>
          <div className="seg" role="radiogroup" aria-label="Liczba walk">
            {Array.from({ length: range[1] - range[0] + 1 }, (_, i) => range[0] + i).map((n) => (
              <button key={n} role="radio" aria-checked={want === n} className={want === n ? 'on' : ''} onClick={() => setGame(setWantFights(g, n))}>
                {n}
              </button>
            ))}
          </div>
          <small className="faint">
            {want > 3
              ? 'Więcej gaż, ale czwarta i piąta walka w roku to zmęczenie i większe ryzyko kontuzji.'
              : want < g.contract.fights
                ? 'Mniej walk: organizm odpocznie, ale ranking i konto rosną wolniej.'
                : `${want} ${plural(want, 'walka', 'walki', 'walk')} w roku to standard w tym kontrakcie.`}
          </small>
        </div>
      )}
      {g.contract.kind === 'freak' && (
        <p className="muted" style={{ marginTop: 12 }}>
          Freak fighty: {money(g.contract.purse)} za walkę i {money(g.contract.winBonus)} premii za wygraną. W planie dwie walki.
        </p>
      )}
      {g.contract.purse === 0 && g.tier === 0 && (
        <p className="muted" style={{ marginTop: 12 }}>
          W amatorce nikt ci nie płaci. Walczysz o medale, doświadczenie i to, żeby ktoś cię zauważył.
        </p>
      )}

      <LifePicks g={g} setGame={setGame} />

      {backroomOpen(g) && (
        <section className="backroom">
          <div className="br-head">
            <Icon name="users" size={15} />
            <b>Zaplecze</b>
            <span className="faint small">opcjonalnie, płatne co roku</span>
          </div>
          <div className="br-list">
            {BACKROOM.map((b) => {
              const on = !!g.backroom?.[b.id];
              // niedostępne na tym szczeblu: widać, ale zablokowane (nic nie znika bez słowa)
              if (!backroomAvailable(g, b.id))
                return (
                  <div key={b.id} className="br-row locked" aria-disabled="true">
                    <span className="br-ico">
                      <Icon name={b.icon} size={16} />
                    </span>
                    <span className="br-txt">
                      <strong>{b.name}</strong>
                      <span>Dostępne od federacji europejskiej.{on ? ' Wróci, gdy znów tam awansujesz.' : ''}</span>
                    </span>
                    <span className="br-side">
                      <span className="br-cost">
                        <Icon name="x" size={13} />
                      </span>
                    </span>
                  </div>
                );
              const cost = backroomCost(g, b.id);
              const free = b.id === 'supps' && hasLabs(g);
              return (
                <button key={b.id} className={`br-row${on ? ' on' : ''}`} role="switch" aria-checked={on} onClick={() => setGame(setBackroom(g, b.id, !on))}>
                  <span className="br-ico">
                    <Icon name={b.icon} size={16} />
                  </span>
                  <span className="br-txt">
                    <strong>{b.name}</strong>
                    <span>{b.effect}</span>
                  </span>
                  <span className="br-side">
                    <span className={`br-cost${free ? ' free' : ''}`}>{free ? 'Ground Game Labs' : `−${money(cost)}`}</span>
                    <span className="br-toggle" aria-hidden="true">
                      <i />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {after < 0 && (
        <div className="money-trouble">
          <div className="mt-head">
            <Icon name="card" size={18} />
            <b>Brakuje ci {money(-after)}</b>
          </div>
          {cheap && (
            <div className="mt-opt">
              <div>
                <strong>Tańszy klub: {cheap.name}</strong>
                <span>
                  Składki {cheap.cost ? `${money(cheap.cost)} zamiast ${money(g.club.cost)}` : `za darmo zamiast ${money(g.club.cost)}`}. Trenujesz słabiej, ale bez długów.
                </span>
              </div>
              <button className="btn btn-small btn-ghost btn-ico" onClick={() => setGame(downgradeClub(g))}>
                <Icon name="home" size={15} />
                Przenoszę się
              </button>
            </div>
          )}
          {loan ? (
            <div className="mt-opt">
              <div>
                <strong>Kredyt w banku</strong>
                <span>
                  {money(loan.amount)} teraz, potem {loan.count} raty po {money(loan.installment)}. Kolejny dostaniesz dopiero po spłacie.
                </span>
              </div>
              <button className="btn btn-small btn-gold btn-ico" onClick={() => setGame(takeLoan(g))}>
                <Icon name="card" size={15} />
                Biorę kredyt
              </button>
            </div>
          ) : (
            <p className="mt-refusal">{refusal ?? 'Bank nie da ci więcej.'}</p>
          )}
          <div className="mt-opt">
            <div>
              <strong>Rok przerwy: idziesz do pracy</strong>
              <span>
                Zarobisz {money(brk.salary)}
                {brk.installments ? `, spłacisz raty (${money(brk.installments)})` : ''} i zostanie ci {money(brk.after)}. Ale obóz przepada, umiejętności spadną
                (kondycja najbardziej){g.tier > 0 ? ', a z rankingu wypadniesz' : ''}.
              </span>
            </div>
            {confirmBreak ? (
              <div className="row" style={{ gap: 6 }}>
                <button className="btn btn-small btn-ghost" onClick={() => setConfirmBreak(false)}>
                  Nie
                </button>
                <button className="btn btn-small btn-primary btn-ico" onClick={() => setGame(takeBreakYear(g))}>
                  <Icon name="briefcase" size={15} />
                  Tak, idę do pracy
                </button>
              </div>
            ) : (
              <button className="btn btn-small btn-ghost btn-ico" onClick={() => setConfirmBreak(true)}>
                <Icon name="briefcase" size={15} />
                Rok przerwy
              </button>
            )}
          </div>
          {canStart ? (
            <p className="mt-note">Możesz też zacząć rok na lekkim minusie (do {money(OVERDRAFT)}), ale długi zabierają czas na trening.</p>
          ) : (
            <p className="mt-note bad">Z takim minusem nie wystartujesz. Weź kredyt albo zrób rok przerwy.</p>
          )}
        </div>
      )}

      {g.shadyDeal && g.shadyDeal.season === g.season && g.shadyDeal.status !== 'refused' && (
        <section className={`shady ${g.shadyDeal.status}`}>
          <div className="shady-head">
            <span className="mgr-tip-ico">
              <Icon name="briefcase" size={16} />
            </span>
            <div>
              <small>{g.shadyDeal.from} dzwoni</small>
              <b>„Mam sponsora. Tylko się nie śmiej.”</b>
            </div>
          </div>
          <div className="shady-body">
            <SponsorLogo name={g.shadyDeal.name} size={40} />
            <div>
              <strong>{g.shadyDeal.name}</strong>
              <span>{g.shadyDeal.product}</span>
            </div>
          </div>
          <div className="shady-task">
            <small>Co musisz robić</small>
            <p className="shady-pitch">{g.shadyDeal.pitch}</p>
          </div>
          <div className="shady-fx">
            <span className="tag good">
              <Icon name="coins" size={12} />+{money(g.shadyDeal.perSeason)} na rok
            </span>
            <span className="tag">{g.shadyDeal.seasons === 1 ? "1 rok" : `${g.shadyDeal.seasons} lata`}</span>
            <span className="tag red">
              <Icon name="star" size={12} />
              reputacja −{Math.abs(g.shadyDeal.rep)}
            </span>
          </div>
          {g.shadyDeal.status === 'taken' ? (
            <p className="shady-done">
              <Icon name="check" size={14} />
              Podpisane. Kasa jest już w rachunku powyżej. Koledzy z klubu już robią z tego memy, a mama pyta, czy wszystko u ciebie w porządku.
            </p>
          ) : (
            <div className="shady-act">
              <button className="btn btn-small btn-ghost" onClick={() => setGame(refuseShadyDeal(g))}>
                Nie, dziękuję
              </button>
              <button
                className="btn btn-small btn-gold btn-ico"
                onClick={() => {
                  sfxCash();
                  setGame(acceptShadyDeal(g));
                }}
              >
                <Icon name="check" size={15} />
                Biorę kasę
              </button>
            </div>
          )}
        </section>
      )}

      <section className="pitch">
        <div className="pitch-head">
          <span className="ledger-ico plus">
            <Icon name="briefcase" size={16} />
          </span>
          <div>
            <b>Poszukaj sponsora</b>
            <small>Raz na rok możesz sam napisać do firm z okolicy.</small>
          </div>
        </div>
        {pitchDone ? (
          <div className={`pitch-result ${g.pitch!.ok ? 'ok' : 'ko'}`}>
            {g.pitch!.ok && g.pitch!.name ? <SponsorLogo name={g.pitch!.name} size={34} /> : <Icon name="x" size={18} />}
            <span>{g.pitch!.text}</span>
          </div>
        ) : blocked ? (
          <p className="muted small" style={{ margin: 0 }}>
            {blocked}
          </p>
        ) : pitchOpen ? (
          <div className="pitch-opts">
            {PITCH_SLOTS.map((sl) => {
              const ch = pitchChance(g, sl.id);
              return (
                <button key={sl.id} className="choice pitch-opt" onClick={() => {
                    const n = pitchSponsor(g, sl.id);
                    if (n.pitch?.ok) sfxCash();
                    setGame(n);
                  }}>
                  <span className="opt-top">
                    <span className="opt-label">{sl.label}</span>
                    <ChanceTag p={ch} />
                  </span>
                  <span className="desc">{sl.desc}</span>
                  <span className="pitch-pay">
                    <Icon name="coins" size={12} />
                    ok. {money(pitchPay(g, sl.id))} na rok
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <button className="btn btn-ghost btn-small btn-ico" onClick={() => setPitchOpen(true)}>
            <Icon name="pen" size={15} />
            Napisz do firm
          </button>
        )}
      </section>

      {showAcad && (
        <section className="pitch acad">
          <div className="pitch-head">
            <span className="ledger-ico plus">
              <Icon name="home" size={16} />
            </span>
            <div>
              <b>{acad ? academyName(g) : 'Własna akademia'}</b>
              <small>
                {acad
                  ? `Poziom ${acad} z ${ACADEMY_LEVELS.length}: ${ACADEMY_LEVELS[acad - 1].name}. Zarabia co roku i zostaje po karierze.`
                  : 'Inwestycja na lata: przychód co roku i punkty legacy po karierze.'}
              </small>
            </div>
          </div>
          {acadNext &&
            (acadNext.blocked ? (
              <p className="muted small" style={{ margin: 0 }}>
                {acad ? 'Rozbudowa: ' : ''}
                {acadNext.name} za {money(acadNext.cost)}. {acadNext.blocked}
              </p>
            ) : (
              <div className="acad-offer">
                <div className="acad-txt">
                  <strong>{acadNext.name}</strong>
                  <span>
                    {acadNext.note} · {money(acadNext.cost)} · ok. {money(acadNext.income)} na rok
                  </span>
                </div>
                {confirmAcad ? (
                  <div className="row" style={{ gap: 6 }}>
                    <button className="btn btn-small btn-ghost" onClick={() => setConfirmAcad(false)}>
                      Nie
                    </button>
                    <button
                      className="btn btn-small btn-gold btn-ico"
                      onClick={() => {
                        setConfirmAcad(false);
                        sfxCash();
                        setGame(investAcademy(g));
                      }}
                    >
                      <Icon name="check" size={15} />
                      Tak, inwestuję
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-small btn-ghost btn-ico" onClick={() => setConfirmAcad(true)}>
                    <Icon name={acad ? 'plus' : 'home'} size={15} />
                    {acad ? 'Rozbuduj' : 'Otwórz'}
                  </button>
                )}
              </div>
            ))}
        </section>
      )}

      <div className="cta-bar">
        <button className="btn btn-primary btn-block btn-ico" disabled={!canStart} onClick={() => setGame(startSeason(g))}>
          <Icon name="glove" />
          {canStart ? 'Zaczynam rok' : 'Brakuje pieniędzy na ten rok'}
        </button>
      </div>
    </section>
  );
}

/** Etat obok treningów i social media: dwa wybory na rok, od razu widać w rachunku. */
function LifePicks({ g, setGame }: { g: StepProps['game']; setGame: StepProps['setGame'] }) {
  const jm = jobMode(g);
  const sm = socialMode(g);
  const fans = followersOf(g);
  const job = JOB_OPTIONS.find((j) => j.id === jm);
  const soc = SOCIAL_OPTIONS.find((o) => o.id === sm)!;
  const living = livingCost(g.age);
  const inc = socialIncome({ ...g, social: sm === 'off' ? 'self' : sm });
  return (
    <>
      {jm && job && (
        <section className="life-pick">
          <div className="br-head">
            <Icon name="briefcase" size={15} />
            <b>Praca obok treningów</b>
            <span className="faint small">do krajowej federacji</span>
          </div>
          <div className="seg prep-seg" role="radiogroup" aria-label="Praca">
            {JOB_OPTIONS.map((j) => (
              <button key={j.id} role="radio" aria-checked={jm === j.id} className={jm === j.id ? 'on' : ''} onClick={() => setGame(setJob(g, j.id))}>
                <b>{j.label}</b>
                <small className={j.form > 0 ? 'good' : j.form < 0 ? 'bad' : ''}>forma {j.form > 0 ? `+${j.form}` : j.form < 0 ? `−${-j.form}` : '±0'}</small>
              </button>
            ))}
          </div>
          <CoachTip id="job">Na początku kariery z walk się nie wyżyjesz. Pełny etat opłaca życie, ale zabiera formę. Tylko trening daje najlepszą formę, jeśli stać cię na życie z oszczędności i gaż.</CoachTip>
          <small className="prep-desc">
            {job.desc} {living > 0 && <>Życie kosztuje cię w tym roku {money(Math.round((living * job.living) / 500) * 500)}.</>}
          </small>
        </section>
      )}
      <section className="life-pick">
        <div className="br-head">
          <Icon name="phone" size={15} />
          <b>Social media</b>
          <span className="life-fans">
            <b>{fmtFans(fans)}</b> obserwujących
          </span>
        </div>
        <div className="seg prep-seg" role="radiogroup" aria-label="Social media">
          {SOCIAL_OPTIONS.map((o) => (
            <button key={o.id} role="radio" aria-checked={sm === o.id} className={sm === o.id ? 'on' : ''} onClick={() => setGame(setSocial(g, o.id))}>
              <b>{o.id === 'pro' ? 'Manager' : o.label}</b>
              <small className={o.id === 'off' ? 'good' : ''}>{o.id === 'off' ? 'forma +1' : o.id === 'self' ? 'za darmo' : `−${money(SMM_COST[g.tier] ?? 9000)}`}</small>
            </button>
          ))}
        </div>
        <CoachTip id="social">Obserwujący to osobna waluta: sprzedają bilety, przyciągają sponsorów i współprace. Prowadząc social media sam, co rok zyskujesz rozpoznawalność, ale tracisz skupienie, które daje telefon w szafce.</CoachTip>
        <small className="prep-desc">
          {soc.desc}
          {sm !== 'off' && inc > 0 ? ` Współprace: ok. ${money(inc)} w tym roku.` : sm !== 'off' ? ' Marki zaczną płacić od 2 tys. obserwujących.' : ''} Obserwujący pomagają sprzedawać bilety i szukać sponsorów.
        </small>
      </section>
    </>
  );
}
