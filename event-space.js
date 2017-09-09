(function(context){
	// this is the public class that i'm placing in the global scope
	var EventStack = context.EventStack = function() {
	  	var publicMethods = {}
	  	var eventHolder = function(type, payload){
			// this is the object we return to the outside world after all the initialization has been done and the emit method has been defined already
	    	publicMethods.emit(type, payload)
	    }
		Object.setPrototypeOf(eventHolder, publicMethods)

	    var namedListeners = {}
	    var unnamedListeners = []

		var emitfn = function(callIndex, type, payload = {}){
			//console.log("emit function called")
			// todo go through the current named listener and then the unnamed listners and call all of them in reverse order

			var canPropigate = true
			var eventObject = {}

			Object.defineProperty(eventObject, "currentCallIndex", {
				enumerable: true,
				configurable: false,
				get: function(){
					return callIndex
				},
				set: function(){} // set is an empty function that does nothing
			})

			Object.defineProperty(eventObject, "stopPropigation", {
				enumerable: true,
				configurable: false,
				value: function(){
					canPropigate = false
				}
			})

			Object.defineProperty(eventObject, "type", {
				enumerable: true,
				configurable: false,
				value: type
			})

			if (typeof namedListeners[type] !== "undefined"){
				for (var i = namedListeners[type].length; canPropigate && i-- ;){
					namedListeners[type][i](eventObject, payload)
					callIndex++
				}
			}

			for (var i = unnamedListeners.length; canPropigate && i-- ;){
				unnamedListeners[i](eventObject, payload)
				callIndex++
			}
		}

	    Object.defineProperty(publicMethods, "emit", {
			enumerable: false,
			configurable: false,
			value: emitfn.bind(eventHolder, 0) // hide the currentcallIndex from the user and is never accessable
	    })

	    Object.defineProperty(publicMethods, "listen", {
		    enumerable: false,
	      	configurable: false,
	      	// listen function returns the unlistener function
	      	value: function(v1, v2){
	      		//console.log("listen function called")
	      		var target, listener, addLocation
	        	// map v1 and v2 to the proper variable
	      		if (typeof v1 === "string"){
	        		//v1 is a string therefore it listens to a event type
	          		target = v1
	          		listener = v2 // rest of implimentation deets go here
			  		addLocation = namedListeners[target] = namedListeners[target] || []
	        	}
	        	else if (typeof v1 === "function" && typeof v2 === "undefined"){
	        		// v1 is a function therefore the listener listenes to all events on this level
		         	listener = v1
					addLocation = unnamedListeners
	        	}
	        	// impliment the logic to actually listen to things

				addLocation.push(listener)

				return function(){
					addLocation.forEach(function(item, index){
						if (item === listener){
							addLocation.splice(index, 1)
						}
					})
				}
	      	}
	    })

	    Object.defineProperty(publicMethods, "add", {
	    	enumerable: false,
	      	configurable: false,
	      	value: function(name){
	      		//console.log("add function called")
				var listener = new EventStack()
	      		eventHolder[name] = listener
	        	listener.listen(function(ev, payload){
					emitfn(ev.currentCallIndex, ev.type, payload) // use the currentCallIndex to perserve the call index as it propigates
				}) // register a listener of the parent to the chiled so all of the actions in the child, the parent will know.
	      	}
	    })

	    return eventHolder
  	}

	if (typeof module !== "undefined" && typeof module.export !== undefined){
  	module.export = EventStack
  }
})(this)


// here is how the code is aimed to be used outside of it's private context
// in a sense this is a unit test
var base = new this.EventStack()
base.add("nextStack")
var off1 = base.listen("eventType", function(ev, payload){
	console.log("This should fire third", ev.currentCallIndex)
	ev.stopPropigation()
})
var off2 = base.listen(function(ev, payload){
	console.log("This should fire fourth",  ev.currentCallIndex)
})
var off3 = base.nextStack.listen("eventType", function(ev, payload){
	console.log("This should fire first",  ev.currentCallIndex)
})
var off4 = base.nextStack.listen(function(ev, payload){
	console.log("This should fire second",  ev.currentCallIndex)
})
base.nextStack.emit("eventType", eventData = {
	type: "nonesense",
  	source: "earth",
  	foo: "bar"
})
off1()
base.nextStack("eventType", eventData = {
	type: "Gibrish",
  	source: "Deep Space",
  	foo: "Bar"
})
