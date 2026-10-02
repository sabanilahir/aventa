import { usePage } from "@inertiajs/react";
import type { SVGAttributes } from "react";

export default function LoginLogo(props: SVGAttributes<SVGElement>) {
  const setting = usePage().props.setting as {
    logo?: string;
  } | null;

  // Jika ada logo, tampilkan logo dari database
  if (setting?.logo) {
    return (
      /* Ubah justify-center menjadi justify-end di sini */
      <div className="flex items-center justify-end py-2 w-full">
        <img
          src={"/storage/" + setting.logo}
          alt="Logo"
          className="h-12 w-auto max-w-[160px] object-contain drop-shadow-md"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  // Fallback SVG icon untuk login
  return (
    /* Ubah justify-center menjadi justify-end di sini */
    <div className="flex items-center justify-end py-2 w-full">
      <svg
        {...props}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-amber-400"
      >
        <rect width="100" height="100" rx="20" fill="currentColor" className="text-amber-500/20" />
        <path d="M50 25C35 25 25 35 25 50C25 65 35 75 50 75C55 75 60 73 64 70L64 70L58 64C55 66 53 67 50 67C40 67 33 60 33 50C33 40 40 33 50 33C60 33 67 40 67 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="50" r="8" fill="currentColor" />
      </svg>
    </div>
  );
}
