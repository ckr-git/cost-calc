# 智筑造价 — 工程造价清单计价系统

桌面版清单计价软件，基于 Electron + React + SQLite。

## 功能

- **项目管理** — 树形工程结构，支持多专业（土建/装饰/安装/市政）
- **定额库** — 14 章节 83 条 mock 定额（安徽 2020 结构），按章节/关键词检索
- **清单编码库** — GB 50500 标准结构 43 条，支持搜索选用
- **清单计价** — 清单项录入 + 定额套用 + 工程量编辑 + 综合单价自动计算
- **费率引擎** — 措施费/规费/税金按取费基数和费率自动计算
- **造价汇总** — 七大项分解（分部分项→措施→其他→规费→税前→税金→造价）
- **单价文件** — 人材机市场价维护，价差自动计算
- **报表导出** — Excel 三 Sheet（造价汇总表 + 分部分项清单 + 定额组价明细）

## 技术栈

| 层面 | 选型 |
|------|------|
| 框架 | Electron 33 |
| 前端 | React 18 + TypeScript + Vite 6 |
| UI | Ant Design 5 |
| 状态 | Zustand |
| 数据库 | SQLite (better-sqlite3) |
| 报表 | ExcelJS |
| 打包 | electron-builder |

## 快速开始

```bash
# 安装依赖（自动 rebuild 原生模块）
npm install

# 开发模式（弹出窗口，支持热更新）
npm run dev

# 生产构建（仅编译，不打包）
npm run build

# 打包为 Windows 安装包
npm run dist
```

打包产物在 `release/` 目录：
- `win-unpacked/智筑造价.exe` — 免安装绿色版，双击直接用
- `智筑造价 Setup x.x.x.exe` — NSIS 安装包（带安装向导）

## 关于定额数据

当前系统内置的定额数据为 **mock 数据**（结构仿照安徽 2020 定额，数值为合理估算）。

如需替换为真实定额：
1. 编辑 `electron/database/seed/quota-civil.ts`（土建）
2. 编辑 `electron/database/seed/quota-decoration.ts`（装饰）
3. 编辑 `electron/database/seed/quota-install.ts`（安装）
4. 删除本地数据库文件（`%APPDATA%/cost-calc/cost-calc.db*`）
5. 重新启动应用，系统会自动重新 seed

费率规则同理，编辑 `electron/database/seed/fee-rates.ts`。

## 注意事项

- `.npmrc` 已配置淘宝镜像，国内网络可直接安装
- `postinstall` 会自动执行 `electron-rebuild`，确保 better-sqlite3 的 ABI 匹配 Electron
- 数据库文件位于 `%APPDATA%/cost-calc/cost-calc.db`，首次启动自动创建并 seed 系统数据
- 打包时若 winCodeSign 下载失败不影响绿色版使用
