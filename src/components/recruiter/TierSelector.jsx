import { useState } from 'react';
import {
  Zap,
  Target,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { QUESTIONNAIRE_TIERS } from '../../data/questionnaires';

const tierIcons = { Zap, Target, Layers };
const tierColorMap = {
  forest: {
    bg: 'bg-forest-tint',
    text: 'text-forest',
    border: 'border-forest',
    borderSoft: 'border-forest/40',
  },
  petrol: {
    bg: 'bg-petrol-tint',
    text: 'text-petrol',
    border: 'border-petrol',
    borderSoft: 'border-petrol/40',
  },
  plum: {
    bg: 'bg-plum-tint',
    text: 'text-plum',
    border: 'border-plum',
    borderSoft: 'border-plum/40',
  },
};

const reliabilityLabel = (rel) =>
  ({ acceptable: 'מקובל', good: 'טוב מאוד', excellent: 'מצוין' }[rel] || rel);

function TierCard({ tier, selected, recommended, onSelect, onShowDetails }) {
  const Icon = tierIcons[tier.icon] || Target;
  const c = tierColorMap[tier.color] || tierColorMap.petrol;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        text-right w-full p-5 border-2 transition-all duration-150
        ${selected
          ? `${c.border} ${c.bg} shadow-petrol-sm -translate-x-px -translate-y-px`
          : 'border-ink-line bg-paper-light hover:border-ink-soft'}
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`w-11 h-11 border ${c.borderSoft} ${c.bg} ${c.text} flex items-center justify-center shrink-0`}>
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <div className="flex items-center gap-2">
          {recommended && (
            <span className="inline-flex items-center gap-1 text-[10px] tracking-wider2 uppercase text-petrol font-semibold">
              ★ מומלץ
            </span>
          )}
          {selected && <CheckCircle2 size={18} className={c.text} />}
        </div>
      </div>

      <div className={`display text-[20px] ${selected ? c.text : 'text-ink'} mb-1`}>
        {tier.name}
      </div>
      <div className="num text-[11px] tracking-widish text-ink-mute mb-3 uppercase" dir="ltr">
        {tier.itemCount} שאלות · ~{tier.estimatedMinutes} דק׳ · α = {tier.validity.alphaRange} ({tier.validity.label})
      </div>

      <p className="text-[13px] text-ink-soft leading-relaxed mb-3">{tier.shortDescription}</p>

      <div className="flex items-center justify-end">
        <span
          onClick={(e) => {
            e.stopPropagation();
            onShowDetails();
          }}
          className="text-[11px] tracking-widish uppercase text-petrol hover:underline-petrol font-medium cursor-pointer"
          role="button"
        >
          פרטים ←
        </span>
      </div>
    </button>
  );
}

