---
title: JUnit5
---



- 환경 구성



# 개요

- 이하 예제의 실행 환경
  - Spring Boot 2.4.5
  - JUint5 : 스프링 부트 사용 시, 2.2.1 버전부터 기본 테스트 프레임 워크로 지정되어 있다.



# 테스트 방법

## 테스트 이름 표시하기

- 구현체를 통해 전략을 설정할 수 있다
- 그냥 각기 이름을 줄수도 있다.



## 기본 테스트 들

### `assertEquals` : 서로 같은지 여부

- 파라미터의 순서가 `expected`(예상 값), `actual`(실제  값) 이다. 그냥 순서 없이 파라미터를 넘겨도 테스트는 만들어지겠지만, API 규약을 정상적으로 따르기 위해서는 이 순서를 따르는 것이 좋다.

- 메세지 파라미터를 추가한 형태가 오버로딩 되어 있다. 메세지는 실패 시, description 의 의미로 들어간다고 보면 된다. 

  - 두 가지 형태가 있다. `String`으로 선언 시 매번 공간을 할당하지만, `Supplier` 객체의 경우에는 메세지가 필요 시에만 공간이 할당 된다. 따라서 메세지 자체가 복잡한 로직으로 얽혀있거나, 많은 시공간을 차지할 것이라고 예상되는 경우 람다를 사용하는 것이 좋다.

  - 메세지가 `String` 객체인 경우

    ```java
    public static void assertEquals(Object expected, Object actual, String message) {
        AssertEquals.assertEquals(expected, actual, message);
    }
    ```

  - 메세지가 `Suplier` 객체인 경우

    ```java
    public static void assertEquals(Object expected, Object actual, Supplier<String> messageSupplier) {
        AssertEquals.assertEquals(expected, actual, messageSupplier);
    }
    ```

    



- 여러 개의 결과를 동시에 알고 싶을 경우
  
  - 여러 개의 Assertions를 사용하면 가장 먼저 실패하는 테스트에서 끝나게 된다.
  
- 예외가 발생하는지 확인하고 싶은 경우
  - 예외메세지가 원하는 메세지로 나오는지 테스트 하고 싶을  경우
  
- 실행 시간으로 테스트하고 싶을 경우
  - 실행 시간을 전부 채우지 않고, 테스트하는 시간 안에 끝나지 않으면 바로 실패를 보고 싶다면?
    - 이 경우에 Thread가 달라 예상하지 못한 동작이 나올 수도 있다.



- 이밖에도 다른 라이브러리 사용이 가능
  - 기본으로 jupiter와 hamcrest가 제공



## 환경에 따라 테스트 하기





# 참고

- 공식 repo : https://github.com/junit-team/junit5
- 공식 사용자 가이드 : https://junit.org/junit5/docs/current/user-guide/