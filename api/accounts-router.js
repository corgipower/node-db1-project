const express = require('express');
const db = require('../data/dbConfig');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const accounts = await db.select('*').from('accounts');
        res.json(accounts);
    }
    catch(err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const account = await db.first().from('accounts').where('id', req.params.id);
        if(account) {
            res.json(account);
        } else {
            res.status(404).json({
                message: 'no such thing here',
            })
        }
    }
    catch(err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        if(!req.body.name || !req.body.budget) {
            res.status(400).json({
                message: 'we need a name and budget',
            })
        }
        const payload = {
            name: req.body.name,
            budget: req.body.budget,
        }

        const id = await db.insert(payload).into('accounts');

        const message = await db.first().from('accounts').where('id', id);
        res.status(201).json(message);
    }
    catch(err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        if(!req.body.name || !req.body.budget) {
            res.status(400).json({
                message: 'we need a name and budget',
            })
        }
        
        const id = await db.first().from('accounts').where('id', req.params.id);
        if(id) {
            const payload = {
                name: req.body.name,
                budget: req.body.budget,
            }

            await db.select('*').from('accounts').where('id', req.params.id).update(payload);

            const message = await db.first().from('accounts').where('id', req.params.id);

            res.json(message);
        } else {
            res.status(404).json({
                message: 'no such thing here',
            })
        }
    }
    catch(err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = await db.first().from('accounts').where('id', req.params.id);
        if(id) {
            await db.select('*').from('accounts').where('id', req.params.id);
            res.status(204).end();
        } else {
            res.status(404).json({
                message: 'that never existed',
            })
        }
    }
    catch(err) {
        next(err);
    }
});

module.exports = router;