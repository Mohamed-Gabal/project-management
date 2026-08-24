import Image from "next/image";
import PlusIcon from "@/assets/icons/plus.svg";
import { getInitials } from "@/lib/utils/getInitials";
import { ProjectMember } from "@/types/member";

interface MembersListProps {
  members: ProjectMember[];
}

const MembersList = ({ members }: MembersListProps) => {
  return (
    <div className="mx-auto w-full max-w-[789px] overflow-hidden rounded-lg border border-[#F1F3FF] bg-surface shadow-card">
      {/* Header — Desktop only */}
      <div className="hidden md:grid grid-cols-[minmax(0,1fr)_160px_70px] items-center gap-8 h-[54px] bg-[#E0E8FF]/30 pl-8 pr-8 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#434654]">
        <span>Member</span>
        <span>Role</span>
        <span>Actions</span>
      </div>

      {/* Desktop rows */}
      <div className="hidden md:block">
        {members.map((member) => {
          const name = member.metadata.name ?? "Unknown";
          const initials = getInitials(name);
          const isOwner = member.role === "owner";

          const avatarClass =
            member.role === "owner" || member.role === "viewer"
              ? "bg-[#DAE2FF] text-[#003D9B]"
              : "bg-[#82F9BE] text-[#003D9B]";

          const roleClass =
            member.role === "owner"
              ? "bg-[#0066D6] text-white"
              : "bg-[#DAE2FF] text-[#434654]";

          return (
            <div
              key={member.member_id}
              className="grid min-h-[88.5px] grid-cols-[minmax(0,1fr)_160px_70px] items-center gap-8 border-t border-[#F1F3FF] pl-8 pr-8"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-[14px] font-semibold ${avatarClass}`}
                >
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-semibold text-[#102A43]">
                    {name}
                  </span>
                  <span className="block truncate text-[10px] text-[#434654]">
                    {member.email}
                  </span>
                </div>
              </div>

              <span
                className={`w-fit max-w-full truncate rounded-full px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.3px] ${roleClass}`}
              >
                {member.role}
              </span>

              <div className="flex items-center justify-center">
                {!isOwner && (
                  <button
                    type="button"
                    aria-label={`Actions for ${name}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center"
                  >
                    <Image src={PlusIcon} alt="" width={15} height={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 pt-8 pr-4 pb-8 pl-4 md:hidden">
        {members.map((member) => {
          const name = member.metadata.name ?? "Unknown";
          const initials = getInitials(name);
          const isOwner = member.role === "owner";

          const avatarClass =
            member.role === "owner" || member.role === "viewer"
              ? "bg-[#DAE2FF] text-[#003D9B]"
              : "bg-[#82F9BE] text-[#003D9B]";

          const roleClass =
            member.role === "owner"
              ? "bg-[#0066D6] text-white"
              : "bg-[#DAE2FF] text-[#434654]";

          return (
            <div
              key={member.member_id}
              className="flex items-center gap-2 rounded-lg border border-[#F1F3FF] px-3 py-3"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[12px] font-semibold ${avatarClass}`}
              >
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-semibold text-[#102A43]">
                  {name}
                </span>
                <span className="block truncate text-[10px] text-[#434654]">
                  {member.email}
                </span>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                <span
                  className={`w-fit truncate rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.3px] ${roleClass}`}
                >
                  {member.role}
                </span>
                {!isOwner && (
                  <button
                    type="button"
                    aria-label={`Actions for ${name}`}
                    className="flex h-6 w-6 shrink-0 items-center justify-center"
                  >
                    <Image src={PlusIcon} alt="" width={13} height={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MembersList;
