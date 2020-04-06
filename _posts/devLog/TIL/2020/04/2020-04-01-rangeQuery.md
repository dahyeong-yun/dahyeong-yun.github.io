---
layout: article
title: "시작일, 종료일 Select Query"
tags: TIL query
aside:
  toc: true
---



## Problem

- 게시일자를 설정한 데이터가 있다고 상상해보자. 데이터 자체에도 start_date 와 end_date가 있고, 검색 또한 시작일과 종료일을 넣어서 `SELECT` 문을 날려야할 경우는 어떻게 할까? 

- 기존 쿼리는 start_date와 end_date를 각각 between으로 검색 값 사이에 집어 넣었다.

- 이렇게 되었을 때 문제는 검색 범위가 데이터 값 범위 사이에 있을 경우 검색이 되지 않는다.

  

## Solution

- 시작일과 end_date, 종료일과 start_date를 교차로 걸어주면 된다.

  

## Process

### 경우의 수

- 경우의 수는 아래 4가지 이다.
  - 데이터가 검색 범위에 있는 경우
  - start_date가 검색 범위 사이에 있는 경우
  - end_date가 검색 범위 사에이 있는 경우
  - start_date ~ end_date가 검색 범위 사에이 있는 경우
- 네 가지 경우 모두,
  - start_date가 검색 값 상의 종료일보다 같거나 이 전이다.
  - end_date는  검색 값 상의 시작일보다 같거나 이 후이다.
  - 따라서 이 두 조건의 교집합이 range가 된다.



