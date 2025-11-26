# Script de Instalação Automática do Git
# Requer execução como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   INSTALAÇÃO AUTOMÁTICA DO GIT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Git já está instalado
Write-Host "🔍 Verificando instalação do Git..." -ForegroundColor Yellow
$gitInstalled = $false
try {
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git já está instalado: $gitVersion" -ForegroundColor Green
        $gitInstalled = $true
        
        $reinstall = Read-Host "Deseja reinstalar? (S/N)"
        if ($reinstall -ne "S" -and $reinstall -ne "s") {
            Write-Host "Pulando instalação..." -ForegroundColor Yellow
        } else {
            $gitInstalled = $false
        }
    }
} catch {
    Write-Host "❌ Git não está instalado" -ForegroundColor Red
}

if (-not $gitInstalled) {
    Write-Host ""
    Write-Host "📥 Baixando Git para Windows..." -ForegroundColor Yellow
    Write-Host ""
    
    # Usar winget se disponível (Windows 10/11)
    $useWinget = $false
    try {
        $wingetVersion = winget --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            $useWinget = $true
            Write-Host "✅ Usando winget para instalação" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  winget não disponível, usando download manual" -ForegroundColor Yellow
    }
    
    if ($useWinget) {
        Write-Host "Instalando Git via winget..." -ForegroundColor Cyan
        winget install --id Git.Git -e --source winget --silent --accept-package-agreements --accept-source-agreements
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Git instalado com sucesso!" -ForegroundColor Green
        } else {
            Write-Host "❌ Erro na instalação via winget" -ForegroundColor Red
            exit 1
        }
    } else {
        # Download manual
        $gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe"
        $installerPath = "$env:TEMP\Git-installer.exe"
        
        Write-Host "Baixando de: $gitUrl" -ForegroundColor Cyan
        
        try {
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            Invoke-WebRequest -Uri $gitUrl -OutFile $installerPath -UseBasicParsing
            Write-Host "✅ Download concluído!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Erro ao baixar: $_" -ForegroundColor Red
            Write-Host ""
            Write-Host "Por favor, baixe manualmente em: https://git-scm.com/download/win" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host ""
        Write-Host "🔧 Instalando Git..." -ForegroundColor Yellow
        Write-Host ""
        
        # Instalar silenciosamente
        Start-Process -FilePath $installerPath -ArgumentList "/VERYSILENT /NORESTART /NOCANCEL /SP- /CLOSEAPPLICATIONS /RESTARTAPPLICATIONS" -Wait
        
        Write-Host "✅ Git instalado!" -ForegroundColor Green
        
        # Limpar instalador
        Remove-Item $installerPath -Force -ErrorAction SilentlyContinue
    }
    
    # Atualizar PATH para a sessão atual
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Reinicie o PowerShell para usar o Git!" -ForegroundColor Yellow
    Write-Host ""
}

# Configurar repositório
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CONFIGURANDO REPOSITÓRIO GIT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Git está disponível
try {
    $gitTest = git --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Git não disponível"
    }
} catch {
    Write-Host "❌ Git ainda não está disponível no PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor:" -ForegroundColor Yellow
    Write-Host "1. Feche este PowerShell" -ForegroundColor Yellow
    Write-Host "2. Abra um novo PowerShell" -ForegroundColor Yellow
    Write-Host "3. Execute: .\git-configurar.bat" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 0
}

Write-Host "✅ Git está disponível!" -ForegroundColor Green
Write-Host ""

# Verificar se já é um repositório
if (Test-Path ".git") {
    Write-Host "ℹ️  Este diretório já é um repositório Git" -ForegroundColor Cyan
    git remote -v
    Write-Host ""
    
    $reconfig = Read-Host "Deseja reconfigurar o repositório remoto? (S/N)"
    if ($reconfig -eq "S" -or $reconfig -eq "s") {
        git remote remove origin 2>$null
    } else {
        Write-Host "Configuração mantida" -ForegroundColor Yellow
        Read-Host "Pressione Enter para sair"
        exit 0
    }
}

Write-Host "Inicializando repositório Git..." -ForegroundColor Cyan
git init

Write-Host ""
Write-Host "Configurando repositório remoto..." -ForegroundColor Cyan
git remote add origin https://github.com/leosom12/L-PDV.git

Write-Host "✅ Repositório remoto configurado!" -ForegroundColor Green
Write-Host ""

# Configurar usuário
$userName = git config user.name 2>$null
if (-not $userName) {
    Write-Host "⚠️  Configuração de usuário Git não encontrada" -ForegroundColor Yellow
    Write-Host ""
    
    $nome = Read-Host "Digite seu nome"
    $email = Read-Host "Digite seu email"
    
    git config --global user.name "$nome"
    git config --global user.email "$email"
    
    Write-Host "✅ Configuração de usuário salva!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Execute: .\git-commit-inicial.bat" -ForegroundColor White
Write-Host "2. Execute: .\git-push.bat" -ForegroundColor White
Write-Host ""
Write-Host "Repositório: https://github.com/leosom12/L-PDV" -ForegroundColor Cyan
Write-Host ""

Read-Host "Pressione Enter para sair"
