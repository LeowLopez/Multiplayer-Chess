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
		document.getElementById("1"+i).innerHTML = "<a title='Peão Preto "+(i+1)+"' id='p1"+i+"' href='#' class='pretas'>"+pPreto[i]+"</a>";
		document.getElementById("6"+i).innerHTML = "<a title='Peão Branco "+(i+1)+"' id='p6"+i+"' href='#' class='brancas'>"+pBranco[i]+"</a>";
	}
	/* ----------------------------------- Posicionamento das Torres ----------------------------*/
	document.getElementById("00").innerHTML = "<a title='Torre Preta 1' id='p00' href='#' class='pretas'>"+torrePreta[0]+"</a>";
	document.getElementById("07").innerHTML = "<a title='Torre Preta 2' id='p07' href='#' class='pretas'>"+torrePreta[1]+"</a>";
	document.getElementById("70").innerHTML = "<a title='Torre Branca 1' id='p70' href='#' class='brancas'>"+torreBranca[0]+"</a>";
	document.getElementById("77").innerHTML = "<a title='Torre Branca 2' id='p77' href='#' class='brancas'>"+torreBranca[1]+"</a>";

	/* ----------------------------------- Posicionamento dos Cavalos --------------------------*/
	document.getElementById("01").innerHTML = "<a title='Cavalo Preto 1' id='p01' href='#' class='pretas'>"+cavaloPreto[0]+"</a>";
	document.getElementById("06").innerHTML = "<a title='Cavalo Preto 2' id='p06' href='#' class='pretas'>"+cavaloPreto[1]+"</a>";
	document.getElementById("71").innerHTML = "<a title='Cavalo Branco 1' id='p71' href='#' class='brancas'>"+cavaloBranco[0]+"</a>";
	document.getElementById("76").innerHTML = "<a title='Cavalo Branco 2' id='p76' href='#' class='brancas'>"+cavaloBranco[1]+"</a>";

	/* ----------------------------------- Posicionamento dos Bispos ----------------------------*/
	document.getElementById("02").innerHTML = "<a title='Bispo Preto 1' id='p02' href='#' class='pretas'>"+bispoPreto[0]+"</a>";
	document.getElementById("05").innerHTML = "<a title='Bispo Preto 2' id='p05' href='#' class='pretas'>"+bispoPreto[1]+"</a>";
	document.getElementById("72").innerHTML = "<a title='Bispo Branco 1' id='p72' href='#' class='brancas'>"+bispoBranco[0]+"</a>";
	document.getElementById("75").innerHTML = "<a title='Bispo Branco 2' id='p75' href='#' class='brancas'>"+bispoBranco[1]+"</a>";

	/* ----------------------------- Posicionamento dos Reis e Damas ----------------------------*/
	document.getElementById("03").innerHTML = "<a title='Dama Preta' id='p03' href='#' class='pretas'>"+damaPreta+"</a>";
	document.getElementById("04").innerHTML = "<a title='Rei Preto' id='p04' href='#' class='pretas'>"+reiPreto+"</a>";
	document.getElementById("73").innerHTML = "<a title='Dama Branca' id='p73' href='#' class='brancas'>"+damaBranca+"</a>";
	document.getElementById("74").innerHTML = "<a title='Dama Preta' id='p74' href='#' class='brancas'>"+reiBranco+"</a>";


	//Seleciona tudo que tiver as classes "brancas" e "pretas" e joga dentro da array "allclasses"
	var allclasses = document.querySelectorAll('.brancas, .pretas');
	for(i = 0; i < allclasses.length; i++){
		//agora aciona a função "function()" quando o usuário clicar em um dos links contidos na array
	    allclasses[i].addEventListener("click", function() {
	    /* --- INSTRUÇÕES DA FUNÇÃO --- */	
	    	alert("Sou a peça '"+this.title+"'");// Sou a peça 'x', sendo x o "title='x'" que estiver no link
	    	this.setAttribute('class','clicked');//Seta a classe do link clicado para "clicked", definido no CSS para ficar laranja
	    });
	}

}

//document.getElementById(this.id).style.class = "clicked";