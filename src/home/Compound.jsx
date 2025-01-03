import React, {useEffect} from 'react';

function Compound({ smiles }) {
  useEffect(() => {
    window.SmiDrawer.apply();
    document.querySelector(".final-reaction").setAttribute("viewBox", "0 0 120 40");
  }, [smiles]);
  return (
      <svg id="compound"
          className="w-100 h-100 p-2"
          data-smiles={smiles}/>
  );
}

export default Compound;