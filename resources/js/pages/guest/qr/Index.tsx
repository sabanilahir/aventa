import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Download, RefreshCw, Users, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function QrIndex() {
  const { props } = usePage();
  const tamus = props.tamus || { data: [] };
  const acaraId = props.acaraId;
  const [generating, setGenerating] = useState(false);
  const [selectedTamu, setSelectedTamu] = useState(null);
  const [qrcodes, setQrcodes] = useState([]);
  const [loadingQr, setLoadingQr] = useState(false);

  const generateAll = () => {
    setGenerating(true);
    router.post("/qr/generate-all", { acara_id: acaraId }, {
      onFinish: () => setGenerating(false),
    });
  };

  const viewQrcodes = async (tamu) => {
    setSelectedTamu(tamu);
    setLoadingQr(true);
    
    try {
      const response = await fetch(`/qr/api/${tamu.id}`);
      const data = await response.json();
      setQrcodes(data.qrcodes || []);
    } catch (error) {
      console.error("Error fetching QR codes:", error);
    } finally {
      setLoadingQr(false);
    }
  };

  return (
    <AppLayout>
      <Head title="QR Code Management" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">QR Code Management</h1>
            <p className="text-gray-500">Generate dan download QR codes untuk tamu</p>
          </div>
          <Button onClick={generateAll} disabled={generating}>
            {generating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <QrCode className="w-4 h-4 mr-2" />
            )}
            Generate Semua QR
          </Button>
        </div>

        <div className="grid gap-4">
          {tamus.data.map((tamu) => (
            <Card key={tamu.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{tamu.nama}</p>
                      <p className="text-sm text-gray-500">
                        {tamu.no_telepon || "Tanpa No. HP"} | {tamu.jumlah_undangan || 4} Pax
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${tamu.status_hadir === "hadir" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {tamu.status_hadir === "hadir" ? "Hadir" : "Belum"}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => viewQrcodes(tamu)}>
                      <QrCode className="w-4 h-4 mr-2" />
                      Lihat QR
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tamus.data.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <QrCode className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Belum ada data tamu. Silakan tambah tamu terlebih dahulu.</p>
            </CardContent>
          </Card>
        )}

        {/* QR Modal */}
        {selectedTamu && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>QR Codes - {selectedTamu.nama}</span>
                  <Button variant="ghost" onClick={() => setSelectedTamu(null)}>X</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingQr ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2">Loading...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {qrcodes.map((qr) => (
                      <div key={qr.id} className="text-center p-4 border rounded-lg">
                        <img src={qr.qr_image} alt={`QR ${qr.qr_number}`} className="mx-auto" />
                        <p className="mt-2 font-semibold">QR #{qr.qr_number}</p>
                        <p className="text-xs text-gray-500 mb-2">
                          {qr.is_used ? "Sudah digunakan" : "Belum digunakan"}
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/qr/download/${selectedTamu.id}?qr=${qr.qr_number}`} download>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
