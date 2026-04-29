'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Star, Package } from 'lucide-react';
import { SectionWrapper } from '@/components/home/section-wrapper';
import { SectionHeader } from '@/components/home/section-header';
import { UserAvatar } from '@/components/shared/user-avatar';
import { useRecentReviews } from '@/hooks/use-ratings';
import type { RecentReview } from '@/services/rating.service';

// ─── Fallback data ────────────────────────────────────────────────────────────

const fallbackTestimonials: RecentReview[] = [
    {
        id: '1',
        rating: 5,
        comment: 'NexDrop made my delivery seamless. Real-time tracking and fast pickup exceeded my expectations!',
        createdAt: new Date().toISOString(),
        customer: { name: 'Amir Hossin' },
        rider: { name: 'Rasel Ahmed' },
    },
    {
        id: '2',
        rating: 5,
        comment: 'I trust NexDrop for all business parcels. Efficient, secure, and always on time.',
        createdAt: new Date().toISOString(),
        customer: { name: 'Rasel Ahamed' },
        rider: { name: 'Nasir Uddin' },
    },
    {
        id: '3',
        rating: 4,
        comment: 'Incredible customer service. NexDrop has simplified our shipping process entirely.',
        createdAt: new Date().toISOString(),
        customer: { name: 'Nasir Uddin' },
        rider: { name: 'Tanvir Hasan' },
    },
    {
        id: '4',
        rating: 5,
        comment: "Fastest delivery I've used. They handled fragile items perfectly!",
        createdAt: new Date().toISOString(),
        customer: { name: 'Sarah Jahan' },
        rider: { name: 'Arman Kabir' },
    },
    {
        id: '5',
        rating: 5,
        comment: 'Their tracking system is very accurate. Highly recommended for corporate use.',
        createdAt: new Date().toISOString(),
        customer: { name: 'Arman Kabir' },
        rider: { name: 'Amir Hossin' },
    },
    {
        id: '6',
        rating: 4,
        comment: "Needed a parcel sent urgently — NexDrop delivered faster than I expected!",
        createdAt: new Date().toISOString(),
        customer: { name: 'Tanvir Hasan' },
        rider: { name: 'Sarah Jahan' },
    },
];

// ─── Star display ─────────────────────────────────────────────────────────────

function StarDisplay({ value }: { value: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={`size-3.5 ${s <= value ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/20'}`}
                />
            ))}
        </div>
    );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-card rounded-2xl p-8 h-96 flex flex-col justify-between shadow-sm border border-gray-200 dark:border-border animate-pulse">
            {/* Quote + Stars row */}
            <div className="flex items-start justify-between">
                <div className="h-10 w-6 rounded bg-muted" />
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => <div key={s} className="h-3.5 w-3.5 rounded bg-muted" />)}
                </div>
            </div>

            {/* Message lines */}
            <div className="space-y-2 grow my-3">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-11/12 rounded bg-muted" />
                <div className="h-3 w-4/5 rounded bg-muted" />
                <div className="h-3 w-3/5 rounded bg-muted" />
            </div>

            {/* Divider */}
            <div className="border-t-2 border-dashed border-gray-200 dark:border-border/50 my-4" />

            {/* Avatar + name */}
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
                <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-28 rounded bg-muted" />
                    <div className="h-2.5 w-36 rounded bg-muted" />
                </div>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

const Testimonials = () => {
    const { data, isLoading } = useRecentReviews(6);
    const reviews = (data?.data && data.data.length > 0) ? data.data : fallbackTestimonials;

    return (
        <SectionWrapper
            hasPadding={false}
            topPadding={false}
        >
            <SectionHeader
                highlightWord='customers'
                title="What our customers are saying"
                description="Hear from satisfied users who trust NexDrop for reliable and fast parcel delivery. We're committed to making shipping easier and stress-free!"
            />

            <div className="relative max-w-5xl mx-auto mt-16">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    slidesPerView={3}
                    centeredSlides={true}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: false,
                        el: '.testimonials-pagination',
                    }}
                    className="pb-6"
                    breakpoints={{
                        0: { slidesPerView: 1, spaceBetween: 20 },
                        640: { slidesPerView: 2, spaceBetween: 15 },
                        768: { slidesPerView: 3, spaceBetween: 20 },
                    }}
                >
                    {(isLoading ? Array(6).fill(null) : reviews).map((item, index) => (
                        <SwiperSlide key={isLoading ? index : (item as RecentReview).id}>
                            {({ isActive }) => (
                                isLoading ? (
                                    <motion.div
                                        initial={{ opacity: 0.5, scale: 0.95 }}
                                        animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.85 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <SkeletonCard />
                                    </motion.div>
                                    // <SkeletonCard />
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0.5, scale: 0.95 }}
                                        animate={{
                                            opacity: isActive ? 1 : 0.5,
                                            scale: isActive ? 1 : 0.85,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className={`h-full transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}
                                    >
                                        <div className="bg-white dark:bg-card rounded-2xl p-8 h-96 flex flex-col justify-between shadow-sm border border-gray-200 dark:border-border">
                                            {/* Quote + Stars */}
                                            <div className="flex items-start justify-between">
                                                <div className="text-5xl text-primary/40 leading-none">
                                                    &ldquo;
                                                </div>
                                                <StarDisplay value={(item as RecentReview)?.rating} />
                                            </div>

                                            {/* Message */}
                                            <p className="text-foreground text-sm md:text-base leading-relaxed grow my-3">
                                                {(item as RecentReview)?.comment || 'Great delivery experience with NexDrop!'}
                                            </p>

                                            {/* Parcel badge */}
                                            {(item as RecentReview)?.parcel?.trackingId && (
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-md px-2.5 py-1.5 w-fit">
                                                    <Package className="size-3 shrink-0" />
                                                    <span className="font-mono tracking-wide">{(item as RecentReview).parcel!.trackingId}</span>
                                                </div>
                                            )}

                                            {/* Divider */}
                                            <div className="border-t-2 border-dashed border-gray-300 dark:border-border/50 my-4" />

                                            {/* Customer info */}
                                            <div className="flex items-center gap-3">
                                                <UserAvatar name={(item as RecentReview)?.customer.name} />
                                                <div className="text-left min-w-0 flex-1">
                                                    <h4 className="font-semibold text-foreground text-sm truncate">
                                                        {(item as RecentReview)?.customer.name}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        Delivered by {(item as RecentReview)?.rider.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Pagination */}
                <div className="flex justify-center mt-10 mb-8">
                    <div className="swiper-pagination testimonials-pagination" />
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Testimonials;

