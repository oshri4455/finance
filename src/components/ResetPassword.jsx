import React, { useState } from 'react'
import './style.css'
import './signup.css'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function ResetPassword(props) {
const [userName,setUserName] = useState('')
const [newPassword,setNewPassword] = useState('')
const [repeatPassword, setRepeatPassword] = useState('');

const nav = useNavigate()




const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };
  
  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  
  const handleChangePassword = async () => {
    // יש לוודא שהסיסמה החדשה והסיסמה המוכנסת שונות
    if (newPassword !== repeatPassword) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      // יש לשלוח בקשת POST לשרת עם הסיסמה החדשה
      const response = await fetch('/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, newPassword, repeatPassword }),
      });
  
      if (!response.ok) {
        throw new Error('Password reset error');
      }
  
      const data = await response.json();
      alert(data.message);
      window.location.href = '/'

      // עדכון הסטייט של users עם המשתמש החדש
      props.setUsers(prevUsers => [...prevUsers, { userName, newPassword }]);

      // אפס את הפרטים של הסיסמה החדשה בטופס
     
    } catch (error) {
      console.error('Error in POST request:', error);
    }
  };
  return (
    <div>


<section className="hero">
    <div className="container text-center">
      <div className ="row">
      <div id='tDiv'>
      <h1 className='title'>PLAN YOUR TRADE FOR FREE </h1>
      <h2 className='title'>(Beta version)</h2>   
      </div>
        <div className="col-md-12">
        </div>
      </div>
      
			<div className="login-wrap">
                <div>
				<div className="login-html">
                <h3 id='reset' style={{color:'white'}}>Reset the password</h3>
                <div className="login-form">
                <div className="group">
                <label htmlFor="pass"  className="label"> user name</label>
					<input id="pass"  onChange={handleUserNameChange}  type="text" className="input"/>
          </div>
          <div className="group">
					<label htmlFor="pass" style={{whiteSpace:'nowrap'}} className="label">new password</label>
					<input id="pass" onChange={handleNewPasswordChange}  type="password" className="input"/>
          </div>
                    <div className="group">
                    <label htmlFor="pass" style={{whiteSpace:'nowrap'}} className="label">repet password</label>
					<input id="pass" onChange={handleRepeatPasswordChange}  type="password" className="input"/>
          </div>
                    <button onClick={handleChangePassword} id='btnResset'  >send</button>
                    
				</div>
              
				</div>
				
				
				
			</div>
		</div>
	</div>

      
  

  </section>









    </div>
  )
}
