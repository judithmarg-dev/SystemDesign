import type { CharacterName } from '../theme/types';
import { acorn } from './definitions/acorn';
import { apple } from './definitions/apple';
import { bear } from './definitions/bear';
import { hedgehog } from './definitions/hedgehog';
import { mushroom } from './definitions/mushroom';
import { squirrel } from './definitions/squirrel';
import type { CharacterDefinition } from './types';

export const characters: Record<CharacterName, CharacterDefinition> = {
  bear,
  squirrel,
  hedgehog,
  mushroom,
  acorn,
  apple,
};

export const characterNames = Object.keys(characters) as CharacterName[];

export const getCharacter = (name: CharacterName): CharacterDefinition => characters[name];
