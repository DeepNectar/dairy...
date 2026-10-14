-- ============================================
-- DIARY APP - SUPABASE DATABASE SCHEMA
-- ============================================
-- Copy and paste this entire SQL into Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/ → Your Project → SQL Editor → New Query

-- ============================================
-- 1. CREATE THE DIARY ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender TEXT NOT NULL CHECK (sender IN ('Deep', 'Chota Don')),
  message TEXT NOT NULL,
  what_i_felt TEXT,
  mood TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- 2. CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================
-- Index for sorting by date (most common operation)
CREATE INDEX IF NOT EXISTS idx_diary_entries_created_at 
  ON diary_entries(created_at DESC);

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_diary_entries_category 
  ON diary_entries(category);

-- Index for filtering by sender
CREATE INDEX IF NOT EXISTS idx_diary_entries_sender 
  ON diary_entries(sender);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
-- This ensures data security even if someone tries to access directly
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES
-- ============================================

-- Policy: Allow anyone to read diary entries (public diary)
CREATE POLICY "Allow public read access"
  ON diary_entries
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to insert diary entries
CREATE POLICY "Allow public insert access"
  ON diary_entries
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow anyone to update diary entries
CREATE POLICY "Allow public update access"
  ON diary_entries
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Allow anyone to delete diary entries
CREATE POLICY "Allow public delete access"
  ON diary_entries
  FOR DELETE
  USING (true);

-- ============================================
-- 5. CREATE FUNCTION TO AUTO-UPDATE updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. CREATE TRIGGER FOR updated_at
-- ============================================
DROP TRIGGER IF EXISTS update_diary_entries_updated_at ON diary_entries;
CREATE TRIGGER update_diary_entries_updated_at
  BEFORE UPDATE ON diary_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. ADD HELPFUL COMMENTS
-- ============================================
COMMENT ON TABLE diary_entries IS 'Stores diary entries for Deep & Chota Don diary app';
COMMENT ON COLUMN diary_entries.id IS 'Unique identifier for each entry';
COMMENT ON COLUMN diary_entries.sender IS 'Who sent the message: Deep or Chota Don';
COMMENT ON COLUMN diary_entries.message IS 'The actual message content';
COMMENT ON COLUMN diary_entries.what_i_felt IS 'Reflection on how the message made the writer feel';
COMMENT ON COLUMN diary_entries.mood IS 'Mood emoji label (Happy, Sad, Angry, Tired, Loved, Anxious, Thoughtful, Confident)';
COMMENT ON COLUMN diary_entries.category IS 'Category ID (greetings, daily, compliments, kesha, arya, dreams, support, fun, flirty, romantic, attraction, intimate, chemistry, no-reply, her-messages)';
COMMENT ON COLUMN diary_entries.created_at IS 'When the entry was created';
COMMENT ON COLUMN diary_entries.updated_at IS 'When the entry was last updated (auto-updated by trigger)';

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database is now ready to use with the diary app.
-- 
-- Next steps:
-- 1. Go to Supabase Dashboard → Settings → API
-- 2. Copy your Project URL and anon/public key
-- 3. Create a .env file in your project root with:
--    VITE_SUPABASE_URL=your-project-url
--    VITE_SUPABASE_ANON_KEY=your-anon-key
-- 4. Restart your dev server
-- 
-- Your diary entries will now be stored in Supabase!
-- ============================================
