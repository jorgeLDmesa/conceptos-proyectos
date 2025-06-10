import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, DollarSign, Hash } from "lucide-react"
import Link from "next/link"


const solicitudes = [
  {
    id: 1,
    numero: "SOL-2024-001",
    fecha: "2024-01-15",
    valor: 15000000,
    estado: "Abierta",
  },
  {
    id: 2,
    numero: "SOL-2024-002",
    fecha: "2024-01-18",
    valor: 8500000,
    estado: "Abierta",
  },
  {
    id: 3,
    numero: "SOL-2024-003",
    fecha: "2024-01-20",
    valor: 12300000,
    estado: "Abierta",
  },
  {
    id: 4,
    numero: "SOL-2024-004",
    fecha: "2024-01-22",
    valor: 6750000,
    estado: "Abierta",
  },
]

export default function SolicitudPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Solicitudes Abiertas</h1>
          <p className="text-gray-600">Gestión de solicitudes de proyectos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {solicitudes.map((solicitud) => (
          <Card key={solicitud.id} className="hover:shadow-md transition-shadow border-green-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">{solicitud.numero}</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                  {solicitud.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(solicitud.fecha).toLocaleDateString("es-CO")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">${solicitud.valor.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Hash className="h-4 w-4" />
                <span>ID: {solicitud.id}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Card Nueva Solicitud */}
        <Link href="/solicitud/nueva">
          <Card className="border-2 border-dashed border-green-200 hover:border-green-300 hover:bg-green-50/50 transition-all cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center h-full py-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-700 mb-1">Nueva Solicitud</h3>
              <p className="text-sm text-gray-500 text-center">Crear una nueva solicitud de proyecto</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
