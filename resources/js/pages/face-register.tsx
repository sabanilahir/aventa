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
import { Camera, CheckCircle, XCircle, User, Trash2 } from 'lucide-react';
import FaceCapture from '@/components/FaceCapture';

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Registrasi Wajah', href: '/face-register' },
];

export default function FaceRegister() {
  const { auth, faceStatus } = usePage().props as any;
  const [isRegistered, setIsRegistered] = useState(faceStatus?.registered || false);
  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCapture = async (imageData: string, descriptor?: number[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/face-api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          face_photo: imageData,
          face_descriptor: descriptor ? JSON.stringify(descriptor) : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsRegistered(true);
        setShowCamera(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(data.message || 'Gagal menyimpan data wajah');
      }
    } catch (error) {
      console.error('Error registering face:', error);
      alert('Terjadi kesalahan saat menyimpan data wajah');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus data wajah?')) return;

    try {
      const response = await fetch('/api/face/delete', {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setIsRegistered(false);
      } else {
        alert(data.message || 'Gagal menghapus data wajah');
      }
    } catch (error) {
      console.error('Error deleting face:', error);
      alert('Terjadi kesalahan saat menghapus data wajah');
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Registrasi Wajah" />
      <div className="flex flex-col gap-6 p-4">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Registrasi Wajah</h1>
                <p className="text-purple-100">
                  Daftarkan wajah Anda untuk verifikasi presensi
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        {success && (
          <Card className="border-green-500 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span>Wajah berhasil didaftarkan!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Status Wajah
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isRegistered ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-800">Wajah Terdaftar</p>
                    <p className="text-sm text-green-600">
                      Wajah Anda sudah terdaftar dalam sistem
                    </p>
                  </div>
                  <Badge className="bg-green-600">Aktif</Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCamera(true)}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Update Foto Wajah
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                  <XCircle className="w-8 h-8 text-yellow-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-800">Wajah Belum Terdaftar</p>
                    <p className="text-sm text-yellow-600">
                      Daftarkan wajah Anda untuk meningkatkan keamanan presensi
                    </p>
                  </div>
                  <Badge className="bg-yellow-600">Belum Aktif</Badge>
                </div>

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowCamera(true)}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Daftar Wajah Sekarang
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Petunjuk Registrasi</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="font-bold text-purple-600">1.</span>
                Klik tombol "Daftar Wajah Sekarang" untuk membuka kamera
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-purple-600">2.</span>
                Pastikan wajah Anda terlihat jelas di dalam frame
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-purple-600">3.</span>
                Kedipkan mata 2 kali untuk verifikasi liveness
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-purple-600">4.</span>
                Klik "Ambil Foto" setelah wajah terverifikasi
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Keuntungan Registrasi Wajah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🔒 Keamanan Lebih Tinggi</h4>
                <p className="text-sm text-blue-600">
                  Wajah Anda digunakan untuk memverifikasi kehadiran asli saat presensi
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ Anti Spam</h4>
                <p className="text-sm text-green-600">
                  Deteksi liveness memastikan presensi dilakukan oleh orang asli, bukan foto
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Camera Dialog */}
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isRegistered ? 'Update Foto Wajah' : 'Daftar Foto Wajah'}
            </DialogTitle>
          </DialogHeader>
          <FaceCapture
            onCapture={handleCapture}
            onClose={() => setShowCamera(false)}
            mode="register"
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
