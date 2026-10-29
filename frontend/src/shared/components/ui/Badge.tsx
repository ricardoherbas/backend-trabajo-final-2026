import type { ReactNode } from 'react';

export function Badge({ tono = 'neutro', children }: { tono?: 'ok' | 'aviso' | 'peligro' | 'neutro'; children: ReactNode }) {
  return <span className={`badge badge-${tono}`}>{children}</span>;
}
