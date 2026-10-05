import { usePage, Head } from "@inertiajs/react";
import { useState } from "react";
import { AlertCircle, CheckCircle, Download } from "lucide-react";
import QRCode from "react-qr-code";

export default function RegisterIndex() {
  const { props } = usePage();
  const { event, tamu, token, error } = props as any;

  // Cek apakah tamu sudah pernah melakukan konfirmasi sebelumnya
  const sudahKonfirmasi = Boolean(tamu?.status_hadir && tamu?.status_hadir !== 'belum');

  const [statusHadir, setStatusHadir] = useState(tamu?.status_hadir && tamu?.status_hadir !== 'belum' ? tamu.status_hadir : "hadir");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(sudahKonfirmasi);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Helper untuk menentukan nilai QR Code
  const getQrValue = () => {
    return tamu?.token || `${event?.id || 0}.${tamu?.nama || "-"}`;
  };

  // Helper Download QR Code ke Format PNG
  const downloadQR = (elementId: string, namaTamu: string) => {
    const svg = document.getElementById(elementId) as SVGElement | null;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
      }
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_${namaTamu.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/guest/register/simpan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token, status_hadir: statusHadir }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setErrMsg(data.message || "Gagal menyimpan konfirmasi kehadiran.");
      }
    } catch (err: any) {
      setErrMsg("Error: " + (err?.message || "Gagal terhubung ke server"));
    } finally {
      setSubmitting(false);
    }
  };

  // TAMPILAN JIKA ERROR (Token tidak valid)
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Head title="Error - RSVP" />
        <div className="max-w-sm w-full bg-white rounded-2xl p-6 text-center shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-red-600 mb-2">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // TAMPILAN JIKA SUCCESS ATAU SUDAH PERNAH KONFIRMASI
  // TAMPILAN JIKA SUCCESS ATAU SUDAH PERNAH KONFIRMASI
  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Head title="Success - RSVP" />
        <div className="max-w-sm w-full bg-white rounded-2xl text-center border-0 shadow-xl overflow-hidden">
          <div className="bg-[#0a2e5c] p-6 text-white">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
            <h1 className="text-2xl font-bold mb-1">Thank You!</h1>
            <p className="text-sm opacity-90">Your confirmation has been received.</p>
          </div>

          <div className="p-8">
            {statusHadir === "hadir" ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Show this QR Code upon arrival</p>
                  <p className="text-lg font-bold text-[#0a2e5c]">{tamu?.nama}</p>
                </div>

                <div className="p-4 bg-white inline-block rounded-2xl border-2 border-slate-100 shadow-sm">
                  <QRCode id="qr-success-final" value={getQrValue()} size={180} level="H" />
                </div>

                <button
                  onClick={() => downloadQR("qr-success-final", tamu?.nama || "Guest")}
                  className="w-full bg-[#0a2e5c] hover:bg-[#072145] text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download QR Code
                </button>
              </div>
            ) : (
              <div className="py-6">
                <p className="text-gray-600 font-medium">
                  We understand that you are unable to attend. <br/><br/>Thank you for your response.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // TAMPILAN UTAMA FORM RSVP
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center sm:py-10 font-sans">
      <Head title="RSVP Event" />

      <div className="w-full max-w-[380px] bg-white sm:rounded-2xl sm:shadow-xl overflow-hidden min-h-screen sm:min-h-0 flex flex-col">

        {/* Header Event */}
        <div className="bg-[#f2f4f7] py-6 px-4 text-center">
          <h1 className="text-2xl font-extrabold text-[#112143] tracking-tight">
            {"PAI"}
          </h1>
          <p className="text-[14px] text-[#112143] font-bold mt-1">
            {event?.nama || "40th Anniversary Celebration"}
          </p>
        </div>

        {/* Form RSVP */}
        <form onSubmit={submit} className="p-6 flex-1 flex flex-col space-y-5">

          {errMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {errMsg}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-gray-800 flex items-center gap-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={tamu?.nama || ""}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50/50 text-gray-800 text-[14px] focus:outline-none pointer-events-none"
            />
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-gray-800 flex items-center gap-1">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={tamu?.no_telepon || ""}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50/50 text-gray-800 text-[14px] focus:outline-none pointer-events-none"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-gray-800 flex items-center gap-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={tamu?.nama_perusahaan || "-"}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50/50 text-gray-800 text-[14px] focus:outline-none pointer-events-none"
            />
          </div>

          {/* Attendance Confirmation */}
          <div className="space-y-3 pt-1">
            <label className="text-[13px] font-bold text-gray-800 flex items-center gap-1">
              Attendance Confirmation <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col space-y-3 mt-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name="attendance"
                  value="hadir"
                  checked={statusHadir === "hadir"}
                  onChange={(e) => setStatusHadir(e.target.value)}
                  className="w-4 h-4 text-[#0c4083] bg-white border-gray-300 focus:ring-[#0c4083] focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-[14px] font-medium text-gray-700 group-hover:text-gray-900">I will attend</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name="attendance"
                  value="tidak_hadir"
                  checked={statusHadir === "tidak_hadir"}
                  onChange={(e) => setStatusHadir(e.target.value)}
                  className="w-4 h-4 text-[#0c4083] bg-white border-gray-300 focus:ring-[#0c4083] focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-[14px] font-medium text-gray-700 group-hover:text-gray-900">I will not attend</span>
              </label>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0a3265] hover:bg-[#07244a] text-white font-semibold py-3.5 rounded-lg transition-colors text-[15px]"
            >
              {submitting ? "Submitting..." : "Submit RSVP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
