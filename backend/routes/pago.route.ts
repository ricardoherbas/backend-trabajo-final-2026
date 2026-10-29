import {Router} from 'express';
import {crear, obtener, listar, actualizar, eliminar} from '../controllers/pago.controller';
import {verificarToken} from '../middlewares/auth.middleware';
import {verificarRol} from '../middlewares/rol.middleware';
import {validarPago} from '../validators/pago.validator';

const router = Router();

router.post('/', verificarToken, verificarRol('administrador', 'secretaria'), validarPago, crear);
router.get('/', verificarToken, verificarRol('administrador', 'secretaria'), listar);
router.get('/:id', verificarToken, verificarRol('administrador', 'secretaria'), obtener);
router.put('/:id', verificarToken, verificarRol('administrador', 'secretaria'), validarPago, actualizar);
router.delete('/:id', verificarToken, verificarRol('administrador'), eliminar);

export default router;
