/**
 * Jewel Calculator - 完全修正版（エラー修正済）
 */

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

const JEWEL_FIELDS = JEWEL_PARTS.flatMap(part =>
  JEWEL_SLOTS.flatMap(slot => [
    {
      id: `${part.id}_${slot.id}_current`,
      label: `${part.label} ${slot.label} - 現在`,
      type: 'select',
      options: JEWEL_MASTER.map(m => ({ value: m.lv, label: `Lv${m.lv}` })),
    },
    {
      id: `${part.id}_${slot.id}_target`,
      label: `${part.label} ${slot.label} - 目標`,
      type: 'select',
      options: JEWEL_MASTER.map(m => ({ value: m.lv, label: `Lv${m.lv}` })),
    },
  ])
).concat([
  { id: 'have_guides', label: '所持ハンドブック', type: 'number', default: 0 },
  { id: 'have_designs', label: '所持図面', type: 'number', default: 0 },
]);

calculatorEngine.registerTool(
  'jewel',
  {
    name: '宝石計算',
    description: '宝石素材計算',
    icon: '💎',
    masterData: JEWEL_MASTER,
    idField: 'lv',
    fields: JEWEL_FIELDS,

    calculateFn: (inputs, tool) => {
      let needGuides = 0;
      let needDesigns = 0;

      JEWEL_PARTS.forEach(part => {
        JEWEL_SLOTS.forEach(slot => {

          let currentLv = Number(inputs[`${part.id}_${slot.id}_current`] || 0);
          let targetLv = Number(inputs[`${part.id}_${slot.id}_target`] || 0);

          if (targetLv <= currentLv) return;

          for (let lv = currentLv + 1; lv <= targetLv; lv++) {
            const master = tool.masterDataMap.get(lv);
            if (master) {
              needGuides += master.guides;
              needDesigns += master.designs;
            }
          }
        });
      });

      const haveGuides = Number(inputs.have_guides || 0);
      const haveDesigns = Number(inputs.have_designs || 0);

      return {
        needGuides,
        needDesigns,
        lackGuides: Math.max(0, needGuides - haveGuides),
        lackDesigns: Math.max(0, needDesigns - haveDesigns),
      };
    }
  }
);