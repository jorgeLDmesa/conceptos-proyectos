import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

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

        <Button>
          <Link href="/login">
            Iniciar Sesión
          </Link>
        </Button>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 Politécnico Jaime Isaza Cadavid</p>
          <p>Sistema de Gestión de Proyectos</p>
        </div>
      </div>
    </div>
  )
}
