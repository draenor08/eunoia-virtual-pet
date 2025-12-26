// src/features/draft/types.ts

// Existing types...
export type Position = { x: number; y: number };
export type Direction = 'left' | 'right' | 'up' | 'down';

export type CharacterAction = 
  | 'idle' | 'walking' | 'sitting' | 'sleeping' | 'drinking' | 'breathe' // Added breathe
  | 'happy' | 'sad' | 'joyous' | 'crying' | 'anxious' | 'worried' | 'calm' | 'concerned' | 'excited'; // Added API emotions

export type DecorItem = {
  id: string;
  type: 'plant' | 'rug' | 'desk' | 'chair' | 'bed';
  x: number;
  y: number;
  w: number;
  h: number;
  isSolid: boolean;
  interactionPoint?: Position;
  interactionType?: CharacterAction;
};

// --- NEW API TYPES ---
export interface ApiResponse {
    reply: string;
    emotion: string; // "HAPPY", "SAD", etc. (We will convert to lowercase)
    action: string;  // "BREATHE", "SLEEP", etc.
    targetObject: string; // "BED", "MAT", "NONE"
}