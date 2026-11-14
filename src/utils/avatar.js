// Gaming Avatar Selector & Helpers

export const GAMING_AVATARS = [
  { id: 'av_1', name: 'Cyber Shinobi', path: '/avatars/avatar-1.svg' },
  { id: 'av_2', name: 'Crown Emperor', path: '/avatars/avatar-2.svg' },
  { id: 'av_3', name: 'Cyber Skull', path: '/avatars/avatar-3.svg' },
  { id: 'av_4', name: 'Phoenix Legend', path: '/avatars/avatar-4.svg' },
  { id: 'av_5', name: 'Venom Cobra', path: '/avatars/avatar-5.svg' },
  { id: 'av_6', name: 'Samurai Demon', path: '/avatars/avatar-6.svg' }
];

export function getUserAvatar(userOrId) {
  if (!userOrId) return GAMING_AVATARS[0].path;

  // If user has explicitly selected avatar
  if (typeof userOrId === 'object' && userOrId.avatar && userOrId.avatar.startsWith('/avatars/')) {
    return userOrId.avatar;
  }

  // Hash user id or username to assign 1 of 6 avatars deterministically
  const seed = typeof userOrId === 'object'
    ? (userOrId.id || userOrId.userId || userOrId.username || 'player')
    : String(userOrId);

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % GAMING_AVATARS.length;
  return GAMING_AVATARS[index].path;
}

export const getPlayerAvatar = getUserAvatar;
export default getUserAvatar;
