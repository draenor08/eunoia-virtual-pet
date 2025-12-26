// src/components/Desk.tsx
import { IsoCube } from '../primitives/IsoCube';

type Props = { x: number; y: number; tileSize: number; };

export const Desk = ({ x, y, tileSize }: Props) => {
  const px = x * tileSize;
  const py = y * tileSize;
  const w = 4 * tileSize;
  const d = 2 * tileSize;

  return (
    <div style={{ transformStyle: 'preserve-3d' }}>
      {/* Left Cabinet Leg */}
      <IsoCube x={px} y={py} width={40} depth={d} height={40} color="#5D4037" />
      
      {/* Right Leg */}
      <IsoCube x={px + w - 15} y={py + d - 15} width={15} depth={15} height={40} color="#5D4037" />
      <IsoCube x={px + w - 15} y={py} width={15} depth={15} height={40} color="#5D4037" />

      {/* Desktop */}
      <IsoCube x={px} y={py} z={40} width={w} depth={d} height={4} color="#8D6E63" />

      {/* Laptop */}
      <IsoCube x={px + 60} y={py + 30} z={44} width={30} depth={20} height={2} color="#333" />
      {/* Laptop Screen (Open) */}
      <IsoCube x={px + 60} y={py + 30} z={46} width={2} depth={20} height={20} color="#111" />
    </div>
  );
};