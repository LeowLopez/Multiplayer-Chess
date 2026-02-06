/*
~~~ Convidado: 	Peças brancas /white pieces
~~~ Convidante: Peças pretas /black pieces
*/

/* ---- QUANDO CARREGAR A PÁGINA ---- */
window.addEventListener("load", function() {
	createPieces();
	MultiplayerInit();
	document.getElementById('play').addEventListener("click", jogarCom);
	var copyButton = document.getElementById('copy-id');
	if(copyButton){
		copyButton.addEventListener("click", copyMyId);
	}
});

function MultiplayerInit(){
	// Variável para definir quem é o jogador. O convidante ou convidado. Caso for = -1, não está jogando
	convidado = -1, convidante = 1/*para distribuir somente quando for true*/;
	XequeClick = 0/*quando dá o xeque*/, Xequed = 0/*se o rei oposto está em xeque*/, Movements = 0;//Calcular movimentos.
	MyKing = 0, newClassLink = "", promoting = 0;
	appid = 'gfr5dkuqgyyl23xr';
	// Fazer a conex?o 
	var iceServers = (window.ICE_SERVERS && window.ICE_SERVERS.length) ? window.ICE_SERVERS : [
		{ urls: 'stun:stun.l.google.com:19302' }
	];
	var peerOptions = {
		//key:  appid,
		debug: 0,
		config: {'iceServers': iceServers, 'sdpSemantics': 'unified-plan' } 
	};
	// Para rodar 100% independente, configure um PeerServer local via window.PEER_CONFIG antes de carregar este arquivo.
	if(window.PEER_CONFIG && typeof window.PEER_CONFIG === "object"){
		for(var opt in window.PEER_CONFIG){
			peerOptions[opt] = window.PEER_CONFIG[opt];
		}
	}
	peer = new Peer(peerOptions);
	// Ao conectar, registrar o ID do jogador conectado
	peer.on('open', function(id) {
  	document.getElementById('seuid').innerHTML = id;
	updateConnectionStatus("online");
});
peer.on('error', function(err){
	console.log(err);
	updateConnectionStatus("erro");
});
peer.on('disconnected', function(){
	updateConnectionStatus("desconectado");
});

	// caso Receber alguma conexão, chamar função recebeuConvite
	peer.on('connection', function(conn) {
		recebeuConvite(conn); 
	});

	//setInterval( function () { outroMoveu(); }, 3000 );//GameLife
}	

function updateConnectionStatus(status){
	var statusEl = document.getElementById('conn-status');
	if(!statusEl) return false;
	statusEl.innerHTML = status;
	return true;
}

function copyMyId(){
	var idEl = document.getElementById('seuid');
	if(!idEl) return false;
	var value = idEl.textContent || idEl.innerText;
	if(!value) return false;
	if(navigator.clipboard && navigator.clipboard.writeText){
		navigator.clipboard.writeText(value);
	} else{
		var tempInput = document.createElement('input');
		tempInput.value = value;
		document.body.appendChild(tempInput);
		tempInput.select();
		document.execCommand('copy');
		document.body.removeChild(tempInput);
	}
	return true;
}

// Ao clicar no link, abrir caixa para convite de jogador
function jogarCom() {

	// caso ele estiver jogando
	if(convidado != -1) return alert("Você já está jogando!");

	// abrir caixa
	var jogarid = prompt("Digite o ID da pessoa com quem deseja jogar:");
	if(!jogarid) return false;
	
	// idc guarda o id com quem está jogando
	idc = jogarid;
	var opponentEl = document.getElementById('opponent-id');
	if(opponentEl) opponentEl.innerHTML = jogarid;

	// enviar o convite para o id digitado
	conn = peer.connect(jogarid);

	conn.on('open', function(){
		conn.send("convite");
	});

	// aguardar dois segundos e liberar o jogo pra quem está convidando
	//setTimeout(function() { convidado = false; }, 2000);
	
}

// funcao que recebe os dados
function recebeuConvite(c) {	
	c.on('data', function(data) {
	
		// ao receber um dado, verificar se é convite
		if(data == "convite") {

			// caso ele já for convidado, não fazer nada			
			if(convidado != -1) return false;

			//	if(confirm("Você recebeu um convite")){//se apertar em confirmar
				
				// registrar quem convidou
				idc = (c.peer);
				var opponentEl = document.getElementById('opponent-id');
				if(opponentEl) opponentEl.innerHTML = idc;

				// avisar convite
				//alert("Você recebeu um convite!");
				// avisar convite
				//alert("Você recebeu um convite!");

				document.getElementById('convidar').style.visibility = 'hidden';
				convidado = true;//convidado
				givePieces('convidado');
				EventClickLinks('addFirst');
				document.getElementById('pessoa').innerHTML = "Convidado";
				document.getElementById('stats').style.visibility = 'visible';
				document.getElementById('xeque').style.visibility = 'visible';
				document.getElementById('xeque').addEventListener("click", Xeque);
				//gameLife = setInterval(KingHealth, 2000);
			//}
			//else return false;//se clicar em cancelar

		}
		else if(data == "confirmation"){//confirmação do convidado, libera pra quem convidou
			convidado = false;//convidante
			document.getElementById('convidar').style.visibility = 'hidden';
			givePieces('convidante');
			EventClickLinks('addFirst');
			document.getElementById('pessoa').innerHTML = "Convidante";
			document.getElementById('stats').style.visibility = 'visible';
			document.getElementById('xeque').style.visibility = 'visible';
			document.getElementById('xeque').addEventListener("click", Xeque);
			//gameLife = setInterval(KingHealth, 2000);
		}
		/*else if(isNumber(data) == true){
			//se for número, é para atualizar movimento
			Movements = data;
			console.log(data);
		}*/
		else{
			//vieram os ids da jogada do outro player no formato pLCpLC
			Oldid = data.slice(-6, -3);//pega o "pLC"pLC
			//console.log(Oldid);
			Newid = data.slice(-3);//pega o pLC"pLC"

			if(Oldid == "xxx"){//Se for ação de xeque do outro
				MyKing = document.getElementById(Newid);
				if(convidado == true){
					ClassBeforeXeque = "brancas";
				} else ClassBeforeXeque = "pretas";
				MyKing.setAttribute('class', "xequed");
				console.log("Rei sofreu Xeque "+Oldid+""+Newid);
			}
			else if(Oldid == "pro"){//se for ação de promoção do outro
				promoting = 1;//verificar no MoveOther()
				promotelinkClicked = document.getElementById(Newid);//peça à que será promovido o peão
			}
			else{
				//console.log(Oldid+""+Newid);
				MoveOther(Oldid, Newid);//Mover neste tabuleiro, a jogada do outro (lá contabiliza o Movements)
			}
		}		
	});
}

