Greeder
======

Greeder est un thème pour le logiciel de lecture de flux RSS <a href="https://github.com/ldleman/Leed">Leed</a>.

L’interface de Greeder est inspirée de feu Google Reader, le but de ce thème est de permettre une transition en douceur vers une solution libre et respectueuse de votre vie privée pour lire vos flux RSS. C'est également un thème sobre et élégant qui propose quelques fonctionnalités non disponibles sur le thème Marigolds de Leed (Choix des raccourcis claviers dans Leed, actions tactiles avancées, ... ). 

Le thème est responsive, vous pourrez donc l’utiliser pour lire sur votre ordinateur, tablette, smartphone sans problème : l’interface fluide s’adaptera à vos différents formats d’écran.

![Version ordinateur](https://raw.githubusercontent.com/tmos/greeder/dev/doc/screenshot_desktop)

![Version téléphone](https://raw.githubusercontent.com/tmos/greeder/dev/doc/screenshot_phone)

Un aperçu du thème est disponible sur <a href="http://projets.tomcanac.com/demo/greeder/">cette instance de démonstration</a>.

## Fonctionnalités

* Thème minimal et léger.
* Fonctionnalités tactiles (swipe to read, ...) disponibles _via_ un plugin.
* Gestion avancée des raccourcis claviers ( _via_ plugin). Possibilité de configurer les raccourcis claviers.

## Installation

Comme n'importe quel thème pour Leed, Greeder s'installe très facilement.

<ol>
	<li>Installez Leed sur votre serveur web en suivant les instructions d'installation de Leed.</li>
    <li>Si vous utilisez la version "dev" de Leed, téléchargez <a href="https://github.com/tmos/greeder/archive/master.zip">la dernière version archivée du thème Greeder</a> ou clonez le dépôt Git. <br/>
    Si vous utilisez la version stable de Leed, nous vous invitons à aller voir du côté des branches de Greeder. Elles sont sous la forme suivante : "greeder_année.mois_N°commitLeed" et correspondent aux principales versions stables de Leed. <br/>
    Décompressez l'archive choisie et mettez tout son contenu dans le dossier _templates/_ de votre installation de Leed.
    <li>Renommez le dossier _greeder-master_ de l'archive en _greeder_.</li>
   	<li>Éditez le fichier _constant.php_ à la racine de votre installation de Leed. Modifiez la ligne :<br/>
        <code>define('DEFAULT_THEME','marigolds');</code><br/>
    	en<br/>
        <code>define('DEFAULT_THEME','greeder');</code><br/>
        pour utiliser Greeder. Pour retourner sur le thème marigolds par défaut de Leed, il suffit de remettre la ligne dans son état d'origine.</li>
     <li>Vous êtes désormais un utilisateur de Greeder !</li>
</ol>

## Information sur la minification, pour les développeurs

Un makefile est fourni pour minifier automatiquement les fichiers css et js du thème. Pour l'utiliser, vous devez placer le fichier yuicompressor contenant le programme de minification à la racine du dossier.

Pour se faire :
<ol>
    <li>Récupérer yuicompressor ici : https://github.com/yui/yuicompressor/releases/download/v2.4.8/yuicompressor-2.4.8.jar</li>
    <li>Placer le fichier récupéré (sans le renommer) à la racine du dossier</li>
    <li>Vous pouvez désormais lancer la commande "make" à la racine du dossier de greeder pour minifier le CSS et le JS.
</ol>

Après minification, un fichier css/css.min.css et un fichier js/js.min.js seront générés, contenant tout le code nécessaire. Ces fichiers étant ceux utilisés par Greeder, il faut lancer "make" après chaque modification des fichiers non minifiés.

Après chaque modification, les fichiers minifiés doivent être régénérés pour qu'ils soient toujours commités dans le même état que les autres fichiers, non minifiés. Ceci peut se faire aisément avec un hook git si vous le souhaitez.

Pour forcer la minification à nouveau, supprimer les fichiers css/css.min.css et js/js.min.js et relancer "make".

## Informations utiles

* Site du logiciel Leed : http://projet.idleman.fr/leed
* GitHub de Leed : https://github.com/ldleman/Leed
* Site du thème Greeder : http://tomcanac.com/greeder/
* Démo de Greeder : http://projets.tomcanac.com/demo/greeder/
* Dépôt des plugins spécifiques pour greeder : https://github.com/tmos/greeder-plugins

Greeder est un thème initié et développé par Tom Canac (@tmos, http://tomcanac.com).<br/>
Leed est développé par Idleman (@Idleman, http://idleman.fr/)

## Remerciements

Merci aux contributeurs suivants :

* Phyks ([Github page](https://github.com/phyks/), [Website](http://phyks.me))
* Simon (http://progmatique.fr)
