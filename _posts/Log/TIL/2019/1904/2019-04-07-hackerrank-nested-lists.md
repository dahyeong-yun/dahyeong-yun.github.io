---
layout: post
title: "[HackerRank] Nested Lists"
tags: [HackerRank, Python, CodingTest]
comments: true
---

## Problem
- 이전에 `set`자료형 활용했던 문제와 유사하게 풀었다.

## Hint


## Answer
```python
# 답안 작성부
def getName(score, list):
	names = []
	for i in list :
		if i[1] == score :
			names.append(i[0])
	names.sort()

	for name in names :
		print(name)

if __name__ == '__main__':
	ar = []
	scores = []
	p=0
	for _ in range(int(input())):
		name = input()
		score = float(input())
		scores.append(score)
		ar.append([])
		ar[p]=[name,score]
		p+=1

	set_scores = set(scores)
	getName(sorted(set_scores)[1], ar)
```
