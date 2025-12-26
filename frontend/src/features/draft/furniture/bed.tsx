import { IsoCube } from '../primitives/IsoCube';

type BedProps = {
  x : number;
  y : number;
  tileSize: number;
};

export const Bed = ({ x, y, tileSize }: BedProps) => {
  // Calculate absolute pixel position
  const gridX = x * tileSize;
  const gridY = y * tileSize;
  
  // Dimensions based on your grid (5x3 tiles)
  const w = 5 * tileSize;
  const d = 3 * tileSize;

  return (
    <div style={{ position: 'absolute', transformStyle: 'preserve-3d' }}>
      
      {/* --- LEGS --- */}
      {/* We inset them slightly so they look realistic */}
      <IsoCube x={gridX + 10} y={gridY + 10} width={10} depth={10} height={15} color="#5D4037" />
      <IsoCube x={gridX + w - 20} y={gridY + 10} width={10} depth={10} height={15} color="#5D4037" />
      <IsoCube x={gridX + 10} y={gridY + d - 20} width={10} depth={10} height={15} color="#5D4037" />
      <IsoCube x={gridX + w - 20} y={gridY + d - 20} width={10} depth={10} height={15} color="#5D4037" />

      {/* --- WOODEN FRAME --- */}
      {/* Sits on top of legs (z=15) */}
      <IsoCube x={gridX} y={gridY} z={15} width={w} depth={d} height={10} color="#8D6E63" />

      {/* --- HEADBOARD --- */}
      {/* At the 'top' (low X or low Y depending on rotation, here we assume X is 'back') */}
      <IsoCube x={gridX} y={gridY} z={15} width={20} depth={d} height={40} color="#6D4C41" />

      {/* --- MATTRESS --- */}
      {/* Sits on frame (z = 15 + 10 = 25). Slightly smaller than frame. */}
      <IsoCube x={gridX + 20} y={gridY + 5} z={25} width={w - 25} depth={d - 10} height={12} color="#ECEFF1" />

      {/* --- BLANKET --- */}
      {/* Covers bottom half of mattress. Slightly wider to hang over? Let's keep it simple first. */}
      <IsoCube x={gridX + (w/2)} y={gridY + 4} z={37} width={(w/2) - 5} depth={d - 8} height={2} color="#3F51B5" />

      {/* --- PILLOW --- */}
      <IsoCube x={gridX + 30} y={gridY + 20} z={37} width={30} depth={50} height={8} color="#FFFFFF" />
      
    </div>
  );
};