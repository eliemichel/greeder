// JS file for Greeder theme
//
// Index :
// =======
// * Parameters
// * Initialization
// * Misc
// * Back to top button
// * Options
// * Lazy loading
// * Internationalization
// * Folders
// * Favorites
// * Read / Unread
// * Feed settings
// * Synchronization
// * Settings page functions

// Note on minification :
// ======================
// When you edit this file, you must run the pre-commit hook in .hook dir to regenerate a minified version of the script.

// ==========
// Parameters
// ==========
// Enable / Disable paginations : true = enabled, false = disabled
var usePagination = false;
// Fix or not the sidebar : true = fixed, false = not fixed
var fixSidebar = false;

// ==============
// Initialization
// ==============

// Mask back to top button if JS is enabled
// (and display it later if needed)
// => This avoids making him blinking fastly
if($('#backtop').length) {
	$('#backtop').hide();
}

$(document).ready(function() {
    // Pagination enabled
    if($.cookie('greederprefPagination') == 1) {
        usePagination = true;
    }
    // Fix sidebar
    if($.cookie('greederprefFixSidebar') == 1) {
        fixSidebar = true;
    }

    // Handle pagination
    if(!usePagination) {
        $('#pagination').remove();
    }

    // Handle position fix for sidebar
    if(fixSidebar) {
        $('aside#sidebar').addClass('fixed');
        $('section.content').addClass('fixed');
    }

    // Back to top button handling
	toggleBacktop();
    
    // Initialize ajaxready at first function load
    if($('.index').length) {
        $(window).data('ajaxready', true);
        $('.content').append('<div id="loader">'+_t('LOADING')+'</div>');
        $(window).data('page', 1);
        $(window).data('nblus', 0);
    }

    if($(window).scrollTop() == 0 && !usePagination)
        scrollInfini(true);

	// Settings page
    // Handle the blocks display for settings page
	if($('.settingsBloc').length) {
		var hash = window.location.hash;
		if(hash.length) {
			toggleBlocks(hash);
		}
	}

    if($('#greederprefBloc').length) {
        $('#greederprefBloc .js-needed').remove();

        // Button to disable pagination
        $('#greederprefBloc button#paginationButton').removeClass('disabled_button').text('Off').addClass('grey');
        if(usePagination) {
            $('#greederprefBloc button#paginationButton').text('On').removeClass('grey').addClass('red');
        }
        else {
            $('#greederprefBloc button#paginationButton').text('Off').removeClass('red').addClass('grey');
        }

        // Button to fix sidebar
        $('#greederprefBloc button#fixSidebarButton').removeClass('disabled_button').text('Off').addClass('grey');
        if(fixSidebar) {
            $('#greederprefBloc button#fixSidebarButton').text('On').removeClass('grey').addClass('red');
        }
        else {
            $('#greederprefBloc button#fixSidebarButton').text('Off').removeClass('red').addClass('grey');
        }
    }
});

$(document).scroll(function() {
    toggleBacktop(); // Back to top button

    if(!usePagination) {
        scrollInfini();
    }
});

// ====
// Misc
// ====
// Parse GET parameters in the URL
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

// ==================
// Back to top button
// ==================
function toggleBacktop() {
	var screen_height = parseInt($(window).height());

	if($(document).scrollTop() >= screen_height / 3) {
		$('#backtop').show();
	}
	else {
		$('#backtop').hide();
	}
}

// ===============================================
// Options : pagination, fixed sidebar
// ===============================================
function togglePagination(element) {
    var state = 1;
    
    if($(element).text() == 'On') { // If off, switch it to on
        state = 0;
    }

    // Store configuration in a cookie
    $.cookie('greederprefPagination', state, {
        expire : 31536000, // expires in one year
    });

    if(state == 1) {
        $(element).addClass('red').removeClass('grey').text('On');
    }
    else {
        $(element).addClass('grey').removeClass('red').text('Off');
    }
}

function toggleFixSidebar(element) {
    var state = 1;
    
    if($(element).text() == 'On') { // If off, switch it to on
        state = 0;
    }

    // Store configuration in a cookie
    $.cookie('greederprefFixSidebar', state, {
        expire : 31536000, // expires in one year
    });

    if(state == 1) {
        $(element).addClass('red').removeClass('grey').text('On');
    }
    else {
        $(element).addClass('grey').removeClass('red').text('Off');
    }
}

// ============
// Lazy loading
// ============

