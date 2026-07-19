---
title: 'Polymorlog 시작합니다'
date: '2026-07-19'
description: 'Astro 기반 새 블로그의 첫 포스트입니다.'
tags: ['블로그', 'Astro']
---

## 안녕하세요

이제 **테마**와 **컨텐츠**가 분리된 구조로 블로그를 운영합니다.

```typescript
// blog.config.ts 한 줄만 바꾸면 테마 전체가 바뀝니다
theme: {
  codeTheme: 'tokyo-night',  // ← 여기만 수정
}
```

- `theme-astro` — UI, 레이아웃, 스타일
- `polymorlog-blog` — 이 포스트들만 있는 곳
