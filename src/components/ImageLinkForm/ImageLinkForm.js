import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onPictureSubmit }) => {
    return (
        <div>
           <p className='f3 black'> 
                {'This Magic Brain will detect faces in your pictures'}
           </p>
           <div className='center br3'>
                <div className=' form center pa3 br3 shadow-5'>
                    <input 
                        onChange={onInputChange}
                        className='f5 pa2 w-70 center' 
                        type='text' 
                    />
                    <button 
                        onClick={onPictureSubmit} 
                        className='w-30 grow f5 link ph3 pv2 dib white pointer'> Detect 
                    </button>
                </div>
           </div> 
        </div>
    );
}

export default ImageLinkForm;