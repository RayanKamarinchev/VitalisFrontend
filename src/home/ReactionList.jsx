import React, {useEffect} from 'react';
import ReactionArrow from "./ReactionArrow";

function ReactionList({ reactions, setReaction }) {
  function onReactionClick(reaction) {
    setReaction(reaction)
  }
  
  useEffect(() => {
    window.SmiDrawer.apply();
    document.querySelectorAll('.reaction-svg').forEach((svg) => {
      svg.setAttribute("viewBox", "0 0 120 40");
    });
  }, [reactions]);
  return (
      <div className="reaction-list col border rounded-2 border-3 h-100">
        {reactions.map((reaction, index) => {
          return (
              <React.Fragment key={index}>
                <ReactionArrow
                    reagent={reaction.reagent}
                    catalyst={reaction.catalyst}
                    conditions={reaction.conditions}
                    followUp={reaction.followUp}
                    reagentVisualised={reaction.reagentVisualized}
                    onReactionClick={onReactionClick}
                />
                <hr />
              </React.Fragment>
          );
        })}
      </div>
  );
}

export default ReactionList;