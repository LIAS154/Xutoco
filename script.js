import { db } from "./firebase.js";
import {
    doc,
    setDoc,
    collection,
    getDocs,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// 本に合う和色・生成り系のくすみカラーパレット
const BOOK_COLORS = [
    "#f1ede4", // 生成り（基本色）
    "#e8dfd8", // 薄香（淡いベージュ）
    "#d8e2dc", // 白磁（あわい青緑）
    "#ece4db", // 象牙色
    "#e2d9d5", // 灰桜
    "#dfe3e6"  // 雲母（淡いグレー）
];

const searchButton = document.getElementById("searchButton");
const saveButton = document.getElementById("saveButton");
const publishButton = document.getElementById("publishButton");
const personalInfoCheck = document.getElementById("personalInfoCheck");

const keyInput = document.getElementById("keyInput");
const loadButton = document.getElementById("loadButton");
const message = document.getElementById("message");
const newBookButton = document.getElementById("newBookButton");

if (newBookButton) {
    newBookButton.addEventListener("click", () => {
        window.location.href = "write.html";
    });
}

// ====================
// トップページ
// ====================

if (searchButton) {
    searchButton.addEventListener("click", () => {
        window.location.href = "books.html";
    });
}

// ====================
// 本を書くページ
// ====================

if (saveButton) {

    const authorKeyElement = document.getElementById("authorKey");
    const statusElement = document.getElementById("status");
    const titleElement = document.getElementById("title");
    const authorElement = document.getElementById("author");
    const contentElement = document.getElementById("content");
    const descriptionElement = document.getElementById("description");

    // 著者鍵が変更・入力されたときにデータを読み込む関数
    async function loadBookData(key) {
        if (!key) return;

        try {
            const bookDoc = await getDoc(doc(db, "books", key));

            if (bookDoc.exists()) {
                const book = bookDoc.data();

                titleElement.value = book.title || "";
                authorElement.value = book.author || "";
                if (descriptionElement) descriptionElement.value = book.description || "";
                contentElement.value = book.content || "";

                if (book.published === true) {
                    statusElement.textContent = "状態：出版済み";
                    titleElement.readOnly = true;
                    authorElement.readOnly = true;
                    if (descriptionElement) descriptionElement.readOnly = true;
                    contentElement.readOnly = true;
                    authorKeyElement.readOnly = true;

                    saveButton.disabled = true;
                    publishButton.disabled = true;
                } else {
                    statusElement.textContent = "状態：原稿";
                    titleElement.readOnly = false;
                    authorElement.readOnly = false;
                    if (descriptionElement) descriptionElement.readOnly = false;
                    contentElement.readOnly = false;
                    authorKeyElement.readOnly = false;

                    saveButton.disabled = false;
                    publishButton.disabled = false;
                }
            } else {
                // 該当する鍵がない場合は新規扱い
                statusElement.textContent = "状態：新規原稿";
                titleElement.readOnly = false;
                authorElement.readOnly = false;
                if (descriptionElement) descriptionElement.readOnly = false;
                contentElement.readOnly = false;

                saveButton.disabled = false;
                publishButton.disabled = false;
            }
        } catch (error) {
            console.error("データの読み込みに失敗:", error);
        }
    }

    // 保存されている著者鍵があれば自動入力＆読み込み
    let savedAuthorKey = localStorage.getItem("xutoco_author_key");
    if (savedAuthorKey && authorKeyElement) {
        authorKeyElement.value = savedAuthorKey;
        loadBookData(savedAuthorKey);
    }

    // 著者鍵を入力・変更したときに自動でその鍵のデータを読み込む
    if (authorKeyElement) {
        authorKeyElement.addEventListener("change", (e) => {
            const inputKey = e.target.value.trim();
            loadBookData(inputKey);
        });
    }

    // 下書き保存
    saveButton.addEventListener("click", async () => {

        const authorKey = authorKeyElement.value.trim();

        if (!authorKey) {
            alert("著者鍵を入力してください。");
            return;
        }

        const title = titleElement.value;
        const author = authorElement.value;
        const content = contentElement.value;
        const description = descriptionElement ? descriptionElement.value : "";

        try {

            // 既存データを取得してすでに色があればそれを保持、なければランダム決定
            const currentDoc = await getDoc(doc(db, "books", authorKey));
            let bookColor = currentDoc.exists() ? currentDoc.data().color : null;
            
            if (!bookColor) {
                bookColor = BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];
            }

            await setDoc(
                doc(db, "books", authorKey),
                {
                    title: title,
                    author: author,
                    description: description,
                    content: content,
                    authorKey: authorKey,
                    color: bookColor, // 自動決定した色を保存
                    published: false,
                    updatedAt: new Date()
                },
                { merge: true }
            );

            // ローカルストレージに保存
            localStorage.setItem("xutoco_author_key", authorKey);

            alert("原稿（下書き）を保存しました。");

        } catch (error) {
            console.error("Firestoreへの保存失敗:", error);
            alert("原稿の保存に失敗しました。");
        }

    });

    // 出版
    publishButton.addEventListener("click", async () => {

        if (personalInfoCheck && !personalInfoCheck.checked) {
            alert("個人情報を含んでいないことを確認してください。");
            return;
        }

        const authorKey = authorKeyElement.value.trim();

        if (!authorKey) {
            alert("著者鍵を入力してください。");
            return;
        }

        const title = titleElement.value;
        const author = authorElement.value;
        const content = contentElement.value;
        const description = descriptionElement ? descriptionElement.value : "";

        try {

            // 既存データを取得してすでに色があればそれを保持、なければランダム決定
            const currentDoc = await getDoc(doc(db, "books", authorKey));
            let bookColor = currentDoc.exists() ? currentDoc.data().color : null;
            
            if (!bookColor) {
                bookColor = BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];
            }

            await setDoc(
                doc(db, "books", authorKey),
                {
                    title: title,
                    author: author,
                    description: description,
                    content: content,
                    authorKey: authorKey,
                    color: bookColor, // 自動決定した色を保存
                    published: true,
                    publishedAt: new Date()
                },
                { merge: true }
            );

            localStorage.setItem("xutoco_author_key", authorKey);
            localStorage.setItem("xutoco_published", "true");

            titleElement.readOnly = true;
            authorElement.readOnly = true;
            if (descriptionElement) descriptionElement.readOnly = true;
            contentElement.readOnly = true;
            authorKeyElement.readOnly = true;

            statusElement.textContent = "状態：出版済み";

            saveButton.disabled = true;
            publishButton.disabled = true;

            alert("本を出版しました。");

        } catch (error) {
            console.error("Firestoreへの出版失敗:", error);
            alert("本の出版に失敗しました。");
        }

    });

}

