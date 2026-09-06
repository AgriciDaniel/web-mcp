# Contributing

## The rule that matters here

This repository exists because most WebMCP writing is wrong. So every factual claim needs
a source, a fetch date, and an authority tier. A pull request that adds a claim
without one will be asked for it.

If the evidence does not exist, say `no data`. That is a valid and useful answer, and
it appears throughout the references already.

## What is most useful

- **Corrections.** If something here is wrong, open an issue with the source. Six
  errors were caught in an audit the day after the first draft, and they are
  documented in the changelog rather than quietly overwritten. That is the standard.
- **Re-verification after the horizon.** WebMCP moves weekly. When you re-check a
  fact, update the date in `docs/sources.md`.
- **Client coverage.** Which agent clients can call which kinds of tool is the
  fastest-moving fact in the domain and the most practically important.
- **Real deployments.** Adoption evidence is thin. A verifiable production
  deployment, with or without measured results, is worth more than another guide.

## What will be declined

- A ranking, traffic, or conversion claim without a study behind it.
- A statistic without a methodology.
- Adding a package or repository recommendation without its licence.
- Softening a `no data` into a confident-sounding hedge.

## Grading a source

Tier 1 is normative and first-party: the spec, Chrome's documentation, a browser's
own standards position. Tier 2 is first-party with a commercial interest, which must
be named. Tier 3 is independent practitioner evidence.

A vendor benchmark is Tier 2 even when its methodology is open and its results are
published. Openness is good practice; it is not independence.
