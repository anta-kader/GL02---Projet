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
