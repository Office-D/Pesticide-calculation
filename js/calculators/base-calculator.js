/**
 * 基本計算機能の共通クラス
 */

class BaseCalculator {
    constructor() {
        this.initialized = false;
    }

    /**
     * 入力値を取得
     * @param {string} id - 要素ID
     * @returns {number} 入力値
     */
    getInputValue(id) {
        return parseFloat(document.getElementById(id).value);
    }

    /**
     * 結果を表示
     * @param {string} id - 要素ID
     * @param {string|number} value - 表示する値
     */
    displayResult(id, value) {
        document.getElementById(id).textContent = value;
    }

    /**
     * データ属性を設定
     * @param {string} id - 要素ID
     * @param {string} attr - 属性名
     * @param {string|number} value - 属性値
     */
    setDataAttribute(id, attr, value) {
        document.getElementById(id).setAttribute(attr, value);
    }

    /**
     * データ属性を取得
     * @param {string} id - 要素ID
     * @param {string} attr - 属性名
     * @returns {number} 属性値
     */
    getDataAttribute(id, attr) {
        return parseFloat(document.getElementById(id).getAttribute(attr) || 0);
    }

    /**
     * エラーメッセージを表示
     * @param {string} message - エラーメッセージ
     */
    showError(message) {
        alert(message);
    }

    /**
     * 初期化処理（各サブクラスで実装）
     */
    initialize() {
        throw new Error('initialize method must be implemented');
    }
}

// ES6モジュール対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BaseCalculator };
}

// グローバルスコープにも追加
window.BaseCalculator = BaseCalculator;