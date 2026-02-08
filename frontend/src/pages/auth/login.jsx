'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom' // 1. Import useNavigate
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { authAPI } from '../../api/userAuth'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must be less then 16 characters'),
})

const Login = () => {
  // 2. Initialize navigate hook
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (formData) => {
    try {
      // 3. Capture the actual response from the API
      const response = await authAPI.login(formData)

      // 4. Store the token from the RESPONSE, not the form data
      // (Assuming your backend returns { token: "...", role: "...", ... })
      localStorage.setItem('token', response.token)

      // Optional: Store user info for easy access later
      localStorage.setItem('user', JSON.stringify(response))

      console.log('Login Success:', response)

      // 5. Role-based Navigation
      if (response.role === 'user') {
        navigate('/guests/dashboard')
      } else if (response.role === 'admin') {
        navigate('/admin/dashboard') // Assuming you have an admin route
      } else if (response.role === 'staff') {
        navigate('/staff/dashboard')
      } else {
        // Fallback for unknown roles
        navigate('/')
      }
    } catch (err) {
      console.error('API Error:', err)
      const apiErrorMessage =
        err.response?.data?.message || err.response?.data?.error

      if (apiErrorMessage === 'Invalid credentials') {
        // Show generic error for security, or specific field error
        form.setError('root', {
          type: 'manual',
          message: 'Invalid email or password.',
        })
      } else {
        form.setError('root', {
          type: 'server',
          message: apiErrorMessage || 'Something went wrong',
        })
      }
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="grid h-full w-full p-4 lg:grid-cols-2">
        <div className="m-auto flex w-full max-w-xs flex-col items-center">
          <h1 className="text-amber-700 font-sans font-bold">
            Luxury Stay Hotel
          </h1>
          <p className="mt-4 font-semibold text-xl tracking-tight">
            Log in to Luxury Stay Hotel
          </p>

          <Button className="mt-8 w-full gap-3" variant="outline">
            <GoogleLogo />
            Continue with Google
          </Button>

          <div className="my-7 flex w-full items-center justify-center overflow-hidden">
            <Separator />
            <span className="px-2 text-sm text-muted-foreground">OR</span>
            <Separator />
          </div>

          <Form {...form}>
            <form
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Display Root Errors (like invalid credentials) */}
              {form.formState.errors.root && (
                <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium text-center">
                  {form.formState.errors.root.message}
                </div>
              )}

              <Button
                className="mt-4 w-full"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? 'Logging in...'
                  : 'Continue with Email'}
              </Button>
            </form>
          </Form>

          <div className="mt-5 space-y-5">
            <Link
              className="block text-center text-muted-foreground text-sm underline"
              to="#"
            >
              Forgot your password?
            </Link>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?
              <Link
                className="ml-1 text-primary font-medium underline"
                to="/register"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1596436889106-be35e843f974"
          loading="lazy"
          className="hidden rounded-lg h-full object-cover border bg-muted lg:block"
          alt="Login Banner"
        />
      </div>
    </div>
  )
}

const GoogleLogo = () => (
  <svg
    className="inline-block size-lg shrink-0 align-sub text-inherit"
    fill="none"
    height="1.2em"
    id="icon-google"
    viewBox="0 0 16 16"
    width="1.2em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M15.6823 8.18368C15.6823 7.63986 15.6382 7.0931 15.5442 6.55811H7.99829V9.63876H12.3194C12.1401 10.6323 11.564 11.5113 10.7203 12.0698V14.0687H13.2983C14.8122 12.6753 15.6823 10.6176 15.6823 8.18368Z"
        fill="#4285F4"
      />
      <path
        d="M7.99812 16C10.1558 16 11.9753 15.2915 13.3011 14.0687L10.7231 12.0698C10.0058 12.5578 9.07988 12.8341 8.00106 12.8341C5.91398 12.8341 4.14436 11.426 3.50942 9.53296H0.849121V11.5936C2.2072 14.295 4.97332 16 7.99812 16Z"
        fill="#34A853"
      />
      <path
        d="M3.50665 9.53295C3.17154 8.53938 3.17154 7.4635 3.50665 6.46993V4.4093H0.849292C-0.285376 6.66982 -0.285376 9.33306 0.849292 11.5936L3.50665 9.53295Z"
        fill="#FBBC04"
      />
      <path
        d="M7.99812 3.16589C9.13867 3.14825 10.241 3.57743 11.067 4.36523L13.3511 2.0812C11.9048 0.723121 9.98526 -0.0235266 7.99812 -1.02057e-05C4.97332 -1.02057e-05 2.2072 1.70493 0.849121 4.40932L3.50648 6.46995C4.13848 4.57394 5.91104 3.16589 7.99812 3.16589Z"
        fill="#EA4335"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect fill="white" height="16" width="15.6825" />
      </clipPath>
    </defs>
  </svg>
)

export default Login
