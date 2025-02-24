import React from 'react';

function ReactionArrow({reagent, catalyst, conditions, followUp = "", reagentVisualised, onReactionClick}) {
  let smiles;
  let textBelow = ''
  if (catalyst !== ''){
    textBelow += `кат. ${catalyst}, `
  }
  if (conditions !== ''){
    textBelow += `${conditions}, `
  }
  if (followUp !== ''){
    textBelow += `2) ${followUp}, `
  }
  textBelow = textBelow.slice(0, -2);
  smiles = `>C>C  __{'textBelowArrow': '${textBelow}', 'textAboveArrow': '${reagentVisualised}'}__`;
  
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