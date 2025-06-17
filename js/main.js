/**
 * メインアプリケーション初期化
 */

document.addEventListener('DOMContentLoaded', function() {
    // タブ管理の初期化
    initializeTabManager();
    initializeSubTabManager();

    // 各計算機の初期化
    const pesticideCalculator = new PesticideCalculator();
    pesticideCalculator.initialize();

    const waterCalculator = new WaterCalculator();
    waterCalculator.initialize();

    const ratioCalculator = new RatioCalculator();
    ratioCalculator.initialize();

    const ppmCalculator = new PpmCalculator();
    ppmCalculator.initialize();

    // グローバルスコープに保存（トグル関数から参照するため）
    window.ppmCalculator = ppmCalculator;

    console.log('農薬希釈計算ツールが初期化されました');
});