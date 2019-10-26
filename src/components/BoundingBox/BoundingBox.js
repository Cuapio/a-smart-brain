import React from 'react';

import './BoundingBox.css';

const BoundingBox = ({ box }) => {
    const { leftCol, rightCol, topRow, bottomRow } = box;

    return (
        <div 
            className='bounding-box' 
            style={{
                left: leftCol, 
                top: topRow, 
                right: rightCol, 
                bottom: bottomRow
            }}
        > 
        </div>
    )
}

export default BoundingBox;