// Activer/Désactiver les animations : true = activées, false = désactivées
var useAnimations = true;

// Cacher le bouton de retour en haut de page si JS est activé 
// (et le réafficher ultérieurement si besoin) 
// => évite de le faire apparaître / disparaître rapidement
if($('#backtop').length) {
	$('#backtop').hide();
}

$(document).ready(function() {
	// Page settings
	if($('.settingsBloc').length) {
		var hash = window.location.hash;
		if(hash.length) {
			toggleBlocks(hash);
		}
	}

    if($.cookie('greederprefAnimations') == 0) { // Animations désactivées
        useAnimations = false;
    }

    // Page préférences de greeder
    if($('#greederprefBloc').length) {
        $('#greederprefBloc button').removeClass('disabled_button');
        $('#greederprefBloc .js-needed').remove();

        if(!useAnimations) { // Animations désactivées
            $('#greederprefBloc button').text('Off').removeClass('red').addClass('grey');
        }
        else {
            $('#greederprefBloc button').text('On').removeClass('grey').addClass('red');
        }
    }

    // Bouton de retour en haut de page
	toggleBacktop();

    // Désactiver les animations au besoin
    if(!useAnimations) {
        $('body').addClass('no-animations');
    }
});

$(document).scroll(toggleBacktop);

// Fonctions liées aux boutons de navigation (lire / favori / etc.)
function toggleFolder(element, folder) {
	feedBloc = $('ul', $(element).parent());

	open = 0;
	if(feedBloc.css('display') == 'none') {
		open = 1;
	}

	feedBloc.slideToggle(200);
	$(element).html((!open ? '+' : '-'));
	$.ajax({
		url:"./action.php?action=changeFolderState",
		data:{id:folder, isopen:open}
	});
}

function addFavorite(element, id) {
	$('.favs', $(element).parent().parent()).attr('onclick','removeFavorite(this,'+id+');');
	$(element).parent().parent().addClass('favorised');
	$.ajax({
		url: "./action.php?action=addFavorite",
		data:{id:id}
	});
}

function removeFavorite(element, id) {
	$('.favs', $(element).parent().parent()).attr('onclick','addFavorite(this,'+id+');');
	$(element).parent().parent().removeClass('favorised');
	$.ajax({
		url: "./action.php?action=removeFavorite",
		data:{id:id}
	});
}

function renameFolder(element, folder) {
	var folderLine = $(element).parent().parent();
	var folderNameCase = $('span:first',folderLine);
	var value = folderNameCase.html();

	$(element).html('Enregistrer');
	$(element).attr('onclick','saveRenameFolder(this,'+folder+')');
	folderNameCase.replaceWith('<td><input type="text" name="folderName" value="'+value+'"/></td>');
}


function saveRenameFolder(element, folder) {
	var folderLine = $(element).parent().parent();
	var folderNameCase = $('td:first',folderLine);
	var value = $('input',folderNameCase).val();

	$(element).html('Renommer');
	$(element).attr('onclick','renameFolder(this,'+folder+')');
	folderNameCase.replaceWith('<h1>'+value+'</h1>');

	$.ajax({
		url: "./action.php?action=renameFolder",
		data:{id:folder,name:value}
	});
}

function renameFeed(element, feed) {
	var feedLine = $(element).parent().parent();
	var feedNameCase = $('td:first a',feedLine);
	var feedNameValue = feedNameCase.html();
	var feedUrlCase = $('td:first span',feedLine);
	var feedUrlValue = feedUrlCase.html();
	var url = feedNameCase.attr('href');

	$(element).html('Enregistrer');
	$(element).attr('onclick','saveRenameFeed(this,'+feed+',"'+url+'")');
	feedNameCase.replaceWith('<input type="text" name="feedName" value="'+feedNameValue+'" size="25" />');
	feedUrlCase.replaceWith('<input type="text" name="feedUrl" value="'+feedUrlValue+'" size="25" />');
}

function saveRenameFeed(element, feed, url) {
	var feedLine = $(element).parent().parent();
	var feedNameCase = $('td:first input[name="feedName"]',feedLine);
	var feedNameValue = feedNameCase.val();
	var feedUrlCase = $('td:first input[name="feedUrl"]',feedLine);
	var feedUrlValue = feedUrlCase.val();

	$(element).html('Renommer');
	$(element).attr('onclick','renameFeed(this,'+feed+')');
	feedNameCase.replaceWith('<a href="'+url+'">'+feedNameValue+'</a>');
	feedUrlCase.replaceWith('<span class="underlink">'+feedUrlValue+'</span>');

	$.ajax({
		url: "./action.php?action=renameFeed",
		data:{id:feed,name:feedNameValue,url:feedUrlValue}
	});
}

function changeFeedFolder(element, id) {
	var value = $(element).val();
	window.location = "./action.php?action=changeFeedFolder&feed="+id+"&folder="+value;
}

function readThis(element, id, from, callback) {
    if(typeof(callback) === 'undefined') callback = false;

	var hide = ($('#pageTop').html() == '' ? true : false);
	var parent = $(element).parent().parent();
	var nextEvent = $('#'+id).next();

	if(!parent.hasClass('eventRead')) {
		if(hide) { 
			parent.addClass('eventRead');
			parent.fadeOut(200, function() {
				if(callback) {
					callback();
				}
			});
			parent.fadeOut(200); 
		}
		else { 
			parent.addClass('eventRead');
            
            if(callback) {
                callback();
            }
		}

		$.ajax({
			url: "./action.php?action=readContent",
			data:{id:id},
			success:function(msg) {
				if(msg != "") {
					alert('Erreur de lecture : '+msg);
				}
			}
		});
	}
	else {
		if(from != 'title') {
			parent.removeClass('eventRead');
			$.ajax({
				url: "./action.php?action=unreadContent",
				data:{id:id},
				success:function(msg) {
					if(msg != "") {
						alert('Erreur de lecture :'+msg);
					}
				}
			});

            if(callback) {
                callback();
            }
		}
	}
}

