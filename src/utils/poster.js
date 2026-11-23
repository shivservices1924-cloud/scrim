// Gaming Tournament Poster Selector & Helpers
// Strictly maps:
// - Lone Wolf / LW Headshot -> /poster-lone-wolf.jpg (svg fallback: /poster-lone-wolf.svg)
// - CS Headshot / CS Normal -> /poster-cs.jpg (svg fallback: /poster-cs.svg)
// - BR Duo / Any Duo -> /poster-br-duo.jpg (svg fallback: /poster-br-duo.svg)
// - BR Solo / Default -> /poster-br-solo.jpg (svg fallback: /poster-br-solo.svg)

export function getTournamentPoster(tournament) {
  if (!tournament) return '/poster-br-solo.jpg';

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
    return '/poster-lone-wolf.jpg';
  }

  // 2. Clash Squad (CS Headshot / CS Normal)
  if (
    cat.includes('CS') ||
    gameType === 'CS' ||
    title.includes('CS ') ||
    title.includes('CLASH SQUAD')
  ) {
    return '/poster-cs.jpg';
  }

  // 3. BR Duo / Duo Matches
  if (matchType === 'DUO' || title.includes('DUO') || cat.includes('DUO')) {
    return '/poster-br-duo.jpg';
  }

  // 4. Custom image ONLY if it is a real uploaded asset and not stock poster / unsplash
  if (
    tournament.banner &&
    typeof tournament.banner === 'string' &&
    tournament.banner.startsWith('/uploads/')
  ) {
    return tournament.banner;
  }

  // 5. Default BR Solo
  return '/poster-br-solo.jpg';
}

export function getTournamentPosterSvgFallback(tournament) {
  const poster = getTournamentPoster(tournament);
  return poster.replace(/\.jpe?g$/, '.svg');
}

export default getTournamentPoster;

