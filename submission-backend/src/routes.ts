import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const dbPath = path.resolve(__dirname, 'db.json');

// Load submissions from db.json
const loadSubmissions = () => {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
};

// Save submissions to db.json
const saveSubmissions = (submissions: any[]) => {
    fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2));
};

// Ping route
router.get('/ping', (req: Request, res: Response) => {
    res.send(true);
});

// Submit route
router.post('/submit', (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const submissions = loadSubmissions();
    submissions.push({ name, email, phone, github_link, stopwatch_time });
    saveSubmissions(submissions);
    res.status(201).send({ message: 'Submission successful' });
});

// Read route
router.get('/read', (req: Request, res: Response) => {
    const { index } = req.query;
    const submissions = loadSubmissions();
    const idx = parseInt(index as string);
    if (idx >= 0 && idx < submissions.length) {
        res.send(submissions[idx]);
    } else {
        res.status(404).send({ message: 'Submission not found' });
    }
});

export default router;
 
