/**
 * Battle Simulator UI - 戦闘シミュレーターのUI実装
 */

class BattleSimulatorUI {
  constructor() {
    this.toolId = 'battle-simulator';
    this.currentStats = {
      player: {
        infantry: { count: 50000, attack: 100, defense: 100, lethality: 100, health: 100 },
        cavalry: { count: 50000, attack: 100, defense: 100, lethality: 100, health: 100 },
        archery: { count: 50000, attack: 100, defense: 100, lethality: 100, health: 100 },
      },
      opponent: {
        infantry: { count: 60000, attack: 100, defense: 100, lethality: 100, health: 100 },
        cavalry: { count: 45000, attack: 100, defense: 100, lethality: 100, health: 100 },
        archery: { count: 40000, attack: 100, defense: 100, lethality: 100, health: 100 },
      },
    };
    this.numberOfBattles = 1000;
    this.lastResult = null;
  }

  /**
   * UIを生成
   */
  generateUI() {
    return `
      <div class="battle-simulator-container">
        <div class="battle-simulator-header">
          <h2>⚔️ 戦闘シミュレーター</h2>
          <p class="subtitle">KingShot公式戦闘メカニズム対応</p>
        </div>

        <div class="battle-simulator-controls">
          <div class="control-group">
            <label>シミュレーション回数</label>
            <input type="number" id="bs-battles" value="1000" min="100" max="10000" step="100">
          </div>
          <button id="bs-calculate" class="btn btn-primary">計算する</button>
          <button id="bs-reset" class="btn btn-secondary">リセット</button>
        </div>

        <div class="battle-simulator-layout">
          <!-- 自分のステータス -->
          <div class="battle-simulator-section">
            <h3>自分のステータス</h3>
            <div class="troop-inputs">
              ${this.generateTroopInputs('player')}
            </div>
          </div>

          <!-- 相手のステータス -->
          <div class="battle-simulator-section">
            <h3>相手のステータス</h3>
            <div class="troop-inputs">
              ${this.generateTroopInputs('opponent')}
            </div>
          </div>
        </div>

        <!-- 計算結果 -->
        <div id="bs-results" class="battle-results" style="display: none;">
          <div class="results-header">
            <h3>計算結果</h3>
          </div>
          <div class="results-content" id="bs-results-content"></div>
        </div>
      </div>
    `;
  }

  /**
   * 兵種入力フィールドを生成
   */
  generateTroopInputs(side) {
    const troops = ['infantry', 'cavalry', 'archery'];
    const troopNames = { infantry: '歩兵', cavalry: '騎兵', archery: '弓兵' };
    const fieldNames = { count: '兵数', attack: '攻撃', defense: '防御', lethality: '致命性', health: '体力' };

    let html = '';
    troops.forEach(troop => {
      html += `
        <div class="troop-group">
          <h4>${troopNames[troop]}</h4>
          <div class="troop-fields">
            ${Object.keys(fieldNames).map(field => `
              <div class="field-group">
                <label>${fieldNames[field]}</label>
                <input type="number" 
                       id="bs-${side}-${troop}-${field}" 
                       value="${this.currentStats[side][troop][field]}"
                       min="0"
                       ${field === 'count' ? 'max="999999"' : 'max="999"'}>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
    return html;
  }

  /**
   * イベントリスナーを設定
   */
  setupEventListeners() {
    const calculateBtn = document.getElementById('bs-calculate');
    const resetBtn = document.getElementById('bs-reset');
    const battlesInput = document.getElementById('bs-battles');

    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => this.handleCalculate());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.handleReset());
    }

    if (battlesInput) {
      battlesInput.addEventListener('change', (e) => {
        this.numberOfBattles = parseInt(e.target.value) || 1000;
      });
    }

    // 入力フィールドの変更を監視
    const troops = ['infantry', 'cavalry', 'archery'];
    const sides = ['player', 'opponent'];
    const fields = ['count', 'attack', 'defense', 'lethality', 'health'];

