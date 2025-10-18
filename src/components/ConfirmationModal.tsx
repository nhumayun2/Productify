'use client';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    // Main overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-space bg-opacity-75 transition-opacity">
      {/* Modal panel */}
      <div className="relative w-full max-w-md transform rounded-lg bg-off-white p-6 text-left shadow-xl transition-all">
        <h3 className="text-xl font-semibold leading-6 text-dark-space">{title}</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-tan focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-burnt-sienna px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-burnt-sienna focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}