import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { authRequired } from '../middlewares/authRequired.js';
const r = Router();
r.post('/register', register);
r.post('/login', login);
r.get('/me', authRequired, me);
export default r;
