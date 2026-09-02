// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";

// import { loadTaskDetails, UpdateTaskDetails } from "@/actions/task";
// import CloseIcon from "@/assets/icons/close.svg";
// import CalendarIcon from "@/assets/icons/epicDate.svg";
// import LinkIcon from "@/assets/icons/copy.svg";

// import { getInitials } from "@/lib/utils/getInitials";
// import ProjectSkeleton from "../ui/ProjectSkeleton";

// import { updateTaskSchema } from "@/lib/validations/task";
// import { toast } from "react-toastify";
// import { ProjectMember } from "@/types/member";

// interface TaskDetailsModalProps {
//   projectId: string;
//   taskId: string;
//   onClose: () => void;
// }

// type TaskDetailsStatus = "loading" | "success" | "error" | "empty";

// interface TaskDetails {
//   id: string;
//   title: string;
//   description: string | null;
//   due_date: string | null;
//   created_at: string;
//   status: string;
//   epic_id?: string | null;
//   epic_name?: string | null;
//   assignee?: {
//     id?: string;
//     name?: string;
//     avatar?: string;
//   } | null;
//   reporter?: {
//     name?: string;
//     avatar?: string;
//   } | null;
// }

// const formatDate = (date: string | null) => {
//   if (!date) return "—";

//   return new Date(date).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const formatStatus = (status: string) => {
//   return status.replaceAll("_", " ");
// };

// const getStatusStyle = (status: string) => {
//   switch (status) {
//     case "IN_PROGRESS":
//       return "bg-[#DBEAFE] text-[#1D4ED8]";

//     case "DONE":
//     case "COMPLETED":
//       return "bg-[#DCFCE7] text-[#15803D]";

//     case "BLOCKED":
//       return "bg-[#FEE2E2] text-[#B91C1C]";

//     case "TO_DO":
//       return "bg-[#F1F5F9] text-[#475569]";

//     default:
//       return "bg-[#F1F5F9] text-[#475569]";
//   }
// };

// // Small inline chevron — avoids depending on an external icon asset that may not exist.
// const ChevronIcon = ({ className = "" }: { className?: string }) => (
//   <svg viewBox="0 0 10 6" fill="none" className={className} aria-hidden="true">
//     <path
//       d="M1 1l4 4 4-4"
//       stroke="currentColor"
//       strokeWidth="1.4"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </svg>
// );

// const TaskDetailsModal = ({
//   projectId,
//   taskId,
//   onClose,
// }: TaskDetailsModalProps) => {
//   const [task, setTask] = useState<TaskDetails | null>(null);
//   const [status, setStatus] = useState<TaskDetailsStatus>("loading");

//   // Keeps the editable title separate from the fetched task data.
//   const [title, setTitle] = useState("");
//   const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);

//   const [description, setDescription] = useState("");
//   const [isUpdatingDescription, setIsUpdatingDescription] = useState(false);

//   const [members, setMembers] = useState<ProjectMember[]>([]);
//   const [isUpdatingAssignee, setIsUpdatingAssignee] = useState(false);

//   const [epics, setEpics] = useState<
//     {
//       id: string;
//       epic_id: string;
//       title: string;
//     }[]
//   >([]);
//   const [isUpdatingEpic, setIsUpdatingEpic] = useState(false);

//   const [isUpdatingDueDate, setIsUpdatingDueDate] = useState(false);

//   const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

//   const [isEditingAssignee, setIsEditingAssignee] = useState(false);

//   useEffect(() => {
//     const fetchTaskDetails = async () => {
//       setStatus("loading");
//       setTask(null);

//       const result = await loadTaskDetails(projectId, taskId);

//       if (!result.ok) {
//         setStatus("error");
//         return;
//       }

//       if (!result.data) {
//         setStatus("empty");
//         return;
//       }

//       setTask(result.data);
//       setTitle(result.data.title);
//       setDescription(result.data.description ?? "");
//       setStatus("success");
//     };

//     fetchTaskDetails();
//   }, [projectId, taskId]);

//   // Close the modal when the user presses Escape.
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [onClose]);

//   useEffect(() => {
//     const loadMembers = async () => {
//       try {
//         const response = await fetch(`/api/getProjectMembers/${projectId}`);

//         const result = await response.json();

//         if (!response.ok) {
//           return;
//         }

//         setMembers(result);
//       } catch {
//         return;
//       }
//     };

//     if (projectId) {
//       loadMembers();
//     }
//   }, [projectId]);

//   useEffect(() => {
//     const loadEpics = async () => {
//       try {
//         const response = await fetch(`/api/getProjectEpics/${projectId}`);

//         const result = await response.json();

//         if (!response.ok) {
//           return;
//         }

//         setEpics(result);
//       } catch {
//         return;
//       }
//     };

//     if (projectId) {
//       loadEpics();
//     }
//   }, [projectId]);

//   const handleTitleBlur = async () => {
//     if (!task || isUpdatingTitle) return;

//     const newTitle = title.trim();
//     const previousTitle = task.title;

//     // Skip the API request when the title has not changed.
//     if (newTitle === previousTitle) {
//       setTitle(previousTitle);
//       return;
//     }

//     // Validate the updated title before sending the PATCH request.
//     const validation = updateTaskSchema.safeParse({
//       title: newTitle,
//     });

//     if (!validation.success) {
//       setTitle(previousTitle);
//       toast.error(validation.error.issues[0]?.message);
//       return;
//     }

//     // Optimistic update: update the UI immediately.
//     setTask((previousTask) =>
//       previousTask
//         ? {
//             ...previousTask,
//             title: newTitle,
//           }
//         : previousTask,
//     );

//     setTitle(newTitle);
//     setIsUpdatingTitle(true);

//     const result = await UpdateTaskDetails(task.id, {
//       title: newTitle,
//     });

//     if (!result.ok) {
//       // Roll back the optimistic update when the API request fails.
//       setTask((previousTask) =>
//         previousTask
//           ? {
//               ...previousTask,
//               title: previousTitle,
//             }
//           : previousTask,
//       );

