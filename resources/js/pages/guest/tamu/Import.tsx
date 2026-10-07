import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Head, router, usePage } from "@inertiajs/react";
import { ArrowLeft, CheckCircle2, Upload, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ImportTamu() {
    const { props } = usePage();
    const acaras = (props.acaras as any[]) || [];
    const acaraId = (props.acaraId as string) || "";

    const [selectedAcara, setSelectedAcara] = useState(acaraId);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successModal, setSuccessModal] = useState<{ show: boolean; count: number }>({ show: false, count: 0 });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) setFile(f);
        setErrorMessage(null); // Reset error saat ganti file
    };

    const downloadTemplate = () => {
        const csv = "nama_tamu,nama_perusahaan,no_wa\nJohn Doe,PT ABC,081234567890\nJane Smith,PT XYZ,081234567891";
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "template_import_tamu.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAcara || !file) {
            setErrorMessage('Pilih acara dan file CSV terlebih dahulu!');
            return;
        }

        setUploading(true);
        setErrorMessage(null);

        router.post(
            '/guest/tamu/import',
            {
                acara_id: selectedAcara,
                file: file,
            },
            {
                onSuccess: (page: any) => {
                    setUploading(false);
                    const importedCount = page.props?.flash?.imported_count || 0;
                    setSuccessModal({ show: true, count: importedCount });
                },
                onError: (errors: any) => {
                    setUploading(false);

                    // Ambil pesan error spesifik dari Laravel (baik dari errors.file atau errors.message)
                    const errorText = errors.file || errors.message || 'Terjadi kesalahan saat mengimport file.';
                    setErrorMessage(errorText);

                    if (errors.status === 419) {
                        alert('Sesi Anda telah kedaluwarsa. Halaman akan dimuat ulang.');
                        window.location.reload();
                    }
                },
            },
        );
    };

    const handleFinish = () => {
        router.get(`/guest/tamu?acara_id=${selectedAcara}`);
    };

    return (
        <AppLayout>
            <Head title="Import Tamu dari CSV" />
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="mx-auto max-w-2xl space-y-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.get(`/guest/tamu?acara_id=${selectedAcara}`)} className="rounded-lg bg-white px-4 py-2 shadow hover:bg-gray-50">
                            <ArrowLeft className="mr-2 inline h-4 w-4" /> Kembali
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">Import Tamu dari CSV</h1>
                            <p className="text-sm text-gray-500">Upload file CSV untuk import data tamu</p>
                        </div>
                    </div>

                    {/* Kotak Debug Error */}
                    {errorMessage && (
                        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
                            <div className="text-sm font-medium">
                                <p className="font-bold">Gagal Mengimport:</p>
                                <p>{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    <Card>
                        <CardContent className="space-y-4 p-6">
                            <button onClick={downloadTemplate} className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                                Download Template CSV
                            </button>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label>Pilih Acara *</Label>
                                    <select
                                        className="mt-1 w-full rounded border bg-white px-3 py-2"
                                        value={selectedAcara}
                                        onChange={(e) => setSelectedAcara(e.target.value)}
                                    >
                                        <option value="">-- Pilih Acara --</option>
                                        {acaras.map((a: any) => (
                                            <option key={a.id} value={a.id}>{a.nama}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label>File CSV *</Label>
                                    <div className="mt-1 rounded-lg border-2 border-dashed p-6 text-center">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileChange}
                                        />
                                        {file && <p className="mt-2 text-sm font-medium text-gray-600">{file.name}</p>}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-amber-50 p-4 text-sm">
                                    <p className="mb-2 font-semibold text-amber-800">Format Kolom CSV:</p>
                                    <code className="mb-2 block rounded bg-amber-100 px-2 py-1 text-xs">
                                        nama_tamu, nama_perusahaan, no_wa
                                    </code>
                                    <p className="mt-2 text-xs text-amber-700">
                                        Pastikan file CSV memiliki header di baris pertama.
                                    </p>
                                </div>

                                <Button type="submit" disabled={uploading} className="w-full">
                                    <Upload className="mr-2 h-4 w-4" />
                                    {uploading ? "Mengupload..." : "Import Tamu"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {successModal.show && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <Card className="w-full max-w-sm text-center">
                                <CardContent className="space-y-4 p-6">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-lg font-bold">Import Berhasil!</h3>
                                    <p className="text-sm text-gray-500">
                                        {successModal.count} tamu berhasil diimpor.
                                    </p>
                                    <button onClick={handleFinish} className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700">
                                        Lihat Daftar Tamu
                                    </button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
