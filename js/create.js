function createCard(groupId, cardType, frame) {
    let card = createDefaultTemplate(cardType, frame);

    let $card = $(card);

    $card.contextmenu(openCardMenu);

    getGroup(groupId).find('.collection').append($card);

    setupCardInputs($card);
    setupCardInteractions(currentCard);
    setupCardTippy(currentCard, cardType);

    currentCard++;

    if (dragModeEnabledGroups.includes(groupId)) {
        $card.attr('draggable', true);
        $card.find('*').attr('draggable', false);
    }

    return $card
}

function createCardDialog(groupId, cardType) {
    type = "Card"

    switch (cardType) {
        case 0: type = "Monster"; break;
        case 1: type = "Spell"; break;
        case 99: type = "Enchant"; break;
    }

    if (type === "Enchant")
        return createCard(groupId, 99, "undertale");

    $('#dialog-frames-list').livequery(function () {
        tippy("#frame-custom", {
            content: "Custom Frame"
        });

        for (frame in frames) {
            const f = frames[frame]

            const template = createDefaultTemplate(cardType, f, false)
    
            const $template = $(template)
    
            $template.attr('id', `frame-${frame}`)
            $template.attr('card_type', cardType)
            $template.attr('frame_name', f)
            $template.click((event)=>{
                e = $(event.currentTarget)

                currentDialog.close()

                createCard(groupId, Number(e.attr("card_type")), e.attr("frame_name"))
            });
    
            $(this).find('#frame-collection').append($template)

            const frameName = f.toLowerCase().replace(/(?:^|\s|-)\w/g, match => match.toUpperCase()).replaceAll('-', ' ');

            tippy(`#${$template.attr('id')}`, {
                content: `${frameName} Frame`
            })
        }

        $('#dialog-frames-list').expire()
    })

    if (localStorage.getItem('settings.defaultframe') == "false") {
        createFrameDialog();

    } else {
        createCard(groupId, cardType, localStorage.getItem('settings.defaultframe'))
    }
}

function createFrameDialog() {
    BootstrapDialog.show({
        title: `Create ${type}`,
        message: `Choose a frame for the card. \n
        <div id="dialog-frames-list">
            <div id="frame-collection"></div>
            <!--
            <div id="frame-custom" class="card standard-skin col-sm-1">
                <div class="cardDesc">
                    <span style="font-size: 16px;">Click here to import your custom frame!</span><hr>
                    <span style="font-size: 13px;">Recommended Size: <u>176x246</u></span>
                </div>
            </div>
            -->
        </div>`,
        closable: false,
        buttons: [{
            label: 'Close',
            cssClass: 'btn-danger',
            action: function (dialog) {
                dialog.close()
            }
        }],
        onshown: function (dialog) {
            currentDialog = dialog;
        },
        onhide: resetDialog()
    });
}

function setupCardInputs($card) {
    setInput($card.find('.cardName div'))
    setInput($card.find('.cardCost'))
    setInput($card.find('.cardATK'))
    setInput($card.find('.cardHP'))
    setCardDescriptionInput($card)
}

function setCardDescriptionInput($card) {
    var $Textarea = $card.find('.cardDesc div textarea')
    var $Span = $card.find('.cardDesc div span')

    var $Desc = $Span.parent();

    $Desc.click(function() {
        $Span.hide();
        $Textarea.show();

        $Textarea.focus();
    });

    $Textarea.focusout(function() {
        $Textarea.hide();
        $Span.show();

        $Desc.attr("oldvalue", $Span.html());

        $Span.html(applyDescFilters($Textarea.val()));

        var fontSize = $card.is('.enchant') ? 184 : 81;

        var newFontSize = getResizedFontSize($Desc, fontSize, $Textarea);

        $Desc.css('font-size', newFontSize || $Textarea.css('font-size'));
    });
}

function setupCardInteractions(cardID) {
    var $card = $(`#card-${cardID}`);

    $card.find('.cardName div input').focusout(function() {
        cn = $(this).parent()

        cn.css('font-size', getResizedFontSize(cn, 25) || cn.css('font-size'));
    });

    $card.find('.cardImage input').change(function() {
        var file = this.files[0];
        var reader = new FileReader();

        var $t = $(this);

        var $cardImage = $t.closest('.cardImage')

        if (file) {
          reader.readAsDataURL(file);
          reader.onloadend = function () {
            $cardImage.css({
                'background-image': `url("${reader.result}")`,
                'background-repeat': 'no-repeat',
                'background-color': 'transparent'
            });
            $t.val('');
          }
        }
    });
}

