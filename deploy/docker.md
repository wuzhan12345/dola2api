# Docker Compose 部署

镜像在多阶段构建中编译前后端并运行 Go 单元测试，运行时不需要宿主机安装 Node 或 Go。应用使用非 root 用户，容器根目录只读，数据保存在 `dola2api_data` 卷中。

```bash
git clone https://github.com/wuzhan12345/dola2api.git
cd dola2api
cp .env.example .env
chmod 600 .env
# 编辑 .env，填写 DOLA2API_ADMIN_PASSWORD。
docker compose up -d --build
docker compose ps
```

默认管理台地址为 `http://服务器IP:8083`，用户名为 `admin`；API 基础地址为 `http://服务器IP:8083/v1`。登录后导入 Dola Cookie，再创建客户端密钥即可调用。首次启动后，管理员密码在后台修改，修改 `.env` 不会重置现有密码。

如使用 HTTPS 反向代理，将 `.env` 中 `DOLA2API_BIND_ADDRESS` 改为 `127.0.0.1`，代理目标为 `http://127.0.0.1:8083`。流式接口需关闭代理缓冲，并禁止代理 `/debug/` 路径；可参考同目录的 `nginx.conf`。

## 更新与日志

```bash
git pull --ff-only
docker compose up -d --build
docker compose logs --tail=100 -f app
```

建议在 `.env` 中将 `DOLA2API_IMAGE_TAG` 设置为部署的 Git 提交号，便于识别版本和回滚。更换镜像或重建容器会保留数据卷；不要使用 `docker compose down -v`，该命令会删除数据。

## 备份数据卷

备份包含账号 Cookie、客户端密钥和审计正文，文件应保密保存。为获得一致快照，先停应用，备份完成后重新启动。

```bash
docker compose stop app
docker run --rm -v dola2api_data:/data:ro -v "$PWD":/backup alpine:3.23 \
  sh -c 'umask 077; tar czf /backup/dola2api-data.tar.gz -C /data .'
docker compose start app
```
