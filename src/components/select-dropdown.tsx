import { IconLoader } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectDropdownProps {
  onValueChange?: (value: string) => void
  defaultValue?: string
  value?: string
  placeholder?: string
  isPending?: boolean
  items: { label: string; value: string }[] | undefined
  disabled?: boolean
  className?: string
  isControlled?: boolean
}

export function SelectDropdown({
  defaultValue,
  value,
  onValueChange,
  isPending,
  items,
  placeholder,
  disabled,
  className = '',
  //isControlled = false,
}: SelectDropdownProps) {
  const selectProps = value !== undefined
    ? { value, onValueChange }
    : { defaultValue, onValueChange }
  return (
    <Select {...selectProps}>
      <SelectTrigger disabled={disabled} className={cn(className)}>
        <SelectValue placeholder={placeholder ?? 'Select'} />
      </SelectTrigger>
      <SelectContent>
        {isPending ? (
          <SelectItem disabled value='loading' className='h-14'>
            <div className='flex items-center justify-center gap-2'>
              <IconLoader className='h-5 w-5 animate-spin' />
              {'  '}
              Loading...
            </div>
          </SelectItem>
        ) : (
          items?.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
