
import React from 'react';
import BuzzerView from './BuzzerView';
import AdminPanel from './AdminPanel';
import { BuzzerState } from '../types';

interface MasterViewProps {
  state: BuzzerState;
  onPress: (nickname: string) => void;
  onAction: (type: 'UNLOCK' | 'RESET' | 'SOUND', payload?: any) => void;
}

const MasterView: React.FC<MasterViewProps> = ({ state, onPress, onAction }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <div className="bg-indigo-600 text-white py-2 px-4 text-center text-xs font-bold uppercase tracking-widest">
        Modo Master - Controle e Visualização em Tempo Real
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Lado Esquerdo: O Buzzer (O que os amigos veem) */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-slate-200">
          <div className="h-full flex flex-col justify-center transform scale-90 lg:scale-100">
            <BuzzerView state={state} onPress={onPress} />
          </div>
        </div>

        {/* Lado Direito: O Painel (Seus controles) */}
        <div className="w-full lg:w-[450px] bg-white shadow-2xl overflow-y-auto">
          <div className="p-4">
            <AdminPanel state={state} onAction={onAction} embedded={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterView;
