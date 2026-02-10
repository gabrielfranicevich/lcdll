import { SUSTANTIVOS, ADJETIVOS } from '../data/constants';

/**
 * Generates a random player name by combining a random adjective with a random noun
 * @returns {string} A random name like "veloz dragón" or "místico ninja"
 */
export function getRandomName() {
  const sust = SUSTANTIVOS[Math.floor(Math.random() * SUSTANTIVOS.length)];
  const adj = ADJETIVOS[Math.floor(Math.random() * ADJETIVOS.length)];
  return `${adj} ${sust}`;
}
