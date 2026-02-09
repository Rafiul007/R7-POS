import { useEffect, useRef } from 'react';

interface BarcodeScannerOptions {
  enabled: boolean;
  onScan: (code: string) => void;
  minLength?: number;
  timeoutMs?: number;
  captureWhenFocused?: boolean;
}

const isEditableElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  const isInput =
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    target.isContentEditable;
  return isInput;
};

export const useBarcodeScanner = ({
  enabled,
  onScan,
  minLength = 4,
  timeoutMs = 100,
  captureWhenFocused = false,
}: BarcodeScannerOptions) => {
  const bufferRef = useRef('');
  const lastKeyTimeRef = useRef(0);

  useEffect(() => {
    if (!enabled) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      if (!captureWhenFocused && isEditableElement(event.target)) return;

      const now = Date.now();
      const delta = now - lastKeyTimeRef.current;
      lastKeyTimeRef.current = now;

      if (event.key === 'Enter') {
        const barcode = bufferRef.current.trim();
        bufferRef.current = '';
        if (barcode.length >= minLength) {
          onScan(barcode);
        }
        return;
      }

      if (event.key.length !== 1) return;

      if (delta > timeoutMs) {
        bufferRef.current = '';
      }
      bufferRef.current += event.key;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onScan, minLength, timeoutMs, captureWhenFocused]);
};
