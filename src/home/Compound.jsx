import React, {useEffect} from 'react';

function Compound({ smiles }) {
  useEffect(() => {
    window.SmiDrawer.apply();
    let finalReaction =  document.querySelector(".final-reaction");
    if(finalReaction) {
      finalReaction.setAttribute("viewBox", "0 0 120 40");
    }
  }, [smiles]);
  return (
      <svg id="compound"
          className="w-100 h-100 p-2"
          data-smiles={smiles}/>
  );
}

export default Compound;