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
 * Input.js
 * Provides classes for polling for user input that has occurred between timer events. 
 * Depends on: none.
 */


/**
 * JageMouse
 * Polls for mouse input in a Canvas element.
 **/
function JageMouse(canvas) {
    // DATA

    /** The mouse's current position relative to the Canvas's topleft corner. */
    this.position = new JagePoint(0,0);
    this.x = 0;
    this.y = 0;
    
    /** "Any" mouse presses */
    this.isAnyPressed = false;
    this.justAnyPressed = false;
    this.justAnyClicked = false;
    
    this.paslf = false; // pressed any since last frame
    this.raslf = false; // released any since last frame
    
    /** Left button presses */
    this.isLeftPressed = false;
    this.justLeftPressed = false;
    this.justLeftPressedRep = false;
    this.justLeftClicked = false;
    
    this.plslf = false;
    this.rlslf = false;
    
    /** Right button presses */
    this.isRightPressed = false;
    this.justRightPressed = false;
    this.justRightPressedRep = false;
    this.justRightClicked = false;
    
    this.prslf = false;
    this.rrslf = false;
    
    /** Middle button presses */
    this.isMiddlePressed = false;
    this.justMiddlePressed = false;
    this.justMiddlePressedRep = false;
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
            
            // If we click in this app's canvas, this app becomes our window's active Jage application 
            // and can receive keyboard events.
            window.activeJageApp = canvas.boundJageApp;
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
        /*
        // get the absolute position of the canvas element in the document.
        var obj = this;
        var offX = 0;
        var offY = 0;
        while( obj.nodeName != "BODY") {
            offX += obj.offsetLeft;
            offY += obj.offsetTop;
            
            obj = obj.parentNode;
        }*/
        
        var canvasAbsPos = Jage.getAbsolutePosition(this);
        var offX = canvasAbsPos[0];
        var offY = canvasAbsPos[1];
        
        // set the mouse's canvas coordinates.
        myApp.mouse.position.x = evt.pageX - offX;
        myApp.mouse.position.y = evt.pageY - offY;
        myApp.mouse.x = myApp.mouse.position.x;
        myApp.mouse.y = myApp.mouse.position.y;
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
        
        evt.stopPropagation();
        evt.preventDefault();
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
        
        evt.stopPropagation();
        evt.preventDefault();
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
            
        evt.stopPropagation();
        evt.preventDefault();
    };
    
    if(canvas.addEventListener) {
        canvas.addEventListener('DOMMouseScroll', this.myOnmousewheel, false);
        canvas.addEventListener('mousewheel', this.myOnmousewheel, false);
    }
    else {
        canvas.attachEvent('onmousewheel', this.myOnmousewheel);
    }
}


/** A convenient global mapping of key names to keyCodes. */
if(typeof Keys === 'undefined') {
    // This mapping will only be provided if Keys has not yet been defined. 
    // So make sure nothing else was already using Keys global object before using it.
    Keys = function () {};
    Keys.BackSpace = 8;
    Keys.Tab = 9;
    Keys.Enter = 13;
    Keys.Shift = 16;
    Keys.Ctrl = 17;
    Keys.Alt = 18;
    Keys.Pause= 19;
    Keys.CapsLock = 20;
    Keys.Escape = 27;
    Keys.PageUp = 33;
    Keys.PageDown = 34;
    Keys.End = 35;
    Keys.Home = 36;
    Keys.Left = 37;
    Keys.Up = 38;
    Keys.Right = 39;
    Keys.Down = 40;
    Keys.Insert = 45;
    Keys.Delete = 46;
    Keys.Key0 = 48;
    Keys.Key1 = 49;
    Keys.Key2 = 50;
    Keys.Key3 = 51;
    Keys.Key4 = 52;
    Keys.Key5 = 53;
    Keys.Key6 = 54;
    Keys.Key7 = 55;
    Keys.Key8 = 56;
    Keys.Key9 = 57;
    Keys.A = 65;
    Keys.B = 66;
    Keys.C = 67;
    Keys.D = 68;
    Keys.E= 69;
    Keys.F = 70;
    Keys.G = 71;
    Keys.H = 72;
    Keys.I = 73;
    Keys.J = 74;
    Keys.K = 75;
    Keys.L = 76;
    Keys.M = 77;
    Keys.N = 78;
    Keys.O = 79;
    Keys.P = 80;
    Keys.Q = 81;
    Keys.R = 82;
    Keys.S = 83;
    Keys.T = 84;
    Keys.U = 85;
    Keys.V = 86;
    Keys.W = 87;
    Keys.X = 88;
    Keys.Y = 89;
    Keys.Z = 90;
    Keys.Numpad0 = 96;
    Keys.Numpad1 = 97;
    Keys.Numpad2 = 98;
    Keys.Numpad3 = 99;
    Keys.Numpad4 = 100;
    Keys.Numpad5 = 101;
    Keys.Numpad6 = 102;
    Keys.Numpad7 = 103;
    Keys.Numpad8 = 104;
    Keys.Numpad9 = 105;
    Keys.Multiply = 106;
    Keys.Add = 107;
    Keys.Subtract = 109;
    Keys.Decimal = 110;
    Keys.Divide = 111;
    Keys.F1 = 112;
    Keys.F2 = 113;
    Keys.F3 = 114;
    Keys.F4 = 115;
    Keys.F5 = 116;
    Keys.F6 = 117;
    Keys.F7 = 118;
    Keys.F8 = 119;
    Keys.F9 = 120;
    Keys.F10 = 121;
    Keys.F11 = 122;
    Keys.F12 = 123;
    Keys.NumLock= 144;
    Keys.ScrollLock = 145;
    Keys.Semicolon = 186;
    Keys.Equals = 187;
    Keys.Comma = 188;
    Keys.Minus = 189;
    Keys.Period = 190;
    Keys.Slash = 191;
    Keys.BackQuote = 192;
    Keys.BraceLeft = 219;
    Keys.BackSlash = 220;
    Keys.BraceRight = 221;
    Keys.Quote = 222;
}






