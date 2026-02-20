console.log("equipment loaded OK");

/**
 * Equipment Calculator - Engine仕様完全準拠版
 * registerTool(toolId, config) 形式対応
 */

// ==============================
// マスターデータ
// ==============================

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
  {id:11, key:"レジェンド-0", silk:22000, thread:220, bp:40, pt:6250},
  {id:12, key:"レジェンド-1", silk:23000, thread:230, bp:40, pt:6250},
  {id:13, key:"レジェンド-2", silk:25000, thread:250, bp:45, pt:6250},
  {id:14, key:"レジェンド-3", silk:26000, thread:260, bp:45, pt:6250},
  {id:15, key:"神話-0", silk:108000, thread:1080, bp:220, pt:12000},
  {id:16, key:"神話-1", silk:114000, thread:1140, bp:230, pt:12000},
  {id:17, key:"神話-2", silk:121000, thread:1210, bp:240, pt:12000},
  {id:18, key:"神話-3", silk:128000, thread:1280, bp:250, pt:12000},
];

// ==============================
// 表示ラベル生成
// ==============================

function formatLabel(row){
  const [rarity, star] = row.key.split("-");
  return `${rarity} ★${star}`;
}

const OPTIONS = EQUIPMENT_MASTER.map(m => ({
  value: m.id,
  label: formatLabel(m)
}));

// ==============================
// ツール登録（Engine仕様準拠）
// ==============================

calculatorEngine.registerTool(
  'equipment',
  {
    name: '装備進化素材計算',
    icon: '⚔️',
    description: 'レアリティ＋★方式で素材を計算',

    fields: [
      {
        id: 'current',
        label: '現在',
        type: 'select',
        options: OPTIONS
      },
      {
        id: 'target',
        label: '目標',
        type: 'select',
        options: OPTIONS
      }
    ],

    calculateFn: (values) => {
      const current = parseInt(values.current);
      const target = parseInt(values.target);

      if (!current || !target || target <= current) {
        return { silk:0, thread:0, bp:0, pt:0 };
      }

      const slice = EQUIPMENT_MASTER.slice(current, target);

      return slice.reduce((acc,row)=>{
        acc.silk += row.silk;
        acc.thread += row.thread;
        acc.bp += row.bp;
        acc.pt += row.pt;
        return acc;
      }, { silk:0, thread:0, bp:0, pt:0 });
    }
  }
);

// ==============================
// レアリティ色強調
// ==============================

function applyRarityStyle(selectEl) {
  const text = selectEl.options[selectEl.selectedIndex]?.text || "";
  let rarity = "";

  if (text.includes("神話")) rarity = "mythic";
  else if (text.includes("レジェンド")) rarity = "legend";
  else if (text.includes("エピック")) rarity = "epic";
  else if (text.includes("レア")) rarity = "rare";
  else if (text.includes("グッド")) rarity = "good";

  selectEl.setAttribute("data-rarity", rarity);
}

document.addEventListener("change", function(e){
  if(e.target.tagName === "SELECT"){
    applyRarityStyle(e.target);
  }
});

window.addEventListener("DOMContentLoaded", ()=>{
  document.querySelectorAll("select").forEach(el=>{
    applyRarityStyle(el);
  });
});