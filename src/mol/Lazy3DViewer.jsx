import React, {useEffect, useRef, useState} from "react";

const Lazy3DViewer = ({cid, isomersContainerRef}) => {
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

export default Lazy3DViewer;