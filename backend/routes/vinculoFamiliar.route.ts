import {Router} from 'express';
import {crear, obtener, listar, actualizar, eliminar} from '../controllers/vinculoFamiliar.controller';
import {verificarToken} from '../middlewares/auth.middleware';
import {verificarRol} from '../middlewares/rol.middleware';
import {validarVinculoFamiliar} from '../validators/vinculoFamiliar.validator';

const router = Router();

router.post('/', verificarToken, verificarRol('administrador', 'secretaria'), validarVinculoFamiliar, crear);
router.get('/', verificarToken, verificarRol('administrador', 'secretaria'), listar);
router.get('/:id', verificarToken, verificarRol('administrador', 'secretaria', 'familiar'), obtener);
router.put('/:id', verificarToken, verificarRol('administrador', 'secretaria'), validarVinculoFamiliar, actualizar);
router.delete('/:id', verificarToken, verificarRol('administrador'), eliminar);

export default router;
