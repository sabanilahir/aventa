import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Calendar, Sparkles, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
  const { props } = usePage();
  const stats = (props.stats as any) || null;
  const acara = (props.acara as any) || null;
  const acaraList = (props.acaraList as any[]) || [];

  const [selectedAcaraId, setSelectedAcaraId] = useState(acara?.id || "");

  useEffect(() => {
    if (acara?.id) {
      setSelectedAcaraId(acara.id);
    }
  }, [acara]);

  const handleAcaraChange = (value: string) => {
    setSelectedAcaraId(value);
    router.get(
      "/dashboard",
      { acara_id: value },
      { preserveState: true, preserveScroll: true }
    );
  };

  const defaultStats = {
    total_tamu: 0,
    total_pax: 0,
    sudah_hadir: 0,
    pax_sudah_hadir: 0,
    belum_hadir: 0,
    pax_belum_hadir: 0,
  };

  const s = stats || defaultStats;

  // Persentase Kehadiran
  const persenHadir = s.total_tamu > 0 ? Math.round((s.sudah_hadir / s.total_tamu) * 100) : 0;

  const cards = [
    {
      title: "Total Tamu",
      value: s.total_tamu,
      subText: `${s.total_pax} Pax Terdaftar`,
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      iconColor: "bg-blue-600 text-white shadow-blue-200",
      icon: Users,
    },
    {
      title: "Sudah Hadir",
      value: s.sudah_hadir,
      subText: `${s.pax_sudah_hadir} Pax Check-in`,
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-600",
      iconColor: "bg-emerald-600 text-white shadow-emerald-200",
      icon: UserCheck,
    },
    {
      title: "Belum Hadir",
      value: s.belum_hadir,
      subText: `${s.pax_belum_hadir} Pax Belum Check-in`,
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-200",
      textColor: "text-amber-600",
      iconColor: "bg-amber-600 text-white shadow-amber-200",
      icon: UserX,
    },
  ];

  return (
    <AppLayout>
      <Head title="Dashboard Event" />

      {/* FULLPAGE CONTAINER */}
      <div className="min-h-[calc(100vh-4rem)] w-full bg-slate-50/50 p-6 md:p-8 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          {/* HEADER SECTION WITH GRADIENT & SELECTOR */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white p-6 md:p-8 shadow-2xl">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-purple-200 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                  Realtime Monitoring
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  {acara?.nama || "Ringkasan Event"}
                </h1>

                {acara && (
                  <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-purple-100/90">
                    {acara.tanggal && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-pink-300" />
                        <span>{acara.tanggal}</span>
                      </div>
                    )}
                    {acara.waktu_mulai && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-pink-300" />
                        <span>{acara.waktu_mulai} WIB</span>
                      </div>
                    )}
                    {acara.tempat && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-pink-300" />
                        <span>{acara.tempat}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* DROPDOWN SELECTOR */}
              <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Label htmlFor="acara-select" className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                  PILIH EVENT:
                </Label>
                <select
                  id="acara-select"
                  value={selectedAcaraId}
                  onChange={(e) => handleAcaraChange(e.target.value)}
                  className="w-full sm:w-auto border-0 rounded-xl px-4 py-2 text-sm bg-white text-gray-900 shadow-md font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
                >
                  <option value="">-- Pilih Event --</option>
                  {acaraList?.map((a: any) => (
                    <option key={a.id} value={a.id}>
                      {a.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ABSTRACT BACKGROUND DECORATION */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-1/2 -top-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* 3 KARTU STATISTIK UTAMA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Card
                  key={idx}
                  className={`border-2 ${card.borderColor} shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-white group`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          {card.title}
                        </p>
                        <p className="text-4xl font-extrabold text-gray-900 tracking-tight group-hover:scale-105 transition-transform duration-200 origin-left">
                          {card.value}
                        </p>
                        <div className="pt-2">
                          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${card.bgColor} ${card.textColor}`}>
                            {card.subText}
                          </span>
                        </div>
                      </div>

                      <div className={`p-4 rounded-2xl shadow-lg ${card.iconColor} group-hover:rotate-6 transition-transform duration-300`}>
                        <Icon className="w-8 h-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* PROGRESS BAR & KETERANGAN TAMBAHAN */}
          {acara && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* STATUS PROGRESS BAR */}
              <Card className="lg:col-span-2 border-0 shadow-sm rounded-2xl bg-white overflow-hidden border border-slate-100">
                <CardHeader className="bg-slate-50/50 border-b pb-4">
                  <CardTitle className="text-base font-bold text-gray-800 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Persentase Kehadiran
                    </span>
                    <span className="text-indigo-600 font-extrabold text-xl">{persenHadir}%</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="w-full bg-slate-100 rounded-full h-5 overflow-hidden p-1 border border-slate-200">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: `${persenHadir}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-gray-500 pt-1">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      {s.sudah_hadir} Tamu Sudah Check-in
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      Sisa {s.belum_hadir} Tamu Belum Datang
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* QUICK SUMMARY CARD */}
              <Card className="border-0 shadow-sm rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                    Kapasitas Check-in
                  </p>
                  <h3 className="text-2xl font-bold mb-1">
                    {s.pax_sudah_hadir} / {s.total_pax} <span className="text-sm font-normal text-slate-300">Pax</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Jumlah pax dihitung berdasarkan total tamu utama dan anggota keluarga/tambahan.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 text-xs text-indigo-200 flex justify-between items-center">
                  <span>Status Sistem:</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                    Active
                  </span>
                </div>
              </Card>
            </div>
          )}

          {/* ALERT JIKA BELUM ADA ACARA */}
          {!acara && acaraList?.length === 0 && (
            <Card className="border-amber-200 bg-amber-50/80 rounded-2xl p-6">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-amber-800 text-lg">Belum Ada Event Terdaftar</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-amber-700">
                  Silakan buat acara baru terlebih dahulu melalui menu manajemen acara untuk mulai mengelola tamu.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-6 border-t border-slate-200/60 text-center text-xs text-slate-400">
          <p>© System Undangan & QR Code Check-in System</p>
        </div>
      </div>
    </AppLayout>
  );
}
