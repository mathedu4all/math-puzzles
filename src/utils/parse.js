/**
 * date utilities based on dayjs
 * @module utils/parse
 */

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import duration from 'dayjs/plugin/duration';

dayjs.locale('zh-cn');
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(relativeTime);
dayjs.extend(duration);

export const parseDay = dayjs;

/**
  * parse unix timestamp to from now.
  * @function
  * @param {number} timestamp - unix timestamp in second
  * @param {number} threshold - show from now within specific days, otherwise show YYYY-MM-DD
  * @returns {string}
  */
export const fromNow = (timestamp, threshold = 3) => {
  const fromNowStr = dayjs(timestamp * 1000).fromNow();
  let label = fromNowStr.includes('小时') ? '今天' : fromNowStr;
  if (label !== '今天') {
    const day = label.match(/\d+/g);
    if (day > threshold) label = dayjs(timestamp * 1000).format('YYYY-MM-DD');
  }
  return label;
};

/**
  * parse milliseconds to duration string.
  * @function
  * @param {number} ms - milliseconds
  * @returns {string} duration string formatted as 'HH:mm:ss.SSS'
  */
export const parseDuration = (ms) => dayjs.duration(ms).format('HH:mm:ss.SSS').slice(0, -2);
