Write-Host "Creating conda environment from .yml file" -ForegroundColor Green
conda env create -n 02806 python=3.9 -f environment.yml