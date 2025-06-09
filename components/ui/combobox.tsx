// components/combobox.tsx

"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Option {
  value: string
  label: string
}

interface ComboboxProps {
  options: Option[]
  placeholder: string
  className?: string
  value: string
  onChange?: (value: string) => void
  disabled?: boolean
}

export function Combobox({ options, placeholder, className, value, onChange, disabled }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (currentValue: string) => {
    if (disabled) return;
    const newValue = currentValue === value ? "" : currentValue
    onChange?.(newValue)
    setOpen(false)
  }

  return (
    <Popover open={open && !disabled} onOpenChange={(newOpen) => !disabled && setOpen(newOpen)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between min-h-[2.5rem] h-auto py-2 w-full",
            "items-start",
            disabled && "text-black cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          <span className="whitespace-normal break-words text-left line-clamp-2">
            {value
              ? options.find((option) => option.value === value)?.label ?? value
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full max-w-[300px] p-0" 
        align="start"
      >
        <Command className="max-h-[300px] overflow-y-auto">
          <CommandInput placeholder={`Buscar ${placeholder.toLowerCase()}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontraron opciones.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center gap-2 whitespace-normal break-words py-2"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="line-clamp-2">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
