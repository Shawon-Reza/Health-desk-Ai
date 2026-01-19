import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { queryClient } from '../../../main';
import { toast } from 'react-toastify';
import axiosApi from '../../../service/axiosInstance';
import EditGroupModal from './EditGroupModal';
import AddMemberModal from './AddMemberModal';

const ActionsDropdown = ({ showActions, onEditDetails, onAddMember, onBlockMember, onDeleteChat, chatInfo }) => {
  if (!showActions) return null;

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  console.log("CHat Info :", chatInfo)
  const roomId = chatInfo?.id;
  const clinic_id = chatInfo?.clinic_id;
  console.log("Room Id from dropdown :", roomId)


  const isPrivate = chatInfo?.type === 'private';

  //..............................................Delete Chat Mutation..............................................//
  const deleteChatMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosApi.post(`/api/v1/rooms/${roomId}/delete/`);

      return res.data;
    },
    onSuccess: () => {
      console.log('Chat deleted successfully');
      toast.success('Chat deleted successfully');
      // Refresh the chat list
      queryClient.invalidateQueries({ queryKey: ['myRooms'] });
      // Call the parent's onDeleteChat to close dropdown/handle UI
      if (onDeleteChat) onDeleteChat();
    },
    onError: (error) => {
      console.error('Error deleting chat:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to delete chat';
      toast.error(msg);
    },
  });

  // ......................................*Fetch Clinic Members*.......................................... //
  const { data: clinicMembers, isLoading: isLoadingMembers, error: membersError } = useQuery({
    queryKey: ['clinicMembers_for_addMembers', clinic_id],
    queryFn: async () => {
      const res = await axiosApi.get(`/api/v1/chat/clinic/members/?clinic_id=${clinic_id}`);
      console.log("Clinic Members Data:", res.data);
      return res.data;
    },
    enabled: !!clinic_id, // Only fetch if clinic_id exists
    keepPreviousData: true,
  });
  console.log("Clinic Members:=========================================================", clinicMembers?.results);





  // ........................................ Action Dropdown UI ........................................ //
  return (
    <>
      <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-4 w-56 z-50 border border-gray-200 ">
        <h3 className="text-center font-bold text-gray-800 mb-3">Actions</h3>
        <div className="space-y-2">
          {!isPrivate && (
            <button
              onClick={() => setShowEditModal(true)}
              className="w-full border-2 border-teal-500 text-teal-600 px-4 py-2 rounded-lg font-semibold hover:bg-teal-50 transition"
            >
              Edit Details
            </button>
          )}
          {!isPrivate && (
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Add Member
            </button>
          )}
          <button
            onClick={onBlockMember}
            className="w-full bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Block Member
          </button>
          <button
            onClick={() => deleteChatMutation.mutate()}
            disabled={deleteChatMutation.isPending}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteChatMutation.isPending ? 'Deleting...' : 'Delete Chat'}
          </button>
        </div>
      </div>

      {/* Edit Group Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
            <EditGroupModal onClose={() => setShowEditModal(false)} roomId={roomId} />
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative mx-5 sm:mx-10">
            <AddMemberModal 
              onClose={() => setShowAddMemberModal(false)} 
              roomId={roomId} 
              userList={clinicMembers} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ActionsDropdown;
