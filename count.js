/* ウィンドウをリフレッシュするたびに1つ目の入力欄を表示 */
window.onload = function(){
    add_form_element();
};

let global_count = 0;

/* 入力欄の追加 */
function add_form_element(){
    var form_area = document.querySelector("#input_area");

    global_count++;
    var num = global_count; //入力欄の数

    var count_form = create_form(num);
    var minus_btn = create_minus_btn(num);
    var plus_btn = create_plus_btn(num, minus_btn);
    var count = create_counter(num);
    var delete_btn = create_delete_btn(minus_btn);

    // 初期状態（カウント0）の時は、負の値に行かないようマイナスボタンを無効化
    minus_btn.disabled = true;

    // 生成する1人分の入力フォーム（form_area）のHTMLイメージ（例）
    /* 
    <form id="input_area">
        <div id="form_area_1" class="form_area">
            <input type="text" id="name_1" class="name_form">

            <div class="counter_group">
                <button type="button">+</button>
                <span id="counter_1">0</span>
                <button type="button">-</button>
            </div>

            <button type="button" class="delete_btn"><span class="material-icons">delete</span></button>

        </div>
    </form>
    */

    var additional_form = document.createElement('div');
    additional_form.setAttribute('id', 'form_area_' + num);
    additional_form.setAttribute('class', 'form_area');
    additional_form.appendChild(count_form);

    var additional_counter = document.createElement('div');
    additional_counter.setAttribute('class', 'counter_group');
    additional_counter.appendChild(plus_btn);
    additional_counter.appendChild(count);
    additional_counter.appendChild(minus_btn);

    additional_form.appendChild(additional_counter);
    additional_form.appendChild(delete_btn);
    
    var form = document.getElementById('input_area');
    form.appendChild(additional_form);

    /* 自動的に入力欄にカーソルを合わせる */
    if (count_form) {
        count_form.focus();
    }
};

/* 名前の入力欄の追加 */
function create_form(num){
    // <input type="text" id="name_1"> というHTMLコードを作っていく
    var text_form = document.createElement('input');
    text_form.setAttribute('type', 'text');
    text_form.setAttribute('id', 'name_' + num);
    text_form.setAttribute('class', 'name_form');

    return text_form;
};

/* カウンターの追加 */
function create_counter(num){
    // <span id="counter_1">0</span> というHTMLコードを作っていく
    var counter = document.createElement('span');
    var initial_count = document.createTextNode('0');

    counter.appendChild(initial_count);
    counter.setAttribute('id', 'counter_' + num);

    return counter;
};

/* +ボタンの追加 */
function create_plus_btn(num, minus_btn){
    // <button type="button">+</button> というHTMLコードを作っていく
    var btn = document.createElement('button');
    var btn_text = document.createTextNode('+');

    btn.appendChild(btn_text);
    btn.setAttribute('type', 'button');

    btn.addEventListener("click", () => {
        console.log("plus_button for counter_" + num + " pressed.")

        const present = document.getElementById("counter_" + num); 
        const present_count = parseInt(present.textContent); /* .textContentをつけることでcountというidをもつ要素の中身を文字列として取得している */
        console.log("present: "+ present_count);
        let count = 0;

        count = present_count + 1;
        console.log(count);
        present.textContent = count;

        // カウントが1以上になったためマイナスボタンを解禁
        if (count > 0 && minus_btn) {
            minus_btn.disabled = false;
        }
    });

    return btn;
};

/* -ボタンの追加 */
function create_minus_btn(num){
    // <button type="button">-</button> というHTMLコードを作っていく
    var btn = document.createElement('button');
    var btn_text = document.createTextNode('-');

    btn.appendChild(btn_text);
    btn.setAttribute('type', 'button');

    btn.addEventListener("click", () => {
        console.log("minus_button for counter_" + num + " pressed.")

        const present = document.getElementById("counter_" + num); // 現在のカウントの値を取得（文字列）
        let present_count = parseInt(present.textContent); // 数値に変換
        console.log("present: "+ present_count);

        let count = 0;

        // 現在のカウントが0より大きければカウントを-1する
        if(present_count > 0){
            count = present_count - 1;
        }

        // カウントが0になったらマイナスボタンを再び無効化
        if(count == 0){
            btn.disabled = true;
        }
        present.textContent = count;
    });

    return btn;
};

