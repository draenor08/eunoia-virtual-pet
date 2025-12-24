import React, { useState, useEffect, useCallback } from 'react';

// --- Types ---
type Position = { x: number; y: number };
type CharacterAction = 'idle' | 'walking' | 'sitting' | 'sleeping' | 'drinking';
type Direction = 'left' | 'right' | 'up' | 'down';

// Updated DecorItem to handle interactions
type DecorItem = {
  id: string;
  type: 'plant' | 'rug' | 'desk' | 'chair' | 'bed' | 'tableItem';
  x: number;
  y: number;
  w: number; 
  h: number;
  zIndexBase: number;
  isSolid: boolean;
  interactionPoint?: Position; // Where you must stand to interact
  interactionType?: CharacterAction;
};

const IsometricRoom = () => {
  // --- 1. STATE ---
  const [charPos, setCharPos] = useState<Position>({ x: 10, y: 10 });
  // Track what the character is currently doing
  const [charAction, setCharAction] = useState<CharacterAction>('idle');
  // Track direction for sprite orientation and interaction checking
  const [direction, setDirection] = useState<Direction>('right');
  const [showInteractPrompt, setShowInteractPrompt] = useState<string | null>(null);

  // --- 2. CONFIGURATION & ITEMS ---
  const gridSize = 20; 
  const tileSize = 60; 

  // Define the room contents with interaction data
  const items: DecorItem[] = [
    // The Rug (Not solid)
    { id: 'rug', type: 'rug', x: 7, y: 7, w: 6, h: 5, zIndexBase: 1, isSolid: false },

    // THE DESK & DRINK (Interaction: Drinking)
    // We define the interaction point 1 tile "below" the desk
    { id: 'desk', type: 'desk', x: 7, y: 6, w: 4, h: 2, zIndexBase: 20, isSolid: true, 
      interactionPoint: {x: 8, y: 8}, interactionType: 'drinking' },
    
    // THE CHAIR (Interaction: Sitting)
    // Interaction point is the tile adjacent to it
    { id: 'chair', type: 'chair', x: 11, y: 8, w: 1, h: 1, zIndexBase: 22, isSolid: true,
      interactionPoint: {x: 11, y: 9}, interactionType: 'sitting' },

    // THE BED (Interaction: Sleeping)
    { id: 'bed', type: 'bed', x: 14, y: 5, w: 3, h: 5, zIndexBase: 15, isSolid: true,
      interactionPoint: {x: 13, y: 7}, interactionType: 'sleeping' },
    
    // Plants (Just solid obstacles)
    { id: 'plant1', type: 'plant', x: 5, y: 12, w: 1, h: 1, zIndexBase: 30, isSolid: true },
  ];

  // --- 3. LOGIC: Movement & Collision ---

  const isWalkable = useCallback((targetX: number, targetY: number) => {
    // 1. Check Room Boundaries (visible area approx 2 to 18)
    if (targetX < 2 || targetX > 18 || targetY < 2 || targetY > 18) return false;

    // 2. Check Solid Furniture boundaries
    for (const item of items.filter(i => i.isSolid)) {
      // Simple AABB collision detection
      if (
        targetX >= item.x && targetX < item.x + item.w &&
        targetY >= item.y && targetY < item.y + item.h
      ) {
        return false; // Collision detected
      }
    }
    return true;
  }, []);

  // Check if current position allows for interaction
  useEffect(() => {
    if (charAction !== 'idle' && charAction !== 'walking') {
        setShowInteractPrompt(null);
        return;
    }

    const interactable = items.find(item => 
        item.interactionPoint && 
        item.interactionPoint.x === charPos.x && 
        item.interactionPoint.y === charPos.y
    );

    if (interactable) {
        setShowInteractPrompt(`Press SPACE to ${interactable.interactionType}`);
    } else {
        setShowInteractPrompt(null);
    }
  }, [charPos, charAction]);


  // --- 4. LOGIC: Input Handling ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // --- INTERACTION HANDLING (Spacebar) ---
      if (e.code === 'Space') {
        e.preventDefault();
        
        // If already doing something, stop doing it.
        if (charAction !== 'idle' && charAction !== 'walking') {
            setCharAction('idle');
            // Optional: Nudge them off the object so they don't clip
            setCharPos(prev => ({...prev, y: prev.y + 1})); 
            return;
        }

        // Check if standing on an interaction point
        const interactItem = items.find(i => 
            i.interactionPoint?.x === charPos.x && 
            i.interactionPoint?.y === charPos.y
        );

        if (interactItem && interactItem.interactionType) {
            // Start the action!
            setCharAction(interactItem.interactionType);

            // Special positioning for sitting/sleeping to look right
            if (interactItem.interactionType === 'sitting') {
                 // Snap to chair position
                 setCharPos({ x: interactItem.x, y: interactItem.y });
            }
            if (interactItem.interactionType === 'sleeping') {
                 // Snap to middle of bed
                 setCharPos({ x: interactItem.x + 1, y: interactItem.y + 2 });
            }
        }
        return;
      }

      // --- MOVEMENT HANDLING ---
      // If currently interacting (sitting/sleeping), any move key cancels the action
      if (charAction === 'sitting' || charAction === 'sleeping' || charAction === 'drinking') {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
            setCharAction('idle');
            // Nudge away to prevent immediate re-trigger or clipping
            let nudgeX = charPos.x;
            let nudgeY = charPos.y;
            if(direction === 'up') nudgeX++; else nudgeX--;
            if(direction === 'left') nudgeY++; else nudgeY--;
            if(isWalkable(nudgeX, nudgeY)) setCharPos({x: nudgeX, y: nudgeY});
            return;
        }
      }

      let newX = charPos.x;
      let newY = charPos.y;
      let newDir = direction;

      // Isometric movement mapping
      if (e.key === 'ArrowUp' || e.key === 'w') { newX -= 1; newDir = 'up'; }
      if (e.key === 'ArrowDown' || e.key === 's') { newX += 1; newDir = 'down'; }
      if (e.key === 'ArrowLeft' || e.key === 'a') { newY -= 1; newDir = 'left'; }
      if (e.key === 'ArrowRight' || e.key === 'd') { newY += 1; newDir = 'right'; }

      if (newX !== charPos.x || newY !== charPos.y) {
        setDirection(newDir);
        if (isWalkable(newX, newY)) {
          setCharPos({ x: newX, y: newY });
          setCharAction('walking');
          // Stop walking animation shortly after key press stops
          setTimeout(() => setCharAction(prev => prev === 'walking' ? 'idle' : prev), 200);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [charPos, charAction, direction, isWalkable]);


  // --- 5. RENDER ---
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#b8e3ea] flex items-center justify-center relative select-none">
      
      {/* UI Prompts */}
      <div className="absolute top-10 flex flex-col items-center z-50 font-bold text-[#5c4b43] bg-white/80 p-4 rounded-xl shadow-md backdrop-blur-sm">
        <div>Arrows to walk. Space to interact.</div>
        {showInteractPrompt && (
            <div className="mt-2 text-indigo-600 animate-pulse bg-indigo-100 px-3 py-1 rounded-md">
                {showInteractPrompt}
            </div>
        )}
      </div>

      {/* THE ISOMETRIC VIEWPORT */}
      <div 
        className="relative transition-transform duration-500 ease-out"
        style={{
          // Standard isometric rotation
          transform: `perspective(3000px) rotateX(60deg) rotateZ(-45deg) translateY(150px) translateX(100px)`,
          transformStyle: 'preserve-3d',
          width: `${gridSize * tileSize}px`,
          height: `${gridSize * tileSize}px`,
        }}
      >
        {/* Floor & Walls (Hidden for brevity, assumes same as previous code) */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 shadow-2xl bg-[#E5C29F]" style={{transform: 'translateZ(-1px)'}}>
            <div className="col-span-20 row-span-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-50 mix-blend-overlay"></div>
             {/* A simple floor texture overlay for better look */}
        </div>


        {/* --- RENDERING 3D ITEMS --- */}
        {items.map((item) => {
             const commonStyle: React.CSSProperties = {
                position: 'absolute',
                left: item.x * tileSize,
                top: item.y * tileSize,
                width: item.w * tileSize,
                height: item.h * tileSize,
                zIndex: item.zIndexBase,
                transformStyle: 'preserve-3d',
             };

            // --- 3D BED ---
            if (item.type === 'bed') {
                return (
                 <div key={item.id} style={{...commonStyle}}>
                    {/* Bed Frame Base */}
                    <div className="absolute inset-0 bg-[#8B5E3C] rounded-sm shadow-md" style={{transform: 'translateZ(0px)'}}></div>
                    {/* Mattress & Sheets (Higher Z) */}
                    <div className="absolute left-2 top-2 right-2 bottom-4 bg-blue-200 rounded-sm border-t-4 border-white" style={{transform: 'translateZ(20px)'}}>
                        {/* Blanket Fold */}
                        <div className="absolute bottom-0 w-full h-1/2 bg-blue-300 rounded-b-sm"></div>
                    </div>
                    {/* Pillow (Highest Z) */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-white rounded-md shadow-sm" style={{transform: 'translateZ(30px)'}}></div>
                 </div>
                )
            }

            // --- 3D CHAIR ---
            if (item.type === 'chair') {
                return (
                 <div key={item.id} style={{...commonStyle}}>
                     {/* Seat */}
                     <div className="absolute inset-0 bg-green-600 rounded-sm shadow-sm" style={{transform: 'translateZ(20px)'}}></div>
                     {/* Legs (Visual trick) */}
                     <div className="absolute inset-x-2 bottom-0 h-[20px] bg-green-800" style={{transform: 'rotateX(-90deg) origin-bottom'}}></div>
                     {/* Backrest (Stands up) */}
                     <div className="absolute top-0 w-full h-[50px] bg-green-500 rounded-t-sm border-b-4 border-green-700"
                          style={{
                              transform: 'rotateX(-90deg) translateY(-50px) translateZ(20px)', // Stand up at back of seat
                              transformOrigin: 'bottom'
                           }}>
                     </div>
                 </div>
                )
            }

             // --- 3D DESK & GLASS ---
             if (item.type === 'desk') {
                return (
                 <div key={item.id} style={{...commonStyle}}>
                      {/* Desk Top */}
                     <div className="absolute inset-0 bg-[#e6bc8a] rounded-sm shadow-lg border-b-8 border-[#c69566]" style={{transform: 'translateZ(50px)'}}>
                        {/* THE 3D GLASS (On top of desk) */}
                        <div className="absolute right-10 bottom-10 w-8 h-12" style={{transformStyle: 'preserve-3d'}}>
                            {/* Glass Body - CSS trick for transparency */}
                            <div 
                                className="w-full h-full rounded-b-md border-2 border-white/40 backdrop-blur-[2px]"
                                style={{
                                    // Semi-transparent gradient
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(200,235,255,0.1) 100%)',
                                    transform: 'rotateX(-90deg) translateY(-12px)', // Stand it up
                                    transformOrigin: 'bottom',
                                    boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.1)'
                                }}
                            >
                                {/* Boba pearls inside */}
                                <div className="absolute bottom-1 left-1 w-2 h-2 bg-black/60 rounded-full"></div>
                                <div className="absolute bottom-3 right-2 w-2 h-2 bg-black/60 rounded-full"></div>
                                {/* Straw */}
                                <div className="absolute -top-4 left-1/2 w-1 h-6 bg-pink-300/80 origin-bottom" style={{transform: 'rotateZ(15deg)'}}></div>
                            </div>
                        </div>
                     </div>
                      {/* Desk Front Face (to give it height) */}
                     <div className="absolute bottom-0 w-full h-[50px] bg-[#d4a373]" style={{transform: 'rotateX(-90deg) origin-bottom'}}></div>
                 </div>
                )
            }

            // Rug & Plants (Simple rendering)
            if (item.type === 'rug') return <div key={item.id} style={{...commonStyle}} className="bg-green-200/50 rounded-xl translate-z-[1px]" />
            if (item.type === 'plant') return <div key={item.id} style={{...commonStyle}} className="bg-emerald-600 rounded-full translate-z-[20px] shadow-xl" />
            return null;
        })}


        {/* --- THE CHARACTER --- */}
        <div 
            // Apply different classes based on current action state
            className={`absolute transition-all duration-300 ease-in-out flex items-center justify-center
                ${charAction === 'walking' ? 'animate-bounce-short' : ''}
                ${charAction === 'sleeping' ? 'sleeping-pose' : ''}
                ${charAction === 'sitting' ? 'sitting-pose' : ''}
            `}
            style={{
                width: '60px', height: '60px',
                left: charPos.x * tileSize, top: charPos.y * tileSize,
                // Dynamic Z-Index for depth sorting
                zIndex: charPos.x + charPos.y + 25, 
                transformStyle: 'preserve-3d',
                // Default floating height, overriden by specific pose classes below
                transform: 'translateZ(20px)', 
            }}
        >
            {/* Character Body Bean */}
            <div className={`relative w-12 h-14 bg-[#8B5E3C] rounded-[20px] shadow-xl border-2 border-[#5e3f28] transition-transform
                 ${(direction === 'left' || direction === 'up') ? 'scale-x-[-1]' : ''} 
            `}>
                {/* Face */}
                <div className="absolute top-4 right-2 flex gap-2 transition-all">
                    {charAction === 'sleeping' ? (
                         <div className="text-xs font-bold text-blue-800 mt-1 ml-2">Zzz...</div>
                    ) : (
                        <>
                        <div className="w-1.5 h-3 bg-black rounded-full" />
                        <div className="w-1.5 h-3 bg-black rounded-full" />
                        </>
                    )}
                </div>
                 {/* Blush */}
                 <div className="absolute top-6 right-1 flex gap-4 opacity-50"><div className="w-2 h-1 bg-pink-400 rounded-full" /><div className="w-2 h-1 bg-pink-400 rounded-full" /></div>
                
                {/* Drinking Animation State */}
                {charAction === 'drinking' && (
                     <div className="absolute bottom-2 -right-4 w-6 h-8 bg-blue-100/50 border border-white rounded-sm animate-pulse" style={{transform: 'rotate(15deg)'}}>
                         <div className="absolute -top-2 left-2 w-1 h-4 bg-pink-300"></div>
                     </div>
                )}
            </div>

            {/* Shadow only visible when NOT sleeping/sitting */}
            {charAction !== 'sleeping' && charAction !== 'sitting' && (
                <div className="absolute -bottom-2 w-10 h-4 bg-black/20 rounded-full blur-[2px]" style={{ transform: 'rotateX(60deg) translateZ(-20px)' }}></div>
            )}
        </div>

      </div>

      {/* CSS Styles for Poses and Animations */}
      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateZ(20px); }
          50% { transform: translateZ(35px); } 
        }
        .animate-bounce-short { animation: bounce-short 0.3s infinite; }

        /* Sitting: Lower down, no bounce */
        .sitting-pose {
            transform: translateZ(25px) !important; /* Sit on chair height */
        }

        /* Sleeping: Rotate flat and lower down */
        .sleeping-pose {
             /* Rotate X 90deg to lie flat relative to the isometric plane, then rotate Z to align with bed */
            transform: translateZ(32px) rotateX(90deg) rotateZ(45deg) !important;
        }
      `}</style>
    </div>
  );
};

export default IsometricRoom;