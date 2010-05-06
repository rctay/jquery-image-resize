/**
 * Copyright (C) 2010, Tay Ray Chuan
 *
 * See README.rst for licensing details.
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
		.resize_image(event.data.dimensions)
		.trigger('image_loaded_scaled')
		.unbind(event);
	};

	var attach_load_handlers = function(e, dimensions, should_not_hide) {
		e.bind('load', {dimensions: dimensions}, onImageLoad);


		// by default, hide image before it is loaded.
		if (!should_not_hide) {
			e
			.hide()
			.bind('image_loaded_scaled', function(event) {
				$(this).show().unbind(event);
			});
		}

	};

	/**
	 * Resizes the selected element with the ``'width'`` and ``'height'``
	 * attributes with the specified dimensions.
	 *
	 * Alone, this method is unlikely to be useful, but may come in handy if
	 * you're writing your own event handlers.
	 *
	 * :param dimensions: An object containing ``'width'`` and ``'height'``
	 *   properties; if they're functions, they will be invoked with no
	 *   arguments, and their return values, used.
	 *
	 * :returns: The selected element(s).
	 */
	$.fn.resize_image = function(dimensions) {
		// get dimensions
		var w = dimensions.width instanceof Function ? dimensions.width() : dimensions.width;
		var h = dimensions.height instanceof Function ? dimensions.height() : dimensions.height;

		this.each(function() {
			var e = $(this);

			// is fat?
			if (e.attr("width") > e.attr("height")) {
				scale_by_width(w, e);

				if (e.attr("height") > h) {
					scale_by_height(h, e);
				} else {
					valign_middle(h, e);
				}
			} else {
				scale_by_height(h, e);

				if (e.attr("width") > w) {
					scale_by_width(w, e);
					valign_middle(h, e);
				}
			}
		});

		return this;
	};

	/**
	 * Resizes an image with .resize_image() on completion of loading.
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
	 * :param dimensions: Optional; defaults to the selected element(s)'
	 *   parent. See the *dimensions* argument to .resize_image().
	 *
	 * :param should_not_hide: Optional; if true, the image will be hidden
	 *   before loading, and shown on loading completion.
	 *
	 * :returns: The selected element(s).
	 */
	$.fn.resize_image_on_load = function(dimensions, should_not_hide) {
		var p = this.parent();

		this.each(function() {
			var e = $(this);

			// dimensions is optional; defaults to selected element.
			if (dimensions == null) {
				dimensions = p;
			}

			attach_load_handlers(e, dimensions, should_not_hide);
		});

		return this;
	};

	/**
	 * Loads an image into the selected element, resizing it with
	 * .resize_image() on completion.
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
	 * :param dimensions: Optional; defaults to the selected element. See
	 *   the *dimensions* argument to .resize_image().
	 *
	 * :param should_not_hide: Optional; if true, the image will be hidden
	 *   before loading, and shown on loading completion.
	 *
	 * :returns: A jQuery instance of the Image(s) created (NOT the selected
	 *   element).
	 */
	$.fn.load_and_resize_image = function(attr, dimensions, should_not_hide) {
		var ret = [];

		this.each(function() {
			var e = $(this);

			// dimensions is optional; defaults to selected element.
			if (dimensions == null) {
				dimensions = e;
			}

			var i = $(new Image())
			.appendTo(e);

			attach_load_handlers(i, dimensions, should_not_hide);

			i.attr(attr);
			ret.push(i);
		});

		return $(ret);
	};
})(jQuery);
