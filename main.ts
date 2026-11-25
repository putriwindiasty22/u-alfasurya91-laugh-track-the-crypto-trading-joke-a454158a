// Laugh Track: The Crypto Trading Joke Contest — one original joke line.
// The program writes the joke to /output/entry.txt (or ./output/entry.txt
// when /output is not writable), byte-identical, with no trailing newline.
// Runs on Node 22.18+ with no dependencies and no network access.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const JOKE =
  "I told my crypto portfolio I'd stop checking it every five minutes. It laughed, dumped 12%, and now I check it every four.";

const MAX_CHARS = 200;

function main(): void {
  // Gate: the entry must be UTF-8 text of 1 to 200 characters, not blank.
  const chars = [...JOKE].length;
  if (JOKE.trim().length === 0) {
    throw new Error("joke line is blank");
  }
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`joke line is ${chars} characters, must be 1-${MAX_CHARS}`);
  }

  const payload = Buffer.from(JOKE, "utf8");
  const candidates = ["/output/entry.txt", "./output/entry.txt"];
  let writtenPath: string | null = null;
  let lastError: unknown = null;
  for (const path of candidates) {
    try {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, payload);
      writtenPath = path;
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (writtenPath === null) {
    throw new Error(`could not write entry.txt: ${String(lastError)}`);
  }

  // Read it back and verify byte-identical content.
  const roundTrip = readFileSync(writtenPath);
  if (!roundTrip.equals(payload)) {
    throw new Error(`verification failed: ${writtenPath} does not match the joke line`);
  }
  console.log(`wrote ${chars} chars to ${writtenPath}`);
}

main();
