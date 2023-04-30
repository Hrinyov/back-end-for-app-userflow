import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();


const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.get('/users/:id', async (req, res) => {
    try {
       const {id} = req.params
       const user = await prisma.user.findUnique({
        where:{
            id: Number(id)
        }
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
            include: { events: true }
        })
        res.json(users)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


app.post('/users', async (req, res) => {
    const { username } = req.body;
    try {
        const existingUser = await prisma.user.findMany({
            where: {
                username: username
            }
        });
        if (existingUser) {
            res.sendStatus(409)
        } else {
            const event = await prisma.user.create({
                data: req.body
            })
            res.sendStatus(201)
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

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running or port 8080');    
});