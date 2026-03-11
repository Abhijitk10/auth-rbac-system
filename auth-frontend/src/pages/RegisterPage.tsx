import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { RegisterFormData, ApiError } from '../types/auth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: { role: 'USER' },
  });

  // Watch password for confirm-password validation
  const password = watch('password');

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...payload } = data;
      return authApi.register(payload);
    },
    onSuccess: (data) => {
      login(data.token, { name: data.name, email: data.email, role: data.role });
      navigate('/dashboard');
    },
  });

  const getApiError = () => {
    const err = mutation.error as AxiosError<ApiError>;
    return err?.response?.data?.message ?? 'Registration failed. Please try again.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in your details to get started</p>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
          {/* Name */}
          <div>
            <label className="label" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="input-field"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="input-field"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="input-field"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                  message: 'Must include uppercase, lowercase, and a number',
                },
              })}
            />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="input-field"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="label" htmlFor="role">Select Role</label>
            <select
              id="role"
              className="input-field bg-white cursor-pointer"
              {...register('role')}
            >
              <option value="USER">👤 User — Standard access</option>
              <option value="ADMIN">🔴 Admin — Full access</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              In real apps, roles are assigned by administrators, not chosen at registration.
            </p>
          </div>

          {/* API Error */}
          {mutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm font-medium">⚠️ {getApiError()}</p>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
