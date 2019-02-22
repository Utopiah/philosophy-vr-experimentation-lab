/* global AFRAME experiment */
AFRAME.registerComponent('experiment-setup', {
  init: function () {
    var el = this.el;
    function addTarget(x, randomness){      
      var newTarget = document.createElement("a-entity")
      newTarget.setAttribute("gltf-model", "#morty")
      if (randomness)
        var position = {x:(-experiment.leftTargets/2 + x)+Math.random(), y:Math.random()/10, z:Math.random()}
      else
        var position = {x:(-experiment.leftTargets/2 + x), y:0, z:0}
      newTarget.setAttribute("position",  position)
      return newTarget
    }
    function addRail(position){      
      var rail = document.createElement("a-entity")
      
      var location = document.createElement("a-entity")
      location.setAttribute("scale", "5 5 5")
      location.setAttribute("text", "value", AFRAME.utils.coordinates.stringify(position) )
      location.setAttribute("position", "0 1 0")
      
      var leftRail = document.createElement("a-entity")
      leftRail.setAttribute("geometry", "depth: " + experiment.trackLength + "; height: 0.1; width: 0.1")
      leftRail.setAttribute("material", "color: #595959")
      leftRail.setAttribute("position", "-0.25 0 0")
      
      var rightRail = document.createElement("a-entity")
      rightRail.setAttribute("geometry", "depth: " + experiment.trackLength + "; height: 0.1; width: 0.1")
      rightRail.setAttribute("material", "color: #595959")
      rightRail.setAttribute("position", "0.25 0 0")
      
      for (var i=0; i<experiment.trackLength*2; i++){
        var woordPart = document.createElement("a-entity")
        woordPart.setAttribute("geometry", "depth: 0.1; height: 0.1; width: 1")
        woordPart.setAttribute("material", "color: #542929")
        woordPart.setAttribute("position", "0 -0.1 " + (i*experiment.trackLength/10 - 2.5) )
        rail.appendChild(woordPart)
      }
      
      if (experiment.debug) rail.appendChild(location)
      rail.appendChild(leftRail)
      rail.appendChild(rightRail)
      rail.setAttribute("position",  position)
      return rail
    }
    
    document.querySelector("#camera-rig").setAttribute("animation", "dur", experiment.animationDuration * 1000)
    document.querySelector("#camera-rig").setAttribute("animation__left", "dur", experiment.animationDuration * 1000)
    document.querySelector("#camera-rig").setAttribute("animation__right", "dur", experiment.animationDuration * 1000)
    
    for (var i=0; i<experiment.leftTargets; i++){
      document.querySelector("#left-targets").appendChild( addTarget(i, experiment.randomness) )
    }
    for (var i=0; i<experiment.rightTargets; i++){
      document.querySelector("#right-targets").appendChild( addTarget(i, experiment.randomness) )
    }
    
    for (var i=0; i<experiment.trackParts; i++){
      var position = {x:0, y:0.2, z:-i*experiment.trackLength}
      document.querySelector("#right-track").appendChild( addRail(position) )
      position.y = -0.1
      document.querySelector("#right-targets").setAttribute("position", position )
    }
    for (var i=0; i<experiment.trackParts/2; i++){
      var position = {x:0, y:0.2, z:-i*experiment.trackLength}
      document.querySelector("#left-track").appendChild( addRail(position) )
      position.y = -0.1
      document.querySelector("#left-targets").setAttribute("position", position )
    }

    // should also fix "left-track" position accordingly <a-entity id="left-track" rotation="0 41 0" position="-1.3 0 -24">
    document.querySelector("#left-track").setAttribute("position", -experiment.trackParts/10 + " 0 " + -experiment.trackParts*2 )
    document.querySelector("#camera-rig").setAttribute("animation", "to", experiment.trackParts/2 + " 0 " + -experiment.trackLength * (experiment.trackParts/2 - 1) )
    document.querySelector("#camera-rig").setAttribute("animation__left", "to", -experiment.trackParts/2 + " 0 " + -experiment.trackLength * (experiment.trackParts - 1) )
    document.querySelector("#camera-rig").setAttribute("animation__right", "to", experiment.trackParts + " 0 " + -experiment.trackLength * (experiment.trackParts - 1) )
   
  }
});

AFRAME.registerComponent('cursor-listener', {
  init: function () {
    var el = this.el;
    var secretQuery = "";
    if (experiment.secret) secretQuery = "&secret=" + experiment.secret;
    function sendExperimentData(data){      
      fetch('/addDatapoint' + "?datapoint=" + encodeURIComponent(data) + secretQuery,)
      .then(function(response) {
        return response;
      })
      .then(function(reponse) {
        console.log(reponse, " Check result at " + window.location.origin + "/results.html ");
      });
    }    
    
    this.el.addEventListener('click', function (evt) {
      console.log( el.id, 'was clicked at' ); 
      switch ( el.id ){
        case "engine-start-button" :
          experiment.ready = true;
          el.emit("pushed");
          document.querySelector("#camera-rig").components.sound.playSound();
          document.querySelector("#camera-rig").emit("go");
          setTimeout(function(){ 
            if ( experiment.pushedLever ){
              el.emit("goleft");
              sendExperimentData("Left");
            } else {
              el.emit("goright");
              sendExperimentData("Right");
            }
          }, experiment.animationDuration * 1000);
          setTimeout(function(){
            // scream sound right before impact
            document.querySelector("#camera").components.sound.playSound();
            if ( experiment.pushedLever ){
              document.querySelector("#left-targets").emit("down");
            } else {
              document.querySelector("#right-targets").emit("down");
            }
          }, 2 * experiment.animationDuration * 1000 - 1000);
          setTimeout(function(){ 
            // stop the engine sound slight after impact
            document.querySelector("#camera-rig").components.sound.stopSound(); 
            experiment.finished = true;
          }, 2 * experiment.animationDuration * 1000 + 1000);
          for (var instruction of document.querySelectorAll(".instructions") )
            instruction.setAttribute("visible", false);
          break;
        case "lever" :
          // could be conditional on experiment.ready
          document.querySelector("#lever").components.sound.playSound();
          el.emit("pushedlever");
          experiment.pushedLever = true;
        break;
      }
    }); // end of event listener
    
  }
});

/* 
assets
 models
  trolley https://poly.google.com/view/9r3vGMUz2Hc
  humans https://poly.google.com/view/46UhpqiHmS- 
  track https://poly.google.com/view/covd74kLslj
 sounds
  scream https://freesound.org/people/TheSubber13/sounds/239900/
  engine https://freesound.org/people/Heigh-hoo/sounds/22095/
  lever https://freesound.org/people/DrZoom/sounds/105376/
 
unused
 https://poly.google.com/view/77Jr8NGPtHE
 https://poly.google.com/view/12EHxMhKrbo
 https://poly.google.com/view/3YDLMGCBKnL
*/