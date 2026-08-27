(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'datatables.net'], function ($) {
            return factory($, window, document);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = function (root, $) {
            if (!root) {
                root = window;
            }

            if (!$ || !$.fn.dataTable) {
                // Require DataTables, which attaches to jQuery, including
                // jQuery if needed and have a $ property so we can access the
                // jQuery object that is used
                $ = require('datatables.net')(root, $).$;
            }

            return factory($, root, root.document);
        };
    } else {
        // Browser
        factory(jQuery, window, document);
    }
}(function ($, window, document, undefined) {
    'use strict';
    var DataTable = $.fn.dataTable;


    /* Set the defaults for DataTables initialisation */
    $.extend(true, DataTable.defaults, {
        dom:
            "<'flex flex-col items-center md:flex-row'<'w-auto md:w-1/2 py-1'l><'w-auto text-right md:w-1/2 py-1'f>>" +
            "<'flex my-4'<'w-full overflow-y-auto max-w-table'tr>>" +
            "<'flex flex-col md:flex-row'<'w-full md:w-1/3'i><'w-full md:w-2/3 text-right'p>>",
        renderer: 'tailwindcss',
        autoWidth: false,
        drawCallback(){
            document.querySelector('.max-w-table').style.maxWidth = (
                ( window.outerWidth - ((window.outerWidth > 768)  * document.querySelector('sidebar').clientWidth) - 48) + 'px'
            )
        }
    });

    $.extend(DataTable.ext.classes, {
        sWrapper: "w-full whitespace-nowrap drag-scroll",
        sTable: "w-full datatable bg-white",
        sFilter: "font-semibold",
        sFilterInput: "p-2 ml-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
        sLength: "font-semibold",
        sLengthSelect: "border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
        sProcessing: "w-full p-4 text-center bg-blue-200",
        sFooterTH: "p-2 font-semibold border border-gray-300",
        sHeaderTH: "relative p-2 pr-6 font-semibold border border-gray-300",
        sSortable: "cursor-pointer sortable",
        sStripeEven: "border border-gray-300",
        sStripeOdd: "border border-gray-300",
        sPaging: "relative z-0 inline-flex rounded-md shadow-sm",
        sPageButton: "relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 cursor-pointer hover:text-gray-500 focus:z-10 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-700",
        sRowEmpty: "w-full p-4 text-center bg-red-200",
        sInfo: "font-semibold",
    });

    DataTable.ext.renderer.pageButton.tailwindcss = function (settings, host, idx, buttons, page, pages) {
        var api = new DataTable.Api(settings);
        var classes = settings.oClasses;
        var lang = settings.oLanguage.oPaginate;
        var aria = settings.oLanguage.oAria.paginate || {};
        var btnDisplay, btnClass, counter = 0;

        var attach = function (container, buttons) {
            var i, ien, node, button;
            var clickHandler = function (e) {
                e.preventDefault();
                if (!$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action) {
                    api.page(e.data.action).draw('page');
                }
            };

            for (i = 0, ien = buttons.length; i < ien; i++) {
                button = buttons[i];

                if (Array.isArray(button)) {
                    attach(container, button);
                } else {
                    btnDisplay = '';
                    btnClass = '';
                    const disabledClass = ' bg-gray-200 cursor-not-allowed pointer-events-none'

                    switch (button) {
                        case 'ellipsis':
                            btnDisplay = '&#x2026;';
                            btnClass = disabledClass;
                            break;

                        case 'first':
                            btnDisplay = lang.sFirst;
                            btnClass = button + (page > 0 ?
                                '' : disabledClass);
                            break;

                        case 'previous':
                            btnDisplay = lang.sPrevious;
                            btnClass = button + (page > 0 ?
                                '' : disabledClass);
                            break;

                        case 'next':
                            btnDisplay = lang.sNext;
                            btnClass = button + (page < pages - 1 ?
                                '' : disabledClass);
                            break;

                        case 'last':
                            btnDisplay = lang.sLast;
                            btnClass = button + (page < pages - 1 ?
                                '' : disabledClass);
                            break;

                        default:
                            btnDisplay = button + 1;
                            btnClass = page === button ?
                                disabledClass : '';
                            break;
                    }

                    if (btnDisplay) {
                        node = $('<li>', {
                            'class': classes.sPageButton + ' ' + btnClass,
                            'id': idx === 0 && typeof button === 'string' ?
                                settings.sTableId + '_' + button :
                                null
                        })
                            .append($('<a>', {
                                    'href': '#',
                                    'aria-controls': settings.sTableId,
                                    'aria-label': aria[button],
                                    'data-dt-idx': counter,
                                    'tabindex': settings.iTabIndex,
                                    'class': 'page-link'
                                })
                                    .html(btnDisplay)
                            )
                            .appendTo(container);

                        settings.oApi._fnBindAction(
                            node, {action: button}, clickHandler
                        );

                        counter++;
                    }
                }
            }
        };

        // IE9 throws an 'unknown error' if document.activeElement is used
        // inside an iframe or frame.
        var activeEl;

        try {
            // Because this approach is destroying and recreating the paging
            // elements, focus is lost on the select button which is bad for
            // accessibility. So we want to restore focus once the draw has
            // completed
            activeEl = $(host).find(document.activeElement).data('dt-idx');
        } catch (e) {
        }

        attach(
            $(host).empty().html('<ul class="pagination"/>').children('ul'),
            buttons
        );

        if (activeEl !== undefined) {
            $(host).find('[data-dt-idx=' + activeEl + ']').trigger('focus');
        }
    };


    return DataTable;
}));