function TierDetailsModal({ tier, onClose, onSelect }) {
  const Icon = tierIcons[tier.icon] || Target;
  const c = tierColorMap[tier.color] || tierColorMap.petrol;

  return (
    <div
      className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-paper-light border-2 border-ink shadow-ink max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <header className="flex items-start justify-between gap-4 p-6 border-b border-ink-line shrink-0">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 border ${c.borderSoft} ${c.bg} ${c.text} flex items-center justify-center shrink-0`}>
              <Icon size={22} strokeWidth={1.75} />
            </div>
            <div>
              <div className={`eyebrow ${c.text} font-semibold mb-1`}>שאלון {tier.name}</div>
              <h3 className="display text-2xl text-ink leading-tight">{tier.fullDescription.split('.')[0]}.</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 border border-ink-line hover:border-ink hover:bg-paper-dark flex items-center justify-center transition-all"
            aria-label="סגור"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-5">
          <p className="text-[14px] text-ink leading-relaxed">{tier.fullDescription}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-paper border border-ink-line p-4">
              <div className="eyebrow mb-2">תוקף ומהימנות</div>
              <div className="num text-2xl text-ink mb-1" dir="ltr">
                α = {tier.validity.alphaRange}
              </div>
              <div className={`text-[12px] ${c.text} font-medium`}>
                {reliabilityLabel(tier.validity.reliability)}
              </div>
            </div>
            <div className="bg-paper border border-ink-line p-4">
              <div className="eyebrow mb-2">זמן ועומס</div>
              <div className="num text-2xl text-ink mb-1" dir="ltr">
                {tier.itemCount} · ~{tier.estimatedMinutes}׳
              </div>
              <div className="text-[12px] text-ink-soft">שאלות · דקות</div>
            </div>
          </div>

          <div>
            <div className="eyebrow text-forest font-semibold mb-2">מתאים במיוחד עבור</div>
            <ul className="space-y-1.5">
              {tier.bestFor.map((s) => (
                <li key={s} className="flex gap-2 text-[14px] text-ink leading-relaxed">
                  <span className="text-forest shrink-0">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {tier.notRecommendedFor.length > 0 && (
            <div>
              <div className="eyebrow text-oxblood font-semibold mb-2">פחות מתאים עבור</div>
              <ul className="space-y-1.5">
                {tier.notRecommendedFor.map((s) => (
                  <li key={s} className="flex gap-2 text-[14px] text-ink-soft leading-relaxed">
                    <span className="text-oxblood shrink-0">·</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <div className="eyebrow-petrol mb-2">מה תכיל הדוח</div>
            <ul className="space-y-1.5">
              {tier.analysisIncludes.map((s) => (
                <li key={s} className="flex gap-2 text-[14px] text-ink leading-relaxed">
                  <span className="text-petrol shrink-0">✓</span>
                  <span>{s}</span>
                </li>
              ))}
              {tier.analysisExcludes.map((s) => (
                <li key={s} className="flex gap-2 text-[14px] text-ink-mute leading-relaxed">
                  <span className="text-ink-line shrink-0">○</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="border-t border-ink-line p-5 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="eyebrow text-ink-soft hover:text-ink px-3"
          >
            סגור
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect();
              onClose();
            }}
            className={`inline-flex items-center justify-center gap-2 h-12 px-6 font-semibold uppercase tracking-widish text-[14px] ${c.bg} ${c.text} ${c.border} border-2 hover:bg-ink hover:text-paper-light hover:border-ink transition-all`}
          >
            בחרי שאלון זה ←
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function TierSelector({ tier, recommendedTier, recommendedRoleName, onChange }) {
  const [expanded, setExpanded] = useState(false);
  const [detailsTier, setDetailsTier] = useState(null);

  const selectedTier = QUESTIONNAIRE_TIERS[tier] || QUESTIONNAIRE_TIERS.standard;
  const SelectedIcon = tierIcons[selectedTier.icon] || Target;
  const selectedColors = tierColorMap[selectedTier.color] || tierColorMap.petrol;

  const isMismatch = recommendedTier && tier !== recommendedTier;
  const recommendedTierMeta = recommendedTier
    ? QUESTIONNAIRE_TIERS[recommendedTier]
    : null;

  return (
    <>
      {!expanded ? (
        // Collapsed view
        <div className={`border-2 ${selectedColors.borderSoft} ${selectedColors.bg} p-5`}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 border ${selectedColors.borderSoft} bg-paper-light ${selectedColors.text} flex items-center justify-center shrink-0`}>
                <SelectedIcon size={18} strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <CheckCircle2 size={14} className={selectedColors.text} />
                  <span className={`display text-[18px] ${selectedColors.text}`}>{selectedTier.name}</span>
                </div>
                <div className="num text-[11px] tracking-widish text-ink-soft mt-0.5 uppercase" dir="ltr">
                  {selectedTier.itemCount} שאלות · ~{selectedTier.estimatedMinutes} דק׳
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3 border border-ink-line bg-paper-light text-ink-soft hover:border-ink hover:text-ink text-[12px] tracking-widish uppercase font-medium transition-all"
            >
              שני
              <ChevronDown size={14} />
            </button>
          </div>

          {recommendedRoleName && tier === recommendedTier && (
            <div className="border-t border-ink-line/60 pt-3 mt-3">
              <p className="text-[13px] text-ink-soft leading-relaxed">
                <span className="text-petrol font-semibold">💡 מומלץ עבור {recommendedRoleName}:</span>{' '}
                {recommendedTierMeta?.shortDescription}
              </p>
            </div>
          )}

          {isMismatch && recommendedTierMeta && (
            <div className="border-t border-ink-line/60 pt-3 mt-3 flex items-start gap-2">
              <AlertTriangle size={14} className="text-ochre shrink-0 mt-0.5" />
              <p className="text-[13px] text-ochre leading-relaxed">
                <span className="font-semibold">שימי לב:</span> ההמלצה עבור{' '}
                {recommendedRoleName || 'התפקיד הזה'} היא <span className="font-medium">שאלון {recommendedTierMeta.name}</span>.
                {' '}שאלון {selectedTier.name} עשוי לא לספק עומק מספיק.
              </p>
            </div>
          )}
        </div>
      ) : (
        // Expanded view — 3 cards
        <div className="border-2 border-ink-line bg-paper-light p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="eyebrow">בחירת סוג השאלון</span>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-ink-soft hover:text-ink text-[12px] tracking-widish uppercase font-medium"
            >
              סגור
              <ChevronUp size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.values(QUESTIONNAIRE_TIERS).map((t) => (
              <TierCard
                key={t.id}
                tier={t}
                selected={tier === t.id}
                recommended={recommendedTier === t.id}
                onSelect={() => {
                  onChange(t.id);
                  setExpanded(false);
                }}
                onShowDetails={() => setDetailsTier(t)}
              />
            ))}
          </div>
        </div>
      )}

      {detailsTier && (
        <TierDetailsModal
          tier={detailsTier}
          onClose={() => setDetailsTier(null)}
          onSelect={() => onChange(detailsTier.id)}
        />
      )}
    </>
  );
}

