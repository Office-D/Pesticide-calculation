/**
 * シンプルなくん煙剤計算機能
 */

// グローバル変数
let fumigantCurrentUnit = 'g';
let fumigantResultG = 0;
let fumigantResultKg = 0;

/**
 * 数値フォーマット
 */
function formatFumigantNumber(value) {
    if (value < 0.01) return value.toFixed(4);
    else if (value < 1) return value.toFixed(3);
    else if (value < 10) return value.toFixed(2);
    else if (value < 100) return value.toFixed(1);
    else return Math.round(value).toString();
}

/**
 * 入力値を取得
 */
function getFumigantInputValue(id) {
    const element = document.getElementById(id);
    return element ? parseFloat(element.value) || 0 : 0;
}

/**
 * 容積を計算してリアルタイム表示
 */
function calculateFumigantVolume() {
    const width = getFumigantInputValue('fumigant-width');
    const length = getFumigantInputValue('fumigant-length');
    const height = getFumigantInputValue('fumigant-height');
    const count = getFumigantInputValue('fumigant-count') || 1;
    
    const singleVolume = width * length * height;
    const totalVolume = singleVolume * count;
    
    // 単棟容積表示
    const singleElement = document.getElementById('fumigant-single-volume');
    if (singleElement) {
        singleElement.textContent = singleVolume > 0 ? formatFumigantNumber(singleVolume) : '-';
    }
    
    // 合計容積表示
    const totalElement = document.getElementById('fumigant-total-volume');
    if (totalElement) {
        totalElement.textContent = totalVolume > 0 ? formatFumigantNumber(totalVolume) : '-';
    }
}

/**
 * くん煙剤必要量を計算
 */
function calculateFumigantSimple() {
    console.log('=== くん煙剤計算開始 ===');
    
    // 入力値取得
    const width = getFumigantInputValue('fumigant-width');
    const length = getFumigantInputValue('fumigant-length');
    const height = getFumigantInputValue('fumigant-height');
    const count = getFumigantInputValue('fumigant-count') || 1;
    const regVolume = getFumigantInputValue('fumigant-reg-volume');
    const regAmount = getFumigantInputValue('fumigant-reg-amount');
    
    console.log('入力値:', { width, length, height, count, regVolume, regAmount });
    
    // バリデーション
    if (width <= 0) {
        alert('間口を正しく入力してください');
        return;
    }
    if (length <= 0) {
        alert('長さを正しく入力してください');
        return;
    }
    if (height <= 0) {
        alert('高さを正しく入力してください');
        return;
    }
    if (count <= 0) {
        alert('棟数を正しく入力してください');
        return;
    }
    if (regVolume <= 0) {
        alert('登録容積を正しく入力してください');
        return;
    }
    if (regAmount <= 0) {
        alert('登録薬量を正しく入力してください');
        return;
    }
    
    // 容積計算
    const totalVolume = width * length * height * count;
    console.log('合計容積:', totalVolume);
    
    // 必要量計算
    const requiredAmount = (totalVolume / regVolume) * regAmount;
    console.log('必要量:', requiredAmount, 'g');
    
    // 結果保存
    fumigantResultG = requiredAmount;
    fumigantResultKg = requiredAmount / 1000;
    
    // 結果表示
    displayFumigantResult();
    
    console.log('=== 計算完了 ===');
}

/**
 * 結果を表示
 */
function displayFumigantResult() {
    const resultElement = document.getElementById('fumigant-simple-result');
    if (!resultElement) {
        console.error('結果表示要素が見つかりません');
        return;
    }
    
    const value = fumigantCurrentUnit === 'kg' ? fumigantResultKg : fumigantResultG;
    resultElement.textContent = formatFumigantNumber(value);
    
    console.log('結果表示:', value, fumigantCurrentUnit);
}

/**
 * 単位を切り替え
 */
function toggleFumigantSimpleUnit() {
    const toggle = document.getElementById('fumigant-simple-toggle');
    fumigantCurrentUnit = fumigantCurrentUnit === 'g' ? 'kg' : 'g';
    
    if (fumigantCurrentUnit === 'kg') {
        toggle.classList.add('active');
    } else {
        toggle.classList.remove('active');
    }
    
    // 結果が計算済みの場合は再表示
    if (fumigantResultG > 0) {
        displayFumigantResult();
    }
    
    console.log('単位切り替え:', fumigantCurrentUnit);
}

/**
 * 初期化
 */
function initializeFumigantSimple() {
    console.log('シンプルくん煙剤計算機能を初期化');
    
    // 寸法入力のリアルタイム計算
    const inputs = ['fumigant-width', 'fumigant-length', 'fumigant-height', 'fumigant-count'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', calculateFumigantVolume);
        }
    });
    
    // 初期容積計算
    calculateFumigantVolume();
    
    console.log('初期化完了');
}

// ページ読み込み後に初期化
document.addEventListener('DOMContentLoaded', function() {
    // タブ4がアクティブになった時に初期化
    setTimeout(initializeFumigantSimple, 300);
});

// タブ切り替え時にも初期化を試行
if (typeof window.initializeTabManager === 'function') {
    const originalInitializeTabManager = window.initializeTabManager;
    window.initializeTabManager = function() {
        originalInitializeTabManager();
        
        // タブ4用の追加処理
        const tab4Button = document.querySelector('[data-tab="tab4"]');
        if (tab4Button) {
            tab4Button.addEventListener('click', function() {
                setTimeout(initializeFumigantSimple, 100);
            });
        }
    };
}