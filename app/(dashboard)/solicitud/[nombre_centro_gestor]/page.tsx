import InvestmentForm from "../_components/InvestmentForm";
import { Proyecto } from "../_components/InvestmentForm";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageParams {
  nombre_centro_gestor: string; // Mantener el nombre para compatibilidad con la carpeta
}

// Función para obtener datos del Google Spreadsheet filtrados por código de centro gestor
async function fetchProyectos(codigoCentroGestor: string): Promise<Proyecto[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/proyectos?codigo_centro_gestor=${encodeURIComponent(codigoCentroGestor)}`, 
      {
        cache: 'no-store', // Para obtener siempre datos frescos
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error al obtener proyectos: ${response.status}`);
    }
    
    const proyectos = await response.json();
    
    // Mantener el campo id como string para compatibilidad con JSON
    return proyectos;
    
  } catch (error) {
    console.error('Error al obtener proyectos del spreadsheet:', error);
    
    // Fallback a datos hardcodeados en caso de error
    return [
      {
        id: "1",
        nombre_del_proyecto: "Datos no disponibles - Error de conexión",
        objeto: `No se pudieron obtener los datos del spreadsheet para el código ${codigoCentroGestor}`,
        valor: 0,
        codigo_del_centro_de_costos: "",
        nombre_del_centro_de_costos: "",
        elemento_pep_proyecto: "",
        codigo_pospre: "",
        nombre_pospre: "",
        codigo_dane: "",
        nombre_codigo_dane: "",
        rubro_atlas: null,
        codigo_del_fondo: null,
        nombre_del_fondo: null,
        observaciones: 0,
        codigo_actividad_mga: null,
        nombre_actividad_mga: null,
        codigo_centro_gestor: "",
        nombre_centro_gestor: "",
      }
    ];
  }
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { nombre_centro_gestor } = await params;
  // Interpretar el parámetro como código de centro gestor
  const codigoCentroGestor = nombre_centro_gestor;
  const proyectosData = await fetchProyectos(codigoCentroGestor);
  
  // Obtener el nombre del centro gestor del primer proyecto (si existe)
  const nombreCentroGestor = proyectosData.length > 0 ? proyectosData[0].nombre_centro_gestor : codigoCentroGestor;
  
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Solicitud de Inversión</h1>
          <p className="text-gray-600">Centro Gestor: {nombreCentroGestor}</p>
        </div>
      </div>


      
      <InvestmentForm proyectosData={proyectosData} />
    </div>
  );
}