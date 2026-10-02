import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Calendar, FileText, Clock } from 'lucide-react';
import { useState } from 'react';

interface Izin {
  id: number;
  tipe: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  alasan: string;
  status: string;
  created_at: string;
}

interface Props {
  izins: {
    data: Izin[];
    links: Array<{ url: string; label: string; active: boolean }>;
  };
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Izin & Cuti', href: '/izin' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const tipeLabels: Record<string, string> = {
  izin: 'Izin',
  cuti: 'Cuti',
  sakit: 'Sakit',
  dinas: 'Dinas Luar',
};

export default function IzinIndex({ izins }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    tipe: 'izin',
    tanggal_mulai: '',
    tanggal_selesai: '',
    alasan: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      await router.post('/izin', form, {
        onError: (err) => {
          setErrors(err);
        },
        onSuccess: () => {
          setShowModal(false);
          setForm({ tipe: 'izin', tanggal_mulai: '', tanggal_selesai: '', alasan: '' });
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin membatalkan permohonan ini?')) {
      await router.delete(`/izin/${id}/cancel`);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Izin & Cuti" />
      <div className="flex flex-col gap-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Izin & Cuti</h1>
            <p className="text-gray-500">Ajukan permohonan izin atau cuti</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Ajukan Izin
          </Button>
        </div>

        {/* List Izin */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Riwayat Permohonan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal Pengajuan</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Alasan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {izins.data.length > 0 ? (
                  izins.data.map((izin) => (
                    <TableRow key={izin.id}>
                      <TableCell className="text-sm">
                        {new Date(izin.created_at).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tipeLabels[izin.tipe]}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(izin.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} -
                        {new Date(izin.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{izin.alasan}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[izin.status]}>
                          {izin.status === 'pending' ? 'Menunggu' :
                           izin.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {izin.status === 'pending' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancel(izin.id)}
                          >
                            Batalkan
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Belum ada permohonan izin</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {izins.data.length > 0 && izins.links.length > 3 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {izins.links.map((link, index) => (
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

      {/* Modal Tambah Izin */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajukan Permohonan Izin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tipe Izin</label>
              <Select
                value={form.tipe}
                onValueChange={(value) => setForm({ ...form, tipe: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="izin">Izin</SelectItem>
                  <SelectItem value="cuti">Cuti</SelectItem>
                  <SelectItem value="sakit">Sakit</SelectItem>
                  <SelectItem value="dinas">Dinas Luar</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipe && <p className="text-red-500 text-xs mt-1">{errors.tipe}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tanggal Mulai</label>
                <Input
                  type="date"
                  value={form.tanggal_mulai}
                  onChange={(e) => setForm({ ...form, tanggal_mulai: e.target.value })}
                />
                {errors.tanggal_mulai && (
                  <p className="text-red-500 text-xs mt-1">{errors.tanggal_mulai}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tanggal Selesai</label>
                <Input
                  type="date"
                  value={form.tanggal_selesai}
                  onChange={(e) => setForm({ ...form, tanggal_selesai: e.target.value })}
                />
                {errors.tanggal_selesai && (
                  <p className="text-red-500 text-xs mt-1">{errors.tanggal_selesai}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Alasan</label>
              <textarea
                className="w-full p-3 border rounded-md min-h-[100px]"
                value={form.alasan}
                onChange={(e) => setForm({ ...form, alasan: e.target.value })}
                placeholder="Jelaskan alasan permohonan izin..."
              />
              {errors.alasan && <p className="text-red-500 text-xs mt-1">{errors.alasan}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Mengirim...' : 'Ajukan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
