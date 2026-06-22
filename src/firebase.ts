/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Direct configurations compiled from firebase-applet-config.json
const firebaseConfig = {
  projectId: "tera-bounty-kdzmz",
  appId: "1:785855615601:web:b490fd88e43e13e63001d0",
  apiKey: "AIzaSyCnN7O0xerjonzQqGIm68KqCUHMnEMpo00",
  authDomain: "tera-bounty-kdzmz.firebaseapp.com",
  storageBucket: "tera-bounty-kdzmz.firebasestorage.app",
  messagingSenderId: "785855615601",
};

const app = initializeApp(firebaseConfig);

// Critical: Since we have an explicit non-default Firestore databaseId,
// we initialize it using initializeFirestore with the specific databaseId as the 3rd argument.
export const db = initializeFirestore(app, {}, "ai-studio-59028a8f-66d0-4916-bebc-842e001d5a35");

export const auth = getAuth(app);
export default app;
