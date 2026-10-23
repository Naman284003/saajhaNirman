import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Send,
  Building,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { messages, sendMessage, activeSite, currentUser, language } = useApp();
  const [inputText, setInputText] = useState('');
  const isHi = language === 'hi';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            {isHi ? 'साइट-से-साइट संचार' : 'Site-to-Site Liaison'}
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            {isHi ? 'संदेश' : 'Coordination Messages'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate pickup timing, vehicle dimensions, ramp access, and material loading assist directly with partner site engineers.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span className="font-semibold">Site Channel: Koramangala ↔ HSR Layout</span>
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col h-[520px]">
        {/* Chat Thread Partner Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              VS
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Vikram Sharma
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                  Site Manager (Verified)
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Building className="w-3 h-3 text-slate-400" />
                <span>Koramangala Green Build (Site A) · 3.2 km away</span>
              </div>
            </div>
          </div>

          <a
            href="tel:+919845012345"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5" />
            +91 98450 12345
          </a>
        </div>

        {/* Message Bubbles Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
          <div className="text-center my-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
              Topic: 150 Red Clay Bricks Transfer Coordination
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.isCurrentUser;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1 font-mono">
                  <span>{msg.senderName}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-emerald-700 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Composer Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type coordination message regarding vehicle plate, arrival time, or access pass..."
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white text-slate-900"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
