"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { deleteFarmAction, getFarmDependentsAction } from "./actions";
import { Trash2, AlertTriangle, X, Layers, Sprout, CheckSquare, Loader2 } from "lucide-react";

export interface DeleteFarmModalProps {
  isOpen: boolean;
  farm: {
    id: string;
    farm_name: string;
    location_district?: string;
    location_taluka?: string | null;
    total_area_acres?: number;
    farm_fields?: any[];
  } | null;
  onClose: () => void;
  onSuccess: (deletedFarmId: string) => void;
}

export const DeleteFarmModal: React.FC<DeleteFarmModalProps> = ({
  isOpen,
  farm,
  onClose,
  onSuccess,
}) => {
  const { t, language } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dependents, setDependents] = useState<{
    fieldsCount: number;
    cropsCount: number;
    tasksCount: number;
  }>({
    fieldsCount: farm?.farm_fields?.length || 0,
    cropsCount: 0,
    tasksCount: 0,
  });
  const [isLoadingDependents, setIsLoadingDependents] = useState(false);

  useEffect(() => {
    if (isOpen && farm?.id) {
      setErrorMsg(null);
      setIsDeleting(false);
      setIsLoadingDependents(true);

      getFarmDependentsAction(farm.id)
        .then((res) => {
          if (res.success && res.data) {
            setDependents({
              fieldsCount: res.data.fieldsCount,
              cropsCount: res.data.cropsCount,
              tasksCount: res.data.tasksCount,
            });
          }
        })
        .catch(() => {
          // Keep existing fields count from props on network failure
        })
        .finally(() => {
          setIsLoadingDependents(false);
        });
    }
  }, [isOpen, farm?.id]);

  if (!isOpen || !farm) return null;

  const handleDelete = async () => {
    setErrorMsg(null);
    setIsDeleting(true);

    try {
      const res = await deleteFarmAction(farm.id);

      if (res.success) {
        onSuccess(farm.id);
        onClose();
      } else {
        setErrorMsg(res.error || t("farming.deleteFarmError"));
      }
    } catch (err: any) {
      setErrorMsg(err.message || t("farming.deleteFarmError"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-farm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white w-full max-w-md rounded-3xl border border-krishi-border shadow-floating overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-krishi-border flex items-center justify-between bg-red-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="delete-farm-modal-title"
                className="text-base sm:text-lg font-bold text-red-950"
              >
                {t("farming.deleteFarmTitle")}
              </h3>
              <p className="text-xs text-red-800/80">
                {t("farming.deleteFarmSubtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            aria-label={t("common.cancel")}
            className="w-9 h-9 rounded-xl hover:bg-red-100/70 flex items-center justify-center text-red-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <Alert variant="error" icon={<AlertTriangle className="w-5 h-5 text-red-600" />}>
              <span>{errorMsg}</span>
            </Alert>
          )}

          {/* Farm Identification Card */}
          <div className="p-3.5 bg-krishi-ivory-100 rounded-2xl border border-krishi-border space-y-1">
            <div className="text-xs font-semibold text-krishi-textMuted">
              {t("farming.farmName")}
            </div>
            <div className="text-base font-extrabold text-krishi-deepGreen">
              {farm.farm_name}
            </div>
            <div className="text-xs text-krishi-textMuted flex items-center gap-2">
              <span>{farm.location_district}</span>
              {farm.total_area_acres && (
                <span>• {farm.total_area_acres} {t("farming.acresUnit")}</span>
              )}
            </div>
          </div>

          {/* Dependent Records Warning */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-2.5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs font-bold leading-snug">
                {t("farming.deleteFarmWarning")}
              </div>
            </div>

            <p className="text-[11px] text-amber-800 leading-relaxed">
              {t("farming.deleteFarmConsequences")}
            </p>

            {/* Counts Badge Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white/80 p-2 rounded-xl border border-amber-200">
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-900">
                  <Layers className="w-3 h-3 text-amber-700" />
                  <span>{isLoadingDependents ? "..." : dependents.fieldsCount}</span>
                </div>
                <div className="text-[10px] text-amber-800/80 mt-0.5">
                  {t("farming.fields")}
                </div>
              </div>

              <div className="bg-white/80 p-2 rounded-xl border border-amber-200">
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-900">
                  <Sprout className="w-3 h-3 text-emerald-700" />
                  <span>{isLoadingDependents ? "..." : dependents.cropsCount}</span>
                </div>
                <div className="text-[10px] text-amber-800/80 mt-0.5">
                  {t("farming.crops")}
                </div>
              </div>

              <div className="bg-white/80 p-2 rounded-xl border border-amber-200">
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-900">
                  <CheckSquare className="w-3 h-3 text-blue-700" />
                  <span>{isLoadingDependents ? "..." : dependents.tasksCount}</span>
                </div>
                <div className="text-[10px] text-amber-800/80 mt-0.5">
                  {t("farming.tasks")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-krishi-border bg-krishi-ivory-100/60 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="min-h-[44px]"
          >
            {t("common.cancel")}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleDelete}
            isLoading={isDeleting}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500 min-h-[44px]"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            <span>{isDeleting ? t("farming.deletingFarm") : t("farming.confirmDeleteFarm")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
