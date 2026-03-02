$ErrorActionPreference = "Stop"

git branch -M main

$files = git ls-files --others --exclude-standard

$messages = @(
    "feat: integrate",
    "chore: add",
    "docs: finalize",
    "refactor: establish",
    "build: configure",
    "ci: setup"
)

foreach ($file in $files) {
    if ($file -match "preprocessor\.joblib" -or $file -match "xgboost_model\.joblib") {
        $prefix = "model: serialize"
    } elseif ($file -match "README|gitignore") {
        $prefix = "docs: append"
    } elseif ($file -match "package" -or $file -match "requirements") {
        $prefix = "build: configure"
    } else {
        $prefix = $messages | Get-Random
    }
    
    $commitMsg = "$prefix $file"
    Write-Host "Adding $file - Message: $commitMsg"
    
    git add $file
    git commit -S -m $commitMsg
    git push -u origin main
}

Write-Host "All files pushed successfully."
