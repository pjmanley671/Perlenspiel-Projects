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
 * Objective: Make a toy using perlenspiel.
 * Notes: 
 *		Project was originally a school project.
 *
 * Going forward: 
 *		Make cover image detailing purpose of toy.
 *		
 * Version: 2.0
 * Perlenspiel Package: 3.3
*/

var G = function()
{
	var Maps = [
		0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0
	];
	var exports = {

        init : function () {
            PS.gridSize( 7, 7 );

            PS.gridColor( 0, 0, 0);
            var myFunction = PS.timerStart( 10, timeFunction );

            PS.statusText( "Color Lock" );
            PS.statusColor( 201, 126, 0);

        },

        checkClick : function (nx, ny)
		{
			if(Maps[(ny * 7) + nx] === 1)
				return 1;
			else
				return 0;
		},

		changeBeadStatus : function(x, y, v)
		{
			Maps[ (y * 7) + x] = v;
		},

        checkTable : function ()
        {
            var i = 0, j = 0;
            for( ; i<49; i++ )
            {
                if(Maps[i] === 1)
                {
                    j = 1;
                }
                else if(Maps[i] === 0)
                {
                    return 0;
                }
            }
            return 1;
        }
    };

    return exports;
}();


PS.init = G.init;

PS.touch = function( x, y, data, options ) {
	//PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// by clicking on a tile that tile should
    // 'lock' itself, increase the border width and change the color of the border.
	if(G.checkClick(x, y) === 0) {
        G.changeBeadStatus(x, y, 1);
        PS.audioPlay( "fx_bloop" );
        PS.border(x, y, 2);
        PS.borderColor(x, y, 256, 256, 0);
    }else {
	    // by clicking a second time the tile should
        // 'unlock' itself revert the border width to default, and return the border color to default;
        G.changeBeadStatus(x, y, 0);
        PS.audioPlay( "fx_pop" );
        PS.border(x, y, 1);
        PS.borderColor(x, y, 156, 156, 156);
    }
};

PS.shutdown = function( options ) {
    PS.timerStop(myFunction);
};

var timeFunction = function()
{
    // if a random tile is not locked change the color of the tile.
    var nx, ny, clickStatus;
    if(G.checkTable() === 0) {
        do {
            nx = PS.random(7) - 1;
            ny = PS.random(7) - 1;
            clickStatus = G.checkClick(nx, ny);
        } while (clickStatus === 1);
        PS.color(nx, ny, PS.random(256) - 1, PS.random(256) - 1, (PS.random(156) + -1) + 100);
    }
};

PS.release = function( x, y, data, options ) {
	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );
};

PS.enter = function( x, y, data, options ) {
	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );
};

PS.exit = function( x, y, data, options ) {
	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );
};

PS.exitGrid = function( options ) {
	// PS.debug( "PS.exitGrid() called\n" );
};

PS.keyDown = function( key, shift, ctrl, options ) {
	//	PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );
};

PS.keyUp = function( key, shift, ctrl, options ) {
	// PS.debug( "PS.keyUp(): key = " + key + ", shift = " + shift + ", ctrl = " + ctrl + "\n" );
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
