let dragModeEnabledGroups = [];
let $draggingCard;

function toggleDraggingMode(groupId) {
    if (!dragModeEnabledGroups.includes(groupId))
        startDraggingMode(groupId);
    else
        stopDraggingMode(groupId);
}

function startDraggingMode(groupId) {
    const $currGroup = getGroup(groupId);
    const $currGroupColl = getGroup(groupId).find('.collection');
    const $anyGroupColl = $('main > div[data-group-id] > .collection');

    dragModeEnabledGroups.push(groupId);
    $currGroup.find('.toggle-drag-mode').addClass('enabled');

    $currGroup.find('.card').attr('draggable', true);
    $currGroup.find('.card *').attr('draggable', false);
    //$currGroup.find('.artifact').attr('draggable', true);

    $currGroupColl.on('dragstart', function(e) {
        let $dragging = $(e.target);

        if (!$dragging.is('.card')) return;

        $draggingCard = $dragging;

        $dragging.addClass('dragging');
        e.originalEvent.dataTransfer.effectAllowed = 'move';
    });

    $anyGroupColl.on('dragend', function() {
        if (!$draggingCard.is('.card')) return;

        const newGroupId = $draggingCard.closest('div[data-group-id]')
            .data('group-id');

        if (!dragModeEnabledGroups.includes(Number(newGroupId)))
            $draggingCard.attr('draggable', false);

        $draggingCard.removeClass('dragging');
        $draggingCard = undefined;
    });

    $anyGroupColl.on('dragover', function(e) {
        e.preventDefault();

        let $dropZone = $(e.target);

        if ($dropZone.is('.card')) {
            if ($dropZone.is($draggingCard)) return;

            const rect = $dropZone[0].getBoundingClientRect();
            const clientY = e.originalEvent.clientY;
            const before = clientY < (rect.top + rect.height);

            if (e.originalEvent.clientX > (rect.left + rect.width / 4) && $dropZone.is(":last-child"))
                return $dropZone.after($draggingCard);

            if (before) $dropZone.before($draggingCard);
            else $dropZone.after($draggingCard);
        }
        else if ($dropZone.is('.collection') && $dropZone.find('.card').length === 0) {
            $draggingCard.appendTo($(this));
        }
    });
}

function stopDraggingMode(groupId) {
    const $group = getGroup(groupId);
    const idx = dragModeEnabledGroups.indexOf(groupId);

    if (idx !== -1)
        delete dragModeEnabledGroups[idx];

    $group.find('.toggle-drag-mode').removeClass('enabled');
    $draggingCard = undefined;

    $('.card')
        .removeClass('dragging')
        .removeAttr('draggable');
    
    $('.card *').removeAttr('draggable');
    
    $group
        .off('dragstart', '.card')
        .off('dragend', '.card');
    
    $(document).off('dragover', '.card');
}