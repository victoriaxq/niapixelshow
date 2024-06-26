import { Request, Response, NextFunction } from 'express';
import { firestoreDB } from '../services/firebaseAdmin';
import { hash } from 'bcryptjs';
import { UpdateCartItem, Cart, CartItem } from '../DTOs';

class CartController {
    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;

            const cartDoc = await firestoreDB.collection('carts').doc(userId).get();
            if (!cartDoc.exists) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const cartData = cartDoc.data();
            if (!cartData) {
                return res.status(404).json({ message: 'Cart data not found' });
            }

            res.status(200).json(cartData);
            return next();
        } catch (error) {
            return next(error);
        }
    }

    async add_item(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const itemData = CartItem.parse(req.body);

            // Verifica se o carrinho existe
            const cartDoc = await firestoreDB.collection('carts').doc(userId).get();
            if (!cartDoc.exists) {
                const cartData = { user_id: userId, items: [itemData], price: itemData.price*itemData.quantity };
                await firestoreDB.collection('carts').doc(userId).set(cartData);
                res.status(201).json({ message: 'Cart created successfully' });
                return next();
            }

            // Adiciona o item ao carrinho
            const cartData = cartDoc.data();
            if (!cartData) {
                return res.status(404).json({ message: 'Cart data not found' });
            }

            const updatedItems = [...cartData.items, itemData];
            await firestoreDB.collection('carts').doc(userId).update({ items: updatedItems });

            const cartPrice = updatedItems.reduce((acc: number, item: any) => acc + item.price*item.quantity, 0);
            await firestoreDB.collection('carts').doc(userId).update({ price: cartPrice });

            res.status(200).json({ message: 'Item added successfully' });
            return next();
        } catch (error) {
            return next(error);
        }
    }

    async update_item(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const itemId = req.params.item_id;
            const itemData = UpdateCartItem.parse(req.body);

            // Verifica se o carrinho existe
            const cartDoc = await firestoreDB.collection('carts').doc(userId).get();

            // Atualiza o item do carrinho
            const cartData = cartDoc.data();
            if (!cartData) {
                return res.status(404).json({ message: 'Cart data not found' });
            }

            const updatedItems = cartData.items.map((item: any) => {
                if (item.item_id === itemId) {
                    if(!itemData.quantity){
                        item.size = itemData.size;
                    }
                    if(!itemData.size){
                        item.quantity = itemData.quantity;
                    }
                    else{
                        item.size = itemData.size;
                        item.quantity = itemData.quantity;
                    }
                }
                return item;
            });

            await firestoreDB.collection('carts').doc(userId).update({ items: updatedItems });

            const cartPrice = updatedItems.reduce((acc: number, item: any) => acc + item.price*item.quantity, 0);
            await firestoreDB.collection('carts').doc(userId).update({ price: cartPrice });

            res.status(200).json({ message: 'Item updated successfully' });
            return next();
        } catch (error) {
            return next(error);
        }
    }

    async delete_item(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const itemId = req.params.item_id;

            const cartDoc = await firestoreDB.collection('carts').doc(userId).get();

            // Remove o item do carrinho
            const cartData = cartDoc.data();
            if (!cartData) {
                return res.status(404).json({ message: 'Cart data not found' });
            }

            const updatedItems = cartData.items.filter((item: any) => item.id !== itemId);

            await firestoreDB.collection('carts').doc(userId).update({ items: updatedItems });

            const cartPrice = updatedItems.reduce((acc: number, item: any) => acc + item.price*item.quantity, 0);
            await firestoreDB.collection('carts').doc(userId).update({ price: cartPrice });

            res.status(200).json({ message: 'Item deleted successfully' });
            return next();
        } catch (error) {
            return next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;

            await firestoreDB.collection('carts').doc(userId).delete();

            res.status(200).json({ message: 'Cart deleted successfully' });
            return next();
        } catch (error) {
            return next(error);
        }
    }
}

const cartController = new CartController();
export default cartController;