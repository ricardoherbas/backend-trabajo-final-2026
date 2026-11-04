
import {Router} from 'express';
import {crear, obtener, listar, actualizar, eliminar} from '../controllers/paciente.controller';
import {verificarToken} from '../middlewares/auth.middleware';
import {verificarRol} from '../middlewares/rol.middleware';
import {validarPaciente, validarActualizacionPaciente} from '../validators/paciente.validator';

const router = Router();

router.post('/', verificarToken, verificarRol('administrador', 'secretaria'), validarPaciente, crear);
router.get('/', verificarToken, verificarRol('administrador', 'secretaria', 'cuidadora', 'familiar'), listar);
router.get('/:id', verificarToken, verificarRol('administrador', 'secretaria', 'cuidadora', 'familiar'), obtener);
router.put('/:id', verificarToken, verificarRol('administrador', 'secretaria'), validarActualizacionPaciente, actualizar);
router.delete('/:id', verificarToken, verificarRol('administrador'), eliminar);

export default router;
