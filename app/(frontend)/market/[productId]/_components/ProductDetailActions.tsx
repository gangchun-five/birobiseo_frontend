"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";

import { createDirectOrderAction } from "@/services/domains/order/actions";
import { ProductPurchaseOption } from "@/services/domains/product/repository";

type ProductDetailActionsProps = {
  productId: number;
  options: ProductPurchaseOption[];
};

export function ProductDetailActions({ productId, options }: ProductDetailActionsProps) {
  const router = useRouter();
  const initialOption = options.find((option) => option.featured) ?? options[0];
  const [selectedOptionId, setSelectedOptionId] = useState(initialOption?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const selectedOption = useMemo(
    () => options.find((option) => option.id === selectedOptionId) ?? options[0],
    [options, selectedOptionId]
  );
  const totalPrice = (selectedOption?.price ?? 0) * quantity;

  const handleBuyNow = async () => {
    try {
      setPending(true);
      const result = await createDirectOrderAction({
        productId,
        optionId: selectedOption?.id,
        quantity
      });

      if (!result.success || !result.data) {
        throw new Error(result.error?.message ?? "주문 생성에 실패했습니다.");
      }

      router.push(`/market/purchase-complete/${result.data.order.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "주문 생성에 실패했습니다.";
      alert(message);

      if (message.includes("로그인")) {
        router.push("/login");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="product-buy-box">
      <div className="option-panel">
        <h2>용량 선택</h2>
        <div className="option-grid">
          {options.map((option) => (
            <label key={option.id} className={selectedOptionId === option.id ? "selected" : ""}>
              <input
                type="radio"
                name="purchaseOption"
                value={option.id}
                checked={selectedOptionId === option.id}
                onChange={() => setSelectedOptionId(option.id)}
              />
              <span>{option.label}</span>
              <strong>{option.price.toLocaleString("ko-KR")}원</strong>
              <em>{option.unitPriceLabel}</em>
            </label>
          ))}
        </div>
      </div>

      <div className="quantity-row">
        <span>수량</span>
        <div className="quantity-stepper">
          <button type="button" aria-label="수량 줄이기" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
            <Minus size={14} />
          </button>
          <strong>{quantity}</strong>
          <button type="button" aria-label="수량 늘리기" onClick={() => setQuantity((value) => Math.min(99, value + 1))}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="total-row">
        <span>총 상품금액</span>
        <strong>{totalPrice.toLocaleString("ko-KR")}원</strong>
      </div>

      <div className="purchase-actions">
        <button type="button" className="buy-action" onClick={handleBuyNow} disabled={pending}>
          {pending ? "주문 생성 중" : "바로 구매하기"}
        </button>
      </div>
    </div>
  );
}
