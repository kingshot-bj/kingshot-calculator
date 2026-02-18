/**
 * StorageManager - 計算履歴と設定の管理
 * 
 * 機能：
 * - LocalStorageを使用した永続化
 * - 計算履歴の保存・取得・削除
 * - ユーザー設定の管理
 * - データのエクスポート・インポート
 */

class StorageManager {
  constructor() {
    this.STORAGE_KEY_PREFIX = 'lgcp_';
    this.HISTORY_KEY = `${this.STORAGE_KEY_PREFIX}history`;
    this.SETTINGS_KEY = `${this.STORAGE_KEY_PREFIX}settings`;
    this.FAVORITES_KEY = `${this.STORAGE_KEY_PREFIX}favorites`;
    this.MAX_HISTORY = 100;

    this.initializeStorage();
  }

  /**
   * ストレージを初期化
   */
  initializeStorage() {
    // 履歴が存在しない場合は初期化
    if (!localStorage.getItem(this.HISTORY_KEY)) {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify([]));
    }

    // 設定が存在しない場合は初期化
    if (!localStorage.getItem(this.SETTINGS_KEY)) {
      const defaultSettings = {
        theme: 'light',
        language: 'ja',
        autoSave: true,
        showTips: true,
      };
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(defaultSettings));
    }

    // お気に入りが存在しない場合は初期化
    if (!localStorage.getItem(this.FAVORITES_KEY)) {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify([]));
    }
  }

  /**
   * 計算結果を履歴に保存
   */
  saveToHistory(result) {
    try {
      const history = this.getHistory();

      // 新しい履歴を先頭に追加
      history.unshift({
        id: this.generateId(),
        ...result,
        savedAt: new Date().toISOString(),
      });

      // 最大数を超えた場合は古い履歴を削除
      if (history.length > this.MAX_HISTORY) {
        history.splice(this.MAX_HISTORY);
      }

      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
      return history[0];
    } catch (error) {
      console.error('Failed to save to history:', error);
      throw new Error('履歴の保存に失敗しました');
    }
  }

  /**
   * 履歴を取得
   */
  getHistory(toolId = null, limit = null) {
    try {
      let history = JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');

      // ツールIDでフィルター
      if (toolId) {
        history = history.filter(h => h.toolId === toolId);
      }

      // 件数制限
      if (limit) {
        history = history.slice(0, limit);
      }

      return history;
    } catch (error) {
      console.error('Failed to get history:', error);
      return [];
    }
  }

  /**
   * 履歴から特定のアイテムを取得
   */
  getHistoryItem(id) {
    const history = this.getHistory();
    return history.find(h => h.id === id);
  }

  /**
   * 履歴から特定のアイテムを削除
   */
  deleteHistoryItem(id) {
    try {
      const history = this.getHistory();
      const filtered = history.filter(h => h.id !== id);
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete history item:', error);
      return false;
    }
  }

  /**
   * 履歴をすべてクリア
   */
  clearHistory(toolId = null) {
    try {
      if (toolId) {
        const history = this.getHistory();
        const filtered = history.filter(h => h.toolId !== toolId);
        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(filtered));
      } else {
        localStorage.setItem(this.HISTORY_KEY, JSON.stringify([]));
      }
      return true;
    } catch (error) {
      console.error('Failed to clear history:', error);
      return false;
    }
  }

  /**
   * 設定を取得
   */
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.SETTINGS_KEY) || '{}');
    } catch (error) {
      console.error('Failed to get settings:', error);
      return {};
    }
  }

  /**
   * 設定を更新
   */
  updateSettings(updates) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...updates };
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw new Error('設定の更新に失敗しました');
    }
  }

  /**
   * 特定の設定を取得
   */
  getSetting(key, defaultValue = null) {
    const settings = this.getSettings();
    return settings[key] !== undefined ? settings[key] : defaultValue;
  }

  /**
   * お気に入りに追加
   */
  addFavorite(result) {
    try {
      const favorites = this.getFavorites();

      const favorite = {
        id: this.generateId(),
        name: result.name || `${result.toolId} - ${new Date().toLocaleString('ja-JP')}`,
        ...result,
        addedAt: new Date().toISOString(),
      };

      favorites.unshift(favorite);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
      return favorite;
    } catch (error) {
      console.error('Failed to add favorite:', error);
      throw new Error('お気に入りの追加に失敗しました');
    }
  }

  /**
   * お気に入りを取得
   */
  getFavorites(toolId = null) {
    try {
      let favorites = JSON.parse(localStorage.getItem(this.FAVORITES_KEY) || '[]');

      if (toolId) {
        favorites = favorites.filter(f => f.toolId === toolId);
      }

      return favorites;
    } catch (error) {
      console.error('Failed to get favorites:', error);
      return [];
    }
  }

  /**
   * お気に入りから削除
   */
  removeFavorite(id) {
    try {
      const favorites = this.getFavorites();
      const filtered = favorites.filter(f => f.id !== id);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      return false;
    }
  }

  /**
   * データをエクスポート
   */
  exportData(format = 'json') {
    try {
      const data = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        history: this.getHistory(),
        favorites: this.getFavorites(),
        settings: this.getSettings(),
      };

      switch (format) {
        case 'json':
          return JSON.stringify(data, null, 2);
        case 'csv':
          return this.convertDataToCSV(data);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('データのエクスポートに失敗しました');
    }
  }

  /**
   * データをインポート
   */
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);

      if (!data.version || !data.history || !data.favorites) {
        throw new Error('Invalid data format');
      }

      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(data.history));
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(data.favorites));
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(data.settings || {}));

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('データのインポートに失敗しました');
    }
  }

  /**
   * データをCSV形式に変換
   */
  convertDataToCSV(data) {
    const lines = [];
    lines.push('Tool,Timestamp,Input,Result');

    data.history.forEach(item => {
      const inputStr = JSON.stringify(item.inputs).replace(/"/g, '""');
      const resultStr = JSON.stringify(item).replace(/"/g, '""');
      lines.push(`"${item.toolId}","${item.timestamp}","${inputStr}","${resultStr}"`);
    });

    return lines.join('\n');
  }

  /**
   * ストレージの使用量を取得
   */
  getStorageUsage() {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (key.startsWith(this.STORAGE_KEY_PREFIX)) {
          total += localStorage[key].length;
        }
      }
      return {
        used: total,
        usedMB: (total / 1024 / 1024).toFixed(2),
      };
    } catch (error) {
      console.error('Failed to get storage usage:', error);
      return { used: 0, usedMB: '0' };
    }
  }

  /**
   * ストレージをクリア
   */
  clearAllData() {
    try {
      const keys = [];
      for (const key in localStorage) {
        if (key.startsWith(this.STORAGE_KEY_PREFIX)) {
          keys.push(key);
        }
      }
      keys.forEach(key => localStorage.removeItem(key));
      this.initializeStorage();
      return true;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      return false;
    }
  }

  /**
   * ユニークなIDを生成
   */
  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// グローバルインスタンス
const storageManager = new StorageManager();
