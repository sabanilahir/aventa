import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, LoaderCircle, CalendarDays } from "lucide-react";
import { toast } from "sonner";

export default function EventEdit() {
  const { props } = usePage();
  const acara = (props.acara as any) || {};

  const [form, setForm] = useState({
    nama: acara.nama || "",
    tanggal: acara.tanggal ? acara.tanggal.split("T")[0] : "",
    waktu_mulai: acara.waktu_mulai || "",
    tempat: acara.tempat || "",
    alamat: acara.alamat || "",
    qr_per_keluarga: acara.qr_per_keluarga || 4,
    status: acara.status || "draft",
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.nama.trim()) { alert("Nama event wajib diisi"); return; }
    setSaving(true);
    try {
      await router.put(`/events/${acara.id}`, form, {
        onSuccess: () => { toast.success("Event berhasil diperbarui!"); },
        onError: () => { toast.error("Gagal memperbarui event."); },
        onFinish: () => setSaving(false),
      });
    } catch (error) {
      setSaving(false);
      toast.error("Terjadi kesalahan sistem.");
    }
  };

  return (
    <AppLayout>
      <Head title={`Edit Event - ${acara.nama || ""}`} />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.get("/events")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Event</h1>
              <p className="text-sm text-gray-500">{acara.nama}</p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
            {saving ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-600" />
                Informasi Event
              </CardTitle>
              <CardDescription>Perbarui detail acara Anda</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-semibold">Nama Event *</Label>
                  <Input className="mt-1 h-12 text-lg" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama acara" />
                </div>
                <div>
                  <Label className="text-base font-semibold">Status</Label>
                  <select className="mt-1 h-12 w-full rounded-md border border-input bg-background px-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <Label className="text-base font-semibold">Tanggal</Label>
                  <Input type="date" className="mt-1 h-12" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
                </div>
                <div>
                  <Label className="text-base font-semibold">Waktu</Label>
                  <Input type="time" className="mt-1 h-12" value={form.waktu_mulai} onChange={(e) => setForm({ ...form, waktu_mulai: e.target.value })} />
                </div>
                <div>
                  <Label className="text-base font-semibold">Tempat</Label>
                  <Input className="mt-1 h-12" value={form.tempat} onChange={(e) => setForm({ ...form, tempat: e.target.value })} placeholder="Nama tempat" />
                </div>
                <div>
                  <Label className="text-base font-semibold">QR per Keluarga</Label>
                  <Input type="number" min="1" max="10" className="mt-1 h-12" value={form.qr_per_keluarga} onChange={(e) => setForm({ ...form, qr_per_keluarga: parseInt(e.target.value) || 4 })} />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-base font-semibold">Alamat</Label>
                  <Input className="mt-1 h-12" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} placeholder="Alamat lengkap" />
                </div>
              </div>
              <div className="flex gap-4 pt-6 border-t justify-end">
                <Button variant="outline" type="button" onClick={() => router.get("/events")}>Batal</Button>
                <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
                  {saving ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}

