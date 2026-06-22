/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LessonPoint {
  heading: string;
  verses: string;
  content: string;
}

export interface Lesson {
  id: string;
  title: string;
  keyScripture: string;
  introduction: string;
  mainPoints: LessonPoint[];
  discussionQuestions: string[];
  reflection: string;
  closingPrayer: string;
  publishDate: string; // ISO date or simple string
  status: "published" | "draft";
  topic?: string;
  themeNotes?: string;
}

export interface VideoContent {
  id: string;
  youtubeId: string;
  title: string;
  category: "teaching" | "prayer" | "worship";
  description?: string;
  addedAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  image?: string;
  date: string;
  description: string;
  type: "event" | "conference" | "crusade" | "prayer_meeting" | "bible_study" | "news";
}

export interface PrayerRequest {
  id: string;
  name: string;
  email?: string;
  type: "prayer" | "counseling";
  category?: string; // e.g. Healing, Deliverance, Breakthrough, Family, Marriage, Salvation
  requestText: string;
  contactNumber?: string;
  createdAt: string;
  status: "pending" | "resolved";
}

export interface SupporterProfile {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin?: boolean;
  savedVerseBookmarks?: string[]; // list of verses like "John 3:16"
  savedNotes?: Array<{
    id: string;
    verseRef: string;
    noteText: string;
    savedAt: string;
  }>;
  likedVideos?: string[]; // list of video IDs liked/amen'd
  bookmarkedVideos?: string[]; // list of video IDs bookmarked
}

export interface DonationGoal {
  method: "paypal" | "stripe" | "mobile_money" | "bank_transfer";
  paypalEmail: string;
  mobileMoneyDetail: string; // e.g., "MTN MoMo: +23188xxxx, Orange Money: +23177xxxx"
  bankAccountDetail: string; // Account Number, Swift, Bank Name
}
