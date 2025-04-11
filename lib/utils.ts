import { clsx, type ClassValue } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ensureStartsWith = (stringToCheck: string, startsWith: string) => {
  return stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;
};

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString= `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`
};

/**
 * Normalizes a string by:
 * - lowercasing
 * - removing diacritics (accents)
 * - trimming spaces
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD") // separate base characters and diacritics
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/\s+/g, " ") // normalize spaces
    .trim();
}
