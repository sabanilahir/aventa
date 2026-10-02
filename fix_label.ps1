$path = "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\trah\AdminShow.tsx"
$content = Get-Content $path -Raw
$content = $content -replace "TEMPAT,TGL LAHIR", "TEMPAT, TANGGAL LAHIR"
Set-Content $path $content
Write-Host "Fixed!"