function setupCardTippy(cardID, cardType) {
    if (cardType == 1) {
        tippy(`#card-${cardID} .cardName input`, {
            trigger: 'focus',
            interactive: true,
            placement: 'right-start',
            content: `<span class="center soulChooseSpan">Choose a Soul:</span><hr>
            <div id="spellSoulMenu">${$('#spellSoulMenu').html()}</div>`,
            duration: 150,
            onMount(e) {
                currentTippy = e;

                $(e.popper).find('.underlined').removeClass('underlined')

                $(e.popper).find('#spellSoulMenu span').each(function() {
                    const $current = $(this);
                    const $cardName = $(this).closest('.card').find('.cardName > div');

                    if ($cardName.hasClass($current.html())) {
                        $current.siblings('.underlined').removeClass('underlined')

                        $current.addClass('underlined')
                    }
                });
            },
            onCreate(e) {
                $(e.popper).find('#spellSoulMenu span').each(function() {
                    $(this).click(function() {
                        var $soul = $(this);

                        $soul.siblings('.underlined').removeClass('underlined')

                        $soul.addClass('underlined')

                        var name = $soul.html();

                        var $cardName = $soul.closest('.card').find('.cardName > div > span');
                        var $cardNameInput = $soul.closest('.card').find('.cardName > div > input');

                        if (name == "NONE") {
                            $cardName.attr('class', '');
                            $cardNameInput.attr('class', '');
                        } else {
                            $cardName.attr('class', name);
                            $cardNameInput.attr('class', `i name ${name}`);
                        }
                    })
                })
            }
        });
    }

    tippy(`#card-${cardID} .cardImage`, {
        interactive: true,
        placement: 'right-start',
        content: `<span style="font-size: 11px;">Choose an image type:</span><hr>
        <div id="cardImageMenu" ${cardType === 99 ? "data-enchant" : ''}>
            ${cardType === 99 ? `<div><span data-image-type="enchant" class="underlined">ENCHANT</span> (220x250)</div>` : ''}
            ${$('#cardImageMenu').html()}
        </div>`,
        duration: 150,
        onCreate(e) {
            currentTippy = e;

            if (cardType === 99) return;
            
            $(e.popper).find('#removeCardImage').click(function() {
                var $cardImage = $(this).closest('.card').find('.cardImage');

                $cardImage.css('background-image', '');
                $cardImage.find('label input').val('');
            });

            $(e.popper).find('#cardImageMenu > div > span').each(function() {
                $(this).click(function() {
                    var $type = $(this);

                    $type.parent().siblings().find('.underlined').removeClass('underlined')

                    $type.addClass('underlined')

                    var cardType = $type.attr('data-image-type')

                    var $card = $type.closest('.card')

                    $card.removeClass(`${$card.attr('data-image-type')}-skin`)
                    $card.attr('data-image-type', cardType)
                    $card.addClass(`${cardType}-skin`)
                })
            })
        }
    });

    tippy(`#card-${cardID} .cardStatus .addPower`, {
        interactive: true,
        placement: 'right-start',
        content: `
            <span class="center soulChooseSpan">Choose Powers:</span>
            <hr>
            <div id="powersChooseMenu">${$('#powersChooseMenu').html()}</div>
            <hr>
            <small>→ Click again on the powers selected to remove them.</small><br>
            <small>
                → Click on the power icons on the card to add a counter, right click to remove a counter and middle click to fully remove the counter.
            </small>
        `,
        duration: 150,
        onMount(e) {
            const $pcm = $(e.popper).find('#powersChooseMenu');
            const $s = $(e.popper).closest('.card').find('.cardStatus');

            $s.children('parent').each(function() {
                const $p = $(this);

                if ($p.attr('data-power-custom')) {
                    const src = $p.find('img').attr('src');

                    const $element = $(`
                        <img
                            class="selected"
                            title="Custom Power"
                            alt="Custom Power"
                            src="${src}"
                            data-custom-power="true"
                        >
                    `)

                    if ($pcm.find(`[src="${src}"]`).length < 1) {
                        const $e = $pcm.find('.custom-powers-menu').append($element);

                        $e.click(function() {
                            const $power = $(this);
                            const $card = $power.closest('.card');
                            const $cardPower = $card.find('.cardStatus');
                        
                            if ($power.hasClass('selected')) {
                                $power.removeClass('selected');
                                var $powerRemoved = $cardPower.find(`parent[src="${src}"]`);
                        
                                $powerRemoved.nextAll('parent').each(function() {
                                    const $p = $(this);
                                    const $img = $(this).find('img');
                        
                                    var newRight = $p.attr('data-r');
                                    newRight = parseInt(newRight) - 20;
                        
                                    if (!$img.hasClass('addPower')) {
                                        $p.attr('data-r', newRight)
                                        $p.css('right', newRight + 'px')
                                    }
                                });
                        
                                $powerRemoved.remove();
                        
                            } else {
                                $power.addClass('selected');
                        
                                addCardPower($card, {
                                    custom: true,
                                    name: null,
                                    counter: ($power.attr('data-counter') == "true"),
                                    src: $power.attr('src')
                                })
                            }
                        });
                    }
                }

                $pcm.children('img').each(function() {
                    const $power = $(this);

                    if ($power.attr('data-name') == $p.attr('data-power-name')) {
                        $power.addClass('selected')
                    }
                });
            });
        },
        onCreate(e) {
            currentTippy = e;

            $(e.popper).find('#custom-power-input').change(function() {
                var file = this.files[0];
                var reader = new FileReader();

                const $input = $(this);
            
                if (file) {
                    reader.readAsDataURL(file);
                    reader.onloadend = function () {
                        const $power = $input.parent();

                        const $card = $power.closest('.card');
                        
                        addCardPower($card, {
                            custom: true,
                            name: null,
                            counter: false,
                            src: reader.result
                        });

                        $input.val('');
                    }
                }
            });
            
            $(e.popper).find('#powersChooseMenu img').click(function() {
                const $power = $(this);
                const $card = $power.closest('.card');
                const $cardPower = $card.find('.cardStatus');
            
                const powerName = $power.attr('data-name');
            
                if ($power.hasClass('selected')) {
                    $power.removeClass('selected');
                    var $powerRemoved = $cardPower.find(`parent[data-power-name="${powerName}"]`);
            
                    $powerRemoved.nextAll('parent').each(function() {
                        const $p = $(this);
                        const $img = $(this).find('img');
            
                        var newRight = $p.attr('data-r');
                        newRight = parseInt(newRight) - 20;
            
                        if (!$img.hasClass('addPower')) {
                            $p.attr('data-r', newRight)
                            $p.css('right', newRight + 'px')
                        }
                    });
            
                    $powerRemoved.remove();
            
                } else {
                    $power.addClass('selected');
            
                    addCardPower($card, {
                        custom: false,
                        name: $power.attr('data-name'),
                        counter: ($power.attr('data-counter') == "true"),
                        src: null
                    })
                }
            });
        }
    });

    tippy(`#card-${cardID} .cardTribes .addTribe`, {
        interactive: true,
        placement: 'right-start',
        content: `
            <span class="center soulChooseSpan">Choose Tribes:</span>
            <hr>
            <div id="tribesChooseMenu">${$('#tribesChooseMenu').html()}</div>
            <hr>
            <small>→ Click on the tribe icons in the card to remove them.</small>
        `,
        duration: 150,
        onCreate(e) {
            currentTippy = e;

            $(e.popper).find('#custom-tribe-input').change(function() {
                var file = this.files[0];
                var reader = new FileReader();

                const $input = $(this);
            
                if (file) {
                    reader.readAsDataURL(file);
                    reader.onloadend = function () {
                        const $tribe = $input.parent();

                        const $cardTribe = $tribe.closest('.card').find('.cardTribes');
        
                        const tribeName = $tribe.attr('data-name');
                        var rightPx = $cardTribe.children('img').last().attr('data-r');
                        rightPx = parseInt(rightPx) + 20;
        
                        const $element = `
                            <img
                                style="right: ${rightPx}px;"
                                data-r="${rightPx}"
                                class="tribe"
                                src="${reader.result}"
                                data-tribe-custom="true"
                                onclick="removeCardTribe($(this))"
                            >
                        `
        
                        $cardTribe.append($element)

                        $input.val('');
                    }
                }
            });
            
            $(e.popper).find('#tribesChooseMenu img').click(function() {
                const $tribe = $(this);

                if ($tribe.attr('id') == "custom-tribe") {
                    console.log($tribe.attr('id'))
                    return;
                }

                const $cardTribe = $tribe.closest('.card').find('.cardTribes');

                const tribeName = $tribe.attr('data-name');
                var rightPx = $cardTribe.children('img').last().attr('data-r');
                rightPx = parseInt(rightPx) + 20;

                const $element = `
                    <img
                        style="right: ${rightPx}px;"
                        data-r="${rightPx}"
                        class="tribe"
                        src="./Undercards/tribes/${tribeName}.png"
                        data-tribe-name="${tribeName}"
                        onclick="removeCardTribe($(this))"
                    >
                `

                $cardTribe.append($element)

                //if ($tribe.hasClass('selected')) {
                //    $tribe.removeClass('selected');
                //    var $tribeRemoved = $cardTribe.find(`img[data-tribe-name="${tribeName}"]`);

                //    $tribeRemoved.nextAll('img').each(function() {
                //        var newRight = $(this).attr('data-r');
                //        newRight = parseInt(newRight) - 20;

                //        if (!$(this).hasClass('addTribe')) {
                //            $(this).attr('data-r', newRight)
                //            $(this).css('right', newRight + 'px')
                //        }
                //    });

                //    $tribeRemoved.remove();

                //} else {
                //    $tribe.addClass('selected');
                //}
            })
        }
    });

    tippy(`#card-${cardID} .cardDesc textarea`, {
        interactive: true,
        trigger: 'focus',
        placement: 'right-start',
        content: `<span style="font-size: 12px;">Information</span><hr>
        <div id="cardDescInfo">${$('#cardDescInfo').html()}</div>`,
        duration: 150
    });

    tippy(`#card-${cardID} .cardRarity`, {
        interactive: true,
        content: `<span class="center">Choose a Rarity:</span><hr>
            <div id="cardRarityMenu">${$('#cardRarityMenu').html()}</div>`,
        duration: 150,
        onMount(e) {
            currentTippy = e;
        },
        onCreate(e) {
            $(e.popper).find('#cardRarityMenu div img').each(function() {
                const r = $(this);

                if (r.attr('id') != 'custom-rarity') {
                    r.click(function() {
                        const $card = r.closest('.card');

                        /*const isDT = DTRarities.find(
                            (dtr) => $(this).attr('src').endsWith(rarities[dtr] + '.png')
                        );*/

                        const isDT = $(this).attr('src').endsWith('DETERMINATION.png')

                        $card.find('.cardStatus parent[data-power-name="determination"]').remove();

                        if (localStorage.getItem('settings.autodt') == "true" && isDT) {
                            addCardPower($card, {
                                custom: false,
                                counter: false,
                                name: 'determination',
                                src: null
                            });
                        }

                        var $cardRarity = $card.find('.cardRarity');

                        $cardRarity.css({
                            'background-image': `url("${$(this).attr('src')}")`,
                            'background-repeat': 'no-repeat',
                            'background-color': 'transparent',
                            'background-position': 'unset',
                            'background-size': 'unset'
                        });
                        
                        $cardRarity.attr('data-custom-rarity', "false")

                        currentTippy.hide();
                    })
                } else {
                    r.siblings('input').change(function() {
                        var file = this.files[0];
                        var reader = new FileReader();
                
                        var $cardRarity = r.closest('.card').find('.cardRarity');

                        if (localStorage.getItem('settings.autodt') == "true") {
                            $cardRarity.find('parent[data-power-name="determination"]').remove();
                        }
                
                        if (file) {
                            reader.readAsDataURL(file);
                            reader.onloadend = function () {
                                $cardRarity.css({
                                    'background-image': `url("${reader.result}")`,
                                    'background-repeat': 'no-repeat',
                                    'background-color': 'transparent',
                                    'background-position': 'center',
                                    'background-size': 'contain'
                                });
                                $cardRarity.attr('data-custom-rarity', "true")
                            }
                        }
                    })
                }
            })
        }
    });
}

