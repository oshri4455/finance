import React, { useState,useEffect } from 'react'
import './style.css'

import { json, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'
import Modal  from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';




export default function Table(props) {


const [Ticker,setTicker] =useState('')
 const[exitPrice,setExitPrice] =useState(0)
const[stopLose,setStopLose] =useState(0)
const[Quantity,setQuantity] = useState(0)
const[price,setPrice] = useState(0)
const [chengeConditoin, setCengeConditoin] = useState( props.Tickers.map((_, index) => 'Buy'));



const nav = useNavigate()
//מחשב את כל הכסף
let sumCost = 0;
props.Tickers.forEach((val) => {
  sumCost += val.TotalCost;
});

let sumProfit = 0;
props.Tickers.forEach((val) => {
  sumProfit += val.ExpectedProfit;
});

let presProfit = 0;
props.Tickers.forEach((val) => {
  if(val.TotalCost>0 && val.ExpectedProfit){
    presProfit += (val.ExpectedProfit / val.TotalCost) * 100;
  }
  else{
    presProfit = 0
  }
   

  
});

let sumLose = 0;
props.Tickers.forEach((val) => {
  sumLose += val.ExpectedLose;
});

let presLose = 0;
props.Tickers.forEach((val) => {

  if(val.TotalCost>0){
  presLose += (val.ExpectedLose / val.TotalCost) * 100;
  }
  else{
    presLose = 0
  }
});




const buyAndSell = (index, buySell) => {


  const row = props.Tickers[index];
  const price = row.price;
  const stopLose = row.stopLose;
  const Quantity = row.Quantity;
  const ExitPrice = row.ExitPrice;
  


  let profit = 0;
  let lose = '';

  if (buySell === 'Buy') {

    if (stopLose) {
      lose = -((Quantity * stopLose) - (Quantity * price));
    }

    if(exitPrice){
     //profit = (price * Quantity) - (ExitPrice * Quantity);
      profit = (ExitPrice * Quantity) - (price * Quantity);
    }
    
  } else if (buySell === 'Sell') {

    if(exitPrice){
     //profit = (ExitPrice * Quantity) - (price * Quantity);
     profit = (price * Quantity) - (ExitPrice * Quantity);
    }
    
    if (stopLose) {
      lose = (Quantity * stopLose) - (Quantity * price);
    }
    
  }


  /*props.setTickers((prev) => {
    const newTickers = [...prev];
    newTickers[index]['ExpectedProfit'] = profit;
    newTickers[index]['ExpectedLose'] = Math.abs(lose);
    return newTickers;
  });*/


  props.setTickers((prev) => {
    const newTickers = [...prev];
    if (newTickers[index]) {
      newTickers[index]['ExpectedProfit'] = profit;
      newTickers[index]['ExpectedLoss'] = Math.abs(lose);
    }
    return newTickers;
  });


};




const [actualPrice,setActualPrice] = useState(0)




//הצגת נתונים בטבלה 
const handleChange = (index, key, value) => {
  const newTickers = [...props.Tickers];
  newTickers[index][key] = Number(value);
  newTickers[index][key] = String(value);
  

  if (key === 'Ticker') {
    const uppercaseInput = value.toUpperCase();
    setTicker(String(uppercaseInput));
    axios
      .get(`https://finnhub.io/api/v1/quote?symbol=${value}&token=${apiKey}`)
      .then((response) => {
        const stockPrice = response.data.c;
        setActualPrice(Number(stockPrice));
        document.getElementById(`Actual${index}`).innerHTML = `$${stockPrice}`;
        newTickers[index].price = Number(stockPrice);
        setPrice(Number(stockPrice));

        if (newTickers[index].Quantity && newTickers[index].price) {
          newTickers[index].TotalCost = newTickers[index].Quantity * newTickers[index].price;
        } else {
          newTickers[index].TotalCost = 0;
        }

        localStorage.setItem('Tickers', JSON.stringify(newTickers));
        localStorage.setItem('TickerValue', value);
        props.setTickers(newTickers);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else if (key === 'price') {
    setPrice(Number(value));
    newTickers[index].price = Number(value);

    if (newTickers[index].Quantity && newTickers[index].price) {
      newTickers[index].TotalCost = newTickers[index].Quantity * newTickers[index].price;
    } else if (newTickers[index].Quantity && !newTickers[index].price) {
      newTickers[index].TotalCost = newTickers[index].Quantity * actualPrice;
    } else {
      newTickers[index].TotalCost = 0;
    }

    localStorage.setItem('Tickers', JSON.stringify(newTickers));
    localStorage.setItem('priceValue', value);
    props.setTickers(newTickers);

    if (value && exitPrice && Quantity) {
      newTickers[index].ExpectedProfit =
        newTickers[index].ExitPrice * newTickers[index].Quantity - newTickers[index].Quantity * newTickers[index].price;
    } else {
      newTickers[index].ExpectedProfit = 0;
    }

    
  } else if (key === 'Quantity') {
    setQuantity(Number(value));
    newTickers[index].Quantity = Number(value);

    if (newTickers[index].Quantity && newTickers[index].price) {
      newTickers[index].TotalCost = newTickers[index].Quantity * newTickers[index].price;
    }
   else if (newTickers[index].Quantity && !newTickers[index].price) {
    newTickers[index].TotalCost = newTickers[index].Quantity * actualPrice;
  }else {
      newTickers[index].TotalCost = 0;
    }

    localStorage.setItem('Tickers', JSON.stringify(newTickers));
    localStorage.setItem('inputValue', value);
    props.setTickers(newTickers);
    

    //when change quantity expicted profit changed
    if (value && exitPrice) {
      newTickers[index].ExpectedProfit =
        newTickers[index].ExitPrice * newTickers[index].Quantity - newTickers[index].Quantity * newTickers[index].price;
    } else {
      newTickers[index].ExpectedProfit = 0;
    }

    /*if(one>0){
      setActualPrice(0)
    }
    setOne(0)*/
    
  } else if (key === 'ExitPrice') {
    setExitPrice(Number(value));
    newTickers[index].ExitPrice = Number(value);

    if (value && Quantity && price) {
      newTickers[index].ExpectedProfit =
        newTickers[index].ExitPrice * newTickers[index].Quantity - newTickers[index].Quantity * newTickers[index].price;
    } else {
      newTickers[index].ExpectedProfit = 0;
    }

    localStorage.setItem('Tickers', JSON.stringify(newTickers));
    localStorage.setItem('exitValue', value);
    props.setTickers(newTickers);
  } else if (key === 'stopLose') {
    setStopLose(Number(value));
    newTickers[index].stopLose = Number(value);

    if (value) {
      newTickers[index].ExpectedLose = Math.abs(
        newTickers[index].stopLose * newTickers[index].Quantity - newTickers[index].price * newTickers[index].Quantity
      );
    } else {
      newTickers[index].ExpectedLose = 0;
    }

    if (!newTickers[index].Quantity || !newTickers[index].price) {
      newTickers[index].TotalCost = 0;
    }

    localStorage.setItem('Tickers', JSON.stringify(newTickers));
    localStorage.setItem('stopValue', value);
    props.setTickers(newTickers);
  }

  //setActualPrice(0)
};

//החלפת צבע של הכפתורים
const chengeColor = (index, type) => {
  setCengeConditoin(prevChengeConditoin => {
    const newchengeConditoin = [...prevChengeConditoin];
    newchengeConditoin[index] = type;
    return newchengeConditoin;
  });
};


//מנקה את השורה הראשונה
const clearButton = (username,index) => {
  const updatedUsers = [...props.users];
  const userIndex = updatedUsers.findIndex((user) => user.userName === username);

  if (userIndex !== -1) {
    const updatedUser = { ...updatedUsers[userIndex] };
    updatedUser.Tickers = [props.defaultRow]; // reset the Tickers array to defaultRow
    updatedUsers[userIndex] = updatedUser;
    props.setUsers(updatedUsers);
    localStorage.setItem('Users', JSON.stringify(updatedUsers));
    document.getElementById(`Ticker${index}`).value = ''
    document.getElementById(`quantity${index}`).value = ''
    document.getElementById(`price${index}`).value = ''
    document.getElementById(`exit${index}`).value = ''
    document.getElementById(`stop${index}`).value = ''
    document.getElementById(`Actual${index}`).innerHTML=''

    setPrice('')
    setQuantity('')
    setStopLose('')
    setExitPrice('')
    setActualPrice(0)
  }
};



// save input value
useEffect(() => {
  const savedQuantityValue = localStorage.getItem('inputValue');
  if (savedQuantityValue) {
    setQuantity(savedQuantityValue);
    
    props.Tickers.forEach((val, index) => {
      if (index === props.Tickers.length - 1) {
        if (val.Quantity === 0) {
          document.getElementById(`quantity${index}`).value = '';
        }
        return;
      }
      if (val.Quantity === 0) {
        document.getElementById(`quantity${index}`).value = '';
      } else {
        document.getElementById(`quantity${index}`).value = val.Quantity;
      }
    });
  } else {
    localStorage.setItem('inputValue', JSON.stringify(props.defaultRow.Quantity));
  }
}, []);

useEffect(() => {
  const savedTickerValue = localStorage.getItem('TickerValue');
  if (savedTickerValue) {
    setTicker(savedTickerValue);
    
    props.Tickers.forEach((val, index) => {
      if (index === props.Tickers.length - 1) {
        if (val.Ticker === '') {
          document.getElementById(`Ticker${index}`).value = '';
        }
        return;
      }
      document.getElementById(`Ticker${index}`).value = val.Ticker;
    });
  } else {
    localStorage.setItem('TickerValue', JSON.stringify(props.defaultRow.Ticker));
  }
}, []);

useEffect(() => {
  const savedPriceValue = localStorage.getItem('priceValue');
  if (savedPriceValue) {
    setPrice(savedPriceValue);
    
    props.Tickers.forEach((val, index) => {
      if (index === props.Tickers.length - 1) {
        if (val.price === 0) {
          document.getElementById(`price${index}`).value = '';
        }
        return;
      }
      if (val.price === 0) {
        document.getElementById(`price${index}`).value = '';
      } else {
        document.getElementById(`price${index}`).value = val.price;
      }
    });
  } else {
    localStorage.setItem('priceValue', JSON.stringify(props.defaultRow.price));
  }
}, []);

useEffect(() => {
  const savedExitValue = localStorage.getItem('exitValue');
  if (savedExitValue) {
    setExitPrice(savedExitValue);
    
    props.Tickers.forEach((val, index) => {
      if (index === props.Tickers.length - 1) {
        if (val.ExitPrice === 0) {
          document.getElementById(`exit${index}`).value = '';
        }
        return;
      }
      if (val.ExitPrice === 0) {
        document.getElementById(`exit${index}`).value = '';
      } else {
        document.getElementById(`exit${index}`).value = val.ExitPrice;
      }
    });
  } else {
    localStorage.setItem('exitValue', JSON.stringify(props.defaultRow.ExitPrice));
  }
}, []);

useEffect(() => {
  const savedStopValue = localStorage.getItem('stopValue');
  if (savedStopValue) {
    setStopLose(savedStopValue);
    
    props.Tickers.forEach((val, index) => {
      if (index === props.Tickers.length - 1) {
        if (val.stopLose === 0) {
          document.getElementById(`stop${index}`).value = '';
        }
        return;
      }
      document.getElementById(`stop${index}`).value = val.stopLose;
    });
  } else {
    localStorage.setItem('stopValue', JSON.stringify(props.defaultRow.StopLose));
  }
}, []);




const apiKey = 'ci26vg1r01qqjoq0o0ngci26vg1r01qqjoq0o0o0';
useEffect(() => {
  const fetchStockPrice = async () => {
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${Ticker}&token=${apiKey}`);
      const price = response.data.c;
      setPrice(price);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (Ticker) {
    fetchStockPrice();
  }
}, [Ticker]);




const inputes = (row) => {

  //const row = 9
  if(props.Tickers.length == row){
    
    if(row==9){
      nav('/package1')
    }
    else if(row==24){
      nav('/package2')
    }
    else if(row==49){
      nav('/package3')
    }
  
    props.addTickers(Ticker, Quantity, price, exitPrice, stopLose,props.index);
    return
  
  }
  else{
  
     
     
      if(price===0 && actualPrice===0 ){
       setShowAlertPrice(true)
        return
      }
      if(Quantity===0){
        setShowAlertQuantity(true)
        return
      }
    
      props.addTickers(Ticker, Quantity, price, exitPrice, stopLose,props.index);
    
      setTicker('');
      setQuantity(0);
      setPrice(0);
      setExitPrice(0);
      setStopLose(0);
      setActualPrice(0)
     

    }



  };
  
  


  const [showAlertPrice, setShowAlertPrice] = useState(false);
  const[showAlertQuantity,setShowAlertQuantity] = useState(false)
  const handleClosePrice = () => setShowAlertPrice(false);
  const handleShowPrice = () => setShowAlertPrice(true);
  const handleCloseQuantity = () => setShowAlertQuantity(false);
  const handleShowQuantity = () => setShowAlertQuantity(true);

  const Logout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'GET'
      });

      if (response.ok) {
        Cookies.remove('currentUser'); // מחיקת ה-Cookie
        localStorage.removeItem('isUserLoggedIn');
        localStorage.removeItem('userNameLogin');
        nav('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
   




    //expectedProfit
    const showExpected=(val)=>{

      let str='$0';

      if(val>0){

        str=`$${Math.round(val)}`
      }
      else if(val<0){

        str=`-$${Math.round(-(val))}`

      }

      return str

    }
  

    
  return (
    <div id='divTble'>


{ showAlertPrice && ( <>


<Modal show={showAlertPrice} onHide={handleClosePrice} className="custom-modal" backdropClassName="custom-backdrop">
<Modal.Header closeButton>
<Modal.Title id='titMidel'>Missing information!</Modal.Title>
</Modal.Header>
<Modal.Body>
<p style={{color:'red',textAlign:'center',fontWeight:"bold"}}>Please fill in the price data correctly</p>
</Modal.Body>
<Modal.Footer>
<Button id="btnpop" variant="secondary" onClick={handleClosePrice}>
 Close
</Button>
</Modal.Footer>
</Modal>

</>

)}

{ showAlertQuantity && ( <>


<Modal show={showAlertQuantity} onHide={handleCloseQuantity} className="custom-modal" backdropClassName="custom-backdrop">
<Modal.Header closeButton>
<Modal.Title id='titMidel'>Missing information!</Modal.Title>
</Modal.Header>
<Modal.Body>
<p style={{color:'red',textAlign:'center',fontWeight:"bold"}}>Please fill in the quantity data correctly</p>
</Modal.Body>
<Modal.Footer>
<Button id="btnpop" variant="secondary" onClick={handleCloseQuantity}>
 Close
</Button>
</Modal.Footer>
</Modal>

</>

)}
      <div id='titleDiv'>
      <h1 id='h1Title'>PLAN YOUR TRADE FOR FREE </h1> 
      <h1 id='h1Title'>(Beta version)</h1>
      <h2 id='h2Title'>Quick Profit / Loss Calculator:</h2>
     </div>

     <br />

   <table id='table'>
<thead>
<tr >
<th >Ticker</th>
<th >Long/Short</th>
<th >Quantity</th>
<th>Actual Price</th>
<th >Ask Price</th>
<th >Total Cost</th>
<th >Exit Price</th>
<th >Expected Profit</th>
<th >Stop Lose</th>
<th >Expected Lose</th>
<th></th>

</tr>
</thead>

<tbody>
{props.Tickers.map((val,index)=>{
  return  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
  <td title='Enter Ticker'><input  id={`Ticker${index}`} style={{textTransform:'uppercase',position:'relative',top:'12px',width:'60px'}}  onChange={(e) => { handleChange(index, 'Ticker', e.target.value) }} type="text" /></td>
  <td title='Click Buy Or Sell '>
        <button  onClick={() => { chengeColor(index, 'Buy'); buyAndSell(index, 'Buy') }}  style={{ backgroundColor: chengeConditoin[index] === 'Buy' || !chengeConditoin[index] ? 'green' : 'gray', color: 'white',borderRadius:'10px',margin:'3px'}}>Long</button>
        <button  onClick={() => { chengeColor(index, 'Sell'); buyAndSell(index, 'Sell') }}  style={{ backgroundColor: chengeConditoin[index] === 'Sell' ? 'red' : 'gray', color: 'white',borderRadius:'10px' }}>Short</button>
      </td>
  <td title='Enter Quantity'><input   onKeyDown={(e) => {if (e.key === 'e' || e.key === 'E') { e.preventDefault(); }}} id={`quantity${index}`}   onChange={(e) => { handleChange(index, 'Quantity', e.target.value) }} type="number" /></td>
  <td style={{fontWeight:'bold'}} title='Price Of Ticker' id={`Actual${index}`}></td>
  <td title='Enter Price'><input  onKeyDown={(e) => {if (e.key === 'e' || e.key === 'E') { e.preventDefault(); }}} id={`price${index}`}  onChange={(e) => { handleChange(index, 'price', e.target.value) }} type="number" /></td>
  <td title='Total Cost' style={{fontWeight:'bold'}} id='totalCost'>${Math.round(val.TotalCost)}</td>
  <td title='Enter Exit Price'><input id={`exit${index}`}  onKeyDown={(e) => {if (e.key === 'e' || e.key === 'E') { e.preventDefault(); }}}  onChange={(e)=>{handleChange(index,'ExitPrice' ,e.target.value)}} type="number" /></td>
  <td style={{ color: 'green' ,fontWeight:'bold'}} id='e' title='Expected Profit'>{showExpected(val.ExpectedProfit)}</td>
  <td title='Enter Stop Lose'><input id={`stop${index}`}  onKeyDown={(e) => {if (e.key === 'e' || e.key === 'E') { e.preventDefault(); }}}  onChange={(e) => {handleChange(index,'stopLose',e.target.value)}} type="number" /></td>
  <td  style={{ color: 'red' }}  title='Expected Lose'>-${Math.round(val.ExpectedLose)}</td>

  <td id='clearbtn'>
{props.Tickers.length === 1 ? (
  <button  onClick={()=>{clearButton(props.userName,index)}} style={{borderRadius:'10px',backgroundColor:'rgb(20, 255, 255)' }}>Clear</button>
) : (
  <button  onClick={()=>{props.delRow(props.userName,index)}} style={{borderRadius:'10px',backgroundColor:'rgb(20, 255, 255)' }}>Clear</button>
)}
</td>
</tr>
})}   </tbody>     
        </table>  

        <br />

        
        
        <button id='button' onClick={() =>{inputes(props.row)} }> + Add another ticker</button>
<br />        
<br />
   <div id='divButton'>
    <button id='saveBtn' onClick={()=>{props.saveData()}}>Save All</button> 
    <button  id='delBtn' onClick={()=>{props.deleteAll(props.userName,props.firstName)}}>Delete All</button> 
   </div>

   <br /><br />

<div id='divsTotal'>
<h4 style={{color:'blue', fontWeight: 'bold' }}>Total investment : ${Math.round(sumCost)}</h4>
<h4 style={{ color: 'green', fontWeight: 'bold' }}>Total Profit : {showExpected(sumProfit)}</h4>
<h4 style={{ color: 'green', fontWeight: 'bold' }}>Total Profit : {`${Math.round(presProfit)}%`}</h4>
<h4 style={{ color: 'red', fontWeight: 'bold' }}>Total Loss : -${Math.round(sumLose)}</h4>
<h4 style={{ color: 'red', fontWeight: 'bold' }}>Total Loss : {`${Math.round(presLose)}%`}</h4>
</div>
             

<button id='logout' onClick={Logout} >Log Out</button>

    </div>
  )
}
