# C39 · Human Approval Across Messaging Channels

Signs and verifies a synthetic local callback with an ephemeral demo key. No Slack, Teams, or email message is sent. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Student pages

- [What you will learn](https://github.com/luiscoco/Udemy-claude-managed-agents-lesson-c39-app/blob/main/public/guide.html#learning)
- [How to run this application](https://github.com/luiscoco/Udemy-claude-managed-agents-lesson-c39-app/blob/main/public/guide.html#run-guide)
- [Architecture, UML sequence diagram and code walkthrough](https://github.com/luiscoco/Udemy-claude-managed-agents-lesson-c39-app/blob/main/public/architecture.html)
- [Application lab source](https://github.com/luiscoco/Udemy-claude-managed-agents-lesson-c39-app/blob/main/public/index.html)
- [Sequence diagram](https://github.com/luiscoco/Udemy-claude-managed-agents-lesson-c39-app/blob/main/public/architecture.svg)

These GitHub links open source files. Start the Node application to use the rendered pages and navigation buttons. GitHub Pages cannot run this application's backend.

## Concepts students will learn

- Authenticate messaging-channel callbacks
- Check timestamp and action bindings
- Deduplicate the decision outbox

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3039`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3039
```

The snapshot below uses the current local file's variable names. Every non-PORT value, including IDs, is redacted **before** rendering the image.

![Sanitized local .env configuration](docs/images/env-redacted.png)

Regenerate it locally with `python scripts/capture-env-example.py` after installing Python Playwright and its Chromium browser. This optional documentation tool is not needed to run the app.

## How the application was developed

The browser collects inputs; the Node host validates requests; the lesson implementation produces observable evidence. The architecture page walks through the real source with numbered steps, prerequisite configuration, source filenames and code excerpts.

### Lesson implementation

[src/lesson.ts](https://github.com/luiscoco/Udemy-claude-managed-agents-lesson-c39-app/blob/main/src/lesson.ts)

```typescript
  async run(input) {

const decision=text(input,"decision");if(!["allow","deny"].includes(decision))throw new Error("Select allow or deny");
const {createHmac,timingSafeEqual,randomBytes}=await import("node:crypto");const secret=randomBytes(32),timestamp="1700000000";
const body=JSON.stringify({workspace:"demo",user:"reviewer",action:"sevt_write",decision});
const sign=(raw:string)=>createHmac("sha256",secret).update(`v0:${timestamp}:${raw}`).digest();
const expected=sign(body),received=sign(flag(input,"tampered")?body+"tamper":body);
const valid=number(input,"ageSeconds")>=0&&number(input,"ageSeconds")<=300&&timingSafeEqual(expected,received);
return report(valid?"passed":"rejected",valid?"Verified and queued one synthetic decision":"Callback authentication or freshness failed",{outboxJobs:valid?1:0,delivery:"not sent",protocol:"synthetic Slack-style signature",secretLogged:false},["Verify the raw body signature","Enforce the freshness window","Bind reviewer and pending action","Claim a unique local outbox record"]);

  }
};
```

Read the architecture page for the remaining source excerpts and explanations, including input handling and optional provider behavior. The diagram describes this application, rather than implying that an external integration has been implemented.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
