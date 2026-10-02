import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Settings, Zap, CheckCircle2, RefreshCw, AlertCircle, Phone, Key, ExternalLink, ShieldCheck, Send } from "lucide-react";
import { toast } from "sonner";

export default function WaSettingsIndex({ waSetting }: any) {
  const [form, setForm] = useState({
    api_token: waSetting?.api_token || "",
    sender_number: waSetting?.sender_number || "",
    device_id: waSetting?.device_id || "",
    webhook_url: waSetting?.webhook_url || "",
    is_active: waSetting?.is_active || false,
    is_test_mode: waSetting?.is_test_mode ?? true,
    rate_limit_per_second: waSetting?.rate_limit_per_second || 1,
    retry_attempts: waSetting?.retry_attempts || 3,
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form Test Send
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("Halo, ini adalah pesan ujicoba dari sistem.");
  const [sendingTest, setSendingTest] = useState(false);

  const handleTestConnection = async () => {
    if (!form.api_token) {
      toast.error("API Token harus diisi terlebih dahulu");
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch("/wa-settings/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({ api_token: form.api_token }),
      });
      const data = await response.json();
      setTestResult({ success: data.success, message: data.message, balance: data.balance });
      if (data.success) {
        toast.success("Koneksi API Fonnte Berhasil!");
      } else {
        toast.error("Koneksi Gagal: " + data.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menguji koneksi");
      setTestResult({ success: false, message: "Terjadi kesalahan server" });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await router.post("/wa-settings", form, {
        onSuccess: () => toast.success("Pengaturan WhatsApp berhasil disimpan!"),
        onError: () => toast.error("Gagal menyimpan pengaturan"),
        onFinish: () => setSaving(false),
      });
    } catch (error) {
      setSaving(false);
    }
  };

  const handleTestSend = async () => {
    if (!testPhone) {
      toast.error("Masukkan nomor WhatsApp tujuan");
      return;
    }
    setSendingTest(true);
    try {
      const response = await fetch("/wa-settings/test-send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({ phone: testPhone, message: testMessage }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Pesan ujicoba berhasil terkirim!");
      } else {
        toast.error("Gagal: " + (data.error || data.message));
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem saat mengirim pesan");
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <AppLayout title="WhatsApp Settings">
      <Head title="WhatsApp Settings - Fonnte API" />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">WhatsApp Gateway</h1>
                {form.is_active ? (
                  <Badge variant="default" className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Aktif
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 border-amber-500/30">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" /> Non-Aktif
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Konfigurasi integrasi layanan API Fonnte untuk broadcast WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.get("/dashboard")}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri - Konfigurasi Utama */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card API Config */}
            <Card className="shadow-sm border-zinc-200/80 dark:border-zinc-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-600" />
                  Kredensial API Fonnte
                </CardTitle>
                <CardDescription>
                  Dapatkan API Token dari{" "}
                  <a href="https://fonnte.com" target="_blank" rel="noreferrer" className="text-emerald-600 font-medium inline-flex items-center hover:underline">
                    fonnte.com <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api_token">API Token <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <Input
                      id="api_token"
                      type="password"
                      placeholder="Masukkan Token dari Fonnte"
                      value={form.api_token}
                      onChange={(e) => setForm({ ...form, api_token: e.target.value })}
                      className="font-mono text-sm"
                    />
                    <Button variant="secondary" onClick={handleTestConnection} disabled={testing || !form.api_token} className="shrink-0">
                      {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Test API"}
                    </Button>
                  </div>
                  {testResult && (
                    <div className={`p-3 rounded-lg text-xs font-medium flex items-center justify-between border ${testResult.success ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                      <span>{testResult.success ? "Koneksi Berhasil" : `Gagal: ${testResult.message}`}</span>
                      {testResult.balance !== undefined && <span className="font-bold">Saldo: {testResult.balance}</span>}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="sender_number">Nomor Pengirim <span className="text-red-500">*</span></Label>
                    <Input
                      id="sender_number"
                      placeholder="Contoh: 081234567890"
                      value={form.sender_number}
                      onChange={(e) => setForm({ ...form, sender_number: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="device_id">Device ID (Opsional)</Label>
                    <Input
                      id="device_id"
                      placeholder="Multi-device ID"
                      value={form.device_id}
                      onChange={(e) => setForm({ ...form, device_id: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="webhook_url">Webhook URL (Opsional)</Label>
                  <Input
                    id="webhook_url"
                    type="url"
                    placeholder="https://domain.com/webhook/whatsapp"
                    value={form.webhook_url}
                    onChange={(e) => setForm({ ...form, webhook_url: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card Advanced Settings */}
            <Card className="shadow-sm border-zinc-200/80 dark:border-zinc-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-600" />
                  Parameter Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate_limit">Rate Limit (per detik)</Label>
                    <Input
                      id="rate_limit"
                      type="number"
                      min="1"
                      max="10"
                      value={form.rate_limit_per_second}
                      onChange={(e) => setForm({ ...form, rate_limit_per_second: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retry_attempts">Batas Percobaan Percobaan (Retry)</Label>
                    <Input
                      id="retry_attempts"
                      type="number"
                      min="1"
                      max="5"
                      value={form.retry_attempts}
                      onChange={(e) => setForm({ ...form, retry_attempts: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                <div className="divide-y rounded-xl border">
                  <div className="flex items-center justify-between p-4">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Mode Ujicoba (Test Mode)</Label>
                      <p className="text-xs text-muted-foreground">Simulasi pengiriman pesan tanpa memotong saldo Fonnte</p>
                    </div>
                    <Switch
                      checked={form.is_test_mode}
                      onCheckedChange={(checked) => setForm({ ...form, is_test_mode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Status Layanan Broadcast</Label>
                      <p className="text-xs text-muted-foreground">Aktifkan untuk mulai mengirimkan WhatsApp otomatis</p>
                    </div>
                    <Switch
                      checked={form.is_active}
                      onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan - Test Sending Box */}
          <div className="space-y-6">
            <Card className="shadow-sm border-zinc-200/80 dark:border-zinc-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Ujicoba Pengiriman
                </CardTitle>
                <CardDescription>
                  Kirim pesan WhatsApp langsung untuk menguji konfigurasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test_phone">Nomor Tujuan</Label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="test_phone"
                      placeholder="081234567890"
                      className="pl-9"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="test_message">Isi Pesan Ujicoba</Label>
                  <textarea
                    id="test_message"
                    rows={3}
                    className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleTestSend}
                  disabled={!form.is_active || sendingTest}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  {sendingTest ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Kirim Pesan Ujicoba
                    </>
                  )}
                </Button>

                {!form.is_active && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-center">
                    Aktifkan switcher <strong>Status Layanan Broadcast</strong> untuk melakukan pengujian.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
