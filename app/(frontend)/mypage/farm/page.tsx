import Image from "next/image";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/utils/session";
import "../mypage.css";
import "../subpage.css";

import { MypageFarmEditor } from "../_components/MypageFarmEditor";
import { MypageSubpageSidebar } from "../_components/MypageSubpageSidebar";
import { getFarm } from "@/services/domains/farm/repository";
import { getMypageSummary } from "@/services/domains/user/repository";

export const dynamic = "force-dynamic";

export default async function MypageFarmPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/");
  }

  const [summary, farm] = await Promise.all([
    getMypageSummary(user.id),
    getFarm(user.id)
  ]);
  const cropText = farm.crops.map((crop) => crop.name).join(", ") || "등록된 작물이 없습니다.";

  return (
    <main className="mypage account-page">
        <section className="container-shell account-layout">
          <MypageSubpageSidebar active="farm" name={summary.profile.name} memberLabel={summary.profile.memberLabel} />
          <div className="account-content">
            <section className="account-hero farm-hero">
              <div>
                <h1>내 농가 정보</h1>
                <p>농가 정보를 간편하게 관리하세요.</p>
              </div>
              <Image src="/images/banner/mypage-banner.png" alt="" width={1792} height={1024} priority />
            </section>

            <MypageFarmEditor
              initialData={{
                farmName: farm.name,
                farmAddress: farm.address.roadAddress,
                crops: cropText,
                areaSquareMeter: farm.areaSquareMeter,
                soilType: farm.soil.type
              }}
            />
          </div>
        </section>
    </main>
  );
}
