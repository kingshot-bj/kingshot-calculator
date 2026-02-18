/**
 * Jewel Calculator - 宝石強化素材計算ツール
 */

// マスターデータ
const JEWEL_MASTER = [
  { lv: 0, guides: 0, designs: 0 },
  { lv: 1, guides: 5, designs: 5 },
  { lv: 2, guides: 40, designs: 15 },
  { lv: 3, guides: 60, designs: 40 },
  { lv: 4, guides: 80, designs: 100 },
  { lv: 5, guides: 100, designs: 200 },
  { lv: 6, guides: 120, designs: 300 },
  { lv: 7, guides: 140, designs: 400 },
  { lv: 8, guides: 200, designs: 400 },
  { lv: 9, guides: 300, designs: 400 },
  { lv: 10, guides: 420, designs: 420 },
  { lv: 11, guides: 560, designs: 420 },
  { lv: 12, guides: 580, designs: 600 },
  { lv: 13, guides: 610, designs: 780 },
  { lv: 14, guides: 645, designs: 960 },
];

// 部位定義
const JEWEL_PARTS = [
  { id: 'hat', label: '帽子' },
  { id: 'decoration', label: '装飾' },
  { id: 'robe', label: 'ローブ' },
  { id: 'pants', label: 'ズボン' },
  { id: 'ring', label: '指輪' },
  { id: 'staff', label: '杖' },
];

const JEWEL_SLOTS = [
  { id: 1, label: '①' },
  { id: 2, label: '②' },
  { id: 3, label: '③' },
];

// フィールド定義
const JEWEL_FIELDS = JEWEL_PARTS.flatMap(part =>
  JEWEL_SLOTS.map(slot => [
    {
      name: `${part.id}_${slot.id}_current`,
      label: `${part.label} ${slot.label} - 現在`,
      type: 'select',
      options: JEWEL_MASTER.map(m => ({ value: m.lv, label: `Lv${m.lv}` })),
    },
    {
      name: `${part.id}_${slot.id}_target`,
      label: `${part.label} ${slot.label} - 目標`,
      type: 'select',
      options: JEWEL_MASTER.map(m => ({ value: m.lv, label: `Lv${m.lv}` })),
    },
  ]).flat()
).concat([
  { name: 'have_guides', label: '所持ハンドブック', type: 'number', default: 0 },
  { name: 'have_designs', label: '所持図面', type: 'number', default: 0 },
]);

/**
 * 宝石計算ツール設定
 */
const jewelToolConfig = {
  name: '宝石計算',
  description: '18個の宝石スロット（6部位×3スロット）の強化に必要な素材を計算します',
  icon: '💎',
  masterData: JEWEL_MASTER,
  idField: 'lv',
  fields: JEWEL_FIELDS,

  /**
   * 計算ロジック
   */
  calculateFn: (inputs, tool) => {
    let needGuides = 0, needDesigns = 0;

    // 各宝石スロットの計算
    JEWEL_PARTS.forEach(part => {
      JEWEL_SLOTS.forEach(slot => {
        const currentLv = Number(inputs[`${part.id}_${slot.id}_current`]);
        const targetLv = Number(inputs[`${part.id}_${slot.id}_target`]);

        if (!currentLv && currentLv !== 0) currentLv = 0;
        if (!targetLv && targetLv !== 0) targetLv = 0;

        if (targetLv <= currentLv) return;

        // currentLvからtargetLvまでの素材を合算
        for (let lv = currentLv + 1; lv <= targetLv; lv++) {
          const master = tool.masterDataMap.get(lv);
          if (master) {
            needGuides += master.guides;
            needDesigns += master.designs;
          }
        }
      });
    });

    const haveGuides = Number(inputs.have_guides) || 0;
    const haveDesigns = Number(inputs.have_designs) || 0;

    const lackGuides = needGuides - haveGuides;
    const lackDesigns = needDesigns - haveDesigns;

    return {
      needGuides,
      needDesigns,
      lackGuides: Math.max(0, lackGuides),
      lackDesigns: Math.max(0, lackDesigns),
      isSufficient: lackGuides <= 0 && lackDesigns <= 0,
    };
  },

  /**
   * 入力値検証
   */
  validateFn: (inputs, tool) => {
    const errors = [];

    JEWEL_PARTS.forEach(part => {
      JEWEL_SLOTS.forEach(slot => {
        const currentLv = Number(inputs[`${part.id}_${slot.id}_current`]);
        const targetLv = Number(inputs[`${part.id}_${slot.id}_target`]);

        if (targetLv && currentLv && targetLv <= currentLv) {
          errors.push(`${part.label}${slot.label}: 目標は現在より大きくしてください`);
        }

        if ((currentLv && (currentLv < 0 || currentLv > 14)) || (targetLv && (targetLv < 0 || targetLv > 14))) {
          errors.push(`${part.label}${slot.label}: レベルは0～14の範囲で指定してください`);
        }
      });
    });

    const haveGuides = Number(inputs.have_guides);
    const haveDesigns = Number(inputs.have_designs);

    if (isNaN(haveGuides) || haveGuides < 0) {
      errors.push('所持ハンドブックは0以上の数値を入力してください');
    }
    if (isNaN(haveDesigns) || haveDesigns < 0) {
      errors.push('所持図面は0以上の数値を入力してください');
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
=== 宝石計算結果 ===
時刻: ${result.timestamp}

必要素材:
  ハンドブック: ${result.needGuides.toLocaleString('ja-JP')}
  図面: ${result.needDesigns.toLocaleString('ja-JP')}

不足素材:
  ハンドブック: ${result.lackGuides.toLocaleString('ja-JP')}
  図面: ${result.lackDesigns.toLocaleString('ja-JP')}

素材充足: ${result.isSufficient ? '✓ 充足' : '✗ 不足'}
      `.trim();
    }
    return null;
  },
};

// ツールを登録
calculatorEngine.registerTool('jewel', jewelToolConfig);
