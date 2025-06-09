// components/Observations.tsx
"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface ObservationsProps {
  value: string;
  onChange: (value: string) => void;
}

const Observations: React.FC<ObservationsProps> = ({ value, onChange }) => {
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
    onChange(target.value);
  };

  return (
    <div className="p-4 border-b">
      <div className="font-semibold mb-2">
        Descripción de la forma como el bien o servicio contribuye con el logro de los objetivos y de las metas del proyecto
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onInput={handleInput}
        className="w-full min-h-[100px] p-2 border rounded"
        placeholder="Ingrese observaciones..."
      />
    </div>
  );
};

export default Observations;
