import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that merges multiple class names together. It uses the
 * {@link https://github.com/lukeed/clsx | clsx} library under the hood.
 *
 * @param inputs - A list of class names to merge.
 * @returns The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
