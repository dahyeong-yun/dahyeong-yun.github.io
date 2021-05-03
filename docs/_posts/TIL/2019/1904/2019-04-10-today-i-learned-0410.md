---
title: "Today I learned 190410 Wed"
tags: TIL python
---

## 공부한 것 리스트


[TOC]

## 1. HackerRank ; python
- 쉬운 문제가 많아 필요한 것만 적음

### 1. Strung Validator

#### bulit in method

##### str.isalnum()
This method checks if all the characters of a string are alphanumeric (a-z, A-Z and 0-9).
```
>>> print 'ab123'.isalnum()
True
>>> print 'ab123#'.isalnum()
False
```

##### str.isalpha()
This method checks if all the characters of a string are alphabetical (a-z and A-Z).
```
>>> print 'abcD'.isalpha()
True
>>> print 'abcd1'.isalpha()
False
```

##### str.isdigit()
This method checks if all the characters of a string are digits (0-9).
```
>>> print '1234'.isdigit()
True
>>> print '123edsd'.isdigit()
False
```

##### str.islower()
This method checks if all the characters of a string are lowercase characters (a-z).
```
>>> print 'abcd123#'.islower()
True
>>> print 'Abcd123#'.islower()
False
```

##### str.isupper()
This method checks if all the characters of a string are uppercase characters (A-Z).
```
>>> print 'ABCD123#'.isupper()
True
>>> print 'Abcd123#'.isupper()
False
```

### 2. Text Alignment

#### bulit-in method

##### .ljust(width)
This method returns a left aligned string of length width.

```
>>> width = 20
>>> print 'HackerRank'.ljust(width,'-')
HackerRank----------
```

##### .center(width)
This method returns a centered string of length width.

```
>>> width = 20
>>> print 'HackerRank'.center(width,'-')
-----HackerRank-----
```

##### .rjust(width)
This method returns a right aligned string of length width.

```
>>> width = 20
>>> print 'HackerRank'.rjust(width,'-')
----------HackerRank
```

- - -

## 2. 컴퓨터의 이해

### 8장 정보통신기술과 우리 사회
