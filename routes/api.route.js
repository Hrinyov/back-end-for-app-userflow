const router = require('express').Router();
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();


router.get('/users', async (req, res) => {
try {
} catch (error){
    next(error)
}
})

router.get('/users/:id', async (req, res) => {
    res.send(user);
})

router.post('/users', async (req, res) => {
    res.send('Ok');
})

router.get('/events', async (req, res) => {
    res.send('Ok');
})

router.get('/events/:id', async (req, res) => {
    res.send('Ok');
})

router.post('/events', async (req, res) => {
    res.send('Ok');
})