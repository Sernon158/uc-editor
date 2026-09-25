const autosaveUpdateTime = 1; // SECONDS
const EMPTY_GROUP = {
    name: "My Group",
    artifacts: [],
    cards: []
};

const oldLink = "https://uc-editor.vercel.app/";

/**
 * Removes old editor links from an image link or css background image.
 */
function imgSrc(src) {
    const startsWith = (str) => src.startsWith("url(\""+str) || str.startsWith(str);

    if (src && startsWith(oldLink))
        src = src.replace(oldLink, "./");
    
    if (src && startsWith("./Undercards/"))
        src = src.replace("./Undercards/", "./images/");

    return src
}

function loadSave(groupId, json, baseAutosaveLoad = false) {
    if (json === null) return false;

    if (groupId !== 0 && baseAutosaveLoad)
        createNewGroup();

    getGroup(groupId).find(".group-name span")
        .text(json.name);

    for (const artifact of json.artifacts) loadArtifact(groupId, artifact);
    for (const card of json.cards) loadCard(groupId, card);
}

function loadArtifact(groupId, artifact) {
    let $artifact = createArtifact(groupId);

    const $artifactImage = $artifact.find('.artifactImage label img');
    const $artifactName = $artifact.find('.artifactName span');
    const $artifactRarity = $artifact.find('.artifactRarity select');
    const $artifactRaritySpan = $artifact.find('.artifactRarity span');
    const $artifactDescTextarea = $artifact.find('.artifactDesc textarea');

    $artifactImage.attr('src', imgSrc(artifact.image));
    $artifactName.text(artifact.name);

    $artifactRarity.val(artifact.rarity);
    $artifactRaritySpan.text(artifact.rarity);

    if (artifact.rarityHidden) {
        $artifactRarity.hide();
    }

    $artifact.attr("class", `artifact ${artifact.rarity.toLowerCase()}`)

    $artifactDescTextarea.text(artifact.desc).trigger('blur');
}

function loadCard(groupId, card) {
    if (card.cardType === 99) {
        card.frame = "undertale";
        card.imageType = "full";
        card.powers = [];
        card.tribes = [];
    }

    let $card = createCard(groupId, card.cardType, card.frame ?? "undertale");

    let isMonster = card.cardType === 0;
    let isSpell = card.cardType === 1;

    const $cardName = $card.find('.cardName div input');
    const $cardCost = $card.find('.cardCost span');
    const $cardATK = $card.find('.cardATK span');
    const $cardHP = $card.find('.cardHP span');
    const $cardImage = $card.find('.cardImage');
    const $cardTribes = $card.find('.cardTribes');
    const $cardDescTextarea = $card.find('.cardDesc textarea');
    const $cardRarity = $card.find('.cardRarity')


    $card.attr('data-autosave-card', true);

    $cardName.attr('value', card.name).trigger('blur');

    if (isSpell) {
        $cardName.addClass(card.spellSoul);
        $cardCost.text(card.stats);
    }
    
    if (isMonster) {
        $cardCost.text(card.stats[0]);
        $cardATK.text(card.stats[1]);
        $cardHP.text(card.stats[2]);
    }

    $cardImage.css({
        'background-image': imgSrc(card.image),
        'background-repeat': 'no-repeat',
        'background-color': 'transparent',
    });

    $card.removeClass('standard-skin full-skin breaking-skin')
    $card.addClass(card.imageType + '-skin')

    card.powers.map((power) => {
        addCardPower($card, {
            custom: power.custom,
            name: power.name,
            counter: power.counter,
            src: power.src
        });
    });

    for (var e = 0; e < card.tribes.length; e++) {
        const tribe = card.tribes[e];

        const right = 20 + (e * 20);

        const $tribe = $(`
            <img
                style="right: ${right}px"
                data-r="${right}px"
                class="tribe"
                src="${tribe.src}"
                ${tribe.custom
                    ? `data-tribe-custom="true"`
                    : `data-tribe-name="${tribe.name}"`
                }
                onclick="removeCardTribe($(this))"
            >
        `);

        $cardTribes.append($tribe)
    };

    $cardDescTextarea.val(card.desc).trigger('blur');

    $cardRarity.css({
        'background-image': imgSrc(card.rarity),
        'background-repeat': 'no-repeat',
        'background-color': 'transparent',
        'background-position': card.isRarityCustom ? 'center' : 'unset',
        'background-size': card.isRarityCustom ? 'contain' : 'unset'
    });

    $cardRarity.attr('data-custom-rarity', card.isRarityCustom);
}

