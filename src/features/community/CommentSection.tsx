"use client";

import React, { useState } from "react";
import { PostComment } from "./types";
import { createPostCommentAction, deletePostCommentAction } from "./actions";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  MessageCircle,
  CornerDownRight,
  CheckCircle2,
  Trash2,
  Send,
  AlertCircle,
  Flag,
} from "lucide-react";

interface CommentSectionProps {
  postId: string;
  comments: PostComment[];
  currentUserId?: string;
  isAdmin?: boolean;
  onRefresh: () => void;
  onReport?: (commentId: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  currentUserId,
  isAdmin,
  onRefresh,
  onReport,
}) => {
  const [content, setContent] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddComment = async (parentCommentId?: string) => {
    const text = parentCommentId ? replyContent : content;
    if (!text.trim() || text.trim().length < 2) {
      setErrorMsg("प्रतिक्रिया किमान २ अक्षरांची असावी");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await createPostCommentAction(postId, {
        content: text.trim(),
        parentCommentId: parentCommentId || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error || "प्रतिक्रिया नोंदवण्यात त्रुटी");
        setIsLoading(false);
        return;
      }

      if (parentCommentId) {
        setReplyContent("");
        setReplyToId(null);
      } else {
        setContent("");
      }
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err?.message || "नेटवर्क त्रुटी");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("तुम्हाला ही प्रतिक्रिया नक्की हटवायची आहे का?")) return;
    try {
      await deletePostCommentAction(commentId, postId);
      onRefresh();
    } catch (err: any) {
      alert(err?.message || "हटवण्यात अयशस्वी");
    }
  };

  const renderComment = (c: PostComment, isReply = false) => {
    const isAuthor = currentUserId === c.author_id;
    const formattedDate = new Date(c.created_at).toLocaleDateString("mr-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div
        key={c.id}
        className={`p-3.5 rounded-xl border transition-all ${
          c.is_expert_answer
            ? "border-emerald-200 bg-emerald-50/40 shadow-sm"
            : "border-krishi-lightGray/50 bg-white"
        } ${isReply ? "ml-6 sm:ml-8 mt-2.5 border-l-2 border-l-krishi-leafGreen" : "mt-3"}`}
      >
        <div className="flex items-start justify-between gap-2">
          {/* Comment Author Details */}
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                c.is_expert_answer
                  ? "bg-emerald-700 text-white"
                  : "bg-krishi-warmIvory text-krishi-deepGreen border border-krishi-lightGray"
              }`}
            >
              {c.author.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-1.5 flex-wrap">
                <span className="font-bold text-xs text-krishi-charcoal">
                  {c.author.full_name}
                </span>
                {c.is_expert_answer && (
                  <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>प्रमाणित तज्ज्ञ उत्तर</span>
                  </span>
                )}
              </div>
              <span className="text-[10px] text-krishi-gray">
                {c.author.district} • {formattedDate}
              </span>
            </div>
          </div>

          {/* Action buttons (Delete / Report) */}
          <div className="flex items-center space-x-1 text-xs">
            {(isAuthor || isAdmin) && (
              <button
                onClick={() => handleDeleteComment(c.id)}
                className="p-1 text-krishi-gray hover:text-red-600 rounded"
                title="हटवा"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onReport && (
              <button
                onClick={() => onReport(c.id)}
                className="p-1 text-krishi-gray hover:text-amber-700 rounded"
                title="तक्रार करा"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Comment Content */}
        <p className="text-xs text-krishi-charcoal/90 mt-2 leading-relaxed whitespace-pre-wrap">
          {c.content}
        </p>

        {/* Reply Trigger */}
        {!isReply && (
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <button
              onClick={() => setReplyToId(replyToId === c.id ? null : c.id)}
              className="text-krishi-deepGreen font-semibold hover:underline flex items-center space-x-1"
            >
              <CornerDownRight className="w-3 h-3" />
              <span>उत्तर द्या (Reply)</span>
            </button>
          </div>
        )}

        {/* Inline Reply Box */}
        {replyToId === c.id && (
          <div className="mt-3 p-2.5 rounded-xl bg-krishi-warmIvory/60 border border-krishi-lightGray/60 space-y-2">
            <textarea
              rows={2}
              placeholder={`${c.author.full_name} यांना उत्तर लिहा...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-2 border border-krishi-lightGray rounded-lg text-xs outline-none focus:ring-1 focus:ring-krishi-deepGreen bg-white"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setReplyToId(null)}
                className="px-2.5 py-1 text-xs text-krishi-gray hover:text-krishi-charcoal"
              >
                रद्द
              </button>
              <button
                onClick={() => handleAddComment(c.id)}
                disabled={isLoading}
                className="px-3 py-1 bg-krishi-deepGreen text-white text-xs font-semibold rounded-lg hover:bg-krishi-deepGreen/90 disabled:opacity-50"
              >
                उत्तर पाठवा
              </button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {c.replies && c.replies.length > 0 && (
          <div className="space-y-1">
            {c.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 pt-4 border-t border-krishi-lightGray/60">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-krishi-deepGreen flex items-center space-x-2">
          <MessageCircle className="w-4 h-4 text-krishi-leafGreen" />
          <span>शेतकरी प्रतिक्रिया व उत्तरे ({comments.length})</span>
        </h3>
      </div>

      {errorMsg && (
        <Alert variant="error" className="py-2">
          <div className="flex items-center space-x-1.5 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        </Alert>
      )}

      {/* Main Comment Box */}
      <div className="flex items-start space-x-2 bg-krishi-warmIvory/40 p-3 rounded-2xl border border-krishi-lightGray/60">
        <textarea
          rows={2}
          placeholder="तुमचा अनुभव किंवा उत्तर येथे लिहा..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 p-2.5 border border-krishi-lightGray/70 rounded-xl text-xs sm:text-sm text-krishi-charcoal outline-none focus:ring-2 focus:ring-krishi-deepGreen bg-white"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleAddComment()}
          disabled={isLoading || !content.trim()}
          className="self-end"
        >
          <Send className="w-3.5 h-3.5 mr-1" />
          <span>पाठवा</span>
        </Button>
      </div>

      {/* Comments Thread List */}
      {comments.length === 0 ? (
        <p className="text-xs text-krishi-gray italic text-center py-4">
          अद्याप कोणतीही प्रतिक्रिया नाही. पहिले उत्तर देऊन मदत करा!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => renderComment(c, false))}
        </div>
      )}
    </div>
  );
};
