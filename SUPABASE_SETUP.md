# 🚀 הקמת Supabase — Phase 1 (חד-פעמי, ~15 דקות)

עד שתסיימי את כל השלבים, האפליקציה ממשיכה לעבוד **בדיוק כמו עכשיו** (סיסמה + localStorage). אחרי שתסיימי וה-env vars יוטמעו ב-Vercel — המערכת תעבור אוטומטית למצב cloud עם משתמשים אמיתיים והפרדה בין ארגונים.

---

## שלב 1 — יצירת פרויקט Supabase (5 דק׳)

1. כנסי ל-https://supabase.com והירשמי (אפשר ב-GitHub).
2. לחצי **"New Project"**.
3. מלאי:
   - **Name:** `persona-production`
   - **Database password:** סיסמה חזקה — שמרי במנהל סיסמאות (1Password / Bitwarden)
   - **Region:** **Central EU (Frankfurt)** — הכי קרוב לישראל
   - **Pricing:** **Free Tier** מספיק
4. **Create Project** — לוקח 2-3 דקות.

---

## שלב 2 — הרצת ה-SQL (2 דק׳)

לאחר שהפרויקט מוכן:

1. בתפריט השמאלי: **Database → SQL Editor**.
2. לחצי **"+ New query"**.
3. פתחי בעורך הקוד את הקובץ `supabase/schema.sql` שבריפו, העתיקי את כל התוכן.
4. הדביקי בחלון SQL Editor → **Run** (או Cmd+Enter).
5. ✓ אמורות לראות "Success. No rows returned."

זה יצר:
- שתי טבלאות: `organizations` ו-`profiles`
- מדיניות Row Level Security (RLS) — בידוד מלא בין ארגונים
- טריגר אוטומטי שיוצר ארגון + פרופיל בכל הרשמה חדשה

---

## שלב 3 — קבלת המפתחות (1 דק׳)

1. **Settings → API**.
2. תעתיקי שני ערכים:
   - **Project URL:** `https://xxxxxxxxx.supabase.co` (אפשר לחשוף)
   - **anon public** key: `eyJhbG...` (אפשר לחשוף — מוגן ע"י RLS)

⚠ **לא** להעתיק את `service_role` — זה מפתח רגיש שלא צריך לצאת מ-Supabase Dashboard.

---

## שלב 4 — הוספת המפתחות ל-Vercel (3 דק׳)

1. https://vercel.com/dashboard → הפרויקט `my-recruter` → **Settings → Environment Variables**.
2. הוסיפי **שני** משתנים:

| Name | Value | Environments |
|---|---|---|
| `VITE_SUPABASE_URL` | ה-Project URL מהשלב הקודם | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | ה-anon public key | Production, Preview, Development |

3. **Save**.
4. **Deployments** → לחצי "..." בבילד האחרון → **Redeploy** → ✓ Use existing Build Cache → **Redeploy**.

מאותו רגע, האפליקציה רצה במצב cloud.

---

## שלב 5 — הגדרת אימייל ב-Supabase (3 דק׳)

ב-Supabase Dashboard:

1. **Authentication → Providers → Email**:
   - Enable Email Provider: **✓**
   - Confirm email: **✓** (חובה — אבטחה)
   - Secure email change: **✓**
   - Secure password change: **✓**

2. **Authentication → URL Configuration**:
   - **Site URL:** `https://my-recruter.vercel.app`
   - **Redirect URLs:** הוסיפי `https://my-recruter.vercel.app/**`
   - (אם משתמשת ב-domain אחר — להוסיף גם אותו)

---

## שלב 6 — בדיקה (5 דק׳)

לאחר ה-Redeploy:

1. כנסי ל-https://my-recruter.vercel.app/login
2. **הירשמי חשבון ראשון** עם המייל שלך → תקבלי הודעת אימות במייל → לחצי על הקישור.
3. תועברי לדף Login → התחברי → תגיעי לדשבורד.
4. בסרגל הצד למטה — תראי את השם והאימייל שלך עם תפריט נשלף.
5. **בדיקת בידוד:** הירשמי בדפדפן/incognito עם אימייל שני (`test@example.com`). תראי שהדשבורד שלך ריק — לא רואה את המועמדים של החשבון הראשון. זה ה-RLS עובד.

---

## מצב נוכחי (לפני שתסיימי את ההגדרה)

עד שה-env vars יוטמעו, האפליקציה רצה במצב **localStorage + סיסמה**:
- דף הנחיתה והשאלון נגישים לכולם
- הדשבורד מוגן בסיסמה הקיימת `persona2026` (דרך AuthGate)
- כל הנתונים נשמרים בדפדפן בלבד

זו לא רגרסיה — זה fallback מכוון. ברגע שמשתני הסביבה ב-Vercel ייכנסו לתוקף, הקוד יחליף אוטומטית למצב Supabase ותראי את דפי `/login` ו-`/signup` ויפעיל ProtectedRoute אמיתי.

---

## מה הלאה (Phase 2)

לאחר Phase 1, יבוא Phase 2:
- טבלאות מועמדים, תפקידים, תשובות, דוחות עם RLS
- מיגרציה אמיתית של נתוני localStorage לענן
- Realtime — מועמד מסיים שאלון → את רואה מיד
- Phase 3: הזמנת משתמשים, billing, custom roles
