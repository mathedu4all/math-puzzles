/* eslint-disable no-console */
import React, {
  useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';

import { Button, Result } from 'antd';
import { BulbOutlined, ReloadOutlined, UndoOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { LightsOut, useLightsOut } from '../../libs/lightsout';

// module alias not supported in jsdoc
import { updatePuzzleTrial } from '../../api/puzzle';

/**
 * Component for lights out puzzle.
 *
 * @param props - props
 * @category d3
 * @component
 * @example
 * const initial_status_vector = [
 *     1, 0, 1, 0, 0,
 *     1, 1, 0, 1, 1,
 *     0, 0, 1, 1, 1,
 *     1, 1, 0, 1, 1,
 *     0, 1, 0, 0, 0,
 * ]
 * const target_status_vectors =[[
 *     0, 0, 0, 0, 0,
 *     0, 0, 0, 0, 0,
 *     0, 0, 0, 0, 0,
 *     0, 0, 0, 0, 0,
 *     0, 0, 0, 0, 0,
 * ]]
 * const modulus = 2
 * const toggle_matrix = [
 *     [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 *     [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 *     [0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 *     [0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 *     [0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 *     [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 *     [0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 *     [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 *     [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 *     [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 *     [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 *     [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
 *     [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
 *     [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
 *     [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
 *     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0],
 *     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0],
 *     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0],
 *     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0],
 *     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
 *     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
 *     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0],
 *     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0],
 *     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
 *     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1]
 * ]
 * const hint = [0, 2, 3, 7, 9, 18, 20]
 * const optimalStepCount = 9
 * return (
 *   <LightsOutPuzzle
 *      initialStatusVector={initial_status_vector}
 *      targetStatusVectors={target_status_vectors}
 *      modulus={modulus}
 *      toggleMatrix={toggle_matrix}
 *      hint={hint}
 *      optimalStepCount={optimalStepCount}
 *    />
 * )
 *
 */
export const LightsOutPuzzle = (props) => {
  const ref = useRef();

  const {
    initialStatusVector,
    targetStatusVectors,
    modulus,
    toggleMatrix,
    layouts,
    hint,
    puzzleId,
    userTrials,
    optimalStepCount,
  } = props;
  const trials = userTrials?.trials;

  /**
   * ????????????
   * @type {PuzzleTrial}
   */
  const latestTrial = trials?.reduce((pre, cur) => {
    if (cur.created_at > pre.created_at) {
      return cur;
    }
    return pre;
  });

  /**
   * ??????????????????
   */
  const size = Math.sqrt(initialStatusVector?.length);

  const {
    initialState,
    revert,
    reset,
    puzzleState,
    setPuzzleState,
    duration,
    setDuration,
    setRunning,
    durationText,
  } = useLightsOut({
    data: {
      operations: [],
      colors: [],
    },
    created_at: 0,
    last_active: 0,
    seconds_count: 0,
    got_hint: false,
    success: false,
  });

  /**
   * ????????????
   */
  const [puzzle] = useState(
    new LightsOut({
      // selection: d3.select(ref.current),
      canvas: ref.current,
      initialStatusVector,
      targetStatusVectors,
      size,
      modulus,
      toggle_matrix: toggleMatrix,
      layouts,
      state: puzzleState,
      hint,
    }),
  );

  /**
   * ????????????????????????????????????
   */
  useEffect(() => {
    if (latestTrial) {
      setPuzzleState(latestTrial);
      setDuration(latestTrial.seconds_count);
      if (latestTrial.success) {
        setRunning(false);
      } else {
        setRunning(true);
      }
    }
  }, [latestTrial, setDuration, setRunning, setPuzzleState]);

  /**
   * ????????????
   * @param {MouseEvent} e - mouse click event.
   */
  const handleClick = (e) => {
    const elemLeft = e.target.offsetLeft + e.target.clientLeft;
    const elemTop = e.target.offsetTop + e.target.clientTop;
    const x = e.pageX - elemLeft;
    const y = e.pageY - elemTop;
    const triggeredIndex = puzzle.pos2Index(x, y);
    const success = puzzle.toggle(triggeredIndex);
    setPuzzleState((pre) => ({
      ...pre,
      last_active: Math.floor(Date.now() / 1000),
      data: {
        ...pre.data,
        operations: [...pre.data?.operations, triggeredIndex],
      },
      success,
    }));
  };

  /**
   * ?????????????????????
   */
  const handleShowHint = () => {
    puzzle.layouts.show_hint = true;
    setPuzzleState(() => ({
      ...puzzleState,
      got_hint: true,
    }));
  };

  /**
   * ????????????????????????
   */
  useEffect(() => {
    if (puzzleId && puzzleState.created_at) {
      updatePuzzleTrial({
        puzzle_id: puzzleId,
        trial: {
          ...puzzleState,
          seconds_count: duration,
        },
      }).then(() => {
        console.log('user trial updated.');
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzleState]);

  /**
   * ???????????????????????????.
   */
  useEffect(() => {
    if (!latestTrial) {
      setPuzzleState(initialState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestTrial, puzzleId]);

  /**
   * ?????????????????????????????????
   */
  useEffect(() => {
    puzzle.render();
  }, [size, puzzle]);

  useEffect(() => {
    Object.assign(puzzle, {
      // selection: d3.select(ref.current),
      canvas: ref.current,
      initialStatusVector,
      targetStatusVectors,
      size,
      modulus,
      toggleMatrix,
      layouts,
      state: puzzleState,
      hint,
    });
    puzzle.render();
  }, [
    layouts,
    puzzleId,
    puzzleState,
    hint,
    initialStatusVector,
    modulus,
    puzzle,
    size,
    targetStatusVectors,
    toggleMatrix,
  ]);

  return (
    <>
      <div className={styles['puzzle-heading']}>
        <div className={styles['puzzle-heading-stats']}>
          <div className={styles['puzzle-heading-stats-timer']}>
            ??????:
            {durationText}
          </div>
          <div className={styles['puzzle-heading-stats-steps']}>
            {puzzleState?.data?.operations.length}
            /
            {optimalStepCount}
            <span>????????????</span>
          </div>
        </div>
        <div className={styles['puzzle-heading-buttons']}>
          <Button onClick={reset}>
            <ReloadOutlined />
            ????????????
          </Button>
          {puzzleState?.data?.operations.length > 0 && !puzzleState.success && (
            <Button onClick={revert}>
              <UndoOutlined />
              ??????
            </Button>
          )}
          {hint.length > 0 && puzzleState?.data?.operations.length === 0 && (
            <Button onClick={handleShowHint}>
              <BulbOutlined />
              ??????
            </Button>
          )}
        </div>
      </div>
      {puzzleState?.success && <Result status="success" title="????????????." />}
      <div
        className={styles['puzzle-board']}
        style={{ width: layouts.width }}
        hidden={puzzleState?.success}
      >
        <canvas
          onClick={handleClick}
          width={layouts.width}
          height={layouts.width}
          ref={ref}
        />
      </div>
      {/* <div */}
      {/*    className={styles['puzzle-board']} */}
      {/*    style={{width: props.layouts.width}} */}
      {/*    hidden={puzzleState.success} */}
      {/*    ref={ref} */}
      {/* /> */}
    </>
  );
};

LightsOutPuzzle.propTypes = {
  /**
   * puzzle id
   */
  puzzleId: PropTypes.string,
  /**
   * initial status vector
   */
  initialStatusVector: PropTypes.arrayOf(PropTypes.number),
  /**
   * target status vector list
   */
  targetStatusVectors: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  /**
   * number of lights' status types
   */
  modulus: PropTypes.number,
  /**
   * toggle matrix of the puzzle
   */
  toggleMatrix: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  /**
   * optimal step count
   */
  optimalStepCount: PropTypes.number,
  /**
   * layouts params:
   * column width is used when fixed_col_width is true
   * fixed_col_width is set to false when out of bounds
   */
  layouts: PropTypes.shape({
    width: PropTypes.number,
    margin: PropTypes.number,
    col_width: PropTypes.number,
    fixed_col_width: PropTypes.bool,
    show_hint: PropTypes.bool,
    show_text: PropTypes.bool,
  }),
  /**
   * puzzle user trials
   */
  userTrials: PropTypes.arrayOf(
    PropTypes.shape({
      created_by: PropTypes.number,
      trials: PropTypes.arrayOf(
        PropTypes.shape({
          created_at: PropTypes.number,
          data: PropTypes.shape({
            operations: PropTypes.arrayOf(PropTypes.number),
            got_hint: PropTypes.bool,
            last_active: PropTypes.number,
            seconds_count: PropTypes.number,
            success: PropTypes.bool,
          }),
        }),
      ),
    }),
  ),
  /**
   * puzzle hint
   */
  hint: PropTypes.arrayOf(PropTypes.number),
};

LightsOutPuzzle.defaultProps = {
  puzzleId: '',
  userTrials: [],
  layouts: {
    width: 500,
    margin: 20,
    col_width: 50,
    fixed_col_width: false,
    show_hint: false,
    show_text: false,
  },
  initialStatusVector: [
    1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0,
  ],
  targetStatusVectors: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  modulus: 2,
  toggleMatrix: [
    [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1],
  ],
  hint: [0, 2, 3, 7, 9, 18, 20],
  optimalStepCount: 9,
};

export default LightsOutPuzzle;
