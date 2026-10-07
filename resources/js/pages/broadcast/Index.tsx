import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, Eye, Loader2, X, Search } from "lucide-react";
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
  const [selectType, setSelectType] = useState<"all" | "selected">("all");
  const [selectedTamuIds, setSelectedTamuIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // State untuk pencarian nama

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

  useEffect(() => {
    if (acara?.wa_template) {
      setMessage(acara.wa_template);
    }
  }, [acara]);

  const tamuUtamaList = allTamu.filter((t: any) => !t.parent_id);

  // Filter berdasarkan group dan search query
  const filteredTamu = tamuUtamaList.filter((t: any) => {
    const matchGrup = selectedGrup === "all" || t.grup_id == selectedGrup;
    const matchSearch =
      t.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.no_telepon?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGrup && matchSearch;
  });

  const toggleSelectType = (type: "all" | "selected") => {
    setSelectType(type);
    if (type === "all") {
      setSelectedTamuIds([]);
    } else {
      setSelectedTamuIds(filteredTamu.map((t: any) => t.id));
    }
  };

  const toggleTamuSelection = (id: number) => {
    if (selectedTamuIds.includes(id)) {
      setSelectedTamuIds(selectedTamuIds.filter((i: number) => i !== id));
    } else {
      setSelectedTamuIds([...selectedTamuIds, id]);
    }
  };

  // Fungsi Toggle Pilih Semua / Batalkan Pilihan dari hasil yang tampil
  const handleToggleSelectAll = () => {
    const visibleIds = filteredTamu.map((t: any) => t.id);
    const allVisibleSelected = visibleIds.every((id) => selectedTamuIds.includes(id));

    if (allVisibleSelected) {
      // Jika semua yang tampil sudah terpilih, hapus dari list yang terpilih
      setSelectedTamuIds(selectedTamuIds.filter((id) => !visibleIds.includes(id)));
    } else {
      // Gabungkan pilihan lama dengan semua yang tampil di pencarian
      const uniqueIds = Array.from(new Set([...selectedTamuIds, ...visibleIds]));
      setSelectedTamuIds(uniqueIds);
    }
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const replaceTemplate = (text: string) => {
    const sampleTamu = filteredTamu[0] || tamuUtamaList[0] || {};
    const sampleToken = sampleTamu.token || "sample-token";
    const link = baseUrl + "/register/" + sampleToken;
    return text
      .replace("{NAMA_PERUSAHAAN}", acara?.nama_perusahaan || "Nama Perusahaan")
      .replace("{NAMA_TAMU}", sampleTamu.nama || "Nama Tamu Utama")
      .replace("{NAMA_ACARA}", acara?.nama || "Nama Acara")
      .replace("{TANGGAL}", acara?.tanggal || "Tanggal")
      .replace("{WAKTU}", acara?.waktu_mulai || "Waktu")
      .replace("{TEMPAT}", acara?.tempat || "Tempat")
      .replace("{ALAMAT}", acara?.alamat || "Alamat")
      .replace("{LINK_REGISTRASI}", link);
  };

  const handleSend = () => {
    // Total target: jika 'all' ambil semua dari filter grup, jika 'selected' ambil dari jumlah id terpilih
    const targetCount = selectType === "all" ? tamuUtamaList.filter((t: any) => selectedGrup === "all" || t.grup_id == selectedGrup).length : selectedTamuIds.length;

    if (targetCount === 0) {
      SweetAlert.fire({ title: "Peringatan", text: "Pilih minimal 1 tamu!", icon: "warning" });
      return;
    }

    SweetAlert.fire({
      title: "Konfirmasi",
      text: "Kirim broadcast ke " + targetCount + " tamu?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setSending(true);

        router.post("/broadcast/send", {
          acara_id: acara?.id,
          grup_id: selectedGrup,
          select_type: selectType,
          tamu_ids: selectedTamuIds,
          message: message,
        }, {
          onSuccess: () => {
            setSending(false);
            SweetAlert.fire({
              title: "Berhasil!",
              text: "Broadcast pesan berhasil diproses.",
              icon: "success",
            });
          },
          onError: (errors) => {
            setSending(false);
            SweetAlert.fire({
              title: "Error",
              text: errors.message || "Gagal mengirim pesan",
              icon: "error"
            });
          }
        });
      }
    });
  };

  const totalAllCount = tamuUtamaList.filter((t: any) => selectedGrup === "all" || t.grup_id == selectedGrup).length;

  return (
    <AppLayout>
      <Head title="Broadcast WA" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.get("/events")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Broadcast WhatsApp</h1>
              <p className="text-gray-500 text-sm">{acara?.nama || "Pilih acara"}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Group Tamu:
              </label>
              <select
                value={selectedGrup}
                onChange={(e) => setSelectedGrup(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="all">Semua Group</option>
                {grups.map((g: any) => (
                  <option key={g.id} value={g.id}>
                    {g.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kirim ke:
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="selectType"
                    checked={selectType === "all"}
                    onChange={() => toggleSelectType("all")}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <span className="font-medium">Kirim ke Semua Tamu Utama ({totalAllCount})</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="selectType"
                    checked={selectType === "selected"}
                    onChange={() => toggleSelectType("selected")}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <span className="font-medium">Pilih Tamu Secara Manual</span>
                </label>
              </div>

              {selectType === "selected" && (
                <div className="mt-4 border rounded-lg p-3 space-y-3">
                  {/* Input Search Nama Tamu */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari nama atau nomor telepon tamu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium text-gray-600">
                      {selectedTamuIds.length} tamu dipilih
                    </span>
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      {filteredTamu.length > 0 && filteredTamu.every((t) => selectedTamuIds.includes(t.id))
                        ? "Batalkan Pilihan (Tampil)"
                        : "Pilih Semua (Tampil)"}
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {filteredTamu.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">Tamu tidak ditemukan</p>
                    ) : (
                      filteredTamu.map((t: any) => (
                        <label key={t.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={selectedTamuIds.includes(t.id)}
                            onChange={() => toggleTamuSelection(t.id)}
                            className="w-4 h-4 accent-emerald-600 rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{t.nama}</p>
                            <p className="text-xs text-gray-500">{t.no_telepon || "Tanpa WA"}</p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesan:
              </label>
              <textarea
                className="w-full border rounded-lg p-3 h-48 font-mono text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                Tag: {"{NAMA_TAMU}"}, {"{NAMA_ACARA}"}, {"{TANGGAL}"}, {"{WAKTU}"}, {"{TEMPAT}"}, {"{ALAMAT}"}, {"{LINK_REGISTRASI}"}, {"{NAMA_PERUSAHAAN}"}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setPreview(true)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSend}
                disabled={
                  sending || totalAllCount === 0 || !waSettings ||
                  (selectType === "selected" && selectedTamuIds.length === 0)
                }
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Kirim {selectType === "all" ? totalAllCount : selectedTamuIds.length} Tamu
              </Button>
            </div>

            {!waSettings && (
              <p className="text-sm text-red-500 text-center font-medium">
                WhatsApp Gateway belum dikonfigurasi
              </p>
            )}
          </CardContent>
        </Card>

        {preview && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
              <CardContent className="p-0">
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                  <h2 className="font-bold">Preview Pesan</h2>
                  <button onClick={() => setPreview(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="bg-[#e5ddd5] p-4 rounded-lg">
                    <div className="bg-white p-3 rounded-lg rounded-tl-none text-sm whitespace-pre-wrap">
                      {replaceTemplate(message)}
                    </div>
                  </div>
                  <button
                    onClick={() => setPreview(false)}
                    className="mt-6 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded font-medium"
                  >
                    Tutup
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
