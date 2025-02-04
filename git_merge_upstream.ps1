Write-Host "### Add upstream to original repo - Error thrown if already exists." -ForegroundColor Green
git remote add upstream https://github.com/suneman/socialdata2025
git fetch upstream
git checkout main
git merge upstream/main
