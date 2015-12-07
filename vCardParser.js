

//Contact --> construct a new Contact
var Contact = function(nom, prenom, organisation, fonction, telephone, mobile, courriel){
	this.nom = nom;
	this.prenom = prenom;
	this.organisation = organisation;
	this.fonction = fonction;
	this.telephone = telephone;
	this.mobile = mobile;
	this.courriel = courriel;
}

//Add "write" property to contact to be able to add it to the database (text file)
Contact.prototype.write = function (){
	return this.nom + ";" + this.prenom + ";" + this.organisation + ";" + this.fonction + ";" + this.telephone + ";" + this.mobile + ";" + this.courriel + "\n";
}


//check if a contact is equal to another one
Contact.prototype.isEqualTo = function(c) {
	if(this.nom === c.nom && this.prenom === c.prenom && 
		this.organisation === c.organisation && this.fonction === c.fonction && 
		this.telephone === c.telephone && this.mobile === c.mobile && 
		this.courriel === c.courriel)
			return true;
	else
			return false;
	
}

//check if a contact is in the array
Contact.prototype.isInArray = function(array) {
	var res = false;
	for (var i = 0; i < array.length; i++)
		if(array[i].isEqualTo(this))
			res = true;
	return res;
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Parser procedure

//vCardParser
var vCardParser = function(){
	//the contact get from the vCard file
	this.contact;
	this.symb = ["BEGIN:VCARD", "FN", "ORG", "TITLE", "EMAIL;PREF;INTERNET", "EMAIL;INTERNET", "TEL;HOME;VOICE", "TEL;CELL;VOICE", "END:VCARD"];
}

// Stops the parsing process when called and print error message
vCardParser.prototype.err = function(msg){
	console.log("Parsing Error ! -- msg : "+msg);
	process.exit(0);
}

// tokenize : tranform the data input into a list
vCardParser.prototype.tokenize = function(data){
	var separator = /(\r\n|: )/;
	data = data.split(separator);
	data = data.filter(function(val, idx){ 
		return !val.match(separator); 	
	});
	return data;
}

// check file validity
vCardParser.prototype.checkFile = function(data){
	var input = this.tokenize(data);	
	var lastId = input.length - 1;
	if(input[0] === "BEGIN:VCARD" && input[lastId] === "END:VCARD")
		return true;
	else
		return false;
}


// verify if the property p is part of the language symbols.
vCardParser.prototype.checkProp = function(p){
	var idx = this.symb.indexOf(p);
	// index 0 exists
	if(idx === -1){
		return false;
	} else
		return true;
}

/**
 * split properties names from values
 * returning a table of 2 tables
 * table 1 --> property
 * table 2 --> value
**/
vCardParser.prototype.getData = function(input){
	var inputLength = input.length;
	var property = [];
	var value = [];
	for(var i = 0; i < inputLength; i++){
		var dataTab = input[i].split(":");
		if (this.checkProp(dataTab[0])) {
			property.push(dataTab[0]);
			value.push(dataTab[1]);
		}
	}
	return [property, value];
}

/**
 * extract nom et prenom in tab identite
 * identite[0] -> prenom
 * identite[1] -> nom
**/
vCardParser.prototype.identite = function(dataTab) {
	var property = dataTab[0];
	var value = dataTab[1];
	var identite = [];
	var id = property.indexOf("FN");
	if(id !== -1){
		identite = value[id];
		//check format before return
		matched = identite.match(/([a-zâäàéèùêëîïôöçñ]|\s)+/i);
		if(identite === matched[0])
			return identite.split(" ");
		else
			this.err("Organisation non conforme");		
	} else 
		return identite.split(" ");
}

/**
 * extract organisation
**/
vCardParser.prototype.organisation = function(dataTab) {
	var property = dataTab[0];
	var value = dataTab[1];
	var organisation = "";
	var id = property.indexOf("ORG");
	if(id !== -1){
		organisation = value[id];
		//check format before return
		matched = organisation.match(/([a-z0-9âäàéèùêëîïôöçñ]|\s)+/i);
		if(organisation === matched[0])
			return organisation;
		else
			this.err("Organisation non conforme");
	} else
		return organisation;
}

/**
 * extract fonction
**/
vCardParser.prototype.fonction = function(dataTab) {
	var property = dataTab[0];
	var value = dataTab[1];
	var fonction = "";
	var id = property.indexOf("TITLE");
	if(id !== -1){
		fonction = value[id];
		//check format before return
		matched = fonction.match(/([a-zâäàéèùêëîïôöçñ]|\s)+/i);
		if(fonction === matched[0])
			return fonction;
		else
			this.err("Fonction non conforme");
	} else
		return fonction;
}

/**
 * extract telephone
**/
vCardParser.prototype.telephone = function(dataTab) {
	var property = dataTab[0];
	var value = dataTab[1];
	var telephone = "";
	var id = property.indexOf("TEL;HOME;VOICE");
	if(id !== -1){
		telephone = value[id];
		//check format before return
		matched = telephone.match(/(\(\+?[0-9]{2,5}\)([0-9]{2,3}|\s)+|[0-9]+)/);
		if(telephone === matched[0])
			return telephone;
		else
			this.err("Telephone non conforme");
	}else
		return telephone; 
	
}

/**
 * extract mobile
**/
vCardParser.prototype.mobile = function(dataTab) {
	var property = dataTab[0];
	var value = dataTab[1];
	var mobile = "";
	var id = property.indexOf("TEL;CELL;VOICE");
	if(id !== -1){
		mobile = value[id];
		//check format before return
		matched = mobile.match(/(\(\+?[0-9]{2,5}\)([0-9]{2,3}|\s)+|[0-9]+)/);	
		if(mobile === matched[0])
			return mobile;
		else
			this.err("Mobile non conforme");
	} else
		return mobile;
}

/**

 * extract courriel
**/
vCardParser.prototype.courriel = function(dataTab) {
	var property = dataTab[0];
	var value = dataTab[1];
	var courriel = "";
	var id = property.indexOf("EMAIL;PREF;INTERNET");
	if(id === -1)
		id = property.indexOf("EMAIL;INTERNET");
	if(id !== -1) {
		courriel = value[id];
		//check format before return
		matched = courriel.match(/[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}/);
		if(courriel === matched[0])
			return courriel;
		else
			this.err("Courriel non conforme");
	}else
		return courriel;
}

vCardParser.prototype.parse = function(dataTab) {
	var id = this.identite(dataTab);
	this.contact = 
		new Contact(id[1], id[0], 
					this.organisation(dataTab), 
					this.fonction(dataTab), 
					this.telephone(dataTab), 
					this.mobile(dataTab), 
					this.courriel(dataTab)
	);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//fonction pour parser un fichier --> lancer avec la commande "parse"
var parseVCard = function(){
	var readline = require('readline');

	var rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});

	rl.question("Veuillez insérer l'url du fichier à importer \n", function(fileToParse) {	
		//launch import
		var fs = require("fs");

		fs.readFile(fileToParse, 'utf8', function (err,data) {
			if (err) {
				return console.log("Fichier noo")
		 	}
			analyzer = new vCardParser();
			var input = analyzer.tokenize(data);
			var dataTab = analyzer.getData(input);
			analyzer.parse(dataTab);
			console.log(analyzer.contact);
			//Add the contact to a database (here it's a simple text file)
			fs.appendFile('database.txt', analyzer.contact.write(), function (err) {
				if (err) throw err;
				console.log('Contact ajouté !');
			});		
		});
		rl.close();
	}); 
}


