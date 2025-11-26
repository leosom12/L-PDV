# Script para adicionar importações de CSS
$htmlPath = "C:\Users\pc\.gemini\antigravity\scratch\supermarket-pos\public\index.html"
$content = Get-Content $htmlPath -Encoding UTF8

$newContent = @()
$cssAdded = $false

foreach($line in $content) {
    $newContent += $line
    
    # Adicionar após a linha de styles.css
    if($line -match 'href="/styles\.css"' -and -not $cssAdded) {
        $newContent += '    <link rel="stylesheet" href="/table-styles.css">'
        $newContent += '    <link rel="stylesheet" href="/modal-styles.css">'
        $cssAdded = $true
        Write-Host "CSS imports adicionados!"
    }
}

$newContent | Set-Content $htmlPath -Encoding UTF8
Write-Host "Arquivo atualizado com sucesso!"
