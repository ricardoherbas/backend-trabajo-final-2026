import {Medicamento} from '../models';

interface DatosCrearMedicamento {
    nombre: string;
    presentacion: string;
    cantidad: number;
}

interface DatosActualizarMedicamento {
    nombre?: string;
    presentacion?: string;
    cantidad?: number;
}

export const crearMedicamento = async (
    datos: DatosCrearMedicamento
) => {
    const medicamento =
        await Medicamento.create({
            nombre:
                datos.nombre,
            presentacion:
                datos.presentacion,
            cantidad:
                datos.cantidad
        });

    return medicamento;
};

export const obtenerMedicamento = async (
    id: number
) => {
    const medicamento =
        await Medicamento.findByPk(id);

    if (!medicamento) {
        throw new Error(
            'Medicamento no encontrado'
        );
    }

    return medicamento;
};

export const listarMedicamentos = async () => {
    return await Medicamento.findAll();
};

export const actualizarMedicamento = async (
    id: number,
    datos: DatosActualizarMedicamento
) => {
    const medicamento =
        await Medicamento.findByPk(id);

    if (!medicamento) {
        throw new Error(
            'Medicamento no encontrado'
        );
    }

    await medicamento.update(datos);

    return medicamento;
};

export const eliminarMedicamento = async (
    id: number
) => {
    const medicamento =
        await Medicamento.findByPk(id);

    if (!medicamento) {
        throw new Error(
            'Medicamento no encontrado'
        );
    }

    await medicamento.destroy();
};
