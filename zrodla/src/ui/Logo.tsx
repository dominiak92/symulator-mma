import { GG } from './brand';

export const SHOP_URL =
  'https://groundgame.com/?utm_source=symulator_mma&utm_medium=gra&utm_campaign=symulator_mma&utm_content=';

/** Logo Ground Game wbudowane w grę (działa też bez internetu). */
export default function Logo({ className = 'gg-logo', variant = 'stacked' }: { className?: string; variant?: keyof typeof GG }) {
  return <img className={className} src={GG[variant]} alt="Ground Game" />;
}
