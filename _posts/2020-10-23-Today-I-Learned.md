---
layout: default
title: "지킬 테마 만들기"
category : TIL
tags : jekyll
time :
  - created : 
  - modified : 
---



# 테마 만들면서 알게 된 것들



- 디렉토리 구조에 따르면
- `_layout` 에서 생성한 파일 명을 jekyll 에서 빌드할 정적 파일의 헤더 정보로 사용할 수 있다.
- 헤더 정보는 최상단에  '`---`' 사이에 입력하는 것을 말한다. `_post` 하위의 포스팅 파일에서 이 부분에 이를 테면 layout : default 라고 했다면, `_layout`에 default.html을 불러와서 해당 파일의 {{ contents }} 영역에 포스팅 파일의 내용이 들어가게 되는 것이다.
- 날짜 관련 포맷팅을 제공한다.
  - 참고 : https://blog.yena.io/studynote/2017/11/06/Date-Formatting.html



- 임의로 디렉토리 구조를 만들 경우에, 그 경로가 알아서 잡힌다.
  - 예를 들면 `doc`라는 디렉토리를 만들고 하위 문서를 about.md 로 잡았을 경우에
  - /doc/about으로 접속하면 해당 파일이 열린다.

- gem plugin 사용 시, 빌드 에러가 날 수 있다.
  - 해결 참고
    - https://blog.naver.com/PostView.nhn?blogId=flowerdances&logNo=221110593847&categoryNo=0&parentCategoryNo=0