// no_scroll_test is used to force the ajax query without testing if the view has been scrolled
function scrollInfini(no_scroll_test) {
    if (typeof(no_scroll_test)==='undefined') no_scroll_test = false;
    var deviceAgent = navigator.userAgent.toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);

    if($('.index').length) {
        // Test if ajaxready is false, and exit in this case (block multiple calls)
        if ($(window).data('ajaxready') == false)
            return;

        if(($(window).scrollTop() + $(window).height()) + 1 >= $(document).height()
           || agentID && ($(window).scrollTop() + $(window).height()) + 150 > $(document).height() || no_scroll_test)
        {
            // Set ajaxready to false before request sending
            $(window).data('ajaxready', false);
            
            // Display the loader to indicate the loading
            $('.content #loader').show();
            
            // Get vars sent as GET
            var action = getUrlVars()['action'];
            var folder = getUrlVars()['folder'];
            var feed = getUrlVars()['feed'];
            var order = getUrlVars()['order'];
            if (order) {
                order = '&order='+order
            } else {
                order = ''
            }
            
            // Make the ajax request
            $.ajax({
                url: './article.php',
                type: 'post',
                data: 'scroll='+$(window).data('page')+'&nblus='+$(window).data('nblus')+'&hightlighted=1&action='+action+'&folder='+folder+'&feed='+feed+order,
 
                success: function(data) {
                    if (data.replace(/^\s+/g,'').replace(/\s+$/g,'') != '')
                    {
                        // Insert new articles right before the loader
                        $('.content #loader').before(data);
                        // Delete script from page to prevent interaction with next and prev
                        $('.content .scriptaddbutton').remove();
                        // Display events with a fadeIn
                        $('.content article.scroll').fadeIn(600);
                        // Delete scroll tag for next scroll
                        $('.content article.scroll').removeClass('scroll');
                        $(window).data('ajaxready', true);
                        $(window).data('page', $(window).data('page')+1);
                        $(window).data('enCoursScroll',0);
                        // Recursive call until a scroll is detected
                        if($(window).scrollTop() == 0)
                            scrollInfini();
                    }
                    else {
                        $('#load_more').remove();
                    }
                }
            });
            // When loading is finished, remove the loader
            $('.content #loader').fadeOut(400);          
        }
    }
};

// ====================
// Internationalization
// ====================
function _t(key,args){
    value = i18n[key];
    if(args!=null){
        for(i=0;i<args.length;i++){
            value = value.replace('$'+(i+1),args[i]);
        }
    }
    return value;
}

// =======
// Folders
// =======
function toggleFolder(element, folder) {
	feedBloc = $('ul', $(element).parent());

	open = 0;
	if(feedBloc.css('display') == 'none') {
		open = 1;
	}

	feedBloc.slideToggle(200);
	$(element).html((!open ? '►' : '▼'));
	$.ajax({
		url:"./action.php?action=changeFolderState",
		data:{id:folder, isopen:open}
	});
}

// Rename a folder on settings page
function renameFolder(element, folder) {
	var folderLine = $(element).parent().parent();
	var folderNameCase = $('span:first',folderLine);
	var value = folderNameCase.html();

	$(element).html(_t('SAVE'));
	$(element).attr('onclick','saveRenameFolder(this,'+folder+')');
	folderNameCase.replaceWith('<td><input type="text" name="folderName" value="'+value+'"/></td>');
}

// Save the new name for a folder on settings page
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

// =========
// Favorites
// =========
function addFavorite(element, id) {
    var activeScreen = $('#pageTop').html();
    $.ajax({
        url: "./action.php?action=addFavorite",
        data:{id:id},
        success:function(msg){
            if(msg.status == 'noconnect') {
                alert(msg.texte)
            } else {
                $('.favs', $(element).parent().parent()).attr('onclick','removeFavorite(this,'+id+');');
	            $(element).parent().parent().addClass('favorised');
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
                $(element).parent().parent().removeClass('favorised');
                // We count how many articles have been set to favorites on the favorite page (infinite scroll)
                if (activeScreen == 'favorites') {
                    $(window).data('nblus', $(window).data('nblus') + 1);
                    $('#nbarticle').html(parseInt($('#nbarticle').html()) - 1);
                }
            }
        }
    });
}

// =============
// Read / Unread
// =============
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

// =============
// Feed settings
// =============
function renameFeed(element, feed) {
	var feedLine = $(element).parent().parent();
	var feedNameCase = $('td:first a',feedLine);
	var feedNameValue = feedNameCase.html();
	var feedUrlCase = $('td:first span',feedLine);
	var feedUrlValue = $('a', feedUrlCase).html();
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
	feedUrlCase.replaceWith('<span class="underlink"><a href="'+feedUrlValue+'">'+feedUrlValue+'</a></span>');

	$.ajax({
		url: "./action.php?action=renameFeed",
		data:{id:feed,name:feedNameValue,url:feedUrlValue}
	});
}

function changeFeedFolder(element, id) {
	var value = $(element).val();
	window.location = "./action.php?action=changeFeedFolder&feed="+id+"&folder="+value;
}


// ===============
// Synchronization
// ===============
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

// =======================
// Settings page functions
// =======================
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
