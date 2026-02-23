# Google AdSense セットアップガイド

このドキュメントでは、Lord Gear Calculator ProにGoogle AdSenseを実装する手順を説明します。

## 前提条件

- Google AdSenseアカウントを取得済み
- サイトがGoogle AdSenseの承認を受けている

## セットアップ手順

### 1. Google AdSenseコードの取得

1. [Google AdSense](https://adsense.google.com)にログイン
2. 「広告」→「広告ユニット」から新しい広告ユニットを作成
3. 以下の広告ユニットを作成してください：
   - **リーダーボード広告（728x90）**：上部・下部用
   - **スクエア広告（300x250）**：中部用
   - **ハーフページ広告（300x600）**：サイド用

### 2. HTMLの更新

`index.html`の以下の部分を更新してください：

```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
   crossorigin="anonymous"></script>
```

`ca-pub-xxxxxxxxxxxxxxxx`をあなたのGoogle AdSenseクライアントIDに置き換えてください。

### 3. 広告コードの配置

各広告スペースに以下のコードを配置してください：

#### 上部広告（728x90）
```html
<div id="ad-top">
  <ins class="adsbygoogle"
       style="display:inline-block;width:728px;height:90px"
       data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
       data-ad-slot="1234567890"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

#### 中部広告（300x250）
```html
<div id="ad-middle">
  <ins class="adsbygoogle"
       style="display:inline-block;width:300px;height:250px"
       data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
       data-ad-slot="0987654321"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

#### サイド広告（300x600）
```html
<div id="ad-side">
  <ins class="adsbygoogle"
       style="display:inline-block;width:300px;height:600px"
       data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
       data-ad-slot="1122334455"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

#### 下部広告（728x90）
```html
<div id="ad-bottom">
  <ins class="adsbygoogle"
       style="display:inline-block;width:728px;height:90px"
       data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
       data-ad-slot="1234567890"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

### 4. 広告スロットIDの取得

Google AdSenseダッシュボードで、各広告ユニットの「スロットID」を確認してください。
上記のコードの`data-ad-slot`部分にそれぞれのスロットIDを入力してください。

## 広告配置戦略

### レスポンシブ広告の使用

モバイルデバイスに対応させるため、以下のレスポンシブ広告コードの使用を推奨します：

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

## トラブルシューティング

### 広告が表示されない場合

1. Google AdSenseアカウントが承認されているか確認
2. クライアントIDとスロットIDが正しいか確認
3. ブラウザのコンソールでエラーを確認
4. Google AdSenseのポリシーに違反していないか確認

### 広告の収益が低い場合

1. 広告の配置を最適化（上部、中部、下部など複数配置）
2. トラフィック量を増やす
3. ユーザーエクスペリエンスを改善

## 注意事項

- Google AdSenseのポリシーに従ってください
- 不正なクリックや表示は禁止されています
- 広告の過度な配置は避けてください
- モバイルユーザーのエクスペリエンスを優先してください

## 参考リンク

- [Google AdSense ヘルプセンター](https://support.google.com/adsense)
- [Google AdSense ポリシー](https://support.google.com/adsense/answer/48182)
- [レスポンシブ広告について](https://support.google.com/adsense/answer/3213689)
