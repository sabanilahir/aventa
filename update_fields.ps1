$files = @(
    "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\trah\Create.tsx",
    "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\trah\Edit.tsx",
    "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\trah\Show.tsx",
    "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\Public\Anggota.tsx"
)

foreach ($f in $files) {
    $content = Get-Content $f -Raw
    # Remove tanggal_lahir field and label
    $content = $content -replace 'tanggal_lahir: "",', ''
    $content = $content -replace '\["tanggal_lahir", "Tanggal Lahir"\],', ''
    # Rename tempat_lahir to tempat_tanggal_lahir
    $content = $content -replace 'tempat_lahir:', 'tempat_tanggal_lahir:'
    $content = $content -replace '\["tempat_lahir", "Tempat Lahir"\]', '["tempat_tanggal_lahir", "Tempat, Tanggal Lahir"]'
    Set-Content $f -Value $content
    Write-Host "Updated: $f"
}
Write-Host "Done!"