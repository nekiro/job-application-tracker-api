import express from 'express';
import controller from '../controllers/users.controller';
import validateRequest from '../middlewares/validation';
import authenticateToken from '../middlewares/authentication';

const router = express.Router();

// schema validator
router.use(validateRequest);

// protected
router.post('/refreshToken', authenticateToken, controller.refreshToken);
router.delete('/delete', authenticateToken, controller.deleteUser);
router.get('/:id', authenticateToken, controller.getUser);

//unprotected
router.post('/create', controller.createUser);

export default router;
