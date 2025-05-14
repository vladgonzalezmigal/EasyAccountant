'use client';

import TrashIcon from "@/app/(private)/components/svgs/TrashIcon";
import EditIcon from "@/app/(private)/components/svgs/EditIcon";
import SaveIcon from "@/app/(private)/components/svgs/SaveIcon";
import PlusIcon from "@/app/(private)/components/svgs/PlusIcon";

interface PayrollBtnsProps {
    deleteMode: boolean;
    editMode: boolean;
    save: boolean;
    clearEdits: boolean;
    cudLoading: boolean;
    onCreateToggle: () => void;
    handleDelete?: () => void;
    canDelete: boolean;
}

export default function PayrollBtns({
    deleteMode,
    editMode,
    save,
    clearEdits,
    cudLoading,
    onCreateToggle,
    handleDelete,
    canDelete
}: PayrollBtnsProps) {
    // Determine which action is active
    const isDeleteActive = deleteMode;
    const isEditActive = editMode;
    // const isCreateActive = !deleteMode && !editMode;

    return (
        <div className="w-full relative h-[148px] bg-[#F2FBFA] border border-t-0 border-[#ECECEE] header-shadow rounded-bottom z-0 mt-[-20px]">
            <div className="flex flex-row gap-x-4 items-center justify-center absolute bottom-4 left-1/2 transform -translate-x-1/2">
                {/* Delete Button */}
                <div className="flex flex-col items-center gap-y-2">
                    <button
                        onClick={handleDelete}
                        disabled={cudLoading || isEditActive}
                        className={`cursor-pointer rounded-full w-16 h-16 border-2 border-[#A72020] flex items-center justify-center ${
                            cudLoading ? 'bg-gray-400' :
                            deleteMode ? 'bg-[#FA7B7D]' : 'bg-[#F8D2D2]'
                        } ${isEditActive ? 'opacity-50' : ''}`}
                    >
                        {cudLoading ? (
                            <span className="text-white">...</span>
                        ) : (
                            <span className="text-white">
                                <TrashIcon className={deleteMode ? (canDelete ? "text-[#A72020]" : "text-white") : "text-[#A72020]"} />
                            </span>
                        )}
                    </button>
                    <p className={`action-btn-text ${isEditActive ? 'opacity-50' : ''}`}>Delete</p>
                </div>

                {/* Edit/Save Button */}
                <div className="flex flex-col items-center gap-y-2">
                    <button
                        disabled={cudLoading || isDeleteActive}
                        className={`cursor-pointer rounded-full w-16 h-16 border-2 border-[#0C3C74] flex items-center justify-center ${
                            cudLoading ? 'bg-gray-400' :
                            editMode ? (clearEdits ? 'bg-blue-200' : 'bg-blue-500') : 'bg-blue-200'
                        } ${isDeleteActive ? 'opacity-50' : ''}`}
                    >
                        {cudLoading ? (
                            <span className="text-white">...</span>
                        ) : (
                            <span className="text-white">
                                {save ? (
                                    <SaveIcon className={editMode ? (clearEdits ? "text-[#0C3C74]" : "text-white") : "text-[#0C3C74]"} />
                                ) : (
                                    <EditIcon className={editMode ? (clearEdits ? "text-[#0C3C74]" : "text-white") : "text-[#0C3C74]"} />
                                )}
                            </span>
                        )}
                    </button>
                    <p className={`action-btn-text ${isDeleteActive ? 'opacity-50' : ''}`}>{save ? 'Save' : 'Edit'}</p>
                </div>

                {/* Create Button */}
                <div className="flex flex-col items-center gap-y-2">
                    <button
                        onClick={onCreateToggle}
                        disabled={cudLoading }
                        className={`cursor-pointer rounded-full w-16 h-16 border-2 border-[#8ABBFD] bg-[#DFF4F3] flex items-center justify-center ${cudLoading ? 'opacity-50' : ''}`}
                    >
                        <span className="text-white">
                            <PlusIcon className="text-[#8ABBFD] w-10 h-10" />
                        </span>
                    </button>
                    <p className={`action-btn-text ${cudLoading ? 'opacity-50' : ''}`}>Create</p>
                </div>
            </div>
        </div>
    );
}
