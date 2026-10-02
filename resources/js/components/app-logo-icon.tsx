import { usePage } from '@inertiajs/react';
import type { SVGAttributes } from 'react';
import { ClipboardCheck } from 'lucide-react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
  const setting = usePage().props.setting as {
    logo?: string;
  } | null;

  if (!setting?.logo) {
    return (
      <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 7V5C8 4.44772 8.44772 4 9 4H15C15.5523 4 16 4.44772 16 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }

  return (
    <img
      src={"/storage/" + setting.logo}
      alt="App Logo"
      className="w-full h-full object-contain"
    />
  );
}
