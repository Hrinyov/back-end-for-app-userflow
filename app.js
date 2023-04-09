import express from 'express'
import { getUser, getUsers, createUser} from './database.js';
import { getEvent, getEvents, createEvent } from './database.js';
import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.get('/users', async (req, res) => {
    const users = await getUsers();
    res.send(users);
})

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const user = await getUser(id);
    res.send(user);
})

app.post('/users', async (req, res) => {
    const { username, email, phonenumber } =req.body;
    const user = await createUser(username, email, phonenumber);
    res.status(201).send(user);
})

app.get('/events', async (req, res) => {
    const events = await getEvents();
    res.send(events);
})

app.get('/events/:id', async (req, res) => {
    const id = req.params.id;
    const event = await getEvent(id);
    res.send(event);
})

app.post('/events', async (req, res) => {
    const { title, description, startDate, endDate, userId } = req.body;
    const event = await createEvent(title, description, startDate, endDate, userId);
    res.status(201).send(event);
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running or port 8080');
})