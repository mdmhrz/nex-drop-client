"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, Trash2, AlertTriangle, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StarRatingInput } from "@/components/shared/star-rating-input";
import { useMyRatings, useSubmitRating, useUpdateRating, useDeleteRating } from "@/hooks/use-ratings";
import type { MyRating, Rating } from "@/hooks/use-ratings";

// ─── Schema ────────────────────────────────────────────────────────────────────

const ratingSchema = z.object({
    rating: z.number().int().min(1, "Please select a rating").max(5),
    comment: z.string().max(500, "Comment must be 500 characters or less").optional(),
});

type RatingFormData = z.infer<typeof ratingSchema>;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isWithin24Hours(createdAt: string): boolean {
    return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
}

function StarDisplay({ value }: { value: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={`size-5 ${s <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                />
            ))}
        </div>
    );
}

// ─── Submit Form ───────────────────────────────────────────────────────────────

function SubmitForm({ parcelId }: { parcelId: string }) {
    const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RatingFormData>({
        resolver: zodResolver(ratingSchema),
        defaultValues: { rating: 0, comment: "" },
    });

    const submitMutation = useSubmitRating();

    const onSubmit = (data: RatingFormData) => {
        submitMutation.mutate({ parcelId, rating: data.rating, comment: data.comment || undefined });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label>Your Rating <span className="text-destructive">*</span></Label>
                <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                        <StarRatingInput
                            value={field.value}
                            onChange={field.onChange}
                            disabled={submitMutation.isPending || isSubmitting}
                        />
                    )}
                />
                {errors.rating && <p className="text-xs text-destructive">{errors.rating.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="pr-comment">
                    Comment <span className="text-xs text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                    id="pr-comment"
                    placeholder="Share your experience..."
                    className="resize-none"
                    rows={3}
                    maxLength={500}
                    {...register("comment")}
                    disabled={submitMutation.isPending || isSubmitting}
                />
                {errors.comment && <p className="text-xs text-destructive">{errors.comment.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={submitMutation.isPending || isSubmitting}>
                {submitMutation.isPending ? "Submitting..." : "Submit Rating"}
            </Button>
        </form>
    );
}

// ─── Edit Form ─────────────────────────────────────────────────────────────────

function EditForm({ existing, onCancel }: { existing: MyRating | Rating; onCancel: () => void }) {
    const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RatingFormData>({
        resolver: zodResolver(ratingSchema),
        defaultValues: { rating: existing.rating, comment: existing.comment ?? "" },
    });

    const updateMutation = useUpdateRating(() => onCancel());

    const onSubmit = (data: RatingFormData) => {
        updateMutation.mutate({ id: existing.id, data: { rating: data.rating, comment: data.comment || undefined } });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label>Your Rating</Label>
                <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                        <StarRatingInput
                            value={field.value}
                            onChange={field.onChange}
                            disabled={updateMutation.isPending || isSubmitting}
                        />
                    )}
                />
                {errors.rating && <p className="text-xs text-destructive">{errors.rating.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="pr-edit-comment">Comment</Label>
                <Textarea
                    id="pr-edit-comment"
                    className="resize-none"
                    rows={3}
                    maxLength={500}
                    {...register("comment")}
                    disabled={updateMutation.isPending || isSubmitting}
                />
                {errors.comment && <p className="text-xs text-destructive">{errors.comment.message}</p>}
            </div>

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1"
                    disabled={updateMutation.isPending}
                >
                    Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={updateMutation.isPending || isSubmitting}>
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}

// ─── Submitted View ────────────────────────────────────────────────────────────

function SubmittedView({
    existing,
    onEdit,
}: {
    existing: MyRating | Rating;
    onEdit: () => void;
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const deleteMutation = useDeleteRating();
    const canModify = isWithin24Hours(existing.createdAt);

    return (
        <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                <StarDisplay value={existing.rating} />
                {existing.comment ? (
                    <p className="text-sm text-muted-foreground">&ldquo;{existing.comment}&rdquo;</p>
                ) : (
                    <p className="text-xs italic text-muted-foreground">No comment provided</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Submitted on{" "}
                    {new Date(existing.createdAt).toLocaleDateString("en-BD", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
            </div>

            {canModify ? (
                <>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <AlertTriangle className="size-3 text-yellow-500" />
                        You can edit or delete this rating within 24 hours of submission.
                    </p>
                    <Separator />
                    {!confirmDelete ? (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
                                <Pencil className="size-3.5 mr-1.5" /> Edit
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setConfirmDelete(true)}
                                className="flex-1"
                            >
                                <Trash2 className="size-3.5 mr-1.5" /> Delete
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm text-destructive font-medium">Delete this rating?</p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setConfirmDelete(false)}
                                    className="flex-1"
                                    disabled={deleteMutation.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteMutation.mutate(existing.id)}
                                    className="flex-1"
                                    disabled={deleteMutation.isPending}
                                >
                                    {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-xs text-muted-foreground">
                    The 24-hour edit window has passed. This rating can no longer be modified.
                </p>
            )}
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface ParcelRatingSectionProps {
    parcelId: string;
}

export function ParcelRatingSection({ parcelId }: ParcelRatingSectionProps) {
    const [editing, setEditing] = useState(false);
    const { data: myRatingsData, isLoading } = useMyRatings();

    const existingRating = myRatingsData?.data?.find((r) => r.parcelId === parcelId) ?? null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    
                    Rate This Delivery
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="py-4 text-sm text-muted-foreground">Loading rating info...</div>
                ) : existingRating && !editing ? (
                    <SubmittedView existing={existingRating} onEdit={() => setEditing(true)} />
                ) : existingRating && editing ? (
                    <EditForm existing={existingRating} onCancel={() => setEditing(false)} />
                ) : (
                    <SubmitForm parcelId={parcelId} />
                )}
            </CardContent>
        </Card>
    );
}
