/**
 * 入力値検証ユーティリティ
 */

/**
 * 基本的な数値検証
 * @param {number} value - 検証する値
 * @param {string} fieldName - フィールド名
 * @returns {object} 検証結果
 */
function validateNumber(value, fieldName) {
    if (isNaN(value) || value <= 0) {
        return {
            valid: false,
            message: `有効な${fieldName}を入力してください`
        };
    }
    return { valid: true };
}

/**
 * 百分率検証（0-100%）
 * @param {number} value - 検証する値
 * @param {string} fieldName - フィールド名
 * @returns {object} 検証結果
 */
function validatePercentage(value, fieldName) {
    if (isNaN(value) || value <= 0 || value > 100) {
        return {
            valid: false,
            message: `有効な${fieldName}を入力してください（0-100%）`
        };
    }
    return { valid: true };
}

/**
 * ppm濃度検証
 * @param {number} value - 検証する値
 * @returns {object} 検証結果
 */
function validateConcentration(value) {
    if (isNaN(value) || value <= 0 || value > 100000) {
        return {
            valid: false,
            message: '有効な目標濃度を入力してください（0-100000ppm）'
        };
    }
    return { valid: true };
}

// ES6モジュール対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateNumber,
        validatePercentage,
        validateConcentration
    };
}

// グローバルスコープにも追加
window.validateNumber = validateNumber;
window.validatePercentage = validatePercentage;
window.validateConcentration = validateConcentration;