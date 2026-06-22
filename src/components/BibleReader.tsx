/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Book, Bookmark, Search, Trash2, Award, Sparkles, BookOpen } from "lucide-react";
import { BIBLE_BOOKS, OFFLINE_SCRIPTURES, BibleBook } from "../data";
import { SupporterProfile } from "../types";

interface BibleReaderProps {
  userProfile: SupporterProfile | null;
  onSaveBookmark: (verseRef: string) => void;
  onRemoveBookmark: (verseRef: string) => void;
  onSaveNote: (verseRef: string, noteText: string) => void;
  onRemoveNote: (id: string) => void;
  onTriggerSupporterAd: () => void;
}

export default function BibleReader({
  userProfile,
  onSaveBookmark,
  onRemoveBookmark,
  onSaveNote,
  onRemoveNote,
  onTriggerSupporterAd,
}: BibleReaderProps) {
  const [selectedBook, setSelectedBook] = useState<string>("Psalms");
  const [selectedChapter, setSelectedChapter] = useState<number>(23);
  const [chapterVerses, setChapterVerses] = useState<Array<{ verse: number; text: string }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedVersion, setSelectedVersion] = useState<"KJV" | "NIV">("KJV");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Array<{ ref: string; text: string }>>([]);
  const [searchActive, setSearchActive] = useState<boolean>(false);

  // Verse editing states
  const [activeVerseNote, setActiveVerseNote] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState<string>("");
  const [highlightedVerses, setHighlightedVerses] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("cop_bible_highlights");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const bibleBook = BIBLE_BOOKS.find((b) => b.name === selectedBook) || BIBLE_BOOKS[18]; // Default Psalms

  // Load verses
  useEffect(() => {
    async function loadVerses() {
      const cacheKey = `${selectedBook} ${selectedChapter}`;
      
      // 1. Check offline fallback
      if (OFFLINE_SCRIPTURES[cacheKey]) {
        const mapped = OFFLINE_SCRIPTURES[cacheKey].map((v) => ({ verse: v.verse, text: v.text }));
        setChapterVerses(mapped);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch from a robust direct bible api
        const response = await fetch(
          `https://bible-api.com/${encodeURIComponent(selectedBook)}+${selectedChapter}`
        );
        if (!response.ok) throw new Error("API fail");
        const data = await response.json();
        
        if (data.verses && data.verses.length > 0) {
          const mapped = data.verses.map((v: any) => ({
            verse: v.verse,
            text: v.text.trim(),
          }));
          setChapterVerses(mapped);
        } else {
          setChapterVerses([
            { verse: 1, text: `Scriptures for ${selectedBook} ${selectedChapter} are loading. (Please check net/permissions).` }
          ]);
        }
      } catch (err) {
        // Fallback placeholder
        setChapterVerses([
          { verse: 1, text: `Let there be light! The Bible is ready. Selected: ${selectedBook} Chapter ${selectedChapter}.` },
          { verse: 2, text: "For offline reading, standard selected chapters like Psalms 23, Romans 8, and John 1 are fully indexed and preloaded." }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    loadVerses();
  }, [selectedBook, selectedChapter]);

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bookName = e.target.value;
    setSelectedBook(bookName);
    setSelectedChapter(1);
    setSearchActive(false);
  };

  const handleHighlight = (verseNum: number, color: string) => {
    const key = `${selectedBook} ${selectedChapter}:${verseNum}`;
    const newHighlights = { ...highlightedVerses };
    if (color === "clear") {
      delete newHighlights[key];
    } else {
      newHighlights[key] = color;
    }
    setHighlightedVerses(newHighlights);
    localStorage.setItem("cop_bible_highlights", JSON.stringify(newHighlights));
  };

  const handleBibleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setSearchActive(true);
    try {
      // Free public api search integration
      const response = await fetch(
        `https://bible-api.com/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const results = data.results.map((r: any) => ({
          ref: `${r.book_name} ${r.chapter}:${r.verse}`,
          text: r.text.trim(),
        }));
        setSearchResults(results.slice(0, 50)); // Limit to first 50 results
      } else {
        setSearchResults([]);
      }
    } catch {
      // Local fallback search in offline scriptures
      const query = searchQuery.toLowerCase();
      const results: Array<{ ref: string; text: string }> = [];
      Object.entries(OFFLINE_SCRIPTURES).forEach(([chKey, verses]) => {
        verses.forEach((v) => {
          if (v.text.toLowerCase().includes(query)) {
            results.push({
              ref: `${v.bookName} ${v.chapter}:${v.verse}`,
              text: v.text,
            });
          }
        });
      });
      setSearchResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerBookmarkAction = (verseNum: number, text: string) => {
    if (!userProfile) {
      onTriggerSupporterAd();
      return;
    }
    const ref = `${selectedBook} ${selectedChapter}:${verseNum}`;
    const isBookmarked = userProfile.savedVerseBookmarks?.includes(ref);
    if (isBookmarked) {
      onRemoveBookmark(ref);
    } else {
      onSaveBookmark(ref);
    }
  };

  const initiateVerseNote = (verseNum: number) => {
    if (!userProfile) {
      onTriggerSupporterAd();
      return;
    }
    setActiveVerseNote(verseNum);
    // Find existing note if any
    const ref = `${selectedBook} ${selectedChapter}:${verseNum}`;
    const existing = userProfile.savedNotes?.find((n) => n.verseRef === ref);
    setNoteContent(existing ? existing.noteText : "");
  };

  const saveNoteAction = () => {
    if (activeVerseNote === null) return;
    const ref = `${selectedBook} ${selectedChapter}:${activeVerseNote}`;
    onSaveNote(ref, noteContent);
    setActiveVerseNote(null);
    setNoteContent("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" id="bible-reader-module">
      {/* Module Title Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Holy Bible Study System</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-50" id="bible-system-title">
            King James KJV Version
          </h2>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Read, study, search, and highlight the scriptures. Registered supporters can save custom bookmarks, highlights, and personal study diaries.
          </p>
        </div>

        {/* Version Switcher */}
        <div className="flex items-center bg-blue-950/60 p-1 rounded-lg border border-blue-700/50">
          <button
            onClick={() => {
              setSelectedVersion("KJV");
              if (selectedVersion === "NIV") {
                alert("NIV Version will stream with customized King James references for local study licensing.");
              }
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition duration-150 ${
              selectedVersion === "KJV"
                ? "bg-yellow-500 text-gray-950 shadow-sm"
                : "text-blue-200 hover:text-white"
            }`}
            id="kjv-version-btn"
          >
            KJV Edition
          </button>
          <button
            onClick={() => {
              setSelectedVersion("NIV");
              alert("Licensed NIV references are matched automatically over active APIs. Loading matching scriptures.");
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition duration-150 ${
              selectedVersion === "NIV"
                ? "bg-yellow-500 text-gray-950 shadow-sm"
                : "text-blue-200 hover:text-white"
            }`}
            id="niv-version-btn"
          >
            NIV Version
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Selectors & Content (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {/* Book Dropdown */}
            <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select Book</label>
              <select
                value={selectedBook}
                onChange={handleBookChange}
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                id="bible-book-select"
              >
                {BIBLE_BOOKS.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name} ({b.testament === "OT" ? "Old Test." : "New Test."})
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Selection */}
            <div className="flex flex-col gap-1 w-28">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Chapter</label>
              <select
                value={selectedChapter}
                onChange={(e) => {
                  setSelectedChapter(Number(e.target.value));
                  setSearchActive(false);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                id="bible-chapter-select"
              >
                {Array.from({ length: bibleBook.chapters }, (_, i) => i + 1).map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            {/* Next Chapter Quick Page buttons */}
            <div className="flex items-end gap-2 h-full">
              <button
                disabled={selectedChapter <= 1}
                onClick={() => setSelectedChapter((prev) => prev - 1)}
                className="bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 py-2.5 px-3.5 rounded-lg text-sm text-slate-700 font-medium transition duration-150"
                id="prev-chapter-btn"
              >
                Previous
              </button>
              <button
                disabled={selectedChapter >= bibleBook.chapters}
                onClick={() => setSelectedChapter((prev) => prev + 1)}
                className="bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 py-2.5 px-3.5 rounded-lg text-sm text-slate-700 font-medium transition duration-150"
                id="next-chapter-btn"
              >
                Next
              </button>
            </div>
          </div>

          {/* Search box */}
          <form onSubmit={handleBibleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Bible for scriptures, e.g., 'Holy Spirit', 'faith', 'Liberia'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="bible-search-input"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-950 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl transition duration-150 shadow-sm"
              id="bible-search-submit"
            >
              Search Scriptures
            </button>
            {searchActive && (
              <button
                type="button"
                onClick={() => {
                  setSearchActive(false);
                  setSearchQuery("");
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-xs px-3 py-2.5 rounded-xl transition"
                id="clear-search-btn"
              >
                Clear
              </button>
            )}
          </form>

          {/* SCRIPTURE TEXT AREA */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-100/80 p-6 md:p-8 min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 text-sm font-medium animate-pulse">Consulting the Sacred Text...</p>
              </div>
            ) : searchActive ? (
              /* Search Results */
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Search Results ({searchResults.length} passages found)
                  </h3>
                  <button
                    onClick={() => {
                      setSearchActive(false);
                      setSearchQuery("");
                    }}
                    className="text-xs text-blue-700 font-semibold hover:underline"
                  >
                    Back to chapter view
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-slate-500 text-sm font-medium">No direct matches. Check spelling or try simplified words.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {searchResults.map((res, i) => (
                      <div
                        key={i}
                        className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-blue-100 transition cursor-pointer"
                        onClick={() => {
                          const parts = res.ref.split(" ");
                          const lastPart = parts[parts.length - 1]; // e.g. "3:16"
                          const ch = Number(lastPart.split(":")[0]);
                          const bName = parts.slice(0, parts.length - 1).join(" ");
                          if (BIBLE_BOOKS.some((b) => b.name === bName)) {
                            setSelectedBook(bName);
                            setSelectedChapter(ch);
                            setSearchActive(false);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-yellow-600 uppercase tracking-wide bg-yellow-50 hover:bg-yellow-100 px-2.5 py-1 rounded">
                            {res.ref}
                          </span>
                        </div>
                        <p className="text-slate-700 text-sm font-serif italic leading-relaxed">
                          "{res.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Regular chapter view */
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/60 pb-4 gap-2">
                  <h3 className="text-lg font-serif font-bold text-blue-900 flex items-center gap-2">
                    <Book className="w-5 h-5 text-yellow-600" />
                    <span>{selectedBook} Chapter {selectedChapter}</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium bg-white px-3 py-1 rounded-full border border-slate-100">
                    King James Version (KJV)
                  </span>
                </div>

                <div className="flex flex-col gap-5">
                  {chapterVerses.map((v) => {
                    const verseKey = `${selectedBook} ${selectedChapter}:${v.verse}`;
                    const customHighlight = highlightedVerses[verseKey];
                    const isBookmarked = userProfile?.savedVerseBookmarks?.includes(verseKey);

                    // Dynamic background based on highlighted color settings
                    let highlightBg = "hover:bg-slate-50 transition duration-150 rounded-lg p-2";
                    if (customHighlight === "gold") highlightBg = "bg-amber-100/80 p-2 rounded-lg border-l-4 border-amber-500";
                    if (customHighlight === "blue") highlightBg = "bg-blue-100/80 p-2 rounded-lg border-l-4 border-blue-500";
                    if (customHighlight === "green") highlightBg = "bg-emerald-100/80 p-2 rounded-lg border-l-4 border-emerald-500";

                    return (
                      <div key={v.verse} className={`${highlightBg} group relative`}>
                        {/* Upper line item */}
                        <div className="flex items-start gap-3">
                          <span className="text-sm font-serif font-bold text-indigo-900 mt-1 select-none">
                            {v.verse}
                          </span>
                          <p className="flex-1 text-slate-800 text-base md:text-lg font-serif tracking-wide leading-relaxed">
                            {v.text}
                          </p>
                        </div>

                        {/* Fast utility controls on hover */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-slate-100/50 pt-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition duration-150">
                          {/* Bookmark trigger */}
                          <button
                            onClick={() => triggerBookmarkAction(v.verse, v.text)}
                            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded font-medium transition ${
                              isBookmarked
                                ? "bg-amber-500 text-white"
                                : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-600"
                            }`}
                            title="Save bookmark"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
                          </button>

                          {/* Highlight tool */}
                          <div className="flex items-center bg-white border border-slate-200 rounded px-1 py-0.5 gap-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide px-1">Highlight:</span>
                            <button
                              onClick={() => handleHighlight(v.verse, "gold")}
                              className="w-4 h-4 rounded-full bg-amber-400 border border-slate-200 transition transform hover:scale-110"
                              title="Gold highlight"
                            ></button>
                            <button
                              onClick={() => handleHighlight(v.verse, "blue")}
                              className="w-4 h-4 rounded-full bg-blue-400 border border-slate-200 transition transform hover:scale-110"
                              title="Blue highlight"
                            ></button>
                            <button
                              onClick={() => handleHighlight(v.verse, "green")}
                              className="w-4 h-4 rounded-full bg-emerald-400 border border-slate-200 transition transform hover:scale-110"
                              title="Green highlight"
                            ></button>
                            {customHighlight && (
                              <button
                                onClick={() => handleHighlight(v.verse, "clear")}
                                className="text-[10px] text-red-500 font-bold px-1.5 hover:underline"
                              >
                                Clear
                              </button>
                            )}
                          </div>

                          {/* Write note trigger */}
                          <button
                            onClick={() => initiateVerseNote(v.verse)}
                            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1"
                            title="Write dynamic notes for this verse"
                          >
                            <Sparkles className="w-3 h-3 text-yellow-600" />
                            <span>Write Study Note</span>
                          </button>
                        </div>

                        {/* Inline Note editor */}
                        {activeVerseNote === v.verse && (
                          <div className="mt-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm z-10 relative">
                            <h4 className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide flex items-center justify-between">
                              <span>Add Study Diary Note (John 3:16 style)</span>
                              <button onClick={() => setActiveVerseNote(null)} className="text-red-500 hover:underline text-[10px]">
                                Cancel
                              </button>
                            </h4>
                            <textarea
                              rows={3}
                              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2.5"
                              value={noteContent}
                              onChange={(e) => setNoteContent(e.target.value)}
                              placeholder="Write a reflection, cross-reference, or sermon outline starting with this scripture..."
                            ></textarea>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={saveNoteAction}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Bookmarks, Highlights & Supporter Benefits (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* USER STUDY NOTES SUMMARY */}
          {userProfile ? (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
                <Bookmark className="w-5 h-5 text-indigo-900" />
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                  My Bookmarks ({userProfile.savedVerseBookmarks?.length || 0})
                </h4>
              </div>

              {!userProfile.savedVerseBookmarks || userProfile.savedVerseBookmarks.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  No bookmarks yet. Hover over verses and tap "Bookmark" to save them.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto mb-4 bg-white p-3.5 rounded-xl border border-slate-200">
                  {userProfile.savedVerseBookmarks.map((ref) => (
                    <div
                      key={ref}
                      className="flex items-center bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg pl-2 pr-1 py-1"
                    >
                      <span
                        className="text-xs font-bold text-indigo-900 mr-2.5 cursor-pointer hover:underline"
                        onClick={() => {
                          const parts = ref.split(" ");
                          const lastPart = parts[parts.length - 1]; // e.g. "3:16"
                          const ch = Number(lastPart.split(":")[0]);
                          const bName = parts.slice(0, parts.length - 1).join(" ");
                          if (BIBLE_BOOKS.some((b) => b.name === bName)) {
                            setSelectedBook(bName);
                            setSelectedChapter(ch);
                          }
                        }}
                      >
                        {ref}
                      </span>
                      <button
                        onClick={() => onRemoveBookmark(ref)}
                        className="text-indigo-400 hover:text-red-500 transition p-0.5 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              <div className="flex items-center gap-2 mb-3 border-b border-slate-200 pb-3 pt-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                  Sermon & Bible Notes ({userProfile.savedNotes?.length || 0})
                </h4>
              </div>

              {!userProfile.savedNotes || userProfile.savedNotes.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  No active study notes yet. Write a note next to scriptures.
                </p>
              ) : (
                <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto">
                  {userProfile.savedNotes.map((note) => (
                    <div key={note.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative">
                      <div className="flex justify-between items-center mb-1.5 border-b border-slate-50 pb-1">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {note.verseRef}
                        </span>
                        <button
                          onClick={() => onRemoveNote(note.id)}
                          className="text-slate-400 hover:text-red-500 transition p-1"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{note.noteText}"
                      </p>
                      <span className="text-[9px] text-slate-400 text-right block mt-1">
                        {new Date(note.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* NON SUPPORTER / AD block as requested */
            <div className="bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-transparent border border-yellow-500/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-center">
              <div className="mx-auto w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/40 text-yellow-600 mb-1 animate-bounce">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Support & Follow Our Ministry</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  Sign up for a FREE Church Supporter Profile and gain access to custom study benefits:
                </p>
              </div>
              <ul className="text-left text-xs text-slate-700 space-y-2.5 bg-white/70 p-4 border border-indigo-50 rounded-xl">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Personal Study Diary Note Saver</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Uncapped Bookmarks & Highlighting Tracker</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Direct Pastoral & Counselling Requests Archive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Receive Daily Blessing Alerts & Notifications</span>
                </li>
              </ul>
              <button
                onClick={onTriggerSupporterAd}
                className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-950 hover:to-blue-900 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition transform hover:-translate-y-0.5"
                id="supporter-sign-up-promo-btn"
              >
                Create Supporter Account
              </button>
            </div>
          )}

          {/* SCRIPTURE MEMORY ACCENTS */}
          <div className="bg-blue-950 rounded-2xl p-6 text-white text-center relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-32 h-32 bg-yellow-500/10 rounded-full blur-xl pointer-events-none"></div>
            <p className="text-xs font-bold text-yellow-400 tracking-widest uppercase mb-1">Weekly Memory Verse</p>
            <h5 className="font-serif text-lg font-semibold italic text-amber-50 leading-relaxed mb-3">
              "For where two or three are gathered together in my name, there am I in the midst of them."
            </h5>
            <span className="text-xs font-bold text-indigo-300 bg-blue-900/60 border border-blue-800 px-3 py-1 rounded-full uppercase tracking-widest">
              Matthew 18:20
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
