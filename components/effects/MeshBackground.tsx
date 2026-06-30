"use client";

export function MeshBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="mesh-gradient absolute -left-1/4 -top-1/4 h-[70%] w-[70%] rounded-full opacity-60" />
      <div className="mesh-gradient-2 absolute -bottom-1/4 -right-1/4 h-[60%] w-[60%] rounded-full opacity-50" />
      <div className="grain-overlay absolute inset-0" />
    </div>
  );
}