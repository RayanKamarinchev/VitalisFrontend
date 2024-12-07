import React, {useEffect} from 'react';
import axios from "axios";

const Home = () => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL
  
  const onLoad = () => {
    if (window.marvin && window.marvin.Sketch) {
      window.marvin.sketcherInstance = new window.marvin.Sketch("sketch");
      window.marvin.Sketch.license("")
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
        let sketch = document.getElementById("sketch")
        if(sketch) {
          sketch.id = "usedSketcher"
        }
      }, 1000);
    });
    
    return () => {
      const scripts = document.querySelectorAll('script[src="/marvinjs/lib/promise-1.0.0.min.js"], script[src="/marvinjs/gui/gui.nocache.js"]');
      scripts.forEach((script) => script.remove());
    };
  }, []);
  
  const resRef = React.useRef(null);
  
  async function getMol() {
    let res = await window.marvin.sketcherInstance.exportStructure("mrv")
    //TODO: handle undefined res
    await console.log(res)
    await axios.post("https://openbabel.cheminfo.org/v1/convert", {
      input: res,
      inputFormat: "mrv -- Chemical Markup Language",
      outputFormat: "smi -- SMILES format"
    }).then((res) => {
      let result = res.data.result
      console.log(result)
      resRef.current.innerText = result.substring(0, result.indexOf('\t'))
    })
    
  }
  
  return (
      <div>
        <p>hello</p>
        <div id="sketch" style={{height: "500px", width: "500px"}}></div>
        <button onClick={getMol}>Get Mol</button>
        <p id="res" ref={resRef}></p>
      </div>
  );
};

export default Home;