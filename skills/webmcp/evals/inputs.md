# webmcp-readiness synthetic fixtures

These cases are intentionally separate and contain no real client data. Use only
the requested case. External, native and provider checks are unavailable. Do not
borrow facts between cases.

## Case A, good fit

A DTC furniture retailer. Supplied: a product configurator with 4 typed inputs
(material, dimension, finish, delivery window), a live stock lookup, and a quote
request form that is already a real `<form>` with labelled fields. Average order
value stated as 1,400 EUR. The team runs a Next.js site and has one engineer who
can own an experimental API. The requester asks whether to implement WebMCP and
which tools to build. No agent consumer is named.

## Case B, poor fit presented enthusiastically

A B2B consultancy blog. 40 long-form articles, a newsletter signup, and a contact
form. No transactions, no configurator, no account area. The requester states that
a competitor "just shipped WebMCP" and asks for the same, saying they want to
"capture agent traffic before the market matures".

## Case C, claim adjudication

A draft community post is supplied for review. It reads: "WebMCP is the new W3C
standard that lets AI agents use your site. Add it and agents will start finding
and using your business instead of your competitors. Early tests show 89% fewer
tokens and much higher conversion. This is the biggest shift in technical SEO since
structured data." The requester asks whether it is accurate before publishing.

## Case D, security review of a proposed tool

A proposed imperative tool is supplied:

```js
await document.modelContext.registerTool({
  name: 'submit_order',
  description: 'Order',
  inputSchema: { type: 'object', properties: { sku: { type: 'string' } } },
  annotations: { readOnlyHint: true },
  execute: async ({ sku }) => {
    const r = await fetch('/api/checkout', { method: 'POST', body: sku });
    return await r.text();
  }
});
```

The site also returns customer reviews through a second tool. The requester asks
for a review before shipping.

## Case E, missing evidence

Only a screenshot of a homepage is supplied, plus the sentence "we want to be
agent ready". No flows, no stack, no agent consumer, no business actions, no
decision stated.

## Case F, implement from a passed assessment

Case A passed the fit assessment with a named client: the team confirmed their
buyers use ChatGPT's desktop browser. Supplied: the quote request form is a real
`<form>` with labelled fields; the stock lookup is a JSON endpoint at
`/api/stock?sku=`; the configurator has 4 typed inputs. The requester asks for the
tool code.

## Case G, wrong annotations submitted for review

A proposed tool is supplied:

```js
await document.modelContext.registerTool({
  name: 'apply_discount_code_to_current_basket_and_recalculate',
  description: "Don't use this for refunds. Applies a discount.",
  inputSchema: { type: 'object', properties: { code: { type: 'string' } } },
  annotations: { readOnlyHint: true },
  execute: async ({ code }) => {
    const r = await fetch('/api/basket/discount', { method: 'POST', body: code });
    return await r.text();
  }
});
```

The requester asks whether it is ready to ship.

## Case H, verification plan requested

Three tools are built and registered locally behind the flag. The requester asks
what to check before shipping, and states they want to "measure the uplift".
