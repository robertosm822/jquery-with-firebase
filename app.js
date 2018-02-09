  // Initialize Firebase
  var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "chat-firebase-jquery",
    storageBucket: "chat-firebase-jquery.appspot.com",
    messagingSenderId: ""
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var name = "";
  	const txtEmail 		= document.getElementById('txtEmail');
	const txtPassword 	= document.getElementById('txtPassword');
	const btnLogin 		= document.getElementById('btnLogin');
	const btnLogout 	= document.getElementById('sair');
	const btnSignUp 	= document.getElementById('btnSignUp');
	

//tratar retirada de HTML ou script malicioso
function escapeHtml (string) {
	return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

  $('#submit').on('click',function(e){
  	var name = $('#nameinput').val().trim();

  	var d = new Date();
    var s = d.getSeconds();
    var h= d.getHours();
    var time = d.getYear()+"."+d.getDay()+"."+h+"."+d.getMinutes()+"."+s;
  	
  	if(name != ""){
	  	//metodo push eh o que grava uma nova linha a tabela 'mensagens'
	  	database.ref('mensagens').push({
	  		name: name,
	  		apelido: $('#txtApelido').val().trim(),
	  		photo: "https://www.gravatar.com/avatar/"+CryptoJS.MD5("roberto_sm822@yahoo.com.br")+".jpg');",
	  		order: time
	  	});
  	}
  	

  	mostrarTodos();
  	$('#nameinput').val("");

  	return false;
  });

  	//adicionando possibilidade de envio via ENTER do teclado
  	$('#nameinput').keypress(function (e) {
  		if (e.which == 13) {
  			var name = $('#nameinput').val().trim();
  			
		  	var d = new Date();
		    var s = d.getSeconds();
		    var h= d.getHours();
		    var time = d.getYear()+"."+d.getDay()+"."+h+"."+d.getMinutes()+"."+s;
		    //https://s.gravatar.com/avatar/22dda2f90e5a78fdd86fb8d8e25dce3d?s=80
		    var foto = "https://www.gravatar.com/avatar/"+md5(txtEmail)+".jpg";
		  	
		  	if(name != ""){
			  	//metodo push eh o que grava uma nova linha a tabela 'mensagens'
			  	database.ref('mensagens').push({
			  		name: name,
			  		apelido: $('#txtApelido').val().trim(),
			  		photo: foto,
			  		order: time
			  	});
		  	}
		  	mostrarTodos();
		  	$('#nameinput').val("");
  		}
	});

  	//mostrando todos os registros gravados
  	database.ref('mensagens').on('value',function(snapshot) {
	  snapshot.forEach(function(data){
                var val = data.val();
                //console.log(val.name);
                //varcontent += "<img width='30' src='"+val.photo+"'> -- "+val.name+"<br>";
                $('#display').html("<li class='nav-messages'><img width='30' src='"+val.photo+"'>["+val.apelido+"] -- "+val.name+"</li>");
                //content +='<tr>';
                //content += '<td>' + val.descripcion + '</td>';
      });
	});
  	
function mostrarTodos(){
	var content='';
	//mostrando todos os registros gravados, limitando pelos ultimos 50 recentes
  	database.ref('mensagens').limitToLast(25).on('value',function(snapshot) {
	  snapshot.forEach(function(data){
                var val = data.val();

                //console.log(val.name);
                content += "<li class='nav-messages'><img width='30' src='"+val.photo+"'>["+val.apelido+"] -- "+val.name+"</li>";
                //content +='<tr>';
                //content += '<td>' + val.descripcion + '</td>';
      });
	});

	return $('#display').html(content);
}

function removeData(){
	//metodo para apagar todas as mensagens criadas
	database.ref('mensagens').remove();
}

	 
//function logarSe(){


	//add login event
	btnLogin.addEventListener('click', e=>{
		const email = txtEmail.value;
		const pass = txtPassword.value;
		const auth = firebase.auth();
		//sign in
		const promise = auth.signInWithEmailAndPassword(email, pass);
		promise.catch(e => console.log(e.message));
	});

	//add signup event
	btnSignUp.addEventListener('click', e => {
		const email = txtEmail.value;
		const pass = txtPassword.value;
		const auth = firebase.auth();
		//create user
		const promise = auth.createUserWithEmailAndPassword(email, pass);
		promise.catch(e => console.log(e.message));
	});

	//logout
	btnLogout.addEventListener('click', e => {
		firebase.auth().signOut();
	});

	//add realtime Listener
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser){
			console.log(firebaseUser);
			
			btnLogout.style.display = 'block';
			document.getElementById('login-modal').style.display = "none";
			document.getElementById('display').style.display = 'block';
			document.getElementById('form-chat').style.display = 'block';
		} else {
			console.log("Nao logado");
			btnLogout.style.display = 'none';
			document.getElementById('login-modal').style.display = "block";
			document.getElementById('display').style.display = 'none';
			document.getElementById('form-chat').style.display = 'none';
		}
	});