/**
 * μmol濃度計算機能
 */

// 薬剤プリセットデータ
const chemicalPresets = {
    // 除草剤
    glyphosate: {
        name: "グリホサート",
        molecularWeight: 169.07,
        category: "除草剤",
        productType: "pesticide",
        commonProducts: [
            { name: "ラウンドアップ", concentration: 41, formulation: "SL" },
            { name: "タッチダウンiQ", concentration: 48, formulation: "SL" }
        ]
    },
    "2,4-d": {
        name: "2,4-D",
        molecularWeight: 221.04,
        category: "除草剤",
        productType: "pesticide",
        commonProducts: [
            { name: "2,4-Dアミン塩", concentration: 50, formulation: "SL" }
        ]
    },
    
    // 殺虫剤
    imidacloprid: {
        name: "イミダクロプリド",
        molecularWeight: 255.66,
        category: "殺虫剤",
        productType: "pesticide",
        commonProducts: [
            { name: "アドマイヤー", concentration: 20, formulation: "SC" },
            { name: "ダントツ", concentration: 16, formulation: "WP" }
        ]
    },
    thiacloprid: {
        name: "チアクロプリド",
        molecularWeight: 252.72,
        category: "殺虫剤",
        productType: "pesticide"
    },
    
    // 植物ホルモン - オーキシン類
    iaa: {
        name: "インドール酢酸 (IAA)",
        molecularWeight: 175.18,
        category: "オーキシン",
        productType: "hormone",
        recommendedRange: { min: 0.1, max: 10, unit: "μM" },
        solubility: { water: "poor", ethanol: "good", dmso: "excellent" }
    },
    naa: {
        name: "ナフタレン酢酸 (NAA)",
        molecularWeight: 186.21,
        category: "オーキシン",
        productType: "hormone",
        recommendedRange: { min: 0.1, max: 10, unit: "μM" },
        solubility: { water: "poor", ethanol: "good", dmso: "excellent" }
    },
    iba: {
        name: "インドール酪酸 (IBA)",
        molecularWeight: 203.24,
        category: "オーキシン",
        productType: "hormone",
        recommendedRange: { min: 0.5, max: 50, unit: "μM" }
    },
    
    // 植物ホルモン - サイトカイニン類
    bap: {
        name: "6-ベンジルアミノプリン (BAP)",
        molecularWeight: 225.25,
        category: "サイトカイニン",
        productType: "hormone",
        recommendedRange: { min: 0.1, max: 10, unit: "μM" }
    },
    kinetin: {
        name: "カイネチン",
        molecularWeight: 215.21,
        category: "サイトカイニン",
        productType: "hormone",
        recommendedRange: { min: 0.5, max: 10, unit: "μM" }
    },
    zeatin: {
        name: "ゼアチン",
        molecularWeight: 219.24,
        category: "サイトカイニン",
        productType: "hormone",
        recommendedRange: { min: 0.01, max: 1, unit: "μM" }
    },
    
    // 植物ホルモン - ジベレリン類
    ga3: {
        name: "ジベレリン (GA3)",
        molecularWeight: 346.37,
        category: "ジベレリン",
        productType: "hormone",
        recommendedRange: { min: 0.1, max: 10, unit: "μM" },
        notes: "果実肥大、登熟促進に使用。高濃度で副作用あり",
        commonProducts: [
            { name: "ジベレリン協和", concentration: 3.1, formulation: "tablet" }
        ]
    },
    ga4: {
        name: "ジベレリンA4 (GA4)",
        molecularWeight: 332.39,
        category: "ジベレリン",
        productType: "hormone"
    },
    
    // 植物ホルモン - その他
    aba: {
        name: "アブシジン酸 (ABA)",
        molecularWeight: 264.32,
        category: "植物ホルモン",
        productType: "hormone",
        recommendedRange: { min: 0.1, max: 100, unit: "μM" }
    },
    paclobutrazol: {
        name: "パクロブトラゾール",
        molecularWeight: 293.79,
        category: "成長抑制剤",
        productType: "hormone",
        recommendedRange: { min: 1, max: 100, unit: "μM" }
    },
    
    // 肥料 - 窒素系
    urea: {
        name: "尿素",
        molecularWeight: 60.06,
        category: "肥料",
        productType: "fertilizer",
        npk: "46-0-0",
        element: "N",
        elementContent: 46,
        solubility: { water: "excellent" }
    },
    "ammonium-sulfate": {
        name: "硫安（硫酸アンモニウム）",
        molecularWeight: 132.14,
        category: "肥料",
        productType: "fertilizer",
        npk: "21-0-0",
        element: "N",
        elementContent: 21
    },
    "ammonium-nitrate": {
        name: "硝安（硝酸アンモニウム）",
        molecularWeight: 80.04,
        category: "肥料",
        productType: "fertilizer",
        npk: "34-0-0",
        element: "N",
        elementContent: 34
    },
    
    // 肥料 - カリウム系
    "potassium-nitrate": {
        name: "硝酸カリウム",
        molecularWeight: 101.10,
        category: "肥料",
        productType: "fertilizer",
        npk: "13-0-44",
        elements: { N: 13, K2O: 44 }
    },
    "potassium-sulfate": {
        name: "硫酸カリウム",
        molecularWeight: 174.26,
        category: "肥料",
        productType: "fertilizer",
        npk: "0-0-50",
        element: "K",
        k2oContent: 50
    },
    
    // 肥料 - リン系
    "monopotassium-phosphate": {
        name: "リン酸一カリウム (MKP)",
        molecularWeight: 136.09,
        category: "肥料",
        productType: "fertilizer",
        npk: "0-52-34",
        elements: { P2O5: 52, K2O: 34 }
    },
    
    // 肥料 - カルシウム系
    "calcium-nitrate": {
        name: "硝酸カルシウム",
        molecularWeight: 164.09,
        category: "肥料",
        productType: "fertilizer",
        npk: "15.5-0-0",
        elements: { N: 15.5, Ca: 19 }
    },
    
    // 肥料 - マグネシウム系
    "magnesium-sulfate": {
        name: "硫酸マグネシウム（七水和物）",
        molecularWeight: 246.47,
        category: "肥料",
        productType: "fertilizer",
        elements: { Mg: 9.8, S: 13 }
    },
    
    // 肥料 - 微量要素
    "iron-sulfate": {
        name: "硫酸第一鉄（七水和物）",
        molecularWeight: 278.01,
        category: "肥料",
        productType: "fertilizer",
        element: "Fe",
        elementContent: 20
    },
    "iron-edta": {
        name: "EDTA鉄",
        molecularWeight: 367.07,
        category: "肥料",
        productType: "fertilizer",
        element: "Fe",
        elementContent: 13,
        chelated: true
    },
    "zinc-sulfate": {
        name: "硫酸亜鉛（七水和物）",
        molecularWeight: 287.56,
        category: "肥料",
        productType: "fertilizer",
        element: "Zn",
        elementContent: 22.7
    },
    "manganese-sulfate": {
        name: "硫酸マンガン（一水和物）",
        molecularWeight: 169.02,
        category: "肥料",
        productType: "fertilizer",
        element: "Mn",
        elementContent: 32.5
    },
    "copper-sulfate": {
        name: "硫酸銅（五水和物）",
        molecularWeight: 249.69,
        category: "肥料",
        productType: "fertilizer",
        element: "Cu",
        elementContent: 25.5
    },
    "boric-acid": {
        name: "ホウ酸",
        molecularWeight: 61.83,
        category: "肥料",
        productType: "fertilizer",
        element: "B",
        elementContent: 17.5
    },
    "sodium-molybdate": {
        name: "モリブデン酸ナトリウム（二水和物）",
        molecularWeight: 241.95,
        category: "肥料",
        productType: "fertilizer",
        element: "Mo",
        elementContent: 39.7
    }
};

