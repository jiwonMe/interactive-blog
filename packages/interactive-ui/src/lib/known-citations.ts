export type KnownCitation = {
  title: string;
  apa: string;
  harvard: string;
};

export const KNOWN_CITATIONS: Record<string, KnownCitation> = {
  'https://atrium.lib.uoguelph.ca/server/api/core/bitstreams/b3244236-4cd0-47ba-a157-9abd6e6312f0/content': {
    title: 'Amidakuji: Gray Code Algorithms and Equations for Listing Ladder Lotteries',
    apa:
      'Di Salvo, P. (2021). "Amidakuji: Gray Code Algorithms and Equations for Listing Ladder Lotteries" (Master\'s thesis, University of Guelph). University of Guelph. https://atrium.lib.uoguelph.ca/server/api/core/bitstreams/b3244236-4cd0-47ba-a157-9abd6e6312f0/content',
    harvard:
      'Di Salvo, P. (2021) "Amidakuji: Gray Code Algorithms and Equations for Listing Ladder Lotteries". Master\'s thesis. University of Guelph. Available at: https://atrium.lib.uoguelph.ca/server/api/core/bitstreams/b3244236-4cd0-47ba-a157-9abd6e6312f0/content (Accessed: 13 December 2025).',
  },
  'https://bost.ocks.org/mike/shuffle/compare.html': {
    title: 'Will It Shuffle?',
    apa: 'Bostock, M. (n.d.). Will It Shuffle? bost.ocks.org. https://bost.ocks.org/mike/shuffle/compare.html',
    harvard: 'Bostock, M. (n.d.) Will It Shuffle? bost.ocks.org. Available at: https://bost.ocks.org/mike/shuffle/compare.html (Accessed: 13 December 2025).',
  },
  'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/sort': {
    title: 'Array.prototype.sort() - JavaScript | MDN',
    apa: 'MDN Web Docs. (n.d.). Array.prototype.sort(). Mozilla Developer Network. https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/sort',
    harvard: 'MDN Web Docs (n.d.) Array.prototype.sort(). Mozilla Developer Network. Available at: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/sort (Accessed: 13 December 2025).',
  },
  'https://v8.dev/blog/array-sort': {
    title: 'Getting things sorted in V8',
    apa: 'V8 Team. (2018). Getting things sorted in V8. v8.dev. https://v8.dev/blog/array-sort',
    harvard: 'V8 Team (2018) Getting things sorted in V8. v8.dev. Available at: https://v8.dev/blog/array-sort (Accessed: 13 December 2025).',
  },
};

