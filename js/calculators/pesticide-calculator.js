/**
 * 希釈倍数と散布水量から使用薬量を計算
 */

class PesticideCalculator extends BaseCalculator {
    constructor() {
        super();
        this.dilutionRatioInput = null;
        this.waterAmountInput = null;
        this.waterUnitSelect = null;
        this.calculateBtn = null;
        this.result = null;
        this.resultUnit = null;
    }

    initialize() {
        this.dilutionRatioInput = document.getElementById('dilution-ratio1');
        this.waterAmountInput = document.getElementById('water-amount1');
        this.waterUnitSelect = document.getElementById('water-unit1');
        this.calculateBtn = document.getElementById('calculate-pesticide-btn');
        this.result = document.getElementById('pesticide-result');
        this.resultUnit = document.getElementById('pesticide-result-unit');

        // イベントリスナーの設定
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.resultUnit.addEventListener('change', () => this.updateResultDisplay());

        this.initialized = true;
    }

    calculate() {
        const dilutionRatio = this.getInputValue('dilution-ratio1');
        const waterAmount = this.getInputValue('water-amount1');
        const waterUnit = this.waterUnitSelect.value;

        // 入力値の検証
        const dilutionValidation = validateNumber(dilutionRatio, '希釈倍数');
        if (!dilutionValidation.valid) {
            this.showError(dilutionValidation.message);
            return;
        }

        const waterValidation = validateNumber(waterAmount, '散布水量');
        if (!waterValidation.valid) {
            this.showError(waterValidation.message);
            return;
        }

        // 水量をリットルに変換
        const waterAmountInLiters = convertToLiters(waterAmount, waterUnit === 'ml');

        // 必要な農薬量を計算（リットル単位）
        const pesticideAmountInLiters = waterAmountInLiters / dilutionRatio;

        // 結果を表示
        this.displayResultWithUnit(pesticideAmountInLiters);
    }

    displayResultWithUnit(amountInLiters) {
        const unit = this.resultUnit.value;
        let displayAmount;

        switch(unit) {
            case 'ml':
                displayAmount = amountInLiters * 1000;
                break;
            case 'l':
                displayAmount = amountInLiters;
                break;
            case 'g':
                displayAmount = amountInLiters * 1000; // 密度1を仮定
                break;
            case 'kg':
                displayAmount = amountInLiters; // 密度1を仮定
                break;
            default:
                displayAmount = amountInLiters;
        }

        this.displayResult('pesticide-result', formatNumber(displayAmount));
        this.setDataAttribute('pesticide-result', 'data-original-liters', amountInLiters);
    }

    updateResultDisplay() {
        const originalLiters = this.getDataAttribute('pesticide-result', 'data-original-liters');
        if (originalLiters > 0) {
            this.displayResultWithUnit(originalLiters);
        }
    }
}

// グローバル関数として公開（従来の互換性のため）
window.PesticideCalculator = PesticideCalculator;

// ES6モジュール対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PesticideCalculator };
}