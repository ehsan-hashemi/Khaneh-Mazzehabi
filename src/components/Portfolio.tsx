import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Work {
  id: number;
  title: string;
  image: string;
}

const Portfolio = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  useEffect(() => {
    // Fetch works from JSON file
    fetch("/works.json")
      .then((res) => res.json())
      .then((data: Work[]) => {
        // Sort by id descending
        const sorted = [...data].sort((a, b) => b.id - a.id);
        setWorks(sorted);
      })
      .catch((error) => console.error("Error loading works:", error));
  }, []);

  const openLightbox = (work: Work) => {
    setSelectedWork(work);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedWork(null);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <section className="container px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold">نمونه‌کارهای ما</h2>
        <p className="text-lg text-muted-foreground">
          نگاهی به برخی از پروژه‌های انجام شده
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {works.map((work) => (
          <Card
            key={work.id}
            className="group overflow-hidden shadow-card transition-all duration-300 hover:shadow-elegant hover-lift cursor-pointer"
            onClick={() => openLightbox(work)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={work.image}
                  alt={work.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="px-4 text-center text-xl font-bold text-white">
                    {work.title}
                  </h3>
                  <Button variant="secondary" size="sm">
                    نمایش
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lightbox */}
      {selectedWork && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-white hover:bg-white/20"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </Button>
          <div
            className="max-h-[90vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedWork.image}
              alt={selectedWork.title}
              className="max-h-[80vh] w-auto rounded-lg object-contain shadow-elegant"
            />
            <h3
              id="lightbox-title"
              className="mt-4 text-center text-2xl font-bold text-white"
            >
              {selectedWork.title}
            </h3>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
