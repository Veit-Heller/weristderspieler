import { motion } from 'framer-motion';

const TIP_COSTS = {
  age: 15,
  nationality: 20,
  allStations: 20,
  currentClub: 20,
  sortStations: 20,
};

export default function TipsModal({
  currentPlayer,
  revealedTips,
  tipsCostThisRound,
  points,
  onBuyTip,
  onClose,
}) {
  const canAfford = (tipType) => tipsCostThisRound + TIP_COSTS[tipType] <= 100;

  const TipRow = ({ label, tipType, revealedContent }) => (
    <div className="bg-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-white">{label}</span>
        {revealedTips[tipType] ? (
          <span className="text-green-400 font-bold">{revealedContent}</span>
        ) : (
          <button
            onClick={() => onBuyTip(tipType)}
            disabled={!canAfford(tipType)}
            className={`px-4 py-2 rounded-lg font-bold text-sm ${
              canAfford(tipType)
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            {TIP_COSTS[tipType]} Punkte
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Tipps</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="space-y-3">
          <TipRow
            label="Alter"
            tipType="age"
            revealedContent={`${currentPlayer.age} Jahre`}
          />
          <TipRow
            label="Nationalität"
            tipType="nationality"
            revealedContent={currentPlayer.nationality}
          />
          <TipRow
            label="Alle Vereinsstationen anzeigen"
            tipType="allStations"
            revealedContent="✓ Aktiviert"
          />
          <TipRow
            label="Aktueller Verein"
            tipType="currentClub"
            revealedContent={currentPlayer.currentClub}
          />
          <TipRow
            label="Vereinsstationen sortieren"
            tipType="sortStations"
            revealedContent="✓ Sortiert"
          />
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-slate-400 text-sm">
            Gesamtpunkte: <span className="text-white font-bold">{points}</span>
          </p>
          <p className="text-yellow-300 text-sm">
            Diese Runde möglich: <span className="font-bold">{Math.max(0, 100 - tipsCostThisRound)}</span> von 100 Punkten
          </p>
          {tipsCostThisRound > 0 && (
            <p className="text-red-300 text-xs">
              Tipp-Kosten diese Runde: {tipsCostThisRound} Punkte
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
