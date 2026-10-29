/** Formatea 'YYYY-MM-DD' o ISO a dd/mm/aaaa sin corrimiento por zona horaria. */
export function formatFecha(valor: string | null | undefined): string {
  if (!valor) return '—';
  const soloFecha = valor.slice(0, 10);
  const [anio, mes, dia] = soloFecha.split('-');
  if (!anio || !mes || !dia) return valor;
  return `${dia}/${mes}/${anio}`;
}

/** Fecha de hoy como 'YYYY-MM-DD' en hora local (para <input type="date">). */
export function hoyISO(): string {
  return new Date().toLocaleDateString('en-CA');
}
