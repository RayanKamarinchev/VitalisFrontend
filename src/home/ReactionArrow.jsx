import React from 'react';

function ReactionArrow({reagent, catalyst, conditions, followUp = "", reagentVisualised, onReactionClick}) {
  let smiles;
  if (followUp === ""){
    smiles = `>C>C  __{'textBelowArrow': 'кат. ${catalyst}, ${conditions}', 'textAboveArrow': '${reagentVisualised}'}__`;
  }else {
    smiles = `>C>C  __{'textBelowArrow': 'кат. ${catalyst}, ${conditions} 2) ${followUp}', 'textAboveArrow': '1) ${reagentVisualised}'}__`;
  }
  
  return (
      <svg
          className="w-100 reaction-svg p-2 btn reaction-btn" data-smiles={smiles}
           onClick={() => onReactionClick?.({reagent, catalyst, conditions, followUp, reagentVisualised})}
           data-smiles-reaction-options="{  'arrow': {
        'thickness': 2,
        'margin': 1
    } }"/>
  );
}

export default ReactionArrow;