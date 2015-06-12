/*
 The MIT License (MIT)

 Copyright (c) 2014 Irrelon Software Limited
 http://www.irrelon.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice, url and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 Source: https://github.com/irrelon/jquery-lang-js

 Changelog: See readme.md
 */
var Lang = (function () {
	var Lang = function (defaultLang, currentLang, allowCookieOverride) {
		var self = this,
			cookieLang;
		
		// Enable firing events
		this._fireEvents = true;
		
		// Allow storage of dynamic language pack data
		this._dynamic = {};
		
		// Store existing mutation methods so we can auto-run
		// translations when new data is added to the page
		this._mutationCopies = {
			append: $.fn.append,
			appendTo: $.fn.appendTo,
			prepend: $.fn.prepend,
			before: $.fn.before,
			after: $.fn.after,
			html: $.fn.html
		};
		
		// Now override the existing mutation methods with our own
		$.fn.append = function () { return self._mutation(this, 'append', arguments) };
		$.fn.appendTo = function () { return self._mutation(this, 'appendTo', arguments) };
		$.fn.prepend = function () { return self._mutation(this, 'prepend', arguments) };
		$.fn.before = function () { return self._mutation(this, 'before', arguments) };
		$.fn.after = function () { return self._mutation(this, 'after', arguments) };
		$.fn.html = function () { return self._mutation(this, 'html', arguments) };
		
		// Set default and current language to the default one
		// to start with
		this.defaultLang = defaultLang || 'en';
		this.currentLang = defaultLang || 'en';
		
		// Check for cookie support when no current language is specified
		if ((allowCookieOverride || !currentLang) && $.cookie) {
			// Check for an existing language cookie
			cookieLang = $.cookie('langCookie');
			
			if (cookieLang) {
				// We have a cookie language, set the current language
				currentLang = cookieLang;
			}
		}

		$(function () {
			// Setup data on the language items
			self._start();
	
			// Check if the current language is not the same as our default
			if (currentLang && currentLang !== self.defaultLang) {
				// Switch to the current language
				self.change(currentLang);
			}
		});
	};

	/**
	 * Object that holds the language packs.
	 * @type {{}}
	 */
	Lang.prototype.pack = {};

	/**
	 * Array of translatable attributes to check for on elements.
	 * @type {string[]}
	 */
	Lang.prototype.attrList = [
		'title',
		'alt',
		'placeholder',
		'href'
	];

	/**
	 * Defines a language pack that can be dynamically loaded and the
	 * path to use when doing so.
	 * @param {String} lang The language two-letter iso-code.
	 * @param {String} path The path to the language pack js file.
	 */
	Lang.prototype.dynamic = function (lang, path) {
		if (lang !== undefined && path !== undefined) {
			this._dynamic[lang] = path;
		}
	};

	/**
	 * Loads a new language pack for the given language.
	 * @param {string} lang The language to load the pack for.
	 * @param {Function=} callback Optional callback when the file has loaded.
	 */
	Lang.prototype.loadPack = function (lang, callback) {
		var self = this;
		
		if (lang && self._dynamic[lang]) {
			$.ajax({
				dataType: "json",
				url: self._dynamic[lang],
				success: function (data) {
					self.pack[lang] = data;

					// Process the regex list
					if (self.pack[lang].regex) {
						var packRegex = self.pack[lang].regex,
							regex,
							i;
						
						for (i = 0; i < packRegex.length; i++) {
							regex = packRegex[i];
							if (regex.length === 2) {
								// String, value
								regex[0] = new RegExp(regex[0]);
							} else if (regex.length === 3) {
								// String, modifiers, value
								regex[0] = new RegExp(regex[0], regex[1]);
								
								// Remove modifier
								regex.splice(1, 1);
							}
						}
					}
					
					//console.log('Loaded language pack: ' + self._dynamic[lang]);
					if (callback) { callback(false, lang, self._dynamic[lang]); }
				},
				error: function () {
					if (callback) { callback(true, lang, self._dynamic[lang]); }
					throw('Error loading language pack' + self._dynamic[lang]);
				}
			});
		} else {
			throw('Cannot load language pack, no file path specified!');
		}
	};

	/**
	 * Scans the DOM for elements with [lang] selector and saves translate data
	 * for them for later use.
	 * @private
	 */
	Lang.prototype._start = function (selector) {
		// Get the page HTML
		var arr = selector !== undefined ? $(selector).find('[lang]') : $(':not(html)[lang]'),
			arrCount = arr.length,
			elem;

		while (arrCount--) {
			elem = $(arr[arrCount]);
			this._processElement(elem);
		}
	};
	
	Lang.prototype._processElement = function (elem) {
		// Only store data if the element is set to our default language
		if (elem.attr('lang') === this.defaultLang) {
			// Store translatable attributes
			this._storeAttribs(elem);
	
			// Store translatable content
			this._storeContent(elem);
		}
	};

	/**
	 * Stores the translatable attribute values in their default language.
	 * @param {object} elem The jQuery selected element.
	 * @private
	 */
	Lang.prototype._storeAttribs = function (elem) {
		var attrIndex,
			attr,
			attrObj;

		for (attrIndex = 0; attrIndex < this.attrList.length; attrIndex++) {
			attr = this.attrList[attrIndex];
			if (elem.attr(attr)) {
				// Grab the existing attribute store or create a new object
				attrObj = elem.data('lang-attr') || {};

				// Add the attribute and value to the store
				attrObj[attr] = elem.attr(attr);

				// Save the attribute data to the store
				elem.data('lang-attr', attrObj);
			}
		}
	};

	/**
	 * Reads the existing content from the element and stores it for
	 * later use in translation.
	 * @param elem
	 * @private
	 */
	Lang.prototype._storeContent = function (elem) {
		// Check if the element is an input element
		if (elem.is('input')) {
			switch (elem.attr('type')) {
				case 'button':
				case 'submit':
				case 'hidden':
				case 'reset':
					elem.data('lang-val', elem.val());
					break;
			}
		} else if (elem.is('img')) {
			elem.data('lang-src', elem.attr('src'));
		} else {
			// Get the text nodes immediately inside this element
			var nodes = this._getTextNodes(elem);
			if (nodes) {
				elem.data('lang-text', nodes);
			}
		}
	};

	/**
	 * Retrieves the text nodes from an element and returns them in array wrap into
	 * object with two properties: 
	 * 	- node - which corresponds to text node,
	 * 	- langDefaultText - which remember current data of text node
	 * @param elem
	 * @returns {Array|*}
	 * @private
	 */
	Lang.prototype._getTextNodes = function (elem) {
		var nodes = elem.contents(), nodeObjArray = [], nodeObj = {},
			nodeArr, that = this, map = Array.prototype.map;

        $.each(nodes, function (index, node) {
            if ( node.nodeType !== 3 ) {
                return;
            }

			nodeObj = {
				node : node,
				langDefaultText : node.data
			};

			nodeObjArray.push(nodeObj);
		});
		
		return nodeObjArray;
	};

	/**
	 * Sets text nodes of an element translated based on the passed language.
	 * @param elem
	 * @param {Array|*} nodes array of objecs with text node and defaultText returned from _getTextNodes
	 * @param lang
	 * @private
	 */
	Lang.prototype._setTextNodes = function (elem, nodes, lang) {
		var index,
			textNode,
			defaultText,
			translation,
			langNotDefault = lang !== this.defaultLang;
		
		for (index = 0; index < nodes.length; index++) {
			textNode = nodes[index];
			
			if (langNotDefault) {
				defaultText = $.trim(textNode.langDefaultText);
				
				if (defaultText) {
					// Translate the langDefaultText
					translation = this.translate(defaultText, lang);
					
					if (translation) {
						try {
							// Replace the text with the translated version
							textNode.node.data = textNode.node.data.split($.trim(textNode.node.data)).join(translation);
						} catch (e) {
							
						}
					} else {
						if (console && console.log) {
							console.log('Translation for "' + defaultText + '" not found!');
						}
					}
				}
			} else {
				// Replace with original text
				try {
					textNode.node.data = textNode.langDefaultText;
				} catch (e) {
					
				}
			}
		}
	};

	/**
	 * Translates and sets the attributes of an element to the passed language.
	 * @param elem
	 * @param lang
	 * @private
	 */
	Lang.prototype._translateAttribs = function (elem, lang) {
		var attr,
			attrObj = elem.data('lang-attr') || {},
			translation;

		for (attr in attrObj) {
			if (attrObj.hasOwnProperty(attr)) {
				// Check the element still has the attribute
				if (elem.attr(attr)) {
					if (lang !== this.defaultLang) {
						// Get the translated value
						translation = this.translate(attrObj[attr], lang);

						// Check we actually HAVE a translation
						if (translation) {
							// Change the attribute to the translated value
							elem.attr(attr, translation);
						}
					} else {
						// Set default language value
						elem.attr(attr, attrObj[attr]);
					}
				}
			}
		}
	};

	/**
	 * Translates and sets the contents of an element to the passed language.
	 * @param elem
	 * @param lang
	 * @private
	 */
	Lang.prototype._translateContent = function (elem, lang) {
		var langNotDefault = lang !== this.defaultLang,
			translation,
			nodes;

		// Check if the element is an input element
		if (elem.is('input')) {
			switch (elem.attr('type')) {
				case 'button':
				case 'submit':
				case 'hidden':
				case 'reset':
					if (langNotDefault) {
						// Get the translated value
						translation = this.translate(elem.data('lang-val'), lang);

						// Check we actually HAVE a translation
						if (translation) {
							// Set translated value
							elem.val(translation);
						}
					} else {
						// Set default language value
						elem.val(elem.data('lang-val'));
					}
					break;
			}
		} else if (elem.is('img')) {
			if (langNotDefault) {
				// Get the translated value
				translation = this.translate(elem.data('lang-src'), lang);

				// Check we actually HAVE a translation
				if (translation) {
					// Set translated value
					elem.attr('src', translation);
				}
			} else {
				// Set default language value
				elem.attr('src', elem.data('lang-src'));
			}
		} else {
			// Set text node translated text
			nodes = elem.data('lang-text');

			if (nodes) {
				this._setTextNodes(elem, nodes, lang);
			}
		}
	};

	/**
	 * Call this to change the current language on the page.
	 * @param {String} lang The new two-letter language code to change to.
	 * @param {String=} selector Optional selector to find language-based
	 * elements for updating.
	 * @param {Function=} callback Optional callback function that will be
	 * called once the language change has been successfully processed. This
	 * is especially useful if you are using dynamic language pack loading
	 * since you will get a callback once it has been loaded and changed.
	 * Your callback will be passed three arguments, a boolean to denote if
	 * there was an error (true if error), the second will be the language
	 * you passed in the change call (the lang argument) and the third will
	 * be the selector used in the change update.
	 */
	Lang.prototype.change = function (lang, selector, callback) {
		var self = this;
		
		if (lang === this.defaultLang || this.pack[lang] || this._dynamic[lang]) {
			// Check if the language pack is currently loaded
			if (lang !== this.defaultLang) {
				if (!this.pack[lang] && this._dynamic[lang]) {
					// The language pack needs loading first
					//console.log('Loading dynamic language pack: ' + this._dynamic[lang] + '...');
					this.loadPack(lang, function (err, loadingLang, fromUrl) {
						if (!err) {
							// Process the change language request
							self.change.call(self, lang, selector, callback);
						} else {
							// Call the callback with the error
							if (callback) { callback('Language pack could not load from: ' + fromUrl, lang, selector); }
						}
					});
					
					return;
				} else if (!this.pack[lang] && !this._dynamic[lang]) {
					// Pack not loaded and no dynamic entry
					if (callback) { callback('Language pack not defined for: ' + lang, lang, selector); }
					throw('Could not change language to ' + lang + ' because no language pack for this language exists!');
				}
			}
			
			var fireAfterUpdate = false,
				currLang = this.currentLang;
			
			if (this.currentLang != lang) {
				this.beforeUpdate(currLang, lang);
				fireAfterUpdate = true;
			}
			
			this.currentLang = lang;
			
			// Get the page HTML
			var arr = selector !== undefined ? $(selector).find('[lang]') : $(':not(html)[lang]'),
				arrCount = arr.length,
				elem;
	
			while (arrCount--) {
				elem = $(arr[arrCount]);
	
				if (elem.attr('lang') !== lang) {
					this._translateElement(elem, lang);
				}
			}
			
			if (fireAfterUpdate) {
				this.afterUpdate(currLang, lang);
			}
			
			// Check for cookie support
			if ($.cookie) {
				// Set a cookie to remember this language setting with 1 year expiry
				$.cookie('langCookie', lang, {
					expires: 365,
					path: '/'
				});
			}
			
			if (callback) { callback(false, lang, selector); }
		} else {
			if (callback) { callback('No language pack defined for: ' + lang, lang, selector); }
			throw('Attempt to change language to "' + lang + '" but no language pack for that language is loaded!');
		}
	};
	
	Lang.prototype._translateElement = function (elem, lang) {
		// Translate attributes
		this._translateAttribs(elem, lang);

		// Translate content
		if (elem.attr('data-lang-content') != 'false') {
			this._translateContent(elem, lang);
		}

		// Update the element's current language
		elem.attr('lang', lang);
	};

	/**
	 * Translates text from the default language into the passed language.
	 * @param {String} text The text to translate.
	 * @param {String} lang The two-letter language code to translate to.
	 * @returns {*}
	 */
	Lang.prototype.translate = function (text, lang) {
		lang = lang || this.currentLang;
		
		if (this.pack[lang]) {
			var translation = '';
	
			if (lang != this.defaultLang) {
				// Check for a direct token translation
				translation = this.pack[lang].token[text];
	
				if (!translation) {
					// No token translation was found, test for regex match
					translation = this._regexMatch(text, lang);
				}
				
				if (!translation) {
					//if (console && console.log) {
					//	console.log('Translation for "' + text + '" not found in language pack: ' + lang);
					//}
				}
	
				return translation || text;
			} else {
				return text;
			}
		} else {
			return text;
		}
	};

	/**
	 * Checks the regex items for a match against the passed text and
	 * if a match is made, translates to the given replacement.
	 * @param {String} text The text to test regex matches against.
	 * @param {String} lang The two-letter language code to translate to.
	 * @returns {string}
	 * @private
	 */
	Lang.prototype._regexMatch = function (text, lang) {
		// Loop the regex array and test them against the text
		var arr,
			arrCount,
			arrIndex,
			item,
			regex,
			expressionResult;
		
		arr = this.pack[lang].regex;
		
		if (arr) {
			arrCount = arr.length;
			
			for (arrIndex = 0; arrIndex < arrCount; arrIndex++) {
				item = arr[arrIndex];
				regex = item[0];
	
				// Test regex
				expressionResult = regex.exec(text);
	
				if (expressionResult && expressionResult[0]) {
					return text.split(expressionResult[0]).join(item[1]);
				}
			}
		}

		return '';
	};

	Lang.prototype.beforeUpdate = function (currentLang, newLang) {
		if (this._fireEvents) {
			$(this).triggerHandler('beforeUpdate', [currentLang, newLang, this.pack[currentLang], this.pack[newLang]]);
		}
	};
	
	Lang.prototype.afterUpdate = function (currentLang, newLang) {
		if (this._fireEvents) {
			$(this).triggerHandler('afterUpdate', [currentLang, newLang, this.pack[currentLang], this.pack[newLang]]);
		}
	};
	
	Lang.prototype.refresh = function () {
		// Process refresh on the page
		this._fireEvents = false;
		this.change(this.currentLang);
		this._fireEvents = true;
	};
	
	////////////////////////////////////////////////////
	// Mutation overrides
	////////////////////////////////////////////////////
	Lang.prototype._mutation = function (context, method, args) {
		var result = this._mutationCopies[method].apply(context, args),
			currLang = this.currentLang,
			rootElem = $(context);
		
		if (rootElem.attr('lang')) {
			// Switch off events for the moment
			this._fireEvents = false;
			
			// Check if the root element is currently set to another language from current
			//if (rootElem.attr('lang') !== this.currentLang) {
				this._translateElement(rootElem, this.defaultLang);
				this.change(this.defaultLang, rootElem);
				
				// Calling change above sets the global currentLang but this is supposed to be
				// an isolated change so reset the global value back to what it was before
				this.currentLang = currLang;
				
				// Record data on the default language from the root element
				this._processElement(rootElem);
				
				// Translate the root element
				this._translateElement(rootElem, this.currentLang);
			//}
		}
		
		// Record data on the default language from the root's children
		this._start(rootElem);
		
		// Process translation on any child elements of this element
		this.change(this.currentLang, rootElem);
		
		// Switch events back on
		this._fireEvents = true;
		
		return result;
	};

	return Lang;
})();