/*function isNumber(n){//Verifica se é número e se é finito
	return !isNaN(parseFloat(n)) && isFinite(n);
}*/

/*function outroMoveu(){//GameLife
	// caso ele não estiver jogando nao fazer nada
	if(convidado == -1) return false;
		
	// realizar conexao
	conn = peer.connect(idc);
	
	// enviar os dados
	conn.on('open', function(){
		
		// Convidado
		if(convidado == true){
			console.log('Movimento'+Movements);
			if(Movements%2 == 0){
				document.getElementById('vez').innerHTML = "sua.";//Se movimentos for par, vez das brancas, vez do convidado.
			} else document.getElementById('vez').innerHTML = "do outro jogador.";
			//conn.send(Movements);
		}
		// Primeira atualização do convidante
		else if((convidado == false) && (convidante == 1)){
			givePieces('convidante');
			EventClickLinks('addFirst');
			document.getElementById('convidar').style.visibility = 'hidden';
			document.getElementById('stats').style.visibility = 'visible';
			convidante = 0;
			//conn.send(Movements);
		}
		else {
			console.log('Movimento'+Movements);
			if(Movements%2 != 0){
				document.getElementById('vez').innerHTML = "sua.";//Se movimentos for par, vez das brancas, vez do convidado.
			} else document.getElementById('vez').innerHTML = "do outro jogador.";
			//conn.send(Movements);
		}
	});

	// fechar conexão
	//conn.close();
}*/


/* ---- CRIAÇÂO DAS VARIÁVEIS E ATRIBUIÇÃO DOS UNICODES DE CADA PEÇA (função chamada quando carregar a página) ---- */
function createPieces(){
	pBranco = new Array(8);//peões brancos
	pPreto = new Array(8);//peões pretos
	titlePB = new Array(8);//atributo title dos peões brancos
	titlePP = new Array(8);//atributo title dos peões pretos
	MovementPB = new Array(8);//calcular movimento
	MovementPP = new Array(8);//para verificar 2 primeiras jogadas de cada peão

	for (i = 0; i < 8; i++){
		pBranco[i] = "&#9823";//"&#9817;";//peões brancos
		pPreto[i] =	"&#9823;";// peões pretos
		titlePB[i] = "Peão Branco "+(i+1);//titles brancos
		titlePP[i] = "Peão Preto "+(i+1);// titles pretos
		MovementPP[i] = 0, MovementPB[i] = 0;
	}

	cavaloBranco = new Array("&#9822;", "&#9822;");//("&#9816;", "&#9816;");
	cavaloPreto = new Array("&#9822;", "&#9822;");

	torreBranca = new Array("&#9820;", "&#9820;");//("&#9814;", "&#9814;");
	torrePreta = new Array("&#9820;", "&#9820;");

	bispoBranco = new Array("&#9821;", "&#9821;");//("&#9815;", "&#9815;");	
	bispoPreto = new Array("&#9821;", "&#9821;");

	reiBranco = "&#9818;";//"&#9812;";
	reiPreto = "&#9818;";
	rainhaBranca = "&#9819;";//"&#9813;";
	rainhaPreta = "&#9819;";

	/*movementPiece = new function(piece){
		this.id... Salva numa array
		manda pelo conn.send(), getelementbyid(array[id]).atributos
	}*/
}



/* ---- CRIAÇÃO DO TABULEIRO E POSICIONAMENTO INICIAL DAS PEÇAS NO MESMO ---- */
function givePieces(people){

	if(people == 'convidado'){

	//---------------------------- libera o jogo de quem convidou confirmando o convite
	conn = peer.connect(idc);
	conn.on('open', function(){
			conn.send("confirmation");
	});//-------------------------------------------------------------------------------

		//Cria células das tabelas em cada linha
		for(i = 1; i < 9; i++){//linhas (1 à 8)
			document.getElementById("line"+i).innerHTML = "<td id='"+(i-1)+"0'></td><td id='"+(i-1)+"1'></td><td id='"+(i-1)+"2'></td><td id='"+(i-1)+"3'></td><td id='"+(i-1)+"4'></td><td id='"+(i-1)+"5'></td><td id='"+(i-1)+"6'></td><td id='"+(i-1)+"7'></td>";
		}
		//Cria links dentro de todas as células que iniciarão vazias
		for(i = 2; i < 6; i++){//linhas (2 à 5)
			for(j = 0; j < 8; j++){//colunas (0 à 7)
				document.getElementById(i+""+j).innerHTML = "<a id='p"+i+j+"' href='#' class='vazias'></a>";
			}
		}		
	}

	else if(people == 'convidante'){
		var i = 8;
		//Cria células das tabelas em cada linha
		for(h = 1; h < 9; h++){//linhas (1 à 8)
			document.getElementById("line"+h).innerHTML = "<td id='"+(i-1)+"7'></td><td id='"+(i-1)+"6'></td><td id='"+(i-1)+"5'></td><td id='"+(i-1)+"4'></td><td id='"+(i-1)+"3'></td><td id='"+(i-1)+"2'></td><td id='"+(i-1)+"1'></td><td id='"+(i-1)+"0'></td>";
			i--;
		}
		//Cria links dentro de todas as células que iniciarão vazias
		for(i = 2; i < 6; i++){//linhas (2 à 5)
			for(j = 0; j < 8; j++){//colunas (0 à 7)
				document.getElementById(i+""+j).innerHTML = "<a id='p"+i+j+"' href='#' class='vazias'></a>";
			}
		}
	}
	else console.log(people);
	
	document.getElementById('chess_board').style.border = '4px solid #000';//Coloca borda no tabuleiro

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

	/* ----------------------------- Posicionamento dos Reis e rainhas ----------------------------*/
	document.getElementById("03").innerHTML = "<a title='Rainha Preta' id='p03' href='#' class='pretas'>"+rainhaPreta+"</a>";
	document.getElementById("04").innerHTML = "<a title='Rei Preto' id='p04' href='#' class='pretas'>"+reiPreto+"</a>";
	document.getElementById("73").innerHTML = "<a title='Rainha Branca' id='p73' href='#' class='brancas'>"+rainhaBranca+"</a>";
	document.getElementById("74").innerHTML = "<a title='Rei Branco' id='p74' href='#' class='brancas'>"+reiBranco+"</a>";

	if(Movements%2 == 0){
		if(convidado == true){
			document.getElementById('vez').innerHTML = "sua.";//Se movimentos for par, vez das brancas, vez do convidado.
		} else document.getElementById('vez').innerHTML = "do outro jogador.";
	} else if(convidado == false){
			document.getElementById('vez').innerHTML = "sua.";//Se movimentos for par, vez das brancas, vez do convidado.
		} else document.getElementById('vez').innerHTML = "do outro jogador.";

}