//fonction afficher les contacts --> lancer avec la commande "display"
var displayContactList = function(){
	var fs = require("fs");
	fs.readFile("database.txt", 'utf8', function (err,data) {
		if (err) {
			return console.log("Fichier noo")
	 	}
		//récupérer chaque ligne (ligne = entrée) de la base de données
		data = data.split("\n");
		//on arrete la boucle à data.length-1 car la dernière ligne du fichier est vide
		var liste = [];
		for(var i = 0; i < data.length-1; i++){
			ligne = data[i].split(";");
			var cnt = new Contact(ligne[0], ligne[1], ligne[2], ligne[3], ligne[4], ligne[5], ligne[6]);
			liste.push(cnt);	
		}	
		console.log(liste);
	})
};

//fonction effacer les doublons --> lancer avec la commande "clear"
var effacerDoublons = function(){
	var fs = require("fs");
	fs.readFile("database.txt", 'utf8', function (err,data) {
		if (err) {
			return console.log("Fichier noo")
	 	}
		//récupérer les contacts dans un tableau
		data = data.split("\n");
		var liste = [];
		for(var i = 0; i < data.length-1; i++){
			ligne = data[i].split(";");
			var cnt = new Contact(ligne[0], ligne[1], ligne[2], ligne[3], ligne[4], ligne[5], ligne[6]);
			liste.push(cnt);	
		}	
		//effacer les doublons	du tableau
		var listeCleared = [];
		for(var i = 0; i < liste.length; i++){
			if(!liste[i].isInArray(listeCleared))
				listeCleared.push(liste[i]);
		}	
		//Effacer les doublons dans la BD
		// --> effacer tout ce que contient le fichier
		fs.writeFile('database.txt', "", function (err) {
			if (err) throw err;
		});
		// --> réécrire les données à partir du tableau sans les doublons
		for(var i = 0; i < listeCleared.length; i++){
			fs.appendFile('database.txt', listeCleared[i].write(), function (err) {
				if (err) throw err;
			});
		}
		console.log("Doublons effacés !");
	})
};


