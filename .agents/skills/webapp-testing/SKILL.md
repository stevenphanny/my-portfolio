---
name: webapp-testing
description: Test local web applications with Playwright MCP or native Playwright scripts. Use for frontend verification, UI debugging, browser screenshots, interaction checks, and console-log inspection.
license: Complete terms in LICENSE.txt
---

# Web Application Testing

Use the configured Playwright MCP tools for ordinary browser inspection and interaction. Write a native Python Playwright script only when the task needs a repeatable multi-step automation artifact or capabilities unavailable through MCP.

**Helper Scripts Available**:
- `scripts/with_server.py` - Manages server lifecycle (supports multiple servers)

Run helper scripts with `--help` first. Treat them as black boxes unless a failure requires inspection or customization.

## Decision Tree: Choosing Your Approach

```
User task -> Is the app already running?
    |-- Yes -> Use Playwright MCP reconnaissance, then interact and verify
    `-- No  -> Start it with the repository's documented command
               |-- For an interactive check, keep the server session and use MCP
               `-- For repeatable automation, use scripts/with_server.py
```

## Preferred: Playwright MCP

1. Navigate with `mcp__playwright__browser_navigate`.
2. Inspect semantic page state with `mcp__playwright__browser_snapshot`; use screenshots when visual layout matters.
3. Interact using role- or label-based tools such as `browser_click`, `browser_fill_form`, and `browser_press_key`.
4. Inspect `browser_console_messages` and network requests when debugging.
5. Re-snapshot or capture a screenshot after the action to verify the observable result.

Use the exact tool names exposed by the current Codex session; MCP prefixes can vary across installations. If the configured Playwright MCP server is unavailable, use the native-script fallback below.

## Native-script fallback: using with_server.py

To start a server, run `--help` first, then use the helper:

**Single server:**
```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```

**Multiple servers (e.g., backend + frontend):**
```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python your_automation.py
```

To create an automation script, include only Playwright logic (servers are managed automatically):
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True) # Always launch chromium in headless mode
    page = browser.new_page()
    page.goto('http://localhost:5173') # Server already running and ready
    page.wait_for_load_state('networkidle') # CRITICAL: Wait for JS to execute
    # ... your automation logic
    browser.close()
```

## Reconnaissance-Then-Action Pattern

1. **Inspect rendered DOM or semantic snapshot**:
   ```python
   from pathlib import Path
   from tempfile import gettempdir

   page.screenshot(path=str(Path(gettempdir()) / 'inspect.png'), full_page=True)
   content = page.content()
   page.locator('button').all()
   ```

2. **Identify selectors** from inspection results

3. **Execute actions** using discovered selectors

## Common Pitfall

**Don't** inspect the DOM before waiting for `networkidle` on dynamic apps.
**Do** wait for `page.wait_for_load_state('networkidle')` before inspection.

## Best Practices

- **Use bundled scripts as black boxes** - To accomplish a task, consider whether one of the scripts available in `scripts/` can help. These scripts handle common, complex workflows reliably without cluttering the context window. Use `--help` to see usage, then invoke directly. 
- Prefer Playwright MCP for one-off interactive checks
- Use `sync_playwright()` for synchronous automation scripts
- Always close the browser when done
- Use descriptive selectors: `text=`, `role=`, CSS selectors, or IDs
- Add appropriate waits: `page.wait_for_selector()` or `page.wait_for_timeout()`

## Reference Files

- **examples/** - Examples showing common patterns:
  - `element_discovery.py` - Discovering buttons, links, and inputs on a page
  - `static_html_automation.py` - Using file:// URLs for local HTML
  - `console_logging.py` - Capturing console logs during automation
