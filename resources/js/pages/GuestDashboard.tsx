import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, Clock, LayoutGrid, Gift, Package } from "lucide-react";

export default function GuestDashboard() {
  const { acara, stats, recentTamu } = usePage<any>().props;
  const handleCheckin = (id: number) => router.post(`/guest-tamu/${id}/checkin`);

  const statCards = [
    { title: "Total", value: stats.total_tamu, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Hadir", value: stats.tamu_hadir, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { title: "Belum", value: stats.tamu_belum, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { title: "Meja", value: stats.total_meja, icon: LayoutGrid, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Hadiah", value: stats.total_hadiah, icon: Gift, color: "text-pink-600", bg: "bg-pink-50" },
    { title: "Souvenir", value: stats.total_souvenir, icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <AppLayout><Head title="Guest Dashboard" />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Guest Dashboard</h1>
          <div className="flex gap-2">
            <a href="/guest-acara" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Acara</a>
            <a href="/guest-tamu" className="bg-green-600 text-white px-4 py-2 rounded text-sm">Tamu</a>
          </div>
        </div>

        {acara && (
          <Card className="border-l-4 border-l-blue-500"><CardContent className="pt-6">
            <div className="flex justify-between"><div><h2 className="text-xl font-bold">{acara.nama}</h2><p className="text-gray-600">{new Date(acara.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} | {acara.waktu_mulai}</p></div><span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Aktif</span></div>
          </CardContent></Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {statCards.map((s, i) => (
            <Card key={i} className={s.bg}><CardContent className="pt-6">
              <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">{s.title}</p><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p></div><s.icon className={`w-8 h-8 ${s.color}`} /></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle>Menu</CardTitle></CardHeader><CardContent className="space-y-2">
            <a href="/guest-tamu" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><Users className="w-6 h-6 text-blue-600" /><span>Kelola Tamu</span></a>
            <a href="/guest-meja" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><LayoutGrid className="w-6 h-6 text-purple-600" /><span>Kelola Meja</span></a>
            <a href="/guest-grup" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><Users className="w-6 h-6 text-green-600" /><span>Kelola Grup</span></a>
            <a href="/guest-hadiah" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><Gift className="w-6 h-6 text-pink-600" /><span>Hadiah</span></a>
          </CardContent></Card>

          <Card><CardHeader><CardTitle>Tamu Terbaru <a href="/guest-tamu" className="text-sm text-blue-600 float-right">Lihat Semua</a></CardTitle></CardHeader><CardContent>
            {recentTamu?.length > 0 ? (
              <div className="space-y-2">{recentTamu.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.status_hadir === 'hadir' ? 'bg-green-100' : 'bg-gray-200'}`}>
                      {t.status_hadir === 'hadir' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Clock className="w-4 h-4 text-gray-400" />}
                    </div>
                    <span>{t.nama}</span>
                  </div>
                  {t.status_hadir === 'hadir' ? <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Hadir</span> : <button onClick={() => handleCheckin(t.id)} className="px-3 py-1 bg-purple-600 text-white rounded text-xs">Check-in</button>}
                </div>
              ))}</div>
            ) : <p className="text-center text-gray-500 py-8">Belum ada tamu</p>}
          </CardContent></Card>
        </div>
      </div>
    </AppLayout>
  );
}