/* ---- EVENTO 'onCLick' DOS LINKS ---- */
function EventClickLinks(action){
	if(action == 'addFirst'){//executa como 'addFirst' quando carregar a página
		//Se 'addFirst', seleciona tudo que tiver as classes "vazias", brancas" e "pretas" e 
		//joga dentro da array "allClasses". No caso, os links.
		allClasses = document.querySelectorAll('.brancas, .pretas, .vazias');
		
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
	//console.log(id);
	linkClicked = document.getElementById(id);//Link clicado.
	classLinkClicked = linkClicked.className;//Salva a classe do link clicado.

	//Movements é definida como zero, e as peças brancas iniciam jogando. Logo todas as jogadas das peças brancas devem acontecer
	//quando o valor de Movements for um número par, e das das peças pretas, por sua vez, devem ser ímpares.
	// % é como uma divisão, mas que ao invés de pegar o quociente pega o resto.

	if(((Movements%2 == 0) && (convidado == 0)) || ((Movements%2 != 0) && (convidado == 1))){
	//Então a condição diz: Se o resto da divisão por 2 for igual a zero, isto é, for par, e se for convidante...
	//Ou se o resto da divisão por 2 for diferente de zero, se for ímpar, e for convidado.
		alert("Não é sua vez de jogar!");
	}
	else if(((classLinkClicked == 'pretas') && (convidado == 1)) || ((classLinkClicked == 'brancas') && (convidado == 0))){
	//Se a classe da peça clicada for pretas e for convidado. Ou se a classe da peça clicada for brancas e for convidante...
		alert("Não mexe no que não é seu!");
	}
	else if(classLinkClicked == 'vazias') return false;//Evitar, por exemplo, selecionar células vazias com tecla Tab

	else{
		titleLinkClicked = linkClicked.title;//Salva o nome da peça.
		linkClicked.setAttribute('class','clicked');//Seta a classe do link clicado para "clicked", definido no CSS para ficar laranja.
		pieceLinkClicked = linkClicked.innerHTML;//Clicamos em um link, agora pegamos seu UNICODE[peça];
		EventClickLinks();//remove evento 'onCLick' dos links para não mover sem ser selecionada.
		setTimeout(EventClickCells, 100);//Aguarda um décimo de segundo para adicionar o 'onCLick' nas células, depois de clicar no link...
		//... Senão será entendido que o clique do link será o mesmo da célula.
	}
}

/* ---- QUANDO CLICAR EM UMA CÉLULA ---- */
function whenClickCell(){
	var id = this.id;//id célula clicada.
	newLink = document.getElementById('p'+id);//link para onde a peça será movida.
	newClassLink = newLink.className;//classe do novo link clicado.
	//console.log(id);

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
		verifyPieceMovement(linkClicked, newLink);//função responsável pela verificação das peças e determinar seu movimento.
	}
}

