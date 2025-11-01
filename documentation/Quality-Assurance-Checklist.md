## Quality Assurance Checklist

Use this checklist to evaluate whether the product is ready for release. Check each item only when it is fully satisfied.

### Planning & Requirements
- [ ] Scope is clearly defined and mapped to user stories
- [ ] Acceptance criteria are complete, unambiguous, and testable
- [ ] Non-functional requirements (performance, security, accessibility) are specified
- [ ] Feature flags and rollout plan are defined where applicable

### Design & UX
- [ ] UI matches approved designs across common breakpoints and device sizes
- [ ] Navigation flows are intuitive and consistent
- [ ] Empty, loading, and error states are designed and implemented
- [ ] Touch targets meet minimum size; gestures have clear affordances

### Accessibility (WCAG 2.1 AA)
- [ ] All interactive elements are accessible via screen readers
- [ ] Sufficient color contrast and scalable text (Dynamic Type)
- [ ] Proper labels, roles, and hints for controls
- [ ] Supports keyboard/remote navigation where relevant

### Performance
- [ ] Cold start time meets target on low-end devices
- [ ] Lists are virtualized; excessive re-renders eliminated
- [ ] Images and assets optimized (size, format, caching)
- [ ] No memory leaks; CPU/GPU/battery usage within targets

### Reliability & Offline
- [ ] Network calls have timeouts, retry, and cancellation logic
- [ ] Idempotency for critical actions (e.g., payments, order submission)
- [ ] Offline behavior defined and implemented (caching/queueing)
- [ ] Graceful error handling and user-friendly recovery paths

### Security & Privacy
- [ ] All traffic over TLS; certificate pinning if required
- [ ] Secrets not hardcoded; secure storage used for tokens/PII
- [ ] Minimal permissions requested with clear justifications
- [ ] Data retention, export, and deletion flows implemented
- [ ] Compliance checks (e.g., GDPR/CCPA) completed where applicable

### Code Quality
- [ ] Types are strict; no unsafe casts or `any` in core paths
- [ ] Lint, type-check, and format pass with zero warnings
- [ ] Modules are cohesive; no dead or duplicated code
- [ ] Public APIs documented; boundaries and responsibilities clear

### Testing
- [ ] Unit tests cover core logic and edge cases
- [ ] Integration tests validate cross-module behavior
- [ ] End-to-end tests cover critical user journeys
- [ ] Test data and environments are deterministic and isolated
- [ ] Coverage meets agreed threshold without trivial tests

### Mobile & React Native Specifics
- [ ] Platform parity verified (iOS/Android) including platform-specific UI
- [ ] Safe areas, notches, and orientation changes handled
- [ ] App lifecycle events (background/foreground/termination) handled
- [ ] Permission flows implemented with pre-prompts and fallbacks
- [ ] Deep links, push notifications, and background tasks validated

### Build, CI/CD & Release
- [ ] CI pipeline green (lint, tests, type-check, build) on main branch
- [ ] Deterministic builds; reproducible via documented commands
- [ ] App versions and build numbers incremented correctly
- [ ] Code signing configured; store assets and metadata prepared
- [ ] Release notes and migration steps documented

### Observability & Analytics
- [ ] Structured logging with PII redaction
- [ ] Crash reporting integrated and verified (e.g., test crash)
- [ ] Analytics events defined, implemented, and validated end-to-end
- [ ] Alerts and dashboards set up for key health and business metrics

### Documentation & Handover
- [ ] README includes setup, run, and troubleshooting
- [ ] Architecture overview and decision records updated
- [ ] Environment variables, secrets, and config documented securely
- [ ] Playbook for on-call/support and incident response

### Stakeholder Acceptance
- [ ] UAT completed with sign-off
- [ ] Legal/Compliance reviewed where required
- [ ] Support, marketing, and operations aligned on launch plan


