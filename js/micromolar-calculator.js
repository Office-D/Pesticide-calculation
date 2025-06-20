/**
 * μmol濃度計算機能
 */

// 薬剤プリセットデータ
const chemicalPresets = {
    glyphosate: {
        name: "グリホサート",
        molecularWeight: 169.07,
        category: "除草剤"
    },
    ga3: {
        name: "ジベレリン (GA3)",
        molecularWeight: 346.37,
        category: "植物ホルモン"
    },
    iaa: {
        name: "インドール酢酸 (IAA)",
        molecularWeight: 175.18,
        category: "オーキシン"
    },
    bap: {
        name: "6-ベンジルアミノプリン (BAP)",
        molecularWeight: 225.25,
        category: "サイトカイニン"
    },
    aba: {
        name: "アブシジン酸 (ABA)",
        molecularWeight: 264.32,
        category: "植物ホルモン"
    },
    "2,4-d": {
        name: "2,4-D",
        molecularWeight: 221.04,
        category: "オーキシン"
    },
    imidacloprid: {
        name: "イミダクロプリド",
        molecularWeight: 255.66,
        category: "殺虫剤"
    },
    thiacloprid: {
        name: "チアクロプリド",
        molecularWeight: 252.72,
        category: "殺虫剤"
    }
};

/**
 * 数値フォーマット関数
 */
function formatMicromolarNumber(value) {
    if (value < 0.0001) return value.toExponential(3);
    else if (value < 0.01) return value.toFixed(6);
    else if (value < 1) return value.toFixed(4);
    else if (value < 10) return value.toFixed(3);
    else if (value < 100) return value.toFixed(2);
    else return value.toFixed(1);
}

/**
 * 入力値を取得
 */
function getMicromolarInputValue(id) {
    const element = document.getElementById(id);
    return element ? parseFloat(element.value) || 0 : 0;
}

/**
 * テキスト入力値を取得
 */
function getMicromolarTextValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
}

/**
 * プリセット薬剤を読み込み (Forward)
 */
function loadPreset() {
    const presetSelect = document.getElementById('chemical-preset');
    const selectedValue = presetSelect.value;
    
    if (selectedValue && chemicalPresets[selectedValue]) {
        const preset = chemicalPresets[selectedValue];
        
        // 薬剤名と分子量を自動入力
        document.getElementById('chemical-name').value = preset.name;
        document.getElementById('molecular-weight').value = preset.molecularWeight;
        
        console.log(`プリセット読み込み: ${preset.name} (${preset.molecularWeight} g/mol)`);
    }
}

/**
 * プリセット薬剤を読み込み (Reverse)
 */
function loadPresetReverse() {
    const presetSelect = document.getElementById('chemical-preset-reverse');
    const selectedValue = presetSelect.value;
    
    if (selectedValue && chemicalPresets[selectedValue]) {
        const preset = chemicalPresets[selectedValue];
        
        // 薬剤名と分子量を自動入力
        document.getElementById('chemical-name-reverse').value = preset.name;
        document.getElementById('molecular-weight-reverse').value = preset.molecularWeight;
        
        console.log(`逆算プリセット読み込み: ${preset.name} (${preset.molecularWeight} g/mol)`);
    }
}

/**
 * μmol濃度計算メイン関数
 */