/* ---- VERIFICA A PEÇA E MOVIMENTO ---- */
function verifyPieceMovement(oldPos, newPos){

	/* Por convenção, nomeei todos os links (peças) com a constante "p" (de peça) seguido de 2 números
	que são referentes às suas intersecções de Linhas e Colunas. Então agora pego o id [p(eça)L(inha)C(oluna)],
	retiro o "p", defino L = i, e C = j.*/
	j = oldPos.id.slice(-1);//pega último valor da string pL"C = j"
	i = oldPos.id.slice(-2, -1);//pega o penúltimo e acaba no último p"L = i"C, senão ficaria p"LC = i";

	k = newPos.id.slice(-1);//Coluna
	l = newPos.id.slice(-2, -1);//Linha
	newPosCell = l+""+k;//Posição para onde será movida a peça.


	titlepiece = oldPos.title;//título da peça que será movida.
	piece = "";//guardar um nome em comum para grupos de peças que possuem o mesmo movimento.

	if(titlePP.indexOf(titlepiece) !== -1){//Testa se é um dos títulos na array "titlePP".
		piece = 'peao preto';
		n = oldPos.title.slice(-1);//salva número do Peão (1 á 8)
		pieceMovPermited = new Array((+i+1)+""+j, (+i+2)+""+j, (+i+1)+""+(+j-1), (+i+1)+""+(+j+1));
		//expressão que descreve o movimento permitido, movimento da primeira jogada, e os dois possíveis de captura, respectivamente
	}
	else if(titlePB.indexOf(titlepiece) !== -1){//Agora se é um dos títulos da array "titlePB".
		piece = 'peao branco';
		n = oldPos.title.slice(-1);//salva número do peão (1 á 8)
		pieceMovPermited = new Array((+i-1)+""+j, (+i-2)+""+j, (+i-1)+""+(+j-1), (+i-1)+""+(+j+1));
		//expressão que descreve o movimento permitido, movimento da primeira jogada, e os dois possíveis de captura, respectivamente
	}
	else if((titlepiece == 'Torre Branca 1') || (titlepiece == 'Torre Branca 2') || (titlepiece == 'Torre brancas')
	 	|| (titlepiece == 'Torre Preta 1') || (titlepiece == 'Torre Preta 2') || (titlepiece == 'Torre pretas')){//Testa se é Torre.
		piece = 'torre';
		pieceMovPermited = new Array(i+""+k, l+""+j);
	}
	else if((titlepiece == 'Bispo Branco 1') || (titlepiece == 'Bispo Branco 2') || (titlepiece == 'Bispo brancas')
	 	|| (titlepiece == 'Bispo Preto 1') || (titlepiece == 'Bispo Preto 2') || (titlepiece == 'Bispo pretas')){//Testa se é Bispo.
		piece = 'bispo';
		pieceMovPermited = new Array(l+""+((+j)+(+l)-(+i)), l+""+((+j)+(+i)-(+l)));
	}
	else if((titlepiece == 'Cavalo Branco 1') || (titlepiece == 'Cavalo Branco 2') || (titlepiece == 'Cavalo brancas')
	 	|| (titlepiece == 'Cavalo Preto 1') || (titlepiece == 'Cavalo Preto 2') || (titlepiece == 'Cavalo pretas')){//Testa se é Cavalo.
		piece = 'cavalo';
		pieceMovPermited = new Array((+i+1)+""+(+j+2), (+i+1)+""+(+j-2), (+i+2)+""+(+j+1),
		(+i+2)+""+(+j-1), (+i-1)+""+(+j+2), (+i-1)+""+(+j-2), (+i-2)+""+(+j+1), (+i-2)+""+(+j-1));
	}
	else{
		piece = 'coroa';
		if((titlepiece == 'Rei Preto') || (titlepiece == 'Rei Branco')){//Se Reis
			pieceMovPermited = new Array(i+""+(+j+1), i+""+(+j-1), (+i+1)+""+j, (+i-1)+""+j,
			(+i+1)+""+(+j+1), (+i+1)+""+(+j-1), (+i-1)+""+(+j+1), (+i-1)+""+(+j-1));
		}
		else{//Se Rainhas
			pieceMovPermited = new Array(i+""+k, l+""+j, l+""+((+j)+(+l)-(+i)), l+""+((+j)+(+i)-(+l)));
		}
	}

	Xi = +i, Yi = +j;//atribuindo valor de LC (XY inicial)
	Xf = +l, Yf = +k;//e transformando string em número (XY final)
	
	switch(piece){

		//////////////////////////////////////// Se for um peão preto;
		case 'peao preto':
			if(MovementPP[+n-1] < 1){//se for a primeira jogada de cada peão preto
				if((newPosCell == pieceMovPermited[0]) || (newPosCell == pieceMovPermited[1])){//se é 1 ou 2 casas na vertical
					var jumped = document.getElementById('p'+pieceMovPermited[0]).className;//classe da peça pulada, se houver 
					if(newClassLink != 'vazias'){
						if(XequeClick == 1) return true;
						alert("Você não tem culhão para atacar pela frente, só pela diagonal!!!");
					}
					else if((newPosCell == pieceMovPermited[1]) && (jumped != 'vazias')){
						if(XequeClick == 1) return true;
						alert("Você até parece um animal, mas não é um cavalo!!!");
					}
					else{
						if(XequeClick == 1) return true;
						MovementPP[n-1]++;//contador de movimento do peão n
						console.log(titlepiece+" moveu");
						Move();
					}
				}
				else if(newClassLink != 'vazias'){//Já foi verificado se era mesma classe no WhenCLickCell(), então se não for vazias, será captura
					if((newPosCell == pieceMovPermited[2]) || (newPosCell == pieceMovPermited[3])){//se é 1 casa para alguma diagonal
						if(XequeClick == 1) return Move();
						MovementPP[n-1]++;//contador de movimento do peão n
						console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
						Move();
					}
					else{
						if(XequeClick == 1) return true;
						alert("Não pode mover aqui, verifique o tutorial!");
					}
				}
				else{
					if(XequeClick == 1) return true;
					alert("Não pode mover aqui, verifique o tutorial!");
				}
			}
			else{//Se não for mais a primeira jogada
				if(newPosCell == pieceMovPermited[0]){//se é 1 casa na vertical
					if(newClassLink != 'vazias'){
						if(XequeClick == 1) return true;
						alert("Você não tem culhão para atacar pela frente, só pela diagonal!!!");
					}
					else{
						if(XequeClick == 1) return true;
						if(Xf == 7){
							Promotion();//Se chegar na última linha, ocorre a promoção do Peão						}
						}
						else{//MovementPP[n-1]++;
							Move();
							console.log(titlepiece+" moveu");
						}
					}
				}
				else if(newClassLink != 'vazias'){//Já foi verificado se era mesma classe no WhenCLickCell(), então se não for vazias, será captura
					if((newPosCell == pieceMovPermited[2]) || (newPosCell == pieceMovPermited[3])){//se é 1 casa para alguma diagonal
						if(XequeClick == 1) return Move();
						if(Xf == 7){
							Promotion();//Se chegar na última linha, ocorre a promoção do Peão
						}
						else{
							console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
							//MovementPP[n-1]++;
							Move();
						}
					}
					else{
						if(XequeClick == 1) return true;
						alert("Não pode mover aqui, verifique o tutorial!");
					}
				}
				else{
					if(XequeClick == 1) return true;
					alert("Não pode mover aqui, verifique o tutorial!");
				}
			}

			break;

		//////////////////////////////////////// Se for um peão branco;
		case 'peao branco':
			if(MovementPB[+n-1] < 1){//se for a primeira jogada de cada peão branco
				if((newPosCell == pieceMovPermited[0]) || (newPosCell == pieceMovPermited[1])){//se é 1 ou 2 casas na vertical
					var jumped = document.getElementById('p'+pieceMovPermited[0]).className;//classe da peça pulada, se houver 
					if(newClassLink != 'vazias'){
						if(XequeClick == 1) return true;
						alert("Você não tem culhão para atacar pela frente, só pela diagonal!!!");
					}
					else if((newPosCell == pieceMovPermited[1]) && (jumped != 'vazias')){
						if(XequeClick == 1) return true;
						alert("Você até parece um animal, mas não é um cavalo!!!");
					}
					else{
						if(XequeClick == 1) return true;
						Move();
						MovementPB[n-1]++;//contador de movimento do peão n
						console.log(titlepiece+" moveu");
					}
				}
				else if(newClassLink != 'vazias'){//Já foi verificado se era mesma classe no WhenCLickCell(), então se não for vazias, será captura
					if((newPosCell == pieceMovPermited[2]) || (newPosCell == pieceMovPermited[3])){//se é 1 casa para alguma diagonal
						if(XequeClick == 1) return Move();
						MovementPB[n-1]++;//contador de movimento do peão n
						console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
						Move();//Captura
					}
					else{
						if(XequeClick == 1) return true;
						alert("Não pode mover aqui, verifique o tutorial!");
					}
				}
				else{
					if(XequeClick == 1) return true;
					alert("Não pode mover aqui, verifique o tutorial!");
				}
			}
			else{//Se não for mais a primeira jogada
				if(newPosCell == pieceMovPermited[0]){//se é 1 casa na vertical
					if(newClassLink != 'vazias'){
						if(XequeClick == 1) return true;
						alert("Você não tem culhão para atacar pela frente, só pela diagonal!!!");
					}
					else{
						if(XequeClick == 1) return true;
						if(Xf == 0){
							Promotion();//Se chegar na última linha, ocorre a promoção do Peão
						}
						else{
							//MovementPB[n-1]++;
							Move();
							console.log(titlepiece+" moveu");
						}
					}
				}
				else if(newClassLink != 'vazias'){//Já foi verificado se era mesma classe no WhenCLickCell(), então se não for vazias, será captura
					if((newPosCell == pieceMovPermited[2]) || (newPosCell == pieceMovPermited[3])){//se é 1 casa para alguma diagonal
						if(XequeClick == 1) return Move();
						if(Xf == 0){
							Promotion();//Se chegar na última linha, ocorre a promoção do Peão
						}
						else{
							console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
							//MovementPB[n-1]++;
							Move();
						}
					}
					else{
						if(XequeClick == 1) return true;
						alert("Não pode mover aqui, verifique o tutorial!");
					}
				}
				else{
					if(XequeClick == 1) return true;
					alert("Não pode mover aqui, verifique o tutorial!");
				}
			}
			break;

		//////////////////////////////////////// Se for uma torre;
		case 'torre':
			if(pieceMovPermited.indexOf(newPosCell) !== -1){//verifica se a nova posição é permitida (se está na array)
				VerifyJumped();
			} else{
				if(XequeClick == 1) return true;
				alert("Não pode mover aqui, verifique o tutorial!");
			}
			break;

		//////////////////////////////////////// Se for um bispo;	
		case 'bispo':
			if(pieceMovPermited.indexOf(newPosCell) !== -1){//verifica se a nova posição é permitida (se está na array)
				VerifyJumped();
			} else{
				if(XequeClick == 1) return true;
				alert("Não pode mover aqui, verifique o tutorial!");
			}
			break;

		//////////////////////////////////////// Se for um cavalo;
		case 'cavalo':
			if(pieceMovPermited.indexOf(newPosCell) !== -1){//verifica se a nova posição é permitida (se está na array)
				if(newClassLink != 'vazias'){
					if(XequeClick == 1) return Move();
					console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
				} else console.log(titlepiece+" moveu");
				Move();
			} else{
				if(XequeClick == 1) return true;
				alert("Não pode mover aqui, verifique o tutorial!");
			}
			break;

		//////////////////////////////////////// Se for coroa (reis ou rainhas);
		case 'coroa':
			if(pieceMovPermited.indexOf(newPosCell) !== -1){//verifica se a nova posição é permitida (se está na array)
					VerifyJumped();
				} else{
					if(XequeClick == 1) return true;
					alert("Não pode mover aqui, verifique o tutorial!");
				}
			break;

		//////////////////////////////////////// Se for um... Alien!? Rs.. Se não for nenhum dos anteriores. Você fez merda!!!
		default:
			console.log("Não é uma peça!!!")
	}
}

