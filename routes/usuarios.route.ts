import {Router} from 'express';
import {crear} from '../controllers/usuarios.controller';
import {verificarToken} from '../middlewares/auth.middleware';
import {verificarRol} from '../middlewares/rol.middleware';
import {validarUsuario} from '../validators/usuario.validator';

const router = Router();

router.post('/', verificarToken, verificarRol('administrador'), validarUsuario, crear);

export default router;
