"use client";

interface ColorSwatchProps {
  hex: string;
  children: React.ReactNode;
}

export function ColorSwatch({ hex, children }: ColorSwatchProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-3 w-3 rounded-sm border border-black/20 shadow-sm dark:border-white/20"
        style={{ backgroundColor: hex }}
      />
      {children}
    </span>
  );
}

