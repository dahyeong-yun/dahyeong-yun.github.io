---
layout: article
title: "Spring Boot 1.2.0 Reference Doc 번역 및 Note"
tags: spring boot framework
aside:
  toc: true
---

**읽기 전에**

- 원본 : https://docs.spring.io/spring-boot/docs/1.2.0.RELEASE/reference/html/
- [postIt] : 문서를 이해하기 위해 참고한 자료나 추가적으로 유용한 것 들

**Table of Contents**

[TOC]

# Part 1. Spring Boot 문서

# Part 2. 시작하기

# Part 3. Spring Boot 사용하기



# Part 4. Spring Boot 특징들

## 22. SpringApplication

- `SpringApplication` 클래스

  - `SpringApplication.run` method :

    ```Java
    public static void main(String[] args) {
        SpringApplication.run(MySpringConfiguration.class, args);
    }
    ```

    - `SpringApplication` methods

        ```java
        /**
             * Static helper that can be used to run a {@link SpringApplication} from the
             * specified source using default settings.
             * @param primarySource the primary source to load
             * @param args the application arguments (usually passed from a Java main method)
             * @return the running {@link ApplicationContext}
             */
            public static ConfigurableApplicationContext run(Class<?> primarySource, String... args) {
                return run(new Class<?>[] { primarySource }, args);
            }
        ```

        ```java
            /**
             * Static helper that can be used to run a {@link SpringApplication} from the
             * specified sources using default settings and user supplied arguments.
             * @param primarySources the primary sources to load
             * @param args the application arguments (usually passed from a Java main method)
             * @return the running {@link ApplicationContext}
             */
            public static ConfigurableApplicationContext run(Class<?>[] primarySources, String[] args) {
                return new SpringApplication(primarySources).run(args);
            }

        ```

        ```java
        /**
             * Run the Spring application, creating and refreshing a new
             * {@link ApplicationContext}.
             * @param args the application arguments (usually passed from a Java main method)
             * @return a running {@link ApplicationContext}
             */
            public ConfigurableApplicationContext run(String... args) {
                StopWatch stopWatch = new StopWatch();
                stopWatch.start();
                ConfigurableApplicationContext context = null;
                Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();
                configureHeadlessProperty();
                SpringApplicationRunListeners listeners = getRunListeners(args);
                listeners.starting();
                try {
                    ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
                    ConfigurableEnvironment environment = prepareEnvironment(listeners, applicationArguments);
                    configureIgnoreBeanInfo(environment);
                    Banner printedBanner = printBanner(environment);
                    context = createApplicationContext();
                    exceptionReporters = getSpringFactoriesInstances(SpringBootExceptionReporter.class,
                            new Class[] { ConfigurableApplicationContext.class }, context);
                    prepareContext(context, environment, listeners, applicationArguments, printedBanner);
                    refreshContext(context);
                    afterRefresh(context, applicationArguments);
                    stopWatch.stop();
                    if (this.logStartupInfo) {
                        new StartupInfoLogger(this.mainApplicationClass).logStarted(getApplicationLog(), stopWatch);
                    }
                    listeners.started(context);
                    callRunners(context, applicationArguments);
                }
                catch (Throwable ex) {
                    handleRunFailure(context, ex, exceptionReporters, listeners);
                    throw new IllegalStateException(ex);
                }

                try {
                    listeners.running(context);
                }
                catch (Throwable ex) {
                    handleRunFailure(context, ex, exceptionReporters, null);
                    throw new IllegalStateException(ex);
                }
                return context;
            }
        ```


#### [postIt]

- `.class`



### 22.1 Banner(배너) 사용자 정의

- resource > banner.txt를 추가
  - [ ] [q] 이 경로를 설정하는 곳은?

#### [postIt]

