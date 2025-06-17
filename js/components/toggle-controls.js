/**
 * トグルスイッチ制御コンポーネント
 */

// ppm計算用の状態管理
const ppmState = {
    forward: {
        useMilliliter: false,
        useKilogram: false,
        useGramActive: false
    },
    reverse: {
        useMilliliter: false,
        useKilogram: false,
        useGramActive: false
    }
};

/**
 * 液量単位のトグル
 * @param {string} type - 'forward' または 'reverse'
 */
function toggleVolumeUnit(type) {
    ppmState[type].useMilliliter = !ppmState[type].useMilliliter;
    const toggle = document.getElementById(`volume-toggle-${type}`);
    toggle.classList.toggle('active');
    
    // 計算結果が表示されている場合は再計算
    if (type === 'forward' && document.getElementById('product-weight-result').textContent !== '-') {
        window.calculatePpmForward();
    } else if (type === 'reverse' && document.getElementById('concentration-result').textContent !== '-') {
        window.calculatePpmReverse();
    }
}

/**
 * 重量単位のトグル
 * @param {string} type - 'forward' または 'reverse'
 */
function toggleWeightUnit(type) {
    ppmState[type].useKilogram = !ppmState[type].useKilogram;
    const toggle = document.getElementById(`weight-toggle-${type}`);
    toggle.classList.toggle('active');
    
    // 結果の再表示
    if (type === 'forward') {
        const originalGrams = parseFloat(document.getElementById('product-weight-result').getAttribute('data-grams') || 0);
        if (originalGrams > 0) {
            displayProductWeight(originalGrams, type);
        }
    } else if (type === 'reverse' && document.getElementById('concentration-result').textContent !== '-') {
        window.calculatePpmReverse();
    }
}

/**
 * 有効成分量単位のトグル
 * @param {string} type - 'forward' または 'reverse'
 */
function toggleActiveUnit(type) {
    ppmState[type].useGramActive = !ppmState[type].useGramActive;
    const toggle = document.getElementById(`active-toggle-${type}`);
    toggle.classList.toggle('active');
    
    // 結果の再表示
    const resultId = type === 'forward' ? 'active-weight-result' : 'active-weight-reverse-result';
    const originalMg = parseFloat(document.getElementById(resultId).getAttribute('data-mg') || 0);
    if (originalMg > 0) {
        displayActiveWeight(originalMg, type, resultId);
    }
}

/**
 * 製品重量の表示
 * @param {number} grams - グラム単位の重量
 * @param {string} type - 'forward' または 'reverse'
 */
function displayProductWeight(grams, type) {
    const result = document.getElementById('product-weight-result');
    const value = ppmState[type].useKilogram ? grams / 1000 : grams;
    result.textContent = formatNumber(value);
    result.setAttribute('data-grams', grams);
}

/**
 * 有効成分量の表示
 * @param {number} mg - mg単位の有効成分量
 * @param {string} type - 'forward' または 'reverse'
 * @param {string} elementId - 表示要素のID
 */
function displayActiveWeight(mg, type, elementId) {
    const result = document.getElementById(elementId);
    const value = ppmState[type].useGramActive ? mg / 1000 : mg;
    result.textContent = formatNumber(value);
    result.setAttribute('data-mg', mg);
}

/**
 * ppm状態を取得
 * @param {string} type - 'forward' または 'reverse'
 * @returns {object} 状態オブジェクト
 */
function getPpmState(type) {
    return ppmState[type];
}

// ES6モジュール対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleVolumeUnit,
        toggleWeightUnit,
        toggleActiveUnit,
        displayProductWeight,
        displayActiveWeight,
        getPpmState
    };
}

// グローバルスコープにも追加
window.toggleVolumeUnit = toggleVolumeUnit;
window.toggleWeightUnit = toggleWeightUnit;
window.toggleActiveUnit = toggleActiveUnit;
window.displayProductWeight = displayProductWeight;
window.displayActiveWeight = displayActiveWeight;
window.getPpmState = getPpmState;