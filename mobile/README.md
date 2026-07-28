# Say Ra — mobile app

React Native (**Expo SDK 54**) app for Say Ra, a multilingual (RU/KZ/JA/EN) speech-therapy
app for children. Ported from the interactive HTML prototype in `design-reference/`,
wired to the NestJS API in `../backend`.

> Pinned to SDK 54 (RN 0.81, React 19.1) to stay compatible with Expo Go 54.x. Don't run
> `npx expo install --fix` after bumping `expo` unless you intend to move SDKs — verify
> the target Expo Go supports it first.

## Setup

```bash
npm install
cp .env.example .env   # then point EXPO_PUBLIC_API_URL at your backend
npx expo start
```

`EXPO_PUBLIC_API_URL` must be reachable **from the device running the app**:

| Target              | Value                       |
| ------------------- | --------------------------- |
| Web / iOS simulator | `http://localhost:3000`     |
| Android emulator    | `http://10.0.2.2:3000`      |
| Physical device     | `http://<your-LAN-IP>:3000` |

The backend must be running (`cd ../backend && npm run start:dev`) and seeded
(`npx prisma db seed`).

## Structure

```
src/
  app/            expo-router routes
    (auth)/       login + signup
    (onboarding)/ add-child, who-is-practicing
    (tabs)/       aac, exercises, pronunciation, therapists, profile
  api/            axios client (auth header + 401 refresh retry) and per-domain modules
  components/     shared UI (Button, ListCard, AvatarCircle, sheets, …)
  content/        client-side content the backend doesn't serve
  hooks/          TanStack Query wrappers + shared screen logic
  i18n/           i18next setup + RU/KZ/JA/EN string catalogs
  store/          zustand: auth session (SecureStore), active child (AsyncStorage)
  theme/          design tokens taken from the prototype
  types/          client mirrors of the Prisma models
  utils/          localized-field picker, tint/avatar derivation, week bucketing
```

## Notes on behavior

- **Language** — `user.language` drives both the UI locale (i18next) and which
  `{field}{Lang}` column is read from API content. Changing it in Profile does both.
- **Auth** — access/refresh tokens are stored in the OS keychain via `expo-secure-store`
  on native; web falls back to AsyncStorage since SecureStore has no web implementation.
  A 401 triggers one refresh + retry, then forces logout.
- **Listen and Point** — each `Exercise` under the `listen-and-point` type is one quiz
  question (with `optionImages`), so the quiz runs them in `order` as a 10-question round.
- **Not implemented** (no backend support): therapist booking, password change, push
  notifications, and dark mode. The Settings toggles for notifications/theme are
  deliberate visual stubs.
- **Icons** — the prototype had no icon assets, so flat colored blocks
  (`IconPlaceholder`) stand in until real artwork is supplied.

## External API keys

TTS (`/aac/tts`) and pronunciation transcription need a working `OPENAI_API_KEY`, and the
AI assistant + pronunciation grading need a valid `ANTHROPIC_API_KEY` — both in the
**backend's** `.env`. Without them those three features return 500s from the server; the
app surfaces an error state rather than crashing.
