(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports !== "undefined") {
        factory();
    } else {
        var mod = {
            exports: {}
        };
        factory();
        global.bootstrapTableEuEU = mod.exports;
    }
})(this, function () {
    'use strict';

    /**
     * Bootstrap Table Basque (Basque Country) translation
     * Author: Iker Ibarguren Berasaluze<ikerib@gmail.com>
     */
    (function ($) {
        'use strict';

        $.fn.bootstrapTable.locales['eu-EU'] = {
            formatLoadingMessage: function formatLoadingMessage() {
                return 'Itxaron mesedez...';
            },
            formatRecordsPerPage: function formatRecordsPerPage(pageNumber) {
                return pageNumber + ' emaitza orriko.';
            },
            formatShowingRows: function formatShowingRows(pageFrom, pageTo, totalRows) {
                return totalRows + ' erregistroetatik ' + pageFrom + 'etik ' + pageTo + 'erakoak erakusten.';
            },
            formatSearch: function formatSearch() {
                return 'Bilatu';
            },
            formatNoMatches: function formatNoMatches() {
                return 'Ez da emaitzarik aurkitu';
            },
            formatPaginationSwitch: function formatPaginationSwitch() {
                return 'Ezkutatu/Erakutsi orrikatzea';
            },
            formatRefresh: function formatRefresh() {
                return 'Eguneratu';
            },
            formatToggle: function formatToggle() {
                return 'Ezkutatu/Erakutsi';
            },
            formatColumns: function formatColumns() {
                return 'Zutabeak';
            },
            formatAllRows: function formatAllRows() {
                return 'Guztiak';
            }
        };

        $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['eu-EU']);
    })(jQuery);
});