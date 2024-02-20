import React from 'react'
import './package.css';
import { Link } from 'react-router-dom';

export default function Package1(props) {

  return (
    <div>

      <h1 id='h11'>buy now!!!!</h1>

        <ul id='ul1'>
        <li><h2>Go back to trial version <br />for <br /></h2><Link to={'/'}><button onClick={()=>{props.setRow(24);props.clearTable()}}>Free for two months!!</button></Link></li>
          <li><h2>get 25 Quantity a month <br />for <br /> 0.99$</h2><Link to={'/reshom'}><button onClick={()=>{props.setRow(24)}}>Buy Now</button></Link></li>
          <li><h2>get 50 Quantity a month <br />for <br /> 2.99$</h2><Link to={'/reshom'}><button onClick={()=>{props.setRow(49)}}>Buy Now</button></Link></li>
          <li><h2>get 100 Quantity a month <br />for <br /> 4.99$</h2><Link to={'/reshom'}><button onClick={()=>{props.setRow(99)}}>Buy Now</button></Link></li>
        </ul>

    </div>
  )
}