// 製品タイプ別の詳細情報
const productTypeInfo = {
    pesticide: {
        formulations: {
            'EC': { name: '乳剤', density: 0.9 },
            'SL': { name: '液剤', density: 1.1 },
            'SC': { name: 'フロアブル', density: 1.2 },
            'WP': { name: '水和剤', density: 0.5 },
            'WG': { name: '顆粒水和剤', density: 0.7 },
            'SG': { name: '水溶剤', density: 0.8 }
        }
    },
    hormone: {
        forms: {
            'powder': { name: '粉末', defaultSolvent: 'ethanol' },
            'liquid': { name: '液体', defaultSolvent: 'water' },
            'tablet': { name: '錠剤', defaultSolvent: 'water' }
        },
        solvents: {
            'water': { name: '水', notes: '一部の物質は溶解性が低い' },
            'ethanol': { name: 'エタノール', notes: '最終濃度0.1%以下推奨' },
            'dmso': { name: 'DMSO', notes: '最終濃度0.1%以下推奨' },
            'naoh': { name: '0.1N NaOH', notes: '酸性物質用' }
        }
    },
    fertilizer: {
        types: {
            'single': { name: '単肥', description: '単一要素' },
            'compound': { name: '複合肥料', description: '複数要素' },
            'chelated': { name: 'キレート肥料', description: '金属キレート' }
        },
        elements: {
            'N': { name: '窒素', symbol: 'N' },
            'P': { name: 'リン', symbol: 'P2O5' },
            'K': { name: 'カリウム', symbol: 'K2O' },
            'Ca': { name: 'カルシウム', symbol: 'Ca' },
            'Mg': { name: 'マグネシウム', symbol: 'Mg' },
            'S': { name: '硫黄', symbol: 'S' },
            'Fe': { name: '鉄', symbol: 'Fe' },
            'Mn': { name: 'マンガン', symbol: 'Mn' },
            'Zn': { name: '亜鉛', symbol: 'Zn' },
            'Cu': { name: '銅', symbol: 'Cu' },
            'B': { name: 'ホウ素', symbol: 'B' },
            'Mo': { name: 'モリブデン', symbol: 'Mo' }
        }
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
        
        // 原体濃度のデフォルト値を設定
        setDefaultConcentration(preset);
        
        // 製品情報を表示
        displayProductInfo(preset);
        
        // 推奨濃度範囲を表示
        displayRecommendedRange(preset);
        
        // 剤型情報を更新
        updateFormulationOptions(preset);
        
        console.log(`プリセット読み込み: ${preset.name} (${preset.molecularWeight} g/mol)`);
    } else {
        // プリセット未選択時は情報を非表示
        hideProductInfo();
    }
}

