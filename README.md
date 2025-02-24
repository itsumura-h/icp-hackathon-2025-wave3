# icp-hackathon-2025-wave3

## 環境構築
```sh
docker compose build
docker compose up -d
```

## プロジェクト作成
TypeScriptを使い、またDockerコンテナの中で起動するためローカルホストを0.0.0.0に設定する必要があるために、一度Vanilla JSのプロジェクトを作ってから、ViteでReactのプロジェクトを作って差し替える。


```sh
cd project
dfx new todo_app
> Motoko
> Vanilla JS
> ✓Internet Identity

cd todo_app
rm -fr .git
pnpm import package-lock.json
rm package-lock.json
touch pnpm-workspace.yaml
```

pnpm-workspace.yaml
```yaml
packages:
  - src/todo_app_frontend
```

Reactのプロジェクトを作成
```sh
pnpm create vite@latest
> todo_app_frontend
> React
> TypeScript + SWC
```

作成したReactのプロジェクトをsrc配下に移動する
```sh
rm -fr src/todo_app_frontend
mv ./todo_app_frontend ./src/todo_app_frontend
cd src/todo_app_frontend
pnpm install
```

フロントエンド内の設定を書き換える

todo_app/src/todo_app_frontend/package.json
```json
{
  "scripts": {
    "dev": "vite --mode develop --host 0.0.0.0 --port 3000",
    "build": "vite --mode production build",
    "preview": "vite preview --host 0.0.0.0 --port 3000"
  }
}
```

todo_app/src/todo_app_frontend/vite.config.ts
```ts
import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    EnvironmentPlugin("all", { prefix: "CANISTER_" }),
    EnvironmentPlugin("all", { prefix: "DFX_" }),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(
          new URL("../declarations", import.meta.url)
        ),
      },
    ],
    dedupe: ['@dfinity/agent'],
  },
});
```

プロジェクトルートの設定を書き換える

todo_app/package.json
```json
{
  "scripts": {
    "build": "pnpm --filter todo_app_frontend build",
    "prebuild": "pnpm --filter todo_app_frontend prebuild",
    "pretest": "pnpm --filter todo_app_frontend prebuild",
    "preview": "pnpm --filter todo_app_frontend preview",
    "test": "pnpm --filter todo_app_frontend test"
  },
  "type": "module",
  "workspaces": [
    "src/todo_app_frontend"
  ]
}
```

ローカルネットワークを起動
```sh
cd project/todo_app
# ローカルネットワークを起動
dfx stop && dfx start --host 0.0.0.0:4943 --clean --background
# .ネットワーク上でキャニスターを作る
dfx canister create --all
dfx build
dfx canister install --all
dfx generate
# ローカルにデプロイ
dfx deploy -y --network local
```

## playgroundにデプロイ
playgroundにはキャニスターのサイズ制限があるので、フロントエンドはデプロイできない？

エラー文
```sh
dfx deploy --playground

WARN: Canister 'internet_identity' has timed out.
WARN: Canister 'todo_app_frontend' has timed out.
Deploying all canisters.
Reserved canister 'internet_identity' with id omnp4-sqaaa-aaaab-qab7q-cai with the playground.
Reserved canister 'todo_app_frontend' with id 75i2c-tiaaa-aaaab-qacxa-cai with the playground.
Error: Failed while trying to deploy canisters.
Caused by: Failed while trying to install all canisters.
Caused by: Failed to install wasm module to canister 'internet_identity'.
Caused by: The replica returned a rejection error: reject code CanisterReject, reject message IC0504: Error from Canister ozk6r-tyaaa-aaaab-qab4a-cai: Canister violated contract: ic0.msg_reply_data_append: application payload size (3589297) cannot be larger than 2097152..
Consider checking the response size and returning an error if it is too long. See documentation: https://internetcomputer.org/docs/current/references/execution-errors#msg_reply_data_append-payload-too-large, error code Some("IC0406")
```

バックエンドだけを指定する
```sh
dfx deploy --playground todo_app_backend
```

```
Deploying: todo_app_backend
All canisters have already been created.
Installed code for canister todo_app_backend, with canister ID 54ro3-xaaaa-aaaab-qac2q-cai
Deployed canisters.
URLs:
  Frontend canister via browser:
    internet_identity: https://5jw7w-wiaaa-aaaab-qacza-cai.icp0.io/
    todo_app_frontend: https://xtnc2-uaaaa-aaaab-qadaq-cai.icp0.io/
  Backend canister via Candid interface:
    internet_identity: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=5jw7w-wiaaa-aaaab-qacza-cai
    todo_app_backend: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=54ro3-xaaaa-aaaab-qac2q-cai
```
