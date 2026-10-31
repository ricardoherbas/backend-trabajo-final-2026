import {Medicamento} from '../models';
import {DatosCrearMedicamento, DatosActualizarMedicamento} from '../interfaces/medicamento.interface';
import {AppError} from '../utils/app-error';

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
        throw new AppError(
            'Medicamento no encontrado',
            404
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
        throw new AppError(
            'Medicamento no encontrado',
            404
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
        throw new AppError(
            'Medicamento no encontrado',
            404
        );
    }

    await medicamento.destroy();
};