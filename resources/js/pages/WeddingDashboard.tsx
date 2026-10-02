import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface StatsProps {
  stats: {
    total_tamu: number;
    total_pax: number;
    akan_datang: number;
    pax_akan_datang: number;
    tidak_hadir: number;
    pax_tidak_hadir: number;
    checked_in: number;
    pax_checked_in: number;
    gift_received: number;
    souvenir_given: number;
  };
  acara?: { id: number; nama: string };
}

export default function WeddingDashboard({ stats, acara }: StatsProps) {
  const cards = [
    { title: 'Jumlah Tamu', value: `${stats.total_tamu} (${stats.total_pax} pax)`, color: 'bg-cyan-500' },
    { title: 'Jumlah Tamu yang Akan Datang', value: `${stats.akan_datang} (${stats.pax_akan_datang} pax)`, color: 'bg-blue-600' },
    { title: 'Jumlah Tamu yang Tidak Hadir', value: `${stats.tidak_hadir} (${stats.pax_tidak_hadir} pax)`, color: 'bg-red-500' },
    { title: 'Jumlah Tamu yang Check In', value: `${stats.checked_in} (${stats.pax_checked_in} pax)`, color: 'bg-emerald-600' },
    { title: 'Jumlah Hadiah dari Tamu', value: `${stats.gift_received}`, color: 'bg-cyan-500' },
    { title: 'Jumlah Souvenir Diserahkan', value: `${stats.souvenir_given}`, color: 'bg-cyan-500' },
  ];

  return (
    <AppLayout>
      <Head title="Dashboard Event" />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Event</h1>
            {acara && <p className="text-gray-500">{acara.nama}</p>}
          </div>
          <Link
            href="/weddings/create"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold shadow transition"
          >
            + Buat Undangan Baru
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, idx) => (
            <div key={idx} className={`${card.color} text-white rounded-xl p-5 shadow-sm flex flex-col justify-between h-36 border border-white/10`}>
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase opacity-90">{card.title}</p>
                <p className="text-2xl font-extrabold mt-2 tracking-tight">{card.value}</p>
              </div>
              <div className="flex justify-between items-center text-xs opacity-80 pt-2 border-t border-white/20 font-medium">
                <span>View Details</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
