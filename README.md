# dahyeong-yun.github.io
blog of Da-hyeong / theme : startbootstrap-clean-blog-jekyll



### 로컬 환경 구성
- node 환경 구성을 통일하기 위해서 docker를 쓰는 건 좀 더 익숙해진 후에 변경하고, 일단 nvm을 사용하기로 했다.
  - 2023.01.07. 기준 node.js의 LTS version is 20.10.0 <https://nodejs.org/en>
  - nvm으로 20.10.0 버전 사용하기
    ```sh
    nvm install v20.10.0 # 설치
    nvm use v20.10 # 사용
    node -v # 확인
    ```

### 테마 적용하기
- 이제 이 테마를 적용해볼 차례다
  ```sh
  npm install
  npm run develop
  npx gatsby new gatsby-starter-minimal-blog https://github.com/LekoArts/gatsby-starter-minimal-blog
  ```

#### gatsby-config.ts 조정
- externalLink 수정
  - 트위터도 안하고 개별 홈페이지도 따로 없음 -> 링크드인으로 대체
- content/pages/about/index.mdx 을 자신에 맞게 수정
  - MDX가 뭐지? https://docusaurus.io/ko/docs/next/markdown-features/react
- content/posts/ 디렉토리 변경 테스트 -> 이 부분은 되다 안되다 해서 파악이 좀 더 필요할 것 같다.

### 배포하기
- 기존 대로 gh-pages 사용하려고 한다.
- 먼저 gh-pages를 추가한다.
  - 참고 자료
    - https://zoomkoding.com/gatsby-github-blog/
    - https://velog.io/@mangojang/github-pages-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0


추후 과제
- https://yenarue.github.io/tip/2020/04/30/Search-SEO/
