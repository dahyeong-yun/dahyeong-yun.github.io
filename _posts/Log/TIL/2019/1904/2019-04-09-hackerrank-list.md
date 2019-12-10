---
layout: post
title: "[HackerRank] Lists"
tags: [HackerRank, Python, CodingTest]
comments: true
---

## Problem


## Hint
- [여기](https://wikidocs.net/14#remove) 다 정리 되있다. 분명 공부했는데, 왜 처음 보는게 있을까.
- 함수의 매개변수가 정해져 있지 않을 때
- 입력 값을 공백 기준으로 끝어 받을 때,
- 

## 주의
- input()으로 받으면 str이다.
- 함수가 실행문 전에 정의되어 있어야 호출이 된다 -> 안그러는 법은 없나?

## answer
- Mine

```python
def doSomething(command_list, answer):
    if command_list[0] == 'insert':
        answer.insert(int(command_list[1]), int(command_list[2]))
    elif command_list[0] == 'print':
        print(answer)
    elif command_list[0] == 'remove':
        answer.remove(int(command_list[1]))
    elif command_list[0] == 'append':
        answer.append(int(command_list[1]))
    elif command_list[0] == 'sort':
        answer.sort()
    elif command_list[0] == 'pop':
        answer.pop()
    elif command_list[0] == 'reverse':
        answer.reverse()


if __name__ == '__main__':
    N = int(input()) # N개의 명령
    commands = [] # 명령어 저장 배열
    answer = []
    # N개의 명령 저장하기
    for i in range(N) :
        commands.append(input())
        # print(commands)

    for command in commands :
        tmp = command.split() # 명령어를 공백 기준으로 분해
        doSomething(tmp, answer)
```

- vote 1st

```python
n = input()
l = []
for _ in range(n):
    s = raw_input().split()
    cmd = s[0]
    args = s[1:]
    if cmd !="print":
        cmd += "("+ ",".join(args) +")"
        eval("l."+cmd)
    else:
        print l
```