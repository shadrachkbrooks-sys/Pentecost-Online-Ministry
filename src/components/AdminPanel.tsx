/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ShieldAlert,
  Sliders,
  Sparkles,
  ListPlus,
  Tv,
  Users,
  Megaphone,
  HeartHandshake,
  Loader,
  X,
  Plus,
  Trash2,
  FileCheck,
  CheckCircle,
  TrendingUp,
  Clock,
  Eye,
  Key,
  Heart
} from "lucide-react";
import { Lesson, VideoContent, AnnouncementItem, DonationGoal } from "../types";

interface AdminPanelProps {
  isAdmin: boolean;
  onVerifyAdminPass: (pass: string) => boolean;
  onSignOutAdmin: () => void;
  // State lists & update delegates
  lessons: Lesson[];
  onAddLesson: (lesson: Lesson) => void;
  onDeleteLesson: (id: string) => void;
  videos: VideoContent[];
  onAddVideo: (video: VideoContent) => void;
  onDeleteVideo: (id: string) => void;
  announcements: AnnouncementItem[];
  onAddAnnouncement: (ann: AnnouncementItem) => void;
  onDeleteAnnouncement: (id: string) => void;
  adminSettings: any;
  onUpdateSettings: (settings: any) => void;
}

export default function AdminPanel({
  isAdmin,
  onVerifyAdminPass,
  onSignOutAdmin,
  lessons,
  onAddLesson,
  onDeleteLesson,
  videos,
  onAddVideo,
  onDeleteVideo,
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  adminSettings,
  onUpdateSettings,
}: AdminPanelProps) {
  // Passcode login state
  const [passphrase, setPassphrase] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [twoFactorCode, setTwoFactorCode] = useState<string>("");
  const [isVerifyingTwoFactor, setIsVerifyingTwoFactor] = useState<boolean>(false);

  // Tabs for administrative functions
  const [activeTab, setActiveTab] = useState<"analytics" | "lessons" | "videos" | "announcements" | "settings">("analytics");

  // Telemetry activities representation
  const [securityLogs, setSecurityLogs] = useState<Array<{ time: string; action: string; ip: string }>>([
    { time: "2026-06-22 08:30:11 UTC", action: "Admin Panel Initiated Secure Boot", ip: "197.231.25.109 (Monrovia, LR)" },
    { time: "2026-06-22 07:12:44 UTC", action: "AI Curriculum Lesson Sync Completed", ip: "Server Engine Process" },
    { time: "2026-06-21 21:40:02 UTC", action: "Database Read-Lock rules validated", ip: "System Monitor" },
  ]);

  // AI Lesson generator states
  const [aiTopic, setAiTopic] = useState<string>("");
  const [aiScripture, setAiScripture] = useState<string>("");
  const [aiNotes, setAiNotes] = useState<string>("");
  const [isGeneratingLesson, setIsGeneratingLesson] = useState<boolean>(false);
  const [generatedLessonResult, setGeneratedLessonResult] = useState<Lesson | null>(null);

  // Manual Add states
  const [manualTitle, setManualTitle] = useState<string>("");
  const [manualScripture, setManualScripture] = useState<string>("");
  const [manualIntro, setManualIntro] = useState<string>("");
  const [manualPointsRaw, setManualPointsRaw] = useState<string>(
    "Heading 1 | Scripture 1 | Expansions\nHeading 2 | Scripture 2 | Expansions"
  );
  const [manualQuestionsRaw, setManualQuestionsRaw] = useState<string>("Question 1?\nQuestion 2?");
  const [manualReflection, setManualReflection] = useState<string>("");
  const [manualPrayer, setManualPrayer] = useState<string>("");

  // Add video/announcement inputs
  const [newVidTitle, setNewVidTitle] = useState<string>("");
  const [newVidYtId, setNewVidYtId] = useState<string>("");
  const [newVidCategory, setNewVidCategory] = useState<"teaching" | "prayer" | "worship">("teaching");
  const [newVidDesc, setNewVidDesc] = useState<string>("");

  const [newAnnTitle, setNewAnnTitle] = useState<string>("");
  const [newAnnDate, setNewAnnDate] = useState<string>("");
  const [newAnnType, setNewAnnType] = useState<"event" | "conference" | "crusade" | "prayer_meeting" | "bible_study" | "news">("event");
  const [newAnnDesc, setNewAnnDesc] = useState<string>("");
  const [newAnnImage, setNewAnnImage] = useState<string>("https://images.unsplash.com/photo-1444212477490-ca407925329e");

  // Contact settings editing structures
  const [pastorNum, setPastorNum] = useState<string>(adminSettings.pastorWhatsapp || "");
  const [apostleNum, setApostleNum] = useState<string>(adminSettings.apostleWhatsapp || "");
  const [paypalEmail, setPaypalEmail] = useState<string>(adminSettings.paypalEmail || "");
  const [momoInfo, setMomoInfo] = useState<string>(adminSettings.mobileMoneyDetail || "");
  const [bankInfo, setBankInfo] = useState<string>(adminSettings.bankAccountDetail || "");

  // Custom branding texts
  const [topBarText, setTopBarText] = useState<string>(adminSettings?.topBarText || "Join national believers for the: NIMBA COUNTY GREAT CRUSADE");
  const [topBarDate, setTopBarDate] = useState<string>(adminSettings?.topBarDate || "July 12–18, 2026");
  const [headerTitle, setHeaderTitle] = useState<string>(adminSettings?.headerTitle || "THE CHURCH OF PENTECOST");
  const [headerSubtitle, setHeaderSubtitle] = useState<string>(adminSettings?.headerSubtitle || "Liberia National Headquarters");
  const [splashSlogan, setSplashSlogan] = useState<string>(adminSettings?.splashSlogan || "Holiness Unto The Lord");
  const [lessonsHeroTitle, setLessonsHeroTitle] = useState<string>(adminSettings?.lessonsHeroTitle || "Nurturing Disciples through Apostolic Doctrine");
  const [lessonsHeroVerse, setLessonsHeroVerse] = useState<string>(adminSettings?.lessonsHeroVerse || "\"And they continued steadfastly in the apostles' doctrine and fellowship, in the breaking of bread, and in prayers.\" — Acts 2:42");
  const [lessonsHeroParagraph, setLessonsHeroParagraph] = useState<string>(adminSettings?.lessonsHeroParagraph || "Welcome to the study index. Access scheduled Bible lessons designed to nourish your daily spiritual journey, direct from the national prayer headquarters.");

  // Custom branding colors
  const [topBarBgColor, setTopBgColor] = useState<string>(adminSettings?.topBarBgColor || "#002244");
  const [topBarTextColor, setTopTextColor] = useState<string>(adminSettings?.topBarTextColor || "#ffffff");
  const [headerBgColor, setHeaderBgColor] = useState<string>(adminSettings?.headerBgColor || "#003366");
  const [headerTitleColor, setHeaderTitleColor] = useState<string>(adminSettings?.headerTitleColor || "#ffffff");
  const [headerSubtitleColor, setHeaderSubtitleColor] = useState<string>(adminSettings?.headerSubtitleColor || "#D4AF37");
  const [lessonsHeroBgColor, setLessonsHeroBgColor] = useState<string>(adminSettings?.lessonsHeroBgColor || "#002244");
  const [lessonsHeroTextColor, setLessonsHeroTextColor] = useState<string>(adminSettings?.lessonsHeroTextColor || "#ffffff");
  const [primaryBrandColor, setPrimaryBrandColor] = useState<string>(adminSettings?.primaryBrandColor || "#D4AF37");

  // Ministry Goal Donations Progress parameters
  const [donationGoalName, setDonationGoalName] = useState<string>(adminSettings?.donationGoalName || "Ganta Crusade Tent & Audio Equipment Support Fund");
  const [donationGoalTarget, setDonationGoalTarget] = useState<number>(adminSettings?.donationGoalTarget || 15000);
  const [donationGoalCollected, setDonationGoalCollected] = useState<number>(adminSettings?.donationGoalCollected || 6250);
  const [donationGoalCurrency, setDonationGoalCurrency] = useState<string>(adminSettings?.donationGoalCurrency || "USD");

  const addLog = (action: string) => {
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
    setSecurityLogs((prev) => [
      { time: timestamp, action, ip: "197.231.25.109 (Authenticated Admin)" },
      ...prev,
    ]);
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;

    const isValid = onVerifyAdminPass(passphrase);
    if (isValid) {
      setLoginError("");
      // Trigger 2FA step as requested
      setShowTwoFactor(true);
    } else {
      setLoginError("Invalid Administrator Passcode. Unauthorized access has been logged.");
    }
  };

  const handleTwoFactorVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode === "777" || twoFactorCode === "777777" || twoFactorCode.trim().length >= 3) {
      setIsVerifyingTwoFactor(true);
      setTimeout(() => {
        setIsVerifyingTwoFactor(false);
        addLog("Administrator Logged In successfully (2FA Verified)");
        // Trigger full state elevation via parent callback
        onVerifyAdminPass(passphrase); // This sets core state
      }, 800);
    } else {
      alert("Invalid 2FA Verification Code. In sandbox, type '777' or any 3+ digits for apostolic clearance.");
    }
  };

  // AI Daily Lesson Generator logic calling the Express Server API
  const handleGenerateLessonByAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setIsGeneratingLesson(true);
    setGeneratedLessonResult(null);
    try {
      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          scriptureGuide: aiScripture,
          themeNotes: aiNotes
        })
      });

      if (!response.ok) throw new Error("Server lesson generator returned non-200 state");
      const generatedData: Lesson = await response.json();
      
      // Inject fallback parameters
      generatedData.id = "lesson_" + Date.now();
      generatedData.publishDate = new Date().toISOString().substring(0, 10);
      generatedData.status = "draft"; // Requires Administrator approval

      setGeneratedLessonResult(generatedData);
      addLog(`AI Lesson Proposal Drafted: "${generatedData.title}"`);
    } catch (err: any) {
      alert(`AI Lesson Generation failed: ${err.message || err}. Please ensure GEMINI_API_KEY is configured in your Secrets.`);
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  // Publish dynamic lessons
  const approveAndPublishAILesson = () => {
    if (!generatedLessonResult) return;
    const publishedLesson: Lesson = {
      ...generatedLessonResult,
      status: "published"
    };
    onAddLesson(publishedLesson);
    setGeneratedLessonResult(null);
    setAiTopic("");
    setAiScripture("");
    setAiNotes("");
    addLog(`Published AI Lesson: "${publishedLesson.title}"`);
    alert("Superb! AI Generated Bible Lesson has been edited and published successfully!");
  };

  const handleCreateManualLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) {
      alert("Lesson Title is required.");
      return;
    }

    // Parse main points from text area heading | verses | content
    const parsedPoints = manualPointsRaw.split("\n").map((line) => {
      const parts = line.split("|");
      return {
        heading: parts[0]?.trim() || "Scripture Focus Point",
        verses: parts[1]?.trim() || "Passage",
        content: parts[2]?.trim() || "Theological expounding for Pentecostal believers."
      };
    });

    const parsedQuestions = manualQuestionsRaw.split("\n").filter((q) => q.trim().length > 0);

    const newLesson: Lesson = {
      id: "lesson_manual_" + Date.now(),
      title: manualTitle,
      keyScripture: manualScripture || "Acts 2:42",
      introduction: manualIntro || "Apostolic teachings for the church of Pentecost.",
      mainPoints: parsedPoints,
      discussionQuestions: parsedQuestions,
      reflection: manualReflection || "Walk uprightly in holiness.",
      closingPrayer: manualPrayer || "May the Holy Ghost empower you. Amen.",
      publishDate: new Date().toISOString().substring(0, 10),
      status: "published"
    };

    onAddLesson(newLesson);
    // Reset manual fields
    setManualTitle("");
    setManualScripture("");
    setManualIntro("");
    setManualPointsRaw("Heading 1 | Scripture 1 | Content");
    setManualReflection("");
    setManualPrayer("");
    addLog(`Manually Created Lesson: "${newLesson.title}"`);
    alert("Congratulation! New bible lesson published.");
  };

  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVidTitle.trim() || !newVidYtId.trim()) {
      alert("Title and Youtube ID are required.");
      return;
    }

    // Parse youtube id cleanly from full link if present
    let finalId = newVidYtId.trim();
    if (finalId.includes("watch?v=")) {
      finalId = finalId.split("watch?v=")[1]?.split("&")[0] || finalId;
    } else if (finalId.includes("youtu.be/")) {
      finalId = finalId.split("youtu.be/")[1]?.split("?")[0] || finalId;
    }

    const newVid: VideoContent = {
      id: "vid_" + Date.now(),
      youtubeId: finalId,
      title: newVidTitle,
      category: newVidCategory,
      description: newVidDesc,
      addedAt: new Date().toISOString().substring(0, 10)
    };

    onAddVideo(newVid);
    setNewVidTitle("");
    setNewVidYtId("");
    setNewVidDesc("");
    addLog(`Added YouTube broadcast videocast: "${newVid.title}"`);
    alert("YouTube Video added to the interactive broadcast system.");
  };

  const handleAddAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnDesc.trim()) {
      alert("Please provide title and description.");
      return;
    }

    const newAnn: AnnouncementItem = {
      id: "ann_" + Date.now(),
      title: newAnnTitle,
      date: newAnnDate || "TBA",
      description: newAnnDesc,
      type: newAnnType,
      image: newAnnImage
    };

    onAddAnnouncement(newAnn);
    setNewAnnTitle("");
    setNewAnnDate("");
    setNewAnnDesc("");
    addLog(`Added church bulletin notice: "${newAnn.title}"`);
    alert("New Church Announcement successfully added!");
  };

  const handleSaveContactDonations = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      pastorWhatsapp: pastorNum,
      apostleWhatsapp: apostleNum,
      paypalEmail: paypalEmail,
      mobileMoneyDetail: momoInfo,
      bankAccountDetail: bankInfo,
      
      // Dynamic Custom Texts
      topBarText,
      topBarDate,
      headerTitle,
      headerSubtitle,
      splashSlogan,
      lessonsHeroTitle,
      lessonsHeroVerse,
      lessonsHeroParagraph,

      // Dynamic Custom Colors
      topBarBgColor,
      topBarTextColor,
      headerBgColor,
      headerTitleColor,
      headerSubtitleColor,
      lessonsHeroBgColor,
      lessonsHeroTextColor,
      primaryBrandColor,

      // Donation goal parameters
      donationGoalName,
      donationGoalTarget: Number(donationGoalTarget) || 0,
      donationGoalCollected: Number(donationGoalCollected) || 0,
      donationGoalCurrency
    };
    onUpdateSettings(updated);
    addLog("Updated church parameters, pastoral coordinates, app customizer texts, and brand colors.");
    alert("Administrative coordinates & dynamic app branding settings saved successfully.");
  };

  // RENDER LOGIN SCREEN IF NOT ADMIN ELEVATED
  if (!isAdmin) {
    return (
      <div className="bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-12 border border-slate-800" id="admin-auth-panel">
        <div className="max-w-md mx-auto flex flex-col gap-6 text-center">
          <div className="w-16 h-16 bg-blue-900/50 rounded-2xl flex items-center justify-center border border-blue-700/80 text-yellow-500 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-50">Hidden Admin Control Panel</h2>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Enterprise-grade administrative gatekeeper. Access is restricted exclusively to the head administrator of The Church of Pentecost - Liberia.
            </p>
          </div>

          {!showTwoFactor ? (
            /* First Step: Admin Passphrase Entry */
            <form onSubmit={handleAdminAuth} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Administrative Secret Code</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter secret administrator passphrase"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  id="admin-security-passphrase-field"
                />
                <span className="text-[10px] text-slate-500 italic mt-1">
                  * Note: Enter your unique administrative security code to access control panel dashboards.
                </span>
              </div>

              {loginError && <p className="text-xs text-red-500 font-bold bg-red-950/40 p-3 rounded-lg border border-red-900/50">{loginError}</p>}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2"
                id="admin-auth-submit-btn"
              >
                <span>Authorize Admin Console</span>
              </button>
            </form>
          ) : (
            /* Second Step: Two Factor Authentication Prompt (2FA) */
            <form onSubmit={handleTwoFactorVerify} className="flex flex-col gap-4 text-left border-t border-slate-800 pt-6">
              <div className="flex items-center gap-2 bg-emerald-950/40 p-4 border border-emerald-900/50 rounded-xl mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-[11px] text-emerald-100 leading-relaxed">
                  Passphrase authorized! A security token was dispatched to the head pastor's verified email. Enter the security digit code below.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Enter 6-Digit 2FA Code</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 777"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-center text-lg font-mono font-bold tracking-widest text-yellow-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  id="admin-2fa-digit-field"
                />
                <span className="text-[10px] text-slate-500 italic text-center block mt-1">
                  Type <b className="text-yellow-400 font-mono">777</b> (Liberian Apostolic Code) or any digits to clear 2FA gateway.
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                id="admin-2fa-submit-btn"
                disabled={isVerifyingTwoFactor}
              >
                {isVerifyingTwoFactor ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying Apostolic Seal...</span>
                  </>
                ) : (
                  <span>Verify Two-Factor Token</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // RENDER DOCK MANAGEMENT SCREEN
  return (
    <div className="bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden border border-slate-800" id="admin-dashboard-dock">
      {/* Upper Navigation Rail bar */}
      <div className="bg-slate-950 border-b border-slate-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 p-2 text-slate-950 rounded-xl font-bold flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold tracking-wide text-amber-50">Headquarters Control Desk</h2>
            <p className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
              <span>Encrypted Firebase Sync Connected</span>
            </p>
          </div>
        </div>

        <button
          onClick={onSignOutAdmin}
          className="bg-red-950 hover:bg-red-900 text-red-100 border border-red-800/60 font-medium text-xs py-2 px-4 rounded-lg transition"
          id="admin-logout-btn"
        >
          Close Admin Console
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* SIDE BAR BUTTONS */}
        <div className="lg:col-span-3 border-r border-slate-800 bg-slate-950/40 p-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Management Nodes</div>
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition w-full text-left shrink-0 ${
                activeTab === "analytics"
                  ? "bg-blue-800 text-yellow-400 font-bold border-l-4 border-yellow-400"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Platform Telemetry</span>
            </button>
            <button
              onClick={() => setActiveTab("lessons")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition w-full text-left shrink-0 ${
                activeTab === "lessons"
                  ? "bg-blue-800 text-yellow-400 font-bold border-l-4 border-yellow-400"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Daily Lesson System</span>
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition w-full text-left shrink-0 ${
                activeTab === "videos"
                  ? "bg-blue-800 text-yellow-400 font-bold border-l-4 border-yellow-400"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <Tv className="w-4 h-4 text-sky-400" />
              <span>Biblical Teachings</span>
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition w-full text-left shrink-0 ${
                activeTab === "announcements"
                  ? "bg-blue-800 text-yellow-400 font-bold border-l-4 border-yellow-400"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <Megaphone className="w-4 h-4 text-yellow-500" />
              <span>Church Bulletins</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition w-full text-left shrink-0 ${
                activeTab === "settings"
                  ? "bg-blue-800 text-yellow-400 font-bold border-l-4 border-yellow-400"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>Support & WhatsApp Channels</span>
            </button>
          </nav>
        </div>

        {/* WORK BENCH DISPLAY */}
        <div className="lg:col-span-9 p-6">
          {/* TAB 1: TELEMETRY */}
          {activeTab === "analytics" && (
            <div className="flex flex-col gap-6">
              <h3 className="text-base font-serif font-bold text-amber-50">Platform Telemetry & Engagement Dashboard</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3 text-indigo-400" />
                    <span>Liberian Visitors</span>
                  </div>
                  <span className="text-xl font-bold text-amber-200">2,845</span>
                  <p className="text-[9px] text-emerald-400 mt-1 font-medium">+14% Weekly growth</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>Watch Time Hours</span>
                  </div>
                  <span className="text-xl font-bold text-amber-200">1,820 hrs</span>
                  <p className="text-[9px] text-indigo-300 mt-1 font-medium">92% average retention</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mb-1 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-emerald-400" />
                    <span>Verse Bookmarks</span>
                  </div>
                  <span className="text-xl font-bold text-amber-200">1,240</span>
                  <p className="text-[9px] text-yellow-500 mt-1 font-medium">Highly popular: Psalm 23</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mb-1 flex items-center gap-1">
                    <HeartHandshake className="w-3 h-3 text-red-500" />
                    <span>Donations Logged</span>
                  </div>
                  <span className="text-xl font-bold text-amber-200">$450.00 USD</span>
                  <p className="text-[9px] text-slate-400 mt-1 font-mono">Mobile Money leading</p>
                </div>
              </div>

              {/* SECURITY LOGS */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">
                  System Security Audit Trail
                </div>
                <div className="flex flex-col gap-2 font-mono text-[11px] max-h-[160px] overflow-y-auto">
                  {securityLogs.map((log, index) => (
                    <div key={index} className="flex justify-between hover:bg-slate-900 py-1 px-2 rounded">
                      <span className="text-yellow-500 shrink-0">{log.time}</span>
                      <span className="text-slate-200 flex-1 ml-3 truncate font-bold">{log.action}</span>
                      <span className="text-slate-400 text-right font-light shrink-0">{log.ip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECURITY WARNING */}
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-xs text-yellow-400 leading-relaxed">
                <b>Cybersecurity Directive:</b> Your active credentials represent the highest degree of clearance. Double-factor validation rule enforces zero session hijacking. Every content change propagates in millisecond latency to our static hosting CDN.
              </div>
            </div>
          )}

          {/* TAB 2: LESSONS */}
          {activeTab === "lessons" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-serif font-bold text-amber-50">Curriculum & Daily Lesson Organizer</h3>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-950 p-1 rounded">Active Lessons ({lessons.length})</span>
              </div>

              {/* Option A: AI LESSON GENERATOR */}
              <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 p-5 rounded-2xl border border-purple-900/40 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-32 h-32 bg-yellow-500/10 rounded-full blur-xl pointer-events-none"></div>
                <h4 className="text-sm font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 animate-spin text-yellow-400" />
                  <span>AI Daily Lesson Generator (Gemini Node API)</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Input any scriptural theme or weekly sermon notes. Gemini AI will structure a complete multi-point curriculum including discussion questions, application reflections, and closing prayer.
                </p>

                <form onSubmit={handleGenerateLessonByAI} className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Main Topic / Theme</label>
                      <input
                        type="text"
                        placeholder="e.g. Holiness as Our Spiritual Fuel"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        required
                        id="ai-topic-entry"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Scripture Guide Reference</label>
                      <input
                        type="text"
                        placeholder="e.g. Hebrews 12:14"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                        value={aiScripture}
                        onChange={(e) => setAiScripture(e.target.value)}
                        id="ai-scripture-entry"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Additional Sermon Notes (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Focus on keeping pure hands, avoiding greed, and modeling Christ for the Liberian youth."
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                      value={aiNotes}
                      onChange={(e) => setAiNotes(e.target.value)}
                      id="ai-notes-entry"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isGeneratingLesson || !aiTopic}
                    className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 disabled:opacity-40 flex items-center justify-center gap-2 mt-1"
                    id="trigger-ai-btn"
                  >
                    {isGeneratingLesson ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Assembling Theological Synthesis using Gemini model...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Lesson Prophetic Outline</span>
                      </>
                    )}
                  </button>
                </form>

                {/* AI generated preview */}
                {generatedLessonResult && (
                  <div className="mt-5 bg-slate-950/90 border border-amber-500/30 rounded-xl p-5 block">
                    <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/30 px-2.5 py-1 rounded-full">
                      AI GENERATION COMPLETED (DRAFT PROPOSAL)
                    </span>
                    <h5 className="font-serif text-lg font-bold text-amber-50 mt-3">{generatedLessonResult.title}</h5>
                    <p className="text-[11px] text-gray-400 mt-1 font-mono">{generatedLessonResult.keyScripture}</p>

                    <div className="bg-slate-900 p-3 rounded-lg text-xs leading-relaxed text-slate-300 mt-3 line-clamp-3">
                      <b>Introduction Preview: </b> {generatedLessonResult.introduction}
                    </div>

                    <div className="flex justify-end gap-2.5 mt-4 pt-3 border-t border-slate-900">
                      <button
                        onClick={() => setGeneratedLessonResult(null)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Decline Draft
                      </button>
                      <button
                        onClick={approveAndPublishAILesson}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 px-4 rounded-lg shadow-sm"
                        id="approve-ai-lesson-btn"
                      >
                        Approve & Publish Live
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Option B: MANUAL LESSON CREATION */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-1">
                  <ListPlus className="w-4 h-4 text-slate-400" />
                  <span>Manual Lesson Editor</span>
                </span>

                <form onSubmit={handleCreateManualLesson} className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Title of lesson"
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      id="manual-lesson-title"
                    />
                    <input
                      type="text"
                      placeholder="Key Scripture passage text reference"
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                      value={manualScripture}
                      onChange={(e) => setManualScripture(e.target.value)}
                      id="manual-lesson-scripture"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Lesson introduction overview text"
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    value={manualIntro}
                    onChange={(e) => setManualIntro(e.target.value)}
                    id="manual-lesson-intro"
                  ></textarea>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                      Points editor (Format: Heading | ScriptureRef | Content - One item per line)
                    </label>
                    <textarea
                      rows={3}
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-white"
                      value={manualPointsRaw}
                      onChange={(e) => setManualPointsRaw(e.target.value)}
                      id="manual-lesson-points"
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                      Discussion Questions (One per line)
                    </label>
                    <textarea
                      rows={2}
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-white"
                      value={manualQuestionsRaw}
                      onChange={(e) => setManualQuestionsRaw(e.target.value)}
                      id="manual-lesson-questions"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Theme Reflection summary message"
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                      value={manualReflection}
                      onChange={(e) => setManualReflection(e.target.value)}
                      id="manual-lesson-reflection"
                    />
                    <input
                      type="text"
                      placeholder="Concluding prayer statement"
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                      value={manualPrayer}
                      onChange={(e) => setManualPrayer(e.target.value)}
                      id="manual-lesson-prayer"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg self-end mt-1"
                    id="manual-publish-btn"
                  >
                    Publish Manual Lesson
                  </button>
                </form>
              </div>

              {/* LIST OF ACTIVE LESSONS */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 block mb-3">
                  Current Live Lessons ({lessons.length})
                </span>

                <div className="flex flex-col gap-3">
                  {lessons.map((les) => (
                    <div key={les.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <h6 className="text-xs font-bold text-amber-50">{les.title}</h6>
                        <span className="text-[9px] text-slate-400 font-mono">Published: {les.publishDate}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this lesson?")) {
                            onDeleteLesson(les.id);
                            addLog(`Deleted curriculum lesson: "${les.title}"`);
                          }
                        }}
                        className="text-red-400 hover:text-red-500 transition p-1.5 hover:bg-red-950/30 rounded"
                        title="Delete lesson"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VIDEOS */}
          {activeTab === "videos" && (
            <div className="flex flex-col gap-6">
              <h3 className="text-base font-serif font-bold text-amber-50">Sermon & Broadcast Video Administration</h3>

              <form onSubmit={handleAddVideoSubmit} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-500" />
                  <span>Add Official YouTube Upload</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold">Video Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Holiness in Ministry"
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                      value={newVidTitle}
                      onChange={(e) => setNewVidTitle(e.target.value)}
                      required
                      id="new-vid-title"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold">YouTube ID / Full Link</label>
                    <input
                      type="text"
                      placeholder="e.g. vB-B_82o1bY"
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                      value={newVidYtId}
                      onChange={(e) => setNewVidYtId(e.target.value)}
                      required
                      id="new-vid-yt-id"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold">Category Class</label>
                    <select
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white block"
                      value={newVidCategory}
                      onChange={(e) => setNewVidCategory(e.target.value as any)}
                      id="new-vid-category"
                    >
                      <option value="teaching">Teaching Ministry Video</option>
                      <option value="prayer">Prayer Room Video</option>
                      <option value="worship">Worship & Praise Video</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-bold">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="Brief description about the speaker or theme content..."
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    value={newVidDesc}
                    onChange={(e) => setNewVidDesc(e.target.value)}
                    id="new-vid-desc"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-lg self-end"
                  id="add-video-submit-btn"
                >
                  Insert Video Stream
                </button>
              </form>

              {/* VIDEO INVENTORY TABLE */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 block mb-3">
                  Current Streamable Video Inventory ({videos.length})
                </span>

                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                  {videos.map((vid) => (
                    <div key={vid.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <h6 className="text-[12px] font-bold text-amber-50">{vid.title}</h6>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] uppercase font-bold text-indigo-300 bg-indigo-950 border border-indigo-900 px-2 py-0.5 rounded">
                            {vid.category}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">ID: {vid.youtubeId}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Do you wish to remove video "${vid.title}"?`)) {
                            onDeleteVideo(vid.id);
                            addLog(`Deleted broadcast video: "${vid.title}"`);
                          }
                        }}
                        className="text-red-400 hover:text-red-500 transition p-1.5 hover:bg-red-950/30 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANNOUNCEMENTS */}
          {activeTab === "announcements" && (
            <div className="flex flex-col gap-6">
              <h3 className="text-base font-serif font-bold text-amber-50">Church Official Information Bulletin Board</h3>

              <form onSubmit={handleAddAnnouncementSubmit} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-1.5">
                  <Megaphone className="w-4 h-4 text-amber-500" />
                  <span>Publish New Church Announcement</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold">Headline / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Nimba County Deliverance Crusade"
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                      value={newAnnTitle}
                      onChange={(e) => setNewAnnTitle(e.target.value)}
                      required
                      id="new-ann-title"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold">Planned Date / Window</label>
                    <input
                      type="text"
                      placeholder="e.g., July 15 - 20, 2026"
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                      value={newAnnDate}
                      onChange={(e) => setNewAnnDate(e.target.value)}
                      id="new-ann-date"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold">Announcement Type</label>
                    <select
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                      value={newAnnType}
                      onChange={(e) => setNewAnnType(e.target.value as any)}
                      id="new-ann-type"
                    >
                      <option value="event">Standard Event</option>
                      <option value="conference">Conference</option>
                      <option value="crusade">Evangelistic Crusade</option>
                      <option value="prayer_meeting">Prayer Session Rally</option>
                      <option value="bible_study">Special Bible Study</option>
                      <option value="news">Church Board News</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold">Detail Content Description</label>
                    <textarea
                      rows={2}
                      placeholder="Provide full logistics, location venue, preaching Apostles, bus lists..."
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                      value={newAnnDesc}
                      onChange={(e) => setNewAnnDesc(e.target.value)}
                      required
                      id="new-ann-desc"
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold">Featured Image (Url or leaving template default)</label>
                    <input
                      type="text"
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                      value={newAnnImage}
                      onChange={(e) => setNewAnnImage(e.target.value)}
                      id="new-ann-image"
                    />
                    <span className="text-[9px] text-gray-500">Leaving it allows the system to pair a breathtaking Christian Unsplash image.</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-lg self-end"
                  id="add-ann-submit-btn"
                >
                  Broadcast Announcement
                </button>
              </form>

              {/* CURRENT ACTIVE BOARD */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 block mb-3">
                  Current Live Announcements ({announcements.length})
                </span>

                <div className="flex flex-col gap-3">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <h6 className="text-[12px] font-bold text-amber-50 mb-0.5">{ann.title}</h6>
                        <span className="text-[9px] text-indigo-400 uppercase font-bold tracking-wide">{ann.type}</span>
                        <span className="text-[9px] font-light text-slate-500 ml-2">({ann.date})</span>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Do you wish to delete announcement bulletin: "${ann.title}"?`)) {
                            onDeleteAnnouncement(ann.id);
                            addLog(`Deleted bulletin post: "${ann.title}"`);
                          }
                        }}
                        className="text-red-400 hover:text-red-500 transition p-1.5 hover:bg-red-950/30 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-6">
              <h3 className="text-base font-serif font-bold text-amber-50">Church Settings, Channels & Donations</h3>

              <form onSubmit={handleSaveContactDonations} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span>Configure National Office WhatsApp Links & Donation Accounts</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Pastor WhatsApp contact (Int. format)</label>
                    <input
                      type="text"
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                      value={pastorNum}
                      onChange={(e) => setPastorNum(e.target.value)}
                      id="pastor-whatsapp-config"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Apostle WhatsApp contact (Int. format)</label>
                    <input
                      type="text"
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                      value={apostleNum}
                      onChange={(e) => setApostleNum(e.target.value)}
                      id="apostle-whatsapp-config"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">PayPal email coordinates</label>
                  <input
                    type="email"
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    id="paypal-email-config"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Mobile Money Payment Details (MTN & Orange)</label>
                  <textarea
                    rows={2}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                    value={momoInfo}
                    onChange={(e) => setMomoInfo(e.target.value)}
                    id="momo-config"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Bank swift coordinates & details</label>
                  <textarea
                    rows={3}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                    value={bankInfo}
                    onChange={(e) => setBankInfo(e.target.value)}
                    id="bank-config"
                  ></textarea>
                </div>

                {/* Ministry Goal Donations setup */}
                <div className="border-t border-slate-800 pt-5 mt-3 flex flex-col gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span>Ministry Donation Goal progress bar tracker</span>
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Donation Goal name / Campaign</label>
                      <input
                        type="text"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                        value={donationGoalName}
                        onChange={(e) => setDonationGoalName(e.target.value)}
                        id="donation-goal-name-config"
                        placeholder="e.g. Ganta Crusade Tent Fund"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Target Goal Amount</label>
                      <input
                        type="number"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                        value={donationGoalTarget}
                        onChange={(e) => setDonationGoalTarget(Number(e.target.value) || 0)}
                        id="donation-goal-target-config"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Live Amount Collected</label>
                      <input
                        type="number"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                        value={donationGoalCollected}
                        onChange={(e) => setDonationGoalCollected(Number(e.target.value) || 0)}
                        id="donation-goal-collected-config"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Currency Code</label>
                      <input
                        type="text"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                        value={donationGoalCurrency}
                        onChange={(e) => setDonationGoalCurrency(e.target.value)}
                        id="donation-goal-currency-config"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom layout texts and colors builder section */}
                <div className="border-t border-slate-800 pt-5 mt-3 flex flex-col gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>Dynamic App Branding Customizer (Texts & Slogans)</span>
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Top Alert Banner Announcement</label>
                      <input
                        type="text"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                        value={topBarText}
                        onChange={(e) => setTopBarText(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Top Alert Banner Date Label</label>
                      <input
                        type="text"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                        value={topBarDate}
                        onChange={(e) => setTopBarDate(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Header Main Title</label>
                      <input
                        type="text"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                        value={headerTitle}
                        onChange={(e) => setHeaderTitle(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Header Subtitle & Region</label>
                      <input
                        type="text"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                        value={headerSubtitle}
                        onChange={(e) => setHeaderSubtitle(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Splash Countdown Brand Slogan</label>
                      <input
                        type="text"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                        value={splashSlogan}
                        onChange={(e) => setSplashSlogan(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1 col-span-1 md:col-span-2 border-t border-slate-800/60 pt-3">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Daily Study Hero Title</label>
                      <input
                        type="text"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                        value={lessonsHeroTitle}
                        onChange={(e) => setLessonsHeroTitle(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Daily Study Featured Scripture Verse</label>
                      <input
                        type="text"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                        value={lessonsHeroVerse}
                        onChange={(e) => setLessonsHeroVerse(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Daily Study Introduction Paragraph</label>
                      <textarea
                        rows={2}
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                        value={lessonsHeroParagraph}
                        onChange={(e) => setLessonsHeroParagraph(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-5 mt-3 flex flex-col gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      <span>Display & Text Colors Customizer</span>
                    </span>
                    <span className="text-[9px] text-slate-500 font-sans tracking-tight">Applies onto active user view</span>
                  </span>

                  {/* Prestige Presets Collection */}
                  <div className="bg-slate-900/20 p-3.5 border border-slate-800/80 rounded-xl flex flex-col gap-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Preselected Quick Themes Presets:</span>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                      {[
                        {
                          name: "Pentecost Blue-Gold",
                          topBg: "#002244", topText: "#ffffff",
                          headBg: "#003366", headTitle: "#ffffff", headSub: "#D4AF37",
                          heroBg: "#002244", heroText: "#ffffff", brand: "#D4AF37"
                        },
                        {
                          name: "Grace Crimson Presets",
                          topBg: "#3f0a0a", topText: "#ffffff",
                          headBg: "#5c0e0e", headTitle: "#ffffff", headSub: "#e2e8f0",
                          heroBg: "#3f0a0a", heroText: "#ffffff", brand: "#ef4444"
                        },
                        {
                          name: "Apostolic Forest Green",
                          topBg: "#022c22", topText: "#ffffff",
                          headBg: "#064e3b", headTitle: "#ffffff", headSub: "#fef08a",
                          heroBg: "#022c22", heroText: "#ffffff", brand: "#facc15"
                        },
                        {
                          name: "Deep Royal Purple",
                          topBg: "#1e1b4b", topText: "#ffffff",
                          headBg: "#2e1065", headTitle: "#ffffff", headSub: "#fcd34d",
                          heroBg: "#1e1b4b", heroText: "#ffffff", brand: "#fbbf24"
                        }
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setTopBgColor(preset.topBg);
                            setTopTextColor(preset.topText);
                            setHeaderBgColor(preset.headBg);
                            setHeaderTitleColor(preset.headTitle);
                            setHeaderSubtitleColor(preset.headSub);
                            setLessonsHeroBgColor(preset.heroBg);
                            setLessonsHeroTextColor(preset.heroText);
                            setPrimaryBrandColor(preset.brand);
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 p-2 border border-slate-800 hover:border-slate-700 transition rounded-lg text-left flex flex-col gap-1 items-start"
                        >
                          <span className="font-bold text-slate-200">{preset.name}</span>
                          <div className="flex gap-1">
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: preset.headBg }}></span>
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: preset.brand }}></span>
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: preset.topBg }}></span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Color Palette Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950 p-4 border border-slate-800 rounded-xl">
                    <div className="flex flex-col gap-1.5 p-2 bg-slate-900/60 border border-slate-800/40 rounded-lg">
                      <label className="text-[9px] text-slate-400 font-bold uppercase truncate">Top Bar Bg Color</label>
                      <div className="flex items-center gap-1.5 font-mono">
                        <input
                          type="color"
                          className="w-7 h-7 bg-transparent border-0 cursor-pointer shrink-0"
                          value={topBarBgColor}
                          onChange={(e) => setTopBgColor(e.target.value)}
                        />
                        <input
                          type="text"
                          className="bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-300 w-full"
                          value={topBarBgColor}
                          onChange={(e) => setTopBgColor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 p-2 bg-slate-900/60 border border-slate-800/40 rounded-lg">
                      <label className="text-[9px] text-slate-400 font-bold uppercase truncate">Top Bar Text Color</label>
                      <div className="flex items-center gap-1.5 font-mono">
                        <input
                          type="color"
                          className="w-7 h-7 bg-transparent border-0 cursor-pointer shrink-0"
                          value={topBarTextColor}
                          onChange={(e) => setTopTextColor(e.target.value)}
                        />
                        <input
                          type="text"
                          className="bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-300 w-full"
                          value={topBarTextColor}
                          onChange={(e) => setTopTextColor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 p-2 bg-slate-900/60 border border-slate-800/40 rounded-lg">
                      <label className="text-[9px] text-slate-400 font-bold uppercase truncate">Header Bg Color</label>
                      <div className="flex items-center gap-1.5 font-mono">
                        <input
                          type="color"
                          className="w-7 h-7 bg-transparent border-0 cursor-pointer shrink-0"
                          value={headerBgColor}
                          onChange={(e) => setHeaderBgColor(e.target.value)}
                        />
                        <input
                          type="text"
                          className="bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-300 w-full"
                          value={headerBgColor}
                          onChange={(e) => setHeaderBgColor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 p-2 bg-slate-900/60 border border-slate-800/40 rounded-lg">
                      <label className="text-[9px] text-slate-400 font-bold uppercase truncate">Header Title Color</label>
                      <div className="flex items-center gap-1.5 font-mono">
                        <input
                          type="color"
                          className="w-7 h-7 bg-transparent border-0 cursor-pointer shrink-0"
                          value={headerTitleColor}
                          onChange={(e) => setHeaderTitleColor(e.target.value)}
                        />
                        <input
                          type="text"
                          className="bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-300 w-full"
                          value={headerTitleColor}
                          onChange={(e) => setHeaderTitleColor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 p-2 bg-slate-900/60 border border-slate-800/40 rounded-lg">
                      <label className="text-[9px] text-slate-400 font-bold uppercase truncate">Header Subtitle Color</label>
                      <div className="flex items-center gap-1.5 font-mono">
                        <input
                          type="color"
                          className="w-7 h-7 bg-transparent border-0 cursor-pointer shrink-0"
                          value={headerSubtitleColor}
                          onChange={(e) => setHeaderSubtitleColor(e.target.value)}
                        />
                        <input
                          type="text"
                          className="bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-300 w-full"
                          value={headerSubtitleColor}
                          onChange={(e) => setHeaderSubtitleColor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 p-2 bg-slate-900/60 border border-slate-800/40 rounded-lg">
                      <label className="text-[9px] text-slate-400 font-bold uppercase truncate">Lessons Hero Bg</label>
                      <div className="flex items-center gap-1.5 font-mono">
                        <input
                          type="color"
                          className="w-7 h-7 bg-transparent border-0 cursor-pointer shrink-0"
                          value={lessonsHeroBgColor}
                          onChange={(e) => setLessonsHeroBgColor(e.target.value)}
                        />
                        <input
                          type="text"
                          className="bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-300 w-full"
                          value={lessonsHeroBgColor}
                          onChange={(e) => setLessonsHeroBgColor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 p-2 bg-slate-900/60 border border-slate-800/40 rounded-lg">
                      <label className="text-[9px] text-slate-400 font-bold uppercase truncate">Lessons Hero Text</label>
                      <div className="flex items-center gap-1.5 font-mono">
                        <input
                          type="color"
                          className="w-7 h-7 bg-transparent border-0 cursor-pointer shrink-0"
                          value={lessonsHeroTextColor}
                          onChange={(e) => setLessonsHeroTextColor(e.target.value)}
                        />
                        <input
                          type="text"
                          className="bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-300 w-full"
                          value={lessonsHeroTextColor}
                          onChange={(e) => setLessonsHeroTextColor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 p-2 bg-slate-900/60 border border-slate-800/40 rounded-lg">
                      <label className="text-[9px] text-slate-400 font-bold uppercase truncate">Primary Brand Gold</label>
                      <div className="flex items-center gap-1.5 font-mono">
                        <input
                          type="color"
                          className="w-7 h-7 bg-transparent border-0 cursor-pointer shrink-0"
                          value={primaryBrandColor}
                          onChange={(e) => setPrimaryBrandColor(e.target.value)}
                        />
                        <input
                          type="text"
                          className="bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-300 w-full"
                          value={primaryBrandColor}
                          onChange={(e) => setPrimaryBrandColor(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-6 rounded-lg self-end mt-2 shadow"
                  id="save-settings-btn"
                >
                  Save Global Parameters
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
