"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toast } from 'sonner';

// Subcomponentes extraídos
import ProjectSelector from "./ProjectSelector";
import FormFields from "./FormFields";
import SignatureUploader from "./SignatureUploader";
import Observations from "./Observations";
import DatePicker from "./DatePicker";
import PDFModal from "./PDFModal";

// Actions y services
// import { sendConceptoEmail } from "@/lib/resend/emailConceptosApi";

// Tipos de datos
export interface FormData {
  centroCostos: string;
  rubroPresupuestal: string;
  elementoPep: string;
  codigoPospre: string;
  codigoDane: string;
  valor: string;
  nombreSolicitante: string;
  cargo: string;
  concepto: string;
  observacion: string;
  elaboroNombre: string;
  elaboroCargo: string;
  firmaNombre: string;
  firmaCargo: string;
  fechaExpedicion: string;
  nombreProyecto: string;
  numeroContrato: string;
  objetoContrato: string;
  fondo: string;
  // Nuevo campo combinado de actividad MGA
  actividadMGA: string;
}

export interface Proyecto {
  id: string;
  nombre_del_proyecto: string;
  objeto: string;
  valor: number;
  codigo_del_centro_de_costos: string;
  nombre_del_centro_de_costos: string;
  elemento_pep_proyecto: string;
  codigo_pospre: string;
  nombre_pospre: string;
  codigo_dane: string;
  nombre_codigo_dane: string;
  rubro_atlas: string | null;
  codigo_del_fondo: string | null;
  nombre_del_fondo: string | null;
  observaciones: number;
  // Nuevos campos de actividad MGA
  codigo_actividad_mga: string | null;
  nombre_actividad_mga: string | null;
  // Campos del centro gestor
  codigo_centro_gestor: string;
  nombre_centro_gestor: string;
}

