# 🤖 GUIA RÁPIDO - BOT TELEGRAM

## ⚡ Configuração Rápida (5 minutos)

### 1️⃣ Criar o Bot

1. Abra o Telegram
2. Procure por: `@BotFather`
3. Envie: `/newbot`
4. Nome do bot: `L-PDV Notificações`
5. Username: `lpdv_notifications_bot` (ou outro disponível)
6. **COPIE O TOKEN** que o BotFather enviar

### 2️⃣ Obter seu Chat ID

1. Clique no link do bot que o BotFather enviou
2. Envie: `/start`
3. O bot vai responder com seu **Chat ID**
4. **COPIE O CHAT ID**

### 3️⃣ Configurar no Servidor

Edite o arquivo `telegram-bot.js` e substitua:

```javascript
const TELEGRAM_BOT_TOKEN = 'SEU_TOKEN_AQUI';  // ← Cole seu token aqui
const ADMIN_CHAT_ID = 'SEU_CHAT_ID_AQUI';     // ← Cole seu chat ID aqui
```

### 4️⃣ Reiniciar o Servidor

Pare o servidor atual (Ctrl+C) e inicie novamente:

```bash
node server.js
```

Se tudo estiver correto, você verá:
```
✅ Bot Telegram inicializado com sucesso!
```

## 📱 Testando

1. Faça um novo cadastro no sistema
2. Você deve receber uma notificação no Telegram!

## 🔔 Notificações que você receberá:

- 🆕 **Novo Cadastro**: Quando alguém se registra
- 💰 **Comprovante Recebido**: Quando alguém envia comprovante de pagamento
- ✅ **Assinatura Aprovada**: Quando você aprovar uma assinatura

## ❓ Problemas?

Se não funcionar:
1. Verifique se o TOKEN está correto
2. Verifique se o CHAT_ID está correto
3. Certifique-se de ter enviado `/start` para o bot
4. Veja os logs do servidor para erros

## 📖 Documentação Completa

Veja `TELEGRAM_BOT.md` para mais detalhes.
