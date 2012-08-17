/*======================================================================
 * 
 * JAGE 2D : Javascript-Accelerated 2D Game Engine
 * 
 * Copyright (c) 2012 by Stephen Lindberg (sllindberg21@students.tntech.edu)
 * All rights reserved.
 * 
 * See README file for license.
======================================================================*/

/** An object representing the Jage system for this context. It provides some static methods and data structures used for handling the applications in this context. */
function Jage () {
}

/** A queue for apps waiting to have a turn to run. */
Jage.apps = [];

/** 
 * A global handler for handling an asynchronous timer event from an app. 
 * This method is automatically called with setTimeout by your JageApp's step method.
 * Remember that asynchronous events all run in the same thread. So, if you have multiple 
 * JageApps running, they'll only run as fast as the one with the lowest frame rate.
 */
Jage.timerHandler = function() {
    if(Jage.apps.length > 0) {
        // get the next app from the Jage queue and runs its step method.
        var myApp = Jage.apps.shift();
        myApp.step();
    }
}


/** A cross-browser function for printing messages to the javascript console. */
Jage.log = function(msg) {
    setTimeout(function() {
        throw new Error(msg);
    }, 0);
}

