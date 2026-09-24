const $openTemplates = $('#open-templates');

let lastTemplateUpdate = "Not specified";
let currTemplateType = "cards";

updateTemplateData();

function updateTemplateData() {
    lastTemplateUpdate = "September 9th, 2026";
}

function openTemplatesMenu(groupId) {
    const cards = getCardTemplatesHTML(groupId);

    BootstrapDialog.show({
        title: `Create From Template`,
        closable: false,
        message: `
            <div id="templates-menu">
                <div style="margin-bottom:10px">Last Updated: ${lastTemplateUpdate}.</div>
                <div id="template-type-selector">
                    <div data-type="cards" data-selected>Cards</div>
                    <div data-type="artifacts">Artifacts</div>
                    <div data-type="enchantments">Enchantments</div>
                </div>
                <input id="template-searcher" placeholder="Search for cards..." onkeyup="updateTemplateSearch(${groupId}, this.value);">
                <div id="template-list">
                    ${cards || 'There was an error loading the cards. Please try again'}
                </div>
            </div>
        `,
        buttons: [{
            label: 'Close',
            cssClass: 'btn-danger',
            action: function (dialog) {
                dialog.close()
            }
        }],
        onshown: function (dialog) {
            currentDialog = dialog;
            currTemplateType = "cards";

            $('#template-type-selector > div').on('click', function() {
                if ($(this).data('selected') === '') return;

                $(this).siblings('[data-selected]').removeAttr('data-selected');
                $(this).attr('data-selected', '');

                const type = $(this).data('type');
                currTemplateType = type;

                $('#template-list').html();
                $('#template-searcher').attr('placeholder', `Search for ${type}...`);

                updateTemplateSearch(groupId, "");
            });
        },
        onhide: resetDialog()
    });
}

function getCardTemplatesHTML(groupId, list = allCards) {
    var i = -1;

    const cards = list.map((card) => {
        i++;
        if (!card?.name) return "";

        return `
            <div class="card-display" onclick="buildCardTemplate(${groupId}, this.dataset.i); currentDialog.close();" data-i="${i}">
                <img src="./images/cards/${card.image || "Blank"}.png" width="160" height="90" loading="lazy">
                <span>${card.name}</span>
            </div>
        `;
    }).join('');

    return cards;
}

function getArtifactTemplatesHTML(groupId, list = allArtifacts) {
    var i = -1;

    const artifacts = list.map((art) => {
        i++;
        if (!art?.name) return "";

        return `
            <div class="card-display" onclick="buildArtifactTemplate(${groupId}, this.dataset.i); currentDialog.close();" data-i="${i}">
                <img src="./images/artifacts/${art.image || "Blank"}.png" width="64" height="64" loading="lazy">
                <span>${art.name}</span>
            </div>
        `;
    }).join('');

    return artifacts;
}

function getEnchantTemplatesHTML(groupId, list = allEnchants) {
    var i = -1;

    const artifacts = list.map((ench) => {
        i++;
        if (!ench) return "";

        return `
            <div class="card-display" onclick="buildEnchantTemplate(${groupId}, this.dataset.i); currentDialog.close();" data-i="${i}">
                <img src="./images/enchants/${ench.replace(' ', '') || "Blank"}.png" width="110" height="125" loading="lazy">
                <span>${ench}</span>
            </div>
        `;
    }).join('');

    return artifacts;
}

function getEnchantTypeFunc() {
    switch (currTemplateType) {
        case "cards":        return getCardTemplatesHTML;
        case "artifacts":    return getArtifactTemplatesHTML;
        case "enchantments": return getEnchantTemplatesHTML;
    }
}

function updateTemplateSearch(groupId, value) {
    const type = currTemplateType;
    const func = getEnchantTypeFunc();

    let list = 
          type === "cards"         ? allCards
        : type === "artifacts"     ? allArtifacts
        : type === "enchantments"  ? allEnchants
        : [];

    if (value) {
        list = list.map(it =>
            (it.name ?? it).toLowerCase().includes(value.toLowerCase())
                ? it
                : null
        );
    }

    let items = func(groupId, list);

    $('#template-list').html(
          items.length === 0 && !value ? "There was an error loading the templates. Please try again later."
        : items.length === 0 && value  ? `No ${type} found.`
        : items
    );
}