function calculateMicromolar() {
    console.log('=== μmol計算開始 ===');
    
    // 入力値取得
    const chemicalName = getMicromolarTextValue('chemical-name');
    const molecularWeight = getMicromolarInputValue('molecular-weight');
    const targetConcentration = getMicromolarInputValue('target-micromolar');
    const concentrationUnit = document.getElementById('concentration-unit').value;
    const solutionVolume = getMicromolarInputValue('solution-volume');
    const volumeUnit = document.getElementById('volume-unit').value;
    const activeConcentration = getMicromolarInputValue('active-concentration');
    const productDensity = getMicromolarInputValue('product-density') || 1.0;
    
    // 濃度をμMに統一
    let targetMicromolar;
    switch (concentrationUnit) {
        case 'nM':
            targetMicromolar = targetConcentration / 1000;
            break;
        case 'mM':
            targetMicromolar = targetConcentration * 1000;
            break;
        default: // μM
            targetMicromolar = targetConcentration;
    }
    
    console.log('入力値:', {
        chemicalName, molecularWeight, targetMicromolar, 
        solutionVolume, volumeUnit, activeConcentration, productDensity
    });
    
    // バリデーション
    if (molecularWeight <= 0) {
        alert('分子量を正しく入力してください');
        return;
    }
    if (targetConcentration <= 0) {
        alert(`目標濃度(${concentrationUnit})を正しく入力してください`);
        return;
    }
    if (solutionVolume <= 0) {
        alert('調製量を正しく入力してください');
        return;
    }
    if (activeConcentration <= 0 || activeConcentration > 100) {
        alert('原体濃度(%)を0-100の範囲で入力してください');
        return;
    }
    
    // ステップ1: μM → ppm変換
    const ppmConcentration = (targetMicromolar * molecularWeight) / 1000;
    console.log(`ステップ1: ${targetMicromolar} μM × ${molecularWeight} ÷ 1000 = ${ppmConcentration} ppm`);
    
    // ステップ2: 調製量をリットルに変換
    let volumeInLiters;
    switch (volumeUnit) {
        case 'mL':
            volumeInLiters = solutionVolume / 1000;
            break;
        case 'μL':
            volumeInLiters = solutionVolume / 1000000;
            break;
        default: // L
            volumeInLiters = solutionVolume;
    }
    
    // ステップ3: 必要有効成分量（mg）
    const requiredActive = ppmConcentration * volumeInLiters;
    console.log(`ステップ2: ${ppmConcentration} ppm × ${volumeInLiters} L = ${requiredActive} mg`);
    
    // ステップ4: 必要製品重量（g）
    const requiredProductWeight = requiredActive / (activeConcentration / 100) / 1000;
    console.log(`ステップ3: ${requiredActive} mg ÷ ${activeConcentration}% ÷ 1000 = ${requiredProductWeight} g`);
    
    // ステップ5: 必要製品体積（mL）
    const requiredProductVolume = requiredProductWeight / productDensity;
    console.log(`ステップ4: ${requiredProductWeight} g ÷ ${productDensity} g/mL = ${requiredProductVolume} mL`);
    
    // 結果表示
    document.getElementById('converted-ppm').textContent = formatMicromolarNumber(ppmConcentration);
    document.getElementById('required-active').textContent = formatMicromolarNumber(requiredActive);
    document.getElementById('required-product-weight').textContent = formatMicromolarNumber(requiredProductWeight);
    document.getElementById('required-product-volume').textContent = formatMicromolarNumber(requiredProductVolume);
    
    // 計算過程表示
    displayCalculationSteps(
        targetConcentration, concentrationUnit, targetMicromolar, molecularWeight, ppmConcentration,
        volumeInLiters, requiredActive, activeConcentration,
        requiredProductWeight, productDensity, requiredProductVolume
    );
    
    console.log('=== μmol計算完了 ===');
}

/**
 * 計算過程を表示
 */
function displayCalculationSteps(inputConc, inputUnit, micromolar, molWeight, ppm, volumeL, activeAmount, concentration, productWeight, density, productVolume) {
    const stepsElement = document.getElementById('calculation-steps');
    
    let step1HTML = '';
    if (inputUnit !== 'μM') {
        step1HTML = `
            <div class="step">
                <strong>ステップ1：単位変換 (${inputUnit} → μM)</strong><br>
                ${inputConc} ${inputUnit} = <strong>${formatMicromolarNumber(micromolar)} μM</strong>
            </div>`;
    }
    
    const stepsHTML = `
        ${step1HTML}
        <div class="step">
            <strong>ステップ${inputUnit !== 'μM' ? '2' : '1'}：濃度変換 (μM → ppm)</strong><br>
            ${formatMicromolarNumber(micromolar)} μM × ${molWeight} g/mol ÷ 1000 = <strong>${formatMicromolarNumber(ppm)} ppm</strong>
        </div>
        <div class="step">
            <strong>ステップ${inputUnit !== 'μM' ? '3' : '2'}：必要有効成分量</strong><br>
            ${formatMicromolarNumber(ppm)} ppm × ${volumeL} L = <strong>${formatMicromolarNumber(activeAmount)} mg</strong>
        </div>
        <div class="step">
            <strong>ステップ${inputUnit !== 'μM' ? '4' : '3'}：必要製品重量</strong><br>
            ${formatMicromolarNumber(activeAmount)} mg ÷ ${concentration}% ÷ 1000 = <strong>${formatMicromolarNumber(productWeight)} g</strong>
        </div>
        <div class="step">
            <strong>ステップ${inputUnit !== 'μM' ? '5' : '4'}：必要製品体積（液体の場合）</strong><br>
            ${formatMicromolarNumber(productWeight)} g ÷ ${density} g/mL = <strong>${formatMicromolarNumber(productVolume)} mL</strong>
        </div>
    `;
    
    stepsElement.innerHTML = stepsHTML;
}

