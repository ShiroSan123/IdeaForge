/**
 * @typedef {"web" | "mobile" | "desktop" | "ai" | "gamedev" | "devtools"} IdeaCategory
 * @typedef {"portfolio" | "freelance" | "startup" | "learning"} IdeaGoal
 * @typedef {"easy" | "medium" | "hard" | "expert"} IdeaDifficulty
 * @typedef {"junior" | "middle" | "senior"} IdeaLevel
 * @typedef {"1_day" | "1_week" | "2_weeks" | "1_month" | "3_months"} TimeEstimate
 * @typedef {{ title: string, done: boolean }} IdeaTask
 * @typedef {{
 *   id?: string,
 *   title: string,
 *   description: string,
 *   difficulty: IdeaDifficulty,
 *   technologies: string[],
 *   category: IdeaCategory,
 *   time_estimate?: TimeEstimate,
 *   monetizable: boolean,
 *   goal: IdeaGoal,
 *   features: string[],
 *   architecture?: string,
 *   tasks: IdeaTask[],
 *   why_useful?: string,
 *   what_youll_learn: string[],
 *   level: IdeaLevel
 * }} Idea
 * @typedef {{
 *   level?: IdeaLevel | "",
 *   goal?: IdeaGoal | "",
 *   category?: IdeaCategory | "",
 *   timeEstimate?: TimeEstimate | "",
 *   stacks?: string[],
 *   monetizable?: boolean,
 *   seed?: number,
 *   prompt?: string
 * }} BuildIdeaParams
 * @typedef {{
 *   level: IdeaLevel | "",
 *   goal: IdeaGoal | "",
 *   category: IdeaCategory | "",
 *   timeEstimate: TimeEstimate | "",
 *   stacks: string[],
 *   monetizable: boolean
 * }} GeneratorParams
 * @typedef {{
 *   filename: string,
 *   code: string,
 *   description: string
 * }} StarterCode
 */

/** @type {Record<IdeaCategory, IdeaCategory>} */
const CATEGORY_LABELS = {
  web: "web",
  mobile: "mobile",
  desktop: "desktop",
  ai: "ai",
  gamedev: "gamedev",
  devtools: "devtools",
};

/** @type {Record<IdeaGoal, IdeaGoal>} */
const GOAL_LABELS = {
  portfolio: "portfolio",
  freelance: "freelance",
  startup: "startup",
  learning: "learning",
};

/** @type {Record<IdeaCategory, string[]>} */
const DEFAULT_STACKS = {
  web: ["React", "Node.js", "PostgreSQL"],
  mobile: ["React Native", "Firebase", "TypeScript"],
  desktop: ["Electron", "React", "SQLite"],
  ai: ["Python", "FastAPI", "OpenAI API"],
  gamedev: ["Unity", "C#", "SQLite"],
  devtools: ["TypeScript", "Node.js", "CLI"],
};

/** @type {Record<IdeaGoal, string[]>} */
const TITLE_PARTS = {
  portfolio: ["Showcase", "Forge", "Canvas", "Pulse"],
  freelance: ["Client", "Flow", "Sprint", "Studio"],
  startup: ["Launch", "Orbit", "Scale", "Pilot"],
  learning: ["Lab", "Quest", "Mentor", "Track"],
};

/** @type {Record<IdeaCategory, string[]>} */
const CATEGORY_PARTS = {
  web: ["Hub", "Board", "Portal", "Desk"],
  mobile: ["Pocket", "Go", "Wave", "Compass"],
  desktop: ["Station", "Workbench", "Console", "Panel"],
  ai: ["Mind", "Signal", "Vision", "Copilot"],
  gamedev: ["Realm", "Quest", "Loop", "Arena"],
  devtools: ["Kit", "Flow", "Ops", "Stack"],
};

/** @type {Record<IdeaLevel, IdeaDifficulty>} */
const DIFFICULTY_BY_LEVEL = {
  junior: "easy",
  middle: "medium",
  senior: "hard",
};

