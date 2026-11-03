# Theme styles

`../styles/styles.scss` loads base UI and game screens, then `_styles.scss`.
The theme entry point emits shared defaults before individual themes.

- `_landing-common.scss`: shared landing markup, links, copyright, focus, and reduced motion.
- `_<theme>.scss`: the theme's palette, landing design, and game-card appearance.
  Pattern, Photo, and Illustration each own their card and cover styles;
  there are no shared image/cover style files.

Each theme declares a local `$theme-palette` and passes it to `theme-colors`.
This mixin emits the `--ui-*` CSS properties consumed by shared UI.
Keep theme-specific colors in the theme file. Keep basic colors, spacing,
breakpoints, and reusable mixins in `../styles/`.

Use SCSS variables for fixed design values. Use CSS properties for inherited
theme values, random card colors, and image URLs supplied by React.

Pattern uses flex columns for the opening header and vertical deck list.
The page scrolls naturally when the deck list is open. Deck colors are fixed
by `patternDeckColors` and shared with game cards. Pattern's lettering mixin
is shared by its opening logo and game cards.

After changes, run `npm run build`. Layout changes also need browser checks
for opening/list transitions, swipe, game-card flips, short screens, and
reduced motion across the affected themes.
