/**
 * ppm濃度計算機能
 */

class PpmCalculator extends BaseCalculator {
    constructor() {
        super();
        this.forwardBtn = null;
        this.reverseBtn = null;
        this.volumeBtn = null;
    }

    initialize() {
        this.forwardBtn = document.getElementById('calculate-ppm-forward-btn');
        this.reverseBtn = document.getElementById('calculate-ppm-reverse-btn');
        this.volumeBtn = document.getElementById('calculate-ppm-volume-btn');

        // イベントリスナーの設定
        this.forwardBtn.addEventListener('click', () => this.calculateForward());
        this.reverseBtn.addEventListener('click', () => this.calculateReverse());
        if (this.volumeBtn) {
            this.volumeBtn.addEventListener('click', () => this.calculateVolume());
        }

        this.initialized = true;
    }

    /**
     * 濃度→製品重量計算
     */
    calculateForward() {
        const concentration = this.getInputValue('target-concentration');
        const volume = this.getInputValue('spray-volume');
        const activeIngredient = this.getInputValue('active-ingredient-forward');

        // 入力値の検証
        const concentrationValidation = validateConcentration(concentration);
        if (!concentrationValidation.valid) {
            this.showError(concentrationValidation.message);
            return;
        }

        const volumeValidation = validateNumber(volume, '散布液量');
        if (!volumeValidation.valid) {
            this.showError(volumeValidation.message);
            return;
        }

        const activeValidation = validatePercentage(activeIngredient, '有効成分含有率');
        if (!activeValidation.valid) {
            this.showError(activeValidation.message);
            return;
        }

        // 単位変換
        const state = getPpmState('forward');
        const volumeInLiters = convertToLiters(volume, state.useMilliliter);

        // 計算
        const activeWeightMg = concentration * volumeInLiters;
        const productWeightGrams = (concentration * volumeInLiters) / (activeIngredient * 10);

        // 結果表示
        displayProductWeight(productWeightGrams, 'forward');
        displayActiveWeight(activeWeightMg, 'forward', 'active-weight-result');
    }

    /**
     * 製品重量→濃度計算
     */
    calculateReverse() {
        const productWeight = this.getInputValue('product-weight-input');
        const volume = this.getInputValue('spray-volume-reverse');
        const activeIngredient = this.getInputValue('active-ingredient-reverse');

        // 入力値の検証
        const weightValidation = validateNumber(productWeight, '製品重量');
        if (!weightValidation.valid) {
            this.showError(weightValidation.message);
            return;
        }

        const volumeValidation = validateNumber(volume, '散布液量');
        if (!volumeValidation.valid) {
            this.showError(volumeValidation.message);
            return;
        }

        const activeValidation = validatePercentage(activeIngredient, '有効成分含有率');
        if (!activeValidation.valid) {
            this.showError(activeValidation.message);
            return;
        }

        // 単位変換
        const state = getPpmState('reverse');
        const productWeightGrams = convertToGrams(productWeight, state.useKilogram);
        const volumeInLiters = convertToLiters(volume, state.useMilliliter);

        // 計算
        const concentration = (productWeightGrams * activeIngredient * 10) / volumeInLiters;
        const activeWeightMg = productWeightGrams * activeIngredient * 10;

        // 結果表示
        this.displayResult('concentration-result', formatNumber(concentration));
        displayActiveWeight(activeWeightMg, 'reverse', 'active-weight-reverse-result');
    }

    /**
     * 製品重量→調製可能液量計算
     */
    calculateVolume() {
        const productWeight = this.getInputValue('product-weight-volume');
        const activeIngredient = this.getInputValue('active-ingredient-volume');
        const targetPpm = this.getInputValue('target-ppm-volume');

        // 入力値の検証
        const weightValidation = validateNumber(productWeight, '製品重量');
        if (!weightValidation.valid) {
            this.showError(weightValidation.message);
            return;
        }

        const activeValidation = validatePercentage(activeIngredient, '有効成分含有率');
        if (!activeValidation.valid) {
            this.showError(activeValidation.message);
            return;
        }

        const concentrationValidation = validateConcentration(targetPpm);
        if (!concentrationValidation.valid) {
            this.showError(concentrationValidation.message);
            return;
        }

        // 単位変換
        const state = getPpmState('volume');
        const productWeightGrams = convertToGrams(productWeight, state.useKilogram);

        // 計算
        // 有効成分量(mg) = 製品重量(g) × 含有率(%) × 10
        const activeWeightMg = productWeightGrams * activeIngredient * 10;
        // 調製可能量(L) = 有効成分量(mg) ÷ 目標濃度(ppm)
        const volumeLiters = activeWeightMg / targetPpm;

        // 結果表示
        displayVolumeResult(volumeLiters, 'volume');
        displayActiveWeight(activeWeightMg, 'volume', 'active-weight-volume-result');
    }
}

// グローバル関数として公開（従来の互換性のため）
window.calculatePpmForward = function() {
    if (window.ppmCalculator && window.ppmCalculator.initialized) {
        window.ppmCalculator.calculateForward();
    }
};

window.calculatePpmReverse = function() {
    if (window.ppmCalculator && window.ppmCalculator.initialized) {
        window.ppmCalculator.calculateReverse();
    }
};

window.calculatePpmVolume = function() {
    if (window.ppmCalculator && window.ppmCalculator.initialized) {
        window.ppmCalculator.calculateVolume();
    }
};

window.PpmCalculator = PpmCalculator;

// ES6モジュール対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PpmCalculator };
}