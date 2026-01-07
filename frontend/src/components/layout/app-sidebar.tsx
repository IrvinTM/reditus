import * as React from "react"
import {
  AudioWaveform,
  BadgeDollarSign,
  Barcode,
  Command,
  Computer,
  Settings2,
  Store,
  History
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { NavQuickLinks } from "./nav-quick-links"
import { NavUser } from "./nav-user"
import { ModeToggle } from "../mode-toggle"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Administrador",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Vendedor",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navMain: [
    {
      title: "Administrar",
      url: "#",
      icon: Computer,
      isActive: true,
      items: [
        {
          title: "Productos",
          url: "/productos",
        },
        {
            title: "Clientes",
            url: "/clientes",
        },
        {
          title: "Proveedores",
          url: "#",
        },
        // {
        //   title: "Settings",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Ventas",
      url: "/vender",
      icon: BadgeDollarSign,
      items: [
        {
          title: "Vender",
          url: "/vender",
        },
        {
          title: "Historial de ventas",
          url: "/historialdeventas",
        },
      ],
    },
    // {
    //   title: "Ajustes",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Ajustes",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/ajustes",
        },
        {
          title: "Tema",
          url: "#",
        },
        // {
        //   title: "Billing",
        //   url: "#",
        // },
        // {
        //   title: "Limits",
        //   url: "#",
        // },
      ],
    },
  ],
  projects: [
    {
      name: "Vender",
      url: "/vender",
      icon: Store,
    },
    {
      name: "Productos",
      url: "/productos",
      icon: Barcode,
    },
    {
      name: "Historial de ventas",
      url: "/historialdeventas",
      icon: History,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavQuickLinks projects={data.projects} />
        <div className="pl-4">
        <ModeToggle/>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />

      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
