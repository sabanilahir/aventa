$path = "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\Public\Anggota.tsx"
$content = Get-Content $path -Raw
$old = @"
                                { label: 'TEMPAT, TANGGAL LAHIR',
                                    val: m ? `${m.tempat_lahir || ''} ${m.tempat_lahir && m.tanggal_lahir ? ', ' : ''} ${m.tanggal_lahir || ''}` : '',
                                },
"@
$new = "{ label: 'TEMPAT, TANGGAL LAHIR', val: m?.tempat_tanggal_lahir || '-' },"
$content = $content -replace [regex]::Escape($old), $new
Set-Content $path $content
Write-Host "Anggota.tsx fixed!"