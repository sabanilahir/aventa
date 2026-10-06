import { Head, useForm, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Paperclip, Save } from "lucide-react";
import { toast } from "sonner";

export default function EventEdit() {
  const { props } = usePage();
  const acara = (props.acara as any) || {};

  const { data, setData, post, processing } = useForm({
    _method: 'put',
    nama: acara.nama || "",
    tanggal: acara.tanggal ? acara.tanggal.split('T')[0].split(' ')[0] : "",
    waktu_mulai: acara.waktu_mulai || "",
    waktu_selesai: acara.waktu_selesai || "",
    tempat: acara.tempat || "",
    alamat: acara.alamat || "",
    qr_per_keluarga: acara.qr_per_keluarga || 4,
    wa_template: acara.wa_template || "",
    status: acara.status || "draft", // Menggunakan enum: draft, active, completed, archived
    video: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.nama.trim()) {
      alert("Nama event wajib diisi");
      return;
    }

    post(`/events/${acara.id}`, {
      onSuccess: () => toast.success("Event berhasil diperbarui!"),
      onError: () => toast.error("Gagal memperbarui event. Periksa kembali form Anda."),
    });
  };

  return (
    <AppLayout>
      <Head title={`Edit Event - ${acara.nama || 'Loading'}`} />

      <div className="p-6 space-y-6 w-full">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.get("/events")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Event</h1>
              <p className="text-sm text-gray-500">Perbarui detail acara Anda di bawah ini</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="w-full">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* --- INFORMASI DASAR --- */}
                <div className="md:col-span-2 lg:col-span-3">
                  <Label className="text-base font-semibold">Nama Event <span className="text-red-500">*</span></Label>
                  <Input
                    className="mt-2 h-12 text-lg"
                    value={data.nama}
                    onChange={(e) => setData('nama', e.target.value)}
                    placeholder="Contoh: Resepsi Pernikahan Budi & Dina"
                    required
                  />
                </div>

                <div className="lg:col-span-1">
                  <Label className="text-base font-semibold">Tanggal</Label>
                  <Input
                    type="date"
                    className="mt-2 h-12"
                    value={data.tanggal}
                    onChange={(e) => setData('tanggal', e.target.value)}
                  />
                </div>

                <div className="lg:col-span-1">
                  <Label className="text-base font-semibold">Waktu Mulai</Label>
                  <Input
                    type="time"
                    className="mt-2 h-12"
                    value={data.waktu_mulai}
                    onChange={(e) => setData('waktu_mulai', e.target.value)}
                  />
                </div>
                <div>
                <Label>Waktu Selesai</Label>
                <Input
                    type="time"
                    value={data.waktu_selesai || ""}
                    onChange={(e) => setData("waktu_selesai", e.target.value)}
                />
                </div>

                <div className="lg:col-span-1">
                  <Label className="text-base font-semibold">QR per Keluarga</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    className="mt-2 h-12"
                    value={data.qr_per_keluarga}
                    onChange={(e) => setData('qr_per_keluarga', parseInt(e.target.value) || 4)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Maks scan QR (default: 4)</p>
                </div>

                <div className="md:col-span-2 lg:col-span-1">
                  <Label className="text-base font-semibold">Tempat</Label>
                  <Input
                    className="mt-2 h-12"
                    value={data.tempat}
                    onChange={(e) => setData('tempat', e.target.value)}
                    placeholder="Nama gedung atau lokasi"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-2">
                  <Label className="text-base font-semibold">Alamat</Label>
                  <Input
                    className="mt-2 h-12"
                    value={data.alamat}
                    onChange={(e) => setData('alamat', e.target.value)}
                    placeholder="Alamat lengkap lokasi acara"
                  />
                </div>

                {/* --- STATUS EVENT (ENUM) --- */}
                <div className="lg:col-span-1">
                  <Label className="text-base font-semibold">Status Event</Label>
                  <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="mt-2 h-12 w-full border border-gray-300 rounded-md px-3 text-base bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active (Aktif)</option>
                    <option value="completed">Completed (Selesai)</option>
                    <option value="archived">Archived (Diarsipkan)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Pilih status siklus acara</p>
                </div>

              </div>

              {/* --- PENGATURAN BROADCAST WA --- */}
              <div className="pt-8 border-t mt-8 space-y-6">
                <h3 className="font-semibold text-xl">Pengaturan Broadcast WA</h3>

                <div className="space-y-3">
                  <Label htmlFor="video" className="flex items-center gap-2 text-base font-semibold">
                    <Paperclip className="w-5 h-5" /> Upload Video Undangan (.mp4)
                  </Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/mp4,video/quicktime"
                    onChange={(e) => setData('video', e.target.files ? e.target.files[0] : null)}
                    className="cursor-pointer h-12 pt-2.5 w-full md:w-1/2"
                  />
                  {acara.video_url ? (
                    <p className="text-sm text-emerald-600 font-medium">
                      ✓ Event ini sudah memiliki video undangan terlampir. Upload file baru jika ingin menggantinya.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Opsional. Video ini akan dilampirkan saat Anda mengirim broadcast undangan via WhatsApp.</p>
                  )}
                </div>

                <div className="space-y-3 pt-4">
                  <Label htmlFor="wa_template" className="text-base font-semibold">Template Pesan WhatsApp</Label>
                  <textarea
                    id="wa_template"
                    value={data.wa_template}
                    onChange={(e) => setData('wa_template', e.target.value)}
                    className="w-full min-h-[220px] p-4 border rounded-md font-mono text-sm dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                    placeholder="Ketik template broadcast di sini..."
                  />
                  <p className="text-sm text-gray-500">
                    Gunakan tag berikut untuk memanggil data otomatis: <br/>
                    <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 p-1 rounded">{"{NAMA_TAMU}"}</span>,
                    <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 p-1 rounded ml-1">{"{NAMA_ACARA}"}</span>,
                    <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 p-1 rounded ml-1">{"{TANGGAL}"}</span>,
                    <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 p-1 rounded ml-1">{"{WAKTU}"}</span>,
                    <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 p-1 rounded ml-1">{"{TEMPAT}"}</span>,
                    <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 p-1 rounded ml-1">{"{ALAMAT}"}</span>,
                    <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 p-1 rounded ml-1">{"{LINK_REGISTRASI}"}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-8 justify-end border-t mt-8">
                <Button type="button" variant="outline" size="lg" onClick={() => router.get("/events")}>
                  Batal
                </Button>
                <Button type="submit" size="lg" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]">
                  <Save className="w-4 h-4 mr-2" />
                  {processing ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
