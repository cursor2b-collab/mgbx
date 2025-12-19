# 上传构建文件到服务器的步骤

## 当前状态
✅ Nginx配置已更新
✅ 目录已创建: `/www/wwwroot/1568game.com/react-build`
✅ 伪静态已配置为SPA支持
✅ 测试文件已创建

## 需要上传的文件

将本地项目的 `build` 目录中的所有文件上传到服务器的 `/www/wwwroot/1568game.com/react-build/` 目录。

## 上传方法

### 方法1: 使用宝塔面板文件管理器（推荐）

1. **登录宝塔面板**
   - 访问: `http://你的服务器IP:8888`

2. **打开文件管理器**
   - 左侧菜单: `文件`
   - 进入: `/www/wwwroot/1568game.com/react-build/`

3. **删除测试文件**
   - 删除 `index.html` 测试文件

4. **上传build目录内容**
   - 点击 `上传` 按钮
   - 选择本地 `build` 目录中的所有文件:
     - `index.html`
     - `assets/` 目录（包含所有JS和CSS文件）
   - 等待上传完成

### 方法2: 使用FTP/SFTP

使用FileZilla、WinSCP等工具连接服务器，将本地 `build` 目录的内容上传到:
```
/www/wwwroot/1568game.com/react-build/
```

### 方法3: 使用SCP命令（命令行）

在本地项目目录执行:

```bash
# Windows PowerShell
scp -r "C:\Users\alex\Desktop\Exchange Login Registration Page (1)\build\*" root@你的服务器IP:/www/wwwroot/1568game.com/react-build/

# 或使用rsync（如果服务器支持）
rsync -avz "C:\Users\alex\Desktop\Exchange Login Registration Page (1)\build\" root@你的服务器IP:/www/wwwroot/1568game.com/react-build/
```

### 方法4: 压缩后上传（适合大文件）

1. **本地压缩**
   ```bash
   cd "C:\Users\alex\Desktop\Exchange Login Registration Page (1)\build"
   tar -czf build.tar.gz *
   # 或使用zip
   # zip -r build.zip *
   ```

2. **上传压缩包**
   - 通过宝塔面板或FTP上传到服务器的 `/www/wwwroot/1568game.com/react-build/` 目录

3. **在服务器上解压**
   ```bash
   cd /www/wwwroot/1568game.com/react-build
   tar -xzf build.tar.gz
   rm build.tar.gz
   chown -R www:www .
   ```

## 上传后的验证步骤

1. **检查文件是否上传成功**
   ```bash
   ls -la /www/wwwroot/1568game.com/react-build/
   # 应该看到 index.html 和 assets 目录
   ```

2. **检查文件权限**
   ```bash
   chown -R www:www /www/wwwroot/1568game.com/react-build
   chmod -R 755 /www/wwwroot/1568game.com/react-build
   ```

3. **访问网站**
   - 在浏览器中访问: `https://1568game.com` 或 `http://1568game.com`
   - 应该能看到React应用正常运行

## 文件结构

上传后的目录结构应该是:
```
/www/wwwroot/1568game.com/react-build/
├── index.html
└── assets/
    ├── index-xxxxx.js
    └── index-xxxxx.css
```

## 注意事项

1. **确保上传所有文件**：特别是 `assets` 目录下的JS和CSS文件
2. **检查文件权限**：确保文件所有者是 `www`，权限是 `755`
3. **如果网站仍无法访问**：
   - 检查Nginx错误日志: `/www/wwwlogs/1568game.com.error.log`
   - 检查浏览器控制台的错误信息
   - 确认所有静态资源路径正确

## 完成！

上传完成后，你的React应用应该可以通过 `1568game.com` 正常访问了！





