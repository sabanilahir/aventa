$path = "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\trah\Create.tsx"
$content = Get-Content $path -Raw
$content = $content -replace 'tempat_tanggal_lahir: " ",', 'tempat_tanggal_lahir: "",'
Set-Content $path $content
Write-Host "Fixed!"