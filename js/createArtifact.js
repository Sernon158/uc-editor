function createArtifact(groupId) {
    let artifact = createArtifactTemplate();
    let $artifact = $(artifact);

    $artifact.contextmenu(openArtifactMenu);

    getGroup(groupId).find('.artifact-collection').append($artifact);

    setupArtifactInputs($artifact);
    setupArtifactTippy(currentArtifact);
    setupArtifactInteractions($artifact);

    currentArtifact++;

    //if (dragModeEnabledGroups.includes(groupId))
    //    $artifact.attr('draggable', true);

    return $artifact
}

function setupArtifactInputs($artifact) {
    setInput($artifact.find('.artifactName'))
    setArtifactDescriptionInput($artifact)
}

function setupArtifactInteractions($artifact) {
    let $artifactName = $artifact.find('.artifactName input');
    let $artifactRarity = $artifact.find('div.artifactRarity');
    let $artifactImage = $artifact.find('div.artifactImage input');

    let $Select = $artifactRarity.find('select');
    let $Span = $artifactRarity.find('span');

    $artifactName.focusout(function() {
        let $an = $(this).parent();

        $an.css('font-size', getResizedFontSize($(this), 33, _, 14) || $an.css('font-size'));
    });

    $Span.click(function() {
        $Span.hide();
        $Select.show();

        $Select.focus();
    });

    $Select.change(function() {
        $Select.hide();
        $Span.show();

        var oldRarity = $Span.html().toLowerCase();
        var rarity = $Select.val();

        $Span.attr("oldvalue", oldRarity);

        $Span.html(rarity);

        $artifact
            .removeClass(oldRarity)
            .addClass(rarity.toLowerCase())
    });

    $Select.focusout(function() {
        $Select.hide();
        $Span.show();
    });

    $artifactImage.change(function() {
        var file = this.files[0];
        var reader = new FileReader();

        var $t = $(this);

        var $artifactImage = $t.siblings('img');

        if (file) {
          reader.readAsDataURL(file);
          reader.onloadend = function () {
            $artifactImage.attr('src', reader.result);
            $t.val('');
          }
        }
    });
}

function setupArtifactTippy(artifactID) {
    tippy(`#artifact-${artifactID} .artifactDesc textarea`, {
        interactive: true,
        trigger: 'focus',
        placement: 'bottom-start',
        content: `<span style="font-size: 12px;">Information</span><hr>
        <div id="cardDescInfo">${$('#cardDescInfo').html()}</div>`,
        duration: 150
    })
}

function setArtifactDescriptionInput($artifact) {
    var $Textarea = $artifact.find('.artifactDesc textarea')
    var $Span = $artifact.find('.artifactDesc span')

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

        var fontSize = 41;

        var newFontSize = getResizedFontSize($Desc, fontSize, $Textarea);

        $Desc.css('font-size', newFontSize || $Textarea.css('font-size'));
    });
}

function openArtifactMenu(e) {
    var artifactId = $(this).attr("id");

    var $menu = $('#contextmenu-artifact');

    $menu.css('left', `${e.pageX}px`)
    $menu.css('top', `${e.pageY}px`)

    $menu.attr('data-current-artifact', artifactId)

    $menu.show();

    function hide(e) {
        var el = $(e.target)
        var cm = $('#contextmenu-artifact')
    
        if (el.has(cm) || el.is(cm)) {
            cm.hide();
            cm.attr("data-current-artifact", "")

            $("body").expire();
        }
    }

    $("body").click(hide);
    $("body").contextmenu(hide);

    return false;
}


function deleteArtifact(t) {
    $artifact = $(`#${$(t).parent().attr('data-current-artifact')}`);

    $artifact.remove();
}

function toggleArtifactRarity(t) {
    $artifact = $(`#${$(t).parent().attr('data-current-artifact')}`);

    const $artifactRarity = $artifact.find('.artifactRarity');
    const $artifactName = $artifact.find('.artifactName')

    if ($artifactRarity.is(":hidden")) {
        $artifactRarity.show();
        $artifactName.removeClass('modified');
    } else {
        $artifactRarity.hide();
        $artifactName.addClass('modified');
    }
}