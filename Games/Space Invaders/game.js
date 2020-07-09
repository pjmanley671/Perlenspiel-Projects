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
	var winState = false; // initializes and sets the win state.
	var w = 32, h = 32; // initializes and sets the width and height of the play space.
	var sTimer, uTimer, dTimer, gTimer; // initializes the timer variables.
	var shotReady = false, ufoReady = false; // initializes and sets the player unique abilities.
	var shots = [], ufos = []; // initializes the arrays for the shots and ufos.

	var makeShot = function() // create a new shot object.
	{
		if(shotReady === false) // checks to make sure that the shot ability is ready.
			return;

		var myShot = // creates the new shot.
			{
				x : 0, y : 0,  // initializes the x and y coordinates and sets the color.cColor : PS.COLOR_GREEN
				setSpawn : function(sx, sy) // sets the shots spawn location.
				{
                    this.x = sx;
                    this.y = sy - 2; // offsets the y location to be 1 higher.
                },

				move : function(cx, cy) // moves the shot.
				{
					this.x = this.x + cx;
					this.y = this.y + cy;
				}
			};
		myShot.setSpawn(defender.x, defender.y); // sets the new shot at according to the  defenders position.
		shots.unshift(myShot); // adds the new shot to the list of shots.
		shotReady = false; // disables the defenders ability to shoot.
		PS.audioPlay("fx_bang");
	};

	var makeUfo = function() // create a new ufo.
	{
		if(ufoReady === false) // checks to see if the ufo ability is ready.
			return;
		if(exports.inSpawn()) // checks to see if the spawn location is clear.
			return;

		var myUfo = // initializes the new ufo.
			{
				x : 0, y : 0, //cColor : PS.COLOR_MAGENTA
				setSpawn : function() // sets the ufos spawn.
				{
					this.x = Math.floor(w / 2); // sets the ufos spawn to be half the width of the board.
					this.y = 2;
				},

				move : function(cx, cy) // moves the ufo.
				{
					if(exports.inBounds(this.x + cx, this.y + cy)) // makes sure that the location being moved to is in the game space.
					{
						if(exports.ufoCollision(this.x + cx, this.y + cy)) // makes sure that this ufo doesn't collide with other ufos.
							return;

                        this.x = this.x + cx;
                        this.y = this.y + cy;

                        if(this.y >= h-4) // when moved the ufo checks to see if it has reached its destination.
                        	winState = true;
                    }
				}
			};
		myUfo.setSpawn(); // tells the new ufo to set its spawn.
		ufos.unshift(myUfo); // assigns the new ufo into the list.
		ufoReady = false; // disables the ufos ability to produce more ufos.
	};

	var defender = // initializes the defender.
		{
			x : 0, y : 0,  // initializes the x and y coordinates and sets the color., cColor : PS.COLOR_RED
			setSpawn : function() // sets the spawn of the defender
			{
				this.x = Math.floor(w / 2); // sets the x coordinate to half the width.
				this.y = (h - 3); // sets the y coordinate to 2 higher than the height.
			},

			move : function(cx, cy) // move the defender.
			{
				if(exports.inBounds(this.x + cx, this.y + cy))
                {
                    this.x = this.x + cx;
                    this.y = this.y + cy;
                }
			}
		};

	var myLoader = function(image)
	{
		var i;
		if(image.source === "https://pjmanley671.github.io/game-files/SpaceInvaders/images/BackGround.bmp")
			PS.imageBlit(image, 0, 0);

		if(image.source === "https://pjmanley671.github.io/game-files/SpaceInvaders/images/defenderBase.bmp")
			PS.imageBlit(image, defender.x - 2, defender.y+1);
		if(image.source === "https://pjmanley671.github.io/game-files/SpaceInvaders/images/defenderBotMid.bmp")
			PS.imageBlit(image, defender.x - 2, defender.y);
		if(image.source === "https://pjmanley671.github.io/game-files/SpaceInvaders/images/defenderTopMid.bmp")
			PS.imageBlit(image, defender.x - 1, defender.y - 1);
		if(image.source === "https://pjmanley671.github.io/game-files/SpaceInvaders/images/defenderTop.bmp")
			PS.imageBlit(image, defender.x  - 0, defender.y - 2);

		if(image.source === "https://pjmanley671.github.io/game-files/SpaceInvaders/images/Shot.bmp")
		{
			for(i = 0; i < shots.length; i++)
			{
				PS.imageBlit(image, shots[i].x, shots[i].y);
			}
		}

		if(image.source === "https://pjmanley671.github.io/game-files/SpaceInvaders/images/UfoBase.bmp")
		{
			for(i = 0; i < ufos.length; i++)
			{
				PS.imageBlit(image, ufos[i].x-2, ufos[i].y+1);
			}
		}

        if(image.source === "https://pjmanley671.github.io/game-files/SpaceInvaders/images/UfoMid.bmp")
        {
            for(i = 0; i < ufos.length; i++)
            {
                PS.imageBlit(image, ufos[i].x-1, ufos[i].y);
            }
        }

        if(image.source === "https://pjmanley671.github.io/game-files/SpaceInvaders/images/UfoTop.bmp")
        {
        	for(i = 0; i < ufos.length; i++)
        	{
        		PS.imageBlit(image, ufos[i].x, ufos[i].y-1);
			}
		}
	};
	var exports =
		{
			init : function() // initializes the game space.
			{
				PS.gridSize(w, h);
				PS.border(PS.ALL, PS.ALL, 0);

				PS.statusText("UFO: Arrows + /, DEFCOM: WASD spacebar.");

				winState = false;
                ufoReady = true;
                shotReady = true;

				defender.setSpawn();
				makeUfo();

				sTimer = PS.timerStart(2, exports.shiftShots);
				uTimer = PS.timerStart(160, exports.uAbility);
				dTimer = PS.timerStart(4, exports.dAbility);
				gTimer = PS.timerStart(1, exports.gameState);

				exports.drawMap();
			},

			drawMap : function() // draws the current instance of the game.
			{
				PS.imageLoad("https://pjmanley671.github.io/game-files/SpaceInvaders/images/BackGround.bmp", myLoader, 1);
				
				PS.imageLoad("https://pjmanley671.github.io/game-files/SpaceInvaders/images/defenderBase.bmp", myLoader, 2);
				PS.imageLoad("https://pjmanley671.github.io/game-files/SpaceInvaders/images/defenderBotMid.bmp", myLoader, 2);
				PS.imageLoad("https://pjmanley671.github.io/game-files/SpaceInvaders/images/defenderTopMid.bmp", myLoader, 2);
				PS.imageLoad("https://pjmanley671.github.io/game-files/SpaceInvaders/images/defenderTop.bmp", myLoader, 2);

				PS.imageLoad("https://pjmanley671.github.io/game-files/SpaceInvaders/images/Shot.bmp", myLoader, 2);

				PS.imageLoad("https://pjmanley671.github.io/game-files/SpaceInvaders/images/UfoBase.bmp", myLoader, 2);
				PS.imageLoad("https://pjmanley671.github.io/game-files/SpaceInvaders/images/UfoMid.bmp", myLoader, 2);
				PS.imageLoad("https://pjmanley671.github.io/game-files/SpaceInvaders/images/UfoTop.bmp", myLoader, 2);

			},

			pInput : function(key) // brings in the player input then performs actions accordingly.
			{
				if(winState === false)
				{
                    switch (key) { // defender movement + actions.
                        case 119:
                            //PS.debug("KEY === 'W'\n");
                            defender.move(0, 0);
                            break;
                        case 100:
                            //PS.debug("KEY === 'D'\n");
                            defender.move(1, 0);
                            break;
                        case 97:
                            //PS.debug("KEY === 'A'\n");
                            defender.move(-1, 0);
                            break;
                        case 115:
                            //PS.debug("KEY === 'S'\n");
                            defender.move(0, 0);
                            break;
                        case 32:
                            //PS.debug("KEY === 'SPACE_BAR'\n");
                            makeShot();
                            break;
                        default:
                            break;
                    }

                    switch (key) { // ufo moments + actions.
                        case PS.KEY_ARROW_UP:
                            //PS.debug("KEY === 'UP ARROW'\n");
                            exports.shiftUfos(0, -1); // moves the ufo up
                            break;
                        case PS.KEY_ARROW_DOWN:
                            //PS.debug("KEY === 'DOWN ARROW'\n");
                            exports.shiftUfos(0, 1); // moves the ufo down
                            break;
                        case PS.KEY_ARROW_RIGHT:
                            //PS.debug("KEY === 'RIGHT ARROW'\n");
                            exports.shiftUfos(1, 0); // moves the ufo right
                            break;
                        case PS.KEY_ARROW_LEFT:
                            //PS.debug("KEY === 'LEFT ARROW'\n");
                            exports.shiftUfos(-1, 0); // moves the ufo left
                            break;
                        case 47:
                            //PS.debug("KEY === 'forward slash'\n")
                            makeUfo(); // creates a copy of the ufo.
                            break;
                        default:
                            break;
                    }
                }else
				{
                    switch (key)
					{
                        case 114:
                            exports.restart(); // restarts the game.
                            break;
                    }
                }

                exports.drawMap();
			},

			shiftUfos : function(cx, cy) // shifts the position of the ufos according change in x and change in y.
			{
				var i, cLoc;
				for(i = 0; i < ufos.length; i++)
				{
					ufos[i].move(cx, cy);
					cLoc = exports.checkCollision(ufos[i], shots);
					if(cLoc !== -1)
					{
						exports.destroy(shots, cLoc);
						exports.destroy(ufos, i);
					}
				}
			},

			shiftShots : function () // shifts the list of shots according to the sTimer.
			{
				var i, cLoc;
				for(i = 0; i < shots.length; i++)
				{
					shots[i].move(0, -1);
					if(exports.inBounds(shots[i].x, shots[i].y))
					{
                        cLoc = exports.checkCollision(shots[i], ufos);
                        if (cLoc !== -1)
                        {
                        	exports.destroy(ufos, cLoc);
                        	exports.destroy(shots, i);
                        	PS.audioPlay("fx_coin7");
                        }
                    }else
                    	{
                    		exports.destroy(shots, i);
                    	}
				}
				exports.drawMap();
            },

            inSpawn : function() // determines if a ufo from the list of ufos is in the spawn.
			{
				var i;

				for(i = 0; i < ufos.length; i++)
				{
					if(ufos[i].x === Math.floor(w / 2) && ufos[i].y === 2)
						return true;
				}

				return false;
			},

			inBounds : function(x, y) // determines if the passed in x and y position is in the game space.
			{
				if(x < 0 || y < 0)
					return false;

				if(x > w - 1 || y > h - 1)
					return false;

				return true;
			},

			checkCollision : function(obj, iList) // checks to see if a specific object collides with another object from a list.
			{
				var i;
				for(i = 0; i < iList.length; i++)
				{
					if(iList[i].x === obj.x && iList[i].y === obj.y)
						return i;
				}
				return -1;
			},

			ufoCollision : function(x, y) // checks to see if a ufo would collide with another ufo.
			{
				var i;

				for(i = 0; i < ufos.length; i++)
				{
					if(ufos[i].x === x && ufos[i].y === y)
						return true;
				}
			},

			destroy : function(iList, i) // deletes a specific object from a list.
			{
				if(i !== iList.length - 1)
				{
					var tmp = iList[i];
					iList[i] = iList[iList.length-1];
					iList[iList.length-1] = tmp;
				}

				iList.pop();

				if(ufos.length === 0)
					winState = true;
			},

            uAbility : function() // resets the ufo ability to spawn in more clones.
            {
                ufoReady = true;
            },

			dAbility : function() // resets the defenders ability to create shots.
			{
				shotReady = true;
			},

			gameState : function() // responds to the state of the game such as if the game is finished.
			{
				if(winState === true)
				{
                    PS.timerStop(uTimer);
                    PS.timerStop(sTimer);
                    PS.timerStop(dTimer);
                    PS.timerStop(gTimer);

					if(ufos.length < 1)
						PS.statusText("Defenders Win!");
					else
						PS.statusText("Invaders Win!");
				}
			},

			clearList : function(iList) // clears a list of objects.
			{
                var i, length;

                length = iList.length;

                if(length > 0)
                {
                    for (i = 0; length > i;)
                    {
                        iList[i] = null;
                        iList.shift();
                        length = iList.length;
                    }
                }
			},

			close : function() // runs when the browser is closed.
			{
                PS.timerStop(uTimer);
                PS.timerStop(sTimer);
                PS.timerStop(dTimer);
                PS.timerStop(gTimer);
			},

			restart : function() // restarts the game.
			{
				exports.clearList(shots);
				exports.clearList(ufos);

				exports.init();
			}
		};

	return exports;
}();

PS.init = G.init;

PS.touch = function( x, y, data, options ) {};

PS.release = function( x, y, data, options ) {};

PS.enter = function( x, y, data, options ) {};

PS.exit = function( x, y, data, options ) {};

PS.exitGrid = function( options ) {};

PS.keyDown = function( key, shift, ctrl, options ) {G.pInput(key)};

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

PS.shutdown = function( options ) {G.close;};
