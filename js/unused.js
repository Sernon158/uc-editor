/* From utils.js */
//function simplifyCardTemplateDesc(txt) {
//    function title(txt) {
//        return txt.replace(/\w\S*/g, function(txt) {
//            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//        });
//    }
//
//    return txt
//            .replace('{{COST}}', 'cost')
//            .replace('{{ATK}}', 'ATK')
//            .replace('{{HP}}', 'HP')
//            .replace('{{GOLD}}', 'G')
//            .replace(/\{\{KW:(.*?)\}\}/g, (_, $1) => `_${title($1)}_`)
//            .replace(/\{\{CARD:(.*?)\}\}/g, (_, $1) => `{${(allCards.find((card) => card.id == $1) || allCards[0]).name}}`)
//            .replace(/\{\{TRIBE:(.*?)\}\}/g, (_, $1) => `_${title($1)}_`)
//}