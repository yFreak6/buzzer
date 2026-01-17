
import { BuzzerState, BuzzerEvent } from '../types';
import { STORAGE_KEY, DEFAULT_BUZZER_SOUND } from '../constants';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * 🛠️ CONFIGURAÇÃO FINAL (O ÚLTIMO PASSO):
 * 
 * 1. Procure este arquivo (services/SyncService.ts) na sua lista de arquivos à esquerda.
 * 2. Apague o texto 'COLE_AQUI_O_SEU_PROJECT_URL' e cole a URL que você copiou.
 * 3. Apague o texto 'COLE_AQUI_A_SUA_CHAVE_ANON_PUBLIC' e cole a chave (API Key) que você copiou.
 * 4. Salve o arquivo.
 */
const SUPABASE_URL = 'https://gcfokcfhxhzkqfhctovz.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZm9rY2ZoeGh6a3FmaGN0b3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2ODIzODIsImV4cCI6MjA4NDI1ODM4Mn0.iAxf8VCfYd71d7jCYGJrHIQYMr87uCWPP6J0v4IOz9Y'; 

class SyncService {
  private supabase: SupabaseClient | null = null;
  private channel: any = null;
  private listeners: ((event: BuzzerEvent) => void)[] = [];
  private currentState: BuzzerState;

  constructor() {
    this.currentState = this.getInitialState();
    
    const isConfigured = 
      SUPABASE_URL.startsWith('http') && 
      !SUPABASE_URL.includes('COLE_AQUI') &&
      !SUPABASE_KEY.includes('COLE_AQUI');

    if (isConfigured) {
      this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      this.setupRealtime();
      console.log("✅ SISTEMA ONLINE: Agora seus amigos podem apertar o botão de qualquer lugar!");
    } else {
      console.warn("⚠️ AGUARDANDO CHAVES: Você ainda não colou sua URL ou Key no arquivo SyncService.ts");
    }
  }

  private getInitialState(): BuzzerState {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { }
    }
    return { isLocked: false, pressedBy: null, audioData: null };
  }

  private setupRealtime() {
    if (!this.supabase) return;

    this.channel = this.supabase.channel('stop_game', {
      config: {
        broadcast: { self: false }
      },
    })
    .on('broadcast', { event: 'buzzer_event' }, ({ payload }) => {
      this.handleRemoteEvent(payload);
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('📡 Conexão em tempo real estabelecida!');
      }
    });
  }

  private handleRemoteEvent(event: BuzzerEvent) {
    if (event.type === 'PRESS_BUTTON') {
      this.currentState = { ...this.currentState, isLocked: true, pressedBy: event.nickname };
      this.playSound(this.currentState.audioData);
    } else if (event.type === 'UNLOCK_BUTTON') {
      this.currentState = { ...this.currentState, isLocked: false };
    } else if (event.type === 'RESET_NAME') {
      this.currentState = { ...this.currentState, pressedBy: null };
    } else if (event.type === 'UPDATE_SOUND') {
      this.currentState = { ...this.currentState, audioData: event.audioData };
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentState));
    this.listeners.forEach(cb => cb(event));
  }

  getState(): BuzzerState {
    return this.currentState;
  }

  saveState(state: BuzzerState) {
    this.currentState = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  broadcast(event: BuzzerEvent) {
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'buzzer_event',
        payload: event,
      });
    }
  }

  subscribe(callback: (event: BuzzerEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  async playSound(audioData: string | null) {
    const audio = new Audio(audioData || DEFAULT_BUZZER_SOUND);
    try {
      await audio.play();
    } catch (e) {
      console.log("Áudio aguardando interação inicial.");
    }
  }
}

export const syncService = new SyncService();
