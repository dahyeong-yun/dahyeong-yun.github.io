# #10 블로그 상세 페이지 주소의 겹침 슬래시(//) 버그 수정

이 문서는 블로그 포스트 목록 화면 및 RSS 피드 링크에서 포스트 상세 페이지로 유도하는 주소(href) 생성 시, 포스트 ID의 앞 슬래시로 인해 슬래시가 두 개 겹쳐(예: `//hello-astro-migration/` 또는 `/blog//slug`) 생성되는 버그를 수정하기 위한 작업 계획과 실행 내역입니다.

---

## 1. 계획 (Plan)
1. **버그 원인 식별**:
   * `theme-astro` 내에서 `post.id`를 가공 없이 문자열 템플릿에 직접 사용하여 `/blog/${post.id}/` 형태로 결합하면서 발생하는 슬래시 겹침을 분석합니다.
2. **코드 수정**:
   * `theme-astro/src/pages/blog/index.astro` 및 `theme-astro/src/pages/rss.xml.js` 파일에서 `post.id`를 참조할 때 정규식(앞뒤 슬래시 및 `/index` 제거)을 적용하여 안전하게 1개의 슬래시로 결합되도록 개선합니다.
3. **로컬 빌드 검증**:
   * 본체 저장소에서 로컬 테마 모듈을 연결하여 `npm run build`를 재수행합니다.
   * 빌드 결과물 `dist/blog/index.html` 내의 포스트 링크가 `/blog/slug/` 형태로 슬래시 겹침 없이 깔끔하게 렌더링되는지 확인합니다.
4. **원격 배포**:
   * `theme-astro` 저장소에 핫픽스를 커밋/푸시하고 본체 저장소에서 lock 파일을 갱신하여 커밋 및 원격에 릴리즈합니다.

---

## 2. 실행 (Execution)
1. **코드 수정 및 ID 정제**:
   * `theme-astro/src/pages/blog/index.astro` 및 `src/pages/rss.xml.js` 에서 `post.id`를 직접 템플릿에 주입하던 부분을 정규식을 통해 앞뒤 슬래시 및 `/index` 접미사를 치환 정제하여 (`post.id.replace(/^\/|\/$/g, '').replace(/\/index$/, '')`) 주입하도록 수정 완료했습니다.
2. **로컬 빌드 검증**:
   * 본체 저장소에서 로컬 테마를 바인딩하여 `npm run build`를 재빌드하고, 빌드 결과물인 `dist/blog/index.html` 내의 포스트 링크가 `/blog//slug`가 아닌 `/blog/slug/`로 슬래시 하나만 깔끔하게 렌더링되는 정합성을 최종 검사하여 수정 완료했습니다.
3. **원격 저장소 배포 및 락 파일 동기화**:
   * `theme-astro` 저장소에 핫픽스 버전(`1a6b45b` 커밋)을 푸시하고, 본체 블로그 `package-lock.json`에 최신 테마의 커밋 해시가 동기화 반영되도록 `npm install`을 재수행하여 푸시 완료했습니다.
