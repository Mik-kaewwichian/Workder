'use client';

import React, { useState, useRef } from 'react';
import { Camera, ImagePlus, Loader2, PackageCheck, Trash2, X } from 'lucide-react';

export default function ProofPhotoModal({
    jobTitle,
    onConfirm,
    onCancel,
    busy,
}: {
    jobTitle: string;
    onConfirm: (photos: string[]) => void;
    onCancel: () => void;
    busy: boolean;
}) {
    const [photos, setPhotos] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) setPhotos((prev) => [...prev, result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

            {/* Modal */}
            <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
                    <div className="flex items-center gap-2">
                        <Camera size={16} className="text-blue-600" />
                        <span className="text-sm font-bold text-slate-800">อัปโหลดหลักฐานการทำงาน</span>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                    <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                        <p className="text-xs font-semibold text-blue-800 mb-0.5">งาน: {jobTitle}</p>
                        <p className="text-xs text-blue-600">
                            กรุณาอัปโหลดรูปภาพหลักฐานว่างานเสร็จเรียบร้อยแล้ว อย่างน้อย 1 รูป
                        </p>
                    </div>

                    {/* Upload area */}
                    <div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl py-5 flex flex-col items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors bg-slate-50 hover:bg-blue-50"
                        >
                            <ImagePlus size={24} />
                            <span className="text-xs font-semibold">แตะเพื่อเลือกรูปภาพ</span>
                            <span className="text-[10px]">รองรับ JPG, PNG, HEIC</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                    </div>

                    {/* Photo previews */}
                    {photos.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                รูปที่เลือก ({photos.length})
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {photos.map((src, i) => (
                                    <div key={i} className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={src} alt={`proof-${i}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removePhoto(i)}
                                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-slate-100 bg-white shrink-0 flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={busy}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={() => onConfirm(photos)}
                        disabled={busy || photos.length === 0}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                        {busy ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <PackageCheck size={14} />
                        )}
                        {busy ? 'กำลังส่ง...' : `ยืนยันงานเสร็จ (${photos.length} รูป)`}
                    </button>
                </div>
            </div>
        </div>
    );
}
