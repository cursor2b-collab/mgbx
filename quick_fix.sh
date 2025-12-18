#!/bin/bash
# 快速修复脚本 - 在宝塔服务器上执行
# 使用方法: bash quick_fix.sh

SITE_PATH="/www/wwwroot/1568game.com"
BUILD_PATH="$SITE_PATH/build"
NGINX_CONF="/www/server/panel/vhost/nginx/1568game.com.conf"
DOMAIN="1568game.com"

echo "========================================="
echo "宝塔网站快速修复脚本"
echo "域名: $DOMAIN"
echo "路径: $SITE_PATH"
echo "========================================="
echo ""

# 1. 检查build目录
echo "[1/6] 检查build目录..."
if [ -d "$BUILD_PATH" ]; then
    echo "✓ build目录存在"
    echo "  文件列表:"
    ls -lh $BUILD_PATH | head -10
else
    echo "✗ build目录不存在！"
    echo "  请确认构建文件已上传到: $BUILD_PATH"
    exit 1
fi
echo ""

# 2. 检查index.html
echo "[2/6] 检查index.html..."
if [ -f "$BUILD_PATH/index.html" ]; then
    echo "✓ index.html存在"
else
    echo "✗ index.html不存在！"
    exit 1
fi
echo ""

# 3. 设置文件权限
echo "[3/6] 设置文件权限..."
chown -R www:www $SITE_PATH
chmod -R 755 $BUILD_PATH
echo "✓ 权限已设置"
echo ""

# 4. 备份现有Nginx配置
echo "[4/6] 备份Nginx配置..."
if [ -f "$NGINX_CONF" ]; then
    cp $NGINX_CONF ${NGINX_CONF}.bak.$(date +%Y%m%d_%H%M%S)
    echo "✓ 配置已备份"
else
    echo "⚠ Nginx配置文件不存在，将创建新配置"
fi
echo ""

# 5. 更新Nginx配置
echo "[5/6] 更新Nginx配置..."
# 检查配置中是否已正确设置root路径
if grep -q "root.*build" $NGINX_CONF 2>/dev/null; then
    echo "✓ Nginx配置中的root路径已指向build目录"
else
    echo "⚠ 需要更新Nginx配置，将root路径改为: $BUILD_PATH"
    echo ""
    echo "请手动编辑配置文件: $NGINX_CONF"
    echo "将 root 行修改为: root $BUILD_PATH;"
    echo ""
    echo "或者运行以下命令（请先检查配置内容）:"
    echo "sed -i 's|root.*1568game.com[^;]*;|root $BUILD_PATH;|g' $NGINX_CONF"
    echo ""
    read -p "是否自动修改配置? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # 备份后再修改
        cp $NGINX_CONF ${NGINX_CONF}.bak
        # 替换root路径
        sed -i "s|root[[:space:]]*\(/www/wwwroot/1568game.com\)[^;]*;|root $BUILD_PATH;|g" $NGINX_CONF
        echo "✓ 配置已自动更新"
    else
        echo "⚠ 请手动修改配置后继续"
    fi
fi
echo ""

# 6. 测试并重启Nginx
echo "[6/6] 测试Nginx配置..."
if nginx -t 2>&1 | grep -q "successful"; then
    echo "✓ Nginx配置测试通过"
    echo ""
    echo "重启Nginx..."
    systemctl restart nginx 2>/dev/null || /etc/init.d/nginx restart
    if [ $? -eq 0 ]; then
        echo "✓ Nginx已重启"
    else
        echo "✗ Nginx重启失败，请手动重启"
    fi
else
    echo "✗ Nginx配置测试失败，请检查配置"
    nginx -t
    exit 1
fi
echo ""

echo "========================================="
echo "修复完成！"
echo "========================================="
echo ""
echo "验证步骤:"
echo "1. 访问: http://$DOMAIN"
echo "2. 检查Nginx错误日志: tail -f /www/wwwlogs/${DOMAIN}.error.log"
echo "3. 如果仍有问题，检查:"
echo "   - 防火墙是否开放80/443端口"
echo "   - DNS解析是否正确"
echo "   - SSL证书配置（如果使用HTTPS）"
echo ""


