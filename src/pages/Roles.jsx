import { useMemo, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Lock,
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
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import PageHeader from '../components/layout/Header';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import RoleEditor from '../components/recruiter/RoleEditor';
import { useApp } from '../context/AppContext';
import { dimensions, dimensionOrder } from '../data/dimensions';
import { isDefaultRoleId } from '../data/roles';

const iconMap = {
  Handshake, Compass, Code2, Palette, Headphones, Users,
  Briefcase, Target, TrendingUp, Sparkles, Zap, Heart,
  Shield, Crown, Lightbulb, Wrench,
};

function MiniDimBars({ weights }) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="flex items-center gap-1 h-1.5">
      {dimensionOrder.map((d) => {
        const meta = dimensions[d];
        const pct = (weights[d] / total) * 100;
        return (
          <div
            key={d}
            className={`h-full ${meta.classes.bar}`}
            style={{ width: `${pct}%`, minWidth: pct > 0 ? '4px' : '0' }}
            title={`${meta.name}: ${weights[d]}`}
          />
        );
      })}
    </div>
  );
}

function RoleCardLarge({ role, candidateCount, onEdit, onDelete, onReset }) {
  const Icon = iconMap[role.icon] || Briefcase;
  const isBuiltIn = isDefaultRoleId(role.id);
  const isCustom = role.isCustom;

  return (
    <Card variant="elev" padding="p-5" className="flex flex-col">
      <header className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 border border-petrol/30 bg-petrol-tint text-petrol flex items-center justify-center shrink-0">
            <Icon size={20} strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <div className="display text-[19px] text-ink leading-tight truncate">{role.name}</div>
            <div className="flex items-center gap-2 mt-1">
              {isCustom ? (
                <Badge tone="petrol" size="sm">מותאם</Badge>
              ) : role.hasOverride ? (
                <Badge tone="ochre" size="sm">ערוך</Badge>
              ) : (
                <Badge tone="default" size="sm">
                  <Lock size={9} className="ml-0.5" />
                  מובנה
                </Badge>
              )}
              {candidateCount > 0 && (
                <span className="text-[11px] text-ink-mute num">
                  · <span className="text-ink-soft font-medium">{candidateCount}</span> מועמדים
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="w-9 h-9 border border-ink-line text-ink-soft hover:border-petrol hover:bg-petrol-tint hover:text-petrol flex items-center justify-center transition-all shrink-0"
          title="ערוך תפקיד"
          aria-label="ערוך"
        >
          <Pencil size={14} />
        </button>
      </header>

      <p className="text-[13px] text-ink-soft leading-relaxed mb-3 line-clamp-2 min-h-[36px]">
        {role.desc || 'אין תיאור עדיין'}
      </p>

      <div className="mb-3">
        <div className="eyebrow text-ink-mute mb-2">משקלות הממדים</div>
        <MiniDimBars weights={role.weights} />
        <div className="flex justify-between text-[10px] text-ink-mute mt-1.5 tracking-widish uppercase">
          <span>{dimensions.E.key}</span>
          <span>{dimensions.A.key}</span>
          <span>{dimensions.C.key}</span>
          <span>{dimensions.S.key}</span>
          <span>{dimensions.O.key}</span>
        </div>
      </div>

      {role.traits && role.traits.length > 0 && (
        <div className="mt-auto">
          <div className="eyebrow text-ink-mute mb-2">תכונות חשובות</div>
          <div className="flex flex-wrap gap-1.5">
            {role.traits.slice(0, 5).map((t) => (
              <span
                key={t}
                className="text-[11px] text-petrol bg-petrol-tint border border-petrol/30 px-2 py-0.5 font-medium"
              >
                {t}
              </span>
            ))}
            {role.traits.length > 5 && (
              <span className="text-[11px] text-ink-mute py-0.5">+{role.traits.length - 5}</span>
            )}
          </div>
        </div>
      )}

      {(isCustom || role.hasOverride) && (
        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-ink-line/60">
          {isCustom && (
            <button
              type="button"
              onClick={onDelete}
              className="text-[11px] tracking-widish uppercase text-ink-mute hover:text-oxblood font-medium flex items-center gap-1.5"
            >
              <Trash2 size={12} />
              מחקי
            </button>
          )}
          {isBuiltIn && role.hasOverride && (
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] tracking-widish uppercase text-ink-mute hover:text-ochre font-medium flex items-center gap-1.5"
            >
              <RotateCcw size={12} />
              איפוס לברירת מחדל
            </button>
          )}
        </div>
      )}
    </Card>
  );
}

export default function Roles() {
  const { roles, candidates, saveRole, deleteRole, resetRole, showToast } = useApp();
  const [editing, setEditing] = useState(null);
  const [mode, setMode] = useState(null); // 'create' | 'edit'

  const candidateCountByRole = useMemo(() => {
    const counts = {};
    for (const c of candidates) counts[c.roleId] = (counts[c.roleId] || 0) + 1;
    return counts;
  }, [candidates]);

  const openCreate = () => {
    setEditing(null);
    setMode('create');
  };

  const openEdit = (role) => {
    setEditing(role);
    setMode('edit');
  };

  const close = () => {
    setEditing(null);
    setMode(null);
  };

  const handleSave = (role) => {
    saveRole(role);
    showToast(
      mode === 'create' ? 'התפקיד נוצר' : 'התפקיד עודכן',
      'success'
    );
    close();
  };

  const handleDelete = () => {
    if (!editing) return;
    const count = candidateCountByRole[editing.id] || 0;
    const msg =
      count > 0
        ? `יש ${count} מועמדים שמשויכים לתפקיד "${editing.name}". האם למחוק בכל זאת?\nהמועמדים יישארו אך יהיו ללא תפקיד תקף.`
        : `למחוק את התפקיד "${editing.name}"?`;
    if (!window.confirm(msg)) return;
    deleteRole(editing.id);
    showToast('התפקיד נמחק', 'success');
    close();
  };

  const handleReset = () => {
    if (!editing) return;
    if (!window.confirm(`לאפס את "${editing.name}" לערכי ברירת המחדל?`)) return;
    resetRole(editing.id);
    showToast('התפקיד אופס', 'success');
    close();
  };

  const handleResetFromCard = (role) => {
    if (!window.confirm(`לאפס את "${role.name}" לערכי ברירת המחדל?`)) return;
    resetRole(role.id);
    showToast('התפקיד אופס', 'success');
  };

  const handleDeleteFromCard = (role) => {
    const count = candidateCountByRole[role.id] || 0;
    const msg =
      count > 0
        ? `יש ${count} מועמדים שמשויכים לתפקיד "${role.name}". האם למחוק בכל זאת?\nהמועמדים יישארו אך יהיו ללא תפקיד תקף.`
        : `למחוק את התפקיד "${role.name}"?`;
    if (!window.confirm(msg)) return;
    deleteRole(role.id);
    showToast('התפקיד נמחק', 'success');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-6 md:px-12 py-8 md:py-14 max-w-[1400px] w-full mx-auto">
        <PageHeader
          title="ניהול תפקידים"
          subtitle="עריכת פרופיל אישיותי אידיאלי לכל תפקיד, משקלות החישוב, ותכונות חשובות."
          action={
            <Button size="lg" onClick={openCreate}>
              + תפקיד חדש
            </Button>
          }
        />

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map((role) => (
            <RoleCardLarge
              key={role.id}
              role={role}
              candidateCount={candidateCountByRole[role.id] || 0}
              onEdit={() => openEdit(role)}
              onDelete={() => handleDeleteFromCard(role)}
              onReset={() => handleResetFromCard(role)}
            />
          ))}
        </section>

        {mode && (
          <RoleEditor
            role={editing}
            mode={mode}
            onSave={handleSave}
            onDelete={handleDelete}
            onReset={handleReset}
            onClose={close}
          />
        )}
      </main>
    </div>
  );
}
