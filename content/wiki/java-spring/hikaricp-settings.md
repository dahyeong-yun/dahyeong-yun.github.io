---
title: HikariCP 설정
description: 풀 크기, 커넥션 수명, 타임아웃, 진단. 각 값을 왜 그렇게 잡는지와 잘못 잡으면 뭐가 터지는지
aliases: [HikariCP 커넥션 풀 사이즈 정하기, 커넥션 풀 사이즈, pool sizing, hikari]
branches: [db-connection]
tags: [database, connection-pool, performance]
created: 2026-09-03
updated: 2026-09-03
status: seed
draft: true
---

HikariCP 설정은 네 갈래로 나뉜다. **풀 크기**, **커넥션 수명**, **타임아웃**, **진단**이다.

공식 문서가 각 값의 정의를 알려준다면, 이 문서는 **내가 실제로 어떤 값을 골랐고
잘못 골랐을 때 뭐가 터졌는지**를 남긴다. 그 부분이 비어 있으면 아직 안 겪어본 설정이다.

## 풀 크기

| 설정 | 내가 잡는 값 | 왜 / 잘못 잡으면 |
| --- | --- | --- |
| `maximum-pool-size` | 아래 추정 식으로 | 풀의 상한. 너무 작으면 [[커넥션 풀 고갈이 서버 전체 장애가 되는 경로]]로 간다 |
| `minimum-idle` | 운영 API 서버는 최대값과 동일하게 | 풀을 고정해 커넥션을 맺고 끊는 비용을 없앤다 |

### 코어 수 공식만으로는 안 되는 이유

HikariCP 위키가 권장하는 기본 공식은 이것이다.

```
Connections = (Core × 2) + Effective Spindle
```

4코어에 SSD(spindle 1)면 9개가 나온다. 이 정도로도 6000 TPS를 소화한다는 프로파일링 결과가 있다.

문제는 **DB 한 대에 붙는 애플리케이션이 한 대가 아니라는 점**이다.
API와 Admin을 따로 두고 API는 이중화까지 하면 서버가 넷이다.
그렇다고 1/N로 나누는 것도 맞지 않는다. 서버마다 쿼리 성격과 요구 TPS가 다르기 때문이다.

### 목표 TPS로 추정하기

리틀의 법칙(시스템 내 평균 객체 수 = 평균 유입률 × 평균 체류 시간)을 커넥션에 대입한다.

```
필요 커넥션 수 = 목표 TPS × 평균 커넥션 점유 시간(초)
```

목표 TPS 2,000, 점유 시간 2ms 라면 `2000 × 0.002 = 4개`.
평균값이므로 버퍼를 얹는다. Stop-the-world GC, 순간적인 트래픽 쏠림, 네트워크 지연이 이유다.

식의 오른쪽 항이 [[커넥션 점유 시간]]이라는 점이 중요하다.
풀을 키우는 것 말고 **점유 시간을 줄이는 쪽으로도 같은 목표에 도달할 수 있다.**

### 서버 역할에 따라 달라지는 지점

| 서버 | 패턴 | 무게를 두는 곳 |
| --- | --- | --- |
| API | High TPS, Short Query | 풀을 키우기보다 `connection-timeout` 을 짧게. DB 장애가 API 전체로 번지는 것을 막는 데 집중 |
| Admin / Batch / Internal | Low TPS, Long Query | 커넥션 하나를 오래 쥐므로 개수는 넉넉히, 대신 DB 자원을 독점하지 않도록 상한을 둠 |

### minimum-idle 을 최대값과 맞추는 이유

HikariCP는 최소 유지 개수를 넘긴 커넥션이 일정 시간 놀면 연결을 끊는다. DB 자원을 붙잡고 있지 않기 위해서다.

운영 API 서버에서는 `minimum-idle` 을 `maximum-pool-size` 와 같게 두어 풀을 고정하기를 권장한다.
커넥션을 맺고 끊는 비용 때문이다. 풀 안의 커넥션도 TCP 3-way handshake, DB 인증·인가,
세션과 메모리 할당을 거쳐 만들어진다.

## 커넥션 수명

풀 안의 커넥션을 언제 버리고 새로 맺을지를 정하는 값들.

| 설정 | 내가 잡는 값 | 왜 / 잘못 잡으면 |
| --- | --- | --- |
| `idle-timeout` | | |
| `max-lifetime` | | |
| `keepalive-time` | | |

## 타임아웃

기다리다 언제 포기할지를 정하는 값들.

| 설정 | 내가 잡는 값 | 왜 / 잘못 잡으면 |
| --- | --- | --- |
| `connection-timeout` | 2~3초 | 기본값 30초를 그대로 두면 스레드가 줄줄이 잠긴다. [[커넥션 풀 고갈이 서버 전체 장애가 되는 경로]] 참고 |
| `validation-timeout` | | |
| `initialization-fail-timeout` | | |

타임아웃은 바깥에서 안쪽으로 갈수록 좁게 잡는다.

```
Nginx 등 프록시  >  HikariCP connection-timeout  >  DB Query Timeout
```

## 진단

값을 정하는 설정이 아니라, 무슨 일이 벌어지는지 보이게 하는 설정들.

| 설정 | 내가 잡는 값 | 왜 / 잘못 잡으면 |
| --- | --- | --- |
| `leak-detection-threshold` | | |
| `pool-name` | | |
| `register-mbeans` | | |

## 그 밖의 설정

아직 직접 만져볼 일이 없었던 것들. 겪게 되면 위 표로 올린다.

`auto-commit` · `read-only` · `transaction-isolation` · `catalog` · `schema` ·
`connection-init-sql` · `connection-test-query` · `allow-pool-suspension` · `data-source-properties`

---

이 값들을 정하지 못한 채로 넘어가며 겪은 일은
[[적정 커넥션 풀(Connection Pool) 크기를 정하는 요소들]]에 적어 두었다.
