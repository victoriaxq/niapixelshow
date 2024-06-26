import { loadFeature, defineFeature } from 'jest-cucumber';
import supertest from 'supertest';
import app from '../../src/app';
import { firestoreDBTest } from '../services/firebaseAdmin';

const feature = loadFeature('tests/features/promotion.feature');

defineFeature(feature, (test) => {
  let request = supertest(app);
  let response: supertest.Response;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Limpar coleções relevantes no Firestore de teste
    const promotions = await firestoreDBTest.collection('promotions').get();
    promotions.forEach(async (doc) => {
      await doc.ref.delete();
    });

    const products = await firestoreDBTest.collection('products').get();
    products.forEach(async (doc) => {
      await doc.ref.delete();
    });

    // Adicionar produto de teste necessário
    await firestoreDBTest.collection('products').doc('CamisaCin').set({
      name: 'Camisa Cin',
    });
  });

  test('Cadastro de Promoção', ({ given, when, then, and }) => {
    given('estou logado como "administrador", com usuário "nathy" e senha "nia12345"', () => {
      // Simular autenticação do administrador, se necessário
    });

    given('estou na página "promoções"', () => {
      // Contexto inicial, se necessário
    });

    given('não existem promoções cadastradas com a descrição "Promoção de Ano Novo"', async () => {
      const snapshot = await firestoreDBTest.collection('promotions').where('name', '==', 'Promoção de Ano Novo').get();
      expect(snapshot.empty).toBe(true);
    });

    when('eu selecionar a opção de cadastrar uma nova promoção', async () => {
      response = await request.post('/promotion').send({
        start_date: '2025-01-01',
        end_date: '2025-02-01',
        name: 'Promoção de Ano Novo',
        discount: 10,
        product_id: 'CamisaCin',
      });
    });

    when('preencher o campo "data de início" com "2025-01-01"', () => {});

    when('preencher o campo "data de término" com "2025-02-01"', () => {});

    when('preencher o campo "descrição" com "Promoção de Ano Novo"', () => {});

    when('preencher o campo "porcentagem" com "10"', () => {});

    when('preencher o campo "produto" com "Camisa Cin"', () => {});

    then('a promoção "Promoção de Ano Novo" deve aparecer na lista de promoções', async () => {
      const snapshot = await firestoreDBTest.collection('promotions').where('name', '==', 'Promoção de Ano Novo').get();
      expect(snapshot.empty).toBe(false);
    });
  });

  test('Editar Promoção', ({ given, when, then, and }) => {
    given('estou logado como "administrador", com usuário "nathy" e senha "nia12345"', () => {
      // Simular autenticação do administrador, se necessário
    });

    given('estou na página "promoções"', () => {
      // Contexto inicial, se necessário
    });

    given('existem promoções cadastradas com a descrição "Promoção de Ano Novo"', async () => {
      await firestoreDBTest.collection('promotions').doc('PromoAnoNovo').set({
        start_date: '2025-01-01',
        end_date: '2025-02-01',
        name: 'Promoção de Ano Novo',
        discount: 10,
        product_id: 'CamisaCin',
      });
      console.log('Response:', response.body);
    });

    when('eu selecionar a opção de editar a promoção "Promoção de Ano Novo"', async () => {
      response = await request.put('/promotion/PromoAnoNovo').send({
        start_date: '2025-01-01',
        end_date: '2025-02-01',
        name: 'Promoção de Ano Novo',
        discount: 20,
        product_id: 'CamisaCin',
      });
      console.log('Response:', response.body);
    });

    when('preencher o campo "data de início" com "2025-01-01"', () => {});

    when('preencher o campo "data de término" com "2025-02-01"', () => {});

    when('preencher o campo "descrição" com "Promoção de Ano Novo"', () => {});

    when('preencher o campo "porcentagem" com "20"', () => {});

    when('preencher o campo "produto" com "Camisa Cin"', () => {});

    then('a promoção "Promoção de Ano Novo" deve aparecer na lista de promoções', async () => {
      const snapshot = await firestoreDBTest.collection('promotions').where('name', '==', 'Promoção de Ano Novo').get();
      expect(snapshot.empty).toBe(false);
    });
  });

  test('Excluir Promoção', ({ given, when, then, and }) => {
    given('estou logado como "administrador", com usuário "nathy" e senha "nia12345"', () => {
      // Simular autenticação do administrador, se necessário
    });

    given('estou na página "promoções"', () => {
      // Contexto inicial, se necessário
    });

    given('existem promoções cadastradas com a descrição "Promoção de Ano Novo"', async () => {
      await firestoreDBTest.collection('promotions').doc('PromoAnoNovo').set({
        start_date: '2025-01-01',
        end_date: '2025-02-01',
        name: 'Promoção de Ano Novo',
        discount: 10,
        product_id: 'CamisaCin',
      });
      console.log('Response:', response.body);
    });

    when('eu selecionar a opção de excluir a promoção "Promoção de Ano Novo"', async () => {
      response = await request.delete('/promotion/PromoAnoNovo');
      console.log('Response:', response.body);
    });

    then('a promoção "Promoção de Ano Novo" não deve aparecer na lista de promoções', async () => {
      const snapshot = await firestoreDBTest.collection('promotions').where('name', '==', 'Promoção de Ano Novo').get();
      expect(snapshot.empty).toBe(true);
    });
  });

  test('Cadastro de promoção com porcentagem menor que 0', ({ given, when, then, and }) => {
    given('estou logado como "administrador", com usuário "nathy" e senha "nia12345"', () => {
      // Simular autenticação do administrador, se necessário
    });

    given('estou na página "promoções"', () => {
      // Contexto inicial, se necessário
    });

    given('não existem promoções cadastradas com a descrição "Promoção de Ano Novo"', async () => {
      const snapshot = await firestoreDBTest.collection('promotions').where('name', '==', 'Promoção de Ano Novo').get();
      expect(snapshot.empty).toBe(true);
    });

    when('eu selecionar a opção de cadastrar uma nova promoção', async () => {
      response = await request.post('/promotion').send({
        start_date: '2025-01-01',
        end_date: '2025-02-01',
        name: 'Promoção de Ano Novo',
        discount: -10,
        product_id: 'CamisaCin',
      });
    });

    when('preencher o campo "data de início" com "2025-01-01"', () => {});

    when('preencher o campo "data de término" com "2025-02-01"', () => {});

    when('preencher o campo "descrição" com "Promoção de Ano Novo"', () => {});

    when('preencher o campo "porcentagem" com "-10"', () => {});

    when('preencher o campo "produto" com "Camisa Cin"', () => {});

    then('a promoção "Promoção de Ano Novo" não deve aparecer na lista de promoções', async () => {
      const snapshot = await firestoreDBTest.collection('promotions').where('name', '==', 'Promoção de Ano Novo').get();
      expect(snapshot.empty).toBe(true);
    });
  });
});