import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Database, Users, Briefcase, CheckCircle2 } from 'lucide-react';
import {
  getLocalStorageStats,
  isMigrationComplete,
  migrateLocalStorageToSupabase,
  flagMigrationSkipped,
} from '../lib/migration';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const stats = useMemo(() => getLocalStorageStats(), []);
  const alreadyDone = useMemo(() => isMigrationComplete(), []);
  const [working, setWorking] = useState(false);
  const [done, setDone] = useState(false);

  // If there's nothing to migrate (or already done) → straight to dashboard.
  useEffect(() => {
    if (!stats.hasData || alreadyDone) {
      navigate('/dashboard', { replace: true });
    }
  }, [stats.hasData, alreadyDone, navigate]);

  const handleMigrate = async () => {
    setWorking(true);
    try {
      await migrateLocalStorageToSupabase(user?.id);
      setDone(true);
      setTimeout(() => navigate('/dashboard', { replace: true }), 1800);
    } catch {
      setWorking(false);
    }
  };

  const handleSkip = () => {
    flagMigrationSkipped();
    navigate('/dashboard', { replace: true });
  };

  if (done) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="bg-paper-light border-2 border-ink shadow-petrol p-8 text-center max-w-md">
          <div className="mx-auto w-14 h-14 border-2 border-forest bg-forest-tint text-forest flex items-center justify-center mb-4">
            <CheckCircle2 size={26} strokeWidth={1.75} />
          </div>
          <h1 className="display text-2xl text-ink mb-2">הנתונים סומנו</h1>
          <p className="text-[14px] text-ink-soft">מעבירה אותך לדשבורד...</p>
        </div>
      </div>
    );
  }

  const firstName = profile?.full_name?.split(' ')[0] || '';

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 border-2 border-ink bg-paper-light flex items-center justify-center">
            <Sparkles size={20} className="text-petrol" />
          </div>
          <div>
            <div className="display text-3xl text-ink leading-none" dir="ltr">
              Persona
            </div>
            <div className="text-[11px] tracking-wider2 uppercase text-ink-mute mt-1">
              ברוכה הבאה
            </div>
          </div>
        </div>

        <div className="bg-paper-light border-2 border-ink shadow-petrol p-8">
          <div className="eyebrow-petrol mb-2">העברה לסביבה החדשה</div>
          <h1 className="display text-3xl text-ink mb-3 text-balance">
            שלום{firstName ? `, ${firstName}` : ''}! מצאנו נתונים בעבודה הקודמת שלך.
          </h1>
          <p className="text-[14px] text-ink-soft leading-relaxed mb-6">
            מצאנו תוכן ששמרת מקומית בדפדפן. תרצי להעביר אותו לסביבת הענן החדשה שלך?
          </p>

          <div className="bg-paper border border-ink-line p-5 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto border border-petrol/40 bg-petrol-tint text-petrol flex items-center justify-center mb-2">
                  <Users size={18} strokeWidth={1.75} />
                </div>
                <div className="num display text-3xl text-ink leading-none">
                  {stats.candidatesCount}
                </div>
                <div className="text-[11px] text-ink-mute mt-1">מועמדים</div>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto border border-forest/40 bg-forest-tint text-forest flex items-center justify-center mb-2">
                  <Database size={18} strokeWidth={1.75} />
                </div>
                <div className="num display text-3xl text-ink leading-none">
                  {stats.reportsCount}
                </div>
                <div className="text-[11px] text-ink-mute mt-1">דוחות שמורים</div>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto border border-brick/40 bg-brick-tint text-brick flex items-center justify-center mb-2">
                  <Briefcase size={18} strokeWidth={1.75} />
                </div>
                <div className="num display text-3xl text-ink leading-none">
                  {stats.customRolesCount}
                </div>
                <div className="text-[11px] text-ink-mute mt-1">תפקידים מותאמים</div>
              </div>
            </div>
          </div>

          <div className="bg-ochre-tint border border-ochre/40 px-4 py-3 mb-6 text-[12px] text-ochre leading-relaxed">
            <span className="font-semibold">שימי לב:</span> פעולת ההעברה משייכת את הנתונים
            לארגון שלך ואינה ניתנת לביטול. בשלב זה הנתונים יסומנו להעברה; ההעברה עצמה
            תבוצע באחד מהעדכונים הבאים של המערכת.
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <Button
              onClick={handleMigrate}
              size="lg"
              fullWidth
              disabled={working}
            >
              {working ? 'מעבירה…' : '✓ העבירי הכל'}
            </Button>
            <Button
              onClick={handleSkip}
              variant="secondary"
              size="lg"
              fullWidth
              disabled={working}
            >
              דלגי — התחילי נקי
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
