function sketchOnLoad () {
  if(marvin.Sketch.isSupported()) {
    marvin.sketcherInstance = new marvin.Sketch("sketch");
  } else {
    alert("Cannot initiate sketcher. Current browser may not support HTML5 canvas or may run in Compatibility Mode.");
  }
}
