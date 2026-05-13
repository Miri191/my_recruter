# Feature: Backend Foundation - Multi-Tenant User Management with Supabase

## 🎯 Goal

Build a production-grade backend foundation for Persona using **Supabase + PostgreSQL + Multi-Tenant architecture**. This is **Phase 1 of 3** - we're building the auth and organization layer, then in later phases we'll migrate the existing localStorage data and add billing.

**Critical principle:** Don't break the existing app. The current localStorage-based flow continues to work. We're ADDING auth and organization layers ALONGSIDE it.

---

## 🏗️ Architecture Decisions (Already Made)

- **Backend:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Multi-tenancy model:** **Full Multi-Tenant** - multiple organizations, each with multiple users, complete data isolation via RLS
- **Auth method:** Email/Password only (simple, fast, no third-party dependencies)
- **Data isolation:** Row Level Security (RLS) on every table - enforced at the database level
- **Migration approach:** Gradual - keep localStorage working, add backend alongside

---

## 📋 Phase 1 Scope (This Prompt)

✅ Supabase project setup (env vars, client config)
✅ Email/Password authentication
✅ Login/Signup/Reset password pages in Hebrew RTL
✅ Database schema: `organizations` + `profiles` + full RLS
✅ Sign-up flow that creates organization automatically
✅ Protected routes (logged-in users only)
✅ Top-bar user menu with name + logout
✅ Organization context throughout the app
✅ Migration detection from localStorage to Supabase

❌ NOT in Phase 1 (saved for Phase 2):
- Inviting other users to an organization
- Custom roles (admin/recruiter/viewer)
- Organization settings page
- Billing
- API keys
- Google OAuth (can be added later if needed)

---

## 🗄️ Step 1: Supabase Setup

### 1.1 Create Supabase Project

Provide these instructions for Miri:

```markdown
# הוראות הקמת Supabase Project (10 דקות)

1. כנסי ל-https://supabase.com והירשמי עם החשבון שלך
2. לחצי "New Project"
3. שם הפרויקט: persona-production
4. סיסמת מסד נתונים: יצרי סיסמה חזקה ושמרי אותה במקום בטוח (1Password וכו')
5. אזור: Central EU (Frankfurt) - הכי קרוב לישראל
6. מחירון: התחילי עם Free Tier (מספיק לפיתוח ו-MVP)
7. לחצי "Create Project" - יקח 2-3 דקות

# קבלת המפתחות
לאחר היצירה, כנסי ל: Settings → API
תוכלי לראות:
- Project URL: https://xxxxxx.supabase.co
- anon public key: eyJhbG... (בסדר לחשוף - יש RLS שמגן)
- service_role key: eyJhbG... (סוד! לעולם אל תשתפי!)

# הוספה ל-Vercel
1. כנסי לפרויקט שלך ב-Vercel
2. Settings → Environment Variables
3. הוסיפי:
   - VITE_SUPABASE_URL = [Project URL מסעיף 1]
   - VITE_SUPABASE_ANON_KEY = [anon public key]
4. שמרי וביצעי Redeploy
```

### 1.2 Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 1.3 Create Supabase Client

**File: `src/lib/supabase.js`**

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. App will work in localStorage mode only.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export const isSupabaseEnabled = !!supabase;
```

---

## 🗄️ Step 2: Database Schema

Run these SQL commands in Supabase SQL Editor (Database → SQL Editor → New Query):

```sql
-- ====================================
-- ORGANIZATIONS TABLE (Tenants)
-- ====================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  industry TEXT,
  size TEXT, -- 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  country TEXT DEFAULT 'IL',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organizations_slug ON organizations(slug);

