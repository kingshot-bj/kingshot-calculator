/**
 * Main Application - アプリケーション初期化と制御
 */

class LordGearApp {
  constructor() {
    this.initialized = false;
  }

  /**
   * アプリケーション初期化
   */
  init() {
    if (this.initialized) return;

    console.log('Initializing Lord Gear Calculator Pro...');

    // テーマ設定
    this.initTheme();

    // イベントリスナー設定
    this.setupEventListeners();

    // UIを初期化
    const tools = calculatorEngine.getTools();
    if (tools.length > 0) {
      uiManager.renderTabs(tools);
      uiManager.selectTool(tools[0].id);
    }

    // サイドバーを初期化
    this.initSidebar();

    // マスコットを初期化
    this.initMascot();

    this.initialized = true;
    console.log('✓ Application initialized');
  }

  /**
   * テーマ初期化
   */
  initTheme() {
    const savedTheme = storageManager.getSetting('theme', 'light');
    this.setTheme(savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = storageManager.getSetting('theme', 'light');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        storageManager.updateSettings({ theme: newTheme });
      });
    }
  }

  /**
   * テーマを設定
   */
  setTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark-mode');
      document.getElementById('theme-toggle').textContent = '☀️';
    } else {
      html.classList.remove('dark-mode');
      document.getElementById('theme-toggle').textContent = '🌙';
    }
  }

  /**
   * イベントリスナーを設定
   */
  setupEventListeners() {
    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
      // Ctrl+S: 計算結果を保存
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (uiManager.currentResult) {
          uiManager.addToFavorites(uiManager.currentResult);
        }
      }

      // Ctrl+E: エクスポート
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        if (uiManager.currentResult) {
          uiManager.showExportMenu(uiManager.currentResult.toolId, uiManager.currentResult);
        }
      }
    });

    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  /**
   * サイドバーを初期化
   */
  initSidebar() {
    const sidebarClose = document.getElementById('sidebar-close');
    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('open');
      });
    }

    // 初期履歴を表示
    const tools = calculatorEngine.getTools();
    if (tools.length > 0) {
      uiManager.renderRecentHistory(tools[0].id);
    }
  }

  /**
   * マスコットを初期化
   */
  initMascot() {
    const mascot = document.getElementById('mascot-floating');
    if (!mascot) return;

    // クリックでリアクション
    mascot.addEventListener('click', () => {
      this.mascotReaction();
    });
  }

  /**
   * マスコットのリアクション
   */
  mascotReaction() {
    const mascot = document.getElementById('mascot-floating');
    if (!mascot) return;

    const reactions = [
      '計算手伝うよ！',
      'がんばって！',
      'いけいけ！',
      'ファイト！',
      '応援してる！',
    ];

    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    uiManager.showNotification(reaction, 'success');

    // アニメーション
    mascot.style.animation = 'none';
    setTimeout(() => {
      mascot.style.animation = '';
    }, 10);
  }

  /**
   * マスコットがお祝い
   */
  mascotCelebrate() {
    const mascot = document.getElementById('mascot-floating');
    if (!mascot) return;

    mascot.style.animation = 'mascot-bounce 0.5s ease-in-out 3';
    setTimeout(() => {
      mascot.style.animation = '';
    }, 1500);
  }

  /**
   * リサイズ処理
   */
  handleResize() {
    const width = window.innerWidth;
    const sidebar = document.getElementById('sidebar');

    if (width < 768) {
      // モバイル時はサイドバーを隠す
      if (sidebar) {
        sidebar.classList.remove('open');
      }
    }
  }

  /**
   * 設定ページを表示
   */
  showSettings() {
    const settings = storageManager.getSettings();
    const usage = storageManager.getStorageUsage();

    const html = `
      <div class="settings-modal">
        <div class="modal-content">
          <h2>設定</h2>
          
          <div class="settings-section">
            <h3>一般設定</h3>
            <label>
              <input type="checkbox" id="auto-save" ${settings.autoSave ? 'checked' : ''}>
              自動保存
            </label>
            <label>
              <input type="checkbox" id="show-tips" ${settings.showTips ? 'checked' : ''}>
              ヒントを表示
            </label>
          </div>

          <div class="settings-section">
            <h3>ストレージ</h3>
            <p>使用量: ${usage.usedMB} MB</p>
            <button onclick="storageManager.clearAllData(); location.reload()">すべてクリア</button>
          </div>

          <div class="settings-section">
            <h3>データ管理</h3>
            <button onclick="app.exportAllData()">データをエクスポート</button>
            <button onclick="app.showImportDialog()">データをインポート</button>
          </div>

          <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">閉じる</button>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.innerHTML = html;
    document.body.appendChild(modal);

    // イベントリスナー設定
    document.getElementById('auto-save').addEventListener('change', (e) => {
      storageManager.updateSettings({ autoSave: e.target.checked });
    });

    document.getElementById('show-tips').addEventListener('change', (e) => {
      storageManager.updateSettings({ showTips: e.target.checked });
    });
  }

  /**
   * すべてのデータをエクスポート
   */
  exportAllData() {
    const data = storageManager.exportData('json');
    uiManager.downloadFile(data, 'lord-gear-backup.json', 'application/json');
    uiManager.showNotification('データをエクスポートしました');
  }

  /**
   * インポートダイアログを表示
   */
  showImportDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            storageManager.importData(event.target.result);
            uiManager.showNotification('データをインポートしました');
            location.reload();
          } catch (error) {
            uiManager.showError('インポートに失敗しました: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    });
    input.click();
  }

  /**
   * 比較モードを開く
   */
  openComparisonMode() {
    const favorites = storageManager.getFavorites();
    if (favorites.length < 2) {
      uiManager.showError('比較するには最低2つのお気に入りが必要です');
      return;
    }

    // 比較UIを表示
    const html = `
      <div class="comparison-modal">
        <div class="modal-content">
          <h2>計算結果の比較</h2>
          <div class="comparison-table">
            <!-- 比較テーブルがここに挿入される -->
          </div>
          <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">閉じる</button>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.innerHTML = html;
    document.body.appendChild(modal);
  }

  /**
   * ヘルプを表示
   */
  showHelp() {
    const helpText = `
# Lord Gear Calculator Pro - ヘルプ

## 基本的な使い方

1. **ツールを選択**: 上部のタブから使用したいツールを選択します
2. **入力値を入力**: 現在のレベルと目標レベルを選択します
3. **計算ボタンをクリック**: 必要な素材が計算されます
4. **結果を保存**: 「お気に入り」ボタンで結果を保存できます

## キーボードショートカット

- **Ctrl+S**: 現在の計算結果をお気に入りに追加
- **Ctrl+E**: 計算結果をエクスポート

## 機能

### 計算履歴
左側のサイドバーに最近の計算履歴が表示されます。
クリックすると、その計算を再度実行できます。

### お気に入り
よく使う計算結果を「お気に入り」に保存できます。
設定から「データ管理」で、お気に入りを管理できます。

### データ管理
- **エクスポート**: 計算履歴とお気に入りをバックアップできます
- **インポート**: 別のデバイスからバックアップを復元できます

### ダークモード
右上の月のアイコンをクリックすると、ダークモードに切り替わります。

## 新しいツールの追加

新しい計算ツールを追加するには、以下の手順に従います：

1. \`js/tools/\` ディレクトリに新しいファイルを作成
2. ツール設定を定義
3. \`calculatorEngine.registerTool()\` でツールを登録

詳細は開発者ドキュメントを参照してください。
    `;

    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="btn-close" onclick="this.parentElement.parentElement.remove()">✕</button>
        <div class="help-content">
          ${helpText.split('\n').map(line => {
            if (line.startsWith('#')) return `<h${line.match(/#/g).length}>${line.replace(/#/g, '')}</h${line.match(/#/g).length}>`;
            if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
            if (line.startsWith('1. ')) return `<ol><li>${line.substring(3)}</li></ol>`;
            return `<p>${line}</p>`;
          }).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

// アプリケーションインスタンス
const app = new LordGearApp();

// DOMロード完了時に初期化
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});

// ページ離脱時の確認
window.addEventListener('beforeunload', (e) => {
  if (uiManager.currentResult && storageManager.getSetting('autoSave')) {
    // 自動保存
  }
});