// "מה זה?" info modal — usage explanation
export function AboutQuestionnairesModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-paper-light border-2 border-ink shadow-ink max-w-xl w-full max-h-[85vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <header className="flex items-start justify-between gap-4 p-6 border-b border-ink-line">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 border border-petrol/40 bg-petrol-tint text-petrol flex items-center justify-center">
              <Info size={20} strokeWidth={1.75} />
            </div>
            <div>
              <div className="eyebrow-petrol mb-1">מידע</div>
              <h3 className="display text-2xl text-ink leading-tight">על שאלוני האישיות שלנו</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 border border-ink-line hover:border-ink hover:bg-paper-dark flex items-center justify-center transition-all"
            aria-label="סגור"
          >
            <X size={16} />
          </button>
        </header>

        <div className="p-6 space-y-4 text-[14px] text-ink-soft leading-relaxed">
          <p>
            הפלטפורמה משתמשת במודל <span className="font-semibold text-ink">BIG5</span> —
            הסטנדרט המדעי לאבחון אישיות בעבודה. המודל מודד 5 מימדים:
            מוחצנות, חברתיות, מצפוניות, יציבות רגשית ופתיחות.
          </p>
          <p>
            אנו מציעים 3 רמות עומק לאבחון, מבוססות על{' '}
            <span className="font-semibold text-ink" dir="ltr">IPIP — International Personality Item Pool</span>,
            מאגר הפריטים הפסיכומטריים הציבורי המוביל בעולם.
          </p>
          <p>
            התרגום העברי בוצע על ידי{' '}
            <span className="font-semibold text-ink">ד״ר שאול אורג, אוניברסיטת בן־גוריון</span>,
            ופורסם באתר IPIP הרשמי.
          </p>
          <div className="bg-paper border border-ink-line p-4 mt-2">
            <div className="eyebrow-petrol mb-2">מה זה Cronbach&apos;s Alpha?</div>
            <p className="text-[13px]">
              <span dir="ltr" className="num">α</span> הוא מדד למהימנות פנימית — ככל שהוא גבוה
              יותר, השאלון מודד את התכונה בעקביות גבוהה יותר. ערכים מעל{' '}
              <span dir="ltr" className="num">0.7</span> נחשבים אמינים.
            </p>
          </div>
        </div>

        <footer className="border-t border-ink-line p-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center h-10 px-5 bg-paper-light border-2 border-ink hover:bg-ink hover:text-paper-light text-[13px] tracking-widish uppercase font-medium transition-all"
          >
            סגור
          </button>
        </footer>
      </div>
    </div>
  );
}
