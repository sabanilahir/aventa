$p = "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\trah\AdminShow.tsx"
$c = Get-Content $p -Raw
$c = $c -replace "\{ label: 'TEMPAT, TANGGAL LAHIR',[\s\S]*?value: member\?\.tempat_tanggal_lahir,?\}", "{ label: 'TEMPAT, TANGGAL LAHIR', value: member?.tempat_tanggal_lahir },"
$c = $c -replace "\{ label: 'TEMPAT, TANGGAL LAHIR',[\s\S]*?\? null,", "{ label: 'TEMPAT, TANGGAL LAHIR', value: member?.tempat_tanggal_lahir },"
Set-Content $p $c
Write-Host "Fixed AdminShow"