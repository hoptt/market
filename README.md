#1 프로젝트 개요
대충 프로젝트 설명~

#2 최적화
검색창에 Throttle 적용하여 매 입력시 마다 요청이 가는것이 아닌
특정 시간이 지날때마다 요청 보내도록 최적화
※ useEffect 에서 실행되어 deps 의 inputText가 바뀔 때 마다 throttle 함수가 재생성되어
원할히 동작하지 않던 문제를 useMemo 로 감싸서 해결

Optimistic UI 로 사용자 경험 향상

인피니티 스크롤에서 목록을 불러올 때마다 불러온 모든 요소가 렌더링되어 성능에 문제
Virtualized 사용하여 현재 보이는 viewport 영역만 렌더링되도록

채팅영역은 supabase 의 realtime 기능으로 DB 업데이트 감지하여 실시간 갱신되도록 설정

vercel 배포

github-actions 배포
Amazon EC2, Nginx, PM2
deploy-to-ec2.yml 파일에 설정한대로 main 에 push 될때마다 수행
따로 서버 EC2 를 만들었으므로 runs-on: self-hosted
steps 순으로 프로세스들 수행
