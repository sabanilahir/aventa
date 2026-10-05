import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, Gift, Package, Calendar, MapPin, Clock } from "lucide-react";

export default function Dashboard() {
  const { props } = usePage();
  const { stats, acara, acaraList } = props as any;

  const handleChange = (id: string) => {
    router.get("/dashboard?acara_id=" + id);
  };
   const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    // Memotong bagian jam (T00:00:00 atau 00:00:00) dan menyisakan YYYY-MM-DD
    const dateOnly = dateString.split('T')[0].split(' ')[0];

    try {
      // (Opsional) Mengubah format menjadi 30 Okt 2026 agar lebih cantik di UI
      const dateObj = new Date(dateOnly);
      return dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch (e) {
      return dateOnly; // Fallback jika gagal format
    }
  };

  const cards = [
    { title: "Jumlah Tamu", value: `${stats?.total_tamu || 0} (${stats?.total_pax || 0} pax)`, color: "bg-blue-600" },
    { title: "Akan Hadir", value: `${stats?.akan_hadir || 0} (${stats?.pax_akan_hadir || 0} pax)`, color: "bg-green-600" },
    { title: "Belum Konfirmasi", value: `${stats?.belum_konfirmasi || 0} (${stats?.pax_belum || 0} pax)`, color: "bg-yellow-500" },
    { title: "Checked In", value: `${stats?.checked_in || 0} (${stats?.pax_checked_in || 0} pax)`, color: "bg-emerald-600" },
    { title: "Hadir", value: `${stats?.pax_hadir || 0} pax`, color: "bg-cyan-500" },
    { title: "Souvenir", value: `${stats?.souvenir_terima || 0} pcs`, color: "bg-amber-500" },
  ];

  return (
    <AppLayout>
      <Head title="Dashboard Event" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            {acara && <p className="text-sm text-gray-500">{acara.nama}</p>}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Pilih Acara:</label>
            <select
              value={acara?.id || ""}
              onChange={(e) => handleChange(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="">-- Pilih Acara --</option>
              {(acaraList || []).map((a: any) => (
                <option key={a.id} value={a.id}>{a.nama}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`${card.color} text-white rounded-xl p-5 shadow-sm`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium opacity-90">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {acara && (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Detail Acara</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{formatDate(acara.tanggal)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{acara.waktu_mulai}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{acara.tempat}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(!acara || acaraList?.length === 0) && (
          <Card className="border-yellow-500 bg-yellow-50">
            <CardContent className="p-6 text-center">
              <p className="text-yellow-800">Silakan buat acara baru untuk memulai</p>
              <Button onClick={() => router.get("/events/create")} className="mt-4">
                Buat Acara Baru
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
