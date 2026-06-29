import Link from "next/link";
import { InfoIcon, CreditCardIcon, PackageIcon, UserRoundIcon, HomeIcon } from "lucide-react";

type MypageSubpageSidebarProps = {
  active?: "mypage" | "info" | "farm" | "orders" | "payments" | "reviews";
  name: string;
  memberLabel: string;
  stats?: {
    totalOrderCount: number;
    savedRecommendationCount: number;
    reviewCount: number;
  };
};

const menuItems = [
  { id: "mypage", label: "마이페이지", href: "/mypage", icon: InfoIcon },
  { id: "info", label: "내 정보", href: "/mypage/info", icon: UserRoundIcon },
  { id: "farm", label: "내 농가 정보", href: "/mypage/farm", icon: HomeIcon },
  { id: "orders", label: "주문/배송 조회", href: "/mypage/orders", icon: PackageIcon },
  { id: "payments", label: "결제 내역", href: "/mypage/payments", icon: CreditCardIcon },
] as const;

export function MypageSubpageSidebar({ active, name, memberLabel, stats }: MypageSubpageSidebarProps) {
  return (
    <aside className="my-sidebar">
      <div className="profile-card">
        <div className="profile-avatar" aria-hidden="true">{name.slice(0, 1)}</div>
        <h2>{name}님</h2>
        {stats ? (
          <div className="profile-stats">
            <span>누적 주문<strong>{stats.totalOrderCount}건</strong></span>
            <span>저장한 추천<strong>{stats.savedRecommendationCount}개</strong></span>
            <span>리뷰 수<strong>{stats.reviewCount}개</strong></span>
          </div>
        ) : null}
      </div>
      <nav className="my-menu" aria-label="마이페이지 메뉴">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link href={item.href} className={active === item.id ? "active" : ""} key={item.id}>
              <span aria-hidden="true"><Icon size={17} /></span>
              {item.label}
              <strong>›</strong>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
