import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt style={{ height: 150, width:150}}>
        		<div> 
        			<img src={brain} alt="logo"/>
    			</div>
    		</Tilt>
		</div>
	);
}

export default Logo;