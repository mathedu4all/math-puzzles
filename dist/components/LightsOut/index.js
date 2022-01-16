/* eslint-disable no-console */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Result } from 'antd';
import { BulbOutlined, ReloadOutlined, UndoOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import LightsOut from '../../libs/lightsout'; // module alias not supported in jsdoc

import { useDuration } from '../../utils/puzzle';
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

export const LightsOutPuzzle = props => {
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
    optimalStepCount
  } = props;
  const trials = userTrials?.trials;
  /**
   * 游戏历史
   * @type {PuzzleTrial}
   */

  const latestTrial = trials?.reduce((pre, cur) => {
    if (cur.created_at > pre.created_at) {
      return cur;
    }

    return pre;
  });
  /**
   * 游戏记录
   * @type {PuzzleTrial}
   */

  const initialTrial = useMemo(() => ({
    data: {
      operations: [],
      colors: []
    },
    created_at: 0,
    last_active: 0,
    seconds_count: 0,
    got_hint: false,
    success: false
  }), []);
  const [puzzleState, setPuzzleState] = useState(initialTrial);
  /**
   * 计算方阵大小
   */

  const size = Math.sqrt(initialStatusVector?.length);
  /**
   * 绘制游戏
   */

  const [puzzle] = useState(new LightsOut({
    // selection: d3.select(ref.current),
    canvas: ref.current,
    initialStatusVector,
    targetStatusVectors,
    size,
    modulus,
    toggle_matrix: toggleMatrix,
    layouts,
    state: puzzleState,
    hint
  }));
  /**
   * 计时器
   */

  const {
    text,
    duration,
    setDuration,
    intervalId,
    setRunning
  } = useDuration(0);
  /**
   * 载入上一次游戏记录和计时
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
  }, [latestTrial, setDuration, setRunning]);
  /**
   * 游戏成功后停止计时
   */

  useEffect(() => {
    if (puzzleState.success) {
      clearInterval(intervalId);
    }
  }, [puzzleState.success, intervalId]);
  /**
   * 重新开始游戏，创建一条新的记录.
   */

  const handleReset = () => {
    setPuzzleState(() => ({ ...initialTrial,
      created_at: Math.floor(Date.now() / 1000),
      last_active: Math.floor(Date.now() / 1000)
    }));
    setDuration(0);
  };
  /**
   * 撤销操作
   */


  const handleRevert = () => {
    setPuzzleState(pre => {
      const operations = [...pre.data.operations];
      operations.pop();
      return { ...pre,
        last_active: Math.floor(Date.now() / 1000),
        data: { ...pre.data,
          operations
        }
      };
    });
  };
  /**
   * 点击操作
   * @param {MouseEvent} e - mouse click event.
   */


  const handleClick = e => {
    const elemLeft = e.target.offsetLeft + e.target.clientLeft;
    const elemTop = e.target.offsetTop + e.target.clientTop;
    const x = e.pageX - elemLeft;
    const y = e.pageY - elemTop;
    const triggeredIndex = puzzle.pos2Index(x, y);
    const success = puzzle.toggle(triggeredIndex);
    setPuzzleState(pre => ({ ...pre,
      last_active: Math.floor(Date.now() / 1000),
      data: { ...pre.data,
        operations: [...pre.data.operations, triggeredIndex]
      },
      success
    }));
  };
  /**
   * 显示提示并记录
   */


  const handleShowHint = () => {
    puzzle.layouts.show_hint = true;
    setPuzzleState(() => ({ ...puzzleState,
      got_hint: true
    }));
  };
  /**
   * 提交用户游戏记录
   */


  useEffect(() => {
    if (puzzleId && puzzleState.created_at) {
      updatePuzzleTrial({
        puzzle_id: puzzleId,
        trial: { ...puzzleState,
          seconds_count: duration
        }
      }).then(() => {
        console.log('user trial updated.');
      });
    }
  }, [puzzleState, duration, puzzleId]);
  /**
   * 题目变更后清空记录.
   */

  useEffect(() => {
    if (!latestTrial) {
      setPuzzleState(initialTrial);
    }
  }, [latestTrial, puzzleId, initialTrial]);
  /**
   * 方阵大小变化后重新绘制
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
      hint
    });
    puzzle.render();
  }, [layouts, puzzleId, puzzleState, hint, initialStatusVector, modulus, puzzle, size, targetStatusVectors, toggleMatrix]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles['puzzle-heading']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['puzzle-heading-stats']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['puzzle-heading-stats-timer']
  }, "\u7528\u65F6:", text), /*#__PURE__*/React.createElement("div", {
    className: styles['puzzle-heading-stats-steps']
  }, puzzleState?.data?.operations.length, "/", optimalStepCount, /*#__PURE__*/React.createElement("span", null, "\u6700\u4F18\u6B65\u6570"))), /*#__PURE__*/React.createElement("div", {
    className: styles['puzzle-heading-buttons']
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: handleReset
  }, /*#__PURE__*/React.createElement(ReloadOutlined, null), "\u91CD\u65B0\u5F00\u59CB"), puzzleState?.data?.operations.length > 0 && !puzzleState.success && /*#__PURE__*/React.createElement(Button, {
    onClick: handleRevert
  }, /*#__PURE__*/React.createElement(UndoOutlined, null), "\u64A4\u9500"), hint.length > 0 && puzzleState.data.operations.length === 0 && /*#__PURE__*/React.createElement(Button, {
    onClick: handleShowHint
  }, /*#__PURE__*/React.createElement(BulbOutlined, null), "\u63D0\u793A"))), puzzleState.success && /*#__PURE__*/React.createElement(Result, {
    status: "success",
    title: "\u6311\u6218\u6210\u529F."
  }), /*#__PURE__*/React.createElement("div", {
    className: styles['puzzle-board'],
    style: {
      width: layouts.width
    },
    hidden: puzzleState.success
  }, /*#__PURE__*/React.createElement("canvas", {
    onClick: handleClick,
    width: layouts.width,
    height: layouts.width,
    ref: ref
  })));
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
    show_text: PropTypes.bool
  }),

  /**
   * puzzle user trials
   */
  userTrials: PropTypes.arrayOf(PropTypes.shape({
    created_by: PropTypes.number,
    trials: PropTypes.arrayOf(PropTypes.shape({
      created_at: PropTypes.number,
      data: PropTypes.shape({
        operations: PropTypes.arrayOf(PropTypes.number),
        got_hint: PropTypes.bool,
        last_active: PropTypes.number,
        seconds_count: PropTypes.number,
        success: PropTypes.bool
      })
    }))
  })),

  /**
   * puzzle hint
   */
  hint: PropTypes.arrayOf(PropTypes.number)
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
    show_text: false
  },
  initialStatusVector: [1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0],
  targetStatusVectors: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
  modulus: 2,
  toggleMatrix: [[1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1]],
  hint: [0, 2, 3, 7, 9, 18, 20],
  optimalStepCount: 9
};
export default LightsOutPuzzle;