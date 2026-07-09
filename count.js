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

    minus_btn.disabled = true;

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

    /* 入力欄にカーソルを合わせる */
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

        const present = document.getElementById("counter_" + num);
        let present_count = parseInt(present.textContent);
        console.log("present: "+ present_count);

        let count = 0;

        if(present_count > 0){
            count = present_count - 1;
        }

        if(count == 0){
            btn.disabled = true;
        }
        present.textContent = count;
    });

    return btn;
};

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
            // 1. 現在画面にある「.form_area」の数をすべて数える
            const all_rows = document.querySelectorAll('.form_area');

            // 2. もし2行以上あるなら、通常通り削除する
            if (all_rows.length > 1) {
                row.remove(); // 画面から消去
            } 
            // 3. もし最後の1行なら、消さずに入力欄を「空欄」にしてカウントを「0」に戻す
            else {
                // 行の中にある入力欄（input）を探して、文字を空っぽにする
                const input = row.querySelector('.name_form');
                if (input) input.value = "";

                // 行の中にあるカウント表示（spanや要素）を探して、0に戻す
                const count_display = row.querySelector('span'); // 例
                if (count_display) count_display.textContent = "0";

                if (minus_btn) minus_btn.disabled = true;
            }
        }
    });

    return btn;
};


const add_form = document.getElementById("add_btn");

/* 入力欄の追加ボタンが押されるたびにadd_form_element()を実行 */
add_form.addEventListener("click", () => {
    add_form_element();
});

const submit_btn = document.getElementById("submit_btn");
const members = [];

submit_btn.addEventListener("click", () => {
    const form = document.getElementById("input_area");

    members.length = 0;

    const all_forms = document.querySelectorAll(".form_area");

    all_forms.forEach(formEl => {
        // クラス名を使って、名前の入力欄と数字のspanを1対1で確実に取得
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

    /* カウント数の大きい順にソート */
    members.sort(function(a, b){
        return b.count - a.count; //sort()は、計算結果が正／0／負のいずれかになることで並び替える。正（bの方が大きい）：bを後ろへ、負（bの方が小さい）：bを前へ。今回は数が大きい順にしたいのでb-aになっている。
    })

    
    members.forEach(member => {
        console.log(member.name);
    });

    const result_area = document.querySelector(".result_area");
    result_area.innerHTML = "";

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

        // 2人目以降（index > 0）のとき、1つ前の人とカウントを比べる
        if(index > 0){
            const previousItem = members[index - 1];

            if(member.count == previousItem.count){

            }else{
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

function resetForm() {
    if(confirm('入力をすべてリセットして最初からやり直しますか？')){
        location.reload();
    }
}