/**
 * @author Phil Teare
 * using wikipedia data
 */
var isoLangs = {
	"ab":{
		"name":"Abkhaz",
		"nativeName":"аҧсуа"
	},
	"aa":{
		"name":"Afar",
		"nativeName":"Afaraf"
	},
	"af":{
		"name":"Afrikaans",
		"nativeName":"Afrikaans"
	},
	"ak":{
		"name":"Akan",
		"nativeName":"Akan"
	},
	"sq":{
		"name":"Albanian",
		"nativeName":"Shqip"
	},
	"am":{
		"name":"Amharic",
		"nativeName":"አማርኛ"
	},
	"ar":{
		"name":"Arabic",
		"nativeName":"العربية"
	},
	"an":{
		"name":"Aragonese",
		"nativeName":"Aragonés"
	},
	"hy":{
		"name":"Armenian",
		"nativeName":"Հայերեն"
	},
	"as":{
		"name":"Assamese",
		"nativeName":"অসমীয়া"
	},
	"av":{
		"name":"Avaric",
		"nativeName":"авар мацӀ, магӀарул мацӀ"
	},
	"ae":{
		"name":"Avestan",
		"nativeName":"avesta"
	},
	"ay":{
		"name":"Aymara",
		"nativeName":"aymar aru"
	},
	"az":{
		"name":"Azerbaijani",
		"nativeName":"azərbaycan dili"
	},
	"bm":{
		"name":"Bambara",
		"nativeName":"bamanankan"
	},
	"ba":{
		"name":"Bashkir",
		"nativeName":"башҡорт теле"
	},
	"eu":{
		"name":"Basque",
		"nativeName":"euskara, euskera"
	},
	"be":{
		"name":"Belarusian",
		"nativeName":"Беларуская"
	},
	"bn":{
		"name":"Bengali",
		"nativeName":"বাংলা"
	},
	"bh":{
		"name":"Bihari",
		"nativeName":"भोजपुरी"
	},
	"bi":{
		"name":"Bislama",
		"nativeName":"Bislama"
	},
	"bs":{
		"name":"Bosnian",
		"nativeName":"bosanski jezik"
	},
	"br":{
		"name":"Breton",
		"nativeName":"brezhoneg"
	},
	"bg":{
		"name":"Bulgarian",
		"nativeName":"български език"
	},
	"my":{
		"name":"Burmese",
		"nativeName":"ဗမာစာ"
	},
	"ca":{
		"name":"Catalan; Valencian",
		"nativeName":"Català"
	},
	"ch":{
		"name":"Chamorro",
		"nativeName":"Chamoru"
	},
	"ce":{
		"name":"Chechen",
		"nativeName":"нохчийн мотт"
	},
	"ny":{
		"name":"Chichewa; Chewa; Nyanja",
		"nativeName":"chiCheŵa, chinyanja"
	},
	"zh":{
		"name":"Chinese",
		"nativeName":"漢語"
	},
	"zhcn":{
		"name":"Chinese",
		"nativeName":"中文 (Zhōngwén), 汉语"
	},
	"cv":{
		"name":"Chuvash",
		"nativeName":"чӑваш чӗлхи"
	},
	"kw":{
		"name":"Cornish",
		"nativeName":"Kernewek"
	},
	"co":{
		"name":"Corsican",
		"nativeName":"corsu, lingua corsa"
	},
	"cr":{
		"name":"Cree",
		"nativeName":"ᓀᐦᐃᔭᐍᐏᐣ"
	},
	"hr":{
		"name":"Croatian",
		"nativeName":"hrvatski"
	},
	"cs":{
		"name":"Czech",
		"nativeName":"česky, čeština"
	},
	"da":{
		"name":"Danish",
		"nativeName":"dansk"
	},
	"dv":{
		"name":"Divehi; Dhivehi; Maldivian;",
		"nativeName":"ދިވެހި"
	},
	"nl":{
		"name":"Dutch",
		"nativeName":"Nederlands, Vlaams"
	},
	"en":{
		"name":"English",
		"nativeName":"English"
	},
	"eo":{
		"name":"Esperanto",
		"nativeName":"Esperanto"
	},
	"et":{
		"name":"Estonian",
		"nativeName":"eesti, eesti keel"
	},
	"ee":{
		"name":"Ewe",
		"nativeName":"Eʋegbe"
	},
	"fo":{
		"name":"Faroese",
		"nativeName":"føroyskt"
	},
	"fj":{
		"name":"Fijian",
		"nativeName":"vosa Vakaviti"
	},
	"fi":{
		"name":"Finnish",
		"nativeName":"suomi, suomen kieli"
	},
	"fr":{
		"name":"French",
		"nativeName":"français, langue française"
	},
	"ff":{
		"name":"Fula; Fulah; Pulaar; Pular",
		"nativeName":"Fulfulde, Pulaar, Pular"
	},
	"gl":{
		"name":"Galician",
		"nativeName":"Galego"
	},
	"ka":{
		"name":"Georgian",
		"nativeName":"ქართული"
	},
	"de":{
		"name":"German",
		"nativeName":"Deutsch"
	},
	"el":{
		"name":"Greek, Modern",
		"nativeName":"Ελληνικά"
	},
	"gn":{
		"name":"Guaraní",
		"nativeName":"Avañeẽ"
	},
	"gu":{
		"name":"Gujarati",
		"nativeName":"ગુજરાતી"
	},
	"ht":{
		"name":"Haitian; Haitian Creole",
		"nativeName":"Kreyòl ayisyen"
	},
	"ha":{
		"name":"Hausa",
		"nativeName":"Hausa, هَوُسَ"
	},
	"he":{
		"name":"Hebrew (modern)",
		"nativeName":"עברית"
	},
	"hz":{
		"name":"Herero",
		"nativeName":"Otjiherero"
	},
	"hi":{
		"name":"Hindi",
		"nativeName":"हिन्दी, हिंदी"
	},
	"ho":{
		"name":"Hiri Motu",
		"nativeName":"Hiri Motu"
	},
	"hu":{
		"name":"Hungarian",
		"nativeName":"Magyar"
	},
	"ia":{
		"name":"Interlingua",
		"nativeName":"Interlingua"
	},
	"id":{
		"name":"Indonesian",
		"nativeName":"Bahasa Indonesia"
	},
	"ie":{
		"name":"Interlingue",
		"nativeName":"Originally called Occidental; then Interlingue after WWII"
	},
	"ga":{
		"name":"Irish",
		"nativeName":"Gaeilge"
	},
	"ig":{
		"name":"Igbo",
		"nativeName":"Asụsụ Igbo"
	},
	"ik":{
		"name":"Inupiaq",
		"nativeName":"Iñupiaq, Iñupiatun"
	},
	"io":{
		"name":"Ido",
		"nativeName":"Ido"
	},
	"is":{
		"name":"Icelandic",
		"nativeName":"Íslenska"
	},
	"it":{
		"name":"Italian",
		"nativeName":"Italiano"
	},
	"iu":{
		"name":"Inuktitut",
		"nativeName":"ᐃᓄᒃᑎᑐᑦ"
	},
	"ja":{
		"name":"Japanese",
		"nativeName":"日本語 (にほんご／にっぽんご)"
	},
	"jv":{
		"name":"Javanese",
		"nativeName":"basa Jawa"
	},
	"kl":{
		"name":"Kalaallisut, Greenlandic",
		"nativeName":"kalaallisut, kalaallit oqaasii"
	},
	"kn":{
		"name":"Kannada",
		"nativeName":"ಕನ್ನಡ"
	},
	"kr":{
		"name":"Kanuri",
		"nativeName":"Kanuri"
	},
	"ks":{
		"name":"Kashmiri",
		"nativeName":"कश्मीरी, كشميري‎"
	},
	"kk":{
		"name":"Kazakh",
		"nativeName":"Қазақ тілі"
	},
	"km":{
		"name":"Khmer",
		"nativeName":"ភាសាខ្មែរ"
	},
	"ki":{
		"name":"Kikuyu, Gikuyu",
		"nativeName":"Gĩkũyũ"
	},
	"rw":{
		"name":"Kinyarwanda",
		"nativeName":"Ikinyarwanda"
	},
	"ky":{
		"name":"Kirghiz, Kyrgyz",
		"nativeName":"кыргыз тили"
	},
	"kv":{
		"name":"Komi",
		"nativeName":"коми кыв"
	},
	"kg":{
		"name":"Kongo",
		"nativeName":"KiKongo"
	},
	"ko":{
		"name":"Korean",
		"nativeName":"한국어 (韓國語), 조선말 (朝鮮語)"
	},
	"ku":{
		"name":"Kurdish",
		"nativeName":"Kurdî, كوردی‎"
	},
	"kj":{
		"name":"Kwanyama, Kuanyama",
		"nativeName":"Kuanyama"
	},
	"la":{
		"name":"Latin",
		"nativeName":"latine, lingua latina"
	},
	"lb":{
		"name":"Luxembourgish, Letzeburgesch",
		"nativeName":"Lëtzebuergesch"
	},
	"lg":{
		"name":"Luganda",
		"nativeName":"Luganda"
	},
	"li":{
		"name":"Limburgish, Limburgan, Limburger",
		"nativeName":"Limburgs"
	},
	"ln":{
		"name":"Lingala",
		"nativeName":"Lingála"
	},
	"lo":{
		"name":"Lao",
		"nativeName":"ພາສາລາວ"
	},
	"lt":{
		"name":"Lithuanian",
		"nativeName":"lietuvių kalba"
	},
	"lu":{
		"name":"Luba-Katanga",
		"nativeName":""
	},
	"lv":{
		"name":"Latvian",
		"nativeName":"latviešu valoda"
	},
	"gv":{
		"name":"Manx",
		"nativeName":"Gaelg, Gailck"
	},
	"mk":{
		"name":"Macedonian",
		"nativeName":"македонски јазик"
	},
	"mg":{
		"name":"Malagasy",
		"nativeName":"Malagasy fiteny"
	},
	"ms":{
		"name":"Malay",
		"nativeName":"bahasa Melayu, بهاس ملايو‎"
	},
	"ml":{
		"name":"Malayalam",
		"nativeName":"മലയാളം"
	},
	"mt":{
		"name":"Maltese",
		"nativeName":"Malti"
	},
	"mi":{
		"name":"Māori",
		"nativeName":"te reo Māori"
	},
	"mr":{
		"name":"Marathi (Marāṭhī)",
		"nativeName":"मराठी"
	},
	"mh":{
		"name":"Marshallese",
		"nativeName":"Kajin M̧ajeļ"
	},
	"mn":{
		"name":"Mongolian",
		"nativeName":"монгол"
	},
	"na":{
		"name":"Nauru",
		"nativeName":"Ekakairũ Naoero"
	},
	"nv":{
		"name":"Navajo, Navaho",
		"nativeName":"Diné bizaad, Dinékʼehǰí"
	},
	"nb":{
		"name":"Norwegian Bokmål",
		"nativeName":"Norsk bokmål"
	},
	"nd":{
		"name":"North Ndebele",
		"nativeName":"isiNdebele"
	},
	"ne":{
		"name":"Nepali",
		"nativeName":"नेपाली"
	},
	"ng":{
		"name":"Ndonga",
		"nativeName":"Owambo"
	},
	"nn":{
		"name":"Norwegian Nynorsk",
		"nativeName":"Norsk nynorsk"
	},
	"no":{
		"name":"Norwegian",
		"nativeName":"Norsk"
	},
	"ii":{
		"name":"Nuosu",
		"nativeName":"ꆈꌠ꒿ Nuosuhxop"
	},
	"nr":{
		"name":"South Ndebele",
		"nativeName":"isiNdebele"
	},
	"oc":{
		"name":"Occitan",
		"nativeName":"Occitan"
	},
	"oj":{
		"name":"Ojibwe, Ojibwa",
		"nativeName":"ᐊᓂᔑᓈᐯᒧᐎᓐ"
	},
	"cu":{
		"name":"Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
		"nativeName":"ѩзыкъ словѣньскъ"
	},
	"om":{
		"name":"Oromo",
		"nativeName":"Afaan Oromoo"
	},
	"or":{
		"name":"Oriya",
		"nativeName":"ଓଡ଼ିଆ"
	},
	"os":{
		"name":"Ossetian, Ossetic",
		"nativeName":"ирон æвзаг"
	},
	"pa":{
		"name":"Panjabi, Punjabi",
		"nativeName":"ਪੰਜਾਬੀ, پنجابی‎"
	},
	"pi":{
		"name":"Pāli",
		"nativeName":"पाऴि"
	},
	"fa":{
		"name":"Persian",
		"nativeName":"فارسی"
	},
	"pl":{
		"name":"Polish",
		"nativeName":"polski"
	},
	"ps":{
		"name":"Pashto, Pushto",
		"nativeName":"پښتو"
	},
	"pt":{
		"name":"Portuguese",
		"nativeName":"Português"
	},
	"qu":{
		"name":"Quechua",
		"nativeName":"Runa Simi, Kichwa"
	},
	"rm":{
		"name":"Romansh",
		"nativeName":"rumantsch grischun"
	},
	"rn":{
		"name":"Kirundi",
		"nativeName":"kiRundi"
	},
	"ro":{
		"name":"Romanian, Moldavian, Moldovan",
		"nativeName":"română"
	},
	"ru":{
		"name":"Russian",
		"nativeName":"русский язык"
	},
	"sa":{
		"name":"Sanskrit (Saṁskṛta)",
		"nativeName":"संस्कृतम्"
	},
	"sc":{
		"name":"Sardinian",
		"nativeName":"sardu"
	},
	"sd":{
		"name":"Sindhi",
		"nativeName":"सिन्धी, سنڌي، سندھی‎"
	},
	"se":{
		"name":"Northern Sami",
		"nativeName":"Davvisámegiella"
	},
	"sm":{
		"name":"Samoan",
		"nativeName":"gagana faa Samoa"
	},
	"sg":{
		"name":"Sango",
		"nativeName":"yângâ tî sängö"
	},
	"sr":{
		"name":"Serbian",
		"nativeName":"српски језик"
	},
	"gd":{
		"name":"Scottish Gaelic; Gaelic",
		"nativeName":"Gàidhlig"
	},
	"sn":{
		"name":"Shona",
		"nativeName":"chiShona"
	},
	"si":{
		"name":"Sinhala, Sinhalese",
		"nativeName":"සිංහල"
	},
	"sk":{
		"name":"Slovak",
		"nativeName":"slovenčina"
	},
	"sl":{
		"name":"Slovene",
		"nativeName":"slovenščina"
	},
	"so":{
		"name":"Somali",
		"nativeName":"Soomaaliga, af Soomaali"
	},
	"st":{
		"name":"Southern Sotho",
		"nativeName":"Sesotho"
	},
	"es":{
		"name":"Spanish; Castilian",
		"nativeName":"español, castellano"
	},
	"su":{
		"name":"Sundanese",
		"nativeName":"Basa Sunda"
	},
	"sw":{
		"name":"Swahili",
		"nativeName":"Kiswahili"
	},
	"ss":{
		"name":"Swati",
		"nativeName":"SiSwati"
	},
	"sv":{
		"name":"Swedish",
		"nativeName":"svenska"
	},
	"ta":{
		"name":"Tamil",
		"nativeName":"தமிழ்"
	},
	"te":{
		"name":"Telugu",
		"nativeName":"తెలుగు"
	},
	"tg":{
		"name":"Tajik",
		"nativeName":"тоҷикӣ, toğikī, تاجیکی‎"
	},
	"th":{
		"name":"Thai",
		"nativeName":"ไทย"
	},
	"ti":{
		"name":"Tigrinya",
		"nativeName":"ትግርኛ"
	},
	"bo":{
		"name":"Tibetan Standard, Tibetan, Central",
		"nativeName":"བོད་ཡིག"
	},
	"tk":{
		"name":"Turkmen",
		"nativeName":"Türkmen, Түркмен"
	},
	"tl":{
		"name":"Tagalog",
		"nativeName":"Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔"
	},
	"tn":{
		"name":"Tswana",
		"nativeName":"Setswana"
	},
	"to":{
		"name":"Tonga (Tonga Islands)",
		"nativeName":"faka Tonga"
	},
	"tr":{
		"name":"Turkish",
		"nativeName":"Türkçe"
	},
	"ts":{
		"name":"Tsonga",
		"nativeName":"Xitsonga"
	},
	"tt":{
		"name":"Tatar",
		"nativeName":"татарча, tatarça, تاتارچا‎"
	},
	"tw":{
		"name":"Twi",
		"nativeName":"Twi"
	},
	"ty":{
		"name":"Tahitian",
		"nativeName":"Reo Tahiti"
	},
	"ug":{
		"name":"Uighur, Uyghur",
		"nativeName":"Uyƣurqə, ئۇيغۇرچە‎"
	},
	"uk":{
		"name":"Ukrainian",
		"nativeName":"українська"
	},
	"ur":{
		"name":"Urdu",
		"nativeName":"اردو"
	},
	"uz":{
		"name":"Uzbek",
		"nativeName":"zbek, Ўзбек, أۇزبېك‎"
	},
	"ve":{
		"name":"Venda",
		"nativeName":"Tshivenḓa"
	},
	"vi":{
		"name":"Vietnamese",
		"nativeName":"Tiếng Việt"
	},
	"vo":{
		"name":"Volapük",
		"nativeName":"Volapük"
	},
	"wa":{
		"name":"Walloon",
		"nativeName":"Walon"
	},
	"cy":{
		"name":"Welsh",
		"nativeName":"Cymraeg"
	},
	"wo":{
		"name":"Wolof",
		"nativeName":"Wollof"
	},
	"fy":{
		"name":"Western Frisian",
		"nativeName":"Frysk"
	},
	"xh":{
		"name":"Xhosa",
		"nativeName":"isiXhosa"
	},
	"yi":{
		"name":"Yiddish",
		"nativeName":"ייִדיש"
	},
	"yo":{
		"name":"Yoruba",
		"nativeName":"Yorùbá"
	},
	"za":{
		"name":"Zhuang, Chuang",
		"nativeName":"Saɯ cueŋƅ, Saw cuengh"
	}
}