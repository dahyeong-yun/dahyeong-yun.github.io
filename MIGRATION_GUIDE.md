# Astro 블로그 이관 및 GitHub Actions 배포 마이그레이션 가이드

기존 Gatsby 기반 블로그(`dahyeong-yun.github.io`)를 Astro 기반 블로그(`polymorlog-blog`)로 대체하고, 로컬에서 사용하는 테마(`theme-astro`)와 연동하여 **GitHub Actions를 통해 `github.io`로 자동 배포**하기 위한 최종 마이그레이션 가이드입니다.

---

## 1. 개요 및 변경 사항 (Gatsby vs Astro 배포)

기존 Gatsby 환경에서는 주로 로컬 혹은 특정 스크립트를 빌드하여 별도의 `gh-pages` 브랜치로 정적 파일을 밀어 넣는 방식으로 배포해 왔습니다. 

Astro로 마이그레이션한 후에는 **GitHub Actions 기반 배포**를 적극 권장합니다.
- **기존 방식**: 로컬 빌드 -> `gh-pages` 브랜치 생성/푸시 -> GitHub Pages가 해당 브랜치 호스팅.
- **새로운 방식**: Astro 소스 코드를 `main` 브랜치에 푸시 -> GitHub Actions가 깃허브 클라우드 내에서 빌드 후 즉시 Pages로 배포.
- **새 방식의 장점**: `gh-pages` 정적 파일 전용 브랜치를 관리할 필요가 없어 Git 히스토리가 깨끗해지며, 코드 수정 시 `main` 브랜치 push 한 번으로 모든 빌드와 배포가 완료됩니다.

---

## 2. 세부 마이그레이션 절차

### 1단계: 테마(`theme-astro`) 리포지토리 GitHub 업로드
1. GitHub에서 새로운 저장소(예: `theme-astro`, Public 권장)를 생성합니다.
2. 로컬 [theme-astro](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro) 디렉토리에서 아래 명령어로 커밋 및 푸시합니다:
   ```bash
   cd /Users/dahyeung/Repositories/polymorph/publish/theme-astro
   # .gitignore에 .history/ 차단 추가
   echo -e "\n# Local History\n.history/" >> .gitignore
   git add .
   git commit -m "feat: init astro theme with latex support"
   git remote add origin https://github.com/dahyeong-yun/theme-astro.git
   git branch -M main
   git push -u origin main
   ```

### 2단계: 신규 블로그 코드에 원격 테마 연동 및 GitHub Actions 설정 추가
1. 로컬 [polymorlog-blog](file:///Users/dahyeung/Repositories/polymorph/publish/polymorlog-blog) 폴더의 의존성 및 설정을 업데이트합니다.
2. [package.json](file:///Users/dahyeung/Repositories/polymorph/publish/polymorlog-blog/package.json)의 의존성 주소를 수정합니다:
   ```json
   "dependencies": {
     ...
     "theme-astro": "github:dahyeong-yun/theme-astro",
     ...
   }
   ```
3. `.gitignore` 파일 최하단에 로컬 임시 파일 폴더를 등록합니다:
   ```gitignore
   # Local History
   .history/
   ```
4. GitHub Actions 배포 파일인 `.github/workflows/deploy.yml`을 신규 생성하고 아래 설정을 붙여넣습니다. (3절의 워크플로우 템플릿 참고)

### 3단계: 기존 `dahyeong-yun.github.io` 저장소로 소스 코드 이관
기존 저장소에 새 Astro 코드를 덮어씌웁니다. (Git 히스토리 및 원격 연결을 보존하기 위함)
1. 로컬 [dahyeong-yun.github.io](file:///Users/dahyeung/Repositories/polymorph/publish/dahyeong-yun.github.io) 폴더로 이동합니다.
2. 기존 Gatsby 관련 파일 및 콘텐츠를 **모두 삭제**합니다 (⚠️단, `.git` 폴더가 삭제되지 않도록 절대 주의).
3. [polymorlog-blog](file:///Users/dahyeung/Repositories/polymorph/publish/polymorlog-blog) 내부의 모든 파일(`.github`, `src`, `content`, `public`, `.gitignore`, 설정 파일 등 전체)을 [dahyeong-yun.github.io](file:///Users/dahyeung/Repositories/polymorph/publish/dahyeong-yun.github.io)로 복사해 넣습니다.
4. 아래 명령어로 커밋 및 푸시를 진행합니다.
   ```bash
   cd /Users/dahyeung/Repositories/polymorph/publish/dahyeong-yun.github.io
   npm install # package-lock.json 및 node_modules 업데이트
   git add .
   git commit -m "chore: migrate blog engine from Gatsby to Astro"
   git push origin main
   ```

### 4단계: GitHub Repository 페이지 설정 변경
GitHub Actions를 활성화하기 위해 깃허브 웹 저장소 설정 변경이 반드시 필요합니다.
1. GitHub의 **`dahyeong-yun.github.io`** 저장소 페이지로 이동합니다.
2. **`Settings`** -> **`Pages`** 탭을 클릭합니다.
3. **Build and deployment** 섹션 아래의 **Source** 설정을 기존 `Deploy from a branch`에서 **`GitHub Actions`**로 변경합니다.
4. 이제 `main` 브랜치에 푸시가 발생할 때마다 자동으로 GitHub Actions가 실행되며 배포가 완료됩니다.

---

## 3. GitHub Actions 워크플로우 설정 (`.github/workflows/deploy.yml`)

Astro 빌드 및 배포를 위한 공식 템플릿입니다. 이 설정 파일은 프로젝트 루트의 `.github/workflows/deploy.yml` 경로에 저장해야 합니다.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ] # 배포 대상 메인 브랜치 설정
  workflow_dispatch: # 수동 실행 허용

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

env:
  BUILD_PATH: "."

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Detect package manager
        id: detect-package-manager
        run: |
          if [ -f "${{ github.workspace }}/yarn.lock" ]; then
            echo "manager=yarn" >> $GITHUB_OUTPUT
            echo "command=install" >> $GITHUB_OUTPUT
            echo "runner=yarn" >> $GITHUB_OUTPUT
            exit 0
          elif [ -f "${{ github.workspace }}/package.json" ]; then
            echo "manager=npm" >> $GITHUB_OUTPUT
            echo "command=ci" >> $GITHUB_OUTPUT
            echo "runner=npx --no-install" >> $GITHUB_OUTPUT
            exit 0
          else
            echo "Unable to determine package manager"
            exit 0
          fi

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: ${{ steps.detect-package-manager.outputs.manager }}
          cache-dependency-path: "${{ env.BUILD_PATH }}/package-lock.json"

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Install dependencies
        run: ${{ steps.detect-package-manager.outputs.manager }} ${{ steps.detect-package-manager.outputs.command }}
        working-directory: ${{ env.BUILD_PATH }}

      - name: Build with Astro
        run: |
          ${{ steps.detect-package-manager.outputs.runner }} astro build \
            --site "${{ steps.pages.outputs.origin }}" \
            --base "${{ steps.pages.outputs.base_path }}"
        working-directory: ${{ env.BUILD_PATH }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ${{ env.BUILD_PATH }}/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
