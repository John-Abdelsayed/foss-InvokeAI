import { NodesState } from './nodesSlice';

/**
 * Nodes slice persist blacklist
 */
const itemsToBlacklist: (keyof NodesState)[] = [
  'schema',
  'invocationTemplates',
];

export const nodesBlacklist = itemsToBlacklist.map(
  (blacklistItem) => `nodes.${blacklistItem}`
);