function removeCardTribe($tribe) {
    $tribe.nextAll('img').each(function() {
        var newRight = $(this).attr('data-r');
        newRight = parseInt(newRight) - 20;

        if (!$(this).hasClass('addTribe')) {
            $(this).attr('data-r', newRight)
            $(this).css('right', newRight + 'px')
        }
    });

    $tribe.remove();
}

function manageCardPowerCounters($Power, type) {
    const $Img = $Power.find('img')
    const $Counter = $Power.find('span')

    switch (type) {
        case 'remove':
            $Counter.show();
            $Counter.text(parseInt($Counter.text()) - 1)

            break;

        case 'add':
            $Counter.show();
            $Counter.text(parseInt($Counter.text()) + 1)

            break;

        case 'clear':
            $Counter.hide();
            $Counter.text("0")

            break;
    }
}

function openCardMenu(e) {
    var cardId = $(this).attr("id");

    var $menu = $('#contextmenu');

    $menu.css('left', `${e.pageX}px`)
    $menu.css('top', `${e.pageY}px`)

    $menu.attr('data-current-card', cardId)

    $menu.show();

    function hide(e) {
        var el = $(e.target)
        var cm = $('#contextmenu')
    
        if (el.has(cm) || el.is(cm)) {
            cm.hide();
            cm.attr("data-current-card", "")

            $("body").expire();
        }
    }

    $(document).click(hide);
    $(document).contextmenu(hide);

    return false;
}

