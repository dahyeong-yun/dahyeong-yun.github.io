# #12 브랜드 방향 정립 (파비콘 · OG 이미지 · 비주얼 아이덴티티)

이 문서는 블로그의 시각 아이덴티티를 정하기 위한 인수인계 문서입니다. 다른 태스크와 달리 **구현이 목적이 아니라 결정이 목적**입니다. 코드는 이미 준비돼 있고, 무엇을 넣을지가 비어 있습니다.

---

## 1. 왜 이 태스크가 열렸나

파비콘이 Astro 스타터의 기본 로고(로켓 모양)인 것을 발견해 교체했고, OG 공유 카드 이미지도 없어서(404를 가리키고 있었음) 새로 만들었습니다. 다만 **둘 다 자리표시용**입니다 — 사이트 색만 가져다 쓴 최소한의 형태라 "이 블로그다움"이 없습니다.

사용자가 남긴 말 그대로 옮기면:

> "브랜드를 어떤 식으로 잡아가야 할지 감이 좀 안 와서"

그래서 이 세션의 목표는 이미지 파일을 만드는 것이 아니라, **무엇을 만들지 정하는 것**입니다. 파일 교체는 결정만 나면 10분입니다.

---

## 2. 이미 확정된 것 — 다시 논의하지 말 것

시각 시스템의 상당 부분은 이미 정해져 코드에 토큰으로 박혀 있습니다. 브랜드는 이 위에 얹는 것이지, 이걸 갈아엎는 게 아닙니다.

| 항목 | 값 | 위치 |
| --- | --- | --- |
| 사이트 이름 | Polymorlog | `blog.config.ts` |
| 한 줄 설명 | 개발, 성장, 회고를 기록합니다. | `blog.config.ts` |
| 강조색 (라이트) | `#0066cc` | `--color-accent` |
| 강조색 (다크) | `#0a84ff` | `--color-accent` |
| 본문색 / 보조색 | `#333333` / `#7a7a7a` | `--color-text-body` / `--color-text-secondary` |
| 서체 | SF Pro → Pretendard | `--font-sans` |
| 본문 크기 | 17px / 행간 27.2px | `global.css` |
| 읽기 폭 | 720px (목록·본문 공통) | `--content-width` |
| 라이트/다크 | 둘 다 지원, 토글 있음 | `Header.astro` |

**문서 두 종류**도 이미 갈라져 있고, 이 구분 자체가 브랜드의 일부입니다:

- **포스트** (`/blog`) — 나의 통찰·경험·생각. 쓴 날짜가 의미를 가짐
- **위키** (`/wiki`) — 정리된 정보. 계속 고쳐 씀

옵시디언 문법 `[[문서]]`로 둘을 잇고, 가리켜진 문서 하단에 백링크가 자동으로 붙습니다.

---

## 3. 지금 자리표시용인 것

교체 대상은 이 넷입니다. 모두 `dahyeong-yun.github.io/public/` 에 있습니다.

| 파일 | 현재 상태 | 쓰이는 곳 |
| --- | --- | --- |
| `favicon.svg` | 파란 라운드 사각 + 흰 `P` | 브라우저 탭 (최신 브라우저 우선) |
| `favicon.ico` | 위와 동일, 16/32/48 세 크기 | 구형 브라우저 폴백 |
| `apple-touch-icon.png` | 위와 동일, 180×180 | iOS 홈 화면 |
| `og-default.png` | 흰 배경 + "Polymorlog" + 설명 + 도메인, 1200×630 | 카톡·슬랙·트위터 공유 카드 |

**교체 방법**: 같은 경로에 같은 이름으로 덮어쓰면 끝입니다. 설정은 건드릴 필요 없습니다. 테마는 경로만 연결하고 있습니다.

글마다 다른 공유 이미지를 쓰고 싶으면 frontmatter에 적습니다. 우선순위는 `ogImage` → `banner` → `seo.defaultImage` 입니다.

```yaml
---
title: 낙관적 락의 시작에는 락이 없었다
ogImage: /og/optimistic-lock.png
---
```

---

## 4. 이번 세션에서 알아낸 제약 — 여기서 시작하면 시간을 아낍니다

파비콘 후보 6종을 만들어 **실제 16px로 렌더해 비교**했습니다. 결론이 명확했습니다.

| 후보 | 16px에서 |
| --- | --- |
| 라운드 사각 + `P` | 살아남음 |
| 원 + `P` | 살아남음 |
| 배경 없는 `P` | **죽음** — 획이 얇아 탭 줄에서 안 보임 |
| 겹친 두 원 (다형성 은유) | **개념 증발** — 흰 얼룩으로 뭉개짐 |
| 반원 + 각진 면 (한 형태의 두 얼굴) | **개념 증발** — 위와 같음 |
| 어두운 배경 + 슬래시 | 살아남음. 의미는 없지만 눈에 띔 |

