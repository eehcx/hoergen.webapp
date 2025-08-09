import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
    label: string
    value: string
}

interface MultiSelectProps {
    options: Option[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    label?: string
    disabled?: boolean
    className?: string
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    label,
    disabled,
    className = '',
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')

    const filtered = React.useMemo(
        () =>
        options.filter(
            (opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase()) ||
            opt.value.toLowerCase().includes(search.toLowerCase())
        ),
        [options, search]
    )

    const handleSelect = (val: string) => {
        if (value.includes(val)) {
        onChange(value.filter((v) => v !== val))
        } else {
        onChange([...value, val])
        }
    }

    return (
        <div className={cn('w-full', className)}>
        {label && <div className="mb-1 text-sm font-medium">{label}</div>}
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
            <button
                type="button"
                disabled={disabled}
                className={cn(
                'flex min-h-[40px] w-full items-center justify-between rounded-xs border bg-background px-3 py-2 text-sm shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                'bg-background',
                disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <div className="flex flex-wrap gap-1">
                {value.length === 0 ? (
                    <span className="text-muted-foreground">{placeholder}</span>
                ) : (
                    value.map((val) => {
                    const opt = options.find((o) => o.value === val)
                    return (
                        <span
                        key={val}
                        className="inline-flex items-center rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground mr-1"
                        >
                        {opt?.label || val}
                        <button
                            type="button"
                            className="ml-1 text-xs text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                            e.stopPropagation()
                            onChange(value.filter((v) => v !== val))
                            }}
                            aria-label="Remove"
                        >
                            ×
                        </button>
                        </span>
                    )
                    })
                )}
                </div>
                <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
            </button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-2 bg-background border border-border shadow-xl" align="start">
            <input
                type="text"
                className="mb-2 w-full rounded border px-2 py-1 text-sm outline-none"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
            />
            <div className="max-h-48 overflow-y-auto">
                {filtered.length === 0 && (
                <div className="p-2 text-sm text-muted-foreground">No options</div>
                )}
                {filtered.map((opt) => (
                <button
                    type="button"
                    key={opt.value}
                    className={cn(
                    'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent',
                    value.includes(opt.value) && 'bg-accent/50'
                    )}
                    onClick={() => handleSelect(opt.value)}
                >
                    <span className="flex items-center gap-2">
                    <CheckIcon
                        className={cn(
                        'h-4 w-4',
                        value.includes(opt.value) ? 'opacity-100 text-primary' : 'opacity-0'
                        )}
                    />
                    {opt.label}
                    </span>
                </button>
                ))}
            </div>
            </PopoverContent>
        </Popover>
        </div>
    )
}
