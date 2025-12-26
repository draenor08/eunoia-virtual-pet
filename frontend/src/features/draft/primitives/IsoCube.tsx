import React from 'react';
export type IsoCubeProps = {
  width: number;  // Size along X axis
  depth: number;  // Size along Y axis
  height: number; // Size along Z axis (Height)
  x: number;      // Position X
  y: number;      // Position Y
  z?: number;     // Position Z (Elevation)
  color: string;  // Base hex color
  opacity?: number;
};

export const IsoCube = React.memo(({ 
  width, depth, height, 
  x, y, z = 0, 
  color, opacity = 1 
}: IsoCubeProps) => {

  const colorTop = `color-mix(in srgb, ${color}, white 15%)`;
  const colorSide = `color-mix(in srgb, ${color}, black 20%)`;

  // SHARED BORDER STYLE: Adds definition between blocks
  const borderStyle = '1px solid rgba(0,0,0,0.1)';

  return (
    <div
      style={{
        position: 'absolute',
        width: `${width}px`,
        height: `${depth}px`,
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
        transformStyle: 'preserve-3d',
        pointerEvents: 'none',
        opacity: opacity,
      }}
    >
      {/* TOP FACE */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        backgroundColor: colorTop,
        transform: `translateZ(${height}px)`,
        border: borderStyle, // Add border
        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.05)',
      }} />

      {/* FRONT FACE */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: '100%', height: `${height}px`,
        backgroundColor: color,
        transformOrigin: 'bottom',
        transform: `rotateX(90deg) translateZ(0)`,
        border: borderStyle, // Add border
      }} />

      {/* SIDE FACE */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: `${height}px`, height: '100%',
        backgroundColor: colorSide,
        transformOrigin: 'left',
        transform: `rotateY(-90deg) translateZ(0)`,
        border: borderStyle, // Add border
      }} />
    </div>
  );
});