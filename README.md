# 📔 My Diary - Deep & Chota Don❣️❤️😘

A beautiful A4 booklet-style diary app with Supabase cloud storage.

## 🚀 Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/)
2. Click **"New Project"**
3. Fill in project details and click **"Create new project"**
4. Wait for the project to be ready (~2 minutes)

### Step 2: Run the SQL Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire SQL code from `supabase-schema.sql` file (or click the **⚙️ Setup** button in the app)
4. Paste it into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)

This will create:
- ✅ `diary_entries` table with all required columns
- ✅ Indexes for fast date/category/sender queries
- ✅ Row Level Security (RLS) policies
- ✅ Auto-update trigger for `updated_at`

### Step 3: Get Your API Keys

1. Go to **Settings** → **API** (left sidebar)
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

### Step 4: Configure Environment Variables

1. In your project root, create a file named `.env` (or rename `.env.example`)
2. Add your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-key-here
```

### Step 5: Restart the App

```bash
npm run dev
```

## 📖 SQL Schema (Quick Reference)

```sql
CREATE TABLE diary_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender TEXT NOT NULL CHECK (sender IN ('Deep', 'Chota Don')),
  message TEXT NOT NULL,
  what_i_felt TEXT,
  mood TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📋 Available Categories

| ID | Heading |
|----|---------|
| `greetings` | 🌅 Morning & Night Greetings |
| `daily` | 💬 Daily Life & Important Updates |
| `compliments` | 💖 Sweet Compliments & Love |
| `kesha` | 👨‍👩‍👧‍👦 About Kesha (Her Sister) |
| `arya` | 👨‍👩‍👧‍👦 About Arya (Her Brother) |
| `dreams` | 🎯 Dreams & Future Plans |
| `support` | 🤗 Emotional Support & Care |
| `fun` | 😄 Fun Moments & Jokes |
| `flirty` | 🔥 Flirty Banter & Teasing |
| `romantic` | 💕 Romantic Confessions |
| `attraction` | 💘 Attraction & Desire |
| `intimate` | 🌙 Intimate & Passionate Talks |
| `chemistry` | 💝 Deep Chemistry & Connection |
| `no-reply` | 💭 My Messages To Her (No Reply Yet) |
| `her-messages` | 💌 Her Messages To Me |

## 📤 Import/Export Formats

### JSON Format
```json
{
  "version": "1.0",
  "entries": [
    {
      "sender": "Deep",
      "message": "Good morning my love!",
      "whatIFelt": "I felt so peaceful.",
      "mood": "Happy",
      "category": "greetings",
      "createdAt": "2024-01-15T07:30:00.000Z"
    }
  ]
}
```

### Text Format
```
- Message: [15 Jan 2024 at 07:30 AM] - Deep: "Good morning my love!"
  What I felt: I felt so peaceful.
  Mood: Happy 😊
```

## 🔒 Security Notes

- The RLS policies are set to allow public access for simplicity
- For production use, consider adding authentication
- Your `anon` key is safe to expose in frontend code (it's designed for that)
- Never expose your `service_role` key in frontend code

## 💡 Tips

- Use the **⚙️ Setup** button in the app to view the SQL code anytime
- Export your diary regularly as a backup
- The app works offline with cached data, but saves to Supabase when online
- All entries are sorted chronologically (oldest to newest)
