# #1 로컬 개발 환경 검증 및 서버 상태 점검

이 문서는 Astro 마이그레이션 적용 후 로컬에서의 구동 정상 여부 및 마크다운/LaTeX 렌더링에 대한 계획과 실행 내역입니다.

---

## 1. 계획 (Plan)
1. **의존성 설치**: `dahyeong-yun.github.io` 디렉토리 내 패키지 잠금 파일(`package-lock.json`)을 기반으로 의존성을 정상 구성합니다.
2. **개발 서버 구동**: `npm run dev` 스크립트를 사용하여 로컬 Astro 서버를 실행하고 할당되는 포트를 식별합니다.
3. **경로 및 렌더링 검증**:
   * 메인 페이지(`/`)가 Gatsby 스타일에서 Astro 빌드 결과물로 정상 교체되었는지 확인합니다.
   * 기존 마이그레이션된 포스트 중 LaTeX 수식이 포함된 글(`/blog/why-time-complexity-function-start-o`)을 호출해 수식 파서(`remark-math` 및 `rehype-katex`)와 KaTeX CSS가 정상 적용되는지 확인합니다.

---

## 2. 실행 (Execution)
1. **npm 패키지 설치**:
   ```bash
   node -v # v22.19.0 확인
   npm install
   ```
   * 결과: `up to date, audited 348 packages`로 의존성 정합 확인 완료.
2. **개발 서버 실행**:
   ```bash
   npm run dev
   ```
   * 결과: `http://localhost:4322` 포트로 Astro v7.1.1 서버가 백그라운드 구동 시작.
3. **URL 호출 및 마크다운 분석**:
   * `http://localhost:4322/` 메인 페이지 호출 확인.
   * `http://localhost:4322/blog/why-time-complexity-function-start-o` 상세 페이지 호출 후 HTML 분석:
     ```html
     <span class="katex"><span class="katex-mathml"><math ...>
     ```
     * 결과: $\Omega$ 및 $\Omega(1)$ 수식이 단순 텍스트가 아닌 KaTeX 표준 MathML/HTML 구조로 정상 변환되어 출력됨을 검증했습니다.
