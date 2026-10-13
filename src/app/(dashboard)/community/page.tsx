"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import {
  getCommunityPostsAction,
  deleteCommunityPostAction,
  togglePostLikeAction,
  togglePostBookmarkAction,
} from "@/features/community/actions";
import { CommunityPost, TopicCategory } from "@/features/community/types";
import { TopicFilter } from "@/features/community/TopicFilter";
import { PostCard } from "@/features/community/PostCard";
import { CreatePostModal } from "@/features/community/CreatePostModal";
import { EditPostModal } from "@/features/community/EditPostModal";
import { ReportModal } from "@/features/community/ReportModal";
import { ModerationPanel } from "@/features/community/ModerationPanel";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Plus,
  ArrowLeft,
  ShieldAlert,
  Sparkles,
  MessageSquare,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function CommunityPage() {
  const { t } = useTranslation();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Active view: "feed" or "moderation"
  const [activeView, setActiveView] = useState<"feed" | "moderation">("feed");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getCommunityPostsAction({
        topic: selectedTopic,
        search: searchQuery,
        onlyBookmarked,
      });

      if (res.success && res.data) {
        setPosts(res.data.posts);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedTopic, searchQuery, onlyBookmarked]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleLike = async (postId: string) => {
    // Optimistic toggle
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newLiked = !p.is_liked;
          return {
            ...p,
            is_liked: newLiked,
            upvotes_count: newLiked ? p.upvotes_count + 1 : Math.max(0, p.upvotes_count - 1),
          };
        }
        return p;
      })
    );

    try {
      await togglePostLikeAction(postId);
    } catch {
      loadPosts();
    }
  };

  const handleBookmark = async (postId: string) => {
    // Optimistic toggle
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            is_bookmarked: !p.is_bookmarked,
          };
        }
        return p;
      })
    );

    try {
      await togglePostBookmarkAction(postId);
      if (onlyBookmarked) {
        loadPosts();
      }
    } catch {
      loadPosts();
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("तुम्हाला ही पोस्ट नक्की हटवायची आहे का?")) return;
    try {
      const res = await deleteCommunityPostAction(postId);
      if (res.success) {
        loadPosts();
      } else {
        alert(res.error || "हटवण्यात अयशस्वी");
      }
    } catch (err: any) {
      alert(err?.message || "त्रुटी");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/home"
              className="md:hidden text-krishi-textMuted hover:text-krishi-deepGreen p-1 -ml-1 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-extrabold text-krishi-deepGreen flex items-center gap-2">
              <Users className="w-7 h-7 text-krishi-leafGreen" />
              <span>शेतकरी चर्चा मंच (Farmer Community)</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-krishi-textMuted mt-1">
            शेतकरी बांधवांशी चर्चा करा, शंका विचारा आणि कृषी विद्यापीठांच्या तज्ज्ञांकडून खात्रीशीर सल्ला मिळवा
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setActiveView(activeView === "feed" ? "moderation" : "feed")}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              activeView === "moderation"
                ? "bg-red-50 text-red-700 border-red-300 ring-1 ring-red-400"
                : "bg-white text-krishi-charcoal border-krishi-lightGray/70 hover:bg-krishi-warmIvory/60"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>{activeView === "moderation" ? "चर्चा मंच पहा" : "नियंत्रण पॅनेल (Mod)"}</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>प्रश्न विचारा</span>
          </Button>
        </div>
      </div>

      {/* Main View Toggle */}
      {activeView === "moderation" ? (
        <ModerationPanel />
      ) : (
        <div className="space-y-5">
          {/* Topic Filters & Search */}
          <TopicFilter
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onlyBookmarked={onlyBookmarked}
            onToggleBookmarked={() => setOnlyBookmarked(!onlyBookmarked)}
            postCount={posts.length}
          />

          {/* Posts Feed */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-krishi-lightGray/60 p-5 space-y-3 animate-pulse"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="space-y-1.5 flex-1">
                      <div className="w-32 h-3.5 bg-gray-200 rounded" />
                      <div className="w-20 h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="w-3/4 h-5 bg-gray-200 rounded" />
                  <div className="w-full h-12 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-krishi-lightGray/70 p-8 text-center space-y-3 max-w-md mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-krishi-warmIvory flex items-center justify-center mx-auto text-krishi-deepGreen">
                <HelpCircle className="w-7 h-7 text-krishi-leafGreen" />
              </div>
              <h3 className="text-base font-bold text-krishi-deepGreen">
                {onlyBookmarked
                  ? "कोणतीही जतन केलेली चर्चा नाही"
                  : searchQuery
                  ? `"${searchQuery}" संदर्भात कोणतीही चर्चा सापडली नाही`
                  : "या प्रवर्गात कोणतीही चर्चा नाही"}
              </h3>
              <p className="text-xs text-krishi-gray">
                {onlyBookmarked
                  ? "तुम्ही बुकमार्क केलेले लेख येथे दिसतील."
                  : "पिकांची कीड, बाजारभाव किंवा खत नियोजनाबाबत पहिला प्रश्न विचारून चर्चा सुरू करा."}
              </p>
              <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                पहिला प्रश्न विचारा
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onEdit={(p) => setEditingPost(p)}
                  onDelete={handleDelete}
                  onReport={(id) => setReportingPostId(id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadPosts}
      />

      <EditPostModal
        post={editingPost}
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        onSuccess={loadPosts}
      />

      <ReportModal
        postId={reportingPostId || undefined}
        isOpen={!!reportingPostId}
        onClose={() => setReportingPostId(null)}
        onSuccess={loadPosts}
      />
    </div>
  );
}
