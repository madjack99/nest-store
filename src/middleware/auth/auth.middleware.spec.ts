import express from 'express';
import session from 'express-session';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from './auth.middleware.js';
import { ProductController } from '../../products/controller/product/product.controller.js';
import { ProductService } from '../../products/service/product/product.service.js';
import { UserController } from '../../users/controller/user/user.controller.js';
import { UserService } from '../../users/service/user/user.service.js';
import { User } from '../../entities/user.js';
import { Product } from '../../entities/product.js';
import { DataSource, Repository } from 'typeorm';

describe('global login state', () => {
  beforeEach(() => {
    global.isLoggedIn = 'false';
  });

  it('updates the state when a user logs in and logs out', async () => {
    const jwt = new JwtService({ secret: 'test-secret' });
    const repository = new Repository(
      User,
      new DataSource({ type: 'mysql' }).manager,
    );
    vi.spyOn(repository, 'findOne').mockResolvedValue({
      id: 1,
      username: 'alice',
      password: 'password',
      createdAt: new Date(),
    });
    const controller = new UserController(new UserService(repository), jwt);
    const auth = new AuthMiddleware(jwt);
    const app = express();
    app.use(express.urlencoded({ extended: false }));
    app.use(
      session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.post('/user/login', async (req, res) => {
      await controller.userLogin(req.body, res, req);
    });
    app.get('/user/logout', (req, res) => controller.logout(res, req));
    app.get(
      '/mystore/home',
      (req, res, next) => auth.use(req, res, next),
      (_req, res) => {
        res.send(global.isLoggedIn);
      },
    );

    const agent = request.agent(app);
    await agent
      .post('/user/login')
      .type('form')
      .send({ username: 'alice', password: 'password' })
      .expect(302);
    await agent.get('/mystore/home').expect(200, 'true');
    await agent.get('/user/logout').expect(302);
    expect(global.isLoggedIn).toBe('false');
    await agent
      .get('/mystore/home')
      .expect(302)
      .expect('Location', '/user/login');
  });

  it('clears stale global state when a request has no token', async () => {
    global.isLoggedIn = 'true';
    const auth = new AuthMiddleware(new JwtService({ secret: 'test-secret' }));
    const app = express();
    app.use(
      session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.get('/', (req, res, next) => auth.use(req, res, next));

    await request(app).get('/').expect(302).expect('Location', '/user/login');
    expect(global.isLoggedIn).toBe('false');
  });

  it('passes login state to the edit-product view', async () => {
    const product = {
      id: 1,
      productname: 'Product',
      price: 1,
      image: '',
      createdAt: new Date(),
    };
    const repository = new Repository(
      Product,
      new DataSource({ type: 'mysql' }).manager,
    );
    vi.spyOn(repository, 'findOne').mockResolvedValue(product);
    global.isLoggedIn = 'true';

    await expect(
      new ProductController(new ProductService(repository)).getOne(1),
    ).resolves.toEqual({
      product,
      isLoggedIn: 'true',
    });
  });
});
