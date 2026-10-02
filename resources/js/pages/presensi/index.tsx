import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Camera,
  Calendar,
  TrendingUp,
  AlertCircle,
  User
} from 'lucide-react';
import FaceCapture from '@/components/FaceCapture';

interface Shift {
  id: number;
  nama: string;
  jam_masuk: string;
  jam_pulang: string;
}

interface Location {
  id: number;
  nama: string;
}

interface Presensi {
  id: number;
  tanggal: string;
  jam_masuk: string | null;
  jam_pulang: string | null;
  status: string;
  shift: Shift | null;
  location: Location | null;
  work_hours?: number;
}

interface Izin {
  id: number;
  tipe: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
}

interface Props {
  todayPresensi: Presensi | null;
  todaySchedule: { shift: Shift } | null;
  todayIzin: Izin | null;
  recentPresensi: Presensi[];
  stats: {
    total_hadir: number;
    total_terlambat: number;
    total_izin: number;
  };
  faceStatus?: {
    registered: boolean;
    has_descriptor: boolean;
  };
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Presensi', href: '/presensi' },
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

export default function PresensiIndex({
  todayPresensi,
  todaySchedule,
  todayIzin,
  recentPresensi,
  stats,
  faceStatus
}: Props) {
  const { auth } = usePage().props as unknown as { auth: { user: { name: string } } };
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showFaceVerifyModal, setShowFaceVerifyModal] = useState(false);
  const [cameraType, setCameraType] = useState<'in' | 'out'>('in');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'checkin' | 'checkout' | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung browser ini');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError(null);
      },
      () => {
        setError('Tidak dapat mendapatkan lokasi. Pastikan GPS aktif.');
      }
    );
  };

  const retryLocation = () => {
    setError(null);
    setLocation(null);
    getLocation();
  };

  useEffect(() => {
    if (showCheckInModal || showCheckOutModal) {
      getLocation();
    }
  }, [showCheckInModal, showCheckOutModal]);

  const handleCheckIn = async () => {
    if (!location) {
      setError('Lokasi diperlukan');
      return;
    }

    // If face is registered, require face verification
    if (faceStatus?.registered) {
      setPendingAction('checkin');
      setShowCheckInModal(false);
      setShowFaceVerifyModal(true);
      return;
    }

    // Proceed without face verification
    setIsLoading(true);
    try {
      const response = await fetch('/presensi/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
          liveness_verified: false,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowCheckInModal(false);
        window.location.reload();
      } else {
        setError(data.message || 'Gagal menyimpan presensi masuk');
      }
    } catch (err) {
      setError('Gagal menyimpan presensi masuk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceVerified = async (imageData: string, descriptor?: number[]) => {
    setShowFaceVerifyModal(false);

    if (!location) {
      setError('Lokasi diperlukan');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/presensi/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
          foto: imageData,
          liveness_verified: true,
          face_descriptor: descriptor,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowCheckInModal(false);
        window.location.reload();
      } else {
        // Show specific error based on error type
        let errorMessage = data.message || 'Gagal menyimpan presensi masuk';

        if (data.error_type === 'face_mismatch') {
          errorMessage = `❌ Wajah tidak cocok! ${data.message}`;
        } else if (data.error_type === 'outside_radius') {
          errorMessage = `📍 Di luar area! ${data.message}`;
        } else if (data.error_type === 'location_not_found') {
          errorMessage = `🗺️ Lokasi tidak ditemukan. ${data.message}`;
        }

        setError(errorMessage);
      }
    } catch (err) {
      setError('Gagal menyimpan presensi masuk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!location) {
      setError('Lokasi diperlukan');
      return;
    }

    setIsLoading(true);
    try {
      await router.post('/presensi/check-out', {
        latitude: location.lat,
        longitude: location.lng,
      });
      setShowCheckOutModal(false);
      window.location.reload();
    } catch (err) {
      setError('Gagal menyimpan presensi pulang');
    } finally {
      setIsLoading(false);
    }
  };

  const canCheckIn = !todayPresensi?.jam_masuk;
  const canCheckOut = todayPresensi?.jam_masuk && !todayPresensi?.jam_pulang;
  const hasIzin = !!todayIzin;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Presensi" />
      <div className="flex flex-col gap-6 p-4">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">Selamat Datang, {auth.user.name}!</h1>
          <p className="text-blue-100">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </CardContent>
      </Card>

      {/* Face Registration Warning */}
      {(!faceStatus?.registered) && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-800">Wajah Belum Terdaftar</p>
                  <p className="text-sm text-yellow-600">
                    Daftarkan wajah Anda terlebih dahulu untuk dapat melakukan presensi
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700"
                onClick={() => router.get('/face-register')}
              >
                Daftar Sekarang
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

        {/* Today's Status & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Check In/Out Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Presensi Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasIzin ? (
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <AlertCircle className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-800">
                      Anda sedang dalam status: {todayIzin.tipe.toUpperCase()}
                    </p>
                    <p className="text-sm text-blue-600">
                      {new Date(todayIzin.tanggal_mulai).toLocaleDateString('id-ID')} -
                      {new Date(todayIzin.tanggal_selesai).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              ) : todayPresensi?.jam_masuk && todayPresensi?.jam_pulang ? (
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">Presensi Lengkap!</p>
                    <p className="text-sm text-green-600">
                      Masuk: {todayPresensi.jam_masuk} | Pulang: {todayPresensi.jam_pulang}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-4">
                  {canCheckIn && (
                    <Button
                      size="lg"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => setShowCheckInModal(true)}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Presensi Masuk
                    </Button>
                  )}
                  {canCheckOut && (
                    <Button
                      size="lg"
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                      onClick={() => setShowCheckOutModal(true)}
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Presensi Pulang
                    </Button>
                  )}
                  {!canCheckIn && !canCheckOut && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg w-full">
                      <Clock className="w-6 h-6 text-gray-600" />
                      <p className="text-gray-600">Belum waktunya presensi</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shift Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                Jadwal Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaySchedule?.shift ? (
                <div>
                  <Badge
                    style={{ backgroundColor: todaySchedule.shift.nama === 'Pagi' ? '#3b82f6' :
                                          todaySchedule.shift.nama === 'Siang' ? '#f59e0b' : '#6366f1' }}
                    className="text-white"
                  >
                    {todaySchedule.shift.nama}
                  </Badge>
                  <div className="mt-3 space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-500">Masuk:</span>
                      <span className="font-medium">{todaySchedule.shift.jam_masuk}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Pulang:</span>
                      <span className="font-medium">{todaySchedule.shift.jam_pulang}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Tidak ada jadwal</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Hadir</p>
                  <p className="text-3xl font-bold text-green-600">{stats.total_hadir}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Terlambat</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.total_terlambat}</p>
                </div>
                <AlertCircle className="w-10 h-10 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Izin</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.total_izin}</p>
                </div>
                <Calendar className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance */}
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
                            month: 'short'
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {presensi.shift?.nama || 'Tanpa Shift'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {presensi.jam_masuk || '-'} - {presensi.jam_pulang || '-'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {presensi.work_hours ? `${presensi.work_hours} jam` : ''}
                        </p>
                      </div>
                      <Badge className={statusColors[presensi.status]}>
                        {statusLabels[presensi.status]}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Belum ada data presensi</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => router.get(route('izin.index'))}
          >
            <div className="flex flex-col items-center">
              <Calendar className="w-6 h-6 mb-2" />
              <span>Ajukan Izin / Cuti</span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => router.get(route('schedule.index'))}
          >
            <div className="flex flex-col items-center">
              <Clock className="w-6 h-6 mb-2" />
              <span>Lihat Jadwal</span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => {
              setCameraType('in');
              setShowCameraModal(true);
            }}
          >
            <div className="flex flex-col items-center">
              <Camera className="w-6 h-6 mb-2" />
              <span>Ambil Foto Selfie</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Check In Modal */}
      <Dialog open={showCheckInModal} onOpenChange={setShowCheckInModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Presensi Masuk</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Tekan tombol di bawah untuk melakukan presensi masuk.
              Pastikan Anda berada di lokasi yang benar.
            </p>
            {error && (
              <div className="space-y-2">
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
                <Button variant="outline" onClick={retryLocation} className="w-full">
                  <MapPin className="w-4 h-4 mr-2" />
                  Coba Lagi
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>
                {location
                  ? `Lokasi: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                  : !error ? 'Mendapatkan lokasi...' : ''
                }
              </span>
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleCheckIn}
              disabled={isLoading || !location}
            >
              {isLoading ? 'Menyimpan...' : 'Konfirmasi Presensi Masuk'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Check Out Modal */}
      <Dialog open={showCheckOutModal} onOpenChange={setShowCheckOutModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Presensi Pulang</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Tekan tombol di bawah untuk melakukan presensi pulang.
            </p>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>
                {location
                  ? `Lokasi: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                  : 'Mendapatkan lokasi...'
                }
              </span>
            </div>
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={handleCheckOut}
              disabled={isLoading || !location}
            >
              {isLoading ? 'Menyimpan...' : 'Konfirmasi Presensi Pulang'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera Modal with FaceCapture */}
      <Dialog open={showCameraModal} onOpenChange={setShowCameraModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ambil Foto Selfie</DialogTitle>
          </DialogHeader>
          <FaceCapture
            onCapture={(imageData) => {
              setCapturedImage(imageData);
              setShowCameraModal(false);
              alert('Foto berhasil diambil! Dalam implementasi penuh, foto akan disimpan ke server.');
            }}
            onClose={() => setShowCameraModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Face Verification Modal for Presensi */}
      <Dialog open={showFaceVerifyModal} onOpenChange={setShowFaceVerifyModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Verifikasi Wajah untuk Presensi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Silakan verifikasi wajah Anda untuk melakukan presensi.
              Kedipkan mata 2 kali untuk verifikasi liveness.
            </p>
            <FaceCapture
              onCapture={handleFaceVerified}
              onClose={() => {
                setShowFaceVerifyModal(false);
                setShowCheckInModal(true);
              }}
              mode="verify"
            />
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
