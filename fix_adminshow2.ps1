$path = "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\trah\AdminShow.tsx"
$content = Get-Content $path -Raw
$content = $content -replace "member\?\.tempat_lahir \|\| member\?\.tanggal_lahir\s*\?\s*\`\`member\?\.tempat_lahir \|\| \$\{2}", "member?.tempat_tanggal_lahir"
$content = $content -replace "\$\{member\?\.tempat_lahir \|\| ''\}\$\{member\?\.tempat_lahir && member\?\.tanggal_lahir \? ', ' : ''\}\$\{member\?\.tanggal_lahir \|\| ''\}\`\`\s*:\s*null,", "member?.tempat_tanggal_lahir,"
$content = $content -replace "\s*\?\s*\`\`member\?\.tempat_lahir \|\| ''\`\`member\?\.tempat_lahir && member\?\.tanggal_lahir \? ', ' : ''\`\`member\?\.tanggal_lahir \|\| ''\`\`\s*:\s*null,", ","
Set-Content $path $content
Write-Host "Done"