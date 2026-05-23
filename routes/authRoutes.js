import {Router} from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';

const AuthRouter=Router();

AuthRouter.route('/register').post(registerUser);
AuthRouter.route('/login').post(loginUser);

export default AuthRouter;