- [배너 변경](https://beyondj2ee.wordpress.com/2017/03/17/springboot-배너-만들기/)
- [텍스트 스타일을 제공하는 웹 사이트](http://patorjk.com/software/taag/)

### 22.2 SpringApplication 사용자 정의

- `SpringApplication`에 관한 설정은 가능하다면 `application.properties` 파일을 사용할 것. -> 23. 외부 설정을 참조

  - 예제 코드

    ```java
    public static void main(String[] args) {
        // SpringApplication.run(DemoApplication.class, args); 초기 코드
        SpringApplication app = new SpringApplication(DemoApplication.class);
        //app.setShowBanner(false);
        app.run(args);
    }
    ```

- 설정 항목에 대한 리스트는 [SpringApplication Javadoc](https://docs.spring.io/spring-boot/docs/1.2.0.RELEASE/api/org/springframework/boot/SpringApplication.html)에서 볼 수 있음

### 22.3 Fluent builder API

- 만약 `ApplicationContext`의 위계 구조를 빌드해야할 필요성이 있거나, fluent bulider API를 선호할 경우 `SpringApplicationBuilder`를 사용할 수 있다.

- 예를 들어 다음과 같은 코드 작성이 가능

  - ```java
    new SpringApplicationBuilder()
        .showBanner(false)
        .sources(Parent.class)
        .child(Application.class)
        .run(args);
    ```

  - `ApplicationContext` 위계를 생성함에 있어 제약사항이 있다. 예를 들어 웹 요소를 조합할 경우, 부모와 자식 요소가 모두 동일한 `Environment`를 사용해야 한다.

#### [postIt]

- 이런 식으로 작성 했을 경우, 가독성이 증가한다는 이점이 있음

- [플루언트 인터페이스(Fluent Interface) - 위키백과](https://ko.wikipedia.org/wiki/플루언트_인터페이스)
- [Design a Fluent API in Java - DZone](https://dzone.com/articles/java-fluent-api-design)
- [Introduction to the Fluent Builder Pattern - DZone](https://dzone.com/articles/fluent-builder-pattern)

### 22.4 Application events and listeners

- [ ] 이걸 쓸 일이 뭐가 있을까?



### 22.5 웹 환경

- `SpringApplication`은 사용자를 대신하여 `ApplicationContext`를 생성한다.

- > 스프링에서는 IoC를 담당하는 컨테이너를 빈 팩토리 또는 애플리케이션 컨텍스트라고 부르기도 한다.
  >
  > \- 51p 토비의 스프링 3.1 Vol. 2 스프링의 기술과 선택

- [ ] 이걸 쓸 일이 뭐가 있을까?

### 22.6 CommandLineRunner 사용하기

- 생략

  

### 22.7 Application 종료

- `ApplicationContext`가 적절하게 종료될 수 있도록 각각의 `SpringApplication`은 JVM의 shoudown hook에 등록된다.
- 표준 Spring의 생명주기 상의 callback 함수들(이를테면 `DisposableBean`과 같은 인터페이스나 `@PreDestroy`와 같은 어노테이션) 들이 호출될 수 있다.

- 추가로, 만약 application 종료를 위한 특정한 exit code를 등록하고 싶다면, 빈(bean) 객체가 `org.springframework.boot.ExitCodeGenerator` 인터페이스를 구현하는 방식을 이용할 수 있다.

#### [postIt]

- [ ] ExitCodeGenerator에 관한 이야기 https://gist.github.com/ihoneymon/a792351ad901f33c31470aa4e4f74acb

  - [ ] 아직 잘 이해가 안됨

- [ ] https://4urdev.tistory.com/73




## 23. Externalized Configuration(외부 설정)



### 23.1 command line으로 속성(property)에 접근하기

- 생략

### 23.2 Application의 속성 파일들

- `.properties`의 대안으로 YAML(`.yml`) 포맷을 사용할 수 있다.

#### [postIt]

- [ ] 애초에 application.properties에서 항목을 불러올 수 있는 이유? (logging이라고 치면 관련 속성이 죽 나오는 데, 무엇을 기반으로 나오는 것인지?)

### 23.3  지정 속성

### 23.4 속성의 Placehoders

- 이전에 정의한 값을 다시 사용할 수 있다. 이를 테면 아래와 같다.

  - ```properties
    app.name=MyApp
    app.description=${app.name} is a Spring Boot Application
    ```

### 23.5 YAML 사용하기

#### 23.5.1 Loading YAML

- YAMLdocument 예시

  - ```yaml
    environments:
        dev:
            url: http://dev.bar.com
            name: Developer Setup
        prod:
            url: http://foo.bar.com
            name: My Cool App
    ```

  - 

#### 23.5.2

#### 23.5.3

#### 23.5.4 

### 23.6 TypeSafe 설정 속성

#### 23.6.1

#### 23.6.2



## 24. Profiles 

- Spring Profiles는 여러분의 Application에 설정을 분리하기 위한 방법을 제공한다. 각각의 설정이 특정한 환경 속에서만 이용 가능 하도록 한다.

- 어떠한 `@Component`나 `@Configration`이던지 간에 `@Profile`을 지정하여 로드하는 것을 제한 할 수 있다. 다음의 예를 살펴보자.

  - ```java
    @Configration
    @Profile("production")
    public class ProductionConfiguration {
        // ...
    }
    ```

#### [postIt]

- https://perfectacle.github.io/2018/07/22/spring-boot-2-env/

### 24.1 활성 profiles 추가하기

### 24.2 Programmatically 하게 profile 설정하기

- application의 실행 전에`SpringApplication.setAdditionalProfiles(...) ` 와 같은 method를 통해(programmatically 하게) profile을 활성화 할 수 있다.
- Spring의`ConfigurableEnvironment`인터페이스를 구현하여 profile을 활성화 할 수 있다.

### 24.3 Profile 상세 설정 파일

- Profile의 변형은

  

## 25. Logging

- Spring Boot는 내부 로깅에 있어 [Appache의 Commons Logging](https://commons.apache.org/proper/commons-logging/)을 사용 한다. 설정 또한 추가할 수 있다. 기본 설정으로는 Java Util Logging, Log4J, Log4J2 그리고 Logback을 제공한다. 각각의 라이브러리를 사용하여 `logger`로 콘솔 출력이 가능하고, 로그 파일을 생성할 수 있다.

#### [postIt]

- [ ] [q] 초기에 Spring boot는 로그를 자동으로 출력한다. 이 부분의 의존성과 그 설정은 어디에 존재하는지?
- http://blog.weirdx.io/post/60697
  - same as : https://www.sangkon.com/hands-on-springboot-logging/
- https://www.slideshare.net/whiteship/ss-47273947
- [log4j보다 logback을 사용하는 이유](https://beyondj2ee.wordpress.com/2012/11/09/logback-사용해야-하는-이유-reasons-to-prefer-logback-over-log4j/)

### 25.1 로그 형식

- 스프링 부트의 기본 로그 출력 형식은 아래와 같다.

  ```
  2020-01-27 23:23:59.054  INFO 19452 --- [  restartedMain] com.example.demo.DemoApplication         : Starting DemoApplication on DESKTOP-U88PD9F with PID 19452 (C:\Users\gryb8\IdeaProjects\demoManven\target\classes started by gryb8 in C:\Users\gryb8\IdeaProjects\demoManven)
  2020-01-27 23:23:59.057  INFO 19452 --- [  restartedMain] com.example.demo.DemoApplication         : No active profile set, falling back to default profiles: default
  2020-01-27 23:23:59.093  INFO 19452 --- [  restartedMain] .e.DevToolsPropertyDefaultsPostProcessor : Devtools property defaults active! Set 'spring.devtools.add-properties' to 'false' to disable
  ...
  ```

- 위의 로그에 포함된 정보는 다음과 같다:
  - 날짜와 시간 - 밀리세컨드ms 단위로 정확하고 쉽게 정렬가능
  - 로그레벨 - ```ERROR```, ```WARN```, ```INFO```, ````DEBUG``` 그리고 ```TRACE```
  - 프로세스 ID
  - ```---``` - 실제 로그메시지가 출력되는 부분을 나누려는 구분자
  - Logger name - 소스 클래스 네임(자주 줄어든다).
  - 로그 메시지

### 25.2 콘솔 출력

- 기본적인 로그 설정은 각각의 메세지를 콘솔에 출력하는 것이다.

### 25.3 로그 파일 출력



### 25.4 로그 레벨

- `LEVEL`에는 `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATA`, `OFF` 중에서 선택하면 로그 레벨은 모든 지원가능한 로깅 시스템에 적용

  ```properties
  logging.level.org.springframework.web : DEBUG
  logging.level.org.hibernate: ERROR
  ```

#### [postIt]

- hibernate란?

### 25.5 로그 사용자 정의

- 로깅 시스템에 따른 구분 :

  | Logging System         | 설정 파일                          |
  | ---------------------- | ---------------------------------- |
  | Logback                | `logback.xml`                      |
  | Log4j                  | `log4j.properties` or  `log4j.xml` |
  | Log4j2                 | `log4j2.xml`                       |
  | JDK(Java Util Logging) | `logging.properties`               |

  

https://meetup.toast.com/posts/149