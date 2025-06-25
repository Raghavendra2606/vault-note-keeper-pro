
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface LoginProps {
  onLogin: (email: string) => void;
  onToggleMode: () => void;
  isSignup: boolean;
}

const Login = ({ onLogin, onToggleMode, isSignup }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  // Mock registered users database - using localStorage to persist users
  const getRegisteredUsers = () => {
    const users = localStorage.getItem('registeredUsers');
    if (users) {
      return JSON.parse(users);
    }
    // Default users
    const defaultUsers = [
      { email: 'user@example.com', password: 'password123' },
      { email: 'admin@test.com', password: 'admin123' }
    ];
    localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
    return defaultUsers;
  };

  const addUser = (email: string, password: string) => {
    const users = getRegisteredUsers();
    users.push({ email, password });
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation (only for signup)
    if (isSignup) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // Mock authentication logic
    setTimeout(() => {
      const registeredUsers = getRegisteredUsers();
      
      if (isSignup) {
        // Check if user already exists
        const userExists = registeredUsers.some((user: any) => user.email === email);
        if (userExists) {
          toast({
            title: "Error",
            description: "An account with this email already exists.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        // Add new user to mock database
        addUser(email, password);
        
        toast({
          title: "Success",
          description: "Account created successfully! You can now sign in.",
        });
        
        // Reset form and switch to login mode
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        onToggleMode();
      } else {
        // Check if user exists and password matches
        const user = registeredUsers.find((u: any) => u.email === email && u.password === password);
        if (!user) {
          toast({
            title: "Error",
            description: "Invalid email or password. Please check your credentials.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        // Successful login
        onLogin(email);
        toast({
          title: "Success",
          description: "Welcome back!"
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">SecureNotes</h1>
          <p className="text-gray-600">Your secure workspace for notes and passwords</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {isSignup && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={onToggleMode}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isSignup ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                {!isSignup && (
                  <>Demo credentials: user@example.com / password123<br/></>
                )}
                Full authentication will be powered by Supabase after integration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
