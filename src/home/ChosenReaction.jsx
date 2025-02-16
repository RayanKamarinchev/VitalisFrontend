import React, {useEffect, useRef, useState} from "react";
import axios from "axios";

function ChosenReaction({
                          catalyst = "",
                          conditions = "",
                          followUp = "",
                          reagentVisualised,
                          setReaction,
                          setProduct
                        }) {
  const reaction = useRef();
  
  let smiles;
  if (followUp === "") {
    smiles = `>C>C  __{'textBelowArrow': 'кат. ${catalyst}, ${conditions}', 'textAboveArrow': '${reagentVisualised}'}__`;
  } else {
    smiles = `>C>C  __{'textBelowArrow': 'кат. ${catalyst}, ${conditions} 2) ${followUp}', 'textAboveArrow': '1) ${reagentVisualised}'}__`;
  }
  
  useEffect(() => {
    window.SmiDrawer.apply();
    document.querySelectorAll('.reaction-svg').forEach((svg) => {
      svg.setAttribute("viewBox", "0 0 120 40");
    });
  }, []);
  
  function onReactionClick() {
    setReaction(null);
    setProduct(null);
  }
  
  return (
      <svg ref={reaction}
           onClick={onReactionClick}
           className="w-100 h-100 reaction-svg final-reaction p-2 btn reaction-btn"
           data-smiles={smiles}
           data-smiles-reaction-options="{  'arrow': {
        'thickness': 2,
        'margin': 1
    } }"
      />
  );
}

export default ChosenReaction;
