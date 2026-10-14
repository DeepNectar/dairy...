import React, { useState, useEffect, useRef } from "react";

function App() {
  const [entries, setEntries] = useState<any[]>([]);
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  const [sender, setSender] = useState("Deep");
  const [message, setMessage] = useState("");
  const [whatIFelt, setWhatIFelt] = useState("");
  const [mood, setMood] = useState("");
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("cover");
  const [isFlipping, setIsFlipping] = useState(false);
  const [showIndex, setShowIndex] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const fileInputRef = useRef<any>(null);
  const messageRef = useRef<any>(null);

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

  useEffect(() => {
    const saved = localStorage.getItem("diary_entries");
    if (saved) {
      try { setEntries(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("diary_entries", JSON.stringify(entries));
  }, [entries]);

  const moods = [
    { emoji: "😊", label: "Happy" }, { emoji: "😢", label: "Sad" },
    { emoji: "😡", label: "Angry" }, { emoji: "😴", label: "Tired" },
    { emoji: "🥰", label: "Loved" }, { emoji: "😰", label: "Anxious" },
    { emoji: "🤔", label: "Thoughtful" }, { emoji: "😎", label: "Confident" },
  ];

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) +
      " at " + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getCategoryInfo = (catId: string) => categories.find((c) => c.id === catId);
  const getMoodEmoji = (moodLabel: string) => moods.find((m) => m.label === moodLabel)?.emoji || "";
  const getWordCount = (text: string) => !text || !text.trim() ? 0 : text.trim().split(/\s+/).length;

  const flipTo = (targetView: string, callback?: () => void) => {
    setIsFlipping(true);
    setTimeout(() => {
      if (callback) callback();
      setView(targetView);
      setTimeout(() => setIsFlipping(false), 100);
    }, 500);
  };

  const handleNewEntry = () => {
    setCurrentEntry(null);
    setSender("Deep"); setMessage(""); setWhatIFelt(""); setMood(""); setCategory("");
    setShowIndex(false); setShowCategories(false); setShowSummary(false);
    setShowImportExport(false); setShowTemplate(false); setCurrentCategory(null);
    flipTo("write");
  };

  const handleSaveEntry = () => {
    if (!message.trim()) return;
    const now = new Date().toISOString();
    if (currentEntry) {
      const updated = entries.map((entry: any) =>
        entry.id === currentEntry.id
          ? { ...entry, sender, message: message.trim(), whatIFelt: whatIFelt.trim(), mood, category, updatedAt: now }
          : entry
      );
      setEntries(updated);
      setCurrentEntry({ ...currentEntry, sender, message: message.trim(), whatIFelt: whatIFelt.trim(), mood, category, updatedAt: now });
    } else {
      const newEntry = {
        id: Date.now().toString(), sender, message: message.trim(), whatIFelt: whatIFelt.trim(),
        mood, category, createdAt: now, updatedAt: now,
      };
      setEntries([newEntry, ...entries]);
      setCurrentEntry(newEntry);
    }
    flipTo("read");
  };

  const handleEditEntry = (entry: any) => {
    setCurrentEntry(entry); setSender(entry.sender || "Deep"); setMessage(entry.message);
    setWhatIFelt(entry.whatIFelt || ""); setMood(entry.mood); setCategory(entry.category || "");
    setShowIndex(false); setShowCategories(false); setShowSummary(false);
    setShowImportExport(false); setShowTemplate(false);
    flipTo("write");
  };

  const handleReadEntry = (entry: any) => {
    setCurrentEntry(entry); setSender(entry.sender || "Deep"); setMessage(entry.message);
    setWhatIFelt(entry.whatIFelt || ""); setMood(entry.mood); setCategory(entry.category || "");
    setShowIndex(false); setShowCategories(false); setShowSummary(false);
    setShowImportExport(false); setShowTemplate(false);
    flipTo("read");
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Tear out this page? This cannot be undone.")) {
      const updated = entries.filter((entry: any) => entry.id !== id);
      setEntries(updated);
      if (currentEntry && currentEntry.id === id) { setCurrentEntry(null); flipTo("cover"); }
    }
  };

  const handleCancel = () => {
    if (currentEntry) flipTo("read"); else flipTo("cover");
  };

  const goToPrevEntry = () => {
    if (!currentEntry) return;
    const idx = entries.findIndex((e: any) => e.id === currentEntry.id);
    if (idx < entries.length - 1) handleReadEntry(entries[idx + 1]);
  };

  const goToNextEntry = () => {
    if (!currentEntry) return;
    const idx = entries.findIndex((e: any) => e.id === currentEntry.id);
    if (idx > 0) handleReadEntry(entries[idx - 1]);
  };

  const filteredEntries = entries.filter((entry: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return entry.message.toLowerCase().includes(query) || (entry.whatIFelt && entry.whatIFelt.toLowerCase().includes(query));
  });

  const entriesByCategory = (catId: string) =>
    entries.filter((entry: any) => entry.category === catId)
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const getPageNumber = () => {
    if (!currentEntry) return 1;
    const idx = entries.findIndex((e: any) => e.id === currentEntry.id);
    return idx >= 0 ? idx + 1 : 1;
  };

  const currentIndex = currentEntry ? entries.findIndex((e: any) => e.id === currentEntry.id) : -1;
  const hasPrev = currentIndex < entries.length - 1;
  const hasNext = currentIndex > 0;

  const getDateRange = () => {
    if (entries.length === 0) return "";
    const sorted = [...entries].sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return `${formatShortDate(sorted[0].createdAt)} — ${formatShortDate(sorted[sorted.length - 1].createdAt)}`;
  };

  const generateSummary = () => {
    if (entries.length === 0) return "No entries yet to summarize.";
    const totalWords = entries.reduce((sum, entry) => sum + getWordCount(entry.message) + getWordCount(entry.whatIFelt || ""), 0);
    const categoriesUsed = [...new Set(entries.map((e: any) => e.category).filter(Boolean))];
    const deepCount = entries.filter((e: any) => e.sender === "Deep").length;
    const chotaCount = entries.filter((e: any) => e.sender === "Chota Don").length;
    return `📖 This diary contains ${entries.length} messages spanning from ${getDateRange()}, with a total of ${totalWords} words written across ${categoriesUsed.length} different categories. Deep shared ${deepCount} messages and 🫰🫶🏻Chota Don❣️❤️😘 shared ${chotaCount} messages. Each entry captures genuine emotions, from daily greetings and sweet compliments to deep romantic confessions and intimate moments. The "What I felt" reflections reveal the depth of connection and the emotional impact of every interaction. Through flirty banter, heartfelt conversations, and passionate exchanges, this diary preserves the essence of a relationship that is both tender and intense. Every message, whether a simple good morning or a deeply personal confession, contributes to the beautiful tapestry of memories that define this special bond between Deep and 🫰🫶🏻Chota Don❣️❤️😘.`;
  };

  // ==================== EXPORT FUNCTIONS ====================

  const generateStructuredText = () => {
    const sorted = [...entries].sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    let text = `========================================\n`;
    text += `📖 COMPLETE DIARY - DEEP & 🫰🫶🏻CHOTA DON❣️❤️😘\n`;
    text += `========================================\n\n`;
    text += `### Date: ${getDateRange()}\n\n`;

    categories.forEach((cat) => {
      const catEntries = sorted.filter((e: any) => e.category === cat.id);
      if (catEntries.length === 0) return;

      text += `---\n\n`;
      text += `#### ${cat.emoji} ${cat.name}\n\n`;

      catEntries.forEach((entry: any) => {
        const senderLabel = entry.sender === "Deep" ? "Deep" : "🫰🫶🏻Chota Don❣️❤️😘";
        text += `- Message: [${formatDateTime(entry.createdAt)}] - ${senderLabel}: "${entry.message}"\n`;
        if (entry.whatIFelt) {
          text += `  What I felt: ${entry.whatIFelt}\n`;
        }
        if (entry.mood) {
          text += `  Mood: ${entry.mood} ${getMoodEmoji(entry.mood)}\n`;
        }
        text += `\n`;
      });
    });

    // Uncategorized entries
    const uncategorized = sorted.filter((e: any) => !e.category);
    if (uncategorized.length > 0) {
      text += `---\n\n`;
      text += `#### 📝 Uncategorized\n\n`;
      uncategorized.forEach((entry: any) => {
        const senderLabel = entry.sender === "Deep" ? "Deep" : "🫰🫶🏻Chota Don❣️❤️😘";
        text += `- Message: [${formatDateTime(entry.createdAt)}] - ${senderLabel}: "${entry.message}"\n`;
        if (entry.whatIFelt) text += `  What I felt: ${entry.whatIFelt}\n`;
        if (entry.mood) text += `  Mood: ${entry.mood} ${getMoodEmoji(entry.mood)}\n`;
        text += `\n`;
      });
    }

    text += `---\n\n`;
    text += `### 📌 FINAL SUMMARY - COMPLETE DIARY\n\n`;
    text += generateSummary() + `\n\n`;
    text += `========================================\n`;
    return text;
  };

  const generateMarkdown = () => {
    const sorted = [...entries].sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    let md = `# 📖 Complete Diary - Deep & 🫰🫶🏻Chota Don❣️❤️😘\n\n`;
    md += `**Date Range:** ${getDateRange()}\n\n`;
    md += `---\n\n`;

    categories.forEach((cat) => {
      const catEntries = sorted.filter((e: any) => e.category === cat.id);
      if (catEntries.length === 0) return;

      md += `## ${cat.emoji} ${cat.name}\n\n`;
      catEntries.forEach((entry: any) => {
        const senderLabel = entry.sender === "Deep" ? "Deep" : "🫰🫶🏻Chota Don❣️❤️😘";
        md += `### ${formatDateTime(entry.createdAt)} - ${senderLabel}\n\n`;
        md += `> "${entry.message}"\n\n`;
        if (entry.whatIFelt) md += `💭 **What I felt:** ${entry.whatIFelt}\n\n`;
        if (entry.mood) md += `${getMoodEmoji(entry.mood)} *${entry.mood}*\n\n`;
        md += `---\n\n`;
      });
    });

    md += `## 📌 Final Summary\n\n${generateSummary()}\n`;
    return md;
  };

  const exportAsJSON = () => {
    const data = JSON.stringify({ version: "1.0", exportedAt: new Date().toISOString(), entries }, null, 2);
    downloadFile(data, `diary-backup-${new Date().toISOString().split("T")[0]}.json`, "application/json");
  };

  const exportAsText = () => {
    const text = generateStructuredText();
    downloadFile(text, `diary-${new Date().toISOString().split("T")[0]}.txt`, "text/plain");
  };

  const exportAsMarkdown = () => {
    const md = generateMarkdown();
    downloadFile(md, `diary-${new Date().toISOString().split("T")[0]}.md`, "text/markdown");
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ==================== IMPORT FUNCTIONS ====================

  const handleFileImport = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        if (file.name.endsWith(".json")) {
          importJSON(content);
        } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
          importTextFile(content);
        } else {
          setImportStatus("❌ Unsupported file format. Use .json, .txt, or .md");
        }
      } catch (err) {
        setImportStatus("❌ Failed to import: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const importJSON = (content: string) => {
    const data = JSON.parse(content);
    if (data.entries && Array.isArray(data.entries)) {
      const merged = [...data.entries, ...entries];
      const unique = merged.filter((entry, index, self) =>
        index === self.findIndex((e) => e.id === entry.id)
      );
      setEntries(unique);
      setImportStatus(`✅ Imported ${data.entries.length} entries successfully!`);
    } else {
      setImportStatus("❌ Invalid JSON format");
    }
  };

  const importTextFile = (content: string) => {
    const parsedEntries: any[] = [];
    const lines = content.split("\n");
    let currentEntry: any = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Match message pattern: - Message: [date] - Sender: "content"
      const messageMatch = line.match(/- Message: \[(.+?)\] - (.+?): "(.+)"/);
      if (messageMatch) {
        if (currentEntry) parsedEntries.push(currentEntry);
        const [, dateStr, senderStr, messageStr] = messageMatch;
        const isDeep = senderStr.trim() === "Deep";
        currentEntry = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          sender: isDeep ? "Deep" : "Chota Don",
          message: messageStr,
          whatIFelt: "",
          mood: "",
          category: "",
          createdAt: parseFlexibleDate(dateStr),
          updatedAt: parseFlexibleDate(dateStr),
        };
        continue;
      }

      // Match "What I felt" pattern
      if (currentEntry && line.startsWith("What I felt:")) {
        currentEntry.whatIFelt = line.replace("What I felt:", "").trim();
        continue;
      }

      // Match mood pattern
      if (currentEntry && line.startsWith("Mood:")) {
        const moodMatch = line.match(/Mood: (.+?)(?:\s+[😊😢😡😴🥰😰🤔😎])?$/);
        if (moodMatch) currentEntry.mood = moodMatch[1].trim();
        continue;
      }

      // Match category heading
      const headingMatch = line.match(/^####\s+(.+?)$/);
      if (headingMatch) {
        const headingText = headingMatch[1].trim();
        const matchedCat = categories.find((c) => headingText.includes(c.name));
        if (matchedCat && currentEntry) {
          currentEntry.category = matchedCat.id;
        }
        continue;
      }
    }

    if (currentEntry) parsedEntries.push(currentEntry);

    if (parsedEntries.length > 0) {
      const merged = [...parsedEntries, ...entries];
      const unique = merged.filter((entry, index, self) =>
        index === self.findIndex((e) => e.id === entry.id)
      );
      setEntries(unique);
      setImportStatus(`✅ Imported ${parsedEntries.length} entries from text file!`);
    } else {
      setImportStatus("❌ No entries found. Check the format.");
    }
  };

  const parseFlexibleDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d.toISOString();
    } catch (e) {}
    return new Date().toISOString();
  };

  const handleTextImport = () => {
    if (!importText.trim()) {
      setImportStatus("❌ Please paste content first");
      return;
    }
    try {
      importTextFile(importText);
      setImportText("");
    } catch (err) {
      setImportStatus("❌ Failed to parse: " + (err as Error).message);
    }
  };

  // ==================== TEMPLATE ====================

  const getTemplate = () => {
    return `========================================
📖 COMPLETE DIARY - DEEP & 🫰🫶🏻CHOTA DON❣️❤️😘
========================================

### Date: 01 Jan 2024 — 31 Dec 2024

---

#### 🌅 Morning & Night Greetings

- Message: [15 Jan 2024 at 07:30 AM] - Deep: "Good morning my love! Hope you have a beautiful day ahead. Thinking of you always."
  What I felt: I felt so peaceful sending this to her. Every morning starts with her on my mind.
  Mood: Happy 😊

- Message: [15 Jan 2024 at 10:45 PM] - 🫰🫶🏻Chota Don❣️❤️😘: "Good night baby! Sweet dreams. Can't wait to talk tomorrow."
  What I felt: Her goodnight messages make my whole night. I fall asleep with a smile.
  Mood: Loved 🥰

---

#### 💖 Sweet Compliments & Love

- Message: [16 Jan 2024 at 03:15 PM] - Deep: "You are the most beautiful soul I have ever met. Your smile lights up my entire world."
  What I felt: I meant every word. She truly is the most amazing person.
  Mood: Loved 🥰

---

#### 🔥 Flirty Banter & Teasing

- Message: [17 Jan 2024 at 08:20 PM] - 🫰🫶🏻Chota Don❣️❤️😘: "Stop being so cute, it's distracting me from my work!"
  What I felt: Haha she's so adorable when she gets flustered. I love teasing her.
  Mood: Happy 😊

---

#### 💕 Romantic Confessions

- Message: [20 Jan 2024 at 11:00 PM] - Deep: "I want you to know that you are not just my love, you are my everything. My heart beats only for you."
  What I felt: Writing this made me emotional. She means more to me than words can express.
  Mood: Thoughtful 🤔

---

### 📌 FINAL SUMMARY - COMPLETE DIARY

This diary captures the beautiful journey of Deep and Chota Don. From sweet morning greetings to deep romantic confessions, every message reflects the genuine love and connection they share. The bond grows stronger with each passing day, filled with laughter, support, and unforgettable moments.

========================================

NOTES FOR FILLING THE TEMPLATE:
- Replace example messages with your own
- Keep the exact format: - Message: [Date & Time] - Sender: "message"
- Add "What I felt:" on the next line (indented with 2 spaces)
- Add "Mood:" line if desired
- Use the exact heading names from the list
- Import this file back into the diary app using the Import option
`;
  };

  const downloadTemplate = () => {
    downloadFile(getTemplate(), "diary-template.txt", "text/plain");
  };

  const closeAllOverlays = () => {
    setShowIndex(false); setShowCategories(false); setShowSummary(false);
    setShowImportExport(false); setShowTemplate(false);
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

          {/* Page Area */}
          <div className="flex-1 relative overflow-hidden" style={{ background: "#faf6ee" }}>
            <div className="absolute right-0 top-0 bottom-0 flex flex-col">
              <div className="w-[3px] h-full bg-gradient-to-l from-stone-300/80 to-transparent" />
            </div>

            <div className={`w-full h-full transition-all duration-500 ease-in-out ${
              isFlipping ? "opacity-0 [transform:perspective(1200px)_rotateY(-8deg)_scale(0.97)]" : "opacity-100 [transform:perspective(1200px)_rotateY(0deg)_scale(1)]"
            }`} style={{ transformOrigin: "left center" }}>

              {/* === COVER PAGE === */}
              {view === "cover" && (
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
                    <h1 className="font-serif text-xl md:text-3xl lg:text-4xl text-amber-950 font-bold mb-1 tracking-wide">
                      Complete Diary
                    </h1>
                    <p className="font-serif text-xs md:text-sm text-amber-900/70 mb-1">
                      Deep & 🫰🫶🏻Chota Don❣️❤️😘
                    </p>
                    <div className="flex items-center gap-2 justify-center my-2">
                      <div className="w-6 md:w-12 h-px bg-amber-800/40" />
                      <span className="text-amber-800/50 text-xs">❧</span>
                      <div className="w-6 md:w-12 h-px bg-amber-800/40" />
                    </div>
                    {entries.length > 0 && (
                      <p className="font-serif text-amber-800/50 text-[10px] md:text-xs mb-2">📅 {getDateRange()}</p>
                    )}
                    <p className="font-serif text-amber-800/50 text-[10px] md:text-xs mb-3">— {new Date().getFullYear()} —</p>

                    <button onClick={handleNewEntry}
                      className="px-4 py-2 md:px-6 md:py-2.5 bg-amber-900/80 hover:bg-amber-900 text-amber-50 rounded-sm font-serif text-[10px] md:text-sm tracking-wider transition-all hover:shadow-lg active:scale-95"
                      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                      ✦ Write a New Message ✦
                    </button>

                    {entries.length > 0 && (
                      <div className="mt-2 md:mt-3 grid grid-cols-2 gap-1 max-w-xs mx-auto">
                        <button onClick={() => { setShowIndex(!showIndex); closeAllOverlays(); setShowIndex(true); }}
                          className="px-2 py-1 text-amber-800/70 hover:text-amber-900 font-serif text-[9px] md:text-[11px] tracking-wide hover:bg-amber-100/50 rounded transition-colors">
                          📖 Contents ({entries.length})
                        </button>
                        <button onClick={() => { closeAllOverlays(); setShowCategories(true); }}
                          className="px-2 py-1 text-amber-800/70 hover:text-amber-900 font-serif text-[9px] md:text-[11px] tracking-wide hover:bg-amber-100/50 rounded transition-colors">
                          📑 By Heading
                        </button>
                        <button onClick={() => { closeAllOverlays(); setShowSummary(true); }}
                          className="px-2 py-1 text-amber-800/70 hover:text-amber-900 font-serif text-[9px] md:text-[11px] tracking-wide hover:bg-amber-100/50 rounded transition-colors">
                          📝 Summary
                        </button>
                        <button onClick={() => { closeAllOverlays(); setShowImportExport(true); }}
                          className="px-2 py-1 text-amber-800/70 hover:text-amber-900 font-serif text-[9px] md:text-[11px] tracking-wide hover:bg-amber-100/50 rounded transition-colors">
                          📤 Import/Export
                        </button>
                        <button onClick={() => { closeAllOverlays(); setShowTemplate(true); }}
                          className="px-2 py-1 text-amber-800/70 hover:text-amber-900 font-serif text-[9px] md:text-[11px] tracking-wide hover:bg-amber-100/50 rounded transition-colors col-span-2">
                          📋 Download Template
                        </button>
                      </div>
                    )}

                    {entries.length === 0 && (
                      <div className="mt-3 flex flex-col gap-1">
                        <button onClick={() => { closeAllOverlays(); setShowImportExport(true); }}
                          className="px-3 py-1 text-amber-800/60 hover:text-amber-900 font-serif text-[10px] md:text-xs hover:bg-amber-100/50 rounded transition-colors">
                          📥 Import Existing Diary
                        </button>
                        <button onClick={() => { closeAllOverlays(); setShowTemplate(true); }}
                          className="px-3 py-1 text-amber-800/60 hover:text-amber-900 font-serif text-[10px] md:text-xs hover:bg-amber-100/50 rounded transition-colors">
                          📋 Download Template
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Index overlay */}
                  {showIndex && (
                    <div className="absolute inset-0 bg-[#faf6ee]/97 backdrop-blur-sm z-20 overflow-y-auto">
                      <div className="p-5 md:p-8 max-w-lg mx-auto">
                        <div className="flex items-center justify-between mb-3 border-b border-amber-300/50 pb-2">
                          <h2 className="font-serif text-base md:text-lg text-amber-900 font-bold">📖 Table of Contents</h2>
                          <button onClick={() => setShowIndex(false)} className="text-amber-600 hover:text-amber-800 text-lg p-1">✕</button>
                        </div>
                        <input type="text" placeholder="Search messages..." value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-1.5 mb-3 bg-white/50 border border-amber-300/60 rounded-sm font-serif text-xs md:text-sm text-amber-900 placeholder-amber-400/60 focus:outline-none focus:border-amber-400" />
                        <div className="space-y-1">
                          {filteredEntries.length === 0 ? (
                            <p className="text-amber-600/50 font-serif text-xs text-center py-6 italic">No entries found...</p>
                          ) : (
                            filteredEntries.map((entry: any, idx: number) => (
                              <div key={entry.id} onClick={() => handleReadEntry(entry)}
                                className="flex items-center gap-2 p-2 rounded-sm hover:bg-amber-100/60 cursor-pointer border-b border-amber-200/30">
                                <span className="text-amber-400/70 font-serif text-[10px] w-4">{idx + 1}.</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1">
                                    {entry.mood && <span className="text-[10px]">{getMoodEmoji(entry.mood)}</span>}
                                    {entry.category && <span className="text-[9px]">{getCategoryInfo(entry.category)?.emoji}</span>}
                                    <span className="text-[9px] text-amber-700/60">{entry.sender === "Deep" ? "👨" : "👩"}</span>
                                    <span className="font-serif text-amber-900 text-[11px] truncate">{entry.message.substring(0, 50)}{entry.message.length > 50 ? "..." : ""}</span>
                                  </div>
                                  <span className="text-amber-500/70 text-[9px] font-serif">{formatDateTime(entry.createdAt)}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Categories overlay */}
                  {showCategories && (
                    <div className="absolute inset-0 bg-[#faf6ee]/97 backdrop-blur-sm z-20 overflow-y-auto">
                      <div className="p-5 md:p-8 max-w-lg mx-auto">
                        <div className="flex items-center justify-between mb-3 border-b border-amber-300/50 pb-2">
                          <h2 className="font-serif text-base md:text-lg text-amber-900 font-bold">📑 Browse by Heading</h2>
                          <button onClick={() => setShowCategories(false)} className="text-amber-600 hover:text-amber-800 text-lg p-1">✕</button>
                        </div>
                        <div className="space-y-1">
                          {categories.map((cat) => {
                            const count = entriesByCategory(cat.id).length;
                            return (
                              <div key={cat.id} onClick={() => { setCurrentCategory(cat.id); setShowCategories(false); setView("category"); }}
                                className="flex items-center gap-2 p-2 rounded-sm hover:bg-amber-100/60 cursor-pointer border-b border-amber-200/30">
                                <span className="text-sm">{cat.emoji}</span>
                                <div className="flex-1">
                                  <span className="font-serif text-amber-900 text-[11px] md:text-sm">{cat.name}</span>
                                  <span className="block text-amber-500/60 text-[9px] font-serif">{count} messages</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary overlay */}
                  {showSummary && (
                    <div className="absolute inset-0 bg-[#faf6ee]/97 backdrop-blur-sm z-20 overflow-y-auto">
                      <div className="p-5 md:p-8 max-w-lg mx-auto">
                        <div className="flex items-center justify-between mb-3 border-b border-amber-300/50 pb-2">
                          <h2 className="font-serif text-base md:text-lg text-amber-900 font-bold">📝 Final Summary</h2>
                          <button onClick={() => setShowSummary(false)} className="text-amber-600 hover:text-amber-800 text-lg p-1">✕</button>
                        </div>
                        <div className="font-serif text-amber-900/80 text-xs md:text-sm leading-relaxed">{generateSummary()}</div>
                      </div>
                    </div>
                  )}

                  {/* Import/Export overlay */}
                  {showImportExport && (
                    <div className="absolute inset-0 bg-[#faf6ee]/97 backdrop-blur-sm z-20 overflow-y-auto">
                      <div className="p-5 md:p-8 max-w-lg mx-auto">
                        <div className="flex items-center justify-between mb-3 border-b border-amber-300/50 pb-2">
                          <h2 className="font-serif text-base md:text-lg text-amber-900 font-bold">📤 Import / Export</h2>
                          <button onClick={() => setShowImportExport(false)} className="text-amber-600 hover:text-amber-800 text-lg p-1">✕</button>
                        </div>

                        {/* Export Section */}
                        <div className="mb-4">
                          <h3 className="font-serif text-sm md:text-base text-amber-900 font-bold mb-2 flex items-center gap-2">
                            <span>📤</span> Export Your Diary
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            <button onClick={exportAsJSON}
                              className="flex items-center gap-2 p-2.5 rounded-sm bg-amber-100/60 hover:bg-amber-200/60 border border-amber-300/40 transition-colors text-left">
                              <span className="text-lg">{ }</span>
                              <div>
                                <p className="font-serif text-amber-900 text-xs md:text-sm font-bold">Export as JSON</p>
                                <p className="font-serif text-amber-600/70 text-[9px] md:text-[10px]">Full backup - can be reimported</p>
                              </div>
                            </button>
                            <button onClick={exportAsText}
                              className="flex items-center gap-2 p-2.5 rounded-sm bg-amber-100/60 hover:bg-amber-200/60 border border-amber-300/40 transition-colors text-left">
                              <span className="text-lg">📄</span>
                              <div>
                                <p className="font-serif text-amber-900 text-xs md:text-sm font-bold">Export as Text</p>
                                <p className="font-serif text-amber-600/70 text-[9px] md:text-[10px]">Structured diary format</p>
                              </div>
                            </button>
                            <button onClick={exportAsMarkdown}
                              className="flex items-center gap-2 p-2.5 rounded-sm bg-amber-100/60 hover:bg-amber-200/60 border border-amber-300/40 transition-colors text-left">
                              <span className="text-lg">📝</span>
                              <div>
                                <p className="font-serif text-amber-900 text-xs md:text-sm font-bold">Export as Markdown</p>
                                <p className="font-serif text-amber-600/70 text-[9px] md:text-[10px]">For notes apps & editors</p>
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Import Section */}
                        <div className="mb-3">
                          <h3 className="font-serif text-sm md:text-base text-amber-900 font-bold mb-2 flex items-center gap-2">
                            <span>📥</span> Import Diary
                          </h3>
                          <input ref={fileInputRef} type="file" accept=".json,.txt,.md" onChange={handleFileImport} className="hidden" />
                          <button onClick={() => fileInputRef.current?.click()}
                            className="w-full p-2.5 rounded-sm bg-amber-100/60 hover:bg-amber-200/60 border border-amber-300/40 transition-colors text-left flex items-center gap-2 mb-2">
                            <span className="text-lg">📁</span>
                            <div>
                              <p className="font-serif text-amber-900 text-xs md:text-sm font-bold">Upload File</p>
                              <p className="font-serif text-amber-600/70 text-[9px] md:text-[10px]">JSON, TXT, or MD files</p>
                            </div>
                          </button>

                          {/* Paste text option */}
                          <details className="rounded-sm border border-amber-300/40 overflow-hidden">
                            <summary className="p-2 bg-amber-100/40 font-serif text-amber-900 text-xs cursor-pointer hover:bg-amber-100/60">
                              ✏️ Or paste text to import
                            </summary>
                            <div className="p-2">
                              <textarea
                                value={importText}
                                onChange={(e) => setImportText(e.target.value)}
                                placeholder="Paste your diary text here..."
                                className="w-full h-24 p-2 text-[10px] md:text-xs font-serif text-amber-900 bg-white/50 border border-amber-300/40 rounded-sm resize-none focus:outline-none focus:border-amber-400"
                              />
                              <button onClick={handleTextImport}
                                className="mt-1 px-3 py-1 bg-amber-800/80 hover:bg-amber-800 text-amber-50 rounded-sm font-serif text-[10px] md:text-xs">
                                Import Pasted Text
                              </button>
                            </div>
                          </details>
                        </div>

                        {/* Status */}
                        {importStatus && (
                          <div className="p-2 rounded-sm bg-amber-100/60 border border-amber-300/40 font-serif text-xs text-amber-900">
                            {importStatus}
                            <button onClick={() => setImportStatus("")} className="ml-2 text-amber-600 hover:text-amber-800">✕</button>
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
                          <h2 className="font-serif text-base md:text-lg text-amber-900 font-bold">📋 Diary Template</h2>
                          <button onClick={() => setShowTemplate(false)} className="text-amber-600 hover:text-amber-800 text-lg p-1">✕</button>
                        </div>

                        <div className="mb-3 p-3 rounded-sm bg-amber-50 border border-amber-200/60">
                          <p className="font-serif text-amber-900 text-xs md:text-sm mb-2">
                            📌 Use this template to:
                          </p>
                          <ul className="font-serif text-amber-800/80 text-[10px] md:text-xs space-y-1 ml-4 list-disc">
                            <li>Write your diary externally in a text editor</li>
                            <li>Fill in the exact format shown below</li>
                            <li>Import it back into the diary app</li>
                            <li>Keep as a reference for the correct format</li>
                          </ul>
                        </div>

                        <button onClick={downloadTemplate}
                          className="w-full mb-3 p-3 rounded-sm bg-amber-800/80 hover:bg-amber-800 text-amber-50 font-serif text-xs md:text-sm transition-colors flex items-center justify-center gap-2">
                          <span>⬇️</span> Download Template File
                        </button>

                        <div className="rounded-sm bg-white/60 border border-amber-300/40 p-3 overflow-x-auto">
                          <p className="font-serif text-amber-700/70 text-[9px] md:text-[10px] mb-2 italic">Preview:</p>
                          <pre className="font-mono text-[8px] md:text-[10px] text-amber-900/80 whitespace-pre-wrap leading-relaxed">
{getTemplate().substring(0, 800)}...
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === CATEGORY VIEW === */}
              {view === "category" && currentCategory && (
                <div className="w-full h-full flex flex-col relative" style={{ background: "#faf6ee" }}>
                  <div className="p-5 md:p-8 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4 border-b border-amber-300/50 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl md:text-2xl">{getCategoryInfo(currentCategory)?.emoji}</span>
                        <h2 className="font-serif text-sm md:text-lg text-amber-900 font-bold">{getCategoryInfo(currentCategory)?.name}</h2>
                      </div>
                      <button onClick={() => flipTo("cover")} className="text-amber-600 hover:text-amber-800 text-xs font-serif">← Back</button>
                    </div>
                    <div className="space-y-2">
                      {entriesByCategory(currentCategory).length === 0 ? (
                        <p className="text-amber-600/50 font-serif text-xs text-center py-6 italic">No entries in this heading yet...</p>
                      ) : (
                        entriesByCategory(currentCategory).map((entry: any) => (
                          <div key={entry.id} onClick={() => handleReadEntry(entry)}
                            className="p-3 rounded-sm hover:bg-amber-100/60 cursor-pointer border border-amber-200/40">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="text-[10px] text-amber-600/60">{entry.sender === "Deep" ? "👨" : "👩"}</span>
                              <span className="text-[10px] text-amber-600/60 font-serif">{formatDateTime(entry.createdAt)}</span>
                              {entry.mood && <span className="text-xs">{getMoodEmoji(entry.mood)}</span>}
                            </div>
                            <p className="font-serif text-amber-800/80 text-xs line-clamp-2">"{entry.message}"</p>
                            {entry.whatIFelt && (
                              <p className="font-serif text-amber-600/60 text-[10px] italic mt-1 line-clamp-1">💭 {entry.whatIFelt}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* === READ PAGE === */}
              {view === "read" && currentEntry && (
                <div className="w-full h-full flex flex-col relative" style={{
                  backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #dcc9a3 31px, #dcc9a3 32px)`,
                  backgroundSize: "100% 32px", backgroundColor: "#faf6ee", backgroundPositionY: "8px",
                }}>
                  <div className="absolute left-10 md:left-14 top-0 bottom-0 w-[1px] bg-red-400/40" />
                  <div className="absolute left-2 md:left-3 top-[20%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20" />
                  <div className="absolute left-2 md:left-3 top-[50%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20" />
                  <div className="absolute left-2 md:left-3 top-[80%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20" />

                  <div className="pt-4 md:pt-6 pr-5 md:pr-8 pb-1 shrink-0" style={{ paddingLeft: "clamp(3rem, 5vw, 4.5rem)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {currentEntry.category && <span className="text-xs md:text-sm">{getCategoryInfo(currentEntry.category)?.emoji}</span>}
                        {currentEntry.mood && <span className="text-sm md:text-base">{getMoodEmoji(currentEntry.mood)}</span>}
                        <span className="text-[10px] md:text-xs text-amber-700/70 font-serif font-bold">
                          {getCategoryInfo(currentEntry.category)?.name || "Uncategorized"}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        <button onClick={() => handleEditEntry(currentEntry)} className="p-1.5 rounded-sm hover:bg-amber-200/40 text-amber-700/70">
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDeleteEntry(currentEntry.id)} className="p-1.5 rounded-sm hover:bg-red-100/50 text-red-300 hover:text-red-500">
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-5 md:pr-8 pb-14" style={{ paddingLeft: "clamp(3rem, 5vw, 4.5rem)" }}>
                    <div className="mb-2">
                      <p className="font-serif text-[11px] md:text-xs text-amber-600/60 italic mb-1">Message:</p>
                      <p className="font-serif text-xs md:text-sm text-amber-900/90 leading-[32px]">
                        <span className="text-amber-700/70 text-[10px] md:text-[11px]">[{formatDateTime(currentEntry.createdAt)}]</span>{" "}
                        <span className="font-bold text-amber-900">{currentEntry.sender === "Deep" ? "Deep" : "🫰🫶🏻Chota Don❣️❤️😘"}:</span>{" "}
                        <span className="italic">"{currentEntry.message}"</span>
                      </p>
                    </div>
                    {currentEntry.whatIFelt ? (
                      <div className="mt-3 pl-3 md:pl-4 border-l-2 border-amber-300/50">
                        <p className="font-serif text-[11px] md:text-xs text-amber-700/70 font-bold mb-1">💭 What I felt:</p>
                        <p className="font-serif text-xs md:text-sm text-amber-800/70 italic leading-[28px]">{currentEntry.whatIFelt}</p>
                      </div>
                    ) : (
                      <div className="mt-3 pl-3 md:pl-4 border-l-2 border-amber-200/30">
                        <p className="font-serif text-[10px] md:text-[11px] text-amber-400/50 italic">(No reflection added)</p>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-0 right-0 flex justify-between items-center px-6 md:px-10">
                    <button onClick={goToPrevEntry} disabled={!hasPrev}
                      className={`text-[10px] md:text-xs font-serif italic ${hasPrev ? "text-amber-600/50 hover:text-amber-800" : "text-amber-300/30"}`}>
                      ← Previous
                    </button>
                    <span className="text-[10px] text-amber-400/40 font-serif">— {getPageNumber()} —</span>
                    <button onClick={goToNextEntry} disabled={!hasNext}
                      className={`text-[10px] md:text-xs font-serif italic ${hasNext ? "text-amber-600/50 hover:text-amber-800" : "text-amber-300/30"}`}>
                      Next →
                    </button>
                  </div>
                  <button onClick={() => flipTo("cover")} className="absolute top-3 right-4 text-[9px] md:text-[10px] text-amber-500/40 hover:text-amber-700 font-serif">
                    Cover ↗
                  </button>
                </div>
              )}

              {/* === WRITE PAGE === */}
              {view === "write" && (
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
                      <span className="text-[10px] md:text-xs text-amber-600/50 font-serif italic">{formatDateTime(new Date().toISOString())}</span>
                      <div className="flex gap-1">
                        <button onClick={handleCancel} className="px-2 py-0.5 text-[10px] md:text-xs font-serif text-amber-700/60 border border-amber-300/40 rounded-sm hover:bg-amber-100/50">Cancel</button>
                        <button onClick={handleSaveEntry} className="px-2 py-0.5 text-[10px] md:text-xs font-serif text-amber-50 bg-amber-800/80 hover:bg-amber-800 rounded-sm">Save ✓</button>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-[9px] md:text-[10px] text-amber-600/50 font-serif mb-1">From:</p>
                      <div className="flex gap-2">
                        {senders.map((s) => (
                          <button key={s.id} onClick={() => setSender(s.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] md:text-xs font-serif transition-all ${
                              sender === s.id ? "bg-amber-800/80 text-amber-50 shadow-sm" : "bg-amber-100/50 text-amber-800 hover:bg-amber-200/50 border border-amber-200/50"
                            }`}>
                            <span>{s.emoji}</span>
                            <span>{s.id === "Deep" ? "Deep" : "Chota Don"}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-[9px] md:text-[10px] text-amber-600/50 font-serif mb-0.5">Heading:</p>
                      <select value={category} onChange={(e) => setCategory(e.target.value)}
                        className="text-[10px] md:text-xs font-serif text-amber-800 bg-white/40 border border-amber-300/40 rounded-sm px-2 py-0.5 focus:outline-none focus:border-amber-400 max-w-full">
                        <option value="">Select heading...</option>
                        {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>)}
                      </select>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
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
                      <textarea ref={messageRef} placeholder="Write the message here..." value={message}
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
                    <span className="text-[10px] text-amber-400/40 font-serif">— {entries.length + 1} —</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute -bottom-[2px] left-7 md:left-10 right-0 h-[3px] rounded-b-sm" style={{ background: "linear-gradient(to bottom, #e8dcc8, #d4c4a8)" }} />
        <div className="absolute -bottom-[4px] left-7 md:left-10 right-0 h-[2px] rounded-b-sm" style={{ background: "linear-gradient(to bottom, #d4c4a8, #c4b498)" }} />
        <div className="absolute -bottom-[6px] left-7 md:left-10 right-0 h-[2px] rounded-b-sm" style={{ background: "linear-gradient(to bottom, #c4b498, #b4a488)" }} />
      </div>

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
