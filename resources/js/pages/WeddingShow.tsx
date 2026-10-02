import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, MapPin, Edit, Users, Gift, Package } from "lucide-react";

interface Props {
  acara: { id: number; nama: string; tanggal: string; waktu_mulai: string; tempat?: string; alamat?: string };
  stats?: { total_tamu: number; total_pax: number; akan_datang: number; checked_in: number; tidak_hadir: number; gift_received: number; souvenir_given: number };
}

export default function WeddingShow({ acara, stats }: Props) {
  const fmtDate = (s: string) => s ? new Date(s).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-';
  const fmtTime = (s: string) => { if (!s) return '-'; const [h, m] = s.split(':'); return `${parseInt(h) % 12 || 12}:${m} ${parseInt(h) >= 12 ? 'PM' : 'AM'}`; };

  return (
    <AppLayout>
      <Head title={acara.nama} />
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/weddings"><Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
            <div><h1 className="text-2xl font-bold">{acara.nama}</h1><p className="text-gray-500">Detail Acara</p></div>
          </div>
          <Link href={`/guest-overview/tamu?acara=${acara.id}`}><Button className="bg-yellow-500 hover:bg-yellow-600 text-black"><Edit className="w-4 h-4 mr-2" />Kelola Tamu</Button></Link>
        </div>

        <Card className="max-w-3xl">
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Detail Acara</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3"><div className="p-2 bg-blue-100 rounded-lg"><Calendar className="w-5 h-5 text-blue-600" /></div><div><p className="text-sm text-gray-500">Tanggal</p><p className="font-semibold">{fmtDate(acara.tanggal)}</p></div></div>
              <div className="flex items-start gap-3"><div className="p-2 bg-purple-100 rounded-lg"><Clock className="w-5 h-5 text-purple-600" /></div><div><p className="text-sm text-gray-500">Waktu</p><p className="font-semibold">{fmtTime(acara.waktu_mulai)}</p></div></div>
              <div className="flex items-start gap-3"><div className="p-2 bg-green-100 rounded-lg"><MapPin className="w-5 h-5 text-green-600" /></div><div><p className="text-sm text-gray-500">Tempat</p><p className="font-semibold">{acara.tempat || '-'}</p></div></div>
              <div className="flex items-start gap-3"><div className="p-2 bg-orange-100 rounded-lg"><MapPin className="w-5 h-5 text-orange-600" /></div><div><p className="text-sm text-gray-500">Alamat</p><p className="font-semibold">{acara.alamat || '-'}</p></div></div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-500 text-white"><CardContent className="pt-6"><p className="text-sm opacity-90">Total Tamu</p><p className="text-3xl font-bold">{stats?.total_tamu || 0}</p><p className="text-sm opacity-80">({stats?.total_pax || 0} pax)</p></CardContent></Card>
          <Card className="bg-emerald-500 text-white"><CardContent className="pt-6"><p className="text-sm opacity-90">Akan Datang</p><p className="text-3xl font-bold">{stats?.akan_datang || 0}</p></CardContent></Card>
          <Card className="bg-red-500 text-white"><CardContent className="pt-6"><p className="text-sm opacity-90">Check In</p><p className="text-3xl font-bold">{stats?.checked_in || 0}</p></CardContent></Card>
          <Card className="bg-yellow-500 text-black"><CardContent className="pt-6"><p className="text-sm opacity-80">Tidak Hadir</p><p className="text-3xl font-bold">{stats?.tidak_hadir || 0}</p></CardContent></Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-3 bg-pink-100 rounded-lg"><Gift className="w-6 h-6 text-pink-600" /></div><div><p className="text-sm text-gray-500">Hadiah</p><p className="text-2xl font-bold">{stats?.gift_received || 0}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-3 bg-teal-100 rounded-lg"><Package className="w-6 h-6 text-teal-600" /></div><div><p className="text-sm text-gray-500">Souvenir</p><p className="text-2xl font-bold">{stats?.souvenir_given || 0}</p></div></div></CardContent></Card>
        </div>

        <Card className="max-w-3xl">
          <CardHeader><CardTitle>Aksi Cepat</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href={`/guest-overview/tamu?acara=${acara.id}`}><Button variant="outline" className="w-full h-20 flex flex-col gap-1"><Users className="w-5 h-5" /><span className="text-xs">Tamu</span></Button></Link>
              <Link href={`/guest-checkin?acara=${acara.id}`}><Button variant="outline" className="w-full h-20 flex flex-col gap-1"><Calendar className="w-5 h-5" /><span className="text-xs">Check In</span></Button></Link>
              <Link href={`/guest-hadiah?acara=${acara.id}`}><Button variant="outline" className="w-full h-20 flex flex-col gap-1"><Gift className="w-5 h-5" /><span className="text-xs">Hadiah</span></Button></Link>
              <Link href={`/guest-souvenir?acara=${acara.id}`}><Button variant="outline" className="w-full h-20 flex flex-col gap-1"><Package className="w-5 h-5" /><span className="text-xs">Souvenir</span></Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
