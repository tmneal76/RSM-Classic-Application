# Test and release gates

Run the validation suite locally from the repository root with:

```bash
npm test
```

This project uses Node's built-in test runner (`node --test`) and exercises the core validation and role-policy rules in:

- `validation.js`
- `role-policy.js`
- `test/validation.test.js`
- `test/browser-smoke.test.js`

The GitHub Actions workflow at `.github/workflows/validate.yml` runs on pushes to `main`, feature branches, and pull requests.

Current coverage includes:

- valid vs. invalid session validation
- required fields and array/consent checks
- commitment validation
- closeout approval requirements
- operating-role registry and field access rules
- invalid-role guard behavior
- browser-style offline queue handling
- service-worker install and cached fetch flow

For browser smoke testing, serve the app locally:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

Before production use, add browser-level tests for offline arrival, consent-disabled capture, reconnection, accessibility, duplicate check-in handling, and service-worker behavior.
