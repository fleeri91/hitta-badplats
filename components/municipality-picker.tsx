'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import {
  municipalities,
  type MunicipalityName,
} from '@/constants/municipalities'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

export function MunicipalityPicker({
  value,
  onChange,
}: {
  value: MunicipalityName
  onChange: (municipality: MunicipalityName) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center gap-2.25 rounded-xl border border-[#d7e6ea] bg-white px-3.5 py-2.5 text-[15px] text-[#16323d] min-w-55">
        <Search size={15} className="text-[#9db8c0]" />
        <span className="flex-1 text-left">{value}</span>
      </PopoverTrigger>
      <PopoverContent className="w-65 p-0" align="start">
        <Command>
          <CommandInput placeholder="Sök kommun…" />
          <CommandList>
            <CommandEmpty>Ingen kommun hittades.</CommandEmpty>
            <CommandGroup>
              {municipalities.map((m) => (
                <CommandItem
                  key={m}
                  value={m}
                  onSelect={() => {
                    onChange(m)
                    setOpen(false)
                  }}
                >
                  {m}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
