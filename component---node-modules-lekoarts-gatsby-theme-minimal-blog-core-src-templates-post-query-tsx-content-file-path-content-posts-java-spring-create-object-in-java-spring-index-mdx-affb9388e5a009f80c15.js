"use strict";(self.webpackChunkminimal_blog=self.webpackChunkminimal_blog||[]).push([[982],{4765:function(e,t,n){n.d(t,{F:function(){return d},Z:function(){return E}});var l=n(7294),r=n(8733),a=n(795),c=n(8377),i=n(6799),m=n(8871);var o=e=>{let{post:t}=e;return null};const u=["16px","8px","4px"].map((e=>"rgba(0, 0, 0, 0.1) 0px "+e+" "+e+" 0px"));var s=e=>{let{data:{post:t},children:n}=e;return(0,r.tZ)(c.Z,null,(0,r.tZ)(a.X6,{as:"h1",variant:"styles.h1"},t.title),(0,r.tZ)("p",{sx:{color:"secondary",mt:3,a:{color:"secondary"},fontSize:[1,1,2]}},(0,r.tZ)("time",null,t.date),t.tags&&(0,r.tZ)(l.Fragment,null," — ",(0,r.tZ)(i.Z,{tags:t.tags})),t.timeToRead&&" — ",t.timeToRead&&(0,r.tZ)("span",null,t.timeToRead," min read")),(0,r.tZ)("section",{sx:{my:5,".gatsby-resp-image-wrapper":{my:[4,4,5],borderRadius:"4px",boxShadow:u.join(", "),".gatsby-resp-image-image":{borderRadius:"4px"}},variant:"layout.content"}},n),(0,r.tZ)(o,{post:t}))};const d=e=>{var t,n,l;let{data:{post:a}}=e;return(0,r.tZ)(m.Z,{title:a.title,description:a.description?a.description:a.excerpt,image:a.banner?null===(t=a.banner)||void 0===t||null===(n=t.childImageSharp)||void 0===n||null===(l=n.resize)||void 0===l?void 0:l.src:void 0,pathname:a.slug,canonicalUrl:a.canonicalUrl})};function E(e){let{...t}=e;return l.createElement(s,t)}},6799:function(e,t,n){var l=n(8733),r=n(7294),a=n(1883),c=n(3494),i=n(9706);t.Z=e=>{let{tags:t}=e;const{tagsPath:n,basePath:m}=(0,c.Z)();return(0,l.tZ)(r.Fragment,null,t.map(((e,t)=>(0,l.tZ)(r.Fragment,{key:e.slug},!!t&&", ",(0,l.tZ)(a.Link,{sx:e=>{var t;return{...null===(t=e.styles)||void 0===t?void 0:t.a}},to:(0,i.Z)("/"+m+"/"+n+"/"+e.slug)},e.name)))))}},8871:function(e,t,n){var l=n(7294),r=n(1883),a=n(4232);t.Z=e=>{let{title:t="",description:n="",pathname:c="",image:i="",children:m=null,canonicalUrl:o=""}=e;const u=(0,a.Z)(),{siteTitle:s,siteTitleAlt:d,siteUrl:E,siteDescription:p,siteImage:g,author:h,siteLanguage:y}=u,b={title:t?t+" | "+s:d,description:n||p,url:""+E+(c||""),image:""+E+(i||g)};return l.createElement(l.Fragment,null,l.createElement("html",{lang:y}),l.createElement("title",null,b.title),l.createElement("meta",{name:"description",content:b.description}),l.createElement("meta",{name:"image",content:b.image}),l.createElement("meta",{property:"og:title",content:b.title}),l.createElement("meta",{property:"og:url",content:b.url}),l.createElement("meta",{property:"og:description",content:b.description}),l.createElement("meta",{property:"og:image",content:b.image}),l.createElement("meta",{property:"og:type",content:"website"}),l.createElement("meta",{property:"og:image:alt",content:b.description}),l.createElement("meta",{name:"twitter:card",content:"summary_large_image"}),l.createElement("meta",{name:"twitter:title",content:b.title}),l.createElement("meta",{name:"twitter:url",content:b.url}),l.createElement("meta",{name:"twitter:description",content:b.description}),l.createElement("meta",{name:"twitter:image",content:b.image}),l.createElement("meta",{name:"twitter:image:alt",content:b.description}),l.createElement("meta",{name:"twitter:creator",content:h}),l.createElement("meta",{name:"gatsby-theme",content:"@lekoarts/gatsby-theme-minimal-blog"}),l.createElement("link",{rel:"icon",type:"image/png",sizes:"32x32",href:(0,r.withPrefix)("/favicon-32x32.png")}),l.createElement("link",{rel:"icon",type:"image/png",sizes:"16x16",href:(0,r.withPrefix)("/favicon-16x16.png")}),l.createElement("link",{rel:"apple-touch-icon",sizes:"180x180",href:(0,r.withPrefix)("/apple-touch-icon.png")}),o?l.createElement("link",{rel:"canonical",href:o}):null,m)}},7602:function(e,t,n){n.r(t),n.d(t,{Head:function(){return i.F},default:function(){return m}});var l=n(7294),r=n(1151);function a(e){const t=Object.assign({h2:"h2",p:"p",h3:"h3",ul:"ul",li:"li",pre:"pre",code:"code",table:"table",thead:"thead",tr:"tr",th:"th",tbody:"tbody",td:"td"},(0,r.ah)(),e.components);return l.createElement(l.Fragment,null,l.createElement(t.h2,null,"객체 생성 방식에 대한 고민"),"\n",l.createElement(t.p,null,"팀 내 객체 생성 방식이 제각각인 상황을 목격하게 되었다. 프로젝트의 복잡성이 날로 증가하면서 어떠한 변경이 추가될 떄, 일관되지 않은 객체 생성 방식 때문에 수정이 번거로워 진다. 이를 어떻게 하면 일관된 방식으로 통일할 수 있을지에 대한 고민에서 이 글을 작성하게 되었다."),"\n",l.createElement(t.p,null,"단순하지만 근본적인 질문에서 시작해보자. Java로 개발할 때 객체를 어떻게 생성해야 할까? 여기서 말하는 객체가 모호하게 들린다면, 클래스의 인스턴스를 어떻게 생성할 것인가로 바꿔 생각해도 좋다."),"\n",l.createElement(t.p,null,"논의의 범위를 좀 더 구체적으로 좁혀보자면, 스프링 부트 기반의 웹 애플리케이션을 개발할 때의 객체 생성 방식에 대해 이야기해보고자 한다."),"\n",l.createElement(t.h2,null,"객체를 생성하게 되는 시점들"),"\n",l.createElement(t.h3,null,"스프링으로 개발하면서 객체를 생성하게 되는 시점 두 가지"),"\n",l.createElement(t.ul,null,"\n",l.createElement(t.li,null,"개발자가 명시적으로 의식하면서 처리하는 경우로, 주로 레이어 간 개념적인 클래스를 생성할 때이다.","\n",l.createElement(t.pre,null,l.createElement(t.code,{className:"language-java",withLineNumbers:!0,title:!0},"// 서비스 레이어에서 엔티티를 DTO로 변환하는 경우\nOrderDto orderDto = new OrderDto(order.getId(), order.getCustomerName());\n\n// 레포지토리에서 조회한 결과를 도메인 객체로 변환하는 경우\nOrder order = Order.createFrom(orderEntity);\n")),"\n"),"\n",l.createElement(t.li,null,"잘 의식하지 않고 자동화 되는 부분도 있다. 보통 프레임워크나 라이브러리에 의해 자동화되어 처리되는 경우다. 주로 외부에서 애플리케이션으로 데이터가 유입될 때 발생한다.","\n",l.createElement(t.pre,null,l.createElement(t.code,{className:"language-java",withLineNumbers:!0,title:"자동으로 객체 생성이 되는 경우"},'// HTTP 요청 바디를 객체로 변환하는 경우\n@PostMapping("/orders")\npublic ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request) {\n// Jackson이 자동으로 OrderRequest 객체 생성\n}\n\n// MyBatis resultType 매핑\n@Select("SELECT id, name, price FROM products")\nList<Product> findAll();  // MyBatis가 자동으로 Product 객체 생성\n\n// JPA 엔티티 조회\n@Entity\npublic class User {\n@Id\nprivate Long id;\nprivate String name;\n\n// JPA는 기본 생성자 필요\nprotected User() {}\n}\n')),"\n"),"\n",l.createElement(t.li,null,"이때 리플렉션의 도움을 받을 때도 있고, 생성자를 사용할 수도, 팩토리 메서드를 사용할 수도 있다."),"\n",l.createElement(t.li,null,"이러나 저러나 자바 문법 아래서 근본적으로는 생성자가 객체를 생성하는 역할을 수행한다. 따라서 생성자에 따른 생성 방식을 잘 확인해야 한다."),"\n"),"\n",l.createElement(t.h2,null,"문제는 의식하지 않는 곳에서 발생"),"\n",l.createElement(t.h3,null,"생성자를 건드리기 시작하면서 문제가 발생한다"),"\n",l.createElement(t.ul,null,"\n",l.createElement(t.li,null,"예를 들어 클래스 레벨로 ",l.createElement(t.code,null,"@Builder"),"를 선언하면 무슨 문제가 생길까. 기본 설정에서 대분 JSON 역직렬화를 위해 ",l.createElement(t.code,null,"jackson"),"이 사용된다.","\n",l.createElement(t.ul,null,"\n",l.createElement(t.li,null,"이 경우 객체 생성은 리플렉션을 위해 기본 생성자를 필요로 한다."),"\n",l.createElement(t.li,null,"빌더를 클래스 레벨로 생성하는 순간 생성자가 생기므로 기본 생성자가 사라진다."),"\n",l.createElement(t.li,null,"이러면 요청을 파싱하지 못하는 오류가 발생한다."),"\n"),"\n"),"\n",l.createElement(t.li,null,l.createElement(t.code,null,"mybatis"),"도 유사한 제약이 있다. ",l.createElement(t.code,null,"resultType"),"으로 선언된 클래스가 생성자가 없다면 쿼리의 결과 행과 멤버 변수를 꼭 일치 시켜야만 한다. 변수를 일치시키지 않게 하기 위해서는 리플렉션을 사용할 수 있도록 기본 생성자를 재공해야 한다."),"\n",l.createElement(t.li,null,"JPA 또한 ",l.createElement(t.code,null,"@Entity"),"로 선언된 객체는 매핑을 위해 반드시 기본 생성자가 필요하다."),"\n",l.createElement(t.li,null,"내가 자주 사용하는 의존성을 기준으로 생성자의 필요 여부를 간단히 정리해 보았다."),"\n"),"\n",l.createElement(t.table,null,l.createElement(t.thead,null,l.createElement(t.tr,null,l.createElement(t.th,null,"Name"),l.createElement(t.th,null,"Constructor"),l.createElement(t.th,null,"Detail"))),l.createElement(t.tbody,null,l.createElement(t.tr,null,l.createElement(t.td,null,"MyBatis"),l.createElement(t.td,null,"기본 생성자 (no-args)"),l.createElement(t.td,null,l.createElement(t.code,null,"ResultType")," 및 ",l.createElement(t.code,null,"ParameterType"),"으로 객체 전달 시 필요")),l.createElement(t.tr,null,l.createElement(t.td,null,"JPA"),l.createElement(t.td,null,"기본 생성자 (no-args), 필요한 필드를 포함한 생성자 (선택)"),l.createElement(t.td,null,l.createElement(t.code,null,"@Entity")," 클래스는 반드시 기본 생성자 필요 (",l.createElement(t.code,null,"protected")," 이상의 접근 제어자), 다른 생성자가 있더라도 기본 생성자 필수, 영속성 컨텍스트가 프록시 객체 생성 시 필요")),l.createElement(t.tr,null,l.createElement(t.td,null,"Jackson"),l.createElement(t.td,null,"기본 생성자 (no-args) 또는 @JsonCreator로 지정된 생성자"),l.createElement(t.td,null,"JSON deserialize 시 기본 생성자 필요, 또는 ",l.createElement(t.code,null,"@JsonCreator")," + ",l.createElement(t.code,null,"@JsonProperty"),"로 지정된 생성자 사용 가능")))),"\n",l.createElement(t.h3,null,"그럼 기본 생성자를 다 생성하면 되지 않나."),"\n",l.createElement(t.ul,null,"\n",l.createElement(t.li,null,"그렇다고 기본 생성자를 ",l.createElement(t.code,null,"public"),"으로 죄다 열어 주게 되면 계속해서 객체를 생성하는 방식이 왜곡되기 시작한다.","\n",l.createElement(t.ul,null,"\n",l.createElement(t.li,null,"모든 필드가 ",l.createElement(t.code,null,"null"),"인 객체에 값을 주입하기 위해 ",l.createElement(t.code,null,"setter"),"로 값을 지정하는 로직을 많이 보았을 것이다."),"\n",l.createElement(t.li,null,"이때 ",l.createElement(t.code,null,"setter"),"는 아무 의미가 없고, 단지 개발자의 편의를 위해 생성되었을 뿐이다. 필드 갯수만큼 나열되는 ",l.createElement(t.code,null,"setter")," 메서드에서는 에서는 뭐가 맞고 틀린 것인지, 값을 setter에 넘기는 것이 어떤 의미를 가지는 것인지 알기도 어렵다.","\n",l.createElement(t.pre,null,l.createElement(t.code,{className:"language-java",title:"안티 패턴: setter를 통한 객체 생성"},'Order order = new Order();  // 모든 필드 null\norder.setId(1L);\norder.setCustomerName("John");\norder.setStatus(OrderStatus.PENDING);\norder.setItems(items);\n// 어떤 필드가 필수이고 어떤 필드가 선택적인지 알 수 없음\n')),"\n"),"\n"),"\n"),"\n"),"\n",l.createElement(t.h2,null,"협업을 위한 규칙을 마련해 보자면"),"\n",l.createElement(t.h3,null,"깊게 생각하기 어렵다면 / 빌더 쓴다면 private으로 써라"),"\n",l.createElement(t.ul,null,"\n",l.createElement(t.li,null,"이펙티브 자바에서는 가장 먼저 객체 생성에 관련한 item들이 등장한다. 여기서 제안하는 두 가지 규칙을 맹목적으로 따르다 보면 대다수의 상황에서는 해결이 된다고 본다. 물론 하다보면 분명히 예외가 필요한 지점은 생기겠지만, 일단 펼쳐놓은 것을 막는 것보다 막아둔 것을 펼치는 것이 더 쉽다."),"\n"),"\n",l.createElement(t.pre,null,l.createElement(t.code,{className:"language-java",title:"권장 객체 생성 패턴"},'public class Product {\n    private final String name;\n    private final BigDecimal price;\n    private final ProductCategory category;\n\n    @Builder(access = AccessLevel.PRIVATE)\n    private Product(String name, BigDecimal price, ProductCategory category) {\n        this.name = Objects.requireNonNull(name, "상품명은 필수입니다");\n        this.price = Objects.requireNonNull(price, "가격은 필수입니다");\n        this.category = Objects.requireNonNull(category, "카테고리는 필수입니다");\n    }\n\n    // 의미있는 이름의 팩토리 메서드\n    public static Product createNewProduct(String name, BigDecimal price, ProductCategory category) {\n        return Product.builder()\n                .name(name)\n                .price(price)\n                .category(category)\n                .build();\n    }\n\n    // 특수한 상황을 위한 팩토리 메서드\n    public static Product createGiftProduct(String name, ProductCategory category) {\n        return Product.builder()\n                .name(name)\n                .price(BigDecimal.ZERO)\n                .category(category)\n                .build();\n    }\n}\n')),"\n",l.createElement(t.h2,null,"빌드를 막는 규칙이 필요"),"\n",l.createElement(t.p,null,"여러 개발자가 협업하여 지속 가능한 소프트웨어를 만들기 위해서는 명확한 컨벤션이 필요하다. 그리고 이 컨벤션은 빌드 실패라는 강제성을 가질 때만 실효성 있게 지켜질 수 있다."),"\n",l.createElement(t.p,null,"따라서 빌드 전 단계에서 수행되는 각종 검사 도구들을 통해 검증 가능한 규칙들을 마련해야 한다."),"\n",l.createElement(t.p,null,"클래스 생성은 누구나 쉽게 할 수 있고, 그에 따른 객체 생성 방식도 매우 다양하게 구현될 수 있다. 경험상 이러한 다양성에 일관된 제약을 두는 것은 결코 쉬운 일이 아니다."),"\n",l.createElement(t.p,null,"현재의 규칙이 완벽하든 그렇지 않든, 통일된 규칙의 존재는 향후 코드 수정을 용이하게 만들어 줄 것이다 (맨먼스 미신에서 언급된 '개념적 일관성'과 일맥상통한다). 끊임없는 변경과 싸우는 우리 개발자들이 객체 생성 방식을 깊이 고민하고 제약해야 하는 이유가 바로 여기에 있다."))}var c=function(e){void 0===e&&(e={});const{wrapper:t}=Object.assign({},(0,r.ah)(),e.components);return t?l.createElement(t,e,l.createElement(a,e)):a(e)},i=n(4765);function m(e){return l.createElement(i.Z,e,l.createElement(c,e))}i.Z}}]);
//# sourceMappingURL=component---node-modules-lekoarts-gatsby-theme-minimal-blog-core-src-templates-post-query-tsx-content-file-path-content-posts-java-spring-create-object-in-java-spring-index-mdx-affb9388e5a009f80c15.js.map