"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { updateCommunityPostAction } from "./actions";
import { CommunityPost, TopicCategory } from "./types";
import { X, Edit2, AlertCircle } from "lucide-react";

interface EditPostModalProps {
  post: CommunityPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  post,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topicCategory, setTopicCategory] = useState<Exclude<TopicCategory, "all">>("crop_care");
  const [cropCategory, setCropCategory] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setTopicCategory(post.topic_category);
      setCropCategory(post.crop_category || "");
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (title.trim().length < 5) {
      setErrorMsg("शीर्षक किमान ५ अक्षरांचे असावे");
      return;
    }

    if (content.trim().length < 10) {
      setErrorMsg("तपशील किमान १० अक्षरांचा असावा");
      return;
    }

    setIsLoading(true);
    try {
      const res = await updateCommunityPostAction(post.id, {
        title: title.trim(),
        content: content.trim(),
        topicCategory,
        cropCategory: cropCategory.trim() || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error || "बदल जतन करण्यात त्रुटी आली");
        setIsLoading(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "नेटवर्क त्रुटी");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-post-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-krishi-leafGreen/40">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-krishi-lightGray/40 bg-krishi-warmIvory/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-krishi-deepGreen text-white flex items-center justify-center shadow-sm">
              <Edit2 className="w-5 h-5 text-krishi-leafGreen" />
            </div>
            <div>
              <h2 id="edit-post-title" className="text-lg font-bold text-krishi-deepGreen">
                पोस्टमध्ये बदल करा (Edit Post)
              </h2>
              <p className="text-xs text-krishi-gray">
                माहिती अद्ययावत करून पुन्हा जतन करा
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-krishi-gray hover:text-krishi-charcoal rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
          {errorMsg && (
            <Alert variant="error" className="py-2.5">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            </Alert>
          )}

          {/* Topic Category */}
          <div>
            <label className="block font-semibold text-krishi-charcoal mb-1.5">
              विषय प्रवर्ग (Topic Category) <span className="text-red-500">*</span>
            </label>
            <select
              value={topicCategory}
              onChange={(e) => setTopicCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 border border-krishi-lightGray rounded-xl bg-white text-krishi-charcoal focus:ring-2 focus:ring-krishi-deepGreen outline-none"
              required
            >
              <option value="pest_disease">कीड व रोग नियंत्रण (Pest & Disease)</option>
              <option value="crop_care">पीक व्यवस्थापन व सल्ला (Crop Care)</option>
              <option value="market_price">बाजारभाव व विक्री (Market Price)</option>
              <option value="organic">सेंद्रिय व विषमुक्त शेती (Organic Farming)</option>
              <option value="equipment">यंत्रसामग्री व सिंचन (Equipment & Irrigation)</option>
              <option value="general">सर्वसाधारण चर्चा (General Discussion)</option>
            </select>
          </div>

          {/* Crop Tag */}
          <div>
            <label className="block font-semibold text-krishi-charcoal mb-1.5">
              संबंधित पीक (Related Crop - Optional)
            </label>
            <Input
              type="text"
              value={cropCategory}
              onChange={(e) => setCropCategory(e.target.value)}
            />
          </div>

          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-krishi-charcoal">
                शीर्षक (Title) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-krishi-gray">{title.length}/150</span>
            </div>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={150}
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-krishi-charcoal">
                सविस्तर मजकूर (Content) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-krishi-gray">{content.length}/3000</span>
            </div>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-krishi-lightGray rounded-xl bg-white text-krishi-charcoal focus:ring-2 focus:ring-krishi-deepGreen outline-none transition"
              required
              maxLength={3000}
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-krishi-lightGray/40">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              रद्द करा
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? "जतन होत आहे..." : "बदल जतन करा"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
