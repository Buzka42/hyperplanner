import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const [action, uid] = process.argv.slice(2);
if (!['grant', 'revoke'].includes(action) || !uid) {
  console.error('Usage: npm run admin:device -- grant <DEVICE_UID>\n       npm run admin:device -- revoke <DEVICE_UID>');
  process.exit(1);
}

initializeApp({ credential: applicationDefault(), projectId: 'workout-planner-b5bd6' });
const auth = getAuth();
const user = await auth.getUser(uid);
const claims = { ...(user.customClaims || {}) };
if (action === 'grant') claims.admin = true;
else delete claims.admin;
await auth.setCustomUserClaims(uid, claims);
console.log(`${action === 'grant' ? 'Granted' : 'Revoked'} admin authorization for device ${uid}.`);
