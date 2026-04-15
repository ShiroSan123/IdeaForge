import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Shuffle, Loader2 } from "lucide-react";

/**
 * @typedef {"web" | "mobile" | "desktop" | "ai" | "gamedev" | "devtools"} IdeaCategory
 * @typedef {"portfolio" | "freelance" | "startup" | "learning"} IdeaGoal
 * @typedef {"junior" | "middle" | "senior"} IdeaLevel
 * @typedef {"1_day" | "1_week" | "2_weeks" | "1_month" | "3_months"} TimeEstimate
 *
 * @typedef {{
 *   level: IdeaLevel | "",
 *   goal: IdeaGoal | "",
 *   category: IdeaCategory | "",
 *   timeEstimate: TimeEstimate | "",
 *   stacks: string[],
 *   monetizable: boolean
 * }} GeneratorParams
 *
 * @typedef {{
 *   onGenerate: (params: GeneratorParams) => void | Promise<void>,
 *   onRandom: () => void | Promise<void>,
 *   isLoading: boolean
 * }} GeneratorFormProps
 */

const LEVELS = [
  { value: "junior", label: "Junior" },
  { value: "middle", label: "Middle" },
  { value: "senior", label: "Senior" },
];

const GOALS = [
  { value: "portfolio", label: "Портфолио" },
  { value: "freelance", label: "Фриланс" },
  { value: "startup", label: "Стартап" },
  { value: "learning", label: "Обучение" },
];

const CATEGORIES = [
  { value: "web", label: "Веб" },
  { value: "mobile", label: "Мобильное" },
  { value: "desktop", label: "Desktop" },
  { value: "ai", label: "AI" },
  { value: "gamedev", label: "GameDev" },
  { value: "devtools", label: "DevTools" },
];

const TIME_ESTIMATES = [
  { value: "1_day", label: "1 день" },
  { value: "1_week", label: "1 неделя" },
  { value: "2_weeks", label: "2 недели" },
  { value: "1_month", label: "1 месяц" },
  { value: "3_months", label: "3 месяца" },
];

const STACKS = [
  "React",
  "Vue",
  "Angular",
  "Next.js",
  "Node.js",
  "Python",
  "Django",
  "Flask",
  "C#",
  "ASP.NET",
  "Java",
  "Spring",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "TypeScript",
  "PHP",
  "Laravel",
  "Ruby on Rails",
];

/** @param {GeneratorFormProps} props */
export default function GeneratorForm({ onGenerate, onRandom, isLoading }) {
  const [level, setLevel] = React.useState(/** @type {IdeaLevel | ""} */ (""));
  const [goal, setGoal] = React.useState(/** @type {IdeaGoal | ""} */ (""));
  const [category, setCategory] = React.useState(
    /** @type {IdeaCategory | ""} */ (""),
  );
  const [timeEstimate, setTimeEstimate] = React.useState(
    /** @type {TimeEstimate | ""} */ (""),
  );
  const [selectedStacks, setSelectedStacks] = React.useState(
    /** @type {string[]} */ ([]),
  );
  const [monetizable, setMonetizable] = React.useState(false);

  /** @param {string} stack */
  const toggleStack = (stack) => {
    setSelectedStacks((prev) =>
      prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack],
    );
  };

  /** @param {string} value */
  const handleLevelChange = (value) => {
    setLevel(/** @type {IdeaLevel} */ (value));
  };

  /** @param {string} value */
  const handleGoalChange = (value) => {
    setGoal(/** @type {IdeaGoal} */ (value));
  };

  /** @param {string} value */
  const handleCategoryChange = (value) => {
    setCategory(/** @type {IdeaCategory} */ (value));
  };

  /** @param {string} value */
  const handleTimeEstimateChange = (value) => {
    setTimeEstimate(/** @type {TimeEstimate} */ (value));
  };

  const handleGenerate = () => {
    onGenerate({
      level,
      goal,
      category,
      timeEstimate,
      stacks: selectedStacks,
      monetizable,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground font-medium">
            Уровень
          </Label>
          <Select value={level} onValueChange={handleLevelChange}>
            <SelectTrigger className="bg-secondary/50 border-border/50">
              <SelectValue placeholder="Выберите уровень" />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground font-medium">
            Цель
          </Label>
          <Select value={goal} onValueChange={handleGoalChange}>
            <SelectTrigger className="bg-secondary/50 border-border/50">
              <SelectValue placeholder="Выберите цель" />
            </SelectTrigger>
            <SelectContent>
              {GOALS.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground font-medium">
            Тип проекта
          </Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="bg-secondary/50 border-border/50">
              <SelectValue placeholder="Любой тип" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground font-medium">
            Время
          </Label>
          <Select value={timeEstimate} onValueChange={handleTimeEstimateChange}>
            <SelectTrigger className="bg-secondary/50 border-border/50">
              <SelectValue placeholder="Любое время" />
            </SelectTrigger>
            <SelectContent>
              {TIME_ESTIMATES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground font-medium">
          Технологии
        </Label>
        <div className="flex flex-wrap gap-2">
          {STACKS.map((stack) => (
            <Badge
              key={stack}
              variant={selectedStacks.includes(stack) ? "default" : "outline"}
              className={`cursor-pointer transition-all text-xs py-1 px-2.5 ${
                selectedStacks.includes(stack)
                  ? "bg-primary/20 text-primary border-primary/40 hover:bg-primary/30"
                  : "hover:bg-secondary/80 border-border/60"
              }`}
              onClick={() => toggleStack(stack)}
            >
              {stack}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
        <div>
          <p className="text-sm font-medium">Можно монетизировать</p>
          <p className="text-xs text-muted-foreground">
            Показывать только идеи с потенциалом заработка
          </p>
        </div>
        <Switch checked={monetizable} onCheckedChange={setMonetizable} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 text-base"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          Сгенерировать идеи
        </Button>
        <Button
          onClick={onRandom}
          disabled={isLoading}
          variant="outline"
          className="h-12 gap-2 border-border/60 hover:bg-secondary/80"
        >
          <Shuffle className="w-5 h-5" />
          Случайная идея
        </Button>
      </div>
    </div>
  );
}
