import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
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
  const [message, setMessage] = useState(
`Halo *{NAMA_TAMU}*,

Anda diundang dalam acara *{NAMA_ACARA}*.

*Tanggal:* {TANGGAL}
*Waktu:* {WAKTU}
*Tempat:* {TEMPAT}
*Alamat:* {ALAMAT}

Daftarkan keluarga/teman (max 4 orang):
{LINK_REGISTRASI}

Semua tamu akan mendapat barcode untuk check-in.`
  );
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);

  // PERBAIKAN: Hanya mengambil Tamu Utama (!t.parent_id / parent_id === null)
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
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.visit("/events")}>
            <ArrowLeft className="w-4 h-4 mr-2" />Kembali
          </Button>
          <h1 className="text-2xl font-bold">Broadcast WhatsApp (Tamu Utama)</h1>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Grup Tamu</label>
                <select
                  value={selectedGrup}
                  onChange={(e) => setSelectedGrup(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">Semua Tamu Utama ({tamuUtamaList.length})</option>
                  {grups.map((g: any) => (
                    <option key={g.id} value={g.id}>
                      {g.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="p-4 bg-blue-50 rounded flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-800">{filteredTamu.length}</p>
                  <p className="text-sm text-blue-600">Tamu Utama Terpilih</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Template Pesan</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded h-48 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tag tersedia: NAMA_TAMU, NAMA_ACARA, TANGGAL, WAKTU, TEMPAT, ALAMAT, LINK_REGISTRASI
              </p>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setPreview(true)} variant="outline" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />Preview
              </Button>
              <Button
                onClick={handleSend}
                disabled={sending || filteredTamu.length === 0 || !waSettings}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />Kirim ke {filteredTamu.length} Tamu Utama
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {preview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Preview Pesan</h2>
                <button
                  onClick={() => setPreview(false)}
                  className="text-gray-500 hover:text-gray-700 font-bold"
                >
                  ✕
                </button>
              </div>
              <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm font-sans">
                {replaceTemplate(message)}
              </pre>
              <Button onClick={() => setPreview(false)} className="mt-4 w-full">
                Tutup
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
