Handlebars.registerHelper('titleCase', function (str) {
    if (typeof str === 'undefined') return '';
    return str.replace(/\b[\w']+\b/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
});