(function(context){
	// this is the public class that i'm placing in the global scope
	var EventStack = context.EventStack = function() {
  	var publicMethods = {}
  	var eventHolder = function(type, payload){ // this is the object we return to the outside world after all the initialization has been done and the emit method has been defined already
    	publicMethods.emit(type, payload)
    }

    var namedListeners = {}
    var unnamedListeners = []
    Object.defineProperty(publicMethods, "emit", {
    	enumerable: false,
      configurable: false,
      value: function(type, payload){
      	console.log("emit function called")
      	// todo go through the current named listener and then the unnamed listners and call all of them in reverse order
      }
    })

    Object.defineProperty(publicMethods, "listen", {
	    enumerable: false,
      configurable: false,
      // listen function returns the unlistener function
      value: function(v1, v2){
      	console.log("listen function called")
      	var target, listener
        // map v1 and v2 to the proper variable
      	if (typeof v1 === "string"){
        	//v1 is a string therefore it listens to a event type
          target = v1
          listener = v2 // rest of implimentation deets go here
        }
        else if (typeof v1 === "function" && typeof v2 === "undefined"){
        	// v1 is a function therefore the listener listenes to all events on this level
         listener = v1
        }
        // impli8ment the logic to actually listen to things
      }
    })

    Object.defineProperty(publicMethods, "add", {
    	enumerable: false,
      configurable: false,
      value: function(name, listener){
      	console.log("add function called")
      	eventHolder[name] = listener
        listener.listen(eventHolder) // register a listener of the parent to the chiled so all of the actions in the child, the parent will know.
      }
    })

    return eventHolder
  }

	if (typeof module !== "undefined" && typeof modeule.export !== undefined){
  	module.export = EventStack
  }
})(this)


// here is how the code is aimed to be used outside of it's private context
// in a sense this is a unit test
var base = new EventStack()
base.add("nextStack", new EventStack())
base.listen("eventType", function(ev, payload){
	console.log("This should fire third", ev, payload)
})
base.listen(function(ev, payload){
	consol.log("This should fire fourth", ev, payload)
})
base.nextStack.listen("eventType", function(ev, payload){
	console.log("This should fire first", ev, payload)
})
base.nextStack.listen(function(ev, payload){
	console.log("This should fire second", ev, payload)
})
base.nextStack.emit("eventType", eventData = {
	type: "nonesense",
  source: "earth",
  foo: "bar"
})
base.nextStack("eventType", eventData = {
	type: "Gibrish",
  source: "Deep Space",
  foo: "Bar"
})
// i also want to do
