var currentCard = 1;
var currentArtifact = 1;
var currentInput;
var currentTippy;
var currentDialog;
const _ = undefined;

var autosaveLoad;

function main() {
    if (document.readyState === 'complete') init();
    else $(window).on('load', init);
}

function init() {
    createNewGroup();
    autosaveLoad = loadAutosave();

    if (autosaveLoad == true) {
        console.info("[Autosave] Autosave loaded")

    } else if (autosaveLoad != false) {
        console.error("[Autosave] Couldn't load autosave: \n\n" + autosaveLoad)

        BootstrapDialog.show({
            title: "Autosave Error",
            message: "There was a problem loading your autosave! For more information, please check the console.",
            buttons: [{
                label: 'Continue Anyways',
                cssClass: 'btn-danger',
                action: function (dialog) {
                    dialog.close()
                }
            }],
        });
    }

    initiated = true;
    
    $('#create-group').click(createNewGroup);
    $('#open-settings').click(openSettingsMenu);
}

function setInput($Element) {
    var $Span = $Element.find('span')
    var $Input = $Element.find('input')

    $Element.click(function() {
        $Span.hide();
        $Input.show();

        var nrvalue = $Input.attr('nrvalue')

        if (nrvalue != "1") {
            $Input.val($Span.html());
        } else {
            $Input.val('')
        }

        $Input.attr("placeholder", $Span.html());
        $Input.attr("oldvalue", $Span.html());

        $Input.focus();
    });

    $Input.focusout(function() {
        $Input.hide();
        $Span.show();

        var nrvalue = $Input.attr('nrvalue')

        $Span.html($Input.val() ||
            (nrvalue == "1" || nrvalue == "2" ? $Input.attr("oldvalue") : '')
        );
    });
}

function addTips($el, tips) {
    for ([target, content] of Object.entries(tips)) {
        tippy($el.find(target)[0], { content });
    }
}

function resetDialog() {
    currentDialog = null;
}

main();