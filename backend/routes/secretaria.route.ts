import {Router} from 'express';
import {crear, obtener, listar, eliminar} from '../controllers/secretaria.controller';
import {verificarToken} from '../middlewares/auth.middleware';
import {verificarRol} from '../middlewares/rol.middleware';
import {validarSecretaria} from '../validators/secretaria.validator';

const router = Router();

router.post('/', verificarToken, verificarRol('administrador'), validarSecretaria, crear);
router.get('/', verificarToken, verificarRol('administrador'), listar);
router.get('/:id', verificarToken, verificarRol('administrador'), obtener);
router.delete('/:id', verificarToken, verificarRol('administrador'), eliminar);

export default router;
