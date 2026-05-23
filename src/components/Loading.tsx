const Loading = () => {
    return (
        <div className="w-full animate-pulse" aria-busy="true" aria-label="Loading content">
            {/* Hero skeleton */}
            <div className="relative w-full h-[55vh] min-h-[360px] bg-gradient-to-br from-muted/60 via-muted/40 to-muted/60 overflow-hidden">
                <div className="absolute inset-0 shimmer-overlay" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
                    <div className="h-3 w-24 rounded-full bg-muted-foreground/20" />
                    <div className="h-8 sm:h-10 w-3/4 max-w-xl rounded-lg bg-muted-foreground/25" />
                    <div className="h-4 w-2/3 max-w-md rounded-md bg-muted-foreground/20" />
                    <div className="flex gap-3 mt-3">
                        <div className="h-10 w-32 rounded-full bg-muted-foreground/25" />
                        <div className="h-10 w-32 rounded-full bg-muted-foreground/15" />
                    </div>
                </div>
            </div>

            {/* Content skeleton */}
            <div className="container mx-auto px-4 sm:px-6 py-12 space-y-10">
                {/* Section header */}
                <div className="flex flex-col items-center gap-3">
                    <div className="h-3 w-20 rounded-full bg-muted-foreground/15" />
                    <div className="h-6 w-64 max-w-full rounded-md bg-muted-foreground/20" />
                    <div className="h-3 w-80 max-w-full rounded-md bg-muted-foreground/15" />
                </div>

                {/* Card grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden shadow-sm"
                        >
                            <div className="relative h-44 bg-muted/60 overflow-hidden">
                                <div className="absolute inset-0 shimmer-overlay" />
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="h-4 w-3/4 rounded-md bg-muted-foreground/20" />
                                <div className="h-3 w-full rounded-md bg-muted-foreground/15" />
                                <div className="h-3 w-5/6 rounded-md bg-muted-foreground/15" />
                                <div className="h-8 w-28 mt-3 rounded-full bg-muted-foreground/20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Loading;
