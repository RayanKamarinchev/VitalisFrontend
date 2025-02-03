import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {pubChemUrl} from "../util/constants";

function MoleculeInfo(props) {
  let sketcher;
  const [error, setError] = useState("")
  const [compound, setCompound] = useState()
  const [cid, setCid] = useState('2244');
  const [viewer, setViewer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const viewerRef = useRef(null);
  
  const initializeViewer = () => {
    if (window.$3Dmol && viewerRef.current) {
      const newViewer = window.$3Dmol.createViewer(viewerRef.current, {
        backgroundColor: 0xffffff
      });
      setViewer(newViewer);
      loadStructure();
    }
  };
  
  const loadStructure = async () => {
    if (!viewer || !cid) return;
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Clear previous structure
      viewerRef.current.innerHTML = '';
      
      const response = await fetch(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`
      );
      
      if (!response.ok) throw new Error('Failed to fetch structure');
      
      const sdfData = await response.text();
      console.log(sdfData)
      viewer.addModel(sdfData, "sdf");
      viewer.setStyle({}, { stick: {} });
      viewer.zoomTo();
      viewer.render();
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetView = () => {
    if (viewer) {
      viewer.zoomTo();
      viewer.render();
    }
  };
  
  function loadSketcher() {
    let checkInterval = setInterval(function () {
      let iframe = document.getElementById("iframe");
      if (iframe.contentWindow && iframe.contentWindow.marvin) {
        sketcher = iframe.contentWindow.marvin.sketcherInstance;
        clearInterval(checkInterval);
      }
    }, 200);
  }
  
  async function search() {
    let drawnCompound = await sketcher.exportStructure("mrv");
    const res = await axios.post("https://openbabel.cheminfo.org/v1/convert", {
      input: drawnCompound,
      inputFormat: "mrv -- Chemical Markup Language",
      outputFormat: "can -- Canonical SMILES format"
    });
    const compound = res.data.result.substring(0, res.data.result.indexOf('\t'));
    console.log(compound)
    if (compound.includes('.')) {
      setError("Please draw a single molecule")
    } else {
      setError("")
      const res = await axios.get(pubChemUrl + compound + "/property/MolecularFormula,MolecularWeight,IUPACName,Title/JSON");
      console.log(res.data)
      setCompound(res.data.PropertyTable.Properties[0])
    }
    
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
    initializeViewer();
  }, []);
  
  return (
      <div className='container'>
        <div className='row'>
          <div className='d-flex flex-column col-4 align-items-start'>
            <iframe
                id="iframe"
                src="./marvinjs/editor.html"
                style={{
                  overflow: "hidden",
                  width: "100%",
                  height: "450px",
                  border: "1px solid darkgray",
                }}
                className="mb-1"
            />
            <span className='text-danger mb-2'>{error}</span>
            <div>
              <button className='btn btn-primary' onClick={search}>Search</button>
            </div>
          </div>
          <div className='col-7 offset-1 d-flex flex-column align-items-start'>
            {compound && <>
              <h2 className='align-self-center'>{compound.Title}</h2>
              <hr className='mb-4'/>
              <p><strong>Molecular formula:</strong> {compound.MolecularFormula}</p>
              <p><strong>Molecular weight:</strong> {compound.MolecularWeight}</p>
              <p><strong>IUPAC Name:</strong> {compound.IUPACName}</p>
              <iframe style={{width: 500, height: 300}} frameBorder="0"
                      src={`https://embed.molview.org/v1/?mode=balls&cid=${compound.CID}&bg=white`}></iframe>
            </>
            }
            {/*<div style={{padding: '20px'}}>*/}
            {/*  <div style={{marginBottom: '20px'}}>*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        value={cid}*/}
            {/*        onChange={(e) => setCid(e.target.value)}*/}
            {/*        placeholder="Enter PubChem CID"*/}
            {/*        style={{marginRight: '10px', padding: '5px'}}*/}
            {/*    />*/}
            {/*    <button*/}
            {/*        onClick={loadStructure}*/}
            {/*        disabled={isLoading}*/}
            {/*        style={{marginRight: '10px', padding: '5px 15px'}}*/}
            {/*    >*/}
            {/*      {isLoading ? 'Loading...' : 'Load Structure'}*/}
            {/*    </button>*/}
            {/*    <button*/}
            {/*        onClick={resetView}*/}
            {/*        style={{padding: '5px 15px'}}*/}
            {/*    >*/}
            {/*      Reset View*/}
            {/*    </button>*/}
            {/*  </div>*/}
            {/*  */}
            {/*  {errorMessage && (*/}
            {/*      <div style={{color: 'red', marginBottom: '10px'}}>{errorMessage}</div>*/}
            {/*  )}*/}
            {/*  */}
            {/*  <div*/}
            {/*      ref={viewerRef}*/}
            {/*      style={{*/}
            {/*        width: '800px',*/}
            {/*        height: '600px',*/}
            {/*        border: '1px solid #ccc',*/}
            {/*        borderRadius: '4px'*/}
            {/*      }}*/}
            {/*  />*/}
            {/*</div>*/}
          </div>
        </div>
      
      </div>
  );
}

export default MoleculeInfo;