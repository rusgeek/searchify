(function( $ ) {
    $.fn.searchify = function() {
        return this.each(function() {
            $(this).autocomplete({
                source: $(this).data("search-url"),
                appendTo: 'body',
                select: function (event, ui) {
                    if (select_url = $(this).data("select-url")) {
                        for (element in ui.item)
                            select_url = select_url.replace('\(' + element + '\)', ui.item[element]);

                        Turbolinks.visit(select_url);
                    } else {
                        var prev = $(this).prev();
                        // jQuery inserts these between searchify nodes
                        if (prev.attr('class') == 'ui-helper-hidden-accessible') {
                            prev = prev.prev();
                        }
                        prev.val(ui.item.id);
                        $(this).data('value', ui.item.id)
                        $(this).blur();
                        $(this).focus();
                    }
                }
            });

            $(this).change( function () {
                var prev = $(this).prev();
                if (prev.attr('class') == 'ui-helper-hidden-accessible') {
                    prev = prev.prev();
                }
                if (prev.val() == '' || prev.val() != $(this).data('value') ) {
                    $(this).val('');
                    prev.val('');
                }
            });
            $(this).focus( function () {
                //$(this).data('value', '');
            });
        });
    };
})( jQuery );
