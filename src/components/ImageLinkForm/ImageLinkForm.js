import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onGivenInput, onGivenClick }) => {
    return(
        <div>
            <p className='f3'>
                {'This is the magic of this brain to detect the Face'}
            </p>
            <div className= 'center '> 
                <div className='form center pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center' onChange = {onGivenInput} type= 'text' />
                    <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                    onClick={onGivenClick}>
                        Detect
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;