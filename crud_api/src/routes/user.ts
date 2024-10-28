import express, {Request, Response} from 'express';
import db from '../database';
import User from '../models/user';
import { sendEmailMessage } from '../email/sender';


const router = express.Router();

router.get('/', async (req, res) => {
  db.all<User[]>('SELECT * FROM users', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

router.post('/', async (req, res) => {
  const { name, email } = req.body;
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  const params = [name, email];
  
  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newUser: User = { id: this.lastID, name, email };
    res.status(201).json({ message: 'User created successfully', user: newUser });
  });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  db.get<User>('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  const params = [name, email, id];
  
  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const updatedUser: User = { id: parseInt(id, 10), name, email };
    res.json({ message: 'User updated successfully', user: updatedUser });
  });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', userId: parseInt(id, 10) });
  });
});

router.post('/send-email', async(req: Request, res: Response) => {
    const { email }: { email: string } = req.body;

    if (!email) {
        res.status(400).json({ error: 'Email is required' });
    }

    const subject = 'Test Email Subject';
    const text = 'This is the body of the email.';

    try {
        await sendEmailMessage(email, subject, text);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Failed to send email: ${error.message}` });
        } else {
            res.status(500).json({ error: 'Failed to send email: Unknown error' });
        }
    }
});

export default router;
