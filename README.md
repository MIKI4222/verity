# VERITY — Evidence Intelligence

VERITY is a development-preview React interface for the deployed ClaimVerifier GenLayer Intelligent Contract. The app reads real claims, sources, histories and assessments from Studio Dev (61997). Claim owners can prepare claim registration, source registration, verification and reassessment through the wallet-backed SDK.

**Not production verified.** No live wallet writes, fee estimates, consensus transactions or finalization flows have been tested from this frontend. Test these on Studio Dev before relying on the app. The preview network may reset and the public RPC may rate-limit requests. User authorization is enforced by the contract, not the interface.

## Run

Requires Node 20+.

```sh
npm ci
npm run dev
npm test
npm run lint
npm run build
```

For Netlify use build command `npm run build` and publish directory `dist`. The provided `netlify.toml` supplies SPA fallback routing.

## Network and contract

- Network: GenLayer Studio Dev, chain ID 61997 (`0xf22d`), RPC `https://studio-dev.genlayer.com/api`.
- SDK: `genlayer-js@2.0.0-rc.3`, `studioDevnet`.
- Existing contract: `0xa44D5A557a2B146e6aC5B8c674cA31d540d98175`.
- Contract source: https://github.com/MIKI4222/claim-verifier-genlayer
- Explorer: https://explorer-studio-next.genlayer.com/address/0xa44D5A557a2B146e6aC5B8c674cA31d540d98175

On 2026-11-13, the RPC returned chain ID 61997; `getContractSchema` exposed the documented eleven methods; `get_claim_count` returned 1. Reads of claim 1, sources, latest assessment, history and integration status returned live data. These reads do not prove the write flows work.

## Security and limitations

- Wallet credentials are never requested or stored. A submitted transaction hash is stored locally for manual recovery; do not submit a duplicate if tracking is interrupted.
- Public discovery scans IDs in batches of four and filters only loaded records. It is not a global indexed feed. Thirty-second in-memory cache may temporarily be stale; use refresh.
- Public source URLs and stored contract text are untrusted. URLs are limited to HTTP(S), and React escapes text. The contract makes the final validation decision.
- URLs and assessment outputs are stored, not source-page snapshots. Accessibility does not prove authenticity; independence is heuristic, consensus can be wrong, and confidence is not a probability.
- The frontend currently uses injected `window.ethereum`; EIP-6963-only providers, multiple-wallet behavior, mobile wallets, dialog focus management and a formal accessibility audit remain unverified.
- Status comparisons and filters are based on loaded data. Studio Dev can reset. Actual transaction fees, fee simulation accuracy, and re-evaluation can be expensive or fail.
- The design currently lacks some requested features: a source graph beyond recorded pairwise relationships, structured source/fact matrix, dashboard summary counts, sorting controls, interactive illustrative hero, and full responsive/interaction QA. Do not represent this preview as a fully completed or production-quality implementation.
