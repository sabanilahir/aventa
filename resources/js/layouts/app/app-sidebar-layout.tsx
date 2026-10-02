import { useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { AppContent } from "@/components/app-content";
import { AppShell } from "@/components/app-shell";
import { AppSidebar } from "@/components/app-sidebar";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { type BreadcrumbItem } from "@/types";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
}

export default function AppSidebarLayout({
  children,
  breadcrumbs = [],
  title = "Dashboard",
}: Props) {
  const { props } = usePage();

  const flash = (props?.flash as { success?: string; error?: string }) ?? {};
  const setting = props?.setting as {
    nama_app: string;
    logo?: string;
    favicon?: string;
    warna?: string;
    seo?: {
      title?: string;
      description?: string;
      keywords?: string;
    };
  };

  useEffect(() => {
    if (flash.success) toast.success(flash.success);
    if (flash.error) toast.error(flash.error);
  }, [flash]);

  const primaryColor = setting?.warna || "#0ea5e9";
  const primaryForeground = "#ffffff";

  useEffect(() => {
    const unsubscribe = router.on("navigate", () => {
      router.reload({ only: ["menus"] });
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Head>
        <title>{title ?? setting?.seo?.title ?? setting?.nama_app ?? "Dashboard"}</title>
        {setting?.favicon && (
          <link rel="icon" type="image/x-icon" href={"/storage/" + setting.favicon} />
        )}
        {setting?.logo && !setting?.favicon && (
          <link rel="icon" type="image/png" href={"/storage/" + setting.logo} />
        )}
        {setting?.seo?.description && (
          <meta name="description" content={setting.seo.description} />
        )}
        {setting?.seo?.keywords && (
          <meta name="keywords" content={setting.seo.keywords} />
        )}
        <style>
          {`
            :root {
              --primary: ${primaryColor};
              --color-primary: ${primaryColor};
              --primary-foreground: ${primaryForeground};
              --color-primary-foreground: ${primaryForeground};
            }
            .dark {
              --primary: ${primaryColor};
              --color-primary: ${primaryColor};
              --primary-foreground: ${primaryForeground};
              --color-primary-foreground: ${primaryForeground};
            }
          `}
        </style>
      </Head>

      <div
        className="relative min-h-screen w-full overflow-hidden"
        style={{
          ["--primary" as any]: primaryColor,
          ["--primary-foreground" as any]: primaryForeground,
          ["--color-primary" as any]: primaryColor,
          ["--color-primary-foreground" as any]: primaryForeground,
        }}
      >
        <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/storage/background/login-bg.png')"}} />
        <div className="fixed inset-0 z-0 bg-white/60" />
        <div className="relative z-10">
          <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
              <AppSidebarHeader breadcrumbs={breadcrumbs} />
              {children}
            </AppContent>
          </AppShell>
        </div>
      </div>

      <Toaster />
    </>
  );
}
