import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Edit, Users, Gift, QrCode, MessageCircle } from "lucide-react";

export default function EventShow() {
  const { props } = usePage();
  const acara = props.acara || {};
  const stats = props.stats || {
    total_tamu: 0,
    total_pax: 0,
    hadir: 0,
    akan_datang: 0,
    tidak_hadir: 0,
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      archived: "bg-gray-100 text-gray-800"
    };
    return <span className={`px-2 py-1 rounded-full text-xs ${styles[status] || styles.draft}`}>{status}</span>;
  };

  return (
    <AppLayout>
      <Head title={acara.nama || "Event Detail"} />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.get("/events")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{acara.nama}</h1>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(acara.status)}
                <span className="text-gray-500 text-sm">{acara.tanggal} {acara.waktu_mulai}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.get("/events/" + acara.id + "/edit")}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Event
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total_tamu}</p>
                  <p className="text-sm text-gray-500">Total Tamu ({stats.total_pax} Pax)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.hadir}</p>
                  <p className="text-sm text-gray-500">Sudah Hadir</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.akan_datang}</p>
                  <p className="text-sm text-gray-500">Belum Hadir</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4" onClick={() => router.get("/guest/tamu?acara_id=" + acara.id)}>
            <Users className="w-5 h-5 mr-2" />
            Kelola Tamu
          </Button>
          <Button variant="outline" className="h-auto py-4" onClick={() => router.get("/broadcast?acara_id=" + acara.id)}>
            <MessageCircle className="w-5 h-5 mr-2" />
            Broadcast WA
          </Button>
          <Button variant="outline" className="h-auto py-4" onClick={() => router.get("/qr?acara_id=" + acara.id)}>
            <QrCode className="w-5 h-5 mr-2" />
            QR Codes
          </Button>
          <Button variant="outline" className="h-auto py-4" onClick={() => router.get("/guest/hadiah?acara_id=" + acara.id)}>
            <Gift className="w-5 h-5 mr-2" />
            Kelola Hadiah
          </Button>
        </div>

        {/* Detail Event */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Detail Event</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span className="font-medium w-24">Tanggal:</span>
                <span>{acara.tanggal}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-24">Waktu:</span>
                <span>{acara.waktu_mulai}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-24">Tempat:</span>
                <span>{acara.tempat || "-"}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-24">Alamat:</span>
                <span>{acara.alamat || "-"}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-24">QR/Keluarga:</span>
                <span>{acara.qr_per_keluarga || 4} QR</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
