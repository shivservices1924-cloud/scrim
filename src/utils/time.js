// Match Time Parsing and Expiration Helpers

/**
 * Parses matchTime string into a timestamp (ms)
 * e.g., "Today at 09:00 PM", "09:00 PM", "Tomorrow at 05:00 PM", "2026-11-25T21:00:00"
 */
export function parseMatchTimeString(str) {
  if (!str) return 0;

  // Direct ISO date string
  const direct = new Date(str).getTime();
  if (!isNaN(direct) && String(str).includes('-') && String(str).includes(':')) {
    return direct;
  }

  const now = new Date();
  let baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const lower = String(str).toLowerCase();
  if (lower.includes('tomorrow')) {
    baseDate.setDate(baseDate.getDate() + 1);
  }

  // Look for time pattern: HH:MM AM/PM or HH:MM
  const m = str.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (m) {
    let hours = parseInt(m[1], 10);
    const minutes = m[2] ? parseInt(m[2], 10) : 0;
    const meridian = m[3] ? m[3].toUpperCase() : null;

    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    baseDate.setHours(hours, minutes, 0, 0);
    return baseDate.getTime();
  }

  return 0;
}

/**
 * Gets the tournament scheduled start time in milliseconds
 */
export function getTournamentStartTime(tournament) {
  if (!tournament) return 0;
  if (tournament.scheduledAt) {
    const ts = new Date(tournament.scheduledAt).getTime();
    if (!isNaN(ts) && ts > 0) return ts;
  }
  return parseMatchTimeString(tournament.matchTime);
}

/**
 * Checks whether a tournament is still visible to a user.
 * Rule: If match time has passed (e.g., 9:00 PM passed at 9:01 PM):
 * - If user HAS JOINED (or is admin): returns true (keep visible!)
 * - If user has NOT joined: returns false (hide from upcoming list!)
 */
export function isTournamentVisibleToUser(tournament, hasJoined = false, now = Date.now()) {
  if (!tournament) return false;
  if (tournament.status !== 'UPCOMING') return false;

  // If the user registered / joined, keep it visible so they can view Room ID / details
  if (hasJoined || tournament.isJoined) return true;

  const startTime = getTournamentStartTime(tournament);
  // If no start time found, keep visible
  if (startTime === 0) return true;

  // Expire at or after scheduled start time (e.g., 9:01 for a 9:00 PM tournament)
  return startTime > now;
}

export default {
  parseMatchTimeString,
  getTournamentStartTime,
  isTournamentVisibleToUser
};

