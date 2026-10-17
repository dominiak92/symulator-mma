import { STAT_LABELS } from '../../engine/data';
import { OVERDRAFT, PITCH_SLOTS, pitchBlocked, pitchChance, pitchPay, pitchSponsor, breakPreview, budgetBalance, budgetLines, canStartSeason, expectedPurses, loanOffer, loanRefusal, startSeason, takeBreakYear, takeLoan } from '../../engine/game';
import { useState } from 'react';
import type { StatKey } from '../../engine/types';
import { money, plural } from '../../format';
import type { StepProps } from '../Game';
import { Emblem, SponsorLogo, clubCrest } from '../Emblem';
import { Icon, STAT_ICON } from '../Icon';
import { CoachTip } from '../Tutorial';

export default function Budget({ game, setGame }: StepProps) {
  const g = game;
  const lines = budgetLines(g);
  const bal = budgetBalance(g);
  const after = g.money + bal;
  const loan = loanOffer(g);
  const refusal = loanRefusal(g);
  const brk = breakPreview(g);
  const canStart = canStartSeason(g);
  const [confirmBreak, setConfirmBreak] = useState(false);
  const [pitchOpen, setPitchOpen] = useState(false);
  const pitchDone = !!g.pitch && g.pitch.season === g.season;
  const blocked = pitchBlocked(g);
  const purses = expectedPurses(g);
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
        Tyle wydasz w tym sezonie. W amatorce nikt nie płaci, gaże przyjdą z zawodowstwem.
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
          <div className="ledger-row" key={i}>
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
            <span className={`amt ${l.amount >= 0 ? 'plus' : 'minus'}`}>{money(l.amount, true)}</span>
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

      <section className="pitch">
        <div className="pitch-head">
          <span className="ledger-ico plus">
            <Icon name="briefcase" size={16} />
          </span>
          <div>
            <b>Poszukaj sponsora</b>
            <small>Raz na sezon możesz sam napisać do firm z okolicy.</small>
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
                <button key={sl.id} className="choice pitch-opt" onClick={() => setGame(pitchSponsor(g, sl.id))}>
                  <span className="opt-top">
                    <span className="opt-label">{sl.label}</span>
                    <span className={`chance-big tone-${ch >= 50 ? 'good' : ch >= 30 ? 'mid' : 'bad'}`}>{ch}%</span>
                  </span>
                  <span className="desc">{sl.desc}</span>
                  <span className="pitch-pay">
                    <Icon name="coins" size={12} />
                    ok. {money(pitchPay(g, sl.id))} na sezon
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

      {purses > 0 && g.contract.kind !== 'freak' && (
        <p className="muted" style={{ marginTop: 12 }}>
          Do tego gaże: {money(g.contract.purse)} za walkę
          {g.contract.winBonus ? ` plus ${money(g.contract.winBonus)} premii za wygraną` : ''}. W planie {g.contract.fights}{' '}
          {plural(g.contract.fights, 'walka', 'walki', 'walk')}.
        </p>
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

      {after < 0 && (
        <div className="money-trouble">
          <div className="mt-head">
            <Icon name="card" size={18} />
            <b>Brakuje ci {money(-after)}</b>
          </div>
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
            <p className="mt-note">Możesz też wejść w sezon na lekkim minusie (do {money(OVERDRAFT)}), ale długi zabierają czas na trening.</p>
          ) : (
            <p className="mt-note bad">Z takim minusem nie wystartujesz. Weź kredyt albo zrób rok przerwy.</p>
          )}
        </div>
      )}

      <div className="cta-bar">
        <button className="btn btn-primary btn-block btn-ico" disabled={!canStart} onClick={() => setGame(startSeason(g))}>
          <Icon name="glove" />
          {canStart ? 'Zaczynam sezon' : 'Brakuje pieniędzy na sezon'}
        </button>
      </div>
    </section>
  );
}
