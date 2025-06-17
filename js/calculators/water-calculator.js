/**
 * 希釈倍数と使用薬量から散布水量を計算
 */

class WaterCalculator extends BaseCalculator {
    constructor() {
        super();
        this.dilutionRatioInput = null;
        this.pesticideAmountInput = null;
        this.pesticideUnitSelect = null;
        this.calculateBtn = null;
        this.result = null;
        this.resultUnit = null;
    }

    initialize() {
        this.dilutionRatioInput = document.getElementById('dilution-ratio2');
        this.pesticideAmountInput = document.getElementById('pesticide-amount2');
        this.pesticideUnitSelect = document.getElementById('pesticide-unit2');
        this.calculateBtn = document.getElementById('calculate-water-btn');
        this.result = document.getElementById('water-result');
        this.resultUnit = document.getElementById('water-result-unit');

        // イベントリスナーの設定
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.resultUnit.addEventListener('change', () => this.updateResultDisplay());

        this.initialized = true;
    }

    calculate() {
        const dilutionRatio = this.getInputValue('dilution-ratio2');
        const pesticideAmount = this.getInputValue('pesticide-amount2');
        const pesticideUnit = this.pesticideUnitSelect.value;

        // 入力値の検証
        const dilutionValidation = validateNumber(dilutionRatio, '希釈倍数');
        if (!dilutionValidation.valid) {
            this.showError(dilutionValidation.message);
            return;
        }

        const pesticideValidation = validateNumber(pesticideAmount, '使用薬量');
        if (!pesticideValidation.valid) {
            this.showError(pesticideValidation.message);
            return;
        }

        // 農薬量をリットルに換算
        let pesticideAmountInLiters;
        switch(pesticideUnit) {
            case 'ml':
                pesticideAmountInLiters = pesticideAmount / 1000;
                break;
            case 'l':
                pesticideAmountInLiters = pesticideAmount;
                break;
            case 'g':
                pesticideAmountInLiters = pesticideAmount / 1000; // 密度1を仮定
                break;
            case 'kg':
                pesticideAmountInLiters = pesticideAmount; // 密度1を仮定
                break;
            default:
                pesticideAmountInLiters = pesticideAmount;
        }

        // 必要な散布水量を計算（リットル単位）
        const waterAmountInLiters = pesticideAmountInLiters * dilutionRatio;

        // 結果を表示
        this.displayResultWithUnit(waterAmountInLiters);
    }

    displayResultWithUnit(amountInLiters) {
        const unit = this.resultUnit.value;
        let displayAmount;

        if (unit === 'ml') {
            displayAmount = amountInLiters * 1000;
        } else {
            displayAmount = amountInLiters;
        }

        this.displayResult('water-result', formatNumber(displayAmount));
        this.setDataAttribute('water-result', 'data-original-liters', amountInLiters);
    }

    updateResultDisplay() {
        const originalLiters = this.getDataAttribute('water-result', 'data-original-liters');
        if (originalLiters > 0) {
            this.displayResultWithUnit(originalLiters);
        }
    }
}

// グローバル関数として公開
window.WaterCalculator = WaterCalculator;

// ES6モジュール対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WaterCalculator };
}