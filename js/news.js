const news = [{
    
}]

const seen = {

};

function showNews() {
    BootstrapDialog.show({
        title: `Updates`,
        message: `${news}
            <br><br>
            <b>Clear your cache to </b>`,
        buttons: [{
            label: 'Close',
            cssClass: 'btn-danger',
            action: function (dialog) {
                dialog.close()
            }
        }]
    });
}

