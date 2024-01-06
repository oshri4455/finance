import React from 'react'
import './package.css';
import { Link } from 'react-router-dom';

export default function Package2(props) {
  return (
    <div>
      
      <h1 id='h11'>buy now!!!!</h1>

        <ul id='ul1'>
         
          
          <li><h2>get 100 Quantity a month <br />for <br /> 4.99$</h2><Link to={'/reshom'}><button onClick={()=>{props.setRow(99)}}>Buy Now</button></Link></li>
        </ul>


    </div>
  )
}
