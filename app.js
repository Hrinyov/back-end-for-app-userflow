import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import passport from './passport.js';
import jwt from 'jsonwebtoken'
import session from 'express-session';
import bcrypt from 'bcryptjs'

const app = express();
const prisma = new PrismaClient();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//         return res.status(200).json({});
//     }
//     next();
// });


app.get('/users/:id', async (req, res) => {
    try {
       const {id} = req.params
       const user = await prisma.user.findUnique({
        where:{
            id: Number(id)
        },
        select: {
           id: true,
           username: true,
           email: true,
           phonenumber: true,
           events: true,
        },
       })
       res.json(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                phonenumber: true,
                events: true,
            },
        })
        res.json(users)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                username: username
            }
        });
        if (existingUser) {
            res.sendStatus(409)
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    username: username,
                    password: hashedPassword,
                    email: req.body.email,
                    phonenumber: req.body.phonenumber,
                },
            });

            res.sendStatus(201);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });  
    }
})

app.get('/events', async (req, res) => {
    try {
        const events = await prisma.event.findMany({});
        res.json(events)
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });  
    }
})


app.get('/events/:userId', async (req, res) => {
    const {userId} = req.params
    try {
        const events = await prisma.event.findMany({
           where: {
            userId: Number(userId) }
        });
        res.json(events)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.post('/events', async (req, res) => {
    const { title, description, startDate, endDate, userId } = req.body;
    try {
        const existingEvents = await prisma.event.findMany({
            where: {
                userId: Number(userId),
                OR: [
                    {
                        startDate: {
                            lte: new Date(endDate)
                        },
                        endDate: {
                            gte: new Date(startDate)
                        }
                    },
                    {
                        startDate: {
                            gte: new Date(startDate)
                        },
                        endDate: {
                            lte:    new Date(endDate) 
                        }
                    }
                ]
            }
        });
        if (existingEvents.length > 0){
            res.sendStatus(409)
        } else {
            const event = await prisma.event.create({
                data: {
                    title: title,
                    description: description,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    userId: Number(userId)
                }
            })
        res.sendStatus(201)     
        }     
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


app.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);

        return res.json({ token });
    })(req, res, next);
});




app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running or port 8080');    
});