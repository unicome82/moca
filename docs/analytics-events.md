# MOCA 분석 이벤트 설계

> 4단계(국내 출시)에서 Firebase Analytics에 연동합니다. 지금은 **무엇을 언제 보낼지**만 정해 둡니다.
> 원칙: **최소한만 수집**하고, 개인을 알아볼 수 있는 값이나 자유 입력 문구는 보내지 않습니다.

## 이 이벤트로 답할 질문 (4단계 지표)

| 질문 | 쓰는 이벤트 |
|---|---|
| 어떤 덱이 인기인가 | `deck_open`, `card_draw` |
| 어떤 테마가 인기인가 | `theme_change`, 사용자 속성 `theme` |
| 라이어게임을 끝까지 하는가 | `liar_game_start` → `liar_game_complete` |
| 카드를 공유하는가 | `share_card` |
| 다시 오는가 | Firebase 자동 수집 (`first_open`, `session_start`) |

## 이벤트

| 이벤트 | 보내는 시점 | 매개변수 | 코드 위치 |
|---|---|---|---|
| `deck_open` | 홈에서 덱 화면으로 들어갈 때 | `deck_id` | `useScreenNavigation`의 `navigate` (대상: `ice`, `solution`, `balance`, `liar-setup`) |
| `card_draw` | 카드를 뒤집어 내용을 볼 때 | `deck_id`, `card_id` | `useCardDraw`의 `revealCard` |
| `theme_change` | 사용자가 테마를 바꿀 때 | `theme_id`, `previous_theme_id` | `useThemeSettings`의 `changeTheme` |
| `liar_game_start` | 라이어게임을 시작할 때 | `category_id`, `player_count` | `useLiarGame`의 `startGame` |
| `liar_game_complete` | 제시어 공개(`keyword`) 단계까지 갔을 때 | `category_id`, `player_count` | `useLiarGame`의 `revealKeyword` |
| `share_card` | 공유 시트를 열 때 (3단계 기능) | `deck_id`, `card_id` | 3단계 카드 공유 기능 |

- `liar_game_start`는 로드맵의 목록에 새로 넣었습니다. 시작 수가 없으면 완료율을 낼 수 없기 때문입니다.
- `card_draw`는 다시 뽑기(`replaceCard`)가 아니라 **카드를 뒤집을 때만** 보냅니다. 같은 카드가 두 번 세어지지 않게 하려는 것입니다.
- 새로고침으로 라이어 세션이 복원될 때는 `liar_game_start`를 다시 보내지 않습니다.

## 매개변수 값

| 매개변수 | 값 |
|---|---|
| `deck_id` | `ice`, `solution`, `balance`, `liar` (`src/data/decks.js`의 id) |
| `card_id` | 카드 id (예: `balance-001`). **언어마다 같은 id라도 다른 카드**이므로 `app_locale`과 함께 봅니다 |
| `theme_id`, `previous_theme_id` | `src/config/appConfig.js`의 `themes` (예: `shape`, `press`) |
| `category_id` | 라이어 카테고리 id (예: `food`, `animals`) |
| `player_count` | 숫자 |

- 카드 문구와 라이어 제시어는 **보내지 않습니다**. id만으로 데이터의 카드를 찾을 수 있습니다.

## 사용자 속성

| 속성 | 값 | 갱신 시점 |
|---|---|---|
| `app_locale` | `ko`, `en`, `ja`, `zh-TW` | 앱 시작, 언어 변경 |
| `theme` | 현재 테마 id | 앱 시작, 테마 변경 |

## 구현 메모 (4단계)

- `src/utils/analytics.js`에 `track(name, params)` 하나만 두고 화면 코드는 이 함수만 부릅니다.
  - 웹(개발)에서는 아무것도 보내지 않고, 앱에서만 Firebase로 보냅니다.
- 이름 규칙: 영어 소문자와 `_`, 이벤트·매개변수 이름 40자 이내 (Firebase 제한)
- 개인정보처리방침에 수집 항목을 적습니다 (위 표 그대로).
- 나중에 추가할 이벤트: `card_report` (6단계 "이 카드 이상해요" 신고 버튼)
