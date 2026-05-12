import { dimensions } from '../../data/dimensions';

export default function ScoreBar({ dim, score, ideal }) {
  const meta = dimensions[dim];
  const diff = score - ideal;
  const diffLabel =
    diff === 0 ? 'תואם' : diff > 0 ? `+${diff} מעל` : `${diff} מתחת`;
  const diffColor = Math.abs(diff) <= 10 ? 'text-emerald-600' : Math.abs(diff) <= 20 ? 'text-amber-600' : 'text-red-600';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${meta.classes.dot}`} />
          <span className="font-medium text-gray-800 text-sm">{meta.name}</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className={`font-semibold ${diffColor}`} dir="ltr">{diffLabel}</span>
          <span className="font-bold text-gray-900 text-base" dir="ltr">
            {score}
            <span className="text-gray-400 font-normal mx-0.5">/</span>
            <span className="text-gray-400 font-normal">{ideal}</span>
          </span>
        </div>
      </div>
      <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute top-0 right-0 w-px h-full bg-gray-400 z-10"
          style={{ right: `${ideal}%` }}
          title="הציון האידיאלי לתפקיד"
        />
        <div
          className={`absolute top-0 right-0 h-full rounded-full transition-all duration-500 ${meta.classes.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
