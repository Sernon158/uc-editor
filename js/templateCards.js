const createDefaultTemplate = (type, frame, stats=true)=>{
    var frame = localStorage.getItem('settings.autoframe') && localStorage.getItem('settings.autoframe') != "false"
                    ? localStorage.getItem('settings.autoframe') : frame;
    var name = (stats == true ? `My Card #${currentCard}` : '')
    var stat = (stats == true ? '0' : '')

    var image = (stats == true ? `
        <label>
            <input class="cardImageUploader" type="file" accept="image/*">
        </label>
    ` : '')

    var power = (stats == true ? `
        <parent data-r="0" style="right: 0px;">
            <img class="infoPowers addPower add-button-card" src="./Undercards/ADD.png">
        </parent>
    ` : '')
    var tribe = (stats == true ? `<img style="right: 0px;" data-r="0" class="tribe addTribe add-button-card" src="./Undercards/ADD.png">` : '')

    var rarity = (stats == true ? 'background: url(&quot;./Undercards/rarity/BASE_COMMON.png&quot;) no-repeat transparent;' : '')
    
    switch (type) {
        case 0: // MONSTER
            return `
                <div id="card-${currentCard}" class="card monster ${frame}-frame standard-skin col-sm-1" data-image-type="standard">
                    <div class="cardFrame"></div>
                    <div class="cardBackground"></div>
                    <div class="cardHeader"></div>
                    <div class="cardName">
                        <div style="font-size: 12px;">
                            <span>${name}</span>
                            <input class="i name" placeholder="${name}" value="${name}" oldvalue="${stat}" style="display:none;">
                        </div>
                    </div>
                    <div class="cardCost">
                        <span>${stat}</span>
                        <input class="i cost" type="number" placeholder="${stat}" oldvalue="${stat}" min="0" max="999" style="display:none;" nrvalue="1">
                    </div>
                    <div class="cardStatus">
                        ${power}
                    </div>
                    <div class="cardTribes">
                        ${tribe}
                    </div>
                    <div class="cardImage">
                        ${image}
                    </div>
                    <div class="cardDesc">
                        <div style="font-size: 12px;">
                            <span></span>
                            <textarea style="display:none;" oldvalue="${stat}"></textarea>
                        </div>
                    </div>
                    <div class="cardFooter"></div>
                    <div class="cardATK">
                        <span>${stat}</span>
                        <input class="i atk" type="number" placeholder="${stat}" oldvalue="${stat}" min="0" max="999" style="display:none;" nrvalue="1">
                    </div>
                    <div class="cardRarity" style="${rarity}"></div>
                    <div class="cardHP">
                        <span>${stat}</span>
                        <input class="i hp" type="number" placeholder="${stat}" oldvalue="${stat}" min="0" max="999" style="display:none;" nrvalue="1">
                    </div>
                </div>
            `
        
        case 1: // SPELL
            return `
                <div id="card-${currentCard}" class="card spell ${frame}-frame standard-skin col-sm-1">
                    <div class="cardFrame"></div>
                    <div class="cardBackground"></div>
                    <div class="cardHeader"></div>
                    <div class="cardName">
                        <div style="font-size: 12px;">
                            <span>${name}</span>
                            <input class="i name" placeholder="${name}" value="${name}" oldvalue="${stat}" style="display:none;" oldvalue="">
                        </div>
                    </div>
                    <div class="cardCost">
                        <span>${stat}</span>
                        <input class="i cost" type="number" placeholder="${stat}" oldvalue="${stat}" min="0" max="999" style="display:none;" nrvalue="1">
                    </div>
                    <div class="cardStatus">
                        ${power}
                    </div>
                    <div class="cardTribes">
                        ${tribe}
                    </div>
                    <div class="cardImage">
                        ${image}
                    </div>
                    <div class="cardDesc">
                        <div style="font-size: 12px;">
                            <span></span>
                            <textarea style="display:none;"oldvalue="${stat}"></textarea>
                        </div>
                    </div>
                    <div class="cardFooter"></div>
                    <div class="cardRarity" style="${rarity}"></div>
                </div>
            `
        case 99: // CUSTOM TYPE: ENCHANT
            return `
                <div id="card-${currentCard}" class="card enchant undertale-frame full-skin col-sm-1">
                    <div class="cardFrame"></div>
                    <div class="cardBackground"></div>
                    <div class="cardHeader"></div>
                    <div class="cardName">
                        <div style="font-size: 12px;">
                            <span>${name}</span>
                            <input class="i name" placeholder="${name}" value="${name}" oldvalue="${stat}" style="display:none;" oldvalue="">
                        </div>
                    </div>
                    <span class="cardImageTip">Change image here</span>
                    <div class="cardImage">
                        ${image}
                    </div>
                    <div class="cardDesc">
                        <div style="font-size: 12px;">
                            <span></span>
                            <textarea style="display:none;" oldvalue="${stat}"></textarea>
                        </div>
                    </div>
                </div>
            `
    }
}


const createArtifactTemplate = ()=>{
    const name = `My Artifact #${currentArtifact}`;

    return `
    <div id="artifact-${currentArtifact}" class="artifact common">
        <div class="artifactHeader">
            <div class="artifactImage">
                <label>
                    <input class="cardImageUploader" type="file" accept="image/*">
                    <img src="./Undercards/Empty.png">
                </label>
            </div>
            <div class="artifactName">
                <span>${name}</span>
                <input class="i name" placeholder="${name}" value="${name}" style="display:none;" oldvalue="" nrvalue="2">
            </div>
            <div class="artifactRarity">
                <span>COMMON</span>
                <select oldvalue="" style="display:none;">
                    <option class="COMMON">COMMON</option>
                    <option class="LEGENDARY">LEGENDARY</option>
                    <option class="TOKEN">TOKEN</option>
                    <!--<option class="UNDEFINED">UNDEFINED</option>-->
                </select>
            </div>
        </div>
        <div class="artifactDesc" style="font-size: 12px;">
            <span></span>
            <textarea style="display:none;"></textarea>
        </div>
    </div>
`
}