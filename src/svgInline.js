/**
 * SVG Inline v0.1.0
 *
 * A simple script to replace SVG <img> elements with inline SVG objects, to be able
 * to control SVG elements with CSS or Javascript.
 *
 * @author Jurjen Sytsma <jurjen@collabo.amsterdam>
 * @license https://creativecommons.org/publicdomain/zero/1.0/
 */
(function($) {

    /**
     * @constructor
     */
    var SVGInline = function() {

        /**
         * Holds image data. When an svg image occurs more then once, it will be loaded from the storage instead of
         * being downloaded again. Especially useful for icons
         *
         * @type {Array}
         */
        this.storage = [];

        /**
         * Mutation observer object, to handle svg images added dynamically
         *
         * @type {MutationObserver}
         */
        this.observer = null;

        /**
         * Stores a selectorString to match DOM mutations
         *
         * @type {string}
         */
        this.observerSelector = null;
    };

    /**
     * Register the MutationObserver and get ready to handle mutations
     *
     * @param selector
     */
    SVGInline.prototype.observe = function( selector ) {

        this.observerSelector = selector;

        this.observer = new MutationObserver(function(mutations) {
            mutations.forEach(function (mutation) {
                this.handleMutation(mutation);
            }.bind(this));
        }.bind(this));

        this.observer.observe(document.querySelector('body'), { childList: true, subtree: true });
    };

    /**
     * Handle a DOM mutation; check if and if so replace the inline svg
     *
     * @param mutation
     */
    SVGInline.prototype.handleMutation = function ( mutation ) {
        if ( ! mutation.addedNodes.length ) return;

        mutation.addedNodes.forEach( function( node ) {
            if ( node.nodeType !== Node.ELEMENT_NODE ) return;
            if ( node.matches( this.observerSelector ) ) {
                this.replace( $(node) );
            } else {
                var els = $(node).find( this.observerSelector );
                if ( els.length ) {
                    els.each ( function(i, el) {
                        this.replace( $(el) );
                    }.bind(this));
                }
            }
        }.bind(this));
    };

    /**
     * Replace the <img> element with inline SVG.
     *
     * The id and class attributes will be copied over. You can either set the src or inline-src attribute. When using
     * src the image will be loaded twice; once by the browser because it found the src tag, once by this script.
     * Subsequent
     *
     * @param {Object} image jQuery object holding an <img> element
     */
    SVGInline.prototype.replace = function( image ) {
        // Get essential attributes
        var attributes = {
            id: image.attr('id'),
            class: image.attr('class'),
            src: image.attr('inline-src') || image.attr('src')
        };

        var deferred = this.getSVG( attributes.src );

        $.when(deferred.promise).then(function ( svg ) {

            // We need to clone the actual svg object we're replacing in case it's been loaded before
            var $svg = $(svg).find('svg').clone();

            if(typeof attributes.id !== 'undefined') {
                $svg.attr('id', attributes.id);
            }

            if(typeof attributes.class !== 'undefined') {
                $svg.attr('class', attributes.class + ' replaced-svg');
            }

            $svg.removeAttr('xmlns:a');

            image.replaceWith($svg);
        });
    };

    /**
     * Get the svg data.
     *
     * @param {string} src Image url
     * @return {Object} Source url and a promise
     */
    SVGInline.prototype.getSVG = function( src ) {

        // Return from storage if it's been requested before
        if ( item = this.find( src ) ) {
            return item;
        }

        var item = {
            src: src,
            promise: $.get( src ).promise()
        };

        this.storage.push( item );

        return item;
    };

    /**
     * Retrieve image data from storage, if present.
     *
     * @param {string} src Image url
     * @return {(Object | Boolean )} The item if found, false otherwise
     */
    SVGInline.prototype.find = function( src ) {
        for ( var i in this.storage ) {
            if ( ! this.storage.hasOwnProperty(i) ) continue;
            if ( this.storage[i].src === src ) {
                return this.storage[i];
            }
        }

        return false;
    };

    // Make available
    window.SVGInline = SVGInline;

})(jQuery);