/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson, VideoContent, AnnouncementItem, DonationGoal } from "./types";

// Complete Bible books structures for Old and New Testament (66 books)
export interface BibleBook {
  name: string;
  chapters: number;
  testament: "OT" | "NT";
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { name: "Genesis", chapters: 50, testament: "OT" },
  { name: "Exodus", chapters: 40, testament: "OT" },
  { name: "Leviticus", chapters: 27, testament: "OT" },
  { name: "Numbers", chapters: 36, testament: "OT" },
  { name: "Deuteronomy", chapters: 34, testament: "OT" },
  { name: "Joshua", chapters: 24, testament: "OT" },
  { name: "Judges", chapters: 21, testament: "OT" },
  { name: "Ruth", chapters: 4, testament: "OT" },
  { name: "1 Samuel", chapters: 31, testament: "OT" },
  { name: "2 Samuel", chapters: 24, testament: "OT" },
  { name: "1 Kings", chapters: 22, testament: "OT" },
  { name: "2 Kings", chapters: 25, testament: "OT" },
  { name: "1 Chronicles", chapters: 29, testament: "OT" },
  { name: "2 Chronicles", chapters: 36, testament: "OT" },
  { name: "Ezra", chapters: 10, testament: "OT" },
  { name: "Nehemiah", chapters: 13, testament: "OT" },
  { name: "Esther", chapters: 10, testament: "OT" },
  { name: "Job", chapters: 42, testament: "OT" },
  { name: "Psalms", chapters: 150, testament: "OT" },
  { name: "Proverbs", chapters: 31, testament: "OT" },
  { name: "Ecclesiastes", chapters: 12, testament: "OT" },
  { name: "Song of Solomon", chapters: 8, testament: "OT" },
  { name: "Isaiah", chapters: 66, testament: "OT" },
  { name: "Jeremiah", chapters: 52, testament: "OT" },
  { name: "Lamentations", chapters: 5, testament: "OT" },
  { name: "Ezekiel", chapters: 48, testament: "OT" },
  { name: "Daniel", chapters: 12, testament: "OT" },
  { name: "Hosea", chapters: 14, testament: "OT" },
  { name: "Joel", chapters: 3, testament: "OT" },
  { name: "Amos", chapters: 9, testament: "OT" },
  { name: "Obadiah", chapters: 1, testament: "OT" },
  { name: "Jonah", chapters: 4, testament: "OT" },
  { name: "Micah", chapters: 7, testament: "OT" },
  { name: "Nahum", chapters: 3, testament: "OT" },
  { name: "Habakkuk", chapters: 3, testament: "OT" },
  { name: "Zephaniah", chapters: 3, testament: "OT" },
  { name: "Haggai", chapters: 2, testament: "OT" },
  { name: "Zechariah", chapters: 14, testament: "OT" },
  { name: "Malachi", chapters: 4, testament: "OT" },
  // New Testament
  { name: "Matthew", chapters: 28, testament: "NT" },
  { name: "Mark", chapters: 16, testament: "NT" },
  { name: "Luke", chapters: 24, testament: "NT" },
  { name: "John", chapters: 21, testament: "NT" },
  { name: "Acts", chapters: 28, testament: "NT" },
  { name: "Romans", chapters: 16, testament: "NT" },
  { name: "1 Corinthians", chapters: 16, testament: "NT" },
  { name: "2 Corinthians", chapters: 13, testament: "NT" },
  { name: "Galatians", chapters: 6, testament: "NT" },
  { name: "Ephesians", chapters: 6, testament: "NT" },
  { name: "Philippians", chapters: 4, testament: "NT" },
  { name: "Colossians", chapters: 4, testament: "NT" },
  { name: "1 Thessalonians", chapters: 5, testament: "NT" },
  { name: "2 Thessalonians", chapters: 3, testament: "NT" },
  { name: "1 Timothy", chapters: 6, testament: "NT" },
  { name: "2 Timothy", chapters: 4, testament: "NT" },
  { name: "Titus", chapters: 3, testament: "NT" },
  { name: "Philemon", chapters: 1, testament: "NT" },
  { name: "Hebrews", chapters: 13, testament: "NT" },
  { name: "James", chapters: 5, testament: "NT" },
  { name: "1 Peter", chapters: 5, testament: "NT" },
  { name: "2 Peter", chapters: 3, testament: "NT" },
  { name: "1 John", chapters: 5, testament: "NT" },
  { name: "2 John", chapters: 1, testament: "NT" },
  { name: "3 John", chapters: 1, testament: "NT" },
  { name: "Jude", chapters: 1, testament: "NT" },
  { name: "Revelation", chapters: 22, testament: "NT" },
];

