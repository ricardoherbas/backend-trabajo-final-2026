export interface Persona {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    fecha_nacimiento: Date | null;
    telefono: string | null;
}