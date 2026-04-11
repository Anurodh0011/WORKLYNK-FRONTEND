import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { BACKEND_URL } from '@/src/helpers/config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatImageUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder-user.jpg';
  if (path.startsWith('http')) return path;
  
  // Remove leading slash if any
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${BACKEND_URL}/${cleanPath}`;
}
