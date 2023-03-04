import { useAuthStore } from '@/stores/auth';

export function prettyPrint(input: string, length: number, firstCut: number, secondCut: number) {
  if (input.length > length) {
    return input.substring(0, firstCut) + "..." + input.slice(secondCut)
  } else {
    return input;
  }
}

export function checkIfEmail() {
  if (useAuthStore().user?.provider == 'mailto') {
    return true;
  } else {
    return false;
  }
}

export function checkClaimer(provider: string) {
  if (provider == "mailto") {
    return true;
  } else {
    return false;
  }
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}