//       setTitle(previousTitle);

//       toast.error("Failed to update task. Please try again.");
//     } else {
//       toast.success("Task updated successfully.");
//     }

//     setIsUpdatingTitle(false);
//   };

//   const handleDescriptionBlur = async () => {
//     if (!task || isUpdatingDescription) return;

//     const newDescription = description.trim();
//     const previousDescription = task.description ?? "";

//     // Skip the API request when the description has not changed.
//     if (newDescription === previousDescription) {
//       setDescription(previousDescription);
//       return;
//     }

//     // Optimistic update: update the UI immediately.
//     setTask((previousTask) =>
//       previousTask
//         ? {
//             ...previousTask,
//             description: newDescription || null,
//           }
//         : previousTask,
//     );

//     setDescription(newDescription);
//     setIsUpdatingDescription(true);

//     const result = await UpdateTaskDetails(task.id, {
//       description: newDescription || null,
//     });

//     if (!result.ok) {
//       // Roll back the optimistic update when the API request fails.
//       setTask((previousTask) =>
//         previousTask
//           ? {
//               ...previousTask,
//               description: previousDescription || null,
//             }
//           : previousTask,
//       );

//       setDescription(previousDescription);

//       toast.error("Failed to update task. Please try again.");
//     } else {
//       toast.success("Task updated successfully.");
//     }

//     setIsUpdatingDescription(false);
//   };

//   const handleAssigneeChange = async (
//     event: React.ChangeEvent<HTMLSelectElement>,
//   ) => {
//     if (!task || isUpdatingAssignee) return;

//     const newAssigneeId = event.target.value || null;
//     const previousAssignee = task.assignee;

//     // Skip the API request when the assignee has not changed.
//     if (newAssigneeId === (previousAssignee?.id ?? null)) {
//       return;
//     }

//     const selectedMember =
//       members.find((member) => member.user_id === newAssigneeId) ?? null;

//     // Optimistic update.
//     setTask((previousTask) =>
//       previousTask
//         ? {
//             ...previousTask,
//             assignee: selectedMember
//               ? {
//                   id: selectedMember.user_id,
//                   name: selectedMember.metadata.name,
//                   avatar: undefined,
//                 }
//               : null,
//           }
//         : previousTask,
//     );

//     setIsUpdatingAssignee(true);

//     const result = await UpdateTaskDetails(task.id, {
//       assignee_id: newAssigneeId,
//     });

//     if (!result.ok) {
//       // Roll back to the previous assignee.
//       setTask((previousTask) =>
//         previousTask
//           ? {
//               ...previousTask,
//               assignee: previousAssignee,
//             }
//           : previousTask,
//       );

//       toast.error("Failed to update task. Please try again.");
//     } else {
//       toast.success("Task updated successfully.");
//     }

//     setIsUpdatingAssignee(false);
//   };

//   const handleEpicChange = async (
//     event: React.ChangeEvent<HTMLSelectElement>,
//   ) => {
//     if (!task || isUpdatingEpic) return;

//     const newEpicId = event.target.value || null;
//     const previousEpicId = task.epic_id ?? null;
//     const previousEpicName = task.epic_name ?? null;

//     if (newEpicId === previousEpicId) {
//       return;
//     }

//     const selectedEpic = epics.find((epic) => epic.id === newEpicId) ?? null;

//     // Optimistic update.
//     setTask((previousTask) =>
//       previousTask
//         ? {
//             ...previousTask,
//             epic_id: newEpicId,
//             epic_name: selectedEpic?.title ?? null,
//           }
//         : previousTask,
//     );

//     setIsUpdatingEpic(true);

//     const result = await UpdateTaskDetails(task.id, {
//       epic_id: newEpicId,
//     });

//     if (!result.ok) {
//       // Roll back the previous epic.
//       setTask((previousTask) =>
//         previousTask
//           ? {
//               ...previousTask,
//               epic_id: previousEpicId,
//               epic_name: previousEpicName,
//             }
//           : previousTask,
//       );

//       toast.error("Failed to update task. Please try again.");
//     } else {
//       toast.success("Task updated successfully.");
//     }

//     setIsUpdatingEpic(false);
//   };

//   const handleDueDateChange = async (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     if (!task || isUpdatingDueDate) return;

//     const newDueDate = event.target.value || null;
//     const previousDueDate = task.due_date;

//     if (newDueDate === previousDueDate) {
//       return;
//     }

//     if (newDueDate) {
//       const validation = updateTaskSchema.safeParse({
//         due_date: newDueDate,
//       });

//       if (!validation.success) {
//         toast.error(validation.error.issues[0]?.message);
//         return;
//       }
//     }

//     // Optimistic update.
//     setTask((previousTask) =>
//       previousTask
//         ? {
//             ...previousTask,
//             due_date: newDueDate,
//           }
//         : previousTask,
//     );

//     setIsUpdatingDueDate(true);

//     const result = await UpdateTaskDetails(task.id, {
//       due_date: newDueDate,
//     });

//     if (!result.ok) {
//       // Roll back the previous due date.
//       setTask((previousTask) =>
//         previousTask
//           ? {
//               ...previousTask,
//               due_date: previousDueDate,
//             }
//           : previousTask,
//       );

//       toast.error("Failed to update task. Please try again.");
//     } else {
//       toast.success("Task updated successfully.");
//     }

//     setIsUpdatingDueDate(false);
//   };

//   const handleStatusChange = async (
//     event: React.ChangeEvent<HTMLSelectElement>,
//   ) => {
//     if (!task || isUpdatingStatus) return;

//     const newStatus = event.target.value;
//     const previousStatus = task.status;

//     if (newStatus === previousStatus) {
//       return;
//     }

//     const validation = updateTaskSchema.safeParse({
//       status: newStatus,
//     });

//     if (!validation.success) {
//       toast.error(validation.error.issues[0]?.message);
//       return;
//     }

