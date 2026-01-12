import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-12 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider mb-2">
          WER IST DER SPIELER?
        </h1>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="h-px w-12 bg-white/30"></div>
          <div className="h-px w-24 bg-white/50"></div>
          <div className="h-px w-12 bg-white/30"></div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/training')}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow"
        >
          🎯 Training
          <p className="text-sm font-normal mt-2 opacity-90">
            Multiple Choice - Wähle aus 4 Optionen
          </p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/competition')}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow"
        >
          ⚡ Wettkampf
          <p className="text-sm font-normal mt-2 opacity-90">
            5 Durchgänge - 100 Punkte pro richtige Antwort. Tipps verfügbar!
          </p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/multiplayer/create')}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow"
        >
          👥 Match erstellen
          <p className="text-sm font-normal mt-2 opacity-90">
            Erstelle ein neues Match und lade einen Freund ein
          </p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/multiplayer/join')}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow"
        >
          🔗 Match beitreten
          <p className="text-sm font-normal mt-2 opacity-90">
            Tritt einem bestehenden Match mit einer Match-ID bei
          </p>
        </motion.button>
      </div>
    </div>
  );
}
