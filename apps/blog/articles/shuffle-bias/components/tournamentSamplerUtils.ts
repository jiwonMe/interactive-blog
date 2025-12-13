'use client';

export type Dir = 1 | -1;

export type Sample = {
  ab: Dir; // 1: a->b, -1: b->a
  bc: Dir; // 1: b->c, -1: c->b
  ac: Dir; // 1: a->c, -1: c->a
};

export type NodeId = 'a' | 'b' | 'c';

export type Edge = {
  from: NodeId;
  to: NodeId;
  id: 'ab' | 'bc' | 'ac';
};

function randDir(): Dir {
  return Math.random() < 0.5 ? 1 : -1;
}

export function sampleTournament(): Sample {
  return { ab: randDir(), bc: randDir(), ac: randDir() };
}

export function isCycle(s: Sample): boolean {
  // a->b, b->c, c->a  or  b->a, c->b, a->c
  return (s.ab === 1 && s.bc === 1 && s.ac === -1) || (s.ab === -1 && s.bc === -1 && s.ac === 1);
}

export function edgesOf(s: Sample): Edge[] {
  const ab: Edge = s.ab === 1 ? { id: 'ab', from: 'a', to: 'b' } : { id: 'ab', from: 'b', to: 'a' };
  const bc: Edge = s.bc === 1 ? { id: 'bc', from: 'b', to: 'c' } : { id: 'bc', from: 'c', to: 'b' };
  const ac: Edge = s.ac === 1 ? { id: 'ac', from: 'a', to: 'c' } : { id: 'ac', from: 'c', to: 'a' };
  return [ab, bc, ac];
}

export function cmpLatex(a: NodeId, b: NodeId, dir: Dir): string {
  // dir=1 means a<b for (a,b) pair
  if (dir === 1) return `${a} \\lt ${b}`;
  return `${a} \\gt ${b}`;
}


