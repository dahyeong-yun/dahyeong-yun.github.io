# #2 테마 커스터마이징 - Footer 동적 연동 및 소셜 링크 수정

이 문서는 Astro 블로그 하단 공통 푸터(Footer) 영역의 하드코딩된 정보를 제거하고 동적으로 연동하기 위한 커스터마이징 작업 계획과 실행 내역입니다.

---

## 1. 계획 (Plan)
1. **로컬 연동 임시 전환**: 작업 중 핫 리로딩 및 신속한 검증을 위해 본체 저장소(`dahyeong-yun.github.io`)의 의존성 패키지를 로컬 `theme-astro` 파일 경로로 임시 교체합니다.
2. **Footer 컴포넌트 코드 수정**:
   * 가상 모듈 `virtual:blog-config`로부터 저자 정보(`config.site.author`)를 동적 로드하여 저작권 표기에 적용합니다.
   * 불필요한 공식 Astro Twitter 및 Mastodon 소셜 계정 링크를 삭제하고, 개인 GitHub 계정(`https://github.com/dahyeong-yun`) 주소로 통일 및 갱신합니다.
3. **로컬 렌더링 확인**: 개발 서버에서 변경 사항이 정상적으로 실시간 업데이트되어 나타나는지 점검합니다.
4. **원격 릴리즈 및 락 파일 복구**:
   * `theme-astro` 원격 깃허브 저장소로 수정 코드를 푸시합니다.
   * 본체 저장소의 패키지 설치 주소를 다시 `github:dahyeong-yun/theme-astro`로 지정해 `package-lock.json`을 최종 갱신합니다.

---

## 2. 실행 (Execution)
1. **로컬 패키지 경로 연결**:
   ```bash
   npm install ../theme-astro
   ```
2. **Footer 컴포넌트 수정**:
   `theme-astro/src/theme/components/Footer.astro` 파일에 `virtual:blog-config` 임포트 구문을 선언하고, 본문을 다음과 같이 변경하였습니다.
   ```astro
   ---
   import config from 'virtual:blog-config'
   const today = new Date();
   ---
   <footer>
       &copy; {today.getFullYear()} {config.site.author || 'Your name here'}. All rights reserved.
       <div class="social-links">
           <a href="https://github.com/dahyeong-yun" target="_blank">
               <span class="sr-only">Go to GitHub profile</span>
               <svg viewBox="0 0 16 16" ...>...</svg>
           </a>
       </div>
   </footer>
   ```
3. **로컬 화면 검증**:
   * `curl` 호출 검증 결과, 푸터 영역에 정상적으로 `&copy; 2026 @polymorph1216. All rights reserved.` 텍스트가 들어가고 깃허브 아이콘이 `dahyeong-yun` 계정을 바라보도록 생성됨을 확인했습니다.
4. **테마 원격 배포 및 본체 락 파일 동기화**:
   * **테마 저장소**:
     ```bash
     cd ../theme-astro
     git add .
     git commit -m "feat: make footer copyright and social link dynamic"
     git push origin main
     ```
   * **본체 저장소**:
     ```bash
     cd ../dahyeong-yun.github.io
     npm install github:dahyeong-yun/theme-astro
     ```
     * 결과: 원격 저장소 테마 버전의 업데이트 내용이 본체 `package-lock.json`에 완벽히 동기화 및 반영 완료되었습니다.