/**
 * μmol濃度逆算メイン関数（手持ち薬剤量→最大調製可能量）
 */
function calculateMicromolarReverse() {
    console.log('=== μmol逆算計算開始 ===');
    
    // 入力値取得
    const chemicalName = getMicromolarTextValue('chemical-name-reverse');
    const molecularWeight = getMicromolarInputValue('molecular-weight-reverse');
    const availableAmount = getMicromolarInputValue('available-amount'); // g
    const activeConcentration = getMicromolarInputValue('active-concentration-reverse');
    const targetConcentration = getMicromolarInputValue('target-concentration-reverse');
    const concentrationUnit = document.getElementById('concentration-unit-reverse').value;
    
    // 濃度をμMに統一
    let targetMicromolar;
    switch (concentrationUnit) {
        case 'nM':
            targetMicromolar = targetConcentration / 1000;
            break;
        case 'mM':
            targetMicromolar = targetConcentration * 1000;
            break;
        default: // μM
            targetMicromolar = targetConcentration;
    }
    
    console.log('入力値:', {
        chemicalName, molecularWeight, availableAmount, 
        activeConcentration, targetMicromolar, concentrationUnit
    });
    
    // バリデーション
    if (molecularWeight <= 0) {
        alert('分子量を正しく入力してください');
        return;
    }
    if (availableAmount <= 0) {
        alert('手持ち薬剤量を正しく入力してください');
        return;
    }
    if (activeConcentration <= 0 || activeConcentration > 100) {
        alert('原体濃度(%)を0-100の範囲で入力してください');
        return;
    }
    if (targetConcentration <= 0) {
        alert(`目標濃度(${concentrationUnit})を正しく入力してください`);
        return;
    }
    
    // ステップ1: 手持ち薬剤から有効成分量を計算
    const totalActiveAmount = availableAmount * (activeConcentration / 100) * 1000; // mg
    console.log(`ステップ1: ${availableAmount} g × ${activeConcentration}% × 1000 = ${totalActiveAmount} mg`);
    
    // ステップ2: μM → ppm変換
    const ppmConcentration = (targetMicromolar * molecularWeight) / 1000;
    console.log(`ステップ2: ${targetMicromolar} μM × ${molecularWeight} ÷ 1000 = ${ppmConcentration} ppm`);
    
    // ステップ3: 最大調製可能量を計算
    const maxVolumeL = totalActiveAmount / ppmConcentration;
    console.log(`ステップ3: ${totalActiveAmount} mg ÷ ${ppmConcentration} ppm = ${maxVolumeL} L`);
    
    // ステップ4: 使用率計算（100%）
    const usageRate = 100; // 手持ち全量使用
    
    // 結果表示
    document.getElementById('max-volume').textContent = formatMicromolarNumber(maxVolumeL);
    document.getElementById('total-active').textContent = formatMicromolarNumber(totalActiveAmount);
    document.getElementById('ppm-concentration').textContent = formatMicromolarNumber(ppmConcentration);
    document.getElementById('usage-rate').textContent = usageRate;
    
    // 計算過程表示
    displayCalculationStepsReverse(
        availableAmount, activeConcentration, totalActiveAmount,
        targetConcentration, concentrationUnit, targetMicromolar, molecularWeight, 
        ppmConcentration, maxVolumeL, usageRate
    );
    
    console.log('=== μmol逆算計算完了 ===');
}