// ====================
// 著者鍵から原稿を開く
// ====================

if (loadButton) {

    loadButton.addEventListener("click", async () => {

        const inputKey = keyInput.value.trim();

        if (!inputKey) {
            message.textContent = "著者鍵を入力してください。";
            return;
        }

        try {

            const bookDoc = await getDoc(
                doc(db, "books", inputKey)
            );

            if (!bookDoc.exists()) {
                message.textContent = "原稿が見つかりません。";
                return;
            }

            const book = bookDoc.data();

            if (book.published === true) {
                message.textContent = "この本はすでに出版されています。";
                return;
            }

            localStorage.setItem("xutoco_author_key", inputKey);
            message.textContent = "原稿を確認しました。";

            setTimeout(() => {
                window.location.href = "write.html";
            }, 500);

        } catch (error) {

            console.error("原稿の取得に失敗しました:", error);
            message.textContent = "原稿の読み込みに失敗しました。";

        }

    });

}

// ====================
// 読本ページ
// ====================

const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookContent = document.getElementById("bookContent");
const bookDate = document.getElementById("bookDate");

if (bookTitle) {

    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");

    if (!bookId) {

        bookTitle.textContent = "本が指定されていません。";

    } else {

        getDoc(doc(db, "books", bookId))
            .then((bookDoc) => {

                if (!bookDoc.exists()) {
                    bookTitle.textContent = "本が見つかりません。";
                    return;
                }

                const book = bookDoc.data();

                if (book.published !== true) {
                    bookTitle.textContent = "この本はまだ出版されていません。";
                    return;
                }

                bookTitle.textContent = book.title;
                bookAuthor.textContent = "著者：" + book.author;
                bookContent.textContent = book.content;

                if (book.publishedAt) {
                    const date = book.publishedAt.toDate().toLocaleDateString("ja-JP");
                    bookDate.textContent = "出版日：" + date;
                } else {
                    bookDate.textContent = "出版日：記録なし";
                }

            })
            .catch((error) => {

                console.error("本の取得に失敗しました:", error);
                bookTitle.textContent = "本の読み込みに失敗しました。";

            });

    }

}

const readButton = document.getElementById("readButton");

if (readButton) {

    readButton.addEventListener("click", () => {

        const published = localStorage.getItem("xutoco_published");
        const authorKey = localStorage.getItem("xutoco_author_key");

        if (published === "true" && authorKey) {
            window.location.href = "book.html?id=" + authorKey;
        } else {
            alert("この本はまだ出版されていません。");
        }
    });

}

// ====================
// 本を探すページ（本棚表示・ランダム開く・ランダム順）
// ====================

const bookshelf = document.getElementById("bookshelf");
const randomButton = document.getElementById("randomButton");

if (bookshelf) {

    const renderBookshelf = async () => {
        try {

            const books = await getDocs(
                collection(db, "books")
            );

            const publishedBooks = [];

            books.forEach((bookDoc) => {
                const book = bookDoc.data();
                if (book.published === true) {
                    publishedBooks.push({
                        id: bookDoc.id,
                        ...book
                    });
                }
            });

            // 本がない場合
            if (publishedBooks.length === 0) {
                bookshelf.innerHTML = "<p style='padding: 20px;'>現在、出版されている本はありません。</p>";
                if (randomButton) {
                    randomButton.disabled = true;
                }
            } else {

                // 配列をランダムにシャッフル（Fisher-Yatesシャッフル）
                for (let i = publishedBooks.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [publishedBooks[i], publishedBooks[j]] = [publishedBooks[j], publishedBooks[i]];
                }

                bookshelf.innerHTML = "";

                publishedBooks.forEach((book) => {

                    // 背表紙のリンク要素を作成
                    const spine = document.createElement("a");
                    spine.className = "book-spine";
                    spine.href = `book.html?id=${book.id}`;

                    // 保存されている固定色を背景色に適用（未設定なら生成り色）
                    spine.style.backgroundColor = book.color || "#f1ede4";

                    // タイトルと著者名（縦書きで納まるように配置）
                    spine.innerHTML = `
                        <span class="spine-title">${book.title || "無題"}</span>
                        <span class="spine-author">${book.author || "無名"}</span>
                    `;

                    bookshelf.appendChild(spine);

                });

                // ランダムで一冊開く処理
                if (randomButton) {
                    randomButton.addEventListener("click", () => {
                        const randomIndex = Math.floor(Math.random() * publishedBooks.length);
                        const randomBook = publishedBooks[randomIndex];
                        window.location.href = `book.html?id=${randomBook.id}`;
                    });
                }

            }

        } catch (error) {

            console.error("本棚の取得に失敗しました:", error);
            bookshelf.innerHTML = "<p style='padding: 20px;'>本棚の読み込みに失敗しました。</p>";

        }
    };

    renderBookshelf();

}