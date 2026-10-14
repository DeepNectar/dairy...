import React, { useState, useEffect, useRef } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

function App() {
  const [entries, setEntries] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [templateFormat, setTemplateFormat] = useState<"text" | "json">("text");
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<any>(null);

  // Form states
  const [sender, setSender] = useState("Deep");
  const [message, setMessage] = useState("");
  const [whatIFelt, setWhatIFelt] = useState("");
  const [mood, setMood] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    { id: "greetings", emoji: "🌅", name: "Morning & Night Greetings" },
    { id: "daily", emoji: "💬", name: "Daily Life & Important Updates" },
    { id: "compliments", emoji: "💖", name: "Sweet Compliments & Love" },
    { id: "kesha", emoji: "👨‍👩‍👧‍👦", name: "About Kesha (Her Sister)" },
    { id: "arya", emoji: "👨‍👩‍👧‍👦", name: "About Arya (Her Brother)" },
    { id: "dreams", emoji: "🎯", name: "Dreams & Future Plans" },
    { id: "support", emoji: "🤗", name: "Emotional Support & Care" },
    { id: "fun", emoji: "😄", name: "Fun Moments & Jokes" },
    { id: "flirty", emoji: "🔥", name: "Flirty Banter & Teasing" },
    { id: "romantic", emoji: "💕", name: "Romantic Confessions" },
    { id: "attraction", emoji: "💘", name: "Attraction & Desire" },
    { id: "intimate", emoji: "🌙", name: "Intimate & Passionate Talks" },
    { id: "chemistry", emoji: "💝", name: "Deep Chemistry & Connection" },
    { id: "no-reply", emoji: "💭", name: "My Messages To Her (No Reply Yet)" },
    { id: "her-messages", emoji: "💌", name: "Her Messages To Me" },
  ];

  const senders = [
    { id: "Deep", label: "Deep", emoji: "👨" },
    { id: "Chota Don", label: "🫰🫶🏻Chota Don❣️❤️😘", emoji: "👩" },
  ];

  const moods = [
    { emoji: "😊", label: "Happy" }, { emoji: "😢", label: "Sad" },
    { emoji: "😡", label: "Angry" }, { emoji: "😴", label: "Tired" },
    { emoji: "🥰", label: "Loved" }, { emoji: "😰", label: "Anxious" },
    { emoji: "🤔", label: "Thoughtful" }, { emoji: "😎", label: "Confident" },
  ];

  // Load from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }
    loadEntries();
  }, []);

  const loadEntries = async () => {
    if (!isSupabaseConfigured()) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("diary_entries")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (error) {
      console.error("Error loading entries:", error);
      setImportStatus("❌ Error loading from Supabase: " + error.message);
    } else {
      // Map Supabase snake_case to app camelCase
      const mappedEntries = (data || []).map((entry: any) => ({
        ...entry,
        whatIFelt: entry.what_i_felt,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
      }));
      setEntries(mappedEntries);
    }
    setIsLoading(false);
  };

  const saveEntryToSupabase = async (entry: any) => {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from("diary_entries")
      .insert([entry])
      .select()
      .single();
    
    if (error) {
      console.error("Error saving entry:", error);
      return null;
    }
    return data;
  };

  const updateEntryInSupabase = async (id: string, updates: any) => {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from("diary_entries")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating entry:", error);
      return null;
    }
    return data;
  };

  const deleteEntryFromSupabase = async (id: string) => {
    if (!isSupabaseConfigured()) return false;
    const { error } = await supabase
      .from("diary_entries")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting entry:", error);
      return false;
    }
    return true;
  };

  // Sort entries chronologically
  const sortedEntries = [...entries].sort(
    (a: any, b: any) => {
      const dateA = a.createdAt || a.created_at;
      const dateB = b.createdAt || b.created_at;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    }
  );

  // Total pages: 0 = cover, 1..N = entries, N+1 = summary (if entries exist)
  const totalPages = sortedEntries.length > 0 ? sortedEntries.length + 2 : 1;
  // Page 0 = cover, Page 1..N = entries, Page N+1 = summary

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) +
      " at " + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getCategoryInfo = (catId: string) => categories.find((c) => c.id === catId);
  const getMoodEmoji = (moodLabel: string) => moods.find((m) => m.label === moodLabel)?.emoji || "";
  const getWordCount = (text: string) => !text || !text.trim() ? 0 : text.trim().split(/\s+/).length;
  
  // Helper to get entry field (handles both camelCase and snake_case)
  const getEntryField = (entry: any, field: string) => {
    return entry[field] || entry[field.replace(/([A-Z])/g, "_$1").toLowerCase()];
  };

  const getDateRange = () => {
    if (sortedEntries.length === 0) return "";
    return `${formatShortDate(sortedEntries[0].createdAt)} — ${formatShortDate(sortedEntries[sortedEntries.length - 1].createdAt)}`;
  };

  // ============ PAGE FLIP ============
  const flipPage = (direction: "next" | "prev") => {
    if (isFlipping) return;
    if (direction === "next" && currentPage >= totalPages - 1) return;
    if (direction === "prev" && currentPage <= 0) return;

    setFlipDirection(direction);
    setIsFlipping(true);

    setTimeout(() => {
      if (direction === "next") setCurrentPage(currentPage + 1);
      else setCurrentPage(currentPage - 1);
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
      }, 100);
    }, 400);
  };

  const goToPage = (page: number) => {
    if (isFlipping || page === currentPage) return;
    setFlipDirection(page > currentPage ? "next" : "prev");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(page);
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
      }, 100);
    }, 400);
  };

  // ============ ENTRY MANAGEMENT ============
  const handleNewEntry = () => {
    setEditingEntry(null);
    setSender("Deep"); setMessage(""); setWhatIFelt(""); setMood(""); setCategory("");
    setIsWriting(true);
  };

  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry);
    setSender(entry.sender || "Deep");
    setMessage(entry.message);
    setWhatIFelt(entry.whatIFelt || "");
    setMood(entry.mood);
    setCategory(entry.category || "");
    setIsWriting(true);
  };

  const handleSaveEntry = async () => {
    if (!message.trim()) return;
    const now = new Date().toISOString();
    
    if (editingEntry) {
      // Update existing entry in Supabase
      const updates = {
        sender,
        message: message.trim(),
        what_i_felt: whatIFelt.trim(),
        mood,
        category,
        updated_at: now,
      };
      const updatedEntry = await updateEntryInSupabase(editingEntry.id, updates);
      
      if (updatedEntry) {
        // Update local state
        const updated = entries.map((e: any) =>
          e.id === editingEntry.id ? { ...e, ...updates, whatIFelt: whatIFelt.trim(), updatedAt: now } : e
        );
        setEntries(updated);
        const newSorted = [...updated].sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const newIdx = newSorted.findIndex((e: any) => e.id === editingEntry.id);
        setIsWriting(false);
        goToPage(newIdx + 1);
      }
    } else {
      // Insert new entry to Supabase
      const newEntry = {
        sender,
        message: message.trim(),
        what_i_felt: whatIFelt.trim(),
        mood,
        category,
        created_at: now,
        updated_at: now,
      };
      const savedEntry = await saveEntryToSupabase(newEntry);
      
      if (savedEntry) {
        // Add to local state with mapped fields
        const localEntry = {
          ...savedEntry,
          whatIFelt: savedEntry.what_i_felt,
          createdAt: savedEntry.created_at,
          updatedAt: savedEntry.updated_at,
        };
        const updated = [...entries, localEntry];
        setEntries(updated);
        const newSorted = [...updated].sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const newIdx = newSorted.findIndex((e: any) => e.id === savedEntry.id);
        setIsWriting(false);
        setTimeout(() => goToPage(newIdx + 1), 100);
      }
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm("Tear out this page? This cannot be undone.")) {
      const success = await deleteEntryFromSupabase(id);
      if (success) {
        const updated = entries.filter((e: any) => e.id !== id);
        setEntries(updated);
        if (currentPage > 0) {
          goToPage(Math.min(currentPage, updated.length));
        }
      }
    }
  };

  const handleCancelWrite = () => {
    setIsWriting(false);
    setEditingEntry(null);
  };

  // ============ EXPORT ============
  const generateStructuredText = () => {
    let text = `========================================\n`;
    text += `📖 COMPLETE DIARY - DEEP & 🫰🫶🏻CHOTA DON❣️❤️😘\n`;
    text += `========================================\n\n`;
    text += `### Date: ${getDateRange()}\n\n`;

    categories.forEach((cat) => {
      const catEntries = sortedEntries.filter((e: any) => getEntryField(e, "category") === cat.id);
      if (catEntries.length === 0) return;
      text += `---\n\n#### ${cat.emoji} ${cat.name}\n\n`;
      catEntries.forEach((entry: any) => {
        const senderLabel = entry.sender === "Deep" ? "Deep" : "🫰🫶🏻Chota Don❣️❤️😘";
        text += `- Message: [${formatDateTime(getEntryField(entry, "createdAt"))}] - ${senderLabel}: "${entry.message}"\n`;
        const whatIFelt = getEntryField(entry, "whatIFelt");
        if (whatIFelt) text += `  What I felt: ${whatIFelt}\n`;
        if (entry.mood) text += `  Mood: ${entry.mood} ${getMoodEmoji(entry.mood)}\n`;
        text += `\n`;
      });
    });

    const uncategorized = sortedEntries.filter((e: any) => !getEntryField(e, "category"));
    if (uncategorized.length > 0) {
      text += `---\n\n#### 📝 Uncategorized\n\n`;
      uncategorized.forEach((entry: any) => {
        const senderLabel = entry.sender === "Deep" ? "Deep" : "🫰🫶🏻Chota Don❣️❤️😘";
        text += `- Message: [${formatDateTime(getEntryField(entry, "createdAt"))}] - ${senderLabel}: "${entry.message}"\n`;
        const whatIFelt = getEntryField(entry, "whatIFelt");
        if (whatIFelt) text += `  What I felt: ${whatIFelt}\n`;
        if (entry.mood) text += `  Mood: ${entry.mood} ${getMoodEmoji(entry.mood)}\n`;
        text += `\n`;
      });
    }

    text += `---\n\n### 📌 FINAL SUMMARY - COMPLETE DIARY\n\n`;
    text += generateSummary() + `\n\n========================================\n`;
    return text;
  };

  const generateSummary = () => {
    if (sortedEntries.length === 0) return "No entries yet.";
    const totalWords = sortedEntries.reduce((sum, e) => sum + getWordCount(e.message) + getWordCount(getEntryField(e, "whatIFelt") || ""), 0);
    const categoriesUsed = [...new Set(sortedEntries.map((e: any) => getEntryField(e, "category")).filter(Boolean))];
    const deepCount = sortedEntries.filter((e: any) => e.sender === "Deep").length;
    const chotaCount = sortedEntries.filter((e: any) => e.sender === "Chota Don").length;
    return `📖 This diary contains ${sortedEntries.length} messages spanning from ${getDateRange()}, with a total of ${totalWords} words written across ${categoriesUsed.length} different categories. Deep shared ${deepCount} messages and 🫰🫶🏻Chota Don❣️❤️😘 shared ${chotaCount} messages. Each entry captures genuine emotions, from daily greetings and sweet compliments to deep romantic confessions and intimate moments. The "What I felt" reflections reveal the depth of connection and the emotional impact of every interaction. Through flirty banter, heartfelt conversations, and passionate exchanges, this diary preserves the essence of a relationship that is both tender and intense. Every message, whether a simple good morning or a deeply personal confession, contributes to the beautiful tapestry of memories that define this special bond between Deep and 🫰🫶🏻Chota Don❣️❤️😘.`;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename;
    document.body.appendChild(link); link.click();
    document.body.removeChild(link); URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    const data = JSON.stringify({ version: "1.0", exportedAt: new Date().toISOString(), entries }, null, 2);
    downloadFile(data, `diary-backup-${new Date().toISOString().split("T")[0]}.json`, "application/json");
  };

  const exportAsText = () => {
    downloadFile(generateStructuredText(), `diary-${new Date().toISOString().split("T")[0]}.txt`, "text/plain");
  };

  // ============ IMPORT ============
  const handleFileImport = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        if (file.name.endsWith(".json")) importJSON(content);
        else importTextFile(content);
      } catch (err) {
        setImportStatus("❌ Failed: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const importJSON = async (content: string) => {
    if (!isSupabaseConfigured()) {
      setImportStatus("❌ Supabase not configured. Please set up your .env file.");
      return;
    }
    
    const data = JSON.parse(content);
    if (data.entries && Array.isArray(data.entries)) {
      setImportStatus("⏳ Importing...");
      
      // Transform entries for Supabase format
      const supabaseEntries = data.entries.map((entry: any) => ({
        sender: entry.sender,
        message: entry.message,
        what_i_felt: entry.whatIFelt || entry.what_i_felt || "",
        mood: entry.mood || "",
        category: entry.category || "",
        created_at: entry.createdAt || entry.created_at || new Date().toISOString(),
        updated_at: entry.updatedAt || entry.updated_at || new Date().toISOString(),
      }));
      
      // Insert to Supabase
      const { data: insertedData, error } = await supabase
        .from("diary_entries")
        .insert(supabaseEntries)
        .select();
      
      if (error) {
        setImportStatus("❌ Import failed: " + error.message);
      } else {
        setImportStatus(`✅ Imported ${insertedData?.length || 0} entries!`);
        await loadEntries(); // Reload from Supabase
      }
    }
  };

  const importTextFile = async (content: string) => {
    if (!isSupabaseConfigured()) {
      setImportStatus("❌ Supabase not configured. Please set up your .env file.");
      return;
    }
    
    const parsedEntries: any[] = [];
    const lines = content.split("\n");
    let currentEntry: any = null;
    let currentCategory = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const messageMatch = line.match(/- Message: \[(.+?)\] - (.+?): "(.+)"/);
      if (messageMatch) {
        if (currentEntry) { currentEntry.category = currentCategory; parsedEntries.push(currentEntry); }
        const [, dateStr, senderStr, messageStr] = messageMatch;
        currentEntry = {
          sender: senderStr.trim() === "Deep" ? "Deep" : "Chota Don",
          message: messageStr, 
          what_i_felt: "", 
          mood: "", 
          category: "",
          created_at: new Date(dateStr).toISOString() || new Date().toISOString(),
          updated_at: new Date(dateStr).toISOString() || new Date().toISOString(),
        };
        continue;
      }
      if (currentEntry && line.startsWith("What I felt:")) {
        currentEntry.what_i_felt = line.replace("What I felt:", "").trim();
        continue;
      }
      if (currentEntry && line.startsWith("Mood:")) {
        const moodMatch = line.match(/Mood: (.+?)(?:\s+[😊😢😡😴🥰😰🤔😎])?$/);
        if (moodMatch) currentEntry.mood = moodMatch[1].trim();
        continue;
      }
      const headingMatch = line.match(/^####\s+(.+?)$/);
      if (headingMatch) {
        const matchedCat = categories.find((c) => headingMatch[1].includes(c.name));
        if (matchedCat) currentCategory = matchedCat.id;
      }
    }
    if (currentEntry) { currentEntry.category = currentCategory; parsedEntries.push(currentEntry); }

    if (parsedEntries.length > 0) {
      setImportStatus("⏳ Importing...");
      
      const { data: insertedData, error } = await supabase
        .from("diary_entries")
        .insert(parsedEntries)
        .select();
      
      if (error) {
        setImportStatus("❌ Import failed: " + error.message);
      } else {
        setImportStatus(`✅ Imported ${insertedData?.length || 0} entries!`);
        await loadEntries(); // Reload from Supabase
      }
    } else {
      setImportStatus("❌ No entries found. Check format.");
    }
  };

  const handleTextImport = async () => {
    if (!importText.trim()) { setImportStatus("❌ Paste content first"); return; }
    try {
      if (importText.trim().startsWith("{")) await importJSON(importText);
      else await importTextFile(importText);
      setImportText("");
    } catch (err) { setImportStatus("❌ " + (err as Error).message); }
  };

  // ============ TEMPLATES ============
  const getTextTemplate = () => `========================================
📖 COMPLETE DIARY - DEEP & 🫰🫶🏻CHOTA DON❣️❤️😘
========================================

### Date: 01 Jan 2024 — 31 Dec 2024

---

#### 🌅 Morning & Night Greetings

- Message: [15 Jan 2024 at 07:30 AM] - Deep: "Good morning my love! Hope you have a beautiful day ahead."
  What I felt: I felt so peaceful sending this to her.
  Mood: Happy 😊

- Message: [15 Jan 2024 at 10:45 PM] - 🫰🫶🏻Chota Don❣️❤️😘: "Good night baby! Sweet dreams."
  What I felt: Her goodnight messages make my whole night.
  Mood: Loved 🥰

---

#### 💕 Romantic Confessions

- Message: [20 Jan 2024 at 11:00 PM] - Deep: "You are my everything. My heart beats only for you."
  What I felt: Writing this made me emotional.
  Mood: Thoughtful 🤔

---

### 📌 FINAL SUMMARY - COMPLETE DIARY

This diary captures the beautiful journey of Deep and Chota Don...

========================================`;

  const getJSONTemplate = () => JSON.stringify({
    version: "1.0",
    exportedAt: "2024-01-20T12:00:00.000Z",
    entries: [
      {
        id: "1705312800000",
        sender: "Deep",
        message: "Good morning my love! Hope you have a beautiful day ahead.",
        whatIFelt: "I felt so peaceful sending this to her.",
        mood: "Happy",
        category: "greetings",
        createdAt: "2024-01-15T07:30:00.000Z",
        updatedAt: "2024-01-15T07:30:00.000Z"
      },
      {
        id: "1705355100000",
        sender: "Chota Don",
        message: "Good night baby! Sweet dreams.",
        whatIFelt: "Her goodnight messages make my whole night.",
        mood: "Loved",
        category: "greetings",
        createdAt: "2024-01-15T22:45:00.000Z",
        updatedAt: "2024-01-15T22:45:00.000Z"
      },
      {
        id: "1705784400000",
        sender: "Deep",
        message: "You are my everything. My heart beats only for you.",
        whatIFelt: "Writing this made me emotional.",
        mood: "Thoughtful",
        category: "romantic",
        createdAt: "2024-01-20T23:00:00.000Z",
        updatedAt: "2024-01-20T23:00:00.000Z"
      }
    ]
  }, null, 2);

  const getSQLSchema = () => `-- ============================================
-- DIARY APP - SUPABASE DATABASE SCHEMA
-- ============================================

-- 1. CREATE THE DIARY ENTRIES TABLE
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

-- 2. CREATE INDEXES FOR BETTER PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_diary_entries_created_at 
  ON diary_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diary_entries_category 
  ON diary_entries(category);
CREATE INDEX IF NOT EXISTS idx_diary_entries_sender 
  ON diary_entries(sender);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- 4. CREATE RLS POLICIES
CREATE POLICY "Allow public read access"
  ON diary_entries FOR SELECT USING (true);
CREATE POLICY "Allow public insert access"
  ON diary_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access"
  ON diary_entries FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete access"
  ON diary_entries FOR DELETE USING (true);

-- 5. AUTO-UPDATE updated_at TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_diary_entries_updated_at ON diary_entries;
CREATE TRIGGER update_diary_entries_updated_at
  BEFORE UPDATE ON diary_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();`;

  // ============ RENDER PAGES ============
  const renderPage = () => {
    // Writing mode (overlay on current page)
    if (isWriting) {
      return (
        <div className="w-full h-full flex flex-col relative" style={{
          backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #dcc9a3 31px, #dcc9a3 32px)`,
          backgroundSize: "100% 32px", backgroundColor: "#faf6ee", backgroundPositionY: "8px",
        }}>
          <div className="absolute left-10 md:left-14 top-0 bottom-0 w-[1px] bg-red-400/40" />
          <div className="absolute left-2 md:left-3 top-[20%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20" />
          <div className="absolute left-2 md:left-3 top-[50%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20" />
          <div className="absolute left-2 md:left-3 top-[80%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20" />

          <div className="pt-3 md:pt-5 pr-5 md:pr-8 pb-0 shrink-0" style={{ paddingLeft: "clamp(3rem, 5vw, 4.5rem)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] md:text-xs text-amber-600/50 font-serif italic">
                {editingEntry ? "✏️ Editing Page" : "📝 New Entry"} · {formatDateTime(new Date().toISOString())}
              </span>
              <div className="flex gap-1">
                <button onClick={handleCancelWrite} className="px-2 py-0.5 text-[10px] md:text-xs font-serif text-amber-700/60 border border-amber-300/40 rounded-sm hover:bg-amber-100/50">Cancel</button>
                <button onClick={handleSaveEntry} className="px-2 py-0.5 text-[10px] md:text-xs font-serif text-amber-50 bg-amber-800/80 hover:bg-amber-800 rounded-sm">Save ✓</button>
              </div>
            </div>

            <div className="mb-1.5">
              <p className="text-[9px] md:text-[10px] text-amber-600/50 font-serif mb-0.5">From:</p>
              <div className="flex gap-2">
                {senders.map((s) => (
                  <button key={s.id} onClick={() => setSender(s.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] md:text-xs font-serif transition-all ${
                      sender === s.id ? "bg-amber-800/80 text-amber-50" : "bg-amber-100/50 text-amber-800 hover:bg-amber-200/50 border border-amber-200/50"
                    }`}>
                    <span>{s.emoji}</span><span>{s.id === "Deep" ? "Deep" : "Chota Don"}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-1.5">
              <p className="text-[9px] md:text-[10px] text-amber-600/50 font-serif mb-0.5">Heading:</p>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="text-[10px] md:text-xs font-serif text-amber-800 bg-white/40 border border-amber-300/40 rounded-sm px-2 py-0.5 focus:outline-none focus:border-amber-400 max-w-full">
                <option value="">Select heading...</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1 mb-1.5">
              <span className="text-[9px] md:text-[10px] text-amber-600/50 font-serif mr-0.5">Mood:</span>
              {moods.map((m) => (
                <button key={m.label} onClick={() => setMood(mood === m.label ? "" : m.label)}
                  className={`text-[10px] md:text-sm p-0.5 rounded transition-all ${mood === m.label ? "bg-amber-200/60 scale-125" : "opacity-50 hover:opacity-100"}`}>
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-5 md:pr-8" style={{ paddingLeft: "clamp(3rem, 5vw, 4.5rem)" }}>
            <div className="mb-2">
              <p className="text-[9px] md:text-[10px] text-amber-600/50 font-serif italic mb-0.5">Message:</p>
              <textarea placeholder="Write the message here..." value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent border-none outline-none resize-none font-serif text-amber-950/80 text-xs md:text-sm leading-[32px] placeholder-amber-400/30"
                style={{ lineHeight: "32px", minHeight: "96px" }} />
            </div>
            <div className="mt-2 pl-2 md:pl-3 border-l-2 border-amber-300/50">
              <p className="text-[9px] md:text-[10px] text-amber-700/60 font-serif font-bold mb-0.5">💭 What I felt:</p>
              <textarea placeholder="How did this message make you feel?" value={whatIFelt}
                onChange={(e) => setWhatIFelt(e.target.value)}
                className="w-full bg-transparent border-none outline-none resize-none font-serif text-amber-800/70 italic text-[11px] md:text-xs leading-[28px] placeholder-amber-400/30"
                style={{ lineHeight: "28px", minHeight: "56px" }} />
            </div>
          </div>

          <div className="absolute bottom-3 left-0 right-0 flex justify-between items-center px-6 md:px-10">
            <span className="text-[10px] text-amber-400/40 font-serif italic">{getWordCount(message)} words</span>
          </div>
        </div>
      );
    }

    // Page 0: Cover
    if (currentPage === 0) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #f5e6c8 0%, #e8c97a 40%, #d4a843 100%)" }}>
          <div className="absolute inset-4 md:inset-8 border-2 border-amber-900/25 rounded-sm" />
          <div className="absolute inset-5 md:inset-9 border border-amber-900/15 rounded-sm" />
          <div className="absolute top-6 left-6 md:top-10 md:left-10 text-amber-900/30 text-xl md:text-2xl">✦</div>
          <div className="absolute top-6 right-6 md:top-10 md:right-10 text-amber-900/30 text-xl md:text-2xl">✦</div>
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-amber-900/30 text-xl md:text-2xl">✦</div>
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 text-amber-900/30 text-xl md:text-2xl">✦</div>

          <div className="text-center z-10 px-3 cover-content max-w-full">
            <div className="text-3xl md:text-5xl mb-2 md:mb-4 drop-shadow-sm">📔</div>
            <h1 className="font-serif text-xl md:text-3xl lg:text-4xl text-amber-950 font-bold mb-1 tracking-wide">Complete Diary</h1>
            <p className="font-serif text-xs md:text-sm text-amber-900/70 mb-1">Deep & 🫰🫶🏻Chota Don❣️❤️😘</p>
            <div className="flex items-center gap-2 justify-center my-2">
              <div className="w-6 md:w-12 h-px bg-amber-800/40" />
              <span className="text-amber-800/50 text-xs">❧</span>
              <div className="w-6 md:w-12 h-px bg-amber-800/40" />
            </div>
            
            {/* Loading indicator */}
            {isLoading && (
              <p className="font-serif text-amber-700/60 text-xs mb-2 animate-pulse">⏳ Loading entries from Supabase...</p>
            )}
            
            {/* Connection status */}
            {!isLoading && !isSupabaseConfigured() && (
              <p className="font-serif text-red-600/70 text-[10px] md:text-xs mb-2">⚠️ Supabase not configured - click Setup below</p>
            )}
            
            {sortedEntries.length > 0 && !isLoading && (
              <p className="font-serif text-amber-800/50 text-[10px] md:text-xs mb-2">📅 {getDateRange()}</p>
            )}
            <p className="font-serif text-amber-800/50 text-[10px] md:text-xs mb-3">— {new Date().getFullYear()} —</p>

            <button onClick={handleNewEntry}
              className="px-4 py-2 md:px-6 md:py-2.5 bg-amber-900/80 hover:bg-amber-900 text-amber-50 rounded-sm font-serif text-[10px] md:text-sm tracking-wider transition-all hover:shadow-lg active:scale-95"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
              ✦ Write a New Message ✦
            </button>

            {sortedEntries.length > 0 && (
              <div className="mt-2 md:mt-3 flex flex-wrap justify-center gap-1 max-w-xs mx-auto">
                <button onClick={() => setShowImportExport(!showImportExport)}
                  className="px-2 py-1 text-amber-800/70 hover:text-amber-900 font-serif text-[9px] md:text-[11px] hover:bg-amber-100/50 rounded">
                  📤 Import/Export
                </button>
                <button onClick={() => setShowTemplate(!showTemplate)}
                  className="px-2 py-1 text-amber-800/70 hover:text-amber-900 font-serif text-[9px] md:text-[11px] hover:bg-amber-100/50 rounded">
                  📋 Template
                </button>
                <button onClick={() => setShowSetup(!showSetup)}
                  className="px-2 py-1 text-amber-800/70 hover:text-amber-900 font-serif text-[9px] md:text-[11px] hover:bg-amber-100/50 rounded">
                  ⚙️ Setup
                </button>
              </div>
            )}

            {sortedEntries.length === 0 && (
              <div className="mt-3 flex flex-col gap-1">
                <button onClick={() => setShowSetup(!showSetup)}
                  className="px-3 py-1 text-amber-800/60 hover:text-amber-900 font-serif text-[10px] md:text-xs hover:bg-amber-100/50 rounded">
                  ⚙️ Supabase Setup
                </button>
                <button onClick={() => setShowImportExport(!showImportExport)}
                  className="px-3 py-1 text-amber-800/60 hover:text-amber-900 font-serif text-[10px] md:text-xs hover:bg-amber-100/50 rounded">
                  📥 Import Existing Diary
                </button>
                <button onClick={() => setShowTemplate(!showTemplate)}
                  className="px-3 py-1 text-amber-800/60 hover:text-amber-900 font-serif text-[10px] md:text-xs hover:bg-amber-100/50 rounded">
                  📋 Download Template
                </button>
              </div>
            )}

            {sortedEntries.length > 0 && (
              <p className="mt-3 font-serif text-amber-700/50 text-[9px] md:text-[10px] italic">
                → Flip to read {sortedEntries.length} {sortedEntries.length === 1 ? "page" : "pages"} →
              </p>
            )}
          </div>

          {/* Import/Export overlay */}
          {showImportExport && (
            <div className="absolute inset-0 bg-[#faf6ee]/97 backdrop-blur-sm z-20 overflow-y-auto">
              <div className="p-5 md:p-8 max-w-lg mx-auto">
                <div className="flex items-center justify-between mb-3 border-b border-amber-300/50 pb-2">
                  <h2 className="font-serif text-base md:text-lg text-amber-900 font-bold">📤 Import / Export</h2>
                  <button onClick={() => setShowImportExport(false)} className="text-amber-600 hover:text-amber-800 text-lg p-1">✕</button>
                </div>
                <div className="mb-4">
                  <h3 className="font-serif text-sm text-amber-900 font-bold mb-2">📤 Export</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <button onClick={exportAsJSON} className="flex items-center gap-2 p-2.5 rounded-sm bg-amber-100/60 hover:bg-amber-200/60 border border-amber-300/40 text-left">
                      <span className="text-lg">{ }</span>
                      <div><p className="font-serif text-amber-900 text-xs font-bold">Export as JSON</p><p className="font-serif text-amber-600/70 text-[9px]">Full backup</p></div>
                    </button>
                    <button onClick={exportAsText} className="flex items-center gap-2 p-2.5 rounded-sm bg-amber-100/60 hover:bg-amber-200/60 border border-amber-300/40 text-left">
                      <span className="text-lg">📄</span>
                      <div><p className="font-serif text-amber-900 text-xs font-bold">Export as Text</p><p className="font-serif text-amber-600/70 text-[9px]">Structured format</p></div>
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <h3 className="font-serif text-sm text-amber-900 font-bold mb-2">📥 Import</h3>
                  <input ref={fileInputRef} type="file" accept=".json,.txt,.md" onChange={handleFileImport} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-full p-2.5 rounded-sm bg-amber-100/60 hover:bg-amber-200/60 border border-amber-300/40 text-left flex items-center gap-2 mb-2">
                    <span className="text-lg">📁</span>
                    <div><p className="font-serif text-amber-900 text-xs font-bold">Upload File</p><p className="font-serif text-amber-600/70 text-[9px]">JSON, TXT, or MD</p></div>
                  </button>
                  <details className="rounded-sm border border-amber-300/40 overflow-hidden">
                    <summary className="p-2 bg-amber-100/40 font-serif text-amber-900 text-xs cursor-pointer">✏️ Or paste text/JSON</summary>
                    <div className="p-2">
                      <textarea value={importText} onChange={(e) => setImportText(e.target.value)}
                        placeholder="Paste here..."
                        className="w-full h-24 p-2 text-[10px] font-serif text-amber-900 bg-white/50 border border-amber-300/40 rounded-sm resize-none focus:outline-none" />
                      <button onClick={handleTextImport} className="mt-1 px-3 py-1 bg-amber-800/80 text-amber-50 rounded-sm font-serif text-[10px]">Import</button>
                    </div>
                  </details>
                </div>
                {importStatus && (
                  <div className="p-2 rounded-sm bg-amber-100/60 border border-amber-300/40 font-serif text-xs text-amber-900">
                    {importStatus}
                    <button onClick={() => setImportStatus("")} className="ml-2 text-amber-600">✕</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Template overlay */}
          {showTemplate && (
            <div className="absolute inset-0 bg-[#faf6ee]/97 backdrop-blur-sm z-20 overflow-y-auto">
              <div className="p-5 md:p-8 max-w-lg mx-auto">
                <div className="flex items-center justify-between mb-3 border-b border-amber-300/50 pb-2">
                  <h2 className="font-serif text-base md:text-lg text-amber-900 font-bold">📋 Diary Templates</h2>
                  <button onClick={() => setShowTemplate(false)} className="text-amber-600 hover:text-amber-800 text-lg p-1">✕</button>
                </div>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setTemplateFormat("text")}
                    className={`flex-1 p-2 rounded-sm font-serif text-xs ${templateFormat === "text" ? "bg-amber-800/80 text-amber-50" : "bg-amber-100/50 text-amber-800 border border-amber-200/50"}`}>
                    📄 Text
                  </button>
                  <button onClick={() => setTemplateFormat("json")}
                    className={`flex-1 p-2 rounded-sm font-serif text-xs ${templateFormat === "json" ? "bg-amber-800/80 text-amber-50" : "bg-amber-100/50 text-amber-800 border border-amber-200/50"}`}>
                    { } JSON
                  </button>
                </div>
                <button onClick={() => templateFormat === "text" ? downloadFile(getTextTemplate(), "diary-template.txt", "text/plain") : downloadFile(getJSONTemplate(), "diary-template.json", "application/json")}
                  className="w-full mb-3 p-3 rounded-sm bg-amber-800/80 hover:bg-amber-800 text-amber-50 font-serif text-xs flex items-center justify-center gap-2">
                  <span>⬇️</span> Download {templateFormat.toUpperCase()} Template
                </button>
                <div className="rounded-sm bg-stone-900 border border-stone-700 p-3 overflow-x-auto">
                  <p className="font-mono text-stone-400 text-[9px] mb-2">diary-template.{templateFormat}</p>
                  <pre className="font-mono text-[8px] md:text-[10px] text-green-400 whitespace-pre-wrap leading-relaxed">
{(templateFormat === "text" ? getTextTemplate() : getJSONTemplate()).substring(0, 1200)}...
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Setup overlay */}
          {showSetup && (
            <div className="absolute inset-0 bg-[#faf6ee]/97 backdrop-blur-sm z-20 overflow-y-auto">
              <div className="p-5 md:p-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-3 border-b border-amber-300/50 pb-2">
                  <h2 className="font-serif text-base md:text-lg text-amber-900 font-bold">⚙️ Supabase Setup</h2>
                  <button onClick={() => setShowSetup(false)} className="text-amber-600 hover:text-amber-800 text-lg p-1">✕</button>
                </div>

                {/* Connection Status */}
                <div className={`mb-4 p-3 rounded-sm border ${isSupabaseConfigured() ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <p className={`font-serif text-xs font-bold ${isSupabaseConfigured() ? 'text-green-800' : 'text-red-800'}`}>
                    {isSupabaseConfigured() ? '✅ Connected to Supabase' : '❌ Supabase Not Configured'}
                  </p>
                  <p className="font-serif text-[10px] text-amber-700 mt-1">
                    {isSupabaseConfigured() 
                      ? 'Your diary entries are being saved to Supabase cloud database.'
                      : 'Please configure your Supabase credentials in the .env file.'}
                  </p>
                </div>

                {/* Setup Instructions */}
                <div className="mb-4">
                  <h3 className="font-serif text-sm text-amber-900 font-bold mb-2">📖 Setup Instructions</h3>
                  <ol className="font-serif text-xs text-amber-800 space-y-2 ml-4 list-decimal">
                    <li>Go to <a href="https://supabase.com/dashboard/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Supabase Dashboard</a> and create a new project</li>
                    <li>Go to <strong>SQL Editor</strong> → <strong>New Query</strong></li>
                    <li>Copy the SQL code below and paste it into the editor</li>
                    <li>Click <strong>Run</strong> to create the database tables</li>
                    <li>Go to <strong>Settings</strong> → <strong>API</strong> and copy your <strong>Project URL</strong> and <strong>anon/public key</strong></li>
                    <li>Create a <code className="bg-amber-100 px-1 rounded">.env</code> file in your project root with:
                      <pre className="mt-1 p-2 bg-stone-100 rounded text-[10px] overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
                      </pre>
                    </li>
                    <li>Restart your dev server</li>
                  </ol>
                </div>

                {/* SQL Code */}
                <div className="mb-4">
                  <h3 className="font-serif text-sm text-amber-900 font-bold mb-2">📝 SQL Schema Code</h3>
                  <p className="font-serif text-[10px] text-amber-700 mb-2">Copy this SQL and run it in Supabase SQL Editor:</p>
                  <div className="rounded-sm bg-stone-900 border border-stone-700 p-3 overflow-x-auto max-h-96">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-mono text-stone-400 text-[9px]">supabase-schema.sql</p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(getSQLSchema());
                          setImportStatus("✅ SQL code copied to clipboard!");
                        }}
                        className="px-2 py-1 bg-amber-700 hover:bg-amber-600 text-amber-50 rounded text-[9px] font-serif"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <pre className="font-mono text-[8px] md:text-[10px] text-green-400 whitespace-pre-wrap leading-relaxed">
{getSQLSchema()}
                    </pre>
                  </div>
                </div>

                {/* Status Message */}
                {importStatus && (
                  <div className="p-2 rounded-sm bg-amber-100/60 border border-amber-300/40 font-serif text-xs text-amber-900">
                    {importStatus}
                    <button onClick={() => setImportStatus("")} className="ml-2 text-amber-600">✕</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Summary page (last page)
    if (currentPage === totalPages - 1 && sortedEntries.length > 0) {
      return (
        <div className="w-full h-full flex flex-col relative p-6 md:p-10 overflow-y-auto" style={{ background: "#faf6ee" }}>
          <div className="text-center mb-4">
            <span className="text-3xl md:text-4xl">📌</span>
            <h2 className="font-serif text-lg md:text-2xl text-amber-950 font-bold mt-2">Final Summary</h2>
            <p className="font-serif text-xs text-amber-600/60 italic mt-1">Complete Diary Overview</p>
            <div className="w-24 h-px bg-amber-800/30 mx-auto mt-2" />
          </div>

          <div className="flex-1 font-serif text-amber-900/80 text-xs md:text-sm leading-relaxed mb-4">
            {generateSummary()}
          </div>

          <div className="border-t border-amber-300/40 pt-3 mt-auto">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-amber-100/40 rounded-sm">
                <p className="font-serif text-amber-900 text-lg md:text-xl font-bold">{sortedEntries.length}</p>
                <p className="font-serif text-amber-600/60 text-[9px] md:text-[10px]">Total Messages</p>
              </div>
              <div className="p-2 bg-amber-100/40 rounded-sm">
                <p className="font-serif text-amber-900 text-lg md:text-xl font-bold">
                  {sortedEntries.reduce((sum, e) => sum + getWordCount(e.message) + getWordCount(e.whatIFelt || ""), 0)}
                </p>
                <p className="font-serif text-amber-600/60 text-[9px] md:text-[10px]">Total Words</p>
              </div>
              <div className="p-2 bg-amber-100/40 rounded-sm">
                <p className="font-serif text-amber-900 text-lg md:text-xl font-bold">
                  {sortedEntries.filter((e: any) => e.sender === "Deep").length}
                </p>
                <p className="font-serif text-amber-600/60 text-[9px] md:text-[10px]">From Deep 👨</p>
              </div>
              <div className="p-2 bg-amber-100/40 rounded-sm">
                <p className="font-serif text-amber-900 text-lg md:text-xl font-bold">
                  {sortedEntries.filter((e: any) => e.sender === "Chota Don").length}
                </p>
                <p className="font-serif text-amber-600/60 text-[9px] md:text-[10px]">From Chota Don 👩</p>
              </div>
            </div>
            <p className="text-center mt-3 font-serif text-amber-600/50 text-[10px] italic">
              — The End —
            </p>
          </div>
        </div>
      );
    }

    // Entry page
    const entryIndex = currentPage - 1;
    const entry = sortedEntries[entryIndex];
    if (!entry) return null;

    return (
      <div className="w-full h-full flex flex-col relative" style={{
        backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #dcc9a3 31px, #dcc9a3 32px)`,
        backgroundSize: "100% 32px", backgroundColor: "#faf6ee", backgroundPositionY: "8px",
      }}>
        <div className="absolute left-10 md:left-14 top-0 bottom-0 w-[1px] bg-red-400/40" />
        <div className="absolute left-2 md:left-3 top-[20%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20" />
        <div className="absolute left-2 md:left-3 top-[50%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20" />
        <div className="absolute left-2 md:left-3 top-[80%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20" />

        {/* Page Header */}
        <div className="pt-4 md:pt-6 pr-5 md:pr-8 pb-1 shrink-0" style={{ paddingLeft: "clamp(3rem, 5vw, 4.5rem)" }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {entry.category && <span className="text-xs md:text-sm">{getCategoryInfo(entry.category)?.emoji}</span>}
              {entry.mood && <span className="text-sm md:text-base">{getMoodEmoji(entry.mood)}</span>}
              <span className="text-[9px] md:text-[11px] text-amber-700/70 font-serif font-bold">
                {getCategoryInfo(entry.category)?.name || "Uncategorized"}
              </span>
            </div>
            <div className="flex gap-0.5 shrink-0">
              <button onClick={() => handleEditEntry(entry)} className="p-1.5 rounded-sm hover:bg-amber-200/40 text-amber-700/70" title="Edit">
                <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onClick={() => handleDeleteEntry(entry.id)} className="p-1.5 rounded-sm hover:bg-red-100/50 text-red-300 hover:text-red-500" title="Delete">
                <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 overflow-y-auto pr-5 md:pr-8 pb-14" style={{ paddingLeft: "clamp(3rem, 5vw, 4.5rem)" }}>
          <div className="mb-2">
            <p className="font-serif text-[11px] md:text-xs text-amber-600/60 italic mb-1">Message:</p>
            <p className="font-serif text-xs md:text-sm text-amber-900/90 leading-[32px]">
              <span className="text-amber-700/70 text-[10px] md:text-[11px]">[{formatDateTime(getEntryField(entry, "createdAt"))}]</span>{" "}
              <span className="font-bold text-amber-900">{entry.sender === "Deep" ? "Deep" : "🫰🫶🏻Chota Don❣️❤️😘"}:</span>{" "}
              <span className="italic">"{entry.message}"</span>
            </p>
          </div>
          {getEntryField(entry, "whatIFelt") ? (
            <div className="mt-3 pl-3 md:pl-4 border-l-2 border-amber-300/50">
              <p className="font-serif text-[11px] md:text-xs text-amber-700/70 font-bold mb-1">💭 What I felt:</p>
              <p className="font-serif text-xs md:text-sm text-amber-800/70 italic leading-[28px]">{getEntryField(entry, "whatIFelt")}</p>
            </div>
          ) : (
            <div className="mt-3 pl-3 md:pl-4 border-l-2 border-amber-200/30">
              <p className="font-serif text-[10px] md:text-[11px] text-amber-400/50 italic">(No reflection added)</p>
            </div>
          )}
        </div>

        {/* Page Footer */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-between items-center px-6 md:px-10">
          <span className="text-[9px] text-amber-400/40 font-serif">
            Page {currentPage} of {totalPages - 1}
          </span>
          <span className="text-[10px] text-amber-400/40 font-serif">— {currentPage} —</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 flex items-center justify-center p-2 md:p-8 overflow-hidden">
      <div className="fixed inset-0 opacity-[0.07]" style={{
        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139,90,43,0.3) 2px, rgba(139,90,43,0.3) 4px), repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(101,67,33,0.2) 40px, rgba(101,67,33,0.2) 41px)`,
      }} />

      <div className="relative w-full max-w-[860px] max-h-[95vh]" style={{ aspectRatio: "210/297" }}>
        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black/50 rounded-r-lg rounded-l-sm blur-2xl" />
        <div className="absolute inset-0 translate-x-1 translate-y-1 bg-black/30 rounded-r-lg rounded-l-sm blur-md" />

        <div className="relative w-full h-full flex rounded-r-lg rounded-l-sm overflow-hidden" style={{
          boxShadow: "2px 2px 8px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.05)",
        }}>
          {/* Spine */}
          <div className="w-7 md:w-10 shrink-0 flex flex-col items-center justify-between py-4 relative overflow-hidden"
            style={{ background: "linear-gradient(to right, #5c1a1a, #8b2020, #6b1c1c, #4a1515)" }}>
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 4px)`,
            }} />
            <div className="w-full h-0.5 bg-gradient-to-r from-yellow-700/60 via-yellow-500/80 to-yellow-700/60" />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-yellow-300/70 text-[7px] md:text-[9px] font-serif tracking-[0.3em] uppercase"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>My Diary</div>
            </div>
            <div className="w-full h-0.5 bg-gradient-to-r from-yellow-700/60 via-yellow-500/80 to-yellow-700/60" />
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-black/20 to-transparent" />
          </div>

          {/* Page Area with flip animation */}
          <div className="flex-1 relative overflow-hidden" style={{ background: "#faf6ee", perspective: "2000px" }}>
            <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-l from-stone-300/80 to-transparent z-10" />

            {/* Page with flip animation */}
            <div
              className="w-full h-full absolute inset-0"
              style={{
                transformOrigin: "left center",
                transform: isFlipping
                  ? flipDirection === "next"
                    ? "rotateY(-90deg)"
                    : "rotateY(90deg)"
                  : "rotateY(0deg)",
                transition: "transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)",
                backfaceVisibility: "hidden",
                boxShadow: isFlipping ? "-5px 0 15px rgba(0,0,0,0.2)" : "none",
              }}
            >
              {renderPage()}
            </div>

            {/* Navigation arrows */}
            {!isWriting && !showImportExport && !showTemplate && (
              <>
                {currentPage > 0 && (
                  <button
                    onClick={() => flipPage("prev")}
                    disabled={isFlipping}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-16 md:w-10 md:h-20 flex items-center justify-center bg-amber-900/20 hover:bg-amber-900/40 text-amber-100 rounded-r-lg transition-all disabled:opacity-50"
                    style={{ backdropFilter: "blur(4px)" }}
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {currentPage < totalPages - 1 && sortedEntries.length > 0 && (
                  <button
                    onClick={() => flipPage("next")}
                    disabled={isFlipping}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-16 md:w-10 md:h-20 flex items-center justify-center bg-amber-900/20 hover:bg-amber-900/40 text-amber-100 rounded-l-lg transition-all disabled:opacity-50"
                    style={{ backdropFilter: "blur(4px)" }}
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}

            {/* Page indicator dots */}
            {sortedEntries.length > 0 && sortedEntries.length <= 20 && !isWriting && !showImportExport && !showTemplate && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === currentPage ? "bg-amber-700 w-3" : "bg-amber-400/40 hover:bg-amber-500/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Book bottom edge */}
        <div className="absolute -bottom-[2px] left-7 md:left-10 right-0 h-[3px] rounded-b-sm" style={{ background: "linear-gradient(to bottom, #e8dcc8, #d4c4a8)" }} />
        <div className="absolute -bottom-[4px] left-7 md:left-10 right-0 h-[2px] rounded-b-sm" style={{ background: "linear-gradient(to bottom, #d4c4a8, #c4b498)" }} />
        <div className="absolute -bottom-[6px] left-7 md:left-10 right-0 h-[2px] rounded-b-sm" style={{ background: "linear-gradient(to bottom, #c4b498, #b4a488)" }} />
      </div>

      {/* Bookmark ribbon */}
      <div className="absolute top-0 z-20 pointer-events-none" style={{ right: "12%" }}>
        <div className="w-4 md:w-5 h-14 md:h-20" style={{
          background: "linear-gradient(to bottom, #b91c1c, #991b1b, #7f1d1d)",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
          boxShadow: "1px 2px 4px rgba(0,0,0,0.3)",
        }} />
      </div>
    </div>
  );
}

export default App;
