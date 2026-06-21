# rules/data-and-forms.md

## Every fetch: three states required
- **Loading** — skeleton matching content shape. Never blank or bare spinner.
- **Error** — clear message + Retry. Never swallow silently.
- **Empty** — friendly message + call to action.

## Every form
- Disable submit + show loading state while pending.
- Preserve all user input on error. Never reset.
- Inline validation errors per field.
- Clear error near submit on failure.

## Hackathon note
No real backend. Use mock async with simulated latency (`await sleep(800)`) so all states are visible during demo.