function Promotion(){
	document.getElementById("promotePart").style.visibility = "visible";
	for(var p = 1; p < 5; p++){//adicina Promote() nos 4 links de peça à ser promovida
		document.getElementById("p8"+p).addEventListener("click", Promote);
	}
}

function Promote(){
	var id = this.id;
	promotelinkClicked = document.getElementById(id);//Peça a que se promoverá o peão
	
	piecePromoted = "pro"+id;//
	conn = peer.connect(idc);
	conn.on('open', function(){
		conn.send(piecePromoted);//envia para o outro a nova peça à que será promovido o peão
	});
	
	titleLinkClicked = promotelinkClicked.title+" "+classLinkClicked;//Novo título + classe + número peão, caso haja mais promoções, diferencia
	pieceLinkClicked = promotelinkClicked.innerHTML;//Nova peça
	console.log(linkClicked.title+" foi promovido a "+titleLinkClicked+"!");

	document.getElementById("promotePart").style.visibility = "hidden";
	for(var p = 1; p < 5; p++){
		var promoteEl = document.getElementById("p8"+p);
		if(promoteEl) promoteEl.removeEventListener("click", Promote);
	}
	setTimeout(Move, 1000);
}

function VerifyJumped(){
/////////////////////////////// SE MOVIMENTO NA VERTICAL
	if(Xi == Xf){
		if((Yi > Yf) && ((Yi-Yf)>1)){//Se o Y inicial for maior e andará mais de uma casa
			var jumped = false;
			for(pieceJumped = (Yf+1); pieceJumped < Yi; pieceJumped++){
				if((document.getElementById("p"+Xi+""+pieceJumped).className) != 'vazias'){//Verifica se tem peça no caminho
					jumped = true;//salva true se tiver peça no caminho
					pieceJumped = Yi;//se tiver, para o laço, uma é necessário para o teste
				}
			}
			if(jumped == true){//Se tiver algum valor true na Array jumped (se tem peça no caminho)
				if(XequeClick == 1) return true;
				alert("Você até parece um animal, mas não é um cavalo!!!");
			}
			else{
				if(newClassLink != 'vazias'){//Se tem peça do outro na posição final, mas não pulou nenhuma
				if(XequeClick == 1) return Move();
				console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
				} else console.log(titlepiece+" moveu");//Senão, movimento sem captura
				Move();
			}
		}
		else if((Yf > Yi) && ((Yf-Yi)>1)){//Se o Y final for maior e andará mais de uma casa
			var jumped = false;
			for(pieceJumped = (Yi+1); pieceJumped < Yf; pieceJumped++){
				if((document.getElementById("p"+Xi+""+pieceJumped).className) != 'vazias'){//Verifica se tem peça no caminho
					jumped = true;//salva true se tiver peça no caminho
					pieceJumped = Yf;//se tiver, para o laço, uma é necessário para o teste
				}
			}
			if(jumped == true){
				if(XequeClick == 1) return true;
				alert("Você até parece um animal, mas não é um cavalo!!!");
			}
			else{
				if(newClassLink != 'vazias'){
					if(XequeClick == 1) return Move();
					console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
				} else console.log(titlepiece+" moveu");
				Move();
			}
		}
		else{//Se for somente uma casa que andará
			if(newClassLink != 'vazias'){
				if(XequeClick == 1) return Move();
				console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
			} else console.log(titlepiece+" moveu");
			Move();
		}
	}
/////////////////////////////// SE MOVIMENTO NA HORIZONTAL
	else if(Yi == Yf){
		if((Xi > Xf) && ((Xi-Xf)>1)){//Se o X inicial for maior e andará mais de uma casa
			var jumped = false;
			for(pieceJumped = (Xf+1); pieceJumped < Xi; pieceJumped++){
				if((document.getElementById("p"+pieceJumped+""+Yi).className) != 'vazias'){//Verifica se tem peça no caminho
					jumped = true;//salva true se tiver peça no caminho
					pieceJumped = Xi;//se tiver, para o laço, uma é necessário para o teste
				}
			}
			if(jumped == true){
				if(XequeClick == 1) return true;
				alert("Você até parece um animal, mas não é um cavalo!!!");
			}
			else{
				if(newClassLink != 'vazias'){
					if(XequeClick == 1) return Move();
					console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
				} else console.log(titlepiece+" moveu");
				Move();
			}
		}
		else if((Xf > Xi) && ((Xf-Xi)>1)){//Se o X final for maior e andará mais de uma casa
			var jumped = false;
			for(pieceJumped = (Xi+1); pieceJumped < Xf; pieceJumped++){
				if((document.getElementById("p"+pieceJumped+""+Yi).className) != 'vazias'){//Verifica se tem peça no caminho
					jumped = true;//salva true se tiver peça no caminho
					pieceJumped = Xf;//se tiver, para o laço, uma é necessário para o teste
				}
			}
			if(jumped == true){
				if(XequeClick == 1) return true;
				alert("Você até parece um animal, mas não é um cavalo!!!");
			}
			else{
				if(newClassLink != 'vazias'){
					if(XequeClick == 1) return Move();
					console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
				} else console.log(titlepiece+" moveu");
				Move();
			}
		}
		else{//Se for somente uma casa que andará
			if(newClassLink != 'vazias'){
				if(XequeClick == 1) return Move();
				console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
			} else console.log(titlepiece+" moveu");
			Move();
		}
	}
/////////////////////////////// SE MOVIMENTO NA DIAGONAL
	else{
		if(((Xf - Xi) == (Yf - Yi)) && (((Xf-Xi)>1) || ((Xi-Xf)>1))){//diagonal em que X e Y crescem ou diminuem simultaneamente e andará mais de uma casa
			
			var dir = "";
			if(Xf > Xi){
				dir = "crescente";//direção de X (mas aqui Y também é na mesma direção)
				var delta = Xf-Xi;//casas à andar
			}
			else{
				dir = "decrescente";//direção de X (mas aqui Y também é na mesma direção)
				var delta = Xi-Xf;//casas à andar
			}

			var jumped = false;

			if(dir == "crescente"){
				for(pieceJumped = (Xi+1); pieceJumped < Xf; pieceJumped++){
					if((document.getElementById("p"+pieceJumped+""+(Yi+pieceJumped-Xi)).className) != 'vazias'){//Verifica se tem peça no caminho
						jumped = true;//salva true se tiver peça no caminho
						pieceJumped = Xf;//se tiver, para o laço, uma é necessário para o teste
					}
				}
			}
			else{
				for(pieceJumped = (Xf+1); pieceJumped < Xi; pieceJumped++){
					if((document.getElementById("p"+pieceJumped+""+(Yi+pieceJumped-Xi)).className) != 'vazias'){//Verifica se tem peça no caminho
						jumped = true;//salva true se tiver peça no caminho
						pieceJumped = Xi;//se tiver, para o laço, uma é necessário para o teste
					}
				}
			}

			if(jumped == true){
				if(XequeClick == 1) return true;
				alert("Você até parece um animal, mas não é um cavalo!!!");
			}
			else{
				if(newClassLink != 'vazias'){
					if(XequeClick == 1) return Move();
					console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
				} else console.log(titlepiece+" moveu");
				Move();
			}
		}
		else if(((Xf - Xi) == (Yi - Yf)) && (((Xf-Xi)>1) || ((Xi-Xf)>1))){//diagonal em que X e Y crescem ou diminuem inversamente e andará mais de uma casa
			
			var dir = "";
			if(Xf > Xi){
				dir = "crescente";//direção de X (Aqui se X cresce, Y diminui)
				var delta = Xf-Xi;//casas à andar
			}
			else{
				dir = "decrescente";//direção de X (Aqui se X diminui, Y cresce)
				var delta = Xi-Xf;//casas à andar
			}

			var jumped = false;

			if(dir == "crescente"){
				for(pieceJumped = (Xi+1); pieceJumped < Xf; pieceJumped++){
					if((document.getElementById("p"+pieceJumped+""+(Yi+Xi-pieceJumped)).className) != 'vazias'){//Verifica se tem peça no caminho
						jumped = true;//salva true se tiver peça no caminho
						pieceJumped = Xf;//se tiver, para o laço, uma é necessário para o teste
					}
				}
			}
			else{
				for(pieceJumped = (Xf+1); pieceJumped < Xi; pieceJumped++){
					if((document.getElementById("p"+pieceJumped+""+(Yi+Xi-pieceJumped)).className) != 'vazias'){//Verifica se tem peça no caminho
						jumped = true;//salva true se tiver peça no caminho
						pieceJumped = Xi;//se tiver, para o laço, uma é necessário para o teste
					}
				}
			}

			if(jumped == true){
				if(XequeClick == 1) return true;
				alert("Você até parece um animal, mas não é um cavalo!!!");
			}
			else{
				if(newClassLink != 'vazias'){
					if(XequeClick == 1) return Move();
					console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
				} else console.log(titlepiece+" moveu");
				Move();
			}
		}
		else{//Se for somente uma casa que andará
			if(newClassLink != 'vazias'){
				if(XequeClick == 1) return Move();
				console.log(titlepiece+" captura "+newLink.title+"!");//Movimento de captura
			} else console.log(titlepiece+" moveu");
			Move();
		}
	}
}

