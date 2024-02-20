const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('mongoose');
const path = require('path');
const morgan = require('morgan'); // הוספת מודול Morgan
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config(); // אם עדיין לא התקנת את dotenv

// הוספת מודול Morgan עם קונפיגורציה לפריטים מסוימים בלבד
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('build'));
app.use(cookieParser());

const mongodbURL = process.env.MONGO_URL;

// התחברות למסד הנתונים עם try ו-catch
try {
  db.connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true });
  const mongoose = db.connection;

  mongoose.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  mongoose.once('open', () => {
    console.log('Connected to MongoDB');
    // כאן תוכל להמשיך לבצע פעולות במסד הנתונים
  });
} catch (error) {
  console.error('Error connecting to MongoDB:', error);
}


const defaultRow = {
    Ticker: '',
    Quantity:'',
    price:'',
    ActualPice:'',
    ExitPrice:'',
    StopLose: '',
    TotalCost: '',
    ExpectedProfit: '',
  };

const usersShema = db.Schema({
  userName:String,
  password:String,
  repetPassword:String,
  email:String,
  id:String,
  Tickers:[{Ticker:String,
    Quantity:Number,
    price:Number,
    ActualPice:Number,
    ExitPrice:Number,
    StopLose:Number,
    TotalCost:Number,
    ExpectedProfit:Number,
    ExpectedLose:Number}]
})


const tickersShema = db.Schema ({
    Ticker:String,
    Quantity:Number,
    price:Number,
    ActualPice:Number,
    ExitPrice:Number,
    StopLose:Number,
    TotalCost:Number,
    ExpectedProfit:Number,
    ExpectedLose:Number

})

usersShema.methods.validPassword = function(password) {
  return this.password === password;
};

const usersList= db.model('userList',usersShema)


const TickersList = db.model('tickerList',tickersShema)

app.post('/reset-password', async (req, res) => {
  const { userName, newPassword ,repetPassword} = req.body;

  try {
    const updatedUser = await usersList.findOneAndUpdate(
      { userName: userName },
      { password: newPassword },
      { repetPassword: repetPassword},
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message:'Password successfully updated' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Error updating password' });
  }
});
const url ='https://financeprod-244fb4eb5274.herokuapp.com/resetPassword'



function sendResetEmail(email, resetCode) {
  // יצירת אובייקט transporter עם הגדרות נתוני הגישה לשליחת האימייל
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'financeforget32@gmail.com',
      pass: 'osyvvozntguhbdkz',
    },
  });

  // יצירת אובייקט mailOptions עם פרטי האימייל (נמען, נושא, גוף ההודעה וכו')
  const mailOptions = {
    from: 'financeforget32@gmail.com',
    to: email,
    subject: 'password reset',
    text: `Click on the following link to reset the password ${url}`,
  };

  // שליחת האימייל עם הפרטים המוגדרים
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      // טיפול בשגיאה במידת הצורך
    } else {
      console.log('Email sent successfully:', info.response);
      // התייחסות לשליחת האימייל במידת הצורך
    }
  });
}
app.post('/send-reset-email', (req, res) => {
  // קבלת האימייל מהבקשה
  const { email } = req.body;

  // ביצוע הלוגיקה של שליחת האימייל עם ספק של שרת המייל שלך (כמו Nodemailer)
  sendResetEmail(email);

  // מענה ללקוח עם הודעה שהאימייל נשלח
  res.json({ message: 'האימייל נשלח בהצלחה' });
});



// מסלול לבדיקת קיום שם משתמש
app.post('/checkUserNameExists', async (req, res) => {
  const { userName } = req.body;

  try {
    const user = await usersList.findOne({ userName: userName });

    if (user) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
});


app.post('/checkEmailExists', async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await usersList.findOne({ email: email });

    if (existingUser) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});




