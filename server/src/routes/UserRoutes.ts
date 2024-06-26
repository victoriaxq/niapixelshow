import { Router } from 'express';
import UserController from '../controllers/UserController';
import { isAuthenticated, isAdmin } from '../middlewares';

const UserRouter = Router();

UserRouter.route('/')
    .post(UserController.create); // Permitir que qualquer pessoa crie uma conta

UserRouter.route('/all')
    .get(isAuthenticated, isAdmin, UserController.readAll); // Apenas admin pode ver todos os usuários

UserRouter.route('/:id')
    .get(isAuthenticated, UserController.read) // Todos os usuários autenticados podem ver os dados de um usuário por ID
    .patch(isAuthenticated, UserController.update) // Usuário autenticado pode atualizar sua própria conta
    .delete(isAuthenticated, UserController.delete); // Usuário autenticado pode deletar sua própria conta

export default UserRouter;