'use client'

import { useMemo, useState } from 'react'
import clsx from 'clsx'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
} from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'

import { municipalities, MunicipalityName } from '@/constants/municipalities'

interface MunicipalitySearchProps {
  value: MunicipalityName | null
  onChange: (name: MunicipalityName) => void
}

const sortedMunicipalities = [...municipalities].sort((a, b) =>
  a.localeCompare(b)
)

export default function MunicipalitySearch({
  value,
  onChange,
}: MunicipalitySearchProps) {
  const [query, setQuery] = useState<string>(value || '')

  const filteredMunicipalities = useMemo(() => {
    if (!query) return sortedMunicipalities
    const lower = query.toLowerCase()
    return sortedMunicipalities.filter((name) =>
      name.toLowerCase().startsWith(lower)
    )
  }, [query])

  const handleOnChange = (value: MunicipalityName) => {
    onChange(value)
    setQuery(value)
  }

  return (
    <Field>
      <Label>Kommun</Label>
      <Combobox value={query} onClose={() => setQuery('')}>
        <div className="relative">
          <ComboboxInput
            className={clsx(
              'w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white',
              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
            )}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className={clsx(
            'w-(--input-width) rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] empty:invisible',
            'transition duration-100 ease-in-out data-leave:data-closed:opacity-0'
          )}
        >
          {filteredMunicipalities.map((municipality) => (
            <ComboboxOption
              key={municipality}
              value={municipality}
              onClick={() => handleOnChange(municipality)}
              className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
            >
              <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
              <div className="text-sm/6 text-white">{municipality}</div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </Field>
  )
}