/**
 * デフォルト濃度を設定
 */
function setDefaultConcentration(preset) {
    const concentrationInput = document.getElementById('active-concentration');
    const concentrationHint = document.getElementById('concentration-hint');
    
    if (preset.productType === 'fertilizer') {
        // 肥料の場合は要素含有率を使用
        if (preset.elementContent) {
            concentrationInput.value = preset.elementContent;
            concentrationHint.textContent = `${preset.element || '主要元素'}: ${preset.elementContent}%`;
        } else if (preset.elements) {
            const mainElement = Object.keys(preset.elements)[0];
            concentrationInput.value = preset.elements[mainElement];
            concentrationHint.textContent = `${mainElement}: ${preset.elements[mainElement]}%`;
        }
    } else if (preset.commonProducts && preset.commonProducts.length > 0) {
        // 一般的な製品がある場合
        const defaultProduct = preset.commonProducts[0];
        concentrationInput.value = defaultProduct.concentration;
        concentrationHint.textContent = `${defaultProduct.name}の標準濃度`;
    } else {
        concentrationHint.textContent = '製品ラベルで確認してください';
    }
}

/**
 * 製品情報を表示
 */
function displayProductInfo(preset) {
    const productDetails = document.getElementById('product-details');
    const productInfoDisplay = document.getElementById('product-info-display');
    
    if (preset.commonProducts && preset.commonProducts.length > 0) {
        let infoHTML = '<h5>一般的な製品例</h5>';
        preset.commonProducts.forEach(product => {
            infoHTML += `
                <div class="product-info-item">
                    <span class="product-info-label">${product.name}</span>
                    <span class="product-info-value">${product.concentration}% (${product.formulation})</span>
                </div>`;
        });
        productInfoDisplay.innerHTML = infoHTML;
        productDetails.style.display = 'block';
    } else if (preset.productType === 'fertilizer') {
        let infoHTML = '<h5>肥料情報</h5>';
        if (preset.npk) {
            infoHTML += `
                <div class="product-info-item">
                    <span class="product-info-label">NPK比率</span>
                    <span class="product-info-value">${preset.npk}</span>
                </div>`;
        }
        if (preset.elements) {
            Object.entries(preset.elements).forEach(([element, content]) => {
                infoHTML += `
                    <div class="product-info-item">
                        <span class="product-info-label">${element}含有率</span>
                        <span class="product-info-value">${content}%</span>
                    </div>`;
            });
        }
        if (preset.solubility) {
            infoHTML += `
                <div class="product-info-item">
                    <span class="product-info-label">溶解性</span>
                    <span class="product-info-value">${preset.solubility.water || '不明'}</span>
                </div>`;
        }
        productInfoDisplay.innerHTML = infoHTML;
        productDetails.style.display = 'block';
    } else {
        productDetails.style.display = 'none';
    }
}

/**
 * 推奨濃度範囲を表示
 */
function displayRecommendedRange(preset) {
    const recommendedRange = document.getElementById('recommended-range');
    const recommendedText = document.getElementById('recommended-text');
    
    if (preset.recommendedRange) {
        const { min, max, unit } = preset.recommendedRange;
        recommendedText.textContent = `${min} - ${max} ${unit} (一般的な使用範囲)`;
        recommendedRange.style.display = 'block';
    } else {
        recommendedRange.style.display = 'none';
    }
}

