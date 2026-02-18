# Lord Gear Calculator Pro ⚔️

複数のゲーム内計算ツールに対応した、プロフェッショナルな素材計算プラットフォーム。

## 🌟 特徴

### 1. **プラグインアーキテクチャ**
- 新しい計算ツールを簡単に追加可能
- 共通エンジンで統一された計算処理
- スケーラブルな設計

### 2. **高度な機能**
- ✅ 計算結果の自動保存
- ✅ お気に入り機能
- ✅ 計算履歴の管理
- ✅ データのエクスポート/インポート
- ✅ 複数形式でのエクスポート（JSON、CSV、テキスト）

### 3. **ユーザーフレンドリー**
- 🎨 ダークモード対応
- 📱 完全レスポンシブデザイン
- ⌨️ キーボードショートカット対応
- 🌍 多言語対応（拡張可能）

### 4. **パフォーマンス最適化**
- 計算結果のキャッシング
- マスターデータのMap化による高速検索
- 効率的なDOM操作

## 📦 プロジェクト構成

```
lord-gear-pro/
├── index.html                 # メインHTML
├── styles/
│   ├── main.css              # メインスタイル
│   └── dark-mode.css         # ダークモードスタイル
├── js/
│   ├── core/
│   │   ├── calculator-engine.js    # 共通計算エンジン
│   │   ├── storage-manager.js      # ストレージ管理
│   │   └── ui-manager.js           # UI管理
│   ├── tools/
│   │   ├── equipment-calculator.js # 装備計算ツール
│   │   └── jewel-calculator.js     # 宝石計算ツール
│   └── app.js                # メインアプリケーション
└── data/
    ├── equipment.json        # 装備マスターデータ（将来）
    └── jewels.json          # 宝石マスターデータ（将来）
```

## 🚀 使い方

### 基本的な使用方法

1. **ツールを選択**: 上部のタブから使用したいツールを選択
2. **入力値を入力**: 現在のレベルと目標レベルを選択
3. **計算ボタンをクリック**: 必要な素材が計算されます
4. **結果を保存**: 「お気に入り」ボタンで結果を保存

### キーボードショートカット

| キー | 機能 |
|------|------|
| `Ctrl+S` | 計算結果をお気に入りに追加 |
| `Ctrl+E` | 計算結果をエクスポート |

## 🔧 開発者向け情報

### 新しい計算ツールの追加

新しい計算ツールを追加するには、以下の手順に従います：

#### 1. ツール設定ファイルを作成

`js/tools/my-calculator.js`:

```javascript
const MY_TOOL_CONFIG = {
  name: 'マイツール',
  description: 'ツールの説明',
  icon: '📊',
  masterData: [
    { id: 1, name: 'Item 1', cost: 100 },
    { id: 2, name: 'Item 2', cost: 200 },
  ],
  idField: 'id',
  fields: [
    {
      name: 'current',
      label: '現在レベル',
      type: 'select',
      options: [
        { value: 1, label: 'Item 1' },
        { value: 2, label: 'Item 2' },
      ],
    },
  ],

  calculateFn: (inputs, tool) => {
    // 計算ロジック
    return { /* 結果 */ };
  },

  validateFn: (inputs, tool) => {
    return { valid: true, errors: [] };
  },
};

calculatorEngine.registerTool('my-tool', MY_TOOL_CONFIG);
```

#### 2. HTMLに読み込みを追加

```html
<script src="js/tools/my-calculator.js"></script>
```

## 📊 技術スタック

- **フロントエンド**: Vanilla JavaScript（フレームワークなし）
- **スタイル**: CSS3（Flexbox、Grid）
- **ストレージ**: LocalStorage
- **ブラウザ互換性**: モダンブラウザ（ES6対応）

## 🔒 セキュリティ

- ✅ 入力値の検証
- ✅ XSS対策
- ✅ マスターデータの整合性チェック

## 📈 パフォーマンス

- **計算結果のキャッシング**
- **マスターデータのMap化**: O(1)検索
- **効率的なDOM操作**
- **バンドルサイズ**: フレームワークなしで軽量

---

**Made with ❤️ by Manus**
