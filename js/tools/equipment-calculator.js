/**
 * Equipment Calculator - 完全統合版
 */

calculatorEngine.registerTool({
  id: 'equipment',
  name: '装備進化素材計算',
  icon: '⚔️',
  description: 'レアリティ＋★方式で素材を計算',

  fields: [
    {
      id: 'current',
      label: '現在',
      type: 'select',
      options: EQUIPMENT_MASTER.map(m => ({
        value: m.id,
        label: formatLabel(m)
      }))
    },
    {
      id: 'target',
      label: '目標',
      type: 'select',
      options: EQUIPMENT_MASTER.map(m => ({
        value: m.id,
        label: formatLabel(m)
      }))
    }
  ],

  calculate: (values) => {
    const current = parseInt(values.current);
    const target = parseInt(values.target);

    if (target <= current) {
      return {
        silk: 0,
        thread: 0,
        bp: 0,
        pt: 0
      };
    }

    const slice = EQUIPMENT_MASTER.slice(current, target);

    return slice.reduce((acc, row) => {
      acc.silk += row.silk;
      acc.thread += row.thread;
      acc.bp += row.bp;
      acc.pt += row.pt;
      return acc;
    }, { silk:0, thread:0, bp:0, pt:0 });
  }
});