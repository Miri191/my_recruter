import { useEffect, useMemo, useState } from 'react';
import {
  X,
  Handshake,
  Compass,
  Code2,
  Palette,
  Headphones,
  Users,
  Briefcase,
  Target,
  TrendingUp,
  Sparkles,
  Zap,
  Heart,
  Shield,
  Crown,
  Lightbulb,
  Wrench,
  Trash2,
  RotateCcw,
  Plus,
} from 'lucide-react';
import Button from '../ui/Button';
import { dimensions, dimensionOrder } from '../../data/dimensions';
import { availableIcons, isDefaultRoleId } from '../../data/roles';

const iconMap = {
  Handshake, Compass, Code2, Palette, Headphones, Users,
  Briefcase, Target, TrendingUp, Sparkles, Zap, Heart,
  Shield, Crown, Lightbulb, Wrench,
};

function slugify(text) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/[^\w֐-׿-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `role-${Date.now().toString(36)}`
  );
}

const emptyRole = {
  id: '',
  name: '',
  desc: '',
  icon: 'Briefcase',
  ideal: { E: 50, A: 50, C: 50, S: 50, O: 50 },
  weights: { E: 20, A: 20, C: 20, S: 20, O: 20 },
  traits: [],
};

function Slider({ value, onChange, min = 0, max = 100, accent = 'petrol' }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full h-1.5 bg-paper-dark rounded-full appearance-none cursor-pointer accent-${accent}`}
      style={{ direction: 'ltr' }}
    />
  );
}

function TraitChips({ traits, onChange }) {
  const [input, setInput] = useState('');

  const addTrait = () => {
    const t = input.trim();
    if (!t || traits.includes(t)) {
      setInput('');
      return;
    }
    onChange([...traits, t]);
    setInput('');
  };

  const removeTrait = (t) => onChange(traits.filter((x) => x !== t));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
        {traits.length === 0 && (
          <span className="text-[12px] text-ink-mute italic">אין תכונות עדיין — הוסיפי בשדה למטה</span>
        )}
        {traits.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 border border-petrol/40 bg-petrol-tint text-petrol text-[12px] font-medium px-2.5 py-1"
          >
            {t}
            <button
              type="button"
              onClick={() => removeTrait(t)}
              className="hover:text-oxblood transition-colors"
              aria-label="הסר"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTrait();
            }
          }}
          placeholder="לדוגמה: אסרטיביות"
          className="flex-1 h-10 px-3 bg-paper-light border-2 border-ink-line text-[13px] focus:outline-none focus:border-petrol transition-colors"
        />
        <button
          type="button"
          onClick={addTrait}
          disabled={!input.trim()}
          className="inline-flex items-center gap-1.5 h-10 px-3 bg-petrol-tint border-2 border-petrol/40 text-petrol text-[12px] tracking-widish uppercase font-medium hover:bg-petrol hover:text-paper-light transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={14} />
          הוסיפי
        </button>
      </div>
    </div>
  );
}

export default function RoleEditor({ role, mode, onSave, onDelete, onReset, onClose }) {
  const isEdit = mode === 'edit';
  const isBuiltIn = isEdit && isDefaultRoleId(role?.id);
  const hasOverride = isBuiltIn && role?.hasOverride;

  const [form, setForm] = useState(role || emptyRole);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(role || emptyRole);
    setErrors({});
  }, [role?.id, mode]);

  const Icon = iconMap[form.icon] || Briefcase;

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const setDim = (group, dim, value) => {
    setForm((f) => ({ ...f, [group]: { ...f[group], [dim]: value } }));
  };

  const weightsTotal = useMemo(
    () => Object.values(form.weights).reduce((a, b) => a + b, 0),
    [form.weights]
  );

  const handleSave = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'יש למלא שם תפקיד';
    if (weightsTotal === 0) e.weights = 'לפחות אחד מהמשקלות חייב להיות גדול מ-0';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const id = form.id || slugify(form.name);
    const payload = {
      ...form,
      id,
      name: form.name.trim(),
      desc: (form.desc || '').trim(),
      isCustom: !isDefaultRoleId(id),
    };
    onSave(payload);
  };

  return (
    <div
      className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-paper-light border-2 border-ink shadow-ink max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <header className="flex items-start justify-between gap-4 p-6 border-b border-ink-line shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 border border-petrol/40 bg-petrol-tint text-petrol flex items-center justify-center shrink-0">
              <Icon size={22} strokeWidth={1.75} />
            </div>
            <div>
              <div className="eyebrow-petrol mb-1">
                {mode === 'create' ? 'תפקיד חדש' : isBuiltIn ? 'תפקיד מובנה' : 'תפקיד מותאם'}
              </div>
              <h3 className="display text-2xl text-ink leading-tight">
                {mode === 'create' ? 'הגדרת תפקיד חדש' : `עריכת ${role?.name}`}
              </h3>
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

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
          {/* Name + Description */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
            <div>
              <label className="block">
                <span className="eyebrow block mb-2">שם התפקיד</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="למשל: אנליסט/ית נתונים"
                  className="w-full h-11 px-3 bg-paper-light border-2 border-ink-line text-[15px] focus:outline-none focus:border-petrol transition-colors"
                />
                {errors.name && (
                  <span className="text-[12px] text-oxblood mt-1.5 block">{errors.name}</span>
                )}
              </label>
            </div>
            <div>
              <label className="block">
                <span className="eyebrow block mb-2">אייקון</span>
                <select
                  value={form.icon}
                  onChange={(e) => setField('icon', e.target.value)}
                  className="w-full h-11 px-3 bg-paper-light border-2 border-ink-line text-[14px] focus:outline-none focus:border-petrol transition-colors cursor-pointer"
                >
                  {availableIcons.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <label className="block">
            <span className="eyebrow block mb-2">תיאור קצר</span>
            <textarea
              value={form.desc}
              onChange={(e) => setField('desc', e.target.value)}
              placeholder="2-3 משפטים: מה התפקיד עושה ובאיזו סביבה"
              rows={2}
              className="w-full px-3 py-2 bg-paper-light border-2 border-ink-line text-[14px] focus:outline-none focus:border-petrol transition-colors resize-none leading-relaxed"
            />
          </label>

          {/* Ideal scores */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="eyebrow font-semibold">ציון אידיאלי לכל ממד</span>
              <span className="text-[11px] text-ink-mute">
                מה הציון "המושלם" למועמד/ת בתפקיד הזה
              </span>
            </div>
            <div className="bg-paper border border-ink-line p-4 space-y-3">
              {dimensionOrder.map((d) => {
                const m = dimensions[d];
                return (
                  <div key={d} className="grid grid-cols-[60px_1fr_42px] items-center gap-4">
                    <span className={`text-[12px] font-medium ${m.classes.text}`}>{m.name}</span>
                    <Slider
                      value={form.ideal[d]}
                      onChange={(v) => setDim('ideal', d, v)}
                    />
                    <span className="num text-[13px] text-ink text-left" dir="ltr">
                      {form.ideal[d]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weights */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="eyebrow font-semibold">משקלות לחישוב ההתאמה</span>
              <span className="text-[11px] text-ink-mute">
                כמה כל ממד חשוב לתפקיד · סה"כ: <span className="num font-medium text-ink" dir="ltr">{weightsTotal}</span>
              </span>
            </div>
            <div className="bg-paper border border-ink-line p-4 space-y-3">
              {dimensionOrder.map((d) => {
                const m = dimensions[d];
                return (
                  <div key={d} className="grid grid-cols-[60px_1fr_42px] items-center gap-4">
                    <span className={`text-[12px] font-medium ${m.classes.text}`}>{m.name}</span>
                    <Slider
                      value={form.weights[d]}
                      onChange={(v) => setDim('weights', d, v)}
                    />
                    <span className="num text-[13px] text-ink text-left" dir="ltr">
                      {form.weights[d]}
                    </span>
                  </div>
                );
              })}
            </div>
            {errors.weights && (
              <span className="text-[12px] text-oxblood mt-1.5 block">{errors.weights}</span>
            )}
          </div>

          {/* Traits */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="eyebrow font-semibold">תכונות חשובות לתפקיד</span>
              <span className="text-[11px] text-ink-mute">
                רשימה חופשית — לא משפיע על החישוב, רק מתעד
              </span>
            </div>
            <TraitChips
              traits={form.traits || []}
              onChange={(t) => setField('traits', t)}
            />
          </div>
        </div>

        <footer className="border-t border-ink-line p-5 flex items-center justify-between gap-3 shrink-0 bg-paper-light/95">
          <div className="flex items-center gap-2">
            {isEdit && !isBuiltIn && (
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 h-10 px-3 border-2 border-oxblood/40 text-oxblood text-[12px] tracking-widish uppercase font-medium hover:bg-oxblood hover:text-paper-light transition-all"
              >
                <Trash2 size={14} />
                מחקי תפקיד
              </button>
            )}
            {isEdit && isBuiltIn && hasOverride && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 h-10 px-3 border-2 border-ink-line text-ink-soft text-[12px] tracking-widish uppercase font-medium hover:border-ochre hover:text-ochre transition-all"
              >
                <RotateCcw size={14} />
                איפוס לברירת מחדל
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="eyebrow text-ink-soft hover:text-ink px-3"
            >
              ביטול
            </button>
            <Button onClick={handleSave} size="lg">
              {mode === 'create' ? 'יצירת תפקיד' : 'שמירת שינויים'}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
