import { useRef } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const DEFAULT_COLOR = '#0ea5e9';

export default function GuestSetting({ setting }: { setting: any }) {
  const { data, setData, post, processing, errors } = useForm({
    nama_app: setting?.nama_app || 'Guest Management',
    deskripsi: setting?.deskripsi || '',
    warna: setting?.warna || DEFAULT_COLOR,
    logo: null as File | null,
    favicon: null as File | null,
  });

  const logoRef = useRef<string | null>(setting?.logo ? `/storage/${setting.logo}` : null);
  const faviconRef = useRef<string | null>(setting?.favicon ? `/storage/${setting.favicon}` : null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/guest-settings', { forceFormData: true, preserveScroll: true });
  };

  return (
    <AppLayout>
      <Head title="Pengaturan Aplikasi" />
      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Pengaturan Aplikasi</CardTitle>
            <p className="text-gray-500 text-sm">Upload icon, logo, dan nama aplikasi</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Nama Aplikasi */}
              <div className="space-y-2">
                <Label htmlFor="nama_app">Nama Aplikasi</Label>
                <Input
                  id="nama_app"
                  value={data.nama_app}
                  onChange={(e) => setData('nama_app', e.target.value)}
                  placeholder="Masukkan nama aplikasi"
                />
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <textarea
                  id="deskripsi"
                  value={data.deskripsi}
                  onChange={(e) => setData('deskripsi', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 min-h-[80px]"
                  placeholder="Deskripsi aplikasi"
                />
              </div>

              {/* Header Color */}
              <div className="space-y-2">
                <Label htmlFor="warna">Warna Header</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={data.warna}
                    onChange={(e) => setData('warna', e.target.value)}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input
                    value={data.warna}
                    onChange={(e) => setData('warna', e.target.value)}
                    className="w-32"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => setData('warna', DEFAULT_COLOR)}>
                    Reset
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label htmlFor="logo">Logo Aplikasi (Max 2MB)</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setData('logo', file);
                    if (file) logoRef.current = URL.createObjectURL(file);
                  }}
                />
                {logoRef.current && (
                  <div className="mt-2">
                    <img src={logoRef.current} alt="Preview Logo" className="h-20 rounded-lg border" />
                  </div>
                )}
                {setting?.logo && !data.logo && (
                  <p className="text-sm text-gray-500">Logo saat ini:</p>
                )}
                {setting?.logo && !data.logo && (
                  <img src={`/storage/${setting.logo}`} alt="Current Logo" className="h-16 mt-1" />
                )}
              </div>

              {/* Favicon Upload */}
              <div className="space-y-2">
                <Label htmlFor="favicon">Icon (Favicon) (Max 1MB)</Label>
                <Input
                  id="favicon"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setData('favicon', file);
                    if (file) faviconRef.current = URL.createObjectURL(file);
                  }}
                />
                {faviconRef.current && (
                  <div className="mt-2">
                    <img src={faviconRef.current} alt="Preview Icon" className="h-12 w-12 rounded border" />
                  </div>
                )}
                {setting?.favicon && !data.favicon && (
                  <p className="text-sm text-gray-500">Icon saat ini:</p>
                )}
                {setting?.favicon && !data.favicon && (
                  <img src={`/storage/${setting.favicon}`} alt="Current Icon" className="h-10 mt-1" />
                )}
              </div>

              <Separator />

              {/* Submit */}
              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
