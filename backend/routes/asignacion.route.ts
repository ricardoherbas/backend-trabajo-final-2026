import {Router} from 'express';
import {crear, obtener, listar, actualizar, eliminar} from '../controllers/asignacion.controller';
import {verificarToken} from '../middlewares/auth.middleware';
import {verificarRol} from '../middlewares/rol.middleware';
import {validarAsignacion} from '../validators/asignacion.validator';

const router = Router();

router.post('/', verificarToken, verificarRol('administrador', 'secretaria'), validarAsignacion, crear);
router.get('/', verificarToken, verificarRol('administrador', 'secretaria', 'cuidadora'), listar);
router.get('/:id', verificarToken, verificarRol('administrador', 'secretaria', 'cuidadora'), obtener);
router.put('/:id', verificarToken, verificarRol('administrador', 'secretaria'), validarAsignacion, actualizar);
router.delete('/:id', verificarToken, verificarRol('administrador'), eliminar);

export default router;
