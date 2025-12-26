import { useState, useEffect, useRef } from 'react';
import { type CharacterAction, type Position, type Direction } from './types';
import { IsoCube } from './primitives/IsoCube';
import { Bed } from './furniture/bed';
import { Desk } from './furniture/desk';
import { Chair } from './furniture/Chair';
import { CharacterModel } from './Character';
import { SpeechBubble } from './speechBubble';
import { ROOM_ITEMS, TILE_SIZE, GRID_SIZE } from './roomConfig';

// Props passed from Dashboard
type IsometricRoomProps = {
  targetPos: Position | null; // Where the API wants us to go
  forcedAction: CharacterAction; // What to do when we get there
  speechText: string; // What to say
};

const IsometricRoom = ({ targetPos, forcedAction, speechText }: IsometricRoomProps) => {
  // Internal State for smoothness
  const [currentPos, setCurrentPos] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Direction>('right');
  const [isMoving, setIsMoving] = useState(false);
  
  // We use a ref for the movement loop to avoid dependency hell
  const posRef = useRef(currentPos);
  
  // --- THE MOVEMENT ENGINE ---
  useEffect(() => {
    if (!targetPos) return;

    // Simple pathfinding: Move X, then Move Y (Manhattan movement)
    const moveStep = () => {
      const { x: currX, y: currY } = posRef.current;
      const { x: targetX, y: targetY } = targetPos;

      // Tolerance check (are we there yet?)
      if (Math.abs(currX - targetX) < 0.1 && Math.abs(currY - targetY) < 0.1) {
        setIsMoving(false);
        setCurrentPos(targetPos); // Snap to exact finish
        return; 
      }

      setIsMoving(true);
      let nextX = currX;
      let nextY = currY;
      let newDir = direction;

      // Move logic (0.05 is the speed)
      const speed = 0.05;

      if (Math.abs(currX - targetX) > 0.1) {
        // Move along X axis first
        if (currX < targetX) { nextX += speed; newDir = 'down'; } // Visual Down-Right
        else { nextX -= speed; newDir = 'up'; } // Visual Up-Left
      } else {
        // Then move along Y axis
        if (currY < targetY) { nextY += speed; newDir = 'right'; } // Visual Down-Left
        else { nextY -= speed; newDir = 'left'; } // Visual Up-Right
      }

      setDirection(newDir as Direction);
      
      // Update State
      const newPos = { x: nextX, y: nextY };
      setCurrentPos(newPos);
      posRef.current = newPos;

      requestAnimationFrame(moveStep);
    };

    requestAnimationFrame(moveStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPos]); 


  // --- RENDER HELPERS ---
  // Determine what animation to play:
  // If moving -> 'walking'. If arrived -> use the prop from API (forcedAction).
  const displayedAction = isMoving ? 'walking' : forcedAction;

  return (
    <div className="w-full h-full overflow-hidden bg-[#b8e3ea] flex items-center justify-center relative">
      
      {/* 3D SCENE CONTAINER */}
      <div
        className="relative transition-transform duration-500 ease-out"
        style={{
          transform: `perspective(3000px) rotateX(60deg) rotateZ(-45deg) translateY(0px)`,
          transformStyle: 'preserve-3d',
          width: `${GRID_SIZE * TILE_SIZE}px`,
          height: `${GRID_SIZE * TILE_SIZE}px`,
        }}
      >
        {/* FLOOR */}
        <div className="absolute inset-0 bg-[#E5C29F] border-8 border-[#c69566]" />

        {/* ITEMS */}
        {ROOM_ITEMS.map((item) => {
          if (item.type === 'bed') return <Bed key={item.id} x={item.x} y={item.y} tileSize={TILE_SIZE} />;
          if (item.type === 'desk') return <Desk key={item.id} x={item.x} y={item.y} tileSize={TILE_SIZE} />;
          if (item.type === 'chair') return <Chair key={item.id} x={item.x} y={item.y} tileSize={TILE_SIZE} />;
          if (item.type === 'rug') {
            return <IsoCube key={item.id} x={item.x * TILE_SIZE} y={item.y * TILE_SIZE} z={1} width={item.w * TILE_SIZE} depth={item.h * TILE_SIZE} height={2} color="#C8E6C9" />
          }
          return null;
        })}

        {/* CHARACTER CONTAINER */}
        <div
          style={{
            position: 'absolute',
            left: currentPos.x * TILE_SIZE, 
            top: currentPos.y * TILE_SIZE,
            zIndex: 100 + Math.floor(currentPos.x + currentPos.y), // Dynamic Z-Index
            pointerEvents: 'none',
            transformStyle: 'preserve-3d',
            willChange: 'left, top'
          }}
        >
          {/* COUNTER-ROTATION WRAPPER:
              This un-does the room rotation so the character and bubble face the screen.
          */}
          <div style={{ transform: 'rotateZ(45deg) rotateX(-60deg) translate(-25%, -75%)' }}>
            
            {/* SPEECH BUBBLE */}
            <SpeechBubble text={speechText} isVisible={!!speechText && !isMoving} />

            {/* THE CHARACTER */}
            <CharacterModel action={displayedAction} direction={direction} />
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default IsometricRoom;