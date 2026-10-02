import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Calendar, MapPin, Clock, Search, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EventIndex() {
  const { props } = usePage();
  const events = (props.events as any[]) || [];
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredEvents = events.filter((event) => {
    const matchSearch = event.nama?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || event.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = (id: number) => {
    setDeleting(true);
    router.delete(`/events/${id}`, {
      onSuccess: () => { setDeleting(false); setDeleteId(null); },
      onError: () => { setDeleting(false); alert("Gagal"); },
    });
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "draft";
    const cfg: Record<string, {label: string; cls: string}> = {
      active: {label: "Aktif", cls: "bg-emerald-100 text-emerald-700"},
      draft: {label: "Draft", cls: "bg-amber-100 text-amber-700"},
      completed: {label: "Selesai", cls: "bg-blue-100 text-blue-700"},
      archived: {label: "Arsip", cls: "bg-gray-100 text-gray-700"},
    };
    const c = cfg[s] || cfg.draft;
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.cls}`}>{c.label}</span>;
  };

  const filters = [
    { id: "all", label: "Semua" },
    { id: "active", label: "Aktif" },
    { id: "draft", label: "Draft" },
    { id: "completed", label: "Selesai" },
    { id: "archived", label: "Arsip" },
  ];

  return (
    <AppLayout>
      <Head title="Manajemen Event" />
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Events</h1>
            <p className="text-sm text-gray-500">{events.length} event</p>
          </div>
          <Button onClick={() => router.get("/events/create")}>
            <Plus className="w-4 h-4 mr-2" />Buat Event Baru
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Cari event..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <Button key={f.id} variant={filter === f.id ? "default" : "outline"} size="sm" onClick={() => setFilter(f.id)}>{f.label}</Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg">
              <CardContent className="p-0">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                  <div className="flex items-center gap-2">{getStatusBadge(event.status)}</div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); router.get(`/events/${event.id}/edit`); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); setDeleteId(event.id); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Event</AlertDialogTitle>
                          <AlertDialogDescription>Hapus "{event.nama}"? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(event.id)} className="bg-red-500 hover:bg-red-600" disabled={deleting}>
                            {deleting ? "Menghapus..." : "Hapus"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div onClick={() => router.get(`/events/${event.id}`)} className="p-4 cursor-pointer">
                  <h3 className="font-semibold text-lg mb-3 line-clamp-1">{event.nama}</h3>
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span className="truncate">{event.tanggal || "-"}</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span className="truncate">{event.waktu_mulai || "-"}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span className="truncate">{event.tempat || event.alamat || "-"}</span></div>
                  </div>
                  <div className="pt-3 border-t flex justify-between text-xs"><span>QR/Keluarga</span><span className="bg-gray-100 px-2 py-1 rounded">{event.qr_per_keluarga || 4}</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-1">Tidak ada event ditemukan</h3>
              <p className="text-sm text-gray-500 mb-6">{search ? `Tidak dapat menemukan "${search}"` : "Belum ada event"}</p>
              <Button onClick={() => router.get("/events/create")}><Plus className="w-4 h-4 mr-2" />Buat Event Baru</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
