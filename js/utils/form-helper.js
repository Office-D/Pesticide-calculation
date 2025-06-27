/**
 * フォームヘルパー - フォーム操作とクリア機能
 */

class FormHelper {
    constructor() {
        this.statusElement = null;
        this.initStatusElement();
        this.setupAutoSave();
    }

    /**
     * ステータス表示要素を初期化
     */
    initStatusElement() {
        this.statusElement = document.createElement('div');
        this.statusElement.className = 'form-status';
        document.body.appendChild(this.statusElement);
    }

    /**
     * ステータスメッセージを表示
     * @param {string} message - メッセージ
     * @param {string} type - タイプ ('save', 'clear')
     */
    showStatus(message, type = 'save') {
        this.statusElement.textContent = message;
        this.statusElement.className = `form-status ${type} show`;
        
        setTimeout(() => {
            this.statusElement.classList.remove('show');
        }, 2000);
    }

    /**
     * フォームをクリア
     * @param {string} formId - フォームID
     */
    clearForm(formId) {
        const tabElement = document.getElementById(formId);
        if (!tabElement) return;

        // アニメーション効果
        tabElement.classList.add('clearing');
        
        // 入力フィールドをクリア
        const inputs = tabElement.querySelectorAll('input[type="number"], input[type="text"]');
        inputs.forEach(input => {
            if (!input.hasAttribute('data-keep-value')) {
                input.value = '';
            }
        });

        // セレクトボックスを初期値に戻す
        const selects = tabElement.querySelectorAll('select');
        selects.forEach(select => {
            if (!select.hasAttribute('data-keep-value')) {
                select.selectedIndex = 0;
            }
        });

        // 結果表示をクリア
        const results = tabElement.querySelectorAll('[id$="-result"]');
        results.forEach(result => {
            result.textContent = '-';
        });

        // トグルスイッチを初期状態に戻す
        const toggles = tabElement.querySelectorAll('.toggle-switch');
        toggles.forEach(toggle => {
            toggle.classList.remove('active');
        });

        // ローカルストレージから削除
        if (window.storageHelper) {
            window.storageHelper.clearFormData(formId);
        }

        // アニメーション終了後にクラスを削除
        setTimeout(() => {
            tabElement.classList.remove('clearing');
        }, 300);

        this.showStatus('入力内容をクリアしました', 'clear');
        
        // 最初の入力フィールドにフォーカス
        const firstInput = tabElement.querySelector('input[type="number"], input[type="text"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    /**
     * 自動保存を設定
     */
    setupAutoSave() {
        if (!window.storageHelper) return;

        // 入力イベントで自動保存
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select')) {
                this.saveCurrentTab();
            }
        });

        // タブ切り替え時に保存
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tab-btn')) {
                this.saveCurrentTab();
            }
        });
    }

    /**
     * 現在のタブのデータを保存
     */
    saveCurrentTab() {
        if (!window.storageHelper) return;

        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab) return;

        const tabId = activeTab.id;
        window.storageHelper.saveFormData(tabId, activeTab);
    }

    /**
     * 指定タブのデータを復元
     * @param {string} tabId - タブID
     */
    loadTabData(tabId) {
        if (!window.storageHelper) return;

        const tabElement = document.getElementById(tabId);
        if (!tabElement) return;

        window.storageHelper.loadFormData(tabId, tabElement);
    }

    /**
     * すべてのタブのデータを復元
     */
    loadAllTabData() {
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            this.loadTabData(tab.id);
        });
    }

    /**
     * 数値入力フィールドに便利機能を追加
     */
    enhanceNumberInputs() {
        const numberInputs = document.querySelectorAll('input[type="number"]');
        
        numberInputs.forEach(input => {
            // ダブルクリックで全選択
            input.addEventListener('dblclick', () => {
                input.select();
            });

            // マウスホイールで値を変更
            input.addEventListener('wheel', (e) => {
                if (document.activeElement === input) {
                    e.preventDefault();
                    const step = parseFloat(input.step) || 1;
                    const currentValue = parseFloat(input.value) || 0;
                    const newValue = e.deltaY > 0 ? currentValue - step : currentValue + step;
                    
                    if (input.min && newValue < parseFloat(input.min)) return;
                    if (input.max && newValue > parseFloat(input.max)) return;
                    
                    input.value = newValue;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        });
    }

    /**
     * キーボードショートカットを設定
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter または Cmd+Enter で計算実行
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                const activeTab = document.querySelector('.tab-content.active');
                if (activeTab) {
                    const calculateBtn = activeTab.querySelector('button:not(.clear-btn)');
                    if (calculateBtn) {
                        calculateBtn.click();
                    }
                }
            }

            // Ctrl+Delete または Cmd+Delete でクリア
            if ((e.ctrlKey || e.metaKey) && e.key === 'Delete') {
                e.preventDefault();
                const activeTab = document.querySelector('.tab-content.active');
                if (activeTab) {
                    this.clearForm(activeTab.id);
                }
            }
        });
    }
}

// グローバル関数
function clearForm(formId) {
    if (window.formHelper) {
        window.formHelper.clearForm(formId);
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    window.formHelper = new FormHelper();
    
    // タブ切り替え後にデータ復元
    setTimeout(() => {
        window.formHelper.loadAllTabData();
        window.formHelper.enhanceNumberInputs();
        window.formHelper.setupKeyboardShortcuts();
    }, 200);
});