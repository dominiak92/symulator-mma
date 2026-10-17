import { STAT_LABELS } from '../../engine/data';
import { budgetBalance, budgetLines, expectedPurses, loanOffer, startSeason, takeLoan } from '../../engine/game';
import type { StatKey } from '../../engine/types';
import { money, plural } from '../../format';
import type { StepProps } from '../Game';
import { Emblem, SponsorLogo, clubCrest } from '../Emblem';
import { Icon, STAT_ICON } from '../Icon';

export default function Budget({ game, setGame }: StepProps) {
  const g = game;
  const lines = budgetLines(g);
  const bal = budgetBalance(g);
  const after = g.money + bal;
  const loan = loanOffer(g);
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

      {loan && (
        <div className="warn">
          Brakuje ci pieniędzy. Bank daje {money(loan.amount)} kredytu, spłata w {loan.count} ratach po {money(loan.installment)}, pierwsza za rok.
          <div className="row wrap" style={{ marginTop: 10 }}>
            <button className="btn btn-small btn-gold btn-ico" onClick={() => setGame(takeLoan(g))}>
              <Icon name="card" size={15} />
              Biorę kredyt
            </button>
            <span className="small">Bez kredytu wchodzisz w sezon na minusie, a duże długi zabierają czas na trening.</span>
          </div>
        </div>
      )}

      <div className="cta-bar">
        <button className="btn btn-primary btn-block btn-ico" onClick={() => setGame(startSeason(g))}>
          <Icon name="glove" />
          Zaczynam sezon
        </button>
      </div>
    </section>
  );
}
