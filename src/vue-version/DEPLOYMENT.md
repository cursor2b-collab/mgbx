# 部署指南

本文档提供了多种部署方式的详细说明。

## 📋 部署前准备

### 1. 环境变量配置

复制 `.env.example` 为 `.env.production`:

```bash
cp .env.example .env.production
```

编辑 `.env.production`:

```env
VITE_API_BASE_URL=https://api.your-domain.com
VITE_GOOGLE_CLIENT_ID=your-production-google-client-id
VITE_APP_ENV=production
```

### 2. 构建生产版本

```bash
npm run build
```

构建产物位于 `dist/` 目录。

## 🚀 部署方式

### 方式 1: Vercel 部署（推荐）

#### 使用 Vercel CLI

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署**
```bash
vercel
```

4. **生产部署**
```bash
vercel --prod
```

#### 使用 Git 集成

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 访问 [vercel.com](https://vercel.com)
3. 点击 "Import Project"
4. 选择你的仓库
5. 配置构建设置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. 添加环境变量
7. 点击 "Deploy"

#### vercel.json 配置

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

### 方式 2: Netlify 部署

#### 使用 Netlify CLI

1. **安装 Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **登录 Netlify**
```bash
netlify login
```

3. **初始化**
```bash
netlify init
```

4. **部署**
```bash
netlify deploy --prod
```

#### 使用 Git 集成

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 访问 [netlify.com](https://www.netlify.com)
3. 点击 "New site from Git"
4. 选择你的仓库
5. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. 添加环境变量
7. 点击 "Deploy site"

#### netlify.toml 配置

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

### 方式 3: GitHub Pages 部署

#### 1. 安装 gh-pages

```bash
npm install -D gh-pages
```

#### 2. 修改 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/your-repo-name/', // 替换为你的仓库名
})
```

#### 3. 添加部署脚本到 package.json

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### 4. 部署

```bash
npm run deploy
```

#### 5. 配置 GitHub Pages

1. 访问仓库的 Settings
2. 找到 Pages 部分
3. Source 选择 `gh-pages` 分支
4. 保存

---

### 方式 4: Nginx 部署

#### 1. 构建项目

```bash
npm run build
```

#### 2. 上传到服务器

```bash
scp -r dist/* user@your-server:/var/www/your-app/
```

#### 3. Nginx 配置

创建配置文件 `/etc/nginx/sites-available/your-app`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 证书配置
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 网站根目录
    root /var/www/your-app;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由处理
    location / {
        try_files $uri $uri/ /index.html;
        add_header X-Frame-Options "DENY";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";
    }

    # API 反向代理（可选）
    location /api/ {
        proxy_pass https://your-api-server.com;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 4. 启用配置并重启 Nginx

```bash
sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 方式 5: Docker 部署

#### 1. 创建 Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 创建 nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 3. 创建 .dockerignore

```
node_modules
dist
.git
.env
.env.local
*.log
```

#### 4. 构建镜像

```bash
docker build -t crypto-exchange-login .
```

#### 5. 运行容器

```bash
docker run -d -p 80:80 --name crypto-login crypto-exchange-login
```

#### 6. 使用 Docker Compose

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

运行：

```bash
docker-compose up -d
```

---

### 方式 6: AWS S3 + CloudFront 部署

#### 1. 创建 S3 存储桶

```bash
aws s3 mb s3://your-bucket-name
```

#### 2. 配置静态网站托管

```bash
aws s3 website s3://your-bucket-name \
  --index-document index.html \
  --error-document index.html
```

#### 3. 设置存储桶策略

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

#### 4. 上传构建产物

```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

#### 5. 配置 CloudFront

1. 创建 CloudFront 分配
2. Origin Domain 选择 S3 存储桶
3. 配置默认根对象为 `index.html`
4. 创建自定义错误响应：404 -> /index.html (200)
5. 配置 SSL 证书

---

## 🔒 安全配置

### 1. SSL/TLS 证书

#### Let's Encrypt (免费)

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

自动续期：

```bash
sudo certbot renew --dry-run
```

### 2. 安全头部

在 Nginx 配置中添加：

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://your-api.com;" always;
```

---

## 📊 监控和分析

### 1. Google Analytics

在 `index.html` 中添加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Sentry 错误监控

```bash
npm install @sentry/vue
```

在 `main.ts` 中配置：

```typescript
import * as Sentry from "@sentry/vue"

Sentry.init({
  app,
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.VITE_APP_ENV,
})
```

---

## 🔄 CI/CD 配置

### GitHub Actions

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
        VITE_GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

## 📝 部署检查清单

- [ ] 环境变量已正确配置
- [ ] API 端点已更新为生产环境地址
- [ ] SSL 证书已安装并配置
- [ ] 安全头部已设置
- [ ] Gzip 压缩已启用
- [ ] 静态资源缓存已配置
- [ ] SPA 路由已正确处理
- [ ] 错误监控已集成
- [ ] 分析工具已配置
- [ ] 性能优化已完成
- [ ] SEO 元标签已添加
- [ ] 移动端适配已测试
- [ ] 跨浏览器兼容性已验证
- [ ] 备份策略已制定

---

## 🆘 故障排查

### 问题：部署后白屏

**解决方案：**
1. 检查浏览器控制台错误
2. 验证资源路径是否正确
3. 确认 `base` 配置是否正确（GitHub Pages）
4. 检查路由配置

### 问题：API 请求失败

**解决方案：**
1. 检查 CORS 配置
2. 验证 API 端点地址
3. 检查环境变量是否正确加载
4. 确认 SSL 证书是否有效

### 问题：静态资源 404

**解决方案：**
1. 检查 Nginx/服务器配置
2. 验证资源路径
3. 确认构建产物完整性

---

部署成功后，访问您的域名即可看到应用！🎉
