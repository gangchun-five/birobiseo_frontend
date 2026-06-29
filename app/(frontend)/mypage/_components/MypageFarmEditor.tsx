"use client";

import { useRef, useState } from "react";
import { Save } from "lucide-react";

import { updateMyFarmAction } from "@/services/domains/farm/actions";

type MypageFarmEditorProps = {
  initialData: {
    farmName: string;
    farmAddress: string;
    crops: string;
    areaSquareMeter: number;
    soilType: string;
  };
};

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function MypageFarmEditor({ initialData }: MypageFarmEditorProps) {
  const mainFormRef = useRef<HTMLFormElement>(null);
  const extraFormRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const basicFarmRows = [
    { label: "농가명", name: "farmName", value: initialData.farmName },
    { label: "농장 유형", name: "farmType", value: "노지 재배" },
    { label: "재배 지역", name: "farmAddress", value: initialData.farmAddress },
    { label: "주요 작물", name: "crops", value: initialData.crops },
    { label: "재배 면적", name: "area", value: String(initialData.areaSquareMeter) },
    { label: "토양 상태", name: "soilType", value: initialData.soilType },
    { label: "관수 방식", name: "irrigation", value: "스프링클러 관수" },
    { label: "유기농 여부", name: "organic", value: "아니요" }
  ];
  const extraRows = [
    { label: "맞춤 추천 기준", name: "recommendationBasis", value: "토양+작물 중심" }
  ];

  const save = async () => {
    if (!mainFormRef.current || !extraFormRef.current) {
      return;
    }

    const main = new FormData(mainFormRef.current);
    setStatus("saving");

    try {
      const result = await updateMyFarmAction({
        farmName: getValue(main, "farmName"),
        farmAddress: getValue(main, "farmAddress"),
        crops: getValue(main, "crops"),
        area: getValue(main, "area"),
        soilType: getValue(main, "soilType")
      });

      if (!result.success) {
        throw new Error(result.error?.message ?? "저장에 실패했습니다.");
      }

      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <div className="account-card-grid farm-grid">
        <section className="account-info-card">
          <h2>기본 농가 정보</h2>
          <form ref={mainFormRef} className="account-form farm-form">
            {basicFarmRows.map((row) => (
              <label key={row.label}>
                <span>{row.label}</span>
                <input
                  name={row.name}
                  type={row.name === "area" ? "number" : "text"}
                  defaultValue={row.value}
                  placeholder={`${row.label}을 입력하세요`}
                />
              </label>
            ))}
          </form>
        </section>

        <section className="account-info-card farm-extra-card">
          <h2>추가 관리 정보</h2>
          <form ref={extraFormRef} className="account-form farm-form">
            {extraRows.map((row) => (
              <label key={row.label}>
                <span>{row.label}</span>
                <input name={row.name} defaultValue={row.value} placeholder={`${row.label}을 입력하세요`} />
              </label>
            ))}
          </form>
        </section>
      </div>

      <div className="account-action-row">
        <button type="button" className="primary" onClick={save} disabled={status === "saving"}>
          <Save size={20} />{status === "saving" ? "저장 중" : "저장하기"}
        </button>
        {status === "saved" ? <p className="form-save-message">저장되었습니다.</p> : null}
        {status === "error" ? <p className="form-save-message error">저장에 실패했습니다.</p> : null}
      </div>
    </>
  );
}
