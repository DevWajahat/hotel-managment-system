'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Link } from 'react-router-dom'
import { authAPI } from '../../api/userAuth'
import { CheckCircle2, Mail } from 'lucide-react'

const formSchema = z.object({
  full_name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must be less then 16 characters'),
})

const Register = () => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [successEmail, setSuccessEmail] = useState('')

  const form = useForm({
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data) => {
    try {
      // FIX: Removed manual name splitting.
      // We now send full_name directly because the Backend splits it.
      const payload = {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      }

      await authAPI.register(payload)

      setSuccessEmail(data.email)
      setIsSuccess(true)
    } catch (err) {
      console.error('API Error:', err)
      const apiErrorMessage = err.response?.data?.error

      if (apiErrorMessage === 'Email already in use') {
        form.setError('email', {
          type: 'manual',
          message: 'Email is already registered. Please log in.',
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
        <div className="m-auto flex w-full max-w-xs flex-col items-center justify-center">
          <h1 className="text-amber-700 font-sans font-bold text-2xl mb-2">
            Luxury Stay Hotel
          </h1>

          {isSuccess ? (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-center">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Check your email
                </h2>
                <p className="text-muted-foreground text-sm">
                  We've sent a verification link to <br />
                  <span className="font-medium text-foreground">
                    {successEmail}
                  </span>
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                Click the link in the email to verify your account and sign in.
              </div>

              <div className="pt-4">
                <Button asChild className="w-full" variant="outline">
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-2 font-semibold text-xl tracking-tight">
                Create your account
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
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
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
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                      ? 'Registering...'
                      : 'Continue with Email'}
                  </Button>
                </form>
              </Form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Already have an account?
                <Link
                  className="ml-1 text-primary font-medium underline"
                  to="/login"
                >
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>

        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
          className="hidden rounded-lg h-full object-cover border bg-muted lg:block"
          alt="Hotel"
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

export default Register
