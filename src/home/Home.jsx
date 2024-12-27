import React, {useEffect, useState} from 'react';
import axios from "axios";
import ReactionArrow from "./ReactionArrow";
import '../css/home.css';
import ReactionList from "./ReactionList";

const Home = () => {
  let lastCompound = "<cml><MDocument></MDocument></cml>"
  const [reactions, setReactions] = useState([])
  const [reaction, setReaction] = useState()
  
  let sketcher, iframe;
  const onLoad = () => {
    iframe = document.getElementById("iframe")
    sketcher = iframe.contentWindow.marvin.sketcherInstance
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
    });
    setTimeout(() => {
          onLoad();
          }, 1000);
    
    const intervalFunction = async () => {
      let drawnCompound = await sketcher.exportStructure("mrv")
        if (lastCompound !== drawnCompound) {
          await axios.post("https://openbabel.cheminfo.org/v1/convert", {
            input: drawnCompound,
            inputFormat: "mrv -- Chemical Markup Language",
            outputFormat: "smi -- SMILES format"
          }).then(async (res) => {
            let compound = res.data.result.substring(0, res.data.result.indexOf('\t'))
            console.log(compound)
            let reactionsResponse = (await axios.get(process.env.REACT_APP_API_BASE_URL + "mol/getReactions?reactant=" + compound)).data
            setReactions(reactionsResponse);
          })
          .catch((err) => {
            console.log(err)
          })
        }
      lastCompound = drawnCompound;
    };
    
    const intervalId = setInterval(intervalFunction, 2000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const resRef = React.useRef(null);
  
  async function getMol() {
    let res = await sketcher.exportStructure("mrv")
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
    
    await axios.p
  }
  
  return (
      <div>
        <div className="container text-center">
          <div className="row align-items-start" style={{height: "450px"}}>
            <iframe id="iframe" src="./marvinjs/editor.html"
                    style={{overflow: "hidden", width: "500px", height: "450px", border: " 1px solid darkgray"}}
                    className="col-5"/>
            <div className="align-items-start col-2 reaction-container d-flex align-items-center">
              {
                !reaction ? (
                    <ReactionList reactions={reactions} setReaction={setReaction}/>
                ) : (
                    <ReactionArrow
                        reagent={reaction.reagent}
                        catalyst={reaction.catalyst}
                        conditions={reaction.conditions}
                        followUp={reaction.followUp}
                        reagentVisualised={reaction.reagentVisualised}
                    />
                )
              }
            </div>
          </div>
        </div>
        <button onClick={getMol}>Get Mol</button>
        <p id="res" ref={resRef}></p>
      </div>
  );
};

export default Home;