/* 入力行の削除ボタンの追加 */
function create_delete_btn(minus_btn){
    var btn = document.createElement('button');
    
    btn.setAttribute('type', 'button');
    btn.setAttribute('class', 'delete_btn');

    var icon = document.createElement('span');
    icon.setAttribute('class', 'material-icons'); // Googleのアイコンフォントを適用するクラス
    icon.textContent = 'delete';

    btn.appendChild(icon);

    btn.addEventListener("click", () => {
        console.log("delete_button pressed.")

        const row = btn.closest('.form_area');
        if (row) {
            // 画面にある「.form_area」の数をすべて数える
            const all_rows = document.querySelectorAll('.form_area');

            // 2行以上ある場合は通常通り削除
            if (all_rows.length > 1) {
                row.remove(); // 画面から消去
            } 
            // 最後の1行なら、消さずに入力欄を「空欄」にしてカウントを「0」に戻す
            else {
                // 行の中にある入力欄（input）を探して、文字を空っぽにする
                const input = row.querySelector('.name_form');
                if (input) input.value = "";

                // 行の中にあるカウント表示（spanや要素）を探して、0に戻す
                const count_display = row.querySelector('span'); // 例
                if (count_display) count_display.textContent = "0";

                // 最後の1行をリセットしたことでカウントが0に戻ったためマイナスボタンを無効化
                if (minus_btn) minus_btn.disabled = true;
            }
        }
    });

    return btn;
};


const add_form = document.getElementById("add_btn");

// 入力欄の追加ボタンが押されるたびにadd_form_element()を実行
add_form.addEventListener("click", () => {
    add_form_element();
});

const submit_btn = document.getElementById("submit_btn");
const members = [];

/* カウント数の集計とランク付け */
submit_btn.addEventListener("click", () => {
    const form = document.getElementById("input_area");

    members.length = 0;

    // 画面上で「今実在しているすべての.form_area（行）」をquerySelectorAllにより全件取得
    const all_forms = document.querySelectorAll(".form_area"); 

    all_forms.forEach(formEl => {
        // クラス名を使って、名前の入力欄と数字のspanを確実に取得
        // querySelectorは指定された条件（クラス名やタグ名など）にマッチする要素のうち、HTMLの上から順番に探して『一番最初に見つかった1つだけ』を連れてくる
        const inputEl = formEl.querySelector(".name_form");
        const counterEl = formEl.querySelector("span");

        if (inputEl && counterEl) {
            members.push({
                name: inputEl.value,
                count: parseInt(counterEl.textContent)
            });
        }

    });
    console.log(members);

    // カウント数の大きい順にソート 
    members.sort(function(a, b){
        // sort()は、計算結果が正／0／負のいずれかになることで並び替える。
        // 正（bの方が大きい）：bを後ろへ、負（bの方が小さい）：bを前へ。今回は数が大きい順にしたいのでb-aになっている。
        return b.count - a.count; 
    })

    const result_area = document.querySelector(".result_area");
    result_area.innerHTML = ""; // 前回の集計結果テーブルをクリア

    const table = document.createElement("table");
    table.setAttribute('id', 'result_table');

    /* 表のヘッダー行の作成 */
    const header = document.createElement("tr");
    
    const rank_header = document.createElement("th");
    rank_header.textContent = "順位";

    const name_header = document.createElement("th");
    name_header.textContent = "名前";

    const count_header = document.createElement("th");
    count_header.textContent = "回数";

    header.appendChild(rank_header);
    header.appendChild(name_header);
    header.appendChild(count_header);

    table.appendChild(header);

    let rank = 1;

    /* データ行の作成 */
    members.forEach((member, index) => {
        const row = document.createElement("tr");

        const rank_cell = document.createElement("td");

        // 単に上から順番に1, 2, 3...と順位をつけるのではなく、カウント数が同じメンバーがいた場合に
        //「同率3位が2人存在し、次のメンバーは5位になる」という正しい順位算出アルゴリズムを再現
        
        // 2人目以降（index > 0）のとき、1つ前の人とカウントを比べる
        if(index > 0){
            const previousItem = members[index - 1];

            if(member.count == previousItem.count){
                // もし1つ前の人とカウントが同じなら順位（rank）の数字は据え置き
            }else{
                // 前の人とカウントが違うなら、現在のindexに1を足したものを新しい順位とする
                rank = index + 1;
            }
        }
        
        let rank_display = "";

        if (rank == 1) {
            rank_display = "🥇";
        } else if (rank == 2) {
            rank_display = "🥈";
        } else if (rank == 3) {
            rank_display = "🥉";
        } else {
            rank_display = rank;
        }

        rank_cell.textContent = rank_display;

        const name_cell = document.createElement("td");
        name_cell.textContent = member.name;

        const count_cell = document.createElement("td");
        count_cell.textContent = member.count;

        row.appendChild(rank_cell);
        row.appendChild(name_cell);
        row.appendChild(count_cell);

        table.appendChild(row);
    });

    result_area.appendChild(table);

});

