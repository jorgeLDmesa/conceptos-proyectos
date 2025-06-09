import { Home, FileText, CheckCircle, Building } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Solicitudes",
    url: "/solicitud",
    icon: FileText,
  },
  {
    title: "Conceptos",
    url: "/concepto",
    icon: CheckCircle,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-green-100">
      <SidebarHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-yellow-50">
        <div className="flex items-center gap-3 px-3 py-4">
        <Image
            src="https://bkymchtifbcofloxcasr.supabase.co/storage/v1/object/public/images/organization_logos/16900bec-e2c8-4e97-b318-9fffce3870b1.png"
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
          />
          <div>
            <h2 className="font-semibold text-gray-800 text-sm">Banco de Proyectos</h2>
            <p className="text-xs text-gray-600">Politécnico JIC</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-medium">Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-green-50 hover:text-green-700">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-green-100 bg-gradient-to-r from-green-50 to-yellow-50">
        <div className="flex items-center gap-2 px-3 py-2">
          <Building className="h-4 w-4 text-green-600" />
          <span className="text-xs text-gray-600">Sistema v1.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
