---
title: 리차드슨 성숙도 모델(Richardson Maturity Model) 소개
tags: REST API RMM
---



- 이 포스트는 마틴 파울러의 [블로그 내용](https://martinfowler.com/articles/richardsonMaturityModel.html)을 요약한 것입니다.

- 의역과 해석이 난무 하므로 오류에 대해서는 댓글을 부탁드립니다 :)



# 들어가며

- REST API의 단계는 리차드슨 성숙도 모델로 제시된 바 있다. 이 단계에 따른 설명을 마틴 파울러가 블로그에 작성한 글을 보면 HATEOAS에 대한 이해에 도움을 받을 수 있다.

- 내용의 이해를 위해 사전적으로 HTTP 프로토콜에 대한 이해가 필요하다.

  

# 각 단계

- 본문의 예시에는 검진예약에 관련한 예시가 있다.

## 0단계

- 간단히 설명하자면 **예약을 가능한 시간을 확인 하는 것**과 **예약 여부를 확인 하는 것**을 특정 엔드포인트에 대한 요청으로 가능하도록 한다. 또한 그 응답도 엔드포인트에서 얻을 수 있다.

  

## 1단계 자원(Resources)

- REST의 최종 단계를 위한 첫번째는 리소스를 도입하는 것이다.
- 검진의 예약 예시에서 검진 예약은 특정 의사에게 하게 되어 있다. 그렇다면 예약 가능 시간의 확인은 의사라는 리소스를 통해 접근하도록 한다.
- 마찬가지로 예약 여부의 확인은 예약 슬롯을 통해 확인할 수 있도록 리소스를 설정한다.
- 당연하게도 리소스의 설정은 URI로 이루어진다. (혹 왜 당연하지 싶다면 URI의 뜻이 무엇인가 찾아보자)



## 2단계 HTTP 메서드(HTTP Verbs)

- 예시를 계속 따라가 보자. 예약의 확인은 **확인**이라는 행동이며, 데이터를 조회하는 행위이다. 이에 대응하는 HTTP 메소드는 GET이다.
- 예약을 요청하는 것은 데이터를 생성하는 행위이며 이에 대응하는 HTTP 메소드는 POST이다.
- 이런 식으로 자원에 대응하는 행위를 HTTP의 메서드로 구분하는 것이 2단계이다.



## 3단계 (Hypermedia Controls)

- 3단계가 **HATEOAS**(Hypertext As The Engine Of Application State)다. 우리나라 발음으로는 보통 _''헤이티오스''_ 정도로 읽는 것 같다.
- 이때의 이 하이퍼미디어 컨트롤의 의미는 모든 행위에 대한 HTML



# 레벨의 의미

- 레벨은 REST의 단계를 의미하지는 않는다고 한다. 왜냐하면 로이 필딩은 RMM의 3단계가 REST의 전제조건이라고 했기 때문



# 참고

- 메세지 패턴 : https://www.enterpriseintegrationpatterns.com/patterns/messaging/EncapsulatedSynchronousIntegration.html