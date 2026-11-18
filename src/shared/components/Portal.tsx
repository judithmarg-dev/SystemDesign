import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: ReactNode;
  /** Element to render into. Defaults to `document.body`. */
  container?: Element | null;
  /** Render children in place instead of portaling. */
  disabled?: boolean;
}

export function Portal({ children, container, disabled = false }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (disabled) return <>{children}</>;
  if (!mounted) return null;
  return createPortal(children, container ?? document.body);
}
