import React, {useEffect} from 'react';
import axios from "axios";

function ReactionArrow({reagent, catalyst, conditions, followUp = "", reagentVisualised, onReactionClick}) {
  if (onReactionClick === undefined) {
    await axios.get(process.env.REACT_APP_API_BASE_URL + "mol/predictProduct?reactant=" + compound).then((res) => {
  }
  let smiles;
  if (followUp === ""){
    smiles = `>C>C  __{'textBelowArrow': 'кат. ${catalyst}, ${conditions}', 'textAboveArrow': '${reagentVisualised}'}__`;
  }else {
    smiles = `>C>C  __{'textBelowArrow': 'кат. ${catalyst}, ${conditions} 2) ${followUp}', 'textAboveArrow': '1) ${reagentVisualised}'}__`;
  }
  
  useEffect(() => {
    window.SmiDrawer.apply();
    document.querySelectorAll('.reaction-svg').forEach((svg) => {
      svg.setAttribute("viewBox", "0 0 120 40");
    });
  }, []);
  
  return (
      <svg className="w-100 h-25 reaction-svg p-2 btn reaction-btn" data-smiles={smiles}
           onClick={() => onReactionClick?.({reagent, catalyst, conditions, followUp, reagentVisualised})}
           data-smiles-reaction-options="{  'arrow': {
        'thickness': 2,
        'margin': 1
    } }"/>
  );
}

export default ReactionArrow;