/* ---- MOVE ---- */
function Move(){

	if(XequeClick == 1){//Se o movimento que foi aprovado e é um "Xeque"
		
		if(convidado == true){
			ClassBeforeXequeOther = "pretas";
		} else ClassBeforeXequeOther = "brancas";

		OtherKing.setAttribute('class', "xequed");
		
		MsgXeque = "xxx"+OtherKing.id;//"xxx" para ver quando é xeque e a posição do rei para o outro não precisar "procurar"
		conn = peer.connect(idc);
		conn.on('open', function(){
			conn.send(MsgXeque);//Mostrar xeque no outro
		});
		Xequed = 1;
	}
	else{

		if(Xequed == 1){//Se desiste de dar xeque-mate (sei que é meio ilógico, mas se tentarem tenho que possibilitar)
			Xequed = 0;//Senão, numa desistência dessa o rei oposto só volta à sua cor no movimento do outro player
			OtherKing.className = ClassBeforeXequeOther;//e isso pode soar como um bug
		}

		/*	Remoção de atributos do link que ficará vazio, sem peça.	*/
		linkClicked.className = "vazias";//define a classe do link para vazias.
		linkClicked.title = "";//Limpa o nome.
		linkClicked.innerHTML = "";//Limpa a peça do link anterior.

		/*	Adição dos atributos ao novo link, o local que a peça ficará.	*/
		newLink.className = classLinkClicked;//define sua classe
		newLink.title = titleLinkClicked;//seu nome.
		newLink.innerHTML = pieceLinkClicked;//Coloca o UNICODE[peça] do link clicado.

		if(newLink.className == "xequed"){//Aqui é o escape do Xeque com o Rei (o outro player verifica se ainda está em xeque)
			newLink.className = ClassBeforeXeque;//seta classe anterior (pretas ou brancas)
		}
		if(MyKing.className == "xequed"){//Aqui é o escape do Xeque com outra peça (quando o Rei continua no lugar)
			MyKing.className = ClassBeforeXeque;
		}

		EventClickCells('remove');//remove evento de 'onClick' das células, evitando "duplicar" peças.
		EventClickLinks('addOthers');//reativa o 'onClick' dos links.


		Movements++;
		//console.log('Movido na ação '+Movements);

		MovedWay = linkClicked.id+""+newLink.id;//Salva posição antiga e nova posição para enviar para atualizar o outro player
		//console.log(MovedWay);

		conn = peer.connect(idc);
		conn.on('open', function(){
			conn.send(MovedWay);//enviando dados
		});

		if(Movements%2 == 0){
			if(convidado == true){
				document.getElementById('vez').innerHTML = "sua.";//Se movimentos for par, vez das brancas, vez do convidado.
			} else document.getElementById('vez').innerHTML = "do outro jogador.";
		} else if(convidado == false){
				document.getElementById('vez').innerHTML = "sua.";//Se movimentos for par, vez das brancas, vez do convidado.
			} else document.getElementById('vez').innerHTML = "do outro jogador.";

	setTimeout(KingHealth, 100);
	}
}

