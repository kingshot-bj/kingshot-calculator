/**
 * CalculatorEngine - 複数の計算ツール対応の共通エンジン
 * 
 * 設計思想：
 * - プラグインアーキテクチャで新しいツール追加が容易
 * - マスターデータの検証と管理
 * - 計算結果のキャッシングと最適化
 * - エラーハンドリングの統一
 */

class CalculatorEngine {
  constructor() {
    this.tools = new Map();
    this.cache = new Map();
    this.validators = new Map();
  }

  /**
   * 新しい計算ツールを登録
   * @param {string} toolId - ツールの一意識別子
   * @param {Object} toolConfig - ツール設定
   */
  registerTool(toolId, toolConfig) {
    if (this.tools.has(toolId)) {
      throw new Error(`Tool "${toolId}" is already registered`);
    }

    // ツール設定の検証
    this.validateToolConfig(toolConfig);

    // マスターデータの検証
    if (toolConfig.masterData) {
      this.validateMasterData(toolId, toolConfig.masterData);
    }

    this.tools.set(toolId, {
      id: toolId,
      name: toolConfig.name,
      description: toolConfig.description,
      icon: toolConfig.icon || '📊',
      masterData: toolConfig.masterData || [],
      fields: toolConfig.fields || [],
      calculateFn: toolConfig.calculateFn,
      validateFn: toolConfig.validateFn || (() => true),
      exportFn: toolConfig.exportFn,
    });

    // マスターデータをMapに変換して高速化
    if (toolConfig.masterData && toolConfig.masterData.length > 0) {
      const masterMap = new Map();
      const idField = toolConfig.idField || 'id';
      toolConfig.masterData.forEach(item => {
        masterMap.set(item[idField], item);
      });
      this.tools.get(toolId).masterDataMap = masterMap;
    }

    console.log(`✓ Tool registered: ${toolId}`);
  }

  /**
   * ツール設定の検証
   */
  validateToolConfig(config) {
    const required = ['name', 'fields', 'calculateFn'];
    for (const field of required) {
      if (!config[field]) {
        throw new Error(`Tool config missing required field: ${field}`);
      }
    }

    if (typeof config.calculateFn !== 'function') {
      throw new Error('calculateFn must be a function');
    }

    if (!Array.isArray(config.fields) || config.fields.length === 0) {
      throw new Error('fields must be a non-empty array');
    }
  }

  /**
   * マスターデータの検証
   */
  validateMasterData(toolId, masterData) {
    if (!Array.isArray(masterData)) {
      throw new Error(`Master data for "${toolId}" must be an array`);
    }

    if (masterData.length === 0) {
      console.warn(`Master data for "${toolId}" is empty`);
      return;
    }

    // 最初のアイテムのキーを確認
    const firstItem = masterData[0];
    const keys = Object.keys(firstItem);

    // すべてのアイテムが同じキーを持つか確認
    masterData.forEach((item, idx) => {
      const itemKeys = Object.keys(item);
      if (itemKeys.length !== keys.length || !itemKeys.every(k => keys.includes(k))) {
        console.warn(`Item ${idx} in "${toolId}" has inconsistent keys`);
      }
    });

    console.log(`✓ Master data validated for "${toolId}" (${masterData.length} items)`);
  }

  /**
   * 計算を実行
   * @param {string} toolId - ツールID
   * @param {Object} inputs - ユーザー入力
   * @returns {Object} 計算結果
   */
  calculate(toolId, inputs) {
    const tool = this.tools.get(toolId);
    if (!tool) {
      throw new Error(`Tool "${toolId}" not found`);
    }

    // キャッシュキーを生成
    const cacheKey = this.generateCacheKey(toolId, inputs);

    // キャッシュをチェック
    if (this.cache.has(cacheKey)) {
      console.log(`Cache hit for ${toolId}`);
      return this.cache.get(cacheKey);
    }

    // 入力値の検証
    const validation = tool.validateFn(inputs, tool);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // 計算を実行
    try {
      const result = tool.calculateFn(inputs, tool);

      // 結果にメタデータを追加
      const enrichedResult = {
        toolId,
        timestamp: new Date().toISOString(),
        inputs,
        ...result,
      };

      // キャッシュに保存
      this.cache.set(cacheKey, enrichedResult);

      return enrichedResult;
    } catch (error) {
      throw new Error(`Calculation error in "${toolId}": ${error.message}`);
    }
  }

  /**
   * キャッシュキーを生成
   */
  generateCacheKey(toolId, inputs) {
    return `${toolId}:${JSON.stringify(inputs)}`;
  }

  /**
   * キャッシュをクリア
   */
  clearCache(toolId = null) {
    if (toolId) {
      const keysToDelete = Array.from(this.cache.keys()).filter(k => k.startsWith(`${toolId}:`));
      keysToDelete.forEach(k => this.cache.delete(k));
    } else {
      this.cache.clear();
    }
  }

  /**
   * 登録されているすべてのツールを取得
   */
  getTools() {
    return Array.from(this.tools.values());
  }

  /**
   * 特定のツールを取得
   */
  getTool(toolId) {
    return this.tools.get(toolId);
  }

  /**
   * マスターデータを取得（高速化版）
   */
  getMasterDataMap(toolId) {
    const tool = this.tools.get(toolId);
    return tool?.masterDataMap || new Map();
  }

  /**
   * マスターデータを検索
   */
  findMasterData(toolId, id) {
    const map = this.getMasterDataMap(toolId);
    return map.get(id);
  }

  /**
   * 計算結果をエクスポート
   */
  export(toolId, result, format = 'json') {
    const tool = this.tools.get(toolId);
    if (!tool) {
      throw new Error(`Tool "${toolId}" not found`);
    }

    if (tool.exportFn) {
      return tool.exportFn(result, format);
    }

    // デフォルトエクスポート
    switch (format) {
      case 'json':
        return JSON.stringify(result, null, 2);
      case 'csv':
        return this.convertToCSV(result);
      case 'text':
        return this.convertToText(result);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * CSV形式に変換
   */
  convertToCSV(result) {
    const lines = [];
    lines.push(`Tool,${result.toolId}`);
    lines.push(`Timestamp,${result.timestamp}`);
    lines.push('');
    lines.push('Inputs:');
    Object.entries(result.inputs).forEach(([key, value]) => {
      lines.push(`${key},${value}`);
    });
    lines.push('');
    lines.push('Results:');
    Object.entries(result).forEach(([key, value]) => {
      if (!['toolId', 'timestamp', 'inputs'].includes(key) && typeof value !== 'object') {
        lines.push(`${key},${value}`);
      }
    });
    return lines.join('\n');
  }

  /**
   * テキスト形式に変換
   */
  convertToText(result) {
    const lines = [];
    lines.push(`=== ${result.toolId} ===`);
    lines.push(`時刻: ${result.timestamp}`);
    lines.push('');
    lines.push('入力:');
    Object.entries(result.inputs).forEach(([key, value]) => {
      lines.push(`  ${key}: ${value}`);
    });
    lines.push('');
    lines.push('結果:');
    Object.entries(result).forEach(([key, value]) => {
      if (!['toolId', 'timestamp', 'inputs'].includes(key) && typeof value !== 'object') {
        lines.push(`  ${key}: ${value}`);
      }
    });
    return lines.join('\n');
  }
}

// グローバルインスタンス
const calculatorEngine = new CalculatorEngine();
