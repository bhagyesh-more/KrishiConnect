/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import {
  getCommunityPostDetailAction,
  deleteCommunityPostAction,
  togglePostLikeAction,
  togglePostBookmarkAction,
} from "@/features/community/actions";
import { CommunityPost, PostComment } from "@/features/community/types";
import { TOPIC_CONFIG } from "@/features/community/TopicFilter";
import { CommentSection } from "@/features/community/CommentSection";
import { EditPostModal } from "@/features/community/EditPostModal";
import { ReportModal } from "@/features/community/ReportModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  ThumbsUp,
  Bookmark,
  Share2,
  MoreVertical,
  CheckCircle2,
  MapPin,
  Calendar,
  Trash2,
  Edit2,
  Flag,
  Pin,
  Lock,
} from "lucide-react";

export default function PostDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{
    postId?: string;
    commentId?: string;
  } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  const loadDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getCommunityPostDetailAction(postId);
      if (res.success && res.data) {
        setPost(res.data.post);
        setComments(res.data.comments);
        setCurrentUserId(res.data.currentUserId);
      } else {
        setErrorMsg(res.error || "पोस्ट सापडली नाही");
      }
    } catch {
      setErrorMsg("नेटवर्क त्रुटी");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse p-4">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (errorMsg || !post) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <h2 className="text-lg font-bold text-krishi-deepGreen">
          {errorMsg || "ही पोस्ट अस्तित्वात नाही"}
        </h2>
        <p className="text-xs text-krishi-gray">
          कदाचित लेखकाने ही पोस्ट हटवली आहे किंवा लिंक अयोग्य आहे.
        </p>
        <Link href="/community">
          <Button variant="primary" size="sm">
            चर्चा मंचाकडे परत जा
          </Button>
        </Link>
      </div>
    );
  }

  const isAuthor = currentUserId === post.author_id;
  const topicMeta = TOPIC_CONFIG[post.topic_category] || TOPIC_CONFIG.general;
  const TopicIcon = topicMeta.icon;

  const handleLike = async () => {
    const newLiked = !post.is_liked;
    setPost({
      ...post,
      is_liked: newLiked,
      upvotes_count: newLiked ? post.upvotes_count + 1 : Math.max(0, post.upvotes_count - 1),
    });
    await togglePostLikeAction(post.id);
  };

  const handleBookmark = async () => {
    setPost({
      ...post,
      is_bookmarked: !post.is_bookmarked,
    });
    await togglePostBookmarkAction(post.id);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100),
          url,
        });
      } catch {
        await navigator.clipboard.writeText(url);
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 2000);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!confirm("तुम्हाला ही पोस्ट नक्की हटवायची आहे का?")) return;
    try {
      const res = await deleteCommunityPostAction(post.id);
      if (res.success) {
        router.push("/community");
      } else {
        alert(res.error || "हटवण्यात अयशस्वी");
      }
    } catch (err: any) {
      alert(err?.message || "त्रुटी");
    }
  };

  const formattedDate = new Date(post.created_at).toLocaleDateString("mr-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/community"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-krishi-deepGreen hover:underline bg-white px-3 py-1.5 rounded-xl border border-krishi-lightGray/60 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>सर्व चर्चांकडे परत (Back to Community)</span>
        </Link>
      </div>

      {/* Main Post Container */}
      <article className="bg-white rounded-3xl border border-krishi-lightGray/70 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Author Details & Badges */}
        <div className="flex items-start justify-between gap-3 border-b border-krishi-lightGray/40 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-krishi-deepGreen text-krishi-warmIvory flex items-center justify-center font-extrabold text-base shadow-sm">
              {post.author.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="font-bold text-sm sm:text-base text-krishi-charcoal">
                  {post.author.full_name}
                </span>
                {post.author.is_verified_expert && (
                  <span className="inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>प्रमाणित कृषी तज्ज्ञ</span>
                  </span>
                )}
              </div>
              <div className="flex items-center text-xs text-krishi-gray space-x-2 mt-1">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-krishi-leafGreen" />
                  {post.author.district}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-krishi-gray" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Menu options */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-krishi-gray hover:text-krishi-charcoal rounded-xl"
              aria-label="Options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-krishi-lightGray/70 py-1.5 z-20 text-xs">
                {isAuthor && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setIsEditModalOpen(true);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-krishi-warmIvory flex items-center space-x-2 text-krishi-charcoal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>बदल करा (Edit)</span>
                  </button>
                )}
                {isAuthor && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleDelete();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center space-x-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>हटवा (Delete)</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setReportTarget({ postId: post.id });
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-krishi-warmIvory flex items-center space-x-2 text-amber-700"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>तक्रार करा (Report)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <span
            className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-full border ${topicMeta.color}`}
          >
            <TopicIcon className="w-3.5 h-3.5" />
            <span>{topicMeta.labelMr}</span>
          </span>
          {post.crop_category && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-krishi-warmIvory text-krishi-deepGreen border border-krishi-lightGray/60">
              🌱 {post.crop_category}
            </span>
          )}
          {post.is_pinned && (
            <span className="inline-flex items-center space-x-1 text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
              <Pin className="w-3.5 h-3.5" />
              <span>पिन केलेली चर्चा</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-black text-krishi-deepGreen leading-snug">
          {post.title}
        </h1>

        {/* Body Content */}
        <p className="text-sm sm:text-base text-krishi-charcoal leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* Photos Gallery */}
        {post.image_urls && post.image_urls.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {post.image_urls.map((img, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video border border-krishi-lightGray/60 shadow-sm"
              >
                <img
                  src={img}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Interaction bar */}
        <div className="flex items-center justify-between pt-4 border-t border-krishi-lightGray/40 text-xs sm:text-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition ${
                post.is_liked
                  ? "bg-red-50 text-red-600 font-bold"
                  : "bg-krishi-warmIvory/60 text-krishi-gray hover:text-krishi-charcoal"
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${post.is_liked ? "fill-red-600" : ""}`} />
              <span>{post.upvotes_count} पसंती</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition ${
                post.is_bookmarked
                  ? "bg-krishi-leafGreen/20 text-krishi-deepGreen font-bold"
                  : "bg-krishi-warmIvory/60 text-krishi-gray hover:text-krishi-charcoal"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${post.is_bookmarked ? "fill-krishi-deepGreen" : ""}`} />
              <span>{post.is_bookmarked ? "जतन केले" : "बुकमार्क"}</span>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-krishi-warmIvory/60 text-krishi-charcoal hover:bg-krishi-warmIvory transition"
            >
              <Share2 className="w-4 h-4" />
              <span>शेअर करा</span>
            </button>
            {shareFeedback && (
              <span className="absolute -top-7 right-0 bg-krishi-deepGreen text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap animate-fade-in">
                लिंक कॉपी झाली!
              </span>
            )}
          </div>
        </div>

        {/* Threaded Comments Section */}
        <CommentSection
          postId={post.id}
          comments={comments}
          currentUserId={currentUserId}
          onRefresh={loadDetail}
          onReport={(commentId) => setReportTarget({ commentId })}
        />
      </article>

      {/* Edit Post Modal */}
      <EditPostModal
        post={post}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={loadDetail}
      />

      {/* Report Modal */}
      <ReportModal
        postId={reportTarget?.postId}
        commentId={reportTarget?.commentId}
        isOpen={!!reportTarget}
        onClose={() => setReportTarget(null)}
      />
    </div>
  );
}
