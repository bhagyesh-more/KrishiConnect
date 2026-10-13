/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CommunityPost } from "./types";
import { TOPIC_CONFIG } from "./TopicFilter";
import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Share2,
  MoreVertical,
  Pin,
  Lock,
  CheckCircle2,
  MapPin,
  Trash2,
  Edit2,
  Flag,
  Calendar,
} from "lucide-react";

interface PostCardProps {
  post: CommunityPost;
  currentUserId?: string;
  isAdmin?: boolean;
  onLike: (postId: string) => Promise<void>;
  onBookmark: (postId: string) => Promise<void>;
  onEdit?: (post: CommunityPost) => void;
  onDelete?: (postId: string) => void;
  onReport?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  isAdmin,
  onLike,
  onBookmark,
  onEdit,
  onDelete,
  onReport,
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  const isAuthor = currentUserId === post.author_id;
  const topicMeta = TOPIC_CONFIG[post.topic_category] || TOPIC_CONFIG.general;
  const TopicIcon = topicMeta.icon;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLiking) return;
    setIsLiking(true);
    try {
      await onLike(post.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isBookmarking) return;
    setIsBookmarking(true);
    try {
      await onBookmark(post.id);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/community/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100),
          url,
        });
      } catch {
        // Fallback to clipboard
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

  const formattedDate = new Date(post.created_at).toLocaleDateString("mr-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <article className="bg-white rounded-2xl border border-krishi-lightGray/70 p-5 shadow-sm hover:border-krishi-leafGreen/80 transition-all space-y-4 relative">
      {/* Top Author & Tags Row */}
      <div className="flex items-start justify-between gap-3">
        {/* Author Details */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-krishi-deepGreen text-krishi-warmIvory flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
            {post.author.full_name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-krishi-charcoal truncate">
                {post.author.full_name}
              </span>
              {post.author.is_verified_expert && (
                <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>प्रमाणित तज्ज्ञ</span>
                </span>
              )}
            </div>
            <div className="flex items-center text-[11px] text-krishi-gray space-x-2 mt-0.5">
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-0.5 text-krishi-leafGreen shrink-0" />
                {post.author.district}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-0.5 text-krishi-gray shrink-0" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Badges & Actions Menu */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {post.is_pinned && (
            <span className="flex items-center space-x-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              <Pin className="w-3 h-3" />
              <span>पिन केलेली</span>
            </span>
          )}
          {post.is_locked && (
            <span className="flex items-center space-x-1 text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              <Lock className="w-3 h-3" />
            </span>
          )}

          {/* Three Dots Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-krishi-gray hover:text-krishi-charcoal hover:bg-krishi-warmIvory/60 rounded-lg transition"
              aria-label="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-krishi-lightGray/70 py-1.5 z-20 text-xs">
                {isAuthor && onEdit && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(post);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-krishi-warmIvory flex items-center space-x-2 text-krishi-charcoal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>बदल करा (Edit)</span>
                  </button>
                )}
                {(isAuthor || isAdmin) && onDelete && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(post.id);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center space-x-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>हटवा (Delete)</span>
                  </button>
                )}
                {onReport && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onReport(post.id);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-krishi-warmIvory flex items-center space-x-2 text-amber-700"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>तक्रार करा (Report)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
        <span
          className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${topicMeta.color}`}
        >
          <TopicIcon className="w-3 h-3" />
          <span>{topicMeta.labelMr}</span>
        </span>
        {post.crop_category && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-krishi-warmIvory text-krishi-deepGreen border border-krishi-lightGray/60">
            🌱 {post.crop_category}
          </span>
        )}
      </div>

      {/* Title & Content */}
      <div className="space-y-1.5">
        <Link href={`/community/${post.id}`}>
          <h2 className="text-base sm:text-lg font-bold text-krishi-deepGreen hover:text-krishi-deepGreen/80 hover:underline transition">
            {post.title}
          </h2>
        </Link>
        <p className="text-xs sm:text-sm text-krishi-charcoal/85 leading-relaxed line-clamp-3">
          {post.content}
        </p>
      </div>

      {/* Image Previews if any */}
      {post.image_urls && post.image_urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {post.image_urls.map((img, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video border border-krishi-lightGray/40"
            >
              <img
                src={img}
                alt={`${post.title} photo ${idx + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer Engagements */}
      <div className="flex items-center justify-between pt-3 border-t border-krishi-lightGray/40 text-xs">
        <div className="flex items-center space-x-3">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl transition ${
              post.is_liked
                ? "bg-red-50 text-red-600 font-bold"
                : "text-krishi-gray hover:bg-krishi-warmIvory/60 hover:text-krishi-charcoal"
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${post.is_liked ? "fill-red-600" : ""}`} />
            <span>{post.upvotes_count}</span>
          </button>

          {/* Comment Link */}
          <Link
            href={`/community/${post.id}`}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-krishi-gray hover:bg-krishi-warmIvory/60 hover:text-krishi-charcoal transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments_count}</span>
          </Link>
        </div>

        <div className="flex items-center space-x-1">
          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-xl transition ${
              post.is_bookmarked
                ? "text-krishi-deepGreen bg-krishi-leafGreen/20 font-bold"
                : "text-krishi-gray hover:bg-krishi-warmIvory/60 hover:text-krishi-charcoal"
            }`}
            aria-label="Bookmark"
          >
            <Bookmark
              className={`w-4 h-4 ${post.is_bookmarked ? "fill-krishi-deepGreen" : ""}`}
            />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-krishi-gray hover:bg-krishi-warmIvory/60 hover:text-krishi-charcoal transition relative"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
            {shareFeedback && (
              <span className="absolute -top-7 right-0 bg-krishi-deepGreen text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap animate-fade-in">
                लिंक कॉपी झाली!
              </span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
