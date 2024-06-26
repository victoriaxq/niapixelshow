import { Router } from 'express';
import { CartController } from '../controllers';

const CartRouter = Router();

CartRouter.route('/:id/:item_id')
    .delete(CartController.delete_item) // Rota para deletar um item do carrinho por ID
    .put(CartController.update_item) // Rota para atualizar um item do carrinho por ID

CartRouter.route('/:id')
    .delete(CartController.delete) // Rota para apagar o carrinho por ID
    .post(CartController.add_item) // Rota para atualizar um carrinho por ID
    .get(CartController.get) // Rota para buscar um carrinho por ID

export default CartRouter;