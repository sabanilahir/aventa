import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function WeddingCreate() {
  const [form, setForm] = useState({
    nama: "",
    tanggal: "",
    waktu_mulai: "",
    tempat: "",
    alamat: "",
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
    
    router.post("/weddings", form, {
      onError: (err) => {
        setErrors(err);
        setLoading(false);
      },
      onSuccess: () => {
        setLoading(false);
      },
    });
  };

  const formFields = [
    { name: "nama", label: "Nama Acara", type: "text", placeholder: "Masukkan nama acara", required: true },
    { name: "tanggal", label: "Tanggal", type: "date", placeholder: "", required: true },
    { name: "waktu_mulai", label: "Waktu Mulai", type: "time", placeholder: "", required: true },
    { name: "tempat", label: "Tempat", type: "text", placeholder: "Masukkan nama tempat", required: false },
    { name: "alamat", label: "Alamat", type: "text", placeholder: "Masukkan alamat lengkap", required: false },
  ];

  return (
    <AppLayout>
      <Head title="Buat Undangan Baru" />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/weddings">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Buat Undangan Baru</h1>
            <p className="text-gray-500">Buat undangan pernikahan baru</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Detail Acara</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {formFields.map(({ name, label, type, placeholder, required }) => (
                  <div key={name}>
                    <Label htmlFor={name} className="mb-2 block">
                      {label} {required && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id={name}
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      value={(form as any)[name]}
                      onChange={handleChange}
                      className={errors[name] ? 'border-red-500' : ''}
                    />
                    {errors[name] && (
                      <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Link href="/weddings" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Batal
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  {loading ? "Menyimpan..." : "Buat Undangan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}