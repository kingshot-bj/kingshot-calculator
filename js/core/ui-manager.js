/**
 * UIManager - UI生成と管理
 * 
 * 責務：
 * - タブの生成と管理
 * - フォームの動的生成
 * - 結果表示の管理
 * - イベントリスナーの設定
 */

class UIManager {
  constructor() {
    this.currentTool = null;
    this.currentResult = null;
    this.formElements = new Map();
  }

  /**
   * タブを生成
   */
  renderTabs(tools) {
    const tabsContainer = document.getElementById('calculator-tabs');
    tabsContainer.innerHTML = '';

    tools.forEach((tool, index) => {
      const tab = document.createElement('button');
      tab.className = `tab ${index === 0 ? 'active' : ''}`;
      tab.dataset.toolId = tool.id;
      tab.innerHTML = `
        <span class="tab-icon">${tool.icon}</span>
        <span class="tab-name">${tool.name}</span>
      `;
      tab.addEventListener('click', () => this.selectTool(tool.id));
      tabsContainer.appendChild(tab);
    });
  }

  /**
   * ツールを選択
   */
  selectTool(toolId) {
    // 前のタブをアクティブ解除
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });

    // 新しいタブをアクティブ化
    document.querySelector(`[data-tool-id="${toolId}"]`).classList.add('active');

    this.currentTool = toolId;
    this.renderCalculator(toolId);
  }
  /**
   * 一括設定UIを生成
   */
  renderBatchSetUI(toolId) {
    const container = document.createElement('div');
    container.className = 'batch-set-panel';

    const html = `
      <div class="batch-controls">
        <h3>一括設定ツール</h3>
        <div class="batch-inputs">
          <div class="batch-input-group">
            <label>現在レベル:</label>
            <div class="slider-container">
              <input type="range" id="batch-current-${toolId}" min="1" max="50" value="1" class="form-slider">
              <span class="slider-value" id="batch-current-value-${toolId}">1</span>
            </div>
          </div>
          <div class="batch-input-group">
            <label>目標レベル:</label>
            <div class="slider-container">
              <input type="range" id="batch-target-${toolId}" min="1" max="50" value="50" class="form-slider">
              <span class="slider-value" id="batch-target-value-${toolId}">50</span>
            </div>
          </div>
        </div>
        <div class="batch-button-group">
          <button type="button" class="btn btn-secondary" onclick="uiManager.applyBatchSettings('${toolId}')">✓ 一括適用</button>
          <button type="button" class="btn btn-secondary" onclick="uiManager.resetForm('${toolId}')">↻ リセット</button>
        </div>
        <div class="quick-buttons">
          <span>クイック設定:</span>
          <button type="button" class="btn btn-small" onclick="uiManager.quickSet('${toolId}', 1, 10)">1→10</button>
          <button type="button" class="btn btn-small" onclick="uiManager.quickSet('${toolId}', 1, 20)">1→20</button>
          <button type="button" class="btn btn-small" onclick="uiManager.quickSet('${toolId}', 1, 30)">1→30</button>
          <button type="button" class="btn btn-small" onclick="uiManager.quickSet('${toolId}', 1, 50)">1→50</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // スライダーの値表示を更新
    const currentSlider = container.querySelector(`#batch-current-${toolId}`);
    const targetSlider = container.querySelector(`#batch-target-${toolId}`);
    const currentValue = container.querySelector(`#batch-current-value-${toolId}`);
    const targetValue = container.querySelector(`#batch-target-value-${toolId}`);

    if (currentSlider) {
      currentSlider.addEventListener('input', (e) => {
        currentValue.textContent = e.target.value;
      });
    }

    if (targetSlider) {
      targetSlider.addEventListener('input', (e) => {
        targetValue.textContent = e.target.value;
      });
    }

    return container;
  }

  /**
   * 一括設定を適用
   */
  applyBatchSettings(toolId) {
    const currentLevel = parseInt(document.getElementById(`batch-current-${toolId}`)?.value || 1);
    const targetLevel = parseInt(document.getElementById(`batch-target-${toolId}`)?.value || 50);

    if (currentLevel > targetLevel) {
      this.showError('現在レベルは目標レベル以下である必要があります');
      return;
    }

    const form = document.getElementById(`form-${toolId}`);
    if (!form) return;

    const sliders = form.querySelectorAll('input[type="range"]');
    let fieldIndex = 0;

    sliders.forEach((slider) => {
      if (fieldIndex % 2 === 0) {
        slider.value = currentLevel;
      } else {
        slider.value = targetLevel;
      }
      // 値表示を更新
      const valueDisplay = slider.nextElementSibling;
      if (valueDisplay && valueDisplay.classList.contains('slider-value')) {
        valueDisplay.textContent = slider.value;
      }
      slider.dispatchEvent(new Event('input'));
      fieldIndex++;
    });

    this.showNotification(`全部位を Lv${currentLevel} → Lv${targetLevel} に設定しました`, 'success');
  }

  /**
   * クイック設定
   */
  quickSet(toolId, currentLevel, targetLevel) {
    document.getElementById(`batch-current-${toolId}`).value = currentLevel;
    document.getElementById(`batch-target-${toolId}`).value = targetLevel;
    document.getElementById(`batch-current-value-${toolId}`).textContent = currentLevel;
    document.getElementById(`batch-target-value-${toolId}`).textContent = targetLevel;
    this.applyBatchSettings(toolId);
  }

  /**
   * フォームをリセット
   */
  resetForm(toolId) {
    const form = document.getElementById(`form-${toolId}`);
    if (form) {
      const sliders = form.querySelectorAll('input[type="range"]');
      sliders.forEach((slider) => {
        slider.value = slider.min;
        const valueDisplay = slider.nextElementSibling;
        if (valueDisplay && valueDisplay.classList.contains('slider-value')) {
          valueDisplay.textContent = slider.value;
        }
      });
    }
    document.getElementById(`batch-current-${toolId}`).value = 1;
    document.getElementById(`batch-target-${toolId}`).value = 50;
    document.getElementById(`batch-current-value-${toolId}`).textContent = 1;
    document.getElementById(`batch-target-value-${toolId}`).textContent = 50;
    this.showNotification('フォームをリセットしました', 'info');
  }

  /**
   * ツール説明を表示
   */
  renderCalculationForm(toolId) {
    const tool = calculatorEngine.getTool(toolId);
    if (!tool) return;

    const contentDiv = document.getElementById('calculator-content');
    contentDiv.innerHTML = '';
    // ツール説明
    const description = document.createElement('div');
    description.className = 'tool-description';
    description.innerHTML = `<p>${tool.description || ''}</p>`;
    contentDiv.appendChild(description);

    // 一括設定UIを追加
    const batchUI = this.renderBatchSetUI(toolId);
    contentDiv.appendChild(batchUI);

    // フォーム
    const form = document.createElement('form');
    form.className = 'calculator-form';
    form.id = `form-${toolId}`;

    // 入力フィールドを生成
    const fieldsDiv = document.createElement('div');
    fieldsDiv.className = 'form-fields';

    tool.fields.forEach((field, index) => {
      const fieldGroup = this.createFieldGroup(toolId, field, index);
      fieldsDiv.appendChild(fieldGroup);
    });

    form.appendChild(fieldsDiv);

    // ボタングループ
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const calculateBtn = document.createElement('button');
    calculateBtn.type = 'button';
    calculateBtn.className = 'btn btn-primary';
    calculateBtn.textContent = '計算する';
    calculateBtn.addEventListener('click', () => this.handleCalculate(toolId));

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn btn-secondary';
    resetBtn.textContent = 'リセット';
    resetBtn.addEventListener('click', () => this.resetForm(toolId));

    buttonGroup.appendChild(calculateBtn);
    buttonGroup.appendChild(resetBtn);
    form.appendChild(buttonGroup);

    contentDiv.appendChild(form);

    // 結果表示エリア
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result-container';
    resultDiv.id = `result-${toolId}`;
    contentDiv.appendChild(resultDiv);

    // 履歴を表示
    this.renderRecentHistory(toolId);
  }

  /**
   * フィールドグループを作成
   */
  createFieldGroup(toolId, field, index) {
    const group = document.createElement('div');
    group.className = 'form-group';

    const label = document.createElement('label');
    label.htmlFor = `field-${toolId}-${index}`;
    label.textContent = field.label;
    group.appendChild(label);

    let input;

    if (field.type === 'select' || field.type === 'slider') {
      // スライダーを作成
      const sliderContainer = document.createElement('div');
      sliderContainer.className = 'slider-container';

      input = document.createElement('input');
      input.type = 'range';
      input.id = `field-${toolId}-${index}`;
      input.className = 'form-slider';
      input.dataset.fieldName = field.name;
      input.min = field.min || 1;
      input.max = field.max || 50;
      input.value = field.default || 1;
      input.step = 1;

      // 値表示用のラベル
      const valueDisplay = document.createElement('span');
      valueDisplay.className = 'slider-value';
      valueDisplay.textContent = input.value;
      valueDisplay.id = `value-${toolId}-${index}`;

      // スライダーの値が変わったら表示を更新
      input.addEventListener('input', (e) => {
        valueDisplay.textContent = e.target.value;
      });

      sliderContainer.appendChild(input);
      sliderContainer.appendChild(valueDisplay);
      group.appendChild(sliderContainer);
    } else if (field.type === 'number') {
      input = document.createElement('input');
      input.type = 'number';
      input.id = `field-${toolId}-${index}`;
      input.className = 'form-control';
      input.dataset.fieldName = field.name;
      input.min = field.min || 0;
      input.max = field.max || '';
      input.value = field.default || 0;
      input.placeholder = field.placeholder || '';
      group.appendChild(input);
    } else {
      input = document.createElement('input');
      input.type = field.type || 'text';
      input.id = `field-${toolId}-${index}`;
      input.className = 'form-control';
      input.dataset.fieldName = field.name;
      input.placeholder = field.placeholder || '';
      group.appendChild(input);
    }

    if (field.help) {
      const help = document.createElement('small');
      help.className = 'form-help';
      help.textContent = field.help;
      group.appendChild(help);
    }

    return group;
  }

  /**
   * 計算を処理
   */
  handleCalculate(toolId) {
    try {
      // フォームから入力値を取得
      const form = document.getElementById(`form-${toolId}`);
      if (!form) return;

      const inputs = form.querySelectorAll('input[type="range"], input[type="number"], input[type="text"], select');
      const values = {};

      inputs.forEach((input) => {
        const fieldName = input.dataset.fieldName;
        if (fieldName) {
          values[fieldName] = input.value;
        }
      });

      // 計算を実行
      const tool = calculatorEngine.getTool(toolId);
      const result = tool.calculateFn(values, tool);

      // 結果を表示
      this.renderResult(toolId, result);

      // 履歴を更新
      this.renderRecentHistory(toolId);

      // マスコットをお祝いさせる
      if (app && app.mascotCelebrate) {
        setTimeout(() => app.mascotCelebrate(), 300);
      }
    } catch (error) {
      this.showError(error.message);
    }
  }

  /**
   * 計算結果を表示
   */
  renderResult(toolId, result) {
    const resultDiv = document.getElementById(`result-${toolId}`);
    if (!resultDiv) return;

    this.currentResult = { toolId, ...result };

    const html = `
      <div class="result-card">
        <h3>計算結果</h3>
        <div class="result-details">
          ${Object.entries(result).map(([key, value]) => `
            <div class="result-row">
              <span class="result-label">${key}:</span>
              <span class="result-value">${value}</span>
            </div>
          `).join('')}
        </div>
        <div class="result-actions">
          <button class="btn btn-secondary" onclick="uiManager.addToFavorites('${toolId}')">⭐ お気に入り</button>
          <button class="btn btn-secondary" onclick="uiManager.exportResult('${toolId}')">📥 エクスポート</button>
        </div>
      </div>
    `;

    resultDiv.innerHTML = html;
  }

  /**
   * 最近の履歴を表示
   */
  renderRecentHistory(toolId) {
    const history = storageManager.getHistory(toolId);
    const historyDiv = document.getElementById('history-content');

    if (!historyDiv) return;

    if (history.length === 0) {
      historyDiv.innerHTML = '<p class="empty-state">履歴がありません</p>';
      return;
    }

    const html = `
      <div class="history-list">
        ${history.slice(0, 5).map((item, index) => `
          <div class="history-item" onclick="uiManager.restoreHistory('${toolId}', ${index})">
            <div class="history-info">
              <span class="history-tool">${item.toolName}</span>
              <span class="history-time">${new Date(item.timestamp).toLocaleString('ja-JP')}</span>
            </div>
            <div class="history-actions">
              <button class="btn-icon" onclick="event.stopPropagation(); uiManager.deleteHistory('${toolId}', ${index})">🗑️</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    historyDiv.innerHTML = html;
  }

  /**
   * 履歴を復元
   */
  restoreHistory(toolId, index) {
    const history = storageManager.getHistory(toolId);
    if (history[index]) {
      const item = history[index];
      // フォームに値を復元
      const form = document.getElementById(`form-${toolId}`);
      if (form) {
        Object.entries(item.inputs).forEach(([key, value]) => {
          const input = form.querySelector(`[data-field-name="${key}"]`);
          if (input) {
            input.value = value;
            const valueDisplay = input.nextElementSibling;
            if (valueDisplay && valueDisplay.classList.contains('slider-value')) {
              valueDisplay.textContent = value;
            }
          }
        });
      }
      this.showNotification('履歴を復元しました', 'info');
    }
  }

  /**
   * 履歴を削除
   */
  deleteHistory(toolId, index) {
    storageManager.deleteHistory(toolId, index);
    this.renderRecentHistory(toolId);
    this.showNotification('履歴を削除しました', 'info');
  }

  /**
   * お気に入りに追加
   */
  addToFavorites(toolId) {
    if (this.currentResult) {
      storageManager.addFavorite(toolId, this.currentResult);
      this.showNotification('お気に入りに追加しました', 'success');
    }
  }

  /**
   * 結果をエクスポート
   */
  exportResult(toolId) {
    if (this.currentResult) {
      const data = JSON.stringify(this.currentResult, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `result-${new Date().getTime()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.showNotification('エクスポートしました', 'success');
    }
  }

  /**
   * 通知を表示
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * エラーを表示
   */
  showError(message) {
    this.showNotification(message, 'error');
  }

  /**
   * 計算機を描画
   */
  renderCalculator(toolId) {
    this.renderCalculationForm(toolId);
  }
}

// UIManagerのインスタンス
const uiManager = new UIManager();
