"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormData } from "./InvestmentForm";

interface PDFViewProps {
  formData: FormData;
  signatureImage: string | null;
}

export default function PDFView({ formData, signatureImage }: PDFViewProps) {

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 print:p-4">
      <Card className="w-full border-2 shadow-none print:shadow-none">
        <CardHeader className="border-b p-4 print:p-2">
          <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4">
            <Image
              src="https://bkymchtifbcofloxcasr.supabase.co/storage/v1/object/public/images/organization_logos/16900bec-e2c8-4e97-b318-9fffce3870b1.png"
              alt="Logo Universidad"
              width={60}
              height={60}
              className="object-contain"
            />
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-800 leading-tight">
                CONCEPTO PARA EJECUCIÓN DE PROYECTOS DE INVERSIÓN
              </h1>
            </div>
            <div className="text-xs text-gray-600 text-right">
              <div className="font-semibold">Código: FPL12</div>
              <div>Versión 06</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Información del Proyecto */}
          <div className="border-b p-4 print:p-3">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Información del Proyecto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre del Proyecto:</label>
                <p className="text-gray-800 font-medium">{formData.nombreProyecto || "No especificado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Número de Contrato:</label>
                <p className="text-gray-800 font-medium">{formData.numeroContrato || "No especificado"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Objeto del Contrato:</label>
                <p className="text-gray-800 font-medium">{formData.objetoContrato || "No especificado"}</p>
              </div>
            </div>
          </div>

          {/* Información Presupuestal */}
          <div className="border-b p-4 print:p-3">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Información Presupuestal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Centro de Costos:</label>
                <p className="text-gray-800 font-medium">{formData.centroCostos || "No especificado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Rubro Presupuestal:</label>
                <p className="text-gray-800 font-medium">{formData.rubroPresupuestal || "No especificado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Elemento PEP:</label>
                <p className="text-gray-800 font-medium">{formData.elementoPep || "No especificado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Código POSPRE:</label>
                <p className="text-gray-800 font-medium">{formData.codigoPospre || "No especificado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Código DANE:</label>
                <p className="text-gray-800 font-medium">{formData.codigoDane || "No especificado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fondo:</label>
                <p className="text-gray-800 font-medium">{formData.fondo || "No especificado"}</p>
              </div>
              {formData.actividadMGA && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Actividad MGA:</label>
                  <p className="text-gray-800 font-medium">{formData.actividadMGA}</p>
                </div>
              )}
            </div>
          </div>

          {/* Valor Solicitado */}
          <div className="border-b p-4 print:p-3">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Valor Solicitado</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-800">{formData.valor}</p>
              <p className="text-sm text-green-600 mt-1">Valor solicitado para la ejecución</p>
            </div>
          </div>

          {/* Información del Solicitante */}
          <div className="border-b p-4 print:p-3">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Información del Solicitante</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre del Solicitante:</label>
                <p className="text-gray-800 font-medium">{formData.nombreSolicitante || "No especificado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Cargo:</label>
                <p className="text-gray-800 font-medium">{formData.cargo || "No especificado"}</p>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          {formData.observacion && (
            <div className="border-b p-4 print:p-3">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Observaciones</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{formData.observacion}</p>
              </div>
            </div>
          )}

          {/* Firmas y Fecha */}
          <div className="p-4 print:p-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Elaborado por */}
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">ELABORADO POR:</h3>
                <div className="border-t-2 border-gray-300 pt-2 mt-12">
                  <p className="text-sm font-medium">{formData.elaboroNombre || "___________________"}</p>
                  <p className="text-xs text-gray-600">{formData.elaboroCargo || "Cargo"}</p>
                </div>
              </div>

              {/* Firma */}
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">FIRMA:</h3>
                <div className="h-20 flex items-center justify-center mb-4">
                  {signatureImage ? (
                    <Image
                      src={signatureImage}
                      alt="Firma"
                      width={120}
                      height={60}
                      className="object-contain max-h-16"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">Sin firma</div>
                  )}
                </div>
                <div className="border-t-2 border-gray-300 pt-2">
                  <p className="text-sm font-medium">{formData.firmaNombre || "___________________"}</p>
                  <p className="text-xs text-gray-600">{formData.firmaCargo || "Cargo"}</p>
                </div>
              </div>

              {/* Fecha */}
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">FECHA DE EXPEDICIÓN:</h3>
                <div className="border-t-2 border-gray-300 pt-2 mt-12">
                  <p className="text-sm font-medium">
                    {formData.fechaExpedicion ? formatDate(formData.fechaExpedicion) : "No especificada"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 