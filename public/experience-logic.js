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
    document.querySelector("#camera-rig").setAttribute("animation", "dur", experiment.animationDuration)
    document.querySelector("#camera-rig").setAttribute("animation__left", "dur", experiment.animationDuration)
    document.querySelector("#camera-rig").setAttribute("animation__right", "dur", experiment.animationDuration)
    
    for (var i=0; i<experiment.leftTargets; i++){
      document.querySelector("#left-targets").appendChild( addTarget(i, experiment.randomness) )
    }
    for (var i=0; i<experiment.rightTargets; i++){
      document.querySelector("#right-targets").appendChild( addTarget(i, experiment.randomness) )
    }
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
          }, experiment.animationDuration);
          setTimeout(function(){
            // scream sound right before impact
            document.querySelector("#camera").components.sound.playSound();            
          }, 2 * experiment.animationDuration - 1000);
          setTimeout(function(){ 
            // stop the engine sound slight after impact
            document.querySelector("#camera-rig").components.sound.stopSound(); 
            experiment.finished = true;
          }, 2 * experiment.animationDuration + 1000);
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