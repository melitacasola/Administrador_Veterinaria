import express from 'express';
const router = express.Router();
import { perfil, registrar, confirmar, autenticar, recuperarPassword, comprobarToken, nuevoPassword} from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

// Área pública
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/recuperar-password', recuperarPassword);
//sintaxis
router.route('/recuperar-password/:token').get(comprobarToken).post(nuevoPassword);

// Área privada
router.get('/perfil',checkAuth, perfil);

export default router;
