function getResizedFontSize($container, maxHeight, $textarea, fontSize=12) {

    var $input = $textarea || $container.find('input');

    var oldValue = $input.attr('oldvalue') == null
        ? $container.attr('oldvalue')
        : $input.attr('oldvalue');

    if (oldValue.length != $input.val().length) {

        var max = 12;

        var i = 0;

        $container.parent().attr('data-resize-text-container', true);

        var $tempCard = $container.closest('.card').clone().removeAttr('id');
        var $clonedContainer;

        if ($tempCard.length > 0) {
            $tempCard.appendTo('body');
            $clonedContainer = $tempCard.find('[data-resize-text-container="true"]');
        } else {
            $clonedContainer = $container.parent().clone();
            $clonedContainer.appendTo('body');
        }

        var $clonedContainerDiv = $clonedContainer.find('div');

        $clonedContainerDiv.find('textarea').remove();

        $clonedContainerDiv.css('font-size', fontSize + 'px');

        while (i < max && $clonedContainerDiv.height() >= maxHeight) {

            console.log($clonedContainerDiv.height(), maxHeight);
            fontSize -= 0.5;
            $clonedContainerDiv.css('font-size', fontSize + 'px');
            i++;
        }

        $clonedContainer.remove();
        $tempCard.remove();
        $container.parent().removeAttr('data-resize-text-container');

        return fontSize;
    } else {
        return;
    }
}

function applyDescFilters(txt) {
    txt = " " + txt;

    const charsBefore = `(?<=\\s|[-\\(\\[]{1,2})`;
    const charsAfter = `(?=[\\s.,:\\)\\]]{1,2}|$)`;

    const underlineRegex = /_([^{}_]+)_/g;
    const highlightRegex = /{([^{}_]+)}/g;
    const switchRegex = /\[\[([^[\]]*?)\]\]/g;
    const statRegex = /(?:^|\b)([+-]?\d+)\/([+-]?\d+)(?:\/([+-]?\d+))?(?=\b|$)/g;

    let switchCounter = 0;

    txt = txt
            .replace(underlineRegex, (_, $1) => `<span class="underlined">${$1}</span>`)
            .replace(highlightRegex, (_, $1) => `<span class="PATIENCE">${$1}</span>`)

    for (var i = 0; i < tribes.length; i++) {
        const tribe = tribes[i];

        if (!unfilteredTribes.find((t) => t == tribe)) {

            const pluralTribeRegex = new RegExp(`(${charsBefore})(${tribe}s)(${charsAfter})`, 'g');
            const tribeRegex = new RegExp(`(${charsBefore})(${tribe})(${charsAfter})`, 'g');

            txt = txt.replaceAll(pluralTribeRegex, `<span class="underlined">${tribe}s</span>`);
            txt = txt.replaceAll(tribeRegex, `<span class="underlined">${tribe}</span>`);
        }
    }

    for (var i = 0; i < keywords.length; i++) {
        const kw = keywords[i];

        const ukwRegex = new RegExp(`(${charsBefore})${kw}(${charsAfter})`, 'g');

        txt = txt.replaceAll(ukwRegex, `<span class="underlined">${kw}</span>`)
    }

    for (var i = 0; i < coloredKeywords.length; i++) {
        const ckw = coloredKeywords[i];

        const ckwRegex = new RegExp(`(${charsBefore})${ckw}(${charsAfter})`, 'g');

        txt = txt.replaceAll(ckwRegex, `<span class="${ckw}">${ckw}</span>`)
    }

    txt = txt.replace(switchRegex, (_, $1) => {
        switchCounter++;

        if (switchCounter % 2 === 1) {
            return `<span class="SwitchHighlight_Left">${$1}</span>`;
        } else {
            return `<span class="SwitchHighlight_Right">${$1}</span>`;
        }
    });

    if (localStorage.getItem('settings.statcolors') !== "false") {
        txt = txt.replace(statRegex, (_, ...args) => {
            let returnList = [];
            let list = ["ATK", "HP"];
            if (args[2] !== undefined) list = ["cost", "ATK", "HP"];

            for (let i = 0; i < list.length; i++) {
                const arg = args[i];
                const char = arg[0] === '+' || arg[0] === '-' ? arg[0] : '';
                const color = `${char}<span class="${list[i]}">${Math.abs(parseInt(arg))}</span>`
                returnList.push(color);
            }

            return returnList.join('/');
        });
    }

    return txt;
}

function documentReady() {
    return new Promise((resolve) => {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", resolve);
        } else {
            resolve();
        }
    });
}