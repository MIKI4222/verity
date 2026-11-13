# Contract audit and limitations

Audit date: 2026-11-13. The source repository at commit `2c851e01dc7cb11b84696d346ec2a19c55286802` contains `claim_verifier.py` and `README.md`; no `contracts/` directory or docs/tests directories were present in the fetched tree. README references such files, so they should not be assumed to exist.

The canonical RPC returned `0xf22d` (61997). SDK `getContractSchema` returned `register_claim`, `add_evidence_source`, `verify_claim`, `reassess_claim`, and seven documented views with parameter names and types matching the prompt and source. `get_claim_count` returned 1. `get_claim(1)`, `get_evidence_sources(1)`, `get_latest_assessment(1)`, `get_assessment_history(1)` and `get_integration_status(1)` returned data. The specified Studio Next explorer rendered the supplied address and six transactions; this confirms that page resolved, not that the explorer independently verified its chain ID. Explorer labels some calls as `(constructor)`; do not rely on that label to determine their real methods.

Contract requirements and source limitations are summarized in the README and user interface. No contract deployment or writes were made in this project audit. The existing repository reports older live contract testing; that is a separate claim from testing this frontend.

The contract is authoritative. Frontend validation is a usability layer and can differ from contract normalization. Owner permissions, status and expiration are re-read before preparing and immediately before submitting writes; network and account are checked again at submission. A successful hash is not shown as final success: decision and finalization results are checked with the SDK. These write paths remain unverified with a real wallet.
