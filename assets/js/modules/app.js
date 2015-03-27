/* 
Main Javascript file
Author: Graffino (http://www.graffino.com)
*/

// Global Vars

// GruntFlow JS

var gruntflow = {

	init: function() {

		// Open in new window links with rel=external code
		gruntflow.externalLink();

		// Prevent default action on # (hash) links
		gruntflow.preventLink();
	},
	
	// Open in new window links with rel=external code
	externalLink: function() { 
		$('a[rel="external"]').attr('target','_blank'); 
	},

	// Prevent default action on # (hash) links	
	preventLink: function() { $('a[href="#"]').on('click', function(e) { 
		e.preventDefault(); }); 
	}
};

// !Document ready (loaded)
// --------------------------------------------------------------
jQuery(document).ready(function() {	

	// Init scripts
	gruntflow.init();

// !---- End Document Ready Function ----

});

// !Document load (in process of loading) function
// --------------------------------------------------------------
jQuery(window).load(function() {

// !---- End Document Load Function ----
});
