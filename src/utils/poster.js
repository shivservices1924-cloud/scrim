// Gaming Tournament Poster Selector & Helpers
// Strictly maps to Gold & Dark Esports themed vector posters (no purple):
// - Lone Wolf / LW Headshot -> /poster-lone-wolf.svg
// - CS Headshot / CS Normal -> /poster-cs.svg
// - BR Duo / Any Duo -> /poster-br-duo.svg
// - BR Squad -> /poster-squad.svg
// - BR Solo / Default -> /poster-br-solo.svg

export function getTournamentPoster(tournament) {
  if (!tournament) return '/poster-br-solo.svg';

  const cat = String(tournament.category || '').toUpperCase();
  const gameType = String(tournament.gameType || '').toUpperCase();
  const matchType = String(tournament.matchType || '').toUpperCase();
  const title = String(tournament.title || '').toUpperCase();

  // 1. Lone Wolf (1v1 / 2v2)
  if (
    cat.includes('LW') ||
    cat.includes('LONE') ||
    gameType.includes('LW') ||
    gameType.includes('LONE') ||
    title.includes('LONE WOLF') ||
    title.includes('LW ')
  ) {
    return '/poster-lone-wolf.svg';
  }

  // 2. Clash Squad (CS Headshot / CS Normal)
  if (
    cat.includes('CS') ||
    gameType === 'CS' ||
    title.includes('CS ') ||
    title.includes('CLASH SQUAD')
  ) {
    return '/poster-cs.svg';
  }

  // 3. BR Squad
  if (matchType === 'SQUAD' || title.includes('SQUAD') || cat.includes('SQUAD')) {
    return '/poster-squad.svg';
  }

  // 4. BR Duo / Duo Matches
  if (matchType === 'DUO' || title.includes('DUO') || cat.includes('DUO')) {
    return '/poster-br-duo.svg';
  }

  // 5. Custom image ONLY if it is a real uploaded asset and not stock poster / unsplash
  if (
    tournament.banner &&
    typeof tournament.banner === 'string' &&
    tournament.banner.startsWith('/uploads/')
  ) {
    return tournament.banner;
  }

  // 6. Default BR Solo
  return '/poster-br-solo.svg';
}

export function getTournamentPosterSvgFallback(tournament) {
  return '/poster-br-solo.svg';
}

export default getTournamentPoster;
