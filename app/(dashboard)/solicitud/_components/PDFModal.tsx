"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileDown, Eye } from "lucide-react";
import PDFView from "./PDFView";
import { FormData } from "./InvestmentForm";

interface PDFModalProps {
  formData: FormData;
  signatureImage: string | null;
  children?: React.ReactNode;
}

export default function PDFModal({ formData, signatureImage, children }: PDFModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (printRef.current) {
      // Crear una nueva ventana para imprimir
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        // Obtener el HTML de la vista previa
        const content = printRef.current.innerHTML;
        
        // Escribir el contenido en la nueva ventana
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Concepto para Ejecución de Proyectos de Inversión</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
              <style>
                @media print {
                  body { margin: 0; }
                  * { print-color-adjust: exact; }
                  .print\\:p-4 { padding: 1rem !important; }
                  .print\\:shadow-none { box-shadow: none !important; }
                }
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                  margin: 0;
                  padding: 0;
                }
              </style>
            </head>
            <body>
              ${content}
            </body>
          </html>
        `);
        
        printWindow.document.close();
        
        // Esperar a que se cargue y luego imprimir
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);
        };
      }
    }
  };

  const validateFormData = (): boolean => {
    return !!(
      formData.objetoContrato && 
      formData.valor && 
      formData.valor !== "$ 0" &&
      formData.nombreSolicitante &&
      formData.fechaExpedicion
    );
  };

  const isValid = validateFormData();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            disabled={!isValid}
            className="mr-2"
            title={!isValid ? "Complete los campos obligatorios para generar el PDF" : "Ver vista previa y exportar PDF"}
          >
            <Eye className="mr-2 h-4 w-4" />
            Vista Previa PDF
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[98vw] w-[98vw] max-h-[95vh] sm:max-w-[98vw] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Vista Previa - Concepto de Inversión</DialogTitle>
            <div className="flex gap-2">
              <Button 
                onClick={handleDownloadPDF}
                className="bg-green-600 hover:bg-green-700"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="overflow-auto max-h-[calc(95vh-100px)]">
          <div ref={printRef}>
            <PDFView formData={formData} signatureImage={signatureImage} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 