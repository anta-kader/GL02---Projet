Projet GL02 - Equipe Les Jambon-Beurre
Xuefei DONG
Théo DUVAL
Salah Eddine HSINA
Anta-Kader KONFROU
Valérie SCHNEIDER

Présentation 
Ce projet a été réalisé à la demande de la société ClearWater afin de lui permettre une meilleure gestion de ses contacts clients. 
Nous vous proposons ici une librairie écrite en JavaScript permettant les manipulations des fichier vCard.

Pré-requis 
Cette libraire nécéssite l'installation de Node.js, un interpréteur javascript pour exécuter du code localement.
Pour l’installer sur vos machines personnelles, rendez-vous sur : https://nodejs.org/en/download/

Modifications apportées 
Nous avons pris l'initiative d'apporter quelques modifications aux spécifications fournies par l'équipe MOA
- Le format de données du téléphone et du mobile n'est pas 10DIGIT mais *(DIGIT / "+" / "(" / ")" / WSP) afin de pouvoir accepeter les numéros avec indicatifs ou avec espaces.
- Concernant la fusion des contacts identique, on procède comme suit : deux contacts sont considérés comme identiques quand leur nom et prénom sont strictement identiques. Concernant les informations associées, on récupère à chaque fois l'information renseignée en priorité d'un champ vide. Dans le cas ou le champ est rempli dans les deux fiches, on choisi le champ du contact le plus récent. 


Mode d'emploi :

- Pour importer un nouveau contact (à partir d'un fichier vCard)
	node vCardParser.js parse 
Si le contact à ajouter est déjà présent dans la base de données il y a possibilité de le remplacer, le fusionner ou l'ajouter tout de même.

- Pour afficher la liste de tous les contacts
	node vCardParser.js display

- Pour afficher le nombre de contacts dans la base de données
	node vCardParser.js total

- Pour afficher un contact
	node vCardParser.js find nom prenom
nom --> nom du contact
prenom --> prenom du contact
Si il existe plusieurs contacts avec le même nom, la méthode n'affichera que le premier qui a été ajouté dans la base de données

- Pour vérifier si un contact est dans la base de donnée
	node vCardParser.js check nom prenom
nom --> nom du contact
prenom --> prenom du contact

- Pour modifier un contact
	node vCardParser.js modif nom prenom propriete nouvelleValeur
nom --> nom du contact
prenom --> prenom du contact
propriete --> propriété du contact à modifier (nom, prenom, organisation, fonction, telephone, mobile ou courriel)
nouvelleValeur --> nouvelle valeur de la propriété 

- Pour effacer les doublons (lorsque toutes les propriété du contacts sont les mêmes)
	node vCardParser.js clear

- Pour exporter la liste des contacts en format CSV
	node vCardParser.js export