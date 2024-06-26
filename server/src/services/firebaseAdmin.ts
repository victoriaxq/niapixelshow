import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = require('./credentials/nia-pixel-show-firebase-adminsdk-d7h8l-9cb06f05c1.json');

const adminApp = initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const adminAuth = getAuth(adminApp);
const firestoreDB = getFirestore(adminApp);

export { adminAuth, firestoreDB };