//     // Optimistic update.
//     setTask((previousTask) =>
//       previousTask
//         ? {
//             ...previousTask,
//             status: newStatus,
//           }
//         : previousTask,
//     );

//     setIsUpdatingStatus(true);

//     const result = await UpdateTaskDetails(task.id, {
//       status: newStatus,
//     });

//     if (!result.ok) {
//       // Roll back the previous status.
//       setTask((previousTask) =>
//         previousTask
//           ? {
//               ...previousTask,
//               status: previousStatus,
//             }
//           : previousTask,
//       );

//       toast.error("Failed to update task. Please try again.");
//     } else {
//       toast.success("Task updated successfully.");
//     }

//     setIsUpdatingStatus(false);
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
//       onClick={onClose}
//     >
//       <div
//         className="flex max-h-[92vh] sm:max-h-[870px] w-full sm:max-w-[896px] flex-col overflow-y-auto rounded-t-2xl bg-surface shadow sm:w-full sm:flex-row sm:overflow-hidden sm:rounded-lg"
//         onClick={(event) => event.stopPropagation()}
//       >
//         {status === "loading" && <ProjectSkeleton />}

//         {status === "error" && (
//           <div className="w-full py-10 text-center text-sm text-red-500">
//             Failed to load task details
//           </div>
//         )}

//         {status === "empty" && (
//           <div className="w-full py-10 text-center text-sm text-neutral">
//             Task not found
//           </div>
//         )}

//         {status === "success" && task && (
//           <>
//             {/* Drag handle — mobile bottom sheet only */}
//             <div className="flex justify-center pt-2.5 sm:hidden">
//               <span className="h-1 w-9 rounded-full bg-[#E4E7F5]" />
//             </div>

//             {/* ================= LEFT PANEL — Content & Metadata ================= */}
//             <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-8">
//               {/* Header */}
//               <div className="mb-5 flex items-center justify-between gap-4">
//                 <div className="flex min-w-0 flex-wrap items-center gap-2">
//                   <span className="inline-flex max-w-[160px] shrink-0 truncate rounded-sm bg-[#DAE2FF] px-2 py-1 text-[11px] font-bold text-[#3B4CCA]">
//                     TASK-{task.id}
//                   </span>

//                   {/* Epic — desktop only, dropdown-styled per Figma */}
//                   <div className="hidden min-w-0 max-w-[220px] sm:block">
//                     <select
//                       value={task.epic_id ?? ""}
//                       onChange={handleEpicChange}
//                       disabled={isUpdatingEpic}
//                       className="w-full cursor-pointer truncate rounded-md border border-[#E4E7F5] bg-white px-2 py-1 text-[11px] font-medium text-neutral outline-none disabled:cursor-not-allowed disabled:opacity-60"
//                     >
//                       <option value="">No Epic</option>

//                       {epics.map((epic) => (
//                         <option key={epic.id} value={epic.id}>
//                           {epic.epic_id} {epic.title}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Close icon — mobile bottom sheet only, no close icon on desktop per design */}
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   aria-label="Close task details"
//                   className="shrink-0 cursor-pointer sm:hidden"
//                 >
//                   <Image src={CloseIcon} alt="" width={20} height={20} />
//                 </button>
//               </div>
//               {/* Title */}
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(event) => setTitle(event.target.value)}
//                 onBlur={handleTitleBlur}
//                 disabled={isUpdatingTitle}
//                 className="mb-3 w-full border-none bg-transparent p-0 text-body-md font-semibold leading-snug text-neutral-dark outline-none disabled:opacity-60"
//               />
//               {/* Status + Epic badges — mobile only */}
//               <div className="mb-4 flex flex-wrap items-center gap-2 sm:hidden">
//                 <select
//                   value={task.status}
//                   onChange={handleStatusChange}
//                   disabled={isUpdatingStatus}
//                   className={`cursor-pointer rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase outline-none disabled:cursor-not-allowed disabled:opacity-60 ${getStatusStyle(
//                     task.status,
//                   )}`}
//                 >
//                   <option value="TO_DO">TO DO</option>
//                   <option value="IN_PROGRESS">IN PROGRESS</option>
//                   <option value="BLOCKED">BLOCKED</option>
//                   <option value="IN_REVIEW">IN REVIEW</option>
//                   <option value="READY_FOR_QA">READY FOR QA</option>
//                   <option value="REOPENED">REOPENED</option>
//                   <option value="READY_FOR_PRODUCTION">
//                     READY FOR PRODUCTION
//                   </option>
//                   <option value="DONE">DONE</option>
//                 </select>

//                 <select
//                   value={task.epic_id ?? ""}
//                   onChange={handleEpicChange}
//                   disabled={isUpdatingEpic}
//                   className="max-w-[160px] cursor-pointer truncate rounded-sm border border-[#E4E7F5] px-2 py-1 text-[10px] font-medium text-neutral outline-none disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   <option value="">No Epic</option>

//                   {epics.map((epic) => (
//                     <option key={epic.id} value={epic.id}>
//                       {epic.epic_id} {epic.title}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {/* Assignee / Created by / Due date / Created at — mobile grid only */}
//               <div className="mb-4 grid grid-cols-2 gap-4 sm:hidden">
//                 <div className="min-w-0">
//                   <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
//                     Assignee
//                   </span>

//                   {task.assignee?.name ? (
//                     <div className="flex items-center gap-2">
//                       {task.assignee.avatar ? (
//                         <Image
//                           src={task.assignee.avatar}
//                           alt=""
//                           width={22}
//                           height={22}
//                           className="h-[22px] w-[22px] rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#82F9BE] text-[9px] font-semibold text-neutral-dark">
//                           {getInitials(task.assignee.name)}
//                         </div>
//                       )}
//                       <span className="truncate text-body-sm font-medium text-neutral-dark">
//                         {task.assignee.name}
//                       </span>
//                     </div>
//                   ) : (
//                     <span className="text-body-sm text-[#8B8D98]">
//                       Unassigned
//                     </span>
//                   )}
//                 </div>

