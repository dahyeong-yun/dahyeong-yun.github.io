---
layout: post
title: "[HackerRank] Find The Runner-Up Score!"
tags: [HackerRank, Python, CodingTest]
comments: true
---

## Problem
- 'Runner-Up Score'의 의미를 정확히 알아야 풀 수 있는 문제다.

- 입상 가능한 점수 정도로 생각하고 풀었는데, 본 문제에서 엄밀한 의미로는 2등까지의 점수를 의미하고 있다.
- 공동으로 1등이 많더라도, 다음은 그냥 2등으로 치고 있다.(보통 현실에서는 공동 1위면 다음은 3위로 계산한다.)
- 그래서 받은 점수 리스트의 2등 커트 라인을 구하는 문제라고 보면 된다.
- [문제 번역]()은 요기로

## Hint
- 나는 다음과 같은 함수를 사용했다.
- [`sorted()`](https://www.programiz.com/python-programming/methods/built-in/sorted)
	- 형식 : `sorted(iterable[ ,key][ ,reverse])`	
```python


if __name__ == '__main__':
    n = int(input())
    arr = map(int, input().split())
    
    # 여기서부터 답안 작성란
    run = set(arr)
    print(sorted(run, reverse=True)[1])
```
