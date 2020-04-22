---
layout: article
title: "Oracle 사용자 생성"
tags: TIL database oracle ddl
aside:
  toc: true
---



## Oracle 사용자 생성

- 사용자 생성 쿼리 작성을 하다가 궁금한게 생겨 정리해 본다.

- 사용자 생성 쿼리

  ```
       CREATE USER 사용자명 IDENTIFIED BY 비밀번호
      DEFAULT TABLESPACE 테이블스페이스
    TEMPORARY TABLESPACE 임시 테이블스페이스;
  ```

  - Q. 더 가능한 옵션은?

- 전체 사용자 계정 확인 쿼리

  ```
    SELECT *
      FROM ALL_USERS;
  ```

  - Q. `ALL_USERS` 와 같은 기본테이블은 어디서 확인할 수 있나. 그 리스트는?

- 테이블 스페이스 확인용 쿼리

  ```
    SELECT TABLESPACE_NAME 
         , (BYTES/1024) AS SZ_KB        -- 킬로바이트
         , (BYTES/(1024*1024)) AS SZ_MB -- 메가바이트
         , a.*
      FROM DBA_DATA_FILES a;
  ```

- 기본 시스템 테이블 확인용 쿼리

  - 테이블이 2개가 있음

    ```
      SELECT *
        FROM ALL_ALL_TABLES; -- 1241
      
      SELECT *
        FROM ALL_TABLES; --1227
    ```

  - 두 개 차이가 뭔가 싶어 확인 하는 용도 쿼리

    ```
      SELECT OWNER
           , TABLE_NAME
           , TABLESPACE_NAME
        FROM ALL_ALL_TABLES -- 1241
      MINUS  
      SELECT OWNER
           , TABLE_NAME
           , TABLESPACE_NAME
        FROM ALL_TABLES; --1227
    ```

## Reference

[[DB\] Tablespace ( 테이블스페이스 ) 관련 / 생성 및 지정](https://denodo1.tistory.com/269)

[Oracle의 많은 Default User. 이거 삭제해도 되나?](https://energ.tistory.com/entry/Oracle의-많은-Default-User-이거-삭제해도-되나)