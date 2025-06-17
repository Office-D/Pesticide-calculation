/**
 * 単位変換ユーティリティ
 */

/**
 * 液量をリットルに変換
 * @param {number} value - 変換する値
 * @param {boolean} useMilliliter - mL単位かどうか
 * @returns {number} リットル単位の値
 */
function convertToLiters(value, useMilliliter) {
    return useMilliliter ? value / 1000 : value;
}

/**
 * 重量をグラムに変換
 * @param {number} value - 変換する値
 * @param {boolean} useKilogram - kg単位かどうか
 * @returns {number} グラム単位の値
 */
function convertToGrams(value, useKilogram) {
    return useKilogram ? value * 1000 : value;
}

/**
 * 重量表示フォーマット
 * @param {number} grams - グラム単位の値
 * @param {boolean} useKilogram - kg表示かどうか
 * @returns {string} フォーマットされた重量文字列
 */
function formatWeight(grams, useKilogram) {
    const value = useKilogram ? grams / 1000 : grams;
    const unit = useKilogram ? 'kg' : 'g';
    return `${formatNumber(value)} ${unit}`;
}

/**
 * 有効成分量表示フォーマット
 * @param {number} mg - mg単位の値
 * @param {boolean} useGram - g表示かどうか
 * @returns {string} フォーマットされた有効成分量文字列
 */
function formatActiveWeight(mg, useGram) {
    const value = useGram ? mg / 1000 : mg;
    const unit = useGram ? 'g' : 'mg';
    return `${formatNumber(value)} ${unit}`;
}

/**
 * 液量表示フォーマット
 * @param {number} liters - リットル単位の値
 * @param {boolean} useMilliliter - mL表示かどうか
 * @returns {string} フォーマットされた液量文字列
 */
function formatVolume(liters, useMilliliter) {
    const value = useMilliliter ? liters * 1000 : liters;
    const unit = useMilliliter ? 'mL' : 'L';
    return `${formatNumber(value)} ${unit}`;
}

// ES6モジュール対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertToLiters,
        convertToGrams,
        formatWeight,
        formatActiveWeight,
        formatVolume
    };
}

// グローバルスコープにも追加
window.convertToLiters = convertToLiters;
window.convertToGrams = convertToGrams;
window.formatWeight = formatWeight;
window.formatActiveWeight = formatActiveWeight;
window.formatVolume = formatVolume;