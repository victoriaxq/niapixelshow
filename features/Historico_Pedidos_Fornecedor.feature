Feature: Histórico de Pedidos do Fornecedor
As a fornecedor
I want to ser capaz de ver o histórico de pedidos dos meus clientes
So that eu possa gerenciar e acompanhar os pedidos realizados e entregues.
----------------------------------------------------------------
Cenário GUI: Visualizar Histórico de Pedidos
Given que estou logado como “nathy”, com senha “nia12345”
And sou um administrador
And eu já tenho um pedido registrado no sistema com as informações  nome ‘Camisa Nova’, descrição "Algodão", preço "R$100,00", status "Disponível" e categoria "Camisa"
When eu acessar a página "Histórico de Pedidos"
Then eu devo ver uma lista de pedidos com as seguintes informações data da compra “25/08/2024”, valor pago “R$100,00”, quantidade de produtos “1”, status do pedido “enviado”.

Scenario: Acesso ao histórico de pedidos com pedidos cadastrados
Given eu tenho o pedido com email do cliente "thiagojgcosta@gmail.com", item "Camisa CIN" com descrição "Vermelha", quantidade "2", preço "50,00" reais, status "Pago", criado em "14/05/2024", para o endereço "Rua Altamira, 500" cadastrado
And eu tenho o pedido com email do cliente "thiagojgcosta@gmail.com", item "Caneca CIN" com descrição "Preta", quantidade "1", preço "20,00" reais, status "Pago", criado em "13/05/2024", para o endereço "Rua Altamira, 500" cadastrado
When eu acesso a página "Histórico de Pedidos" do fornecedor
Then eu posso ver na lista de pedidos o pedido com item "Camisa CIN", quantidade "2", preço "50,00" reais, status "Pago"
And eu posso ver na lista de pedidos o pedido com item "Caneca CIN", quantidade "1", preço "20,00" reais, status "Pago"

Scenario: Acesso ao histórico de pedidos sem pedidos cadastrados
Given não há pedidos cadastrados no sistema
When eu acesso a página "Histórico de Pedidos" do fornecedor
Then eu vejo uma mensagem indicando que não há pedidos cadastrados

Scenario: Filtro de histórico de pedidos com pedidos cadastrados em um período específico
Given eu tenho o pedido com email do cliente "thiagojgcosta@gmail.com", item "Camisa CIN" com descrição "Vermelha", quantidade "2", preço "50,00" reais, status "Pago", criado em "14/05/2024", para o endereço "Rua Altamira, 500" cadastrado
And eu tenho o pedido com email do cliente "thiagojgcosta@gmail.com", item "Caneca CIN" com descrição "Preta", quantidade "1", preço "20,00" reais, status "Pago", criado em "13/05/2024", para o endereço "Rua Altamira, 500" cadastrado
When eu acesso a página "Histórico de Pedidos" do fornecedor
And eu filtro os pedidos com data inicial "2024-05-13" e data final "2024-05-14"
Then eu posso ver na lista de pedidos o pedido com item "Camisa CIN", quantidade "2", preço "50,00" reais, status "Pago"
And eu posso ver na lista de pedidos o pedido com item "Caneca CIN", quantidade "1", preço "20,00" reais, status "Pago"

Scenario: Exportação de histórico de pedidos com pedidos cadastrados
Given eu tenho o pedido com email do cliente "thiagojgcosta@gmail.com", item "Camisa CIN" com descrição "Vermelha", quantidade "2", preço "50,00" reais, status "Pago", criado em "14/05/2024", para o endereço "Rua Altamira, 500" cadastrado
And eu tenho o pedido com email do cliente "thiagojgcosta@gmail.com", item "Caneca CIN" com descrição "Preta", quantidade "1", preço "20,00" reais, status "Pago", criado em "13/05/2024", para o endereço "Rua Altamira, 500" cadastrado
When eu acesso a página "Histórico de Pedidos" do fornecedor
And eu seleciono a opção de exportar o histórico de pedidos
Then eu recebo um arquivo de exportação contendo os pedidos
