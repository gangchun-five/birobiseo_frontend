"use client";

import { useRef, useState } from "react";
import { LockKeyhole, Mail, Phone, Save, ShieldCheck, UserRound } from "lucide-react";
import { updateMyFarmAddressAction, updateMyProfileAction } from "@/services/domains/user/actions";

type MypageInfoEditorProps = {
  initialData: {
    name: string;
    email: string;
    phone: string;
    shippingAddress: string;
    deliveryMemo: string;
  };
};

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function MypageInfoEditor({ initialData }: MypageInfoEditorProps) {
  const profileFormRef = useRef<HTMLFormElement>(null);
  const shippingFormRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const basicRows = [
    { label: "이름", value: initialData.name, icon: UserRound, name: "name" },
    { label: "아이디/이메일", value: initialData.email, icon: Mail, name: "email" },
    { label: "휴대폰 번호", value: initialData.phone, icon: Phone, name: "phone" },
    { label: "비밀번호", value: "********", icon: LockKeyhole, action: "비밀번호 변경" }
  ];
  const shippingRows = [
    { label: "기본 배송지", value: initialData.shippingAddress, icon: ShieldCheck, name: "shippingAddress" },
    { label: "수령인", value: initialData.name, icon: UserRound, name: "receiverName" },
    { label: "연락처", value: initialData.phone, icon: Phone, name: "receiverPhone" },
    { label: "배송 요청사항", value: initialData.deliveryMemo, icon: Mail, name: "deliveryMemo" }
  ];

  const save = async () => {
    if (!profileFormRef.current || !shippingFormRef.current) {
      return;
    }

    const profile = new FormData(profileFormRef.current);
    const shipping = new FormData(shippingFormRef.current);
    setStatus("saving");

    try {
      const [profileResult, farmResult] = await Promise.all([
        updateMyProfileAction({
          name: getValue(profile, "name"),
          email: getValue(profile, "email"),
          phone: getValue(profile, "phone")
        }),
        updateMyFarmAddressAction({
          roadAddress: getValue(shipping, "shippingAddress")
        })
      ]);

      if (!profileResult.success || !farmResult.success) {
        throw new Error(profileResult.error?.message ?? farmResult.error?.message ?? "저장에 실패했습니다.");
      }

      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <div className="account-card-grid">
        <section className="account-info-card">
          <div className="account-card-head">
            <h2>기본 회원 정보</h2>
          </div>
          <form ref={profileFormRef} className="account-form">
            {basicRows.map((row) => {
              const Icon = row.icon;

              return (
                <label key={row.label}>
                  <span><Icon size={20} />{row.label}</span>
                  {row.action ? (
                    <div className="password-display">
                      <strong>{row.value}</strong>
                      <button type="button">{row.action}</button>
                    </div>
                  ) : (
                    <input name={row.name} defaultValue={row.value} placeholder={`${row.label}을 입력하세요`} />
                  )}
                </label>
              );
            })}
          </form>
        </section>

        <section className="account-info-card">
          <div className="account-card-head">
            <h2>배송지 및 수령 정보</h2>
          </div>
          <form ref={shippingFormRef} className="account-form">
            {shippingRows.map((row) => {
              const Icon = row.icon;

              return (
                <label key={row.label}>
                  <span><Icon size={20} />{row.label}</span>
                  <input name={row.name} defaultValue={row.value} placeholder={`${row.label}을 입력하세요`} />
                </label>
              );
            })}
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
