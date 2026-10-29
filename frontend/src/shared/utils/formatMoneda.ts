export function formatMoneda(valor: number | string | null | undefined): string {
  if (valor === null || valor === undefined || valor === '') return '—';
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(valor));
}
