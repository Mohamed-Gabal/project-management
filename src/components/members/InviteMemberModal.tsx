"use client";

import Image from "next/image";
import closeIcon from "@/assets/icons/close.svg";
import InviteIcon from "@/assets/icons/invite-member.svg";
import MessageIcon from "@/assets/icons/message.svg";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InviteMemberFormValues,
  InviteMemberSchema,
} from "@/lib/validations/inviteMember";

import { inviteMember } from "@/services/invitation";

import { toast } from "react-toastify";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const InviteMemberModal = ({
  isOpen,
  onClose,
  projectId,
}: InviteMemberModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(InviteMemberSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  if (!isOpen) return null;
  const onSubmit = async (data: InviteMemberFormValues) => {
    const response = await inviteMember(data.email, projectId);

    if (response.ok) {
      toast.success("Invitation sent successfully");
      onClose();
      return;
    }

    toast.error(response.message);
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-[448px] bg-white
          rounded-t-[32px] p-8 flex flex-col gap-2.5
          shadow-[0_-4px_24px_0_rgba(4,27,60,0.06)]
          md:rounded-[8px] md:shadow-[0_24px_48px_-12px_rgba(4,27,60,0.12)]
        "
      >
        {/* Drag handle - mobile only */}
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[#E5E7EB] md:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF1FF]">
            <Image src={InviteIcon} alt="" width={20} height={20} />
          </div>

          <button
            disabled={isSubmitting}
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-6 w-6 items-center justify-center cursor-pointer"
          >
            <Image src={closeIcon} alt="" width={14} height={14} />
          </button>
        </div>

        {/* Title + description */}
        <h2 className="mt-4 text-title-lg font-bold text-neutral-dark">
          Invite Team Member
        </h2>
        <p className="text-body-md text-neutral">
          Send an invitation to join the Architectural Studio workspace.
        </p>

        {/* Email field */}
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <label
            htmlFor="invite-email"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-neutral"
          >
            Email Address
          </label>

          <div
            className={`flex h-11 items-center justify-between bg-[#D7E2FF] rounded-md border px-3 ${errors.email ? "border-red-500" : "border-[#D9DDE7]"}`}
          >
            <input
              id="invite-email"
              disabled={isSubmitting}
              type="email"
              {...register("email")}
              placeholder="Enter email address"
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
            />
            <Image src={MessageIcon} alt="" width={16} height={16} />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-md text-title-md text-neutral-dark md:h-10 md:px-5 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-md bg-primary hover:bg-primary-container transition-all duration-300 text-title-md text-surface md:h-10 md:px-5 cursor-pointer"
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;
