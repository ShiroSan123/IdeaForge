import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Star,
  Zap,
  Clock,
  DollarSign,
  BookOpen,
  FolderTree,
  ListChecks,
  Lightbulb,
  Code,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { generateStarterCode } from "@/lib/ideaGenerator";
import { updateFavoriteIdea } from "@/lib/favorites";

/**
 * @typedef {{ title: string, done: boolean }} IdeaTask
 * @typedef {{
 *   id?: string,
 *   title: string,
 *   description: string,
 *   difficulty: "easy" | "medium" | "hard" | "expert",
 *   technologies: string[],
 *   category: "web" | "mobile" | "desktop" | "ai" | "gamedev" | "devtools",
 *   time_estimate?: "1_day" | "1_week" | "2_weeks" | "1_month" | "3_months",
 *   monetizable: boolean,
 *   goal: "portfolio" | "freelance" | "startup" | "learning",
 *   features: string[],
 *   architecture?: string,
 *   tasks: IdeaTask[],
 *   why_useful?: string,
 *   what_youll_learn: string[],
 *   level: "junior" | "middle" | "senior",
 *   is_favorite?: boolean
 * }} Idea
 *
 * @typedef {{
 *   filename?: string,
 *   code: string,
 *   description?: string
 * }} StarterCode
 *
 * @typedef {{
 *   idea: Idea,
 *   onClose: () => void,
 *   onToggleFavorite: (idea: Idea) => void,
 *   onUpdate: (idea: Idea) => void
 * }} IdeaDetailsProps
 */

/** @type {Record<Idea["difficulty"], { label: string, color: string }>} */
const difficultyConfig = {
  easy: {
    label: "Легко",
    color: "text-green-400 bg-green-400/10 border-green-400/20",
  },
  medium: {
    label: "Средне",
    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  },
  hard: {
    label: "Сложно",
    color: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  },
  expert: {
    label: "Эксперт",
    color: "text-red-400 bg-red-400/10 border-red-400/20",
  },
};

/** @type {Record<NonNullable<Idea["time_estimate"]>, string>} */
const timeLabels = {
  "1_day": "1 день",
  "1_week": "1 неделя",
  "2_weeks": "2 недели",
  "1_month": "1 месяц",
  "3_months": "3 месяца",
};

/** @param {IdeaDetailsProps} props */
export default function IdeaDetails({
  idea,
  onClose,
  onToggleFavorite,
  onUpdate,
}) {
  const [starterCode, setStarterCode] = useState(
    /** @type {StarterCode | null} */ (null),
  );
  const [loadingCode, setLoadingCode] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!idea) return null;
  const diff = difficultyConfig[idea.difficulty] || difficultyConfig.medium;

  /** @param {number} taskIndex */
  const handleToggleTask = async (taskIndex) => {
    const updatedTasks = idea.tasks.map((task, index) =>
      index === taskIndex ? { ...task, done: !task.done } : task,
    );

    if (idea.id) {
      updateFavoriteIdea(idea.id, { tasks: updatedTasks });
    }

    onUpdate({ ...idea, tasks: updatedTasks });
  };

  const handleGenerateCode = async () => {
    setLoadingCode(true);
    const result = await generateStarterCode(idea);
    setStarterCode(result);
    setLoadingCode(false);
  };

  const handleCopyCode = () => {
    if (starterCode?.code) {
      navigator.clipboard.writeText(starterCode.code);
      setCopied(true);
      toast.success("Код скопирован");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-background/80 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl mb-8"
          onClick={
            /** @param {React.MouseEvent<HTMLDivElement>} e */
            (e) => e.stopPropagation()
          }
        >
          <Card className="bg-card border-border/50 overflow-hidden">
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{idea.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {idea.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onToggleFavorite(idea)}
                  >
                    <Star
                      className={`w-4 h-4 ${idea.is_favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className={diff.color}>
                  <Zap className="w-3 h-3 mr-1" />
                  {diff.label}
                </Badge>
                {idea.time_estimate && (
                  <Badge variant="outline" className="border-border/50">
                    <Clock className="w-3 h-3 mr-1" />
                    {timeLabels[idea.time_estimate]}
                  </Badge>
                )}
                {idea.monetizable && (
                  <Badge
                    variant="outline"
                    className="text-green-400 bg-green-400/10 border-green-400/20"
                  >
                    <DollarSign className="w-3 h-3 mr-1" />
                    Монетизация
                  </Badge>
                )}
                {idea.level && (
                  <Badge
                    variant="outline"
                    className="border-border/50 capitalize"
                  >
                    {idea.level}
                  </Badge>
                )}
              </div>

              {idea.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {idea.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary/80 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Separator className="bg-border/30" />

            {idea.features?.length > 0 && (
              <div className="p-6 pb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Основные функции
                </h3>
                <ul className="space-y-2">
                  {idea.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {idea.architecture && (
              <div className="px-6 pb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <FolderTree className="w-4 h-4 text-accent" />
                  Структура проекта
                </h3>
                <pre className="text-xs font-mono p-4 rounded-lg bg-secondary/60 border border-border/30 text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                  {idea.architecture}
                </pre>
              </div>
            )}

            {idea.why_useful && (
              <div className="px-6 pb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  Почему это полезно
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {idea.why_useful}
                </p>
              </div>
            )}

            {idea.what_youll_learn?.length > 0 && (
              <div className="px-6 pb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-accent" />
                  Что изучишь
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {idea.what_youll_learn.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs border-accent/30 text-accent/80"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {idea.tasks?.length > 0 && (
              <div className="px-6 pb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <ListChecks className="w-4 h-4 text-primary" />
                  Задачи
                </h3>
                <div className="space-y-2">
                  {idea.tasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30 border border-border/20 cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => handleToggleTask(index)}
                    >
                      <Checkbox checked={task.done} />
                      <span
                        className={`text-sm ${task.done ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="px-6 pb-6">
              {!starterCode ? (
                <Button
                  onClick={handleGenerateCode}
                  disabled={loadingCode}
                  variant="outline"
                  className="w-full h-11 gap-2 border-primary/30 text-primary hover:bg-primary/10"
                >
                  {loadingCode ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Code className="w-4 h-4" />
                  )}
                  {loadingCode ? "Генерация кода..." : "Создать стартовый код"}
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Code className="w-4 h-4 text-primary" />
                      {starterCode.filename || "Стартовый код"}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-xs h-7"
                      onClick={handleCopyCode}
                    >
                      {copied ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copied ? "Скопировано" : "Копировать"}
                    </Button>
                  </div>
                  {starterCode.description && (
                    <p className="text-xs text-muted-foreground">
                      {starterCode.description}
                    </p>
                  )}
                  <pre className="text-xs font-mono p-4 rounded-lg bg-secondary/60 border border-border/30 text-muted-foreground overflow-x-auto whitespace-pre-wrap max-h-80 overflow-y-auto">
                    {starterCode.code}
                  </pre>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
