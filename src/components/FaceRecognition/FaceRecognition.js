import React from 'react';

import BoundingBox from '../BoundingBox/BoundingBox';

import './FaceRecognition.css';

const FaceRecognition = ({ boxes, imageUrl }) => (
    <div className="center ma">
        <div className='absolute'>
            <img id="inputimage" className='ma3 photo' alt="" src={imageUrl} width='500px' height='auto'/>
            { boxes.map((box, i) => (
                <BoundingBox key={i} box={box} />)
            )}
        </div>
    </div>
)


export default FaceRecognition;