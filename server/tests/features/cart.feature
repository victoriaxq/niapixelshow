Feature: Carrinho

    Scenario: Adicionar um produto ao carrinho vazio
        Given o banco de dados esta vazio
        When o produto com item_id "1", nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P" é adicionado ao carrinho pelo user de id "5"
        Then o banco de dados cria um novo carrinho com user_id "5" e o produto de item_id "1"
        And o preço total do carrinho de user_id "5" é atualizado para o valor do produto de item_id "1"

        Given o banco de dados possui um carrinho com user_id "6" e o produto de item_id "1" com nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P"
        When o produto com item_id "2", nome "Camisa Cin Rosa", descrição "Esta é uma camisa", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P" é adicionado ao carrinho pelo usuário de user_id "6"
        Then o banco de dados adiciona o produto de item_id "2" ao carrinho de user_id "6" 
        And o preço total do carrinho de user_id "6" é atualizado para a soma dos valores dos produtos

    Scenario: Remover um produto do carrinho 
        Given o banco de dados possui um carrinho com user_id "8" e o produto de item_id "1" com nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P"
        When o produto de item_id "1" é removido do carrinho
        Then o banco de dados remove o produto de item_id "1" do banco de dados 
        And o preço do produto de item_id "1" é subtraido do preço total do carrinho de user_id "8"

    Scenario: Editar um produto do carrinho 
        Given o banco de dados possui um carrinho com user_id "10" e o produto de item_id "1" com nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P"
        When o tamanho do produto de item_id "1" é editado para "M"
        And a quantidade do produto de item_id "1" é editado para "2"
        Then o banco de dados edita o valor do campo tamanho do produto de item_id "1" para "M"
        And o banco de dados edita o valor do campo de quantidade do produto de item_id para "2"

    Scenario: Finalizar o pedido no carrinho de compras
        Given o banco de dados possui um carrinho com user_id "12" e o produto de item_id "1" com nome "Camisa Cin 50 anos", descrição "Esta é uma camisa que representa os 50 anos do Centro de informática", preço "50", status "true", categoria "Camisas", quantidade "4" e tamanho "P"
        When o pedido é finalizado no carrinho
        Then o banco de dados deleta o carrinho de user_id "12"
