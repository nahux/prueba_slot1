// URLs
var emoji_json_url = 'https://cdn.jsdelivr.net/npm/emoji-datasource@5.0.1/emoji.json';
var sheet_url = 'img/sheet_twitter_64.png';
var emoji_px_size = 64;
var sheet_size = 1000;
var textarea = document.getElementById("input-emoji");

/**
 * Returns a json stored in a url
 * @param {string} json_url
 */
function getJsonFromUrl(json_url){
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",json_url,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

var categories_order = {
    'Symbols': 8,
    'Activities': 5,
    'Flags': 9,
    'Travel & Places': 6,
    'Food & Drink': 4,
    'Animals & Nature': 3,
    'People & Body': 2,
    'Objects': 7,
    'Smileys & Emotion': 1,
}

var emoji_button = document.getElementById("emoji-picker-button");
var emoji_container = document.getElementById("emoji-picker-container");
emoji_button.addEventListener("click", function() {
    showPicker(emoji_button);
});
setContainerToggleListener();


function showPicker(button) {
    // Check if container exists
    if (emoji_container) {
        emoji_container.style.display = 'block';
        return emoji_container;
    }
    // Get emoji JSON
    var emoji_data = {};
    emoji_data = sortByKey(JSON.parse(getJsonFromUrl(emoji_json_url)), 'sort_order');
        
    // If not setup container in DOM
    emoji_container = createElement("div", "emoji-picker-container");
    emoji_container.id = "emoji-picker-container";
    emoji_container.style.display = 'block';

    // Spinner while loading
    var emoji_spinner = createElement("div", "spinner");
    emoji_spinner.id = "emoji-picker-spinner";
    emoji_spinner.appendChild(createElement("div", "double-bounce1"))
    emoji_spinner.appendChild(createElement("div", "double-bounce2"))
    emoji_container.appendChild(emoji_spinner);

    // Pop up container
    button.parentNode.insertBefore(emoji_container, button);
    
    // Container content
    var emoji_list = createElement("div", "emoji-picker-option-container");

    // Category title
    var current_category = emoji_data[0].category;
    var category_nodes = {arr:[]};
    var category_div = setCategoryTitleNode(current_category, emoji_list, category_nodes);
    for (var i = 0; i < emoji_data.length; i++) {
        // Category check
        if (typeof categories_order[emoji_data[i].category] === 'undefined' ) continue;
        if (current_category != emoji_data[i].category) {
            current_category = emoji_data[i].category;
            category_div = setCategoryTitleNode(current_category, emoji_list, category_nodes);
        }

        // Set emoji
        var emoji = emoji_data[i];
        // Get emoji text
        var emoji_text = emoji.unified;
        var emoji_text_arr = emoji_text.split('-');
        emoji_text = '';
        for (var j = 0; j < emoji_text_arr.length; j++) {
            emoji_text += String.fromCodePoint(parseInt(emoji_text_arr[j], 16));
        }
        // Set emoji option button
        var emoji_option = createElement("button", "emoji-picker-option");
        emoji_option.id = emoji.short_name;
        emoji_option.title = emoji.name;
        emoji_option.style = getCssBackgroundFromSheet(emoji.sheet_x, emoji.sheet_y);
        emoji_option.dataset['unicode'] =  emoji_text;
        emoji_option.onclick = selectEmoji;
        emoji_option.onmouseover = showEmojiPreview(emoji_option);
        emoji_option.onmouseout = hideEmojiPreview;
        category_div.appendChild(emoji_option);
    }
    emoji_spinner.style.display = 'none';
    emoji_container.appendChild(emoji_list);
    // Emoji preview div
    var emoji_preview = createElement("div", "emoji-picker-emoji-preview");
    emoji_preview.id = "emoji-picker-emoji-preview";
    emoji_container.appendChild(emoji_preview);
}


/** 
    * CreateElement helper with classname
    * @returns {HTMLElement}
**/
function createElement(tagName, className)  {
    className = className || 0;
    var element = document.createElement(tagName);
  
    if (className) {
      element.className = className;
    }
  
    return element;
}

/**
    * Set category title node
    * @param {string} name - Category name
    * @param {HTMLElement} container - Emoji list container
    * @param {[HTMLElement]} category_nodes - Html category node array
    * @returns {HTMLElement} The created node
**/
function setCategoryTitleNode(name, container, category_nodes) {
    // Check if it already exists
    var div_node = null;
    for (var i = 0; i < category_nodes.arr.length; i++) {
        if (category_nodes.arr[i].id == 'category_'+name) {
            div_node = category_nodes.arr[i];
        }
    }
    if (div_node) {
        return div_node;
    }
    // Create it otherwise
    div_node = createElement("div", "category_title");
    div_node.id = 'category_'+name;
    div_node.style = '-webkit-order:'+categories_order[name]+';';
    var p_node = createElement("p", "category_title_text");
    p_node.innerHTML = name;
    div_node.appendChild(p_node);
    container.appendChild(div_node);
    category_nodes.arr.push(div_node);
    return div_node;
}

/**
 * Onclick listener to emoji picker button
**/
function setContainerToggleListener() {
    window.onclick = function(event) {
        if (!emoji_container) {
            return;
        }
        if ((event.target != emoji_container && event.target != this.emoji_button)&& emoji_container.style.display != 'none') {
            emoji_container.style.display = "none";
        }
    }
}

/**
 * Show emoji preview
 */
function showEmojiPreview(emoji_option) {
    return function() {
            var emoji_preview = document.getElementById("emoji-picker-emoji-preview");
            emoji_preview.style.display = 'block';
            emoji_preview.innerHTML = emoji_option.title;
            var emoji_preview_button = emoji_option.cloneNode(true);
            emoji_preview.appendChild(emoji_preview_button);
        }
    }
/**
 * Hide emoji preview
 */
function hideEmojiPreview() {
    setTimeout(function(){
        var emoji_preview = document.getElementById("emoji-picker-emoji-preview");
        emoji_preview.style.display = 'none';
        emoji_preview.innerHTML = "";
    }, 5000);
}

/**
    * Calculate position in sheet
    * @param {int} x - X position on the sheet grid
    * @param {int} y - Y position on the sheet grid
    * @returns {string} (css style)
**/
function getCssBackgroundFromSheet(x, y) {
    var finalX = x == 0 ? -1 : -x*(emoji_px_size+2)-1;
    var finalY = y == 0 ? -1 : -y*(emoji_px_size+2)-1;
    return  'background: url('+sheet_url+');' +
            // 'background-size: '+sheet_size+'%;' +
            'width: '+emoji_px_size+'px;' +
            'height: '+emoji_px_size+'px;' +
            'background-position: '+finalX+'px '+finalY+'px;' +
            'zoom: 0.5';
}


/**
 * Onclick function for each emoji
 * @param {HTMLElement} emoji - Emoji butotn html
 */
function selectEmoji() {
    var emoji_unicode = this.getAttribute("data-unicode");
    var emoji_html = twemoji.parse(emoji_unicode, {folder:'svg', ext:'.svg'});
    textarea.innerHTML += emoji_html;
}

/** 
 * Helper to sort emoji json by property
 * @param {Array} array - Emoji data json
 * @params {string} key - array key to use to sort
 * @return {Array} emoji_data - Sorted emoji data
 */
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; 
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
    