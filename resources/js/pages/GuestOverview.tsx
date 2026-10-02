import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, LayoutGrid } from "lucide-react";

export default function GuestOverview() {
  const { type, stats, acara } = usePage<any>().props;

  const statCards = type === "tamu" ? [
    { title: "Jumlah Tamu", value: stats?.total_tamu || 0, sub: `${stats?.total_pax || 0} pax`, icon: Users, color: "text-teal-600", bg: "bg-teal-50" },
    { title: "Tamu Hadir", value: stats?.tamu_hadir || 0, sub: `${stats?.pax_hadir || 0} pax`, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
    { title: "Belum Hadir", value: stats?.tamu_belum || 0, sub: `${stats?.pax_belum || 0} pax`, icon: UserX, color: "text-red-600", bg: "bg-red-50" },
  ] : [
    { title: "Jumlah Meja", value: stats?.total_meja || 0, sub: "meja", icon: LayoutGrid, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Kapasitas", value: stats?.total_kapasitas || 0, sub: "orang", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Tamu Terduduk", value: stats?.tamu_terduduk || 0, sub: "orang", icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <AppLayout>
      <Head title={`Overview ${type}`} />
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Overview {type === "tamu" ? "Tamu" : "Meja"}</h1>
          {acara && <p className="text-gray-500">Event: {acara.nama}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCards.map((s, i) => (
            <Card key={i} className={s.bg}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{s.title}</p>
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-sm text-gray-500">{s.sub}</p>
                  </div>
                  <s.icon className={`w-12 h-12 ${s.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
