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
	var w = 4, h = 4;

	var myTimer;

	var tSwift = {x:0, y:0, blankSpace:PS.COLOR_WHITE};

	var cColor = [PS.COLOR_ORANGE, PS.COLOR_GREEN, PS.COLOR_INDIGO];

	var mDO = [ // Map Data Original
		/*cColor[0], cColor[1], cColor[2],
        cColor[0], cColor[1], cColor[2],
        cColor[0], cColor[1], tSwift.blankSpace*/
	];

	var mDC = [ // is a copy of the Original Map Data.
		/*mDO[0], mDO[1], mDO[2],
        mDO[3], mDO[4], mDO[5],
        mDO[6], mDO[7], mDO[8]*/
	];

	var exports =
        {
            init: function () {
                PS.gridSize((w * 2 + 1), h);
                PS.color(w, PS.ALL, PS.COLOR_BLACK);
                PS.color(w, Math.floor(h / 2), PS.COLOR_GRAY);
                PS.statusText( "Sliding Puzzle" );

                PS.glyph(w, Math.floor(h / 2), "R");
                PS.border(PS.ALL, PS.ALL, 0);

                exports.rndStart();
                drawMap(mDO, w, h, w + 1);
                exports.getPos();

                exports.updateMap();
                exports.shuffle();
                drawMap(mDC, w, h, 0);
            },

            rndStart: function () // randomizes original Map
            {
                var x, y, pos;

                for (y = 0; y < h; y++) {
                    for (x = 0; x < w; x++) {
                        pos = (y * w) + x;
                        if (y !== h - 1 || x !== w - 1) {
                            mDO[pos] = cColor[(PS.random(3) - 1)];
                        } else
                            mDO[pos] = tSwift.blankSpace;
                    }
                }
            },

            getPos: function () // returns the position of the blank space (player character)
            {
                var x, y;

                for (y = 0; y < h; y++) {
                    for (x = 0; x < w; x++) {
                        if (mDO[(y * w) + x] === tSwift.blankSpace) {
                            tSwift.x = x;
                            tSwift.y = y;
                        }
                    }
                }
            },

            updateMap: function () // updates the second data table to reflect the newly randomized original table.
            {
                var x, y, pos;
                for (y = 0; y < h; y++) {
                    for (x = 0; x < w; x++) {
                        pos = (y * w) + x;

                        mDC[pos] = mDO[pos];
                    }
                }
            },

            shuffle: function () // shuffles the player around the map according to the move mechanic and then returns the player to start.
            {
                var numRndMoves = Math.pow(w, h);
                var i, mx, my;

                for (i = 0; i < numRndMoves; i++) {

                    if (PS.random(2) - 1 === 0) {
                        // move X
                        mx = (PS.random(2) - 1 === 0) ? -1 : +1;
                        my = 0;
                    } else {
                        mx = 0;
                        my = (PS.random(2) - 1 === 0) ? -1 : +1;
                    }

                    exports.move(mx, my);
                }

                exports.returnStart();
            },

            returnStart: function () // returns the player to start.
            {
                var x, y;
                for (y = tSwift.y; y < h; y++)
                    exports.move(0, y - tSwift.y);

                for (x = tSwift.x; x < w; x++)
                    exports.move(x - tSwift.x, 0);
            },

            moveByClick: function (x, y) // checks to see if the desired location is within move distance then moves if it is.
            {
                if (x === tSwift.x + 1 || x === tSwift.x - 1) {
                    if (y === tSwift.y) {
                        exports.move(x - tSwift.x, y - tSwift.y);
                        PS.audioPlay("fx_click");
                    } else return;
                } else if (y === tSwift.y + 1 || y === tSwift.y - 1) {
                    if (x === tSwift.x) {
                        exports.move(x - tSwift.x, y - tSwift.y);
                        PS.audioPlay("fx_click");
                    } else return;
                } else return;
            },

            move: function (x, y) // moves the position of the blank space (player character)
            {
                // get the next position information.
                var nx = tSwift.x + x;
                var ny = tSwift.y + y;

                // check to see if next area is out of bounds.
                if (nx >= w || ny >= h) return;
                if (nx < 0 || ny < 0) return;

                exports.swap(nx, ny);

                // set the next position of the player character.
                tSwift.x = nx;
                tSwift.y = ny;

                // display the changed positions.
                drawMap(mDC, w, h, 0);
            },

            swap: function (nx, ny) // swaps the next position of the player character with the next position.
            {
                var temp;

                temp = mDC[(ny * w) + nx];
                mDC[(ny * w) + nx] = mDC[(tSwift.y * w) + tSwift.x];
                mDC[(tSwift.y * w) + tSwift.x] = temp;
            },

            checkWin: function () // determines the state of the game (i.e a player has achieved victory or not)
            {
                var x, y, win = true, pos;
                for (y = 0; y < h; y++) {
                    for (x = 0; x < w; x++) {
                        pos = (y * w) + x;
                        if (mDO[pos] != mDC[pos])
                            win = false;
                    }
                }
                return win;
            },

            runRestart: function () // restarts the board and refreshes all beads.
            {
                PS.color(w, PS.ALL, PS.COLOR_BLACK);
                PS.color(w, Math.floor(h / 2), PS.COLOR_GRAY);

                exports.rndStart();
                drawMap(mDO, w, h, w + 1);
                exports.getPos();

                exports.updateMap();
                exports.shuffle();
                drawMap(mDC, w, h, 0);

                PS.statusText( "Sliding Puzzle" );

                PS.gridRefresh();
            }
        };
	return exports;
}();


PS.init = G.init;


var drawMap = function(map, w, h, i)
{
    var x, y, j, data;

    for(y = 0; y < h; y++)
    {
        for(x = 0; x < w; x++)
        {
            j = x + i;
            data = map[( y * w )+ x];
            PS.color( j, y, data );
        }
    }
};

PS.keyDown = function( key, shift, ctrl, options ) {
	if(key !== 114) {
        if (G.checkWin() !== true) {
            switch (key) {
                case PS.KEY_ARROW_UP:
                    G.move(0, -1);
                    break;
                case PS.KEY_ARROW_DOWN:
                    G.move(0, 1);
                    break;
                case PS.KEY_ARROW_LEFT:
                    G.move(-1, 0);
                    break;
                case PS.KEY_ARROW_RIGHT:
                    G.move(1, 0);
                    break;
            }
        } else
            PS.statusText("You Win!");
    }else
    	G.runRestart();
};

PS.touch = function( x, y, data, options ) {
    if (PS.color(x, y) === PS.COLOR_GRAY) {
        G.runRestart();
    } else {
        if (G.checkWin() !== true) {
            G.moveByClick(x, y);
        } else
            PS.statusText("You Win!");
    }
};

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
