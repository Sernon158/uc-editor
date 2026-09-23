function downloadCard(t) {
    const $card = document.querySelector(`#${$(t).parent().attr('data-current-card')}`);

    const $$card = $($card);

    const $addButtons = $$card.find(`.add-button-card`);

    const $cardPowersTribes = $$card.find('.cardStatus parent, .cardTribes img');

    $$card.css('pointer-events', 'none');
    $$card.find('.cardImageTip').hide();

    $addButtons.hide();

    $cardPowersTribes.each(function() {
      $(this).css('right', parseInt($(this).attr('data-r')) - 20 + "px")
    });

    domtoimage.toPng($card).then(function (dataUrl) {
        $cardPowersTribes.each(function() {
          $(this).css('right', parseInt($(this).attr('data-r')) + "px")
        });
        
        $$card.css('pointer-events', 'unset');
        $$card.find('.cardImageTip').show();

        $addButtons.show();

        const $a = $(`<a href="${dataUrl}" download="${$($card).find('.cardName div span').text()}.png"></a>`);

        $('body').append($a)

        $($a[0].click()).remove();
      })
      .catch(function (error) {
        console.error('Error while downloading card: ', error);
      });
}

function downloadArtifact($artifact) {
    
}

async function downloadGroup(groupId) {
  BootstrapDialog.show({
      title: `Downloading Group...`,
      closable: false,
      message: `
    Your group is currently being downloaded as an image, please wait.
    If you have a lot of cards and/or artifacts, this might take a few seconds.
  `,
      buttons: [{ label: '' }],
      onshown: function (dialog) {
          currentDialog = dialog;
      },
      onhide: resetDialog()
  });

  const $group = getGroup(groupId);
  const $collection = $group.find('.collection');
  const $cards = $collection.find('.card');

	// Wait 500 ms before starting to give time for the dialog to show up
	// if there's a lot of cards, which will block the main thread for a bit.
	if ($cards.length > 30)
		await new Promise(resolve => setTimeout(resolve, 500));

  var totalWidth = 0;

  $cards.find('.cardImageTip').hide();

  $cards.each(function() {
    const $card = $(this);

    const $addButtons = $card.find(`.add-button-card`);

    const $cardPowersTribes = $card.find('.cardStatus parent, .cardTribes img');

    $card.css('pointer-events', 'none');

    $addButtons.hide();

    $cardPowersTribes.each(function() {
      $(this).css('right', parseInt($(this).attr('data-r')) - 20 + "px");
    });
    
    totalWidth += $card.outerWidth();
  });

  const docWidth = $(document).outerWidth();

  if ($('.artifact').length > 0) {
    $group.css('min-width', 704)
  }

  if (docWidth < 600) {
    $group.css('width', totalWidth);
  } else {
    $group.css('width', totalWidth <= docWidth ? totalWidth : 1409);
  }

  $group.css('height', $group.outerHeight());

  $group.css('background-color', 'black');
  $group.find('.group-header > .center, .group-header > .right-side').hide();

  const $aar = $('.artifact > div.artifactRarity');
  const $aan = $('.artifact > div.artifactName');

  $aan.addClass('modified');
  $aar.hide();

  $aan.attr('data-hide-group-download', '');
  $aar.attr('data-hide-group-download', '');

  domtoimage.toPng($group[0]).then(function (dataUrl) {
    $group.css('width', '');
    $group.css('height', '');

    $group.css('min-width', '')

    $group.css('background-color', '');
    $group.find('.group-header > .center, .group-header > .right-side').show();
    $cards.find('.cardImageTip').show();

    $cards.each(function() {
      const $card = $(this);
      const $cardPowersTribes = $card.find('.cardStatus parent, .cardTribes img');

      $cardPowersTribes.each(function() {
        $(this).css('right', parseInt($(this).attr('data-r')) + "px");
      });

      const $addButtons = $card.find(`.add-button-card`);

      $addButtons.show();
    });

    const $aar = $('.artifact > div.artifactRarity[data-hide-group-download]');
    const $aan = $('.artifact > div.artifactName[data-hide-group-download]');

    $aan.removeClass('modified');
    $aar.show();

    $aan.removeAttr('data-hide-group-download');
    $aar.removeAttr('data-hide-group-download');
    
    $cards.css('pointer-events', 'unset');

    const $a = $(`<a href="${dataUrl}" download="${
      $group.find('.group-name > span').text()
    }.png"></a>`);

    $('body').append($a)

    $($a[0].click()).remove();

  currentDialog.close();
  })
  .catch(function (error) {
    console.error('Error while downloading card: ', error);
  });
}