import React from 'react'
import { IoCloseOutline } from 'react-icons/io5'

import axiosApi from '../../../service/axiosInstance'
import { useQuery, useMutation } from '@tanstack/react-query'

const Notifications = ({ notifications = [], notificationCount = 0, onNotificationRead }) => {

  // ====================================== Get Notifications History List UI====================================== //

  const { mutate: markNotificationsAsRead } = useMutation({
    mutationFn: async () => {
      const response = await axiosApi.post('/api/v1/notifications/read/')
      console.log('Mark as read response:', response.data)
      return response.data
    },
    onSuccess: (data) => {
      console.log('Notifications marked as read successfully:', data)
    },
    onError: (error) => {
      console.error('Error marking notifications as read:', error)
    }
  })

  const { data: notificationsData, isLoading, error, isSuccess } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axiosApi.get('/api/v1/notifications/all/')
      return response.data
    }
  })

  // Call mark as read when notifications are successfully fetched
  React.useEffect(() => {
    if (isSuccess && notificationsData?.results?.length > 0) {
      markNotificationsAsRead()
    }
  }, [isSuccess, notificationsData, markNotificationsAsRead])

  console.log('Notifications Data:', notificationsData?.results)







  return (
    <div className=''>
      {/* Header */}
      <div className='sticky top-0 bg-white border-b p-4 flex justify-between items-center'>
        <h3 className='font-semibold text-lg'>Notifications</h3>
        {/* {notificationCount > 0 && (
          <span className='bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold'>
            {notificationCount > 99 ? '99+' : notificationCount}
          </span>
        )} */}
      </div>

      {/* Notifications List */}
      <div className='divide-y max-h-[calc(100vh-200px)] overflow-y-auto'>
        {notificationsData?.results && notificationsData.results.length > 0 ? (
          notificationsData.results.map((notification, idx) => (
            <div
              key={notification.id}
              className='p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-blue-500'
            >
              <div className='flex items-start justify-between gap-2'>
                <div className='flex-1'>
                  {/* Sender Info */}
                  {/* {notification?.payload?.actor && (
                    <p className='font-semibold text-sm text-gray-900'>
                      {notification.payload.actor.name || 'Unknown User'}
                    </p>
                  )} */}

                  {/* Notification Message */}
                  <p className='text-sm text-gray-700 mt-1'>
                    {notification?.title || notification?.message || 'New notification'}
                  </p>

                  {/* Timestamp */}
                  {notification?.created_at && (
                    <p className='text-xs text-gray-500 mt-2 '>
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Close Icon */}
                <button className='text-gray-400 hover:text-gray-600 cursor-pointer hover:scale-110 transition-transform duration-700 ease-in-out '>
                  <IoCloseOutline size={18} className='hover:text-red-500 ' />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className='p-8 text-center text-gray-500'>
            <p className='text-sm'>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications