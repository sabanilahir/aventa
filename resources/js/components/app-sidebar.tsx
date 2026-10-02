import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import AppLogo from "@/components/app-logo";
import * as LucideIcons from "lucide-react";

interface MenuItem {
  id: number;
  title: string;
  route: string | null;
  icon: string;
  children?: MenuItem[];
}

export function AppSidebar() {
  const { menus = [] } = usePage().props as { menus?: MenuItem[] };
  const [openMenus, setOpenMenus] = useState<number[]>([]);
  const { url } = usePage();

  const toggleMenu = (id: number) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.LayoutDashboard;
  };

  const renderMenu = (items: MenuItem[], level = 0) => {
    return items.map((menu) => {
      const hasChildren = menu.children && menu.children.length > 0;
      const isActive = menu.route && url.startsWith(menu.route);
      const isOpen = openMenus.includes(menu.id);
      const Icon = getIcon(menu.icon);
      const indentStyle = level > 0 ? { paddingLeft: `${level * 0.75}rem` } : {};

      return (
        <SidebarMenuItem key={menu.id}>
          {hasChildren ? (
            <>
              <SidebarMenuButton
                style={indentStyle}
                onClick={() => toggleMenu(menu.id)}
                className="group flex items-center rounded-md transition-colors cursor-pointer hover:bg-muted"
              >
                <Icon className="mr-3 size-4" />
                <span>{menu.title}</span>
                <ChevronDown className={cn("ml-auto size-4 transition-transform", isOpen && "rotate-180")} />
              </SidebarMenuButton>
              {isOpen && (
                <SidebarMenu className="ml-4 border-l border-muted pl-2">
                  {renderMenu(menu.children!, level + 1)}
                </SidebarMenu>
              )}
            </>
          ) : menu.route ? (
            <SidebarMenuButton
              asChild
              style={indentStyle}
              className={cn(
                "flex items-center rounded-md transition-colors hover:bg-muted",
                isActive && "bg-muted text-primary"
              )}
            >
              <Link href={menu.route}>
                <Icon className="mr-3 size-4" />
                <span>{menu.title}</span>
              </Link>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton style={indentStyle} className="opacity-70">
              <Icon className="mr-3 size-4" />
              <span>{menu.title}</span>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      );
    });
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <AppLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>{renderMenu(menus || [])}</SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
