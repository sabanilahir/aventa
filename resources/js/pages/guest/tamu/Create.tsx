import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";

export default function GuestTamuCreate() {
  const { props } = usePage();
  const acara = props.acara || null;
  const pertanyaans = props.pertanyaans || [];

  const [form, setForm] = useState({
    acara_id: acara?.id || "",
    nama_depan: "",
    nama_belakang: "",
    nama_perusahaan: "",
    email: "",
    no_telepon: "",
    jumlah_undangan: 1,
    catatan: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = () => {
    if (!form.nama_depan.trim()) { alert("Nama wajib diisi"); return; }
    setSaving(true);
    router.post("/guest/tamu", form, {
      onFinish: () => setSaving(false),
    });
  };

  return (
    <AppLayout>
      <Head title="Tambah Tamu" />
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.get("/guest/tamu")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold">Tambah Tamu</h1>
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

