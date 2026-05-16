'use client';

import React, { useState } from 'react';
import { ThailandAddressTypeahead, ThailandAddressValue } from 'react-thailand-address-typeahead';

interface ThaiAddressFieldsProps {
    value: { subdistrict: string; district: string; province: string; postalCode: string; };
    onChange: (val: { subdistrict: string; district: string; province: string; postalCode: string; }) => void;
}

export default function ThaiAddressFields({ value, onChange }: ThaiAddressFieldsProps) {
    const [internalVal, setInternalVal] = useState<ThailandAddressValue>(() => {
        return ThailandAddressValue.empty();
    });

    const handleChange = (val: ThailandAddressValue) => {
        setInternalVal(val);
        onChange({
            subdistrict: val.subdistrict,
            district: val.district,
            province: val.province,
            postalCode: val.postalCode
        });
    };

    return (
        <ThailandAddressTypeahead
            value={internalVal}
            onValueChange={handleChange}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ThailandAddressTypeahead.SubdistrictInput
                    required
                    placeholder="ตำบล/แขวง"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                <ThailandAddressTypeahead.DistrictInput
                    required
                    placeholder="อำเภอ/เขต"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <ThailandAddressTypeahead.ProvinceInput
                    required
                    placeholder="จังหวัด"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                <ThailandAddressTypeahead.PostalCodeInput
                    required
                    placeholder="รหัสไปรษณีย์"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
            </div>

            <ThailandAddressTypeahead.Suggestion
                containerProps={{
                    className: "absolute w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50 text-sm"
                }}
                optionItemProps={{
                    className: "cursor-pointer px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                }}
            />
        </ThailandAddressTypeahead>
    );
}