//get a contact id in an array using nom and prenom
var extractContact = function(nom, prenom, array){
	var contact;	
	var i = 0;
	while(!contact && i < array.length) {
		if (array[i].nom === nom && array[i].prenom === prenom)
			contact = i;
		 i++;
	}
	return contact;
	
}


/**
 * fonction pour modifier un contact --> lancer avec la commande "modif nom prenom property newVal"
 * nom --> nom du contact à modifier
 * prenom --> prenom du contact à modifier
 * property --> propriété du contact à modifier (nom, prenom, ..., courriel)
 * newVal --> valeur par laquelle remplacer la valeur actuelle de la propriété
**/
var modifierContact = function(nom, prenom, property, newVal){

	var fs = require("fs");
	fs.readFile("database.txt", 'utf8', function (err,data) {
		if (err) {
			return console.log("Fichier noo")
	 	}
		//récupérer les contacts dans un tableau
		data = data.split("\n");
		var liste = [];
		for(var i = 0; i < data.length-1; i++){
			ligne = data[i].split(";");
			var cnt = new Contact(ligne[0], ligne[1], ligne[2], ligne[3], ligne[4], ligne[5], ligne[6]);
			liste.push(cnt);	
		}

		//récupérer le contact à modifier
		var contactID = extractContact(nom, prenom, liste);

		//effectuer la modification si le contact existe
		if(contactID === undefined ){
			console.log("Erreur ! Contact " + nom + " " + prenom + " non trouvé");
			process.exit(0);
		} else {
			switch (property) {
				case "nom" :
					matched = newVal.match(/([a-zâäàéèùêëîïôöçñ]|\s)+/i);
					if(matched[0] === newVal) {
						liste[contactID].nom = newVal;
						console.log("Nom contact modifié !");			
					}
					else
						console.log("Format inavlide");
					break;
				case "prenom" :
					matched = newVal.match(/([a-zâäàéèùêëîïôöçñ]|\s)+/i);
					if(matched[0] === newVal) {
						liste[contactID].prenom = newVal;
						console.log("Prenom contact modifié !");			
					}
					else
						console.log("Format inavlide");
					break;
				case "organisation" :
					matched = newVal.match(/([a-z0-9âäàéèùêëîïôöçñ]|\s)+/i);
					if(matched[0] === newVal) {
						liste[contactID].organisation = newVal;
						console.log("Organisation contact modifié !");			
					}
					else
						console.log("Format inavlide");
					break;
				case "fonction" :
					matched = newVal.match(/([a-zâäàéèùêëîïôöçñ]|\s)+/i);
					if(matched[0] === newVal) {
						liste[contactID].nom = newVal;
						console.log("Fonction contact modifié !");			
					}
					else
						console.log("Format inavlide");
					break;
				case "telephone" :
					matched = newVal.match(/(\(\+?[0-9]{2,5}\)([0-9]{2,3}|\s)+|[0-9]+)/);	
					if(matched[0] === newVal) {
						liste[contactID].telephone = newVal;
						console.log("Téléphone contact modifié !");			
					}
					else
						console.log("Format inavlide");
					break;
				case "mobile" :
					matched = newVal.match(/(\(\+?[0-9]{2,5}\)([0-9]{2,3}|\s)+|[0-9]+)/);	
					if(matched[0] === newVal) {
						liste[contactID].mobile = newVal;
						console.log("Mobile contact modifié !");			
					}
					else
						console.log("Format inavlide");
					break;
				case "courriel" :
					matched = newVal.match(/[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}/);
					if(matched[0] === newVal) {
						liste[contactID].courriel = newVal;
						console.log("Courriel contact modifié !");			
					}
					else
						console.log("Format inavlide");
					break;		
				default:
					break;
			}

			//Effectuer la modif dans la BD
			// --> effacer tout ce que contient le fichier
			fs.writeFile('database.txt', "", function (err) {
				if (err) throw err;
			});
			// --> réécrire les données à partir du tableau sans les doublons
			for(var i = 0; i < liste.length; i++){
				fs.appendFile('database.txt', liste[i].write(), function (err) {
					if (err) throw err;
				});
			}
		}
	});	
	
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Check les commandes pour lancer les fonctions

var arg = process.argv.slice();

switch(arg[2]){
	case "parse":
		parseVCard();
		break;
	case "display":
		displayContactList();
		break;
	case "clear":
		effacerDoublons();
		break;
	case "modif":
		modifierContact(arg[3], arg[4], arg[5], arg[6]);
		break;
	default:
		console.log("Command not found")
}






