export function money(n: number, signed = false): string {
  const a = Math.abs(n);
  let v: string;
  if (a >= 1_000_000) v = `${(a / 1_000_000).toLocaleString('pl-PL', { maximumFractionDigits: 2 })} mln zł`;
  else if (a >= 1000) v = `${(a / 1000).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} tys. zł`;
  else v = `${Math.round(a)} zł`;
  if (n < 0) return `−${v}`;
  return signed ? `+${v}` : v;
}

export function moneyShort(n: number): string {
  const a = Math.abs(n);
  let v: string;
  if (a >= 1_000_000) v = `${(a / 1_000_000).toLocaleString('pl-PL', { maximumFractionDigits: a >= 10_000_000 ? 0 : 1 })} mln`;
  else if (a >= 10000) v = `${Math.round(a / 1000)} tys.`;
  else if (a >= 1000) v = `${(a / 1000).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} tys.`;
  else v = `${Math.round(a)}`;
  return n < 0 ? `−${v}` : v;
}

export function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one;
  const d = n % 10;
  const t = n % 100;
  if (d >= 2 && d <= 4 && (t < 12 || t > 14)) return few;
  return many;
}

export function lat(n: number) {
  return `${n} ${plural(n, 'rok', 'lata', 'lat')}`;
}

export function signed(n: number, digits = 0) {
  const v = n.toLocaleString('pl-PL', { maximumFractionDigits: digits, minimumFractionDigits: digits });
  return n > 0 ? `+${v}` : v;
}
