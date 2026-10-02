$path = "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\trah\AdminShow.tsx"
$lines = Get-Content $path
$newLines = @()
$skipNext = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($skipNext -gt 0) {
        $skipNext--
        continue
    }
    $line = $lines[$i]
    # Detect duplicate foto section starting at line 93
    if ($line -match '^\s*\{member\?\.foto \? \($' -and $i -ge 90) {
        $skipNext = 5  # Skip this duplicate section (6 lines)
        continue
    }
    $newLines += $line
}
$newLines | Set-Content $path
Write-Host "Removed duplicate foto section"