# Test and release gates

Run the validation suite locally with:

```bash
npm test
```

The GitHub Actions workflow at `.github/workflows/validate.yml` runs on pushes to `main`, feature branches, and pull requests.

These tests cover the role-policy and validation boundaries. Before production use, add browser-level tests for offline arrival, consent-disabled capture, reconnection, accessibility, duplicate check-in protection, and device-specific service-worker behavior.
