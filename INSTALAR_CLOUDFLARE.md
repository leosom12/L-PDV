# 🚀 Instalação Cloudflare Tunnel - Passo a Passo

## 📥 Passo 1: Baixar o Cloudflared

### Opção A: Download Direto (Recomendado)
1. Abra este link no navegador:
   ```
   https://github.com/cloudflare/cloudflared/releases/latest
   ```

2. Procure pelo arquivo:
   ```
   cloudflared-windows-amd64.exe
   ```

3. Clique para baixar (aproximadamente 50 MB)

### Opção B: Link Direto
```
https://github.com/cloudflare/cloudflared/releases/download/2024.11.0/cloudflared-windows-amd64.exe
```

---

## 📁 Passo 2: Organizar o Arquivo

1. Crie uma pasta:
   ```
   C:\cloudflared\
   ```

2. Mova o arquivo baixado para esta pasta

3. Renomeie de `cloudflared-windows-amd64.exe` para `cloudflared.exe`

---

## ✅ Passo 3: Testar a Instalação

Abra o PowerShell e execute:

```powershell
C:\cloudflared\cloudflared.exe --version
```

Você deve ver algo como:
```
cloudflared version 2024.11.0
```

---

## 🌍 Passo 4: Criar o Túnel Público

Com seu servidor rodando em `localhost:3000`, execute:

```powershell
C:\cloudflared\cloudflared.exe tunnel --url http://localhost:3000
```

---

## 🎉 Resultado Esperado

Você verá algo assim:

```
2024-11-23T12:22:44Z INF Thank you for trying Cloudflare Tunnel...
2024-11-23T12:22:45Z INF Connection registered connIndex=0 location=GRU
2024-11-23T12:22:45Z INF 
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable): |
|  https://abc-def-ghi-jkl.trycloudflare.com                                                |
+--------------------------------------------------------------------------------------------+
```

**Copie a URL** (exemplo: `https://abc-def-ghi-jkl.trycloudflare.com`) e compartilhe!

---

## 📱 Como Usar

1. **Mantenha o PowerShell aberto** com o comando rodando
2. **Compartilhe a URL** com quem quiser acessar
3. **A URL é temporária** - muda cada vez que você reinicia o túnel
4. **Gratuito e ilimitado** - sem necessidade de conta

---

## ⚠️ Importante

- ✅ Seu servidor precisa estar rodando (`node server.js`)
- ✅ Mantenha o terminal do cloudflared aberto
- ✅ A URL pública funcionará enquanto o túnel estiver ativo
- ⚠️ Se fechar o terminal, a URL para de funcionar
- ⚠️ Cada vez que iniciar, receberá uma URL diferente

---

## 🔄 Para Usar Novamente

Sempre que quiser tornar seu servidor público:

1. Inicie o servidor:
   ```powershell
   node server.js
   ```

2. Em outro terminal, inicie o túnel:
   ```powershell
   C:\cloudflared\cloudflared.exe tunnel --url http://localhost:3000
   ```

3. Copie a nova URL gerada

---

## 🆘 Problemas Comuns

### "cloudflared não é reconhecido"
- Verifique se o arquivo está em `C:\cloudflared\cloudflared.exe`
- Use o caminho completo no comando

### "Connection refused"
- Certifique-se que o servidor está rodando em `localhost:3000`
- Verifique com: `http://localhost:3000` no navegador

### Túnel não conecta
- Verifique sua conexão com a internet
- Tente novamente após alguns segundos

---

## 💡 Dica Pro

Para facilitar, adicione `C:\cloudflared\` ao PATH do Windows:

1. Pesquise "Variáveis de Ambiente" no Windows
2. Edite a variável "Path"
3. Adicione: `C:\cloudflared\`
4. Depois poderá usar apenas: `cloudflared tunnel --url http://localhost:3000`
