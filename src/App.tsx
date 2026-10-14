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
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load entries:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("diary_entries", JSON.stringify(entries));
  }, [entries]);

  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😡", label: "Angry" },
    { emoji: "😴", label: "Tired" },
    { emoji: "🥰", label: "Loved" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "🤔", label: "Thoughtful" },
    { emoji: "😎", label: "Confident" },
  ];

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + " at " + date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  const getSenderLabel = (senderId: string) => {
    const found = senders.find((s) => s.id === senderId);
    return found ? found.label : senderId;
  };

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
    setSender("Deep");
    setMessage("");
    setWhatIFelt("");
    setMood("");
    setCategory("");
    setShowIndex(false);
    setShowCategories(false);
    setShowSummary(false);
    setCurrentCategory(null);
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
      const saved = { ...currentEntry, sender, message: message.trim(), whatIFelt: whatIFelt.trim(), mood, category, updatedAt: now };
      setCurrentEntry(saved);
    } else {
      const newEntry = {
        id: Date.now().toString(),
        sender,
        message: message.trim(),
        whatIFelt: whatIFelt.trim(),
        mood,
        category,
        createdAt: now,
        updatedAt: now,
      };
      setEntries([newEntry, ...entries]);
      setCurrentEntry(newEntry);
    }
    flipTo("read");
  };

  const handleEditEntry = (entry: any) => {
    setCurrentEntry(entry);
    setSender(entry.sender || "Deep");
    setMessage(entry.message);
    setWhatIFelt(entry.whatIFelt || "");
    setMood(entry.mood);
    setCategory(entry.category || "");
    setShowIndex(false);
    setShowCategories(false);
    setShowSummary(false);
    flipTo("write");
  };

  const handleReadEntry = (entry: any) => {
    setCurrentEntry(entry);
    setSender(entry.sender || "Deep");
    setMessage(entry.message);
    setWhatIFelt(entry.whatIFelt || "");
    setMood(entry.mood);
    setCategory(entry.category || "");
    setShowIndex(false);
    setShowCategories(false);
    setShowSummary(false);
    flipTo("read");
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Tear out this page? This cannot be undone.")) {
      const updated = entries.filter((entry: any) => entry.id !== id);
      setEntries(updated);
      if (currentEntry && currentEntry.id === id) {
        setCurrentEntry(null);
        flipTo("cover");
      }
    }
  };

  const handleCancel = () => {
    if (currentEntry) {
      flipTo("read");
    } else {
      flipTo("cover");
    }
  };

  const goToPrevEntry = () => {
    if (!currentEntry) return;
    const idx = entries.findIndex((e: any) => e.id === currentEntry.id);
    if (idx < entries.length - 1) {
      handleReadEntry(entries[idx + 1]);
    }
  };

  const goToNextEntry = () => {
    if (!currentEntry) return;
    const idx = entries.findIndex((e: any) => e.id === currentEntry.id);
    if (idx > 0) {
      handleReadEntry(entries[idx - 1]);
    }
  };

  const filteredEntries = entries.filter((entry: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      entry.message.toLowerCase().includes(query) ||
      (entry.whatIFelt && entry.whatIFelt.toLowerCase().includes(query))
    );
  });

  const entriesByCategory = (catId: string) => {
    return entries
      .filter((entry: any) => entry.category === catId)
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const getCategoryInfo = (catId: string) => {
    return categories.find((c) => c.id === catId);
  };

  const getMoodEmoji = (moodLabel: string) => {
    const found = moods.find((m) => m.label === moodLabel);
    return found ? found.emoji : "";
  };

  const getWordCount = (text: string) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

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
    const sorted = [...entries].sort((a: any, b: any) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const oldest = formatShortDate(sorted[0].createdAt);
    const newest = formatShortDate(sorted[sorted.length - 1].createdAt);
    return `${oldest} — ${newest}`;
  };

  const generateSummary = () => {
    if (entries.length === 0) return "No entries yet to summarize.";
    const totalWords = entries.reduce((sum, entry) => sum + getWordCount(entry.message) + getWordCount(entry.whatIFelt || ""), 0);
    const categoriesUsed = [...new Set(entries.map((e: any) => e.category).filter(Boolean))];
    const deepCount = entries.filter((e: any) => e.sender === "Deep").length;
    const chotaCount = entries.filter((e: any) => e.sender === "Chota Don").length;

    return `📖 This diary contains ${entries.length} messages spanning from ${getDateRange()}, with a total of ${totalWords} words written across ${categoriesUsed.length} different categories. Deep shared ${deepCount} messages and 🫰🫶🏻Chota Don❣️❤️😘 shared ${chotaCount} messages. Each entry captures genuine emotions, from daily greetings and sweet compliments to deep romantic confessions and intimate moments. The "What I felt" reflections reveal the depth of connection and the emotional impact of every interaction. Through flirty banter, heartfelt conversations, and passionate exchanges, this diary preserves the essence of a relationship that is both tender and intense. Every message, whether a simple good morning or a deeply personal confession, contributes to the beautiful tapestry of memories that define this special bond between Deep and 🫰🫶🏻Chota Don❣️❤️😘.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 flex items-center justify-center p-2 md:p-8 overflow-hidden">
      {/* Desk wood texture */}
      <div className="fixed inset-0 opacity-[0.07]" style={{
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          rgba(139,90,43,0.3) 2px,
          rgba(139,90,43,0.3) 4px
        ), repeating-linear-gradient(
          0deg,
          transparent,
          transparent 40px,
          rgba(101,67,33,0.2) 40px,
          rgba(101,67,33,0.2) 41px
        )`,
      }} />

      {/* Book Container - A4 Proportions */}
      <div className="relative w-full max-w-[860px] max-h-[95vh]" style={{ aspectRatio: "210/297" }}>
        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black/50 rounded-r-lg rounded-l-sm blur-2xl" />
        <div className="absolute inset-0 translate-x-1 translate-y-1 bg-black/30 rounded-r-lg rounded-l-sm blur-md" />

        <div className="relative w-full h-full flex rounded-r-lg rounded-l-sm overflow-hidden" style={{
          boxShadow: "2px 2px 8px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.05)",
        }}>

          {/* Book Spine */}
          <div className="w-7 md:w-10 shrink-0 flex flex-col items-center justify-between py-4 relative overflow-hidden"
            style={{ background: "linear-gradient(to right, #5c1a1a, #8b2020, #6b1c1c, #4a1515)" }}
          >
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 4px)`,
            }} />
            <div className="w-full h-0.5 bg-gradient-to-r from-yellow-700/60 via-yellow-500/80 to-yellow-700/60" />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-yellow-300/70 text-[7px] md:text-[9px] font-serif tracking-[0.3em] uppercase"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                My Diary
              </div>
            </div>
            <div className="w-full h-0.5 bg-gradient-to-r from-yellow-700/60 via-yellow-500/80 to-yellow-700/60" />
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-black/20 to-transparent" />
          </div>

          {/* Page Area */}
          <div className="flex-1 relative overflow-hidden" style={{ background: "#faf6ee" }}>
            <div className="absolute right-0 top-0 bottom-0 flex flex-col">
              <div className="w-[3px] h-full bg-gradient-to-l from-stone-300/80 to-transparent" />
              <div className="absolute right-[3px] top-0 bottom-0 w-[1px] bg-stone-200/60" />
              <div className="absolute right-[5px] top-0 bottom-0 w-[1px] bg-stone-200/40" />
            </div>

            <div className={`w-full h-full transition-all duration-500 ease-in-out ${
              isFlipping
                ? "opacity-0 [transform:perspective(1200px)_rotateY(-8deg)_scale(0.97)]"
                : "opacity-100 [transform:perspective(1200px)_rotateY(0deg)_scale(1)]"
            }`} style={{ transformOrigin: "left center" }}>

              {/* === COVER PAGE === */}
              {view === "cover" && (
                <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
                  style={{ background: "linear-gradient(160deg, #f5e6c8 0%, #e8c97a 40%, #d4a843 100%)" }}
                >
                  <div className="absolute inset-0 opacity-[0.08]" style={{
                    backgroundImage: `url("image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5C20 16.36 16.64 13 12.5 13H0v-2h12.5C17.75 11 22 15.25 22 20.5S17.75 30 12.5 30H0v-2h12.5C16.64 28 20 24.64 20 20.5z' fill='%23000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  }} />

                  <div className="absolute inset-4 md:inset-8 border-2 border-amber-900/25 rounded-sm" />
                  <div className="absolute inset-5 md:inset-9 border border-amber-900/15 rounded-sm" />

                  <div className="absolute top-6 left-6 md:top-10 md:left-10 text-amber-900/30 text-xl md:text-2xl">✦</div>
                  <div className="absolute top-6 right-6 md:top-10 md:right-10 text-amber-900/30 text-xl md:text-2xl">✦</div>
                  <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-amber-900/30 text-xl md:text-2xl">✦</div>
                  <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 text-amber-900/30 text-xl md:text-2xl">✦</div>

                  <div className="text-center z-10 px-4 cover-content">
                    <div className="text-3xl md:text-5xl mb-2 md:mb-4 drop-shadow-sm">📔</div>
                    <h1 className="font-serif text-xl md:text-3xl lg:text-4xl text-amber-950 font-bold mb-1 tracking-wide" style={{
                      textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                    }}>
                      Complete Diary
                    </h1>
                    <p className="font-serif text-xs md:text-sm text-amber-900/70 mb-1">
                      Deep & 🫰🫶🏻Chota Don❣️❤️😘
                    </p>
                    <div className="flex items-center gap-2 justify-center my-2 md:my-3">
                      <div className="w-6 md:w-12 h-px bg-amber-800/40" />
                      <span className="text-amber-800/50 text-xs">❧</span>
                      <div className="w-6 md:w-12 h-px bg-amber-800/40" />
                    </div>
                    {entries.length > 0 && (
                      <p className="font-serif text-amber-800/50 text-[10px] md:text-xs mb-2">
                        📅 {getDateRange()}
                      </p>
                    )}
                    <p className="font-serif text-amber-800/50 text-[10px] md:text-xs mb-3 md:mb-4">
                      — {new Date().getFullYear()} —
                    </p>
                    <button
                      onClick={handleNewEntry}
                      className="px-4 py-2 md:px-6 md:py-2.5 bg-amber-900/80 hover:bg-amber-900 text-amber-50 rounded-sm font-serif text-[10px] md:text-sm tracking-wider transition-all hover:shadow-lg active:scale-95"
                      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
                    >
                      ✦ Write a New Message ✦
                    </button>
                    {entries.length > 0 && (
                      <div className="mt-2 md:mt-3 flex flex-col gap-1">
                        <button
                          onClick={() => { setShowIndex(!showIndex); setShowCategories(false); setShowSummary(false); }}
                          className="block mx-auto px-3 py-1 text-amber-800/60 hover:text-amber-900 font-serif text-[10px] md:text-xs tracking-wide transition-colors"
                        >
                          📖 Table of Contents ({entries.length})
                        </button>
                        <button
                          onClick={() => { setShowCategories(!showCategories); setShowIndex(false); setShowSummary(false); }}
                          className="block mx-auto px-3 py-1 text-amber-800/60 hover:text-amber-900 font-serif text-[10px] md:text-xs tracking-wide transition-colors"
                        >
                          📑 Browse by Heading
                        </button>
                        <button
                          onClick={() => { setShowSummary(!showSummary); setShowIndex(false); setShowCategories(false); }}
                          className="block mx-auto px-3 py-1 text-amber-800/60 hover:text-amber-900 font-serif text-[10px] md:text-xs tracking-wide transition-colors"
                        >
                          📝 Final Summary
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Index overlay */}
                  {showIndex && (
                    <div className="absolute inset-0 bg-[#faf6ee]/97 backdrop-blur-sm z-20 overflow-y-auto">
                      <div className="p-5 md:p-8 max-w-lg mx-auto">
                        <div className="flex items-center justify-between mb-3 md:mb-4 border-b border-amber-300/50 pb-2">
                          <h2 className="font-serif text-base md:text-lg text-amber-900 font-bold">📖 Table of Contents</h2>
                          <button onClick={() => setShowIndex(false)} className="text-amber-600 hover:text-amber-800 text-lg p-1">✕</button>
                        </div>
                        <div className="relative mb-3">
                          <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white/50 border border-amber-300/60 rounded-sm font-serif text-xs md:text-sm text-amber-900 placeholder-amber-400/60 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div className="space-y-1">
                          {filteredEntries.length === 0 ? (
                            <p className="text-amber-600/50 font-serif text-xs md:text-sm text-center py-6 italic">
                              No entries found...
                            </p>
                          ) : (
                            filteredEntries.map((entry: any, idx: number) => (
                              <div
                                key={entry.id}
                                onClick={() => handleReadEntry(entry)}
                                className="flex items-center gap-2 p-2 rounded-sm hover:bg-amber-100/60 cursor-pointer group transition-colors border-b border-amber-200/30"
                              >
                                <span className="text-amber-400/70 font-serif text-[10px] w-4 text-right shrink-0">{idx + 1}.</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1">
                                    {entry.mood && <span className="text-[10px] md:text-xs">{getMoodEmoji(entry.mood)}</span>}
                                    {entry.category && (
                                      <span className="text-[9px] text-amber-600/50 font-serif">
                                        {getCategoryInfo(entry.category)?.emoji}
                                      </span>
                                    )}
                                    <span className="text-[9px] md:text-[10px] text-amber-700/60 font-serif">
                                      {entry.sender === "Deep" ? "👨" : "👩"}
                                    </span>
                                    <span className="font-serif text-amber-900 text-[11px] md:text-xs truncate">
                                      {entry.message.substring(0, 50)}{entry.message.length > 50 ? "..." : ""}
                                    </span>
                                  </div>
                                  <span className="text-amber-500/70 text-[9px] md:text-[10px] font-serif">{formatDateTime(entry.createdAt)}</span>
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
                        <div className="flex items-center justify-between mb-3 md:mb-4 border-b border-amber-300/50 pb-2">
                          <h2 className="font-serif text-base md:text-lg text-amber-900 font-bold">📑 Browse by Heading</h2>
                          <button onClick={() => setShowCategories(false)} className="text-amber-600 hover:text-amber-800 text-lg p-1">✕</button>
                        </div>
                        <div className="space-y-1">
                          {categories.map((cat) => {
                            const count = entriesByCategory(cat.id).length;
                            return (
                              <div
                                key={cat.id}
                                onClick={() => {
                                  setCurrentCategory(cat.id);
                                  setShowCategories(false);
                                  setView("category");
                                }}
                                className="flex items-center gap-2 md:gap-3 p-2 md:p-2.5 rounded-sm hover:bg-amber-100/60 cursor-pointer group transition-colors border-b border-amber-200/30"
                              >
                                <span className="text-sm md:text-base">{cat.emoji}</span>
                                <div className="flex-1">
                                  <span className="font-serif text-amber-900 text-[11px] md:text-sm">{cat.name}</span>
                                  <span className="block text-amber-500/60 text-[9px] md:text-[10px] font-serif">
                                    {count} {count === 1 ? "message" : "messages"}
                                  </span>
                                </div>
                                <svg className="w-3 h-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
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
                        <div className="flex items-center justify-between mb-3 md:mb-4 border-b border-amber-300/50 pb-2">
                          <h2 className="font-serif text-base md:text-lg text-amber-900 font-bold">📝 Final Summary</h2>
                          <button onClick={() => setShowSummary(false)} className="text-amber-600 hover:text-amber-800 text-lg p-1">✕</button>
                        </div>
                        <div className="font-serif text-amber-900/80 text-xs md:text-sm leading-relaxed">
                          {generateSummary()}
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
                        <h2 className="font-serif text-sm md:text-lg text-amber-900 font-bold">
                          {getCategoryInfo(currentCategory)?.name}
                        </h2>
                      </div>
                      <button onClick={() => flipTo("cover")} className="text-amber-600 hover:text-amber-800 text-xs font-serif">
                        ← Back
                      </button>
                    </div>
                    <div className="space-y-2">
                      {entriesByCategory(currentCategory).length === 0 ? (
                        <p className="text-amber-600/50 font-serif text-xs md:text-sm text-center py-6 italic">
                          No entries in this heading yet...
                        </p>
                      ) : (
                        entriesByCategory(currentCategory).map((entry: any) => (
                          <div
                            key={entry.id}
                            onClick={() => handleReadEntry(entry)}
                            className="p-3 rounded-sm hover:bg-amber-100/60 cursor-pointer transition-colors border border-amber-200/40"
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="text-[10px] text-amber-600/60 font-serif">{entry.sender === "Deep" ? "👨" : "👩"}</span>
                              <span className="text-[10px] text-amber-600/60 font-serif">{formatDateTime(entry.createdAt)}</span>
                              {entry.mood && <span className="text-xs">{getMoodEmoji(entry.mood)}</span>}
                            </div>
                            <p className="font-serif text-amber-800/80 text-xs md:text-[13px] line-clamp-2">
                              {entry.message}
                            </p>
                            {entry.whatIFelt && (
                              <p className="font-serif text-amber-600/60 text-[10px] md:text-[11px] italic mt-1 line-clamp-1">
                                💭 {entry.whatIFelt}
                              </p>
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
                  backgroundSize: "100% 32px",
                  backgroundColor: "#faf6ee",
                  backgroundPositionY: "8px",
                }}>
                  <div className="absolute left-10 md:left-14 top-0 bottom-0 w-[1px] bg-red-400/40" />

                  <div className="absolute left-2 md:left-3 top-[20%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20 shadow-inner" />
                  <div className="absolute left-2 md:left-3 top-[50%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20 shadow-inner" />
                  <div className="absolute left-2 md:left-3 top-[80%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20 shadow-inner" />

                  {/* Page Header */}
                  <div className="pt-4 md:pt-6 pr-5 md:pr-8 pb-1 shrink-0" style={{ paddingLeft: "clamp(3rem, 5vw, 4.5rem)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {currentEntry.category && (
                          <span className="text-xs md:text-sm">{getCategoryInfo(currentEntry.category)?.emoji}</span>
                        )}
                        {currentEntry.mood && (
                          <span className="text-sm md:text-base">{getMoodEmoji(currentEntry.mood)}</span>
                        )}
                        <span className="text-[10px] md:text-xs text-amber-700/70 font-serif font-bold">
                          {getCategoryInfo(currentEntry.category)?.name || "Uncategorized"}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        <button
                          onClick={() => handleEditEntry(currentEntry)}
                          className="p-1.5 rounded-sm hover:bg-amber-200/40 text-amber-700/70 hover:text-amber-900 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(currentEntry.id)}
                          className="p-1.5 rounded-sm hover:bg-red-100/50 text-red-300 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 overflow-y-auto pr-5 md:pr-8 pb-14" style={{ paddingLeft: "clamp(3rem, 5vw, 4.5rem)" }}>
                    {/* Message Line */}
                    <div className="mb-2">
                      <p className="font-serif text-[11px] md:text-xs text-amber-600/60 italic mb-1">
                        Message:
                      </p>
                      <p className="font-serif text-xs md:text-sm text-amber-900/90 leading-[32px]">
                        <span className="text-amber-700/70 text-[10px] md:text-[11px]">
                          [{formatDateTime(currentEntry.createdAt)}]
                        </span>{" "}
                        <span className="font-bold text-amber-900">
                          {currentEntry.sender === "Deep" ? "Deep" : "🫰🫶🏻Chota Don❣️❤️😘"}:
                        </span>{" "}
                        <span className="italic">"{currentEntry.message}"</span>
                      </p>
                    </div>

                    {/* What I Felt */}
                    {currentEntry.whatIFelt && (
                      <div className="mt-3 pl-3 md:pl-4 border-l-2 border-amber-300/50">
                        <p className="font-serif text-[11px] md:text-xs text-amber-700/70 font-bold mb-1">
                          💭 What I felt:
                        </p>
                        <p className="font-serif text-xs md:text-sm text-amber-800/70 italic leading-[28px]">
                          {currentEntry.whatIFelt}
                        </p>
                      </div>
                    )}

                    {!currentEntry.whatIFelt && (
                      <div className="mt-3 pl-3 md:pl-4 border-l-2 border-amber-200/30">
                        <p className="font-serif text-[10px] md:text-[11px] text-amber-400/50 italic">
                          (No reflection added)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Page Footer */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-between items-center px-6 md:px-10">
                    <button
                      onClick={goToPrevEntry}
                      disabled={!hasPrev}
                      className={`text-[10px] md:text-xs font-serif italic transition-colors ${
                        hasPrev ? "text-amber-600/50 hover:text-amber-800 cursor-pointer" : "text-amber-300/30 cursor-default"
                      }`}
                    >
                      ← Previous
                    </button>
                    <span className="text-[10px] text-amber-400/40 font-serif">
                      — {getPageNumber()} —
                    </span>
                    <button
                      onClick={goToNextEntry}
                      disabled={!hasNext}
                      className={`text-[10px] md:text-xs font-serif italic transition-colors ${
                        hasNext ? "text-amber-600/50 hover:text-amber-800 cursor-pointer" : "text-amber-300/30 cursor-default"
                      }`}
                    >
                      Next →
                    </button>
                  </div>

                  <button
                    onClick={() => flipTo("cover")}
                    className="absolute top-3 right-4 md:right-6 text-[9px] md:text-[10px] text-amber-500/40 hover:text-amber-700 font-serif transition-colors"
                  >
                    Cover ↗
                  </button>
                </div>
              )}

              {/* === WRITE PAGE === */}
              {view === "write" && (
                <div className="w-full h-full flex flex-col relative" style={{
                  backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #dcc9a3 31px, #dcc9a3 32px)`,
                  backgroundSize: "100% 32px",
                  backgroundColor: "#faf6ee",
                  backgroundPositionY: "8px",
                }}>
                  <div className="absolute left-10 md:left-14 top-0 bottom-0 w-[1px] bg-red-400/40" />

                  <div className="absolute left-2 md:left-3 top-[20%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20 shadow-inner" />
                  <div className="absolute left-2 md:left-3 top-[50%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20 shadow-inner" />
                  <div className="absolute left-2 md:left-3 top-[80%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-stone-400/30 border border-stone-400/20 shadow-inner" />

                  {/* Write Header */}
                  <div className="pt-3 md:pt-5 pr-5 md:pr-8 pb-0 shrink-0" style={{ paddingLeft: "clamp(3rem, 5vw, 4.5rem)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] md:text-xs text-amber-600/50 font-serif italic">
                        {formatDateTime(new Date().toISOString())}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={handleCancel}
                          className="px-2 py-0.5 text-[10px] md:text-xs font-serif text-amber-700/60 hover:text-amber-900 border border-amber-300/40 rounded-sm hover:bg-amber-100/50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEntry}
                          className="px-2 py-0.5 text-[10px] md:text-xs font-serif text-amber-50 bg-amber-800/80 hover:bg-amber-800 rounded-sm transition-colors"
                        >
                          Save ✓
                        </button>
                      </div>
                    </div>

                    {/* Sender Selection */}
                    <div className="mb-2">
                      <p className="text-[9px] md:text-[10px] text-amber-600/50 font-serif mb-1">From:</p>
                      <div className="flex gap-2">
                        {senders.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSender(s.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] md:text-xs font-serif transition-all ${
                              sender === s.id
                                ? "bg-amber-800/80 text-amber-50 shadow-sm"
                                : "bg-amber-100/50 text-amber-800 hover:bg-amber-200/50 border border-amber-200/50"
                            }`}
                          >
                            <span>{s.emoji}</span>
                            <span>{s.id === "Deep" ? "Deep" : "Chota Don"}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category */}
                    <div className="mb-2">
                      <p className="text-[9px] md:text-[10px] text-amber-600/50 font-serif mb-0.5">Heading:</p>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="text-[10px] md:text-xs font-serif text-amber-800 bg-white/40 border border-amber-300/40 rounded-sm px-2 py-0.5 focus:outline-none focus:border-amber-400 max-w-full"
                      >
                        <option value="">Select heading...</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.emoji} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mood */}
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-[9px] md:text-[10px] text-amber-600/50 font-serif mr-0.5">Mood:</span>
                      {moods.map((m) => (
                        <button
                          key={m.label}
                          onClick={() => setMood(mood === m.label ? "" : m.label)}
                          className={`text-[10px] md:text-sm p-0.5 rounded transition-all ${
                            mood === m.label ? "bg-amber-200/60 scale-125" : "opacity-50 hover:opacity-100"
                          }`}
                          title={m.label}
                        >
                          {m.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Writing Area */}
                  <div className="flex-1 overflow-y-auto pr-5 md:pr-8" style={{ paddingLeft: "clamp(3rem, 5vw, 4.5rem)" }}>
                    <div className="mb-2">
                      <p className="text-[9px] md:text-[10px] text-amber-600/50 font-serif italic mb-0.5">Message:</p>
                      <textarea
                        ref={messageRef}
                        placeholder="Write the message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-transparent border-none outline-none resize-none font-serif text-amber-950/80 text-xs md:text-sm leading-[32px] placeholder-amber-400/30"
                        style={{ lineHeight: "32px", minHeight: "96px" }}
                      />
                    </div>

                    {/* What I Felt */}
                    <div className="mt-2 pl-2 md:pl-3 border-l-2 border-amber-300/50">
                      <p className="text-[9px] md:text-[10px] text-amber-700/60 font-serif font-bold mb-0.5">💭 What I felt:</p>
                      <textarea
                        placeholder="How did this message make you feel?"
                        value={whatIFelt}
                        onChange={(e) => setWhatIFelt(e.target.value)}
                        className="w-full bg-transparent border-none outline-none resize-none font-serif text-amber-800/70 italic text-[11px] md:text-xs leading-[28px] placeholder-amber-400/30"
                        style={{ lineHeight: "28px", minHeight: "56px" }}
                      />
                    </div>
                  </div>

                  {/* Page Footer */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-between items-center px-6 md:px-10">
                    <span className="text-[10px] text-amber-400/40 font-serif italic">
                      {getWordCount(message)} words
                    </span>
                    <span className="text-[10px] text-amber-400/40 font-serif">
                      — {entries.length + 1} —
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Book bottom edge */}
        <div className="absolute -bottom-[2px] left-7 md:left-10 right-0 h-[3px] rounded-b-sm"
          style={{ background: "linear-gradient(to bottom, #e8dcc8, #d4c4a8)" }}
        />
        <div className="absolute -bottom-[4px] left-7 md:left-10 right-0 h-[2px] rounded-b-sm"
          style={{ background: "linear-gradient(to bottom, #d4c4a8, #c4b498)" }}
        />
        <div className="absolute -bottom-[6px] left-7 md:left-10 right-0 h-[2px] rounded-b-sm"
          style={{ background: "linear-gradient(to bottom, #c4b498, #b4a488)" }}
        />
      </div>

      {/* Bookmark ribbon */}
      <div className="absolute top-0 z-20 pointer-events-none" style={{ right: "12%" }}>
        <div className="w-4 md:w-5 h-14 md:h-20"
          style={{
            background: "linear-gradient(to bottom, #b91c1c, #991b1b, #7f1d1d)",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
            boxShadow: "1px 2px 4px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </div>
  );
}

export default App;
