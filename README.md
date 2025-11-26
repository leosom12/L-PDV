# 🛒 Sistema PDV Supermercado - PWA

Sistema completo de Ponto de Venda para Supermercado com Progressive Web App (PWA).

## ✨ Características

- 🔐 **Autenticação com 2 tipos de usuários**:
  - **Administrador**: Acesso total ao sistema
  - **Usuários Normais**: Podem se cadastrar e usar o PDV

- 💰 **Caixa (PDV)**:
  - Leitura de código de barras
  - Carrinho de compras
  - Múltiplos métodos de pagamento (Dinheiro, Cartão, PIX)
  - Controle de estoque em tempo real

- 📦 **Gestão de Produtos**:
  - Cadastro, edição e exclusão
  - Controle de estoque
  - Alertas de estoque baixo
  - Ícones personalizados (emojis)

- 📈 **Relatórios**:
  - Visão Geral com estatísticas
  - Histórico de vendas
  - Análise de estoque

- ⚙️ **Painel Administrativo**:
  - Visualizar todos os usuários cadastrados
  - Monitorar atividades do sistema

- 📱 **PWA (Progressive Web App)**:
  - Instalável em dispositivos móveis
  - Funciona offline (após primeira carga)
  - Interface responsiva

## 🚀 Como Usar

### 1. O servidor já está rodando!

Acesse: **http://localhost:3000**

### 2. Credenciais do Administrador

```
📧 Email: djleocv.hotmail.com@gmail.com
🔑 Senha: admin123
```

### 3. Criar Usuário Normal

1. Clique na aba "Cadastrar"
2. Preencha os dados:
   - Nome
   - Email
   - Senha (mínimo 6 caracteres)
3. Clique em "Criar Conta"
4. Faça login com as credenciais criadas

## 📖 Guia de Uso

### Visão Geral
- Visualize estatísticas gerais do sistema
- Total de produtos, vendas e valores
- Alertas de estoque baixo

### Caixa (PDV)
1. Digite ou escaneie o código de barras do produto
2. O produto será adicionado ao carrinho automaticamente
3. Escolha o método de pagamento
4. Clique em "Finalizar Venda"

### Produtos
1. Clique em "+ Novo Produto"
2. Preencha os dados:
   - Código de barras
   - Nome
   - Categoria
   - Preço
   - Estoque inicial
   - Ícone (emoji)
3. Clique em "Salvar"

### Vendas
- Visualize o histórico completo de vendas
- Veja data, itens, método de pagamento e valor total

### Admin (apenas para administrador)
- Liste todos os usuários cadastrados
- Veja informações como email, tipo e data de cadastro

## 🎨 Recursos Visuais

- **Design Moderno**: Interface limpa e profissional
- **Cores Vibrantes**: Gradientes e cores que chamam atenção
- **Responsivo**: Funciona em desktop, tablet e celular
- **Animações**: Transições suaves e feedback visual

## 🔧 Tecnologias Utilizadas

### Backend
- Node.js
- Express
- SQLite3
- JWT (autenticação)
- bcryptjs (criptografia de senhas)

### Frontend
- HTML5
- CSS3 (design moderno e responsivo)
- JavaScript (Vanilla)
- PWA (Service Worker + Manifest)

## 📱 Instalar como PWA

### No Chrome/Edge (Desktop):
1. Acesse http://localhost:3000
2. Clique no ícone de instalação na barra de endereço
3. Clique em "Instalar"

### No Chrome (Android):
1. Acesse http://localhost:3000
2. Toque no menu (⋮)
3. Selecione "Adicionar à tela inicial"

### No Safari (iOS):
1. Acesse http://localhost:3000
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela de Início"

## 🗄️ Estrutura de Dados

### Banco de Dados Principal (main.db)
- **users**: Usuários do sistema
  - id, username, email, password, is_admin, created_at

### Banco de Dados por Usuário (user_X.db)
- **products**: Produtos do usuário
  - id, barcode, name, category, price, stock, icon, created_at
  
- **sales**: Vendas realizadas
  - id, total, payment_method, items, created_at

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Autenticação via JWT
- ✅ Isolamento de dados por usuário
- ✅ Validação de estoque antes de vendas
- ✅ Proteção de rotas administrativas

## 📝 Exemplos de Uso

### Cadastrar um Produto
```
Código: 7891234567890
Nome: Arroz Tipo 1 - 5kg
Categoria: Alimentos
Preço: 25.90
Estoque: 50
Ícone: 🍚
```

### Realizar uma Venda
1. Digite o código: `7891234567890`
2. Produto adicionado ao carrinho
3. Escolha: Dinheiro
4. Clique em "Finalizar Venda"
5. Venda concluída! Estoque atualizado automaticamente

## 🎯 Funcionalidades Futuras (Sugestões)

- [ ] Impressão de cupom fiscal
- [ ] Integração com leitor de código de barras físico
- [ ] Relatórios em PDF
- [ ] Backup automático
- [ ] Modo escuro
- [ ] Notificações push
- [ ] Gráficos de vendas
- [ ] Controle de caixa (abertura/fechamento)

## 🆘 Suporte

Se encontrar algum problema:
1. Verifique se o servidor está rodando
2. Limpe o cache do navegador
3. Verifique o console do navegador (F12)
4. Reinicie o servidor se necessário

## 📄 Licença

MIT License - Livre para uso pessoal e comercial

---

**Desenvolvido com ❤️ para facilitar a gestão de supermercados**
