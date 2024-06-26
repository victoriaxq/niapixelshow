import { loadFeature, defineFeature } from 'jest-cucumber';
import supertest from 'supertest';
import app from '../../src/app';
import expect from 'expect'
import { firestoreDBTest } from '../services/firebaseAdmin';
import { Stats } from 'fs';

const feature = loadFeature('tests/features/cart.feature');

defineFeature(feature, (test)=>{
    let request = supertest(app)
    let response: supertest.Response;

    /* Scenario: Adicionar um produto ao carrinho vazio
        Given o banco de dados esta vazio
        When o produto com item_id "1", nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P" é adicionado ao carrinho pelo user de id "5"
        Then o banco de dados cria um novo carrinho com user_id "5" e o produto de item_id "1"
        And o preço total do carrinho de user_id "5" é atualizado para o valor do produto de item_id "1" */
    test('Adicionar um produto ao carrinho vazio', ({given, when, then, and}) => {
        given('o banco de dados esta vazio' , async () => {});
        when(/^o produto com item_id "(.*)", nome "(.*)", descrição "(.*)", preço "(.*)", status "(.*)", categoria "(.*)", quantidade "(.*)" e tamanho "(.*)" é adicionado ao carrinho pelo user de id "(.*)"$/, async (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) => {
            response = await request.delete(`/cart/5`);
            const orderData = {
                item_id: arg0,
                name: arg1,
                description: arg2,
                price: parseInt(arg3),
                status: true,
                category: arg5,
                quantity: parseInt(arg6),
                size: arg7
            }
            response = await request.post(`/cart/${arg8}`).send(orderData);
        })
        then(/^o banco de dados cria um novo carrinho com user_id "(.*)" e o produto de item_id "(.*)"$/, async (arg0,arg1) => {
            response = await request.get(`/cart/${arg0}`);
            console.log(response.body.items[0].item_id)
            expect(response.body.items[0].item_id).toBe(arg1);
        })
        and('o preço total do carrinho de user_id "5" é atualizado para o valor do produto de item_id "1"', async () => {
            response = await request.get(`/cart/5`);
            const price_item = response.body.items[0].price * response.body.items[0].quantity;
            expect(response.body.price).toBe(price_item);
        });
    })

    /* Given o banco de dados possui um carrinho com user_id "6" e o produto de item_id "1" com nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P"
        When o produto com item_id "2", nome "Camisa Cin Rosa", descrição "Esta é uma camisa", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P" é adicionado ao carrinho pelo usuário de user_id "6"
        Then o banco de dados adiciona o produto de item_id "2" ao carrinho de user_id "6" 
        And o preço total do carrinho de user_id "6" é atualizado para a soma dos valores dos produtos */
    test ('Adicionar um produto ao carrinho com produtos', ({given, when, then, and}) => {
        given('o banco de dados possui um carrinho com user_id "6" e o produto de item_id "1" com nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P"', async () => {
            response = await request.delete(`/cart/6`);
            const orderData = {
                item_id: "1",
                name: "Camisa Cin 50 anos",
                description: "Esta é uma camisa que representa os 50 anos do Centro de informática",
                price: 50,
                status: true,
                category: "Camisas",
                quantity: 4,
                size: "P"
            }
            response = await request.post(`/cart/6`).send(orderData);
        });
        when(/^o produto com item_id "(.*)", nome "(.*)", descrição "(.*)", preço "(.*)", status "(.*)", categoria "(.*)", quantidade "(.*)" e tamanho "(.*)" é adicionado ao carrinho pelo usuário de user_id "(.*)"$/, async (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) => {
            const orderData = {
                item_id: arg0,
                name: arg1,
                description: arg2,
                price: parseInt(arg3),
                status: true,
                category: arg5,
                quantity: parseInt(arg6),
                size: arg7
            }
            response = await request.post(`/cart/${arg8}`).send(orderData);
        });
        then(/^o banco de dados adiciona o produto de item_id "(.*)" ao carrinho de user_id "(.*)"$/, async (arg0,arg1) => {
            response = await request.get(`/cart/${arg1}`);
            expect(response.body.items[1].item_id).toBe(arg0);
        });
        and('o preço total do carrinho de user_id "6" é atualizado para a soma dos valores dos produtos', async () => {
            response = await request.get(`/cart/6`);
            const price_item1 = response.body.items[0].price * response.body.items[0].quantity;
            const price_item2 = response.body.items[1].price * response.body.items[1].quantity;
            expect(response.body.price).toBe(price_item1 + price_item2);
        });
    })
        
        /* Scenario: Remover um produto do carrinho 
        Given o banco de dados possui um carrinho com user_id "8" e o produto de item_id "1" com nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P"
        When o produto de item_id "1" é removido do carrinho
        Then o banco de dados remove o produto de item_id "1" do banco de dados 
        And o preço do produto de item_id "1" é subtraido do preço total do carrinho de user_id "8"  */
    test ('Remover um produto do carrinho', ({given, when, then, and}) => {
        given('o banco de dados possui um carrinho com user_id "8" e o produto de item_id "1" com nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P"', async () => {
            response = await request.delete(`/cart/8`);
            const orderData = {
                item_id: "1",
                name: "Camisa Cin 50 anos",
                description: "Esta é uma camisa que representa os 50 anos do Centro de informática",
                price: 50,
                status: true,
                category: "Camisas",
                quantity: 4,
                size: "P"
            }
            response = await request.post(`/cart/8`).send(orderData);
        });
        when(/^o produto de item_id "(.*)" é removido do carrinho$/, async (arg0) => {
            response = await request.get(`/cart/8`);
            console.log(response.body)
            response = await request.delete(`/cart/8/${arg0}`);
        });
        then(/^o banco de dados remove o produto de item_id "(.*)" do banco de dados$/, async (arg0) => {
            response = await request.get(`/cart/8`);
            expect(response.body.items[0]).toBe(undefined);
        });
        and('o preço do produto de item_id "1" é subtraido do preço total do carrinho de user_id "8"', async () => {
            response = await request.get(`/cart/8`);
            expect(response.body.price).toBe(0);
        });
    });

        /* Scenario: Editar um produto do carrinho 
        Given o banco de dados possui um carrinho com user_id "10" e o produto de item_id "1" com nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P"
        When o tamanho do produto de item_id "1" é editado para "M"
        And a quantidade do produto de item_id "1" é editado para "2"
        Then o banco de dados edita o valor do campo tamanho do produto de item_id "1" para "M"
        And o banco de dados edita o valor do campo de quantidade do produto de item_id para "2" */
    test ('Editar um produto do carrinho', ({given, when, then, and}) => {
        given('o banco de dados possui um carrinho com user_id "10" e o produto de item_id "1" com nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P"', async () => {
            response = await request.delete(`/cart/10`);
            const orderData = {
                item_id: "1",
                name: "Camisa Cin 50 anos",
                description: "Esta é uma camisa que representa os 50 anos do Centro de informática",
                price: 50,
                status: true,
                category: "Camisas",
                quantity: 4,
                size: "P"
            }
            response = await request.post(`/cart/10`).send(orderData);
        });
        when(/^o tamanho do produto de item_id "(.*)" é editado para "(.*)"$/, async (arg0, arg1) => {
            response = await request.put(`/cart/10/${arg0}`).send({size: arg1});
        });
        and(/^a quantidade do produto de item_id "(.*)" é editado para "(.*)"$/, async (arg0, arg1) => {
            response = await request.put(`/cart/10/${arg0}`).send({quantity: parseInt(arg1)});
        });
        then(/^o banco de dados edita o valor do campo tamanho do produto de item_id "(.*)" para "(.*)"$/, async (arg0, arg1) => {
            response = await request.get(`/cart/10`);
            console.log(response.body)
            expect(response.body.items[0].size).toBe(arg1);
        });
        and(/^o banco de dados edita o valor do campo de quantidade do produto de item_id para "(.*)"$/, async (arg0) => {
            response = await request.get(`/cart/10`);
            expect(response.body.items[0].quantity).toBe(parseInt(arg0));
        });
    });

    /* Scenario: Finalizar o pedido no carrinho de compras
    Given o banco de dados possui um carrinho com user_id "12" e o produto de item_id "1" com nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P"
    When o pedido é finalizado no carrinho
    Then o banco de dados deleta o carrinho de user_id "12" */
    test ('Finalizar o pedido no carrinho de compras', ({given, when, then}) => {
        given('o banco de dados possui um carrinho com user_id "12" e o produto de item_id "1" com nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P"', async () => {
            const orderData = {
                item_id: "1",
                name: "Camisa Cin 50 anos",
                description: "Esta é uma camisa que representa os 50 anos do Centro de informática",
                price: 50,
                status: true,
                category: "Camisas",
                quantity: 4,
                size: "P"
            }
            response = await request.post(`/cart/12`).send(orderData);
        });
        when('o pedido é finalizado no carrinho', async () => {
            response = await request.delete(`/cart/12`);
        });
        then(/^o banco de dados deleta o carrinho de user_id "(.*)"$/, async (arg0) => {
            response = await request.get(`/cart/${arg0}`);
            expect(response.body.user_id).toBe(undefined);
        });
    });
    })
