"use client";

import { useEpicDetails } from "@/hooks/useEpicDetails";
import { getInitials } from "@/lib/utils/getInitials";
import EpicTitle from "@/assets/icons/epic.svg";
import CopyIcon from "@/assets/icons/copy.svg";
import CloseIcon from "@/assets/icons/close.svg";
import CalendarIcon from "@/assets/icons/epicDate.svg";
import Image from "next/image";
import EpicTaskList from "./EpicTaskList";
import { useState, useEffect } from "react";
import { updateEpic } from "@/services/epic";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { toast } from "react-toastify";

interface EpicDetailsModalProps {
  projectId: string;
  epicId: string;
  onClose: () => void;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const EpicDetailsModal = ({
  projectId,
  epicId,
  onClose,
}: EpicDetailsModalProps) => {
  const { epic, status } = useEpicDetails(projectId, epicId);
  const [title, setTitle] = useState("");
  const [savedTitle, setSavedTitle] = useState("");

  const [description, setDescription] = useState("");
  const [savedDescription, setSavedDescription] = useState("");

  const { members } = useProjectMembers(projectId);
  const [isEditingAssignee, setIsEditingAssignee] = useState(false);

  const [deadline, setDeadline] = useState("");

  const [assignee, setAssignee] = useState<{
    sub: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (epic) {
      setTitle(epic.title);
      setSavedTitle(epic.title);
      setDescription(epic.description ?? "");
      setSavedDescription(epic.description ?? "");
      setAssignee(epic.assignee?.sub ? epic.assignee : null);
      setDeadline(epic.deadline ?? "");
    }
  }, [epic]);

  const handleTitleBlur = async () => {
    if (!epic) return;

    // Required field revert if empty
    if (title.trim() === "") {
      setTitle(savedTitle);
      return;
    }

    if (title === savedTitle) return;

    const previousTitle = savedTitle;

    const response = await updateEpic(epic.id, { title });

    if (!response.ok) {
      setTitle(previousTitle);
      toast.error("Failed to update epic. Please try again.");
      return;
    }

    setSavedTitle(title);
  };

  const handleDescriptionBlur = async () => {
    if (!epic || description === savedDescription) return;

    const previousDescription = savedDescription;

    const response = await updateEpic(epic.id, { description });

    if (!response.ok) {
      setDescription(previousDescription);
      toast.error("Failed to update epic. Please try again.");
      return;
    }

    setSavedDescription(description);
  };

