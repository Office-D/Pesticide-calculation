/**
 * 使用薬量と散布水量から希釈倍数を計算
 */

class RatioCalculator extends BaseCalculator {
    constructor() {
        super();
        this.pesticideAmountInput = null;
        this.pesticideUnitSelect = null;
        this.waterAmountInput = null;
        this.waterUnitSelect = null;
        this.calculateBtn = null;
        this.result = null;
    }

    initialize() {
        this.pesticideAmountInput = document.getElementById('pesticide-amount3');
        this.pesticideUnitSelect = document.getElementById('pesticide-unit3');
        this.waterAmountInput = document.getElementById('water-amount3');
        this.waterUnitSelect = document.getElementById('water-unit3');
        this.calculateBtn = document.getElementById('calculate-ratio-btn');
        this.result = document.getElementById('ratio-result');

        // イベントリスナーの設定
        this.calculateBtn.addEventListener('click', () => this.calculate());

        this.initialized = true;
    }

    calculate() {
        const pesticideAmount = this.getInputValue('pesticide-amount3');
        const pesticideUnit = this.pesticideUnitSelect.value;
        const waterAmount = this.getInputValue('water-amount3');
        const waterUnit = this.waterUnitSelect.value;

        // 入力値の検証
        const pesticideValidation = validateNumber(pesticideAmount, '使用薬量');
        if (!pesticideValidation.valid) {
            this.showError(pesticideValidation.message);
            return;
        }

        const waterValidation = validateNumber(waterAmount, '散布水量');
        if (!waterValidation.valid) {
            this.showError(waterValidation.message);
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

        // 水量をリットルに換算
        const waterAmountInLiters = convertToLiters(waterAmount, waterUnit === 'ml');

        // 希釈倍数を計算
        const ratio = waterAmountInLiters / pesticideAmountInLiters;

        // 結果を表示
        this.displayResult('ratio-result', formatNumber(ratio));
    }
}

// グローバル関数として公開
window.RatioCalculator = RatioCalculator;

// ES6モジュール対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RatioCalculator };
}