function deleteCard(t) {
    $card = $(`#${$(t).parent().attr('data-current-card')}`);

    $card.remove();
}

function cloneCard(t) {
    let $card = $(`#${$(t).parent().attr('data-current-card')}`);
    let groupId = $card.closest("[data-group-id]").data('group-id');

    var $clone = $card.clone()
        .appendTo(getGroup(groupId).find("> .collection"))
        .attr("id", `card-${currentCard}`);

    setupCardInputs($clone);
    setupCardInteractions(currentCard);
    setupCardTippy(currentCard, ($clone.hasClass('monster') ? 0 : 1));

    $clone.contextmenu(openCardMenu)

    currentCard++;
}

function toggleEditButtons(t) {
    $card = $(`#${$(t).parent().attr('data-current-card')}`);

    const $addButtons = $card.find(`.add-button-card`);
    const $cardIcons = $card.find('.cardStatus > parent, .cardTribes > img');

    $addButtons.is(":hidden") ? $addButtons.show() : $addButtons.hide();

    const addToRight = $addButtons.is(":hidden") ? -20 : 20;

    $cardIcons.each(function() {
        const prevRight = Number($(this).css('right').replace('px', ''));

        $(this).css('right', prevRight + addToRight);
    });
}

function changeFrameDialog(t) {
    $card = $(`#${$(t).parent().attr('data-current-card')}`);

    cardType = $card.hasClass('monster') ? "Monster" : "Spell";
    cardTypeNum = cardType == "Monster" ? 0 : 1;

    $('#dialog-frames-list').livequery(function () {
        tippy("#frame-custom", {
            content: "Custom Frame"
        });

        for (frame in frames) {
            const f = frames[frame]

            const template = createDefaultTemplate(cardTypeNum, f, false)
    
            const $template = $(template)
    
            $template.attr('id', `frame-${frame}`)
            $template.attr('card_type', cardType)
            $template.attr('frame_name', f)
            $template.click((event)=>{
                e = $(event.currentTarget)

                currentDialog.close()

                frames.map(frame => $card.removeClass(`${frame}-frame`))

                $card.addClass(`${$(e).attr('frame_name')}-frame`)
            });
    
            $(this).find('#frame-collection').append($template)

            const frameName = f.toLowerCase().replace(/(?:^|\s|-)\w/g, match => match.toUpperCase()).replaceAll('-', ' ');

            tippy(`#${$template.attr('id')}`, {
                content: `${frameName} Frame`
            })
        }

        $('#dialog-frames-list').expire()
    });

    type = cardType;

    createFrameDialog();
}

