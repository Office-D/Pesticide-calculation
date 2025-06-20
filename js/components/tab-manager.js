/**
 * タブ管理コンポーネント
 */

/**
 * タブ切り替え機能を初期化
 */
function initializeTabManager() {
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
            
            // タブ4（くん煙剤計算）は新しいシンプル版で処理されるため、特別処理は不要
        });
    });
}

/**
 * サブタブ切り替え機能を初期化
 */
function initializeSubTabManager() {
    const subTabButtons = document.querySelectorAll('.sub-tab-btn');
    const subTabContents = document.querySelectorAll('.sub-tab-content');
    
    subTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            subTabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            subTabContents.forEach(content => content.classList.remove('active'));
            const subTabId = this.getAttribute('data-subtab');
            document.getElementById(subTabId).classList.add('active');
        });
    });
}

// ES6モジュール対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTabManager,
        initializeSubTabManager
    };
}

// グローバルスコープにも追加
window.initializeTabManager = initializeTabManager;
window.initializeSubTabManager = initializeSubTabManager;