/*
game.js for Perlenspiel 3.3.x
Last revision: 2020-03-24 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-20 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
By default, all event-handling function templates are COMMENTED OUT (using block-comment syntax), and are therefore INACTIVE.
Uncomment and add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 5, freeze : true */
/* globals PS : true */

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.init() event handler:

/* Original Author: Paul Manley
 * Objective: Make a puzzle using perlenspiel.
 * Notes: 
 *		Project was originally a school project.
 *
 * Going forward: 
 *		Add in audio cues to enhance player feed back.
 *		Fix hover issue for resolving completion.
 *		Add in cover image for detailing puzzle layout and interactions.
 *		
 * Version: 2.0
 * Perlenspiel Package: 3.3
*/

var G = function ()
{
	var mapData;
	
	var exports =
	{
		init: function()
		{
			PS.gridSize(9, 4);
			PS.color(4, PS.ALL, PS.COLOR_BLACK);
			PS.color(4, 0, PS.COLOR_GRAY);
			PS.glyph(4, 0, "R");
			PS.border(PS.ALL, PS.ALL, 0);
		},
		
		OnPress: function(key, shift, ctrl, options)
		{
			
		},
		
		OnTouch: function(x, y, data, options)
		{
			
		}
		
	};
	return exports;
}();


PS.init = G.init;
PS.keyDown = G.OnPress;
PS.touch = G.OnTouch;

PS.shutdown = function( options ) {
};

PS.release = function( x, y, data, options ) {
};

PS.enter = function( x, y, data, options ) {
};

PS.exit = function( x, y, data, options ) {
};

PS.exitGrid = function( options ) {
};

PS.keyUp = function( key, shift, ctrl, options ) {
};

PS.input = function( sensors, options ) {
	/*
	 PS.debug( "PS.input() called\n" );
	 var device = sensors.wheel; // check for scroll wheel
	 if ( device )
	 {
	 PS.debug( "sensors.wheel = " + device + "\n" );
	 }
	 */
};

PS.swipe = function( data, options ) {
};
