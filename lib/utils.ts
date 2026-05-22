import { AnalysisResult, AnalysisInput } from './types';

export function encodeResult(result: AnalysisResult): string {
  return btoa(encodeURIComponent(JSON.stringify(result)));
}

export function decodeResult(encoded: string): AnalysisResult | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

export function encodeInput(input: AnalysisInput): string {
  return btoa(encodeURIComponent(JSON.stringify(input)));
}

export function decodeInput(encoded: string): AnalysisInput | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}
