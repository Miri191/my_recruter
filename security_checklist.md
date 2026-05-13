# 🛡️ צ'קליסט אבטחה חודשי - Persona

תאריך הבדיקה: ___________________

## 1️⃣ Row Level Security
- [ ] בדקתי שRLS מופעל על כל הטבלאות (SQL: SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public')
- [ ] עשיתי בדיקה עם 2 חשבונות שונים - כל אחד רואה רק את הנתונים שלו
- [ ] אין שגיאות RLS ב-Supabase Logs

## 2️⃣ Authentication
- [ ] Email confirmation מופעל
- [ ] Password requirements: מינימום 8 תווים
- [ ] Rate limiting פעיל על login ו-signup
- [ ] בדקתי שאין משתמשים חשודים ב-Authentication → Users

## 3️⃣ Secrets
- [ ] service_role key לא בקוד (grep -r "service_role" src/)
- [ ] קובץ .env ב-.gitignore
- [ ] לא דחפתי .env ל-Git (git log --all --full-history -- ".env*")
- [ ] המפתחות ב-Vercel Environment Variables - לא במקום אחר

## 4️⃣ HTTPS
- [ ] האתר מציג 🔒 ירוק/אפור בכל הדפים
- [ ] אין קישורי http:// בקוד

## 5️⃣ Email
- [ ] המיילים מ-Supabase לא נכנסים ל-spam (בדקי עם כמה ספקי מייל)
- [ ] התבניות בעברית ועם לוגו

## 6️⃣ Privacy
- [ ] דף "תנאי שימוש" קיים ונגיש
- [ ] דף "מדיניות פרטיות" קיים ונגיש
- [ ] מסך הסכמה למועמד לפני מילוי השאלון
- [ ] יש דרך למחוק נתונים של מועמד (לבקשה)

## 7️⃣ Code
- [ ] הרצתי npm audit ואין vulnerabilities גבוהות
- [ ] אין console.log עם נתונים רגישים בקוד production
- [ ] כל הקלטות עוברות validation לפני שליחה ל-DB

## 8️⃣ Backups
- [ ] Supabase עושה backups אוטומטיים (בדקי Settings → Database → Backups)
- [ ] הורדתי backup ידני פעם אחרונה בתאריך: __________

## 9️⃣ Monitoring
- [ ] בדקתי Supabase Logs - אין הודעות חשודות
- [ ] בדקתי Vercel Logs - אין שגיאות 500
- [ ] בדקתי Authentication → Users - אין משתמשים מחו"ל לא צפויים

## 🔟 Incident Response
- [ ] יש לי תכנית למקרה של דליפת נתונים (מי לפנות, מה לעשות)
- [ ] יש לי גישה לוגים של חודש אחורה לפחות
- [ ] אני יודעת איך לבטל מפתחות במקרה הצורך

---

חתימה: ___________________
תאריך הבדיקה הבאה: ___________________
