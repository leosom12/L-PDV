# 🎯 INÍCIO RÁPIDO - Git e GitHub

## ⚡ 3 Passos Simples

### 1️⃣ INSTALAR GIT (Fazer uma vez)
```
1. Abra: https://git-scm.com/download/win
2. Baixe e instale
3. Reinicie o terminal
```

### 2️⃣ CONFIGURAR (Fazer uma vez)
```batch
Clique duas vezes em: git-configurar.bat
```

### 3️⃣ ENVIAR PARA GITHUB (Primeira vez)
```batch
1. Clique em: git-commit-inicial.bat
2. Clique em: git-push.bat
```

## 🔄 Uso Diário

### Enviar alterações:
```batch
git-sync.bat
```

### Baixar alterações:
```batch
git-pull.bat
```

---

## 📝 PASSO A PASSO DETALHADO

### PASSO 1: Instalar Git

1. Acesse https://git-scm.com/download/win
2. Clique em "Click here to download"
3. Execute o arquivo baixado
4. Clique em "Next" em todas as telas (aceite padrões)
5. Clique em "Install"
6. **IMPORTANTE**: Feche e abra novamente o PowerShell/Terminal

### PASSO 2: Verificar Instalação

Abra o PowerShell e digite:
```powershell
git --version
```

Se aparecer algo como `git version 2.x.x`, está OK! ✅

### PASSO 3: Configurar Repositório

**Opção A - Automático (Recomendado):**
1. Vá para a pasta: `C:\Users\pc\.gemini\antigravity\scratch\supermarket-pos`
2. Clique duas vezes em: `git-configurar.bat`
3. Siga as instruções na tela

**Opção B - Manual:**
Abra o PowerShell na pasta do projeto e digite:
```powershell
git init
git remote add origin https://github.com/leosom12/L-PDV.git
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### PASSO 4: Primeiro Commit

**Opção A - Automático:**
1. Clique duas vezes em: `git-commit-inicial.bat`
2. Digite uma mensagem (ou deixe em branco para usar a padrão)
3. Pressione Enter

**Opção B - Manual:**
```powershell
git add .
git commit -m "Initial commit - Sistema PDV"
```

### PASSO 5: Enviar para GitHub

**Opção A - Automático:**
1. Clique duas vezes em: `git-push.bat`
2. Se pedir credenciais, use seu usuário e senha do GitHub
   (ou token de acesso pessoal)

**Opção B - Manual:**
```powershell
git branch -M main
git push -u origin main --force
```

### PASSO 6: Verificar no GitHub

1. Abra: https://github.com/leosom12/L-PDV
2. Você deve ver todos os arquivos do projeto! 🎉

---

## 🔐 Configurar Autenticação (Se necessário)

Se o Git pedir senha e você tiver problemas:

### Criar Token de Acesso:
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Dê um nome: "PDV Token"
4. Marque: ✅ repo
5. Clique em "Generate token"
6. **COPIE O TOKEN** (você não verá novamente!)
7. Use o token como senha quando o Git pedir

---

## 📋 Checklist de Instalação

- [ ] Git instalado
- [ ] Terminal reiniciado
- [ ] `git --version` funciona
- [ ] Repositório configurado (`git-configurar.bat`)
- [ ] Primeiro commit feito (`git-commit-inicial.bat`)
- [ ] Push para GitHub (`git-push.bat`)
- [ ] Código visível em https://github.com/leosom12/L-PDV

---

## 🆘 Ajuda Rápida

### Git não é reconhecido
```
Solução: Instale o Git e reinicie o terminal
```

### Erro ao fazer push
```
Solução: Verifique suas credenciais do GitHub
Use um token de acesso pessoal como senha
```

### Arquivos sensíveis no Git
```
Solução: Já configurado! O .gitignore protege:
- Bancos de dados (.db)
- Senhas (.env)
- node_modules
- Logs
```

---

## 📞 Precisa de Ajuda?

Leia os guias completos:
- `GIT_GUIA.md` - Guia completo
- `configurar-git.md` - Instruções detalhadas

Ou abra uma issue no GitHub:
https://github.com/leosom12/L-PDV/issues
