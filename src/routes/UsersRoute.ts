import { Router } from 'express';
import { UserController } from '../controllers';
import { validateCreateUser, validateLoginUser,validateUpdateUser,validateUpdatePassword } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';
import { isAdmin } from '../middlewares/authRole';

export class UsersRoute {
  private userController: UserController;

  constructor(userController: UserController) {
    this.userController = userController;
  }

  createRouter(): Router {
    const router = Router();

    router.post('/users', validateCreateUser, this.userController.createUser.bind(this.userController));
    router.get('/users', authJwt.verifyToken, this.userController.getUsers.bind(this.userController));

    router.get('/users/:id', authJwt.verifyToken, this.userController.getUserById.bind(this.userController));

    router.post('/auth/login', validateLoginUser, this.userController.login.bind(this.userController));

    router.put('/users/:id', authJwt.verifyToken, validateUpdateUser, this.userController.updateUser.bind(this.userController));

    router.put('/users/me', authJwt.verifyToken, validateUpdateUser, this.userController.updateCurrentUser.bind(this.userController));

    router.delete('/users/:id', authJwt.verifyToken, isAdmin, this.userController.deleteUser.bind(this.userController));

    router.patch('/users/password', authJwt.verifyToken, validateUpdatePassword, this.userController.updatePassword.bind(this.userController));


    return router;
  }
}
