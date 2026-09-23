const settings = [
    {
        "id": "autosave",
        "name": "Autosave your cards and artifacts",
        "default": true
    },
    {
        "id": "autodt",
        "name": "Automatically add <img src='./Undercards/powers/determination.png'> to <span class='DETERMINATION'>DT</span> cards",
        "default": true
    },
    {
        "id": "statcolors",
        "name": "Add colors to the stats",
        "default": true
    },
    {
        "id": "defaultframe",
        "name": "Default frame added to your cards automatically",
        "default": false,
        "type": "text"
    }
]

for (var i = 0; i < settings.length; i++) {
    var val = settings[i];

    if (!localStorage.getItem('settings.' + val.id)) {
        localStorage.setItem('settings.' + val.id, val.default)
    }
}

const settingsMenuHTML = $(`
    <div id="settings-menu">
        ${settings.map((setting) => `
                <p style="display: none;">
                    ${settingItem = localStorage.getItem('settings.' + setting.id)}
                </p>
                <div class="setting">
                ${setting.type == "checkbox" || !setting.type ? `
                    <input
                        data-setting-id="settings.${setting.id}"
                        type="checkbox"
                        onchange="updateSetting($(this));"
                        ${settingItem ? (settingItem !== "false" ? 'checked' : '') : (setting.default ? 'checked' : '')}
                    >
                    <span>${setting.name}</span>
                ` : `
                    <select
                        data-setting-id="settings.${setting.id}"
                        type="text"
                        onchange="updateSetting($(this));"
                        selected="${localStorage.getItem('settings.' + setting.id) || ''}"
                    >
                        <option value="false">None</option>
                        ${frames.map((frame)=>{
                            const filFrame = frame.toLowerCase().replace(/(?:^|\s|-)\w/g, match => match.toUpperCase()).replaceAll('-', ' ');
                            var selected = "";

                            if (frame == localStorage.getItem('settings.' + setting.id)) {
                                selected = "selected";
                            }

                            return `<option value="${frame}" ${selected}>${filFrame}</option>`
                        }).join("")}
                    </select>
                    <span>${setting.name}</span>
                `}
                </div>
            `)
            .join("")
        }
        <hr>
        <button class="ATK" ondblclick="autosaveLoad = false; localStorage.clear(); window.location.reload();">Reset All (double click)</button>
    </div>
`)

function openSettingsMenu() {
    BootstrapDialog.show({
        title: "Settings",
        message: settingsMenuHTML[0],
        buttons: [{
            label: 'Close',
            cssClass: 'btn-primary',
            action: function (dialog) {
                dialog.close()
            }
        }],
    });
}

function updateSetting($input) {
    if ($input.attr('type') == "checkbox") {
        localStorage.setItem($input.attr('data-setting-id'), $input.is(':checked'));

    } else {
        localStorage.setItem($input.attr('data-setting-id'), $input.val());
    }
}