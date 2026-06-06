# 智筑造价 — 工程造价清单计价系统

桌面版清单计价软件，基于 Electron + React + SQLite。

## 功能

- **项目管理** — 树形工程结构，支持多专业（土建/装饰/安装/市政）
- **定额库** — 14 章节 83 条 mock 定额（重庆 2018 结构），按章节/关键词检索
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

## 快速开始

```bash
# 安装依赖（自动 rebuild 原生模块）
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 打包安装包
npm run dist
```

## 注意事项

- `.npmrc` 已配置淘宝镜像，国内网络可直接安装
- `postinstall` 会自动执行 `electron-rebuild`，确保 better-sqlite3 的 ABI 匹配
- 数据库文件位于 `%APPDATA%/cost-calc/cost-calc.db`，首次启动自动创建并 seed 系统数据