// Offline fallback scriptures to guarantee instant functionality without requests
export interface Verse {
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export const OFFLINE_SCRIPTURES: Record<string, Verse[]> = {
  "Psalms 23": [
    { bookName: "Psalms", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want." },
    { bookName: "Psalms", chapter: 23, verse: 2, text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters." },
    { bookName: "Psalms", chapter: 23, verse: 3, text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake." },
    { bookName: "Psalms", chapter: 23, verse: 4, text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me." },
    { bookName: "Psalms", chapter: 23, verse: 5, text: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over." },
    { bookName: "Psalms", chapter: 23, verse: 6, text: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever." },
  ],
  "John 1": [
    { bookName: "John", chapter: 1, verse: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
    { bookName: "John", chapter: 1, verse: 2, text: "The same was in the beginning with God." },
    { bookName: "John", chapter: 1, verse: 3, text: "All things were made by him; and without him was not any thing made that was made." },
    { bookName: "John", chapter: 1, verse: 4, text: "In him was life; and the life was the light of men." },
    { bookName: "John", chapter: 1, verse: 5, text: "And the light shineth in darkness; and the darkness comprehended it not." },
    { bookName: "John", chapter: 1, verse: 14, text: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth." },
  ],
  "Romans 8": [
    { bookName: "Romans", chapter: 8, verse: 1, text: "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit." },
    { bookName: "Romans", chapter: 8, verse: 2, text: "For the law of the Spirit of life in Christ Jesus hath made me free from the law of sin and death." },
    { bookName: "Romans", chapter: 8, verse: 14, text: "For as many as are led by the Spirit of God, they are the sons of God." },
    { bookName: "Romans", chapter: 8, verse: 28, text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
    { bookName: "Romans", chapter: 8, verse: 31, text: "What shall we then say to these things? If God be for us, who can be against us?" },
    { bookName: "Romans", chapter: 8, verse: 37, text: "Nay, in all these things we are more than conquerors through him that loved us." },
    { bookName: "Romans", chapter: 8, verse: 38, text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come," },
    { bookName: "Romans", chapter: 8, verse: 39, text: "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord." },
  ],
};

// Initial Lessons
export const INITIAL_LESSONS: Lesson[] = [
  {
    id: "lesson_1",
    title: "Walking in Divine Authority and Power",
    keyScripture: "Acts 1:8 - 'But you shall receive power when the Holy Spirit has come upon you; and you shall be witnesses to Me in Jerusalem, and in all Judea and Samaria, and to the end of the earth.'",
    introduction: "In this study, we reflect on the divine mandate given to the Church. For true transformation in Liberia, believers must move beyond human wisdom and rely solely on the active, transformative power of the Holy Spirit. As members of The Church of Pentecost, our heritage is built on apostolic prayer, fastings, and absolute submission to the Spirit of God.",
    mainPoints: [
      {
        heading: "The Promise of Pentecostal Power",
        verses: "Acts 1:8, Luke 24:49",
        content: "Before the disciples ventured out to convert nations, Jesus strictly commanded them to tarry for power. Pentecostal power is not for self-glory but is the indispensable fuel for the propagation of the Gospel. In Liberia today, this power is needed to break generational cycles and establish God’s authority over systems."
      },
      {
        heading: "The Channel of Apostolic Prayer and Fellowship",
        verses: "Acts 2:42-47, Acts 4:31",
        content: "Scripture shows that the early believers remained steady in the Apostles’ doctrine, fellowship, and prayers. Power is fueled and sustained through intense corporate and personal prayer. When the Church prays in unity, the foundations of darkness shake, and supernatural bold testimonies are released."
      },
      {
        heading: "Proclaiming with Boldness and Manifested Signs",
        verses: "Hebrews 2:4, Mark 16:17-18",
        content: "God testifies to His Word through miraculous signs, wonders, and diverse gifts of the Holy Ghost. A witnessing believer does not merely speak; they demonstrate Christ’s resurrection. We are called to step out in deep faith and pray for the sick, deliver the oppressed, and declare the truth of the Gospel across all counties of Liberia."
      }
    ],
    discussionQuestions: [
      "What is the difference between human charisma and the genuine power of the Holy Spirit in Christian witness?",
      "How can our local congregations in Monrovia and rural districts cultivate deeper prayer lives to sustain this divine authority?",
      "In what practical ways can you exercise spiritual boldness in your neighborhood or workplace this week?"
    ],
    reflection: "Reflect on whether your daily decisions are led by human logic or spiritual promptings. The Pentecostal believer is a supernatural vessel walking on earth to display heaven's light. Yield to Him fully.",
    closingPrayer: "Lord God Almighty, fill us afresh with the fire of Pentecost! We receive the baptism of power and authority to witness. Break every barrier in Liberia, heal the sick, deliver the bound, and let Your Kingdom expand mightily under our hands. In Jesus’ Name, Amen.",
    publishDate: "2026-06-22",
    status: "published"
  },
  {
    id: "lesson_2",
    title: "Sustaining Faith in Trying Times",
    keyScripture: "Habakkuk 3:17-18 - 'Though the fig tree may not blossom... Yet I will rejoice in the LORD, I will joy in the God of my salvation.'",
    introduction: "Trials are certain testing grounds for the believer’s maturity. True faith does not operate on weather conditions; it is anchored on the absolute sovereignty and goodness of God. We look into maintaining spiritual stability even when physical support systems fail.",
    mainPoints: [
      {
        heading: "Understanding the Nature of Tests",
        verses: "James 1:2-4, 1 Peter 1:7",
        content: "Faith that cannot be tested cannot be trusted. Trials are not sent to destroy us, but to purge our motives and mature our character. Real endurance is born during dry seasons."
      },
      {
        heading: "The Weapon of Inexplicable Worship",
        verses: "Job 1:20-22, Acts 16:25",
        content: "Worshipping God when everything is fine is pleasant, but worshipping Him in the middle of a storm is a spiritual weapon. It signals to principalities that your devotion is not bought with comfort."
      }
    ],
    discussionQuestions: [
      "How do we prepare our hearts for testing periods before they arrive?",
      "What scriptures bring you immediate peace when your physical circumstances look desperate?"
    ],
    reflection: "Sorrow may endure for a night, but absolute spiritual joy comes when we look past the high waves and notice Christ walking calmly on the waters with us.",
    closingPrayer: "O Lord My Source, secure my heels on the Rock of Ages. Let my praise never grow silent. Strengthen our brethren in Liberia who are enduring economic or physical trials. Send swift relief and eternal glory. Amen.",
    publishDate: "2026-06-21",
    status: "published"
  }
];

// Curated Videos Sourced from the Pentecostal Ministry
export const INITIAL_VIDEOS: VideoContent[] = [
  // Teachings
  {
    id: "vid_teach_1",
    youtubeId: "vB-B_82o1bY", // General Pentecostal sermons search matches
    title: "Apostolic Authority & Holiness - CoP Teaching",
    category: "teaching",
    description: "Deep bible teaching on upholding the integrity of the Christian faith, holiness, and structural order in the local assembly.",
    addedAt: "2026-06-20"
  },
  {
    id: "vid_teach_2",
    youtubeId: "o54Y8P_N_rU",
    title: "The Holy Spirit as Our Helper - Sunday Sermon",
    category: "teaching",
    description: "A sermon on the daily counsel, fellowship, and absolute reliance on the third Person of the Trinity.",
    addedAt: "2026-06-19"
  },
  // Prayers
  {
    id: "vid_pray_1",
    youtubeId: "U3Ocl2f8rR8",
    title: "Corporate Deliverance & Breakthrough Session",
    category: "prayer",
    description: "Anointed and aggressive prayer session targeting the breaking of foundational curses, sicknesses, and blockages.",
    addedAt: "2026-06-18"
  },
  {
    id: "vid_pray_2",
    youtubeId: "bYre6nCeeCc",
    title: "Midnight Hour Spiritual Warfare Fire",
    category: "prayer",
    description: "Intense midnight prayer coverages for family safety, children protection, and spiritual victory in our nation.",
    addedAt: "2026-06-17"
  },
  // Worship
  {
    id: "vid_wors_1",
    youtubeId: "84B_E7oV-5Y",
    title: "Pentecostal Twi & English Live Worship Medley",
    category: "worship",
    description: "Deep atmospheric worship melodies that usher in the raw weight of God's presence. Songs of adoration and surrender.",
    addedAt: "2026-06-16"
  },
  {
    id: "vid_wors_2",
    youtubeId: "m_Xv_Y0E4kM",
    title: "Praises & Victory Dancing - CoP Liberia Choir",
    category: "worship",
    description: "Joyful high-energy praise sessions celebrating the goodness, triumphs, and eternal redemption bought by the blood of Jesus.",
    addedAt: "2026-06-15"
  }
];

// Church Announcements
export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann_1",
    title: "Nimba County Great Crusade & Mercy Healing Rally",
    date: "July 12 - July 18, 2026",
    description: "Prepare to witness the hand of God! Jointly organized by the National Executive Council of The Church of Pentecost – Liberia. Under the theme 'Behold I Do a New Thing' (Isaiah 43:19). Dynamic preachings by the Apostle-in-Charge, divine healings, spiritual deliverances, and prophetic declarations will take place in Ganta, Nimba County. Bus arrangements will start at central districts in Monrovia. Come expecting a touch from Heaven!",
    type: "crusade",
    image: "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ann_2",
    title: "National Youth & Evangelism Discipleship Seminar",
    date: "August 3 - August 7, 2026",
    description: "All youth clubs, district leaders, and enthusiastic workers are invited to the Central Tabernacle in Monrovia for deep theological grooming, leadership seminars, and digital evangelism strategies. Refreshments provided. Registered supporters receive custom materials and certicates.",
    type: "bible_study",
    image: "https://images.unsplash.com/photo-1511629091441-74f22f7f9855?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ann_3",
    title: "National Fasting & Prayer Shield over Liberia",
    date: "Weekly on Fridays (6:00 AM - 12 Noon)",
    description: "We are calling all assemblies, small chapels, and families to dedicate every Friday morning to fasting and praying for national sanity, the church's boldness, and protection from global instability.",
    type: "prayer_meeting",
    image: "https://images.unsplash.com/photo-1544764200-d834fd210a23?auto=format&fit=crop&w=800&q=80"
  }
];

// Admin and pastoral settings
export const DEFAULT_ADMIN_SETTINGS = {
  pastorWhatsapp: "+231773203324",
  apostleWhatsapp: "+231777490211",
  paypalEmail: "shadrachkbrooks@gmail.com",
  mobileMoneyDetail: "MTN MoMo: +231-773-203324 (Registered: CoP Liberia Ministry)\nOrange Money: +231-777-490211 (Registered: Church growth platform)",
  bankAccountDetail: "EcoBank Liberia Ltd.\nAccount Name: The Church of Pentecost Liberia\nAccount Number: 0021-098745-928\nSwift Code: ECOBLRXX\nBranch: Monrovia Main Branch",
  adminPassphraseAdminHashed: "2312004", // Hidden fallback validation

  // Custom text parameters
  topBarText: "Join national believers for the: NIMBA COUNTY GREAT CRUSADE",
  topBarDate: "July 12–18, 2026",
  headerTitle: "THE CHURCH OF PENTECOST",
  headerSubtitle: "Liberia National Headquarters",
  splashSlogan: "Holiness Unto The Lord",
  lessonsHeroTitle: "Nurturing Disciples through Apostolic Doctrine",
  lessonsHeroVerse: "\"And they continued steadfastly in the apostles' doctrine and fellowship, in the breaking of bread, and in prayers.\" — Acts 2:42",
  lessonsHeroParagraph: "Welcome to the study index. Access scheduled Bible lessons designed to nourish your daily spiritual journey, direct from the national prayer headquarters.",

  // Custom color parameters
  topBarBgColor: "#002244",
  topBarTextColor: "#ffffff",
  headerBgColor: "#003366",
  headerTitleColor: "#ffffff",
  headerSubtitleColor: "#D4AF37",
  lessonsHeroBgColor: "#002244",
  lessonsHeroTextColor: "#ffffff",
  primaryBrandColor: "#D4AF37",

  // Custom Donation Goal parameters
  donationGoalName: "Ganta Crusade Tent & Audio Equipment Support Fund",
  donationGoalTarget: 15000,
  donationGoalCollected: 6250,
  donationGoalCurrency: "USD"
};
