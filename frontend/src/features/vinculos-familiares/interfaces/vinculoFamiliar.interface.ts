import type { Persona } from '@/core/types/persona.interface';
import type { Paciente } from '@/features/pacientes/interfaces/paciente.interface';

export interface VinculoFamiliar {
  id: number;
  familiar_id: number;
  paciente_id: number;
  parentesco: string;
  es_contacto_principal: boolean;
  codigo_vinculacion: string | null;
  codigo_usado: boolean;
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
