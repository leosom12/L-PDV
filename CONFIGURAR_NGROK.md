# 🔧 Configuração do ngrok

## ⚠️ IMPORTANTE: Autenticação Necessária

O ngrok requer uma conta gratuita e um token de autenticação para funcionar.

## 📝 Passo a Passo

### 1️⃣ Criar Conta Gratuita

1. Acesse: https://dashboard.ngrok.com/signup
2. Crie uma conta gratuita (pode usar Google/GitHub)
3. Faça login

### 2️⃣ Obter Token de Autenticação

1. Após fazer login, você será redirecionado para: https://dashboard.ngrok.com/get-started/your-authtoken
2. Copie o seu **authtoken** (algo como: `2abc123def456ghi789jkl`)

### 3️⃣ Configurar o Token

Execute o seguinte comando **UMA ÚNICA VEZ**:

```powershell
C:\ngrok\ngrok.exe config add-authtoken SEU_TOKEN_AQUI
```

**Exemplo:**
```powershell
C:\ngrok\ngrok.exe config add-authtoken 2abc123def456ghi789jkl
```

### 4️⃣ Iniciar o Túnel

Agora você pode usar o túnel normalmente:

```bash
.\iniciar-ngrok.bat
```

## 🎯 Resumo Rápido

```powershell
# 1. Obter token em: https://dashboard.ngrok.com/get-started/your-authtoken

# 2. Configurar (substitua SEU_TOKEN):
C:\ngrok\ngrok.exe config add-authtoken SEU_TOKEN_AQUI

# 3. Iniciar túnel:
.\iniciar-ngrok.bat
```

## ✅ Benefícios do ngrok

- ✅ **Gratuito** para uso básico
- ✅ **Sem senha** para visitantes
- ✅ **HTTPS automático**
- ✅ **URLs personalizadas** (plano pago)
- ✅ **Dashboard web** para monitorar requisições

## 🔗 Links Úteis

- **Criar conta:** https://dashboard.ngrok.com/signup
- **Obter token:** https://dashboard.ngrok.com/get-started/your-authtoken
- **Documentação:** https://ngrok.com/docs

---

**Pronto!** Após configurar o token, você poderá compartilhar seu app com qualquer pessoa na internet! 🚀
