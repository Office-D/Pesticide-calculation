/**
 * 数値フォーマッティングユーティリティ
 */

/**
 * 数値を適切なフォーマットで表示
 * @param {number} value - フォーマットする数値
 * @returns {string} フォーマットされた文字列
 */
function formatNumber(value) {
    if (value < 0.01) {
        return value.toFixed(4);
    } else if (value < 1) {
        return value.toFixed(3);
    } else if (value < 10) {
        return value.toFixed(2);
    } else if (value < 100) {
        return value.toFixed(1);
    } else {
        return Math.round(value).toString();
    }
}

// ES6モジュール対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatNumber };
}

// グローバルスコープにも追加（従来の互換性のため）
window.formatNumber = formatNumber;