//                 <div className="min-w-0">
//                   <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
//                     Due Date
//                   </span>
//                   <div className="flex items-center gap-1.5">
//                     <Image src={CalendarIcon} alt="" width={13} height={13} />
//                     <span className="text-body-sm font-medium text-neutral-dark">
//                       {formatDate(task.due_date)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="min-w-0">
//                   <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
//                     Created By
//                   </span>

//                   {task.reporter?.name ? (
//                     <div className="flex items-center gap-2">
//                       {task.reporter.avatar ? (
//                         <Image
//                           src={task.reporter.avatar}
//                           alt=""
//                           width={22}
//                           height={22}
//                           className="h-[22px] w-[22px] rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#DAE2FF] text-[9px] font-semibold text-neutral-dark">
//                           {getInitials(task.reporter.name)}
//                         </div>
//                       )}
//                       <span className="truncate text-body-sm font-medium text-neutral-dark">
//                         {task.reporter.name}
//                       </span>
//                     </div>
//                   ) : (
//                     <span className="text-body-sm text-[#8B8D98]">Unknown</span>
//                   )}
//                 </div>

//                 <div className="min-w-0">
//                   <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
//                     Created At
//                   </span>
//                   <div className="flex items-center gap-1.5">
//                     <Image src={CalendarIcon} alt="" width={13} height={13} />
//                     <span className="text-body-sm font-medium text-neutral-dark">
//                       {formatDate(task.created_at)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               {/* Description */}
//               <div className="mb-4 flex min-h-[80px] flex-1 flex-col gap-[11px] rounded-sm border border-[#E4E7F5] bg-white px-3 py-3 sm:bg-transparent sm:px-4">
//                 <label
//                   htmlFor="description"
//                   className="block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]"
//                 >
//                   Description
//                 </label>

//                 <textarea
//                   id="description"
//                   value={description}
//                   onChange={(event) => setDescription(event.target.value)}
//                   onBlur={handleDescriptionBlur}
//                   disabled={isUpdatingDescription}
//                   placeholder="No description provided"
//                   className="min-h-[50px] w-full resize-none border-none bg-transparent p-0 text-body-sm text-neutral outline-none disabled:opacity-60"
//                 />
//               </div>
//               {/* Footer — desktop only */}
//               <div className="mt-auto hidden items-center justify-between border-t border-[#F1F3FF] bg-[#E8EDFF] p-4 py-2 sm:flex">
//                 <button
//                   type="button"
//                   className="flex cursor-pointer items-center justify-center gap-1.5 text-body-sm font-medium text-neutral hover:text-neutral-dark"
//                 >
//                   <Image src={LinkIcon} alt="" width={18} height={18} />
//                   Copy link
//                 </button>

//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="cursor-pointer rounded-sm bg-[#D7E2FF] px-4 py-2 text-body-sm font-medium text-neutral-dark transition-all duration-300 hover:bg-[#E8EDFF]"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             {/* ================= RIGHT PANEL — Side Attributes (desktop only) ================= */}
//             <div className="hidden w-[320px] shrink-0 flex-col gap-5 border-l border-[#E8EDFF] bg-[#F1F3FF] p-6 sm:flex">
//               {/* Status — dropdown-styled button, colored fill, no border (matches Figma) */}
//               <div>
//                 <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
//                   Status
//                 </span>

//                 <select
//                   value={task.status}
//                   onChange={handleStatusChange}
//                   disabled={isUpdatingStatus}
//                   className={`flex w-full cursor-pointer appearance-none items-center justify-between rounded-md px-3 py-2.5 text-[11px] font-bold uppercase outline-none disabled:cursor-not-allowed disabled:opacity-60 ${getStatusStyle(
//                     task.status,
//                   )}`}
//                 >
//                   <option value="TO_DO">TO DO</option>
//                   <option value="IN_PROGRESS">IN PROGRESS</option>
//                   <option value="BLOCKED">BLOCKED</option>
//                   <option value="IN_REVIEW">IN REVIEW</option>
//                   <option value="READY_FOR_QA">READY FOR QA</option>
//                   <option value="REOPENED">REOPENED</option>
//                   <option value="READY_FOR_PRODUCTION">
//                     READY FOR PRODUCTION
//                   </option>
//                   <option value="DONE">DONE</option>
//                 </select>
//               </div>

//               {/* Assignee — dropdown-styled button, white fill + border, avatar + chevron */}
//               <div className="min-w-0">
//                 <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
//                   Assignee
//                 </span>

//                 {isEditingAssignee ? (
//                   <select
//                     autoFocus
//                     value={task.assignee?.id ?? ""}
//                     onChange={handleAssigneeChange}
//                     onBlur={() => setIsEditingAssignee(false)}
//                     disabled={isUpdatingAssignee}
//                     className="w-full cursor-pointer rounded-md border border-[#E4E7F5] bg-white px-2.5 py-2 text-body-sm font-medium text-neutral-dark outline-none disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     <option value="">Unassigned</option>

//                     {members.map((member) => (
//                       <option key={member.user_id} value={member.user_id}>
//                         {member.metadata.name}
//                       </option>
//                     ))}
//                   </select>
//                 ) : (
//                   <input
//                     type="datetime-local"
//                     value={task.due_date ? task.due_date.slice(0, 16) : ""}
//                     onChange={handleDueDateChange}
//                     disabled={isUpdatingDueDate}
//                     min={new Date().toISOString().slice(0, 16)}
//                     className="w-full cursor-pointer rounded-md border border-[#E4E7F5] bg-white px-2.5 py-2 text-body-sm font-medium text-neutral-dark outline-none disabled:cursor-not-allowed disabled:opacity-60"
//                   />
//                 )}
//               </div>

//               {/* Reporter — plain text, no dropdown styling in this design */}
//               <div className="min-w-0">
//                 <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
//                   Reporter
//                 </span>

