# 管理后台登录账号信息

## 从SQL文件中找到的管理员账号

根据 `/www/wwwroot/1568game.com/xmdefi.sql` 文件，以下是可能的管理员账号：

### 账号列表

1. **admin** 
   - 用户名: `admin`
   - 密码哈希: `2d8d4e92c37a753b38fd0b9d43e5d3fb`
   - 角色ID: 1

2. **admin1**
   - 用户名: `admin1`
   - 密码哈希: `0fa9b2cdfc8fc29224dd491c57b3b3fd`
   - 角色ID: 1

3. **admin2**
   - 用户名: `admin2`
   - 密码哈希: `6e20b1394f05e1f9188ffff90147b4eb`
   - 角色ID: 1

4. **tong**
   - 用户名: `tong`
   - 密码哈希: `920649f6db8bc8f970112cf82f21dae6`
   - 角色ID: 1

5. **agent**
   - 用户名: `agent`
   - 密码哈希: `6e20b1394f05e1f9188ffff90147b4eb`
   - 角色ID: 1

6. **sugong**
   - 用户名: `sugong`
   - 密码哈希: `2d8d4e92c37a753b38fd0b9d43e5d3fb` (与admin相同)
   - 角色ID: 1

## 密码加密方式

根据代码 `/www/wwwroot/1568game.com/app/Users.php`，密码加密方式为：

```php
public static function MakePassword($password, $type = 0)
{
    if ($type == 0) {
        $salt = 'ABCDEFG';
        $passwordChars = str_split($password);
        foreach ($passwordChars as $char) {
            $salt .= md5($char);
        }
    }
}
```

## 常见默认密码

根据README.md中的提示 `#qkladmin`，可能的默认密码包括：

- `admin`
- `123456`
- `admin123`
- `qkladmin`
- `password`
- `12345678`

## 如何查找实际密码

### 方法1: 查询当前数据库
```bash
cd /www/wwwroot/1568game.com
php artisan tinker
# 然后执行:
App\Admin::select('username')->get();
```

### 方法2: 重置密码
如果需要重置密码，可以执行：
```php
$admin = App\Admin::where('username', 'admin')->first();
$admin->password = App\Users::MakePassword('新密码');
$admin->save();
```

### 方法3: 查看数据库
直接连接数据库查看：
```bash
mysql -h178.128.126.198 -ujiaoyisuo -pjiaoyisuo jiaoyisuo
SELECT id, username, role_id FROM admin;
```

## 建议

1. **尝试常见密码组合**：
   - 用户名: `admin` / 密码: `admin` 或 `123456`
   - 用户名: `admin1` / 密码: `admin1` 或 `123456`
   - 用户名: `admin2` / 密码: `admin2` 或 `123456`

2. **联系系统管理员**获取正确的登录凭据

3. **如果忘记密码**，可以通过数据库重置：
   ```php
   $admin = App\Admin::where('username', 'admin')->first();
   $admin->password = App\Users::MakePassword('新密码');
   $admin->save();
   ```

## 注意事项

- 密码是加密存储的，无法直接查看明文
- 如果账号启用了谷歌验证码（google字段不为空），还需要输入6位验证码
- 建议首次登录后立即修改密码





