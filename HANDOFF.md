# Session Handoff

## 1. Summary
- 기존 Gatsby 블로그의 모든 MDX/마크다운 포스트 및 이미지 자원을 `polymorlog-blog`로 성공적으로 이관하고, Gatsby `slug` 프론트매터 및 URL 구조와의 완전한 하위 호환성을 확보했습니다.
- `theme-astro` 및 `polymorlog-blog` 저장소 수준에서 LaTeX 수식(`remark-math` + `rehype-katex` + KaTeX CSS) 파싱 환경을 구축하여, 정적 빌드(`npm run build`)와 개발 서버(`npm run dev`) 환경 모두에서 수식(`$\Omega(1)$` 등)이 KaTeX 스타일로 깔끔하게 렌더링되도록 처리했습니다.

## 2. Key Decisions
- **Gatsby URL Slug 하위 호환성**: Frontmatter의 `slug` 값이 존재할 경우 이를 최우선으로 라우트에 반영하도록 [`theme-astro/src/pages/blog/[...slug].astro`](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/pages/blog/[...slug].astro)를 구현하여 기존 SEO 인덱스 주소가 100% 유지되도록 함.
- **LaTeX 수식 지원 체계 구축**:
  - [`theme-astro/src/index.ts`](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/index.ts) 내 integration 설정에 `remark-math` 및 `rehype-katex` 플러그인을 바인딩함.
  - [`theme-astro/src/theme/styles/global.css`](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/theme/styles/global.css) 최상단에 `@import 'katex/dist/katex.min.css';`를 추가하여 블로그 서비스 측의 별도 CSS import 부담 제거.
  - [`polymorlog-blog/astro.config.mjs`](file:///Users/dahyeung/Repositories/polymorph/publish/polymorlog-blog/astro.config.mjs)에 `markdown` 옵션을 명시하여 Dev 서버(Vite HMR)와 Static Build 간 수식 파싱 동작을 100% 동기화.

## 3. Traps to Avoid
- **Astro Dev 서버 Content Layer HMR 특성**: Astro 5+/7+의 Content Layer(`astro:content` loader)는 `astro dev` 시점에 `astro.config.mjs`의 `markdown` 속성을 최우선으로 참조합니다. Integration 내 `updateConfig` 동적 주입만으로는 개발 서버 렌더링 시 수식이 원문 텍스트로 보일 수 있으므로, [`polymorlog-blog/astro.config.mjs`](file:///Users/dahyeung/Repositories/polymorph/publish/polymorlog-blog/astro.config.mjs)에도 `markdown` 플러그인 설정을 유지해야 합니다.
- **MDX 내 수식 문법 괄호 표기**: `$\Omega$(1)`처럼 닫는 `$` 표기 범위에서 괄호가 벗어나면 수식 범위로 묶이지 않을 수 있으므로, 괄호까지 수식 안에 기재된 **`$\Omega(1)$`** 형태를 사용해야 올바르게 렌더링됩니다.
- **MDX 중괄호 평가 주의**: MDX는 `{}`를 JSX JavaScript 표현식으로 해석하므로, `remark-math`가 먼저 수식을 AST 노드로 변환하도록 파이프라인이 정상 작동해야 runtime `ReferenceError`가 발생하지 않습니다.

## 4. Working Agreements
- 블로그 서비스 레포지토리(`polymorlog-blog`)는 `astro.config.mjs`에 테마 통합(`blogTheme(config)`)과 필요 시 기본 마크다운 플러그인을 명시하는 명확한 통합 규칙을 유지합니다.
- 로컬 변경 사항은 의미 단위별로 검증 후 로컬 커밋을 수행합니다.

## 5. Relevant Files
- [`polymorlog-blog/astro.config.mjs:L1-L15`](file:///Users/dahyeung/Repositories/polymorph/publish/polymorlog-blog/astro.config.mjs#L1-L15) — Dev 서버 수식 파싱과 테마 주입을 동기화하는 Astro 설정 파일
- [`theme-astro/src/index.ts:L40-L65`](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/index.ts#L40-L65) — 테마 Integration 엔트리포인트 (`mdx`, `remarkMath`, `rehypeKatex`, 가상 모듈 주입)
- [`theme-astro/src/pages/blog/[...slug].astro:L5-L16`](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/pages/blog/[...slug].astro#L5-L16) — Gatsby frontmatter `slug` 우선 인식 및 `/index` 경로 정리 정적 경로 생성기
- [`theme-astro/src/theme/styles/global.css:L1-L5`](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/theme/styles/global.css#L1-L5) — KaTeX CSS `@import` 및 테마 전역 디자인 토큰
- [`theme-astro/src/theme/schemas/post.ts:L4-L12`](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/theme/schemas/post.ts#L4-L12) — `slug` 필드가 추가된 포스트 Zod 스키마

## 6. Open Work
- 수식 지원 관련 최신 수정본이 로컬 Git 저장소에 아직 커밋되지 않은 상태입니다 (Untracked 및 Modified 파일 존재).
- 두 저장소(`theme-astro`, `polymorlog-blog`)의 원격 리포지토리(GitHub Remote) 연결 및 푸시 작업이 남아있습니다.

## 7. Prompt for New Chat
```text
Astro 기반 블로그 테마 분리 및 이관 프로젝트를 이어서 진행해 주세요.
프로젝트는 `/Users/dahyeung/Repositories/polymorph/publish/theme-astro` (테마 레포지토리)와 `/Users/dahyeung/Repositories/polymorph/publish/polymorlog-blog` (블로그 컨텐츠 레포지토리) 두 군데로 분할되어 있습니다.
이전 세션에서는 Gatsby 포스트 및 미디어 이관, Gatsby URL Slug 호환성 구현, 그리고 테마/블로그 수준의 LaTeX 수식(`remark-math` + `rehype-katex`) 파싱 연동 및 Dev/Build 환경 동기화를 완료했습니다.

아래 나열된 주요 코드와 설정 파일을 실제로 Read 도구로 모두 읽어 보십시오.
제공된 인수인계 요약본의 내용만 믿지 말고, 파일들의 소스 코드를 읽어 이 문서에서 주장하는 라우팅 구조와 LaTeX 수식 파싱 설정이 코드 수준에서 어떻게 실제로 동작하고 있는지 직접 대조하여 검증하십시오.
검증이 끝나면 다음 작업을 시작하기 전에 저의 명확한 지시를 대기해 주십시오.

[검증 대상 파일 경로]
- /Users/dahyeung/Repositories/polymorph/publish/polymorlog-blog/astro.config.mjs
- /Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/index.ts
- /Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/pages/blog/[...slug].astro
- /Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/theme/styles/global.css
- /Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/theme/schemas/post.ts
```
