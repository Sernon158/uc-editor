    /*for (var i = 0; i < tribes.length; i++) {
        const tribe = tribes[i];

        const pluralTribeRegex = new RegExp(`(${tribe}s)(?=[\\s.,:]|$)`, 'g');
        const tribeRegex = new RegExp(`${tribe}(?=[\\s.,:]|$)`, 'g');

        txt = txt.replaceAll(pluralTribeRegex, `<span class="underlined">${tribe}s</span>`);
        txt = txt.replaceAll(tribeRegex, `<span class="underlined">${tribe}</span>`);
    }

    for (var i = 0; i < keywords.length; i++) {
        const kw = keywords[i];

        const ukwRegex = new RegExp(`${kw}(?=[\\s.,:]|$)`, 'g');

        txt = txt.replaceAll(ukwRegex, `<span class="underlined">${kw}</span>`)
    }

    for (var i = 0; i < coloredKeywords.length; i++) {
        const ckw = coloredKeywords[i];

        const ckwRegex = new RegExp(`${ckw}(?=[\\s.,:]|$)`, 'g');

        txt = txt.replaceAll(ckwRegex, `<span class="${ckw}">${ckw}</span>`)
    }

    return txt;*/