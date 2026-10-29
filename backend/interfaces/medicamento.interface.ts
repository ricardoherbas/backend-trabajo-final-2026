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
export interface DatosActualizarMedicamento {
    nombre?: string;
    presentacion?: string;
    cantidad?: number;
}