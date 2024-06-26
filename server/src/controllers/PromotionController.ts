import { Request, Response, NextFunction } from 'express';
import { firestoreDB } from '../services/firebaseAdmin';
import { Promotion, UpdatePromotion } from '../DTOs';

class PromotionController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const promotionData = Promotion.parse(req.body);

            // Verifica se o produto existe
            const productDoc = await firestoreDB.collection('products').doc(promotionData.product_id).get();
            if (!productDoc.exists) {
                return res.status(400).json({ message: 'Product not found' });
            }

            // Salva a promoção no Firestore
            await firestoreDB.collection('promotions').add(promotionData);

            res.status(201).json({ message: 'Promotion created successfully' });
            return next();
        } catch (error) {
            return next(error);
        }
    }

    async readById(req: Request, res: Response, next: NextFunction) {
        try {
            // Busca uma promoção específica
            const promotionId = req.params.id;
            const promotionDoc = await firestoreDB.collection('promotions').doc(promotionId).get();

            // Verifica se a promoção existe
            if (!promotionDoc.exists) {
                return res.status(404).json({ message: 'Promotion not found' });
            }

            // Retorna a promoção encontrada
            const promotionData = promotionDoc.data();
            res.status(200).json({ id: promotionDoc.id, ...promotionData });
            return next();
        } catch (error) {
            return next(error);
        }
    }

    async readAll(req: Request, res: Response, next: NextFunction) {
        try {
            // Busca todas as promoções
            const allPromotions = await firestoreDB.collection('promotions').get();
            const promotions = allPromotions.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            res.status(200).json(promotions);
            return next();
        } catch (error) {
            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const promotionId = req.params.id;
            const promotionData = UpdatePromotion.parse(req.body);

            // Verifica se a promoção existe
            const promotionDoc = await firestoreDB.collection('promotions').doc(promotionId).get();
            if (!promotionDoc.exists) {
                return res.status(400).json({ message: 'Promotion not found' });
            }

            // Atualiza a promoção no Firestore
            await firestoreDB.collection('promotions').doc(promotionId).update(promotionData);

            res.status(200).json({ message: 'Promotion updated successfully' });
            return next();
        } catch (error) {
            return next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const promotionId = req.params.id;

            // Verifica se a promoção existe
            const promotionDoc = await firestoreDB.collection('promotions').doc(promotionId).get();
            if (!promotionDoc.exists) {
                return res.status(400).json({ message: 'Promotion not found' });
            }

            // Deleta a promoção no Firestore
            await firestoreDB.collection('promotions').doc(promotionId).delete();

            res.status(200).json({ message: 'Promotion deleted successfully' });
            return next();
        } catch (error) {
            return next(error);
        }
    }
}

export default new PromotionController();