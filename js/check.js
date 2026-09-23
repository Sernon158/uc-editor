/*function openWarningDialog() {
    BootstrapDialog.show({
        title: `Undercards is down!`,
        message: `Undercards's server is down, therefore, some features might not work or have bugs. Use at your own risk.`,
        closable: false,
        buttons: [{
            label: 'Continue',
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

$.ajax({
    url: 'https://undercards.net/health',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
        if (data && data.outcome && data.outcome === "UP") {
            console.log("Undercards is up!");
        } else {
            openWarningDialog();
        }
    },
    error: function(xhr, status, error) {
        console.error('Error while checking Undercards status:', error);

        openWarningDialog();
    }
});*/