import { SignIn } from '@clerk/nextjs'
import Image from "next/image"

export default function Page() {
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

        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-lg border-0 bg-white/80 backdrop-blur-sm",
              headerTitle: "text-2xl text-gray-800",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "border-gray-200 hover:border-green-400",
              formButtonPrimary: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
              formFieldInput: "border-gray-200 focus:border-green-400 focus:ring-green-400",
              footerAction: "hidden",
              footer: "hidden"
            }
          }}
        />

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 Politécnico Jaime Isaza Cadavid</p>
          <p>Sistema de Gestión de Proyectos</p>
        </div>
      </div>
    </div>
  )
} 