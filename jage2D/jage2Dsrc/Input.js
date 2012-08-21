/*======================================================================
 * 
 * JAGE 2D : Javascript-Accelerated 2D Game Engine
 * 
 * Copyright (c) 2012 by Stephen Lindberg (sllindberg21@students.tntech.edu)
 * All rights reserved.
 * 
 * See README file for license.
======================================================================*/

/** Input.js - Provides classes for polling for user input. 
Depends on: none.*/


/**
 * JageMouse
 * Polls for mouse input in a Canvas element.
 **/
function JageMouse(canvas) {
    // DATA

    /** The mouse's current position relative to the Canvas's topleft corner. */
    this.position = new JagePoint(0,0);
    
    /** "Any" mouse presses */
    this.isAnyPressed = false;
    this.justAnyPressed = false;
    this.justAnyClicked = false;
    
    this.paslf = false; // pressed any since last frame
    this.raslf = false; // released any since last frame
    
    /** Left button presses */
    this.isLeftPressed = false;
    this.justLeftPressed = false;
    this.justLeftClicked = false;
    
    this.plslf = false;
    this.rlslf = false;
    
    /** Right button presses */
    this.isRightPressed = false;
    this.justRightPressed = false;
    this.justRightClicked = false;
    
    this.prslf = false;
    this.rrslf = false;
    
    /** Middle button presses */
    this.isMiddlePressed = false;
    this.justMiddlePressed = false;
    this.justMiddleClicked = false;
    
    this.pmslf = false;
    this.rmslf = false;
    
    /** Mouse wheel */
    this.wheel = 0;
    
    this.wdslf = false;
    this.wuslf = false;
    
    // METHODS
    
    /** Updates the state of the JageMouse object based on input data it processed since the last frame. Preferrably, you should call this method just once at the top of your application's logic method. */
    this.poll = function() {
        // Any button
        this.justAnyPressed = false;
        this.justAnyClicked = false;
        
        if(this.paslf) {
            this.justAnyPressed = true;
            this.isAnyPressed = true;
        }
        
        if(this.raslf) {
            this.justAnyClicked = true;
            this.isAnyPressed = false;
        }
        
        // Left button
        this.justLeftPressed = false;
        this.justLeftClicked = false;
        
        if(this.plslf) {
            this.justLeftPressed = true;
            this.isLeftPressed = true;
        }
        
        if(this.rlslf) {
            this.justLeftClicked = true;
            this.isLeftPressed = false;
        }
        
        // Middle button
        
        this.justMiddlePressed = false;
        this.justMiddleClicked = false;
        
        if(this.pmslf) {
            this.justMiddlePressed = true;
            this.isMiddlePressed = true;
        }
        
        if(this.rmslf) {
            this.justMiddleClicked = true;
            this.isMiddlePressed = false;
        }
        
        // Right button 
        this.justRightPressed = false;
        this.justRightClicked = false;
        
        if(this.prslf) {
            this.justRightPressed = true;
            this.isRightPressed = true;
        }
        
        if(this.rrslf) {
            this.justRightClicked = true;
            this.isRightPressed = false;
        }
        
        // Wheel
        this.wheel = 0;
        if(this.wdslf) this.wheel = 1;
        if(this.wuslf) this.wheel = -1;
        
        // reset all the "pressed/released since last frame" flags
        this.paslf = false;
        this.raslf = false;
        this.plslf = false;
        this.rlslf = false;
        this.pmslf = false;
        this.rmslf = false;
        this.prslf = false;
        this.rrslf = false;
        this.wdslf = false;
        this.wuslf = false;
    }
    
    
    // register mouse event handlers for our canvas.
    // In these handlers keep in mind that "this" becomes a reference to the app's canvas element, 
    // not to this JageMouse.
    
    /** Mouse movement handler. */
    canvas.onmousemove = function(evt) {
        var myApp = this.boundJageApp;
        
        myApp.mouse.position.x = evt.pageX - this.offsetLeft;
        myApp.mouse.position.y = evt.pageY - this.offsetTop;
        
        Jage.log("Mouse moved to " + myApp.mouse.position.toString());
    }
    
    /** Mouse button press handler. */
    canvas.onmousedown = function(evt) {
        var myApp = this.boundJageApp;
        
        myApp.mouse.paslf = true;
        
        if ('which' in evt) { // for all standards-compliant browsers.
            switch(evt.which) {
                case 1:
                    myApp.mouse.plslf = true;
                    break;
                case 2: 
                    myApp.mouse.pmslf = true;
                    break;
                case 3: 
                    myApp.mouse.prslf = true;
                    break;
            }
        }
        else { // IE before version 9
            if('button' in evt) {
                if(evt.button & 1) {
                    myApp.mouse.plslf = true;
                }
                if(evt.button & 2) {
                    myApp.mouse.prslf = true;
                }
                if(evt.button & 4) {
                    myApp.mouse.pmslf = true;
                }
            }
        }
    }
    
    /** Mouse button release handler. */
    canvas.onmouseup = function(evt) { 
        var myApp = this.boundJageApp;
        
        myApp.mouse.raslf = true;
        
        if ('which' in evt) { // for all standards-compliant browsers.
            switch(evt.which) {
                case 1:
                    myApp.mouse.rlslf = true;
                    break;
                case 2: 
                    myApp.mouse.rmslf = true;
                    break;
                case 3: 
                    myApp.mouse.rrslf = true;
                    break;
            }
        }
        else { // IE before version 9
            if('button' in evt) {
                if(evt.button & 1) {
                    myApp.mouse.rlslf = true;
                }
                if(evt.button & 2) {
                    myApp.mouse.rrslf = true;
                }
                if(evt.button & 4) {
                    myApp.mouse.rmslf = true;
                }
            }
        }
    }
    
    /** Mouse wheel handler */
    this.myOnmousewheel = function(evt){
        var myApp = this.boundJageApp;
    
        if (!evt) evt = event;
        var delta = (evt.detail<0 || evt.wheelDelta>0) ? 1 : -1;
        if(delta < 0)
            myApp.mouse.wuslf = true;
        if(delta > 0)
            myApp.mouse.wdslf = true;
    };
    
    if(canvas.addEventListener) {
        canvas.addEventListener('DOMMouseScroll', this.myOnmousewheel, false);
        canvas.addEventListener('mousewheel', this.myOnmousewheel, false);
    }
    else {
        canvas.attachEvent('onmousewheel', this.myOnmousewheel);
    }
}