  const handleAssigneeChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!epic) return;

    const selectedId = e.target.value;
    const previousAssignee = assignee;

    setIsEditingAssignee(false);

    // Optimistic update
    if (!selectedId) {
      setAssignee(null);
    } else {
      const selectedMember = members.find((m) => m.user_id === selectedId);
      setAssignee({
        sub: selectedId,
        name: selectedMember?.metadata.name ?? "",
      });
    }

    const response = await updateEpic(epic.id, {
      assignee_id: selectedId || null,
    });

    if (!response.ok) {
      setAssignee(previousAssignee);
      toast.error("Failed to update epic. Please try again.");
    }
  };

  const handleDeadlineChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!epic) return;

    const newDeadline = e.target.value;
    const previousDeadline = deadline;

    // Optimistic update
    setDeadline(newDeadline);

    const response = await updateEpic(epic.id, {
      deadline: newDeadline || null,
    });

    if (!response.ok) {
      setDeadline(previousDeadline);
      toast.error("Failed to update epic. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[672px] overflow-y-auto rounded-lg bg-white p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {status === "loading" && (
          <p className="py-10 text-center text-body-sm text-neutral">
            Loading epic details...
          </p>
        )}

        {status === "error" && (
          <p className="py-10 text-center text-body-sm text-red-500">
            Failed to load epic details.
          </p>
        )}

        {status === "success" && epic && (
          <>
            {/* Header: Epic ID + Copy link + Close */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <span className="flex shrink-0 items-center gap-1 rounded-sm px-2 py-1 text-[11px] font-bold text-neutral">
                <Image src={EpicTitle} alt="" width={20} height={20} />
                {epic.epic_id}
              </span>

              <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  className="flex items-center gap-1 whitespace-nowrap text-[12px] font-medium text-neutral sm:text-[13px]"
                >
                  <Image src={CopyIcon} alt="" width={15} height={15} />
                  Copy link
                </button>
                <button
                  className="cursor-pointer"
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                >
                  <Image src={CloseIcon} alt="" width={20} height={20} />
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="mb-3 rounded-sm border border-[#E4E7F5] px-3 py-2.5 sm:mb-4 sm:px-4 sm:py-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                className="w-full bg-transparent text-body-md font-semibold text-neutral-dark outline-none sm:text-body-md"
              />
            </div>

            {/* Description */}
            <div className="mb-4 min-h-[64px] rounded-sm border border-[#E4E7F5] px-3 py-2.5 sm:mb-5 sm:min-h-[80px] sm:px-4 sm:py-3">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionBlur}
                placeholder="No description provided"
                className="w-full resize-none bg-transparent text-body-sm text-neutral outline-none"
              />
            </div>

            {/* Created By / Assignee / Deadline */}
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {/* Created By */}
              <div className="min-w-0">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98] sm:mb-2">
                  Created By
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#003D9B] text-[10px] font-semibold text-white">
                    {getInitials(epic.created_by?.name ?? "")}
                  </div>
                  <span className="min-w-0 truncate text-body-sm font-medium text-neutral-dark">
                    {epic.created_by?.name ?? "Unknown"}
                  </span>
                </div>
              </div>

              {/* Assignee */}
              <div className="min-w-0">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98] sm:mb-2">
                  Assignee
                </span>

                {isEditingAssignee ? (
                  <select
                    autoFocus
                    defaultValue={assignee?.sub ?? ""}
                    onChange={handleAssigneeChange}
                    onBlur={() => setIsEditingAssignee(false)}
                    className="w-full rounded-sm border border-[#E4E7F5] bg-surface px-2.5 py-1.5 text-body-sm font-medium text-neutral-dark outline-none"
                  >
                    <option value="">Unassigned</option>
                    {members.map((member) => (
                      <option key={member.user_id} value={member.user_id}>
                        {member.metadata.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div
                    onClick={() => setIsEditingAssignee(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-sm border border-[#E4E7F5] px-2.5 py-1.5"
                  >
                    {assignee?.name ? (
                      <>
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#82F9BE] text-[9px] font-semibold text-neutral-dark">
                          {getInitials(assignee.name)}
                        </div>
                        <span className="min-w-0 truncate text-body-sm font-medium text-neutral-dark">
                          {assignee.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-body-sm font-medium text-[#8B8D98]">
                        Unassigned
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Deadline */}
              <div className="min-w-0">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98] sm:mb-2">
                  Deadline
                </span>
                <input
                  type="date"
                  value={deadline}
                  onChange={handleDeadlineChange}
                  className="w-full rounded-sm border border-[#E4E7F5] bg-surface px-2.5 py-1.5 text-body-sm font-medium text-neutral-dark outline-none"
                />
              </div>
            </div>

            {/* Created At */}
            <div className="mb-4 border-b border-[#F1F3FF] pb-4 sm:mb-5">
              <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98] sm:mb-2">
                Created At
              </span>
              <div className="flex items-center gap-1">
                <Image src={CalendarIcon} alt="" width={13} height={13} />
                <span className="whitespace-nowrap text-body-sm font-medium text-neutral-dark">
                  {formatDate(epic.created_at)}
                </span>
              </div>
            </div>

            {/* Epic Tasks */}
            <EpicTaskList epicId={epic.id} />
          </>
        )}
      </div>
    </div>
  );
};

export default EpicDetailsModal;
