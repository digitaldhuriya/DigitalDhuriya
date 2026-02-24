# Deployment Guide
This guide deploys Digital Dhuriya Business OS on a Linux VM with PostgreSQL, Node.js, PM2, and Nginx.

## 1. Prerequisites
- Ubuntu 22.04+ (or equivalent)
- Node.js 20+
- npm 10+
- PostgreSQL 15+
- Nginx
- PM2 (`npm i -g pm2`)
- Domain names (recommended):
  - `app.yourdomain.com` -> Next.js frontend
  - `api.yourdomain.com` -> NestJS API

## 2. Clone + Install
```bash
git clone <repo-url>
cd Web
npm install
```

## 3. Environment Variables
Create env files from templates:
- `apps/api/.env`
- `apps/business-os/.env`
- `packages/database/.env`

Critical production values:
- `NODE_ENV=production`
- Strong `JWT_SECRET`
- Strong `COOKIE_SECRET`
- `DATABASE_URL` to managed Postgres
- `CORS_ORIGIN=https://app.yourdomain.com`
- `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api`

## 4. Database Migration + Seed
```bash
npm run db:generate --workspace @digital-dhuriya/database
npm run db:push --workspace @digital-dhuriya/database
npm run db:seed --workspace @digital-dhuriya/database
```

## 5. Build Applications
```bash
npm run build --workspace api
npm run build --workspace business-os
```

## 6. Run with PM2
### API
```bash
pm2 start "npm run start:prod --workspace api" --name dd-api
```

### Frontend
```bash
pm2 start "npm run start --workspace business-os" --name dd-web
```

Persist PM2:
```bash
pm2 save
pm2 startup
```

## 7. Nginx Reverse Proxy
### API block
```nginx
server {
  server_name api.yourdomain.com;

  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### Frontend block
```nginx
server {
  server_name app.yourdomain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Reload Nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 8. SSL Certificates (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d app.yourdomain.com -d api.yourdomain.com
```

## 9. Health + Smoke Checks
- API health: `GET https://api.yourdomain.com/api/health`
- Frontend login: `https://app.yourdomain.com/login`
- Download sample invoice PDF after seeding.

## 10. Backup Strategy
- Application backup endpoint: `POST /api/admin/backups`
- Store generated backup JSON files off-host (S3 / object storage).
- Add PostgreSQL native backups (`pg_dump`) with cron for full DR.

## 11. Scaling Notes
- API is stateless and can be horizontally scaled.
- Use managed Postgres with automated backups.
- Add Redis caching/queue if traffic grows.
- Place Cloudflare/CDN in front of frontend.
