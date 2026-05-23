import { Skeleton } from "@/components/ui/skeleton";

const HomeSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="relative h-[70vh] sm:h-[75vh] md:h-[85vh] lg:h-screen overflow-hidden">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-x-0 top-[72%] sm:top-[70%] md:top-[68%] z-10 flex justify-center px-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md">
            <Skeleton className="w-full sm:w-auto h-12 sm:h-14 flex-1 rounded-lg" />
            <Skeleton className="w-full sm:w-auto h-12 sm:h-14 flex-1 rounded-lg" />
          </div>
        </div>
      </section>

      {/* About Section Skeleton */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-10 sm:h-12 md:h-14 lg:h-16 w-3/4 mx-auto rounded-lg" />
            <Skeleton className="h-4 sm:h-5 md:h-6 w-full mx-auto rounded-lg" />
            <Skeleton className="h-4 sm:h-5 md:h-6 w-5/6 mx-auto rounded-lg" />
          </div>
        </div>
        {/* Stats Skeleton */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 md:p-6 text-center space-y-3">
                <Skeleton className="h-8 w-24 mx-auto rounded-lg" />
                <Skeleton className="h-4 w-full mx-auto rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chairman Quote Skeleton */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 space-y-6">
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-6 w-5/6 rounded-lg" />
            <Skeleton className="h-6 w-4/6 rounded-lg" />
            <div className="flex items-center gap-4 pt-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Skeleton */}
      <section className="py-20 bg-accent/20">
        <div className="container mx-auto px-4 space-y-10">
          <div className="text-center space-y-4">
            <Skeleton className="h-10 sm:h-12 md:h-14 w-1/2 mx-auto rounded-lg" />
            <Skeleton className="h-5 w-2/3 mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Section Skeleton */}
      <section className="py-20 bg-accent/20">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <Skeleton className="h-5 w-32 mx-auto rounded-lg" />
            <Skeleton className="h-10 sm:h-12 md:h-14 w-1/2 mx-auto rounded-lg" />
            <Skeleton className="h-5 w-2/3 mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[500px] md:h-[600px]">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-full w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* News Section Skeleton */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <Skeleton className="h-5 w-32 mx-auto rounded-lg" />
            <Skeleton className="h-10 sm:h-12 md:h-14 w-1/2 mx-auto rounded-lg" />
            <Skeleton className="h-5 w-2/3 mx-auto rounded-lg" />
            <Skeleton className="h-10 w-40 mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured card */}
            <Skeleton className="h-[320px] sm:h-[280px] rounded-xl col-span-1 sm:col-span-2 lg:col-span-2" />
            {/* Side cards */}
            <div className="space-y-6">
              <Skeleton className="h-[140px] rounded-xl" />
              <Skeleton className="h-[140px] rounded-xl" />
            </div>
            {/* Bottom cards */}
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[280px] rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Skeleton */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 space-y-10">
          <div className="text-center space-y-4">
            <Skeleton className="h-5 w-32 mx-auto rounded-lg" />
            <Skeleton className="h-10 sm:h-12 md:h-14 w-1/2 mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-4">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-5/6 rounded-lg" />
                <div className="flex items-center gap-3 pt-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 rounded-lg" />
                    <Skeleton className="h-3 w-16 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Section Skeleton */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Skeleton className="h-10 sm:h-12 md:h-14 w-1/2 mx-auto rounded-lg" />
          <Skeleton className="h-6 w-2/3 mx-auto rounded-lg" />
          <Skeleton className="h-12 w-48 mx-auto rounded-lg" />
        </div>
      </section>

      {/* Newsletter Skeleton */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <Skeleton className="h-8 w-1/2 mx-auto rounded-lg" />
          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1 rounded-lg" />
            <Skeleton className="h-12 w-32 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Map Skeleton */}
      <section className="py-0 bg-background">
        <Skeleton className="h-[400px] md:h-[500px] w-full rounded-none" />
      </section>
    </div>
  );
};

export default HomeSkeleton;
