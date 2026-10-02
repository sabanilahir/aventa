import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
  const setting = usePage().props.setting as {
    nama_app?: string;
    app_name?: string;
    logo?: string;
  } | null;

  const defaultAppName = 'Sistem Undangan';
  const appName = setting?.nama_app || setting?.app_name || defaultAppName;

  return (
    <div className="flex items-center gap-2">
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden">
        <AppLogoIcon className="fill-current text-white dark:text-black" />
      </div>
      <div className="grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate leading-none font-semibold">
          {appName}
        </span>
      </div>
    </div>
  );
}
