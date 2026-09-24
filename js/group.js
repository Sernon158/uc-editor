var lastGroupId = 0;

function getGroup(groupId) {
    return $(`main > div[data-group-id="${groupId}"]`)
}

function createNewGroup() {
    const groupId = lastGroupId++;

    let $group = $(`
        <div data-group-id="${groupId}">
            <div class="group-header">
                <div class="left-side">
                    <div class="group-name">
                        <span>My Group #${groupId + 1}</span>
                        <input placeholder="My Group" value="My Group" maxlength="30" style="display:none;" nrvalue="2">
                    </div>
                </div>
                <div class="center">
                    <img class="save-group" src="./images/SAVE_GROUP.png" alt="Save Group">
                    <img class="load-group" src="./images/LOAD_GROUP.png" alt="Load Group">
                    <img class="delete-group" src="./images/DELETE_GROUP.png" alt="Delete Group">
                </div>
                <div class="right-side">
                    <img class="btn-create create-monster" src="./images/MONSTER.png" alt="Create Monster">
                    <img class="btn-create create-spell" src="./images/SPELL.png" alt="Create Spell">
                    <img class="btn-create create-enchant" src="./images/ENCHANTMENT.png" alt="Create Enchantment">
                    <img class="btn-create create-artifact" src="./images/ARTIFACT.png" alt="Create Artifact">
                    <img class="btn-create create-template" src="./images/TEMPLATE.png" alt="Create Template">
                    <img class="btn-create toggle-drag-mode" src="./images/MOVE_CARD.png" alt="Move Card">
                    <img class="btn-create download-group" src="./images/DOWNLOAD.png" alt="Download Group">
                </div>
            </div>
        
            <div class="artifact-collection"></div>
            <div class="collection"></div>
        </div>
    `);

    setInput($group.find('.group-name'));

    $group.appendTo($('main'))
        .on('click', '.save-group', () => saveNewGroup(groupId))
        .on('click', '.load-group', () => loadGroupMenu(groupId))
        .on('click', '.delete-group', () => deleteGroupMenu(groupId))
        .on('click', '.create-monster', () => createCardDialog(groupId, 0))
        .on('click', '.create-spell', () => createCardDialog(groupId, 1))
        .on('click', '.create-enchant', () => createCardDialog(groupId, 99))
        .on('click', '.create-artifact', () => createArtifact(groupId))
        .on('click', '.create-template', () => openTemplatesMenu(groupId))
        .on('click', '.toggle-drag-mode', () => toggleDraggingMode(groupId))
        .on('click', '.download-group', () => downloadGroup(groupId));

    addTips($group, {
        '.save-group': "Save Group",
        '.load-group': "Load Group",
        '.create-monster': "Create Monster",
        '.create-spell': "Create Spell",
        '.create-artifact': "Create Artifact",
        '.create-enchant': "Create Enchant",
        '.create-template': "Create Template of an existing Card, Artifact or Enchantment",
        '.toggle-drag-mode': "Toggle Move Card Mode",
        ".download-group": "Download Group as Image"
    });

    let $deleteGroupBtns = $('main > div[data-group-id] .delete-group');

    if ($deleteGroupBtns.length === 1)
        $deleteGroupBtns.hide();
    else
        $deleteGroupBtns.show();
}

function saveNewGroup(groupId) {
    BootstrapDialog.show({
        title: `Save new group`,
        message: `<div id="save-new-group">
            <!--
            <p class="title">Save New Group</p>
                <button>
                    Save Group
                </button>
            <hr>
            -->
            <p class="title">Download Group File</p>
            <a>
                <button onclick="downloadGroupFile(${groupId}); currentDialog.close();">
                    Download File
                </button>
            </a>
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

function loadGroupMenu(groupId) {
    BootstrapDialog.show({
        title: `Load new group`,
        message: `<div id="save-new-group">
            <p class="title">Load Group</p>
            <a>
                <button onclick="uploadGroupFile(${groupId}); currentDialog.close();">
                    Upload File
                </button>
            </a>
            <p class="invisible">.</p>
            <p class="invisible">.</p>
            <p class="title">Load Empty Group</p>
            <a>
                <button class="ATK" ondblclick="loadEmptyGroup(${groupId}); currentDialog.close();">
                    Clear all cards & artifacts (double click)
                </button>
            </a>
            <p class="invisible">.</p>
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

function loadEmptyGroup(groupId) {
    getGroup(groupId).find('.collection > *, .artifact-collection > *').remove();
    loadSave(groupId, EMPTY_GROUP);
}

function downloadGroupFile(groupId) {
    updateAutosave();

    const autosave = JSON.parse(localStorage.getItem("autosave"));
    const group = autosave[groupId];
    const groupCode = encodeSave(JSON.stringify(group));

    if (!group) return;

    const file = new File(
        [groupCode], {type: 'text/plain'}
    );

    const $a = $(`<a
        href="${URL.createObjectURL(file)}"
        download="${getGroup(groupId).find('.group-name span').text()}.uceditor"
        class="hidden"
    />`);

    $('body').append($a)
    $a[0].click();

    $a.remove();
}

function uploadGroupFile(groupId) {
    const $input = $(`
        <label class="hidden">
            <input type="file" accept=".uceditor">
        </label>
    `);

    $input.find('input').change(function() {
        const file = this.files[0];
        if (!file) return;

        let reader = new FileReader();

        reader.readAsText(file);
        reader.onloadend = function() {
            const data = decodeSave(reader.result);

            if (typeof data === 'object') {
                getGroup(groupId)
                    .find('.collection, .artifact-collection')
                    .empty();

                autosaveLoad = false;
                loadSave(groupId, data);
                updateAutosave();
                autosaveLoad = true;
            }
        }

        $input.remove();
    });

    $('body').append($input);
    $input[0].click()
}

function deleteGroupMenu(groupId) {
    BootstrapDialog.show({
        title: `Delete group`,
        message: `<div style="font-size:16px">
            <p>Are you sure you want to delete this group? All cards and artifacts in this group will be removed!</p>
            <u>You cannot undo this action!<u>
        </div>`,
        closable: false,
        buttons: [{
            label: 'Yes',
            cssClass: 'btn-danger',
            action: function (dialog) {
                deleteGroup(groupId);
                dialog.close();
            }
        }, {
            label: 'No',
            cssClass: 'btn-primary',
            action: function (dialog) {
                dialog.close();
            }
        }],
        onshown: function (dialog) {
            currentDialog = dialog;
        },
        onhide: resetDialog()
    });
}

function deleteGroup(groupId) {
    getGroup(groupId).remove();

    let $deleteGroupBtns = $('main > div[data-group-id] .delete-group');

    if ($deleteGroupBtns.length === 1)
        $deleteGroupBtns.hide();
}