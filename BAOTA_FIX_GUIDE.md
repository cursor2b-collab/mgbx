# 宝塔网站访问问题修复指南

## 问题信息
- **域名**: 1568game.com
- **网站路径**: /www/wwwroot/1568game.com
- **项目类型**: Vite React项目
- **构建目录**: build/

## 常见问题及解决方案

### 问题1: Nginx配置路径错误

**症状**: 网站返回404或空白页

**解决方案**: 需要将Nginx的root路径指向build目录

#### 修复步骤（通过SSH执行）:

```bash
# 1. 检查当前Nginx配置
cat /www/server/panel/vhost/nginx/1568game.com.conf

# 2. 修改配置，将root指向build目录
# 原始可能是: root /www/wwwroot/1568game.com;
# 应该改为: root /www/wwwroot/1568game.com/build;

# 编辑配置文件
nano /www/server/panel/vhost/nginx/1568game.com.conf
```

#### 正确的Nginx配置示例:

```nginx
server {
    listen 80;
    server_name 1568game.com www.1568game.com;
    
    # 关键：root路径指向build目录
    root /www/wwwroot/1568game.com/build;
    index index.html index.htm;
    
    # 处理Vite构建的静态资源
    location /assets/ {
        try_files $uri =404;
    }
    
    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 禁用日志（可选）
    access_log off;
    error_log /www/wwwlogs/1568game.com.error.log;
}
```

### 问题2: 文件权限问题

**症状**: 403 Forbidden错误

**解决方案**: 设置正确的文件权限

```bash
# 设置网站目录权限
chown -R www:www /www/wwwroot/1568game.com
chmod -R 755 /www/wwwroot/1568game.com

# 确保build目录可读
chmod -R 755 /www/wwwroot/1568game.com/build
```

### 问题3: index.html不在正确位置

**症状**: 找不到index.html

**解决方案**: 检查文件位置

```bash
# 检查build目录是否存在index.html
ls -la /www/wwwroot/1568game.com/build/index.html

# 如果build目录中有文件，但Nginx指向错误，需要：
# 1. 将build目录内容移动到网站根目录，或
# 2. 修改Nginx配置指向build目录（推荐方法1）
```

### 问题4: 静态资源路径错误

**症状**: CSS/JS文件404

**解决方案**: 确保assets目录存在且可访问

```bash
# 检查assets目录
ls -la /www/wwwroot/1568game.com/build/assets/

# 如果Nginx root指向build，则路径应该是正确的
# /assets/index-xxx.js 会自动映射到 /www/wwwroot/1568game.com/build/assets/index-xxx.js
```

### 问题5: 服务未运行

**症状**: 连接被拒绝

**解决方案**: 重启Nginx服务

```bash
# 检查Nginx状态
systemctl status nginx

# 重启Nginx
systemctl restart nginx

# 或者使用宝塔命令
/etc/init.d/nginx restart
```

### 问题6: 防火墙阻止

**症状**: 无法从外部访问

**解决方案**: 开放端口

```bash
# 检查防火墙规则
firewall-cmd --list-ports

# 开放80和443端口
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# 或者在宝塔面板中：
# 安全 -> 防火墙 -> 添加端口规则 -> 80和443
```

## 快速修复脚本

如果可以通过SSH访问，运行以下命令：

```bash
# 1. 备份当前配置
cp /www/server/panel/vhost/nginx/1568game.com.conf /www/server/panel/vhost/nginx/1568game.com.conf.bak

# 2. 检查build目录是否存在
if [ ! -d "/www/wwwroot/1568game.com/build" ]; then
    echo "错误: build目录不存在！"
    echo "请先上传构建文件到服务器"
    exit 1
fi

# 3. 设置权限
chown -R www:www /www/wwwroot/1568game.com
chmod -R 755 /www/wwwroot/1568game.com/build

# 4. 检查并修改Nginx配置
# 需要手动编辑配置文件，将root路径改为: root /www/wwwroot/1568game.com/build;

# 5. 测试Nginx配置
nginx -t

# 6. 重启Nginx
systemctl restart nginx
```

## 通过宝塔面板修复

1. **登录宝塔面板**
   - 访问: http://你的服务器IP:8888

2. **检查网站设置**
   - 网站 -> 找到 1568game.com -> 设置
   - 查看网站目录路径
   - 确保指向: `/www/wwwroot/1568game.com/build` 或确认build目录中有文件

3. **修改运行目录**
   - 网站 -> 1568game.com -> 设置 -> 网站目录
   - 运行目录设置为: `build`

4. **检查伪静态规则**
   - 网站 -> 1568game.com -> 设置 -> 伪静态
   - 如果是SPA应用，添加:
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

5. **检查文件权限**
   - 文件 -> 找到网站目录 -> 权限
   - 确保所有者是www，权限是755

6. **重启服务**
   - 软件商店 -> 运行环境 -> Nginx -> 重启

## 验证步骤

修复后，验证以下内容：

```bash
# 1. 检查文件是否存在
ls -la /www/wwwroot/1568game.com/build/index.html

# 2. 检查Nginx配置
nginx -t

# 3. 检查Nginx错误日志
tail -f /www/wwwlogs/1568game.com.error.log

# 4. 测试本地访问
curl -I http://localhost

# 5. 测试域名访问
curl -I http://1568game.com
```

## 如果问题仍然存在

1. 检查Nginx错误日志: `/www/wwwlogs/1568game.com.error.log`
2. 检查网站访问日志: `/www/wwwlogs/1568game.com.log`
3. 检查DNS解析是否正确
4. 确认SSL证书配置（如果使用HTTPS）
5. 检查是否有CDN或代理服务器影响


