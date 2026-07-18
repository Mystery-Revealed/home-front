// games/index.js — registry of playable games. GameManager looks games up here,
// keeping the engine reusable across Texas History units.

import homeFront from './homeFront.js';

export const GAMES = {
  [homeFront.id]: homeFront,
};

export function getGame(id) {
  return GAMES[id] || null;
}
