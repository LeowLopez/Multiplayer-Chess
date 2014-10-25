/* ---- QUANDO CARREGAR A PÁGINA ---- */
window.addEventListener("load", function() {
	createParts();
	giveParts();
	EventClickLinks('addFirst');//add primeira vez
});

/* ---- CRIAÇÂO DAS VARIÁVEIS E ATRIBUIÇÃO DOS UNICODES DE CADA PEÇA (função chamada quando carregar a página) ---- */
function createParts(){
	pBranco = new Array(8);//peões brancos
	pPreto = new Array(8);//peões pretos
	titlePB = new Array(8);//atributo title dos peões brancos
	titlePP = new Array(8);//atributo title dos peões pretos

	for (i = 0; i < 8; i++){
		pBranco[i] = "&#9817;";//peões brancos
		pPreto[i] =	"&#9823;";// peões pretos
		titlePB[i] = "Peão Branco "+(i+1);//titles brancos
		titlePP[i] = "Peão Preto "+(i+1);// titles pretos
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

/* ---- EVENTO 'onCLick' DOS LINKS ---- */
function EventClickLinks(action){
	if(action == 'addFirst'){//executa como 'addFirst' quando carregar a página
		//Se 'addFirst', seleciona tudo que tiver as classes "vazias", brancas" e "pretas" e 
		//joga dentro da array "allClasses". No caso, os links.
		allClasses = document.querySelectorAll('.brancas, .pretas, .vazias');
		Movements = 0;//Calcular movimentos.
		
		//cacheArray é uma variável pra salvar o tamanho da Array, deixando o laço mais eficiente.
		for(i = 0, cacheArray = allClasses.length; i < cacheArray; i++){
			//Agora aciona a função "whenClickLink()" quando o usuário clicar em um dos links contidos na array.
		    allClasses[i].addEventListener("click", whenClickLink);
		}
	}else if( action == 'addOthers'){//executa como 'others' após clicar nas células
		for(i = 0, cacheArray = allClasses.length; i < cacheArray; i++){
		    allClasses[i].addEventListener("click", whenClickLink);
		}
	}
	else{//remove após o clique em links
		for(i = 0, cacheArray = allClasses.length; i < cacheArray; i++){
			//Desativa o evento 'onClick' dos Links.
	    	allClasses[i].removeEventListener("click", whenClickLink);
		}
	}
}

/* ---- EVENTO 'onCLick' DAS CÉLULAS ---- */
function EventClickCells(action){
	if(action == 'remove'){//Se for 'remove', removerá o evento 'onClick'.
		for(i = 0, cacheArray = allCells.length; i < cacheArray; i++){
			//Desativa o evento 'onClick' das células.
			allCells[i].removeEventListener("click", whenClickCell);
		}
	}else{
		//função chamada ao CLICAR em um link[peça].
		//Seleciona todas as células.
		allCells = document.querySelectorAll('td');
		for(i = 0, cacheArray = allCells.length; i < cacheArray; i++){
			//Agora aciona a função "whenClickCell()" quando o usuário clicar em uma das células.
		    allCells[i].addEventListener("click", whenClickCell);
		}
	}
}


/* ---- QUANDO CLICAR EM UM LINK ---- */
function whenClickLink(){
	var id = this.id;//id link clicado.
	console.log(id);
	linkClicked = document.getElementById(id);//Link clicado.
	classLinkClicked = linkClicked.className;//Salva a classe do link clicado.

	//Movements é definida como zero, e as peças brancas iniciam jogando. Logo todas as jogadas das peças brancas devem acontecer
	//quando o valor de Movements for um número par, e das das peças pretas, por sua vez, devem ser ímpares.
	// % é como uma divisão, mas que ao invés de pegar o quociente pega o resto.
	if(((classLinkClicked == 'pretas') && (Movements%2 == 0)) || ((classLinkClicked == 'brancas') && (Movements%2 != 0))){
	//Então a condição diz: Se for pretas E o resto da divisão por 2 for igual a zero, isto é, for par...
	//Ou se for brancas E o resto da divisão por 2 for diferente de zero, se for ímpar.
		alert("Não é sua vez de jogar!");
	}
	else{
		titleLinkClicked = linkClicked.title;//Salva o nome da peça.
		linkClicked.setAttribute('class','clicked');//Seta a classe do link clicado para "clicked", definido no CSS para ficar laranja.
		partLinkClicked = linkClicked.innerHTML;//Clicamos em um link, agora pegamos seu UNICODE[peça];
		EventClickLinks();//remove evento 'onCLick' dos links para não mover sem ser selecionada.
		setTimeout(EventClickCells, 1000);//Aguarda um segundo para adicionar o 'onCLick' nas células, depois de clicar no link...
		//... Senão será entendido que o clique do link será o mesmo da célula.
	}
}

/* ---- QUANDO CLICAR EM UMA CÉLULA ---- */
function whenClickCell(){
	var id = this.id;//id célula clicada.
	newLink = document.getElementById('p'+id);//link para onde a peça será movida.
	newClassLink = newLink.className;//classe do novo link clicado.
	console.log(id);

	if(linkClicked.id.slice(-2) == id){//Pega id do link clicado, retira a constante 'p' e compara com o id da célula clicada;
		linkClicked.className = classLinkClicked;//se for o mesmo, seta a classe original do link (arrependimento de escolha).

		EventClickCells('remove');//remove evento de 'onClick' das células, evitando "duplicar" peças.
		EventClickLinks('addOthers');//reativa o 'onClick' dos links.
	}
	else if(classLinkClicked == newClassLink){
		alert("Você já selecionou uma peça!");//Aqui não precisa remover o evento onClick das células e add nos links,
	}//											pois a jogada continua com a peça que já está selecionada.
	else{
		//Aqui realiza o movimento da primeira peça clicada para o novo local.	
		verifyPartMovement(linkClicked, newLink);//função responsável pela verificação das peças e determinar seu movimento.
	}
}

/* ---- VERIFICA A PEÇA E MOVIMENTO ---- */
function verifyPartMovement(oldPos, newPos){

	/* Por convenção, nomeei todos os links (peças) com a constante "p" (de peça) seguido de 2 números
	que são referentes às suas intersecções de Linhas e Colunas. Então agora pego o id [p(eça)L(inha)C(oluna)],
	retiro o "p", defino L = i, e C = j.*/
	j = oldPos.id.slice(-1);//pega último valor da string pL"C = j"
	i = oldPos.id.slice(-2, -1)//pega o penúltimo e acaba no último p"L = i"C, senão ficaria p"LC = i";

	k = newPos.id.slice(-1);
	l = newPos.id.slice(-2, -1);
	newPosCell = l+""+k;//Posição para onde será movida a peça.

	var titlepart = oldPos.title;//título da peça que será movida.
	part = "";//guardar um nome em comum para grupos de peças que possuem o mesmo movimento.

	if(titlePP.indexOf(titlepart) !== -1){//Testa se é um dos títulos na array "titlePP".
		part = 'peao preto';
		partMovPermited = new Array((+i+1)+""+j, (+i+2)+""+j);//expressão que descreve o movimento permitido.
		//O segundo valor na array é referente às duas primeiras jogadas, em que o jogador pode mover o peão duas casas.
	}
	else if(titlePB.indexOf(titlepart) !== -1){//Agora se é um dos títulos da array "titlePB".
		part = 'peao branco';
	}
	else if((titlepart == 'Torre Branca 1') || (titlepart == 'Torre Branca 2')
	 	|| (titlepart == 'Torre Preta 1') || (titlepart == 'Torre Preta 2')){//Testa se é Torre.
		part = 'torre';
	}
	else if((titlepart == 'Bispo Branco 1') || (titlepart == 'Bispo Branco 2')
	 	|| (titlepart == 'Bispo Preto 1') || (titlepart == 'Bispo Preto 2')){//Testa se é Bispo.
		part = 'bispo';
	}
	else if((titlepart == 'Cavalo Branco 1') || (titlepart == 'Cavalo Branco 2')
	 	|| (titlepart == 'Cavalo Preto 1') || (titlepart == 'Cavalo Preto 2')){//Testa se é Cavalo.
		part = 'bispo';
	}
	else{
		part = 'coroa';
	}


	switch(part){

		//////////////////////////////////////// Se for um peão preto;
		case 'peao preto':
			if((Movements == 1) || (Movements == 3)){//se for as duas primeiras jogadas do peao preto
				if(partMovPermited.indexOf(newPosCell) !== -1){//verifica se a nova posição é permitida (se está na array)
					Move();
				} else alert("Não pode mover aqui, verifique o tutorial!");
			}
			else if(newPosCell == partMovPermited[0]){//Se a nova posição for igual a posição permitida para a peça.
				//usa-se o index 0 pois já não são as primeiras jogadas, então só pode a primeira expressão.
				Move();
			}
			else alert("Não pode mover aqui, verifique o tutorial!");

			console.log("Peão Preto!");
			break;

		//////////////////////////////////////// Se for um peão branco;
		case 'peao branco':
			Move();
			console.log("Peão Branco!");
			break;

		//////////////////////////////////////// Se for uma torre;
		case 'torre':
			Move();
			console.log("Torre!");
			break;

		//////////////////////////////////////// Se for um bispo;	
		case 'bispo':
			Move();
			console.log("Bispo!");
			break;

		//////////////////////////////////////// Se for um cavalo;
		case 'cavalo':
			Move();
			console.log("Cavalo!");
			break;

		//////////////////////////////////////// Se for coroa (reis ou damas);
		case 'coroa':
			Move();
			console.log("Coroa!");
			break;

		//////////////////////////////////////// Se for um... Alien!? Rs.. Se não for nenhum dos anteriores. Você fez merda!!!
		default:
			console.log("Erro!")
	}
}

/* ---- MOVE ---- */
function Move(){
	/*	Remoção de atributos do link que ficará vazio, sem peça.	*/
	linkClicked.className = "vazias";//define a classe do link para vazias.
	linkClicked.title = "";//Limpa o nome.
	linkClicked.innerHTML = "";//Limpa a peça do link anterior.

	/*	Adição dos atributos ao novo link, o local que a peça ficará.	*/
	newLink.className = classLinkClicked;//define sua classe
	newLink.title = titleLinkClicked;//seu nome.
	newLink.innerHTML = partLinkClicked;//Coloca o UNICODE[peça] do link clicado.

	EventClickCells('remove');//remove evento de 'onClick' das células, evitando "duplicar" peças.
	EventClickLinks('addOthers');//reativa o 'onClick' dos links.


	Movements++;
	console.log(Movements);
}

/* OBSERVAÇÕES, FUNÇÕES OPCIONAIS, BUGS E ELEMENTOS PARA USAR DEPOIS */

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

//-----------------------------------------------------------------------------------------------------------------------------------------------

/* LISTA DE BUGS
[23/10/14_23:53] BUG DO TAB, dá pra selecionar percorrendo células com Tab, logo, futuramente deverá ser implementada uma condição
que só executará a seleção do clique no link se a classe dele for diferente de "vazias".
*/