//מוסיף משתמש לדטה בייס
app.post('/addUser', async (req, res) => {
  const temp = req.body.user;

  const addUser = async (userData) => {
    try {
      const existingUser = await usersList.findOne({ userName: temp.userName }).exec();
      if (existingUser) {
        
      } else {
        await usersList.create(userData);
        res.cookie('user', userData.userName); // שמירת מידע בעוגיה עם שם המשתמש
        res.json({ msg: 'User added' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to add user' });
    }
  };

  addUser(temp);
});


app.get('/getUserByEmail/:email', (req, res) => {
  const userEmail = req.params.email;

  usersList.findOne({ email: userEmail })
    .then((user) => {
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Database error' });
    });
});
app.post('/addUserGoogle', async (req, res) => {
  try {
    const { id, name, email } = req.body;

    // Check if the user already exists in the database
    const existingUser = await usersList.findOne({ email });

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
    } else {
      // Create a new user document in the database
      const newUser = new usersList({ id, name, email });
      await newUser.save();

      // Return the newly created user document
      res.json(newUser);
    }
  } catch (error) {
    console.error('Failed to add user to the database:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

//מוחקת את כל השורות מהדטה בייס
app.delete('/api/users/:username/tickers', async (req, res) => {
  const { username } = req.params;

  try {
    // Find the user in the database
    const user = await usersList.find({ userName: username });

    if (user) {
      // Reset the user's tickers to defaultRow
      user.Tickers = [defaultRow];
      await user.save();
      res.status(200).json({ message: `All rows for user ${username} have been deleted.` });
    } else {
      res.status(404).json({ message: `User ${username} not found.` });
    }
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
});

//מוחק את כל השורות בטבלה מהדטבייס=
app.delete('/deleteAll/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const user = await usersList.findOne({ userName: username });
    if (user) {
      user.Tickers = []; // empty the Tickers array
      await user.save();
      res.json({ message: `All Tickers for user ${username} deleted` });
    } else {
      res.json({ message: `User ${username} not found` });
    }
  } catch (err) {
    console.error(err);
    res.json({ message: 'Error deleting Tickers' });
  }
});

//מוחק שורה מהטבלה לפי אינדקס של משתמש ושל שורה
app.delete('/delRows/users/:username/rows/:rowIndex', async (req, res) => {
  const username = req.params.username;
  const rowIndex = parseInt(req.params.rowIndex);

  try {
    const user = await usersList.findOne({ userName: username });
    if (user && rowIndex >= 0 && rowIndex < user.Tickers.length) {
      user.Tickers.splice(rowIndex, 1); // delete the specific row
      if (user.Tickers.length === 0) { // if no rows left, add a default one
        user.Tickers.push(defaultRow);
      }
      await user.save();
      res.json({ message: `Row ${rowIndex} for user ${username} deleted` });
    } else {
      res.json({ message: `Row index ${rowIndex} not found for user ${username}` });
    }
  } catch (err) {
    console.error(err);
    res.json({ message: 'Error deleting row' });
  }
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
//בודק עם המשתמש קיים במערכת
app.post('/checkUser', async (req, res) => {
  const { userName, email } = req.body;

  try {
    // בדיקה אם שם המשתמש כבר קיים
    const userByUserName = await usersList.findOne({ userName: userName }).exec();
    
    // בדיקה אם כתובת האימייל כבר קיימת
    const userByEmail = await usersList.findOne({ email: email }).exec();

    if (userByUserName || userByEmail) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while checking user' });
  }
});


app.get('/table/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const table = await TickersList.findById(id).exec();
    res.json(table);
  } catch (err) {
    console.error(`Error: ${err}`);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'mySecretKey', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};






// מסלול להתחברות משתמש
app.post('/signin', async (req, res) => {
  console.log('111');
  const { userName, password } = req.body;

  try {
    const user = await usersList.findOne({ userName: userName });

    if (!user) {
      return res.status(401).json({ success: false, message: 'The user name or password is incorrect' });
    }

    const passwordMatch = await user.validPassword(password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'The user name or password is incorrect' });
    }

    const userId = user.id; // נגישות ל־id הייחודי של המשתמש

    return res.json({ success: true, user: { id: userId } });
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
});
// מסלול מוגן על ידי הטוקן
app.get('/protected', authenticateToken, (req, res) => {
  // הקוד שלך כאן...
  res.json({ message: 'Protected route' });
});



const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, 'mySecretKey', { expiresIn: '1h' });
  return token;
};

app.post('/checkUserExists', async (req, res) => {
  const { userName } = req.body;
  
  try {
    const user = await usersList.findOne({ userName }).exec();

    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Failed to check user:', error);
    res.status(500).json({ error: 'Failed to check user' });
  }
});
//מוסיף Ticker לא משתמש בנפרד
app.post('/addTicker', async (req, res) => {
  const { email, ticker } = req.body;

  try {
    const user = await usersList.findOneAndUpdate(
      { email: email }, // find a document with that filter
      { $push: { Tickers: ticker } }, // update the document
      { new: true } // return the updated document
    );
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add ticker' });
  }
});
    app.get('/logout', (req, res) => {
      req.session.destroy(err => {
        if(err) {
          return res.redirect('/');
        }
    
        res.clearCookie('connect.sid'); // 'connect.sid' is the default name of the cookie session.
        res.redirect('/login');
      });
    });
    app.get('/logout', (req, res) => {
      req.session.destroy(err => {
        if(err) {
          return res.redirect('/');
        }
    
        res.clearCookie('connect.sid'); // 'connect.sid' is the default name of the cookie session.
        res.redirect('/login');
      });
    });

    
 


   
// מסלול הרשמה

    app.post('/delAllTicker',(req,res)=>{
      let temp = req.body.delAllTicker
      const delArr = async (t)=>{
          await TickersList.findOneAndDelete(t)
          res.json({msg:'Arr deleted'})
      }
      delArr(temp)
  })

  app.post('/clearTable', (req, res) => {
    console.log("Received clearTableAfterInterval request at", req.body.time);
  
  
    res.json({ message: 'Table cleared' });
  });

  

  const port = process.env.PORT || 3000; 

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });