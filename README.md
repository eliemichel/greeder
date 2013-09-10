Greeder
======

Greeder est un thème pour le logiciel de lecture de flux RSS <a href="https://github.com/ldleman/Leed">Leed</a>.

L’interface de Greeder est inspirée de feu Google Reader, le but de ce thème est de permettre une transition en douceur vers une solution libre et respectueuse de votre vie privée pour lire vos flux RSS. C'est également un thème sobre et élégant qui propose quelques fonctionnalités non disponibles sur le thème Marigolds de Leed (notamment le choix des raccourcis claviers dans Leed, voir le dépôt des plugins pour plus d'informations). 

Le thème est responsive, vous pourrez donc l’utiliser pour lire sur votre ordinateur, tablette, smartphone sans problème : l’interface fluide s’adaptera à vos différents formats d’écran.

Un aperçu du thème est disponible sur <a href="http://projets.tomcanac.com/demo-greeder/">cette instance de démonstration</a>.

# Fonctionnalités

* Thème minimal, léger. Fonctionnalités avancées disponibles _via_ plugin.
* Fonctionnalités tactiles (swipe to read, ...) disponibles _via_ un plugin.
* Gestion avancée des raccourcis claviers ( _via_ plugin). Possibilité de configurer les raccourcis claviers.

# Installation

Comme n'importe quel thème pour Leed, Greeder s'installe très facilement.

<ol>
	<li>Installez Leed sur votre serveur web en suivant les instructions d'installation de Leed.</li>
    <li>Téléchargez <a href="https://github.com/tmos/greeder/archive/master.zip">la dernière version archivée du thème Greeder</a> ou clonez le dépôt Git. Décompressez l'archive et mettez tout son contenu dans le dossier _templates/_ de votre installation de Leed.
    <li>Renommez le dossier _greeder-master_ de l'archive en _greeder_.</li>
   	<li>Éditez le fichier _constant.php_ à la racine de votre installation de Leed. Modifiez la ligne :<br/>
        <code>define('DEFAULT_THEME','marigolds');</code><br/>
    	en<br/>
        <code>define('DEFAULT_THEME','greeder');</code><br/>
        pour utiliser Greeder. Pour retourner sur le thème marigolds par défaut de Leed, il suffit de remettre la ligne dans son état d'origine.</li>
     <li>Vous êtes désormais un utilisateur de Greeder !</li>
</ol>

# Informations de personnalisation

Il est possible de désactiver globalement les animations en javascript utilisées par greeder et les plugins. Ce comportement est réglable dans les préférences du thème (préférences de Leed => menu préférences de greeder).

# Informations utiles

* Site du logiciel Leed : http://projet.idleman.fr/leed
* GitHub de Leed : https://github.com/ldleman/Leed
* Site du thème Greeder : http://tomcanac.com/greeder/
* Démo de Greeder : http://projets.tomcanac.com/demo-greeder/
* Dépôt des plugins spécifiques pour greeder : https://github.com/tmos/greeder-plugins

Greeder est un thème initié et développé par Tom Canac (@tmos, http://tomcanac.com).<br/>
Leed est développé par Idleman (@Idleman, http://idleman.fr/)

# Remerciements

Merci aux contributeurs suivants :

* Simon (http://progmatique.fr)
* Phyks (@Phyks, http://phyks.me)

# Informations pour les développeurs de plugins

L'utilisateur a la possiblité de désactiver les animations en javascript (comme celles proposées dans le plugin touchGreeder par exemple) afin d'avoir une navigation plus fluide sur des équipements avec des ressources limitées. Dans ce cas, une classe "no-animations" est ajoutée sur la balise &lt;body&gt;. Il est recommandé de tester la présence de cette classe dans les plugins pour Greeder proposant des animations afin de respecter les possiblités offertes par Greeder à ses utilisateurs.
