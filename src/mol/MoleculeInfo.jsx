import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from "axios";
import {compoundKey, pubChemIsomersUrl, pubChemPropertiesUrl, structureKey} from "../util/constants";
import Compound from "../home/Compound";
import Lazy3DViewer from "./Lazy3DViewer";

function MoleculeInfo() {
  const [sketcher, setSketcher] = useState();
  const [error, setError] = useState("");
  const [compoundInfo, setCompoundInfo] = useState();
  const [allIsomers, setAllIsomers] = useState([]);
  const [viewer, setViewer] = useState(null);
  const viewerRef = useRef(null);
  const isomersContainerRef = useRef(null);
  const [visibleIsomers, setVisibleIsomers] = useState(10);
  const observer = useRef();
  const [apiData, setApiData] = useState(null);
  const abortControllerRef = useRef(new AbortController());
  const isMountedRef = useRef(false);
  
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current.abort();
    };
  }, []);
  
  const lastIsomerElement = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisibleIsomers(prev => Math.min(prev + 20, allIsomers.length));
      }
    });
    if (node) observer.current.observe(node);
  }, [allIsomers.length]);
  
  const initializeViewer = () => {
    if (window.$3Dmol && viewerRef.current) {
      const newViewer = window.$3Dmol.createViewer(viewerRef.current, {
        backgroundColor: 0xffffff
      });
      setViewer(newViewer);
    }
  };
  
  // const loadStructure = async () => {
  //   if (!viewer) return;
  //
  //   viewerRef.current.innerHTML = '';
  //
  //   const response = await fetch(
  //       `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`
  //   );
  //
  //   if (!response.ok) throw new Error('Failed to fetch structure');
  //
  //   const sdfData = await response.text();
  //
  //   viewer.addModel(sdfData, "sdf");
  //   viewer.setStyle({}, {stick: {}});
  //   viewer.zoomTo();
  //   viewer.render();
  // };
  
  function loadSketcher() {
    let checkInterval = setInterval(function () {
      let iframe = document.getElementById("iframe");
      if (iframe.contentWindow && iframe.contentWindow.marvin) {
        let localSketcherInstance = iframe.contentWindow.marvin.sketcherInstance
        setSketcher(localSketcherInstance);
        clearInterval(checkInterval);
        if (localStorage[compoundKey]){
          loadCompound(localSketcherInstance)
        }
      }
    }, 200);
  }
  
  async function search(outputCompoundInfo) {
    try {
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      console.log(outputCompoundInfo)
      if (!outputCompoundInfo) {
        let drawnCompound = await sketcher.exportStructure("mrv");
        const res = await axios.post("https://openbabel.cheminfo.org/v1/convert", {
          input: drawnCompound,
          inputFormat: "mrv -- Chemical Markup Language",
          outputFormat: "can -- Canonical SMILES format"
        });
        const inputCompound = res.data.result.substring(0, res.data.result.indexOf('\t'));
        if (inputCompound.includes('.')) {
          setError("Please draw a single molecule");
          return;
        }
        
        setError("");
        const compoundPropertiesRes = await axios.get(pubChemPropertiesUrl(inputCompound));
        outputCompoundInfo = compoundPropertiesRes.data.PropertyTable.Properties[0];
        setCompoundInfo(outputCompoundInfo);
      }
      console.log(outputCompoundInfo)
      const isomersRes = await axios.get(pubChemIsomersUrl(outputCompoundInfo.MolecularFormula));
      let outputIsomers = isomersRes.data.PropertyTable.Properties
          .filter(x => x.MolecularWeight === outputCompoundInfo.MolecularWeight && !x.SMILES.includes('.') && x.CID !== outputCompoundInfo.CID);
      setAllIsomers(outputIsomers);
      setVisibleIsomers(10);
      
      setIsomersContainerHeight();
      
      const infoResponse = await Promise.race([
        axios.get(process.env.REACT_APP_API_BASE_URL + 'mol/info/' + outputCompoundInfo.Title, {
          signal: abortControllerRef.current.signal
        }),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout after 30s')), 30000)
        )
      ]);
      if (isMountedRef.current) {
        setApiData(infoResponse.data);
        setTimeout(function(){
          setIsomersContainerHeight();
        }, 200);
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  function setIsomersContainerHeight() {
    const isomersContainer = isomersContainerRef.current;
    if (!isomersContainer) return;
    const isomersContainerHeight = document.getElementById('compound-info').offsetHeight
    const IsomersHeadingHeight = document.getElementById('isomers-heading').offsetHeight
    console.log(isomersContainerHeight)
    isomersContainer.style.maxHeight = `${isomersContainerHeight-IsomersHeadingHeight-30}px`
  }
  
  useEffect(() => {
    const container = isomersContainerRef.current;
    if (!container || allIsomers.length === 0) return;
    
    const handleScroll = () => {
      const {scrollTop, scrollHeight, clientHeight} = container;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      if (isNearBottom) {
        setVisibleIsomers(prev => Math.min(prev + 10, allIsomers.length));
      }
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [allIsomers]);
  
  function loadCompound(localSketcherInstance){
    try {
      let compoundJson = JSON.parse(localStorage[compoundKey])
      setCompoundInfo(compoundJson)
      localSketcherInstance.importStructure("mol", localStorage[structureKey]);
      search(compoundJson)
    } catch (e) {
      console.log(e)
    }
    localStorage.removeItem(compoundKey)
    localStorage.removeItem(structureKey)
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
        <div className='row mb-4 '>
          <div id='compound-info' className='d-flex flex-column col-6 align-items-start'>
            <iframe
                id="iframe"
                src="./marvinjs/editor.html"
                className="mb-1 w-75"
            />
            <span className='text-danger mb-2'>{error}</span>
            <div>
              <button className='btn btn-primary' onClick={search}>Search</button>
            </div>
            {compoundInfo && <>
              <h2 className='align-self-center'>{compoundInfo.Title}</h2>
              <hr className='mb-4'/>
              <div className='w-100 d-flex flex-row'>
                <div className='text-start col-4'>
                  <p><strong>Molecular formula:</strong> {compoundInfo.MolecularFormula}</p>
                  <p><strong>Molecular weight:</strong> {compoundInfo.MolecularWeight}</p>
                  <p><strong>IUPAC Name:</strong><br/> {compoundInfo.IUPACName}</p>
                </div>
                <iframe id='coolFrame' className='col-8' style={{height: 400}} frameBorder="0"
                        src={`https://embed.molview.org/v1/?mode=balls&cid=${compoundInfo.CID}&bg=white`}></iframe>
              </div>
              <div className='text-start'>
                <p><strong>Physical appearance:</strong> {apiData ? apiData.physicalAppearance : 'Loading...'}</p>
                <p><strong>Applications:</strong> {apiData ? apiData.applications : 'Loading...'}</p>
              </div>
            </>}
          </div>
          <div className='col-5 offset-1 d-flex flex-column align-items-start'>
            {compoundInfo && <>
              <h3 id='isomers-heading' className='align-self-center mb-4'>Isomers</h3>
              <div className='w-100'>
                <div id='isomers-container'
                     ref={isomersContainerRef}
                     style={{maxHeight: '1000px', width: '100%'}}
                >
                  {allIsomers.slice(0, visibleIsomers).map((iso, i) => (
                      <React.Fragment key={iso.CID}>
                        <div
                            className='d-flex flex-row align-items-start w-100 mb-2'
                            ref={i === Math.min(allIsomers.length, visibleIsomers) - 1 ? lastIsomerElement : null}
                        >
                          <div className='d-flex flex-column align-items-start col-4 text-start'>
                            <p><strong>IUPAC Name:</strong><br/> {iso.IUPACName}</p>
                            <p><strong>Structure:</strong></p>
                            <Compound smiles={iso.SMILES}/>
                          </div>
                          <div className='col-8 text-start'>
                            <Lazy3DViewer cid={iso.CID} isomersContainerRef={isomersContainerRef}/>
                          </div>
                        </div>
                        {i !== Math.min(allIsomers.length, visibleIsomers) - 1 && <hr className='mb-3'/>}
                      </React.Fragment>
                  ))}
                </div>
              </div>
            </>}
          </div>
        </div>
      </div>
  );
}

export default MoleculeInfo;