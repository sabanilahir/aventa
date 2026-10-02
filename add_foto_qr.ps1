$path = "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\trah\AdminShow.tsx"
$lines = Get-Content $path
$newLines = @()
foreach ($line in $lines) {
    $newLines += $line
    if ($line -match 'Mangasah Mingising Budi') {
        $newLines += '                        <div className="flex justify-center px-8 pb-4 pt-2">'
        $newLines += '                            <div className="text-center mr-8">'
        $newLines += '                                {member?.foto ? ('
        $newLines += '                                    <img src={`/storage/${member.foto}`} alt="Foto" className="h-32 w-32 rounded-lg border-2 border-[#b08942] object-cover shadow-md" />'
        $newLines += '                                ) : fotoPanembahan ? ('
        $newLines += '                                    <img src={fotoPanembahan} alt="Foto" className="h-32 w-32 rounded-lg border-2 border-[#b08942] object-cover shadow-md" />'
        $newLines += '                                ) : ('
        $newLines += '                                    <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-[#b08942] bg-gray-200">'
        $newLines += '                                        <span className="text-4xl text-gray-400">?</span>'
        $newLines += '                                    </div>'
        $newLines += '                                )}'
        $newLines += '                            </div>'
        $newLines += '                            <div className="text-center">'
        $newLines += '                                {qrUrl ? ('
        $newLines += '                                    <img src={qrUrl} alt="QR Code" className="h-32 w-32 rounded-lg border-2 border-[#b08942] object-contain shadow-md" />'
        $newLines += '                                ) : ('
        $newLines += '                                    <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-[#b08942] bg-gray-200">'
        $newLines += '                                        <span className="text-4xl text-gray-400">?</span>'
        $newLines += '                                    </div>'
        $newLines += '                                )}'
        $newLines += '                                <p className="mt-1 text-xs text-gray-500">Scan untuk info</p>'
        $newLines += '                            </div>'
        $newLines += '                        </div>'
    }
}
$newLines | Set-Content $path
Write-Host "Added foto and QR code!"