/** @type {IdeaLevel} */
const LEVEL_FALLBACK = "middle";
/** @type {IdeaGoal} */
const GOAL_FALLBACK = "portfolio";
/** @type {IdeaCategory} */
const CATEGORY_FALLBACK = "web";
/** @type {TimeEstimate} */
const TIME_FALLBACK = "2_weeks";
/** @type {TimeEstimate[]} */
const TIME_OPTIONS = ["1_day", "1_week", "2_weeks", "1_month", "3_months"];

/**
 * @template T
 * @param {T[]} values
 * @returns {T[]}
 */
function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

/**
 * @template T
 * @param {T[]} items
 * @param {number} index
 * @returns {T}
 */
function pickByIndex(items, index) {
  return items[index % items.length];
}

/**
 * @param {string} value
 * @returns {string}
 */
function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * @param {string[]} features
 * @returns {IdeaTask[]}
 */
function buildTasks(features) {
  return [
    { title: "Собрать требования и пользовательские сценарии", done: false },
    { title: "Подготовить каркас интерфейса и навигацию", done: false },
    ...features.slice(0, 4).map((feature) => ({
      title: `Реализовать: ${feature}`,
      done: false,
    })),
    { title: "Добавить обработку ошибок и пустые состояния", done: false },
    { title: "Подготовить README и план развития", done: false },
  ];
}

/**
 * @param {string} title
 * @param {IdeaCategory} category
 * @returns {string}
 */
function buildArchitecture(title, category) {
  const projectSlug = slugify(title) || "project";
  return `src/
  app/
  components/
  features/${category}/
  pages/
  hooks/
  lib/
  styles/
server/
  routes/
  services/
  data/
README.md
package.json

Workspace: ${projectSlug}`;
}

/**
 * @param {BuildIdeaParams} params
 * @returns {Idea}
 */
function buildIdea({
  level = LEVEL_FALLBACK,
  goal = GOAL_FALLBACK,
  category = CATEGORY_FALLBACK,
  timeEstimate = TIME_FALLBACK,
  stacks = [],
  monetizable = false,
  seed = 0,
  prompt = "",
}) {
  const actualLevel = level || LEVEL_FALLBACK;
  const actualGoal = goal || GOAL_FALLBACK;
  const actualCategory = category || CATEGORY_FALLBACK;
  const title = `${pickByIndex(TITLE_PARTS[actualGoal], seed)}${pickByIndex(CATEGORY_PARTS[actualCategory], seed + 1)}`;
  const technologies = unique([
    ...stacks,
    ...DEFAULT_STACKS[actualCategory],
  ]).slice(0, 5);
  const usePrompt = prompt.trim();
  const goalText = GOAL_LABELS[actualGoal];
  const categoryText = CATEGORY_LABELS[actualCategory];
  const features = unique([
    usePrompt
      ? `Фокус на идее: ${usePrompt.slice(0, 60)}`
      : `Главный сценарий для ${goalText}-проекта`,
    `Личный кабинет для ${actualLevel}-разработчика`,
    `${categoryText} интерфейс с понятным onboarding`,
    "Система приоритетов и планирования задач",
    monetizable
      ? "Платные тарифы или встроенная монетизация"
      : "Бесплатный старт и расширяемая архитектура",
    `Интеграция со стеком: ${technologies.join(", ")}`,
  ]).slice(0, 6);

  return {
    title,
    description: usePrompt
      ? `Проект развивает идею "${usePrompt}" в полноценный продукт с понятным MVP и следующими шагами роста. Подходит, чтобы быстро перейти от задумки к реальной реализации.`
      : `Практичный ${categoryText}-проект для цели "${goalText}", который помогает собрать сильное портфолио и при этом не выглядит учебной заготовкой.`,
    difficulty: DIFFICULTY_BY_LEVEL[actualLevel],
    technologies,
    category: actualCategory,
    time_estimate: timeEstimate || TIME_FALLBACK,
    monetizable,
    goal: actualGoal,
    features,
    architecture: buildArchitecture(title, actualCategory),
    tasks: buildTasks(features),
    why_useful:
      "Идея сочетает реалистичный scope, наглядный результат и хорошие точки для расширения. Ее удобно показывать в портфолио и развивать по шагам.",
    what_youll_learn: unique([
      technologies[0],
      technologies[1],
      "Проектирование MVP",
      "Работа с состоянием",
      "UX для продуктовых сценариев",
      monetizable ? "Подписочная модель" : "Приоритизация фич",
    ]).slice(0, 6),
    level: actualLevel,
  };
}

