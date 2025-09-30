
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// شبیه‌سازی کاربران سیستم
const mockUsers = [
  {
    id: '1',
    name: 'مدیر سیستم',
    email: 'admin@airolia.shop',
    password: 'admin123'
  },
  {
    id: '2',
    name: 'کاربر تست',
    email: 'user@test.com',
    password: 'user123'
  }
];

export const mockAuthApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // شبیه‌سازی تاخیر شبکه
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('ایمیل یا رمز عبور اشتباه است');
    }
    
    return {
      token: 'mock_token_' + Date.now(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
};

export const mockUserApi = {
  getProfile: async (): Promise<UserProfile> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    
    const userData = localStorage.getItem('user');
    if (!userData) {
      throw new Error('No user data found');
    }
    
    return JSON.parse(userData);
  },

  logout: async (): Promise<void> => {
    // شبیه‌سازی تاخیر شبکه
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
