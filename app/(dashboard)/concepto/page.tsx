import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, Hash, TrendingUp, CheckCircle } from "lucide-react"

const conceptos = [
  {
    id: 1,
    numero: "CON-2024-001",
    fecha: "2024-01-10",
    valor: 15000000,
    ejecutado: 8000000,
    estado: "Aprobado",
  },
  {
    id: 2,
    numero: "CON-2024-002",
    fecha: "2024-01-12",
    valor: 8500000,
    ejecutado: 8500000,
    estado: "Aprobado",
  },
  {
    id: 3,
    numero: "CON-2024-003",
    fecha: "2024-01-14",
    valor: 12300000,
    ejecutado: 5200000,
    estado: "Aprobado",
  },
  {
    id: 4,
    numero: "CON-2024-004",
    fecha: "2024-01-16",
    valor: 6750000,
    ejecutado: 6750000,
    estado: "Aprobado",
  },
]

const totalValor = conceptos.reduce((sum, concepto) => sum + concepto.valor, 0)
const totalEjecutado = conceptos.reduce((sum, concepto) => sum + concepto.ejecutado, 0)
const totalPorEjecutar = totalValor - totalEjecutado

export default function ConceptoPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Conceptos Aprobados</h1>
          <p className="text-gray-600">Seguimiento de conceptos y ejecución presupuestal</p>
        </div>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Aprobado</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">${totalValor.toLocaleString("es-CO")}</div>
          </CardContent>
        </Card>

        <Card className="border-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Ejecutado</CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">${totalEjecutado.toLocaleString("es-CO")}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Por Ejecutar</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">${totalPorEjecutar.toLocaleString("es-CO")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Conceptos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {conceptos.map((concepto) => (
          <Card key={concepto.id} className="hover:shadow-md transition-shadow border-green-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">{concepto.numero}</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                  {concepto.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(concepto.fecha).toLocaleDateString("es-CO")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">${concepto.valor.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium text-green-600">${concepto.ejecutado.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Hash className="h-4 w-4" />
                <span>ID: {concepto.id}</span>
              </div>

              {/* Barra de progreso */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Ejecutado</span>
                  <span>{Math.round((concepto.ejecutado / concepto.valor) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${(concepto.ejecutado / concepto.valor) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
