/* eslint-disable no-console */
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */

import * as d3 from 'd3';

/**
 * Reusable Lights Out Puzzle class.
 * @category d3
 * @example
 * const lightsOutPuzzle = new LightsOut({
 *  element: document.getElementsByClassName(".example"),
 *  initialStatusVector: [
 *    1, 0, 1, 0, 0,
 *    1, 1, 0, 1, 1,
 *    0, 0, 1, 1, 1,
 *    1, 1, 0, 1, 1,
 *    0, 1, 0, 0, 0,
 * ],
 * targetStatusVectors: [[
 *    0, 0, 0, 0, 0,
 *    0, 0, 0, 0, 0,
 *    0, 0, 0, 0, 0,
 *    0, 0, 0, 0, 0,
 *    0, 0, 0, 0, 0]],
 * modulus: 2,
 * size: 5,
 * toggleMatrix: [
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
 * ],
 * hint: [0, 2, 3, 7, 9, 18, 20],
});
lightsOutPuzzle.render();
*/

class LightsOut {
  /**
   * Create a new lights out puzzle layout.
   * @constructor
   *
   * @param {Object} params - constructor params
   * @param {d3.Selection} params.selection -  container selection
   * @param {HTMLCanvasElement} params.canvas - canvas element
   * @param {number} params.size - rows/columns of the puzzle board
   * @param {number[]} params.initialStatusVector - initial status vector of the puzzle
   * @param {number} params.modulus - number of lights' status types
   * @param {number[][]} params.toggleMatrix - toggle matrix of the puzzle
   * @param {number[][]} params.targetStatusVectors - target status vectors of the puzzle
   * @param {Object} params.layouts - layouts params.
   * @param {Object} params.state - react state for puzzle components
   * @param {boolean} params.hint - whether user got hint
   * @property {number} params.hint - puzzle hint
   * @property {PuzzleTrial} state - react state for puzzle components
   * @property {number[]} state.operations - user history operations
   * @property {Object} layouts - layouts params.
   * @property {number} layouts.width - column width in px
   * @property {number} layouts.margin - margin width in px
   * @property {number} layouts.col_width - col width in px (when fixed_col_width is true)
   * @property {boolean} layouts.fixed_col_width - whether using fixed column width
   * (set to false when out of bounds).
   * @property {boolean} layouts.show_text - whether show text in button
   * @property {boolean} layouts.show_hint - whether show hint
   * @property {d3.Selection} svg - d3 svg element
   * @property {CanvasRenderingContext2D} ctx - canvas context
   */
  constructor({
    selection,
    canvas,
    initialStatusVector,
    targetStatusVectors,
    size,
    modulus,
    toggleMatrix,
    layouts,
    state,
    hint,
  }) {
    this.selection = selection;
    this.canvas = canvas;
    this.size = size;
    this.initialStatusVector = initialStatusVector;
    this.modulus = modulus;
    this.toggleMatrix = toggleMatrix;
    this.targetStatusVectors = targetStatusVectors;
    this.layouts = {
      width: 800,
      margin: 20,
      col_width: 50,
      fixed_col_width: false,
      show_text: false,
      show_hint: false,
      ...layouts,
    };
    this.hint = hint;
    this.svg = null;
    this.ctx = null;
    this.state = state;
    this.elemLeft = 0;
    this.elemTop = 0;
    this._currentStatusVector = this.initialStatusVector;
  }

  /**
   * Convert row/col position to index.
   *
   * @param {number} row - row of the light
   * @param {number} col - column of the light
   * @param {number} size - rows/cols of the puzzle board
   * @returns {number} - index of the light
   * @static
   * @public
   *
   */
  static rowCol2Index(row, col, size) {
    return row * size + col;
  }

  /**
   * Convert index to row/col position.
   *
   * @static
   * @public
   * @param {number} index - index of the light.
   * @param {number} size - row/cols of th puzzle board
   * @returns {{col: number, row: number}} - row/col position of the light
   */
  static index2RowCol(index, size) {
    return {
      row: Math.floor(index / size),
      col: index % size,
    };
  }

  /**
   * Convert position cords (in px) to index.
   * @param {number} x - x-axis cord
   * @param {number} y - y-axis cord
   * @return {number} - index of the light
   */
  pos2Index(x, y) {
    const col = Math.floor(this._scale.invert(x - this.layouts.margin));
    const row = Math.floor(this._scale.invert(y - this.layouts.margin));
    return LightsOut.rowCol2Index(row, col, this.size);
  }

  /**
   * Toggle the light with specific index, return true if success.
   *
   * @public
   * @param {number} index - index of the light
   *
   */
  toggle(index) {
    this.layouts.show_hint = false;
    const toggleVector = this.getToggleVector(index);
    this._currentStatusVector = this._currentStatusVector.map(
      (d, i) => (d + toggleVector[i]) % this.modulus,
    );
    let success = false;
    this.targetStatusVectors.map((v) => {
      if (JSON.stringify(v) === JSON.stringify(this._currentStatusVector)) {
        success = true;
      }
      return true;
    });

    return success;
  }

  /**
   * Load from react state.
   * @private
   */
  loadState() {
    this._currentStatusVector = this.initialStatusVector;
    this.state?.data?.operations.map((index) => {
      if (index < this.initialStatusVector.length) {
        this.toggle(index);
      }
      return true;
    });
  }

