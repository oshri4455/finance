import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Table from './components/Table';
import Package1 from './components/Package1';
import Package2 from './components/Package2';
import Package3 from './components/Package3';
import Registr from './components/Registr';
import Home from './components/Home';
import Reshom from './components/Reshom';
import ForgetPassword from './components/ForgetPassword';
import { v4 as uuidv4 } from 'uuid';
import ResetPassword from './components/ResetPassword';

function App() {
  const defaultRow = {
    Ticker: '',
    Quantity: 0,
    price: 0,
    ExitPrice: 0,
    StopLose: 0,
    TotalCost: 0,
    ExpectedProfit: 0,
    ExpectedLose: 0
  };

  const [users, setUsers] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [flag, setFlag] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [Tickers, setTickers] = useState([defaultRow]);

  useEffect(() => {
    const storedRow = localStorage.getItem(`row_${firstName}`);
    setRow(storedRow ? parseInt(storedRow) : 9);
  }, [firstName]);

  const getName = (n) => {
    setFirstName(n);
  };

  const [row, setRow] = useState(() => {
    const storedRow = localStorage.getItem(`row_${firstName}`);
    return storedRow ? parseInt(storedRow) : 9;
  });

  useEffect(() => {
    // Save the value to localStorage whenever it changes
    localStorage.setItem(`user${firstName}`, row.toString());
  }, [row, firstName]); // נוסיף גם את firstName כתלות כדי שהכל יתרענן כאשר הוא משתנה

  const [data, setData] = useState(null);

  const addUsers = (u, p, r, e) => {
    const userData = {
      userName: u,
      password: p,
      repetPassword: r,
      email: e,
      id: uuidv4(),
      Tickers: [defaultRow]
    };

    fetch('/addUser', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify({ user: userData })
    })
    .then(res => {
      if (res.ok) {
        setUsers(prevUsers => [...prevUsers, userData]);
        setFlag(!flag);
      } else if (res.status === 400) {
        res.json().then(data => {
          alert(data.error);
        });
      } else {
        throw new Error('Failed to add user');
      }
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
  };
  useEffect(() => {
    const loadStateFromLocalStorage = () => {
      const storedState = localStorage.getItem('appState');
      if (storedState) {
        const state = JSON.parse(storedState);
        if (state && state.users) {
          setUsers(state.users);
          const currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            setCurrentUser(currentUser);
            loadUserStateFromLocalStorage(currentUser);
          }
        }
      }
    };
   

    const saveStateToLocalStorage = () => {
      const state = {
        users,
        currentUser: currentUser,
      };
      localStorage.setItem('appState', JSON.stringify(state));
      localStorage.setItem('currentUser', currentUser);
    };
  
    const saveUserStateToLocalStorage = () => {
      const state = {
        tickers: Tickers,
      };
      localStorage.setItem(`appState_${currentUser}`, JSON.stringify(state));
    };
  
    loadStateFromLocalStorage();
    saveStateToLocalStorage();
    saveUserStateToLocalStorage();
  
  }, [users, currentUser, Tickers, loadUserStateFromLocalStorage]); // תוסיף תלות ל־loadUserStateFromLocalStorage
  

  const saveStateToLocalStorage = () => {
    const state = {
      users,
      currentUser: currentUser,
    };
    localStorage.setItem('appState', JSON.stringify(state));
    localStorage.setItem('currentUser', currentUser);
  };

  useEffect(() => {
    saveStateToLocalStorage();
  }, [users, currentUser]);

  const loadUserStateFromLocalStorage = (user) => {
    const storedState = localStorage.getItem(`appState_${user}`);
    if (storedState) {
      const state = JSON.parse(storedState);
      setTickers(state.tickers);
    }
  };

  const saveUserStateToLocalStorage = () => {
    const state = {
      tickers: Tickers,
    };
    localStorage.setItem(`appState_${currentUser}`, JSON.stringify(state));
  };



  useEffect(() => {
    const saveToLocalStorage = () => {
      saveStateToLocalStorage();
      if (currentUser) {
        saveUserStateToLocalStorage();
      }
    };

    saveToLocalStorage();
  }, [saveStateToLocalStorage, saveUserStateToLocalStorage, currentUser]);

  const delRow = (username, rowIndex) => {
    const updatedUsers = [...users];
    const userIndex = updatedUsers.findIndex(user => user.userName === username);

    if (userIndex !== -1) {
      const updatedUser = { ...updatedUsers[userIndex] };
      if (rowIndex >= 0 && rowIndex < updatedUser.Tickers.length) {
        updatedUser.Tickers.splice(rowIndex, 1);
        if (updatedUser.Tickers.length === 0) {
          updatedUser.Tickers.push(defaultRow);
        }
        updatedUsers[userIndex] = updatedUser;
        setUsers(updatedUsers);
        localStorage.setItem('Users', JSON.stringify(updatedUsers));

        fetch(`/delRows/users/${username}/rows/${rowIndex}`, {
          method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Error:', error));
      } else {
        console.log(`Row index ${rowIndex} not found for user ${username}`);
      }
    } else {
      console.log(`User ${username} not found`);
    }
  };

  const addTickers = (t, q, p, e, sl, index) => {
    const newTicker = {
      Ticker: String(t),
      Quantity: Number(q),
      price: Number(p),
      ExitPrice: Number(e),
      stopLose: Number(sl),
      TotalCost: 0,
      ExpectedProfit: 0,
      ExpectedLose: 0,
    };

    if (users[index].Tickers.length < row) {
      setUsers(currentUsers => {
        const updatedUsers = [...currentUsers];
        updatedUsers[index].Tickers = [...updatedUsers[index].Tickers, newTicker];
        return updatedUsers;
      });
    }

    fetch('/addTicker', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify({
        email: users[index].email,
        ticker: newTicker
      })
    })
    .then(res => res.json())
    .then(data => {
      setFlag(!flag);
    });
    newTicker.price = 0;
    newTicker.Quantity = 0;
  };

  const saveData = () => {
    setData([...data, Tickers]);
    localStorage.setItem('Tickers', JSON.stringify(Tickers));
    localStorage.setItem('TickerValue', Tickers[0].Ticker);
    localStorage.setItem('inputValue', Tickers[0].Quantity.toString());
    localStorage.setItem('priceValue', Tickers[0].price.toString());
    localStorage.setItem('exitValue', Tickers[0].ExitPrice.toString());
    localStorage.setItem('stopValue', Tickers[0].StopLose.toString());

    fetch('/saveTable', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify({
        Tickers: Tickers
      })
    })
    .then((res) => res.json())
    .then((data) => {
      setFlag(!flag);
    });
  };

  const deleteAll = (username) => {
    if (window.confirm("Are you sure you want to delete all rows?")) {
      const updatedUsers = [...users];
      const userIndex = updatedUsers.findIndex(user => user.userName === username);

      if (userIndex !== -1) {
        const updatedUser = { ...updatedUsers[userIndex] };
        updatedUser.Tickers = [defaultRow];
        updatedUsers[userIndex] = updatedUser;
        setUsers(updatedUsers);
        localStorage.setItem('Users', JSON.stringify(updatedUsers));

        fetch(`/deleteAll/${username}`, {
          method: 'DELETE',
        })
        .then(res => res.json())
        .then(data => console.log(data.message))
        .catch(err => console.error(err));

        Tickers.forEach((val, index) => {
          document.getElementById(`Actual${index}`).innerHTML = '';
          document.getElementById(`quantity${index}`).value = '';
          document.getElementById(`Ticker${index}`).value = '';
          document.getElementById(`price${index}`).value = '';
          document.getElementById(`exit${index}`).value = '';
          document.getElementById(`stop${index}`).value = '';
        });
      } else {
        console.log(`User ${username} not found`);
      }
    }
  };

  const clearTable = () => {
    setTickers([defaultRow]);

    localStorage.setItem('Tickers', JSON.stringify([defaultRow]));
    localStorage.setItem('TickerValue', '');
    localStorage.setItem('inputValue', '');
    localStorage.setItem('priceValue', '');
    localStorage.setItem('exitValue', '');
    localStorage.setItem('stopValue', '');

    fetch('/clearTable', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify({
        temp: defaultRow
      })
    })
    .then((res) => res.json())
    .then((data) => {
      setFlag(!flag);
    });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home addUsers={addUsers} users={users} getName={getName} />} />
          {users.map((val, index) => {
            return <Route path={`/user/${val.email}`} element={<Table row={row} id={val.id} defaultRow={defaultRow} userName={val.userName} users={users} setFlag={setFlag} index={index} Ticker={val.Ticker} Quantity={val.Quantity} price={val.price} ExpectedLose={val.ExpectedLose} ExitPrice={val.ExitPrice} stopLose={val.stopLose} setUsers={setUsers} deleteAll={deleteAll} clearTable={clearTable} data={data} saveData={saveData} Tickers={val.Tickers} addTickers={addTickers} delRow={delRow} setTickers={setTickers} />} />
          })}
          {users.map((val, index) => {
            return <Route path={`/user/${val.id}`} element={<Table row={row} id={val.id} defaultRow={defaultRow} userName={val.userName} users={users} setFlag={setFlag} index={index} Ticker={val.Ticker} Quantity={val.Quantity} price={val.price} ExpectedLose={val.ExpectedLose} ExitPrice={val.ExitPrice} stopLose={val.stopLose} setUsers={setUsers} deleteAll={deleteAll} clearTable={clearTable} data={data} saveData={saveData} Tickers={val.Tickers} addTickers={addTickers} delRow={delRow} setTickers={setTickers} />} />
          })}
          <Route path='/package1' element={<Package1 setRow={setRow} setTickers={setTickers} Tickers={Tickers} clearTable={clearTable} />} />
          <Route path='/package2' element={<Package2 setRow={setRow} />} />
          <Route path='/package3' element={<Package3 setRow={setRow} />} />
          <Route path='/registr' element={<Registr />} />
          {users.map((val, index) => {
            return <Route path='/reshom' element={<Reshom userName={val.userName} users={users} />} />
          })}
          <Route path='/forget' element={<ForgetPassword users={users} />} />
          <Route path='/resetPassword' element = {<ResetPassword users={users} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;