import type { ReactNode } from 'react';

export interface Columna<T> {
  titulo: string;
  render: (fila: T) => ReactNode;
}

interface Props<T> {
  columnas: Columna<T>[];
  filas: T[];
  clave: (fila: T) => string | number;
  acciones?: (fila: T) => ReactNode;
}

export function DataTable<T>({ columnas, filas, clave, acciones }: Props<T>) {
  return (
    <div className="tabla-scroll">
      <table className="tabla">
        <thead>
          <tr>
            {columnas.map((c) => <th key={c.titulo}>{c.titulo}</th>)}
            {acciones && <th><span className="sr-only">Acciones</span></th>}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={clave(fila)}>
              {columnas.map((c) => <td key={c.titulo} data-etiqueta={c.titulo}>{c.render(fila)}</td>)}
              {acciones && <td className="celda-acciones"><div className="acciones">{acciones(fila)}</div></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
