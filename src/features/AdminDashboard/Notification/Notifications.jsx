import React from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import axiosApi from '../../../service/axiosInstance'
import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '../../../main'

const Notifications = ({ notifications = [], notificationCount = 0, onNotificationRead }) => {

  const navigate = useNavigate()

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

  // ====================================== Get Notifications List UI====================================== //
  const { data: notificationsData, isLoading, error, isSuccess } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axiosApi.get('/api/v1/notifications/all/')
      return response.data
    }
  })

  // ====================================== Delete Notification UI====================================== // 
  const { mutate: deleteNotification } = useMutation({
    mutationFn: async ({ source, id }) => {
      const response = await axiosApi.delete(`/api/v1/notifications/${source}/${id}/`)
      console.log('Delete notification response:', response.data)
      return response.data
    },
    onSuccess: (data) => {
      console.log('Notification deleted successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (error) => {
      console.error('Error deleting notification:', error)
    }
  })

  // ====================================== Mark Single Notification as Seen ====================================== // 
  const { mutate: markNotificationAsSeen } = useMutation({
    mutationFn: async (id) => {
      const response = await axiosApi.post(`/api/v1/notifications/${id}/seen/`)
      console.log('Mark notification as seen response:', response.data)
      return response.data
    },
    onSuccess: (data) => {
      console.log('Notification marked as seen successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (error) => {
      console.error('Error marking notification as seen:', error)
    }
  })


  // =====================Call mark as read when notifications are successfully fetched============================\\
  React.useEffect(() => {
    if (isSuccess && notificationsData?.results?.length > 0) {
      markNotificationsAsRead()
    }
  }, [isSuccess, notificationsData, markNotificationsAsRead])

  console.log('Notifications Data:', notificationsData?.results)

  // ====================================== Navigate to specefic route on Click Notification ====================================== //
  const handleNotificationClick = (notification) => {
    console.log("Specific Notification:==========", notification)
    const type = notification?.type
    console.log("Specific Notification:==========", type)

    if (type === 'mention') {
      navigate('/admin/communication')
    }
  }





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
        <button className='cursor-pointer'>
          Clear All
        </button>
      </div>

      {/* Notifications List */}
      <div className='divide-y max-h-[calc(100vh-200px)] overflow-y-auto'>
        {notificationsData?.results && notificationsData.results.length > 0 ? (
          notificationsData.results.map((notification, idx) => (
            <div
              key={notification.id}
              onClick={(e) => {
                e.stopPropagation()
                markNotificationAsSeen(notification.id)
                handleNotificationClick(notification)
              }}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.is_seen ? 'border-l-4 border-blue-500' : ''
                }`}
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
                  <p className={`text-sm text-gray-700 mt-1 ${!notification.is_seen ? 'font-semibold' : 'font-normal'
                    }`}>
                    {notification?.title || notification?.message || 'New notification'}
                  </p>

                  {/* Timestamp */}
                  {notification?.created_at && (
                    <p className={`text-xs text-gray-500 mt-2 ${!notification.is_seen ? 'font-semibold' : 'font-normal'
                      }`}>
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Close Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotification({ source: notification.source, id: notification.id })
                  }}
                  className='text-gray-400 hover:text-gray-600 cursor-pointer hover:scale-110 transition-transform duration-700 ease-in-out '
                >
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