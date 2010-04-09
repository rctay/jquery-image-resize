/**
 * Copyright (C) 2010, Tay Ray Chuan
 **/

(function($) {
	var scale_by_width = function(d, child) {
		var h = child.attr("height") * (d.width / child.attr("width"));
		child.attr("width", d.width);
		child.attr("height", h);
	};

	var scale_by_height = function(d, child) {
		var w = child.attr("width") * (d.height / child.attr("height"));
		child.attr("height", d.height);
		child.attr("width", w);
	};

	/**
	 * horizontally, text-align takes care of centralising for us.
	 * vertically, not so.
	 */
	var valign_middle = function(d, child) {
		var delta = d.height - child.attr("height");
		child.css("margin-top", delta==0 ? 0 : delta/2);
	};

	var onImageLoad = function(event) {
		$(this)
		.scale_image_to(event.data.dimensions);
	};

	$.fn.scale_image_to = function(dimensions) {
		// build dimensions dictionary.
		var d = {
			width: dimensions.width instanceof Function ? dimensions.width() : dimensions.width,
			height: dimensions.height instanceof Function ? dimensions.height() : dimensions.height
		};

		// is fat?
		if (this.attr("width") > this.attr("height")) {
			scale_by_width(d, this);

			if (this.attr("height") > d.height) {
				scale_by_height(d, this);
			} else {
				valign_middle(d, this);
			}
		} else {
			scale_by_height(d, this);

			if (this.attr("width") > d.width) {
				scale_by_width(d, this);
				valign_middle(d, this);
			}
		}

		return this;
	};

	$.fn.load_image = function(attr, dimensions) {
		// dimensions is optional; defaults to selected element.
		if (dimensions == null) {
			dimensions = this;
		}

		$(new Image())
		.bind('load', {dimensions: dimensions}, onImageLoad)
		.attr(attr)
		.appendTo(this);

		return this;
	};
})(jQuery);