/**
 * 剤型オプションを更新
 */
function updateFormulationOptions(preset) {
    const formulationSelect = document.getElementById('product-formulation');
    const productInfoGroup = document.getElementById('product-info-group');
    
    if (preset.productType === 'pesticide' && productTypeInfo.pesticide) {
        // 農薬の剤型オプションを表示
        formulationSelect.innerHTML = '<option value="">— 剤型を選択 —</option>';
        Object.entries(productTypeInfo.pesticide.formulations).forEach(([code, info]) => {
            formulationSelect.innerHTML += `<option value="${code}">${code} (${info.name})</option>`;
        });
        productInfoGroup.style.display = 'block';
    } else {
        productInfoGroup.style.display = 'none';
    }
}

/**
 * 剤型情報を更新
 */
function updateFormulationInfo() {
    const formulationSelect = document.getElementById('product-formulation');
    const formulationHint = document.getElementById('formulation-hint');
    const densityInput = document.getElementById('product-density');
    const densityHint = document.getElementById('density-hint');
    
    const selectedFormulation = formulationSelect.value;
    
    if (selectedFormulation && productTypeInfo.pesticide.formulations[selectedFormulation]) {
        const formInfo = productTypeInfo.pesticide.formulations[selectedFormulation];
        formulationHint.textContent = `一般的な密度: ${formInfo.density} g/mL`;
        densityInput.value = formInfo.density;
        densityHint.textContent = `${formInfo.name}の標準密度`;
    } else {
        formulationHint.textContent = '';
        densityHint.textContent = '(液体製品の場合)';
    }
}

/**
 * 製品情報を非表示
 */
