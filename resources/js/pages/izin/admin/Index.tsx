import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Calendar,
  User,
  Filter
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Izin {
  id: number;
  user_id: number;
  user: User;
  tipe: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  alasan: string;
  status: string;
  approved_by: number | null;
  approved_at: string | null;
  catatan_approval: string | null;
  created_at: string;
  total_days: number;
}

interface Props {
  izins: {
    data: Izin[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  users: User[];
  filters: {
    status?: string;
    user_id?: string;
    start_date?: string;
    end_date?: string;
  };
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Approval Izin', href: '/izin/admin' },
];

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pending',
    icon: <Clock className="w-4 h-4" />
  },
  approved: {
    color: 'bg-green-100 text-green-800',
    label: 'Disetujui',
    icon: <CheckCircle className="w-4 h-4" />
  },
  rejected: {
    color: 'bg-red-100 text-red-800',
    label: 'Ditolak',
    icon: <XCircle className="w-4 h-4" />
  },
};

const tipeLabels: Record<string, string> = {
  izin: 'Izin',
  cuti: 'Cuti',
  sakit: 'Sakit',
  dinas: 'Dinas Luar',
};

export default function ApprovalIzinIndex({ izins, users, filters }: Props) {
  const [filterStatus, setFilterStatus] = useState(filters.status || '');
  const [filterUser, setFilterUser] = useState(filters.user_id || '');
  const [selectedIzin, setSelectedIzin] = useState<Izin | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [catatan, setCatatan] = useState('');

  const applyFilters = () => {
    const params: Record<string, string> = {};
    if (filterStatus) params.status = filterStatus;
    if (filterUser) params.user_id = filterUser;
    router.get(route('izin.admin.index'), params, { preserveState: true });
  };

  const handleAction = (izin: Izin, type: 'approve' | 'reject') => {
    setSelectedIzin(izin);
    setActionType(type);
    setCatatan('');
  };

  const submitAction = () => {
    if (!selectedIzin || !actionType) return;

    const routeName = actionType === 'approve' ? 'izin.approve' : 'izin.reject';

    router.put(route(routeName, selectedIzin.id), {
      catatan_approval: catatan,
    }, {
      onSuccess: () => {
        setSelectedIzin(null);
        setActionType(null);
        setCatatan('');
      },
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const pendingCount = izins.data.filter(i => i.status === 'pending').length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Approval Izin" />

      <div className="flex flex-col gap-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Approval Izin</h1>
            <p className="text-gray-500">Kelola pengajuan izin dan cuti karyawan</p>
          </div>
          {pendingCount > 0 && (
            <Badge variant="destructive" className="text-sm px-3 py-1">
              {pendingCount} menunggu persetujuan
            </Badge>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-md px-3 py-2 min-w-[150px]"
                >
                  <option value="">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Karyawan</Label>
                <select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="border rounded-md px-3 py-2 min-w-[200px]"
                >
                  <option value="">Semua Karyawan</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button onClick={applyFilters} className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Daftar Pengajuan Izin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Karyawan</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Alasan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Pengajuan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {izins.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Tidak ada data pengajuan izin
                    </TableCell>
                  </TableRow>
                ) : (
                  izins.data.map((izin, index) => {
                    const status = statusConfig[izin.status] || statusConfig.pending;
                    return (
                      <TableRow key={izin.id}>
                        <TableCell>{index + 1 + (izins.current_page - 1) * izins.per_page}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium">{izin.user?.name || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{izin.user?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tipeLabels[izin.tipe] || izin.tipe}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(izin.tanggal_mulai)}</span>
                            <span className="mx-1">-</span>
                            <span>{formatDate(izin.tanggal_selesai)}</span>
                            <Badge variant="secondary" className="ml-2">{izin.total_days} hari</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="truncate text-sm" title={izin.alasan}>
                            {izin.alasan}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${status.color} flex items-center gap-1 w-fit`}>
                            {status.icon}
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(izin.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {izin.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleAction(izin, 'approve')}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Setujui
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleAction(izin, 'reject')}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Tolak
                              </Button>
                            </div>
                          )}
                          {izin.status !== 'pending' && (
                            <span className="text-sm text-gray-400">
                              {izin.approved_at && `Diproses: ${new Date(izin.approved_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {izins.last_page > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Menampilkan {izins.data.length} dari {izins.total} data
                </p>
                <div className="flex gap-2">
                  {izins.current_page > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.get(route('izin.admin.index', { page: izins.current_page - 1 }))}
                    >
                      Previous
                    </Button>
                  )}
                  {izins.current_page < izins.last_page && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.get(route('izin.admin.index', { page: izins.current_page + 1 }))}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedIzin} onOpenChange={() => setSelectedIzin(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Setujui' : 'Tolak'} Pengajuan Izin
            </DialogTitle>
            <DialogDescription>
              {selectedIzin && (
                <>
                  Pengajuan dari <strong>{selectedIzin.user?.name}</strong> untuk izin{' '}
                  <strong>{tipeLabels[selectedIzin.tipe]}</strong> pada tanggal{' '}
                  {formatDate(selectedIzin.tanggal_mulai)} - {formatDate(selectedIzin.tanggal_selesai)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="catatan">Catatan (Opsional)</Label>
            <Textarea
              id="catatan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder={actionType === 'approve'
                ? 'Tambahkan catatan persetujuan...'
                : 'Alasan penolakan...'}
              className="mt-2"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedIzin(null)}>
              Batal
            </Button>
            <Button
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={submitAction}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {actionType === 'approve' ? 'Setujui' : 'Tolak'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
