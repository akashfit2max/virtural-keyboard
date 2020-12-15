const Keyboard = {
    elements : {
        //main keyboard
        main: null,
        //keys container
        keysContainer : null,
        // all the keys  in the keyboard 
        keys: []
    },

    eventHandelers : {
        oninput : null,
        onclose : null
    },

    properties : {
        value : "",
        capsLock : false
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");         //2 div banae ynha pe jisme main aur keycontainer generate hongai
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        // ek node list bana dega ye keys ka jiske help se hmm keys ko uppercase ya lowercase me kr skte
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);  //apna main keyboard wala container h ye jo hamne apne main keyboard div me dala
        document.body.appendChild(this.elements.main); // main ko dynamically DOM me daala

        // automatical use keyboard for elements with .use-keyboard-input 
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currenValue => {
                    element.value = currenValue;
                });
            });
        });


    },

    _createKeys() {
        const fragment = document.createDocumentFragment();

        //entire key elements like a,b,c;
        const KeyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        // each key ko loop kr rahe h  
        KeyLayout.forEach(key => {
            //dynamically ek buton ko add kr rahe h ynah pe
            const keyElement = document.createElement("button");
            // jitni bhee keys h neeche wo sab ek new line me aani h 
            const insertLineBreak = ["backspace", "p" , "enter", "?"].indexOf(key) !== -1; //ye true/false return karega agar isme se koi bhee key ho thoo wo keys niewline me h.

            //Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            // using switch statement to add classes according to paticular keys 
            switch(key) {

                case "backspace" : 
                // backspace wali class add karega isme aur icon set krne k lie createIconHTML wali function run karega 
                keyElement.classList.add("keyboard__key--wide");
                keyElement.innerHTML = createIconHTML("backspace");

                keyElement.addEventListener("click", () => {
                    // backspace dabane ek jost last char h wo delete hoga tho starting se leke end-1 tk jo substring a wo bachega 
                    this.properties.value = this.properties.value.substring(0,this.properties.value.length-1);
                    //backspace ke baad ek element delete hua h thoo oninput event trigger hoga
                    this._triggerEvent("oninput");
                });
                break;

                case "caps" : 
                // caps wali class add karega isme aur icon set krne k lie createIconHTML wali function run karega 
                keyElement.classList.add("keyboard__key--activatable");
                keyElement.innerHTML = createIconHTML("keyboard_capslock");

                keyElement.addEventListener("click", () => {
                    this._toggleCapslock();
                    // caps dabane se jo green light hogi wo on ya off i.e toggle krne k lie ye function run karega
                    keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);

                });
                break;

                case "enter" : 
                // new line add krne k lie 
                keyElement.classList.add("keyboard__key--wide");
                keyElement.innerHTML = createIconHTML("keyboard_return");

                keyElement.addEventListener("click", () => {
                    this.properties.value += "\n";
                    this._triggerEvent("oninput");

                });
                break;

                case "space" : 
                // space bar ek white space add karega 
                keyElement.classList.add("keyboard__key--extra-wide");
                keyElement.innerHTML = createIconHTML("space_bar");

                keyElement.addEventListener("click", () => {
                    this.properties.value += " ";
                    this._triggerEvent("oninput");

                });
                break;

                case "done" : 
                // 
                keyElement.classList.add("keyboard__key--wide", "Keyboard__key--dark");
                keyElement.innerHTML = createIconHTML("check_circle");

                keyElement.addEventListener("click", () => {
                    //ye event triggger hote hee keyboard close ho jaega
                    this.close();
                    this._triggerEvent("onclose");

                });
                break;

                default : 
                //special keys a alaw aur koi bhee key  
                keyElement.textContent = key.toLowerCase();

                keyElement.addEventListener("click", () => {
                    // agar caps on kia thoo uppercase me char ko append krna h 
                    this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                    this._triggerEvent("oninput");

                });
                break;
            }
            // fragement is just a container jsime hum sare key-elements ko daal rahe 
            fragment.appendChild(keyElement);

            // agar line break add krna ho thoo ek br tag daal dena fragement me 
            if(insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        //jitne bhee buttons the sb dynamically bana die h humne jo iss fragement container me jaaengai
        return fragment;

    },

    _triggerEvent(handlerName) {
        //agar oninput ya onclose function triggerevent me thoo unko run krne k lie ye function h
        if(typeof this.eventHandelers[handlerName]=="function") {
            this.eventHandelers[handlerName](this.properties.value);
        }
        // console.log("Event Triggered! Event Name : " + handlerName);
    },

    _toggleCapslock() { 
        this.properties.capsLock = !this.properties.capsLock;

        for(const key of this.elements.keys) {
            // standard key jisme koi icon nai h like arguments,b,c,....z tk 
            if(key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();  
            }
        }
        // console.log("Caps lock triggered");
    },

    // to start where we left we add the initial value 
    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || " ";
        this.eventHandelers.oninput = oninput;
        this.eventHandelers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
        
        // $('#my-text').emojioneArea({
        //     pickerPosition : 'rigth '
        //   })
    },

    close() {           
        this.properties.value = " ";
        this.eventHandelers.oninput = oninput;
        this.eventHandelers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");

    }

};


window.addEventListener("DOMContentLoaded", function() {
    Keyboard.init();
    
    // Keyboard.open("decode", function(currenValue) {
    //     console.log("value changed : " + currenValue);
    // },
    // function(currenValue) {
    //     console.log("keyboard closed!  finishing value: " + currenValue);
    // });  
});