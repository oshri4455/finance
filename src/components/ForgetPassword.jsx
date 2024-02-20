import React, { useState } from 'react'
import './signup.css'
import './style.css'

export default function ForgetPassword() {

    const [email,setEmail] = useState('')
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
      };

      const resetPassword = () => {
        const emailForget = email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert('A valid email address must be entered');
          return;
        }
      
        // שליחת האימייל לשרת
        sendResetEmail(emailForget);
      };
      
      // פונקציה לשליחת האימייל
      function sendResetEmail(email) {
        // אם אתה משתמש בטכנולוגיית שרת, כמו Express.js, אז אתה יכול לשלוח בקשת POST לנתיב המתאים בשרת כדי לשלוח את המייל
        fetch('/send-reset-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              alert(data.error);
            } else {
              document.getElementById('h4').innerHTML =
              'A password reset email will be sent to the specified email address';
              
            }
          })
          .catch(error => {
            console.error('Error sending email:', error);
            // טיפול בשגיאה במידת הצורך
          });
      }

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
  
       
         
			<div className="login-wrap"  style={{width:'50%',height:'50%'}}>
                
				<div className="login-html" >
          
                <h5 id='TitleForget' style={{color:'white',position:'relative',top:'-20px',whiteSpace:'nowrap'}}>Reset the password</h5>
                <div className="login-form">
                   
					<label htmlFor="pass" id='labalForget' style={{whiteSpace:'nowrap'}} className="label">Enter Email Address</label>
					<input id="pass" style={{color:'white'}} onChange={handleEmailChange}  type="text" className="input"/>
        
          <div className="group"> <button onClick={resetPassword}  id='btnForget' className="button">send</button>
                    
				</div>
        <h4 style={{color:'white'}} id='h4'></h4>
        </div>
              
	
				
				
				
			</div>
		</div>
	</div>

      
  

  </section>













    </div>
  )
}
