"use strict";(self.webpackChunkminimal_blog=self.webpackChunkminimal_blog||[]).push([[620],{4765:function(e,t,n){n.d(t,{F:function(){return s},Z:function(){return E}});var l=n(7294),a=n(8733),r=n(795),c=n(8377),i=n(6799),m=n(8871);var o=e=>{let{post:t}=e;return null};const u=["16px","8px","4px"].map((e=>"rgba(0, 0, 0, 0.1) 0px "+e+" "+e+" 0px"));var p=e=>{let{data:{post:t},children:n}=e;return(0,a.tZ)(c.Z,null,(0,a.tZ)(r.X6,{as:"h1",variant:"styles.h1"},t.title),(0,a.tZ)("p",{sx:{color:"secondary",mt:3,a:{color:"secondary"},fontSize:[1,1,2]}},(0,a.tZ)("time",null,t.date),t.tags&&(0,a.tZ)(l.Fragment,null," — ",(0,a.tZ)(i.Z,{tags:t.tags})),t.timeToRead&&" — ",t.timeToRead&&(0,a.tZ)("span",null,t.timeToRead," min read")),(0,a.tZ)("section",{sx:{my:5,".gatsby-resp-image-wrapper":{my:[4,4,5],borderRadius:"4px",boxShadow:u.join(", "),".gatsby-resp-image-image":{borderRadius:"4px"}},variant:"layout.content"}},n),(0,a.tZ)(o,{post:t}))};const s=e=>{var t,n,l;let{data:{post:r}}=e;return(0,a.tZ)(m.Z,{title:r.title,description:r.description?r.description:r.excerpt,image:r.banner?null===(t=r.banner)||void 0===t||null===(n=t.childImageSharp)||void 0===n||null===(l=n.resize)||void 0===l?void 0:l.src:void 0,pathname:r.slug,canonicalUrl:r.canonicalUrl})};function E(e){let{...t}=e;return l.createElement(p,t)}},6799:function(e,t,n){var l=n(8733),a=n(7294),r=n(1883),c=n(3494),i=n(9706);t.Z=e=>{let{tags:t}=e;const{tagsPath:n,basePath:m}=(0,c.Z)();return(0,l.tZ)(a.Fragment,null,t.map(((e,t)=>(0,l.tZ)(a.Fragment,{key:e.slug},!!t&&", ",(0,l.tZ)(r.Link,{sx:e=>{var t;return{...null===(t=e.styles)||void 0===t?void 0:t.a}},to:(0,i.Z)("/"+m+"/"+n+"/"+e.slug)},e.name)))))}},8871:function(e,t,n){var l=n(7294),a=n(1883),r=n(4232);t.Z=e=>{let{title:t="",description:n="",pathname:c="",image:i="",children:m=null,canonicalUrl:o=""}=e;const u=(0,r.Z)(),{siteTitle:p,siteTitleAlt:s,siteUrl:E,siteDescription:g,siteImage:d,author:h,siteLanguage:f}=u,Z={title:t?t+" | "+p:s,description:n||g,url:""+E+(c||""),image:""+E+(i||d)};return l.createElement(l.Fragment,null,l.createElement("html",{lang:f}),l.createElement("title",null,Z.title),l.createElement("meta",{name:"description",content:Z.description}),l.createElement("meta",{name:"image",content:Z.image}),l.createElement("meta",{property:"og:title",content:Z.title}),l.createElement("meta",{property:"og:url",content:Z.url}),l.createElement("meta",{property:"og:description",content:Z.description}),l.createElement("meta",{property:"og:image",content:Z.image}),l.createElement("meta",{property:"og:type",content:"website"}),l.createElement("meta",{property:"og:image:alt",content:Z.description}),l.createElement("meta",{name:"twitter:card",content:"summary_large_image"}),l.createElement("meta",{name:"twitter:title",content:Z.title}),l.createElement("meta",{name:"twitter:url",content:Z.url}),l.createElement("meta",{name:"twitter:description",content:Z.description}),l.createElement("meta",{name:"twitter:image",content:Z.image}),l.createElement("meta",{name:"twitter:image:alt",content:Z.description}),l.createElement("meta",{name:"twitter:creator",content:h}),l.createElement("meta",{name:"gatsby-theme",content:"@lekoarts/gatsby-theme-minimal-blog"}),l.createElement("link",{rel:"icon",type:"image/png",sizes:"32x32",href:(0,a.withPrefix)("/favicon-32x32.png")}),l.createElement("link",{rel:"icon",type:"image/png",sizes:"16x16",href:(0,a.withPrefix)("/favicon-16x16.png")}),l.createElement("link",{rel:"apple-touch-icon",sizes:"180x180",href:(0,a.withPrefix)("/apple-touch-icon.png")}),o?l.createElement("link",{rel:"canonical",href:o}):null,m)}},6725:function(e,t,n){n.r(t),n.d(t,{Head:function(){return i.F},default:function(){return m}});var l=n(7294),a=n(1151);function r(e){const t=Object.assign({h2:"h2",p:"p",h3:"h3"},(0,a.ah)(),e.components);return l.createElement(l.Fragment,null,l.createElement(t.h2,null,"개발이라는 단어의 의미"),"\n",l.createElement(t.p,null,"개발이라는 단어가 내개 주는 의미는 어떻게 변화해 왔을까. 줄곧 이런 글을 언젠가 적어보리라 생각했지만, 글의 파편만 남겨둔채 5년이 흘렀다. 마침 연초부터 무척이나 합류하고 싶었던 커뮤니티인 글또의 지원서에 삶의 지도를 제출하게끔 되어 있어 겸사겸사 적어보고자 한다."),"\n",l.createElement(t.h2,null,"개발이 마법 인줄 알았던 시작"),"\n",l.createElement(t.p,null,'나는 경제학과를 졸업한 문과생 이었다. 때문에 원래 하던 일을 그만두고 개발 직무로 면접 때마다 나에게 돌아온 질문은 "왜 개발자가 되려고 하나요?" 였다. 나는 항상 "개발에 줄곧 관심이 있었습니다." 라는 류의 대답을 했다. 사실 더 정확한 표현으로 나는 그냥 개발을 해보고 싶었다. 그것이 설령 막연한 어떤 이미지라도 나는 개발이란 것을 내가 할 수 있었으면 좋겠다고 느꼈다. 그때는 개발 일이라는 것을 해본적도 없었으니 그런 느낌이라는 것이 맞는 것 같다.'),"\n",l.createElement(t.p,null,"개발이 내게 주었던 느낌은 대략 '마법'과 같은 이미지 였다. 영화 소셜 네트워크 속에서 저커버그는 술 마시고 홧김에 페이스북을 만든다. 제시 아이젠버그의 그럴듯한 너드 이미지와 천재성이 부각되며 개발자는 마법사와 같은 존재로 다가왔다. 여기에 더해 마케팅 직무로 일했던 첫 회사에서는 하나뿐인 개발자에게 요구 사항을 직접 전달하지 말고 모두 취합해서 전달하도록 했다. 함부로 다가가지도 요구하지도 못하는 그런 존재가 개발자였던 것이다. 아는 형의 창업을 도와줄 때는, 워드프레스 블로그 만드는 데에 몇천만원을 받고 알 수 없는 무엇인가를 건내는 것이 또한 개발자였다."),"\n",l.createElement(t.p,null,"나에게 개발이 그런 것이 었기 때문에 자연스럽게 역으로도 생각을 하게 되었다. 내가 개발을 할 수만 있다면, 더 맘에 드는 홈페이지로 사업을 시작할 수도 있고, 직장에서 함부로 할 수도 없는 위치가 되는 것일까. 나아가, 나도 술 먹고 홧김에 글로벌 서비스를 만들수도 있지 않을까 하는 즐거운 상상을 했다."),"\n",l.createElement(t.p,null,"마침 마케팅 직무에서는 내가 이 일을 잘할 수 없는 사람이라는 회의가 지속적으로 들고 있었다. 더 지체할 것 없이 나는 퇴사를 위해 먼저 개발을 할 수 있는 사람인지 스스로 테스트 해보기로 했다. 퇴근 하고서 생활코딩에서 게시판 만들기를 공부하며, 어려움에 봉착할 때마다 마르코 님과 향로님 그리고 수많은 개발자가 된 후기 들을 닳도록 읽고 또 읽었다. 그렇게 PHP와 mysql로 게시판을 만드는 강의를 완강하고 나는 이 정도는 할 수 있겠다고 생각했다. 팀장님께 퇴사하고 개발자로 전향해보겠노라 이야기 했고 순조로히 퇴사를 했다. 그렇게 퇴사 후, 나의 국비학원 기간이 시작되었다."),"\n",l.createElement(t.h3,null,"국비 지원 학원"),"\n",l.createElement(t.p,null,"국비 지원 학원이 개발자로서의 시작이라고 하면 지금의 내가 느끼기엔 아직 시작도 못했다고 느끼겠지만, 그 당시에는 시작이 반이니까 반쯤 온 것이라고 느꼈던 것 같다. 교육이 공식적으로 시작하기 전에 칸 아카데미의 SQL 강의를 전부 듣고, 자바의 신 이라는 책으로 자바를 사전에 공부 했다. 자바로 시작하면 개발이 어렵다는 블로그 글이나 커뮤니티의 게시글을 보았지만, 그렇게 큰 어려움은 못느꼈던 것 같다. 당연하게도 그 당시에 학원에서 요구하는 개발의 수준이 높지 않았기 때문에 그 정도 과제들을 해결해 나가는 것은 어렵지 않았다."),"\n",l.createElement(t.p,null,"다만 스프링으로 개발하는 것이 큰 문제였다. 6개월의 기간 중 자바를 3개월, JSP/Servlet을 2개월 배우고 스프링은 단 1주일을 배웠다. 아마 담당 강사 분은 스프링을 잘 몰랐던 것 같다. 그러다 보니 스프링으로 개발을 시작하는 것 자체가 큰 문제 였다. 따로 인프런 강의를 들어가며 동작하는 코드의 여러 조합으로 겨우겨우 프로젝트를 개발했다. 우여곡절 끝에 프로젝트 발표까지 진행을 하고 국비 학원의 모든 교육 기간을 마치게 되었다."),"\n",l.createElement(t.h3,null,"첫 직장에 가기까지"),"\n",l.createElement(t.p,null,"국비 학원 기간이 모두 끝나고 담당 강사님이 소감을 물었다. 나는 처음 학원에 들어왔던 시점으로 다시 돌아간 것 같다고 했다. 그때와 같은 막막함이 아직도 해소되지 않았다는 의미였다. 그 앞이 잘 보이지 않는 길을 걷는 느낌이 앞으로도 지속되리라는 것은 몰랐기 때문에 나의 배움이 아직 부족하다고만 생각했다. 더 완벽히 준비한 채로 취업을 하고 싶었다. 하지만 학원에서는 어떻게 해서든 취업을 시키려는 입장이었고 배울 수 있는 여지도 없었기에 취업 외에는 선택지가 없었다. 무엇보다 자금이 그렇게 여유롭지 않았다."),"\n",l.createElement(t.p,null,"수업은 대략 10월 말쯤에 끝났는데, 12월 까지도 학원을 일단 나가서 공부를 하는 틈틈히 이력서를 썼다. 정부 지원이기 떄문에 이력서 지원 자체가 의무 사항이었다. 당시 중견 솔루션 업체들을 주로 지원 했었는데, 모두 면접에서 탈락했다. 나에게 개발자로서 얼마나 진심인지 묻는 조직도 있었고, 조직의 결정에 따라 개발자가 아닌 직무를 수행할 것인지 묻는 기업도 있었다. 그떄마다 점점 돈이 떨어져 가던 나는 나의 신조보다는 그들이 듣고 싶은 대답을 해주려고 했고 결과적으로는 다 어긋났다. 학원 다니고 열심히만 하면 그럴듯한 회사를 갈 줄 알았던 나의 기대는 점점 무참히 깨져만 갔다."),"\n",l.createElement(t.p,null,"취업이 장기화 될 수도 있겠다는 생각에 나는 다시 학교로 돌아갔다. 학교의 도서관에서 졸업생 이용 신청을 하고 방송통신대학교에 편입해 수업을 들었다. 그렇게 첫 학기를 보내면서 슬슬 모아둔이며 이래저래 마련한 자금이 다 떨어져갈 때 쯤 다시 지원을 시작했다. 정말 어렵게 보게된 면접에서 간절함을 보였던 덕일까. 면접을 본 당일에 합격했다는 전화를 받았다. 어디로 출근을 해야하는지 등을 간략하게 전달 받으면서 왠지 벅차올랐다. 부모님께 합격 소식을 전하면서 울었던 것 같다. 그리고 생각했다. 이제 정말 개발자가 되었다고."),"\n",l.createElement(t.h2,null,"개발을 하대하는 문화"),"\n",l.createElement(t.p,null,"옛날 이야기들 처럼 개발자가 되어 행복하게 지냈답니다 하며 끝났으면 좋았겠지만 행복은 그리 오래 가지 않았다. 첫 회사는 유통 관련 SI를 주로 하는 회사 였는데 3사 백화점이 주 고객이었다. 3년 간 이런 저런 SI/SM 프로젝트를 하면서 느낀 개발과 개발자라는 단어의 의미는 나의 시작점과 사뭇 달랐다. '개발'은 아무나 하는 것, '개발자'는 어떻게든 메워지는 존재, 돈 받으면 어쨌든 해내야하는 존재 정도로 치부되는 정도의 단어였다. 정말 블로그 글에서나 보던 '개발은 아무나 한다'라는 말은 서슴없이 윗사람들의 입에서 나오는 말이었다."),"\n",l.createElement(t.p,null,"그 말에 물론 동의하지 않지만, 더 주목하고 싶은 것은 그런 말이 왜 나오느냐 하는 것이다. 가장 마지막의 프로젝트에서 이 이유에 대해 조금이나마 느낀 계기가 있었다."),"\n",l.createElement(t.p,null,"당시 백화점의 차세대 영업시스템을 개발하는 프로젝트를 했었는데, 우리 파트는 정해진 일정에 조금 앞서 개발을 끝냈다. 백화점 직원들을 대상으로 한 사용자 테스트에서도 상대적으로 좋은 평가를 받고 수정해야할 기능도 별로 나오지 않았다. 그러나 우리 회사가 담당했던 다른 파트들은 상황이 녹록치 않았다. 가장 일정이 밀리던 신입 개발자의 코드를 도와주기 위해 자리에서 코드를 보았을 때, 문제는 생각보다 심각했다. 난잡한 코드에 디버깅 자체도 쉽지가 않았다. 되게끔 만드는 것 이전에 이미 되고 있다고 판단하고 있는 기능들 조차도 문제가 있었다. 이런 지점을 말하고 근본적인 수정이 필요하다고 관리자 분들께 이야기 했지만, 이미 고객사의 컨펌이 난 영역에 대해서는 건드리지 말라는 지시만 돌아왔다. 잘못 되었음을 알고도 덮어야 하는 처지가 된 것이 나에게는 무척이나 절망스러웠다."),"\n",l.createElement(t.p,null,"지금에 와서 생각해보면 회사에서 이러한 선택은 어찌보면 당연하기도 하다. 계약 관계에서 소프트웨어를 납품하는 입장에서 납기에 이미 제공한 제품이 잘못 되었음을 제공사가 스스로 시인하면서 물리는 행위를 그리 간단히 내릴 수는 없었을 것이다. 더군다나 동작하지 않는 기능의 경중을 따져 보았을 때는 더더욱 그런 결정을 할 수 밖에 없었을 수도 있다. 만약 지금의 나에게 그런 프로젝트의 의사 결정을 맡긴다면 다른 결정을 할까? 이미 문제가 커진 시점에서는 잘 모르겠으나 확실한 것은 처음 설계와 개발의 시점부터 지속적으로 코드를 살피고 서로 싱크를 맞추어 가며 애초에 그러한 커다란 문제로 번지지 않도록 했을 것 같다."),"\n",l.createElement(t.p,null,"당시의 나는 절망스러운 현실에 대한 대응으로 이직을 선택했다. 이미 정해진 다음 프로젝트가 2년이 넘는 장기 프로젝트이며 또 여느 백화점의 특정 시스템의 차세대 개발을 한다는 것을 알았을 때, 그 시간이 어떻게 흘러갈지 너무 뻔하게 느껴졌던것 또한 이직의 트리거가 되었다. 개발자 호황기의 막차 속에 나는 라이브 커머스를 하는 회사로 이직하게 되었다."),"\n",l.createElement(t.h2,null,"기술 놀음"),"\n",l.createElement(t.p,null,"두번째 회사는 경영난으로 인해 정말 잠깐 있었지만, 강렬했던 포인트가 있다. 개발을 어떻게 하느냐가 사업의 성공을 보장하지 않는다는 것, 사업이 끝나면 개발을 할 수 없다는 것이다."),"\n",l.createElement(t.p,null,"입사부터 맥북 프로와 30인치 듀얼 모니터를 제공 받고, 인텔리제이 라이센스를 받으면서 이 것이 내가 원하던 개발환경 이라고 생각했다. Jira, Confluence 로 업무 관리가 되고 있었고, 인프라는 전체가 AWS로 관리되고 있었다. 심지어 테라폼을 가지고 구성되어 있는 것 조차도 새로운 배움의 기회라는 생각에 마음에 들었다."),"\n",l.createElement(t.p,null,"그런데 이 회사는 사실 망해가는 회사였다. 작년의 매출이 100만 원이 채 안되었는데, 라이브 커머스가 흥할 거라는 생각하나로 여러 투자금이 합쳐저 만들어진 회사였다. 회사를 다닌지 두 달만에 재정 악화로 인해 업무를 중단하고 전체 인원이 반일 근무만 하라는 통지를 받았다. 이로부터 한 달 정도 이 후에는 폐업 통보를 받았고, 아직 지급하지 못한 급여는 추후 자금 사정이 개선되는 대로 지급한다는 이야기를 들었다. 이 사이에 나는 다시 회사를 구해야 했다."),"\n",l.createElement(t.p,null,"회사가 망하면 개발이고 뭐고 없다라는 것과 개발자의 입장에서 옳다고 생각하는 선택을 하는 것이 반드시 사업의 성공을 보장하는 것이 아니라는, 너무나 당연한 사실들을 나는 이때 몸으로 깨달아야만 했다. 개발은 마법이 아니었고 비즈니스이라는 주인이 따로 있었다. 비즈니스를 간과한 선택은 어쩌면 기술 놀음일 수도 있겠다고 강하게 느꼈다. 이 반향으로 나는 이 다음 회사의 재정적인 안정성을 가장 중요한 포인트로 고려하여 이직하게 되었다."),"\n",l.createElement(t.h2,null,"비슷한 환경과 다른 선택"),"\n",l.createElement(t.p,null,"한창 이직을 준비할 때 5년차 개발자 모집 글을 보면서 도대체 5년차 쯤 되면 나도 자격 요건을 다 갖추는 사람이 되는 걸까 생각했는데 꼭 그런 것은 아니었다. 5년 차만 뽑으면 나같은 사람은 언제나 저런 회사에 가보나 싶기도 했다. 그런 순간들이 엊그제 같은데 이제 내가 5년이 지나 6년차 개발자가 되었다. 6년차가 되었는데 나는 아직 채용공고가 원하는 완벽함과는 거리가 멀다고 느낀다. 다만 내가 보낸 실패의 시간들이 시행착오의 일부였다는 것을 미약하게나마 느낀다. 나의 개발은 무엇이 달라졌는가."),"\n",l.createElement(t.p,null,"지금 회사는 카드사의 결제 앱과 스팸 알림 서비스를 모두 운영하는 회사이다. 결제에 관련된 회사 답게 망 분리 환경과 각종 보안 규제 등으로 업무 상의 제약이 많다. 실물은 하나 없이 IT 서비스 만으로 사업을 영위하는 여기서는 이전과 매우 다른 환경일까 싶을수도 있다. 하지만 여기서도 개발은 업신 여겨지는 경우가 더러 있고, 사업에 휘둘리는 것은 마찬가지인 것 같다. 다만 한 가지 다른 것은 이에 대응 하는 내 모습이다. 그간 겪은 5년 정도의 시행착오가 이 문제들의 해결책으로 또 다른 이직을 하는 것이 아닌, 무엇인가 해볼 수 있는 여지를 만들어 주는 것 같다."),"\n",l.createElement(t.p,null,"이를 테면 개발 환경 구성의 경험이 그 예라고 할 수 있겠다. 지금 회사에 처음 입사했을 때, 팀원들은 로컬 개발 환경에서 런타임 테스트를 해보지 않았다. 아예 로컬에서 실행하려는 시도가 없었다. 폐쇠망이라고는 하지만 프로그램의 런타임을 한번도 돌려보지 않고 공용 개발 서버에서 테스트 하는 것은 굉장히 비효율적이라 느꼈다. 로컬에서 실행할 떄마다 마주하는 에러들을 하나 둘 처리하고, 각 보안 솔루션의 담당자들에게 물어물어 가며 결국 로컬에서 실행되도록 환경을 구성했다. 그렇게 내가 담당하고 있는 파트는 전부 로컬에서 외부 연동 서비스를 제외한 부분의 개발이 가능하게 되었다."),"\n",l.createElement(t.p,null,"또 현재의 쇼핑몰 운영을 하며 브랜치 관리나 테스트 코드, 코드 리뷰, 일일 스크럼, 회고 등을 하나씩 도입해보고 있다. 과거에도 분명 어지러운 코드와 서로 공유되지 않는 업무 등으로 인해 효율적으로 업무가 되지 않았던 때가 있었는데, 이에 대한 개선 방식을 하나 둘 씩 적용해 볼 수 있게 된 것이다. 물론 이 항목들 자체가 정답처럼 꼭 들어 맞는 것은 아니지만 현재의 조직에 맞추어 가는 경험 또한 해 나가고 있다."),"\n",l.createElement(t.p,null,"개발의 의미를 이제는 스스로 만들어 가고 있는 셈인 것 같다. 이제는 개발이 마법도 아니고, 아무나 하는 것도 아니고, 비즈니스에 종속적이기 만한 무엇이 아니라 함께 가치를 코드로 만들어 가는 행위 전반에 대한 것이라고 생각히고 있다."),"\n",l.createElement(t.h2,null,"평생의 업"),"\n",l.createElement(t.p,null,"개발이라는 나에게 어떤 의미인지를 돌아보는 것만으로 개발자로서 나의 위치가 어디인지 어느 정도 가늠해 볼 수 있었던 것 같다. 개발은 이제 나에게 평생의 업이라고 어렴풋이 느낀다. 그렇기에 나 스스로 생각하는 개발의 의미 또한 앞으로 무수히 변해갈 것이다. 앞으로 시간이 지나면서 또 어떻게 나의 생각이 바뀌어 갈지, 지금까지의 생각의 여정 다음을 또 기대해 본다."),"\n",l.createElement(t.p,null,"긴 시간을 쓰려다 보니 생략된 것들이 많다. 남은 이야기들은 또 하나 둘 다른 글로 적어보기로 하며 여기서 이만 줄인다."))}var c=function(e){void 0===e&&(e={});const{wrapper:t}=Object.assign({},(0,a.ah)(),e.components);return t?l.createElement(t,e,l.createElement(r,e)):r(e)},i=n(4765);function m(e){return l.createElement(i.Z,e,l.createElement(c,e))}i.Z}}]);
//# sourceMappingURL=component---node-modules-lekoarts-gatsby-theme-minimal-blog-core-src-templates-post-query-tsx-content-file-path-content-posts-guletto-life-map-as-a-developer-index-mdx-f8268a8f54e66a939be1.js.map