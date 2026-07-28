# #11 시리즈(Series) 타입 문서 지원 및 아카이브 페이지 구축

이 문서는 포스트들을 연재물 주제별로 묶어 제공하는 시리즈 기능의 데이터 스키마 정의, 포스트 상세 화면 내 시리즈 목차 컴포넌트(`SeriesBox.astro`) 개발, 그리고 테마 수준에서의 전체 시리즈 목록 및 시리즈별 포스트 목록 페이지를 구축하기 위한 작업 계획과 실행 내역입니다.

---

## 1. 계획 (Plan)

1. **데이터 스키마 확장**:
   * [post.ts](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/theme/schemas/post.ts) 및 [content.config.ts](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/content.config.ts)에 `series` (string, optional) 및 `seriesOrder` (number, optional) 필드를 확장 정의합니다.
2. **시리즈 목차 컴포넌트 개발**:
   * `theme-astro/src/theme/components/SeriesBox.astro` 컴포넌트를 작성합니다.
   * 동일한 시리즈의 글 목록을 추출하고, 현재 글 위치를 하이라이트(링크 제거)하며, 직전/직후 연재 글로 넘어가는 이전/다음 포스트 퀵 링크를 제공하도록 UI/UX를 개발합니다.
3. **포스트 레이아웃 연동**:
   * [BlogPost.astro](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/theme/layouts/BlogPost.astro) 레이아웃에 `SeriesBox.astro`를 임포트하여, 포스트 프런트매터에 `series` 정보가 선언되었을 때 본문 시작 전(또는 끝난 후)에 동적으로 주입되도록 결합합니다.
4. **시리즈 아카이브 페이지 구현 및 라우트 주입**:
   * [index.ts](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/index.ts)의 통합 훅에 `/series` (전체 시리즈 목록) 및 `/series/[slug]` (시리즈별 포스트 목록) 경로를 추가 인젝션(injectRoute)합니다.
   * 이에 대응하는 `theme-astro/src/pages/series/index.astro` 및 `theme-astro/src/pages/series/[slug].astro` 페이지 컴포넌트를 신규 작성합니다.
5. **로컬 연동 검증 및 배포**:
   * 본체 블로그 저장소에 테스트용 시리즈 포스트들을 생성하여 로컬 개발 환경에서 TOC 스크롤과 시리즈 박스가 깨짐 없이 렌더링되는지 검사합니다.
   * 수정 사항을 테마 원격 및 본체 락 파일에 배포 동기화합니다.

---

## 2. 실행 (Execution)

1. **데이터 스키마 확장 완료**:
   * [post.ts](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/theme/schemas/post.ts) 및 [content.config.ts](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/content.config.ts)에 `series` 및 `seriesOrder` 필드를 추가했습니다.
2. **시리즈 목차 컴포넌트 개발 완료**:
   * [SeriesBox.astro](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/theme/components/SeriesBox.astro) 컴포넌트를 설계에 맞춰 개발했습니다. 현재 포스트의 번호와 상태를 강조(지금 읽는 중 뱃지 제공)하고, 이전/다음 포스트로의 빠른 이동을 지원합니다.
3. **레이아웃 연동 및 라우트 주입 완료**:
   * [BlogPost.astro](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/theme/layouts/BlogPost.astro) 및 [...slug.astro](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/pages/blog/[...slug].astro)에 `SeriesBox`를 임포트하여 연동 완료했습니다.
   * [index.ts](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/index.ts)에 `/series` 및 `/series/[slug]` 라우트를 주입하고, 전체 시리즈 리스트 [index.astro](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/pages/series/index.astro) 및 시리즈별 상세 페이지 [[slug].astro](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/pages/series/[slug].astro) 작성을 마쳤습니다.
4. **로컬 교차 빌드 검증 완료**:
   * `guletto` 카테고리 내 3개 포스트에 `"글또 회고"` 시리즈 Frontmatter를 테스트 설정하여 `npm run build`를 실행했습니다.
   * 빌드된 파일(`dist/series/...`, `dist/blog/...`)에서 시리즈 리스트 및 하이라이팅이 정확하게 매핑 및 렌더링됨을 검증했습니다.