function updateAutosave() {
    let fullSave = [];

    $('main > div[data-group-id]').each(function() {
        let save = structuredClone(EMPTY_GROUP);

        // Group \\
        let $groupName = $(this).find(".group-name span");

        save.name = $groupName.html();

        // Artifacts \\
        let $artifacts = $(this).find(".artifact-collection div.artifact");

        $artifacts.each(function() {
            let $a = $(this);

            save.artifacts.push({
                "image": $a.find('.artifactImage label img').attr('src'),
                "name": $a.find('.artifactName span').text(),
                "rarity": $a.find('.artifactRarity select').val() || 'COMMON',
                "rarityHidden": $a.find('.artifactRarity').is(":hidden"),
                "desc": $a.find('.artifactDesc textarea').val()
            });
        });

        // Cards \\
        let $cards = $(this).find(".collection div.card");

        $cards.each(function() {
            let $c = $(this);

            let cardType =
                  $c.is('.monster') ? 0
                : $c.is('.spell')   ? 1
                : $c.is('.enchant') ? 99
                : -1;

            const isMonster = cardType === 0;
            const isSpell   = cardType === 1;
            const isEnchant = cardType === 99;

            const ifMonster    = (d) => isMonster  ? d : null;
            const ifSpell      = (d) => isSpell    ? d : null;
            const ifNotEnchant = (d) => !isEnchant ? d : null;

            if (cardType === -1) return;

            save.cards.push({
                "cardType": cardType,
                "id": $c.attr('id').replace('card-', ''),
                "frame": ifNotEnchant(frames.find(frame => $c.hasClass(`${frame}-frame`))),
                "name": $c.find('.cardName div span').text(),
                "spellSoul": ifSpell(souls.find(soul => $c.find('.cardName div span').hasClass(soul)) || null),
                "stats": ifNotEnchant(isMonster
                    ? [parseInt($c.find('.cardCost span').text()), parseInt($c.find('.cardATK span').text()), parseInt($c.find('.cardHP span').text())]
                    : parseInt($c.find('.cardCost span').text())
                ),
                "image": $c.find('.cardImage').css('background-image'),
                "imageType": ifNotEnchant(['standard', 'full', 'breaking'].find((t) => {
                    return $c.hasClass(`${t}-skin`) ? t : false
                })),
                "powers": ifNotEnchant((function() {
                    var powers = [];

                    $c.find(`.cardStatus parent`).each(function() {
                        const img = $(this).find('img');
                        const span = $(this).find('span');

                        if (!img.hasClass('addPower')) {
                            powers.push({
                                custom: ($(this).attr('data-power-custom') == "true"),
                                name: $(this).attr('data-power-name'),
                                counter: !span.is(":hidden") ? parseInt(span.text()) : false,
                                src: img.attr('src')
                            });
                        }
                    });

                    return powers;
                })()),
                "tribes": ifNotEnchant((function() {
                    var tribes = [];

                    $c.find(`.cardTribes > img`).each(function() {
                        if (!$(this).hasClass('addTribe')) {
                            tribes.push({
                                custom: $(this).attr('data-tribe-custom') || false,
                                name: $(this).attr('data-tribe-name'),
                                src: $(this).attr('src')
                            });
                        }
                    });

                    return tribes;
                })()),
                "desc": $c.find('.cardDesc div textarea').val(),
                "rarity": ifNotEnchant($c.find('.cardRarity').css('background-image')),
                "isRarityCustom": ifNotEnchant($c.find('.cardRarity').attr('data-custom-rarity') == "true")
            });
        });

        fullSave.push(save);
    });

    // SAVE \\
    localStorage.setItem("autosave", JSON.stringify(fullSave))
}

function encodeSave(str) {
    const encoder = new TextEncoder();
    const utf8Bytes = encoder.encode(str);

    return Array.from(utf8Bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function decodeSave(hexString) {
    const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const decoder = new TextDecoder('utf-8');
    
    return JSON.parse(decoder.decode(byteArray));
}

function loadAutosave() {
    try {
        let autosave = JSON.parse(localStorage.getItem("autosave"));

        // Automatically convert old autosaves into new autosaves.
        if (!Array.isArray(autosave)) {
            console.warn("[Autosave] Detected old autosave from pre-v28, converting to new...");
            localStorage.setItem("autosave-pre-v28-backup", JSON.stringify(autosave));
            autosave = [autosave];
        }

        for (const [id, group] of Object.entries(autosave)) {
            loadSave(Number(id), group, true);
        }

        return true;

    } catch (e) { return e; }
}

/*function encodeSave(str) {
    var result = "";

    for (var i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16);
    }

    return result;
}

function decodeSave(code) {
    var result = "";

    for (var i = 0; i < code.length; i += 2) {
        result += String.fromCharCode(parseInt(code.substr(i, 2), 16));
    }

    return JSON.parse(result);
}*/

setInterval(()=>{
    if (autosaveLoad && autosaveLoad == true) {
        updateAutosave();
    }
}, autosaveUpdateTime * 1000)