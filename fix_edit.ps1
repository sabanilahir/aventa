$content = @'
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function TrahEdit({ member }: { member: any }) {
  const [form, setForm] = useState({
    no_registrasi: member.no_registrasi || "",
    trah_tumerah: member.trah_tumerah || "",
    menya_menya: member.menya_menya || "",
    menyaman: member.menyaman || "",
    ampleng: member.ampleng || "",
    cumpleng: member.cumpleng || "",
    giyeng: member.giyeng || "",
    cendheng: member.cendheng || "",
    gropak_waton: member.gropak_waton || "",
    galih_asem: member.galih_asem || "",
    debok_bosok: member.debok_bosok || "",
    gropak_senthe: member.gropak_senthe || "",
    gantung_siwur: member.gantung_siwur || "",
    udheg_udheg: member.udheg_udheg || "",
    wareng: member.wareng || "",
    canggah: member.canggah || "",
    buyut: member.buyut || "",
    simbah_eyang: member.simbah_eyang || "",
    bapak_ibu: member.bapak_ibu || "",
    nama_anda: member.nama_anda || "",
    tempat_tanggal_lahir: member.tempat_tanggal_lahir || "",
    alamat: member.alamat || "",
    profesi_pekerjaan: member.profesi_pekerjaan || "",
    no_telephone: member.no_telephone || "",
    email: member.email || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    data.append("_method", "PUT");
    router.post(`/trah-members/${member.id}`, data, {
      onError: (err) => { setErrors(err); setLoading(false); },
      onSuccess: () => { setLoading(false); },
    });
  };

  const silsilahFields = [
    ["no_registrasi", "No. Registrasi"],
    ["trah_tumerah", "Trah Tumerah"],
    ["menya_menya", "Menya-Menya"],
    ["menyaman", "Menyaman"],
    ["ampleng", "Ampleng"],
    ["cumpleng", "Cumpleng"],
    ["giyeng", "Giyeng"],
    ["cendheng", "Cendheng"],
    ["gropak_waton", "Gropak Waton"],
    ["galih_asem", "Galih Asem"],
    ["debok_bosok", "Debok Bosok"],
    ["gropak_senthe", "Gropak Senthe"],
    ["gantung_siwur", "Gantung Siwur"],
    ["udheg_udheg", "Udheg-Udheg"],
    ["wareng", "Wareng"],
    ["canggah", "Canggah"],
    ["buyut", "Buyut"],
    ["simbah_eyang", "Simbah Eyang"],
    ["bapak_ibu", "Bapak/Ibu"],
  ];

  const dataDiriFields = [
    ["nama_anda", "Nama Anda"],
    ["tempat_tanggal_lahir", "Tempat, Tanggal Lahir"],
    ["alamat", "Alamat"],
    ["profesi_pekerjaan", "Profesi/Pekerjaan"],
    ["no_telephone", "No. Telepon"],
    ["email", "Email"],
  ];

  return (
    <AppLayout>
      <Head title="Edit Anggota Trah" />
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Edit Anggota Trah</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Garis Silsilah</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {silsilahFields.map(([name, label]) => (
                <div key={name}>
                  <Label htmlFor={name}>{label}</Label>
                  <Input id={name} name={name} value={(form as any)[name]} onChange={handleChange} />
                  {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Identitas Diri</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {dataDiriFields.map(([name, label]) => (
                <div key={name}>
                  <Label htmlFor={name}>{label}</Label>
                  <Input id={name} name={name} value={(form as any)[name]} onChange={handleChange} />
                  {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
            <Button type="button" variant="outline" onClick={() => router.get("/trah-members")}>Batal</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
'@
Set-Content -Path "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\resources\js\Pages\trah\Edit.tsx" -Value $content
Write-Host "Edit.tsx done"