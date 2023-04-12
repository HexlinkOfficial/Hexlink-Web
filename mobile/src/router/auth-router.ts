import { Router } from 'express';
import * as authAppController from '../controller/auth-app-controller';
import { body } from 'express-validator';

const router = Router();

router.put(
  '/setup',
  [
    body('address').trim().isLength({ min: 3 }).withMessage('Not valid address'),
  ],
  authAppController.authAppSetupController
);

export default router;