/**
 * 逆算計算過程を表示
 */
function displayCalculationStepsReverse(availableAmt, concentration, totalActive, inputConc, inputUnit, micromolar, molWeight, ppm, maxVolume, usage) {
    const stepsElement = document.getElementById('calculation-steps-reverse');
    
    let step2HTML = '';
    if (inputUnit !== 'μM') {
        step2HTML = `
            <div class="step">
                <strong>ステップ2：単位変換 (${inputUnit} → μM)</strong><br>
                ${inputConc} ${inputUnit} = <strong>${formatMicromolarNumber(micromolar)} μM</strong>
            </div>`;
    }
    
    const stepsHTML = `
        <div class="step">
            <strong>ステップ1：手持ち薬剤の有効成分量</strong><br>
            ${availableAmt} g × ${concentration}% × 1000 = <strong>${formatMicromolarNumber(totalActive)} mg</strong>
        </div>
        ${step2HTML}
        <div class="step">
            <strong>ステップ${inputUnit !== 'μM' ? '3' : '2'}：濃度変換 (μM → ppm)</strong><br>
            ${formatMicromolarNumber(micromolar)} μM × ${molWeight} g/mol ÷ 1000 = <strong>${formatMicromolarNumber(ppm)} ppm</strong>
        </div>
        <div class="step">
            <strong>ステップ${inputUnit !== 'μM' ? '4' : '3'}：最大調製可能量</strong><br>
            ${formatMicromolarNumber(totalActive)} mg ÷ ${formatMicromolarNumber(ppm)} ppm = <strong>${formatMicromolarNumber(maxVolume)} L</strong>
        </div>
        <div class="step">
            <strong>結果：薬剤使用率</strong><br>
            手持ち薬剤全量使用で <strong>${usage}%</strong> 使用
        </div>
    `;
    
    stepsElement.innerHTML = stepsHTML;
}

/**
 * プリセット薬剤を読み込み (Actual)
 */
function loadPresetActual() {
    const presetSelect = document.getElementById('chemical-preset-actual');
    const selectedValue = presetSelect.value;
    
    if (selectedValue && chemicalPresets[selectedValue]) {
        const preset = chemicalPresets[selectedValue];
        
        // 薬剤名と分子量を自動入力
        document.getElementById('chemical-name-actual').value = preset.name;
        document.getElementById('molecular-weight-actual').value = preset.molecularWeight;
        
        console.log(`実濃度確認プリセット読み込み: ${preset.name} (${preset.molecularWeight} g/mol)`);
    }
}

/**
 * 実濃度確認計算メイン関数
 */
