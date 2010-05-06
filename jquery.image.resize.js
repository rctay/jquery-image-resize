/**
 * Copyright (C) 2010, Tay Ray Chuan
 **/

(function($) {
	var scale_by_width = function(w, child) {
		var h = child.attr("height") * (w / child.attr("width"));
		child.attr("width", w);
		child.attr("height", h);
	};

	var scale_by_height = function(h, child) {
		var w = child.attr("width") * (h / child.attr("height"));
		child.attr("height", h);
		child.attr("width", w);
	};

	/**
	 * horizontally, text-align takes care of centralising for us.
	 * vertically, not so.
	 */
	var valign_middle = function(h, child) {
		var delta = h - child.attr("height");
		child.css("margin-top", delta==0 ? 0 : delta/2);
	};

	var onImageLoad = function(event) {
		$(this)
		.trigger('image_loaded')
		.scale_image_to(event.data.dimensions)
		.trigger('image_loaded_scaled');
	};

	/**
	 * Resizes the selected element with the ``'width'`` and ``'height'``
	 * attributes with the specified dimensions.
	 *
	 * :param dimensions: An object containing ``'width'`` and ``'height'``
	 *   properties; if they're functions, they will be invoked with no
	 *   arguments, and their return values, used.
	 *
	 * :returns: The selected element.
	 */
	$.fn.scale_image_to = function(dimensions) {
		// get dimensions
		var w = dimensions.width instanceof Function ? dimensions.width() : dimensions.width;
		var h = dimensions.height instanceof Function ? dimensions.height() : dimensions.height;

		// is fat?
		if (this.attr("width") > this.attr("height")) {
			scale_by_width(w, this);

			if (this.attr("height") > h) {
				scale_by_height(h, this);
			} else {
				valign_middle(h, this);
			}
		} else {
			scale_by_height(h, this);

			if (this.attr("width") > w) {
				scale_by_width(w, this);
				valign_middle(h, this);
			}
		}

		return this;
	};

	/**
	 * Loads an image into the selected element, resizing it with
	 * .scale_image_to() on completion.
	 *
	 * The following events are triggered on the image upon completion of
	 * loading:
	 *
	 *  - ``'image_loaded'``
	 *  - ``'image_loaded_scaled'``
	 *
	 * Unless *should_not_hide* is specified, by default a closure to show
	 * the image will be bound to the ``'image_loaded_scaled'`` event.
	 *
	 * :param attr: An object that will be passed to .attr(); minimally, this
	 *   must contain a ``'src'`` entry, or the image will fail to load.
	 *
	 * :param dimensions: Optional; see the *dimensions* argument to
	 *   .scale_image_to().
	 *
	 * :param should_not_hide: Optional; if true, the image will be hidden
	 *   before loading, and shown on loading completion.
	 *
	 * :returns: The instance of Image created (NOT the selected element).
	 */
	$.fn.load_image = function(attr, dimensions, should_not_hide) {
		// dimensions is optional; defaults to selected element.
		if (dimensions == null) {
			dimensions = this;
		}

		var i = $(new Image())
		.bind('load', {dimensions: dimensions}, onImageLoad)
		.appendTo(this);

		// by default, hide image before it is loaded.
		if (!should_not_hide) {
			i
			.hide()
			.bind('image_loaded_scaled', function() {
				$(this).show();
			});
		}

		i.attr(attr);

		return i;
	};
})(jQuery);