/* 画面全体のリセット */
function resetForm() {
    if(confirm('入力をすべてリセットして最初からやり直しますか？')){
        location.reload();
    }
}


/* Discord連携処理 */
const discord_btn = document.getElementById("discord_btn");

discord_btn.addEventListener("click", async () => {
    const channelId = document.getElementById("discord_channel_id").value.trim();

    if (!channelId) {
        alert("DiscordのチャンネルIDを入力してください。");
        return;
    }

    discord_btn.disabled = true;
    discord_btn.textContent = "同期中...";

    try {
        // パソコン内で動いているNode.jsサーバー（ポート3000）のAPIを叩く
        const response = await fetch(`http://localhost:3000/api/count/${channelId}`);
        
        if (!response.ok) {
            throw new Error('サーバーエラーが発生しました。');
        }

        // バックエンドから計算済みの集計データ（配列）を受け取る
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        // 既存の入力欄（#input_area）の中身を一度リセットする
        const form = document.getElementById("input_area");
        form.innerHTML = "";

        // 取得したデータの人数分だけ、画面上に入力欄を自動生成して値をはめ込む
        data.forEach(member => {
            // 新しい行を追加
            add_form_element();
            
            // いま追加された最新の行の「入力欄」と「カウンター」を特定する
            const inputEl = document.getElementById("name_" + global_count);
            const counterEl = document.getElementById("counter_" + global_count);
            
            if (inputEl && counterEl) {
                inputEl.value = member.name;       // Discordのユーザー名をセット
                counterEl.textContent = member.count; // 発言回数をセット

                // カウントが0より大きいため、その行のマイナスボタンのロックを解除
                // 行の中にある最後のボタン（＝マイナスボタン）を探す
                const row = document.getElementById("form_area_" + global_count);
                const minus_btn = row.querySelector('.counter_group button:last-of-type');
                if (minus_btn) minus_btn.disabled = false;
            }
        });

        // データの流し込みが終わったら、既存の「集計ボタン」を自動でクリック！
        const submitBtn = document.getElementById("submit_btn");
        if (submitBtn) {
            submitBtn.click();
        }

        alert(`Discordから ${data.length} 人のデータを正常に同期しました！`);

    } catch (error) {
        console.error(error);
        alert("バックエンドサーバーとの通信に失敗しました。server.js が起動しているか確認してください。");
    } finally {
        // ボタンの状態を元に戻す
        discord_btn.disabled = false;
        discord_btn.innerHTML = '<span class="material-icons" style="font-size: 18px; margin: 0;">download</span>同期';
    }
});