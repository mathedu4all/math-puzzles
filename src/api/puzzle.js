/**
 * puzzle api
 * @module api/puzzle
 */

/**
 * @typedef PuzzleTrial
 * @property {Object} data - trial data
 * @property {number[]} data.operations - trial operations
 * @property {number} created_at - created_at
 * @property {number} last_active - last_active
 * @property {number} seconds_count - seconds_count
 * @property {boolean} got_hint - got hint
 * @property {boolean} success - success
 */

/**
 * Upload trial data to a specific puzzle.
 *
 * @param {Object} params - params
 * @param {string} params.puzzle_id - puzzle id
 * @param {PuzzleTrial} params.trial - puzzle trial
 * @return {Promise<{data:PuzzleTrial}>}
 */
export const updatePuzzleTrial = async () => new Promise((resolve) => {
  setTimeout(() => {
    resolve('success');
  }, 300);
});

export default updatePuzzleTrial;
