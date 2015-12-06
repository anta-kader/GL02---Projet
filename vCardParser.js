/** Récupérer url du fichier à importer
* var fileToParse = prompt("Insérer le lien du fichier à importer");
* prompt ne fonctionne pas avec Node.js car la fonction ne peut pas être appelé coté serveur (comme avec Node.Js) 
* mais seulement coté client (tel qu'un navigateur web)
* solution --> http://stackoverflow.com/questions/24291909/prompt-not-defined-using-node-from-command-line
* 
* Utiliser rl.question ? 
* ici > https://nodejs.org/api/readline.html#readline_rl_question_query_callback
* 
**/

/* Pour ne pas avoir écire à chaque fois qu'on test
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
	
	});

	rl.close();
}); */


var fs = require("fs");

	fs.readFile("JohnDoe.vcf", 'utf8', function (err,data) {
		if (err) {
			return console.log("Fichier noo")
	 	}
		analyzer = new vCardParser();
		var input = analyzer.tokenize(data);
		var dataTab = analyzer.getData(input);
		analyzer.parse(dataTab);
		console.log(analyzer.contact);
	
	});


//Contact --> construct a new Contact
var Contact = function(nom, prenom, organisation, fonction, courriel, telephone, mobile){
	this.nom = nom;
	this.prenom = prenom;
	this.organisation = organisation;
	this.fonction = fonction;
	this.courriel = courriel;
	this.telephone = telephone;
	this.mobile = mobile;
}


//vCardParser
var vCardParser = function(){
	//the contact get from the vCard file
	this.contact;
	this.symb = ["BEGIN:VCARD", "FN", "ORG", "TITLE", "EMAIL;PREF;INTERNET", "EMAIL;INTERNET", "TEL;HOME;VOICE", "TEL;CELL;VOICE", "END:VCARD"];
}

//Parser procedure

// Stops the parsing process when called and print error message
vCardParser.prototype.err = function(msg){
	console.log("Parsing Error ! -- msg : "+msg);
	process.exit(0);
}

// tokenize : tranform the data input into a list
vCardParser.prototype.tokenize = function(data){
	//return data.split(/(\r\n|: )/);
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

vCardParser.prototype.parse = function(dataTab) {
	var id = this.identite(dataTab);
	this.contact = 
		new Contact(id[1], id[0], 
					this.organisation(dataTab), 
					this.fonction(dataTab), 
					this.courriel(dataTab), 
					this.telephone(dataTab), 
					this.mobile(dataTab)
	);
}



//Il faut vérifier chaque propriété pour voir si son format est conforme à celui donné dans le cahier des charges...

