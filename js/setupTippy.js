tippy.setDefaultProps({
    allowHTML: true
});

function setupTippy() {
    const $tippyContainer = $('<div id="tippySetup"></div>')

    $('body').append($tippyContainer)

    $tippyContainer.hide();

    var $rarity = $(`<div id="cardRarityMenu"></div>`);

    var $customRarityDiv = $(`
    <div id="custom_rarity_group" style="height: 24px;">
        <label style="max-height: 25px;">
            <img id="custom-rarity" src="./images/CUSTOM.png">
            <input id="custom-rarity-input" type="file" accept="image/*" style="display: none;">
        </label>
        <br>
    </div>`)
    $rarity.append($customRarityDiv)

    var $currentDiv = $('<div></div>')

    for (rarity in rarities) {
        var r = rarities[rarity];

        if (r != "") {
            $currentDiv.append(`<img src="./images/rarity/${r}.png" />`)
        } else {
            $rarity.append($currentDiv)

            $currentDiv = $('<div></div>')
        }
    }

    $rarity.append($currentDiv)


    var $spellSoul = $(`<div id="spellSoulMenu"></div>`)

    $spellSoul.append(`<span class="COMMON underlined">NONE</span>`)

    for (soul in souls) {
        var s = souls[soul];

        $spellSoul.append(`<span class="${s}">${s}</span>`)
    }


    var $imageType = $(`<div id="cardImageMenu"></div>`)

    $imageType.append(`
        <div><span data-image-type="standard" class="underlined">STANDARD</span> (160x90)</div>
        <div><span data-image-type="full">FULL</span> (160x230)</div>
        <div><span data-image-type="breaking">BREAKING</span> (176x246)</div>
        <hr>
        (<span title="Remove Card Image" id="removeCardImage" />) Remove Image
    `)


    var $desc = $(`<div id="cardDescInfo"></div>`);

    $desc.append(`
        <div>
            ${coloredKeywords.map((rarity) => {
                return `<span class="${rarity}">${rarity}</span>`;
            }).join(', ')}
            ,
            ${tribes.map((tribe) => {
                return !unfilteredTribes.includes(tribe)
                    ? `<span class="underlined">${tribe}</span>`
                    : null;
            }).filter((e) => e).join(', ')}
            ,
            ${keywords.map((kw) => {
                return `<span class="underlined">${kw}</span>`;
            }).join(', ')}

            <hr>
            <span>
                {Card Name} -> <span class="PATIENCE">Card Name</span>
                <br><br>
                _Keyword Name_ -> <span class="underlined">Keyword Name</span>
                <br><br>
                [[Text Here 1]] or [[Text Here 2]] ->
                <span class="SwitchHighlight_Left">Text Here 1</span>
                or
                <span class="SwitchHighlight_Right">Text Here 2</span>
            </span>
        </div>
    `);

    
    var $tribes = $(`<div id="tribesChooseMenu"></div>`)

    var $customTribe = $(`
        <label>
            <img id="custom-tribe" src="./images/CUSTOM.png">
            <input id="custom-tribe-input" type="file" accept="image/*" style="display: none;">
        </label>
    `)
    $tribes.append($customTribe)

    for (tribe in tribes) {
        var t = tribes[tribe];
        var tfil = t.toUpperCase().replaceAll(' ', '_')

        $tribes.append(
            `<img
                title="${t}"
                alt="${t}"
                src="./images/tribes/${tfil}.png"
                data-name="${tfil}"
            >`
        )
    }

    
    var $powers = $(`<div id="powersChooseMenu"></div>`)

    /*
    var $customTribe = $(`
        <label>
            <img id="custom-power" src="./images/CUSTOM.png">
            <input id="custom-power-input" type="file" accept="image/*" style="display: none;">
        </label>
    `)
    $powers.append($customTribe)
    */

    for (power in powers) {
        var pname = powers[power].name;
        var picon = powers[power].icon;
        var pcounter = powers[power].counter;

        $powers.append(
            `<img
                title="${pname}"
                alt="${pname}"
                src="./images/powers/${picon}.png"
                data-name="${picon}"
                data-counter="${pcounter}"
            >
            `
        )
    }

    $powers.append(`<div class="custom-powers-menu"></div>`)


    $tippyContainer.append(
        $rarity,
        $spellSoul,
        $imageType,
        $desc,
        $tribes,
        $powers
    )
}

setupTippy();