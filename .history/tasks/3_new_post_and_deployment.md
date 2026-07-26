# #3 신규 포스트 작성 및 GitHub Actions 배포 테스트

이 문서는 신규 블로그 글을 배포함으로써 최종적으로 전체 GitHub Actions 자동 빌드 및 배포 파이프라인의 연동 성공을 검증하기 위한 작업 일지입니다.

---

## 1. 계획 (Plan)
1. **테스트 포스트 파일 생성**: `content/posts/retrospective/hello-astro-migration/index.mdx` 경로에 테스트용 포스트를 작성합니다. 수식 파싱 확인을 위해 LaTeX 구문(`$$ E = mc^2 $$`)을 함께 포함시킵니다.
2. **로컬 빌드 점검**: 로컬 개발 서버를 리스타트하여 새로 생성한 포스트의 URL 라우트(/blog/hello-astro-migration)가 올바르게 맵핑 및 렌더링되는지 확인합니다.
3. **코드 푸시 및 배포 트리거**: 변경 내용 및 `package-lock.json` 수정분을 메인 브랜치로 푸시하여 GitHub Actions가 작동되도록 유도합니다.
4. **실서버 운영 상태 점검**: 배포가 종료되면 실제 웹사이트 주소로 curl 요청을 보내 새로 배포한 페이지가 정상 서비스되고 있는지 최종 검증합니다.

---

## 2. 실행 (Execution)
1. **포스트 작성**:
   `content/posts/retrospective/hello-astro-migration/index.mdx` 파일을 아래 내용으로 새로이 작성하였습니다:
   ```markdown
   ---
   type: "post"
   date: 2026-07-26
   title: "Astro 블로그 이관 및 자동 배포 테스트"
   slug: "/hello-astro-migration"
   tags: ['Astro', 'GitHub Actions', '회고']
   ---
   ... (중략) ...
   $$ E = mc^2 $$
   ```
2. **로컬 서버 재기동 및 확인**:
   ```bash
   npx astro dev stop
   npm run dev
   curl -I http://localhost:4322/blog/hello-astro-migration
   ```
   * 결과: 로컬 포트에서 200 OK 응답 수신 및 KaTeX에 의한 display-mode 수식의 변환(MathML/HTML 클래스 삽입)을 성공적으로 검토했습니다.
3. **깃허브 배포 트리거**:
   ```bash
   git add .
   git commit -m "feat: add test post for astro migration and update theme-astro package-lock"
   git push origin main
   ```
4. **GitHub Actions 실행 과정 모니터링**:
   ```bash
   gh run list
   # queued -> in_progress -> success 단계 추적
   gh run view 30183892981
   ```
   * 결과: Build 작업(24초), Deploy 작업(9초)이 에러 없이 모두 `Success` 완료되었습니다.
5. **실서버 서비스 검증**:
   * 최종 배포된 URL 주소 `https://dahyeong-yun.github.io/blog/hello-astro-migration/` 로 curl 호출을 보냈습니다.
   * 결과: HTTP/2 200 OK 확인 및 신규 포스트 본문 내 수식 코드, 동적 푸터(`@polymorph1216`)가 정상 반영되어 노출되는 것을 최종 확인했습니다.
