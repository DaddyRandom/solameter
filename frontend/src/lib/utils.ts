import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, decimals: number = 2): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(decimals) + 'B'
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals) + 'M'
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(decimals) + 'K'
  }
  return num.toFixed(decimals)
}

export function formatCurrency(num: number, decimals: number = 2): string {
  return '$' + formatNumber(num, decimals)
}

export function formatPercentage(num: number, decimals: number = 1): string {
  const sign = num >= 0 ? '+' : ''
  return sign + num.toFixed(decimals) + '%'
}
