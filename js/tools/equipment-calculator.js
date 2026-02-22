/**
 * Equipment Calculator - 装備強化素材計算ツール
 */

// マスターデータ（元のデータから移行）
const EQUIPMENT_MASTER = [
  {id:1, key:"グッド-0", silk:1500, thread:15, bp:0, pt:1125},
  {id:2, key:"グッド-1", silk:3800, thread:40, bp:0, pt:1875},
  {id:3, key:"レア-0", silk:7000, thread:70, bp:0, pt:3000},
  {id:4, key:"レア-1", silk:9700, thread:95, bp:0, pt:4500},
  {id:5, key:"レア-2", silk:1000, thread:10, bp:45, pt:5100},
  {id:6, key:"レア-3", silk:1000, thread:10, bp:50, pt:5440},
  {id:7, key:"エピック-0", silk:1500, thread:15, bp:60, pt:3230},
  {id:8, key:"エピック-1", silk:1500, thread:15, bp:70, pt:3230},
  {id:9, key:"エピック-2", silk:6500, thread:65, bp:40, pt:3225},
  {id:10, key:"エピック-3", silk:8000, thread:80, bp:50, pt:3225},
  {id:11, key:"エピックT1-0", silk:10000, thread:95, bp:60, pt:3440},
  {id:12, key:"エピックT1-1", silk:11000, thread:110, bp:70, pt:3440},
  {id:13, key:"エピックT1-2", silk:13000, thread:130, bp:85, pt:4085},
  {id:14, key:"エピックT1-3", silk:15000, thread:160, bp:100, pt:4085},
  {id:15, key:"レジェンド-0", silk:22000, thread:220, bp:40, pt:6250},
  {id:16, key:"レジェンド-1", silk:23000, thread:230, bp:40, pt:6250},
  {id:17, key:"レジェンド-2", silk:25000, thread:250, bp:45, pt:6250},
  {id:18, key:"レジェンド-3", silk:26000, thread:260, bp:45, pt:6250},
  {id:19, key:"レジェンドT1-0", silk:28000, thread:280, bp:45, pt:6250},
  {id:20, key:"レジェンドT1-1", silk:30000, thread:300, bp:55, pt:6250},
  {id:21, key:"レジェンドT1-2", silk:32000, thread:320, bp:55, pt:6250},
  {id:22, key:"レジェンドT1-3", silk:35000, thread:340, bp:55, pt:0},
  {id:23, key:"レジェンドT2-0", silk:38000, thread:390, bp:55, pt:0},
  {id:24, key:"レジェンドT2-1", silk:43000, thread:430, bp:75, pt:0},
  {id:25, key:"レジェンドT2-2", silk:45000, thread:460, bp:80, pt:0},
  {id:26, key:"レジェンドT2-3", silk:48000, thread:500, bp:85, pt:0},
  {id:27, key:"レジェンドT3-0", silk:60000, thread:600, bp:120, pt:0},
  {id:28, key:"レジェンドT3-1", silk:70000, thread:700, bp:140, pt:9000},
  {id:29, key:"レジェンドT3-2", silk:80000, thread:800, bp:160, pt:9000},
  {id:30, key:"レジェンドT3-3", silk:90000, thread:900, bp:180, pt:9000},
  {id:31, key:"神話-0", silk:108000, thread:1080, bp:220, pt:12000},
  {id:32, key:"神話-1", silk:114000, thread:1140, bp:230, pt:12000},
  {id:33, key:"神話-2", silk:121000, thread:1210, bp:240, pt:12000},
  {id:34, key:"神話-3", silk:128000, thread:1280, bp:250, pt:12000},
  {id:35, key:"神話T1-0", silk:154000, thread:1540, bp:300, pt:15000},
  {id:36, key:"神話T1-1", silk:163000, thread:1630, bp:320, pt:15000},
  {id:37, key:"神話T1-2", silk:173000, thread:1730, bp:340, pt:15000},
  {id:38, key:"神話T1-3", silk:183000, thread:1830, bp:360, pt:15000},
  {id:39, key:"神話T2-0", silk:220000, thread:2200, bp:430, pt:0},
  {id:40, key:"神話T2-1", silk:233000, thread:2330, bp:460, pt:0},
  {id:41, key:"神話T2-2", silk:247000, thread:2470, bp:490, pt:0},
  {id:42, key:"神話T2-3", silk:264000, thread:2640, bp:520, pt:0},
  {id:43, key:"神話T3-0", silk:306000, thread:3060, bp:610, pt:0},
  {id:44, key:"神話T3-1", silk:323000, thread:3230, bp:650, pt:0},
  {id:45, key:"神話T3-2", silk:340000, thread:3400, bp:690, pt:0},
  {id:46, key:"神話T3-3", silk:357000, thread:3570, bp:730, pt:0},
  {id:47, key:"神話T4-0", silk:412000, thread:4120, bp:840, pt:0},
  {id:48, key:"神話T4-1", silk:433000, thread:4330, bp:890, pt:0},
  {id:49, key:"神話T4-2", silk:454000, thread:4540, bp:940, pt:0},
  {id:50, key:"神話T4-3", silk:475000, thread:4750, bp:990, pt:0},
];

