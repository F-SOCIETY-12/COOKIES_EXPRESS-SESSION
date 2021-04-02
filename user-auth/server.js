const express = require('express')
const session = require('express-session')

const { db, Users } = require('./db')  ////kyuki db kisi folder me nahi hai isliye (.) se kam kar gaya hai

const app = express()
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'this is aman kaushik',
    cookie : {                      ///it end the session on this date
        expires : new Date('2021-04-30')
    }
}))

app.get('/signup', (req, res) =>  //agar signup page pe aayi request to signup page ko res.render kardenge
{
    res.render('signup')
})


app.post('/signup', async (req, res) =>   ///jab b iss post method pe req ayegi to USers add hohayenge
{
    const user = await Users.create({
        username: req.body.username,
        password: req.body.password,    //Note : in production we save hash of password
        email: req.body.email
    })
    res.status(201).send(`User : "${user.id}" and username : "${user.username}"has Created`)
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const user = await Users.findOne({ where: { username: req.body.username } })
    ///acha khali if likhne me ye fyada hai ki yahi pe aake 
    //code ruk jayega true hone pe condition ke
    if (!user)  ////agar user nahi hai to kya karenge ki res.render karenge login page ko dubara with error
    {
        return res.status(404).render('login', {    ///ab yaha pe humne error handle karne ka tarike kardiya hai
            ///with same page
            error: 'No such username found'
        })
    }
    if (user.password != req.body.password) {
        return res.status(401).render('login', {    ///ab yaha pe humne error handle karne ka tarike kardiya hai
            ///with same page
            error: 'Incorrect password'
        })
    }
    req.session.userId = user.id    ///for cookie 
    ///if agar username and password got matched
    res.redirect('/profile')   ///to hum usko profile page pe redirect karrdenge

})

app.get('/profile',async (req,res)=>
{
    if(!req.session.userId)     ///agar cookie exist nahi karta to hum usko login page pe waps krdnge
    {
        return res.redirect('/login')
    }
    //otherwise USers me se userid uthake leaynge
    const user = await Users.findByPk(req.session.userId)
    res.render('profile',{ user })       ///ab hume ye pata karna hai ki client already loged in hai phle se
                                     //kisi aur page me
})
 ////Now how to make logout function
 app.get('/logout',(req,res)=>    ////jaise <a href="/logout"> click hote is ye trigger hoga
 {
     req.session.userId = null      ///aur ye yaha req.session se userId ko null kardeg
     //there is an another () which is--->req.session.destroy() isse puri cookie destroy hojati 
     //new banjti hai
     res.redirect('/login') 
 })

db.sync()
    .then(() => {
        app.listen(3456, () => {
            console.log('http://localhost:3456')
        })
    })
    .catch((err) => {
        console.log("server couldnot start")
        console.error(err)
    })