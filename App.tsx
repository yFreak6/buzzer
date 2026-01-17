
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import BuzzerView from './components/BuzzerView';
import AdminPanel from './components/AdminPanel';
import MasterView from './components/MasterView';
import { syncService } from './services/SyncService';
import { BuzzerState, BuzzerEvent } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<BuzzerState>(syncService.getState());

  useEffect(() => {
    const unsubscribe = syncService.subscribe((event: BuzzerEvent) => {
      if (event.type === 'SYNC_STATE') {
        setState(event.state);
      } else if (event.type === 'PRESS_BUTTON') {
        const newState = { ...syncService.getState(), isLocked: true, pressedBy: event.nickname };
        setState(newState);
        syncService.saveState(newState);
        syncService.playSound(newState.audioData);
      } else if (event.type === 'UNLOCK_BUTTON') {
        const newState = { ...syncService.getState(), isLocked: false };
        setState(newState);
        syncService.saveState(newState);
      } else if (event.type === 'RESET_NAME') {
        const newState = { ...syncService.getState(), pressedBy: null };
        setState(newState);
        syncService.saveState(newState);
      } else if (event.type === 'UPDATE_SOUND') {
        const newState = { ...syncService.getState(), audioData: event.audioData };
        setState(newState);
        syncService.saveState(newState);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePress = useCallback((nickname: string) => {
    if (!state.isLocked) {
      syncService.broadcast({ type: 'PRESS_BUTTON', nickname });
      const newState = { ...state, isLocked: true, pressedBy: nickname };
      setState(newState);
      syncService.saveState(newState);
      syncService.playSound(newState.audioData);
    }
  }, [state]);

  const handleAdminAction = useCallback((type: 'UNLOCK' | 'RESET' | 'SOUND', payload?: any) => {
    if (type === 'UNLOCK') {
      syncService.broadcast({ type: 'UNLOCK_BUTTON' });
      const newState = { ...state, isLocked: false };
      setState(newState);
      syncService.saveState(newState);
    } else if (type === 'RESET') {
      syncService.broadcast({ type: 'RESET_NAME' });
      const newState = { ...state, pressedBy: null };
      setState(newState);
      syncService.saveState(newState);
    } else if (type === 'SOUND') {
      syncService.broadcast({ type: 'UPDATE_SOUND', audioData: payload });
      const newState = { ...state, audioData: payload };
      setState(newState);
      syncService.saveState(newState);
    }
  }, [state]);

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Routes>
          <Route 
            path="/" 
            element={
              <BuzzerView 
                state={state} 
                onPress={handlePress} 
              />
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminPanel 
                state={state} 
                onAction={handleAdminAction} 
              />
            } 
          />
          <Route 
            path="/master" 
            element={
              <MasterView 
                state={state} 
                onPress={handlePress}
                onAction={handleAdminAction} 
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
