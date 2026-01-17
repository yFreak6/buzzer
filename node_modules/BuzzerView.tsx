
import React, { useState } from 'react';
import { BuzzerState } from '../types';
import { Link, useLocation } from 'react-router-dom';

interface BuzzerViewProps {
  state: BuzzerState;
  onPress: (nickname: string) => void;
}

const BuzzerView: React.FC<BuzzerViewProps> = ({ state, onPress }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();

  const isMasterView = location.pathname === '/master';

  const handlePressClick = () => {
    if (!nickname.trim()) {
      setError('Por favor, digite seu nickname primeiro!');
      return;
    }
    setError('');
    onPress(nickname.trim());
  };

  return (
    <div className={`flex flex-col items-center justify-center ${isMasterView ? '' : 'min-h-screen'} p-4`}>
      {/* O link de Admin agora é invisível para usuários normais, acessível apenas por URL direta ou Master */}
      {!isMasterView && (
        <Link 
          to="/master" 
          className="fixed bottom-4 right-4 opacity-0 hover:opacity-10 text-slate-900 text-[10px]"
        >
          .
        </Link>
      )}

      <div className="max-w-md w-full text-center space-y-12">
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
            Esteja Pronto para apertar o botão
          </h1>
          <p className="text-slate-500 text-lg">aperte o botão quando terminar de escrever seu stop</p>
        </div>

        {/* Campo de Nickname */}
        {!state.isLocked ? (
          <div className="space-y-4 transition-all duration-300">
            <div className="relative">
              <input
                type="text"
                placeholder="Seu Nickname..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={`w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none text-lg text-center font-bold
                  ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-red-500 bg-white'}`}
                maxLength={20}
              />
              {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-red-50 rounded-3xl border-2 border-red-200 animate-pulse">
            <p className="text-red-800 font-black text-2xl uppercase tracking-tighter">
              STOP! BOTÃO TRAVADO
            </p>
            {state.pressedBy && (
              <p className="text-red-700 mt-2 text-xl">
                Ganhador: <span className="font-extrabold text-red-900 underline">{state.pressedBy}</span>
              </p>
            )}
          </div>
        )}

        {/* O Grande Botão Central */}
        <div className="flex justify-center py-4">
          <button
            onClick={handlePressClick}
            disabled={state.isLocked}
            className={`
              w-64 h-64 rounded-full flex items-center justify-center transition-all duration-100
              ${state.isLocked 
                ? 'bg-slate-300 cursor-not-allowed grayscale buzzer-locked-shadow' 
                : 'bg-red-500 cursor-pointer buzzer-active buzzer-shadow ring-[12px] ring-red-50'
              }
            `}
          >
            <div className={`w-52 h-52 rounded-full border-[6px] border-white/20 flex items-center justify-center ${state.isLocked ? 'opacity-30' : 'opacity-100'}`}>
               <div className="w-40 h-40 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>
          </button>
        </div>

        {state.isLocked && state.pressedBy && !isMasterView && (
          <div className="text-slate-400 text-sm font-medium">
            Aguardando o mestre iniciar a próxima rodada...
          </div>
        )}
      </div>
    </div>
  );
};

export default BuzzerView;
