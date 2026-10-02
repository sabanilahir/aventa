import LoginLogo from "@/components/login-logo";

export default function AuthSplitLayout({ children }: { children: React.ReactNode }) {
  const quote = "Bersama membangun Trah Panembahan Senapati";

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Kiri - Background Image */}
      <div className="relative bg-cover bg-center" style={{ backgroundImage: `url(/storage/background/login-bg.png)` }}>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 to-green-700/50" />
        
        {/* Content */}
        <div className="relative flex flex-col justify-between h-full p-8 lg:p-12 z-10">
          {/* Logo Kanan Atas */}
          <div className="flex justify-end">
            <LoginLogo className="w-10 h-10" />
          </div>

          {/* Quote Tengah */}
          <div className="my-auto py-12 space-y-3">
            <h1 className="text-3xl font-extrabold text-white">Selamat Datang</h1>
            <p className="text-base text-white/80 max-w-md">{quote}</p>
          </div>

          <div className="text-xs text-white/60">
            © {new Date().getFullYear()} Management System.
          </div>
        </div>
      </div>

      {/* Kanan - Form Login */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Masuk</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Form Login Children */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
