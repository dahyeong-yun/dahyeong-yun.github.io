---
title: 커넥션 풀 고갈이 서버 전체 장애가 되는 경로
description: 풀이 마르면 DB를 쓰지 않는 API까지 죽는다. 그 연쇄와 끊는 지점
aliases: [커넥션 풀 고갈, connection pool exhaustion]
branches: [db-connection]
tags: [database, connection-pool, spring, 장애]
created: 2026-09-03
updated: 2026-09-03
status: seed
draft: true
---

커넥션 풀이 부족하면 DB 조회만 실패하고 끝나지 않는다. **서버 전체가 멈추는(Hang) 도미노**로 번진다.

## 연쇄

풀이 마르는 속도는 [[커넥션 점유 시간]]이 정한다. 점유가 길수록 아래 1번에 빨리 도달한다.

1. 풀 10개가 꽉 찬 상태에서 요청 100개가 들어온다
2. 커넥션을 얻지 못한 Tomcat thread가 HikariCP 내부 대기열(`HandOffQueue`)에 들어간다
3. `connection-timeout` 기본값이 **30초**라, 그동안 thread는 `WAITING` 으로 잠긴다
4. 요청마다 thread가 하나씩 대기에 빠지므로 Tomcat worker thread pool(기본 200)이 순식간에 찬다
5. 신규 TCP 연결과 HTTP 요청을 받아줄 thread가 없어진다
6. DB를 전혀 쓰지 않는 `/health-check` 마저 응답하지 못하고 `504 Gateway Timeout` 으로 터진다

DB를 쓰지 않는 API까지 죽는다는 것이 이 경로의 핵심이다.

## 끊는 지점

`connection-timeout` 을 **2~3초로 짧게** 잡아 빠르게 실패시킨다(Fail-Fast).
이 시간을 넘기면 `SQLTransientConnectionException` 이 바로 던져진다.
커넥션을 붙잡은 채 서버가 뻗기를 바라는 게 아니라면 길게 둘 이유가 없다.

타임아웃은 **바깥에서 안쪽으로 갈수록 좁게** 설정한다.

```
Nginx 등 프록시  >  HikariCP connection-timeout  >  DB Query Timeout
```

안쪽이 먼저 끊어져야 바깥이 연쇄로 무너지지 않는다.

이 경로 때문에 API 서버에서는 풀 개수를 키우는 것보다 타임아웃을 짧게 잡는 쪽이
설정의 무게중심이 된다. 개수를 정하는 이야기는 [[HikariCP 설정#풀 크기|HikariCP 설정]]에 있다.
