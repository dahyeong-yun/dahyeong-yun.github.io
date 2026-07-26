# Astro 블로그 테마 분리 및 이관 작업 보고서 (2026-07-26)

이 보고서는 기존 Gatsby 블로그를 Astro 기반으로 이관하는 과정에서 진행된 **테마 저장소(`theme-astro`)와 콘텐츠 저장소(`polymorlog-blog`/`dahyeong-yun.github.io`)의 분리 독립 및 GitHub Actions 배포 연동 작업**에 대한 기술적 상세를 기록합니다.

---

## 1. 배경 및 목적
* **유지보수 효율화**: 블로그 엔진 및 UI 디자인 요소(`theme-astro`)와 실제 작성되는 마크다운 포스트 및 이미지 자원(`polymorlog-blog`)을 물리적으로 분리하여, 디자인 변경과 글 작성이 서로 영향을 주지 않도록 관리합니다.
* **의존성 모듈화**: 테마를 npm 패키지처럼 GitHub 원격 저장소 의존성으로 추가해, 여러 블로그 프로젝트에서 동일한 테마를 손쉽게 재사용할 수 있는 기반을 구축합니다.
* **자동 배포 파이프라인**: 로컬에서 수동 빌드하여 push 하던 구 Gatsby 방식에서 탈피해, `main` 브랜치에 코드를 푸시하면 GitHub 클라우드(GitHub Actions)에서 자동으로 빌드 및 Pages 배포가 처리되는 현대적 CI/CD 환경을 도입합니다.

---

## 2. 저장소 구조 및 연동 방식

### 2.1 분리된 저장소 구조
1. **테마 저장소 (`theme-astro`)**
   * **원격 URL**: `https://github.com/dahyeong-yun/theme-astro.git`
   * **역할**: 전역 CSS 스타일, 레이아웃(`BlogPost.astro`), 공통 컴포넌트(`Header`, `Footer`), 공용 페이지 템플릿(메인, 블로그 목록, 소개, RSS 피드) 정의.
2. **콘텐츠 저장소 (`dahyeong-yun.github.io`)**
   * **원격 URL**: `git@github.com:dahyeong-yun/dahyeong-yun.github.io.git`
   * **역할**: 실제 마크다운 포스트 데이터(`content/posts/`), 미디어 자원, 블로그 고유 설정 파일(`blog.config.ts`, `astro.config.mjs`), 배포용 워크플로우 설정.

### 2.2 테마 연동 설계 (`injectRoute` 및 가상 모듈)
테마 저장소(`theme-astro`)는 Astro Integration API를 활용해 블로그 본체 저장소에 결합됩니다.

* **동적 라우팅 주입 (`injectRoute`)**:
  테마의 `src/index.ts` 파일에서 `astro:config:setup` 훅을 사용해 메인 `/`, 블로그 목록 `/blog`, 포스트 상세 `/blog/[...slug]`, `/about`, `/rss.xml` 주소를 주입합니다. 이를 통해 콘텐츠 저장소의 `src/pages/` 디렉토리를 비워두고도 정상적으로 페이지 라우팅이 처리됩니다.
* **가상 모듈 (`virtual:blog-config`)**:
  콘텐츠 저장소의 `blog.config.ts` 설정 파일을 빌드 시점에 Vite 가상 모듈 플러그인을 사용하여 `virtual:blog-config`로 등록합니다. 테마 내부 컴포넌트(`BaseHead.astro`, `Footer.astro` 등)들은 물리적 경로에 구애받지 않고 이 가상 모듈을 통해 설정을 가져와 렌더링에 반영합니다.

---

## 3. 핵심 마이그레이션 및 연동 상세

### 3.1 의존성 구성 (`package.json`)
콘텐츠 저장소의 `package.json`에서 로컬 경로가 아닌 GitHub 저장소 주소를 직접 바라보도록 설정했습니다.
```json
"dependencies": {
  "@astrojs/markdown-remark": "^7.2.1",
  "astro": "^7.1.1",
  "rehype-katex": "^7.0.1",
  "remark-math": "^6.0.0",
  "theme-astro": "github:dahyeong-yun/theme-astro"
}
```

### 3.2 수식 파싱 환경 동기화
* **이유**: Astro 5+/7+의 Content Layer 아키텍처는 개발 서버 구동 시 `astro.config.mjs`의 `markdown` 설정을 먼저 참조하므로, Integration 내 동적 주입뿐만 아니라 본체 저장소 설정 파일에도 동일한 플러그인을 명시해야 수식 깨짐 현상(HMR 에러)을 완벽하게 방지할 수 있습니다.
* **설정 파일 (`astro.config.mjs`)**:
  ```javascript
  import { defineConfig } from 'astro/config'
  import remarkMath from 'remark-math'
  import rehypeKatex from 'rehype-katex'
  import { blogTheme } from 'theme-astro'
  import config from './blog.config'

  export default defineConfig({
    markdown: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    },
    integrations: [blogTheme(config)],
  })
  ```

### 3.3 GitHub Actions 워크플로우 (`.github/workflows/deploy.yml`)
* `main` 브랜치로 푸시되면, GitHub Pages 배포용 아티팩트를 자동으로 생성하는 표준 Actions 설정입니다.
* 패키지 매니저(npm/yarn) 자동 감지 로직과 Node 22 빌드 캐시가 내장되어 있어 안정적이고 신속한 배포가 수행됩니다.
* 배포 환경을 설정하기 위해 GitHub 리포지토리의 `Settings -> Pages -> Build and deployment -> Source` 설정을 `GitHub Actions`로 수정해 주어야 작동합니다.

---

## 4. 로컬 테마 작업 가이드 (Working Agreements)
테마가 깃허브 원격 주소로 설정되어 있기 때문에, 로컬 개발 중에 테마를 수정하고 확인하는 과정이 번거로울 수 있습니다. 이를 효율화하기 위해 아래와 같이 작업 흐름을 설정했습니다.

1. **로컬 테마 변경 검증 시**:
   * 본체 저장소(`dahyeong-yun.github.io`)에서 테마 경로를 로컬로 임시 연결합니다:
     ```bash
     npm install ../theme-astro
     ```
   * 로컬에서 `npm run dev`를 구동해 실시간 수정사항을 테스트하고 커스터마이징을 수행합니다.
2. **원격 저장소 반영 시**:
   * 테마 수정이 끝나면 `theme-astro` 저장소에서 변경 사항을 커밋/푸시합니다.
     ```bash
     git add . && git commit -m "feat: customize footer" && git push origin main
     ```
   * 본체 저장소(`dahyeong-yun.github.io`)에서 다시 원격 패키지로 복구하고 lock 파일을 갱신합니다:
     ```bash
     npm install github:dahyeong-yun/theme-astro
     ```
   * 본체 코드를 푸시하면 GitHub Actions에 의해 수정된 테마가 실서버에 반영됩니다.
