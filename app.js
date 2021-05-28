const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/user.routes');
const methodOverride = require('method-override');
const app = express();

const dbURI =
  'mongodb+srv://Ezzo:Password123@cluster0.3jr3w.mongodb.net/Project?retryWrites=true&w=majority';

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(console.log('Connected to database'));

var corsOptions = {
  origin: 'http://localhost:3001',
};
//Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('override'));
app.use(cors(corsOptions));

//Routes
const registerController = require('./controllers/auth.register');
app.use(registerController);
const loginController = require('./controllers/auth.login');
app.use(loginController);
const articleController = require('./controllers/articles');
app.use(articleController);
app.use(userRouter);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
