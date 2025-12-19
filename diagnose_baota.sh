#!/bin/bash
# 宝塔网站访问问题诊断脚本
# 网站路径: /www/wwwroot/1568game.com
# 域名: 1568game.com

echo "=== 宝塔网站诊断开始 ==="
echo "域名: 1568game.com"
echo "网站路径: /www/wwwroot/1568game.com"
echo ""

# 1. 检查网站目录是否存在
echo "1. 检查网站目录..."
if [ -d "/www/wwwroot/1568game.com" ]; then
    echo "✓ 网站目录存在"
    ls -la /www/wwwroot/1568game.com | head -20
else
    echo "✗ 网站目录不存在！"
    exit 1
fi
echo ""

# 2. 检查文件权限
echo "2. 检查文件权限..."
ls -la /www/wwwroot/1568game.com | grep -E "^d|^-" | head -5
echo ""

# 3. 检查index.html是否存在
echo "3. 检查index.html..."
if [ -f "/www/wwwroot/1568game.com/index.html" ]; then
    echo "✓ index.html存在"
    head -20 /www/wwwroot/1568game.com/index.html
else
    echo "✗ index.html不存在！"
    echo "查找HTML文件..."
    find /www/wwwroot/1568game.com -name "*.html" -type f | head -5
fi
echo ""

# 4. 检查Nginx配置
echo "4. 检查Nginx配置..."
if [ -f "/www/server/panel/vhost/nginx/1568game.com.conf" ]; then
    echo "✓ Nginx配置文件存在"
    cat /www/server/panel/vhost/nginx/1568game.com.conf
else
    echo "✗ Nginx配置文件不存在！"
    echo "查找相关配置文件..."
    find /www/server/panel/vhost/nginx -name "*1568game*" 2>/dev/null
fi
echo ""

# 5. 检查Apache配置（如果使用）
echo "5. 检查Apache配置..."
if [ -f "/www/server/panel/vhost/apache/1568game.com.conf" ]; then
    echo "✓ Apache配置文件存在"
    cat /www/server/panel/vhost/apache/1568game.com.conf
else
    echo "Apache配置文件不存在（可能使用Nginx）"
fi
echo ""

# 6. 检查网站服务状态
echo "6. 检查服务状态..."
systemctl status nginx 2>/dev/null | head -5 || echo "Nginx服务未运行或不存在"
systemctl status httpd 2>/dev/null | head -5 || echo "Apache服务未运行或不存在"
echo ""

# 7. 检查端口监听
echo "7. 检查端口监听..."
netstat -tlnp | grep -E ":80|:443" || ss -tlnp | grep -E ":80|:443"
echo ""

# 8. 检查防火墙状态
echo "8. 检查防火墙状态..."
firewall-cmd --list-ports 2>/dev/null || ufw status 2>/dev/null || iptables -L -n | grep -E "80|443" | head -5
echo ""

# 9. 测试本地访问
echo "9. 测试本地访问..."
curl -I http://localhost 2>/dev/null | head -5 || echo "本地访问测试失败"
echo ""

# 10. 检查构建文件
echo "10. 检查构建文件..."
if [ -d "/www/wwwroot/1568game.com/build" ]; then
    echo "✓ build目录存在"
    ls -la /www/wwwroot/1568game.com/build | head -10
    if [ -f "/www/wwwroot/1568game.com/build/index.html" ]; then
        echo "✓ build/index.html存在"
    fi
else
    echo "✗ build目录不存在"
fi
echo ""

echo "=== 诊断完成 ==="
echo ""
echo "常见问题修复建议："
echo "1. 如果index.html在build目录，需要配置Nginx指向build目录"
echo "2. 检查文件权限，确保www用户可读"
echo "3. 检查Nginx配置中的root路径是否正确"
echo "4. 确保Nginx/Apache服务正在运行"
echo "5. 检查防火墙是否开放80和443端口"





