import {Router} from 'express';
import {crear, listar, obtener, actualizar, desactivar, activar} from '../controllers/usuarios.controller';
import {verificarToken} from '../middlewares/auth.middleware';
import {verificarRol} from '../middlewares/rol.middleware';
import {validarUsuario} from '../validators/usuario.validator';
import {validarActualizacionUsuario} from '../validators/usuario-actualizar.validator';

const router = Router();

router.post('/', verificarToken, verificarRol('administrador'), validarUsuario, crear);
router.get('/', verificarToken, verificarRol('administrador'), listar);
router.get('/:id', verificarToken, verificarRol('administrador'), obtener);
router.put('/:id', verificarToken, verificarRol('administrador'), validarActualizacionUsuario, actualizar);
router.patch('/:id/desactivar', verificarToken, verificarRol('administrador'), desactivar);
router.patch('/:id/activar', verificarToken, verificarRol('administrador'), activar);

export default router;