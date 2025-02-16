import React, {useEffect, useState, useRef} from 'react';
import axios from "axios";
import '../css/home.css';
import ReactionList from "./ReactionList";
import ChosenReaction from "./ChosenReaction";
import Compound from "./Compound";
import {cidsKey, compoundKey, emptyMol, pubChemPropertiesUrl, structureKey} from "../util/constants";
import {Link} from "react-router-dom";

const HomeExp = () => {
  let lastCompound = emptyMol;
  let changeInProgress = false;
  const [reactions, setReactions] = useState([]);
  const [reactant, setReactant] = useState([]);
  const [reactantSmiles, setReactantSmiles] = useState([]);
  const [reaction, setReaction] = useState();
  const [product, setProduct] = useState();
  const hasRendered = useRef(false);
  const [marvin, setMarvin] = useState(null);
  const [img, setImg] = useState(null);
  const [name, setName] = useState()
  
  function loadSketcher() {
    let checkInterval = setInterval(function () {
      let iframe = document.querySelectorAll("iframe")[0];
      if (iframe.contentWindow && iframe.contentWindow.marvin) {
        setMarvin(iframe.contentWindow.marvin);
        clearInterval(checkInterval);
      }
    }, 200);
  }
  
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
  }, [marvin]);
  
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
    if (!marvin) {
      return;
    }
    let drawnCompound = await marvin.sketcherInstance.exportStructure("mol");
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
      const smiles = await getSmiles(inputCompound);
      
      const reactionsResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}mol/getReactions?reactant=${smiles}`
      );
      
      setReactions(reactionsResponse.data);
      setReactant(inputCompound);
      setReactantSmiles(smiles)
    } catch (err) {
      console.error(err);
    }
  }
  
  const fetchProduct = async (reagent, catalyst, conditions, followUp) => {
    try {
      const productResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}mol/predictProduct`,
          {
            reactant: reactant,
            smiles: reactantSmiles,
            reagent: reagent,
            catalyst: catalyst,
            conditions: conditions,
            followUp: followUp
          }
      );
      setImg(marvin.ImageExporter.molToDataUrl(productResponse.data, "image/png",{}));
      
      const smiles = await getSmiles(productResponse.data);
      const res = await axios.get(pubChemPropertiesUrl(smiles));
      const outputCompoundInfo = res.data.PropertyTable.Properties[0];
      console.log(outputCompoundInfo)
      setName(outputCompoundInfo.IUPACName)
      localStorage[compoundKey] = JSON.stringify(outputCompoundInfo)
      localStorage[cidsKey] = outputCompoundInfo.CID
      localStorage[structureKey] = productResponse.data
      
      // const productData = response.data;
      // setProduct(productData);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  
  async function getSmiles(inputCompound){
    const res = await axios.post("https://openbabel.cheminfo.org/v1/convert", {
      input: inputCompound,
      inputFormat: "mol -- MDL MOL format",
      outputFormat: "can -- Canonical SMILES format"
    });
    return res.data.result.substring(0, res.data.result.indexOf('\t'));
  }
  
  return (
      <div>
        <div className="container text-center">
          <div className="row mb-4">
            <iframe
                id="iframe"
                src="./marvinjs/editor.html"
            />
            <div className="reaction-container d-flex align-items-center">
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
            <div className="col-3 h-100 align-items-center d-flex flex-column">
              {img &&
                  <>
                    <img src={img} width='80%'/>
                    <Link to='/mol'>{name}</Link>
                  </>
              }
            </div>
          </div>
        </div>
      </div>
  );
};

export default HomeExp;
