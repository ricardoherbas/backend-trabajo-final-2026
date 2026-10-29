export interface Medicamento {
  id: number;
  nombre: string;
  presentacion: string;
  cantidad: number;
}
export interface DatosCrearMedicamento {
  nombre: string;
  presentacion: string;
  cantidad: number;
}
export type DatosActualizarMedicamento = Partial<DatosCrearMedicamento>;
