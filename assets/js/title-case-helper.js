Handlebars.registerHelper('titleCase', function (str) {
    if (typeof str === 'undefined') return '';
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
});