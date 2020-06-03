// URLs
// var emoji_json_url = 'https://cdn.jsdelivr.net/npm/emoji-datasource@5.0.1/emoji.json';
// var sheet_url = 'img/sheet_twitter_64.png';
// var emoji_px_size = 64;
// var textarea = document.getElementById("input-emoji");
// Set language 
// var lang = navigator.language || navigator.userLanguage; 
var lang = "es"; 

var EmojiPicker = {
    // Properties
    emoji_button: null,
    textarea: null,
    emoji_container: null,
    emoji_json_url: 'https://cdn.jsdelivr.net/npm/emoji-datasource@5.0.1/emoji.json',
    sheet_url: 'img/sheet_twitter_64.png',
    emoji_px_size: 64,
    lang: "es",
    categories_names: {
        en: {
            'Symbols': 'Symbols',
            'Activities': 'Activities',
            'Flags': 'Flags',
            'Travel & Places': 'Travel & Places',
            'Food & Drink': 'Food & Drink',
            'Animals & Nature': 'Animals & Nature',
            'People & Body': 'People & Body',
            'Objects': 'Objects',
            'Smileys & Emotion': 'Smileys & Emotion',
        },
        es: {
            'Symbols': 'Símbolos',
            'Activities': 'Actividades',
            'Flags': 'Banderas',
            'Travel & Places': 'Viajes y Lugares',
            'Food & Drink': 'Comidas y Bebidas',
            'Animals & Nature': 'Animales y Naturaleza',
            'People & Body': 'Personas y Cuerpo',
            'Objects': 'Objetos',
            'Smileys & Emotion': 'Emojis',
        }        
    },
    categories_order: {
        'Symbols': 8,
        'Activities': 5,
        'Flags': 9,
        'Travel & Places': 6,
        'Food & Drink': 4,
        'Animals & Nature': 3,
        'People & Body': 2,
        'Objects': 7,
        'Smileys & Emotion': 1,
    },

    /**
     * Initialize the EmojiPicker
     * @param {string} emoji_picker_button - id for the button that triggers the picker 
     * @param {string} sheet - (apple, twitter, android, google) 
     * @param {string} text_input - id for the text input that emojis will be rendered at
     */
    init: function(emoji_picker_button, sheet, text_input) {
        this.emoji_button = document.getElementById(emoji_picker_button);
        this.textarea = document.getElementById(text_input);
        var _this = this; // Copy of the context to use it in the listener
        this.emoji_button.addEventListener("click", function() {
            _this.showPicker(_this.emoji_button);
        });
    },

    /**
     * Show the emoji picker and initialize all data needed
     * @param {HtmlElement} button -  button that triggers the picker 
     */
    showPicker: function(button) {
        // Check if container exists
        if (this.emoji_container) {
            this.emoji_container.style.display = 'block';
            return this.emoji_container;
        }
        
        // Get emoji JSON
        var emoji_data = {};
        emoji_data = sortByKey(JSON.parse(getJsonFromUrl(this.emoji_json_url)), 'sort_order');
            
        // If not setup container in DOM
        this.emoji_container = createElement("div", "emoji-picker-container");
        this.emoji_container.id = "emoji-picker-container";
        this.emoji_container.style.display = 'block';
        this.setContainerToggleListener();

        // Spinner while loading
        var emoji_spinner = createElement("div", "spinner");
        emoji_spinner.id = "emoji-picker-spinner";
        emoji_spinner.appendChild(createElement("div", "double-bounce1"))
        emoji_spinner.appendChild(createElement("div", "double-bounce2"))
        this.emoji_container.appendChild(emoji_spinner);

        // Pop up container
        button.parentNode.insertBefore(this.emoji_container, button);
        
        // Container content
        var emoji_list = createElement("div", "emoji-picker-option-container");

        // Category title
        var current_category = emoji_data[0].category;
        var category_nodes = {arr:[]};
        var category_div = this.setCategoryTitleNode(current_category, emoji_list, category_nodes);
        for (var i = 0; i < emoji_data.length; i++) {
            // Category check
            if (typeof this.categories_order[emoji_data[i].category] === 'undefined' ) continue;
            if (current_category != emoji_data[i].category) {
                current_category = emoji_data[i].category;
                category_div = this.setCategoryTitleNode(current_category, emoji_list, category_nodes);
            }

            // Set emoji
            var emoji = emoji_data[i];
            // Get emoji text
            var emoji_text = emoji.unified;
            var emoji_text_arr = emoji_text.split('-');
            emoji_text = '';
            for (var j = 0; j < emoji_text_arr.length; j++) {
                if (isIE11()) {
                    emoji_text += String.fromCharCode(parseInt(emoji_text_arr[j], 16));
                } else {
                    emoji_text += String.fromCodePoint(parseInt(emoji_text_arr[j], 16));
                }
            }
            // Set emoji option button
            var emoji_option = createElement("button", "emoji-picker-option");
            emoji_option.id = emoji.short_name;
            emoji_option.title = emoji.name != null ? emoji.name.toLowerCase() : emoji.short_name;
            emoji_option.style = this.getCssBackgroundFromSheet(emoji.sheet_x, emoji.sheet_y);
            emoji_option.dataset['unicode'] =  emoji_text;
            emoji_option.onclick = this.selectEmoji;
            emoji_option.onmouseover = this.showEmojiPreview(emoji_option);
            emoji_option.onmouseout = this.hideEmojiPreview;
            category_div.appendChild(emoji_option);
        }
        emoji_spinner.style.display = 'none';
        this.emoji_container.appendChild(emoji_list);
        // Emoji preview div
        var emoji_preview = createElement("div", "emoji-picker-emoji-preview");
        emoji_preview.id = "emoji-picker-emoji-preview";
        this.emoji_container.appendChild(emoji_preview);   
    },



    /**
    * Set category title node
    * @param {string} name - Category name
    * @param {HTMLElement} container - Emoji list container
    * @param {[HTMLElement]} category_nodes - Html category node array
    * @returns {HTMLElement} The created node
    **/
    setCategoryTitleNode: function(name, container, category_nodes) {
        // Check if it already exists
        var div_node = null;
        var category_name = this.categories_names[this.lang][name];
        for (var i = 0; i < category_nodes.arr.length; i++) {
            if (category_nodes.arr[i].id == 'category_'+category_name) {
                div_node = category_nodes.arr[i];
            }
        }
        if (div_node) {
            return div_node;
        }
        // Create it otherwise
        div_node = createElement("div", "category_title");
        div_node.id = 'category_'+category_name;
        div_node.style = '-webkit-order:'+this.categories_order[name]+';';
        var p_node = createElement("p", "category_title_text");
        p_node.innerHTML = category_name;
        div_node.appendChild(p_node);
        container.appendChild(div_node);
        category_nodes.arr.push(div_node);
        return div_node;
    },


    /**
     * Onclick listener to emoji picker button
    */
    setContainerToggleListener: function() {
        window.onclick = function(event) {
            if (!EmojiPicker.emoji_container) {
                return;
            }
            if ((event.target != EmojiPicker.emoji_container && event.target != EmojiPicker.emoji_button)&& EmojiPicker.emoji_container.style.display != 'none') {
                EmojiPicker.emoji_container.style.display = "none";
            }
        }
    },


    /**
     * Show the image preview of the emoji when hovering it
     * @param {HtmlElement} emoji_option - <button> representing the emoji 
     */
    showEmojiPreview: function(emoji_option) {
        return function() {
            var emoji_preview = document.getElementById("emoji-picker-emoji-preview");
            emoji_preview.style.display = 'flex';
            emoji_preview.innerHTML = emoji_option.title;
            var emoji_preview_button = emoji_option.cloneNode(true);
            emoji_preview_button.id = "preview_"+emoji_preview_button.id;
            emoji_preview.appendChild(emoji_preview_button);
        }
    },
    /**
     * Hide emoji preview
     */
    hideEmojiPreview: function() {
        var emoji_preview = document.getElementById("emoji-picker-emoji-preview");
        emoji_preview.style.display = 'none';
        emoji_preview.innerHTML = "";
    },

    /**
    * Calculate position in sheet
    * @param {int} x - X position on the sheet grid
    * @param {int} y - Y position on the sheet grid
    * @returns {string} (css style)
    */
    getCssBackgroundFromSheet: function(x, y) {
        var finalX = x == 0 ? -1 : -x*(this.emoji_px_size+2)-1;
        var finalY = y == 0 ? -1 : -y*(this.emoji_px_size+2)-1;
        return  'background:url('+this.sheet_url+');' +
                'width: '+this.emoji_px_size+'px;' +
                'height: '+this.emoji_px_size+'px;' +
                'background-position: '+finalX+'px '+finalY+'px;' +
                '-moz-transform: scale(0.5); ' +  /* Firefox */
                'zoom: 0.5';
    },

    /**
     * Onclick function for each emoji
     * @param {HTMLElement} emoji - Emoji butotn html
     */
    selectEmoji: function() {
        var emoji_unicode = this.getAttribute("data-unicode");
        var emoji_html = twemoji.parse(emoji_unicode, {folder:'svg', ext:'.svg'});
        EmojiPicker.textarea.innerHTML += emoji_html;
    },

}

//// HELPERS

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

/** 
 * CreateElement helper with classname
 * @returns {HTMLElement}
*/
function createElement(tagName, className)  {
    className = className || 0;
    var element = document.createElement(tagName);
  
    if (className) {
      element.className = className;
    }
  
    return element;
}

/** 
 * Helper to sort json by property
 * @param {Array} array - Json array data
 * @params {string} key - array key to use to sort
 * @return {Array} - Sorted data
 */
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; 
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
    
/**
 * Detect IE11
 * @returns {boolean}
 */
function isIE11() {
    var ua = window.navigator.userAgent;
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        return true
    }
    return false;
}
