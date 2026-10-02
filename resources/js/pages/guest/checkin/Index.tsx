import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, UserCheck, UserX, Search, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function CheckinIndex() {
  const { props } = usePage();
  const tamus = props.tamus || { data: [] };
  const [search, setSearch] = useState("");
  const [checkingIn, setCheckingIn] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleCheckin = async (tamuId) => {
    setCheckingIn(tamuId);
    try {
      const response = await fetch(`/guest/checkin/${tamuId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || "",
        },
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: `Check-in berhasil untuk ${data.tamu?.nama || "Tamu"}!` });
        router.reload({ only: ["tamus"] });
      } else {
        setMessage({ type: "error", text: data.message || "Gagal check-in" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setCheckingIn(null);
    }
  };

  const filteredTamus = tamus.data.filter(t => t.nama?.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <Head title="Attendance - Check-in Tamu" />
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance - Check-in Tamu</h1>
          <p className="text-gray-500">Manual check-in tamu</p>
        </div>

        {message.text && (
          <Card className={message.type === "success" ? "border-green-500" : "border-red-500"}>
            <CardContent className="pt-6">
              <p className={message.type === "success" ? "text-green-600" : "text-red-600"}>{message.text}</p>
            </CardContent>
          </Card>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input placeholder="Cari nama tamu..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="grid gap-3">
          {filteredTamus.map((tamu) => (
            <Card key={tamu.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{tamu.nama}</p>
                  <p className="text-sm text-gray-500">{tamu.no_telepon || "Tanpa No. HP"} | {tamu.jumlah_undangan || 4} Pax</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${tamu.status_hadir === "hadir" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {tamu.status_hadir === "hadir" ? "Hadir" : "Belum"}
                  </span>
                  {tamu.status_hadir !== "hadir" && (
                    <Button onClick={() => handleCheckin(tamu.id)} disabled={checkingIn === tamu.id} size="sm" className="bg-green-600 hover:bg-green-700">
                      {checkingIn === tamu.id ? "..." : "<CheckCircle className=\"w-4 h-4 mr-2\" /> Check-in"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
