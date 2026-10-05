import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, Eye, Loader2, Paperclip, AlertCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SweetAlert = withReactContent(Swal);

export default function BroadcastIndex() {
  const { props } = usePage();
  const acara = (props.acara as any) || null;
  const grups = (props.grups as any[]) || [];
  const waSettings = (props.waSettings as any) || null;
  const allTamu = (props.tamu as any[]) || [];

  const [selectedGrup, setSelectedGrup] = useState("all");

  // Menggunakan template dari database jika ada, jika tidak gunakan default fallback
  const defaultTemplate = acara?.wa_template ||
`Halo *{NAMA_TAMU}*,

Anda diundang dalam acara *{NAMA_ACARA}*.

*Tanggal:* {TANGGAL}
*Waktu:* {WAKTU}
*Tempat:* {TEMPAT}
*Alamat:* {ALAMAT}

Daftarkan Tamu Tambahan (maks 3 orang):
{LINK_REGISTRASI}

Semua tamu akan mendapat barcode untuk check-in.`;

  const [message, setMessage] = useState(defaultTemplate);
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);

  // Jika acara berubah, perbarui template pesannya
  useEffect(() => {
    if (acara?.wa_template) {
      setMessage(acara.wa_template);
    }
  }, [acara]);

  // Hanya mengambil Tamu Utama (!t.parent_id / parent_id === null)
  const tamuUtamaList = allTamu.filter((t: any) => !t.parent_id);

  // Filter berdasarkan grup yang dipilih
  const filteredTamu = tamuUtamaList.filter(
    (t: any) => selectedGrup === "all" || t.grup_id == selectedGrup
  );

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const replaceTemplate = (text: string) => {
    const sampleToken = filteredTamu[0]?.token || "sample-token";
    const link = `${baseUrl}/register/${sampleToken}`;

    return text
      .replace(/{NAMA_PERUSAHAAN}/g, acara?.nama_perusahaan || "Nama Perusahaan")
      .replace(/{NAMA_TAMU}/g, filteredTamu[0]?.nama || "Nama Tamu Utama")
      .replace(/{NAMA_ACARA}/g, acara?.nama || "Nama Acara")
      .replace(/{TANGGAL}/g, acara?.tanggal || "Tanggal")
      .replace(/{WAKTU}/g, acara?.waktu_mulai || "Waktu")
      .replace(/{TEMPAT}/g, acara?.tempat || "Tempat")
      .replace(/{ALAMAT}/g, acara?.alamat || "Alamat")
      .replace(/{LINK_REGISTRASI}/g, link);
  };

  const handleSend = () => {
    if (!confirm("Kirim broadcast ke " + filteredTamu.length + " tamu utama?")) return;
    setSending(true);

    router.post(
      "/broadcast/send",
      {
        acara_id: acara?.id,
        grup_id: selectedGrup,
        message: message,
      },
      {
        onSuccess: (page) => {
          setSending(false);
          const flash = page.props.flash as any;
          const result = flash?.broadcast_result;

          SweetAlert.fire({
            title: "Broadcast Berhasil!",
            text: result
              ? `Pesan berhasil dikirim ke ${result.sent} tamu utama`
              : `Pesan berhasil dikirim ke ${filteredTamu.length} tamu utama`,
            icon: "success",
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: true,
            confirmButtonText: "Kembali ke Events",
          }).then(() => {
            router.visit("/events");
          });
        },
        onError: () => {
          setSending(false);
          SweetAlert.fire({
            title: "Gagal!",
            text: "Gagal mengirim broadcast. Silakan periksa konfigurasi WA.",
            icon: "error",
          });
        },
      }
    );
  };

  return (
    <AppLayout>
      <Head title="Broadcast WA" />

      {/* DI SINI PERUBAHANNYA: max-w-5xl mx-auto dihapus, diganti menjadi w-full */}
      <div className="p-6 space-y-6 w-full">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.visit("/events")} className="px-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kirim Broadcast</h1>
              <p className="text-sm text-gray-500">Event: <span className="font-semibold">{acara?.nama || "Pilih Event"}</span></p>
            </div>
          </div>
        </div>

        {/* Card sekarang membentang penuh mengikuti layar */}
        <Card className="w-full border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-6">

            {/* Info Target Broadcast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Pilih Grup Target</label>
                <select
                  value={selectedGrup}
                  onChange={(e) => setSelectedGrup(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                >
                  <option value="all">Semua Tamu Utama ({tamuUtamaList.length} Kontak)</option>
                  {grups.map((g: any) => (
                    <option key={g.id} value={g.id}>
                      {g.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex bg-blue-50/50 border border-blue-100 rounded-lg p-4 gap-4 items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Target Penerima</h4>
                  <p className="text-sm text-blue-800">
                    Akan dikirim ke <strong>{filteredTamu.length} nomor WhatsApp</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-6">
              {/* Lampiran Video / Media */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Lampiran Media</label>
                {acara?.video_url ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg md:w-1/2">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-md">
                        <Paperclip className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-800 text-sm">Video Undangan Terlampir</p>
                        <p className="text-xs text-emerald-600">Disimpan dari pengaturan Event</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm flex items-center gap-2 md:w-1/2">
                    <Paperclip className="w-4 h-4" />
                    Tidak ada video undangan yang dilampirkan.
                  </div>
                )}
              </div>

              {/* Template Pesan */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Isi Pesan / Caption</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg h-64 font-mono text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-gray-50/30"
                  placeholder="Ketik pesan broadcast..."
                />
                <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                  <span className="font-semibold">Tag tersedia:</span> <br/>
                  <code className="text-pink-600">{"{NAMA_TAMU}"}</code>,
                  <code className="text-pink-600 ml-2">{"{NAMA_ACARA}"}</code>,
                  <code className="text-pink-600 ml-2">{"{NAMA_PERUSAHAAN}"}</code>,
                  <code className="text-pink-600 ml-2">{"{TANGGAL}"}</code>,
                  <code className="text-pink-600 ml-2">{"{WAKTU}"}</code>,
                  <code className="text-pink-600 ml-2">{"{TEMPAT}"}</code>,
                  <code className="text-pink-600 ml-2">{"{ALAMAT}"}</code>,
                  <code className="text-pink-600 ml-2">{"{LINK_REGISTRASI}"}</code>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={() => setPreview(true)} variant="outline" className="flex-1 h-12 text-gray-700 font-semibold border-gray-300">
                <Eye className="w-5 h-5 mr-2" /> Preview Pesan
              </Button>
              <Button
                onClick={handleSend}
                disabled={sending || filteredTamu.length === 0 || !waSettings}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12 text-white font-semibold shadow-sm"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" /> Kirim ke {filteredTamu.length} Tamu
                  </>
                )}
              </Button>
            </div>

            {!waSettings && (
              <p className="text-sm text-red-500 text-center font-medium mt-2">
                ⚠️ Anda tidak dapat mengirim broadcast karena konfigurasi WhatsApp Gateway belum diatur.
              </p>
            )}

          </CardContent>
        </Card>
      </div>

      {/* Modal Preview */}
      {preview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg shadow-2xl border-0">
            <CardContent className="p-0">
              <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-500" /> Preview Pesan
                </h2>
                <button
                  onClick={() => setPreview(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {acara?.video_url && (
                  <div className="mb-4 bg-emerald-50 text-emerald-700 text-xs font-semibold p-2 rounded flex items-center gap-2 border border-emerald-100">
                    <Paperclip className="w-4 h-4" />
                    Pesan ini akan dikirim bersama dengan Video Undangan
                  </div>
                )}
                <div className="bg-[#e5ddd5] p-4 rounded-lg relative shadow-inner overflow-y-auto max-h-[60vh]">
                  {/* Bubble Chat Style */}
                  <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm font-sans whitespace-pre-wrap text-gray-800 break-words leading-relaxed">
                    {replaceTemplate(message)}
                  </div>
                </div>

                <Button onClick={() => setPreview(false)} className="mt-6 w-full h-11 font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border-0">
                  Tutup Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
