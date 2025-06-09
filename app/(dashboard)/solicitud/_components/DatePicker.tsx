// components/DatePicker.tsx
"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
  fecha: string;
  onChange: (value: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ fecha, onChange }) => {
  return (
    <div className="p-4">
      <div className="font-semibold mb-2">Fecha de expedición</div>
      <Input
        type="date"
        value={fecha}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default DatePicker;
