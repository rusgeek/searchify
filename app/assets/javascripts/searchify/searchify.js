(function( $ ) {
    $.fn.searchify = function() {
        return this.each(function() {
            $(this).autocomplete({
                source: $(this).data("search-url"),
                select: function (event, ui) {
                    if (select_url = $(this).data("select-url")) {
                        for (element in ui.item)
                            select_url = select_url.replace('\(' + element + '\)', ui.item[element]);

                        window.location.href = select_url;
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

            $(this).change( function (event, ui) {
                if ( $(this).prev().val() == '' || $(this).prev().val() != $(this).data('value') ) {
                    $(this).val('');
                    $(this).prev().val('');
                }
            });
            $(this).focus( function (event, ui) {
                $(this).data('value', '');
            });
        });
    };
})( jQuery );
