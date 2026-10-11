# 랜덤카드

React, Vite, SCSS로 만든 모바일 우선 랜덤카드 앱입니다.

## 로컬 실행

```bash
npm install
npm run local
```

터미널에 표시되는 주소를 브라우저에서 열어 확인합니다. 프로덕션 번들은 `npm run build`로 생성합니다.

## 프로젝트 구조

- `src/components/`: 인트로, 목록, 카드 뽑기, 라이어게임 화면
- `src/config/`: 화면 ID와 테마·스킨 설정
- `src/data/`: 덱과 카드 콘텐츠
- `src/hooks/`: 화면 이동 등 앱 동작
- `src/utils/`: 브라우저 저장소와 카드 이력 처리
- `src/styles/styles.scss`: SCSS 진입점
- `src/styles/_*.scss`: 공통 요소와 화면별 스타일 부분 파일
- `public/images/heropatterns/`: 카드 패턴 SVG 및 라이선스 안내

## 브라우저 폰트

Pretendard, Gowun Dodum, Material Symbols를 외부 CDN에서 불러옵니다. 배포 환경에서 네트워크 요청을 제한한다면 폰트를 프로젝트에 포함해 로컬에서 제공하도록 전환해야 합니다.
