// NotificationDisclaimer.tsx
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotifications, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from "@/api/hooks/notifications/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationDisclaimer() {
  const [mobile, setMobile] = useState("");
  const [checked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alertMethod, setAlertMethod] = useState("SMS");

  // Use notifications hooks
  const { data: notificationsData, isLoading, error } = useNotifications();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const textClass = "text-lg text-white";
  const linkClass = "underline hover:text-gray-300 transition-colors";

  const handleConfirm = () => {
    if (mobile && checked) {
      setShowModal(true);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => {
        console.log("All notifications marked as read");
      },
      onError: (error) => {
        console.error("Failed to mark all as read:", error);
      }
    });
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId, {
      onSuccess: () => {
        console.log("Notification marked as read");
      },
      onError: (error) => {
        console.error("Failed to mark as read:", error);
      }
    });
  };

  const notifications = notificationsData?.data || [];

  // Get unread count
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  return (
    <>
      <div className="flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl space-y-6">
          {/* Title and Actions */}
          <div className="flex items-center justify-between mb-6">
            <h1 className={`${textClass} font-normal`}>TechTren Alerts & Notifications</h1>
            {notifications.length > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll || unreadCount === 0}
                variant="outline"
                className="border-white/20 text-white/70 hover:text-white flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                {isMarkingAll ? "Marking..." : "Mark All as Read"}
              </Button>
            )}
          </div>

          {/* Notifications Section */}
          <div className="space-y-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="glass rounded-2xl p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : error ? (
              // Error state
              <div className="glass rounded-2xl p-6 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-white text-lg mb-2">Failed to load notifications</p>
                <p className="text-gray-400">Please try again later</p>
              </div>
            ) : notifications.length === 0 ? (
              // Empty state
              <div className="glass rounded-2xl p-8 text-center">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-white text-xl mb-2">No notifications yet</p>
                <p className="text-gray-400">
                  You'll see important alerts and updates here when they arrive
                </p>
              </div>
            ) : (
              // Notifications list
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`glass rounded-2xl p-6 transition-all duration-300 ${notification.isRead
                    ? 'bg-white/5'
                    : 'bg-blue-500/10 border border-blue-500/20'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Notification Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.isRead
                        ? 'bg-gray-600'
                        : 'bg-blue-500'
                        }`}>
                        <Bell className="w-5 h-5 text-white" />
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-semibold text-lg">
                            {notification.name}
                          </h3>
                          {!notification.isRead && (
                            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                              New
                            </span>
                          )}
                        </div>

                        <p className="text-gray-300 mb-2 leading-relaxed">
                          {notification.data.message}
                        </p>

                        {/* Notification Details */}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="bg-white/10 px-2 py-1 rounded">
                            {notification.data.ticker}
                          </span>
                          <span>{notification.data.asset_class}</span>
                          <span>{notification.data.direction}</span>
                          <span>Target: ${notification.data.target_price}</span>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>
                            {formatDistanceToNow(new Date(notification.createdAt))} ago
                          </span>
                          {notification.data.triggered_at && (
                            <span>Triggered: {notification.data.triggered_at}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {!notification.isRead && (
                      <Button
                        onClick={() => handleMarkAsRead(notification.id)}
                        variant="ghost"
                        size="sm"
                        className="text-white/70 hover:text-white hover:bg-white/10"
                      >
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SMS Alert Setup Section */}
          <div className="glass rounded-2xl p-8 mt-8">
            <h2 className="text-2xl text-white font-normal mb-6 text-center">
              SMS Alert Setup
            </h2>

            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Paragraphs */}
              <p className={`${textClass} leading-relaxed text-center`}>
                Receive SMS alerts when your selected investment stocks reach your target prices.
              </p>

              <p className={`${textClass} leading-relaxed text-center`}>
                To receive SMS alerts from TechTren, enter your mobile number below and click{" "}
                <span className="font-medium">CONFIRM</span>
              </p>

              <p className={`${textClass} text-center`}>Message and data rates may apply.</p>

              <p className={`${textClass} text-center`}>
                Message frequency varies based on alert settings (typically 1-5 messages per day).
              </p>

              {/* Input Field */}
              <div className="mt-8 flex justify-center">
                <div
                  className="flex glass items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 w-full max-w-md"
                  style={{
                    background: "rgba(20, 20, 20, 0.30)",
                  }}
                >
                  <input
                    type="tel"
                    placeholder="Enter Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="bg-transparent outline-none w-full text-white placeholder-gray-500 text-center"
                  />
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex justify-center px-2">
                <label className="flex items-start justify-center gap-2 w-full max-w-[760px] text-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-gray-500 bg-transparent text-cyan-400 accent-cyan-400 focus:ring-0"
                  />
                  <span className={`${textClass} text-center`}>
                    I consent to receiving SMS messages from TechTren Alerts and have read and agree to the{" "}
                    <a href="#" className={linkClass}>
                      Terms & Conditions
                    </a>
                    <br />
                    <a href="#" className={linkClass}>
                      www.techtren.com/terms
                    </a>{" "}
                    and{" "}
                    <a href="#" className={linkClass}>
                      Privacy Policy
                    </a>{" "}
                    <a href="#" className={linkClass}>
                      www.techtren.com/privacy
                    </a>
                    , per day.
                  </span>
                </label>
              </div>

              {/* Confirmation Text */}
              <p className={`${textClass} leading-relaxed px-2 text-center`}>
                Once you clicked confirmed, you will receive a one-time SMS confirming successful
                subscription to TechTren Alerts.
              </p>

              <p className={`${textClass} px-2 text-center`}>
                You will be able to Opt-out and get support anytime by replying to the texts:{" "}
                <span className="font-medium">Text HELP for help. Text STOP to cancel.</span> Message
                and data rates may apply.
              </p>

              {/* Confirm Button */}
              <div className="flex justify-center mt-8">
                <button
                  disabled={!mobile || !checked}
                  onClick={handleConfirm}
                  className="special-btn !px-30 !py-3 flex items-center"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center px-4 z-50 animate-fadeIn"
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-[16px] p-8 animate-scaleIn my-auto"
            style={{
              background: "linear-gradient(135deg, rgba(20, 40, 50, 0.95) 0%, rgba(10, 25, 35, 0.95) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h2 className="text-[22px] text-white text-center mb-6 font-medium">
              Notification Settings
            </h2>

            {/* Alert Method Label */}
            <p className="text-[16px] text-gray-400 mb-3 text-center">Alert Method</p>

            {/* Dropdown */}
            <Select value={alertMethod} onValueChange={setAlertMethod}>
              <SelectTrigger
                className="w-full px-4 py-3 text-[16px] text-white rounded-[12px] outline-none border-0"
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <SelectValue placeholder="Select alert method" />
              </SelectTrigger>
              <SelectContent
                className="rounded-[12px] border-0"
                position="popper"
                sideOffset={5}
                style={{
                  background: "rgba(10, 25, 35, 0.98)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <SelectGroup>
                  <SelectItem
                    value="Email"
                    className="text-white cursor-pointer rounded-[8px] focus:bg-[#14E893] focus:text-white data-[highlighted]:bg-[#14E893] data-[highlighted]:text-white"
                  >
                    Email (Default)
                  </SelectItem>
                  <SelectItem
                    value="SMS"
                    className="text-white cursor-pointer rounded-[8px] focus:bg-[#14E893] focus:text-white data-[highlighted]:bg-[#14E893] data-[highlighted]:text-white"
                  >
                    SMS
                  </SelectItem>
                  <SelectItem
                    value="Both"
                    className="text-white cursor-pointer rounded-[8px] focus:bg-[#14E893] focus:text-white data-[highlighted]:bg-[#14E893] data-[highlighted]:text-white"
                  >
                    Both
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}