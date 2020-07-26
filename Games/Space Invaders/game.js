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
	var timerIntervals = {update : 1, shot : 2, ufo : 120, defender : 8, step : 0};
	var myTimer, drawTimer, collisionTimer;
	var hitX = -1, hitY = -1;
	
	var defender = 
	{
		x : 0, y : 0,
		SendToSpawn : function()
		{
			this.x = Math.floor(width / 2) - 2;
			this.y = height - 3;
		},

		Move : function(px)
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
				this.x = Math.floor(width / 2) - 2;
				this.y = 4;
			},

			Move : function(px, py)
			{
				this.x += px;
				this.y += py;
			}
		};

		myUfo.SendToSpawn();
		ufos.unshift(myUfo);
	};

	var MakeShot = function()
	{
		var myShot = 
		{
			x : 0, y : 0,

			SendToSpawn : function()
			{
				this.x = defender.x + 2;
				this.y = defender.y - 4;
			},

			Move : function()
			{
				this.y -= 1;
			}
		};

		myShot.SendToSpawn();
		shots.unshift(myShot);
		PS.audioPlay("fx_bang");
	};

	var CheckAgainstBounds = function(px, py)
	{
		if(px > 0 && px < 32)
			if(py > 0 && py < 32)
				return true;
		
		return false;
	}; // Checks to see if the passed in location is still in bounds as opposed to out of bounds.

	var UfoCollisionCheck = function(px, py)
	{
		var collisionCall = false;
		for(var y = 0; y < 3; y++)
		{
			for(var x = y; x < 5 - y; x++)
			{
				switch(PS.color(px + x, py - y))
				{
					case PS.COLOR_BLACK:
					case 12790527:
					case 13464048:
					case 16777215:
						break;
					default: 
						collisionCall = true;
						hitX = px + x;
						hitY = py - y;
						break;
				}
			}
		} // Check the area of the UFO

		for(var x = 0; x < 5; x++)
		{
			switch(PS.color(px + x, py + 1))
			{
				case PS.COLOR_BLACK:
				case 12790527:
				case 13464048:
				case 16777215:
					break;
				default:
					collisionCall = true;
					hitX = px + x;
					hitY = py + 1;
					break;
			}
		} // Check the area just below the UFO

		return collisionCall;
	}; // Organized to check based off of ufo form.

	DestroyObjectFromList = function(iList, i) 
	{
		if(i !== iList.length - 1)
		{
			var tmp = iList[i];
			iList[i] = iList[iList.length-1];
			iList[iList.length-1] = tmp;
		}

		iList.pop();
	};

	var OnTick = function()
	{
		if(gameStates.win) return;

		timerIntervals.step++;
		timerIntervals.shot++;
		
		if(!gameStates.shot)
		{
			timerIntervals.defender++;
			if(timerIntervals.defender == 8)
			{
				gameStates.shot = true;
				timerIntervals.defender = 0;
			}
		} // Handles the defenders ability to shoot.
		
		if(!gameStates.ufo)
		{
			timerIntervals.ufo++;
			if(timerIntervals.ufo == 120)
			{
				gameStates.ufo = true;
				timerIntervals.ufo = 0;
			}
		} // Handles the ufos ability to clone itself.

		if(timerIntervals.shot === 2)
		{
			timerIntervals.shot = 0;
			for(var i = 0; i < shots.length; i++)
			{
				if(CheckAgainstBounds(shots[i].x, shots[i].y - 1))
					shots[i].Move();
				else
					DestroyObjectFromList(shots, i);
			}
		} // Handles updating each shot in list shots movement.
	}; // Centralizes game update logic. 

	var myLoader = function(image)
	{
		switch(image.source.substring(urlSource.length))
		{
			case "BackGround.bmp":
				PS.imageBlit(image, 0, 0);
				break;
			case "defenderBase.bmp":
				PS.imageBlit(image, defender.x, defender.y);
				break;
			case "defenderBotMid.bmp":
				PS.imageBlit(image, defender.x, defender.y - 1);
				break;
			case "defenderTopMid.bmp":
				PS.imageBlit(image, defender.x + 1, defender.y - 2);
				break;
			case "defenderTop.bmp":
				PS.imageBlit(image, defender.x + 2, defender.y - 3);
				break;
			case "UfoBase.bmp": 
				for(var i = 0; i < ufos.length; i++)
				{
					PS.imageBlit(image, ufos[i].x, ufos[i].y);
				}
				break;
			case "UfoMid.bmp":
				for(var i = 0; i < ufos.length; i++)
				{
					PS.imageBlit(image, ufos[i].x + 1, ufos[i].y - 1);
				}
				break;
			case "UfoTop.bmp":
				for(var i = 0; i < ufos.length; i++)
				{
					PS.imageBlit(image, ufos[i].x + 2, ufos[i].y - 2);
				}
				break;
			case "Shot.bmp":
				for(var i = 0; i < shots.length; i++)
				{
					PS.imageBlit(image, shots[i].x, shots[i].y);
				}
				break;
			default: 
				break;
		} // Using Switch Case to reduce complexity of condition statements.
	};
	
	var OnTick_Draw = function()
	{
		PS.imageLoad(urlSource + "BackGround.bmp", myLoader, 1);

		PS.imageLoad(urlSource + "defenderBase.bmp", myLoader, 2);
		PS.imageLoad(urlSource + "defenderBotMid.bmp", myLoader, 2);
		PS.imageLoad(urlSource + "defenderTopMid.bmp", myLoader, 2);
		PS.imageLoad(urlSource + "defenderTop.bmp", myLoader, 2);

		PS.imageLoad(urlSource + "UfoBase.bmp", myLoader, 2);
		PS.imageLoad(urlSource + "UfoMid.bmp", myLoader, 2);
		PS.imageLoad(urlSource + "UfoTop.bmp", myLoader, 2);

		PS.imageLoad(urlSource + "Shot.bmp", myLoader, 2);

		PS.debugClear();
		if(!gameStates.shot)
			PS.debug("Shot ready in " + (6 - timerIntervals.defender));
		else
			PS.debug("Shot ready!");
		
		if(!gameStates.ufo)
			PS.debug("\nUfo ready in " + (120 - timerIntervals.ufo));
		else
			PS.debug("\nUfo ready!");

	}; // Draws in order of bottom level to top level so the background doesn't overwrite anything.
	
	var OnTick_Collision = function()
	{
		hitX = -1;
		hitY = -1;
		for(var i = 0; i < ufos.length; i++)
		{
			if(UfoCollisionCheck(ufos[i].x, ufos[i].y))
				DestroyObjectFromList(ufos, i);
		} // Handles ufo collision information.

		for(var i = 0; i < shots.length; i++)
		{
			if(shots[i].x === hitX && shots[i].y === hitY)
			{
				DestroyObjectFromList(shots, i);
				PS.audioPlay("fx_coin7");
			}
			else
			{
				switch(PS.color(shots[i].x, shots[i].y))
				{
					case PS.COLOR_BLACK:
					case 15987477:
						break;
					default: DestroyObjectFromList(shots, i);
						break;
				}
			}
		} // Handles shot collision information.

		if(ufos.length === 0)
			gameStates.win = true;
	}; // Centralizes Collision occurences.

	var ClearList = function(iList)
	{
		iList.length = 0;
	};
	
	var exports = 
	{
		Init : function()
		{
			ClearList(shots);
			ClearList(ufos);

			PS.gridSize(width, height);
			PS.border(PS.ALL, PS.ALL, 0);
			PS.statusText("Space Invaders");
			
			defender.SendToSpawn();
			MakeUFO();

			gameStates.win = false;
			gameStates.shot = true;
			gameStates.ufo = false;
			
			timerIntervals.ufo = 0;
			timerIntervals.defender = 0;
			timerIntervals.shot = 0;
			
			myTimer = PS.timerStart(timerIntervals.update, OnTick);
			drawTimer = PS.timerStart(timerIntervals.update, OnTick_Draw);
			collisionTimer = PS.timerStart(timerIntervals.update, OnTick_Collision);
		},
		
		KeyPress : function(key, shift, ctrl, options)
		{
			/* TODO : Add in control logic to check  to see if ufo is in the spawn location. */
			if(gameStates.win)
			{
				switch(key)
				{
					case 114: // stop all the timers so reset doesn't get angry.
						PS.timerStop(myTimer);
						PS.timerStop(drawTimer);
						PS.timerStop(collisionTimer);
						exports.Init();
						break;
					default:
						break;
				}
			}else
			{
				switch(key)
				{
					/* Defender Keys */
					case 100: //PS.debug("KEY === 'D'\n");
						if(CheckAgainstBounds(defender.x + 5, defender.y))
							defender.Move(1);
						break;
					case 97: //PS.debug("KEY === 'A'\n");
						if(CheckAgainstBounds(defender.x, defender.y))
							defender.Move(-1);
						break;
					case 32: //PS.debug("KEY === 'SPACE_BAR'\n");
						if(gameStates.shot)
						{
							MakeShot();
							gameStates.shot = false;
						}
						break;
					
					/* UFO Keys */
					case PS.KEY_ARROW_UP:
						for(var i = 0; i < ufos.length; i++)
						{
							if(CheckAgainstBounds(ufos[i].x, ufos[i].y - 2))
								ufos[i].Move(0, -1);
						}
                        break;
                    case PS.KEY_ARROW_DOWN:
						for(var i = 0; i < ufos.length; i++)
						{
							if(CheckAgainstBounds(ufos[i].x, ufos[i].y + 1))
								ufos[i].Move(0, 1);
						}
                        break;
                    case PS.KEY_ARROW_RIGHT:
						for(var i = 0; i < ufos.length; i++)
						{
							if(CheckAgainstBounds(ufos[i].x + 5, ufos[i].y))
								ufos[i].Move(1, 0);
						}
                        break;
                    case PS.KEY_ARROW_LEFT:
						for(var i = 0; i < ufos.length; i++)
						{
							if(CheckAgainstBounds(ufos[i].x, ufos[i].y))
								ufos[i].Move(-1, 0);
						}
                        break;
					case 47: //PS.debug("KEY === 'forward slash'\n")
							MakeUFO();
							gameStates.ufo = false;
                        break;
					default:
						break;
				}
			}
		},
		
		Close : function()
		{
			PS.timerStop(myTimer);
			PS.timerStop(drawTimer);
			PS.timerStop(collisionTimer);
			ClearList(shots);
			ClearList(ufos);
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