
import React, { useState } from 'react';
import { BuzzerState } from '../types';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';
import { Link } from 'react-router-dom';

interface AdminPanelProps {
  state: BuzzerState;
  onAction: (type: 'UNLOCK' | 'RESET' | 'SOUND', payload?: any) => void;
  embedded?: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ state, onAction, embedded = false }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const baseUrl = window.location.origin + window.location.pathname;
  const friendsLink = `${baseUrl}#/`;
  const masterLink = `${baseUrl}#/master`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Credenciais inválidas');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const audioData = event.target?.result as string;
        onAction('SOUND', audioData);
        alert('Som do buzzer atualizado!');
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copiado!');
  };

  if (!isLoggedIn) {
    return (
      <div className={`flex items-center justify-center ${embedded ? 'py-12' : 'min-h-screen'} p-4`}>
        <div className={`max-w-sm w-full bg-white rounded-3xl ${embedded ? '' : 'shadow-xl border border-slate-100'} p-8 space-y-6`}>
          <div className="text-center">
            <h2 className="text-2xl font-bold">Admin Login</h2>
            <p className="text-slate-500 text-sm">Acesso restrito</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Acessar Painel
            </button>
            {!embedded && (
              <Link to="/" className="block text-center text-slate-400 text-sm hover:underline">
                Voltar para o Buzzer
              </Link>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`${embedded ? '' : 'max-w-4xl mx-auto p-8'} space-y-8 animate-in fade-in duration-500`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Controles Admin</h1>
          <p className="text-slate-500 text-sm">Gerencie o estado do botão</p>
        </div>
        {!embedded && (
          <div className="flex gap-4">
            <Link to="/" className="px-4 py-2 bg-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-300 transition-colors">
              Sair
            </Link>
          </div>
        )}
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="text-red-600 text-sm font-bold hover:underline"
        >
          Logout
        </button>
      </div>

      <div className="space-y-6">
        {/* Seção de Links para o Usuário */}
        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 space-y-4">
          <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest flex items-center gap-2">
            🔗 Seus Links
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-indigo-400 uppercase">Link para Amigos</label>
              <div className="flex gap-2">
                <input readOnly value={friendsLink} className="flex-1 bg-white border border-indigo-200 rounded-lg px-3 py-1 text-xs outline-none" />
                <button onClick={() => copyToClipboard(friendsLink)} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold">Copiar</button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-indigo-400 uppercase">Link do Mestre (Seu Link)</label>
              <div className="flex gap-2">
                <input readOnly value={masterLink} className="flex-1 bg-white border border-indigo-200 rounded-lg px-3 py-1 text-xs outline-none" />
                <button onClick={() => copyToClipboard(masterLink)} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold">Copiar</button>
              </div>
            </div>
          </div>
        </div>

        {/* Gerenciamento de Estado */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Estado Atual
          </h3>
          
          <div className="flex flex-col gap-4">
            <div className={`p-4 rounded-2xl border ${state.isLocked ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <p className={`font-black text-xl ${state.isLocked ? 'text-red-600' : 'text-emerald-600'}`}>
                {state.isLocked ? 'TRAVADO' : 'PRONTO'}
              </p>
              {state.pressedBy && (
                <p className="mt-2 text-sm text-slate-700">
                  Por: <span className="font-bold">{state.pressedBy}</span>
                </p>
              )}
            </div>

            <button
              onClick={() => onAction('UNLOCK')}
              disabled={!state.isLocked}
              className={`w-full py-4 rounded-2xl font-bold transition-all
                ${!state.isLocked 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'}`}
            >
              Destravar Botão
            </button>

            <button
              onClick={() => onAction('RESET')}
              disabled={!state.pressedBy}
              className={`w-full py-4 rounded-2xl font-bold transition-all
                ${!state.pressedBy 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'}`}
            >
              Resetar Nickname
            </button>
          </div>
        </div>

        {/* Gerenciamento de Áudio */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Som do Buzzer
          </h3>
          
          <div className="space-y-4">
            <div className="relative group">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full py-8 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all">
                <p className="text-slate-600 text-sm font-medium">Trocar arquivo de som</p>
                <p className="text-slate-400 text-[10px] mt-1">MP3 ou WAV</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
