import React from 'react';

import InnerImageZoom from 'react-inner-image-zoom'

const CustomInnerZoom = ({
    src,
    zoomSrc,
    className,
    hideHint = true,
    zoomScale = 1.5
}: any) => {
    return (
        <div className="custom-zoom-container">
            <style>{`
        .custom-zoom-container .iiz__zoom-img {
          transition: transform 0.8s ease-out !important;
        }
        .custom-zoom-container .iiz__zoom-img--visible {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
            <InnerImageZoom
                className={className}
                src={src}
                zoomSrc={zoomSrc}
                zoomType="hover"
                zoomScale={zoomScale}
                hideHint={hideHint}
            />
        </div>
    );
};

export default CustomInnerZoom;