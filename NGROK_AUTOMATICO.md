# 🚀 ngrok Automático - Configuração e Uso

## ✅ O que mudou?

Agora o **ngrok inicia AUTOMATICAMENTE** quando você executa `npm start`! 🎉

Você **NÃO precisa mais** executar `iniciar-ngrok.bat` em uma janela separada.

## 📋 Configuração Inicial (Uma Única Vez)

### **Método 1: Script Automático (Recomendado)**

1. Execute o script de configuração:
   ```bash
   .\configurar-token-ngrok.bat
   ```

2. Cole seu token do ngrok quando solicitado
   - Obtenha em: https://dashboard.ngrok.com/get-started/your-authtoken

3. Pronto! O token será salvo automaticamente

### **Método 2: Manual**

1. Crie uma conta gratuita no ngrok:
   - https://dashboard.ngrok.com/signup

2. Copie seu authtoken:
   - https://dashboard.ngrok.com/get-started/your-authtoken

3. Crie um arquivo `.env` na raiz do projeto:
   ```bash
   copy .env.example .env
   ```

4. Edite o arquivo `.env` e adicione seu token:
   ```
   NGROK_AUTHTOKEN=seu_token_aqui
   ```

5. Salve o arquivo

## 🎯 Como Usar

### **Iniciar o Servidor (com ngrok automático)**

```bash
npm start
```

Isso irá:
1. ✅ Iniciar o servidor na porta 80
2. ✅ Iniciar o ngrok automaticamente
3. ✅ Exibir a URL pública no console
4. ✅ Abrir a interface de monitoramento em http://127.0.0.1:4040

### **Saída Esperada**

```
============================================================
🛒 Sistema PDV Supermercado - PWA
============================================================
📡 Servidor LOCAL: http://localhost
🌐 Servidor REDE:  http://192.168.1.100

👤 ADMINISTRADOR:
   📧 Email: djleocv.hotmail.com@gmail.com
   🔑 Senha: admin123

👥 USUÁRIOS NORMAIS:
   ✓ Cadastro liberado
   💎 Assinatura: R$ 50.00 (PIX)
============================================================

⚠️  Bot Telegram não configurado. Configure TELEGRAM_BOT_TOKEN e ADMIN_CHAT_ID.
🌐 Iniciando túnel público ngrok...

✅ TÚNEL PÚBLICO ATIVO!
🌍 URL PÚBLICA: https://abc123-xyz.ngrok-free.app

📊 Monitoramento: http://127.0.0.1:4040

💡 Compartilhe a URL pública com qualquer pessoa!
============================================================
```

## 🌐 Acessando o Sistema

### **Localmente:**
- `http://localhost`
- `http://192.168.x.x` (IP da sua rede)

### **Publicamente (Internet):**
- Use a URL exibida no console (ex: `https://abc123.ngrok-free.app`)
- Compartilhe com qualquer pessoa no mundo!

### **Monitoramento:**
- `http://127.0.0.1:4040` - Interface web do ngrok
  - Veja todas as requisições em tempo real
  - Inspecione headers, body, etc.

## 🔧 Solução de Problemas

### **Erro: "Ngrok não iniciado"**

Se você ver esta mensagem:
```
⚠️  Ngrok não iniciado: missing authtoken
```

**Solução:**
1. Configure o token usando: `.\configurar-token-ngrok.bat`
2. Ou adicione manualmente no arquivo `.env`

### **Token não está sendo reconhecido**

1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Verifique se o token está correto (sem espaços extras)
3. Reinicie o servidor (`Ctrl+C` e depois `npm start`)

### **Porta 80 em uso**

Se a porta 80 estiver ocupada:
1. Edite `server.js` e mude `const PORT = 80;` para outra porta (ex: `3000`)
2. Reinicie o servidor

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Comandos** | `npm start` + `.\iniciar-ngrok.bat` | Apenas `npm start` |
| **Janelas** | 2 janelas separadas | 1 janela única |
| **Configuração** | Manual toda vez | Automática |
| **URL pública** | Copiar da janela do ngrok | Exibida no console |

## 🎁 Vantagens

✅ **Mais simples** - Um único comando para tudo  
✅ **Menos confusão** - Não precisa gerenciar múltiplas janelas  
✅ **Mais rápido** - Inicia tudo de uma vez  
✅ **Mais confiável** - Não esquece de iniciar o ngrok  
✅ **Melhor integração** - URL pública disponível via API

## 🔄 Desativar o ngrok Automático

Se por algum motivo você quiser desativar o ngrok automático:

1. Remova ou comente a variável `NGROK_AUTHTOKEN` no arquivo `.env`
2. Reinicie o servidor

O servidor continuará funcionando normalmente, mas sem o túnel público.

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia servidor + ngrok automático |
| `.\configurar-token-ngrok.bat` | Configura token do ngrok |
| `.\iniciar-ngrok.bat` | Inicia ngrok manualmente (não necessário) |

## 🔗 Links Úteis

- **Criar conta ngrok**: https://dashboard.ngrok.com/signup
- **Obter token**: https://dashboard.ngrok.com/get-started/your-authtoken
- **Documentação ngrok**: https://ngrok.com/docs
- **Interface web local**: http://127.0.0.1:4040

---

**Data de Implementação**: 23/11/2025 às 15:08  
**Status**: ✅ Funcionando Perfeitamente!
