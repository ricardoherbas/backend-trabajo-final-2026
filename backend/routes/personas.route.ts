import {Router} from 'express';
import {crear} from '../controllers/personas.controller';
import {verificarToken} from '../middlewares/auth.middleware';
import {verificarRol} from '../middlewares/rol.middleware';
import {validarPersona} from '../validators/persona.validator';

const router = Router();

router.post('/', verificarToken, verificarRol('administrador', 'secretaria'), validarPersona, crear);

export default router;
