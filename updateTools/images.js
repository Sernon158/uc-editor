// Put current allCards in the editor in here.
let oldAllCards = [];
// Put current allArtifacts in the editor in here.
let oldAllArtifacts = [];

/*--------------------------- Script ---------------------------*/
let outdatedCards = allCards
    .filter((c) => oldAllCards.every(
        (old_c) => c.name != old_c.name
    ));

let outdatedArtifacts = allArtifacts
    .filter((c) => oldAllArtifacts.every(
        (old_c) => c.name != old_c.name
    ));

async function start() {
	if (oldAllCards.length > 0) {
		for (const card of outdatedCards) {
			let $link = $(`<a href="/images/cards/${card.image}.png" download="${card.image}">abc</a>`);
		
			$('body').append($link);
			$link[0].click();
			await wait(500);
			$link.remove();
		}
	}
	
	if (oldAllArtifacts.length > 0) {
		for (const art of outdatedArtifacts) {
			let $link = $(`<a href="/images/artifacts/${art.image}.png" download="${art.image}">abc</a>`);
		
			$('body').append($link);
			$link[0].click();
			await wait(500);
			$link.remove();
		}
	}
}

async function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

start();