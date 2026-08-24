import Image from "next/image";
import { redirect } from "next/navigation";
import InviteUser from "@/assets/icons/invite-user.svg";
import Logo from "@/assets/icons/logo.svg";
import { getAccessToken } from "@/lib/auth/getAccessToken";
import AcceptInvitationButton from "@/components/invitation/AcceptInvitationButton";

interface InvitePageProps {
  searchParams: Promise<{ token?: string }>;
}

const InvitePage = async ({ searchParams }: InvitePageProps) => {
  const { token } = await searchParams;

  if (!token) {
    return (
      <section className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-gradient-to-b from-[#EEF1FF] to-white px-4 py-10 md:gap-12 md:py-16">
        <p className="text-body-md text-error">
          This invitation link is invalid or missing.
        </p>
      </section>
    );
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    const returnUrl = encodeURIComponent(`/invite?token=${token}`);
    redirect(`/login?redirect=${returnUrl}`);
  }

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-gradient-to-b from-[#EEF1FF] to-white px-4 py-10 md:gap-12 md:py-16">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src={Logo}
          alt="Taskly"
          width={24}
          height={24}
          className="md:h-7 md:w-7"
        />
        <span className="text-xl font-bold text-neutral-dark md:text-2xl">
          TASKLY
        </span>
      </div>

      {/* Card */}
      <div
        className="
          relative w-full max-w-[576px] rounded-[8px] bg-surface
          p-5 sm:p-8 md:p-12
          shadow-[0_24px_48px_-12px_rgba(4,27,60,0.06)]
        "
      >
        {/* Top accent bar */}
        <span className="absolute left-0 top-0 h-1 w-full rounded-t-[8px] bg-[#0052CC]" />

        <div className="flex flex-col items-center gap-3 text-center md:gap-4">
          {/* Badge */}
          <div className="flex items-center gap-1.5 whitespace-nowrap rounded-3xl bg-[#EEF1FF] px-3 py-1.5 md:px-4 md:py-2">
            <Image
              src={InviteUser}
              alt=""
              width={14}
              height={14}
              className="shrink-0"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.55px] text-[#434654] md:text-[11px]">
              New Project Invitation
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-[18px] font-semibold leading-[28px] tracking-[-0.5px] text-[#041B3C] sm:text-[26px] sm:leading-[32px] md:text-[30px] md:leading-[36px] md:tracking-[-0.75px]">
            You&apos;ve been invited to join new project
          </h1>
        </div>

        {/* CTA */}
        <AcceptInvitationButton token={token!} />
      </div>
    </section>
  );
};

export default InvitePage;
