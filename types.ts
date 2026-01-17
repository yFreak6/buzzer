
export interface BuzzerState {
  isLocked: boolean;
  pressedBy: string | null;
  audioData: string | null; // Base64 string of the audio file
}

export type BuzzerEvent = 
  | { type: 'PRESS_BUTTON'; nickname: string }
  | { type: 'UNLOCK_BUTTON' }
  | { type: 'RESET_NAME' }
  | { type: 'UPDATE_SOUND'; audioData: string }
  | { type: 'SYNC_STATE'; state: BuzzerState };
