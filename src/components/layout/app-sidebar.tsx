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
import { useAuth } from "@/auth/AuthContext"

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
          url: "/proveedores",
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
          url: "/ajustes/tema",
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
  const { user, isAdmin } = useAuth()

  const currentUserTeam = {
    name: user.name || user.email || "Usuario",
    logo: isAdmin ? Command : AudioWaveform,
    plan: isAdmin ? "Administrador" : "Cajero",
  }

  const navMain = data.navMain.map((section) => {
    if (section.title !== "Ajustes" || !section.items) {
      return section
    }

    return {
      ...section,
      items: isAdmin
        ? [...section.items, { title: "Usuarios", url: "/usuarios" }]
        : section.items,
    }
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={[currentUserTeam]} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavQuickLinks projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ ...data.user, ...user }} />

      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
