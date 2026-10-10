# Xutoco

ログイン不要で、ミニマルかつ静謐な読書体験を提供するWebサービス。  
雑音を排し、本と向き合う時間と、読者たちがそれぞれの感性で「本棚」を編む楽しみを届けます。

🔗 **URL**: [https://xutoco.vercel.app/](https://xutoco.vercel.app/)

---

## ✨ 特徴

- **ログイン不要**: 面倒なアカウント登録なしで、すぐに閲覧や本棚の作成が可能。
- **静謐なデザイン**: 読書に没頭できる、無駄を削ぎ落としたミニマルなUI。
- **本棚のキュレーション**: お気に入りの本を組み合わせて、自分だけのオリジナル「本棚」を作り、誰かに共有できる。

---

## 🛠 技術スタック

- **Frontend**: HTML / CSS / JavaScript (ES Modules)
- **Database / Backend**: Firebase Cloud Firestore (SDK v12.19.0)
- **Hosting / Deployment**: Vercel

---

## 📁 ファイル構成

```text
├── index.html              # トップページ
├── books.html              # 掲載されている本の一覧
├── book.html               # 本の個別詳細・閲覧
├── create-bookshelf.html   # 本棚の作成画面
├── bookshelves.html        # みんなの本棚一覧
├── bookshelf.html          # 本棚の個別閲覧画面
├── write.html              # 本の執筆・投稿画面
├── load.html               # データ管理・読み込み用ページ
├── 404.html                # 404エラーページ
├── firebase.js             # Firebase接続・初期化設定
├── script.js               # 共通スクリプト・ロジック
├── style.css               # スタイルシート
└── privacy.html            # プライバシーポリシー・利用規約