function calculateActualConcentration() {
    console.log('=== 実濃度確認計算開始 ===');
    
    // 入力値取得
    const chemicalName = getMicromolarTextValue('chemical-name-actual');
    const molecularWeight = getMicromolarInputValue('molecular-weight-actual');
    const actualAmount = getMicromolarInputValue('actual-amount'); // g
    const actualVolume = getMicromolarInputValue('actual-volume');
    const actualVolumeUnit = document.getElementById('actual-volume-unit').value;
    const activeConcentration = getMicromolarInputValue('active-concentration-actual');
    
    console.log('入力値:', {
        chemicalName, molecularWeight, actualAmount, 
        actualVolume, actualVolumeUnit, activeConcentration
    });
    
    // バリデーション
    if (molecularWeight <= 0) {
        alert('分子量を正しく入力してください');
        return;
    }
    if (actualAmount <= 0) {
        alert('実際の添加量を正しく入力してください');
        return;
    }
    if (actualVolume <= 0) {
        alert('調製量を正しく入力してください');
        return;
    }
    if (activeConcentration <= 0 || activeConcentration > 100) {
        alert('原体濃度(%)を0-100の範囲で入力してください');
        return;
    }
    
    // ステップ1: 調製量をリットルに変換
    let volumeInLiters;
    switch (actualVolumeUnit) {
        case 'mL':
            volumeInLiters = actualVolume / 1000;
            break;
        case 'μL':
            volumeInLiters = actualVolume / 1000000;
            break;
        default: // L
            volumeInLiters = actualVolume;
    }
    
    // ステップ2: 有効成分量を計算
    const activeAmount = actualAmount * (activeConcentration / 100) * 1000; // mg
    console.log(`ステップ1: ${actualAmount} g × ${activeConcentration}% × 1000 = ${activeAmount} mg`);
    
    // ステップ3: ppm濃度計算
    const actualPpmConcentration = activeAmount / volumeInLiters;
    console.log(`ステップ2: ${activeAmount} mg ÷ ${volumeInLiters} L = ${actualPpmConcentration} ppm`);
    
    // ステップ4: μM濃度に逆変換
    const actualMicromolarConcentration = (actualPpmConcentration * 1000) / molecularWeight;
    console.log(`ステップ3: ${actualPpmConcentration} ppm × 1000 ÷ ${molecularWeight} = ${actualMicromolarConcentration} μM`);
    
    // 結果表示
    document.getElementById('actual-ppm').textContent = formatMicromolarNumber(actualPpmConcentration);
    document.getElementById('actual-micromolar').textContent = formatMicromolarNumber(actualMicromolarConcentration);
    document.getElementById('actual-active-amount').textContent = formatMicromolarNumber(activeAmount);
    document.getElementById('product-usage').textContent = formatMicromolarNumber(actualAmount);
    
    // 計算過程表示
    displayCalculationStepsActual(
        actualAmount, activeConcentration, activeAmount,
        volumeInLiters, actualVolumeUnit, actualVolume,
        actualPpmConcentration, molecularWeight, actualMicromolarConcentration
    );
    
    console.log('=== 実濃度確認計算完了 ===');
}

/**
 * 実濃度確認計算過程を表示
 */
function displayCalculationStepsActual(amount, concentration, activeAmt, volumeL, volumeUnit, originalVolume, ppm, molWeight, micromolar) {
    const stepsElement = document.getElementById('calculation-steps-actual');
    
    let volumeStepHTML = '';
    if (volumeUnit !== 'L') {
        volumeStepHTML = `
            <div class="step">
                <strong>ステップ1：体積単位変換</strong><br>
                ${originalVolume} ${volumeUnit} = <strong>${formatMicromolarNumber(volumeL)} L</strong>
            </div>`;
    }
    
    const stepsHTML = `
        ${volumeStepHTML}
        <div class="step">
            <strong>ステップ${volumeUnit !== 'L' ? '2' : '1'}：有効成分量計算</strong><br>
            ${amount} g × ${concentration}% × 1000 = <strong>${formatMicromolarNumber(activeAmt)} mg</strong>
        </div>
        <div class="step">
            <strong>ステップ${volumeUnit !== 'L' ? '3' : '2'}：ppm濃度計算</strong><br>
            ${formatMicromolarNumber(activeAmt)} mg ÷ ${formatMicromolarNumber(volumeL)} L = <strong>${formatMicromolarNumber(ppm)} ppm</strong>
        </div>
        <div class="step">
            <strong>ステップ${volumeUnit !== 'L' ? '4' : '3'}：μM濃度逆変換</strong><br>
            ${formatMicromolarNumber(ppm)} ppm × 1000 ÷ ${molWeight} g/mol = <strong>${formatMicromolarNumber(micromolar)} μM</strong>
        </div>
    `;
    
    stepsElement.innerHTML = stepsHTML;
}

/**
 * 初期化関数
 */
function initializeMicromolarCalculator() {
    console.log('μmol計算機能を初期化');
    // 必要に応じて初期化処理を追加
}

// ページ読み込み後に初期化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeMicromolarCalculator, 400);
});

// グローバル関数として公開
window.loadPreset = loadPreset;
window.loadPresetReverse = loadPresetReverse;
window.loadPresetActual = loadPresetActual;
window.calculateMicromolar = calculateMicromolar;
window.calculateMicromolarReverse = calculateMicromolarReverse;
window.calculateActualConcentration = calculateActualConcentration;