function MoveOther(oldPosOther, newPosOther){
	
	if(Xequed == 1){//Toda vez que o rei oposto estiver em xeque, retira o xeque quando o oponente mover alguma peça
		Xequed = 0;//pois espera-se que ele tente fugir, senão, é xeque-mate
		OtherKing.className = ClassBeforeXequeOther;//coloca a classe antiga do rei (pretas ou brancas)

		setTimeout(Xeque, 100);//Mas vai que ele quer um xeque-mate...
		//Aguarda um décimo de segundo. Pois se o outro capturar a peça que está atacando, o Xeque vai considerar que a peça
		//atacante ainda está ali, se for ao mesmo tempo.
	}

	if(MyKing.className == "xequed"){//Caso o outro desista de dar o xeque-mate
		MyKing.className = ClassBeforeXeque;//seta sua classe anterior
	}

	OldLink = document.getElementById(oldPosOther);//link da peça que foi movida pelo outro (posição, pois os links não mudam de lugar)
	NewLink = document.getElementById(newPosOther);//link para onde o outro moveu

	classLinkClickedOther = OldLink.className;//salva classe antiga do outro

	if(promoting == 1){//Se o outro está se promovendo
		//var n = OldLink.title.slice(-1);//número do peão se promovendo
		titleLinkClickedOther = promotelinkClicked.title+" "+classLinkClickedOther;//Novo título + classe
		pieceLinkClickedOther = promotelinkClicked.innerHTML;//Nova peça
		console.log(OldLink.title+" foi promovido a "+titleLinkClickedOther+"!");
		promoting = 0;//promoteLinkClicked definido em recebeConvite()
	}
	else{
		titleLinkClickedOther = OldLink.title;//salva título da peça 
		pieceLinkClickedOther = OldLink.innerHTML;//e a peça, os três são passados para a nova posição
	}

	if(NewLink.className != 'vazias'){
		console.log(NewLink.title+" sofreu captura de "+titleLinkClickedOther+"!");//Movimento de captura
	} else console.log(titleLinkClickedOther+" moveu");

	OldLink.className = "vazias";//define a classe do link para vazias.
	OldLink.title = "";//Limpa o nome.
	OldLink.innerHTML = "";//Limpa a peça do link anterior.

	//	Adição dos atributos ao novo link, o local que a peça ficará.
	NewLink.className = classLinkClickedOther;//define sua classe
	NewLink.title = titleLinkClickedOther;//seu nome.
	NewLink.innerHTML = pieceLinkClickedOther;//Coloca o UNICODE[peça] do link clicado.

	Movements++;

	if(Movements%2 == 0){
		if(convidado == true){
			document.getElementById('vez').innerHTML = "sua.";//Se movimentos for par, vez das brancas, vez do convidado.
		} else document.getElementById('vez').innerHTML = "do outro jogador.";
	} else if(convidado == false){
		document.getElementById('vez').innerHTML = "sua.";//Se movimentos for par, vez das brancas, vez do convidado.
	} else document.getElementById('vez').innerHTML = "do outro jogador.";

	if(conn && conn.close) conn.close();
	setTimeout(KingHealth, 100);
}

