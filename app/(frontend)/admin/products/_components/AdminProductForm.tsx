"use client";

import { useMemo, useState } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveProductAction, updateProductAction } from "@/services/domains/product/actions";
import { Product, ProductFilterOptions, ProductInput } from "@/services/domains/product/repository";

type ProductFormValues = {
  name: string;
  description: string;
  price: string;
  weight: string;
  badge: "" | "BEST" | "신상품" | "추천";
  crop: string;
  soil: string;
};

type AdminProductFormProps = {
  mode: "create" | "edit";
  product?: Product;
  filterOptions: ProductFilterOptions;
};

const badgeOptions = [
  { label: "없음", value: "" },
  { label: "BEST", value: "BEST" },
  { label: "신상품", value: "신상품" },
  { label: "추천", value: "추천" }
] as const;

function getInitialValues(product?: Product): ProductFormValues {
  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    weight: product?.weight ?? "20kg",
    badge: (product?.badge ?? "") as ProductFormValues["badge"],
    crop: product?.crop ?? "전체",
    soil: product?.soil ?? "전체"
  };
}

function normalizeNumber(value: string) {
  return Number(value.replace(/[^0-9.]/g, ""));
}

function includeSelectedOption(options: string[], selected: string) {
  return options.includes(selected) ? options : [...options, selected];
}

export function AdminProductForm({ mode, product, filterOptions }: AdminProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(() => getInitialValues(product));
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const isEdit = mode === "edit";
  const title = isEdit ? "제품 수정" : "새 제품 추가";
  const submitLabel = isEdit ? "수정 저장" : "제품 등록";
  const pricePreview = useMemo(() => {
    const price = normalizeNumber(values.price);
    return Number.isFinite(price) && price > 0 ? `${Math.round(price).toLocaleString("ko-KR")}원` : "가격 미입력";
  }, [values.price]);
  const cropOptions = useMemo(() => includeSelectedOption(filterOptions.crops, values.crop), [filterOptions.crops, values.crop]);
  const soilOptions = useMemo(() => includeSelectedOption(filterOptions.soils, values.soil), [filterOptions.soils, values.soil]);

  const updateField = (name: keyof ProductFormValues, value: string) => {
    setValues((current) => ({
      ...current,
      [name]: value
    }));
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const price = Math.round(normalizeNumber(values.price));

    if (!values.name.trim() || !values.description.trim()) {
      setMessage("제품명과 설명을 입력해주세요.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setMessage("판매가는 0보다 큰 숫자로 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    const payload: ProductInput = {
      name: values.name.trim(),
      description: values.description.trim(),
      price,
      weight: values.weight.trim() || "20kg",
      badge: values.badge || null,
      crop: values.crop,
      soil: values.soil
    };
    const result = isEdit && product
      ? await updateProductAction(product.id, payload)
      : await saveProductAction(payload);

    setSubmitting(false);

    if (!result.success) {
      setMessage(result.error?.message ?? "저장 중 오류가 발생했습니다.");
      return;
    }

    setMessage(isEdit ? "제품 수정이 저장되었습니다." : "새 제품이 등록되었습니다.");
    router.push("/admin");
    router.refresh();
  };

  return (
    <form className="admin-product-form" onSubmit={handleSubmit}>
      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <p>{isEdit ? `상품번호 #${product?.id}` : "카탈로그 신규 항목"}</p>
            <h2>{title}</h2>
          </div>
          <span>{pricePreview}</span>
        </div>

        <div className="admin-form-grid">
          <label className="admin-field admin-field-wide">
            <span>제품명</span>
            <input
              name="name"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="예: 프리미엄 유기질 비료"
              required
            />
          </label>

          <label className="admin-field admin-field-wide">
            <span>제품 설명</span>
            <textarea
              name="description"
              value={values.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="마켓 카드와 상세 화면에 노출되는 설명"
              rows={4}
              required
            />
          </label>

          <label className="admin-field">
            <span>판매가</span>
            <input
              name="price"
              value={values.price}
              onChange={(event) => updateField("price", event.target.value)}
              inputMode="numeric"
              placeholder="28000"
              required
            />
          </label>

          <label className="admin-field">
            <span>중량</span>
            <input
              name="weight"
              value={values.weight}
              onChange={(event) => updateField("weight", event.target.value)}
              placeholder="20kg"
              required
            />
          </label>

          <label className="admin-field">
            <span>배지</span>
            <select value={values.badge} onChange={(event) => updateField("badge", event.target.value)}>
              {badgeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span>추천 작물</span>
            <select value={values.crop} onChange={(event) => updateField("crop", event.target.value)}>
              {cropOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span>토양 상태</span>
            <select value={values.soil} onChange={(event) => updateField("soil", event.target.value)}>
              {soilOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>

        {message ? <p className={message.includes("되었습니다") ? "admin-form-success" : "admin-form-error"}>{message}</p> : null}
      </section>

      <div className="admin-form-actions">
        <button type="button" className="admin-secondary-button" onClick={() => router.push("/admin")}>
          취소
        </button>
        <button type="submit" className="admin-primary-button" disabled={submitting}>
          {submitting ? <Loader2 size={18} className="admin-spin" /> : isEdit ? <Save size={18} /> : <Check size={18} />}
          {submitting ? "저장 중" : submitLabel}
        </button>
      </div>
    </form>
  );
}