    sides.forEach(side => {
      troops.forEach(troop => {
        fields.forEach(field => {
          const input = document.getElementById(`bs-${side}-${troop}-${field}`);
          if (input) {
            input.addEventListener('change', (e) => {
              this.currentStats[side][troop][field] = parseInt(e.target.value) || 0;
            });
          }
        });
      });
    });
  }

  /**
   * 計算を実行
   */
  handleCalculate() {
    try {
      // ステータスを更新
      this.updateStatsFromUI();

      // 計算実行
      const result = battleSimulator.simulateBattle(
        this.currentStats.player,
        this.currentStats.opponent,
        this.numberOfBattles
      );

      this.lastResult = result;
      this.displayResults(result);

      // 履歴に保存
      if (typeof storageManager !== 'undefined') {
        storageManager.addToHistory(this.toolId, {
          player: JSON.stringify(this.currentStats.player),
          opponent: JSON.stringify(this.currentStats.opponent),
          battles: this.numberOfBattles,
          result: result,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('計算エラー:', error);
      if (typeof uiManager !== 'undefined') {
        uiManager.showError('計算中にエラーが発生しました: ' + error.message);
      }
    }
  }

  /**
   * UIからステータスを更新
   */
  updateStatsFromUI() {
    const troops = ['infantry', 'cavalry', 'archery'];
    const sides = ['player', 'opponent'];
    const fields = ['count', 'attack', 'defense', 'lethality', 'health'];

    sides.forEach(side => {
      troops.forEach(troop => {
        fields.forEach(field => {
          const input = document.getElementById(`bs-${side}-${troop}-${field}`);
          if (input) {
            this.currentStats[side][troop][field] = parseInt(input.value) || 0;
          }
        });
      });
    });
  }

  /**
   * 結果を表示
   */
  displayResults(result) {
    const resultsDiv = document.getElementById('bs-results');
    const resultsContent = document.getElementById('bs-results-content');

    if (!resultsDiv || !resultsContent) return;

    const html = `
      <div class="result-item">
        <h4>勝率</h4>
        <p class="result-value">${result.winRate.toFixed(1)}%</p>
      </div>
      <div class="result-item">
        <h4>期待ダメージ</h4>
        <p class="result-value">${result.expectedDamage.toFixed(0)}</p>
      </div>
      <div class="result-item">
        <h4>兵種別ダメージ分析</h4>
        <div class="damage-breakdown">
          <div class="damage-bar">
            <label>歩兵</label>
            <div class="bar-container">
              <div class="bar" style="width: ${result.infantryDamagePercentage}%; background-color: #4ade80;"></div>
            </div>
            <span>${result.infantryDamagePercentage.toFixed(1)}%</span>
          </div>
          <div class="damage-bar">
            <label>騎兵</label>
            <div class="bar-container">
              <div class="bar" style="width: ${result.cavalryDamagePercentage}%; background-color: #fbbf24;"></div>
            </div>
            <span>${result.cavalryDamagePercentage.toFixed(1)}%</span>
          </div>
          <div class="damage-bar">
            <label>弓兵</label>
            <div class="bar-container">
              <div class="bar" style="width: ${result.archeryDamagePercentage}%; background-color: #3b82f6;"></div>
            </div>
            <span>${result.archeryDamagePercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    `;

    resultsContent.innerHTML = html;
    resultsDiv.style.display = 'block';
  }

  /**
   * リセット
   */
  handleReset() {
    this.currentStats = {
      player: {
        infantry: { count: 50000, attack: 100, defense: 100, lethality: 100, health: 100 },
        cavalry: { count: 50000, attack: 100, defense: 100, lethality: 100, health: 100 },
        archery: { count: 50000, attack: 100, defense: 100, lethality: 100, health: 100 },
      },
      opponent: {
        infantry: { count: 60000, attack: 100, defense: 100, lethality: 100, health: 100 },
        cavalry: { count: 45000, attack: 100, defense: 100, lethality: 100, health: 100 },
        archery: { count: 40000, attack: 100, defense: 100, lethality: 100, health: 100 },
      },
    };

    // UIを更新
    const troops = ['infantry', 'cavalry', 'archery'];
    const sides = ['player', 'opponent'];
    const fields = ['count', 'attack', 'defense', 'lethality', 'health'];

    sides.forEach(side => {
      troops.forEach(troop => {
        fields.forEach(field => {
          const input = document.getElementById(`bs-${side}-${troop}-${field}`);
          if (input) {
            input.value = this.currentStats[side][troop][field];
          }
        });
      });
    });

    // 結果を非表示
    const resultsDiv = document.getElementById('bs-results');
    if (resultsDiv) {
      resultsDiv.style.display = 'none';
    }
  }
}

// グローバルインスタンス
const battleSimulatorUI = new BattleSimulatorUI();


/**
 * 戦闘シミュレーターツール設定
 */
const battleSimulatorToolConfig = {
  name: '戦闘シミュレーター',
  description: 'KingShot公式戦闘メカニズムに基づいた戦闘シミュレーター',
  icon: '⚔️',
  fields: [
    { id: 'player-infantry-count', label: '自分の歩兵（兵数）', type: 'number', default: 50000 },
    { id: 'player-cavalry-count', label: '自分の騎兵（兵数）', type: 'number', default: 50000 },
    { id: 'player-archery-count', label: '自分の弓兵（兵数）', type: 'number', default: 50000 },
    { id: 'opponent-infantry-count', label: '相手の歩兵（兵数）', type: 'number', default: 60000 },
    { id: 'opponent-cavalry-count', label: '相手の騎兵（兵数）', type: 'number', default: 45000 },
    { id: 'opponent-archery-count', label: '相手の弓兵（兵数）', type: 'number', default: 40000 },
  ],
  calculateFn: (inputs) => {
    // 入力値から計算実行
    const playerStats = {
      infantry: { count: inputs['player-infantry-count'], attack: 100, defense: 100, lethality: 100, health: 100 },
      cavalry: { count: inputs['player-cavalry-count'], attack: 100, defense: 100, lethality: 100, health: 100 },
      archery: { count: inputs['player-archery-count'], attack: 100, defense: 100, lethality: 100, health: 100 },
    };
    const opponentStats = {
      infantry: { count: inputs['opponent-infantry-count'], attack: 100, defense: 100, lethality: 100, health: 100 },
      cavalry: { count: inputs['opponent-cavalry-count'], attack: 100, defense: 100, lethality: 100, health: 100 },
      archery: { count: inputs['opponent-archery-count'], attack: 100, defense: 100, lethality: 100, health: 100 },
    };

    const result = battleSimulator.simulateBattle(playerStats, opponentStats, 1000);
    result.timestamp = new Date().toLocaleString('ja-JP');
    return result;
  },
  validateFn: (inputs) => {
    const errors = [];
    const fields = ['player-infantry-count', 'player-cavalry-count', 'player-archery-count', 'opponent-infantry-count', 'opponent-cavalry-count', 'opponent-archery-count'];
    
    fields.forEach(field => {
      if (inputs[field] === undefined || inputs[field] === null || inputs[field] < 0) {
        errors.push(`${field}は0以上の数値を入力してください`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  },
  exportFn: (result, format) => {
    if (format === 'text') {
      return `
=== 戦闘シミュレーション結果 ===
時刻: ${result.timestamp}

勝率: ${result.winRate.toFixed(1)}%
期待ダメージ: ${result.expectedDamage.toFixed(0)}

兵種別ダメージ分析:
  歩兵: ${result.infantryDamagePercentage.toFixed(1)}%
  騎兵: ${result.cavalryDamagePercentage.toFixed(1)}%
  弓兵: ${result.archeryDamagePercentage.toFixed(1)}%
      `.trim();
    }
    return null;
  },
};

// ツールを登録（DOMロード後に実行）
document.addEventListener('DOMContentLoaded', () => {
  if (typeof calculatorEngine !== 'undefined') {
    calculatorEngine.registerTool('battle-simulator', battleSimulatorToolConfig);
  }
});
