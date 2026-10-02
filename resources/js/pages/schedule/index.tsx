import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Shift {
  id: number;
  nama: string;
  jam_masuk: string;
  jam_pulang: string;
  warna: string;
}

interface Schedule {
  id: number;
  tanggal: string;
  shift: Shift | null;
  is_off: boolean;
}

interface Props {
  schedules: Schedule[];
  bulan: number;
  tahun: number;
  shiftSaya?: Shift | null;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Jadwal Saya', href: '/schedule' },
];

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function ScheduleIndex({ schedules, bulan, tahun, shiftSaya }: Props) {
  const { auth } = usePage().props as any;

  const daysInMonth = new Date(tahun, bulan + 1, 0).getDate();
  const firstDayOfMonth = new Date(tahun, bulan, 1).getDay();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const getScheduleForDate = (day: number) => {
    const dateStr = `${tahun}-${String(bulan + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedules.find(s => s.tanggal === dateStr);
  };

  const prevMonth = () => {
    const newDate = new Date(tahun, bulan - 1, 1);
    router.get(route('schedule.index'), {
      bulan: newDate.getMonth(),
      tahun: newDate.getFullYear()
    });
  };

  const nextMonth = () => {
    const newDate = new Date(tahun, bulan + 1, 1);
    router.get(route('schedule.index'), {
      bulan: newDate.getMonth(),
      tahun: newDate.getFullYear()
    });
  };

  const today = new Date();
  const isToday = (day: number) => {
    return today.getDate() === day &&
           today.getMonth() === bulan &&
           today.getFullYear() === tahun;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Jadwal Saya" />
      <div className="flex flex-col gap-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Jadwal Saya</h1>
            <p className="text-gray-500">Lihat jadwal kerja dan shift Anda</p>
          </div>
          {shiftSaya && (
            <Badge className="text-white" style={{ backgroundColor: shiftSaya.warna }}>
              Shift: {shiftSaya.nama} ({shiftSaya.jam_masuk} - {shiftSaya.jam_pulang})
            </Badge>
          )}
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {monthNames[bulan]} {tahun}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before the first day */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const schedule = getScheduleForDate(day);
                const isOff = schedule?.is_off || false;
                const shift = schedule?.shift;

                return (
                  <div
                    key={day}
                    className={`
                      aspect-square p-2 rounded-lg border text-center
                      ${isToday(day) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                      ${isOff ? 'bg-gray-100' : 'bg-white'}
                    `}
                  >
                    <div className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : 'text-gray-700'}`}>
                      {day}
                    </div>
                    {shift && (
                      <div className="mt-1">
                        <div
                          className="text-xs px-1 py-0.5 rounded text-white truncate"
                          style={{ backgroundColor: shift.warna }}
                        >
                          {shift.nama}
                        </div>
                      </div>
                    )}
                    {isOff && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-500">Off</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded border-2 border-blue-500" />
                <span>Hari Ini</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded bg-gray-100 border" />
                <span>Hari Libur</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Jadwal Mendatang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schedules
                .filter(s => new Date(s.tanggal) >= new Date(today.toISOString().split('T')[0]))
                .slice(0, 7)
                .map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {new Date(schedule.tanggal).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        {schedule.shift && (
                          <div className="flex items-center gap-2 mt-1">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: schedule.shift.warna }}
                            />
                            <span className="text-sm text-gray-600">
                              {schedule.shift.nama} ({schedule.shift.jam_masuk} - {schedule.shift.jam_pulang})
                            </span>
                          </div>
                        )}
                        {schedule.is_off && (
                          <Badge variant="secondary" className="mt-1">Hari Libur</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              {schedules.filter(s => new Date(s.tanggal) >= new Date(today.toISOString().split('T')[0])).length === 0 && (
                <p className="text-center text-gray-500 py-4">Tidak ada jadwal mendatang</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
