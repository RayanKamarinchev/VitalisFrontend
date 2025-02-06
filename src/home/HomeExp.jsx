import React, {useEffect, useState, useRef} from 'react';
import axios from "axios";
import '../css/home.css';
import ReactionList from "./ReactionList";
import ChosenReaction from "./ChosenReaction";
import Compound from "./Compound";

const HomeExp = () => {
  let lastCompound = "<cml><MDocument></MDocument></cml>";
  let changeInProgress = false;
  const [reactions, setReactions] = useState([]);
  const [reactant, setReactant] = useState([]);
  const [reaction, setReaction] = useState();
  const [product, setProduct] = useState();
  const hasRendered = useRef(false);
  const [sketcher, setSketcher] = useState(null);
  const [outputSketcher, setOutputSketcher] = useState(null)
  
  function loadSketcher() {
    let checkInterval = setInterval(function () {
      let iframe = document.querySelectorAll("iframe")[0];
      if (iframe.contentWindow && iframe.contentWindow.marvin) {
        setSketcher(iframe.contentWindow.marvin.sketcherInstance);
        clearInterval(checkInterval);
      }
    }, 200);
    
    let newInterval = setInterval(function () {
      let iframe = document.querySelectorAll("iframe")[1];
      if (iframe.contentWindow && iframe.contentWindow.marvin) {
        setOutputSketcher(iframe.contentWindow.marvin.sketcherInstance);
        console.log(iframe.contentWindow.marvin.sketcherInstance)
        clearInterval(newInterval);
      }
    }, 200);
  }
  useEffect(() => {
    console.log("Output Sketcher Updated:", outputSketcher);
  }, [outputSketcher]);
  
  useEffect(() => {
    if (document.readyState === 'complete') {
      loadSketcher();
    } else {
      document.onreadystatechange = function () {
        if (document.readyState === "complete") {
          loadSketcher();
        }
      }
    }
    
    const intervalId = setInterval(checkForReactions, 100);
    
    return () => clearInterval(intervalId);
  }, [outputSketcher]);
  
  useEffect(() => {
    if (hasRendered.current) {
      if (reaction != null) {
        fetchProduct(
            reaction?.reagent,
            reaction?.catalyst,
            reaction?.conditions,
            reaction?.followUp
        );
      }
    } else {
      hasRendered.current = true;
    }
  }, [reaction]);
  
  const checkForReactions = async () => {
    if (!sketcher || !outputSketcher) {
      return;
    }
    let drawnCompound = await sketcher.exportStructure("mol");
    if (lastCompound === drawnCompound && changeInProgress) {
      changeInProgress = false;
      await getReactions(drawnCompound);
    }
    if (lastCompound !== drawnCompound) {
      changeInProgress = true;
      setReaction(null)
    }
    lastCompound = drawnCompound;
  };
  
  async function getReactions(inputCompound) {
    try {
      console.log(inputCompound)
      const res = await axios.post("https://openbabel.cheminfo.org/v1/convert", {
        input: inputCompound,
        inputFormat: "mrv -- Chemical Markup Language",
        outputFormat: "can -- Canonical SMILES format"
      });
      // console.log(outputSketcher)
      var imgData = marvin.ImageExporter.molToDataUrl(value,"image/png",{});
      // create a new cell with the new image and append to the table
      if(imgData != null) {
        var molCell = $('<div>', { class: "mol-cell"});
        $("#imageContainer").append(molCell);
        molCell.append($('<span>', { text: (index+1) }));
        var img = $('<img>');
        img.attr('src', imgData);
        img.attr('data-mol', escape(value));
        molCell.append(img);
      }
      outputSketcher.importStructure("mol", inputCompound)
      
    } catch (err) {
      console.error(err);
    }
  }
  
  const fetchProduct = async (reagent, catalyst, conditions, followUp) => {
    try {
      let query = `mol/predictProduct?reactant=${reactant}&reagent=${reagent}`;
      if (catalyst) query += `&catalyst=${catalyst}`;
      if (conditions) query += `&conditions=${conditions}`;
      if (followUp) query += `&followUp=${followUp}`;
      
      const response = await axios.get(process.env.REACT_APP_API_BASE_URL + query);
      
      const productData = response.data;
      setProduct(productData);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  
  return (
      <div>
        <p>fake</p>
        <div className="container text-center">
          <div className="row align-items-start" style={{height: "450px"}}>
            <iframe
                id="iframe"
                src="./marvinjs/editor.html"
                style={{
                  overflow: "hidden",
                  width: "500px",
                  height: "450px",
                  border: "1px solid darkgray",
                }}
                className="col-5"
            />
            <div className="col-3 reaction-container d-flex align-items-center">
              {!reaction ? (
                  <ReactionList reactions={reactions} setReaction={setReaction}/>
              ) : (
                  <ChosenReaction
                      catalyst={reaction.catalyst}
                      conditions={reaction.conditions}
                      followUp={reaction.followUp}
                      reagentVisualised={reaction.reagentVisualised}
                      setReaction={setReaction}
                      setProduct={setProduct}
                  />
              )}
            </div>
            <div className="col-4 align-items-center">
              <iframe
                  id="iframe2"
                  src="./marvinjs/editor.html"
                  style={{
                    overflow: "hidden",
                    width: "500px",
                    height: "450px",
                    border: "1px solid darkgray",
                  }}
                  className="col-5"
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default HomeExp;
