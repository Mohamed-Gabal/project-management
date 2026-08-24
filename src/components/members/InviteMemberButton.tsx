"use client";

import Image from "next/image";
import { useState } from "react";

import Button from "@/components/ui/Button";
import inviteIcon from "@/assets/icons/invite-member.svg";
import InviteMemberModal from "./InviteMemberModal";

interface InviteMemberButtonProps {
  projectId: string;
}

const InviteMemberButton = ({ projectId }: InviteMemberButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <Button
        onClick={() => setIsOpen(true)}
        className="hidden h-10 items-center justify-center gap-2 rounded-md px-4 text-title-md shadow-card md:flex"
      >
        <Image src={inviteIcon} alt="" width={16} height={16} />
        Invite Member
      </Button>

      {/* Mobile */}
      <div className="flex justify-end md:hidden">
        <Button
          onClick={() => setIsOpen(true)}
          aria-label="Invite Member"
          className="flex h-10 w-10 items-center justify-center rounded-full shadow-lg"
        >
          <Image src={inviteIcon} alt="" width={18} height={18} />
        </Button>
      </div>

      {/* Modal */}
      <InviteMemberModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        projectId={projectId}
      />
    </>
  );
};

export default InviteMemberButton;
