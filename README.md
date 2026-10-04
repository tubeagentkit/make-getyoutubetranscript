# GetYouTubeTranscript for Make

Custom app for [Make](https://www.make.com) that wraps the [GetYouTubeTranscript](https://getyoutubetranscript.com) API.

Modules:

- **Get a Transcript** (action): transcript text for a YouTube URL or video ID, optionally with per-line timestamps.
- **Search Videos** (search): YouTube videos matching a query, with a limit and automatic paging.
- **List Channel Videos** (search): a channel's uploads, newest first, with a limit and automatic paging.
- **Make an API Call** (universal): any other endpoint from the [API docs](https://getyoutubetranscript.com/docs).

The connection takes an API key from [getyoutubetranscript.com/developers](https://getyoutubetranscript.com/developers) (free tier, no card) and is verified against the free `/credits` endpoint.

## Layout

- `src/base.json`: base URL, auth header, error messages, log sanitization
- `src/connection.*.json`: API key connection
- `src/modules/<module>.<section>.json`: module api, parameters, interface and samples
- `deploy.mjs`: creates or updates the app through the Make API (`MAKE_API_TOKEN=... node deploy.mjs`)
- `test-run.mjs`, `test-run2.mjs`, `run-scenario.mjs`, `rerun.mjs`: build and run the review test scenarios
