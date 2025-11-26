# 🤖 CONFIGURAÇÃO DO BOT TELEGRAM

Este sistema possui um bot Telegram que notifica o administrador sobre:
- 🆕 Novos cadastros de usuários
- 💰 Comprovantes de pagamento recebidos
- ✅ Assinaturas aprovadas

## 📋 Como Configurar

### 1️⃣ Criar o Bot no Telegram

1. Abra o Telegram e procure por `@BotFather`
2. Envie o comando `/newbot`
3. Escolha um nome para o bot (ex: "L-PDV Notificações")
4. Escolha um username (ex: "lpdv_notifications_bot")
5. O BotFather vai te dar um **TOKEN** - guarde ele!

### 2️⃣ Obter seu Chat ID

1. Inicie uma conversa com seu bot (clique no link que o BotFather enviou)
2. Envie `/start` para o bot
3. O bot vai responder com seu **Chat ID** - guarde ele!

### 3️⃣ Configurar as Variáveis de Ambiente

Você tem duas opções:

#### Opção A: Arquivo .env (Recomendado)

Crie um arquivo `.env` na raiz do projeto com:

```env
TELEGRAM_BOT_TOKEN=seu_token_aqui
ADMIN_CHAT_ID=seu_chat_id_aqui
```

#### Opção B: Variáveis de Sistema

No Windows, execute no PowerShell (como Administrador):

```powershell
[System.Environment]::SetEnvironmentVariable('TELEGRAM_BOT_TOKEN', 'seu_token_aqui', 'User')
[System.Environment]::SetEnvironmentVariable('ADMIN_CHAT_ID', 'seu_chat_id_aqui', 'User')
```

### 4️⃣ Reiniciar o Servidor

Após configurar, reinicie o servidor:

```bash
npm start
```

Se tudo estiver correto, você verá:
```
✅ Bot Telegram inicializado com sucesso!
```

## 🔔 Notificações Automáticas

O bot enviará mensagens automaticamente quando:

### 🆕 Novo Cadastro
```
🆕 NOVO CADASTRO

👤 Nome: João Silva
📧 Email: joao@email.com
🕐 Data: 23/11/2025 12:30:00

💡 O usuário precisa fazer a assinatura para acessar o sistema.
```

### 💰 Comprovante Recebido
```
💰 COMPROVANTE DE PAGAMENTO RECEBIDO

👤 Nome: João Silva
📧 Email: joao@email.com
🕐 Data: 23/11/2025 12:35:00

⚠️ AÇÃO NECESSÁRIA:
Acesse o painel admin para verificar o comprovante e aprovar a assinatura.
```

### ✅ Assinatura Aprovada
```
✅ ASSINATURA APROVADA

👤 Nome: João Silva
📧 Email: joao@email.com
🕐 Data: 23/11/2025 12:40:00

💎 O usuário agora tem acesso completo ao sistema!
```

## 🎮 Comandos do Bot

Você pode enviar estes comandos para o bot:

- `/start` - Mostra informações e seu Chat ID
- `/status` - Verifica se o sistema está online

## ⚠️ Importante

- **Mantenha o TOKEN em segredo!** Não compartilhe com ninguém
- **Não commite o arquivo .env** no Git (já está no .gitignore)
- Se o bot não estiver configurado, o sistema funcionará normalmente, apenas sem notificações

## 🔧 Troubleshooting

### Bot não está enviando mensagens

1. Verifique se o TOKEN está correto
2. Verifique se o CHAT_ID está correto
3. Certifique-se de ter iniciado conversa com o bot (`/start`)
4. Verifique os logs do servidor para erros

### Como testar se está funcionando

1. Faça um novo cadastro no sistema
2. Você deve receber uma notificação no Telegram
3. Se não receber, verifique os logs do servidor

## 📞 Suporte

Se tiver problemas, verifique:
- Os logs do servidor
- Se o bot está ativo no Telegram
- Se as variáveis de ambiente estão configuradas corretamente