-- ====================================
-- PROFILES TABLE
-- (extends Supabase's auth.users with our custom fields)
-- ====================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'recruiter', -- 'owner' | 'admin' | 'recruiter' | 'viewer'
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRITICAL: Indexes on RLS-referenced columns for performance
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ====================================
-- AUTO-UPDATE updated_at TIMESTAMP
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- ROW LEVEL SECURITY (CRITICAL FOR MULTI-TENANT!)
-- ====================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Helper function: Get current user's organization_id
-- Uses SECURITY DEFINER to bypass RLS for this internal lookup
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ----- ORGANIZATIONS RLS -----
-- Users can SEE only their own organization
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (id = get_user_organization_id());

-- Only org owners can UPDATE their organization
CREATE POLICY "Owners can update their organization"
  ON organizations FOR UPDATE
  USING (
    id = get_user_organization_id() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- ----- PROFILES RLS -----
-- Users can view all profiles in their organization
CREATE POLICY "Users can view profiles in their organization"
  ON profiles FOR SELECT
  USING (organization_id = get_user_organization_id());

-- Users can update only their OWN profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Allow new users to insert their own profile on signup
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- ====================================
-- AUTO-CREATE ORG + PROFILE ON SIGNUP
-- ====================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
  default_org_name TEXT;
BEGIN
  -- Determine org name from user metadata or email
  default_org_name := COALESCE(
    NEW.raw_user_meta_data->>'organization_name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  ) || ' - Workspace';
  
  -- Create new organization for this user
  INSERT INTO organizations (name, country)
  VALUES (default_org_name, 'IL')
  RETURNING id INTO new_org_id;
  
  -- Create profile linked to the new org
  -- First user is the owner
  INSERT INTO profiles (id, organization_id, email, full_name, role)
  VALUES (
    NEW.id,
    new_org_id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'owner'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

**Why this matters:**
- Every API call is automatically filtered by organization at the **database level**
- Users CAN'T accidentally see data from other organizations - even if there's a bug in the app
- This is the gold standard for SaaS apps

---

## 🔐 Step 3: Authentication Setup

### 3.1 Configure Email Auth in Supabase

```markdown
# הגדרת אימייל ב-Supabase

1. ב-Supabase Dashboard: Authentication → Providers → Email
2. ודאי שמוגדר:
   - Enable Email Provider: ✓
   - Confirm email: ✓ (כן - דרישת אבטחה)
   - Secure email change: ✓
   - Secure password change: ✓
3. Authentication → URL Configuration:
   - Site URL: https://my-recruter.vercel.app
   - Redirect URLs: הוסיפי גם את https://my-recruter.vercel.app/**
4. Authentication → Email Templates:
   - Confirm signup: עדכני לעברית (אופציונלי בשלב זה)
   - Reset password: עדכני לעברית (אופציונלי בשלב זה)
```

### 3.2 Create Auth Context

**File: `src/contexts/AuthContext.jsx`**

```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseEnabled } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isSupabaseEnabled) {
      setLoading(false);
      return;
    }
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileAndOrg(session.user.id);
      } else {
        setLoading(false);
      }
    });
    
    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfileAndOrg(session.user.id);
        } else {
          setProfile(null);
          setOrganization(null);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  async function fetchProfileAndOrg(userId) {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*, organizations(*)')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      setProfile(profileData);
      setOrganization(profileData.organizations);
      
      // Update last_login_at silently
      await supabase
        .from('profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function signUp(email, password, fullName, organizationName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: fullName,
          organization_name: organizationName 
        }
      }
    });
    if (error) throw error;
    return data;
  }
  
  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }
  
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
  
  async function resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    return data;
  }
  
  async function updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  }
  
  async function updateProfile(updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    setProfile(data);
    return data;
  }
  
  const value = {
    user,
    profile,
    organization,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

### 3.3 Wrap App with AuthProvider

In `src/main.jsx` or `src/App.jsx`:

```jsx
import { AuthProvider } from './contexts/AuthContext';

// Wrap the entire app:
<AuthProvider>
  <Router>...</Router>
</AuthProvider>
```

---

## 🎨 Step 4: Auth Pages (Hebrew RTL)

All auth pages share the same visual style:
- Background: cream (#F5EFE0)
- Form card: white with subtle shadow, max-width 440px, centered
- Primary color: indigo (#4338CA)
- Font: Heebo for Hebrew
- Heebo is already installed in the project

### 4.1 Login Page

**File: `src/pages/LoginPage.jsx`**

```
┌──────────────────────────────────────────┐
│                                           │
│           Persona                         │  ← Logo, large, centered
│   פלטפורמת אבחון אישיותי                  │  ← tagline
│                                           │
│   ╔══════════════════════════════════╗   │
│   ║                                   ║   │
│   ║  ברוכה השבה                      ║   │
│   ║                                   ║   │
│   ║  אימייל                          ║   │
│   ║  [_________________________]    ║   │
│   ║                                   ║   │
│   ║  סיסמה                           ║   │
│   ║  [_________________________]    ║   │
│   ║                       👁         ║   │ ← show/hide password
│   ║                                   ║   │
│   ║       [    התחברי    ]           ║   │
│   ║                                   ║   │
│   ║   שכחת סיסמה?                    ║   │
│   ║                                   ║   │
│   ║  ─────────────────────────       ║   │
│   ║   עוד אין לך חשבון?              ║   │
│   ║   [הירשמי כאן]                   ║   │
│   ║                                   ║   │
│   ╚══════════════════════════════════╝   │
│                                           │
│   © Persona 2026                         │
└──────────────────────────────────────────┘
```

Form features:
- Email validation (browser-native)
- Show/hide password toggle (eye icon)
- Loading state on submit button (disabled + spinner)
- Error display in Hebrew (e.g., "אימייל או סיסמה שגויים")
- Link to signup page
- Link to forgot password page

### 4.2 Signup Page

**File: `src/pages/SignupPage.jsx`**

```
┌──────────────────────────────────────────┐
│           Persona                         │
│                                           │
│   ╔══════════════════════════════════╗   │
│   ║                                   ║   │
│   ║  יצירת חשבון חדש                 ║   │
│   ║                                   ║   │
│   ║  שם מלא                          ║   │
│   ║  [_________________________]    ║   │
│   ║                                   ║   │
│   ║  שם הארגון                       ║   │
│   ║  [_________________________]    ║   │
│   ║                                   ║   │
│   ║  אימייל                          ║   │
│   ║  [_________________________]    ║   │
│   ║                                   ║   │
│   ║  סיסמה (מינימום 8 תווים)         ║   │
│   ║  [_________________________]    ║   │
│   ║  ████░░░░░░ חוזק: בינוני          ║   │
│   ║                                   ║   │
│   ║  אימות סיסמה                     ║   │
│   ║  [_________________________]    ║   │
│   ║                                   ║   │
│   ║  ☐ אני מאשרת את תנאי השימוש     ║   │
│   ║                                   ║   │
│   ║       [    יצירת חשבון    ]      ║   │
│   ║                                   ║   │
│   ║  ─────────────────────────       ║   │
│   ║   כבר יש לך חשבון? התחברי         ║   │
│   ╚══════════════════════════════════╝   │
└──────────────────────────────────────────┘
```

Validation rules:
- Full name: required, min 2 chars
- Organization name: required, min 2 chars
- Email: valid format
- Password: min 8 chars, at least 1 uppercase, 1 number
- Password confirmation: must match
- Terms checkbox: required
- Password strength indicator (visual bar)

After signup:
- Show success message: "נשלח אליך אימייל אימות. בדקי את תיבת הדואר ולחצי על הקישור"
- Redirect to login page after 3 seconds

### 4.3 Forgot Password Page

**File: `src/pages/ForgotPasswordPage.jsx`**

```
┌──────────────────────────────────────────┐
│   ╔══════════════════════════════════╗   │
│   ║  איפוס סיסמה                     ║   │
│   ║                                   ║   │
│   ║  הזיני את האימייל שלך ונשלח לך   ║   │
│   ║  קישור לאיפוס סיסמה.            ║   │
│   ║                                   ║   │
│   ║  אימייל                          ║   │
│   ║  [_________________________]    ║   │
│   ║                                   ║   │
│   ║       [    שלחי קישור    ]       ║   │
│   ║                                   ║   │
│   ║  ← חזרה להתחברות                 ║   │
│   ╚══════════════════════════════════╝   │
└──────────────────────────────────────────┘
```

After submit:
- Show: "נשלח אליך אימייל עם הוראות לאיפוס. בדקי את תיבת הדואר"

### 4.4 Reset Password Page (from email link)

**File: `src/pages/ResetPasswordPage.jsx`**

```
┌──────────────────────────────────────────┐
│   ╔══════════════════════════════════╗   │
│   ║  בחירת סיסמה חדשה                ║   │
│   ║                                   ║   │
│   ║  סיסמה חדשה                      ║   │
│   ║  [_________________________]    ║   │
│   ║                                   ║   │
│   ║  אימות סיסמה                     ║   │
│   ║  [_________________________]    ║   │
│   ║                                   ║   │
│   ║       [    עדכני סיסמה    ]      ║   │
│   ╚══════════════════════════════════╝   │
└──────────────────────────────────────────┘
```

After submit: redirect to dashboard with success toast.

### 4.5 Onboarding Page (after first signup)

**File: `src/pages/OnboardingPage.jsx`**

For users with localStorage data, show migration prompt:

```
┌──────────────────────────────────────────┐
│   ברוכה הבאה ל-Persona! 🎉              │
│                                           │
│   מצאנו נתונים מהעבודה הקודמת שלך:       │
│                                           │
│   📋 12 מועמדים                          │
│   📊 4 דוחות שמורים                      │
│   🎯 2 תפקידים מותאמים                   │
│                                           │
│   תרצי להעביר אותם לסביבת הענן החדשה?   │
│                                           │
│   [ ✓ העבירי הכל ]    [ דלגי, התחילי נקי ] │
│                                           │
│   ⚠️ המיגרציה אינה ניתנת לביטול.        │
│   הנתונים יהפכו למשויכים לארגון שלך.    │
└──────────────────────────────────────────┘
```

For new users without localStorage data, skip directly to dashboard.

---

## 🛡️ Step 5: Protected Routes

**File: `src/components/ProtectedRoute.jsx`**

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
```

Update Router with protected routes:

```jsx
// Public routes (no auth needed):
<Route path="/login" element={<LoginPage />} />
<Route path="/signup" element={<SignupPage />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
<Route path="/q/:token" element={<CandidateQuestionnaire />} /> {/* Candidates don't need auth */}

// Protected routes (auth required):
<Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/new-candidate" element={<ProtectedRoute><NewCandidate /></ProtectedRoute>} />
<Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
// ... etc
```

---

## 👤 Step 6: User Menu in Top Bar

Update the existing app header:

```
┌────────────────────────────────────────────────────────────┐
│  Persona                                    [מ  מירי כהן ⌄]│
└────────────────────────────────────────────────────────────┘
                                              ↓ (on click)
                              ┌──────────────────────────┐
                              │ מ  מירי כהן              │
                              │ miri@amandigital.co.il   │
                              │ ━━━━━━━━━━━━━━━━━━━     │
                              │ 🏢 Aman Digital Workspace│
                              │ ━━━━━━━━━━━━━━━━━━━     │
                              │ 👤 הפרופיל שלי           │
                              │ ⚙️ הגדרות ארגון [בקרוב]  │
                              │ ❓ עזרה                   │
                              │ 🚪 התנתקות                │
                              └──────────────────────────┘
```

**Component: `src/components/UserMenu.jsx`**

Features:
- Avatar: first letter of full_name in a colored circle (indigo)
- Click opens dropdown menu
- Click outside closes it
- Use lucide-react icons (User, Building, Settings, HelpCircle, LogOut)
- Logout calls `signOut()` and redirects to /login

---

## 🔄 Step 7: Migration Detection from localStorage

**File: `src/lib/migration.js`**

```js
import { supabase } from './supabase';

export function hasLocalStorageData() {
  const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
  const customRoles = JSON.parse(localStorage.getItem('customRoles') || '[]');
  return candidates.length > 0 || customRoles.length > 0;
}

export function getLocalStorageStats() {
  const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
  const customRoles = JSON.parse(localStorage.getItem('customRoles') || '[]');
  const reports = candidates.filter(c => c.answers).length;
  
  return {
    candidatesCount: candidates.length,
    reportsCount: reports,
    customRolesCount: customRoles.length,
    hasData: candidates.length > 0 || customRoles.length > 0
  };
}

export function isMigrationComplete() {
  return localStorage.getItem('migrationComplete') === 'true';
}

export async function flagMigrationComplete() {
  localStorage.setItem('migrationComplete', 'true');
  localStorage.setItem('migrationDate', new Date().toISOString());
}

// Phase 1: just flag it. Phase 2 will properly migrate.
export async function migrateLocalStorageToSupabase(userId) {
  await flagMigrationComplete();
  return { 
    success: true, 
    message: 'הנתונים סומנו להעברה. ההעברה המלאה תתבצע בשלב הבא של הפיתוח.' 
  };
}
```

---

## 🎯 Step 8: Backward Compatibility Layer

Critical for the gradual migration approach.

**File: `src/lib/dataLayer.js`**

```js
import { supabase, isSupabaseEnabled } from './supabase';

// Phase 1: Just localStorage - but we have the abstraction ready for Phase 2
export const dataLayer = {
  async getCandidates() {
    // Phase 2: fetch from Supabase if enabled
    return JSON.parse(localStorage.getItem('candidates') || '[]');
  },
  
  async saveCandidate(candidate) {
    const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    candidates.push(candidate);
    localStorage.setItem('candidates', JSON.stringify(candidates));
    return candidate;
  },
  
  async updateCandidate(id, updates) {
    const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    const idx = candidates.findIndex(c => c.id === id);
    if (idx !== -1) {
      candidates[idx] = { ...candidates[idx], ...updates };
      localStorage.setItem('candidates', JSON.stringify(candidates));
    }
    return candidates[idx];
  },
  
  async getCustomRoles() {
    return JSON.parse(localStorage.getItem('customRoles') || '[]');
  },
  
  async saveCustomRole(role) {
    const roles = JSON.parse(localStorage.getItem('customRoles') || '[]');
    roles.push(role);
    localStorage.setItem('customRoles', JSON.stringify(roles));
    return role;
  }
};
```

In Phase 2, we'll update this file to use Supabase. The rest of the app doesn't need to change.

---

## 🧪 Testing Checklist

After implementation, verify:

### Auth Flow
1. ✅ Open `/signup` - form displays correctly in Hebrew RTL
2. ✅ Sign up with new email - confirmation email received
3. ✅ Click confirmation link in email - redirects to login
4. ✅ Log in with confirmed account - redirects to dashboard
5. ✅ Log out - redirects to login
6. ✅ Try accessing `/` without login - redirects to login
7. ✅ "Forgot password" sends reset email
8. ✅ Reset password link works and updates password

### Multi-Tenant Isolation
9. ✅ Sign up Account A with `a@test.com` 
10. ✅ Create some test data in Account A
11. ✅ Sign up Account B with `b@test.com`
12. ✅ Verify Account B sees an empty dashboard (RLS working!)
13. ✅ Log back into Account A - all data still there

### Auto-Creation
14. ✅ Organization auto-created on signup
15. ✅ Profile auto-created on signup
16. ✅ User's role is 'owner' on signup
17. ✅ Organization name based on signup form input

### UI
18. ✅ User menu shows correct name and organization
19. ✅ Avatar shows correct initial
20. ✅ Mobile responsive on all auth pages
21. ✅ Hebrew RTL works correctly throughout
22. ✅ Loading states show during auth operations
23. ✅ Error messages in Hebrew

### Backward Compatibility
24. ✅ Existing localStorage app functionality still works
25. ✅ Migration prompt appears for users with localStorage data
26. ✅ New users (no localStorage) skip directly to dashboard

---

## 🚨 Security Checklist

Before going live:

- [ ] All tables have RLS enabled
- [ ] All RLS policies tested with 2+ accounts to verify isolation
- [ ] `service_role` key NEVER exposed to the client
- [ ] Indexes created on `organization_id` columns
- [ ] Password requirements: min 8 chars, uppercase, number
- [ ] Email confirmation required
- [ ] HTTPS only (Vercel default - ✓)
- [ ] Rate limiting on auth endpoints (Supabase default - ✓)

---

## 📝 Phase 1 Acceptance Criteria

- [ ] Supabase project created in EU region
- [ ] SQL schema deployed successfully
- [ ] Supabase client configured with env vars
- [ ] AuthContext wraps the app
- [ ] Login, Signup, Forgot Password, Reset Password pages in Hebrew RTL
- [ ] Email confirmation working
- [ ] Auto-create org + profile on signup
- [ ] Protected routes redirect to login
- [ ] User menu in top bar
- [ ] Migration detection UI (data move comes in Phase 2)
- [ ] Existing localStorage app continues to work unchanged
- [ ] Mobile responsive
- [ ] Multi-tenant isolation verified with 2 test accounts

---

## 🔜 What's Next (Phase 2 & 3 Preview)

**Phase 2: Data Layer Migration**
- Create tables: `candidates`, `custom_roles`, `responses`, `reports`
- Full RLS for each new table
- Update `dataLayer.js` to use Supabase instead of localStorage
- Real migration script that moves localStorage data to Supabase
- Realtime updates (candidate completes questionnaire → recruiter sees it instantly)

**Phase 3: Team & Billing**
- Invite users to organization (email invitation flow)
- Custom roles (admin/recruiter/viewer) with different permissions
- Organization settings page
- Usage tracking (candidates per month)
- Stripe integration for billing
- Pricing tier enforcement

---

When complete, demonstrate:
1. Sign up with new email (e.g., `test1@persona.test`)
2. Confirm email
3. Log in → see onboarding
4. Skip onboarding → see empty dashboard
5. Sign up second account (`test2@persona.test`)
6. Confirm second email and login - see empty dashboard (NOT test1's data!)
7. Log out and back in - data persists per account
8. Forgot password flow works end-to-end
9. Mobile responsive on all pages
10. Existing app features (candidate flow) still work
