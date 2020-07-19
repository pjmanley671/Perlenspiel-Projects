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
 * Objective: Make a game using perlenspiel.
 * Notes: 
 *		Project was originally a school project.
 *		In order for the game to run images need to be ran through a hosting server. This is a perlenspiel issue not my mistake.
 *		Original version used position data to check for collision.
 *
 * Going forward: 
 *		Add in image-based collision.
 *		Add in cover image for detailing player mechanics
 *		
 * Version: 5.0
 * Perlenspiel Package: 3.3
*/
var G = function()
{
	var urlSource = "https://pjmanley671.github.io/game-files/SpaceInvaders/images/";
	var width = 32, height = 32;
	var shots = [null], ufos = [null];
	var gameStates = {win: false, shot: false, ufo: false};
	var timerIntervals = {update : 1, shot : 2, ufo : 120, defender : 4, step : 0};
	var myTimer, drawTimer;
	
	var defender = 
	{
		x : 0, y : 0,
		SendToSpawn : function()
		{
			this.x = Math.floor(width / 2);
			this.y = height - 3;
		},

		move : function(px)
		{
			this.x += px;
		}
	};

	var MakeUFO = function()
	{
		var myUfo = 
		{
			x : 0, y : 0,

			SendToSpawn : function()
			{
				this.x = Math.floor(width / 2);
				this.y = 2;
			},

			move : function(px, py)
			{
				this.x += px;
				this.y += py;
			}
		};

		myUfo.SendToSpawn();
		ufos.unshift(myUfo);
	}

	var OnTick = function()
	{
		timerIntervals.step++;
		
		if(!gameStates.shot)
		{
			timerIntervals.defender++;
			if(timerIntervals.defender == 4)
			{
				gameStates.shot = true;
				timerIntervals.defender = 0;
			}
		}
		
		if(!gameStates.ufo)
		{
			timerIntervals.ufo++;
			if(timerIntervals.ufo == 120)
			{
				gameStates.ufo = true;
				timerIntervals.ufo = 0;
			}
		}
		
	};
	
	var OnTick_Draw = function()
	{

	};
	
	var ClearList = function(iList)
	{
		var i, length;
        length = iList.length;

		for (i = 0; length > i;)
		{
			iList[i] = null;
			iList.shift();
			length = iList.length;
		}
	};
	
	var exports = 
	{
		Init : function()
		{
			PS.gridSize(width, height);
			PS.border(PS.ALL, PS.ALL, 0);
			PS.statusText("Space Invaders");
			
			gameStates.win = false;
			gameStates.shot = true;
			gameStates.ufo = true;
			
			ClearList(shots);
			ClearList(ufos);
			
			myTimer = PS.timerStart(timerIntervals.update, OnTick);
			drawTimer = PS.timerStart(timerIntervals.update, OnTick_Draw);
		},
		
		KeyPress : function(key, shift, ctrl, options)
		{
			
		},
		
		Close : function()
		{
			PS.timerStop(myTimer);
			PS.timerStop(drawTimer);
		}
	};
	
	return exports;
}();

PS.init = G.Init;
PS.keyDown = G.KeyPress;
PS.shutdown = G.Close;

PS.touch = function( x, y, data, options ) {};

PS.release = function( x, y, data, options ) {};

PS.enter = function( x, y, data, options ) {};

PS.exit = function( x, y, data, options ) {};

PS.exitGrid = function( options ) {};

PS.keyUp = function( key, shift, ctrl, options ) {};

PS.input = function( sensors, options ) {/*
	 PS.debug( "PS.input() called\n" );
	 var device = sensors.wheel; // check for scroll wheel
	 if ( device )
	 {
	 PS.debug( "sensors.wheel = " + device + "\n" );
	 }
	 */};

PS.swipe = function( data, options ) {};