Feature: Pagamento

    Scenario: Marcar o pedido como pago ao confirmar pagamento
        Given o pedido com email "thiagojgcosta@gmail.com", item "Camisa CIN" com descrição "Vermelha, M", quantidade "2", preço "50,00" reais, status "Aguardando Pagamento", criado em "2024-05-14", para o endereço "Rua Altamira, 500" cadastrado
        When o pedido é confirmado
        Then o pedido possui "status" "Pago"
        # And é enviado um email de "Confirmação" para o email "thiagojgcosta@gmail.com"

    Scenario: Pagamento errado informado pelo fornecedor
        Given o pedido com email "thiagojgcosta@gmail.com", item "Camisa CIN" com descrição "Vermelha, M", quantidade "2", preço "50,00" reais, status "Aguardando Pagamento", criado em "2024-05-14", para o endereço "Rua Altamira, 500" cadastrado
        When é informado que o pagamento está errado
        Then o pedido possui "status" "Erro no Pagamento"
        # And é enviado um email de "Erro" para o email "thiagojgcosta@gmail.com"