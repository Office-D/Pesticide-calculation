/**
 * ローカルストレージヘルパー - 前回入力値の記憶機能
 */

class StorageHelper {
    constructor() {
        this.PREFIX = 'dilution_calc_';
    }

    /**
     * 値を保存
     * @param {string} key - キー
     * @param {any} value - 値
     */
    save(key, value) {
        try {
            localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
        } catch (error) {
            console.warn('LocalStorage save failed:', error);
        }
    }

    /**
     * 値を取得
     * @param {string} key - キー
     * @param {any} defaultValue - デフォルト値
     * @returns {any} 保存された値またはデフォルト値
     */
    load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('LocalStorage load failed:', error);
            return defaultValue;
        }
    }

    /**
     * 値を削除
     * @param {string} key - キー
     */
    remove(key) {
        try {
            localStorage.removeItem(this.PREFIX + key);
        } catch (error) {
            console.warn('LocalStorage remove failed:', error);
        }
    }

    /**
     * 全データをクリア
     */
    clearAll() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('LocalStorage clear failed:', error);
        }
    }

    /**
     * フォームデータを保存
     * @param {string} formId - フォームID
     * @param {HTMLFormElement} form - フォーム要素
     */
    saveFormData(formId, form) {
        const data = {};
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            if (input.id) {
                data[input.id] = input.value;
            }
        });
        
        this.save(`form_${formId}`, data);
    }

    /**
     * フォームデータを復元
     * @param {string} formId - フォームID
     * @param {HTMLFormElement} form - フォーム要素
     */
    loadFormData(formId, form) {
        const data = this.load(`form_${formId}`, {});
        
        Object.keys(data).forEach(inputId => {
            const input = form.querySelector(`#${inputId}`);
            if (input && data[inputId]) {
                input.value = data[inputId];
            }
        });
    }

    /**
     * 特定フォームのデータをクリア
     * @param {string} formId - フォームID
     */
    clearFormData(formId) {
        this.remove(`form_${formId}`);
    }
}

// グローバルインスタンス
window.storageHelper = new StorageHelper();