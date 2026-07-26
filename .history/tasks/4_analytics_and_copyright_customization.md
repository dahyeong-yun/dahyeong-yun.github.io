# #4 구글 애널리틱스(GA4)/GTM 지원 및 카피라이트 정보 수정

이 문서는 블로그 설정에서 GA4 및 GTM 추적 ID를 손쉽게 바인딩할 수 있도록 테마 수준에서 설정을 통합하고, 카피라이터 표기 문구를 간소화하여 반영하는 커스터마이징 작업 계획과 실행 내역입니다.

---

## 1. 계획 (Plan)
1. **테마 기능 확장**:
   * `theme-astro/src/theme/types.ts` 인터페이스에 구글 애널리틱스 설정을 의미하는 `ga` 설정을 추가합니다.
   * `theme-astro/src/index.ts`의 `partytown` 통합 설정에 GA/GTM 이 포함될 경우 `gtag` 함수를 스레드 포워딩에 추가하도록 개편합니다.
   * `theme-astro/src/theme/components/BaseHead.astro`에서 GA4 추적 태그가 Partytown 비동기 웹 워커 기반으로 로드되도록 삽입합니다.
2. **설정 업데이트 및 검증**:
   * 본체 `blog.config.ts`의 카피라이터 author 값을 기존 `@polymorph1216`에서 `polymorph`로 수정합니다.
   * 추후 간편하게 기입할 수 있도록 GA4 ID 비활성 템플릿 코드 블록을 config에 구성합니다.
3. **빌드 검증**:
   * 로컬에 테마 패키지를 연결(`npm install ../theme-astro`)하여 빌드 후, 결과 파일 내 카피라이트 텍스트 및 GA4 태그 적용 여부를 검증합니다.
4. **배포**:
   * 테마 수정 소스를 원격 업로드하고, 본체 의존성을 원격으로 되돌린 뒤 락 파일을 최종 배포 브랜치(`main`)에 릴리즈합니다.

---

## 2. 실행 (Execution)
1. **테마 기능 구현 및 배포**:
   * `theme-astro` 소스 코드 내 GA4 지원 설정 완료 후 릴리즈 커밋 및 푸시 완료:
     * Commit ID: `db3b39fef97ff19b2978f30fbd7ef24b49770ccf`
2. **본체 블로그 설정 갱신**:
   * `blog.config.ts`에 아래 설정을 적용하여 저자 명을 변경하고 GA 설정 템플릿을 생성했습니다.
     ```typescript
     site: {
       ...
       author: 'polymorph',
     },
     analytics: {
       gtm: {
         id: 'GTM-PZRN9ZQC',
         includeInDevelopment: true,
       },
       ga: {
         id: '', // Google Analytics 4 Measurement ID
         includeInDevelopment: false,
       },
     }
     ```
3. **로컬 교차 빌드 및 결과 검증**:
   * `npm install ../theme-astro` 후 `npm run build` 진행.
   * 결과물 `dist/index.html` 내 `&copy; 2026 polymorph. All rights reserved.` 텍스트가 정상 반영되었음을 `grep` 검색으로 검증 완료했습니다.
4. **원격 저장소 동기화**:
   * 본체의 테마 모듈을 원격으로 재지정(`npm install github:dahyeong-yun/theme-astro`) 후 최종 빌드 성공을 검증하고 `main` 브랜치에 푸시 완료했습니다.
