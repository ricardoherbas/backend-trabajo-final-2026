import {Router} from 'express';
import {registrar, login, perfil} from '../controllers/auth.controller';
import {verificarToken} from '../middlewares/auth.middleware';
import {validarRegistroFamiliar} from '../validators/registroFamiliar.validator';

const router = Router();

router.post('/registro', validarRegistroFamiliar, registrar);
router.post('/login', login);
router.get('/perfil', verificarToken, perfil);

export default router;
