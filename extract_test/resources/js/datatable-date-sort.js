jQuery.fn.dataTableExt.aTypes.unshift(
    function (sData) {
        if (/^(fri|sat|sun|mon|tue|wed|thu),\s(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s([0-2]?\d|3[0-1]),\s\d{4}\s\d\d?:\d\d?\s(am|pm)/i.test(sData)) {
            return 'day-date-string';
        }
        return null;
    }
);

jQuery.fn.dataTableExt.oSort['day-date-string-asc'] = function (a, b) {
    var ordA = new Date(a), ordB = new Date(b);
    return (ordA < ordB) ? -1 : ((ordA > ordB) ? 1 : 0);
};

jQuery.fn.dataTableExt.oSort['day-date-string-desc'] = function (a, b) {
    var ordA = new Date(a), ordB = new Date(b);
    return (ordA < ordB) ? 1 : ((ordA > ordB) ? -1 : 0);
};
