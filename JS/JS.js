/* ------------------------------ ATRIBUIÇÃO DOS UNICODES ÀS VARIÁVEIS ------------------------------------*/
pBranco = new Array(8);//peões brancos
pPreto = new Array(8);//peões pretos

for (i = 0; i < 8; i++){
	pBranco[i] = "&#9817;";//peões brancos
	pPreto[i] =	"&#9823;";// peões pretos
}

cavaloBranco = new Array("&#9816;", "&#9816;");
cavaloPreto = new Array("&#9822;", "&#9822;");

torreBranca = new Array("&#9814;", "&#9814;");
torrePreta = new Array("&#9820;", "&#9820;");

bispoBranco = new Array("&#9815;", "&#9815;");
bispoPreto = new Array("&#9821;", "&#9821;");

var reiBranco = "&#9813;";
var reiPreto = "&#9819;";
var damaBranca = "&#9812;";
var damaPreta = "&#9818;";

/* --------------------------------- POSICIONAMENTO NO TABULEIRO ----------------------------------------- */
// Pega os IDs de cada parte da tabela e adiciona o conteúdo da variável que segue, como um link para setar as funções posteriormente.
function DarPecas(){
	for(i = 0; i < 8; i++){/* ------------ Posicionamento dos Peões ----------------------------*/
		document.getElementById("1"+i).innerHTML = "<a href='#' class='pretas'>"+pPreto[i]+"</a>";
		document.getElementById("6"+i).innerHTML = "<a href='#' class='brancas'>"+pBranco[i]+"</a>";
	}
	/* ----------------------------------- Posicionamento das Torres ----------------------------*/
	document.getElementById("00").innerHTML = "<a href='#' class='pretas'>"+torrePreta[0]+"</a>";
	document.getElementById("07").innerHTML = "<a href='#' class='pretas'>"+torrePreta[1]+"</a>";
	document.getElementById("70").innerHTML = "<a href='#' class='brancas'>"+torreBranca[0]+"</a>";
	document.getElementById("77").innerHTML = "<a href='#' class='brancas'>"+torreBranca[1]+"</a>";

	/* ----------------------------------- Posicionamento dos Cavalos --------------------------*/
	document.getElementById("01").innerHTML = "<a href='#' class='pretas'>"+cavaloPreto[0]+"</a>";
	document.getElementById("06").innerHTML = "<a href='#' class='pretas'>"+cavaloPreto[1]+"</a>";
	document.getElementById("71").innerHTML = "<a href='#' class='brancas'>"+cavaloBranco[0]+"</a>";
	document.getElementById("76").innerHTML = "<a href='#' class='brancas'>"+cavaloBranco[1]+"</a>";

	/* ----------------------------------- Posicionamento dos Bispos ----------------------------*/
	document.getElementById("02").innerHTML = "<a href='#' class='pretas'>"+bispoPreto[0]+"</a>";
	document.getElementById("05").innerHTML = "<a href='#' class='pretas'>"+bispoPreto[1]+"</a>";
	document.getElementById("72").innerHTML = "<a href='#' class='brancas'>"+bispoBranco[0]+"</a>";
	document.getElementById("75").innerHTML = "<a href='#' class='brancas'>"+bispoBranco[1]+"</a>";

	/* ----------------------------- Posicionamento dos Reis e Damas ----------------------------*/
	document.getElementById("03").innerHTML = "<a href='#' class='pretas'>"+damaPreta+"</a>";
	document.getElementById("04").innerHTML = "<a href='#' class='pretas'>"+reiPreto+"</a>";
	document.getElementById("73").innerHTML = "<a href='#' class='brancas'>"+damaBranca+"</a>";
	document.getElementById("74").innerHTML = "<a href='#' class='brancas'>"+reiBranco+"</a>";
}