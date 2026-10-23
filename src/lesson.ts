import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 39,
  title: "Human Approval Across Messaging Channels",
  description: "Some decisions take longer than an HTTP request can remain open. A reviewer may approve a sensitive action later through Slack, Teams, or an email review link.",
  concepts: ["Authenticate messaging-channel callbacks", "Check timestamp and action bindings", "Deduplicate the decision outbox"],
  scope: "Signs and verifies a synthetic local callback with an ephemeral demo key. No Slack, Teams, or email message is sent. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Verify a signed callback", "input": {"decision": "allow", "tampered": false, "ageSeconds": 30}, "expected": "passed", "checks": {"outboxJobs": 1}}, {"id": "1", "label": "Reject a tampered callback", "input": {"decision": "allow", "tampered": true, "ageSeconds": 30}, "expected": "rejected", "checks": {"outboxJobs": 0}}, {"id": "2", "label": "Reject an expired callback", "input": {"decision": "deny", "tampered": false, "ageSeconds": 600}, "expected": "rejected", "checks": {"outboxJobs": 0}}],
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
