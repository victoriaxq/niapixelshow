import { loadFeature, defineFeature } from 'jest-cucumber';
import supertest from 'supertest';
import app from '../../src/app';
import expect from 'expect'
import { firestoreDB, adminAuth } from '../../src/services/firebaseAdmin';
import { Stats } from 'fs';

const feature = loadFeature('tests/features/order_history_user.feature');


defineFeature(feature, (test)=>{
    let request = supertest(app)
    let response: supertest.Response;
    jest.setTimeout(15000);

    beforeEach(async () => {
        const order = await firestoreDB.collection('orders').get();
        const user = await firestoreDB.collection('users').get();
        const batch = firestoreDB.batch();
        user.forEach(doc => {
            adminAuth.deleteUser(doc.id);
            batch.delete(doc.ref)
        });
        order.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    });
    
    test('Retornar pedidos no histórico de pedidos com pedidos cadastrados', ({given, and, when, then}) => {
        given(/^um usuário com nome "(.*)", email "(.*)", senha "(.*)" e telefone "(.*)"$/, async (arg0, arg1, arg2, arg3) => {
            const user = {
                name: arg0,
                phone: arg3,
                email: arg1,
                password: arg2,
                is_admin: false
            };
            response = await request.post('/user').send(user);
        });
        and(/^o pedido com email "(.*)", item "(.*)" com descrição "(.*)", quantidade "(.*)", preço "(.*)" reais, status "(.*)", criado em "(.*)", para o endereço "(.*)" cadastrado$/, async (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) => {
            const orderData = {
                email: arg0,
                item: arg1,
                description: arg2,
                qtd: parseInt(arg3),
                price: parseFloat(arg4),
                status: arg5,
                date: arg6,
                addr: arg7
            };
            response = await request.post('/order').send(orderData);
        });
        when('acessar a página de Histórico de Pedidos', async () => {
            const filt = {
                func: "Igual a",
                filter: response.body.product.email
            }
            response = await request.get('/order/filter/email').send(filt);
        });
        then(/^é retornado o pedido com email "(.*)", item "(.*)" com descrição "(.*)", quantidade "(.*)", preço "(.*)" reais, status "(.*)", criado em "(.*)", para o endereço "(.*)"$/, async (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) => {
            expect(response.body[0].email).toBe(arg0);
            expect(response.body[0].item).toBe(arg1);
            expect(response.body[0].description).toBe(arg2);
            expect(response.body[0].qtd).toBe(parseInt(arg3));
            expect(response.body[0].price).toBe(parseFloat(arg4));
            expect(response.body[0].status).toBe(arg5);
            expect(response.body[0].date).toBe(arg6);
            expect(response.body[0].addr).toBe(arg7);
        });
    });
    test('Retornar mensagem no histórico de pedidos sem pedidos cadastrados', ({given, and, when, then}) => {
        given(/^um usuário com nome "(.*)", email "(.*)", senha "(.*)" e telefone "(.*)"$/, async (arg0, arg1, arg2, arg3) => {
            const user = {
                name: arg0,
                phone: arg3,
                email: arg1,
                password: arg2,
                is_admin: false
            };
            response = await request.post('/user').send(user);
        });
        and('não tem cadastrado nenhum pedido', async () => {
            const email = response.body.email;
            if(email != null){
                const orders = await firestoreDB.collection('orders').where("email", "==", email).get();
                const batch = firestoreDB.batch();
                orders.forEach(doc => {
                    adminAuth.deleteUser(doc.id);
                    batch.delete(doc.ref)
                });
                await batch.commit();
            }
        });
        when('acessar a página de Histórico de Pedidos', async () => {
            const filt = {
                func: "Igual a",
                filter: response.body.product.email
            }
            response = await request.get('/order/filter/email').send(filt);
        });
        then('é retornada uma mensagem informando que não há pedidos cadastrados', async () => {
            expect(response.status).toBe(426);
        });
    });
    test('Retornar pedidos filtrados', ({given, and, when, then}) => {
        given(/^um usuário com nome "(.*)", email "(.*)", senha "(.*)" e telefone "(.*)"$/, async (arg0, arg1, arg2, arg3) => {
            const user = {
                name: arg0,
                phone: arg3,
                email: arg1,
                password: arg2,
                is_admin: false
            };
            response = await request.post('/user').send(user);
        });
        and(/^o pedido com email "(.*)", item "(.*)" com descrição "(.*)", quantidade "(.*)", preço "(.*)" reais, status "(.*)", criado em "(.*)", para o endereço "(.*)" cadastrado$/, async (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) => {
            const orderData = {
                email: arg0,
                item: arg1,
                description: arg2,
                qtd: parseInt(arg3),
                price: parseFloat(arg4),
                status: arg5,
                date: arg6,
                addr: arg7
            };
            response = await request.post('/order').send(orderData);
        });
        and(/^o pedido com email "(.*)", item "(.*)" com descrição "(.*)", quantidade "(.*)", preço "(.*)" reais, status "(.*)", criado em "(.*)", para o endereço "(.*)" cadastrado$/, async (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) => {
            const orderData = {
                email: arg0,
                item: arg1,
                description: arg2,
                qtd: parseInt(arg3),
                price: parseFloat(arg4),
                status: arg5,
                date: arg6,
                addr: arg7
            };
            response = await request.post('/order').send(orderData);
        });
        when(/^filtrar por "(.*)" "(.*)"$/, async (arg0, arg1) => {
            const condição = arg1.split(" ");
            const filt = {
                func: condição[0] + ' ' + condição[1],
                filter: parseFloat(condição[3])
            }
            console.log(filt);
            response = await request.get('/order/filter/'+arg0).send(filt);
        });
        then(/^é retornado o pedido com email "(.*)", item "(.*)" com descrição "(.*)", quantidade "(.*)", preço "(.*)" reais, status "(.*)", criado em "(.*)", para o endereço "(.*)"$/, async (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) => {
            expect(response.body[0].email).toBe(arg0);
            expect(response.body[0].item).toBe(arg1);
            expect(response.body[0].description).toBe(arg2);
            expect(response.body[0].qtd).toBe(parseInt(arg3));
            expect(response.body[0].price).toBe(parseFloat(arg4));
            expect(response.body[0].status).toBe(arg5);
            expect(response.body[0].date).toBe(arg6);
            expect(response.body[0].addr).toBe(arg7);
        });
    });
});