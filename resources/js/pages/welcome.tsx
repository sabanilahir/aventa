import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Clock, Calendar, Users, Shield } from 'lucide-react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
            <Head>
                <title>Aplikasi Presensi</title>
            </Head>

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-10">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <ClipboardCheck className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xl font-bold text-white">Patrap Senopati</span>
                        </div>
                        <Link href={route('login')}>
                            <Button className="bg-white text-blue-600 hover:bg-blue-50">
                                Masuk
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="container mx-auto px-6 pt-32 pb-20">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur">
                        <ClipboardCheck className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6">
                        Aplikasi Presensi Karyawan
                    </h1>
                    <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                        Sistem manajemen kehadiran dan absensi karyawan dengan fitur
                        GPS Location, QR Code, dan laporan real-time.
                    </p>
                    <Link href={route('login')}>
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-xl"
                        >
                            Buka Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Features */}
            <div className="container mx-auto px-6 pb-20">
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <FeatureCard
                        icon={<Clock className="w-8 h-8" />}
                        title="Presensi GPS"
                        description="Absensi dengan lokasi GPS akurat dan radius area kerja"
                    />
                    <FeatureCard
                        icon={<Calendar className="w-8 h-8" />}
                        title="Manajemen Izin"
                        description="Ajukan dan kelola izin cuti dengan workflow approval"
                    />
                    <FeatureCard
                        icon={<Users className="w-8 h-8" />}
                        title="Multi-Shift"
                        description="Dukungan berbagai jadwal shift kerja dan rota karyawan"
                    />
                    <FeatureCard
                        icon={<ClipboardCheck className="w-8 h-8" />}
                        title="Laporan Lengkap"
                        description="Export data presensi ke Excel dan PDF"
                    />
                    <FeatureCard
                        icon={<Shield className="w-8 h-8" />}
                        title="Aman & Terpercaya"
                        description="Data terenkripsi dengan sistem role dan permission"
                    />
                    <FeatureCard
                        icon={<Clock className="w-8 h-8" />}
                        title="Real-time"
                        description="Dashboard dengan data presensi hari ini secara real-time"
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-black/20">
                <div className="container mx-auto px-6 py-8">
                    <div className="text-center text-blue-200">
                        <p>&copy; {new Date().getFullYear()} Patrap Senopati. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-blue-100 leading-relaxed">{description}</p>
        </div>
    );
}
