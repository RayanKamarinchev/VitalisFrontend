import React, {useEffect} from 'react';

const Home = () => {
  const onLoad = () => {
    if (window.marvin && window.marvin.Sketch) {
      window.marvin.sketcherInstance = new window.marvin.Sketch("sketch");
    } else {
      console.log("Cannot initiate sketcher. Current browser may not support HTML5 canvas or may run in Compatibility Mode.");
    }
  };
  
  useEffect(() => {
    const loadScript = (src, onLoadCallback) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = onLoadCallback;
      document.body.appendChild(script);
    };
    
    loadScript("./marvinjs/gui/lib/promise-1.0.0.min.js", () => {
      console.log("promise-1.0.0.min.js loaded");
    });
    
    loadScript("./marvinjs/gui/gui.nocache.js", () => {
      console.log("gui.nocache.js loaded");
      setTimeout(() => {
        onLoad();
      }, 1000);
    });
    
    return () => {
      const scripts = document.querySelectorAll('script[src="/marvinjs/lib/promise-1.0.0.min.js"], script[src="/marvinjs/gui/gui.nocache.js"]');
      scripts.forEach((script) => script.remove());
    };
  }, []);
  
  return (
      <div>
        <p>hello</p>
        <div id="sketch" style={{height: "500px", width: "500px"}}></div>
      </div>
  );
};

export default Home;