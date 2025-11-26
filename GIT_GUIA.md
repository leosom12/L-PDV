# 🔄 Guia Rápido - Sincronizar com GitHub

## 📋 Pré-requisitos

### 1. Instalar o Git
- **Download**: https://git-scm.com/download/win
- Execute o instalador e aceite as opções padrão
- **IMPORTANTE**: Reinicie o terminal após a instalação

### 2. Verificar instalação
```powershell
git --version
```

## 🚀 Configuração Inicial (Fazer UMA VEZ)

### Opção 1: Usar o script automático
```batch
git-configurar.bat
```

### Opção 2: Configuração manual
```powershell
# Inicializar repositório
git init

# Adicionar repositório remoto
git remote add origin https://github.com/leosom12/L-PDV.git

# Configurar seu nome e email
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"
```

## 📤 Enviar seu código para o GitHub (Primeira vez)

### Opção 1: Usar scripts automáticos
```batch
# 1. Fazer commit inicial
git-commit-inicial.bat

# 2. Enviar para GitHub
git-push.bat
```

### Opção 2: Comandos manuais
```powershell
# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit - Sistema PDV Supermercado"

# Enviar para GitHub
git branch -M main
git push -u origin main --force
```

## 🔄 Uso Diário - Sincronizar alterações

### Enviar alterações (após modificar código)
```batch
git-sync.bat
```
OU manualmente:
```powershell
git add .
git commit -m "Descrição das alterações"
git push
```

### Baixar alterações (do GitHub para seu PC)
```batch
git-pull.bat
```
OU manualmente:
```powershell
git pull origin main
```

## 📁 Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `git-configurar.bat` | Configura o Git pela primeira vez |
| `git-commit-inicial.bat` | Faz o primeiro commit |
| `git-push.bat` | Envia alterações para o GitHub |
| `git-pull.bat` | Baixa alterações do GitHub |
| `git-sync.bat` | Sincroniza tudo (add + commit + push) |
| `.gitignore` | Define arquivos que não devem ir para o GitHub |

## ⚠️ Arquivos que NÃO vão para o GitHub

O arquivo `.gitignore` já está configurado para ignorar:
- ✅ `node_modules/` (dependências)
- ✅ `*.db` (bancos de dados)
- ✅ `.env` (configurações sensíveis)
- ✅ `*.log` (logs)
- ✅ `proof.png` (comprovantes)
- ✅ Executáveis (cloudflared.exe, ngrok.exe)

## 🔐 Autenticação no GitHub

Na primeira vez que fizer push, o Git pedirá suas credenciais:

### Opção 1: Token de Acesso Pessoal (Recomendado)
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Marque: `repo` (acesso completo ao repositório)
4. Copie o token gerado
5. Use o token como senha quando o Git pedir

### Opção 2: GitHub CLI
```powershell
# Instalar GitHub CLI
winget install GitHub.cli

# Fazer login
gh auth login
```

## 🆘 Problemas Comuns

### "Git não é reconhecido como comando"
- ✅ Instale o Git: https://git-scm.com/download/win
- ✅ Reinicie o terminal

### "Permission denied" ao fazer push
- ✅ Verifique se você tem acesso ao repositório
- ✅ Use um token de acesso pessoal como senha

### "Conflitos ao fazer pull"
```powershell
# Ver arquivos em conflito
git status

# Resolver conflitos manualmente nos arquivos
# Depois:
git add .
git commit -m "Resolvido conflitos"
git push
```

## 📊 Comandos Úteis

```powershell
# Ver status dos arquivos
git status

# Ver histórico de commits
git log --oneline

# Ver diferenças
git diff

# Desfazer alterações não commitadas
git checkout .

# Ver repositórios remotos
git remote -v
```

## 🎯 Fluxo de Trabalho Recomendado

1. **Antes de começar a trabalhar**: `git-pull.bat`
2. **Faça suas alterações no código**
3. **Ao terminar**: `git-sync.bat`
4. **Digite uma mensagem descritiva** do que foi alterado

## 🌐 Acessar seu Repositório

Após o push, acesse:
**https://github.com/leosom12/L-PDV**

---

💡 **Dica**: Execute os scripts `.bat` clicando duas vezes neles ou pelo terminal!
