import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaAddressCard } from 'react-icons/fa';//להוריד npm install react-icons --save
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //להוריד npm install @fortawesome/react-fontawesome
import { faCcVisa, faCcAmex, faCcMastercard, faCcDiscover } from '@fortawesome/free-brands-svg-icons';import './Reshom.css'; //npm install @fortawesome/free-brands-svg-icons
import './Reshom.css'

export default function Reshom(props) {
  
  const [Email, setEmail] = useState('');

  const nav = useNavigate();

  const Buy = () => {
   
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!emailRegex.test(Email) ) {
        alert('The email is against the rules');
        return;
      }
      props.users.map((val) => {
      nav(`/table/${val.userName}`);
    });
  };

  return (
  <div id='divContainer'>
    <div className="row">
      <div className="col-75">
        <div className="container">
          <div className="row">
            <div className="col-50">
              <h3>Billing Address</h3>
              <label htmlFor="fname">
                <FaUser /> Full Name
              </label>
              <input
                type="text"
                id="fname"
                name="firstname"
                
              />
              <label htmlFor="email">
                <FaEnvelope /> Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="adr">
                <FaAddressCard /> Address
              </label>
              <input type="text" id="adr" name="address" />
              <label htmlFor="city">
                <FaAddressCard /> City
              </label>
              <input type="text" id="city" name="city" />

              <div className="row">
                <div className="col-50">
                  <label htmlFor="state">State</label>
                  <input type="text" id="state" name="state"  />
                </div>
                <div className="col-50">
                  <label htmlFor="zip">Zip</label>
                  <input type="text" id="zip" name="zip"  />
                </div>
              </div>
            </div>

            <div className="col-50">
              <h3>Payment</h3>
              <label htmlFor="fname">Accepted Cards</label>
              <div className="icon-container">
  <FontAwesomeIcon icon={faCcVisa} style={{ color: 'navy' }} />
  <FontAwesomeIcon icon={faCcAmex} style={{ color: 'blue' }} />
  <FontAwesomeIcon icon={faCcMastercard} style={{ color: 'red' }} />
  <FontAwesomeIcon icon={faCcDiscover} style={{ color: 'orange' }} />
</div>
              <label htmlFor="cname">Name on Card</label>
              <input type="text" id="cname" name="cardname" />
              <label htmlFor="ccnum">Credit card number</label>
              <input type="text" id="ccnum" name="cardnumber" />
              <label htmlFor="expmonth">Exp Month</label>
              <input type="text" id="expmonth" name="expmonth" />
              <div className="row">
                <div className="col-50">
                  <label htmlFor="expyear">Exp Year</label>
                  <input type="text" id="expyear" name="expyear" />
                </div>
                <div className="col-50">
                  <label htmlFor="cvv">CVV</label>
                  <input type="text" id="cvv" name="cvv" />
                  <button className='btn' onClick={Buy}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}