export default function InvestmentForm({
  proyectosData,
}: {
  proyectosData: Proyecto[];
})  {

  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>(proyectosData || []);
  const [isEnviando, setIsEnviando] = useState(false);

  // // Fetch signature from conceptos_projects table
  // useEffect(() => {
  //   const fetchSignature = async () => {
  //     if (!projectId) return;
  //     const signature = await fetchProjectSignature(projectId);
  //     if (signature) {
  //       setSignatureImage(signature);
  //     }
  //   };

  //   fetchSignature();
  // }, [projectId]);

  const [formData, setFormData] = useState<FormData>({
    centroCostos: "",
    rubroPresupuestal: "",
    elementoPep: "",
    codigoPospre: "",
    codigoDane: "",
    valor: "$ 0",
    nombreSolicitante: "Cesar Ivan Navarro Criado",
    cargo: "Director de Bienestar Institucional e Interacción Social",
    concepto: "",
    observacion: "",
    elaboroNombre: "",
    elaboroCargo: "",
    firmaNombre: "",
    firmaCargo: "",
    fechaExpedicion: new Date().toISOString().split("T")[0],
    nombreProyecto: "",
    numeroContrato: "",
    objetoContrato: "",
    fondo: "",
    actividadMGA: "",
  });

  // Función para formatear moneda (igual que en el código original)
  const formatCurrency = (value: string): string => {
    const numericValue = Number(value.replace(/[^0-9]/g, ""));
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    })
      .format(numericValue)
      .replace("COP", "$");
  };

  // Función para calcular el presupuesto disponible
  const calcularPresupuestoDisponible = (proyecto: Proyecto): number => {
    return proyecto.valor - proyecto.observaciones;
  };

  // Función para validar si el valor solicitado supera el presupuesto disponible
  const validarPresupuesto = (valorSolicitado: string, proyecto: Proyecto): {
    esValido: boolean;
    presupuestoDisponible: number;
    valorSolicitadoNumerico: number;
    exceso: number;
  } => {
    const valorNumerico = Number(valorSolicitado.replace(/[^0-9]/g, ""));
    const presupuestoDisponible = calcularPresupuestoDisponible(proyecto);
    const esValido = valorNumerico <= presupuestoDisponible;
    const exceso = valorNumerico - presupuestoDisponible;
    
    return {
      esValido,
      presupuestoDisponible,
      valorSolicitadoNumerico: valorNumerico,
      exceso: Math.max(0, exceso)
    };
  };

  // Actualiza los datos del formulario cuando se selecciona un proyecto
  const updateFormDataFromProyecto = (proyecto: Proyecto) => {
    setFormData((prev) => ({
      ...prev,
      nombreProyecto: proyecto.nombre_del_proyecto,
      objetoContrato: proyecto.objeto,
      valor: formatCurrency(String(proyecto.valor)),
      rubroPresupuestal: proyecto.rubro_atlas ?? "",
      fondo:
        proyecto.codigo_del_fondo && proyecto.nombre_del_fondo
          ? `${proyecto.codigo_del_fondo}-${proyecto.nombre_del_fondo}`
          : "",
      centroCostos:
        proyecto.codigo_del_centro_de_costos && proyecto.nombre_del_centro_de_costos
          ? `${proyecto.codigo_del_centro_de_costos}-${proyecto.nombre_del_centro_de_costos}`
          : "",
      elementoPep: proyecto.elemento_pep_proyecto,
      codigoPospre:
        proyecto.codigo_pospre && proyecto.nombre_pospre
          ? `${proyecto.codigo_pospre}-${proyecto.nombre_pospre}`
          : "",
      codigoDane:
        proyecto.codigo_dane && proyecto.nombre_codigo_dane
          ? `${proyecto.codigo_dane}-${proyecto.nombre_codigo_dane}`
          : "",
      actividadMGA:
        proyecto.codigo_actividad_mga && proyecto.nombre_actividad_mga
          ? `${proyecto.codigo_actividad_mga}-${proyecto.nombre_actividad_mga}`
          : "",
    }));
  };

  // Maneja los cambios en el formulario
  const handleFormChange = (field: keyof FormData, value: string) => {
    if (field === "objetoContrato") {
      // Busca el proyecto por objeto y actualiza todos los campos del proyecto
      const proyecto = proyectos.find((p) => p.objeto === value);
      if (proyecto) {
        updateFormDataFromProyecto(proyecto);
      } else {
        setFormData((prev) => ({ ...prev, objetoContrato: value }));
      }
    } else if (field === "nombreProyecto") {
      // Solo actualiza el nombre del proyecto sin afectar otros campos
      setFormData((prev) => ({ ...prev, nombreProyecto: value }));
    } else if (field === "valor") {
      const formattedValue = formatCurrency(value);
      setFormData((prev) => ({ ...prev, valor: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };



  // Función para verificar si el botón enviar debe estar habilitado
  const isEnviarEnabled = () => {
    // Validaciones básicas
    if (!formData.objetoContrato || !formData.valor || formData.valor === "$ 0" || isEnviando) {
      return false;
    }

    // Busca el proyecto seleccionado por objeto
    const proyectoSeleccionado = proyectos.find(
      (p) => p.objeto === formData.objetoContrato
    );

    if (!proyectoSeleccionado) {
      return false;
    }

    // Validar presupuesto disponible
    const validacion = validarPresupuesto(formData.valor, proyectoSeleccionado);
    return validacion.esValido;
  };

  // Función para obtener el estado del presupuesto para mostrar al usuario
  const getEstadoPresupuesto = () => {
    if (!formData.objetoContrato || !formData.valor || formData.valor === "$ 0") {
      return null;
    }

    const proyectoSeleccionado = proyectos.find(
      (p) => p.objeto === formData.objetoContrato
    );

    if (!proyectoSeleccionado) {
      return null;
    }

    const validacion = validarPresupuesto(formData.valor, proyectoSeleccionado);
    return {
      esValido: validacion.esValido,
      presupuestoDisponible: validacion.presupuestoDisponible,
      valorSolicitado: validacion.valorSolicitadoNumerico,
      exceso: validacion.exceso
    };
  };

  // Maneja el envío de datos
  const handleEnviar = async () => {
    if (!isEnviarEnabled()) {
      return;
    }

    setIsEnviando(true);

    try {
      // Busca el proyecto seleccionado por objeto
      const proyectoSeleccionado = proyectos.find(
        (p) => p.objeto === formData.objetoContrato
      );

      if (!proyectoSeleccionado) {
        toast.error("Por favor, seleccione un proyecto válido basado en el objeto del contrato.");
        return;
      }

      // Convertir el valor a numérico
      const valorNumerico = Number(formData.valor.replace(/[^0-9]/g, ""));

                   // Mostrar toast de proceso iniciado
      toast.loading("Actualizando observaciones en el presupuesto...", { id: "actualizando" });

      // Actualizar las observaciones en Google Sheets
      const response = await fetch('/api/proyectos/actualizar-observaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proyectoId: String(proyectoSeleccionado.id), // Asegurar que sea string
          valorAAgregar: valorNumerico
        })
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(`Error al actualizar observaciones: ${result.error || 'Error desconocido'}`, { id: "actualizando" });
        throw new Error(result.error || 'Error al actualizar observaciones');
      }

      console.log('✅ Observaciones actualizadas:', result);

      // Actualizar el proyecto local con el nuevo valor de observaciones
      setProyectos(prevProyectos => 
        prevProyectos.map(proyecto => 
          String(proyecto.id) === String(proyectoSeleccionado.id)
            ? { ...proyecto, observaciones: result.valorNuevo }
            : proyecto
        )
      );

      // Toast de éxito con detalles
      toast.success(
        `✅ Concepto enviado exitosamente!\n` +
        `💰 Valor agregado: ${formatCurrency(valorNumerico.toString())}\n` +
        `📊 Nuevo total observaciones: ${formatCurrency(result.valorNuevo.toString())}`,
        { 
          id: "actualizando",
          duration: 5000 
        }
      );

      // Reset parcial del formulario
      setFormData((prev) => ({
        ...prev,
        valor: "$ 0",
        observacion: "",
        nombreProyecto: "",
        objetoContrato: "",
        numeroContrato: "",
        actividadMGA: "",
      }));
      setSignatureImage(null);

    } catch (err) {
      console.error("Error inesperado:", err);
      toast.error(
        `❌ Error al enviar el concepto:\n${err instanceof Error ? err.message : 'Error desconocido. Por favor, intenta nuevamente.'}`,
        { 
          id: "actualizando",
          duration: 6000 
        }
      );
    } finally {
      setIsEnviando(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full border-2">
        <CardHeader className="grid grid-cols-1 md:grid-cols-[auto,1fr,auto] items-center gap-4 border-b p-4">
          <Image
            src="https://bkymchtifbcofloxcasr.supabase.co/storage/v1/object/public/images/organization_logos/16900bec-e2c8-4e97-b318-9fffce3870b1.png"
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
          />
          <h1 className="text-xl font-bold text-center">
            CONCEPTO PARA EJECUCIÓN DE PROYECTOS DE INVERSIÓN
          </h1>
          <div className="grid gap-1 text-sm">
            <div>Código: FPL12</div>
            <div>Versión 06</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Sección de selección de proyecto y objeto */}
          <ProjectSelector
            proyectos={proyectos}
            formData={formData}
            onChange={handleFormChange}
            onUpdateProject={updateFormDataFromProyecto}
          />

          {/* Campos del formulario (centro de costos, rubro, fondo, etc.) */}
          <FormFields
            formData={formData}
            proyectos={proyectos}
            onChange={handleFormChange}
          />

          {/* Área de observaciones */}
          <Observations
            value={formData.observacion}
            onChange={(value) => handleFormChange("observacion", value)}
          />

          {/* Sección de firma y fecha */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-b">
            <SignatureUploader
              signatureImage={signatureImage}
              onUpload={(img) => setSignatureImage(img)}
              firmaNombre={formData.firmaNombre}
              firmaCargo={formData.firmaCargo}
              onChange={handleFormChange}
            />
            <DatePicker
              fecha={formData.fechaExpedicion}
              onChange={(value) => handleFormChange("fechaExpedicion", value)}
            />
          </div>
        </CardContent>
      </Card>
      {/* Indicador de estado del presupuesto */}
      {(() => {
        const estadoPresupuesto = getEstadoPresupuesto();
        if (!estadoPresupuesto) return null;

        return (
          <div className="mt-4 p-4 border rounded-lg print:hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold">Presupuesto disponible:</span>
                <div className="text-lg">{formatCurrency(estadoPresupuesto.presupuestoDisponible.toString())}</div>
              </div>
              <div>
                <span className="font-semibold">Valor solicitado:</span>
                <div className="text-lg">{formatCurrency(estadoPresupuesto.valorSolicitado.toString())}</div>
              </div>
              <div>
                <span className="font-semibold">Estado:</span>
                <div className={`text-lg font-bold ${estadoPresupuesto.esValido ? 'text-green-600' : 'text-red-600'}`}>
                  {estadoPresupuesto.esValido ? (
                    <span className="flex items-center gap-2">
                      ✅ Válido
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      ❌ Excede por {formatCurrency(estadoPresupuesto.exceso.toString())}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Botones de acción */}
      <div className="mt-4 flex justify-end print:hidden">
        <PDFModal formData={formData} signatureImage={signatureImage} />
        <Button 
          onClick={handleEnviar} 
          variant="secondary"
          disabled={!isEnviarEnabled()}
          className={`${!isEnviarEnabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isEnviando ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </div>
  );
}
