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
        .order('position_order', { ascending: true });

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group cursor-pointer"
            onClick={() => openLightbox(project)}
          >
            {/* Image Card */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image_url || '/placeholder.svg'}
                  alt={getName(project)}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Expand Icon */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75">
                <Maximize2 className="w-5 h-5 text-white" />
              </div>

              {/* Featured Badge */}
              {project.is_featured && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  Featured
                </div>
              )}

              {/* Info on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h4 className="text-white font-bold text-lg mb-1">{getName(project)}</h4>
                {getLocation(project) && (
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <MapPin className="w-3 h-3" />
                    <span>{getLocation(project)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info below card */}
            <div className="mt-3">
              <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                {getName(project)}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                {getLocation(project) && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{getLocation(project)}</span>
                  </div>
                )}
                {project.year_completed && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{project.year_completed}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black/95 border-none">
          {selectedProject && (
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Main Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Project Info */}
              <div className="p-6 bg-card">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {getName(selectedProject)}
                </h3>
                {getDescription(selectedProject) && (
                  <div
                    className="text-muted-foreground mb-4 prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                    dangerouslySetInnerHTML={{ __html: getDescription(selectedProject) || '' }}
                  />
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {getLocation(selectedProject) && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{getLocation(selectedProject)}</span>
                    </div>
                  )}
                  {selectedProject.year_completed && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedProject.year_completed}</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Navigation */}
                {getAllImages(selectedProject).length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectGallery;
