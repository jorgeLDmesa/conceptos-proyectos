// components/FormFields.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Combobox }  from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Proyecto, FormData } from "./InvestmentForm";

interface Option {
  value: string;
  label: string;
}

interface FieldConfig {
  label: string;
  field: keyof FormData;
  type?: "input";
  options?: Option[];
}

interface FormFieldsProps {
  formData: FormData;
  proyectos: Proyecto[];
  onChange: (field: keyof FormData, value: string) => void;
}

const FormFields: React.FC<FormFieldsProps> = ({ formData, proyectos, onChange }) => {
  const [projectName, setProjectName] = useState<string | null>(null);

  // Fetch project name when component mounts or projectId changes
  // useEffect(() => {
  //   const fetchProjectName = async () => {
  //     if (projectId && projectId !== "TODOS") {
  //       const supabase = (await import('@/lib/supabase/client')).createClient();
  //       const { data: projectData } = await supabase
  //         .from('conceptos_projects')
  //         .select('name')
  //         .eq('id', projectId)
  //         .single();
        
  //       if (projectData) {
  //         setProjectName(projectData.name);
  //       }
  //     } else {
  //       setProjectName(null);
  //     }
  //   };

  //   fetchProjectName();
  // }, [projectId]);

  // Función para calcular el presupuesto disponible
  const calcularPresupuestoDisponible = (proyecto: Proyecto): number => {
    return proyecto.valor - proyecto.observaciones;
  };

  // Función para formatear moneda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value).replace("COP", "$");
  };

  // Buscar el proyecto actual en base al objeto seleccionado
  const proyectoActual = proyectos.find((p) => p.objeto === formData.objetoContrato);
  
  // Calcular validación de presupuesto
  const validacionPresupuesto = proyectoActual ? (() => {
    const valorSolicitado = Number(formData.valor.replace(/[^0-9]/g, ""));
    const presupuestoDisponible = calcularPresupuestoDisponible(proyectoActual);
    const exceso = valorSolicitado - presupuestoDisponible;
    
    return {
      proyectoActual,
      valorSolicitado,
      presupuestoDisponible,
      exceso: Math.max(0, exceso),
      excedePresupuesto: valorSolicitado > presupuestoDisponible,
      valorTotal: proyectoActual.valor,
      valorComprometido: proyectoActual.observaciones
    };
  })() : null;

  // Filter proyectos based on project name if not "TODOS"
  const filteredProyectos = projectName
    ? proyectos.filter(p => p.nombre_del_centro_de_costos === projectName)
    : proyectos;

  const fieldConfigs: FieldConfig[] = [
    {
      label: "CENTRO DE COSTOS",
      field: "centroCostos",
      options: filteredProyectos
        .map((p) => ({
          value: `${p.codigo_del_centro_de_costos}-${p.nombre_del_centro_de_costos}`,
          label: `${p.codigo_del_centro_de_costos}-${p.nombre_del_centro_de_costos}`,
        }))
        .filter((v, i, a) => a.findIndex((t) => t.value === v.value) === i),
    },
    {
      label: "RUBRO PRESUPUESTAL",
      field: "rubroPresupuestal",
      options: filteredProyectos
        .map((p) => ({
          value: p.rubro_atlas ?? "",
          label: p.rubro_atlas ?? "",
        }))
        .filter((v, i, a) => v.value && a.findIndex((t) => t.value === v.value) === i),
    },
    {
      label: "FONDO",
      field: "fondo",
      options: filteredProyectos
        .map((p) => ({
          value:
            p.codigo_del_fondo && p.nombre_del_fondo
              ? `${p.codigo_del_fondo}-${p.nombre_del_fondo}`
              : "",
          label:
            p.codigo_del_fondo && p.nombre_del_fondo
              ? `${p.codigo_del_fondo}-${p.nombre_del_fondo}`
              : "",
        }))
        .filter((v, i, a) => v.value && a.findIndex((t) => t.value === v.value) === i),
    },
    {
      label: "ELEMENTO PEP / PROYECTO",
      field: "elementoPep",
      options: filteredProyectos
        .map((p) => ({
          value: p.elemento_pep_proyecto,
          label: p.elemento_pep_proyecto,
        }))
        .filter((v, i, a) => v.value && a.findIndex((t) => t.value === v.value) === i),
    },
    {
      label: "CÓDIGO Y NOMBRE POSPRE",
      field: "codigoPospre",
      options: filteredProyectos
        .map((p) => ({
          value:
            p.codigo_pospre && p.nombre_pospre
              ? `${p.codigo_pospre}-${p.nombre_pospre}`
              : "",
          label:
            p.codigo_pospre && p.nombre_pospre
              ? `${p.codigo_pospre} - ${p.nombre_pospre}`
              : "",
        }))
        .filter((v, i, a) => v.value && a.findIndex((t) => t.value === v.value) === i),
    },
    {
      label: "CÓDIGO Y NOMBRE DANE",
      field: "codigoDane",
      options: filteredProyectos
        .map((p) => ({
          value:
            p.codigo_dane && p.nombre_codigo_dane
              ? `${p.codigo_dane}-${p.nombre_codigo_dane}`
              : "",
          label:
            p.codigo_dane && p.nombre_codigo_dane
              ? `${p.codigo_dane} - ${p.nombre_codigo_dane}`
              : "",
        }))
        .filter((v, i, a) => v.value && a.findIndex((t) => t.value === v.value) === i),
    },
    {
      label: "CODIGO Y NOMBRE ACTIVIDAD MGA",
      field: "actividadMGA",
      options: filteredProyectos
        .map((p) => ({
          value: p.codigo_actividad_mga && p.nombre_actividad_mga
            ? `${p.codigo_actividad_mga} - ${p.nombre_actividad_mga}`
            : "",
          label: p.codigo_actividad_mga && p.nombre_actividad_mga
            ? `${p.codigo_actividad_mga} - ${p.nombre_actividad_mga}`
            : "",
        }))
        .filter((v, i, a) => v.value && a.findIndex((t) => t.value === v.value) === i),
    },
    {
      label: "Valor $",
      field: "valor",
      type: "input",
    },
  ];

  // Set initial centroCostos value when projectName is set
  useEffect(() => {
    if (projectName && filteredProyectos.length > 0 && !formData.centroCostos) {
      const firstProyecto = filteredProyectos[0];
      const centroCostosValue = `${firstProyecto.codigo_del_centro_de_costos}-${firstProyecto.nombre_del_centro_de_costos}`;
      onChange("centroCostos", centroCostosValue);
    }
  }, [projectName, filteredProyectos, onChange, formData.centroCostos]);

  return (
    <>
      {fieldConfigs.map((field, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-[200px,1fr] border-b">
          <Label className="border-r p-4 font-semibold">{field.label}</Label>
          <div className="p-4">
            {field.type === "input" ? (
              <Input
                value={formData[field.field]}
                onChange={(e) => onChange(field.field, e.target.value)}
                className={`w-full h-10 border rounded focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  field.field === "valor" && validacionPresupuesto?.excedePresupuesto ? "border-red-500 text-red-500" : ""
                }`}
              />
            ) : (
              <Combobox
                value={formData[field.field]}
                options={field.options || []}
                onChange={(value) => onChange(field.field, value)}
                placeholder={`Seleccione ${field.label.toLowerCase()}`}
                className={`w-full ${
                  (projectName && field.field === "centroCostos") || 
                  (formData.objetoContrato && field.field !== "objetoContrato") 
                    ? "text-black cursor-not-allowed" 
                    : ""
                }`}
                disabled={
                  Boolean(
                    (projectName && field.field === "centroCostos") || 
                    (formData.objetoContrato && field.field !== "objetoContrato")
                  )
                }
              />
            )}
            {field.field === "valor" && validacionPresupuesto && (
              <div className="mt-2 space-y-1">
                {/* Información del presupuesto */}
                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    <strong>Presupuesto total:</strong> {formatCurrency(validacionPresupuesto.valorTotal)}
                  </div>
                  <div>
                    <strong>Ya comprometido:</strong> {formatCurrency(validacionPresupuesto.valorComprometido)}
                  </div>
                  <div className={validacionPresupuesto.presupuestoDisponible > 0 ? "text-green-600" : "text-red-600"}>
                    <strong>Disponible:</strong> {formatCurrency(validacionPresupuesto.presupuestoDisponible)}
                  </div>
                </div>
                
                {/* Alertas de validación */}
                {validacionPresupuesto.excedePresupuesto && (
                  <div className="text-red-500 text-sm space-y-1">
                    <p className="font-medium">⚠️ El valor solicitado excede el presupuesto disponible</p>
                    <p>Exceso: {formatCurrency(validacionPresupuesto.exceso)}</p>
                  </div>
                )}
                
                {validacionPresupuesto.presupuestoDisponible <= 0 && !validacionPresupuesto.excedePresupuesto && (
                  <p className="text-orange-500 text-sm font-medium">
                    ⚠️ Este proyecto no tiene presupuesto disponible
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default FormFields;
