import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'peligro' | 'texto';
  chico?: boolean;
}

export function Button({ variante = 'primario', chico, className = '', type = 'button', ...resto }: Props) {
  return (
    <button
      type={type}
      className={`btn btn-${variante}${chico ? ' btn-chico' : ''} ${className}`.trim()}
      {...resto}
    />
  );
}