// Synchronisation manuelle lancée depuis le bouton du menu
function synchronize(code, callback) {
	if(code != '') {
		$('.content').html('<article class="article">'+
				'<iframe class="importFrame" src="action.php?action=synchronize&amp;format=html&amp;code='+code+'" name="idFrameSynchro" id="idFrameSynchro" height="400"></iframe>'+
				'</article>');

        if(typeof(callback) === 'undefined') callback = false;

        if(callback) {
            $('iframe#idFrameSynchro').load(function () {
                callback();
            });
        }
	}
	else {
		alert('Vous devez être connecté pour synchroniser vos flux');
	}
}

// Disparition block et affichage block clique
function toggleBlocks(target) {
	if($(target).length) {
		$('#main section, #main article').hide();
		$('#main '+target+', #main '+target+' article').fadeToggle(200, function() {
			window.location.hash = target;
		});
	}
	else {
		window.location.hash = "";
	}
}

//Gestion de l'affichage du bouton de retour en haut de page
function toggleBacktop() {
	var screen_height = parseInt($(window).height());

	if($(document).scrollTop() >= screen_height / 3) {
		$('#backtop').show();
	}
	else {
		$('#backtop').hide();
	}
}

// Fonction pour le bouton de gestion des animations
function toggleAnimations(element) {
    var state = 0;
    
    if($(element).text() == 'Off') { // Si off, on passe à on
        state = 1;
    }

    // Stocke la config dans un cookie
    $.cookie('greederprefAnimations', state, {
        expire : 31536000, // expire dans un an
    });

    if(state == 1) {
        $(element).addClass('red').removeClass('grey').text('On');
    }
    else {
        $(element).addClass('grey').removeClass('red').text('Off');
    }
}

$(window).scroll(function(){
	scrollInfini();
});

function scrollInfini() {
	var deviceAgent = navigator.userAgent.toLowerCase();
	var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);

	if($('.index').length) {
		// On teste si ajaxready vaut false, auquel cas on stoppe la fonction
		if ($(window).data('ajaxready') == false) return;

		if(($(window).scrollTop() + $(window).height()) + 1 >= $(document).height()
		   || agentID && ($(window).scrollTop() + $(window).height()) + 150 > $(document).height())
		{
			// lorsqu'on commence un traitement, on met ajaxready à false
			$(window).data('ajaxready', false);
 			
 			//j'affiche mon loader pour indiquer le chargement
			$('article #loader').show();
			
			//utilisé pour l'alternance des couleurs d'un article à l'autre
			if ($('article section:last').hasClass('eventHightLighted')) {
				hightlighted = 1;
			} else {
				hightlighted = 2;
			}
			
			// récupération des variables passées en Get
			var action = getUrlVars()['action'];
			var folder = getUrlVars()['folder'];
			var feed = getUrlVars()['feed'];
			var order = getUrlVars()['order'];
			if (order) {
				order = '&order='+order
			} else {
				order = ''
			}
			
			$.ajax({
				url: './article.php',
				type: 'post',
				data: 'scroll='+$(window).data('page')+'&nblus='+$(window).data('nblus')+'&hightlighted='+hightlighted+'&action='+action+'&folder='+folder+'&feed='+feed+order,
 
				//Succès de la requête
				success: function(data) {
					if (data.replace(/^\s+/g,'').replace(/\s+$/g,'') != '')
					{	// on les insère juste avant le loader
						$('article #loader').before(data);
						//on supprime de la page le script pour ne pas intéragir avec les next & prev
						$('article .scriptaddbutton').remove();
						//si l'élement courant est caché, selectionner le premier élément du scroll
						if ($('article section.eventSelected').attr('style')=='display: none;') {
							targetThisEvent($('article section.scroll:first'), true);
						}
						// on les affiche avec un fadeIn
						$('article section.scroll').fadeIn(600);
						// on supprime le tag de classe pour le prochain scroll
						$('article section.scroll').removeClass('scroll');
						$(window).data('ajaxready', true);
						$(window).data('page', $(window).data('page')+1);
						$(window).data('enCoursScroll',0);
						// appel récursif tant qu'un scroll n'est pas detecté.
						if ($(window).scrollTop()==0) scrollInfini();
					}
 				}
			});
			// le chargement est terminé, on fait disparaitre notre loader
			$('article #loader').fadeOut(400);			
		}
	}
};

/* Fonctions de séléctions */
/* Cette fonction sera utilisé pour le scrool infinie, afin d'ajouter les évènements necessaires */
function addEventsButtonLuNonLus(){
	var handler = function(event){
			var target = event.target;
			var id = this.id;
			if($(target).hasClass('readUnreadButton')){
				buttonAction(target,id);
			}else{
				targetThisEvent(this);
			}
	}
	// on vire tous les évènements afin de ne pas avoir des doublons d'évènements
	$('article section').unbind('click');
	// on bind proprement les click sur chaque section
	$('article section').bind('click', handler);
}