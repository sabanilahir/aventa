import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Users, CheckCircle, Clock, ArrowLeft, Building, Upload } from "lucide-react";
import { useState } from "react";

// Definisikan tipe data props agar aman di TypeScript
interface PageProps {
  tamu?: any[];
  acara?: any;
  acaras?: any[];
  [key: string]: any;
}

export default function GuestTamuIndex() {
  const { props } = usePage<PageProps>();
  const tamuList = props.tamu || [];
  const acara = props.acara || null;
  const acaras = props.acaras || [];

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTamu, setEditingTamu] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nama_depan: "",
    nama_belakang: "",
    nama_perusahaan: "",
    email: "",
    no_telepon: "",
    jumlah_undangan: 1,
    catatan: "",
  });

  const filteredTamu = tamuList.filter((t: any) =>
    t.nama?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingTamu(null);
    setForm({
      nama_depan: "", nama_belakang: "", nama_perusahaan: "",
      email: "", no_telepon: "", jumlah_undangan: 1, catatan: ""
    });
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    const parts = (item.nama || "").split(" ");
    setEditingTamu(item);
    setForm({
      nama_depan: item.nama_depan || parts[0] || "",
      nama_belakang: item.nama_belakang || parts.slice(1).join(" ") || "",
      nama_perusahaan: item.nama_perusahaan || "",
      email: item.email || "",
      no_telepon: item.no_telepon || "",
      jumlah_undangan: item.jumlah_undangan || 1,
      catatan: item.catatan || "",
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.nama_depan.trim()) {
      alert("Nama Depan wajib diisi");
      return;
    }
    setSaving(true);

    if (editingTamu) {
      router.put(`/guest/tamu/${editingTamu.id}`, form, {
        onSuccess: () => { setShowModal(false); setSaving(false); },
        onError: () => setSaving(false),
      });
    } else {
      router.post("/guest/tamu", form, {
        onSuccess: () => { setShowModal(false); setSaving(false); },
        onError: () => setSaving(false),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus tamu ini?")) {
      router.delete(`/guest/tamu/${id}`);
    }
  };

  const changeEvent = (id: number) => {
    router.get(`/guest/tamu?acara_id=${id}`);
  };

  const total = filteredTamu.length;
  const hadir = filteredTamu.filter((t: any) => t.status_hadir === "hadir").length;

  return (
    <AppLayout>
      <Head title="Kelola Tamu" />
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.get("/events")}>
              <ArrowLeft className="w-4 h-4 mr-2" />Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Kelola Tamu</h1>
              <p className="text-sm text-gray-500">{acara?.nama || "Pilih Event"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.get("/guest/tamu/import")}>
              <Upload className="w-4 h-4 mr-2" />Import CSV
            </Button>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />Tambah Tamu
            </Button>
          </div>
        </div>

        {/* Event Selector Tabs */}
        {acaras.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {acaras.map((a: any) => (
              <button
                key={a.id}
                onClick={() => changeEvent(a.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  acara?.id === a.id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {a.nama}
              </button>
            ))}
          </div>
        )}

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-sm text-gray-500">Total Tamu</p>
          </CardContent></Card>

          <Card><CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">{hadir}</p>
            <p className="text-sm text-gray-500">Sudah Hadir</p>
          </CardContent></Card>

          <Card><CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-bold">{total - hadir}</p>
            <p className="text-sm text-gray-500">Belum Hadir</p>
          </CardContent></Card>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Cari nama tamu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table Section */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Perusahaan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kontak</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Jumlah</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTamu.map((t: any) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{t.nama}</div>
                      <div className="text-xs text-gray-500">{t.nama_depan} {t.nama_belakang}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{t.nama_perusahaan || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{t.email || "-"}</div>
                      <div className="text-xs text-gray-500">{t.no_telepon || "-"}</div>
                    </td>
                    <td className="px-4 py-3 text-center">{t.jumlah_undangan || 1}</td>
                    <td className="px-4 py-3 text-center">
                      {t.status_hadir === "hadir" ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Hadir</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Belum</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => openEdit(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTamu.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Tidak ada tamu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">{editingTamu ? "Edit Tamu" : "Tambah Tamu"}</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nama Depan *</Label>
                      <Input value={form.nama_depan} onChange={(e) => setForm({...form, nama_depan: e.target.value})} placeholder="Nama Depan" />
                    </div>
                    <div>
                      <Label>Nama Belakang</Label>
                      <Input value={form.nama_belakang} onChange={(e) => setForm({...form, nama_belakang: e.target.value})} placeholder="Nama Belakang" />
                    </div>
                  </div>
                  <div>
                    <Label>Perusahaan</Label>
                    <Input value={form.nama_perusahaan} onChange={(e) => setForm({...form, nama_perusahaan: e.target.value})} placeholder="Nama Perusahaan" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Email</Label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="email@domain.com" />
                    </div>
                    <div>
                      <Label>No. WA</Label>
                      <Input value={form.no_telepon} onChange={(e) => setForm({...form, no_telepon: e.target.value})} placeholder="08xxxxxxxxxx" />
                    </div>
                  </div>
                  <div>
                    <Label>Jumlah Undangan</Label>
                    <Input type="number" min="1" value={form.jumlah_undangan} onChange={(e) => setForm({...form, jumlah_undangan: parseInt(e.target.value) || 1})} />
                  </div>
                  <div>
                    <Label>Catatan</Label>
                    <Input value={form.catatan} onChange={(e) => setForm({...form, catatan: e.target.value})} placeholder="Catatan" />
                  </div>
                </div>
                <div className="flex gap-4 mt-6 justify-end">
                  <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                  <Button onClick={handleSubmit} disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
