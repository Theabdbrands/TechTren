export interface UserProfile {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    isVerifiedEmail: boolean;
    bio?: string;
    phone?: string;
    username?: string;
    user_name?: string;
    account_name?: string;
    notificationpreference?: 'EMAIL' | 'SMS' | 'BOTH';
    username_edit_count?: number;
    avatar?: string;
    bannerImage?: string;
    subscription?: string;
    state?: string | null;
    city?: string;
    zip?: string | null;
    addr1?: string | null;
    addr2?: string | null;
    note?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileRequest {
    bio?: string;
    location?: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    profile_pic_url?: string;
    avatar_url?: string;
    banner_url?: string;
    phone?: string;
}

export interface UpdateProfileResponse {
    id: string;
    account_name: string;
    username: string;
    bio: string;
    location: string;
    profile_pic_url: string;
    banner_url: string;
    phone: string;
    updatedAt: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface UpdatePreferencesRequest {
    notificationPreference: 'EMAIL' | 'SMS' | 'BOTH';
}

export interface UploadAssetResponse {
    message: string;
    asset_type: 'PROFILE_PIC' | 'BANNER' | 'VIDEO';
    url: string;
    uploaded_at: string;
}

export interface SupportTicket {
    id: string;
    user_id: string;
    subject: string;
    body: string;
    attachmentUrls?: string[];
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    createdAt: string;
    updatedAt: string;
    user?: any;
}

export interface CreateSupportTicketRequest {
    subject: string;
    body: string;
    files?: File[];
}