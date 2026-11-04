import type { Persona } from '@/core/types/persona.interface';
import type { Paciente } from '@/features/pacientes/interfaces/paciente.interface';

export interface VinculoFamiliar {
  id: number;
  familiar_id: number;
  paciente_id: number;
  parentesco: string;
  es_contacto_principal: boolean;
  /** el listado NO lo devuelve solo llega al crear o regenerar el codigo. */
  codigo_vinculacion?: string | null;
  codigo_usado: boolean;
  /** Fecha/hora de vencimiento del codigo (ISO). */
  expira_en: string;
  activo: boolean;
  creado_en: string;
  familiar?: { id: number; persona_id: number; persona?: Persona };
  paciente?: Paciente;
}

export interface DatosCrearVinculo {
  familiar_id: number;
  paciente_id: number;
  parentesco: string;
  es_contacto_principal?: boolean;
}
export type DatosActualizarVinculo = Partial<DatosCrearVinculo>;

/** Respuesta de POST / y de PATCH /:id/regenerar-codigo (el codigo nuevo viene en `vinculo`). */
export interface RespuestaCodigoVinculo {
  mensaje: string;
  vinculo: Pick<VinculoFamiliar, 'id' | 'familiar_id' | 'paciente_id' | 'parentesco' | 'es_contacto_principal'> & {
    codigo_vinculacion: string;
    expira_en: string;
  };
}