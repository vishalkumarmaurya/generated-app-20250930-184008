import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, notFound, bad } from './core-utils';
import { SchemeEntity, ApplicationEntity, UserEntity } from "./entities";
import type { AuthUser } from "@shared/types";
// Simple password hashing using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure data is seeded on first request in a non-blocking way
  app.use('/api/*', async (c, next) => {
    await Promise.all([
      SchemeEntity.ensureSeed(c.env),
      ApplicationEntity.ensureSeed(c.env)
    ]);
    await next();
  });
  // USER AUTHENTICATION ROUTES
  app.post('/api/register', async (c) => {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return bad(c, 'Email and password are required.');
    }
    const userEntity = new UserEntity(c.env, email);
    if (await userEntity.exists()) {
      return bad(c, 'User with this email already exists.');
    }
    const hashedPassword = await hashPassword(password);
    const newUser: AuthUser = {
      id: crypto.randomUUID(),
      email,
      hashedPassword,
    };
    await UserEntity.create(c.env, newUser);
    // Return user object without password
    const { hashedPassword: _, ...userToReturn } = newUser;
    return ok(c, userToReturn);
  });
  app.post('/api/login', async (c) => {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return bad(c, 'Email and password are required.');
    }
    const userEntity = new UserEntity(c.env, email);
    if (!await userEntity.exists()) {
      return notFound(c, 'Invalid credentials.');
    }
    const user = await userEntity.getState();
    const hashedPassword = await hashPassword(password);
    if (user.hashedPassword !== hashedPassword) {
      return bad(c, 'Invalid credentials.');
    }
    // Return user object without password
    const { hashedPassword: _, ...userToReturn } = user;
    return ok(c, userToReturn);
  });
  // APPLICATION DATA ROUTES
  app.get('/api/dashboard-summary', async (c) => {
    const { items: applications } = await ApplicationEntity.list(c.env);
    const summary = applications.reduce((acc, app) => {
      if (app.status === 'Approved') {
        if (app.type === 'Loan') {
          acc.totalLoanAmount += app.amount;
        } else {
          acc.totalSubsidiesReceived += app.amount;
        }
        acc.approvedApplications++;
      }
      if (app.status === 'In Review') {
        acc.applicationsInReview++;
      }
      return acc;
    }, {
      totalLoanAmount: 0,
      totalSubsidiesReceived: 0,
      applicationsInReview: 0,
      approvedApplications: 0,
    });
    return ok(c, summary);
  });
  app.get('/api/applications', async (c) => {
    const { items } = await ApplicationEntity.list(c.env);
    const sortedItems = items.sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
    return ok(c, sortedItems);
  });
  app.get('/api/schemes', async (c) => {
    const { items } = await SchemeEntity.list(c.env);
    return ok(c, items);
  });
  app.get('/api/application/:id', async (c) => {
    const { id } = c.req.param();
    const applicationEntity = new ApplicationEntity(c.env, id);
    if (!await applicationEntity.exists()) {
      return notFound(c, 'Application not found');
    }
    const application = await applicationEntity.getState();
    if (application.events) {
      application.events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return ok(c, application);
  });
}