function addCardPower($card, power) {
    const $cardStatus = $card.find('.cardStatus');

    const powerCustom = power.custom;
    const powerName = power.name;
    const powerCounter = power.counter;
    const visPowerCounter = Number(powerCounter);
    const powerImage = power.src || `./Undercards/powers/${powerName}.png`;

    const $parentElements = $cardStatus.children('parent');

    var rightPx = $parentElements.last().attr('data-r');
    rightPx = parseInt(rightPx) + 20;

    const $power = $(`
        <parent
            data-r="${rightPx}"
            style="right: ${rightPx}px;"
            ${!powerCustom ? `data-power-name="${powerName}"` : `data-power-custom="true"`}
        >
            <img class="infoPowers" src="${powerImage}" data-counter="${powerCounter ? 'true' : 'false'}">
            <span class="infoPowersDetails" style="display: ${powerCounter ? 'block' : 'none'};">${visPowerCounter || '0'}</span>
        </parent>
    `)

    $cardStatus.append($power)

    if (powerCounter == false) {
        $power.find('.infoPowersDetails').hide();
    }

    $power.bind('mousedown', function(e) { 
        if (e.which == 1) {
            manageCardPowerCounters($(this), 'add')

        } else if (e.which == 3) {
            manageCardPowerCounters($(this), 'remove')

        } else if (e.which == 2) {
            manageCardPowerCounters($(this), 'clear')
        }
                    
        e.preventDefault();
                
    }).bind('contextmenu', function(e) {
        e.preventDefault();

        return false;
    });
}