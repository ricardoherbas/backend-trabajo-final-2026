import {Router} from 'express';
import {crear, obtener, listar, eliminar} from '../controllers/familiar.controller';
import {verificarToken} from '../middlewares/auth.middleware';
import {verificarRol} from '../middlewares/rol.middleware';
import {validarFamiliar} from '../validators/familiar.validator';

const router = Router();

router.post('/', verificarToken, verificarRol('administrador', 'secretaria'), validarFamiliar, crear);
router.get('/', verificarToken, verificarRol('administrador', 'secretaria'), listar);
router.get('/:id', verificarToken, verificarRol('administrador', 'secretaria'), obtener);
router.delete('/:id', verificarToken, verificarRol('administrador'), eliminar);

export default router;
