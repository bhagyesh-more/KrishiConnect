/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createCommunityPostAction } from "./actions";
import { TopicCategory } from "./types";
import { TOPIC_CONFIG } from "./TopicFilter";
import {
  X,
  MessageSquarePlus,
  Image as ImageIcon,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topicCategory, setTopicCategory] = useState<Exclude<TopicCategory, "all">>("crop_care");
  const [cropCategory, setCropCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    if (imageUrls.length >= 3) {
      setErrorMsg("जास्तीत जास्त ३ फोटो जोडता येतील (Maximum 3 photos allowed)");
      return;
    }
    setImageUrls([...imageUrls, imageUrl.trim()]);
    setImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

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
      const res = await createCommunityPostAction({
        title: title.trim(),
        content: content.trim(),
        topicCategory,
        cropCategory: cropCategory.trim() || undefined,
        imageUrls,
      });

      if (!res.success) {
        setErrorMsg(res.error || "पोस्ट तयार करण्यात त्रुटी आली");
        setIsLoading(false);
        return;
      }

      // Reset and close
      setTitle("");
      setContent("");
      setImageUrls([]);
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
      aria-labelledby="create-post-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-krishi-leafGreen/40">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-krishi-lightGray/40 bg-krishi-warmIvory/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-krishi-deepGreen text-white flex items-center justify-center shadow-sm">
              <MessageSquarePlus className="w-5 h-5 text-krishi-leafGreen" />
            </div>
            <div>
              <h2 id="create-post-title" className="text-lg font-bold text-krishi-deepGreen">
                नवीन प्रश्न / चर्चा सुरू करा
              </h2>
              <p className="text-xs text-krishi-gray">
                इतर शेतकरी व कृषी तज्ज्ञांकडून मार्गदर्शन मिळवा
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-krishi-gray hover:text-krishi-charcoal rounded-full"
            aria-label="Close"
          >
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
              placeholder="उदा. सोयाबीन, कांदा, कापूस, ऊस, डाळिंब"
              value={cropCategory}
              onChange={(e) => setCropCategory(e.target.value)}
            />
          </div>

          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-krishi-charcoal">
                प्रश्नाचे मुख्य शीर्षक (Title) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-krishi-gray">{title.length}/150</span>
            </div>
            <Input
              type="text"
              placeholder="उदा. सोयाबीनच्या शेंगा भरताना कीड नियंत्रण कसे करावे?"
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
                सविस्तर तपशील (Details) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-krishi-gray">{content.length}/3000</span>
            </div>
            <textarea
              rows={4}
              placeholder="तुमचा प्रश्न, पिकाची सद्यस्थिती, लक्षणे किंवा शेती अनुभव येथे सविस्तर मांडा..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-krishi-lightGray rounded-xl bg-white text-krishi-charcoal focus:ring-2 focus:ring-krishi-deepGreen outline-none transition"
              required
              maxLength={3000}
            />
          </div>

          {/* Photos Input */}
          <div className="space-y-2">
            <label className="block font-semibold text-krishi-charcoal">
              फोटो जोडा (Add Photos - Max 3)
            </label>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="फोटो URL पेस्ट करा (https://...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddImage}
                disabled={!imageUrl.trim() || imageUrls.length >= 3}
                className="px-3 py-2 bg-krishi-warmIvory border border-krishi-lightGray text-krishi-deepGreen rounded-xl text-xs font-semibold hover:bg-krishi-leafGreen/20 disabled:opacity-50 flex items-center space-x-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>जोडा</span>
              </button>
            </div>
            <p className="text-[11px] text-krishi-gray">
              टीप: उत्पादनात प्रत्येक फोटो कमाल ५MB (JPEG/PNG/WebP) आकाराचा असावा.
            </p>

            {/* Added Images Preview */}
            {imageUrls.length > 0 && (
              <div className="flex gap-2 pt-1">
                {imageUrls.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-16 rounded-xl overflow-hidden border border-krishi-lightGray"
                  >
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-krishi-lightGray/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              रद्द करा
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? "प्रकाशित होत आहे..." : "प्रकाशित करा"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
