import React, {useEffect, useState, useRef} from 'react';
import axios from "axios";
import '../css/home.css';
import ReactionList from "./ReactionList";
import ChosenReaction from "./ChosenReaction";
import Compound from "./Compound";

const Home = () => {
  let lastCompound = "<cml><MDocument></MDocument></cml>";
  let changeInProgress = false;
  const [reactions, setReactions] = useState([]);
  const [reactant, setReactant] = useState([]);
  const [reaction, setReaction] = useState();
  const [product, setProduct] = useState();
  const hasRendered = useRef(false);
  // const [sketcher, setSketcher] = useState();
  let sketcher;
  
  function loadSketcher() {
    setTimeout(function () {
      let iframe = document.getElementById("iframe");
      sketcher = iframe.contentWindow.marvin.sketcherInstance;
    }, 200);
  }
  
  useEffect(() => {
    if (document.readyState === 'complete') {
      console.log("here")
      console.log(document.getElementById("iframe").readyState)
      console.log(document.getElementById("iframe"))
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
  }, []);
  
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
    if (!sketcher) {
      return;
    }
    let drawnCompound = await sketcher.exportStructure("mrv");
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
      const compound = res.data.result.substring(0, res.data.result.indexOf('\t'));
      console.log(compound)
      const reactionsResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}mol/getReactions?reactant=${compound}`
      );
      setReactions(reactionsResponse.data);
      setReactant(compound);
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
            <div className="col-4 align-items-center">{reaction && <Compound smiles={product}/>}</div>
          </div>
        </div>
      </div>
  );
};

export default Home;
