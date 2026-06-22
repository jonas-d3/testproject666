import { execa } from "execa";
import fs from "node:fs/promises";
import path from "node:path";

const repoPath = process.cwd();
const tasksDir = path.join(repoPath, "a11y-reports/plans");
const worktreesDir = path.join(repoPath, "..", ".agent-worktrees");

async function loadTasks() {
  const entries = await fs.readdir(tasksDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
}

async function sh(cmd: string, args: string[], cwd = repoPath) {
  return execa(cmd, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });
}

function slugify(file: string) {
  return file
    .replace(/\.md$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");
}

async function runTask(taskFile: string) {
  const slug = slugify(taskFile);
  const branch = `agent/${slug}`;
  const worktreePath = path.join(worktreesDir, slug);
  const taskPath = path.join(tasksDir, taskFile);

  await fs.mkdir(worktreesDir, { recursive: true });

  await sh("git", ["fetch", "origin"]);
  //await sh("git", ["branch", "-D", branch]).catch(() => {});
  /* await sh("git", ["worktree", "remove", "--force", worktreePath]).catch(
    () => {},
  ); */

  await sh("git", ["checkout", "main"]);
  await sh("git", ["pull", "--ff-only"]);
  await sh("git", ["worktree", "add", "-b", branch, worktreePath, "main"]);

  await fs.copyFile(taskPath, path.join(worktreePath, taskFile));

  const prompt = `
You are working in this repository on branch ${branch}.

Read ${taskFile} carefully.

Your job:
- Implement the task.
- Follow existing project conventions.
- Run relevant tests, linting, and type checks.
- Fix issues you introduce.
- Do not modify unrelated code.
- Commit your changes when done.

Use a clear commit message.
`;

  await sh("codex", ["exec", prompt], worktreePath);

  const status = await execa("git", ["status", "--porcelain"], {
    cwd: worktreePath,
  });

  if (status.stdout.trim()) {
    await sh("git", ["add", "."], worktreePath);
    await sh("git", ["commit", "-m", `Solve ${slug}`], worktreePath);
  }

  //await sh("git", ["push", "-u", "origin", branch], worktreePath);

  await sh(
    "gh",
    [
      "pr",
      "create",
      "--base",
      "main",
      "--head",
      branch,
      "--title",
      `Solve ${slug}`,
      "--body-file",
      taskFile,
    ],
    worktreePath,
  );
}

const tasks = await loadTasks();
await Promise.all(tasks.map(runTask));
