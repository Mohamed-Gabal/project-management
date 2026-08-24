"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptInvitation } from "@/services/invitation";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";

interface AcceptInvitationButtonProps {
  token: string;
}

const AcceptInvitationButton = ({ token }: AcceptInvitationButtonProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setIsSubmitting(true);

    const result = await acceptInvitation(token);

    if (!result.ok) {
      toast.error(result.message);
      setIsSubmitting(false);
      return;
    }

    toast.success("Invitation accepted successfully");
    router.push("/project");
  };

  return (
    <div className="mt-6 flex w-full flex-col gap-4 md:mt-4">
      <Button
        onClick={handleAccept}
        disabled={isSubmitting}
        className="h-10 w-full text-[12px] md:h-[52px] md:text-[16px] rounded-md"
      >
        {isSubmitting ? "Accepting..." : "Accept Invitation"}
      </Button>
    </div>
  );
};

export default AcceptInvitationButton;
