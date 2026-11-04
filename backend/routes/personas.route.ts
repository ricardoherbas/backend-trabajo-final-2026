import {Router} from 'express';
import {crear, actualizar} from '../controllers/personas.controller';
import {verificarToken} from '../middlewares/auth.middleware';
import {verificarRol} from '../middlewares/rol.middleware';
import {validarPersona} from '../validators/persona.validator';

const router = Router();

router.post('/', verificarToken, verificarRol('administrador', 'secretaria'), validarPersona, crear);
router.put('/:id', verificarToken, verificarRol('administrador', 'secretaria'), validarPersona, actualizar);

export default router;