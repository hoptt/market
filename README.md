# 프로젝트 개요

메인 페이지
/

상품 상세 페이지
/products/[productId]
상품 등록하기
/products/new
상품 관리
/products/manage
판매 내역
/products/history/sell
구매 내역
/products/history/buy

리뷰 작성
/reviews/[productId]

내 상점
/my-shop (redirect)=> /shops/[shopId]
내 상점(상품)
/shops/[shopId]/products
내 상점(상점 후기)
/shops/[shopId]/reviews
내 상점(찜)
/shops/[shopId]/likes
내 상점(팔로잉)
/shops/[shopId]/following
내 상점(팔로워)
/shops/[shopId]/follower

채팅
/messages
1:1 채팅 방
/messages/[chatRoomId]

# Auth

supabase 에서 제공하는 Auth 기능 사용
trigger 사용하여 회원가입 시 동일한 uuid 로 shop 테이블 column 도 생성되도록 설정

# 최적화

검색창에 Throttle 적용하여 매 입력시 마다 요청이 가는것이 아닌
특정 시간이 지날때마다 요청 보내도록 최적화
※ useEffect 에서 실행되어 deps 의 inputText가 바뀔 때 마다 throttle 함수가 재생성되어
원할히 동작하지 않던 문제를 useMemo 로 감싸서 해결

Optimistic UI 로 사용자 경험 향상

인피니티 스크롤에서 목록을 불러올 때마다 불러온 모든 요소가 렌더링되어 성능에 문제 발생
Virtualized 사용하여 현재 보이는 viewport 영역만 렌더링되도록

채팅영역은 supabase 의 realtime 기능으로 DB 업데이트 감지하여 실시간 갱신되도록 설정

상품정보 영역 한번에 로딩하는것이 아닌 Parallel Routes 로 페이지 나눠서 로딩 처리하여 사용자 경혐 향상

# 배포

vercel 배포

github-actions + EC2 배포
Amazon EC2, Nginx, PM2
deploy-to-ec2.yml 파일에 설정한대로 main 에 push 될때마다 수행
따로 서버 EC2 를 만들었으므로 runs-on: self-hosted
steps 순으로 프로세스들 수행

github-actions + docker + elastic beanstalk 배포
Amazon Elastic Beanstalk, docker hub
github-actions + EC2 배포 에 비해서 정형화되고 더 쉬운 플로우

# 사이드

cypress 사용하여 E2E Test 진행
Sentry 사용하여 상세한 에러 처리
