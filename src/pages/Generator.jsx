import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import GeneratorForm from "@/components/generator/GeneratorForm";
import AiPromptInput from "@/components/generator/AiPromptInput";
import IdeaCard from "@/components/generator/IdeaCard";
import IdeaDetails from "@/components/generator/IdeaDetails";
import {
  generateIdeas,
  generateRandomIdea,
  generateFromPrompt,
} from "@/lib/ideaGenerator";
import { removeFavoriteIdea, saveFavoriteIdea } from "@/lib/favorites";

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
 *   level: IdeaLevel,
 *   is_favorite?: boolean
 * }} Idea
 *
 * @typedef {{
 *   level: IdeaLevel | "",
 *   goal: IdeaGoal | "",
 *   category: IdeaCategory | "",
 *   timeEstimate: TimeEstimate | "",
 *   stacks: string[],
 *   monetizable: boolean
 * }} GeneratorParams
 */

export default function Generator() {
  const [ideas, setIdeas] = useState(/** @type {Idea[]} */ ([]));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(
    /** @type {Idea | null} */ (null),
  );

  /** @param {GeneratorParams} params */
  const handleGenerate = async (params) => {
    setIsLoading(true);
    const result = await generateIdeas(params);
    setIdeas(
      result.map(
        /** @param {Idea} idea */
        (idea) => ({ ...idea, is_favorite: false }),
      ),
    );
    setIsLoading(false);
    if (result.length > 0) toast.success(`Сгенерировано ${result.length} идей`);
  };

  const handleRandom = async () => {
    setIsLoading(true);
    const idea = await generateRandomIdea();
    setIdeas([{ ...idea, is_favorite: false }]);
    setIsLoading(false);
    toast.success("Случайная идея готова!");
  };

  /** @param {string} prompt */
  const handleAiGenerate = async (prompt) => {
    setIsLoading(true);
    const result = await generateFromPrompt(prompt);
    setIdeas(
      result.map(
        /** @param {Idea} idea */
        (idea) => ({ ...idea, is_favorite: false }),
      ),
    );
    setIsLoading(false);
    if (result.length > 0) toast.success(`Сгенерировано ${result.length} идей`);
  };

  /** @param {Idea} idea */
  const handleToggleFavorite = async (idea) => {
    const newFav = !idea.is_favorite;

    setIdeas((prev) =>
      prev.map((item) =>
        item.title === idea.title ? { ...item, is_favorite: newFav } : item,
      ),
    );

    if (selectedIdea && selectedIdea.title === idea.title) {
      setSelectedIdea((prev) =>
        prev ? { ...prev, is_favorite: newFav } : prev,
      );
    }

    if (newFav) {
      const saved = saveFavoriteIdea({
        ...idea,
        is_favorite: true,
      });

      setIdeas((prev) =>
        prev.map((item) =>
          item.title === idea.title
            ? { ...item, id: saved.id, is_favorite: true }
            : item,
        ),
      );

      if (selectedIdea && selectedIdea.title === idea.title) {
        setSelectedIdea((prev) =>
          prev
            ? {
                ...prev,
                id: saved.id,
                is_favorite: true,
              }
            : prev,
        );
      }

      toast.success("Добавлено в избранное");
      return;
    }

    removeFavoriteIdea(idea.id || idea.title);
    setIdeas((prev) =>
      prev.map((item) =>
        item.title === idea.title
          ? { ...item, id: undefined, is_favorite: false }
          : item,
      ),
    );
    toast.success("Удалено из избранного");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <Sparkles className="w-3 h-3" />
          Генератор идей
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Найди свой следующий
          <span className="text-primary"> проект</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Настрой параметры или опиши идею. Приложение само соберет понятный
          план проекта с архитектурой, задачами и стартовым кодом.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 mb-6 bg-secondary/50">
            <TabsTrigger value="form" className="gap-2 text-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Параметры
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2 text-sm">
              <Wand2 className="w-3.5 h-3.5" />
              Свободный запрос
            </TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm p-5 sm:p-6">
              <GeneratorForm
                onGenerate={handleGenerate}
                onRandom={handleRandom}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
          <TabsContent value="ai">
            <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm p-5 sm:p-6">
              <p className="text-sm text-muted-foreground mb-3">
                Опишите своими словами, какой проект хотите собрать.
              </p>
              <AiPromptInput
                onGenerate={handleAiGenerate}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(
            /** @param {number} i */
            (i) => (
            <div
              key={i}
              className="rounded-xl border border-border/30 bg-card/30 p-5 animate-pulse"
            >
              <div className="h-5 bg-secondary/60 rounded w-3/4 mb-3" />
              <div className="h-3 bg-secondary/40 rounded w-full mb-2" />
              <div className="h-3 bg-secondary/40 rounded w-2/3 mb-4" />
              <div className="flex gap-2">
                <div className="h-5 bg-secondary/40 rounded w-16" />
                <div className="h-5 bg-secondary/40 rounded w-20" />
              </div>
            </div>
            ),
          )}
        </div>
      )}

      {!isLoading && ideas.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Результаты
            <span className="text-muted-foreground font-normal text-sm ml-2">
              ({ideas.length} {ideas.length === 1 ? "идея" : "идей"})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map(
              /**
               * @param {Idea} idea
               * @param {number} i
               */
              (idea, i) => (
                <IdeaCard
                  key={idea.title + i}
                  idea={idea}
                  index={i}
                  onDetails={setSelectedIdea}
                  onToggleFavorite={handleToggleFavorite}
                />
              ),
            )}
          </div>
        </div>
      )}

      {!isLoading && ideas.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-primary animate-pulse-glow" />
          </div>
          <p className="text-muted-foreground text-sm">
            Настройте параметры и нажмите "Сгенерировать"
            <br />
            или опишите идею в свободной форме
          </p>
        </motion.div>
      )}

      {selectedIdea && (
        <IdeaDetails
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
          onToggleFavorite={handleToggleFavorite}
          onUpdate={
            /** @param {Idea} updated */
            (updated) => {
              setSelectedIdea(updated);
              setIdeas((prev) =>
                prev.map((item) =>
                  item.title === updated.title ? updated : item,
                ),
              );
            }
          }
        />
      )}
    </div>
  );
}
