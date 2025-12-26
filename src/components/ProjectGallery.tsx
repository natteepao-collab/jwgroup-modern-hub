import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Project {
  id: string;
  business_type: string;
  name_th: string;
  name_en: string | null;
  name_cn: string | null;
  description_th: string | null;
  description_en: string | null;
  description_cn: string | null;
  location_th: string | null;
  location_en: string | null;
  year_completed: string | null;
  image_url: string | null;
  gallery_images: string[];
  is_featured: boolean;
}

interface ProjectGalleryProps {
  businessType: 'realestate' | 'hotel' | 'pet' | 'wellness';
  title?: string;
}

const ProjectGallery = ({ businessType, title }: ProjectGalleryProps) => {
  const { i18n, t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('business_type', businessType)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [businessType]);

  const getName = (project: Project) => {
    const lang = i18n.language;
    if (lang === 'en' && project.name_en) return project.name_en;
    if (lang === 'cn' && project.name_cn) return project.name_cn;
    return project.name_th;
  };

  const getDescription = (project: Project) => {
    const lang = i18n.language;
    if (lang === 'en' && project.description_en) return project.description_en;
    if (lang === 'cn' && project.description_cn) return project.description_cn;
    return project.description_th;
  };

  const getLocation = (project: Project) => {
    const lang = i18n.language;
    if (lang === 'en' && project.location_en) return project.location_en;
    return project.location_th;
  };

  const getAllImages = (project: Project) => {
    const images: string[] = [];
    if (project.image_url) images.push(project.image_url);
    if (project.gallery_images) images.push(...project.gallery_images);
    return images;
  };

  const openLightbox = (project: Project, imageIndex: number = 0) => {
    setSelectedProject(project);
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!selectedProject) return;
    const images = getAllImages(selectedProject);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!selectedProject) return;
    const images = getAllImages(selectedProject);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-2xl h-64" />
            <div className="mt-3 h-4 bg-muted rounded w-3/4" />
            <div className="mt-2 h-3 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">ยังไม่มีโครงการในหมวดหมู่นี้</p>
      </div>
    );
  }

  return (
    <>
      {title && (
        <h3 className="text-2xl font-bold text-foreground mb-6">{title}</h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="group cursor-pointer"
            onClick={() => openLightbox(project)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image Card */}
            <div className="relative overflow-hidden rounded-3xl bg-card border border-border/30 shadow-md hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image_url || '/placeholder.svg'}
                  alt={getName(project)}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Expand Icon */}
              <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-card/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75 shadow-lg border border-border/50">
                <Maximize2 className="w-5 h-5 text-foreground" />
              </div>

              {/* Featured Badge */}
              {project.is_featured && (
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                  ✨ แนะนำ
                </div>
              )}

              {/* Info on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h4 className="text-primary-foreground font-bold text-xl mb-2 line-clamp-1">{getName(project)}</h4>
                {getLocation(project) && (
                  <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{getLocation(project)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info below card */}
            <div className="mt-4 px-1">
              <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                {getName(project)}
              </h4>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                {getLocation(project) && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary/70" />
                    <span>{getLocation(project)}</span>
                  </div>
                )}
                {project.year_completed && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary/70" />
                    <span>{project.year_completed}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl w-[95vw] sm:w-[90vw] max-h-[95dvh] md:max-h-[85vh] p-0 bg-background border-none overflow-hidden flex flex-col md:flex-row gap-0 rounded-xl">
          {selectedProject && (
            <>
              {/* Close Button Mobile */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/50 text-white md:hidden flex items-center justify-center transition-colors hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image Section */}
              <div className="relative w-full md:w-[65%] h-[35vh] md:h-full bg-black flex items-center justify-center shrink-0">
                <img
                  src={getAllImages(selectedProject)[currentImageIndex] || '/placeholder.svg'}
                  alt={getName(selectedProject)}
                  className="w-full h-full object-contain"
                />

                {/* Navigation Arrows */}
                {getAllImages(selectedProject).length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors text-white"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors text-white"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Thumbnails (Desktop Overlay) */}
                {getAllImages(selectedProject).length > 1 && (
                  <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 overflow-x-auto max-w-[90%] p-2 bg-black/30 backdrop-blur-sm rounded-xl hide-scrollbar">
                    {getAllImages(selectedProject).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx
                          ? 'border-primary'
                          : 'border-white/50 opacity-70 hover:opacity-100'
                          }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1 w-full md:w-[35%] min-h-0 flex flex-col bg-card relative">
                {/* Desktop Close Button */}
                <div className="hidden md:flex justify-end p-4 absolute top-0 right-0 z-10">
                  <button
                    onClick={closeLightbox}
                    className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 md:pt-12 custom-scrollbar">
                  <h3 className="text-2xl font-bold text-foreground mb-4 pr-8">
                    {getName(selectedProject)}
                  </h3>

                  <div className="flex flex-col gap-3 mb-6 text-sm text-muted-foreground">
                    {getLocation(selectedProject) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{getLocation(selectedProject)}</span>
                      </div>
                    )}
                    {selectedProject.year_completed && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{selectedProject.year_completed}</span>
                      </div>
                    )}
                  </div>

                  {getDescription(selectedProject) && (
                    <div
                      className="text-foreground/90 prose prose-sm dark:prose-invert max-w-none [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: getDescription(selectedProject) || '' }}
                    />
                  )}

                  {/* Mobile Thumbnails */}
                  {getAllImages(selectedProject).length > 1 && (
                    <div className="md:hidden flex gap-2 mt-6 overflow-x-auto pb-2">
                      {getAllImages(selectedProject).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx
                            ? 'border-primary'
                            : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectGallery;
