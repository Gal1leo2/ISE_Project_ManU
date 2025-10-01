import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import router from './routes/routes.js';
import adminRoute from './routes/admin.routes.js';
import 'dotenv/config'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/api/v1/*', cors())
app.use('/api/v1/*', cors({
  origin: 'http://localhost:3000',
  allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
})
)

app.get('/', (c) => c.json({ message: "API is running . . . " }, 200));

//connect to routes
app.route("/api/v1", router)

app.route("/api/v1/admin", adminRoute)

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
