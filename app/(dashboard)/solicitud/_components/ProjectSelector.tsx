import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Proyecto, FormData } from "./InvestmentForm";

interface ProjectSelectorProps {
  proyectos: Proyecto[];
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  onUpdateProject: (proyecto: Proyecto) => void;
}

export default function ProjectSelector({
  proyectos,
  formData,
  onChange,
  onUpdateProject,
}: ProjectSelectorProps) {
  // Genera opciones únicas para proyecto y objeto
  const projectOptions = Array.from(
    new Set(proyectos.map((p) => p.nombre_del_proyecto))
  ).map((p) => ({ value: p, label: p }));

  // Filtra los objetos basados en el centro de costos seleccionado
  const objectOptions = formData.centroCostos
    ? Array.from(
        new Set(
          proyectos
            .filter(p => `${p.codigo_del_centro_de_costos}-${p.nombre_del_centro_de_costos}` === formData.centroCostos)
            .map((p) => p.objeto)
        )
      )
        .filter(Boolean)
        .map((o) => ({
          value: o,
          label: o,
        }))
    : Array.from(new Set(proyectos.map((p) => p.objeto)))
        .filter(Boolean)
        .map((o) => ({
          value: o,
          label: o,
        }));

  return (
    <div className="grid border-b">
      {/* Nombre del Proyecto */}
      <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] border-b">
        <Label className="border-r p-4 font-semibold">Nombre del Proyecto</Label>
        <div className="p-4">
          <Combobox
            value={formData.nombreProyecto}
            options={projectOptions}
            onChange={(value) => onChange("nombreProyecto", value)}
            placeholder="Seleccione el proyecto"
            className="w-full"
          />
        </div>
      </div>
      {/* Objeto y número de contrato */}
      <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] border-b">
        <Label className="border-r p-4 font-semibold">OBJETO</Label>
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-2 mb-2">
            <span className="flex items-center">Adición al contrato N°</span>
            <Input
              value={formData.numeroContrato}
              onChange={(e) => onChange("numeroContrato", e.target.value)}
              className="w-full md:w-32"
            />
          </div>
          <Combobox
            value={formData.objetoContrato}
            options={objectOptions}
            onChange={(value) => onChange("objetoContrato", value)}
            placeholder="Seleccione el objeto del contrato"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
