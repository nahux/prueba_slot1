// URLs
var emoji_json_url = 'https://cdn.jsdelivr.net/npm/emoji-datasource@5.0.1/emoji.json';
var sheet_url = 'img/twitter_64.png';
var emoji_px_size = 64;
var sheet_size = 1000;

// Get emoji JSON
var emoji_data = {};
$.getJSON(emoji_json_url, function(result){
    emoji_data = result;
});

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
    
    // If not setup container in DOM
    emoji_container = createElement("div", "emoji-picker-container");
    emoji_container.id = "emoji-picker-container";
    emoji_container.style.display = 'block';
    
    // Container content
    var emoji_list = createElement("div", "emoji-picker-option-container");

    // Category title
    var current_category = emoji_data[0].category;
    var category_nodes = {arr:[]};
    var category_div = setCategoryTitleNode(current_category, emoji_list, category_nodes);
    for (var i = 0; i < emoji_data.length; i++) {
        // Category check
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
        emoji_option.style = getCssBackgroundFromSheet(emoji.sheet_x, emoji.sheet_y);
        category_div.appendChild(emoji_option);
    }
    emoji_container.appendChild(emoji_list);

    // Pop up container
    button.parentNode.insertBefore(emoji_container, button);
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
    var div_node = category_nodes.arr.find(div => div.id === 'category_'+name);
    if (div_node) {
        return div_node;
    }
    // Create it otherwise
    div_node = createElement("div", "category_title");
    div_node.id = 'category_'+name;
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
    * Calculate position in sheet
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