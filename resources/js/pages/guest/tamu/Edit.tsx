import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";

export default function GuestTamuEdit() {
  const { props } = usePage();
  const tamu = props.tamu || {};
  const pertanyaans = props.pertanyaans || [];

  // Parse nama to get first and last name
  const getNamaParts = (fullName) => {
    const parts = (fullName || "").split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    return { nama_depan: firstName, nama_belakang: lastName };
  };

  const initialNames = getNamaParts(tamu.nama);

  const [form, setForm] = useState({
    nama_depan: tamu.nama_depan || initialNames.nama_depan || "",
    nama_belakang: tamu.nama_belakang || initialNames.nama_belakang || "",
    nama_perusahaan: tamu.nama_perusahaan || "",
    email: tamu.email || "",
    no_telepon: tamu.no_telepon || "",
    jumlah_undangan: tamu.jumlah_undangan || 1,
    catatan: tamu.catatan || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = () => {
    if (!form.nama_depan.trim()) { alert("Nama wajib diisi"); return; }
    setSaving(true);
    router.put(`/guest/tamu/${tamu.id}`, form, {
      onFinish: () => setSaving(false),
    });
  };

  return (
    <AppLayout>
      <Head title="Edit Tamu" />
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.get("/guest/tamu")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold">Edit Tamu</h1>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Nama Depan *</Label><Input value={form.nama_depan} onChange={(e) => setForm({...form, nama_depan: e.target.value})} placeholder="Nama Depan" /></div>
              <div><Label>Nama Belakang</Label><Input value={form.nama_belakang} onChange={(e) => setForm({...form, nama_belakang: e.target.value})} placeholder="Nama Belakang" /></div>
            </div>
            <div><Label>Nama Perusahaan</Label><Input value={form.nama_perusahaan} onChange={(e) => setForm({...form, nama_perusahaan: e.target.value})} placeholder="Nama Perusahaan" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="email@domain.com" /></div>
              <div><Label>Nomor WA</Label><Input value={form.no_telepon} onChange={(e) => setForm({...form, no_telepon: e.target.value})} placeholder="08xxxxxxxxxx" /></div>
            </div>
            <div><Label>Jumlah Undangan</Label><Input type="number" min="1" value={form.jumlah_undangan} onChange={(e) => setForm({...form, jumlah_undangan: parseInt(e.target.value) || 1})} /></div>
            <div><Label>Catatan</Label><Input value={form.catatan} onChange={(e) => setForm({...form, catatan: e.target.value})} placeholder="Catatan" /></div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => router.get("/guest/tamu")}>Batal</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

