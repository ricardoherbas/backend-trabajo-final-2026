import {Router} from 'express';
import {crear, obtener, listar, actualizar, eliminar} from '../controllers/parteDiario.controller';
import {verificarToken} from '../middlewares/auth.middleware';
import {verificarRol} from '../middlewares/rol.middleware';
import {validarParteDiario} from '../validators/parteDiario.validator';

const router = Router();

router.post('/', verificarToken, verificarRol('administrador', 'secretaria', 'cuidadora'), validarParteDiario, crear);
router.get('/', verificarToken, verificarRol('administrador', 'secretaria', 'cuidadora'), listar);
router.get('/:id', verificarToken, verificarRol('administrador', 'secretaria', 'cuidadora'), obtener);
router.put('/:id', verificarToken, verificarRol('administrador', 'secretaria', 'cuidadora'), validarParteDiario, actualizar);
router.delete('/:id', verificarToken, verificarRol('administrador'), eliminar);

export default router;
