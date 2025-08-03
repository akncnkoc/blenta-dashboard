import { Label } from '@/components/ui/label'
import { useSendNotificationMutation } from '@/services/api/notification-api'
import { useState } from 'react'
import { toast } from 'sonner'

export default function NotificationScreen() {
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationContent, setNotificationContent] = useState('')
  const [sendNotification] = useSendNotificationMutation()

  const handleSendNofitication = async () => {
    if (!notificationContent || !notificationTitle) {
      toast.warning('Title and content cannot be null or empty')
      return
    }
    toast.loading('Sending notifications')
    try {
      const res = await sendNotification({
        content: notificationContent,
        title: notificationTitle,
      })
      if (res.error) {
        toast.error('Cannot sended notifications')
        return
      }
      toast.success('Notifications sended')
    } catch {}
  }

  return (
    <div className="p-4 w-full flex items-center justify-center">
      <div className="mb-4 flex flex-col justify-between items-center w-[500px] space-y-4">
        <Label>Title</Label>
        <input
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
          name="title"
          value={notificationTitle}
          onChange={(e) => setNotificationTitle(e.target.value)}
        />

        <Label>Content</Label>
        <textarea
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Content"
          name="content"
          value={notificationContent}
          onChange={(e) => setNotificationContent(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleSendNofitication()}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Send All Users
          </button>
        </div>
      </div>
    </div>
  )
}
