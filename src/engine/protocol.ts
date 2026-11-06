import { PROTOCOLS } from "@/data/protocols";
import { chrono } from "./chrono";
import { describeBalance, readBalance } from "./pulse";
import { readTongue } from "./tongue";
import {
  CONTROLS,
  ELEMENT_LABEL,
  MOTHER,
  type Element,
  type EngineInput,
  type EngineOutput,
  type Protocol,
  type ProtocolPoint,
} from "./types";

/**
 * Pulse + tongue + today's priorities + age + history + time → one protocol,
 * points in order, each with its own timer. Every step explains itself.
 *
 * Amina's rules live here as decision trees; this is the PLACEHOLDER tree.
 */
export function runEngine(input: EngineInput): EngineOutput {
  const reasoning: string[] = [];
  const balance = readBalance(input.pulse);
  const tongue = readTongue(input.tongue);
  const time = chrono(input.when);

  reasoning.push(`Pulse: ${describeBalance(balance)}`);

  // 1. Which element is out of balance
  let focus: Element = balance.weakest;
  let action: Protocol["action"] = "tonify";
  if (balance.gap >= 1.2 && balance.scores[balance.strongest] > 1.0) {
    // Excess dominates: sedate the strong one if it controls the weak one
    if (CONTROLS[balance.strongest] === balance.weakest) {
      reasoning.push(
        `${ELEMENT_LABEL[balance.strongest]} is over-acting on ${ELEMENT_LABEL[balance.weakest]} (control cycle). Support ${ELEMENT_LABEL[balance.weakest]}, ease ${ELEMENT_LABEL[balance.strongest]}.`,
      );
    }
  }
  if (balance.gap < 0.6) {
    reasoning.push("Pulses are close to even; today's priority leads the choice.");
  }

  // 2. Tongue confirms or questions
  const verdict = tongue.agreesWith(focus);
  if (verdict === "confirms") reasoning.push(`Tongue confirms: ${tongue.pattern}.`);
  else if (verdict === "questions") {
    reasoning.push(`Tongue questions the pulse: ${tongue.pattern}. Pulse leads; tongue noted.`);
  } else reasoning.push(`Tongue: ${tongue.pattern}.`);

  // 3. Today's priority: the client's first-ranked goal
  const firstGoal = input.intake.priorities[0];
  const goalProtocol = PROTOCOLS.find((p) => p.id === firstGoal);
  const elementProtocols = PROTOCOLS.filter((p) => p.focus === focus);

  let protocol: Protocol;
  if (goalProtocol && (balance.gap < 0.6 || goalProtocol.focus === focus)) {
    protocol = goalProtocol;
    reasoning.push(`Client asked for "${goalProtocol.goal}", which matches the pulse.`);
  } else if (elementProtocols.length) {
    protocol = elementProtocols[0];
    reasoning.push(
      `Pulse points to ${ELEMENT_LABEL[focus]}; "${protocol.goal}" protocol chosen${
        goalProtocol ? ` (client asked for "${goalProtocol.goal}", folded in below)` : ""
      }.`,
    );
  } else {
    protocol = goalProtocol ?? PROTOCOLS[0];
  }
  action = protocol.action;

  // 4. Mother–son rule: a deficient element is also fed through its mother
  const mother = MOTHER[protocol.focus];
  if (action === "tonify") {
    reasoning.push(`Tonify ${ELEMENT_LABEL[protocol.focus]}; its mother ${ELEMENT_LABEL[mother]} is included where a point is available.`);
  }

  // 5. Adjust for what worked last time
  let points: ProtocolPoint[] = [...protocol.points];
  const last = input.history[0];
  if (last && last.focus === protocol.focus) {
    const drop = last.openingReading - last.closingReading;
    if (drop / Math.max(last.openingReading, 1) > 0.3) {
      points = points.map((p) => ({ ...p, seconds: Math.max(10, p.seconds - 5) }));
      reasoning.push(`Last ${protocol.goal.toLowerCase()} session settled well (${last.openingReading} → ${last.closingReading}); point timers shortened by 5 s.`);
    } else {
      reasoning.push(`Last session on the same focus settled modestly; timers kept at full length.`);
    }
    if (last.pointLogs) {
      const slow = last.pointLogs.filter((l) => (l.secondsToSettle ?? 0) > 25).map((l) => l.code);
      if (slow.length) {
        points = points.map((p) => (slow.includes(p.code) ? { ...p, seconds: p.seconds + 10 } : p));
        reasoning.push(`${slow.join(", ")} took longest to settle last time; given 10 s more today.`);
      }
    }
  }

  // 6. If the client's goal differs from the pulse focus, fold in one point from it
  if (goalProtocol && goalProtocol.id !== protocol.id) {
    const extra = goalProtocol.points.find((p) => !points.some((q) => q.code === p.code));
    if (extra) points = [...points, { ...extra, seconds: Math.min(extra.seconds, 20) }];
  }

  // 7. Age: gentler intensity over 70
  if (input.intake.age >= 70) {
    points = points.map((p) => ({ ...p, intensity: Math.max(1, p.intensity - 1) as ProtocolPoint["intensity"] }));
    reasoning.push("Age over 70: intensity lowered one step on every point.");
  }

  // 8. Chrono: if the focus organ is at its peak now, shorten; if at its dip, lengthen
  if (time.peakElement === protocol.focus) {
    points = points.map((p) => (p.element === protocol.focus ? { ...p, seconds: Math.max(10, p.seconds - 5) } : p));
    reasoning.push(`${time.peakOrgan} peaks this hour: ${ELEMENT_LABEL[protocol.focus]} points need less time.`);
  } else if (time.dipElement === protocol.focus) {
    points = points.map((p) => (p.element === protocol.focus ? { ...p, seconds: p.seconds + 5 } : p));
    reasoning.push(`${time.dipOrgan} is at its lowest this hour: ${ELEMENT_LABEL[protocol.focus]} points given more time.`);
  } else {
    reasoning.push(time.note);
  }

  return { protocol: { ...protocol, action }, balance, reasoning, chrono: time, adjustedPoints: points };
}
