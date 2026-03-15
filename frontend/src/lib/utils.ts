import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function unescapeHtml(text: string): string {
    if (!text) return text;
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.documentElement.textContent || text;
}
