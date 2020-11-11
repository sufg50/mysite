
/**
 * 選択中の行のセル値を編集フォームの入力欄に読み込む。
 * @args row 選択中の１行を含むjQueryオブジェクト
 */
function editRow(row){

	$("#name").val(row[0]);
	$("#postalcode").val(row[1]);
	$("#mailaddress").val(row[2]);
	console.log(typeof(row[3]));
	if(row[3]==" Aプラン"){
		$("#aplan").prop('checked', true);
		$("#bplan").prop('checked', false);
	}
	if(row[3]==" Bプラン"){
		$("#aplan").prop('checked', false);
		$("#bplan").prop('checked', true);
	}
	$("#memo").val(row[4]);
}

/**
 * 選択中の行のセル値に編集フォームの入力欄の値を書き込む
 * @args row 選択中の１行を含むjQueryオブジェクト
 */
function saveRow(row){

	let li = $('<tr><th> '+row[0]+'</th>+<th> '+row[1]+
	'</th>+<th> '+row[2]+'</th>+<th> '+row[3]+'</th>+<th> '+row[4]+'</th>+</tr>')
	// 要素をまるごと入れ替える。
	$(".selected").replaceWith(li);

	// ボタンを変える。
	$("#save").text("申込");
	$("#delete").css('display','none');
}

/**
 * 編集フォームの入力値から新規の行を構成し，テーブルに追加する。
 * @args tbody 新規の行を追加するテーブルのtbodyを含むjQueryオブジェクト
 */
function addRow(tbody){


	let li = $('<tr><th> '+tbody[0]+'</th>+<th> '+tbody[1]+
	'</th>+<th> '+tbody[2]+'</th>+<th> '+tbody[3]+'</th>+<th> '+tbody[4]+'</th>+</tr>')

	$("#list tbody").append(li);
	

}

/**
 * 選択中の行をテーブルから削除する（削除前に要確認）。
 * @args row 選択中の１行を含むjQueryオブジェクト
 */
function removeRow(){

	let result=window.confirm("削除しますか？");
	if(result){

		let li;

		// 要素を空と入れ替える。
		$(".selected").replaceWith(li);

		// ボタンを変える。
		$("#save").text("申込");
		$("#delete").css('display','none');

		clearEditor();
	}

}

/**
 * 編集フォームの入力欄の入力が妥当かどうかチェックする。
 * @args input チェックするinput要素を含むjQueryオブジェクト
 * @return チェック結果のメッセージ文字列（入力が妥当な場合は空文字列）
 */
function checkInput(input){

	//半角スペースを除去する
	input[1]=input[1].replace(/\s+/g,'');
	input[2]=input[2].replace(/\s+/g,'');



	if(!(input[3])){//ラジオボタンがチェックされてないとき
		alert("氏名、郵便番号、プランは必須です")
		return false;
		
	}
	if(input[0]=="" ||input[1]==""){
		alert("氏名、郵便番号、プランは必須です");
		return false;
	}
	if( !(input[1].match(/^[0-9]{3}-[0-9]{4}$/)) ){
		alert("郵便番号の値が不正です"+input[1]);
		return false;
	}
	if(input[2] != "" && !(input[2].match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/))){
		alert("メールアドレスの値が不正です。[英数字+記号]@[ドメイン]で入力してください");
		return false;
	}


	return true;

}

/**
 * エディタ内の入力欄を全てクリアする。
 */
function clearEditor(){
	$("#name").val("");
	$("#postalcode").val("");
	$("#mailaddress").val("");
	$("input[name='plan']:checked").prop('checked', false);
	$("#memo").val("");
}

/**
 * ページ読み込み時に諸々のDOM要素にコールバック関数を設定する
 */
$(function(){

	// 保存ボタン（行の新規追加または選択行の更新）
	$('#save').click(function(e) {
		let editing=$('*').hasClass('selected');//編集中かどうかのフラグ
		let name=$("#name").val();
		let postalcode=$("#postalcode").val();
		let mailaddress=$("#mailaddress").val();
		let plan=$("input[name='plan']:checked").val();
		let memo=$("#memo").val();
		let doc=[];
		doc.push(name);
		doc.push(postalcode);
		doc.push(mailaddress);
		doc.push(plan);
		doc.push(memo);
		
		if(checkInput(doc)){
			if(!(editing)){//編集中じゃないとき
				addRow(doc);
				clearEditor();
			}else{//編集中の時
				saveRow(doc);
				clearEditor();
			}
		}
	  });
	  


	// 削除ボタン（選択行の削除）
	$("#delete").on("click", function(){
		removeRow();
	});

	// 編集フォーム内の入力欄（入力中の欄の強調）
	$('input').focus(function() {
		$("*").removeClass("focused");
		$(this).addClass("focused");
	});
	$('#memo').focus(function() {
		$("*").removeClass("focused");
		$(this).addClass("focused");
	});
	$('input').blur(function() {
		$("*").removeClass("focused");
	});
	$('#memo').blur(function() {
		$("*").removeClass("focused");
	});

	// マウスホバー(欄の強調)
	$('#list tbody').hover(function() {
		$("*").removeClass("hover");
		$(this).addClass("hover");

	});

	//テーブル行の強調
	$(document).on("click", "#list tr", function(){
		if($(this).hasClass("selected")){//同じ行が再クリックされたら
			$("*").removeClass("selected");
			clearEditor();
			// ボタンを変える。
			$("#save").text("申込");
			$("#delete").css('display','none');
		}else{
			$("*").removeClass("selected");
			$(this).addClass("selected");
			// ボタンを変える。
			$("#save").text("保存");
			$("#delete").css('display','inline');
		}

	
		let doc=[];
		doc.push($(".selected th:nth-child(1)").text());
		doc.push($(".selected th:nth-child(2)").text());
		doc.push($(".selected th:nth-child(3)").text());
		doc.push($(".selected th:nth-child(4)").text());
		doc.push($(".selected th:nth-child(5)").text());
		editRow(doc);

		

		
	});

});//初期function終わり
