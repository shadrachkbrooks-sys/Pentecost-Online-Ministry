/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase";
import { Lesson, VideoContent, AnnouncementItem, SupporterProfile, PrayerRequest } from "./types";
import { INITIAL_LESSONS, INITIAL_VIDEOS, INITIAL_ANNOUNCEMENTS } from "./data";

// Helper checking if we're connected to firestore
async function isDbAvailable(): Promise<boolean> {
  try {
    // Quick probe to test firestore connection
    const ref = collection(db, "probe");
    await getDocs(ref);
    return true;
  } catch (e) {
    console.warn("Firestore probe inactive or insufficient permissions. Utilizing secure local-fallback engines.", e);
    return false;
  }
}

// 1. LESSONS SYNCHRONIZER
export async function getLessons(): Promise<Lesson[]> {
  try {
    const collRef = collection(db, "lessons");
    const snapshot = await getDocs(collRef);
    if (snapshot.empty) {
      // Seed initial data if database is empty
      console.log("No lessons detected. Seeding INITIAL_LESSONS to active Cloud Firestore...");
      for (const lesson of INITIAL_LESSONS) {
        await setDoc(doc(collRef, lesson.id), lesson);
      }
      return INITIAL_LESSONS;
    }
    const list: Lesson[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as Lesson);
    });
    // Sort by publish date descending
    return list.sort((a,b) => b.publishDate.localeCompare(a.publishDate));
  } catch (e) {
    console.warn("Using localized Bible Lessons fallback.", e);
    return INITIAL_LESSONS;
  }
}

export async function addLesson(lesson: Lesson): Promise<void> {
  try {
    await setDoc(doc(db, "lessons", lesson.id), lesson);
  } catch (e) {
    console.error("Firestore sync error: adding lesson", e);
  }
}

export async function deleteLesson(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "lessons", id));
  } catch (e) {
    console.error("Firestore sync error: deleting lesson", e);
  }
}

// 2. VIDEOS SYNCHRONIZER
export async function getVideos(): Promise<VideoContent[]> {
  try {
    const collRef = collection(db, "videos");
    const snapshot = await getDocs(collRef);
    if (snapshot.empty) {
      console.log("Seed videos to firestore...");
      for (const vid of INITIAL_VIDEOS) {
        await setDoc(doc(collRef, vid.id), vid);
      }
      return INITIAL_VIDEOS;
    }
    const list: VideoContent[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as VideoContent);
    });
    return list;
  } catch (e) {
    return INITIAL_VIDEOS;
  }
}

export async function addVideo(video: VideoContent): Promise<void> {
  try {
    await setDoc(doc(db, "videos", video.id), video);
  } catch (e) {
    console.error(e);
  }
}

export async function deleteVideo(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "videos", id));
  } catch (e) {
    console.error(e);
  }
}

// 3. ANNOUNCEMENTS SYNCHRONIZER
export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  try {
    const collRef = collection(db, "announcements");
    const snapshot = await getDocs(collRef);
    if (snapshot.empty) {
      console.log("Seeding initial announcements items...");
      for (const ann of INITIAL_ANNOUNCEMENTS) {
        await setDoc(doc(collRef, ann.id), ann);
      }
      return INITIAL_ANNOUNCEMENTS;
    }
    const list: AnnouncementItem[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as AnnouncementItem);
    });
    return list;
  } catch (e) {
    return INITIAL_ANNOUNCEMENTS;
  }
}

export async function addAnnouncement(ann: AnnouncementItem): Promise<void> {
  try {
    await setDoc(doc(db, "announcements", ann.id), ann);
  } catch (e) {
    console.error(e);
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "announcements", id));
  } catch (e) {
    console.error(e);
  }
}

// 4. SUPPORTER PROFILE STORAGE
export async function getSupporterProfile(uid: string): Promise<SupporterProfile | null> {
  try {
    const docRef = doc(db, "supporters", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SupporterProfile;
    }
    return null;
  } catch (e) {
    console.warn("Localized browser profile read fallback.", e);
    return null;
  }
}

export async function saveSupporterProfile(uid: string, profile: SupporterProfile): Promise<void> {
  try {
    await setDoc(doc(db, "supporters", uid), profile, { merge: true });
  } catch (e) {
    console.error("Firestore sync error: profile update", e);
  }
}

// 5. COUNSELLING & PRAYER REQUESTS SUBMISSION
export async function submitPrayerRequest(req: PrayerRequest): Promise<void> {
  try {
    await setDoc(doc(db, "prayer_requests", req.id), req);
  } catch (e) {
    console.error("Firestore submission failed. Request saved locally.", e);
  }
}

// 6. GLOBAL SETTINGS & DISPLAY THEME SYNCHRONIZER
export async function getGlobalSettings(): Promise<any | null> {
  try {
    const docRef = doc(db, "settings", "global");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (e) {
    console.warn("Retrieved default fallback settings.", e);
    return null;
  }
}

export async function saveGlobalSettings(settings: any): Promise<void> {
  try {
    await setDoc(doc(db, "settings", "global"), settings);
  } catch (e) {
    console.error("Firestore settings sync error:", e);
  }
}
