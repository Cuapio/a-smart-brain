import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
    const { leftCol, rightCol, topRow, bottomRow } = box;
    return (
        <div className="center ma">
            <div className='absolute'>
                <img id="inputimage" className='ma3 photo' alt="" src={imageUrl} width='500px' height='auto'/>
                <div className='bounding-box' style={{left: leftCol, top: topRow, right: rightCol, bottom: bottomRow }}> </div>
            </div>
        </div>
    );
}

export default FaceRecognition;