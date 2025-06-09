// components/SignatureUploader.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface SignatureUploaderProps {
  signatureImage: string | null;
  onUpload: (img: string) => void;
  firmaNombre: string;
  firmaCargo: string;
  onChange: (field: "firmaNombre" | "firmaCargo", value: string) => void;
}

const SignatureUploader: React.FC<SignatureUploaderProps> = ({
  signatureImage,
  onUpload,
  firmaNombre,
  firmaCargo,
  onChange,
}) => {
  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-r p-4">
      <div className="font-semibold mb-2">Firma</div>
      <div className="h-20 border rounded mb-2 relative overflow-hidden">
        {signatureImage ? (
          <Image src={signatureImage} alt="Firma" fill style={{ objectFit: "contain" }} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Upload size={24} />
            <span className="ml-2">Subir firma</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleSignatureUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Subir imagen de firma"
        />
      </div>
      <Input
        placeholder="Nombre"
        className="mb-2"
        value={firmaNombre}
        onChange={(e) => onChange("firmaNombre", e.target.value)}
      />
      <Input
        placeholder="Cargo"
        value={firmaCargo}
        onChange={(e) => onChange("firmaCargo", e.target.value)}
      />
    </div>
  );
};

export default SignatureUploader;