여기서 나온 규칙 셋:

1. **16px에서 먼저 그린다.** 크게 그려놓고 줄이면 대부분 죽는다. 순서를 뒤집을 것.
2. **도형 하나, 바탕 하나.** 16px에 들어가는 정보량은 그게 전부다. 은유를 두 도형으로 표현하려는 시도가 실패한 이유.
3. **파비콘은 읽는 것이 아니라 찾는 것.** 탭 15개 중 내 탭을 골라내는 표식이므로, 의미보다 색과 실루엣이 먼저다.

### 후보 비교 시트 재생성 스크립트

`dahyeong-yun.github.io` 루트에서 실행하면 16/32/64px 비교 시트가 나옵니다. (`sharp`는 이미 설치돼 있음)

```js
// cand.mjs — 실행 후 삭제할 것. 레포에 남기지 않음
import sharp from 'sharp'
const A = '#0066cc', W = '#ffffff'
const F = 'font-family="Helvetica Neue, Helvetica, Arial, sans-serif"'
const wrap = (i) => `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">${i}</svg>`

const svg = wrap(`<rect width="64" height="64" rx="14" fill="${A}"/>
  <text x="32" y="47" text-anchor="middle" ${F} font-size="46" font-weight="700" fill="${W}">P</text>`)

// 실제 16px 로 줄인 뒤 픽셀 그대로 확대 — 작은 크기에서 뭉개지는 정도가 보인다
const p16 = await sharp(Buffer.from(svg)).resize(16, 16).png().toBuffer()
await sharp(p16).resize(256, 256, { kernel: 'nearest' }).png().toFile('preview-16px.png')
```

---

## 5. 결정해야 할 것

다음 세션에서 답해야 하는 질문들입니다. 순서대로 좁혀 가면 됩니다.

**Q1. 파비콘을 의미형으로 갈 것인가, 식별형으로 갈 것인가?**
16px 실험이 보여주듯 둘 다 가지기는 어렵습니다. 의미를 담으려면 형태가 복잡해지고, 복잡해지면 16px에서 죽습니다. 개인 블로그에서는 식별형(글자 또는 단순 도형)으로 두고 의미는 다른 데서 푸는 편이 현실적입니다.

**Q2. 이름의 뜻을 브랜드에 쓸 것인가?**
`Polymorlog` = polymorph + log 로 읽힙니다. 다형성은 개발자 블로그 이름으로 쓸 만한 훅이지만, 위에서 보듯 **도형으로 옮기면 16px에서 무너집니다.** 쓴다면 파비콘이 아니라 OG 이미지·About·헤더 문구 쪽이 자리입니다. 애초에 이 이름이 다형성에서 온 것인지부터 사용자에게 확인이 필요합니다 — 지금은 추측입니다.

**Q3. OG 이미지를 공통 1장으로 둘 것인가, 글마다 자동 생성할 것인가?**
지금은 공통 1장이라 링크 10개를 공유하면 10개가 같은 그림입니다. OG의 목적이 "이 링크를 눌러야 할 이유"를 주는 것이라면, **글 제목을 카드에 얹는 자동 생성이 정석**입니다. 빌드 때 생성 가능하고 `satori` 의존성이 붙습니다. **체감 효과는 파비콘보다 이쪽이 훨씬 큽니다.**

**Q4. 강조색 `#0066cc` 를 유지할 것인가?**
지금 파랑은 시스템 기본 계열이라 안전하지만 개성은 약합니다. 색은 파비콘·OG·링크·헤더에 모두 걸려 있어서 **가장 값싸게 개성을 만드는 수단**이기도 합니다. 바꾼다면 `--color-accent`(라이트/다크 두 값)만 고치면 전체가 따라옵니다.

**Q5. 글의 톤을 브랜드 기준으로 삼을 것인가?**
이미 사이트에 쓰인 문구들이 톤을 갖고 있습니다 — "겪은 일과 그때 한 생각을 남깁니다", "정리해 둔 정보성 문서들. 계속 고쳐 씁니다", "이어서 읽으면 좋은 글들을 묶었습니다". 담백하고 과장이 없습니다. 시각 요소를 이 톤에 맞추면 일관성이 생깁니다.

---

## 6. 추천 진행 순서

