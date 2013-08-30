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

    // Bouton de retour en haut de page
	toggleBacktop();
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


    $('#backtoplink').click(function(){  
        var the_id = $(this).attr("href");  
        $('html, body').animate({  
            scrollTop:$(the_id).offset().top  
        }, 'fast');  
        return false;  
    });  