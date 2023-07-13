import { Router } from 'express';
import * as authAppController from '../controller/auth-app-controller';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/setup',
  authAppController.authAppSetupController
);

export default router;