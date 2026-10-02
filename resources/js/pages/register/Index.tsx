import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MapPin, Clock, CheckCircle, AlertCircle, Heart, Download, Eye, UserCheck } from "lucide-react";
import QRCode from "react-qr-code";

export default function RegisterIndex() {
  const { props } = usePage();
  const { event, tamu, token, error, sisaSlot, tamuTambahanExisting = [] } = props as any;

  // Max 4 orang total (1 utama + sisa slot tambahan)
  const maxTotal = Math.min(4, 1 + (sisaSlot ?? 0));
  const [jumlahTamu, setJumlahTamu] = useState(1);
  const [list, setList] = useState<{ nama_depan: string; nama_belakang: string; no_telepon: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [registeredList, setRegisteredList] = useState<any[]>([]);

  // State Modal View QR Code
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrData, setQrData] = useState<{ nama: string; qrValue: string } | null>(null);

  // Helper untuk menentukan nilai QR Code
  const getQrValue = (item: any) => {
    return item?.token || `${event?.id || 0}.${item?.nama || "-"}.${item?.nama_perusahaan || "-"}`;
  };

  const updateJumlahTamu = (jumlah: number) => {
    setJumlahTamu(jumlah);
    const additionalCount = jumlah - 1;
    const newList = [];
    for (let i = 0; i < additionalCount; i++) {
      if (i < list.length) {
        newList.push(list[i]);
      } else {
        newList.push({ nama_depan: "", nama_belakang: "", no_telepon: "" });
      }
    }
    setList(newList);
  };

  const delRow = (i: number) => {
    const newList = list.filter((_, idx) => idx !== i);
    setList(newList);
    setJumlahTamu(newList.length + 1);
  };

  const upd = (i: number, f: string, v: string) => {
    const n = [...list];
    (n[i] as any)[f] = v;
    setList(n);
  };

  // Helper Download QR Code ke Format PNG
  const downloadQR = (elementId: string, namaTamu: string) => {
    const svg = document.getElementById(elementId) as SVGElement | null;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
      }
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_${namaTamu.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const submit = async () => {
    setErrMsg(null);
    if (list.length > 0 && list.some((l) => !l.nama_depan.trim())) {
      setErrMsg("Nama Depan wajib diisi untuk semua tamu tambahan");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/guest/register/simpan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ token, tamu_tambahan: list }),
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (res.ok && data.success) {
          setSuccess(true);
          setRegisteredList([tamu, ...tamuTambahanExisting, ...(data.data || data.tamu_tambahan || [])]);
        } else {
          setErrMsg(data.message || "Gagal menyimpan data");
        }
      } else {
        setErrMsg("Terjadi kesalahan server. Mohon coba beberapa saat lagi.");
      }
    } catch (err: any) {
      setErrMsg("Error: " + (err?.message || "Gagal terhubung ke server"));
    } finally {
      setSubmitting(false);
    }
  };

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-0 shadow-lg">
          <CardContent className="pt-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-red-600 mb-2">Oops!</h1>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );

  // TAMPILAN JIKA SUCCESS (SUBMIT Selesai)
  if (success)
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="border-0 shadow-xl text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Pendaftaran Berhasil!</h1>
              <p className="text-sm text-gray-500 mb-6">Berikut adalah daftar QR Code check-in Anda</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {registeredList.map((t, i) => (
                  <div key={t.id || i} className="p-4 bg-gray-50 rounded-xl border flex flex-col items-center justify-between space-y-3">
                    <div className="text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block mb-1">
                        {i === 0 ? "Tamu Utama" : `Tamu Tambahan ${i}`}
                      </span>
                      <p className="font-bold text-gray-800">{t.nama}</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border shadow-inner">
                      <QRCode id={`qr-success-${i}`} value={getQrValue(t)} size={120} level="H" />
                    </div>

                    <div className="w-full space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setQrData({ nama: t.nama, qrValue: getQrValue(t) });
                          setShowQrModal(true);
                        }}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" /> View QR
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => downloadQR(`qr-success-${i}`, t.nama)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MODAL VIEW QR */}
        {showQrModal && qrData && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="max-w-sm w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-bold text-gray-800">QR Code Check-in</h3>
                  <button onClick={() => setShowQrModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-700">{qrData.nama}</p>
                </div>
                <div className="p-4 bg-white inline-block rounded-xl border shadow-inner">
                  <QRCode id="qr-modal-active" value={qrData.qrValue} size={200} level="H" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => downloadQR("qr-modal-active", qrData.nama)} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    <Download className="w-4 h-4 mr-2" /> Download Gambar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl font-bold mb-2">{event?.nama || "Undangan"}</h1>
          <p className="text-lg opacity-90">Registrasi Tamu Undangan</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6 pb-12 space-y-6">
        {/* KARTU INFORMASI TAMU UTAMA (DENGAN VIEW & DOWNLOAD QR PARENT) */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-100 rounded-full">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">Tamu Utama</h2>
                  <p className="text-gray-600 font-medium">{tamu?.nama}</p>
                </div>
              </div>

              {tamu && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setQrData({ nama: tamu.nama, qrValue: getQrValue(tamu) });
                      setShowQrModal(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => downloadQR("qr-parent-hidden", tamu.nama)}
                  >
                    <Download className="w-4 h-4 mr-1" /> QR
                  </Button>
                  <div className="hidden">
                    <QRCode id="qr-parent-hidden" value={getQrValue(tamu)} size={180} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 text-sm border-t pt-4">
              {event?.tanggal && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <span>{event.tanggal}</span>
                </div>
              )}
              {event?.waktu_mulai && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-pink-500" />
                  <span>{event.waktu_mulai}</span>
                </div>
              )}
              {event?.tempat && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  <span>{event.tempat}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* LIST TAMU TERDAFTAR SEBELUMNYA */}
        {tamuTambahanExisting.length > 0 && (
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-600" /> Tamu Tambahan Terdaftar ({tamuTambahanExisting.length})
                </h3>
              </div>
              <div className="space-y-3">
                {tamuTambahanExisting.map((t: any, idx: number) => (
                  <div key={t.id || idx} className="p-3 bg-gray-50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 border">
                    <div>
                      <p className="font-medium text-sm text-gray-800">{t.nama}</p>
                      {t.no_telepon && <p className="text-xs text-gray-500">{t.no_telepon}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setQrData({ nama: t.nama, qrValue: getQrValue(t) });
                          setShowQrModal(true);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View QR
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => downloadQR(`qr-exist-hidden-${idx}`, t.nama)}
                      >
                        <Download className="w-3.5 h-3.5 mr-1" /> Download
                      </Button>
                      <div className="hidden">
                        <QRCode id={`qr-exist-hidden-${idx}`} value={getQrValue(t)} size={180} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* FORM REGISTRASI JUMLAH TAMU */}
        {maxTotal > 1 && (
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Konfirmasi Kehadiran</h3>
                <Badge className="bg-pink-100 text-pink-700">Maksimal: {maxTotal} orang</Badge>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Berapa orang yang akan hadir?</label>
                <select
                  value={jumlahTamu}
                  onChange={(e) => updateJumlahTamu(parseInt(e.target.value))}
                  className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-lg font-medium"
                >
                  <option value={1}>1 orang (Hanya saya)</option>
                  {maxTotal >= 2 && <option value={2}>2 orang</option>}
                  {maxTotal >= 3 && <option value={3}>3 orang</option>}
                  {maxTotal >= 4 && <option value={4}>4 orang</option>}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Tamu utama + {jumlahTamu - 1} tamu tambahan
                </p>
              </div>

              {errMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {errMsg}
                </div>
              )}

              {/* INPUT TAMU TAMBAHAN */}
              <div className="space-y-4">
                {list.map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
                    <div className="absolute -top-3 left-4 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                      Tamu {i + 2}
                    </div>
                    <button
                      type="button"
                      onClick={() => delRow(i)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 font-bold"
                    >
                      ✕
                    </button>
                    <div className="grid gap-4 mt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Nama Depan *</label>
                          <Input
                            value={item.nama_depan}
                            onChange={(e) => upd(i, "nama_depan", e.target.value)}
                            placeholder="Nama Depan"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Nama Belakang</label>
                          <Input
                            value={item.nama_belakang}
                            onChange={(e) => upd(i, "nama_belakang", e.target.value)}
                            placeholder="Nama Belakang"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Nomor WA (Opsional)</label>
                        <Input
                          value={item.no_telepon}
                          onChange={(e) => upd(i, "no_telepon", e.target.value)}
                          placeholder="08xxxxxxxxxx"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white"
              >
                {submitting ? "Menyimpan..." : "Simpan & Dapatkan QR Code"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* MODAL VIEW QR */}
      {showQrModal && qrData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold text-gray-800">QR Code Check-in</h3>
                <button onClick={() => setShowQrModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                  ✕
                </button>
              </div>

              <div>
                <p className="text-lg font-bold text-purple-700">{qrData.nama}</p>
                <p className="text-xs text-gray-500">Tunjukkan barcode ini saat menghadiri acara</p>
              </div>

              <div className="p-4 bg-white inline-block rounded-xl border border-gray-200 shadow-inner">
                <QRCode id="qr-modal-active" value={qrData.qrValue} size={200} level="H" />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => downloadQR("qr-modal-active", qrData.nama)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Gambar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
