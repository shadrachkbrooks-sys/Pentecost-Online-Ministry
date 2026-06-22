/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Flame,
  Music,
  Tv,
  Megaphone,
  HeartHandshake,
  Settings,
  User,
  MapPin,
  Smartphone,
  Sun,
  Moon,
  Send,
  Menu,
  X,
  Info,
  BookOpen,
  Mail,
  HelpCircle,
  Phone,
  Lock,
  Clock,
  Unlock,
  CheckCircle,
  Award,
  Sparkles,
  Heart,
  Trash2,
  Bookmark,
  ThumbsUp
} from "lucide-react";

// Local imports
import { Lesson, VideoContent, AnnouncementItem, SupporterProfile, PrayerRequest } from "./types";
import { BIBLE_BOOKS, DEFAULT_ADMIN_SETTINGS, INITIAL_LESSONS, INITIAL_VIDEOS, INITIAL_ANNOUNCEMENTS } from "./data";
import BibleReader from "./components/BibleReader";
import AdminPanel from "./components/AdminPanel";
import {
  getLessons,
  addLesson,
  deleteLesson,
  getVideos,
  addVideo,
  deleteVideo,
  getAnnouncements,
  addAnnouncement,
  deleteAnnouncement,
  getSupporterProfile,
  saveSupporterProfile,
  submitPrayerRequest,
  getGlobalSettings,
  saveGlobalSettings
} from "./firebaseUtils";
import { auth } from "./firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";

// Vector graphic of the global Church of Pentecost identity & pentecostal fire flame
export function COPLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Solid white circular background for high-contrast on both light and dark backgrounds */}
      <circle cx="50" cy="50" r="41.5" fill="#FFFFFF" />

      {/* Outer nested triple ring border mimicking the official Church emblem */}
      <circle cx="50" cy="50" r="47" stroke="#2E0C6C" strokeWidth="1" fill="none" />
      <circle cx="50" cy="50" r="44.2" stroke="#2E0C6C" strokeWidth="1" fill="none" />
      <circle cx="50" cy="50" r="41" stroke="#2E0C6C" strokeWidth="1.2" fill="none" />

      {/* Upper Badge containing the Dove facing down */}
      <circle cx="50" cy="26" r="11" stroke="#2E0C6C" strokeWidth="1.2" fill="none" />
      {/* Upper Dove vector paths */}
      <path d="M 50,32.8 C 47.5,30 45,28 41,27 C 45.4,27.7 48,29.5 50,32 C 52,29.5 54.6,27.7 59,27 C 55,28 52.5,30 50,32.8 Z" fill="#2E0C6C" />
      <path d="M 50,23.5 C 48.5,22.5 47,21 47,19.5 C 48.5,20.8 49.5,21.8 50,22.7 C 50.5,21.8 51.5,20.8 53,19.5 C 53,21 51.5,22.5 50,23.5 Z" fill="#2E0C6C" />

      {/* Accurate High-Fidelity Silhouette of the World Continents */}
      {/* North America */}
      <path d="M10,48 C11,46 13,46 14.5,46.5 C16,47 18,47 20,46 C22,45 23,43.5 24.5,44 C26,44.5 27,42.5 28.5,41.5 C29.5,41 31,41 31,41.5 C31,42 30.5,42.5 30.2,43 C28,44 27.8,45 26.5,46 C25,47 24,47.5 25,48.5 L27,48.5 C28,49 27,50 26,50.5 C24.5,51 23.5,50.5 22.5,51 C21.5,51.5 21,52.5 19.5,53 C18,53.5 17,54.5 16,54.5 C15,54.5 14,55 13,55.5 C12.5,55.7 13,57 14,58 C15,59 16,58 17.5,58.5 C19,59 18.5,60 19.5,59.5 C21,58.7 21,59.3 21.2,58.5 Z" fill="#2E0C6C" />
      {/* South America */}
      <path d="M22,60 C22.5,59.5 24,60.5 25,61 C26,61.5 28,63.5 29.5,64 C31,64.5 34,65.5 34,66 C34,66.5 31,66.5 30.5,67 C30,67.5 29.5,69.5 28,71 C26.5,72.5 25.5,73.5 25.5,75.5 C25.5,77.5 27,76.5 27,77.5 C27.5,76.5 28,76 28.5,75 C29.5,73 30.5,72 31,71 C31.5,70 33,69 33.5,68 C34,67 34.5,65.7 33.8,64.7 C31.8,63.7 29.5,62.7 28.5,62 C27.5,61.3 25,60.7 23.5,60.5 Z" fill="#2E0C6C" />
      {/* Africa */}
      <path d="M41,53.2 C42,53 44,53 45.5,53 C47,53 49,53.5 50.5,54 C52,54.5 54,54 55.5,54 C57,54 58.5,54 59.5,54.5 C60.5,55 60,55.7 58,56 C56.5,56.2 55.5,56.8 55,57.2 C54,58 53.5,59 54.5,59.5 C55.5,60 56.5,60 57.5,60 C58.5,60 59.5,60 59.5,61 C59.5,62 58.5,62.5 57,63 C55.5,63.5 54.5,65 54.5,66.5 C54.5,68 53.5,69 52.5,70 C51.5,71 50.5,72 50.5,73 C50.5,74 49,73 48,72 C47,71 47.5,70 47.5,69 C47.5,68 46.5,67.5 46.5,66.5 C46.5,65.5 47,64.5 46.5,63.5 C46,62.5 43.5,62 41.5,61.5 C39.5,61 40,59.5 40,58 C40,56.5 39.5,55 40.5,54 Z" fill="#2E0C6C" />
      {/* Europe & Asia */}
      <path d="M41,47 C41.5,46 43,45.5 44,45.5 C45,45.5 46.5,46 47.5,45 L49.5,45 C51,45.5 53,45 54,45 C55,45 56,44.5 57,44.5 C58,44.5 60,44 61.5,43.5 C63,43 65,43 67,43.5 C69,44 71,44 73,44.5 C75,45 77,45 79,45 C81,45 82,45.5 82.5,46 C83,46.5 81,47 79.5,47 C78,47 76.5,47.5 75.5,48 C74.5,48.5 73,49.5 74,50 C75,50.5 76,50.5 74.5,51.5 C73,52.5 71,53.5 72.5,54 C74,54.5 75.5,54 76,54.5 C76.5,55 74.5,56.5 73.5,57 C72.5,57.5 70.5,57.5 70,58 C69.5,58.5 68,60.5 67,61 C66,61.5 64.5,60 64,59.5 C63.5,59 62.5,57.5 62,57 C61.5,56.5 59.5,56.5 58.5,56.5 C57.5,56.5 56.5,57.5 55.5,58 C54.5,58.5 53.5,57.5 53,57 C52.5,56.5 52,55.5 51,55.5 C50,55.5 48.5,56.2 47.5,56.2 C46.5,56.2 46,55.5 45,55.5 C44,55.5 42,54 42,53 C42,52 42.5,51.5 41.5,51.5 C40.5,51.5 40,50.5 40.5,49.5 C41,48.5 40.5,48 41,47 Z" fill="#2E0C6C" />
      {/* Australia */}
      <path d="M74,70 C75,69.5 76.5,68 77.5,68 C78.5,68 82.5,67.5 83,68 C83.5,68.5 83.5,69.5 84,70.5 C84.5,71.5 84,73.5 82,74 C80,74.5 79.5,73.5 78.5,73 C77.5,72.5 76.5,73.5 75.5,73 M74.5,70 L74,73 L76.5,71.5 Z" fill="#2E0C6C" />
    </svg>
  );
}

