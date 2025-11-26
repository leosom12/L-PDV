# Configurar Git e Sincronizar com GitHub

## Passo 1: Instalar o Git

1. Baixe o Git para Windows em: https://git-scm.com/download/win
2. Execute o instalador
3. Durante a instalação, aceite as opções padrão
4. Após a instalação, **reinicie o PowerShell/Terminal**

## Passo 2: Verificar Instalação

Abra um novo terminal e execute:
```powershell
git --version
```

Se aparecer a versão do Git, está instalado corretamente.

## Passo 3: Configurar suas credenciais do Git

```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"
```

## Passo 4: Inicializar o repositório Git nesta pasta

Execute os comandos abaixo **dentro da pasta supermarket-pos**:

```powershell
# Inicializar repositório Git
git init

# Adicionar o repositório remoto
git remote add origin https://github.com/leosom12/L-PDV.git

# Criar arquivo .gitignore
```

## Passo 5: Criar .gitignore

Antes de fazer commit, é importante ignorar arquivos desnecessários como:
- node_modules/
- *.db (bancos de dados)
- .env (configurações sensíveis)
- *.log

## Passo 6: Fazer o primeiro commit

```powershell
# Adicionar todos os arquivos (exceto os do .gitignore)
git add .

# Fazer o commit
git commit -m "Initial commit - Sistema PDV Supermercado"

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

## Comandos úteis para sincronização

### Enviar alterações para o GitHub:
```powershell
git add .
git commit -m "Descrição das alterações"
git push
```

### Baixar alterações do GitHub:
```powershell
git pull
```

### Ver status dos arquivos:
```powershell
git status
```

### Ver histórico de commits:
```powershell
git log
```

## Observações Importantes

⚠️ **ATENÇÃO**: O repositório L-PDV no GitHub está praticamente vazio (só tem LICENSE). Quando você fizer o push, você estará **enviando todo o conteúdo** da pasta supermarket-pos para lá.

Se você quiser manter o histórico do repositório remoto, use:
```powershell
git pull origin main --allow-unrelated-histories
```

Antes do primeiro push.
