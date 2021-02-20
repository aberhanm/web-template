/**
 * @description 解决一些全局的统一bug
 */
import {getScrollWidth} from '@/utils/tools/lib';

/**
 * @description el-table 在chrome里面出现抖动的情况
 */
(() => {
  const isChrome = window.navigator.userAgent.indexOf('Chrome');
  if (isChrome) {
    // el-table在chorme里有些bug，自动计算宽度时会陷入死循环无限抖动
    const barWidth = getScrollWidth();
    const styleText = `
      body .el-table {
        border-right: ${barWidth}px solid transparent;
      }
    `;
    const style = document.createElement('style');
    style.innerText = styleText;
    document.head.appendChild(style);
  }
})();
