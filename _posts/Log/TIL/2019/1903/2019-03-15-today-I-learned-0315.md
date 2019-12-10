---
layout: post
title: "Today I Learned 190315 Fri"
tags: [TIL]
comments: true
---

## 1. Python Django

### 1) ORM

#### 조회하기
- `Class.objects.all()`
- `Class.objects.all().values()`
- `Class.objects.get(condition).Fieldname`

#### 필터링 하기
- `Class.objects.filter(Field="value")`
- `Class.objects.exclude(Field="value")`
- QureySet의 중간 결과를 return

#### 페이징하기
- 어디서 어디까지 : `Class.objects.all()[n:m]`
    - `Class.objects.all()[1:3]`
- 정렬 : `Class.objects.order_by('Field')`
    - 역순 `Class.objects.order_by('-Field')`