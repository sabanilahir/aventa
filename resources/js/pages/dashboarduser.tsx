import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ClipboardCheck,
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Presensi {
  id: number;
  tanggal: string;
  jam_masuk: string | null;
  jam_pulang: string | null;
  status: string;
}

interface Schedule {
  id: number;
  tanggal: string;
  shift: {
    id: number;
    nama: string;
    jam_masuk: string;
    jam_pulang: string;
  };
  is_off: boolean;
}

interface Props {
  stats: {
    total_hadir: number;
    total_terlambat: number;
    total_izin: number;
  };
  todayPresensi: Presensi | null;
  todaySchedule: Schedule | null;
  recentPresensi: Presensi[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

const statusColors: Record<string, string> = {
  hadir: 'bg-green-100 text-green-800',
  terlambat: 'bg-yellow-100 text-yellow-800',
  pulang_awal: 'bg-orange-100 text-orange-800',
  izin: 'bg-blue-100 text-blue-800',
  cuti: 'bg-purple-100 text-purple-800',
  sakit: 'bg-cyan-100 text-cyan-800',
  alpha: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  hadir: 'Hadir',
  terlambat: 'Terlambat',
  pulang_awal: 'Pulang Awal',
  izin: 'Izin',
  cuti: 'Cuti',
  sakit: 'Sakit',
  alpha: 'Alpha',
};

export default function DashboardUser({ stats, todayPresensi, todaySchedule, recentPresensi }: Props) {
  const { auth } = usePage().props as any;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard Saya" />
      <div className="flex flex-col gap-6 p-4">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Selamat Datang, {auth?.user?.name}!</h1>
            <p className="text-gray-500">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <Button
            onClick={() => router.get(route('presensi.index'))}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Presensi Sekarang
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Hadir</p>
                  <p className="text-3xl font-bold mt-1">{stats.total_hadir}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Total Terlambat</p>
                  <p className="text-3xl font-bold mt-1">{stats.total_terlambat}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-yellow-200 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Izin</p>
                  <p className="text-3xl font-bold mt-1">{stats.total_izin}</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-200 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Status & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Status Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayPresensi ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-12 h-12 text-green-600 mr-3" />
                    <div>
                      <p className="font-semibold text-green-800">Sudah Presensi</p>
                      <p className="text-sm text-green-600">
                        {todayPresensi.jam_masuk} - {todayPresensi.jam_pulang || 'Belum Pulang'}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Badge className={statusColors[todayPresensi.status]}>
                      {statusLabels[todayPresensi.status]}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">Belum melakukan presensi</p>
                  <Button
                    onClick={() => router.get(route('presensi.index'))}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Presensi Sekarang
                  </Button>
                </div>
              )}

              {todaySchedule?.shift && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Jadwal Shift:</p>
                  <Badge className="text-white">
                    {todaySchedule.shift.nama}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    {todaySchedule.shift.jam_masuk} - {todaySchedule.shift.jam_pulang}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.get(route('izin.index'))}
              >
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Ajukan Izin / Cuti
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.get(route('presensi.index'))}
              >
                <Clock className="w-4 h-4 mr-2" />
                Riwayat Presensi
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Presensi Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPresensi.length > 0 ? (
                recentPresensi.map((presensi) => (
                  <div
                    key={presensi.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {new Date(presensi.tanggal).toLocaleDateString('id-ID', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {presensi.jam_masuk || '-'} - {presensi.jam_pulang || '-'}
                        </p>
                      </div>
                    </div>
                    <Badge className={statusColors[presensi.status]}>
                      {statusLabels[presensi.status]}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Belum ada data presensi</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
