# Recruiter Personality Platform - Build Specification

## 🎯 Project Overview

Build a complete **Hebrew RTL recruiter personality assessment platform** that allows recruiters to send BIG5 personality questionnaires to candidates, analyze their fit for specific roles, and generate insightful candidate reports.

**Critical requirements:**
- Hebrew RTL interface throughout
- Mobile-first design for the candidate questionnaire
- Modern energetic visual style: indigo/purple primary, with teal accents
- Production-grade code quality with clean architecture
- No backend needed - use localStorage for data persistence

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v3 (with RTL support)
- **Icons:** Lucide React
- **Charts:** Recharts (for the radar/bar chart in the report)
- **State management:** React Context + useReducer (no Redux needed)
- **Persistence:** localStorage (wrapped in a clean service)
- **Language:** JavaScript (NOT TypeScript - keep it accessible for a non-developer)

---

## 📁 Project Structure

```
recruiter-platform/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI primitives
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx      # Desktop sidebar for recruiter
│   │   │   └── MobileFrame.jsx  # Visual phone frame for candidate flow
│   │   └── recruiter/
│   │       ├── CandidateRow.jsx
│   │       ├── RoleCard.jsx
│   │       └── ScoreBar.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx        # Recruiter home - list of candidates
│   │   ├── NewInvitation.jsx    # Create new candidate invitation
│   │   ├── CandidateLink.jsx    # Shows the generated link to share
│   │   ├── Questionnaire.jsx    # Mobile candidate experience
│   │   ├── ThankYou.jsx         # After candidate finishes
│   │   └── Report.jsx           # Recruiter views candidate analysis
│   ├── data/
│   │   ├── questions.js         # All 50 BIG5 questions
│   │   ├── roles.js             # Role profiles with ideal scores
│   │   └── dimensions.js        # The 5 dimension definitions
│   ├── lib/
│   │   ├── scoring.js           # BIG5 score calculation
│   │   ├── fit.js               # Role fit calculation
│   │   ├── insights.js          # Generate strengths/concerns/questions
│   │   └── storage.js           # localStorage wrapper
│   ├── context/
│   │   └── AppContext.jsx       # Global state (candidates, current session)
│   ├── App.jsx                  # Routes
│   ├── main.jsx                 # Entry point
│   └── index.css                # Tailwind + custom CSS variables
├── index.html                   # With dir="rtl" lang="he"
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🎨 Design System

### Colors (define as CSS variables in index.css)

```css
:root {
  /* Primary - Indigo/Purple gradient family */
  --color-primary-50: #EEF2FF;
  --color-primary-100: #E0E7FF;
  --color-primary-500: #6366F1;
  --color-primary-600: #4F46E5;
  --color-primary-700: #4338CA;
  --color-primary-900: #312E81;
  
  /* Accent - Teal */
  --color-accent-50: #F0FDFA;
  --color-accent-500: #14B8A6;
  --color-accent-600: #0D9488;
  
  /* Semantic */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  
  /* Neutral */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-500: #6B7280;
  --color-gray-700: #374151;
  --color-gray-900: #111827;
}
```

### Typography
- **Font family:** Use system fonts that work well with Hebrew: `'Heebo', 'Assistant', system-ui, sans-serif`
- Add Google Fonts link in index.html: Heebo (weights 400, 500, 600, 700)
- **Headings:** 600 weight, Hebrew-friendly line-height of 1.4
- **Body:** 400 weight, line-height 1.6

### Visual style guidelines
- **Modern energetic** - use the indigo/purple as primary brand color
- **Subtle gradients** acceptable for hero areas and primary buttons (indigo-600 to purple-600)
- **Rounded corners:** rounded-xl (12px) for cards, rounded-lg (8px) for inputs/buttons
- **Shadows:** Use Tailwind's shadow-sm and shadow-md sparingly
- **Spacing:** Generous - p-6 for cards, gap-4 minimum between elements
- **Transitions:** All hover/interaction states should have `transition-all duration-200`

---

## 📊 Data Models

### Question (50 items)
```js
{
  n: 1,                        // Question number 1-50
  t: 'אני "עושה שמח" במסיבות',  // Question text in Hebrew
  d: 'E',                      // Dimension: E/A/C/N/O
  r: false                     // Reverse-scored?
}
```

Use the exact same 50 questions from BIG5 (Hebrew version). I'll provide them at the end of this document.

### Dimensions
```js
const dimensions = {
  E: { name: 'מוחצנות', desc: 'אנרגיה חברתית, נכונות לבלוט', color: 'purple' },
  A: { name: 'חברתיות', desc: 'אמפתיה, שיתוף פעולה, חמלה', color: 'pink' },
  C: { name: 'מצפוניות', desc: 'משמעת, ארגון, אחריות', color: 'teal' },
  S: { name: 'יציבות רגשית', desc: 'שליטה רגשית, רוגע תחת לחץ', color: 'blue' },
  O: { name: 'פתיחות/דמיון', desc: 'יצירתיות, סקרנות, חדשנות', color: 'amber' }
}
```

Note: N (Neuroticism) questions get reversed to S (Emotional Stability) for the final score.

### Roles (6 roles with ideal personality profiles)
```js
{
  id: 'sales',
  name: 'איש מכירות',
  desc: 'תפקיד פרונטלי, פגישות לקוחות, סגירת עסקאות',
  ideal: { E: 80, A: 65, C: 70, S: 75, O: 60 },
  weights: { E: 25, A: 20, C: 15, S: 25, O: 15 }
}
```

All 6 roles: sales, pm (project manager), dev (developer), designer (UX/UI), service (customer service), manager (team manager). Use the same ideal/weights values from the prototype.

### Candidate (stored in localStorage)
```js
{
  id: 'uuid-here',
  name: 'מירי כהן',
  email: 'miri@example.com',
  phone: '0501234567',
  roleId: 'pm',
  status: 'pending' | 'completed',
  createdAt: '2026-05-12T10:00:00Z',
  completedAt: null | '2026-05-12T10:15:00Z',
  answers: { 1: 4, 2: 2, ... }  // null until completed
}
```

---

## 🧮 Core Logic

### Scoring algorithm (`lib/scoring.js`)

```js
export function calculateScores(answers, questions) {
  const sums = { E: 0, A: 0, C: 0, S: 0, O: 0 };
  const counts = { E: 0, A: 0, C: 0, S: 0, O: 0 };
  
  questions.forEach(q => {
    const ans = answers[q.n];
    if (!ans) return;
    
    let score = q.r ? (6 - ans) : ans;
    let dim = q.d;
    
    // Neuroticism gets flipped to become Emotional Stability
    if (q.d === 'N') {
      dim = 'S';
      score = q.r ? ans : (6 - ans);
    }
    
    sums[dim] += score;
    counts[dim]++;
  });
  
  const result = {};
  Object.keys(sums).forEach(d => {
    const avg = counts[d] ? sums[d] / counts[d] : 3;
    result[d] = Math.round(((avg - 1) / 4) * 100);  // Scale to 0-100
  });
  return result;
}
```

### Fit calculation (`lib/fit.js`)

```js
export function calculateFit(scores, role) {
  let totalDiff = 0;
  let totalWeight = 0;
  const dimFit = {};
  
  Object.keys(role.ideal).forEach(d => {
    const diff = Math.abs(scores[d] - role.ideal[d]);
    const w = role.weights[d];
    totalDiff += diff * w;
    totalWeight += w;
    dimFit[d] = Math.max(0, 100 - diff);
  });
  
  const fit = Math.max(0, Math.round(100 - (totalDiff / totalWeight)));
  return { fit, dimFit };
}
```

### Insights generation (`lib/insights.js`)

Generate three lists based on the scores vs role ideal:
- **strengths:** dimensions where score >= 70 AND within 15 of ideal
- **concerns:** dimensions with significant gap (>20 below ideal, or >25 above for E and C)
- **interviewQuestions:** behavioral questions tailored to low-scoring dimensions

(Use the exact logic from the prototype I showed)

---

## 🗺️ Pages & User Flows

### Flow 1: Recruiter creates an invitation
```
Dashboard → "+ מועמד חדש" button → NewInvitation page →
fill form (name, email, phone, role) → "צור קישור" →
CandidateLink page (shows shareable URL) → copy/send
```

### Flow 2: Candidate fills questionnaire
```
Opens link → Questionnaire (welcome screen) → "בואו נתחיל" →
50 questions one at a time → auto-advance on selection →
ThankYou page
```

### Flow 3: Recruiter reviews report
```
Dashboard → click candidate row → Report page →
view scores, fit %, strengths, concerns, interview questions
```

### Page details

#### `/` - Dashboard (Recruiter)
- Header with title "פלטפורמת אבחון אישיותי"
- Stats cards: סה"כ מועמדים | ממתינים | הושלמו | ממוצע התאמה
- Search bar + filter by role
- Table of candidates: שם | תפקיד | סטטוס | תאריך | התאמה | פעולות
- "+ מועמד חדש" CTA button (primary indigo gradient)
- Empty state when no candidates yet

#### `/new` - NewInvitation
- Step 1: Select role (6 cards in 2-col grid)
- Step 2: Fill candidate details (name, email, phone)
- Step 3: Submit → generates UUID, saves to localStorage, navigates to CandidateLink

#### `/link/:id` - CandidateLink
- Big "✓ הקישור נוצר בהצלחה" success message
- Copyable link: `${window.location.origin}/q/${id}`
- "העתק קישור" button (copies to clipboard, shows confirmation)
- Quick share buttons: WhatsApp, Email, SMS (use mailto: / sms: / wa.me)
- "חזרה לדשבורד" link

#### `/q/:id` - Questionnaire (Candidate, mobile-first)
- This is the most important page - it must feel polished and easy on mobile
- Welcome screen with avatar/initial of recruiter (use first letter)
- Question screen: dimension badge + question text + 5 likert options (Hebrew labels not just numbers)
- Auto-advance 300ms after selection
- "הקודם" / "הבא" navigation buttons
- Progress bar with percentage
- ThankYou screen when done with reference number

#### `/report/:id` - Report (Recruiter)
- Candidate name header + role badge + back button
- Big fit percentage card with color (green >75 / amber 55-75 / red <55)
- Radar chart showing the 5 dimensions (candidate vs ideal) - use Recharts
- Per-dimension breakdown with bars
- Three sections: חוזקות / נקודות לתשומת לב / שאלות לראיון
- "הורד דוח PDF" button (just console.log for now, we'll add real PDF later)

---

## 🔧 Implementation Notes

### RTL Setup
1. `index.html` must have `<html dir="rtl" lang="he">`
2. Tailwind: use `text-right` as default, `text-left` only when needed
3. For icons that have direction (arrows), use proper Lucide icons (ArrowRight for "next" in RTL becomes ArrowLeft visually - test this)
4. For spacing: prefer `gap-X` over `space-x-X` (RTL-aware)

### Mobile-first questionnaire
- Wrap the questionnaire in a max-width container (max-w-md)
- All tap targets minimum 48px height
- Use `touch-manipulation` CSS class for better mobile feel
- Test on mobile viewport in dev tools

### LocalStorage strategy
- Single key: `recruiter_app_data`
- Structure: `{ candidates: [...], version: 1 }`
- Wrap in a service (`lib/storage.js`) with methods:
  - `getCandidates()`, `getCandidate(id)`, `saveCandidate(candidate)`, `updateCandidate(id, updates)`, `deleteCandidate(id)`

### React Context
- `AppContext` provides candidates list + CRUD methods
- Loads from localStorage on mount
- Syncs back to localStorage on every change

### URL routing
```
/                  - Dashboard
/new               - New invitation form
/link/:id          - Show shareable link
/q/:id             - Candidate questionnaire (public, mobile)
/q/:id/done        - Thank you screen
/report/:id        - Candidate report
```

---

## 📝 The 50 BIG5 Questions

Create `src/data/questions.js` with this exact array:

```js
export const questions = [
  { n: 1, t: 'אני "עושה שמח" במסיבות', d: 'E', r: false },
  { n: 2, t: 'לא כל כך אכפת לי מאחרים', d: 'A', r: true },
  { n: 3, t: 'אני תמיד מוכן לכל אפשרות', d: 'C', r: false },
  { n: 4, t: 'אני נלחץ בקלות', d: 'N', r: false },
  { n: 5, t: 'יש לי אוצר מילים עשיר', d: 'O', r: false },
  { n: 6, t: 'אני לא מדבר הרבה', d: 'E', r: true },
  { n: 7, t: 'אני מתעניין באנשים', d: 'A', r: false },
  { n: 8, t: 'אני משאיר את הדברים שלי בכל מקום', d: 'C', r: true },
  { n: 9, t: 'לרוב אני רגוע', d: 'N', r: true },
  { n: 10, t: 'יש לי קושי להבין רעיונות מופשטים', d: 'O', r: true },
  { n: 11, t: 'אני מרגיש בנוח עם אנשים', d: 'E', r: false },
  { n: 12, t: 'אני מעליב אנשים', d: 'A', r: true },
  { n: 13, t: 'אני שם לב לפרטים', d: 'C', r: false },
  { n: 14, t: 'לרוב אני מודאג', d: 'N', r: false },
  { n: 15, t: 'יש לי דמיון פורה', d: 'O', r: false },
  { n: 16, t: 'אני נוטה לא לבלוט', d: 'E', r: true },
  { n: 17, t: 'באופן כללי אני מסמפט אנשים', d: 'A', r: false },
  { n: 18, t: 'אני נוטה לסבך דברים', d: 'C', r: true },
  { n: 19, t: 'לרוב אינני מדוכא', d: 'N', r: true },
  { n: 20, t: 'אני לא מתעניין ברעיונות מופשטים', d: 'O', r: true },
  { n: 21, t: 'אני נוטה להתחיל בשיחות', d: 'E', r: false },
  { n: 22, t: 'אני לא מתעניין בבעיות של אחרים', d: 'A', r: true },
  { n: 23, t: 'אני מעדיף לטפל במשימות במהרה', d: 'C', r: false },
  { n: 24, t: 'אני מוטרד בקלות', d: 'N', r: false },
  { n: 25, t: 'יש לי רעיונות מצוינים', d: 'O', r: false },
  { n: 26, t: 'אין לי הרבה מה להגיד', d: 'E', r: true },
  { n: 27, t: 'יש לי "לב רך"', d: 'A', r: false },
  { n: 28, t: 'לעיתים קרובות אני שוכח להחזיר דברים למקומם', d: 'C', r: true },
  { n: 29, t: 'מפריעים לי בקלות', d: 'N', r: false },
  { n: 30, t: 'אין לי דמיון רב', d: 'O', r: true },
  { n: 31, t: 'אני אוהב לדבר עם אנשים שונים במסיבות', d: 'E', r: false },
  { n: 32, t: 'אינני מתעניין במיוחד באנשים אחרים', d: 'A', r: true },
  { n: 33, t: 'אני אוהב סדר', d: 'C', r: false },
  { n: 34, t: 'יש לי שינויים במצב רוח', d: 'N', r: false },
  { n: 35, t: 'אני מבין די מהר', d: 'O', r: false },
  { n: 36, t: 'אני לא אוהב למשוך תשומת לב', d: 'E', r: true },
  { n: 37, t: 'אני מקדיש זמן בשביל אחרים', d: 'A', r: false },
  { n: 38, t: 'אני נוטה להתחמק מחובותי', d: 'C', r: true },
  { n: 39, t: 'יש לי הרבה תנודות במצב הרוח', d: 'N', r: false },
  { n: 40, t: 'אני משתמש במילים גבוהות', d: 'O', r: false },
  { n: 41, t: 'לא מפריע לי להיות במרכז העניינים', d: 'E', r: false },
  { n: 42, t: 'אני חש רגשות של אחרים', d: 'A', r: false },
  { n: 43, t: 'אני מעדיף לעבוד לפי סדר קבוע', d: 'C', r: false },
  { n: 44, t: 'אני מתעצבן בקלות', d: 'N', r: false },
  { n: 45, t: 'אני מקדיש זמן כדי להרהר על דברים', d: 'O', r: false },
  { n: 46, t: 'אינני מדבר הרבה עם זרים', d: 'E', r: true },
  { n: 47, t: 'אנשים מרגישים נוח סביבי', d: 'A', r: false },
  { n: 48, t: 'אני קפדן בעבודה שלי', d: 'C', r: false },
  { n: 49, t: 'אני נוטה להרגיש מדוכא', d: 'N', r: false },
  { n: 50, t: 'אני מלא רעיונות', d: 'O', r: false }
];
```

### Likert labels for the questionnaire
```js
export const likertLabels = [
  { v: 1, t: 'מאוד לא מאפיין אותי' },
  { v: 2, t: 'לא מאפיין אותי בדרך כלל' },
  { v: 3, t: 'לעיתים מאפיין ולעיתים לא' },
  { v: 4, t: 'מאפיין אותי בדרך כלל' },
  { v: 5, t: 'מאוד מאפיין אותי' }
];
```

---

## 🚀 Build Instructions

1. Initialize project with Vite: `npm create vite@latest . -- --template react`
2. Install all dependencies: `react-router-dom`, `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`, `recharts`, `uuid`
3. Configure Tailwind with the Heebo font and custom colors
4. Set up the full file structure
5. Build all pages in the order: Dashboard → NewInvitation → CandidateLink → Questionnaire → ThankYou → Report
6. Make sure to seed 2-3 example candidates in localStorage on first load so the dashboard isn't empty (one completed, one pending)
7. Run `npm run dev` and verify everything works at `http://localhost:5173`

## ✅ Quality Checklist

Before saying you're done, verify:
- [ ] Hebrew RTL throughout, no LTR text leaking
- [ ] All 50 questions present and correctly scored
- [ ] Mobile questionnaire works smoothly on viewport 380x800
- [ ] Dashboard table is clean and scannable
- [ ] Report page renders the radar chart with both candidate and ideal values
- [ ] Color system consistent (indigo primary, teal accent)
- [ ] All buttons have hover/active states
- [ ] localStorage actually persists between page reloads
- [ ] No console errors or warnings

---

## 🎁 Bonus (Optional)

If time allows, add these niceties:
- Loading spinner when navigating between pages
- Toast notifications when actions succeed (copied link, candidate created)
- Sort/filter on the dashboard
- Export candidate data to JSON

---

**Start building. When complete, give me a summary of what was built and how to run it.**
