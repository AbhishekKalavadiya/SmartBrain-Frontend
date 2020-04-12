import React from 'react';
import './FaceRecognistion.css'

const FaceRecognistion = ({ imageUrl, box }) => {
    return(
        <div className='center ma'>
            <div className='absolute mt2 center' style={{paddingBottom: '10px'}} >
                <img  id='inputimage' alt='' src={imageUrl} width='500px' height='auto' />
                <div className='bounding' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}>            
                </div>
            </div>
        </div>
    )
}

export default FaceRecognistion;