function hideProductInfo() {
    document.getElementById('product-details').style.display = 'none';
    document.getElementById('recommended-range').style.display = 'none';
    document.getElementById('product-info-group').style.display = 'none';
    document.getElementById('concentration-hint').textContent = '';
    document.getElementById('formulation-hint').textContent = '';
    document.getElementById('density-hint').textContent = '(液体製品の場合)';
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
        case 'M':
        case 'mol/L':
            targetMicromolar = targetConcentration * 1000000;
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
    // 肥料以外の場合は濃度チェック
    const selectedPreset = getSelectedPreset();
    if (selectedPreset && selectedPreset.productType !== 'fertilizer') {
        if (activeConcentration <= 0 || activeConcentration > 100) {
            alert('原体濃度(%)を0-100の範囲で入力してください');
            return;
        }
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
    let requiredProductWeight;
    if (activeConcentration > 0) {
        requiredProductWeight = requiredActive / (activeConcentration / 100) / 1000;
    } else {
        // 肥料の場合、純分として計算
        requiredProductWeight = requiredActive / 1000;
    }
    console.log(`ステップ3: ${requiredActive} mg ÷ ${activeConcentration || 100}% ÷ 1000 = ${requiredProductWeight} g`);
    
    // ステップ5: 必要製品体積（mL）
    const requiredProductVolume = requiredProductWeight / productDensity;
    console.log(`ステップ4: ${requiredProductWeight} g ÷ ${productDensity} g/mL = ${requiredProductVolume} mL`);
    
    // mol数を計算
    const moles = (requiredActive / 1000) / molecularWeight; // mol
    const micromoles = moles * 1000000; // μmol
    console.log(`mol数: ${formatMicromolarNumber(micromoles)} μmol`);
    
    // 結果表示
    document.getElementById('converted-ppm').textContent = formatMicromolarNumber(ppmConcentration);
    document.getElementById('required-active').textContent = formatMicromolarNumber(requiredActive);
    document.getElementById('required-product-weight').textContent = formatMicromolarNumber(requiredProductWeight);
    document.getElementById('required-product-volume').textContent = formatMicromolarNumber(requiredProductVolume);
    document.getElementById('required-moles').textContent = formatMicromolarNumber(micromoles);
    
    // 選択したプリセットの製品情報を表示
    displaySelectedProductInfo(chemicalName, requiredProductWeight, moles);
    
    // 計算過程表示
    displayCalculationSteps(
        targetConcentration, concentrationUnit, targetMicromolar, molecularWeight, ppmConcentration,
        volumeInLiters, requiredActive, activeConcentration,
        requiredProductWeight, productDensity, requiredProductVolume
    );
    
    console.log('=== μmol計算完了 ===');
}

/**
 * 選択したプリセットを取得
 */
function getSelectedPreset() {
    const presetSelect = document.getElementById('chemical-preset');
    const selectedValue = presetSelect.value;
    return selectedValue && chemicalPresets[selectedValue] ? chemicalPresets[selectedValue] : null;
}

/**
 * 選択した製品情報を表示
 */
function displaySelectedProductInfo(chemicalName, requiredWeight, moles = null) {
    const selectedPreset = getSelectedPreset();
    if (!selectedPreset) return;
    
    const productDetails = document.getElementById('product-details');
    const productInfoDisplay = document.getElementById('product-info-display');
    
    let calculationHTML = `
        <h5>計算結果詳細</h5>
        <div class="product-info-item">
            <span class="product-info-label">薬剤名</span>
            <span class="product-info-value">${chemicalName}</span>
        </div>
        <div class="product-info-item">
            <span class="product-info-label">必要量</span>
            <span class="product-info-value">${formatMicromolarNumber(requiredWeight)} g</span>
        </div>`;
    
    if (moles) {
        calculationHTML += `
            <div class="product-info-item">
                <span class="product-info-label">mol数</span>
                <span class="product-info-value">${formatMicromolarNumber(moles * 1000000)} μmol</span>
            </div>`;
    }
    
    if (selectedPreset.productType === 'fertilizer') {
        calculationHTML += `
            <div class="product-info-item">
                <span class="product-info-label">種類</span>
                <span class="product-info-value">肥料 (${selectedPreset.category})</span>
            </div>`;
        
        if (selectedPreset.solubility) {
            calculationHTML += `
                <div class="product-info-item">
                    <span class="product-info-label">溶解性</span>
                    <span class="product-info-value">${selectedPreset.solubility.water}</span>
                </div>`;
        }
    } else if (selectedPreset.productType === 'hormone') {
        calculationHTML += `
            <div class="product-info-item">
                <span class="product-info-label">種類</span>
                <span class="product-info-value">植物ホルモン (${selectedPreset.category})</span>
            </div>`;
        
        if (selectedPreset.solubility) {
            const solvents = Object.entries(selectedPreset.solubility)
                .map(([solvent, quality]) => `${productTypeInfo.hormone.solvents[solvent]?.name || solvent}: ${quality}`)
                .join(', ');
            calculationHTML += `
                <div class="product-info-item">
                    <span class="product-info-label">溶解性</span>
                    <span class="product-info-value">${solvents}</span>
                </div>`;
        }
    }
    
    productInfoDisplay.innerHTML = calculationHTML;
    productDetails.style.display = 'block';
}

/**
 * 計算過程を表示
 */
function displayCalculationSteps(inputConc, inputUnit, micromolar, molWeight, ppm, volumeL, activeAmount, concentration, productWeight, density, productVolume) {
    const stepsElement = document.getElementById('calculation-steps');
    
    let step1HTML = '';
    if (inputUnit !== 'μM') {
        let conversionNote = '';
        if (inputUnit === 'M' || inputUnit === 'mol/L') {
            conversionNote = ` (×1,000,000)`;
        } else if (inputUnit === 'mM') {
            conversionNote = ` (×1,000)`;
        } else if (inputUnit === 'nM') {
            conversionNote = ` (÷1,000)`;
        }
        step1HTML = `
            <div class="step">
                <strong>ステップ1：単位変換 (${inputUnit} → μM)</strong><br>
                ${inputConc} ${inputUnit}${conversionNote} = <strong>${formatMicromolarNumber(micromolar)} μM</strong>
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
            ${formatMicromolarNumber(activeAmount)} mg ÷ ${concentration || 100}% ÷ 1000 = <strong>${formatMicromolarNumber(productWeight)} g</strong>
            ${concentration === 0 ? '<br><small>注:純分として計算</small>' : ''}
        </div>
        <div class="step">
            <strong>ステップ${inputUnit !== 'μM' ? '5' : '4'}：必要製品体積（液体の場合）</strong><br>
            ${formatMicromolarNumber(productWeight)} g ÷ ${density} g/mL = <strong>${formatMicromolarNumber(productVolume)} mL</strong>
        </div>
        <div class="step">
            <strong>mol数計算</strong><br>
            ${formatMicromolarNumber(activeAmount)} mg ÷ 1000 ÷ ${molWeight} g/mol × 1,000,000 = <strong>${formatMicromolarNumber((activeAmount/1000/molWeight)*1000000)} μmol</strong>
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
        case 'M':
        case 'mol/L':
            targetMicromolar = targetConcentration * 1000000;
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
window.updateFormulationInfo = updateFormulationInfo;