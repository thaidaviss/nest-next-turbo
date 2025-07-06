'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options..."
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (option: string) => {
    onChange(selected.filter((s) => s !== option));
  };

  const handleSelect = (option: string) => {
    onChange([...selected, option]);
  };

  const selectedOptions = options.filter((option) => selected.includes(option.value));

  return (
    <div className="relative">
      <div
        className="relative flex min-h-10 w-full flex-wrap items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        onClick={() => setOpen(true)}
      >
        {selectedOptions.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((option) => (
              <Badge key={option.value} variant="secondary" className="mr-1 mb-1">
                {option.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option.value);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option.value)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </div>
      <Command
        className={`absolute top-full z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-md ${
          open ? "block" : "hidden"
        }`}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      >
        <CommandInput
          value={inputValue}
          onValueChange={setInputValue}
          placeholder="Search options..."
          className="border-none focus:ring-0"
        />
        <CommandEmpty>No options found.</CommandEmpty>
        <CommandGroup>
          {options
            .filter((option) => 
              option.label.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((option) => {
              const isSelected = selected.includes(option.value);
              
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    if (isSelected) {
                      handleUnselect(option.value);
                    } else {
                      handleSelect(option.value);
                    }
                    setInputValue("");
                  }}
                  className="flex items-center justify-between px-4 py-2 cursor-pointer"
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-green-600" />}
                </CommandItem>
              );
            })}
        </CommandGroup>
      </Command>
    </div>
  );
}
