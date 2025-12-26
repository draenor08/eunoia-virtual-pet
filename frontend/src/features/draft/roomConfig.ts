import { type DecorItem, type Position } from './types';

export const TILE_SIZE = 60;
export const GRID_SIZE = 20;

// The "Interaction Point" is where the character stands to use the item.
export const ROOM_ITEMS: DecorItem[] = [
  {
    id: 'rug', type: 'rug', x: 7, y: 7, w: 6, h: 5, isSolid: false
  },
  {
    id: 'desk', type: 'desk', x: 5, y: 4, w: 4, h: 2, isSolid: true,
    interactionPoint: { x: 7, y: 6 }, // Character stands here to work
    interactionType: 'drinking' // "working" or "drinking"
  },
  {
    id: 'chair', type: 'chair', x: 6, y: 6, w: 1, h: 1, isSolid: false,
    interactionPoint: { x: 6, y: 6 },
    interactionType: 'sitting'
  },
  {
    id: 'bed', type: 'bed', x: 13, y: 5, w: 5, h: 3, isSolid: true,
    interactionPoint: { x: 13, y: 6 }, // Stand right on the mattress
    interactionType: 'sleeping'
  },
  { id: 'plant1', type: 'plant', x: 3, y: 15, w: 1, h: 1, isSolid: true },
];

export const INITIAL_POSITION: Position = { x: 10, y: 10 };