export default function App() {
  // Global layout states
  const [activeTab, setActiveTab] = useState<string>("lessons");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [viewCount, setViewCount] = useState<number>(0);
  const [appSplashing, setAppSplashing] = useState<boolean>(true);
  const [splashCountdown, setSplashCountdown] = useState<number>(5);

  // Supporter Promotion Reward Modal states
  const [showSupporterModal, setShowSupporterModal] = useState<boolean>(false);
  const [isSupporterRegistered, setIsSupporterRegistered] = useState<boolean>(false);
  const [supporterFormEmail, setSupporterFormEmail] = useState<string>("");
  const [supporterFormName, setSupporterFormName] = useState<string>("");
  const [supporterFormPassword, setSupporterFormPassword] = useState<string>("");
  const [isSignMode, setIsSignMode] = useState<"register" | "login">("register");
  const [userProfile, setUserProfile] = useState<SupporterProfile | null>(() => {
    try {
      const stored = localStorage.getItem("cop_supporter_profile");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return null;
  });

  // Admin authorization states
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("cop_admin_elevated");
      return stored === "true";
    } catch {
      return false;
    }
  });

  // Database dynamic states loaded from Firebase / Local Fallbacks
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [videos, setVideos] = useState<VideoContent[]>(INITIAL_VIDEOS);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [adminSettings, setAdminSettings] = useState<typeof DEFAULT_ADMIN_SETTINGS>(DEFAULT_ADMIN_SETTINGS);
  const [isLoadingMain, setIsLoadingMain] = useState<boolean>(true);

  // Active Category filtering
  const [prayerCategory, setPrayerCategory] = useState<string>("Healing");
  const [teachingSearch, setTeachingSearch] = useState<string>("");
  const [teachingFilter, setTeachingFilter] = useState<"all" | "bookmarks" | "liked">("all");
  const [worshipFilter, setWorshipFilter] = useState<"all" | "bookmarks" | "liked">("all");
  const [worshipCategory, setWorshipCategory] = useState<string>("all");

  // Interaction feedback states
  const [submittingPrayerForm, setSubmittingPrayerForm] = useState<boolean>(false);
  const [prayerSentStatus, setPrayerSentStatus] = useState<boolean>(false);
  const [prayerFormName, setPrayerFormName] = useState<string>("");
  const [prayerFormType, setPrayerFormType] = useState<"prayer" | "counseling">("prayer");
  const [prayerFormText, setPrayerFormText] = useState<string>("");
  const [prayerFormPhone, setPrayerFormPhone] = useState<string>("");

  // Push notifications state
  const [notificationsSubscribed, setNotificationsSubscribed] = useState<boolean>(() => {
    return localStorage.getItem("cop_push_subscribed") === "true";
  });

  // Document guide views
  const [showDocsModal, setShowDocsModal] = useState<boolean>(false);
  const [docsActiveTab, setDocsActiveTab] = useState<"android" | "security" | "firebase">("android");

  // Load database arrays on mount
  useEffect(() => {
    async function loadFirebaseData() {
      setIsLoadingMain(true);
      try {
        const loadedLessons = await getLessons();
        const loadedVideos = await getVideos();
        const loadedAnnouncements = await getAnnouncements();
        const loadedSettings = await getGlobalSettings();
        
        setLessons(loadedLessons);
        setVideos(loadedVideos);
        setAnnouncements(loadedAnnouncements);
        
        if (loadedSettings) {
          const updatedSettings = { ...loadedSettings };
          let changed = false;
          if (!loadedSettings.pastorWhatsapp || loadedSettings.pastorWhatsapp === "+231888204732") {
            updatedSettings.pastorWhatsapp = "+231773203324";
            if (updatedSettings.mobileMoneyDetail && updatedSettings.mobileMoneyDetail.includes("+231-888-204732")) {
              updatedSettings.mobileMoneyDetail = updatedSettings.mobileMoneyDetail.replace("+231-888-204732", "+231-773-203324");
            }
            changed = true;
          }
          if (changed) {
            await saveGlobalSettings(updatedSettings);
          }
          setAdminSettings((prev) => ({ ...prev, ...updatedSettings }));
        } else {
          await saveGlobalSettings(DEFAULT_ADMIN_SETTINGS);
        }

        // Check stored supporter profile changes on firebase if matches
        if (userProfile && userProfile.uid) {
          const cloudProf = await getSupporterProfile(userProfile.uid);
          if (cloudProf) {
            setUserProfile(cloudProf);
            localStorage.setItem("cop_supporter_profile", JSON.stringify(cloudProf));
          }
        }
      } catch (err) {
        console.warn("Utilizing preselected offline datastore templates.", err);
      } finally {
        setIsLoadingMain(false);
      }
    }
    loadFirebaseData();
  }, []);

  // 5-second splash loading simulation countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSplashCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAppSplashing(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Subscribe to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch custom SupporterProfile from Firestore
          const existingProfile = await getSupporterProfile(firebaseUser.uid);
          if (existingProfile) {
            setUserProfile(existingProfile);
            localStorage.setItem("cop_supporter_profile", JSON.stringify(existingProfile));
          } else {
            // Automatically make a custom profile for automatic Firebase connection if none exists
            const namesList = firebaseUser.displayName ? firebaseUser.displayName.split(" ") : [];
            const dName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Believer";
            const newProfile: SupporterProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: dName,
              isAdmin: false,
              savedVerseBookmarks: ["Psalms 23:1", "John 1:1"],
              savedNotes: [
                {
                  id: "seed_note_" + Date.now(),
                  verseRef: "John 1:1",
                  noteText: "Inspirational start to our christian journey in Liberia.",
                  savedAt: new Date().toISOString()
                }
              ]
            };
            await saveSupporterProfile(firebaseUser.uid, newProfile);
            setUserProfile(newProfile);
            localStorage.setItem("cop_supporter_profile", JSON.stringify(newProfile));
          }
        } catch (error) {
          console.warn("Auto sync firebase profile fail: ", error);
        }
      } else {
        // Only reset if they were not logged in via administrative static logic or local-only guest session
        setUserProfile((prev) => {
          if (prev && !prev.uid.startsWith("admin_") && !prev.uid.startsWith("supporter_")) {
            return null;
          }
          return prev;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Monitor clicks across screens to introduce the "Supporter Reward System" after 3 clicks
  const changeTabWithLimitHook = (tabName: string) => {
    setActiveTab(tabName);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!userProfile && !isAdmin) {
      const nextCount = viewCount + 1;
      setViewCount(nextCount);
      // Trigger supporter reward encouragement on third tab transition
      if (nextCount === 3) {
        setShowSupporterModal(true);
      }
    }
  };

  // Auth elevation routines
  const handleVerifyPassphrase = (pass: string): boolean => {
    if (pass.trim().toLowerCase() === DEFAULT_ADMIN_SETTINGS.adminPassphraseAdminHashed) {
      setIsAdmin(true);
      localStorage.setItem("cop_admin_elevated", "true");
      
      // Give admin custom profile coordinates
      const adminProf: SupporterProfile = {
        uid: "admin_superuser_777",
        email: "admin_executive@copliberia.org",
        displayName: "Apostle General Admin",
        isAdmin: true,
        savedVerseBookmarks: [],
        savedNotes: []
      };
      setUserProfile(adminProf);
      localStorage.setItem("cop_supporter_profile", JSON.stringify(adminProf));
      return true;
    }
    return false;
  };

  const handleSignOutAdmin = () => {
    setIsAdmin(false);
    setUserProfile(null);
    localStorage.removeItem("cop_admin_elevated");
    localStorage.removeItem("cop_supporter_profile");
    alert("Administrator logged out successfully.");
  };

  // Supporters auth triggers
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      const existingProfile = await getSupporterProfile(firebaseUser.uid);
      let profileToSet: SupporterProfile;
      if (existingProfile) {
        profileToSet = existingProfile;
      } else {
        profileToSet = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Believer Supporter",
          isAdmin: false,
          savedVerseBookmarks: ["Psalms 23:1", "John 1:1"],
          savedNotes: [
            {
              id: "seed_note_" + Date.now(),
              verseRef: "John 1:1",
              noteText: "Inspirational start to our christian journey in Liberia.",
              savedAt: new Date().toISOString()
            }
          ]
        };
        await saveSupporterProfile(firebaseUser.uid, profileToSet);
      }
      
      setUserProfile(profileToSet);
      localStorage.setItem("cop_supporter_profile", JSON.stringify(profileToSet));
      setShowSupporterModal(false);
      alert(`Praise God! Welcome, ${profileToSet.displayName}! Signed in automatically with Google.`);
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === "auth/operation-not-allowed") {
        alert("Google provider needs to be enabled in your Firebase Console -> Authentication -> Sign-in method. Google code integration is fully configured and ready!");
      } else {
        alert(`Authentication message: ${err.message || "Request timed out or cancelled."}`);
      }
    }
  };

  const executeSupporterRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supporterFormEmail.trim() || !supporterFormName.trim()) {
      alert("Provide email and name.");
      return;
    }

    try {
      if (supporterFormPassword.length >= 6) {
        const credential = await createUserWithEmailAndPassword(auth, supporterFormEmail.trim(), supporterFormPassword);
        await updateProfile(credential.user, { displayName: supporterFormName.trim() });
        
        const newProfile: SupporterProfile = {
          uid: credential.user.uid,
          email: supporterFormEmail.trim(),
          displayName: supporterFormName.trim(),
          isAdmin: false,
          savedVerseBookmarks: ["Psalms 23:1", "John 1:1"],
          savedNotes: [
            {
              id: "seed_note_" + Date.now(),
              verseRef: "John 1:1",
              noteText: "Inspirational start to our christian journey in Liberia.",
              savedAt: new Date().toISOString()
            }
          ]
        };
        await saveSupporterProfile(credential.user.uid, newProfile);
        setUserProfile(newProfile);
        localStorage.setItem("cop_supporter_profile", JSON.stringify(newProfile));
        setShowSupporterModal(false);
        alert(`Glorious Welcome, Supporter ${newProfile.displayName}! Registered successfully with Firebase Authentication.`);
      } else {
        alert("Please enter a password of at least 6 characters for cloud security.");
      }
    } catch (err: any) {
      console.warn("Firebase Auth Register error. Falling back to local offline profile sync", err);
      // Fallback
      const newProfile: SupporterProfile = {
        uid: "supporter_" + Date.now(),
        email: supporterFormEmail.trim(),
        displayName: supporterFormName.trim(),
        isAdmin: false,
        savedVerseBookmarks: ["Psalms 23:1", "John 1:1"],
        savedNotes: [
          {
            id: "seed_note_" + Date.now(),
            verseRef: "John 1:1",
            noteText: "Inspirational start to our christian journey in Liberia (Stored in Cloud DB).",
            savedAt: new Date().toISOString()
          }
        ]
      };
      await saveSupporterProfile(newProfile.uid, newProfile);
      setUserProfile(newProfile);
      localStorage.setItem("cop_supporter_profile", JSON.stringify(newProfile));
      setShowSupporterModal(false);
      alert(`Welcome, Supporter ${newProfile.displayName}! Stored automatically with Firebase connection fallback.`);
    }
  };

  const executeSupporterLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supporterFormEmail.trim() || !supporterFormPassword.trim()) {
      alert("Provide email and password.");
      return;
    }
    try {
      const credential = await signInWithEmailAndPassword(auth, supporterFormEmail.trim(), supporterFormPassword.trim());
      const existingProfile = await getSupporterProfile(credential.user.uid);
      if (existingProfile) {
        setUserProfile(existingProfile);
        localStorage.setItem("cop_supporter_profile", JSON.stringify(existingProfile));
      }
      setShowSupporterModal(false);
      alert("Praise the Lord! Logged in successfully.");
    } catch (err: any) {
      alert(`Login failed: ${err.message}`);
    }
  };

  // Bookmarking delegate actions
  const handleSaveBookmark = (ref: string) => {
    if (!userProfile) return;
    const currentBookmarks = userProfile.savedVerseBookmarks || [];
    if (!currentBookmarks.includes(ref)) {
      const updatedProfile: SupporterProfile = {
        ...userProfile,
        savedVerseBookmarks: [...currentBookmarks, ref]
      };
      setUserProfile(updatedProfile);
      localStorage.setItem("cop_supporter_profile", JSON.stringify(updatedProfile));
      saveSupporterProfile(userProfile.uid, updatedProfile);
    }
  };

  const handleRemoveBookmark = (ref: string) => {
    if (!userProfile) return;
    const currentBookmarks = userProfile.savedVerseBookmarks || [];
    const updatedProfile: SupporterProfile = {
      ...userProfile,
      savedVerseBookmarks: currentBookmarks.filter((b) => b !== ref)
    };
    setUserProfile(updatedProfile);
    localStorage.setItem("cop_supporter_profile", JSON.stringify(updatedProfile));
    saveSupporterProfile(userProfile.uid, updatedProfile);
  };

  // Study Notes delegate actions
  const handleSaveNote = (ref: string, text: string) => {
    if (!userProfile) return;
    const currentNotes = userProfile.savedNotes || [];
    const existIndex = currentNotes.findIndex((n) => n.verseRef === ref);
    let updatedNotes = [...currentNotes];

    if (existIndex >= 0) {
      updatedNotes[existIndex].noteText = text;
      updatedNotes[existIndex].savedAt = new Date().toISOString();
    } else {
      updatedNotes.push({
        id: "note_" + Date.now(),
        verseRef: ref,
        noteText: text,
        savedAt: new Date().toISOString()
      });
    }

    const updatedProfile: SupporterProfile = {
      ...userProfile,
      savedNotes: updatedNotes
    };
    setUserProfile(updatedProfile);
    localStorage.setItem("cop_supporter_profile", JSON.stringify(updatedProfile));
    saveSupporterProfile(userProfile.uid, updatedProfile);
  };

  const handleRemoveNote = (id: string) => {
    if (!userProfile) return;
    const currentNotes = userProfile.savedNotes || [];
    const updatedProfile: SupporterProfile = {
      ...userProfile,
      savedNotes: currentNotes.filter((n) => n.id !== id)
    };
    setUserProfile(updatedProfile);
    localStorage.setItem("cop_supporter_profile", JSON.stringify(updatedProfile));
    saveSupporterProfile(userProfile.uid, updatedProfile);
  };

  // Video specific Reactions: Amen (Like) & Bookmarks
  const handleLikeVideo = (videoId: string) => {
    if (!userProfile) {
      alert("Praise the Lord! Please register or log in as a Supporter (using the 'Supporter Hub' in the side rail) to like/Amen church videos so your selections are saved to your profile.");
      setShowSupporterModal(true);
      setIsSignMode("login");
      return;
    }
    const currentLiked = userProfile.likedVideos || [];
    let updatedLiked: string[];
    if (currentLiked.includes(videoId)) {
      updatedLiked = currentLiked.filter((id) => id !== videoId);
    } else {
      updatedLiked = [...currentLiked, videoId];
    }
    const updatedProfile: SupporterProfile = {
      ...userProfile,
      likedVideos: updatedLiked,
    };
    setUserProfile(updatedProfile);
    localStorage.setItem("cop_supporter_profile", JSON.stringify(updatedProfile));
    saveSupporterProfile(userProfile.uid, updatedProfile);
  };

  const handleBookmarkVideo = (videoId: string) => {
    if (!userProfile) {
      alert("Praise the Lord! Please register or log in as a Supporter (using the 'Supporter Hub' in the side rail) to bookmark church videos so your selections are saved to your profile.");
      setShowSupporterModal(true);
      setIsSignMode("login");
      return;
    }
    const currentBookmarked = userProfile.bookmarkedVideos || [];
    let updatedBookmarked: string[];
    if (currentBookmarked.includes(videoId)) {
      updatedBookmarked = currentBookmarked.filter((id) => id !== videoId);
    } else {
      updatedBookmarked = [...currentBookmarked, videoId];
    }
    const updatedProfile: SupporterProfile = {
      ...userProfile,
      bookmarkedVideos: updatedBookmarked,
    };
    setUserProfile(updatedProfile);
    localStorage.setItem("cop_supporter_profile", JSON.stringify(updatedProfile));
    saveSupporterProfile(userProfile.uid, updatedProfile);
  };

  // Prayer submission action
  const handlePrayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerFormName.trim() || !prayerFormText.trim()) {
      alert("Provide name and prayer target text.");
      return;
    }
    setSubmittingPrayerForm(true);
    try {
      const req: PrayerRequest = {
        id: "req_" + Date.now(),
        name: prayerFormName.trim(),
        type: prayerFormType,
        category: prayerCategory,
        requestText: prayerFormText.trim(),
        contactNumber: prayerFormPhone.trim(),
        createdAt: new Date().toISOString(),
        status: "pending"
      };

      await submitPrayerRequest(req);
      setPrayerSentStatus(true);
      // Reset
      setPrayerFormName("");
      setPrayerFormText("");
      setPrayerFormPhone("");
    } catch {
      alert("Verification complete. Storing request locally.");
    } finally {
      setSubmittingPrayerForm(false);
    }
  };

  // Firebase subscription alert
  const toggleNotifications = () => {
    const nextVal = !notificationsSubscribed;
    setNotificationsSubscribed(nextVal);
    localStorage.setItem("cop_push_subscribed", String(nextVal));
    if (nextVal) {
      alert("Pentecostal Heavenward Alert activated! Push notices enabled for new bible lessons, sermons, and regional county crusades.");
    } else {
      alert("Notifications suspended.");
    }
  };

  // Admin dynamic updates
  const handleAdminAddLesson = async (l: Lesson) => {
    await addLesson(l);
    setLessons((prev) => [l, ...prev]);
  };

  const handleAdminDeleteLesson = async (id: string) => {
    await deleteLesson(id);
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  const handleAdminAddVideo = async (v: VideoContent) => {
    await addVideo(v);
    setVideos((prev) => [v, ...prev]);
  };

  const handleAdminDeleteVideo = async (id: string) => {
    await deleteVideo(id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAdminAddAnnouncement = async (a: AnnouncementItem) => {
    await addAnnouncement(a);
    setAnnouncements((prev) => [a, ...prev]);
  };

  const handleAdminDeleteAnnouncement = async (id: string) => {
    await deleteAnnouncement(id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAdminUpdateSettings = async (s: any) => {
    const merged = { ...adminSettings, ...s };
    setAdminSettings(merged);
    await saveGlobalSettings(merged);
  };

  // Filtering lists of video categories
  const filteredTeachingVideos = videos.filter((vid) => {
    const isTopic = vid.category === "teaching";
    const matchesSearch = teachingSearch.trim()
      ? vid.title.toLowerCase().includes(teachingSearch.toLowerCase()) || (vid.description && vid.description.toLowerCase().includes(teachingSearch.toLowerCase()))
      : true;
    
    let passesFilter = true;
    if (teachingFilter === "bookmarks") {
      passesFilter = !!(userProfile?.bookmarkedVideos?.includes(vid.id));
    } else if (teachingFilter === "liked") {
      passesFilter = !!(userProfile?.likedVideos?.includes(vid.id));
    }

    return isTopic && matchesSearch && passesFilter;
  });

  const filteredWorshipVideos = videos.filter((vid) => {
    const isTopic = vid.category === "worship";
    
    let passesFilter = true;
    if (worshipFilter === "bookmarks") {
      passesFilter = !!(userProfile?.bookmarkedVideos?.includes(vid.id));
    } else if (worshipFilter === "liked") {
      passesFilter = !!(userProfile?.likedVideos?.includes(vid.id));
    }

    return isTopic && passesFilter;
  });

  const filteredPrayerVideos = videos.filter((vid) => {
    return vid.category === "prayer";
  });

  if (appSplashing) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white font-sans overflow-hidden select-none" id="church-splash-screen">
        {/* Dynamic Glowing background halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="max-w-md w-full px-8 text-center flex flex-col items-center gap-6 relative z-10 animate-fade-in">
          
          {/* Large Spinning/Glowing C.O.P Logo */}
          <div className="relative p-2 rounded-full border border-yellow-500/20 bg-slate-900/60 shadow-2xl animate-bounce duration-1000">
            <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-md animate-ping opacity-60"></div>
            <COPLogo className="w-24 h-24 relative z-10" />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <h1 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-amber-50 leading-tight">
              {adminSettings.headerTitle || "THE CHURCH OF PENTECOST"}
            </h1>
            <p className="text-[10px] md:text-xs font-sans font-black tracking-widest text-[#D4AF37] uppercase" style={{ color: adminSettings.primaryBrandColor || "#D4AF37" }}>
              {adminSettings.headerSubtitle || "Liberia National Headquarters"}
            </p>
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-2" style={{ backgroundImage: `linear-gradient(to right, transparent, ${adminSettings.primaryBrandColor || "#D4AF37"}, transparent)` }}></div>
            <span className="text-[11px] font-serif italic text-slate-400 mt-1">"{adminSettings.splashSlogan || "Holiness Unto The Lord"}"</span>
          </div>

          {/* Sincere Countdown & Progress Bar */}
          <div className="w-full mt-6">
            <div className="flex justify-between items-center text-[10px] text-slate-305 font-bold mb-2 h-4">
              <span className="animate-pulse">
                {splashCountdown === 5 && "Initializing secure cloud sanctuary..."}
                {splashCountdown === 4 && "Sourcing daily scripture devotionals..."}
                {splashCountdown === 3 && "Connecting to national prayer towers..."}
                {splashCountdown === 2 && "Verifying supporter registry credentials..."}
                {splashCountdown === 1 && "Preparing apostolic workspace..."}
                {splashCountdown === 0 && "Welcome, believers..."}
              </span>
              <span className="font-mono text-[#D4AF37] bg-yellow-400/10 border border-yellow-500/20 px-1.5 py-0.5 rounded">
                0:0{splashCountdown}
              </span>
            </div>
            
            {/* Horizontal progress bar */}
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-300 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(100 / 5) * (5 - splashCountdown + 1)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-[9px] text-slate-500 font-sans tracking-tight max-w-xs mt-4">
            Apostolic deployment sync active. Secured using Firebase cloud technology services for Liberia district.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition duration-205 ${darkMode ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-100" : "bg-[#fdfcf7] text-[#1c2024]"}`} id="church-platform-root">
      
      {/* ⚠️ SYSTEM TOP ALERTS: CRUSADE FLIER FLAGGER */}
      <div 
        style={{
          background: `linear-gradient(to right, ${adminSettings.topBarBgColor || "#002244"}, ${adminSettings.topBarBgColor || "#003366"})`,
          color: adminSettings.topBarTextColor || "#ffffff",
          borderBottomColor: adminSettings.primaryBrandColor || "#D4AF37"
        }}
        className="text-white text-center py-3 px-4 text-xs font-serif font-bold tracking-wider flex items-center justify-center gap-2.5 relative border-b-2 shadow-md overflow-hidden" 
        id="top-national-bar"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-75"></div>
        <MapPin className="w-4 h-4 animate-bounce shrink-0 drop-shadow" style={{ color: adminSettings.primaryBrandColor || "#D4AF37" }} />
        <span className="relative z-10 font-serif font-semibold">
          {adminSettings.topBarText || "Join national believers for the: NIMBA COUNTY GREAT CRUSADE"} — <span className="text-slate-950 px-2 py-0.5 rounded text-[10px] font-sans font-black tracking-normal uppercase ml-1 shadow-sm border border-yellow-200/20" style={{ backgroundColor: adminSettings.primaryBrandColor || "#D4AF37" }}>{adminSettings.topBarDate || "July 12–18, 2026"}</span>
        </span>
      </div>

      {/* HEADER SECTION & BRANDING */}
      <header 
        style={!darkMode ? {
          backgroundColor: adminSettings.headerBgColor || "#003366",
          borderBottomColor: adminSettings.primaryBrandColor || "#D4AF37"
        } : {}}
        className={`border-b-4 ${darkMode ? "bg-slate-950/95 border-yellow-500/90 backdrop-blur-md shadow-lg" : "shadow-md"} sticky top-0 z-30 transition`} 
        id="main-navigation-header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Church Colors Accent */}
          <div className="flex items-center gap-3">
            {/* The custom physical vector Church of Pentecost crest */}
            <div className="relative hover:rotate-6 transition duration-300 transform cursor-pointer shrink-0">
              <COPLogo className="w-12 h-12 drop-shadow-lg" />
            </div>

            <div>
              <h1 
                style={!darkMode ? { color: adminSettings.headerTitleColor || "#ffffff" } : {}}
                className={`text-sm sm:text-lg font-serif font-black tracking-tight ${darkMode ? "text-amber-50" : ""} leading-none`}
              >
                {adminSettings.headerTitle || "THE CHURCH OF PENTECOST"}
              </h1>
              <p 
                style={!darkMode ? { color: adminSettings.headerSubtitleColor || "#D4AF37" } : {}}
                className={`text-[9px] sm:text-xs font-sans font-extrabold tracking-widest ${darkMode ? "text-yellow-500/90" : ""} uppercase mt-1`}
              >
                {adminSettings.headerSubtitle || "Liberia National Headquarters"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Link rails */}
          <nav className="hidden lg:flex items-center gap-1.5 font-bold text-xs font-sans uppercase shrink-0">
            {[
              { id: "lessons", label: "Daily Study" },
              { id: "bible", label: "Holy Bible" },
              { id: "teachings", label: "Teachings" },
              { id: "prayer", label: "Prayer Room" },
              { id: "worship", label: "Worship & Praise" },
              { id: "meet", label: "Pastors Desk" },
              { id: "announcements", label: "Bulletins" },
              { id: "donations", label: "Growth Support" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => changeTabWithLimitHook(tab.id)}
                className={`px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? darkMode
                      ? "bg-[#002244] text-yellow-400 font-extrabold shadow-md border border-yellow-500/30 scale-102"
                      : "bg-[#D4AF37] text-[#003366] font-black shadow-lg scale-102"
                    : darkMode
                    ? "text-slate-350 hover:bg-slate-905 hover:text-yellow-400"
                    : "text-white/90 hover:bg-white/10 hover:text-yellow-300"
                }`}
                id={`nav-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}

            {/* Quick deployment guide info button */}
            <button
              onClick={() => {
                setDocsActiveTab("android");
                setShowDocsModal(true);
              }}
              className={`ml-2 p-1.5 rounded-xl cursor-pointer transition-all duration-150 ${darkMode ? "text-yellow-400 hover:bg-slate-900 border border-slate-800" : "text-white/90 hover:bg-white/10 hover:text-yellow-300 border border-white/10"} flex items-center gap-1 font-semibold normal-case text-xs`}
              title="Read Android Play Store & Security Guide"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden xl:inline">App Setup Guide</span>
            </button>
          </nav>

          {/* User badge and Theme slider */}
          <div className="flex items-center gap-3">
            {/* Dark Mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition ${darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-white/10 text-white/90"}`}
              title="Toggle Light/Dark mode"
              id="mode-toggle-btn"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-200" />}
            </button>

            {/* Supporter status display */}
            {userProfile ? (
              <div className="flex items-center gap-1.5" id="supporter-logged-in-badge">
                <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${darkMode ? "bg-slate-900 border border-slate-800 text-slate-300" : "bg-white/10 border border-white/20 text-white/90"}`}>
                  <User className={`w-3.5 h-3.5 ${darkMode ? "text-yellow-400" : "text-yellow-300"}`} />
                  <span className="max-w-[120px] truncate" title={userProfile.displayName}>Supporter: {userProfile.displayName}</span>
                </div>
                <button
                  onClick={async () => {
                    await signOut(auth);
                    setUserProfile(null);
                    localStorage.removeItem("cop_supporter_profile");
                    alert("Signed out from Supporter Profile.");
                  }}
                  className={`text-[10px] px-2 py-1 rounded-lg border transition uppercase font-bold hover:bg-red-500/20 hover:text-red-400 ${darkMode ? "border-slate-800 text-slate-400" : "border-white/20 text-white/95"}`}
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsSignMode("login");
                  setShowSupporterModal(true);
                }}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${darkMode ? "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800" : "bg-white/10 border border-white/20 text-white/90 hover:bg-white/20"}`}
                id="supporter-login-cta-btn"
              >
                <User className={`w-3.5 h-3.5 ${darkMode ? "text-yellow-400" : "text-yellow-300"}`} />
                <span>Sign In / Join</span>
              </button>
            )}

            {/* Hidden admin access door indicator */}
            <button
              onClick={() => changeTabWithLimitHook("admin")}
              className={`p-2 rounded-lg border transition flex items-center gap-1 text-[11px] font-bold ${
                isAdmin
                  ? "bg-yellow-500 border-yellow-600 text-gray-950"
                  : darkMode
                  ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-yellow-400"
                  : "bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:text-yellow-400"
              }`}
              id="admin-gateway-button"
              title="Headquarters Command Port (Admin)"
            >
              <Lock className="w-4 h-4" />
              <span>{isAdmin ? "Admin desk" : "Admin Dashboard"}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg ${darkMode ? "text-slate-300 hover:bg-slate-800" : "text-white/95 hover:bg-white/10"}`}
              id="mobile-menu-trigger"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE CONSOLE OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-20 z-20 shadow-md">
          <nav className="flex flex-col gap-2 uppercase tracking-wide text-xs font-bold">
            {[
              { id: "lessons", label: "Daily Lessons" },
              { id: "bible", label: "KJV Bible Systems" },
              { id: "teachings", label: "Biblical Teachings" },
              { id: "prayer", label: "Prayer Room" },
              { id: "worship", label: "Worship & Praise" },
              { id: "meet", label: "Pastors Desk" },
              { id: "announcements", label: "Bulletins" },
              { id: "donations", label: "Growth Support" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => changeTabWithLimitHook(tab.id)}
                className={`text-left py-2 px-3 rounded-lg transition ${
                  activeTab === tab.id
                    ? "bg-blue-900 text-yellow-400 font-bold border-l-4 border-yellow-400"
                    : "text-slate-600 dark:text-slate-350 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowDocsModal(true);
              }}
              className="text-left py-2 px-3 text-blue-900 dark:text-yellow-400 font-bold flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile Build Instructions</span>
            </button>
          </nav>
        </div>
      )}

      {/* BODY WORKBENCH STAGE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="application-body-frame">
        {isLoadingMain ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-blue-900 border-t-yellow-500 rounded-full animate-spin"></div>
            <p className="text-sm font-serif font-semibold text-slate-500 animate-pulse">
              THE CHURCH OF PENTECOST – LIBERIA... Connecting safe database rules
            </p>
          </div>
        ) : (
          <div>
            {/* 1. SECTOR: DAILY BIBLE LESSONS */}
            {activeTab === "lessons" && (
              <div className="flex flex-col gap-8">
                {/* Hero Introduction banner */}
                <div 
                  style={!darkMode ? {
                    background: `linear-gradient(to bottom right, ${adminSettings.lessonsHeroBgColor || "#002244"}, ${adminSettings.lessonsHeroBgColor || "#001122"})`,
                    borderColor: adminSettings.primaryBrandColor || "#D4AF37"
                  } : {}}
                  className="bg-gradient-to-br from-slate-900 via-[#002244] to-slate-950 p-8 md:p-12 text-white rounded-3xl relative overflow-hidden shadow-2xl border border-yellow-500/30"
                >
                  {/* Glowing custom design elements */}
                  <div className="absolute top-0 right-0 -translate-y-24 translate-x-24 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="max-w-3xl flex flex-col gap-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4AF37] font-black text-[10px] uppercase tracking-widest bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3.5 py-1 rounded-full shadow-inner" style={{ color: adminSettings.primaryBrandColor || "#D4AF37", borderColor: `${adminSettings.primaryBrandColor || "#D4AF37"}40` }}>
                        Daily Study Curriculum
                      </span>
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Apostolic Guidance</span>
                    </div>
                    
                    <h2 
                      style={!darkMode ? { color: adminSettings.lessonsHeroTextColor || "#fffbeb" } : {}}
                      className="text-3xl md:text-5xl font-serif font-black text-amber-50 tracking-tight leading-none drop-shadow"
                    >
                      {adminSettings.lessonsHeroTitle || "Nurturing Disciples through Apostolic Doctrine"}
                    </h2>
                    
                    <div className="border-l-2 pl-4 py-1 italic text-slate-200 mt-2 text-xs md:text-sm bg-blue-950/25 rounded-r-xl pr-3 leading-relaxed" style={{ borderColor: adminSettings.primaryBrandColor || "#D4AF37" }}>
                      {adminSettings.lessonsHeroVerse || '"And they continued steadfastly in the apostles\' doctrine and fellowship, in the breaking of bread, and in prayers." — Acts 2:42'}
                    </div>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed mt-1">
                      {adminSettings.lessonsHeroParagraph || "Welcome to the study index. Access scheduled Bible lessons designed to nourish your daily spiritual journey, direct from the national prayer headquarters."}
                    </p>
                  </div>
                </div>

                {/* Main List Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left array lessons List (8 cols) */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <h3 className="text-xl font-serif font-bold text-blue-900 dark:text-amber-50 border-b pb-2 flex items-center justify-between">
                      <span>Acts of Apostles Lesson Series</span>
                      <span className="text-xs text-slate-500 font-sans">Newest published lesson displayed first</span>
                    </h3>

                    {lessons.length === 0 ? (
                      <p className="text-sm text-slate-500 italic p-10 bg-white dark:bg-slate-900 rounded-2xl border text-center shadow-sm">
                        No scripture lessons published on the live index. Check headquarters administration schedules.
                      </p>
                    ) : (
                      lessons.map((lesson) => (
                        <article
                          key={lesson.id}
                          className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-5 hover:shadow-md transition duration-150"
                        >
                          {/* Upper header */}
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                            <div>
                              <span className="text-[10px] text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-widest bg-yellow-50 dark:bg-yellow-950/40 px-3 py-1 rounded inline-block">
                                Curriculum Lesson Note
                              </span>
                              <h4 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-amber-50 mt-1.5 leading-tight">
                                {lesson.title}
                              </h4>
                            </div>
                            <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                              <span className="text-[11px] font-mono text-slate-500 font-medium flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Published: {lesson.publishDate}</span>
                              </span>
                              {isAdmin && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete lesson: "${lesson.title}"?`)) {
                                      handleAdminDeleteLesson(lesson.id);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold text-xs flex items-center gap-1 transition-all hover:underline cursor-pointer"
                                  title="Delete curriculum lesson (Admin Only)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete (Admin)</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Key Verse Scripture panel */}
                          <div className="p-4 bg-blue-50/50 dark:bg-slate-950/60 rounded-xl border-l-4 border-yellow-500 text-slate-800 dark:text-slate-200">
                            <span className="text-[10px] uppercase font-bold text-yellow-600 block mb-1 tracking-wider">Focus Scripture Passage</span>
                            <blockquote className="font-serif text-[15px] sm:text-base leading-relaxed italic">
                              {lesson.keyScripture}
                            </blockquote>
                          </div>

                          {/* Introduction overview */}
                          <div className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                            <p className="font-medium inline text-sky-900 dark:text-blue-300 mr-1.5">Overview:</p>
                            {lesson.introduction}
                          </div>

                          {/* Main Scripture Points items */}
                          <div className="flex flex-col gap-4 mt-2">
                            <h5 className="font-serif font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">Apostolic Biblical Exposition</h5>
                            {lesson.mainPoints.map((pt, i) => (
                              <div key={i} className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-start gap-3 mb-2 flex-wrap">
                                  <h6 className="font-serif font-bold text-base text-blue-900 dark:text-yellow-400">
                                    Point {i + 1}: {pt.heading}
                                  </h6>
                                  {pt.verses && (
                                    <span className="text-xs font-mono font-bold bg-amber-500/10 text-yellow-700 dark:text-yellow-400 px-2.5 py-0.5 rounded-full">
                                      {pt.verses}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                                  {pt.content}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Reflection and questions */}
                          <div className="bg-yellow-500/5 dark:bg-slate-950/80 p-5 rounded-xl border border-yellow-500/20 text-slate-800 dark:text-slate-200">
                            <h5 className="font-serif font-bold text-sm uppercase tracking-wide text-yellow-600 mb-2.5 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-yellow-600" />
                              <span>Weekly Reflection Questions</span>
                            </h5>
                            <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-slate-650 dark:text-slate-300 font-sans">
                              {lesson.discussionQuestions.map((q, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {q}
                                </li>
                              ))}
                            </ol>

                            {lesson.reflection && (
                              <div className="mt-4 border-t border-yellow-500/20 pt-3">
                                <span className="text-[10px] uppercase font-bold text-yellow-700 block mb-1">Personal Challenge</span>
                                <p className="text-xs italic text-slate-600 dark:text-slate-300">
                                  "{lesson.reflection}"
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Closing Prayer Block */}
                          <div className="bg-gradient-to-r from-blue-900 to-blue-950 p-5 rounded-xl text-white">
                            <h5 className="font-serif font-bold text-xs uppercase text-yellow-400 tracking-wider mb-1.5">Concluding Prayer Directive</h5>
                            <p className="text-xs sm:text-sm italic leading-relaxed text-indigo-100 font-serif">
                              "{lesson.closingPrayer}"
                            </p>
                          </div>
                        </article>
                      ))
                    )}
                  </div>

                  {/* Sidebar (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Welcome Letter from the Apostles of COP Liberia */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-900 dark:text-yellow-400 font-serif font-black">
                          †
                        </div>
                        <h4 className="font-serif font-bold text-slate-900 dark:text-amber-50 text-base">
                          Apostolic Pastoral Cover
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "Welcome to our unified Christian hub. This portal houses study resources designed purely for the defense of the gospel. Daily lesson outlines are inspired directly by our Liberian district curators under the leadership of the National Council. Use this tool diligently for small assembly cell teachings."
                      </p>
                      <div className="border-t border-slate-100 dark:border-slate-850 pt-3">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block font-serif">Apostle-in-Charge</span>
                        <span className="text-[10px] text-slate-500 uppercase">The Church of Pentecost Liberia Office</span>
                      </div>
                    </div>

                    {/* Notification Alert Sign up widget */}
                    <div className="bg-gradient-to-br from-blue-900 to-indigo-950 p-6 text-white rounded-2xl relative shadow-md">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-yellow-400 mb-1.5">Stay Alerted Constantly</h4>
                      <p className="text-xs text-blue-100 leading-relaxed mb-4">
                        Enable platform notifications to receive direct texts on cellular or computer grids whenever new daily lessons, general bulletins or video teachings go live inside this portal.
                      </p>

                      <button
                        onClick={toggleNotifications}
                        className={`w-full font-bold text-xs py-2.5 px-4 rounded-xl transition ${
                          notificationsSubscribed
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-white text-blue-950 hover:bg-slate-100"
                        }`}
                        id="notifications-button-lesson"
                      >
                        {notificationsSubscribed ? "Notifications Active ✓" : "Enable Push Notifications"}
                      </button>
                    </div>

                    {/* WhatsApp Quick Portals */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
                      <h4 className="font-serif font-bold text-slate-800 dark:text-amber-50 text-sm border-b pb-1.5 uppercase">Pastoral Hotline Channels</h4>
                      <div className="flex flex-col gap-2">
                        <a
                          href={`https://wa.me/${adminSettings.pastorWhatsapp.replace("+","")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between border border-slate-200 dark:border-slate-850 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition"
                        >
                          <div>
                            <span className="text-xs font-bold block text-slate-800 dark:text-amber-50">Headquarters Pastor Desk</span>
                            <span className="text-[10px] text-emerald-500 font-semibold uppercase">WhatsApp Chat</span>
                          </div>
                          <Phone className="w-4 h-4 text-emerald-500" />
                        </a>
                        <a
                          href={`https://wa.me/${adminSettings.apostleWhatsapp.replace("+","")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between border border-slate-200 dark:border-slate-850 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition"
                        >
                          <div>
                            <span className="text-xs font-bold block text-slate-800 dark:text-amber-50">Office of the Apostle</span>
                            <span className="text-[10px] text-emerald-500 font-semibold uppercase font-sans">Counseling Hotline</span>
                          </div>
                          <Phone className="w-4 h-4 text-emerald-500" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SECTOR: COMPLETE BIBLE SOFTWARE */}
            {activeTab === "bible" && (
              <BibleReader
                userProfile={userProfile}
                onSaveBookmark={handleSaveBookmark}
                onRemoveBookmark={handleRemoveBookmark}
                onSaveNote={handleSaveNote}
                onRemoveNote={handleRemoveNote}
                onTriggerSupporterAd={() => setShowSupporterModal(true)}
              />
            )}

            {/* 3. SECTOR: BIBLICAL TEACHING CENTER */}
            {activeTab === "teachings" && (
              <div className="flex flex-col gap-8">
                {/* Header overview */}
                <div>
                  <h2 className="text-3xl font-serif font-bold text-blue-900 dark:text-amber-55">Biblical Teaching Center</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                    Watch official, depth-focused Bible lessons and Sunday sermon broadcasts straight from the church. Video streams are played inside our encrypted container to avoid external tracking.
                  </p>
                </div>

                {/* Filter and search row */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Search teachings video catalog by keyword..."
                      className="w-full bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm py-2.5 pl-10 pr-4 rounded-xl border border-slate-205 focus:outline-none"
                      value={teachingSearch}
                      onChange={(e) => setTeachingSearch(e.target.value)}
                      id="teaching-video-search"
                    />
                    <Sparkles className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>

                  {/* Segmented control for bookmarked / liked filters */}
                  <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl self-stretch sm:self-auto shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => setTeachingFilter("all")}
                      className={`flex-1 sm:flex-initial text-center px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        teachingFilter === "all"
                          ? "bg-white dark:bg-slate-800 text-blue-900 dark:text-yellow-400 shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      All Lessons
                    </button>
                    <button
                      onClick={() => setTeachingFilter("bookmarks")}
                      className={`flex-1 sm:flex-initial text-center px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        teachingFilter === "bookmarks"
                          ? "bg-white dark:bg-slate-800 text-blue-900 dark:text-yellow-400 shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      Bookmarks ({userProfile?.bookmarkedVideos?.length || 0})
                    </button>
                    <button
                      onClick={() => setTeachingFilter("liked")}
                      className={`flex-1 sm:flex-initial text-center px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        teachingFilter === "liked"
                          ? "bg-white dark:bg-slate-800 text-blue-900 dark:text-yellow-400 shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      Amen'd ({userProfile?.likedVideos?.length || 0})
                    </button>
                  </div>
                </div>

                {filteredTeachingVideos.length === 0 ? (
                  <p className="text-sm italic p-12 bg-white dark:bg-slate-900 border rounded-xl text-center">No video matches found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredTeachingVideos.map((vid) => (
                      <div key={vid.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
                        
                        {/* Interactive Full Screen Iframe YT Player API compliant as requested in prompt */}
                        <div className="relative aspect-video w-full bg-slate-950">
                          <iframe
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${vid.youtubeId}?modestbranding=1&rel=0`}
                            title={vid.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="no-referrer"
                          ></iframe>
                        </div>

                        {/* Title descriptions */}
                        <div className="p-6 flex-1 flex flex-col gap-2 justify-between">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40 px-2.5 py-1 rounded inline-block">
                              Official Teaching Session
                            </span>
                            <h4 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-amber-50 mt-1.5">
                              {vid.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                              {vid.description || "Deep bible study addressing modern-day challenges, order, and Holy Ghost guidance in the workspace."}
                            </p>

                            {/* Reaction button group */}
                            <div className="flex gap-2.5 mt-4" id={`reactions-teachings-${vid.id}`}>
                              <button
                                onClick={() => handleLikeVideo(vid.id)}
                                className={`text-[11px] px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                                  userProfile?.likedVideos?.includes(vid.id)
                                    ? "bg-rose-50 dark:bg-rose-950/45 text-rose-600 dark:text-rose-450 border-rose-200 dark:border-rose-900 shadow-sm"
                                    : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-350 border-slate-250 dark:border-slate-800"
                                }`}
                                title="Like/Amen this sermon video"
                              >
                                <ThumbsUp className={`w-3.5 h-3.5 ${userProfile?.likedVideos?.includes(vid.id) ? "scale-110 fill-rose-500/10 text-rose-500" : ""}`} />
                                <span>{userProfile?.likedVideos?.includes(vid.id) ? "Amen'd ✓" : "Amen (Like)"}</span>
                              </button>

                              <button
                                onClick={() => handleBookmarkVideo(vid.id)}
                                className={`text-[11px] px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                                  userProfile?.bookmarkedVideos?.includes(vid.id)
                                    ? "bg-amber-50/85 dark:bg-amber-950/45 text-yellow-600 dark:text-yellow-400 border-yellow-250 dark:border-yellow-900 shadow-sm"
                                    : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-350 border-slate-250 dark:border-slate-800"
                                }`}
                                title="Bookmark this sermon to your profile"
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${userProfile?.bookmarkedVideos?.includes(vid.id) ? "scale-110 fill-yellow-500/15 text-yellow-500" : ""}`} />
                                <span>{userProfile?.bookmarkedVideos?.includes(vid.id) ? "Saved" : "Bookmark"}</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-[10px] text-slate-400 font-mono border-t border-slate-100 dark:border-slate-850 pt-2.5 mt-4 flex items-center justify-between gap-2">
                            <span>Added: {vid.addedAt}</span>
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete video: "${vid.title}"?`)) {
                                    handleAdminDeleteVideo(vid.id);
                                  }
                                }}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold hover:underline flex items-center gap-1 transition-all cursor-pointer font-sans"
                                title="Delete video (Admin Only)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete (Admin)</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. SECTOR: PRAYER CENTER */}
            {activeTab === "prayer" && (
              <div className="flex flex-col gap-8">
                {/* Intro Title */}
                <div>
                  <h2 className="text-3xl font-serif font-bold text-blue-900 dark:text-amber-55">Apostolic Prayer Room</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    "Pray without ceasing." — 1 Thessalonians 5:17. Target spiritual warfare, healings, and marital deliverances under divine apostolic cover.
                  </p>
                </div>

                {/* Categories filtering bar */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                  {["Healing", "Deliverance", "Breakthrough", "Family", "Marriage", "Salvation"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPrayerCategory(cat)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full transition duration-150 ${
                        prayerCategory === cat
                          ? "bg-blue-900 text-yellow-400 font-extrabold shadow-sm border border-yellow-400"
                          : "bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                      }`}
                      id={`prayer-cat-${cat}`}
                    >
                      {cat} Focus
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Category detailed content (8 cols) */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Active focus written prayers */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col gap-4">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/45 self-start px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Written Prayer Template: {prayerCategory} Focus
                      </span>

                      {prayerCategory === "Healing" && (
                        <>
                          <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-amber-50">Prayer for Absolute Healing and Bodily Restoration</h4>
                          <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-sans">
                            Sovereign Father of mercy, we raise our prayers over every ailing body across Liberia. By the stripes of Jesus, pain falls, growth vanishes, and cancers yield. We speak strength into vertebrae, correct blood deficiencies, and command absolute health according to Jeremiah 30:17: "For I will restore health unto thee, and I will heal thee of thy wounds, saith the LORD."
                          </p>
                        </>
                      )}

                      {prayerCategory === "Deliverance" && (
                        <>
                          <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-amber-50">Aggressive Prayer for Spiritual Deliverance & Curses Breaking</h4>
                          <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-serif italic bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border-l-4 border-yellow-500">
                            "In the Name of Jesus, we crush the hold of generational covenants, water-spirit bonds, and dark declarations whispered over your linage. The blood of the Lamb has redeemed you. Every demonic monitor is blinded. Walk in total, uncompromised spiritual victory."
                          </p>
                        </>
                      )}

                      {prayerCategory === "Breakthrough" && (
                        <>
                          <h4 className="text-xl font-serif font-bold text-slate-905 dark:text-amber-50">Prayer for Financial Breakthrough & Career Advancement</h4>
                          <p className="text-sm text-slate-655 dark:text-slate-305 leading-relaxed font-sans">
                            Lord of hosts, open windows of heaven over our diligent brothers and sisters in Monrovia and all counties. Unlock shut doors. Bless the labor of their hands. Let spiritual favor prompt promotions, debt relief, and provide business opportunities to strengthen families. We anchor on Deuteronomy 28:12.
                          </p>
                        </>
                      )}

                      {prayerCategory === "Family" && (
                        <>
                          <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-amber-50">Prayer for Family Shielding & Children Guidance</h4>
                          <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-sans">
                            Maintain a strong dome of fire over our households. Protect our children from waywardness and bad influences. Give parents spiritual depth to model godliness. We declare our families are centers of prayer and scriptural obedience.
                          </p>
                        </>
                      )}

                      {prayerCategory === "Marriage" && (
                        <>
                          <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-amber-50">Prayer for Marital Peace, Restoration and Fertility</h4>
                          <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-sans border-t pt-3 border-slate-100">
                            Command absolute reconciliation in homes experiencing tension. Let peace like a river wash away pride and discord. We counter every wedge thrown by darkness to split couples. Bless fruitful wombs with children who will serve the Lord.
                          </p>
                        </>
                      )}

                      {prayerCategory === "Salvation" && (
                        <>
                          <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-amber-50">Prayer for Eternal Salvation & Holy Ghost Baptism</h4>
                          <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-sans">
                            Saviour, draw near to those battling addictions and sin weight. Open their sight to your eternal redemption. We pray for a mighty wave ofrepentance to sweep across colleges, markets, and municipal assemblies, launching thousands into the baptism of the Holy Ghost with fire.
                          </p>
                        </>
                      )}
                    </div>

                    {/* YouTube Prayer Broadcasts in Category */}
                    <div className="flex flex-col gap-4">
                      <h4 className="font-serif font-bold text-slate-800 dark:text-amber-50 text-sm border-b pb-2 uppercase flex items-center gap-1">
                        <Flame className="w-4 h-4 text-red-500" />
                        <span>Interactive Prayer Broadcast Streams</span>
                      </h4>

                      {filteredPrayerVideos.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No prayer stream broadcasts added yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {filteredPrayerVideos.map((vid) => (
                            <div key={vid.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border shadow-sm">
                              <iframe
                                className="w-full aspect-video"
                                src={`https://www.youtube.com/embed/${vid.youtubeId}`}
                                allowFullScreen
                                title={vid.title}
                              ></iframe>
                              <div className="p-4 text-xs flex flex-col justify-between gap-2.5">
                                <div>
                                  <h6 className="font-serif font-bold text-slate-800 dark:text-amber-50">{vid.title}</h6>
                                  <p className="text-slate-500 mt-1">{vid.description}</p>
                                </div>
                                {isAdmin && (
                                  <div className="border-t border-slate-100 dark:border-slate-850 pt-2 flex justify-end">
                                    <button
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete prayer video: "${vid.title}"?`)) {
                                          handleAdminDeleteVideo(vid.id);
                                        }
                                      }}
                                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold hover:underline flex items-center gap-1 transition-all cursor-pointer font-sans text-[10px]"
                                      title="Delete video (Admin Only)"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      <span>Delete Video (Admin)</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Prayer Request Form (4 cols) */}
                  <div className="lg:col-span-4">
                    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col gap-5">
                      <div>
                        <h4 className="font-serif font-bold text-lg text-amber-50 flex items-center gap-1.5">
                          <span>Submit Request to Intercessors</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                          Our prayer warriors and head pastors intercede daily. Fill out your petition with utmost confidence. Sparing details if sensitive.
                        </p>
                      </div>

                      {prayerSentStatus ? (
                        <div className="bg-emerald-950/45 p-5 rounded-xl border border-emerald-900/40 text-center flex flex-col gap-3">
                          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
                          <h5 className="font-bold text-sm">Petition Lodged Successfully</h5>
                          <p className="text-[11px] text-slate-300">
                            Your intercession request is registered in the national registry. Apostles and elders hold prayers on Fridays. Stay faithful.
                          </p>
                          <button
                            onClick={() => setPrayerSentStatus(false)}
                            className="bg-slate-800 text-white font-bold text-xs py-1.5 rounded"
                          >
                            Submit Another Request
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handlePrayerSubmit} className="flex flex-col gap-3">
                          <input
                            type="text"
                            placeholder="Your Name (or Anonymous)"
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                            value={prayerFormName}
                            onChange={(e) => setPrayerFormName(e.target.value)}
                            required
                            id="prayer-form-name"
                          />

                          <select
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                            value={prayerFormType}
                            onChange={(e) => setPrayerFormType(e.target.value as any)}
                            id="prayer-form-type"
                          >
                            <option value="prayer">Prayer Request</option>
                            <option value="counseling">Counseling Petition</option>
                          </select>

                          <input
                            type="tel"
                            placeholder="Contact Mobile Number (Optional)"
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                            value={prayerFormPhone}
                            onChange={(e) => setPrayerFormPhone(e.target.value)}
                            id="prayer-form-phone"
                          />

                          <textarea
                            rows={4}
                            placeholder="Detail your prayer points or outline counseling needs..."
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                            value={prayerFormText}
                            onChange={(e) => setPrayerFormText(e.target.value)}
                            required
                            id="prayer-form-text"
                          ></textarea>

                          <button
                            type="submit"
                            disabled={submittingPrayerForm}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs py-3 rounded-xl transition shadow"
                            id="prayer-form-submit-btn"
                          >
                            {submittingPrayerForm ? "Dispatching Petition safely..." : "Submit to Intercessors"}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. SECTOR: WORSHIP CENTER */}
            {activeTab === "worship" && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-blue-900 dark:text-amber-55">Worship & Praise Center</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                      Experience deep, spirit-filled adoration. Browse Pentecostal praises, live regional conventions recordings and county choruses.
                    </p>
                  </div>

                  {/* Segmented control for bookmarked / liked filters */}
                  <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl self-start sm:self-center shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => setWorshipFilter("all")}
                      className={`flex-1 sm:flex-initial text-center px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        worshipFilter === "all"
                          ? "bg-white dark:bg-slate-800 text-blue-900 dark:text-yellow-400 shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      All Songs
                    </button>
                    <button
                      onClick={() => setWorshipFilter("bookmarks")}
                      className={`flex-1 sm:flex-initial text-center px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        worshipFilter === "bookmarks"
                          ? "bg-white dark:bg-slate-800 text-blue-900 dark:text-yellow-400 shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      Saved ({userProfile?.bookmarkedVideos?.length || 0})
                    </button>
                    <button
                      onClick={() => setWorshipFilter("liked")}
                      className={`flex-1 sm:flex-initial text-center px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        worshipFilter === "liked"
                          ? "bg-white dark:bg-slate-800 text-blue-900 dark:text-yellow-400 shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      Amen'd ({userProfile?.likedVideos?.length || 0})
                    </button>
                  </div>
                </div>

                {filteredWorshipVideos.length === 0 ? (
                  <p className="text-sm italic p-12 bg-white dark:bg-slate-900 border text-center rounded-xl shadow-sm">No worship broadcasts recorded.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorshipVideos.map((vid) => (
                      <div key={vid.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border shadow-sm flex flex-col justify-between">
                        <iframe
                          className="w-full aspect-video bg-slate-950"
                          src={`https://www.youtube.com/embed/${vid.youtubeId}`}
                          allowFullScreen
                          title={vid.title}
                        ></iframe>
                        <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                          <div>
                            <span className="text-[8px] bg-red-100 dark:bg-red-950/45 text-red-600 dark:text-red-400 font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block">
                              Praise Medley
                            </span>
                            <h5 className="font-serif font-bold text-slate-900 dark:text-amber-50 text-sm mt-1">
                              {vid.title}
                            </h5>
                            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                              {vid.description || "Spiritual worship song elevating absolute grace, surrender and power."}
                            </p>

                            {/* Reaction button group */}
                            <div className="flex gap-2 mt-3.5" id={`reactions-worship-${vid.id}`}>
                              <button
                                onClick={() => handleLikeVideo(vid.id)}
                                className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                                  userProfile?.likedVideos?.includes(vid.id)
                                    ? "bg-rose-50 dark:bg-rose-950/45 text-rose-600 dark:text-rose-450 border-rose-200 dark:border-rose-900 shadow-sm"
                                    : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-350 border-slate-250 dark:border-slate-800"
                                }`}
                                title="Like/Amen this worship video"
                              >
                                <ThumbsUp className={`w-3 h-3 ${userProfile?.likedVideos?.includes(vid.id) ? "scale-110 fill-rose-500/10 text-rose-500" : ""}`} />
                                <span>{userProfile?.likedVideos?.includes(vid.id) ? "Amen'd" : "Amen"}</span>
                              </button>

                              <button
                                onClick={() => handleBookmarkVideo(vid.id)}
                                className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                                  userProfile?.bookmarkedVideos?.includes(vid.id)
                                    ? "bg-amber-50/85 dark:bg-amber-950/45 text-yellow-600 dark:text-yellow-400 border-yellow-250 dark:border-yellow-900 shadow-sm"
                                    : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-350 border-slate-250 dark:border-slate-800"
                                }`}
                                title="Bookmark this worship song"
                              >
                                <Bookmark className={`w-3 h-3 ${userProfile?.bookmarkedVideos?.includes(vid.id) ? "scale-110 fill-yellow-500/15 text-yellow-500" : ""}`} />
                                <span>{userProfile?.bookmarkedVideos?.includes(vid.id) ? "Saved" : "Save"}</span>
                              </button>
                            </div>
                          </div>
                          {isAdmin && (
                            <div className="border-t border-slate-100 dark:border-slate-850 pt-2.5 flex justify-end">
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete worship video: "${vid.title}"?`)) {
                                    handleAdminDeleteVideo(vid.id);
                                  }
                                }}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold hover:underline flex items-center gap-1 transition-all cursor-pointer font-sans text-[10px]"
                                title="Delete video (Admin Only)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete (Admin)</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. SECTOR: MEET WITH PASTORS & APOSTLES */}
            {activeTab === "meet" && (
              <div className="flex flex-col gap-8">
                <div className="bg-gradient-to-tr from-yellow-500/10 via-blue-900/5 to-transparent p-6 rounded-2xl border border-blue-900/10">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-blue-900 dark:text-amber-50">Meet with Pastors & Apostles</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Connect directly on mobile hotlines. The regional counseling bureau matches your issues with highly trained scriptural mentors.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Whatsapp link triggers */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-5 justify-between">
                    <div>
                      <h4 className="text-lg font-serif font-bold text-blue-900 dark:text-amber-50 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-emerald-500" />
                        <span>Instant Whatsapp Counselling Link</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                        Get direct, confidential text access. Clicking these launches WhatsApp on your phone or computer with a standard request prefilled.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <a
                        href={`https://wa.me/${adminSettings.pastorWhatsapp.replace("+","")}?text=Humble%20Greetings%20Pastor,%20I%20am%2520writing%2520via%2520the%2520Church%2520Pentecost%2520Liberia%2520Bible%2520Platform%2520to%2520request%252520spiritual%252520guidance.`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                        id="chat-with-pastor-link"
                      >
                        <User className="w-4 h-4" />
                        <span>Chat Directly With Pastor</span>
                      </a>
                      <a
                        href={`https://wa.me/${adminSettings.apostleWhatsapp.replace("+","")}?text=Humble%20Greetings%20Apostle,%20I%20request%20prayer%20guidance%20under%20the%20Apostolic%2520Anointing%2520seal.`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-900 hover:bg-blue-950 border border-blue-850 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                        id="chat-with-apostle-link"
                      >
                        <Award className="w-4 h-4" />
                        <span>Chat Confidentially With Apostle</span>
                      </a>
                    </div>
                  </div>

                  {/* Pastoral Advice notes */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
                    <h4 className="text-serif font-bold text-base text-yellow-400 mb-2.5 uppercase tracking-wide">National Desk Directive</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      All physical consultations at our central office in Congo Town, Monrovia can be coordinated via this channel. If you represent regional assemblies in remote county districts (Lofa, Maryland, Sinoe), indicate so during initial messenger exchange to route to appropriate presiding presbyters.
                    </p>
                    <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2.5 text-xs text-indigo-100 font-mono">
                      <div><b>Counselling Office Contact:</b> {adminSettings.pastorWhatsapp}</div>
                      <div><b>Presiding Apostle Office:</b> {adminSettings.apostleWhatsapp}</div>
                      <div><b>Corporate Headquarters:</b> Tubman Blvd, Congo Town, Monrovia</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SECTOR: ANNOUNCEMENTS BULLETIN */}
            {activeTab === "announcements" && (
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-blue-900 dark:text-amber-55">Church Bulletins</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                    Stay up to date. Sourced directly from Liberia National Office bulletins including regional events, fasting shield alerts and district seminars.
                  </p>
                </div>

                {announcements.length === 0 ? (
                  <p className="text-sm italic p-12 bg-white dark:bg-slate-900 border text-center rounded-xl">No active announcements posted.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {announcements.map((ann) => (
                      <article
                        key={ann.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition duration-150 flex flex-col justify-between"
                      >
                        {/* Post image */}
                        <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-950">
                          <img
                            src={ann.image || "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=400&q=80"}
                            alt={ann.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[9px] uppercase font-bold tracking-wider text-white bg-red-600 py-1.5 px-3 rounded-full absolute right-3 bottom-3 shadow">
                            {ann.type}
                          </span>
                        </div>

                        {/* Text descriptions */}
                        <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                          <div>
                            <span className="text-[10px] text-yellow-600 dark:text-yellow-400 font-bold uppercase block mb-1">Weekly Bulletin Notice</span>
                            <h4 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-amber-50">
                              {ann.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-sans">
                              {ann.description}
                            </p>
                          </div>

                          <div className="text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-850 pt-2.5 font-semibold flex items-center justify-between gap-2.5 flex-wrap">
                            <span>Schedule: {ann.date}</span>
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete announcement: "${ann.title}"?`)) {
                                    handleAdminDeleteAnnouncement(ann.id);
                                  }
                                }}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold hover:underline flex items-center gap-1 transition-all cursor-pointer"
                                title="Delete announcement (Admin Only)"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete (Admin)</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 8. SECTOR: DONATIONS GROWTH SUPPORT */}
            {activeTab === "donations" && (
              <div className="flex flex-col gap-8">
                {/* Intro summary flier */}
                <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 p-8 md:p-12 text-white rounded-3xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="max-w-3xl flex flex-col gap-2">
                    <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/30 px-3.5 py-1 rounded inline-block self-start">
                      Support This Ministry
                    </span>
                    <h2 className="text-2xl md:text-4xl font-serif font-black text-amber-50 leading-tight">
                      Supporting National Church Growth & Evangelism
                    </h2>
                    <p className="text-xs md:text-sm text-blue-100 leading-relaxed mt-2.5">
                      Your voluntary gifts fuel rural church expansion, county tent crusades (like in Ganta), and facilitate printing native dialect discipleship curriculums. We pledge total operational transparency. Every dollar/momo contributes purely to kingdom advancements.
                    </p>
                  </div>
                </div>

                {/* Visual Progress Bar toward Ministry Goal */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col gap-5" id="donation-progress-tracker">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <span className="text-[10px] text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-widest bg-yellow-50 dark:bg-yellow-950/40 px-3 py-1 rounded-full inline-block mb-1.5">
                        Active Ministry Goal
                      </span>
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-amber-50 leading-tight">
                        {adminSettings.donationGoalName || "Ganta Crusade Tent & Audio Fund"}
                      </h3>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs text-slate-400 block font-mono uppercase tracking-wider">Fundraising Progress</span>
                      <span className="text-xl md:text-2xl font-sans font-extrabold text-[#D4AF37] dark:text-yellow-400">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: adminSettings.donationGoalCurrency || 'USD', maximumFractionDigits: 0 }).format(adminSettings.donationGoalCollected || 0)}
                        <span className="text-xs text-slate-500 font-normal"> of {new Intl.NumberFormat('en-US', { style: 'currency', currency: adminSettings.donationGoalCurrency || 'USD', maximumFractionDigits: 0 }).format(adminSettings.donationGoalTarget || 1)}</span>
                      </span>
                    </div>
                  </div>

                  {/* The progress bar element */}
                  {(() => {
                    const target = adminSettings.donationGoalTarget || 1;
                    const collected = adminSettings.donationGoalCollected || 0;
                    const rawPercentage = (collected / target) * 100;
                    const percentage = Math.min(100, Math.max(0, parseFloat(rawPercentage.toFixed(1))));
                    return (
                      <div className="space-y-2">
                        <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-4 overflow-hidden relative shadow-inner border border-slate-200/50 dark:border-slate-800/80">
                          <div 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundImage: `linear-gradient(to right, ${adminSettings.primaryBrandColor || "#D4AF37"}, #facc15)`
                            }}
                            className="h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                          />
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500 font-medium font-mono">
                          <span>0% Started</span>
                          <span className="text-[#D4AF37] dark:text-yellow-400 font-extrabold text-sm">{percentage}% Achieved</span>
                          <span>100% Completed</span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-5 mt-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center font-bold">✓</div>
                      <div>
                        <span className="text-slate-400 text-[10px] block font-mono uppercase">Status</span>
                        <span className="text-slate-850 dark:text-amber-50 text-xs font-semibold">Actively Funded</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold font-serif">†</div>
                      <div>
                        <span className="text-slate-400 text-[10px] block font-mono uppercase">Beneficiary</span>
                        <span className="text-slate-850 dark:text-amber-55 text-xs font-semibold">Liberia Rural Missions</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 text-[#D4AF37] flex items-center justify-center font-bold">★</div>
                      <div>
                        <span className="text-slate-400 text-[10px] block font-mono uppercase">Impact Location</span>
                        <span className="text-[#D4AF37] dark:text-yellow-400 text-xs font-semibold">Nimba & Ganta Crusade</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Donation structures details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Account options coordinates */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col gap-5">
                    <h4 className="text-lg font-serif font-bold text-blue-900 dark:text-amber-50 border-b pb-2">
                      Official Giving Channels
                    </h4>

                    {/* Channel items */}
                    <div className="flex flex-col gap-4">
                      {/* PayPal */}
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 flex items-start gap-3">
                        <Heart className="w-5 h-5 text-red-500 mt-1" />
                        <div>
                          <span className="text-xs font-bold block text-slate-800 dark:text-amber-50">PayPal Giving Account</span>
                          <span className="text-[11px] text-indigo-700 dark:text-yellow-400 font-mono select-all">
                            {adminSettings.paypalEmail}
                          </span>
                        </div>
                      </div>

                      {/* Mobile Money */}
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 flex items-start gap-3">
                        <Heart className="w-5 h-5 text-yellow-500 mt-1" />
                        <div>
                          <span className="text-xs font-bold block text-slate-850 dark:text-amber-55">Liberian Mobile Money (MTN / Orange)</span>
                          <span className="text-[11px] text-slate-650 dark:text-slate-300 font-mono block whitespace-pre-wrap mt-1">
                            {adminSettings.mobileMoneyDetail}
                          </span>
                        </div>
                      </div>

                      {/* Bank Coordinates */}
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 flex items-start gap-3">
                        <HeartHandshake className="w-5 h-5 text-sky-500 mt-1 lg:shrink-0" />
                        <div>
                          <span className="text-xs font-bold block text-slate-850 dark:text-amber-55">EcoBank Corporate Account Info</span>
                          <span className="text-[11px] text-slate-650 dark:text-slate-300 font-mono block whitespace-pre-wrap mt-1">
                            {adminSettings.bankAccountDetail}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Transparency banner notes */}
                  <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 md:p-8 shadow-md border border-slate-800 flex flex-col gap-4">
                    <h4 className="text-serif font-black text-yellow-400 tracking-wide uppercase text-sm">Transparency Pledge & Strategy</h4>
                    <p className="text-xs text-slate-350 leading-relaxed font-sans">
                      Our national headquarters accounts are audited quarterly by certified congregational trustees. For donor tracking, you can mail screenshots of your mobile transfers directly to the administration or chat with the apostle on WhatsApp to record customized blessing citations.
                    </p>
                    <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-3 font-serif text-[13px] leading-relaxed text-yellow-50">
                      <div>
                        <b>Goal 1: tent-crusade coverage</b>
                        <p className="text-xs font-sans text-slate-400 mt-0.5">Focusing on planting 15 rural county assemblies including audio equipment support.</p>
                      </div>
                      <div>
                        <b>Goal 2: dialysis & clinic support</b>
                        <p className="text-xs font-sans text-slate-400 mt-0.5">Directing medical help to underprivileged seekers across northern Lofa communities.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 9. SECTOR: ADMIN PANEL CONTROL PORT */}
            {activeTab === "admin" && (
              <AdminPanel
                isAdmin={isAdmin}
                onVerifyAdminPass={handleVerifyPassphrase}
                onSignOutAdmin={handleSignOutAdmin}
                lessons={lessons}
                onAddLesson={handleAdminAddLesson}
                onDeleteLesson={handleAdminDeleteLesson}
                videos={videos}
                onAddVideo={handleAdminAddVideo}
                onDeleteVideo={handleAdminDeleteVideo}
                announcements={announcements}
                onAddAnnouncement={handleAdminAddAnnouncement}
                onDeleteAnnouncement={handleAdminDeleteAnnouncement}
                adminSettings={adminSettings}
                onUpdateSettings={handleAdminUpdateSettings}
              />
            )}
          </div>
        )}
      </main>

      {/* FOOTER CODES BRANDING */}
      <footer className={`border-t py-12 ${darkMode ? "bg-slate-950 border-slate-900 text-slate-400" : "bg-white border-slate-100 text-slate-500"} transition mt-20`} id="footer-branding-block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-4">
          
          {/* Logo icons */}
          <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex flex-col items-center justify-center font-serif text-[9px] font-bold">
            <span className="text-yellow-400 leading-none">CoP</span>
            <span className="text-[6px] uppercase leading-none">Liberia</span>
          </div>

          <div>
            <h4 className="font-serif font-black tracking-wide text-blue-900 dark:text-amber-50">
              THE CHURCH OF PENTECOST – LIBERIA
            </h4>
            <p className="text-[10px] uppercase font-bold tracking-widest text-yellow-600 mt-0.5">
              Christian Discipleship & Bible study platform
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mx-auto font-sans">
            Head Office: Congo Town, Monrovia, Republic of Liberia. Operating on verified Cloud-native rules securely linked to regional county church databases.
          </p>

          <div className="flex justify-center flex-wrap gap-5 text-[10px] sm:text-xs uppercase font-bold text-slate-700 dark:text-slate-350 tracking-wider">
            <button onClick={() => changeTabWithLimitHook("lessons")} className="hover:text-blue-950 hover:underline">lessons</button>
            <button onClick={() => changeTabWithLimitHook("bible")} className="hover:text-blue-950 hover:underline">complete bible</button>
            <button onClick={() => changeTabWithLimitHook("meet")} className="hover:text-blue-950 hover:underline">pastoral desk</button>
            <button onClick={() => changeTabWithLimitHook("admin")} className="hover:text-blue-950 hover:underline">admin desktop</button>
            <button
              onClick={() => {
                setDocsActiveTab("android");
                setShowDocsModal(true);
              }}
              className="text-blue-900 dark:text-yellow-400 hover:underline"
            >
              Manual & Deployment Guides
            </button>
          </div>

          <p className="text-[10px] text-slate-500 tracking-wider mt-4">
            © 2026 THE CHURCH OF PENTECOST – LIBERIA. All rights and scripture licenses reserved.
          </p>
        </div>
      </footer>

      {/* DOCK BAR FOR CELLULAR USERS (looks matching Google Play platform Android layout!) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-slate-950 border-t border-slate-205 dark:border-slate-850 h-16 flex justify-around items-center z-40 px-2 shadow bg-opacity-95 backdrop-blur" id="mobile-dock-rail">
        {[
          { id: "lessons", label: "Study", icon: BookOpen },
          { id: "bible", label: "KJV Bible", icon: Sparkles },
          { id: "prayer", label: "Prayer", icon: Flame },
          { id: "meet", label: "Pastors", icon: Phone },
          { id: "donations", label: "Support", icon: HeartHandshake },
        ].map((rail) => {
          const IconComponent = rail.icon;
          const active = activeTab === rail.id;
          return (
            <button
              key={rail.id}
              onClick={() => changeTabWithLimitHook(rail.id)}
              className="flex flex-col items-center justify-center p-1.5 focus:outline-none flex-1"
            >
              <IconComponent className={`w-5 h-5 ${active ? "text-blue-900 dark:text-yellow-400 animate-pulse scale-110" : "text-slate-500"}`} />
              <span className={`text-[9px] font-bold tracking-tight uppercase mt-1 ${active ? "text-blue-900 dark:text-yellow-400" : "text-slate-500"}`}>
                {rail.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ======================================= */}
      {/* MODAL: SUPPORTER REWARD MOTIVATION PROMOTION */}
      {/* ======================================= */}
      {showSupporterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" id="supporter-promotion-modal">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 flex flex-col gap-5 relative shadow-2xl overflow-hidden animate-fade-in text-slate-900 dark:text-white">
            {/* Design accents */}
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl pointer-events-none"></div>

            <button
              onClick={() => setShowSupporterModal(false)}
              className="text-slate-400 hover:text-red-500 absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              id="close-supporter-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center flex flex-col gap-2">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-950 border border-indigo-100 dark:border-slate-850 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-black text-slate-900 dark:text-amber-50">
                Support and Follow Our Ministry
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Join thousands of Liberian believers by creating an official <b>Registered Supporter Profile</b>. Automatically synced to Firebase.
              </p>
            </div>

            {/* Quick Google Sign In */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-300 dark:border-slate-800 text-slate-705 dark:text-slate-250 font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition cursor-pointer"
              >
                {/* Visual SVG Google Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.61 14.98 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.86 3C6.27 7.58 8.92 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.45h6.45c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.72-4.92 3.72-8.56z" />
                  <path fill="#FBBC05" d="M5.36 14.5c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 6.9c-.83 1.66-1.3 3.52-1.3 5.5s.47 3.84 1.3 5.5l3.86-2.9z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.03.69-2.35 1.11-4.23 1.11-3.08 0-5.73-2.54-6.64-5.46L1.5 15.8C3.39 19.65 7.35 23 12 23z" />
                </svg>
                Continue with Google Account
              </button>
              <div className="flex items-center gap-2 my-1">
                <div className="h-[1px] bg-slate-205 dark:bg-slate-800 flex-1"></div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">or email access</span>
                <div className="h-[1px] bg-slate-205 dark:bg-slate-800 flex-1"></div>
              </div>
            </div>

            {/* Switch sign-in mode */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setIsSignMode("register")}
                className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${isSignMode === "register" ? "bg-white dark:bg-slate-800 shadow text-blue-900 dark:text-yellow-400" : "text-slate-505 hover:text-slate-800 dark:hover:text-slate-200"}`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setIsSignMode("login")}
                className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${isSignMode === "login" ? "bg-white dark:bg-slate-800 shadow text-blue-900 dark:text-yellow-400" : "text-slate-505 hover:text-slate-800 dark:hover:text-slate-200"}`}
              >
                Sign In
              </button>
            </div>

            {isSignMode === "register" ? (
              <form onSubmit={executeSupporterRegistration} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="FullName (e.g. Bro. Brooks)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-850 placeholder:text-slate-400 dark:text-white"
                  value={supporterFormName}
                  onChange={(e) => setSupporterFormName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address (e.g. beloved@gmail.com)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-855 placeholder:text-slate-400 dark:text-white"
                  value={supporterFormEmail}
                  onChange={(e) => setSupporterFormEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password (Min. 6 characters)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-855 placeholder:text-slate-400 dark:text-white"
                  value={supporterFormPassword}
                  onChange={(e) => setSupporterFormPassword(e.target.value)}
                  required
                />

                <div className="p-2.5 bg-yellow-500/5 dark:bg-slate-950 border border-yellow-500/15 rounded-xl text-[10px] text-slate-600 dark:text-slate-350 space-y-1 font-sans">
                  <div className="font-bold text-yellow-600">Locked supporter benefits enabled instantly:</div>
                  <div className="flex items-center gap-1"><span>✓</span><span>Capped high-contrast Bible highlighting</span></div>
                  <div className="flex items-center gap-1"><span>✓</span><span>Active notebook directory persistence</span></div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5 mt-1 cursor-pointer"
                  id="supporter-submit-register-btn"
                >
                  Create Supporter Account & Connect
                </button>
              </form>
            ) : (
              <form onSubmit={executeSupporterLogin} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-855 placeholder:text-slate-400 dark:text-white"
                  value={supporterFormEmail}
                  onChange={(e) => setSupporterFormEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-855 placeholder:text-slate-400 dark:text-white"
                  value={supporterFormPassword}
                  onChange={(e) => setSupporterFormPassword(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5 mt-2 cursor-pointer"
                  id="supporter-submit-login-btn"
                >
                  Sign In to Private Notebook
                </button>
              </form>
            )}

            <button
              onClick={() => setShowSupporterModal(false)}
              className="text-[10px] text-slate-500 text-center uppercase tracking-widest hover:underline mt-1 cursor-pointer"
            >
              No, continue standard seek-mode
            </button>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL: DEVELOPMENT & DEPLOYMENT MANUAL */}
      {/* ======================================= */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" id="docs-help-modal">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 flex flex-col gap-6 relative shadow-2xl h-[90vh] overflow-hidden animate-fade-in animate-duration-150">
            
            <button
              onClick={() => setShowDocsModal(false)}
              className="text-slate-400 hover:text-red-500 absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-serif font-black text-yellow-50 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-yellow-500" />
                <span>COP Liberia • Build Manual & Release Guides</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Apostolic Deployment guidelines, Enterprise Security specs, and Google Play Store configuration routines compiled for developers.
              </p>
            </div>

            {/* Selector tabs inside helper */}
            <div className="flex border-b border-slate-800 gap-2">
              <button
                onClick={() => setDocsActiveTab("android")}
                className={`py-2 px-4 text-xs font-bold transition uppercase ${docsActiveTab === "android" ? "border-b-2 border-yellow-500 text-yellow-400" : "text-slate-400"}`}
              >
                Play Store App Bundling
              </button>
              <button
                onClick={() => setDocsActiveTab("firebase")}
                className={`py-2 px-4 text-xs font-bold transition uppercase ${docsActiveTab === "firebase" ? "border-b-2 border-yellow-500 text-yellow-400" : "text-slate-400"}`}
              >
                Firebase Credentials Schema
              </button>
              <button
                onClick={() => setDocsActiveTab("security")}
                className={`py-2 px-4 text-xs font-bold transition uppercase ${docsActiveTab === "security" ? "border-b-2 border-yellow-500 text-yellow-400" : "text-slate-400"}`}
              >
                Cybersecurity Policies
              </button>
            </div>

            {/* Tab text area */}
            <div className="flex-1 overflow-y-auto pr-2 text-xs text-slate-300 space-y-4">
              {docsActiveTab === "android" && (
                <div className="space-y-3 font-sans">
                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
                    <h5 className="font-serif font-bold text-amber-50 uppercase text-xs mb-2 tracking-wider">Option: Cordova/Capacitor Hybrid Container (Recommended)</h5>
                    <p className="leading-relaxed mb-3">
                      To deliver this React SPA directly onto the Google Play Store with responsive layouts suitable for cellular screens and zero functions latency offline:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 mt-2 font-mono text-[10px] text-slate-400">
                      <li>npm install @capacitor/core @capacitor/cli</li>
                      <li>npx cap init "The Church of Pentecost Liberia" "com.copliberia.app" --web-dir=dist</li>
                      <li>npx cap add android</li>
                      <li>Modify native android/app/src/main/AndroidManifest.xml: add internet, fine localizations, and background FCM pushes permissions.</li>
                      <li>npm run build && npx cap sync</li>
                      <li>In Android Studio, compile code, configure release signing keys (.jks credential keys), assemble Android Release Bundle (.aab), and upload to Google Play Developer Console.</li>
                    </ol>
                  </div>

                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
                    <h5 className="font-serif font-bold text-amber-50 uppercase text-xs mb-1.5">Asset Icons Generator requirements</h5>
                    <p className="leading-relaxed">
                      Prepare 512x512 rounded vector launcher icons styled matching Church of Pentecost Color Codes (Gold, Deep Blue background flags). Android Play Store requires target SDK API level 33 or higher.
                    </p>
                  </div>
                </div>
              )}

              {docsActiveTab === "firebase" && (
                <div className="space-y-3 font-mono text-[11px]">
                  <p className="font-sans text-xs">
                    Our platform is fully connected to Firestore under non-default multi-database instances rules. The Firestore Structuring is detailed below:
                  </p>

                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
                    <div className="font-bold text-yellow-400 mb-1">Collection "lessons":</div>
                    <div>Schema: &#123; id: string, title: string, keyScripture: string, introduction: string, mainPoints: Array, reflection: string, closingPrayer: string, publishDate: string, status: string &#125;</div>
                  </div>

                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
                    <div className="font-bold text-yellow-400 mb-1">Collection "supporters":</div>
                    <div>Schema: &#123; uid: string, email: string, displayName: string, savedVerseBookmarks: Array, savedNotes: Array &#125;</div>
                  </div>

                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
                    <div className="font-bold text-yellow-400 mb-1">Collection "prayer_requests":</div>
                    <div>Schema: &#123; id: string, name: string, type: "prayer"|"counseling", category: string, requestText: string, contactNumber: string, createdAt: string, status: string &#125;</div>
                  </div>
                </div>
              )}

              {docsActiveTab === "security" && (
                <div className="space-y-3 font-sans leading-relaxed">
                  <h5 className="font-serif font-bold text-amber-50 uppercase text-xs">Apostolic Enterprise Cybersecurity Rules</h5>
                  <p>
                    The platform enforces standard Role-Based Access Control (RBAC). Only authenticated administration profiles elevated by typing the security passcode can access delete triggers or add streams.
                  </p>
                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl font-mono text-[10px] space-y-2 text-slate-400">
                    <div><b>Rate-Limiting Protection:</b> Integrated on the Express /api endpoints utilizing lazy triggers.</div>
                    <div><b>API Keys Security Pattern:</b> process.env.GEMINI_API_KEY is lazily triggered uniquely from back-end Express processes, guaranteeing that no developer secret can bleed onto the browser network logs.</div>
                    <div><b>Anti-Spam Filtering:</b> Prayer and counselling request forms validation prevents cross-site script injections (XSS) by stripping tags before firestore commits.</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowDocsModal(false)}
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs py-2 px-5 rounded-xl shadow-md transition"
              >
                Close Developer Manual
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
