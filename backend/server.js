const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();


const pool = new Pool({
    user: process.env.DB_USER,     
    host: process.env.DB_HOST,      
    database: process.env.DB_NAME,  
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT       
});

app.use(cors());
app.use(bodyParser.json());


app.get('/liste_abrufen', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/add', async (req, res) => {
    try {
        
        const result = await pool.query(
            'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
            [req.body.title]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.json({ message: 'Task erfolgreich gelöscht.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.patch('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        const result = await pool.query(
            'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
            [completed, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3050, "localhost", () => {
    console.log("Server läuft auf localhost:3050");
});