function buildCardTemplate(groupId, i) {
    const card = allCards[i];
    let $card = createCard(groupId, card.typeCard, "undertale");

    const $cardTribes = $card.find('.cardTribes');
    const $cardDesc = $card.find('.cardDesc div');
    const $cardDescTextarea = $cardDesc.find('textarea');

    $card.find('.cardName input').attr('value', card.name).trigger('blur');
    $card.find('.cardName *').addClass(card.soul?.name || '')

    $card.find('.cardCost span').html(card.cost);
    $card.find('.cardImage').css({
        'background-image': `url("./images/cards/${card.image}.png")`,
        'background-repeat': 'no-repeat',
        'background-color': 'transparent'
    });

    // Consistency name because onu randomly changed name from powers to statuses...
    let cardPowers = card.statuses;

    let hasDTPower = cardPowers.some((p) => p.name === "determination");

    // If card is determination rarity and card doesn't
    // have it already, add determination power.
    if (!hasDTPower && card.rarity.endsWith("DETERMINATION")) {
        addCardPower($card, {
            custom: false,
            name: "determination",
            counter: false,
            src: null
        });
    }

    cardPowers.forEach((cardPower) => {
        console.log(cardPower);
        // This is because onu randomly decided to make powers start with
        // an uppercase, and I can only do this without breaking everything
        // else in the editor, including every single old saved group.
        // So yeah, awesome, thank you onu.
        let powerIconName = cardPower.name.toLowerCase();

        let power = powers.find((p) => p.icon === powerIconName);
        let counter = power.counter ? cardPower.counter : false;

        addCardPower($card, {
            custom: false,
            name: power.icon,
            counter,
            src: null
        });
    });
    
    card.tribes.map((tribe) => {
        var rightPx = parseInt($cardTribes.children('img').last().attr('data-r')) + 20;

        $cardTribes.append(`
        <img
            style="right: ${rightPx}px;"
            data-r="${rightPx}"
            class="tribe"
            src="./images/tribes/${tribe}.png"
            data-tribe-name="${tribe}"
            onclick="removeCardTribe($(this))"
        >
    `)
    });

    const desc = $.i18n(`card-${card.id}`);
    $cardDescTextarea.val(desc).trigger('blur');
    
    $card.find('.cardATK span').html(card.attack);
    $card.find('.cardRarity').css({
        'background-image': `url("./images/rarity/${card.extension}_${card.rarity}.png")`,
        'background-repeat': 'no-repeat',
        'background-color': 'transparent'
    });
    $card.find('.cardHP span').html(card.hp);
}

function buildArtifactTemplate(groupId, i) {
    const art = allArtifacts[i];
    const $art = createArtifact(groupId);

    const artRarity =
          art.unavailable ? "TOKEN"
        : art.legendary   ? "LEGENDARY"
        : "COMMON"

    $art.find('.artifactImage img').attr('src', `./images/artifacts/${art.image}.png`);
    $art.find('.artifactName span').text(art.name);
    $art.find('.artifactRarity select').val(artRarity).trigger('change');
    $art.find('.artifactDesc textarea').text($.i18n(`artifact-${art.id}`)).trigger('blur');
}

function buildEnchantTemplate(groupId, i) {
    const enchName = allEnchants[i];
    let $card = createCard(groupId, 99, "undertale");

    $card.find('.cardName input').attr('value', enchName).trigger('blur');

    $card.find('.cardImage').css({
        'background-image': `url("./images/enchants/${enchName.replace(' ', '')}.png")`,
        'background-repeat': 'no-repeat',
        'background-color': 'transparent'
    });

    const desc = $.i18n(`enchant-${enchName.replace(' ', '-').toLowerCase()}-desc`);
    $card.find('.cardDesc textarea').val(desc).trigger('blur');
}