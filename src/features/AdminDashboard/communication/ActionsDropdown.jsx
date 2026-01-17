const ActionsDropdown = ({ showActions, onEditDetails, onAddMember, onBlockMember, onDeleteChat }) => {
  if (!showActions) return null;

  return (
    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-4 w-56 z-50 border border-gray-200">
      <h3 className="text-center font-bold text-gray-800 mb-3">Actions</h3>
      <div className="space-y-2">
        <button
          onClick={onEditDetails}
          className="w-full border-2 border-teal-500 text-teal-600 px-4 py-2 rounded-lg font-semibold hover:bg-teal-50 transition"
        >
          Edit Details
        </button>
        <button
          onClick={onAddMember}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Add Member
        </button>
        <button
          onClick={onBlockMember}
          className="w-full bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
        >
          Block Member
        </button>
        <button
          onClick={onDeleteChat}
          className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Delete Chat
        </button>
      </div>
    </div>
  );
};

export default ActionsDropdown;