//                 {task.reporter?.name ? (
//                   <div className="flex items-center gap-2">
//                     {task.reporter.avatar ? (
//                       <Image
//                         src={task.reporter.avatar}
//                         alt=""
//                         width={24}
//                         height={24}
//                         className="h-6 w-6 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DAE2FF] text-[9px] font-semibold text-neutral-dark">
//                         {getInitials(task.reporter.name)}
//                       </div>
//                     )}
//                     <span className="truncate text-body-sm font-medium text-neutral-dark">
//                       {task.reporter.name}
//                     </span>
//                   </div>
//                 ) : (
//                   <span className="text-body-sm text-[#8B8D98]">Unknown</span>
//                 )}
//               </div>

//               <div className="border-t border-white" />

//               {/* Due Date — dropdown-styled button, same treatment as Assignee */}
//               <div>
//                 <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
//                   Due Date
//                 </span>

//                 <button
//                   type="button"
//                   className="flex w-full cursor-pointer items-center justify-between rounded-md border border-[#E4E7F5] bg-white px-2.5 py-2"
//                 >
//                   <input
//                     type="datetime-local"
//                     value={task.due_date ? task.due_date.slice(0, 16) : ""}
//                     onChange={handleDueDateChange}
//                     disabled={isUpdatingDueDate}
//                     min={new Date().toISOString().slice(0, 16)}
//                     className="w-full min-w-0 cursor-pointer rounded-md border border-[#E4E7F5] bg-white px-2 py-1.5 text-body-sm font-medium text-neutral-dark outline-none disabled:cursor-not-allowed disabled:opacity-60"
//                   />
//                   <ChevronIcon className="h-2.5 w-2.5 shrink-0 text-neutral" />
//                 </button>
//               </div>

//               {/* Created At — inline label/value row, no border, no chevron, no icon */}
//               <div className="flex items-center justify-between gap-2">
//                 <span className="text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
//                   Created At
//                 </span>
//                 <span className="text-body-sm font-medium text-neutral-dark">
//                   {formatDate(task.created_at)}
//                 </span>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TaskDetailsModal;
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { loadTaskDetails, UpdateTaskDetails } from "@/actions/task";
import CloseIcon from "@/assets/icons/close.svg";
import CalendarIcon from "@/assets/icons/epicDate.svg";
import LinkIcon from "@/assets/icons/copy.svg";

import { getInitials } from "@/lib/utils/getInitials";
import ProjectSkeleton from "../ui/ProjectSkeleton";

import { updateTaskSchema } from "@/lib/validations/task";
import { toast } from "react-toastify";
import { ProjectMember } from "@/types/member";

interface TaskDetailsModalProps {
  projectId: string;
  taskId: string;
  onClose: () => void;
}

type TaskDetailsStatus = "loading" | "success" | "error" | "empty";

interface TaskAssignee {
  id?: string;
  name?: string;
  avatar?: string;
}

interface TaskReporter {
  name?: string;
  avatar?: string;
}

interface TaskDetails {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  created_at: string;
  status: string;
  epic_id?: string | null;
  epic_name?: string | null;
  assignee?: TaskAssignee | null;
  reporter?: TaskReporter | null;
}

interface Epic {
  id: string;
  epic_id: string;
  title: string;
}

// Fields that can be patched through UpdateTaskDetails. Kept in one place so
// the generic "update a single field" helper below stays fully typed.
type UpdatableTaskField = Pick<
  TaskDetails,
  "title" | "description" | "due_date" | "status" | "epic_id"
> & {
  assignee_id: string | null;
};

// Single source of truth for the status dropdown options, used by both the
// mobile and desktop selects so the list can't drift out of sync.
const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "TO_DO", label: "TO DO" },
  { value: "IN_PROGRESS", label: "IN PROGRESS" },
  { value: "BLOCKED", label: "BLOCKED" },
  { value: "IN_REVIEW", label: "IN REVIEW" },
  { value: "READY_FOR_QA", label: "READY FOR QA" },
  { value: "REOPENED", label: "REOPENED" },
  { value: "READY_FOR_PRODUCTION", label: "READY FOR PRODUCTION" },
  { value: "DONE", label: "DONE" },
];

const STATUS_STYLES: Record<string, string> = {
  IN_PROGRESS: "bg-[#DBEAFE] text-[#1D4ED8]",
  DONE: "bg-[#DCFCE7] text-[#15803D]",
  COMPLETED: "bg-[#DCFCE7] text-[#15803D]",
  BLOCKED: "bg-[#FEE2E2] text-[#B91C1C]",
  TO_DO: "bg-[#F1F5F9] text-[#475569]",
};

const DEFAULT_STATUS_STYLE = "bg-[#F1F5F9] text-[#475569]";

const formatDate = (date: string | null) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status: string) =>
  STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE;

/**
 * Converts an ISO date string (assumed UTC, as returned by the API) into the
 * "YYYY-MM-DDTHH:mm" format that <input type="datetime-local"> expects,
 * expressed in the user's *local* time.
 *
 * Using `isoString.slice(0, 16)` directly is wrong: it keeps the UTC wall
 * clock time and just relabels it as local time, which silently shifts the
 * displayed due date by the user's UTC offset.
 */
const toLocalDatetimeInputValue = (isoString: string | null) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const localOffsetMs = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - localOffsetMs).toISOString().slice(0, 16);
};

// "Now", formatted the same way, so the due-date input's `min` lines up with
// what the input is actually displaying (local time), not UTC.
const nowAsLocalDatetimeInputValue = () =>
  toLocalDatetimeInputValue(new Date().toISOString());

