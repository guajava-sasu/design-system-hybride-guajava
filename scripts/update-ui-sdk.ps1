<#
.SYNOPSIS
    Publie la librairie @arcelor-mittal/design-system en local via yalc et pousse la mise a jour vers le front.

.DESCRIPTION
    1. Recupere les derniers changements (git pull --ff-only) sur le depot de la librairie.
    2. Installe les dependances si besoin (npm install).
    3. Lance les tests (npm test).
    4. Publie la librairie dans le store yalc et pousse la mise a jour vers les projets lies (yalc push).
    5. (Optionnel) Ajoute ou met a jour la librairie cote front (yalc add / yalc update) puis npm install.

.PARAMETER SkipGitPull
    Ne pas faire git pull (utile si des modifications locales non commitees existent).

.PARAMETER UpdateFront
    Force yalc add/update + npm install cote front.

.EXAMPLE
    .\scripts\update-ui-sdk.ps1
    .\scripts\update-ui-sdk.ps1 -SkipGitPull
    .\scripts\update-ui-sdk.ps1 -UpdateFront
#>

param(
    [switch]$SkipGitPull,
    [switch]$UpdateFront
)

$PackageName      = "@arcelor-mittal/design-system"
$LibRoot          = Split-Path -Parent $PSScriptRoot
$FrontRoot        = "C:\NoBackup\az-devops\DPA.IPMK.N3GA2.GestionLingotsFront\n3ga2-gestionlingotsfront-app"
$StartingLocation = Get-Location

function Write-Step($message) {
    Write-Host ""
    Write-Host "==> $message" -ForegroundColor Cyan
}

function Assert-Success($stepName) {
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Echec pendant l'etape : $stepName" -ForegroundColor Red
        exit 1
    }
}

if (-not (Get-Command yalc -ErrorAction SilentlyContinue)) {
    Write-Host "yalc est introuvable. Installe-le avec : npm install -g yalc" -ForegroundColor Red
    exit 1
}

try {
    Set-Location $LibRoot

    if (-not $SkipGitPull) {
        Write-Step "git pull --ff-only - $LibRoot"
        git pull --ff-only
        Assert-Success "git pull"
    }
    else {
        Write-Step "git pull ignore (-SkipGitPull)"
    }

    Write-Step "npm install (librairie)"
    npm install
    Assert-Success "npm install (librairie)"

    Write-Step "Tests (npm test)"
    npm test
    Assert-Success "npm test"

    Write-Step "yalc push depuis $LibRoot"
    yalc push
    Assert-Success "yalc push"

    if ($UpdateFront) {
        Write-Step "Mise a jour cote front - $FrontRoot"
        Set-Location $FrontRoot
        $lockFile = Join-Path $FrontRoot "yalc.lock"
        if ((Test-Path $lockFile) -and (Select-String -Path $lockFile -Pattern $PackageName -Quiet)) {
            yalc update $PackageName
        }
        else {
            yalc add $PackageName
        }
        Assert-Success "yalc add/update (front)"
        npm install
        Assert-Success "npm install (front)"
    }

    Write-Host ""
    Write-Host "Mise a jour terminee avec succes !" -ForegroundColor Green
    Write-Host "Tu peux lancer le front avec : cd `"$FrontRoot`" ; npm start" -ForegroundColor Green
}
finally {
    Write-Host "Retour a l'emplacement initial : $StartingLocation"
    Set-Location $StartingLocation
}