  /**
   * Get toggle vector of the light with specific index.
   * @private
   * @param {number} index - index of the light
   */
  getToggleVector(index) {
    const transposedToggleMatrix = this.toggleMatrix[0].map(
      (col, i) => this.toggleMatrix.map((row) => row[i]),
    );
    return transposedToggleMatrix[index];
  }

  /**
   * Render the puzzle.
   */
  render() {
    console.log('render triggered');

    this._boardWidth = this.layouts.width - 2 * this.layouts.margin;
    this.buildScale();
    this.loadState();

    const data = this._currentStatusVector.map((d, i) => {
      const { row, col } = LightsOut.index2RowCol(i, this.size);
      return {
        index: i,
        data: d,
        row,
        col,
        hint: this.layouts.show_hint && this.hint.includes(i),
        text: this.layouts.show_text ? d : '',
      };
    });
    if (this.canvas) {
      this.renderCanvas(data);
    } else if (this.selection) {
      this.renderSVG(data);
    }
  }

  /**
   * Create scale of the graph
   * @private
   */
  buildScale() {
    this._scale = d3
      .scaleLinear()
      .range([0, this._boardWidth])
      .domain([0, this.size]);
  }

  /**
   * Render the puzzle with SVG
   * @param {Object} data - current status data
   */
  renderSVG(data) {
    this.buildSVG();
    this.drawBoardSVG(data);
  }

  /**
   * Build the SVG element that will contain the chart.
   * @private
   */
  buildSVG() {
    if (!this.svg) {
      this.svg = this.selection.append('svg').classed('puzzle-board', true);
    }
    const {
      fixed_col_width: fixedColWidth, margin, width, col_width: colWidth,
    } = this.layouts;
    const isOutBound = colWidth * this.size + 2 * margin > width;

    if (fixedColWidth && !isOutBound) {
      this.layouts.margin = (this.layouts.size - colWidth * this.size) / 2;
    } else {
      this.layouts.col_width = (width - 2 * margin) / this.size;
    }

    this.svg
      .attr('width', this.layouts.width)
      .attr('height', this.layouts.width)
      .append('g')
      .classed('button-groups', true)
      .attr(
        'transform',
        `translate(${this.layouts.margin},${this.layouts.margin})`,
      );
  }

  /**
   * Draw puzzle board with d3.
   * @param {Object} data - current status data
   * @private
   */
  drawBoardSVG(data) {
    const rects = this.svg.select('.button-groups').selectAll('g').data(data);

    rects.join(
      (enter) => {
        const obj = this;
        const buttonGroup = enter.append('g');
        buttonGroup
          .append('rect')
          .attr('width', this._scale(1))
          .attr('height', this._scale(1))
          .attr('x', (d) => this._scale(d.col))
          .attr('y', (d) => this._scale(d.row))
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('fill-opacity', 0)
          .transition()
          .duration(100)
          .attr('fill', (d) => (d.data === 0 ? 'white' : 'red'))
          .attr('fill-opacity', (d) => (d.data + 1) / obj.modulus);

        buttonGroup
          .append('text')
          .text((d) => d.text)
          .style('text-anchor', 'middle')
          .style('font-size', 40)
          .attr('fill-opacity', 1)
          .style('cursor', 'pointer')
          .attr('x', (d) => this._scale(d.col + 0.5))
          .attr('y', (d) => this._scale(d.row + 0.5));

        buttonGroup
          .append('circle')
          .attr('fill', 'black')
          .attr('fill-opacity', (d) => (d.hint ? 1 : 0))
          .style('cursor', 'pointer')
          .attr('r', 10)
          .attr('cx', (d) => this._scale(d.col + 0.5))
          .attr('cy', (d) => this._scale(d.row + 0.5));
      },
      (update) => {
        update.select('text').text((d) => d.text);
        update
          .select('rect')
          .transition()
          .duration(100)
          .attr('fill', (d) => (d.data === 0 ? 'white' : 'red'))
          .attr('fill-opacity', (d) => (d.data + 1) / this.modulus);
        update
          .select('circle')
          .attr('fill', 'black')
          .attr('fill-opacity', (d) => (d.hint ? 1 : 0));
      },
      (exit) => {
        exit.transition().duration(100).style('opacity', 0).remove();
      },
    );
  }

  renderCanvas(data) {
    if (!this.canvas) {
      return;
    }

    this.ctx = this.ctx ?? this.canvas.getContext('2d');
    const { ctx } = this;

    if (!ctx) {
      return;
    }

    ctx.resetTransform();
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 500, 500);
    ctx.setTransform(1, 0, 0, 1, this.layouts.margin, this.layouts.margin);
    data.map((d) => {
      if (d.data === 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${(d.data + 1) / this.modulus})`;
      } else {
        ctx.fillStyle = `rgba(255, 0, 0, ${(d.data + 1) / this.modulus})`;
      }
      ctx.strokeStyle = 'black';
      ctx.fillRect(
        this._scale(d.col),
        this._scale(d.row),
        this._scale(1),
        this._scale(1),
      );
      ctx.strokeRect(
        this._scale(d.col),
        this._scale(d.row),
        this._scale(1),
        this._scale(1),
      );

      ctx.fillStyle = 'black';
      ctx.fillText(d.text, this._scale(d.col + 0.5), this._scale(d.row + 0.5));

      if (d.hint) {
        ctx.beginPath();
        ctx.arc(
          this._scale(d.col + 0.5),
          this._scale(d.row + 0.5),
          10,
          0,
          2 * Math.PI,
        );
        ctx.fill();
        ctx.closePath();
      }

      return true;
    });
  }
}

export default LightsOut;