/**
 * JageKeyboard
 * Polls for keyboard input in a Canvas element.
 **/
function JageKeyboard(canvas) {
    // DATA
    
    /** Flags for checking the state of the fabled "any" key. */
    this.isAnyPressed = false
    this.justAnyPressed = false;
    this.justAnyTyped = false;
    
    this.paslf = false;
    this.raslf = false;
    
    /** Key code -> flag maps for checking the state of each individual key. */
    this.isPressed = [];
    this.justPressed = [];
    this.justTyped = [];
    
    // This is a special table that is true for a key when it is just pressed, and then it continues
    // to flash true intermitently if it continues to be pressed. 
    this.justPressedRep = [];
    
    /** List of keycodes pressed or released since last frame */
    this.pslf = [];
    this.rslf = [];
    
    this.lastKeyPressed = null;
    
    // METHODS
    
    this.poll = function() {
        // The fabled "any" key.
        this.justAnyPressed = false;
        this.justAnyType = false;
        
        
        if(this.paslf) {
            if(!this.isAnyPressed) this.justAnyPressed = true;
        }
        
        if(this.raslf) {
            this.justAnyTyped = true;
        }
        
        this.paslf = false;
        this.raslf = false;
        
        // Process specific keys
        this.justPressed = [];
        this.justTyped = [];
        this.justPressedRep = [];
        
        for(keycode in this.pslf) {
            if(!this.isPressed[keycode]) this.justPressed[keycode] = true;
            this.isPressed[keycode] = true;
            
            this.justPressedRep[keycode] = true;
            
            this.lastKeyPressed = keycode;
        }
        
        for(keycode in this.rslf) {
            this.justTyped[keycode] = true;
            this.isPressed[keycode] = false;
        }
        
        // check for isAnyPressed.
        this.isAnyPressed = false;
        for(keyFlag in this.isPressed) {
            if(this.isPressed[keyFlag] == true) this.isAnyPressed = true;
        }
        if(!this.isAnyPressed) this.isPressed = [];
        
        // clean up for next polling.
        this.pslf = [];
        this.rslf = [];
    }
    
    // initialization
    
    window.onkeydown = function(evt) {
        if(!evt) evt = window.event;
        var myApp = this.activeJageApp;
        if(!myApp) return;
        
        myApp.keyboard.paslf = true;
        var mykeyCode = evt.keyCode;
        myApp.keyboard.pslf[mykeyCode] = mykeyCode;
        
        
    }
    
    window.onkeyup = function(evt) {
        if(!evt) evt = window.event;
        var myApp = this.activeJageApp;
        if(!myApp) return;
        
        myApp.keyboard.raslf = true;
        var mykeyCode = evt.keyCode;
        myApp.keyboard.rslf[mykeyCode] = mykeyCode;
    }
}