// 部位定義
const EQUIPMENT_PARTS = [
  { id: 'hat', label: '帽子' },
  { id: 'decoration', label: '装飾' },
  { id: 'robe', label: 'ローブ' },
  { id: 'pants', label: 'ズボン' },
  { id: 'ring', label: '指輪' },
  { id: 'staff', label: '杖' },
];

// グループ化された選択肢を生成（モバイル表示用）
const createGroupedOptions = () => {
  const options = [];
  const groups = [
    { name: 'グッド', prefix: 'グッド' },
    { name: 'レア', prefix: 'レア' },
    { name: 'エピック', prefix: 'エピック' },
    { name: 'レジェンド', prefix: 'レジェンド' },
    { name: '神話', prefix: '神話' },
  ];
  
  groups.forEach(group => {
    EQUIPMENT_MASTER.filter(m => m.key.startsWith(group.prefix)).forEach(item => {
      options.push({ value: item.id, label: item.key });
    });
  });
  
  return options;
};

// フィールド定義
const groupedOptions = createGroupedOptions();
const EQUIPMENT_FIELDS = EQUIPMENT_PARTS.flatMap(part => [
  {
    name: `${part.id}_current`,
    label: `${part.label} - 現在`,
    type: 'select',
    options: groupedOptions,
  },
  {
    name: `${part.id}_target`,
    label: `${part.label} - 目標`,
    type: 'select',
    options: groupedOptions,
  },
]).concat([
  { name: 'have_silk', label: '所持献上品の絹', type: 'number', default: 0 },
  { name: 'have_thread', label: '所持金の糸', type: 'number', default: 0 },
  { name: 'have_bp', label: '所持設計図', type: 'number', default: 0 },
]);

/**
 * 装備計算ツール設定
 */
const equipmentToolConfig = {
  name: '装備計算',
  description: '6部位の装備強化に必要な素材を計算します',
  icon: '⚔️',
  masterData: EQUIPMENT_MASTER,
  idField: 'id',
  fields: EQUIPMENT_FIELDS,

  /**
   * 計算ロジック
   */
  calculateFn: (inputs, tool) => {
    let needSilk = 0, needThread = 0, needBP = 0, gainPT = 0;

    // 各部位の計算
    EQUIPMENT_PARTS.forEach(part => {
      const currentId = Number(inputs[`${part.id}_current`]);
      const targetId = Number(inputs[`${part.id}_target`]);

      if (!currentId || !targetId || targetId <= currentId) return;

      // currentIdからtargetIdまでの素材を合算
      for (let id = currentId + 1; id <= targetId; id++) {
        const master = tool.masterDataMap.get(id);
        if (master) {
          needSilk += master.silk;
          needThread += master.thread;
          needBP += master.bp;
          gainPT += master.pt;
        }
      }
    });

    const haveSilk = Number(inputs.have_silk) || 0;
    const haveThread = Number(inputs.have_thread) || 0;
    const haveBP = Number(inputs.have_bp) || 0;

    const lackSilk = needSilk - haveSilk;
    const lackThread = needThread - haveThread;
    const lackBP = needBP - haveBP;

    return {
      needSilk,
      needThread,
      needBP,
      gainPT,
      lackSilk: Math.max(0, lackSilk),
      lackThread: Math.max(0, lackThread),
      lackBP: Math.max(0, lackBP),
      isSufficient: lackSilk <= 0 && lackThread <= 0 && lackBP <= 0,
    };
  },

  /**
   * 入力値検証
   */
  validateFn: (inputs, tool) => {
    const errors = [];

    EQUIPMENT_PARTS.forEach(part => {
      const currentId = Number(inputs[`${part.id}_current`]);
      const targetId = Number(inputs[`${part.id}_target`]);

      if (targetId && currentId && targetId <= currentId) {
        errors.push(`${part.label}: 目標は現在より大きくしてください`);
      }
    });

    const haveSilk = Number(inputs.have_silk);
    const haveThread = Number(inputs.have_thread);
    const haveBP = Number(inputs.have_bp);

    if (isNaN(haveSilk) || haveSilk < 0) {
      errors.push('所持絹は0以上の数値を入力してください');
    }
    if (isNaN(haveThread) || haveThread < 0) {
      errors.push('所持金の糸は0以上の数値を入力してください');
    }
    if (isNaN(haveBP) || haveBP < 0) {
      errors.push('所持設計図は0以上の数値を入力してください');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * カスタムエクスポート
   */
  exportFn: (result, format) => {
    if (format === 'text') {
      return `
=== 装備計算結果 ===
時刻: ${result.timestamp}

必要素材:
  献上品の絹: ${result.needSilk.toLocaleString('ja-JP')}
  金の糸: ${result.needThread.toLocaleString('ja-JP')}
  設計図: ${result.needBP.toLocaleString('ja-JP')}
  獲得評価pt: ${result.gainPT.toLocaleString('ja-JP')}

不足素材:
  献上品の絹: ${result.lackSilk.toLocaleString('ja-JP')}
  金の糸: ${result.lackThread.toLocaleString('ja-JP')}
  設計図: ${result.lackBP.toLocaleString('ja-JP')}

素材充足: ${result.isSufficient ? '✓ 充足' : '✗ 不足'}
      `.trim();
    }
    return null;
  },
};

// ツールを登録
calculatorEngine.registerTool('equipment', equipmentToolConfig);
