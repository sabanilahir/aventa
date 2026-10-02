$path = "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\trah\Show.tsx"
$content = Get-Content $path -Raw
$old = @'
{ label: "TEMPAT, TANGGAL LAHIR", value: member?.tempat_lahir || member?.tanggal_lahir ? `${member?.tempat_lahir || ""}${member?.tempat_lahir && member?.tanggal_lahir ? ", " : ""}${member?.tanggal_lahir || ""}` : null },
'@
$new = '{ label: "TEMPAT, TANGGAL LAHIR", value: member?.tempat_tanggal_lahir },'
$content = $content -replace [regex]::Escape($old), $new
Set-Content $path $content
Write-Host "Show.tsx fixed!"