import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from "axios";
import {pubChemIsomersUrl, pubChemPropertiesUrl} from "../util/constants";
import Compound from "../home/Compound";

function MoleculeExp2(props) {
  const [sketcher, setSketcher] = useState();
  const [error, setError] = useState("");
  const [compound, setCompound] = useState();
  const [allIsomers, setAllIsomers] = useState([]);
  const [cid, setCid] = useState('2244');
  const [viewer, setViewer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const viewerRef = useRef(null);
  const isomersContainerRef = useRef(null);
  const [visibleIsomers, setVisibleIsomers] = useState(10);
  const observer = useRef();
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
      viewer.setStyle({}, {stick: {}});
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
        setSketcher(iframe.contentWindow.marvin.sketcherInstance);
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
    const inputCompound = res.data.result.substring(0, res.data.result.indexOf('\t'));
    if (inputCompound.includes('.')) {
      setError("Please draw a single molecule");
    } else {
      setError("");
      const res = await axios.get(pubChemPropertiesUrl(inputCompound));
      const outputCompound = res.data.PropertyTable.Properties[0];
      setCompound(outputCompound);
      const isomersRes = await axios.get(pubChemIsomersUrl(outputCompound.MolecularFormula));
      let outputIsomers = isomersRes.data.PropertyTable.Properties
          .filter(x => x.MolecularWeight === outputCompound.MolecularWeight && !x.SMILES.includes('.') && x.CID !== outputCompound.CID);
      setAllIsomers(outputIsomers);
      setVisibleIsomers(10);
    }
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
  
  const Lazy3DViewer = ({cid}) => {
    const [loadCount, setLoadCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef();
    const timerRef = useRef();
    
    useEffect(() => {
      const observer = new IntersectionObserver(
          ([entry]) => {
            clearTimeout(timerRef.current);
            if (entry.isIntersecting) {
              timerRef.current = setTimeout(() => {
                setIsVisible(true);
              }, 300); // 300ms delay to prevent rapid toggling
            } else {
              setIsVisible(false);
              setLoadCount(prev => prev + 1); // Force remount on next visibility
            }
          },
          {root: isomersContainerRef.current, threshold: 0.1}
      );
      
      if (ref.current) observer.observe(ref.current);
      
      return () => {
        observer.disconnect();
        clearTimeout(timerRef.current);
      };
    }, []);
    
    return (
        <div ref={ref} style={{minHeight: '300px'}}>
          {isVisible && (
              <iframe
                  key={`${cid}-${loadCount}`} // Force remount when loadCount changes
                  className='w-100'
                  style={{height: 300}}
                  frameBorder="0"
                  src={`https://embed.molview.org/v1/?mode=balls&cid=${cid}&bg=white&ts=${Date.now()}`}
                  title={`3D-viewer-${cid}`}
                  onLoad={(e) => {
                    // Add error handling
                    const iframe = e.target;
                    try {
                      if (iframe.contentDocument.body.innerHTML.includes('error')) {
                        iframe.style.display = 'none';
                      }
                    } catch (_) {
                    }
                  }}
              />
          )}
        </div>
    );
  };
  
  return (
      <div className='container'>
        <div className='row mb-4'>
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
              <div className='w-100 d-flex flex-row'>
                <div className='text-start col-4'>
                  <p><strong>Molecular formula:</strong> {compound.MolecularFormula}</p>
                  <p><strong>Molecular weight:</strong> {compound.MolecularWeight}</p>
                  <p><strong>IUPAC Name:</strong> {compound.IUPACName}</p>
                </div>
                <iframe id='coolFrame' className='col-8' style={{height: 300}} frameBorder="0"
                        src={`https://embed.molview.org/v1/?mode=balls&cid=${compound.CID}&bg=white`}></iframe>
              </div>
              <hr/>
              <h3 className='align-self-center mb-4'>Isomers</h3>
              <div className='w-100'>
                <div id='isomers-container'
                    ref={isomersContainerRef}
                    style={{maxHeight: '1000px', width: '100%'}}
                >
                  {allIsomers.slice(0, visibleIsomers).map((iso, i) => (
                      <React.Fragment key={iso.CID}>
                        <div
                            className='d-flex flex-row align-items-center w-100 mb-2'
                            ref={i === visibleIsomers - 1 ? lastIsomerElement : null}
                        >
                          <div className='d-flex flex-column align-items-start col-4 text-start'>
                            <p><strong>IUPAC Name:</strong> {iso.IUPACName}</p>
                            <p><strong>2d structure:</strong></p>
                            <Compound smiles={iso.SMILES}/>
                          </div>
                          <div className='col-8 text-center'>
                            <p><strong>3d structure</strong></p>
                            <Lazy3DViewer cid={iso.CID}/>
                          </div>
                        </div>
                        {i !== visibleIsomers - 1 && <hr className='mb-3'/>}
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

export default MoleculeExp2;