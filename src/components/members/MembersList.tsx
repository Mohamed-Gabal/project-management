import Image from "next/image";
import PlusIcon from "@/assets/icons/plus.svg";
import { getInitials } from "@/lib/utils/getInitials";

interface Member {
  member_id: string;
  user_id: string;
  project_id: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  metadata: {
    name: string | null;
    email: string | null;
    job_title: string | null;
  };
}

interface MembersListProps {
  members: Member[];
}

const MembersList = ({ members }: MembersListProps) => {
  return (
    <div className="mx-auto w-full max-w-[789px] rounded-lg border border-[#F1F3FF] bg-surface shadow-card md:mt-15">
      {/* Table Header */}
      <div className="flex items-center justify-between bg-[#F1F3FF] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#434654]">
        <span>Member</span>
        <span>Role</span>
        <span>Actions</span>
      </div>

      {/* Members */}
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
            className="grid min-h-[92px] grid-cols-[1fr_60px_30px] items-center border-t border-[#F1F3FF] px-3 py-3 md:grid-cols-[1fr_160px_70px] md:px-6"
          >
            {/* Member */}
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-[14px] font-semibold ${avatarClass}`}
              >
                {initials}
              </div>

              <div className="flex min-w-0 flex-col">
                <span className="text-[12px] font-semibold text-[#102A43]">
                  {name}
                </span>

                <span className="truncate text-[10px] text-[#434654]">
                  {member.email}
                </span>
              </div>
            </div>

            {/* Role */}
            <span
              className={`w-fit rounded-full px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.3px] ${roleClass}`}
            >
              {member.role}
            </span>

            {/* Actions */}
            <div className="flex items-center justify-center">
              {!isOwner && (
                <button
                  type="button"
                  aria-label={`Actions for ${name}`}
                  className="flex h-8 w-8 items-center justify-center"
                >
                  <Image src={PlusIcon} alt="" width={15} height={15} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MembersList;
