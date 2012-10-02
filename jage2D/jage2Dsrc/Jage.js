/*======================================================================
 * 
 * JAGE 2D : Javascript-Accelerated 2D Game Engine
 * 
 * Copyright (c) 2012 by Stephen Lindberg (sllindberg21@students.tntech.edu)
 * All rights reserved.
 * 
 * See README file for license.
======================================================================*/

/** 
 * Jage.js
 * The top-level script for the Jage2D library. 
 * Depends on: none.
 */


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


/** Appends a Javascript file to the document's header. */
/*
Jage.addScript = function (scriptName) {
    var elem = document.createElement("script");
    var scripte = document.getElementsByTagName("script");
    elem.type = "text/javascript";
    elem.src = scriptName;
    document.getElementsByTagName("head")[0].appendChild(elem);
    Jage.log(scriptName + " appended.");
};

Jage.addScripts = function (targetname, scriptname) {
    var elem = document.createElement("script");
    var scripte = document.getElementsByTagName("script");
    for (var t = 0; t < scripte.length; t++) {
        if (scripte[t].src.indexOf(targetname) > -1) {
            elem.src = scripte[t].src.replace(targetname, scriptname);
            t = scripte.length + 1;
        }
    }
    elem.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(elem);
};*/

var jageNode = null;

Jage.loadJageScript = function (scriptName) {
    var elem = document.createElement("script");
    elem.type = "text/javascript";
    elem.src = scriptName;
    
    // obtain the node for Jage.js's script element in the document if we don't already have it.
    if(!jageNode) {
        var scripte = document.getElementsByTagName("script");
        
        /** Find the location of this script, that is "Jage.js". */
        for(var t = 0; t < scripte.length; t++) {
            if (scripte[t].src.indexOf("Jage.js") > -1) {
                jageNode = scripte[t];
                t = scripte.length + 1;
            }
        } 
    }
    
    // insert the new script element after Jage.js's script element.
    jageNode.parentNode.insertBefore(elem, jageNode.nextSibling);
    Jage.log(scriptName + " appended.");
};


// Add the scripts for all the JAGE2D components so that this is the ONLY script the user has to import themselves.
/*
Jage.loadJageScript("jage2Dsrc/JageMath.js");
Jage.loadJageScript("jage2Dsrc/Camera.js");
Jage.loadJageScript("jage2Dsrc/Graphics.js");
Jage.loadJageScript("jage2Dsrc/App.js");
*/

/** Gets the absolute position of a DOM element in the document. */
Jage.getAbsolutePosition = function(element) {
    // get the absolute position of the canvas element in the document.
    var obj = element;
    var offX = 0;
    var offY = 0;
    while( obj.nodeName != "BODY") {
        offX += obj.offsetLeft;
        offY += obj.offsetTop;
        
        obj = obj.parentNode;
    }
    
    return [offX, offY];
};



Jage.observedFocusables = [];
Jage.nextObservableID = 0;

/** 
 * Tells the Jage system to observe a Jage entity that can gain focus for user input. 
 * It prevents duplicates from being observed.
 * Returns true if successful. Else returns false. 
 */
Jage.observeFocusable = function(focusable) {
    if(!focusable.trait_focusable) 
        return false;
    
    // Assign the focusable component a unique id for the purpose of being observed for focus by the Jage system. 
    if(!focusable.JageObservableID) {
        focusable.JageObservableID = "id" + Jage.nextObservableID;
        Jage.nextObservableID++;
    }
    
    // Add the focusable component into our table of observed focusable Jage components. 
    Jage.observedFocusables[focusable.JageObservableID] = focusable;
    
    return true;
}


/** Grants focus to a JageComponent and relinquishes focus from all other observed focusable Jage components. */
Jage.requestFocusFor = function(focusable) {
    if(!focusable.trait_focusable) 
        return false;
    
    // add focusable to our table of observed focusables if it isn't already.
    Jage.observeFocusable(focusable);
    
    // relinquish focus from all focusables.
    for(var i in Jage.observedFocusables) {
        var other = Jage.observedFocusables[i];
        other.hasFocus = false;
    }
    
    // grant our focusable focus.
    focusable.hasFocus = true;
    
    return true;
}

