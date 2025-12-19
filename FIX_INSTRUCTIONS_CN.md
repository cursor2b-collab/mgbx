# 宝塔网站修复步骤说明

## 问题
网站 1568game.com 无法访问，路径是 `/www/wwwroot/1568game.com`

## 原因
Vite项目构建后，文件在 `build/` 目录中，但Nginx配置可能指向了错误的路径。

## 快速修复方法

### 方法1: 通过宝塔面板（推荐，最简单）

1. **登录宝塔面板**
   - 访问: `http://你的服务器IP:8888`

2. **修改网站运行目录**
   - 左侧菜单: `网站`
   - 找到 `1568game.com` 并点击右侧的 `设置`
   - 点击 `网站目录` 标签
   - 在 `运行目录` 中填写: `build`
   - 点击 `保存`

3. **添加伪静态规则（SPA支持）**
   - 在网站设置中，点击 `伪静态` 标签
   - 添加以下规则:
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```
   - 点击 `保存`

4. **检查文件权限**
   - 左侧菜单: `文件`
   - 进入 `/www/wwwroot/1568game.com`
   - 右键点击 `build` 目录 -> `权限`
   - 确保所有者是 `www`，权限是 `755`

5. **重启Nginx**
   - 左侧菜单: `软件商店`
   - 找到 `运行环境` -> `Nginx`
   - 点击 `设置` -> `重启`

### 方法2: 通过SSH命令行

1. **SSH连接到服务器**

2. **上传修复脚本并执行**:
   ```bash
   # 上传 quick_fix.sh 到服务器
   # 然后执行:
   chmod +x quick_fix.sh
   bash quick_fix.sh
   ```

3. **或者手动执行以下命令**:

```bash
# 1. 检查build目录是否存在
ls -la /www/wwwroot/1568game.com/build

# 2. 设置文件权限
chown -R www:www /www/wwwroot/1568game.com
chmod -R 755 /www/wwwroot/1568game.com/build

# 3. 备份Nginx配置
cp /www/server/panel/vhost/nginx/1568game.com.conf \
   /www/server/panel/vhost/nginx/1568game.com.conf.bak

# 4. 编辑Nginx配置
nano /www/server/panel/vhost/nginx/1568game.com.conf

# 5. 找到 root 这一行，修改为:
#    将: root /www/wwwroot/1568game.com;
#    改为: root /www/wwwroot/1568game.com/build;

# 6. 保存并退出 (Ctrl+O, Enter, Ctrl+X)

# 7. 测试Nginx配置
nginx -t

# 8. 如果测试通过，重启Nginx
systemctl restart nginx
# 或者
/etc/init.d/nginx restart
```

## 完整的Nginx配置示例

如果Nginx配置需要完全替换，可以使用项目中的 `fix_baota_nginx.conf` 文件。

将文件上传到服务器后:

```bash
# 备份旧配置
cp /www/server/panel/vhost/nginx/1568game.com.conf \
   /www/server/panel/vhost/nginx/1568game.com.conf.bak

# 使用新配置（请根据实际情况调整）
cp fix_baota_nginx.conf /www/server/panel/vhost/nginx/1568game.com.conf

# 测试配置
nginx -t

# 重启Nginx
systemctl restart nginx
```

## 验证修复

修复后，执行以下验证:

```bash
# 1. 检查文件是否存在
ls -la /www/wwwroot/1568game.com/build/index.html

# 2. 检查Nginx配置
cat /www/server/panel/vhost/nginx/1568game.com.conf | grep root

# 3. 测试本地访问
curl -I http://localhost

# 4. 查看错误日志
tail -20 /www/wwwlogs/1568game.com.error.log
```

然后在浏览器中访问: `http://1568game.com`

## 常见问题

### Q1: 仍然404错误
- 检查Nginx配置中的 `root` 路径是否正确
- 确认 `build` 目录中有 `index.html` 文件
- 查看Nginx错误日志: `tail -f /www/wwwlogs/1568game.com.error.log`

### Q2: 403 Forbidden错误
- 检查文件权限: `ls -la /www/wwwroot/1568game.com/build`
- 确保所有者是www: `chown -R www:www /www/wwwroot/1568game.com`

### Q3: CSS/JS文件404
- 确认 `build/assets/` 目录存在且可访问
- 检查Nginx配置中是否有 `/assets/` 的location规则

### Q4: 路由刷新后404（SPA问题）
- 确保添加了伪静态规则: `try_files $uri $uri/ /index.html;`

## 需要帮助？

如果问题仍未解决，请提供:
1. Nginx错误日志内容
2. 浏览器控制台的错误信息
3. Nginx配置文件内容





