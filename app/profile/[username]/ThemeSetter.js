'use client';

import { useEffect } from 'react';

export default function ThemeSetter({ accentColor, accentRgb, accentDark, accentText }) {
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--accent-color-rgb', accentRgb);
    document.documentElement.style.setProperty('--accent-dark', accentDark);
    document.documentElement.style.setProperty('--accent-text', accentText);
  }, [accentColor, accentRgb, accentDark, accentText]);

  return null;
}
