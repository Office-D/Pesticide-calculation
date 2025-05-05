document.addEventListener('DOMContentLoaded', function() {
    // タブ切り替え機能
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 全てのタブボタンからアクティブクラスを削除
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // クリックされたタブボタンにアクティブクラスを追加
            this.classList.add('active');
            
            // 全てのタブコンテンツを非表示に
            tabContents.forEach(content => content.classList.remove('active'));
            // クリックされたタブに対応するコンテンツを表示
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // === 全角→半角変換のヘルパー関数 ===
    
    // 全角数字を半角数字に変換
    function convertFullWidthToHalfWidth(str) {
        return str.replace(/[０-９．]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        }).replace(/[、]/g, '.'); // 読点も小数点に変換
    }
    
    // 数値入力欄に全角→半角変換と数値検証を適用
    const allNumberInputs = document.querySelectorAll('input[type="number"]');
    allNumberInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const fullWidthValue = e.target.value;
            
            // 全角を半角に変換
            const halfWidthValue = convertFullWidthToHalfWidth(fullWidthValue);
            
            // 数値と小数点のみを許可する正規表現
            const numericRegex = /^[0-9]*\.?[0-9]*$/;
            
            // 半角変換後の値が異なる場合、または数値以外の文字が含まれる場合
            if (fullWidthValue !== halfWidthValue || !numericRegex.test(halfWidthValue)) {
                // カーソル位置を記憶
                const start = this.selectionStart;
                const end = this.selectionEnd;
                
                // 数値と小数点以外の文字を削除した値を取得
                let sanitizedValue = halfWidthValue.replace(/[^0-9.]/g, '');
                
                // 複数の小数点がある場合、最初の小数点のみを残す
                const firstDecimalIndex = sanitizedValue.indexOf('.');
                if (firstDecimalIndex !== -1) {
                    const beforeDecimal = sanitizedValue.substring(0, firstDecimalIndex + 1);
                    const afterDecimal = sanitizedValue.substring(firstDecimalIndex + 1).replace(/\./g, '');
                    sanitizedValue = beforeDecimal + afterDecimal;
                }
                
                // 元の文字数と新しい文字数の差
                const lengthDiff = fullWidthValue.length - sanitizedValue.length;
                
                // 値を設定
                this.value = sanitizedValue;
                
                // カーソル位置を調整
                if (start - lengthDiff >= 0) {
                    this.setSelectionRange(start - lengthDiff, end - lengthDiff);
                } else {
                    this.setSelectionRange(0, 0);
                }
            }
        });
    });
    
    // === 単位変換のヘルパー関数 ===
    
    // 数値を適切なフォーマットで表示
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
            return Math.round(value);
        }
    }
    
    // === タブ1: 希釈倍数と散布水量から使用薬量を計算 ===
    const dilutionRatio1Input = document.getElementById('dilution-ratio1');
    const waterAmount1Input = document.getElementById('water-amount1');
    const waterUnit1Select = document.getElementById('water-unit1');
    const calculatePesticideBtn = document.getElementById('calculate-pesticide-btn');
    const pesticideResult = document.getElementById('pesticide-result');
    const pesticideResultUnit = document.getElementById('pesticide-result-unit');
    
    // 計算ボタンのクリックイベント
    calculatePesticideBtn.addEventListener('click', function() {
        // 入力値の取得
        const dilutionRatio = parseFloat(dilutionRatio1Input.value);
        const waterAmount = parseFloat(waterAmount1Input.value);
        const waterUnit = waterUnit1Select.value;
        
        // 入力値の検証
        if (isNaN(dilutionRatio) || dilutionRatio <= 0) {
            alert('有効な希釈倍数を入力してください');
            return;
        }
        
        if (isNaN(waterAmount) || waterAmount <= 0) {
            alert('有効な散布水量を入力してください');
            return;
        }
        
        // 水量をリットルに変換
        let waterAmountInLiters;
        if (waterUnit === 'ml') {
            waterAmountInLiters = waterAmount / 1000;
        } else {
            waterAmountInLiters = waterAmount;
        }
        
        // 必要な農薬量を計算（リットル単位）
        // 例: 500L ÷ 1000倍 = 0.5L の農薬
        const pesticideAmountInLiters = waterAmountInLiters / dilutionRatio;
        
        // 表示する単位に応じた値を計算
        calculateResultDisplay(pesticideAmountInLiters);
    });
    
    // 結果の単位変更時の処理
    pesticideResultUnit.addEventListener('change', function() {
        const originalLiters = parseFloat(pesticideResult.getAttribute('data-original-liters') || 0);
        if (originalLiters > 0) {
            calculateResultDisplay(originalLiters);
        }
    });
    
    // 選択された単位に基づいて結果を表示
    function calculateResultDisplay(amountInLiters) {
        const unit = pesticideResultUnit.value;
        let displayAmount;
        
        switch(unit) {
            case 'ml':
                displayAmount = amountInLiters * 1000; // L -> mL
                break;
            case 'l':
                displayAmount = amountInLiters; // L -> L
                break;
            case 'g':
                displayAmount = amountInLiters * 1000; // L -> g (密度1を仮定)
                break;
            case 'kg':
                displayAmount = amountInLiters; // L -> kg (密度1を仮定)
                break;
            default:
                displayAmount = amountInLiters;
        }
        
        // 結果を表示
        pesticideResult.textContent = formatNumber(displayAmount);
        // 元のリットル単位での値を保存
        pesticideResult.setAttribute('data-original-liters', amountInLiters);
    }
    
    // === タブ2: 希釈倍数と使用薬量から散布水量を計算 ===
    const dilutionRatio2Input = document.getElementById('dilution-ratio2');
    const pesticideAmount2Input = document.getElementById('pesticide-amount2');
    const pesticideUnit2Select = document.getElementById('pesticide-unit2');
    const calculateWaterBtn = document.getElementById('calculate-water-btn');
    const waterResult = document.getElementById('water-result');
    const waterResultUnit = document.getElementById('water-result-unit');
    
    // 計算ボタンのクリックイベント
    calculateWaterBtn.addEventListener('click', function() {
        // 入力値の取得
        const dilutionRatio = parseFloat(dilutionRatio2Input.value);
        const pesticideAmount = parseFloat(pesticideAmount2Input.value);
        const pesticideUnit = pesticideUnit2Select.value;
        
        // 入力値の検証
        if (isNaN(dilutionRatio) || dilutionRatio <= 0) {
            alert('有効な希釈倍数を入力してください');
            return;
        }
        
        if (isNaN(pesticideAmount) || pesticideAmount <= 0) {
            alert('有効な使用薬量を入力してください');
            return;
        }
        
        // 農薬量をリットルに換算
        let pesticideAmountInLiters;
        switch(pesticideUnit) {
            case 'ml':
                pesticideAmountInLiters = pesticideAmount / 1000; // mL -> L
                break;
            case 'l':
                pesticideAmountInLiters = pesticideAmount; // L -> L
                break;
            case 'g':
                pesticideAmountInLiters = pesticideAmount / 1000; // g -> L (密度1を仮定)
                break;
            case 'kg':
                pesticideAmountInLiters = pesticideAmount; // kg -> L (密度1を仮定)
                break;
            default:
                pesticideAmountInLiters = pesticideAmount;
        }
        
        // 必要な散布水量を計算（リットル単位）
        // 例: 0.5L × 1000倍 = 500L の水
        const waterAmountInLiters = pesticideAmountInLiters * dilutionRatio;
        
        // 表示単位に応じた水量を計算
        calculateWaterDisplay(waterAmountInLiters);
    });
    
    // 水量の結果の単位変更時の処理
    waterResultUnit.addEventListener('change', function() {
        const originalLiters = parseFloat(waterResult.getAttribute('data-original-liters') || 0);
        if (originalLiters > 0) {
            calculateWaterDisplay(originalLiters);
        }
    });
    
    // 選択された単位に基づいて水量結果を表示
    function calculateWaterDisplay(amountInLiters) {
        const unit = waterResultUnit.value;
        let displayAmount;
        
        if (unit === 'ml') {
            displayAmount = amountInLiters * 1000; // L -> mL
        } else {
            displayAmount = amountInLiters; // L -> L
        }
        
        // 結果を表示
        waterResult.textContent = formatNumber(displayAmount);
        // 元のリットル単位での値を保存
        waterResult.setAttribute('data-original-liters', amountInLiters);
    }
    
    // === タブ3: 使用薬量と散布水量から希釈倍数を計算 ===
    const pesticideAmount3Input = document.getElementById('pesticide-amount3');
    const pesticideUnit3Select = document.getElementById('pesticide-unit3');
    const waterAmount3Input = document.getElementById('water-amount3');
    const waterUnit3Select = document.getElementById('water-unit3');
    const calculateRatioBtn = document.getElementById('calculate-ratio-btn');
    const ratioResult = document.getElementById('ratio-result');
    
    // 計算ボタンのクリックイベント
    calculateRatioBtn.addEventListener('click', function() {
        // 入力値の取得
        const pesticideAmount = parseFloat(pesticideAmount3Input.value);
        const pesticideUnit = pesticideUnit3Select.value;
        const waterAmount = parseFloat(waterAmount3Input.value);
        const waterUnit = waterUnit3Select.value;
        
        // 入力値の検証
        if (isNaN(pesticideAmount) || pesticideAmount <= 0) {
            alert('有効な使用薬量を入力してください');
            return;
        }
        
        if (isNaN(waterAmount) || waterAmount <= 0) {
            alert('有効な散布水量を入力してください');
            return;
        }
        
        // 農薬量をリットルに換算
        let pesticideAmountInLiters;
        switch(pesticideUnit) {
            case 'ml':
                pesticideAmountInLiters = pesticideAmount / 1000; // mL -> L
                break;
            case 'l':
                pesticideAmountInLiters = pesticideAmount; // L -> L
                break;
            case 'g':
                pesticideAmountInLiters = pesticideAmount / 1000; // g -> L (密度1を仮定)
                break;
            case 'kg':
                pesticideAmountInLiters = pesticideAmount; // kg -> L (密度1を仮定)
                break;
            default:
                pesticideAmountInLiters = pesticideAmount;
        }
        
        // 水量をリットルに換算
        let waterAmountInLiters;
        if (waterUnit === 'ml') {
            waterAmountInLiters = waterAmount / 1000; // mL -> L
        } else {
            waterAmountInLiters = waterAmount; // L -> L
        }
        
        // 希釈倍数を計算
        // 例: 500L ÷ 0.5L = 1000倍
        const ratio = waterAmountInLiters / pesticideAmountInLiters;
        
        // 結果を表示
        ratioResult.textContent = formatNumber(ratio);
    });
    
    // === タブ4: くん煙剤の計算 ===
    const greenhouseWidthInput = document.getElementById('greenhouse-width');
    const greenhouseLengthInput = document.getElementById('greenhouse-length');
    const greenhouseHeightInput = document.getElementById('greenhouse-height');
    const greenhouseCountInput = document.getElementById('greenhouse-count');
    const greenhouseVolumeSpan = document.getElementById('greenhouse-volume');
    const fumigantStandardVolumeInput = document.getElementById('fumigant-standard-volume');
    const fumigantStandardAmountInput = document.getElementById('fumigant-standard-amount');
    const calculateFumigantBtn = document.getElementById('calculate-fumigant-btn');
    const fumigantResult = document.getElementById('fumigant-result');
    
    // ハウス寸法入力時にリアルタイムで容積を計算・表示
    function updateGreenhouseVolume() {
        const width = parseFloat(greenhouseWidthInput.value) || 0;
        const length = parseFloat(greenhouseLengthInput.value) || 0;
        const height = parseFloat(greenhouseHeightInput.value) || 0;
        const count = parseInt(greenhouseCountInput.value) || 1;
        
        if (width > 0 && length > 0 && height > 0 && count > 0) {
            const volume = width * length * height * count;
            greenhouseVolumeSpan.textContent = formatNumber(volume);
            return volume;
        } else {
            greenhouseVolumeSpan.textContent = '-';
            return 0;
        }
    }
    
    // 寸法入力時にリアルタイムで容積を更新
    greenhouseWidthInput.addEventListener('input', updateGreenhouseVolume);
    greenhouseLengthInput.addEventListener('input', updateGreenhouseVolume);
    greenhouseHeightInput.addEventListener('input', updateGreenhouseVolume);
    greenhouseCountInput.addEventListener('input', updateGreenhouseVolume);
    
    // くん煙剤計算ボタンのクリックイベント
    calculateFumigantBtn.addEventListener('click', function() {
        // ハウス容積を取得
        const greenhouseVolume = updateGreenhouseVolume();
        
        // 基準値を取得
        const standardVolume = parseFloat(fumigantStandardVolumeInput.value);
        const standardAmount = parseFloat(fumigantStandardAmountInput.value);
        
        // 入力値の検証
        if (greenhouseVolume <= 0) {
            alert('有効なハウス寸法を入力してください');
            return;
        }
        
        if (isNaN(standardVolume) || standardVolume <= 0) {
            alert('有効な基準容積を入力してください');
            return;
        }
        
        if (isNaN(standardAmount) || standardAmount <= 0) {
            alert('有効な基準使用量を入力してください');
            return;
        }
        
        // くん煙剤の必要量を計算
        // 使用薬量(g) = ハウス容積(㎥) ÷ 基準容積(㎥) × 基準使用量(g)
        const requiredAmount = greenhouseVolume / standardVolume * standardAmount;
        
        // 結果を表示
        fumigantResult.textContent = formatNumber(requiredAmount);
    });
});