import { useMemo } from "react";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguageStore } from "../store/useLanguageStore";
import { localizeStream, localizeDepartment } from "../utils/i18n";
import { mapStreamToSlug } from "./StreamsPage";
import { Seo } from "../components/Seo";

const FavoritesPage = () => {
  const favorites = useFavoritesStore();
  const lang = useLanguageStore((s) => s.lang);

  const items = useMemo(() => {
    return favorites.items.map((item) => {
      if (item.type === "stream") {
        const stream = localizeStream(item.id, lang);
        return { ...item, description: stream?.summary ?? item.description, name: stream?.title ?? item.name };
      }
      if (item.type === "department") {
        const dept = localizeDepartment(item.id, lang);
        return {
          ...item,
          description: dept?.overview ?? item.description,
          streamId: dept?.streamId,
          name: dept?.name ?? item.name,
          slug: dept?.slug ?? item.id,
        };
      }
      return item;
    });
  }, [favorites.items, lang]);

  return (
    <div className="page-container py-12 space-y-6">
      <Seo title="Favorites | FuturePath 3D" description="Saved streams and departments for quick access." />
      <SectionHeader
        eyebrow="Favorites"
        title="Saved streams and departments"
        subtitle="Quickly revisit the paths that interest you most."
      />

      {items.length === 0 ? (
        <div className="glass-panel rounded-xl border border-gray-200 p-5 text-sm text-gray-600">
          No favorites yet. Save a stream or department to see it here.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence>
            {items.map((fav) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <Card
                  eyebrow={fav.type.toUpperCase()}
                  title={fav.name}
                  actions={
                    <div className="flex gap-2">
                      {fav.type === "stream" && (
                        <Button as={Link} to={`/stream/${mapStreamToSlug(fav.id)}`} variant="ghost" className="text-xs px-3">
                          View stream
                        </Button>
                      )}
                      {fav.type === "department" && (
                        <Button as={Link} to={`/department/${fav.slug ?? fav.id}`} variant="ghost" className="text-xs px-3">
                          View department
                        </Button>
                      )}
                      <Button variant="outline" className="text-xs px-3" onClick={() => favorites.remove(fav.id)}>
                        Remove
                      </Button>
                    </div>
                  }
                >
                  <p className="text-sm text-gray-600 line-clamp-3">{fav.description}</p>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
