import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import IdeaCard from "@/components/generator/IdeaCard";
import IdeaDetails from "@/components/generator/IdeaDetails";
import {
  getFavoriteIdeas,
  removeFavoriteIdea,
  updateFavoriteIdea,
} from "@/lib/favorites";

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
 */

export default function Favorites() {
  const [selectedIdea, setSelectedIdea] = useState(
    /** @type {Idea | null} */ (null),
  );
  const queryClient = useQueryClient();

  const { data: favorites = /** @type {Idea[]} */ ([]), isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => getFavoriteIdeas(),
  });

  /** @param {Idea} idea */
  const handleToggleFavorite = async (idea) => {
    if (!idea.id) {
      return;
    }

    removeFavoriteIdea(idea.id);
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
    if (selectedIdea?.id === idea.id) setSelectedIdea(null);
    toast.success("Удалено из избранного");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Избранное
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          Сохраненные идеи проектов
        </p>
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
              <div className="h-3 bg-secondary/40 rounded w-2/3" />
            </div>
            ),
          )}
        </div>
      )}

      {!isLoading && favorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map(
            /**
             * @param {Idea} idea
             * @param {number} i
             */
            (idea, i) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                index={i}
                onDetails={setSelectedIdea}
                onToggleFavorite={handleToggleFavorite}
              />
            ),
          )}
        </div>
      )}

      {!isLoading && favorites.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 flex items-center justify-center mx-auto mb-4">
            <Star className="w-7 h-7 text-yellow-400/50" />
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Здесь пока пусто. Сгенерируйте идеи и добавьте лучшие в избранное.
          </p>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Сгенерировать идеи
            </Button>
          </Link>
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
              updateFavoriteIdea(updated.id, updated);
              setSelectedIdea(updated);
              queryClient.invalidateQueries({ queryKey: ["favorites"] });
            }
          }
        />
      )}
    </div>
  );
}
