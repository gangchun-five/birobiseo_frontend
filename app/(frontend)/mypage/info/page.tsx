import Image from "next/image";
import { redirect } from "next/navigation";
import { MypageInfoEditor } from "../_components/MypageInfoEditor";
import { MypageSubpageSidebar } from "../_components/MypageSubpageSidebar";
import { getFarm } from "@/services/domains/farm/repository";
import { getMypageSummary } from "@/services/domains/user/repository";
import { getSessionUser } from "@/utils/session";
import "../mypage.css";
import "../subpage.css";

export const dynamic = "force-dynamic";

export default async function MypageInfoPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/");
  }

  const [summary, farm] = await Promise.all([
    getMypageSummary(user.id),
    getFarm(user.id)
  ]);

  return (
    <main className="mypage account-page">
        <section className="container-shell account-layout">
          <MypageSubpageSidebar active="info" name={summary.profile.name} memberLabel={summary.profile.memberLabel} />
          <div className="account-content">
            <section className="account-hero">
              <div>
                <h1>내 정보</h1>
                <p>회원 정보와 배송 정보를 간편하게 관리하세요.</p>
              </div>
              <Image src="/images/banner/mypage-banner.png" alt="" width={1792} height={1024} priority />
            </section>

            <MypageInfoEditor
              initialData={{
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                shippingAddress: farm.address.roadAddress,
                deliveryMemo: "문 앞에 놓아주세요. 부재 시 연락 부탁드립니다."
              }}
            />
          </div>
        </section>
    </main>
  );
}