// Small inline chevron — avoids depending on an external icon asset that may not exist.
const ChevronIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 10 6" fill="none" className={className} aria-hidden="true">
    <path
      d="M1 1l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TaskDetailsModal = ({
  projectId,
  taskId,
  onClose,
}: TaskDetailsModalProps) => {
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [status, setStatus] = useState<TaskDetailsStatus>("loading");

  // Keeps the editable title/description separate from the fetched task data
  // so typing doesn't need to round-trip through `task` on every keystroke.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);

  // Tracks which field is currently being saved, so we can disable just that
  // field's control instead of one boolean per field.
  const [savingField, setSavingField] = useState<
    keyof UpdatableTaskField | null
  >(null);

  const [isEditingAssignee, setIsEditingAssignee] = useState(false);

  // ---------------------------------------------------------------------
  // Data loading
  // ---------------------------------------------------------------------

  useEffect(() => {
    // Guards against setting state after the effect has been cleaned up
    let isActive = true;

    const fetchTaskDetails = async () => {
      setStatus("loading");
      setTask(null);

      const result = await loadTaskDetails(projectId, taskId);
      if (!isActive) return;

      if (!result.ok) {
        setStatus("error");
        return;
      }

      if (!result.data) {
        setStatus("empty");
        return;
      }

      setTask(result.data);
      setTitle(result.data.title);
      setDescription(result.data.description ?? "");
      setStatus("success");
    };

    fetchTaskDetails();

    return () => {
      isActive = false;
    };
  }, [projectId, taskId]);

  // Close the modal when the user presses Escape.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!projectId) return;

    let isActive = true;

    const loadMembers = async () => {
      try {
        const response = await fetch(`/api/getProjectMembers/${projectId}`);
        const result = await response.json();

        if (!response.ok || !isActive) return;

        setMembers(result);
      } catch (error) {
        console.error("Failed to load project members:", error);
      }
    };

    loadMembers();

    return () => {
      isActive = false;
    };
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    let isActive = true;

    const loadEpics = async () => {
      try {
        const response = await fetch(`/api/getProjectEpics/${projectId}`);
        const result = await response.json();

        if (!response.ok || !isActive) return;

        setEpics(result);
      } catch (error) {
        console.error("Failed to load project epics:", error);
      }
    };

    loadEpics();

    return () => {
      isActive = false;
    };
  }, [projectId]);

  // ---------------------------------------------------------------------
  // Shared "update one field" helper
  // ---------------------------------------------------------------------
  //
  // Every field (title, description, assignee, epic, due date, status) used
  // to repeat the exact same optimistic-update → API call → rollback →
  // toast sequence. This collapses that into one generic function so each
  // handler below only has to describe *what* changed, not *how* to save it.

  const updateTaskField = useCallback(
    async <TField extends keyof UpdatableTaskField>(
      field: TField,
      value: UpdatableTaskField[TField],
      // How this field should be reflected on the local `task` object —
      // usually the same field, but e.g. `assignee_id` maps to `assignee`.
      applyToTask: (previous: TaskDetails) => TaskDetails,
      rollbackToTask: (previous: TaskDetails) => TaskDetails,
    ) => {
      if (!task) return false;

      setTask((previous) => (previous ? applyToTask(previous) : previous));
      setSavingField(field);

      const result = await UpdateTaskDetails(task.id, { [field]: value });

      if (!result.ok) {
        setTask((previous) => (previous ? rollbackToTask(previous) : previous));
        toast.error("Failed to update task. Please try again.");
      } else {
        toast.success("Task updated successfully.");
      }

      setSavingField(null);
      return result.ok;
    },
    [task],
  );

  // ---------------------------------------------------------------------
  // Field handlers
  // ---------------------------------------------------------------------

  const handleTitleBlur = async () => {
    if (!task || savingField === "title") return;

    const newTitle = title.trim();
    const previousTitle = task.title;

    if (newTitle === previousTitle) {
      setTitle(previousTitle);
      return;
    }

    const validation = updateTaskSchema.safeParse({ title: newTitle });
    if (!validation.success) {
      setTitle(previousTitle);
      toast.error(validation.error.issues[0]?.message);
      return;
    }

    setTitle(newTitle);

    await updateTaskField(
      "title",
      newTitle,
      (previous) => ({ ...previous, title: newTitle }),
      (previous) => {
        setTitle(previousTitle);
        return { ...previous, title: previousTitle };
      },
    );
  };

  const handleDescriptionBlur = async () => {
    if (!task || savingField === "description") return;

    const newDescription = description.trim();
    const previousDescription = task.description ?? "";

    if (newDescription === previousDescription) {
      setDescription(previousDescription);
      return;
    }

    setDescription(newDescription);

    await updateTaskField(
      "description",
      newDescription || null,
      (previous) => ({ ...previous, description: newDescription || null }),
      (previous) => {
        setDescription(previousDescription);
        return { ...previous, description: previousDescription || null };
      },
    );
  };

  const handleAssigneeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!task || savingField === "assignee_id") return;

    const newAssigneeId = event.target.value || null;
    const previousAssignee = task.assignee ?? null;

    if (newAssigneeId === (previousAssignee?.id ?? null)) return;

    const selectedMember =
      members.find((member) => member.user_id === newAssigneeId) ?? null;

    const nextAssignee: TaskAssignee | null = selectedMember
      ? {
          id: selectedMember.user_id,
          name: selectedMember.metadata.name,
          avatar: undefined,
        }
      : null;

    await updateTaskField(
      "assignee_id",
      newAssigneeId,
      (previous) => ({ ...previous, assignee: nextAssignee }),
      (previous) => ({ ...previous, assignee: previousAssignee }),
    );
  };

  const handleEpicChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!task || savingField === "epic_id") return;

    const newEpicId = event.target.value || null;
    const previousEpicId = task.epic_id ?? null;
    const previousEpicName = task.epic_name ?? null;

    if (newEpicId === previousEpicId) return;

    const selectedEpic = epics.find((epic) => epic.id === newEpicId) ?? null;

    await updateTaskField(
      "epic_id",
      newEpicId,
      (previous) => ({
        ...previous,
        epic_id: newEpicId,
        epic_name: selectedEpic?.title ?? null,
      }),
      (previous) => ({
        ...previous,
        epic_id: previousEpicId,
        epic_name: previousEpicName,
      }),
    );
  };

  const handleDueDateChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!task || savingField === "due_date") return;

    const newDueDate = event.target.value || null;
    const previousDueDate = task.due_date;

    if (newDueDate === previousDueDate) return;

    if (newDueDate) {
      const validation = updateTaskSchema.safeParse({ due_date: newDueDate });
      if (!validation.success) {
        toast.error(validation.error.issues[0]?.message);
        return;
      }
    }

    await updateTaskField(
      "due_date",
      newDueDate,
      (previous) => ({ ...previous, due_date: newDueDate }),
      (previous) => ({ ...previous, due_date: previousDueDate }),
    );
  };

  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!task || savingField === "status") return;

    const newStatus = event.target.value;
    const previousStatus = task.status;

    if (newStatus === previousStatus) return;

    const validation = updateTaskSchema.safeParse({ status: newStatus });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message);
      return;
    }

    await updateTaskField(
      "status",
      newStatus,
      (previous) => ({ ...previous, status: newStatus }),
      (previous) => ({ ...previous, status: previousStatus }),
    );
  };

  // Shared JSX for the status <select>, reused by the mobile badge row and
  // the desktop side panel so the option list only lives in one place.
  const renderStatusSelect = (className: string) => (
    <select
      value={task?.status}
      onChange={handleStatusChange}
      disabled={savingField === "status"}
      className={`${className} ${getStatusStyle(task?.status ?? "")}`}
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  // Shared JSX for the epic <select>, reused by the header (desktop) and the
  // mobile badge row.
  const renderEpicSelect = (className: string) => (
    <select
      value={task?.epic_id ?? ""}
      onChange={handleEpicChange}
      disabled={savingField === "epic_id"}
      className={className}
    >
      <option value="">No Epic</option>
      {epics.map((epic) => (
        <option key={epic.id} value={epic.id}>
          {epic.epic_id} {epic.title}
        </option>
      ))}
    </select>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] sm:max-h-[870px] w-full sm:max-w-[896px] flex-col overflow-y-auto rounded-t-2xl bg-surface shadow sm:w-full sm:flex-row sm:overflow-hidden sm:rounded-lg"
        onClick={(event) => event.stopPropagation()}
      >
        {status === "loading" && <ProjectSkeleton />}

        {status === "error" && (
          <div className="w-full py-10 text-center text-sm text-red-500">
            Failed to load task details
          </div>
        )}

        {status === "empty" && (
          <div className="w-full py-10 text-center text-sm text-neutral">
            Task not found
          </div>
        )}

        {status === "success" && task && (
          <>
            {/* Drag handle — mobile bottom sheet only */}
            <div className="flex justify-center pt-2.5 sm:hidden">
              <span className="h-1 w-9 rounded-full bg-[#E4E7F5]" />
            </div>

            {/* ================= LEFT PANEL — Content & Metadata ================= */}
            <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-8">
              {/* Header */}
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="inline-flex max-w-[160px] shrink-0 truncate rounded-sm bg-[#DAE2FF] px-2 py-1 text-[11px] font-bold text-[#3B4CCA]">
                    TASK-{task.id}
                  </span>

                  {/* Epic — desktop only, dropdown-styled per Figma */}
                  <div className="hidden min-w-0 max-w-[220px] sm:block">
                    {renderEpicSelect(
                      "w-full cursor-pointer truncate rounded-md border border-[#E4E7F5] bg-white px-2 py-1 text-[11px] font-medium text-neutral outline-none disabled:cursor-not-allowed disabled:opacity-60",
                    )}
                  </div>
                </div>

                {/* Close icon — mobile bottom sheet only, no close icon on desktop per design */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close task details"
                  className="shrink-0 cursor-pointer sm:hidden"
                >
                  <Image src={CloseIcon} alt="" width={20} height={20} />
                </button>
              </div>
              {/* Title */}
              <input
                type="text"
                aria-label="Task title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onBlur={handleTitleBlur}
                disabled={savingField === "title"}
                className="mb-3 w-full border-none bg-transparent p-0 text-body-md font-semibold leading-snug text-neutral-dark outline-none disabled:opacity-60"
              />
              {/* Status + Epic badges — mobile only */}
              <div className="mb-4 flex flex-wrap items-center gap-2 sm:hidden">
                {renderStatusSelect(
                  "cursor-pointer rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase outline-none disabled:cursor-not-allowed disabled:opacity-60",
                )}

                {renderEpicSelect(
                  "max-w-[160px] cursor-pointer truncate rounded-sm border border-[#E4E7F5] px-2 py-1 text-[10px] font-medium text-neutral outline-none disabled:cursor-not-allowed disabled:opacity-60",
                )}
              </div>
              {/* Assignee / Created by / Due date / Created at — mobile grid only */}
              <div className="mb-4 grid grid-cols-2 gap-4 sm:hidden">
                <div className="min-w-0">
                  <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                    Assignee
                  </span>

                  {task.assignee?.name ? (
                    <div className="flex items-center gap-2">
                      {task.assignee.avatar ? (
                        <Image
                          src={task.assignee.avatar}
                          alt=""
                          width={22}
                          height={22}
                          className="h-[22px] w-[22px] rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#82F9BE] text-[9px] font-semibold text-neutral-dark">
                          {getInitials(task.assignee.name)}
                        </div>
                      )}
                      <span className="truncate text-body-sm font-medium text-neutral-dark">
                        {task.assignee.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-body-sm text-[#8B8D98]">
                      Unassigned
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                    Due Date
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Image src={CalendarIcon} alt="" width={13} height={13} />
                    <span className="text-body-sm font-medium text-neutral-dark">
                      {formatDate(task.due_date)}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                    Created By
                  </span>

                  {task.reporter?.name ? (
                    <div className="flex items-center gap-2">
                      {task.reporter.avatar ? (
                        <Image
                          src={task.reporter.avatar}
                          alt=""
                          width={22}
                          height={22}
                          className="h-[22px] w-[22px] rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#DAE2FF] text-[9px] font-semibold text-neutral-dark">
                          {getInitials(task.reporter.name)}
                        </div>
                      )}
                      <span className="truncate text-body-sm font-medium text-neutral-dark">
                        {task.reporter.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-body-sm text-[#8B8D98]">Unknown</span>
                  )}
                </div>

                <div className="min-w-0">
                  <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                    Created At
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Image src={CalendarIcon} alt="" width={13} height={13} />
                    <span className="text-body-sm font-medium text-neutral-dark">
                      {formatDate(task.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              {/* Description */}
              <div className="mb-4 flex min-h-[80px] flex-1 flex-col gap-[11px] rounded-sm border border-[#E4E7F5] bg-white px-3 py-3 sm:bg-transparent sm:px-4">
                <label
                  htmlFor="description"
                  className="block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  onBlur={handleDescriptionBlur}
                  disabled={savingField === "description"}
                  placeholder="No description provided"
                  className="min-h-[50px] w-full resize-none border-none bg-transparent p-0 text-body-sm text-neutral outline-none disabled:opacity-60"
                />
              </div>
              {/* Footer — desktop only */}
              <div className="mt-auto hidden items-center justify-between border-t border-[#F1F3FF] bg-[#E8EDFF] p-4 py-2 sm:flex">
                <button
                  type="button"
                  className="flex cursor-pointer items-center justify-center gap-1.5 text-body-sm font-medium text-neutral hover:text-neutral-dark"
                >
                  <Image src={LinkIcon} alt="" width={18} height={18} />
                  Copy link
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-sm bg-[#D7E2FF] px-4 py-2 text-body-sm font-medium text-neutral-dark transition-all duration-300 hover:bg-[#E8EDFF]"
                >
                  Close
                </button>
              </div>
            </div>

            {/* ================= RIGHT PANEL — Side Attributes (desktop only) ================= */}
            <div className="hidden w-[320px] shrink-0 flex-col gap-5 border-l border-[#E8EDFF] bg-[#F1F3FF] p-6 sm:flex">
              {/* Status — dropdown-styled button, colored fill, no border (matches Figma) */}
              <div>
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                  Status
                </span>

                {renderStatusSelect(
                  "flex w-full cursor-pointer appearance-none items-center justify-between rounded-md px-3 py-2.5 text-[11px] font-bold uppercase outline-none disabled:cursor-not-allowed disabled:opacity-60",
                )}
              </div>

              {/* Assignee — dropdown-styled button, white fill + border, avatar + chevron.
                  Click the summary button to switch into edit (select) mode; the select
                  reverts back to the summary view once it loses focus. */}
              <div className="min-w-0">
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                  Assignee
                </span>

                {isEditingAssignee ? (
                  <select
                    autoFocus
                    value={task.assignee?.id ?? ""}
                    onChange={handleAssigneeChange}
                    onBlur={() => setIsEditingAssignee(false)}
                    disabled={savingField === "assignee_id"}
                    className="w-full cursor-pointer rounded-md border border-[#E4E7F5] bg-white px-2.5 py-2 text-body-sm font-medium text-neutral-dark outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">Unassigned</option>

                    {members.map((member) => (
                      <option key={member.user_id} value={member.user_id}>
                        {member.metadata.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingAssignee(true)}
                    disabled={savingField === "assignee_id"}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-md border border-[#E4E7F5] bg-white px-2.5 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {task.assignee?.name ? (
                      <>
                        {task.assignee.avatar ? (
                          <Image
                            src={task.assignee.avatar}
                            alt=""
                            width={22}
                            height={22}
                            className="h-[22px] w-[22px] shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#82F9BE] text-[9px] font-semibold text-neutral-dark">
                            {getInitials(task.assignee.name)}
                          </div>
                        )}
                        <span className="truncate text-body-sm font-medium text-neutral-dark">
                          {task.assignee.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-body-sm text-[#8B8D98]">
                        Unassigned
                      </span>
                    )}

                    <ChevronIcon className="ml-auto h-2.5 w-2.5 shrink-0 text-neutral" />
                  </button>
                )}
              </div>

              {/* Reporter — plain text, no dropdown styling in this design */}
              <div className="min-w-0">
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                  Reporter
                </span>

                {task.reporter?.name ? (
                  <div className="flex items-center gap-2">
                    {task.reporter.avatar ? (
                      <Image
                        src={task.reporter.avatar}
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DAE2FF] text-[9px] font-semibold text-neutral-dark">
                        {getInitials(task.reporter.name)}
                      </div>
                    )}
                    <span className="truncate text-body-sm font-medium text-neutral-dark">
                      {task.reporter.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-body-sm text-[#8B8D98]">Unknown</span>
                )}
              </div>

              <div className="border-t border-white" />

              {/* Due Date — dropdown-styled button, same treatment as Assignee.
                  Values are converted to/from local time explicitly; see
                  toLocalDatetimeInputValue for why a plain `.slice(0, 16)`
                  on the raw ISO string would be off by the user's UTC offset. */}
              <div>
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                  Due Date
                </span>

                <div className="flex w-full items-center justify-between rounded-md border border-[#E4E7F5] bg-white px-2.5 py-2">
                  <input
                    type="datetime-local"
                    value={toLocalDatetimeInputValue(task.due_date)}
                    onChange={handleDueDateChange}
                    disabled={savingField === "due_date"}
                    min={nowAsLocalDatetimeInputValue()}
                    className="w-full min-w-0 cursor-pointer rounded-md border-none bg-transparent px-0 py-0 text-body-sm font-medium text-neutral-dark outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <ChevronIcon className="h-2.5 w-2.5 shrink-0 text-neutral" />
                </div>
              </div>

              {/* Created At — inline label/value row, no border, no chevron, no icon */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                  Created At
                </span>
                <span className="text-body-sm font-medium text-neutral-dark">
                  {formatDate(task.created_at)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
