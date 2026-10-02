$p = "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\trah\AdminShow.tsx"
@'
                        <div className="px-8 py-2">
                            <p className="text-center text-[11px] italic tracking-wide text-[#5c4a1e]">Mangasah Mingising Budi - Memasuh Malaning Bhumi - Memayu Hayuning Bawana</p>
                        </div>
                        <div className="flex justify-center px-8 pb-4 pt-2">
                            {member?.foto ? (
                                <img src={`/storage/${member.foto}`} alt="Foto" className="h-32 w-32 rounded-lg border-2 border-[#b08942] object-cover shadow-md" />
                            ) : fotoPanembahan ? (
                                <img src={fotoPanembahan} alt="Foto" className="h-32 w-32 rounded-lg border-2 border-[#b08942] object-cover shadow-md" />
                            ) : (
                                <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-[#b08942] bg-gray-200">
                                    <span className="text-4xl text-gray-400">?</span>
                                </div>
                            )}
                        </div>
                        <div className="border-t-2 border-[#b08942] bg-gradient-to-b from-white to-amber-50 px-8 py-4">
                            <div className="space-y-2">
                                {allFields.map((field, index) => (
                                    <div key={index} className={`flex items-start ${field.isHighlight ? "font-bold text-green-800" : ""}`}>
                                        <div className="w-48 flex-shrink-0 text-right pr-4">
                                            <span className={`text-sm font-bold tracking-wide ${field.isHighlight ? "text-green-800" : "text-black"}`}>{field.label}: </span>
                                        </div>
                                        <div className="flex-1 text-sm text-gray-800">
                                            {field.value || <span className="text-gray-400 italic">-</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end px-8 py-6">
                            <div className="text-center">
                                <p className="text-xs italic text-gray-600">Karangpandhan,</p>
                                <div className="relative my-1 flex h-24 items-center justify-center">
                                    {stempelUrl && (
                                        <img src={stempelUrl} alt="Stempel" className="pointer-events-none absolute top-[-15px] left-[-15px] z-10 h-28 w-28 object-contain opacity-90 mix-blend-multiply" />
                                    )}
                                    {ttdUrl && (
                                        <img src={ttdUrl} alt="TTD" className="pointer-events-none absolute z-25 h-20 w-32 object-contain mix-blend-multiply brightness-105 contrast-125 filter" />
                                    )}
                                </div>
                                <div className="mt-1">
                                    <span className="inline-block border-b border-black px-1 text-sm font-medium whitespace-nowrap text-gray-900">{namaTtd}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="border-t-[3px] border-[#b08942] bg-[#1b3e2b] py-1.5">
                                <p className="text-center text-[13px] font-bold text-[#e8ca74]">Mempererat Persaudaraan Membangun Peradaban</p>
                            </div>
                            <div className="bg-white py-1">
                                <p className="text-center text-xs font-bold tracking-wide text-black">Patrapsenopati@gmail.com Phone : 0813.2695.2659</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="mt-6 flex justify-center gap-2">
                    <Link href="/trah-members">
                        <Button variant="outline" className="border-green-800 text-green-800 hover:bg-green-50">
                            <ArrowLeft className="mr-2 h-4 w-4" />Kembali
                        </Button>
                    </Link>
                    <Link href={`/trah-members/${member?.id}/edit`}>
                        <Button variant="outline" className="border-green-800 text-green-800 hover:bg-green-50">
                            <FileText className="mr-2 h-4 w-4" />Edit
                        </Button>
                    </Link>
                    <a href={`/admin-show-pdf/${member?.id}`} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-green-800 text-white hover:bg-green-900">
                            <Download className="mr-2 h-4 w-4" />Generate PDF
                        </Button>
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
'@ | Out-File -FilePath $p -Append -Encoding UTF8
Write-Host "AdminShow.tsx complete!"