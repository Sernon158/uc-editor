var availableLanguages = ["en"];
var tipsGeneratorId = 0;
var translationReady = false;
var translationEvent = new Event('translationReady');
const card_number_color_classes = ['cost-color', 'atk-color', 'hp-color'];
const card_number_regex = /[\d\.\,]+/gm;
function loadTranslation(language) {
    var langs = ["en"];
    langs.push(language);
    $.i18n().debug = false;
    $.i18n().locale = language;
    $.i18n().load({ en: window.i18n_en }).done(function() {
        $.extend($.i18n.parser.emitter, {
            ucp: function(nodes) {
                return '<span class="ucp">' + nodes[0] + '</span>';
            },
            tribe: function(nodes) {
                if (nodes.length > 0) {
                    var quantity = 1;
                    if (nodes.length === 2) {
                        quantity = nodes[1];
                    }
                    var tribeStringKey = 'tribe-' + nodes[0].toLowerCase().replace(/_/g, '-');
                    var text = '';
                    var overrideText = checkOverride(nodes);
                    if (overrideText === null) {
                        text = $.i18n(tribeStringKey, quantity);
                    } else {
                        text = overrideText;
                    }
                    return text;
                }
            },
            soul: function(nodes) {
                if (nodes.length > 0) {
                    var soul = nodes[0];
                    var soulStringKey = 'soul-' + soul.replace(/_/g, '-').toLowerCase();
                    var text = '';
                    var overrideText = checkOverride(nodes);
                    if (overrideText === null) {
                        text = $.i18n(soulStringKey);
                    } else {
                        text = overrideText;
                    }
                    return text;
                }
            },
            kw: function(nodes) {
                if (nodes.length > 0) {
                    var keyword = nodes[0];
                    var keywordClean = keyword.replace(/_/g, '-').toLowerCase();
                    var keywordStringKey = 'kw-' + keywordClean;
                    var overrideText = checkOverride(nodes);
                    var text = overrideText || $.i18n(keywordStringKey);
                    return text;
                }
            },
            artifact: function(nodes) {
                if (nodes.length > 0) {
                    var artifactId = nodes[0];
                    var artifactNameKey = 'artifact-name-' + artifactId;
                    var overrideText = checkOverride(nodes);
                    var text = overrideText || $.i18n(artifactNameKey);
                    return '_' + text + '_';
                }
            },
            enchant: function (nodes) {
                if (nodes.length > 0) {

                    var keyword = nodes[0];
                    var keywordClean = keyword.replace(/_/g, '-').toLowerCase();
                    var keywordStringKey = 'enchant-' + keywordClean;

                    var text = '';

                    var overrideText = checkOverride(nodes);

                    if (overrideText === null) {
                        var quantity = 1;
                        if (nodes.length > 1) {
                            var arg = nodes[1];
                            if (!isNaN(arg)) {
                                quantity = parseInt(arg);
                            }
                        }
                        text = $.i18n(keywordStringKey, quantity);
                    } else {
                        text = overrideText;
                    }

                    return '_' + text + '_';
                }
            },
            hp: StatHelper("HP"),
            atk: StatHelper("ATK"),
            gold: StatHelper("G"),
            cost: StatHelper("cost"),
            dmg: StatHelper("DMG"),
            kr: function(nodes) {
                var overrideText = checkOverride(nodes);
                var text = overrideText || $.i18n('stat-kr');
                return text;
            },
            card: function(nodes) {
                if (nodes.length > 0) {
                    var idCard = parseInt(nodes[0]);
                    var text = '';
                    var overrideText = checkOverride(nodes);
                    if (overrideText === null) {
                        var quantity = 1;
                        if (nodes.length > 1) {
                            var arg = nodes[1];
                            if (!isNaN(arg)) {
                                quantity = parseInt(arg);
                            }
                        }
                        text = $.i18n('card-name-' + idCard, quantity);
                    } else {
                        text = overrideText;
                    }
                    return '{' + text + '}';
                }
            },
            quest: (nodes) => nodes.length > 0
                ? `_${checkOverride(nodes) || $.i18n(`artifact-name-${nodes[0]}`)}_`
                : ''
            ,
            mode: function(nodes) {
                if (nodes.length === 1) {
                    var mode = nodes[0];
                    var stringKey = 'game-type-' + mode.replace(/_/g, '-').toLowerCase();
                    return $.i18n(stringKey);
                }
            },
            rarity: function(nodes) {
                if (nodes.length >= 1) {
                    var rarity = nodes[0];

                    if (rarity === 'DETERMINATION') return "DT";
                    
                    return rarity;
                }
            },
            division: (_) => '',
            cosmetic: (_) => '',
            style: function(nodes) {
                return `<span class="${nodes[0]}">${nodes[1]}</span>`;
            },
            switch_left: SwitchPartHelper("Left"),
            switch_right: SwitchPartHelper("Right"),
            stats: (nodes)=>{
                if (nodes.length < 2 || nodes.length > 3) {
                    return "<span class='rainbowText'>ERROR!</span>";
                }
                return nodes.join("/");
            },
            image: (_) => '{Grand Prize}'
        });
        $('body').i18n();
        translationReady = true;
        document.dispatchEvent(translationEvent);
    });
}
function translateFromServerJson(message) {
    var jMessage = JSON.parse(message);
    if (jMessage.hasOwnProperty('args')) {
        var args = JSON.parse(jMessage.args);
        return $.i18n.apply($.i18n, args);
    }
}
function getLanguage() {
    return 'en';
}
function checkOverride(nodes) {
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i].toString();
        if (node.startsWith("override=")) {
            var splitValues = node.split('=');
            if (splitValues.length > 1) {
                return splitValues[1];
            }
        }
    }
    return null;
}
function htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}
function SwitchPartHelper(dir) {
    return (nodes) => `[[${nodes[1]}]]`
}
function StatHelper(translationClass) {
    return (nodes) => (nodes[0] ? nodes[0] + '' : '') + translationClass;
}
loadTranslation(getLanguage());
