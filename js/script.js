// Enable / Disable animations : true = enabled, false = disabled
var useAnimations = true;

// Mask back to top button if JS is enabled
// (and display it later if needed)
// => This avoides making him blinking fastly
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

    if($.cookie('greederprefAnimations') == 0) { // Animations disabled
        useAnimations = false;
    }

    // Greeder settings page
    if($('#greederprefBloc').length) {
        $('#greederprefBloc button').removeClass('disabled_button');
        $('#greederprefBloc .js-needed').remove();

        if(!useAnimations) { // Animations disabled
            $('#greederprefBloc button').text('Off').removeClass('red').addClass('grey');
        }
        else {
            $('#greederprefBloc button').text('On').removeClass('grey').addClass('red');
        }
    }

    // Back to top button handling
	toggleBacktop();
    
    // Bind events to onclick on articles
    addEventsButtonLuNonLus();
        
    // Initialize ajaxready at first function load
    $(window).data('ajaxready', true);
    $('article').append('<div id="loader">'+_t('LOADING')+'</div>');
    $(window).data('page', 1);
    $(window).data('nblus', 0);

    if ($(window).scrollTop()==0) scrollInfini();

    // Disable animations if needed
    if(!useAnimations) {
        $('body').addClass('no-animations');
    }
});

$(document).scroll(toggleBacktop);

// ==== TODO : Infinite scroll
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
                    {   // on les insère juste avant le loader
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

//====

// Internationalization
function _t(key,args){
    value = i18n[key];
    if(args!=null){
        for(i=0;i<args.length;i++){
            value = value.replace('$'+(i+1),args[i]);
        }
    }
    return value;
}

// Functions to handle browsing buttons (read / favorite / ...)
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
    var activeScreen = $('#pageTop').html();
	$('.favs', $(element).parent().parent()).attr('onclick','removeFavorite(this,'+id+');');
	$(element).parent().parent().addClass('favorised');
    $.ajax({
        url: "./action.php?action=addFavorite",
        data:{id:id},
        success:function(msg){
            if(msg.status == 'noconnect') {
                alert(msg.texte)
            } else {
                $('.favs', $(element).parent().parent()).attr('onclick','removeFavorite(this,'+id+');');
                // We count how many articles have been set to favorites on the favorite page (infinite scroll)
                if (activeScreen == 'favorites') {
                    $(window).data('nblus', $(window).data('nblus') - 1);
                    $('#nbarticle').html(parseInt($('#nbarticle').html()) + 1);
                }
            }
        }
    });
}

function removeFavorite(element, id) {
    var activeScreen = $('#pageTop').html();
    $.ajax({
        url: "./action.php?action=removeFavorite",
        data:{id:id},
        success:function(msg){
            if(msg.status == 'noconnect') {
                alert(msg.texte)
            } else {
                $('.favs', $(element).parent().parent()).attr('onclick','addFavorite(this,'+id+');');
                // We count how many articles have been set to favorites on the favorite page (infinite scroll)
                if (activeScreen == 'favorites') {
                    $(window).data('nblus', $(window).data('nblus') + 1);
                    $('#nbarticle').html(parseInt($('#nbarticle').html()) - 1);
                }
            }
        }
    });
}

function renameFolder(element, folder) {
	var folderLine = $(element).parent().parent();
	var folderNameCase = $('span:first',folderLine);
	var value = folderNameCase.html();

	$(element).html(_t('SAVE'));
	$(element).attr('onclick','saveRenameFolder(this,'+folder+')');
	folderNameCase.replaceWith('<td><input type="text" name="folderName" value="'+value+'"/></td>');
}


function saveRenameFolder(element, folder) {
	var folderLine = $(element).parent().parent();
	var folderNameCase = $('td:first',folderLine);
	var value = $('input',folderNameCase).val();

	$(element).html(_t('RENAME'));
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

	$(element).html(_t('SAVE'));
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

	$(element).html(_t('RENAME'));
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

    var activeScreen = $('#pageTop').html();
	var parent = $(element).parent().parent();
	var nextEvent = $('#'+id).next();

    // On unread events
	if(!parent.hasClass('eventRead')) {
        $.ajax({
            url: "./action.php?action=readContent",
            data:{id:id},
            success:function(msg){
                if(msg.status == 'noconnect') {
                    alert(msg.texte)
                } else {
                    switch (activeScreen){ 
                        case '':
                            // Index page
                            parent.addClass('eventRead');
                            parent.fadeOut(200,function(){
                                if(callback){
                                    callback();
                                }
                                // Simulate a scroll if all events are masked
                                if($('article section:last').attr('style') == 'display: none;') {
                                    $(window).scrollTop($(document).height());
                                }
                            }); 
                            // We count how many articles have been read to substract them to the infinite scroll query
                            $(window).data('nblus', $(window).data('nblus')+1);
                            // Diminish the number of article on top of the page
                            $('#nbarticle').html(parseInt($('#nbarticle').html()) - 1)
                            break;
                        case 'selectedFolder':
                            parent.addClass('eventRead');
                            // We count how many articles have been read to substract them to the infinite scroll query
                            $(window).data('nblus', $(window).data('nblus')+1);
                            break;
                        default:
                            // Any other case : favorites, selectedFeed, ...
                            parent.addClass('eventRead');
                            break;
                    }
                }
            }
        });
	}
    // On read events
	else {
        // If not a click on event title
        if(from!='title'){
            $.ajax({
                url: "./action.php?action=unreadContent",
                data:{id:id},
                success:function(msg){
                    if(msg.status == 'noconnect') {
                        alert(msg.texte)
                    } else {
                        parent.removeClass('eventRead');
                        // Count how many articles have been set to unread
                        if ( (activeScreen=='') || (activeScreen=='selectedFolder') ) $(window).data('nblus', $(window).data('nblus') - 1);
                    }
                }
            });
        }
	}
}

// Manually synchronize feeds, from the menu button
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
		alert(_t('YOU_MUST_BE_CONNECTED_FEED'));
	}
}

// Mask and display blocks in settings
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

// Handles display pf the back to top button
function toggleBacktop() {
	var screen_height = parseInt($(window).height());

	if($(document).scrollTop() >= screen_height / 3) {
		$('#backtop').show();
	}
	else {
		$('#backtop').hide();
	}
}

// Handles button to manage animations status
function toggleAnimations(element) {
    var state = 0;
    
    if($(element).text() == 'Off') { // If off, switch it to on
        state = 1;
    }

    // Store configuration in a cookie
    $.cookie('greederprefAnimations', state, {
        expire : 31536000, // expires in one year
    });

    if(state == 1) {
        $(element).addClass('red').removeClass('grey').text('On');
    }
    else {
        $(element).addClass('grey').removeClass('red').text('Off');
    }
}

// Get GET parameteres in URL and parse them
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        if (hash[1]){
            rehash = hash[1].split('#');
            vars[hash[0]] = rehash[0];
        }
        else {
            vars[hash[0]] = '';
        }
    }
    return vars;
}
