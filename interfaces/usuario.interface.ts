export interface Usuario {
    id: number;
    persona_id: number;
    email: string;
    password_hash: string;
    rol: 'administrador' | 'secretaria' | 'cuidadora' | 'familiar';
    activo: boolean;
    creado_en: Date;
    actualizado_en: Date;
}