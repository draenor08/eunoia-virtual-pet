import { IsoCube } from '../primitives/IsoCube';

type ChairProps = {
  x: number;
  y: number;
  tileSize: number;
};

export const Chair = ({ x, y, tileSize }: ChairProps) => {
  // Convert grid coords to pixels
  const px = x * tileSize;
  const py = y * tileSize;

  // Chair Dimensions
  const chairWidth = 35;
  const chairDepth = 35;
  const seatHeight = 25;
  const backHeight = 35;

  // Colors
  const woodColor = "#4E342E";
  const cushionColor = "#388E3C"; // Matches your rug/plant theme
  const castorColor = "#222";

  return (
    <div style={{ position: 'absolute', transformStyle: 'preserve-3d' }}>
      
      {/* --- LEGS (4 Posts) --- */}
      <IsoCube x={px + 5} y={py + 5} width={5} depth={5} height={seatHeight} color={woodColor} />
      <IsoCube x={px + chairWidth - 5} y={py + 5} width={5} depth={5} height={seatHeight} color={woodColor} />
      <IsoCube x={px + 5} y={py + chairDepth - 5} width={5} depth={5} height={seatHeight} color={woodColor} />
      <IsoCube x={px + chairWidth - 5} y={py + chairDepth - 5} width={5} depth={5} height={seatHeight} color={woodColor} />

      {/* --- CROSS BRACE (Wheels/Base) --- */}
      <IsoCube x={px + 5} y={py + 15} z={5} width={chairWidth - 5} depth={5} height={5} color={castorColor} />
      <IsoCube x={px + 15} y={py + 5} z={5} width={5} depth={chairDepth - 5} height={5} color={castorColor} />

      {/* --- SEAT CUSHION --- */}
      <IsoCube 
        x={px} 
        y={py} 
        z={seatHeight} 
        width={chairWidth} 
        depth={chairDepth} 
        height={8} 
        color={cushionColor} 
      />

      {/* --- BACKREST --- */}
      {/* Placed at the "High Y" and "High X" side to face the desk at (5, 4).
         This orients the chair towards the Top-Left of the screen (where the desk is).
      */}
      <IsoCube 
        x={px} 
        y={py + chairDepth - 5} // Pushed to the "back" (South-West side)
        z={seatHeight + 8} 
        width={chairWidth} 
        depth={5} 
        height={backHeight} 
        color={woodColor} 
      />
      
      {/* Backrest Cushion Detail */}
      <IsoCube 
        x={px + 5} 
        y={py + chairDepth - 8} 
        z={seatHeight + 15} 
        width={chairWidth - 10} 
        depth={3} 
        height={20} 
        color={cushionColor} 
      />

    </div>
  );
};