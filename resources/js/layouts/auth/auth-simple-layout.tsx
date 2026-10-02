import AppLogoIcon from "@/components/app-logo-icon";
import { Link, usePage } from "@inertiajs/react";
import { useEffect } from "react";

export default function AuthSimpleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { quote = null } = (usePage().props as { quote?: string | null }).quote ?? {};

  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
      <div className="mb-8">
        <Link href="/">
          <AppLogoIcon className="w-24 h-auto fill-current text-gray-900 dark:text-white" />
        </Link>
      </div>

      <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
        {children}
      </div>
    </div>
  );
}
