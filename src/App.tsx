import React, { useState, useEffect, useRef } from "react";

// Diary App - Written in JavaScript style

function App() {
  const [entries, setEntries] = useState<any[]>([]);
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [view, setView] = useState("list");
  const textareaRef = useRef<any>(null);

  // Load entries from localStorage on mount
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

  // Save entries to localStorage whenever they change
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: any = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const handleNewEntry = () => {
    setCurrentEntry(null);
    setTitle("");
    setContent("");
    setMood("");
    setIsEditing(false);
    setView("write");
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const handleSaveEntry = () => {
    if (!title.trim() && !content.trim()) return;

    const now = new Date().toISOString();

    if (currentEntry) {
      const updated = entries.map((entry: any) =>
        entry.id === currentEntry.id
          ? {
              ...entry,
              title: title.trim() || "Untitled",
              content: content.trim(),
              mood: mood,
              updatedAt: now,
            }
          : entry
      );
      setEntries(updated);
    } else {
      const newEntry = {
        id: Date.now().toString(),
        title: title.trim() || "Untitled",
        content: content.trim(),
        mood: mood,
        createdAt: now,
        updatedAt: now,
      };
      setEntries([newEntry, ...entries]);
      setCurrentEntry(newEntry);
    }

    setIsEditing(false);
    setView("read");
  };

  const handleEditEntry = (entry: any) => {
    setCurrentEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setIsEditing(true);
    setView("write");
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const handleReadEntry = (entry: any) => {
    setCurrentEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setView("read");
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const updated = entries.filter((entry: any) => entry.id !== id);
      setEntries(updated);
      if (currentEntry && currentEntry.id === id) {
        setCurrentEntry(null);
        setView("list");
      }
    }
  };

  const handleCancel = () => {
    if (currentEntry) {
      setView("read");
    } else {
      setView("list");
    }
  };

  const filteredEntries = entries.filter((entry: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(query) ||
      entry.content.toLowerCase().includes(query)
    );
  });

  const getMoodEmoji = (moodLabel: string) => {
    const found = moods.find((m) => m.label === moodLabel);
    return found ? found.emoji : "";
  };

  const getWordCount = (text: string) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const getCharCount = (text: string) => {
    if (!text) return 0;
    return text.length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden p-2 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📔</span>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                My Diary
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-amber-600 hidden sm:block">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
            <button
              onClick={handleNewEntry}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New Entry</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside
          className={`${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } fixed md:relative md:translate-x-0 z-40 w-80 h-[calc(100vh-64px)] bg-white/70 backdrop-blur-sm border-r border-amber-200 transition-transform duration-300 ease-in-out flex flex-col`}
        >
          {/* Search */}
          <div className="p-4 border-b border-amber-100">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-amber-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Entries List */}
          <div className="flex-1 overflow-y-auto">
            {filteredEntries.length === 0 ? (
              <div className="p-6 text-center">
                <span className="text-4xl block mb-3">📝</span>
                <p className="text-amber-600 text-sm">
                  {searchQuery ? "No entries found" : "No entries yet. Start writing!"}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filteredEntries.map((entry: any) => (
                  <div
                    key={entry.id}
                    onClick={() => handleReadEntry(entry)}
                    className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 group ${
                      currentEntry && currentEntry.id === entry.id
                        ? "bg-amber-100 border border-amber-300 shadow-sm"
                        : "hover:bg-amber-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {entry.mood && (
                            <span className="text-sm">{getMoodEmoji(entry.mood)}</span>
                          )}
                          <h3 className="font-medium text-amber-900 truncate text-sm">
                            {entry.title}
                          </h3>
                        </div>
                        <p className="text-xs text-amber-600 truncate mb-1">
                          {entry.content.substring(0, 80)}
                          {entry.content.length > 80 ? "..." : ""}
                        </p>
                        <p className="text-xs text-amber-400">
                          {formatShortDate(entry.updatedAt || entry.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEntry(entry.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition-all"
                      >
                        <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {view === "list" && !currentEntry && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-10 shadow-lg border border-amber-100 max-w-md">
                <span className="text-6xl block mb-4">✍️</span>
                <h2 className="text-2xl font-bold text-amber-800 mb-3">
                  Welcome to Your Diary
                </h2>
                <p className="text-amber-600 mb-6">
                  Your personal space to write, reflect, and remember. Every thought matters.
                </p>
                <button
                  onClick={handleNewEntry}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Start Writing Today
                </button>
              </div>
            </div>
          )}

          {view === "read" && currentEntry && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
                {/* Entry Header */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 border-b border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {currentEntry.mood && (
                        <span className="text-2xl">{getMoodEmoji(currentEntry.mood)}</span>
                      )}
                      <span className="text-sm text-amber-600 font-medium">
                        {currentEntry.mood || "No mood set"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEntry(currentEntry)}
                        className="p-2 rounded-lg bg-white/60 hover:bg-white text-amber-700 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(currentEntry.id)}
                        className="p-2 rounded-lg bg-white/60 hover:bg-red-50 text-amber-700 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-amber-900">
                    {currentEntry.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-3 text-sm text-amber-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(currentEntry.createdAt)}
                    </span>
                    {currentEntry.updatedAt !== currentEntry.createdAt && (
                      <span className="text-xs text-amber-400">(edited)</span>
                    )}
                  </div>
                </div>

                {/* Entry Content */}
                <div className="p-6 md:p-8">
                  <div className="prose prose-amber max-w-none">
                    {currentEntry.content.split("\n").map((paragraph: string, index: number) => (
                      <p key={index} className="text-amber-900 leading-relaxed mb-4 text-base">
                        {paragraph || "\u00A0"}
                      </p>
                    ))}
                  </div>
                  <div className="mt-8 pt-4 border-t border-amber-100 flex items-center gap-4 text-xs text-amber-400">
                    <span>{getWordCount(currentEntry.content)} words</span>
                    <span>{getCharCount(currentEntry.content)} characters</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "write" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
                {/* Write Header */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 border-b border-amber-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-amber-800">
                      {isEditing ? "Edit Entry" : "New Entry"}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-white/60 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEntry}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all text-sm font-medium"
                      >
                        {isEditing ? "Update" : "Save"}
                      </button>
                    </div>
                  </div>

                  {/* Title Input */}
                  <input
                    type="text"
                    placeholder="Give your entry a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-2xl md:text-3xl font-bold bg-transparent border-none outline-none text-amber-900 placeholder-amber-300 mb-4"
                  />

                  {/* Mood Selection */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-amber-600 mr-1">How are you feeling?</span>
                    {moods.map((m) => (
                      <button
                        key={m.label}
                        onClick={() => setMood(mood === m.label ? "" : m.label)}
                        className={`p-1.5 rounded-lg transition-all duration-200 ${
                          mood === m.label
                            ? "bg-amber-200 scale-110 shadow-sm"
                            : "hover:bg-amber-100"
                        }`}
                        title={m.label}
                      >
                        <span className="text-lg">{m.emoji}</span>
                      </button>
                    ))}
                    {mood && (
                      <span className="text-xs text-amber-500 ml-2 bg-amber-100 px-2 py-1 rounded-full">
                        {mood}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 md:p-8">
                  <textarea
                    ref={textareaRef}
                    placeholder="Write your thoughts here... Let your mind flow freely."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-[400px] bg-transparent border-none outline-none text-amber-900 placeholder-amber-300 resize-none text-base leading-relaxed"
                  />
                  <div className="mt-4 pt-4 border-t border-amber-100 flex items-center justify-between text-xs text-amber-400">
                    <div className="flex items-center gap-4">
                      <span>{getWordCount(content)} words</span>
                      <span>{getCharCount(content)} characters</span>
                    </div>
                    <span className="text-amber-300">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
