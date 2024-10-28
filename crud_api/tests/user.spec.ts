import request from 'supertest';
import app from '../src/index'; 
import db from '../src/database';

describe('User API', () => {
  beforeAll((done) => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)', () => {
      done();
    });
  });

  afterAll((done) => {
    db.run('DROP TABLE IF EXISTS users', () => {
      db.close();
      done();
    });
  });

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'john@example.com' });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User created successfully');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('name', 'John Doe');
    expect(response.body.user).toHaveProperty('email', 'john@example.com');
  });

  it('should get all users', async () => {
    const response = await request(app).get('/api/users');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a user by ID', async () => {
    const userResponse = await request(app)
      .post('/api/users')
      .send({ name: 'Jane Doe', email: 'jane@example.com' });

    const userId = userResponse.body.user.id;

    const response = await request(app).get(`/api/users/${userId}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('name', 'Jane Doe');
    expect(response.body).toHaveProperty('email', 'jane@example.com');
  });

  it('should update a user', async () => {
    const userResponse = await request(app)
      .post('/api/users')
      .send({ name: 'Mike Smith', email: 'mike@example.com' });

    const userId = userResponse.body.user.id;

    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({ name: 'Michael Smith', email: 'mike.smith@example.com' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User updated successfully');
    expect(response.body.user).toHaveProperty('id', userId);
    expect(response.body.user).toHaveProperty('name', 'Michael Smith');
    expect(response.body.user).toHaveProperty('email', 'mike.smith@example.com');
  });

  it('should delete a user', async () => {
    const userResponse = await request(app)
      .post('/api/users')
      .send({ name: 'Alice Johnson', email: 'alice@example.com' });

    const userId = userResponse.body.user.id;

    const response = await request(app).delete(`/api/users/${userId}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User deleted successfully');
    
    const getResponse = await request(app).get(`/api/users/${userId}`);
    expect(getResponse.status).toBe(404);
  });
});
