// Szansa słowami i kropkami zamiast surowego procentu (procent zostaje w podpowiedzi).
export function chanceWord(p: number) {
  return p >= 72 ? 'prawie pewne' : p >= 56 ? 'raczej wyjdzie' : p >= 42 ? 'pół na pół' : p >= 28 ? 'ryzykowne' : 'rzut na taśmę';
}

export function chanceTone(p: number) {
  return p >= 56 ? 'good' : p >= 42 ? 'mid' : 'bad';
}

export function ChanceTag({ p }: { p: number }) {
  const dots = p >= 72 ? 5 : p >= 56 ? 4 : p >= 42 ? 3 : p >= 28 ? 2 : 1;
  return (
    <span className={`chance-word tone-${chanceTone(p)}`} title={`Szansa: ${p}%`}>
      <span className="dots" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <i key={i} className={i <= dots ? 'on' : ''} />
        ))}
      </span>
      {chanceWord(p)}
    </span>
  );
}
