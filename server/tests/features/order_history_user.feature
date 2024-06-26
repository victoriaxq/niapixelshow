Feature: Histórico de pedidos do Usuário

    Scenario: Retornar pedidos no histórico de pedidos com pedidos cadastrados
        Given um usuário com nome "Thiago", email "thiagojgcosta@gmail.com", senha "Thiago123" e telefone "81994255845"
        And o pedido com email "thiagojgcosta@gmail.com", item "Camisa CIN" com descrição "Vermelha, M", quantidade "2", preço "50,00" reais, status "Pago", criado em "2024-05-14", para o endereço "Rua Altamira, 500" cadastrado
        When acessar a página de Histórico de Pedidos
        Then é retornado o pedido com email "thiagojgcosta@gmail.com", item "Camisa CIN" com descrição "Vermelha, M", quantidade "2", preço "50,00" reais, status "Pago", criado em "2024-05-14", para o endereço "Rua Altamira, 500"

    Scenario: Retornar mensagem no histórico de pedidos sem pedidos cadastrados
        Given um usuário com nome "Thiago", email "thiagojgcosta@gmail.com", senha "Thiago123" e telefone "81994255845"
        And não tem cadastrado nenhum pedido
        When acessar a página de Histórico de Pedidos
        Then é retornada uma mensagem informando que não há pedidos cadastrados

    Scenario: Retornar pedidos filtrados
        Given um usuário com nome "Thiago", email "thiagojgcosta@gmail.com", senha "Thiago123" e telefone "81994255845"
        And o pedido com email "thiagojgcosta@gmail.com", item "Camisa CIN" com descrição "Vermelha, M", quantidade "2", preço "50,00" reais, status "Pago", criado em "2024-05-14", para o endereço "Rua Altamira, 500" cadastrado
        And o pedido com email "thiagojgcosta@gmail.com", item "Caneca CIN" com descrição "Preta, P", quantidade "1", preço "20,00" reais, status "Pago", criado em "2024-05-13", para o endereço "Rua Altamira, 500" cadastrado 
        When filtrar por "price" "Acima de 30,00"
        Then é retornado o pedido com email "thiagojgcosta@gmail.com", item "Camisa CIN" com descrição "Vermelha, M", quantidade "2", preço "50,00" reais, status "Pago", criado em "2024-05-14", para o endereço "Rua Altamira, 500"