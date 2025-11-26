import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight, Eye, Upload, EyeOff, X, Loader } from "lucide-react";
import { PricingCard } from "@/pages/Home/components/PricingPage";
import { pricingData } from '@/Content/pricingData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSetTopbar } from "@/api/hooks/TopbarContext";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/api/stores/auth-store";
import { toast } from "sonner";

import {
  useUpdateProfile,
  useChangePassword,
  useUpdatePreferences,
  useUserProfile,
  useDeleteUser
} from "@/api/hooks/Auth/useUser";
import {
  useCreateSupportTicket,
  // useSupportTickets,
  // useSupportManagement,
  useSupportTickets
} from "@/api/hooks/Auth/useSupport";
import type { UpdateProfileRequest } from "@/types/user.types";

interface InputFieldProps {
  label: string;
  className?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
}

const colorGreen = '#14E893';

export const InputField = ({
  label,
  className = "",
  type = "text",
  value,
  onChange,
  showPasswordToggle = false
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const getInputType = () => {
    if (type === 'password' && showPasswordToggle) {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  return (
    <div
      className="border flex items-center justify-between !rounded-xl px-4 py-3 glass"
      style={{
        background: 'rgba(20, 20, 20, 0.30)',
      }}
    >
      <input
        type={getInputType()}
        placeholder={label}
        value={value}
        onChange={onChange}
        className={`outline-0 bg-transparent opacity-70 w-full sm:text-base text-sm ${className}`}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 cursor-pointer hover:opacity-70 transition-opacity"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="glass rounded-2xl p-6 max-w-md w-full"
        style={{
          background: 'rgba(20, 20, 20, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Delete Account</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">
              <strong>Warning:</strong> All your data, including profile information, preferences, and account history will be permanently deleted.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader className="animate-spin" size={16} />}
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== ACCOUNT TAB ==============
const AccountContent = () => {
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const updatePreferences = useUpdatePreferences();
  const { data: profileData, isLoading: isLoadingProfile } = useUserProfile();
  // console.log("This is the data of the user", user)
  const [oldPassword, setOldPassword] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    account_name: '',
    email: '',
    phoneNumber: '',
    password: '',
    reEnterPassword: '',
    notificationPreference: 'EMAIL' as 'EMAIL' | 'SMS' | 'BOTH',
  });

  const [initialFormData, setInitialFormData] = useState(formData);
  const deleteUser = useDeleteUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (user?.id) {
      deleteUser.mutate(user.id, {
        onSuccess: () => {
          setShowDeleteModal(false);
          toast.success('Account deleted successfully');
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || error.message || 'Failed to delete account';
          toast.error(errorMessage);
        },
      });
    }
  };


  // Check if username has been changed based on backend data
  const hasChangedUsername = (profileData as any)?.username_edit_count && (profileData as any).username_edit_count > 0;

  // Load user profile data when it's available
  React.useEffect(() => {
    if (profileData) {
      const newFormData = {
        username: user?.user_name || (profileData as any).user_name || (profileData as any).username || '',
        account_name: (profileData as any).account_name || '',
        email: (profileData as any).email || '',
        phoneNumber: (profileData as any).phone || '',
        password: '',
        reEnterPassword: '',
        notificationPreference: ((profileData as any).notificationpreference || 'EMAIL') as 'EMAIL' | 'SMS' | 'BOTH',
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
    }
  }, [profileData]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleNotificationChange = (preference: 'EMAIL' | 'SMS' | 'BOTH') => {
    setFormData(prev => ({
      ...prev,
      notificationPreference: preference
    }));
  };

  const hasChanges = () => {
    // Check if any field has changed (excluding password fields for this check)
    const profileChanged =
      (!hasChangedUsername && formData.username !== initialFormData.username) ||
      formData.phoneNumber !== initialFormData.phoneNumber ||
      formData.notificationPreference !== initialFormData.notificationPreference;

    // Check if password change is in progress
    const passwordChanging = oldPassword || formData.password || formData.reEnterPassword;

    return profileChanged || passwordChanging;
  };

  const handleSaveChanges = async () => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    // Check if any changes were made
    if (!hasChanges()) {
      toast.error('No changes detected. Please update at least one field.');
      return;
    }

    try {
      let hasUpdates = false;

      // Validate and handle password change
      if (oldPassword || formData.password || formData.reEnterPassword) {
        if (!oldPassword) {
          toast.error('Please enter your current password');
          return;
        }
        if (!formData.password) {
          toast.error('Please enter a new password');
          return;
        }
        if (!formData.reEnterPassword) {
          toast.error('Please confirm your new password');
          return;
        }
        if (formData.password !== formData.reEnterPassword) {
          toast.error('New passwords do not match!');
          return;
        }
        if (formData.password.length < 6) {
          toast.error('New password must be at least 6 characters long');
          return;
        }

        await changePassword.mutateAsync({
          oldPassword: oldPassword,
          newPassword: formData.password
        });

        // Reset password fields after successful change
        setOldPassword('');
        setFormData(prev => ({ ...prev, password: '', reEnterPassword: '' }));
        hasUpdates = true;
        toast.success('Password changed successfully!');
      }

      // Update profile information if changed
      if (
        (!hasChangedUsername && formData.username !== initialFormData.username) ||
        formData.phoneNumber !== initialFormData.phoneNumber
      ) {
        const profileUpdateData: UpdateProfileRequest = {};

        if (!hasChangedUsername && formData.username !== initialFormData.username) {
          profileUpdateData.username = formData.username;
        }
        if (formData.phoneNumber !== initialFormData.phoneNumber) {
          profileUpdateData.phone = formData.phoneNumber;
        }

        await updateProfile.mutateAsync({
          userId: user.id,
          profile: profileUpdateData
        });

        hasUpdates = true;
      }

      // Update notification preferences if changed
      if (formData.notificationPreference !== initialFormData.notificationPreference) {
        await updatePreferences.mutateAsync({
          notificationPreference: formData.notificationPreference
        });
        hasUpdates = true;
      }

      if (hasUpdates) {
        toast.success('Account settings updated successfully!');
        // Update initial form data to reflect new saved state
        setInitialFormData({
          ...formData,
          password: '',
          reEnterPassword: ''
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to update account';
      toast.error(errorMessage);
    }
  };

  const isLoading = updateProfile.isPending || changePassword.isPending || updatePreferences.isPending;

  // Show loading state while fetching profile
  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="animate-spin text-emerald-400" size={24} />
        <span className="ml-2 text-gray-400">Loading profile...</span>
      </div>
    );
  }

  return (
    <>
      {/* Username and Account Name Fields */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Username (editable one time)</label>
          <InputField
            label="username"
            value={formData.username}
            onChange={handleInputChange('username')}
            className={hasChangedUsername ? "!opacity-50 cursor-not-allowed" : ""}
          />
          {/* {hasChangedUsername && (
            <p className="text-xs text-gray-500 mt-1">Username can only be changed once</p>
          )} */}
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Account name (optional)</label>
          <InputField
            label="account name"
            value={formData.account_name}
            onChange={handleInputChange('account_name')}
            className="!opacity-50 cursor-not-allowed"
          />
          {/* <p className="text-xs text-gray-500 mt-1">Auto-synced from your name</p> */}
        </div>
      </div>

      {/* Email and Phone */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Email address</label>
          <InputField
            label="Enter email"
            value={formData.email}
            onChange={handleInputChange('email')}
            className="!opacity-50 cursor-not-allowed"
          />
          {/* <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p> */}
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Phone number</label>
          <InputField
            label="+1 234 567 8900"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange('phoneNumber')}
          />
        </div>
      </div>

      {/* Password Change Section */}
      <div className="mb-6 rounded-xl">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Current Password</label>
            <InputField
              label="Enter current password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              showPasswordToggle={true}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">New Password</label>
              <InputField
                label="Enter new password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                showPasswordToggle={true}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
              <InputField
                label="Re-enter new password"
                type="password"
                value={formData.reEnterPassword}
                onChange={handleInputChange('reEnterPassword')}
                showPasswordToggle={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="mb-8 mt-8">
        <label className="block text-gray-400 text-sm mb-4">Set notification preference</label>
        <div className="flex gap-6">
          {(['EMAIL', 'SMS', 'BOTH'] as const).map((pref) => (
            <label
              key={pref}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleNotificationChange(pref)}
            >
              <div
                className="relative w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-[8px] cursor-pointer transition-all duration-300"
                style={{
                  background: formData.notificationPreference === pref
                    ? 'linear-gradient(275.19deg, #14E893 -15.5%, #5131AD 98.25%)'
                    : 'transparent',
                  border: formData.notificationPreference === pref
                    ? 'none'
                    : '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                {formData.notificationPreference === pref && (
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 16 16" fill="none">
                    <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-white text-base sm:text-sm">
                {pref === 'EMAIL' ? 'Email' : pref === 'SMS' ? 'SMS' : 'Both'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col gap-4 md:flex-row md:gap-4 items-center md:items-center justify-center md:justify-end">
        <button
          onClick={handleDeleteAccount}
          disabled={deleteUser.isPending}
          className="!rounded-full cursor-pointer glass !px-6 !py-2 flex items-center justify-center hover:!bg-red-500/20 transition-all duration-300 w-full sm:w-[70%] md:w-fit group"
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            borderRadius: '9999px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          <span className="text-red-400 group-hover:text-red-300 transition-colors">
            {deleteUser.isPending ? 'Deleting...' : 'Delete account'}
          </span>
          {!deleteUser.isPending && <ChevronRight size={16} className="text-red-400 ml-2" />}
        </button>

        <button
          onClick={handleSaveChanges}
          disabled={isLoading}
          className="special-btn w-full sm:w-fit !px-6 !py-2 flex items-center justify-center"
        >
          {isLoading && <Loader className="animate-spin mr-2" size={16} />}
          Save changes <ChevronRight size={16} />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isLoading={deleteUser.isPending}
      />
    </>
  );
};

// ============== SUPPORT TAB ==============
const CreateTicketForm = () => {
  const createTicket = useCreateSupportTicket();
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // Validate file type
  const isValidFileType = (file: File): boolean => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip',
      'application/x-zip-compressed'
    ];

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.txt', '.zip'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
  };

  const validateFiles = (selectedFiles: File[]): { valid: boolean; error?: string } => {
    // Check count
    if (selectedFiles.length > 5) {
      return { valid: false, error: 'Maximum 5 files allowed' };
    }

    // Check file sizes and types
    for (const file of selectedFiles) {
      if (file.size > 10 * 1024 * 1024) {
        return { valid: false, error: `File "${file.name}" exceeds 10MB limit` };
      }

      if (!isValidFileType(file)) {
        return {
          valid: false,
          error: `File "${file.name}" is not a supported type. Allowed: jpg, jpeg, png, gif, webp, pdf, doc, docx, txt, zip`
        };
      }
    }

    return { valid: true };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const validation = validateFiles(selectedFiles);
    if (!validation.valid) {
      toast.error(validation.error);
      // Clear the input
      e.target.value = '';
      return;
    }

    setFiles(selectedFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const validation = validateFiles(droppedFiles);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setFiles(droppedFiles);
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('Please enter a ticket title');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Please describe your issue');
      return;
    }

    try {
      await createTicket.mutateAsync({
        subject: formData.title,
        body: formData.content,
        files: files.length > 0 ? files : undefined
      });

      toast.success('Support ticket created successfully!');

      // Reset form
      setFormData({ title: '', content: '' });
      setFiles([]);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create ticket';
      toast.error(errorMessage);
      console.error('Ticket creation error:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '' });
    setFiles([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-400 text-sm mb-2">
          Ticket title <span className="text-red-400">*</span>
        </label>
        <InputField
          label="Enter ticket title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">
          Ticket content <span className="text-red-400">*</span>
        </label>
        <textarea
          placeholder="Describe your issue in detail..."
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          className="w-full rounded-xl min-h-32 border p-4 resize-none outline-none glass text-white"
          style={{ background: 'rgba(20, 20, 20, 0.30)' }}
        />
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">
          Attachments (Optional - Max 5 files, 10MB each)
        </label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 !border-dashed rounded-xl p-4 sm:p-8 py-8 sm:py-14 text-center hover:!border-white/30 hover:!bg-white/5 cursor-default transition-all duration-300 glass"
          style={{ background: 'rgba(20, 20, 20, 0.30)' }}
        >
          <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-400 mb-2 text-sm sm:text-base">
            Drag and drop files here
          </p>
          <p className="text-gray-500 text-xs mb-3">
            Allowed: JPG, PNG, GIF, WebP, PDF, DOC, DOCX, TXT, ZIP
          </p>
          <label className="cursor-pointer">
            <span className="special-btn px-4 py-2 sm:px-6 font-medium text-sm sm:text-base inline-flex items-center justify-center rounded-md">
              Browse files
            </span>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.txt,.zip"
            />
          </label>

          {files.length > 0 && (
            <div className="mt-6 text-left">
              <p className="text-sm text-gray-400 mb-3 font-medium">
                Selected files ({files.length}/5):
              </p>
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm text-gray-300 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-red-400 hover:text-red-300 flex-shrink-0 p-1 hover:bg-red-500/10 rounded transition-colors"
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={createTicket.isPending}
          className="rounded-full cursor-pointer glass !px-6 !py-2 flex items-center justify-center hover:!bg-white/20 transition-all duration-300 w-full sm:w-auto"
          style={{ background: 'rgba(20, 20, 20, 0.30)' }}
        >
          Cancel <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={createTicket.isPending || !formData.title.trim() || !formData.content.trim()}
          className="special-btn !px-6 font-medium flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createTicket.isPending && <Loader className="animate-spin" size={16} />}
          {createTicket.isPending ? 'Creating...' : 'Create ticket'}
          {!createTicket.isPending && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

const PreviousTickets = () => {
  // const { tickets: response, isLoading, error } = useSupportManagement();
  const { data: response, isLoading } = useSupportTickets();

  // Extract tickets from the response structure
  const tickets = Array.isArray((response as any)?.data)
    ? (response as any).data
    : Array.isArray(response)
      ? response
      : [];

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="animate-spin text-emerald-400" size={24} />
        <span className="ml-2 text-gray-400">Loading tickets...</span>
      </div>
    );
  }


  console.log("@The data of the tickets", response)

  if (tickets.length === 0) {
    return (
      <div className="mt-6 text-center py-8">
        <p className="text-gray-400">No support tickets yet</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return "bg-blue-500/20 text-blue-400 border border-blue-500/50";
      case 'in_progress':
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50";
      case 'resolved':
        return "bg-green-500/20 text-green-400 border border-green-500/50";
      case 'closed':
        return "bg-gray-500/20 text-gray-400 border border-gray-500/50";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="mt-6 sm:mt-12">
      <p className="text-gray-200 text-base sm:text-lg mb-4">Previous support tickets</p>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {tickets.map((ticket: any) => (
          <div
            key={ticket.id}
            className="border rounded-xl p-4 glass"
            style={{ background: 'rgba(20, 20, 20, 0.30)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-white text-base font-medium flex-1 pr-2">
                {ticket.subject}
              </h4>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(ticket.status)}`}
              >
                {ticket.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-xs mb-1">Created on</p>
                <p className="text-white text-sm">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs mb-1">Attachments</p>
                {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 ? (
                  <span
                    className="text-sm underline decoration-2 underline-offset-2"
                    style={{
                      color: colorGreen,
                      textDecorationColor: colorGreen,
                    }}
                  >
                    {ticket.attachmentUrls.length} file{ticket.attachmentUrls.length === 1 ? "" : "s"} attached
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">No files attached</span>
                )}
              </div>
            </div>

            <button
              className="w-full border rounded-full py-3 px-4 flex items-center justify-center gap-2 text-white hover:bg-white/5 transition-all duration-300"
              style={{ background: 'rgba(20, 20, 20, 0.30)' }}
            >
              View details <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto border rounded-xl pt-4 sm:pt-7 glass"
        style={{ background: 'rgba(20, 20, 20, 0.30)' }}>
        <Table>
          <TableHeader className="border-none overflow-hidden">
            <TableRow className="border-none">
              <TableHead className="text-gray-400 pb-3 sm:pb-5 pr-2 sm:pr-4 pl-3 sm:pl-6 text-xs sm:text-sm">
                Title
              </TableHead>
              <TableHead className="text-gray-400 pb-3 sm:pb-5 px-2 sm:px-4 text-xs sm:text-sm">
                Status
              </TableHead>
              <TableHead className="text-gray-400 pb-3 sm:pb-5 px-2 sm:px-4 text-xs sm:text-sm">
                Created on
              </TableHead>
              <TableHead className="text-gray-400 pb-3 sm:pb-5 pl-2 sm:pl-4 text-xs sm:text-sm">
                Total attachments
              </TableHead>
              <TableHead className="text-gray-400 pb-3 sm:pb-5 pr-3 sm:pr-6 text-xs sm:text-sm"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket: any) => (
              <TableRow
                key={ticket.id}
                className="border-b hover:bg-white/5 transition-all duration-300"
              >
                <TableCell className="py-3 sm:py-4 pr-2 sm:pr-4 text-white pl-3 sm:pl-6 text-sm sm:text-base">
                  {ticket.subject}
                </TableCell>
                <TableCell className="py-3 sm:py-4 px-2 sm:px-4">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell className="py-3 sm:py-4 px-2 sm:px-4 text-gray-300 text-sm sm:text-base">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-3 sm:py-4 pl-2 sm:pl-4 text-sm sm:text-base">
                  {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 ? (
                    <span
                      className="underline decoration-2 underline-offset-2"
                      style={{
                        color: colorGreen,
                        textDecorationColor: colorGreen,
                      }}
                    >
                      {ticket.attachmentUrls.length} file{ticket.attachmentUrls.length === 1 ? "" : "s"} attached
                    </span>
                  ) : (
                    <span className="text-gray-500">No files attached</span>
                  )}
                </TableCell>
                <TableCell className="py-3 sm:py-4 text-right pr-3 sm:pr-8">
                  <button className="text-gray-400 hover:text-white">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const SupportContent = () => (
  <div className="space-y-6 sm:space-y-8">
    <CreateTicketForm />
    <PreviousTickets />
  </div>
);

// ============== SUBSCRIPTION TAB ==============
const SubscriptionPlans = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      {pricingData.map((tier) => (
        <PricingCard key={tier.id} tier={tier} />
      ))}
    </div>
  );
};

// ============== MAIN COMPONENT ==============
export default function SettingsTabs() {
  useSetTopbar('settings');
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');

  const defaultTab = urlTab || "account";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="px-0 sm:px-12 mt-16 sm:mt-0">
      <Tabs
        defaultValue={defaultTab}
        value={defaultTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex w-full h-auto p-0 bg-transparent border-b mb-8 rounded-none">
          <div className="flex gap-8 mr-auto">
            {["account", "subscription", "support"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="relative cursor-pointer pb-3 text-sm sm:text-base font-normal capitalize text-gray-400 hover:text-white !bg-transparent transition-all duration-300 after:absolute after:left-0 after:-bottom-[2px] after:h-[4px] after:w-0 after:transition-all after:duration-300 data-[state=active]:after:w-full after:bg-gradient-to-r after:from-[#14E893] after:to-[#5131AD] after:content-[''] after:rounded-full border-0"
              >
                {tab}
              </TabsTrigger>
            ))}
          </div>
        </TabsList>

        <TabsContent value="account">
          <AccountContent />
        </TabsContent>
        <TabsContent value="subscription">
          <SubscriptionPlans />
        </TabsContent>
        <TabsContent value="support">
          <SupportContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}