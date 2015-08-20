//
// Main Javascript file
// Author: Graffino (http://www.graffino.com)
//

/**
 *  Global Vars
 */
 // Scroll
 var scrollPoolingDelay     = 250;
 var scrollEvent            = false;

 /**
  * [gruntflow Object]
  * @type {Object}
  */
var gruntflow = {

    init: function() {
        // Links actions
        gruntflow.linksHandler();

        // Fonts hander
        gruntflow.fontsHandler();

        // Detect browsers
        gruntflow.detectBrowser();

        // Scroll events
        gruntflow.scrollHandler();

        // Resize events
        gruntflow.resizeHandler();
    },

    // Links handler
    linksHandler: function() {
        // Initialize function
        function __init () {
            // Open in new window links with rel=external code
            $('a[rel="external"]').attr('target','_blank');
            // Prevent default action on # (hash) links
            $('a[href="#"]').on('click', function(e) { e.preventDefault(); });
        }

        // Initialize module
        return __init();
    },

    // Fonts handler
    fontsHandler: function() {
        // Initialize function
        function __init() {
            var observer = new FontFaceObserver( "TrendSansOne" );
            // Add fonts-class when fonts are loaded
            observer.check().then( function() {
                document.documentElement.className += " fonts-loaded";
            });
        }

        // Initialize module
        return __init();
    },

    // Detect browsers
    detectBrowser: function() {
        // Initialize function
        function __init() {
            isIE = detectIE();
            // Add class to HTML element
            if (isIE) { $('html').addClass('ie '+isIE); }
        }

        // Detect IE
        function detectIE() {
            var ua      = window.navigator.userAgent;
            var msie    = ua.indexOf('MSIE ');
            var trident = ua.indexOf('Trident/');

            if (msie > 0) {
                // IE 10 or older => return version number
                return 'ie'+parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }

            if (trident > 0) {
                // IE 11 (or newer) => return version number
                var rv = ua.indexOf('rv:');
                return 'ie'+parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }
            // Other browser
            return false;
        }

        // Initialize module
        return __init();
    },

    // Scroll handler
    scrollHandler: function() {
        // Initialize function
        function __init() {
            // Check for scroll function
            $(window).scroll(function() {
                scrollEvent = true;

                // Clear Timeout
                clearTimeout($.data(this, 'scrollTimer'));

                $.data(this, 'scrollTimer', setTimeout(function() {

                    // Fire after scroll stopped for 250ms
                    scrollStopped();

                }, scrollPoolingDelay));

                // Fire instantly (performance issue)
                scrollInstantly();
            });

            // Fire on scroll in 250ms intervals
            setInterval (function() {
                if (scrollEvent) {

                    scrollThrottled();

                    // Reset scroll count
                    scrollEvent = false;
                }
            }, scrollPoolingDelay);
        }

        // Fire after scroll stopped for 250ms
        function scrollStopped() {
            // Do stuff
        }

        // Fire instantly (performance issue)
        function scrollInstantly() {
            // Do stuff
        }

        // Fire on scroll in 250ms intervals
        function scrollThrottled() {
            // Do stuff
        }

        // Initialize module
        return __init();
    },

    // Resize handler
    resizeHandler: function() {
        // Initialize function
        function __init() {
            $(window).on('resize', function() {
                // Do stuff
            });
        }

        // Initialize module
        return __init();
    }
};

/**
 * Document ready (loaded)
 */
jQuery(document).ready(function() {
    // Init scripts
    gruntflow.init();
});

/**
 *  Document load (in process of loading)
 */
jQuery(window).load(function() {
    // Do stuff
});
