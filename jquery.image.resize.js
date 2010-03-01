/**
 * Copyright (C) 2010, Tay Ray Chuan
 **/

(function($) {
	var scale_by_width = function(parent, child) {
		var h = child.attr("height") * (parent.width() / child.attr("width"));
		child.attr("width", parent.width());
		child.attr("height", h);
	};

	var scale_by_height = function(parent, child) {
		var w = child.attr("width") * (parent.height() / child.attr("height"));
		child.attr("height", parent.height());
		child.attr("width", w);
	};

	/**
	 * horizontally, text-align takes care of centralising for us.
	 * vertically, not so.
	 */
	var valign_middle = function(parent, child) {
		var d = parent.height() - child.attr("height");
		child.css("margin-top", d==0 ? 0 : d/2);
	};

	var onImageLoad = function(event) {
		var e = $(this);
		var container = event.data.container;

		// assume all containers are thin

		// is fat?
		if (e.attr("width") > e.attr("height")) {
			scale_by_width(container, e);

			if (e.attr("height") > container.height()) {
				scale_by_height(container, e);
			} else {
				valign_middle(container, e);
			}
		} else {
			scale_by_height(container, e);

			if (e.attr("width") > container.width()) {
				scale_by_width(container, e);
				valign_middle(container, e);
			}
		}
	};

	$.fn.load_image = function(container, attr) {
		$(new Image())
		.bind('load', {container:container}, onImageLoad)
		.attr(attr)
		.appendTo(this);

		return this;
	};
})(jQuery);
