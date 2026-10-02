import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function EventCreate() {
  const [form, setForm] = useState({
    nama: "",
    tanggal: "",
    waktu_mulai: "",
    tempat: "",
    alamat: "",
    qr_per_keluarga: 4,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.nama.trim()) { alert("Nama event wajib diisi"); return; }
    setSaving(true);
    try {
      await router.post("/events", form, {
        onFinish: () => setSaving(false),
      });
    } catch (error) {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <Head title="Buat Event Baru" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.get("/events")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-2xl font-bold">Buat Event Baru</h1>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base">Nama Event *</Label>
                <Input className="mt-1 h-12 text-lg" value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} placeholder="Nama acara" />
              </div>

              <div>
                <Label className="text-base">Tanggal</Label>
                <Input type="date" className="mt-1 h-12" value={form.tanggal} onChange={(e) => setForm({...form, tanggal: e.target.value})} />
              </div>

              <div>
                <Label className="text-base">Waktu</Label>
                <Input type="time" className="mt-1 h-12" value={form.waktu_mulai} onChange={(e) => setForm({...form, waktu_mulai: e.target.value})} />
              </div>

              <div>
                <Label className="text-base">Tempat</Label>
                <Input className="mt-1 h-12" value={form.tempat} onChange={(e) => setForm({...form, tempat: e.target.value})} placeholder="Nama tempat" />
              </div>

              <div className="md:col-span-2">
                <Label className="text-base">Alamat</Label>
                <Input className="mt-1 h-12" value={form.alamat} onChange={(e) => setForm({...form, alamat: e.target.value})} placeholder="Alamat lengkap" />
              </div>

              <div>
                <Label className="text-base">QR per Keluarga</Label>
                <Input type="number" min="1" max="10" className="mt-1 h-12" value={form.qr_per_keluarga} onChange={(e) => setForm({...form, qr_per_keluarga: parseInt(e.target.value) || 4})} />
                <p className="text-sm text-gray-500 mt-1">Jumlah QR code per keluarga (default: 4)</p>
              </div>
            </div>

            <div className="flex gap-4 pt-8 justify-end border-t mt-8">
              <Button variant="outline" size="lg" onClick={() => router.get("/events")}>Batal</Button>
              <Button size="lg" onClick={handleSubmit} disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Event"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

