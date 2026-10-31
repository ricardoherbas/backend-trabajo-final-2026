import {Router} from 'express';
import {crear, obtener, listar, actualizar, desactivar, activar} from '../controllers/vinculoFamiliar.controller';
import {verificarToken} from '../middlewares/auth.middleware';
import {verificarRol} from '../middlewares/rol.middleware';
import {validarVinculoFamiliar} from '../validators/vinculoFamiliar.validator';
import {validarActualizacionVinculoFamiliar} from '../validators/vinculoFamiliar-actualizar.validator';

const router = Router();

router.post('/', verificarToken, verificarRol('administrador', 'secretaria'), validarVinculoFamiliar, crear);
router.get('/', verificarToken, verificarRol('administrador', 'secretaria'), listar);
router.get('/:id', verificarToken, verificarRol('administrador', 'secretaria', 'familiar'), obtener);
router.put('/:id', verificarToken, verificarRol('administrador', 'secretaria'), validarActualizacionVinculoFamiliar, actualizar);
router.patch('/:id/desactivar', verificarToken, verificarRol('administrador'), desactivar);
router.patch('/:id/activar', verificarToken, verificarRol('administrador'), activar);

export default router;