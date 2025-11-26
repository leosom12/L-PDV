# 🌐 Configuração de Acesso Público - PDV Supermercado

## 📋 O que foi configurado?

O servidor agora está configurado para aceitar conexões de **qualquer dispositivo na rede local**, não apenas do localhost.

## 🚀 Como usar

### 1️⃣ Iniciar o servidor

```bash
npm start
```

Quando o servidor iniciar, você verá algo como:

```
============================================================
🛒 Sistema PDV Supermercado - PWA
============================================================
📡 Servidor LOCAL: http://localhost:3000
🌐 Servidor REDE:  http://192.168.1.100:3000

⚠️ OBSERVAÇÃO SOBRE O LOCAL TUNNEL:
   O link gerado automaticamente (loca.lt) pede uma senha.
   Para acesso SEM SENHA, use o Cloudflare Tunnel (veja abaixo).
============================================================
```

### 🚀 Acesso Público SEM SENHA (Recomendado)

Para permitir que qualquer pessoa acesse seu app sem precisar digitar a "Senha do Túnel", use o **ngrok**.

1. Mantenha o servidor rodando (`npm start`)
2. Abra um **novo terminal**
3. Execute:
   ```bash
   .\iniciar-ngrok.bat
   ```
4. Copie o link que aparece (ex: `https://xyz.ngrok-free.app`)
5. Envie esse link para seus clientes/usuários. Eles acessarão direto!

> **Nota:** O ngrok é gratuito e não requer senha para acesso público.

### 2️⃣ Configurar o Firewall (IMPORTANTE!)

Para que outros dispositivos possam acessar o servidor, você precisa liberar a porta no firewall do Windows.

#### Opção A: Script Automático (Recomendado)

Execute o PowerShell **como Administrador** e rode:

```powershell
.\setup-firewall.ps1
```

#### Opção B: Comando Manual

Execute o PowerShell **como Administrador** e rode:

```powershell
New-NetFirewallRule -DisplayName "PDV Supermercado - Porta 3000" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000 -Profile Any
```

Ou use o comando netsh (alternativa):

```cmd
netsh advfirewall firewall add rule name="PDV Port 3000" dir=in action=allow protocol=TCP localport=3000
```

### 3️⃣ Acessar de outros dispositivos

Agora você pode acessar o sistema de qualquer dispositivo na mesma rede usando o **IP PÚBLICO** mostrado no console.

Por exemplo:
- **Do seu computador**: `http://localhost:3000`
- **De outro dispositivo**: `http://192.168.1.100:3000` (use o IP mostrado no seu console)

## 📱 Testando em dispositivos móveis

1. Certifique-se de que o dispositivo móvel está na **mesma rede Wi-Fi**
2. Abra o navegador no celular/tablet
3. Digite o endereço com o **IP PÚBLICO** (ex: `http://192.168.1.100:3000`)
4. O sistema deve carregar normalmente
5. Você pode instalar o PWA no dispositivo móvel

## 🔒 Segurança

⚠️ **IMPORTANTE**: 
- O servidor está acessível para **qualquer dispositivo na sua rede local**
- **NÃO** exponha este servidor diretamente na internet sem configurações de segurança adicionais
- Para acesso via internet, considere usar:
  - VPN
  - Túnel SSH
  - Serviços como ngrok (para testes)
  - Configuração adequada de firewall e HTTPS

## 🛠️ Solução de problemas

### Não consigo acessar de outro dispositivo

1. **Verifique o firewall**: Certifique-se de que executou o script de configuração
2. **Verifique a rede**: Ambos os dispositivos devem estar na mesma rede
3. **Verifique o IP**: Use exatamente o IP mostrado no console do servidor
4. **Teste o ping**: No outro dispositivo, tente fazer ping para o IP do servidor
5. **Antivírus**: Alguns antivírus podem bloquear conexões. Verifique as configurações

### Como descobrir meu IP manualmente?

Execute no PowerShell:

```powershell
ipconfig
```

Procure por "Endereço IPv4" na interface de rede ativa (geralmente algo como `192.168.x.x` ou `10.0.x.x`)

### Como remover a regra do firewall?

```powershell
Remove-NetFirewallRule -DisplayName "PDV Supermercado - Porta 3000"
```

## 📊 Verificar conexões ativas

Para ver quem está conectado ao servidor, você pode usar:

```powershell
netstat -an | findstr :3000
```

## 🌍 Acesso via Internet (Avançado)

Se você precisa acessar o servidor pela internet (não recomendado sem segurança adequada):

### Usando ngrok (para testes)

1. Instale o ngrok: https://ngrok.com/download
2. Execute:
   ```bash
   ngrok http 3000
   ```
3. Use a URL fornecida pelo ngrok

⚠️ **Atenção**: Isso expõe seu servidor na internet. Use apenas para testes e com cautela!

## ✅ Checklist de configuração

- [ ] Servidor iniciado com `npm start`
- [ ] IP público exibido no console
- [ ] Firewall configurado (script executado como administrador)
- [ ] Testado acesso local (`http://localhost:3000`)
- [ ] Testado acesso de outro dispositivo na rede
- [ ] PWA instalado em dispositivos móveis (opcional)

---

**Pronto!** Seu servidor PDV agora está acessível publicamente na sua rede local! 🎉
