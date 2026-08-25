'use client'

import { useTheme } from '@/components/theme-provider'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  let currentTheme: 'light' | 'dark' | 'system' = 'dark'
  try {
    const t = useTheme()
    currentTheme = t?.resolvedTheme || 'dark'
  } catch {
    currentTheme = 'dark'
  }

  return (
    <Sonner
      theme={currentTheme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

