import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight, Clock, Zap, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

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
 *   idea: Idea,
 *   onDetails: (idea: Idea) => void,
 *   onToggleFavorite: (idea: Idea) => void,
 *   index?: number
 * }} IdeaCardProps
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

/** @type {Record<Idea["category"], string>} */
const categoryIcons = {
  web: "Web",
  mobile: "App",
  desktop: "Desk",
  ai: "AI",
  gamedev: "Game",
  devtools: "Dev",
};

/** @type {Record<NonNullable<Idea["time_estimate"]>, string>} */
const timeLabels = {
  "1_day": "1 день",
  "1_week": "1 неделя",
  "2_weeks": "2 недели",
  "1_month": "1 месяц",
  "3_months": "3 месяца",
};

/** @param {IdeaCardProps} props */
export default function IdeaCard({
  idea,
  onDetails,
  onToggleFavorite,
  index = 0,
}) {
  const diff = difficultyConfig[idea.difficulty] || difficultyConfig.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="group relative overflow-hidden bg-card/60 backdrop-blur-sm border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-[0.2em] text-primary/70 font-semibold">
                  {categoryIcons[idea.category] || "Idea"}
                </span>
                <h3 className="font-semibold text-base truncate">
                  {idea.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {idea.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8"
              onClick={
                /** @param {React.MouseEvent<HTMLButtonElement>} e */
                (e) => {
                  e.stopPropagation();
                  onToggleFavorite(idea);
                }
              }
            >
              <Star
                className={`w-4 h-4 transition-colors ${idea.is_favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
              />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <Badge variant="outline" className={`text-xs ${diff.color}`}>
              <Zap className="w-3 h-3 mr-1" />
              {diff.label}
            </Badge>
            {idea.time_estimate && (
              <Badge variant="outline" className="text-xs border-border/50">
                <Clock className="w-3 h-3 mr-1" />
                {timeLabels[idea.time_estimate] || idea.time_estimate}
              </Badge>
            )}
            {idea.monetizable && (
              <Badge
                variant="outline"
                className="text-xs text-green-400 bg-green-400/10 border-green-400/20"
              >
                <DollarSign className="w-3 h-3 mr-1" />
                Монетизация
              </Badge>
            )}
          </div>

          {idea.technologies && idea.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {idea.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary/80 font-mono"
                >
                  {tech}
                </span>
              ))}
              {idea.technologies.length > 5 && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                  +{idea.technologies.length - 5}
                </span>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full justify-between h-9 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            onClick={() => onDetails(idea)}
          >
            Подробнее
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
