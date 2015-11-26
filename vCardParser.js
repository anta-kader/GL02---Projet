/** Récupérer url du fichier à importer
* var fileToParse = prompt("Insérer le lien du fichier à importer");
* prompt ne fonctionne pas avec Node.js car la fonction ne peut pas être appelé coté serveur (comme avec Node.Js) 
* mais seulement coté client (tel qu'un navigateur web)
* solution --> http://stackoverflow.com/questions/24291909/prompt-not-defined-using-node-from-command-line
**/

console.log("Veuillez insérer l'url du fichier à importer");
process.stdin.setEncoding('utf8');
var fileToParse;
process.stdin.on('readable', function() {
    fileToParse = process.stdin.read();
});


var fs = require("fs");

fs.readFile(fileToParse, 'utf8', function (err,data) {
	if (err) {
		return console.log(err)
 	}
	/*insert code to get data*/
});
