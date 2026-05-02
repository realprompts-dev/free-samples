# Claude Code Prompt Pack: Free Sample

Five prompts pulled verbatim from the full pack of fifty. One per category,
chosen for being the most generally useful across stacks and seniority levels.

Each entry follows the source format: title, use case, prompt body, and the
single-line "why it works" explanation.

---

## 1. Debugging and root-cause analysis

### 1.1 Reproduce-first bug triage

**Use case:** a bug ticket landed, you have a stack trace and a vague repro.

**Prompt:**
```
I have a bug to investigate. Before proposing any fix, I want you to reproduce
it locally.

Bug report: {paste_bug_report_or_stack_trace}
Suspected entry point: {file_path}

Step 1: use Read on {file_path} and Grep to map every call site of the
failing function. Do not edit anything yet.
Step 2: write a minimal failing test in {test_dir} that captures the bug.
Run it with `{test_command}` and confirm it fails for the right reason
(not import errors, not flakiness).
Step 3: only after the test fails as expected, list the three most likely
root causes ranked by evidence from the code, not from intuition.

Stop after step 3. I will tell you which hypothesis to pursue.
```

**Why it works:** forcing a failing test before any hypothesis prevents Claude from "fixing" by deleting the symptom.

---

## 2. Refactoring and code quality

### 2.1 Extract function with safety net

**Use case:** a 200-line function you want to split without breaking callers.

**Prompt:**
```
Refactor by extraction, with a test safety net.

Target: {function_name} in {file_path}, lines {start}-{end}.
Goal: extract into smaller named functions; no behavior change.

Rules:
- Step 1: before any edit, run `{test_command}` and paste the result.
  If tests do not currently pass, stop and tell me.
- Step 2: read the target plus every direct caller (use Grep on the symbol
  name). Summarize the function's responsibilities in numbered bullets.
- Step 3: propose a split (function names, signatures, what each owns).
  Wait for my "go".
- Step 4: after approval, use Edit to perform the split in one pass.
  Re-run `{test_command}` and paste the result.
- Step 5: if any test fails, revert with `git checkout -- {file_path}`
  and report what broke.

Do not touch anything outside {file_path} unless I explicitly approve.
```

**Why it works:** the explicit revert path means a botched edit can't quietly compound.

---

## 3. Code review and PR feedback

### 3.1 First-pass review of an unfamiliar PR

**Use case:** you got assigned a review on code you've never seen.

**Prompt:**
```
Help me do a first-pass review of {pr_branch} against {base_branch}.

Use Bash to run:
- `git fetch origin {base_branch} {pr_branch}`
- `git diff origin/{base_branch}...origin/{pr_branch} --stat`
- `git log origin/{base_branch}..origin/{pr_branch} --oneline`

Then for each file in the diff:
1. Read the full file (not just the hunk).
2. Identify the change's intent in one sentence.
3. Flag: untested logic, broadened public surface, new dependency, schema
   change, security-sensitive area (auth, crypto, IO, eval, deserialization),
   silent behavior change.

Output a markdown review comment grouped by severity: Blocking, Should-fix,
Nit. Each comment must cite file:line and propose either a concrete fix or
a question. No "consider improving" without a concrete suggestion.
```

**Why it works:** reading the full file (not just the hunk) is what catches the half of bugs that diffs hide.

---

## 5. Testing — unit, integration, TDD

### 5.1 Strict TDD loop with Claude as the green light

**Use case:** you want to enforce red-green-refactor for a new feature.

**Prompt:**
```
We are doing strict TDD for: {feature_description}.

Workflow we will follow, no shortcuts:
1. I describe the next behavior in one sentence.
2. You write ONE failing test in {test_file}. Run `{test_command}`.
   Show me the failure output. The test must fail for the RIGHT reason
   (not import error, not syntax).
3. I say "go". You write the minimum code in {impl_file} to make it pass.
   Run `{test_command}`. Show output.
4. You propose a refactor or say "no refactor needed". I approve.
5. Loop back to step 1.

Rules:
- Never write more than one new test per cycle.
- Never write implementation before the test fails for the right reason.
- If tests pass after step 2 without code change, the test is wrong; rewrite it.
- Use Edit, never Write. We are amending files, not replacing them.

Acknowledge the rules and ask me for the first behavior.
```

**Why it works:** "fail for the right reason" is the test of whether the test actually exercises the new behavior.

---

## 7. Security and vulnerability spotting

### 7.1 Audit a route for OWASP top issues

**Use case:** you're shipping a new HTTP route and want a focused review.

**Prompt:**
```
Security review of {route_path} ({http_method}) handled in {handler_file}.

Read the handler, all middleware in the chain, and any helper it calls
(use Grep to follow).

For each item below, cite file:line if applicable, or "not relevant" with
one-sentence reason:

1. Authentication: who can call this? Is the check before any side effect?
2. Authorization: object-level checks (this user can act on this
   {resource_id})?
3. Input validation: schema, length limits, type, on every field.
4. Injection: SQL, NoSQL, shell, ORM raw, eval, header injection,
   template injection.
5. Output encoding: any user data reflected back? in HTML/JSON/headers?
6. Server-side request forgery: any URL or hostname comes from input?
7. File handling: paths from input, traversal, type sniffing.
8. Rate limiting / abuse: any per-user or per-IP cap?
9. Logging: what gets logged? any secrets, tokens, PII?
10. Error handling: stack traces leaking? error messages reveal internals?

Output blocking findings first, then advisory, then "looks fine" notes.
```

**Why it works:** the explicit list of 10 with "not relevant" required as an answer means nothing gets silently skipped.

---

45 more prompts in the full pack: realpromptsdev.gumroad.com/l/claude-code-prompts
