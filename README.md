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
- `src/hooks/`: 화면 이동, 테마·스킨 설정, 카드 뽑기, 라이어게임 상태 훅
- `src/utils/`: 브라우저 저장소와 카드 이력 처리
- `src/styles/styles.scss`: SCSS 진입점
- `src/styles/_*.scss`: 공통 요소와 화면별 스타일 부분 파일
- `public/images/heropatterns/`: 카드 패턴 SVG 및 라이선스 안내

## 폰트

외부 CDN 없이 `src/assets/fonts/`의 woff2 파일을 사용하며, `@font-face` 정의는 `src/styles/_fonts.scss`에 있습니다.

- 본문: 디바이스 기본 폰트 (Apple SD Gothic Neo, Noto Sans KR, 맑은 고딕 등, 내려받는 파일 없음)
- Gowun Dodum: Google Fonts 유니코드 범위 분할 파일 (필요한 범위만 내려받음)
- Bodoni Moda, Fraunces, Instrument Serif, Oleo Script: 라틴 서브셋
- Material Symbols Outlined: 앱에서 쓰는 아이콘만 포함한 서브셋. **새 아이콘을 쓰려면 아이콘 이름을 추가해 폰트를 다시 받아야 합니다.**
