import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Shift {
  id: number;
  nama: string;
  jam_masuk: string;
  jam_pulang: string;
  jam_masuk_break: string | null;
  jam_selesai_break: string | null;
  warna: string;
  is_active: boolean;
}

interface Props {
  shifts: Shift[];
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Manajemen Shift', href: '/shifts' },
];

export default function ShiftsIndex({ shifts }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [form, setForm] = useState({
    nama: '',
    jam_masuk: '',
    jam_pulang: '',
    jam_masuk_break: '',
    jam_selesai_break: '',
    warna: '#3b82f6',
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingShift) {
      setForm({
        nama: editingShift.nama,
        jam_masuk: editingShift.jam_masuk.substring(0, 5),
        jam_pulang: editingShift.jam_pulang.substring(0, 5),
        jam_masuk_break: editingShift.jam_masuk_break?.substring(0, 5) || '',
        jam_selesai_break: editingShift.jam_selesai_break?.substring(0, 5) || '',
        warna: editingShift.warna,
        is_active: editingShift.is_active,
      });
    } else {
      resetForm();
    }
  }, [editingShift]);

  const resetForm = () => {
    setForm({
      nama: '',
      jam_masuk: '',
      jam_pulang: '',
      jam_masuk_break: '',
      jam_selesai_break: '',
      warna: '#3b82f6',
      is_active: true,
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    const url = editingShift ? `/shifts/${editingShift.id}` : '/shifts';
    const method = editingShift ? 'put' : 'post';

    try {
      await (router as any)[method](url, form, {
        onError: (err: Record<string, string>) => setErrors(err),
        onSuccess: () => {
          setShowModal(false);
          setEditingShift(null);
          resetForm();
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus shift ini?')) {
      await router.delete(`/shifts/${id}`);
    }
  };

  const openAddModal = () => {
    setEditingShift(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manajemen Shift" />
      <div className="flex flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Shift</h1>
            <p className="text-gray-500">Kelola jam kerja dan shift karyawan</p>
          </div>
          <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Shift
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Daftar Shift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shift</TableHead>
                  <TableHead>Jam Masuk</TableHead>
                  <TableHead>Jam Pulang</TableHead>
                  <TableHead>Jam Istirahat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.length > 0 ? (
                  shifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: shift.warna }}
                          />
                          <span className="font-medium">{shift.nama}</span>
                        </div>
                      </TableCell>
                      <TableCell>{shift.jam_masuk}</TableCell>
                      <TableCell>{shift.jam_pulang}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {shift.jam_masuk_break && shift.jam_selesai_break
                          ? `${shift.jam_masuk_break.substring(0, 5)} - ${shift.jam_selesai_break.substring(0, 5)}`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={shift.is_active ? 'default' : 'secondary'}>
                          {shift.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(shift)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(shift.id)}
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
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Belum ada shift</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingShift ? 'Edit Shift' : 'Tambah Shift Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nama Shift</label>
              <Input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Contoh: Pagi, Siang, Malam"
              />
              {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Jam Masuk</label>
                <Input
                  type="time"
                  value={form.jam_masuk}
                  onChange={(e) => setForm({ ...form, jam_masuk: e.target.value })}
                />
                {errors.jam_masuk && <p className="text-red-500 text-xs mt-1">{errors.jam_masuk}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Jam Pulang</label>
                <Input
                  type="time"
                  value={form.jam_pulang}
                  onChange={(e) => setForm({ ...form, jam_pulang: e.target.value })}
                />
                {errors.jam_pulang && <p className="text-red-500 text-xs mt-1">{errors.jam_pulang}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Mulai Istirahat</label>
                <Input
                  type="time"
                  value={form.jam_masuk_break}
                  onChange={(e) => setForm({ ...form, jam_masuk_break: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Selesai Istirahat</label>
                <Input
                  type="time"
                  value={form.jam_selesai_break}
                  onChange={(e) => setForm({ ...form, jam_selesai_break: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Warna</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.warna}
                  onChange={(e) => setForm({ ...form, warna: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  value={form.warna}
                  onChange={(e) => setForm({ ...form, warna: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingShift(null);
                resetForm();
              }}
            >
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : editingShift ? 'Perbarui' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
