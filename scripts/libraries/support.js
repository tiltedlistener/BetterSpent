(function ( $ ) {

    $.fn.where = function(status) {
    	var len = this.size();
    	for(var i=0; i < len; i++) {
    		if ($(this[i]).is(status)) {
    			return $(this[i]);
    		}
    	}
    	return [];
    };
 
}( jQuery ));