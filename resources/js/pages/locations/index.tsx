import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Search,
  Building
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Location {
  id: number;
  nama: string;
  alamat: string;
  latitude: number;
  longitude: number;
  radius: number;
  is_active: boolean;
  created_at: string;
}

interface Props {
  locations: {
    data: Location[];
    links: Array<{ url: string; label: string; active: boolean }>;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Lokasi', href: '/locations' },
];

export default function LocationIndex({ locations }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [form, setForm] = useState({
    nama: '',
    alamat: '',
    latitude: '',
    longitude: '',
    radius: '100',
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredLocations = locations.data.filter(location => {
    const matchesSearch =
      location.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && location.is_active) ||
      (statusFilter === 'inactive' && !location.is_active);
    return matchesSearch && matchesStatus;
  });

  const activeCount = locations.data.filter(l => l.is_active).length;
  const inactiveCount = locations.data.filter(l => !l.is_active).length;

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    const url = editingLocation ? `/locations/${editingLocation.id}` : '/locations';
    const method = editingLocation ? 'put' : 'post';

    try {
      await (router as any)[method](url, form, {
        onError: (err: Record<string, string>) => setErrors(err),
        onSuccess: () => {
          setShowModal(false);
          setEditingLocation(null);
          resetForm();
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setForm({
      nama: location.nama,
      alamat: location.alamat,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      radius: location.radius.toString(),
      is_active: location.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) {
      await router.delete(`/locations/${id}`);
    }
  };

  const resetForm = () => {
    setForm({
      nama: '',
      alamat: '',
      latitude: '',
      longitude: '',
      radius: '100',
      is_active: true,
    });
    setErrors({});
  };

  const openAddModal = () => {
    setEditingLocation(null);
    resetForm();
    setShowModal(true);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm({
            ...form,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        () => {
          alert('Tidak dapat mendapatkan lokasi');
        }
      );
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manajemen Lokasi" />
      <div className="flex flex-col gap-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Lokasi</h1>
            <p className="text-gray-500">Kelola lokasi kantor dan area presensi GPS</p>
          </div>
          <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Lokasi
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Cari lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              Semua ({locations.data.length})
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('active')}
              className="text-green-600"
            >
              Aktif ({activeCount})
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('inactive')}
              className="text-gray-600"
            >
              Nonaktif ({inactiveCount})
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Daftar Lokasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Koordinat</TableHead>
                  <TableHead>Radius</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{location.nama}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{location.alamat}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </TableCell>
                      <TableCell>{location.radius}m</TableCell>
                      <TableCell>
                        <Badge variant={location.is_active ? 'default' : 'secondary'}>
                          {location.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(location)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(location.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Belum ada lokasi</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {locations.data.length > 0 && locations.links.length > 3 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {locations.links.map((link, index) => (
                  <Button
                    key={index}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => link.url && router.get(link.url)}
                    disabled={!link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingLocation ? 'Edit Lokasi' : 'Tambah Lokasi Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nama Lokasi</label>
              <Input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Contoh: Kantor Pusat"
              />
              {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Alamat</label>
              <Input
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                placeholder="Contoh: Jl. Sudirman No. 123"
              />
              {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Latitude</label>
                <Input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                  placeholder="-6.200000"
                />
                {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Longitude</label>
                <Input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                  placeholder="106.800000"
                />
                {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
              </div>
            </div>

            <Button variant="outline" onClick={getCurrentLocation} className="w-full">
              <MapPin className="w-4 h-4 mr-2" />
              Gunakan Lokasi Saat Ini
            </Button>

            <div>
              <label className="text-sm font-medium mb-1 block">Radius (meter)</label>
              <Input
                type="number"
                value={form.radius}
                onChange={(e) => setForm({ ...form, radius: e.target.value })}
                placeholder="100"
              />
              <p className="text-xs text-gray-500 mt-1">Jarak maksimal untuk presensi GPS</p>
              {errors.radius && <p className="text-red-500 text-xs mt-1">{errors.radius}</p>}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Status Aktif</label>
                <p className="text-xs text-gray-500">Lokasi dapat digunakan untuk presensi</p>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked: boolean) => setForm({ ...form, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : editingLocation ? 'Perbarui' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
