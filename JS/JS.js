/* ---- QUANDO CARREGAR A PÁGINA ---- */
window.addEventListener("load", function() {
	createParts();
	giveParts();
	addEventClickLinks();
});


/* ---- CRIAÇÂO DAS VARIÁVEIS E ATRIBUIÇÃO DOS UNICODES DE CADA PEÇA (função chamada quando carregar a página) ---- */
function createParts(){
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

	reiBranco = "&#9813;";
	reiPreto = "&#9819;";
	damaBranca = "&#9812;";
	damaPreta = "&#9818;";
}

/* ---- POSICIONAMENTO INICIAL DAS PEÇAS NO TABULEIRO (função chamada quando carregar a página) ---- */
function giveParts(){

	//Cria links dentro de todas as células que iniciarão vazias
	for(i = 2; i < 6; i++){//linhas (2 à 5)
		for(j = 0; j < 8; j++){//colunas (0 à 7)
			document.getElementById(i+""+j).innerHTML = "<a id='p"+i+j+"' href='#' class='vazias'></a>";
		}
	}

	//Cria links contendo como conteúdo as variáveis que guardam os UNICODES referentes às peças, células que iniciam com peças.
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
	document.getElementById("04").innerHTML = "<a title='Rei Preto' id='p04' href='#' class='pretas'>"+reiPreto;+"</a>";
	document.getElementById("73").innerHTML = "<a title='Dama Branca' id='p73' href='#' class='brancas'>"+damaBranca+"</a>";
	document.getElementById("74").innerHTML = "<a title='Rei Branco' id='p74' href='#' class='brancas'>"+reiBranco+"</a>";
}

/* ---- ADICIONA O EVENTO 'onCLick' NOS LINKS (função chamada quando carregar a página) ---- */
function addEventClickLinks(){
	//Seleciona tudo que tiver as classes "vazias", brancas" e "pretas" e joga dentro da array "allClasses". No caso, os links.
	var allClasses = document.querySelectorAll('.brancas, .pretas, .vazias');
	//cacheArray é uma variável pra salvar o tamanho da Array, deixando o laço mais eficiente.
	for(i = 0, cacheArray = allClasses.length; i < cacheArray; i++){
		//Agora aciona a função "whenClickLink()" quando o usuário clicar em um dos links contidos na array.
	    allClasses[i].addEventListener("click", whenClickLink);
	}
}

/* ---- ADICIONA O EVENTO 'onCLick' NAS CÉLULAS (função chamada ao clicar em um link[peça]) ---- */
function addEventClickCells(){
	//Seleciona todas as células
	allCells = document.querySelectorAll('td');
	for(i = 0, cacheArray = allCells.length; i < cacheArray; i++){
		//Agora aciona a função "whenClickCell()" quando o usuário clicar em uma das células.
	    allCells[i].addEventListener("click", whenClickCell);
	}
}

/* ---- QUANDO CLICAR EM UM LINK ---- */
function whenClickLink(){
	var id = this.id;//id link clicado
	console.log(id);
	linkClicked = document.getElementById(id);//Link clicado
	if(linkClicked.className == "clicked"){//se já for um link clicado (laranja/selecionado)
		linkClicked.className = classLinkClicked;
	}
	else{
	classLinkClicked = linkClicked.className;
	linkClicked.setAttribute('class','clicked');//Seta a classe do link clicado para "clicked", definido no CSS para ficar laranja
	partLinkClicked = document.getElementById(id).innerHTML;//Clicamos em um link, agora pegamos seu UNICODE[peça];
	//setTimeout(addEventClickCells, 1000);//Aguarda um segundo para adicionar o 'onCLick' nas células, depois de clicar no link...
	//... Senão será entendido que o clique do mouse será o mesmo da célula
	}
}

/* ---- QUANDO CLICAR EM UMA CÉLULA ---- */
function whenClickCell(){
	var id = this.id;//id célula clicada
	console.log(id);
	var cellClicked = document.getElementById(id);//Célula clicada
	cellClicked.innerHTML = partLinkClicked;//Coloca o UNICODE[peça] do link clicado
	linkClicked.innerHTML = "";//Limpa a peça do link;

	for(i = 0, cacheArray = allCells.length; i < cacheArray; i++){
		//Agora desativa o evento 'onClick' das células
	    allCells[i].removeEventListener("click", whenClickCell);
	}
}

//function whenMove(){
	/* Por convenção, nomeei todos os links (peças) com a constante "p" (de peça) seguido de 2 números
	que são referentes às suas intersecções de Linhas e Colunas. Então agora pego o id [p(eça)L(inha)C(oluna)],
	retiro o "p", defino L = i, e C = j.*/
	//j = id.slice(-1);//pega último valor da string pL"C = j"
	//i = id.slice(-2, -1)//pega o penúltimo e acaba no último p"L = i"C, senão ficaria p"LC = i";
//}



/* OBSERVAÇÕES, FUNÇÕES OPCIONAIS E ELEMENTOS PARA USAR DEPOIS */

//---------------------------------------------------------------------------------------------------------------------------------------------

// ------ Caso for preciso criar Classe para células
/*function classeCels(){//classe celulas
	for(i = 2; i < 6; i++){//lins
		for(j = 0; j < 8; j++){//cols
			document.getElementById(i+""+j).setAttribute('class', "c"+i+""+j);//cLC
		}
	}
}*/

//---------------------------------------------------------------------------------------------------------------------------------------------

/*
document.getElementById('p'+(+i+1)+""+(+j+1)).innerHTML = partLinkClicked;//modo de somar L+1 e C+1, transformando primeiramente as strings p/ nº.
	//O sinal + sucedido de uma variável do tipo string, a  converte p/ nº. Ex.: Se i = "2"; +i = 2;
	//Logo, +i+1 = 3. Se não convertesse, ficaria i+1 = "21".
*/

//---------------------------------------------------------------------------------------------------------------------------------------------

/* ----------Documentation Link: http://peerjs.com/docs/ ---------- */
/*function MultiplayerInit(){
	var peer = new Peer({key: 'thxe4ild2fd8ia4i'});
}*/