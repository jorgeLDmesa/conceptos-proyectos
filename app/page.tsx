import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
          <Image
            src="https://bkymchtifbcofloxcasr.supabase.co/storage/v1/object/public/images/organization_logos/16900bec-e2c8-4e97-b318-9fffce3870b1.png"
            alt="Logo"
            width={420}
            height={420}
            className="object-contain"
          />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Banco de Proyectos</h1>
          <p className="text-lg text-gray-600">Politécnico Jaime Isaza Cadavid</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Iniciar Sesión</CardTitle>
            <CardDescription className="text-gray-600">Accede al sistema de gestión de proyectos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@elpoli.edu.co"
                className="border-gray-200 focus:border-green-400 focus:ring-green-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="border-gray-200 focus:border-green-400 focus:ring-green-400"
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2.5"
              size="lg"
            >
              Ingresar al Sistema
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 Politécnico Jaime Isaza Cadavid</p>
          <p>Sistema de Gestión de Proyectos</p>
        </div>
      </div>
    </div>
  )
}