1. **Q4(색)를 먼저 정한다.** 색이 정해져야 파비콘·OG를 한 번에 만들 수 있습니다. 색부터 정하지 않으면 두 번 만들게 됩니다.
2. **Q3(OG 자동 생성)을 한다.** 결정 부담이 가장 적고 효과가 가장 큽니다.
3. **파비콘은 마지막에.** 지금 것으로 두고 나중에 다시 봐도 아무 문제 없습니다.

---

## 7. 함정

- **파비콘·OG는 캐시가 오래 남습니다.** 브라우저는 파비콘을 아주 오래 들고 있어 하드 리로드로도 안 바뀔 수 있으니 시크릿 창에서 확인하세요. 카카오톡·슬랙은 OG를 캐싱하므로 예전에 공유한 링크는 옛 이미지로 보일 수 있습니다.
- **`og:image` 는 반드시 절대 URL이어야 합니다.** 크롤러는 상대 경로를 읽지 못합니다. 테마가 자동 변환하고 있으니 경로는 `/og-default.png` 처럼 루트 기준으로만 적으면 됩니다.
- **없는 파일을 가리키느니 태그가 없는 게 낫습니다.** 이전에 `/og-default.jpg`(존재하지 않음)를 가리켜 모든 페이지가 깨진 카드로 공유되고 있었습니다. 지금은 `seo.defaultImage` 가 비면 태그 자체를 넣지 않습니다.
- **테마를 고치면 lock 갱신이 필수입니다.** `package.json` 만 바꾸고 `package-lock.json` 을 두면 **로컬은 멀쩡한데 배포만 옛 테마로 나갑니다.** npm은 git 의존성도 lock에 박힌 커밋을 우선합니다. 아래 2단계를 항상 세트로 실행하세요.

```bash
cd ../theme-astro && git push origin garden
```

```bash
npm install theme-astro@github:dahyeong-yun/theme-astro#garden
```

---

## 8. 관련 파일

- [public/](file:///Users/dahyeung/Repositories/polymorph/publish/dahyeong-yun.github.io/public/) — 교체 대상 이미지 4개가 모두 여기 있습니다.
- [blog.config.ts](file:///Users/dahyeung/Repositories/polymorph/publish/dahyeong-yun.github.io/blog.config.ts) — `theme.themeColor`, `seo.defaultImage`, `navigation` 의 페이지 설명 문구.
- [theme-astro/src/theme/styles/global.css](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/theme/styles/global.css) — 색·서체·읽기 폭 토큰이 최상단 `:root` 에 모여 있습니다. 색을 바꾼다면 여기 두 곳(라이트/다크)만 고치면 전체가 따라옵니다.
- [theme-astro/src/theme/components/BaseHead.astro](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/src/theme/components/BaseHead.astro) — 파비콘 링크, OG/트위터 카드, 이미지 우선순위 해석 로직.
- [theme-astro/README.md](file:///Users/dahyeung/Repositories/polymorph/publish/theme-astro/README.md) — 파비콘·공유 카드·SEO 설정 규칙이 정리돼 있습니다.

---

## 9. Prompt for New Chat

```markdown
개인 기술 블로그 Polymorlog(https://dahyeong-yun.github.io)의 브랜드 방향을 잡으려 합니다.
레포는 두 개로 나뉘어 있습니다.
- 콘텐츠: /Users/dahyeung/Repositories/polymorph/publish/dahyeong-yun.github.io (브랜치 main)
- 테마:   /Users/dahyeung/Repositories/polymorph/publish/theme-astro (브랜치 garden)

먼저 아래 파일들을 Read 도구로 직접 읽어 현재 상태를 파악해 주세요.
- dahyeong-yun.github.io/.history/tasks/12_branding_direction.md  ← 이 작업의 인수인계 문서
- dahyeong-yun.github.io/blog.config.ts
- theme-astro/src/theme/styles/global.css (최상단 :root 토큰 부분)
- theme-astro/src/theme/components/BaseHead.astro
- dahyeong-yun.github.io/public/ 의 이미지 4개

인수인계 문서의 요약만 믿지 말고 실제 코드와 이미지를 확인해 대조해 주세요.

이번 작업은 코드 구현이 아니라 결정이 목적입니다. 저는 브랜드를 어떻게 잡아야 할지
감이 없는 상태이므로, 추상적인 조언 대신 **비교해서 고를 수 있는 구체적인 안**을
만들어 보여주세요. 12번 문서의 5절에 정해야 할 질문 다섯 개가 정리돼 있고,
6절에 추천 순서(색 → OG 자동 생성 → 파비콘)가 있습니다.

먼저 문서를 읽고 현재 상태를 검증한 뒤, 어디서부터 시작할지 제안해 주세요.
파일을 고치기 전에 저의 확인을 받아 주세요.
```