/**
 * @template T
 * @param {T} value
 * @param {number} [delay=250]
 * @returns {Promise<T>}
 */
function withDelay(value, delay = 250) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), delay);
  });
}

/**
 * @param {GeneratorParams} params
 * @returns {Promise<Idea[]>}
 */
export async function generateIdeas(params) {
  const baseParams = {
    level: params.level,
    goal: params.goal,
    category: params.category,
    timeEstimate: params.timeEstimate,
    stacks: params.stacks || [],
    monetizable: params.monetizable || false,
  };

  return withDelay(
    [0, 1, 2].map((seed) =>
      buildIdea({
        ...baseParams,
        seed,
      }),
    ),
  );
}

/**
 * @returns {Promise<Idea>}
 */
export async function generateRandomIdea() {
  const categories =
    /** @type {IdeaCategory[]} */ (Object.keys(CATEGORY_LABELS));
  const goals = /** @type {IdeaGoal[]} */ (Object.keys(GOAL_LABELS));
  const levels =
    /** @type {IdeaLevel[]} */ (Object.keys(DIFFICULTY_BY_LEVEL));
  const seed = Math.floor(Math.random() * 1000);

  return withDelay(
    buildIdea({
      seed,
      category: categories[seed % categories.length],
      goal: goals[(seed + 1) % goals.length],
      level: levels[(seed + 2) % levels.length],
      timeEstimate: TIME_OPTIONS[seed % TIME_OPTIONS.length],
      monetizable: seed % 2 === 0,
    }),
  );
}

/**
 * @param {string} userPrompt
 * @returns {Promise<Idea[]>}
 */
export async function generateFromPrompt(userPrompt) {
  const normalizedPrompt = userPrompt.trim();

  return withDelay(
    [0, 1].map((seed) =>
      buildIdea({
        seed,
        prompt: normalizedPrompt,
        category: CATEGORY_FALLBACK,
        goal: GOAL_FALLBACK,
        level: LEVEL_FALLBACK,
        timeEstimate: TIME_FALLBACK,
        stacks: normalizedPrompt
          .split(/[\s,]+/)
          .filter((part) => part.length > 4)
          .slice(0, 2),
      }),
    ),
  );
}

/**
 * @param {Idea} idea
 * @returns {Promise<StarterCode>}
 */
export async function generateStarterCode(idea) {
  const componentName = idea.title.replace(/[^a-zA-Z0-9]/g, "") || "IdeaApp";
  const filename = `${componentName}.tsx`;
  const code = `import { useState } from "react";

type Task = {
  title: string;
  done: boolean;
};

const initialTasks: Task[] = ${JSON.stringify(idea.tasks || [], null, 2)};

export default function ${componentName}() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (index: number) => {
    setTasks((current) =>
      current.map((task, taskIndex) =>
        taskIndex === index ? { ...task, done: !task.done } : task,
      ),
    );
  };

  return (
    <main>
      <h1>${idea.title}</h1>
      <p>${idea.description}</p>
      <ul>
        {tasks.map((task, index) => (
          <li key={task.title}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(index)}
              />
              {task.title}
            </label>
          </li>
        ))}
      </ul>
    </main>
  );
}
`;

  return withDelay(
    {
      filename,
      code,
      description:
        "Локальный стартовый шаблон компонента на React/TypeScript с базовым списком задач.",
    },
    150,
  );
}
