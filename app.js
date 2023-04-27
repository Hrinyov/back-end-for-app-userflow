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

app.get('/users/:userId/events', async (req, res) => {
    try {
     const userId = req.params.userId;
    const users = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: { events: true }
    })
    res.json(users)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.post('/users', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: req.body
        })
        res.json(user)
    } catch (error) {
        
    }
})

app.get('/events', async (req, res) => {
    res.send('Ok');
})

app.get('/events/:id', async (req, res) => {
    res.send('Ok');
})

app.post('/events', async (req, res) => {
    res.send('Ok');
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running or port 8080');    
});