function Xeque(){

	//setTimeout(function() { XequeClick = 1; }, 1000);//Não conflitar com movimentos
	XequeClick = 1;
	
	if(convidado == true){//Se é brancas
		var nameOtherKing = "Rei Preto";//rei oposto é o preto
		var allMy = document.querySelectorAll('.brancas');//seleciona todas as peças brancas (para testar se está atacando o rei)
		var allOther = document.querySelectorAll('.pretas');//seleciona todas as peças pretas (para procurar o rei oposto)
	}
	else{
		var nameOtherKing = "Rei Branco";//senão (se for pretas), rei oposto é o branco
		var allMy = document.querySelectorAll('.pretas');//seleciona todas as peças pretas (para testar se está atacando o rei)
		var allOther = document.querySelectorAll('.brancas');//seleciona todas as peças brancas (para procurar o rei oposo)
	}

	for(var jxeque = 0, cacheArray = allOther.length; jxeque < cacheArray; jxeque++){//Percorre todas peças opostas
		if(allOther[jxeque].title == nameOtherKing){//Quando achar o rei oposto
			OtherKing = allOther[jxeque];
			for(var ixeque = 0, cacheArray = allMy.length; ixeque < cacheArray; ixeque++){//Percorre todas as peças da classe
				verifyPieceMovement(allMy[ixeque], OtherKing);//verifica se está em posição de ataque ao rei
				//console.log(allMy[ixeque].id+" com "+OtherKing.id);
			}
			jxeque = allOther.length;//para o laço
		}
	}

	XequeClick = 0;
}

function KingHealth(){

	var myKingLife = 0, otherKingLife = 0;
	
	if(convidado == true){//Se é brancas
		var myKingName = "Rei Branco", otherKingName = "Rei Preto";
		var allMy = document.querySelectorAll('.brancas, .xequed');//seleciona todas as peças brancas
		var allOther = document.querySelectorAll('.pretas, .xequed');//seleciona todas as peças pretas
	}
	else{//senão (se for pretas)
		var myKingName = "Rei Preto", otherKingName = "Rei Branco";
		var allMy = document.querySelectorAll('.pretas, .xequed');//seleciona todas as peças pretas
		var allOther = document.querySelectorAll('.brancas, .xequed');//seleciona todas as peças brancas
	}

	////---- VERIFICA SE MEU REI ESTÁ VIVO
	for(var xMate = 0, cacheArray = allMy.length; xMate < cacheArray; xMate++){
		if(allMy[xMate].title == myKingName){
			myKingLife = 1;//Rei vivo
			xMate = cacheArray;//para o laço
		}
	}
	////---- VERIFICA SE O REI ALHEIO ESTÁ VIVO
	for(var xMate = 0, cacheArray = allOther.length; xMate < cacheArray; xMate++){
		if(allOther[xMate].title == otherKingName){
			otherKingLife = 1;
			xMate = cacheArray;
		}
	}

	if(myKingLife == 0){
		EventClickLinks();//bloqueia peças
		//clearInterval(gameLife);
		alert("XEQUE MATE: VOCÊ PERDEU, VAI JOGAR DAMA!!!");
	}
	else if(otherKingLife == 0){
		EventClickLinks();//bloqueia peças
		//clearInterval(gameLife);
		alert("XEQUE-MATE: VOCÊ VENCEU, É UM GRANDE ESTRATEGISTA!!!");
	} else return true;//se ambos estão vivos, o jogo continua!
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
document.getElementById('p'+(+i+1)+""+(+j+1)).innerHTML = pieceLinkClicked;//modo de somar L+1 e C+1, transformando primeiramente as strings p/ nº.
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
que só executará a seleção do clique no link se a classe dele for diferente de "vazias" (CORRIGIDO: 15/05/17_23:26).
*/
