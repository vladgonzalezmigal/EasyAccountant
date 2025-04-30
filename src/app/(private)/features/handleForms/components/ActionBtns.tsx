'use client';

interface DeleteBtnConfig {
    handleDelete: () => void;
    deleteMode: boolean;
    canDelete: boolean;
}

interface EditBtnConfig {
    handleEdit: () => void;
    editMode: boolean;
    validationErrors: Record<number, Set<number>>;
}

interface ActionBtnsProps {
    deleteBtnConfig: DeleteBtnConfig;
    editBtnConfig: EditBtnConfig;
    cudLoading: boolean;
}

export default function ActionBtns({
    deleteBtnConfig,
    editBtnConfig,
    cudLoading
}: ActionBtnsProps) {
    const { handleDelete, deleteMode, canDelete } = deleteBtnConfig;
    const { handleEdit, editMode, validationErrors } = editBtnConfig;

    return (
        <div className="w-full bg-[#F4FFFE] border border-2 -z-30">
            <div className="flex flex-row gap-x-4 py-4 items-center justify-center">
                {/* Delete Button */}
                <div className="flex flex-col items-center gap-y-2">
                    <button
                        onClick={handleDelete}
                        disabled={cudLoading}
                        className={`cursor-pointer rounded-full w-16 h-16 flex items-center justify-center ${cudLoading ? 'bg-gray-400' :
                            deleteMode ? 'bg-yellow-500' :
                                canDelete ? 'bg-red-600' : 'bg-red-300'
                            }`}>
                        {cudLoading ?
                            <span className="text-white">...</span> :
                            deleteMode ?
                                <span className="text-white">✓</span> :
                                <span className="text-white">✕</span>
                        }
                    </button>
                    <p> Delete </p>
                </div>
                {/* Edit Button */}
                <div className="flex flex-col items-center gap-y-2">
                    <button
                        onClick={handleEdit}
                        disabled={cudLoading}
                        className={`cursor-pointer rounded-full w-16 h-16 flex items-center justify-center ${cudLoading ? 'bg-gray-400' :
                            editMode ? 'bg-yellow-500' :
                                editMode ? 'bg-blue-600' : 'bg-blue-300'
                            }`}>
                        {cudLoading ?
                            <span className="text-white">...</span> :
                            editMode ?
                                (Object.keys(validationErrors).length > 0) ?
                                    <span className="text-white">c</span> :
                                    <span className="text-white">✓</span> :
                                <span className="text-white">✕</span>
                        }
                    </button>
                    <p> Edit </p>
                </div>
            </div>
        </div>
    );
}
