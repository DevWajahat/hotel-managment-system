import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import WebApp from '../../layouts/webApp'
import { authAPI } from '../../api/userAuth' // Kept your import path
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Camera, User, Save } from 'lucide-react'

// --- 1. Updated Schema for full_name ---
const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'), // Single field
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().optional(),
})

export default function ProfileSettings() {
  const [user, setUser] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
  })

  // 2. Fetch Current Data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await authAPI.getProfile()
        setUser(data)

        // --- UPDATED: Set full_name ---
        setValue('full_name', data.full_name)
        setValue('email', data.email)
        setValue('phone', data.phone || '')

        if (data.avatar) setPreview(data.avatar)
      } catch (error) {
        console.error('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [setValue])

  // 3. Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  // 4. Submit Update
  const onSubmit = async (values) => {
    try {
      const formData = new FormData()

      // --- UPDATED: Append full_name ---
      formData.append('full_name', values.full_name)
      formData.append('email', values.email)
      formData.append('phone', values.phone)

      if (values.password) {
        formData.append('password', values.password)
      }

      if (selectedFile) {
        formData.append('avatar', selectedFile)
      }

      await authAPI.updateProfile(formData)
      alert('Profile updated successfully!')
      window.location.reload()
    } catch (error) {
      alert(
        'Failed to update: ' + (error.response?.data?.message || error.message),
      )
    }
  }

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    )

  return (
    <WebApp>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-serif font-bold mb-8 text-gray-800">
          Profile Settings
        </h1>

        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          {/* LEFT: Avatar Card */}
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full cursor-pointer hover:bg-orange-700 shadow-sm transition-colors">
                  <Camera size={16} />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              {/* Display full_name from state */}
              <h2 className="font-bold text-lg">{user?.full_name}</h2>
              <p className="text-sm text-gray-500">
                {user?.role === 'user' ? 'Guest' : ''}
              </p>
            </CardContent>
          </Card>

          {/* RIGHT: Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* --- UPDATED: Single Full Name Input --- */}
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" {...register('full_name')} />
                  {errors.full_name && (
                    <p className="text-red-500 text-xs">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+1 234 567 8900"
                  />
                </div>

                {/* <div className="pt-4 border-t mt-4"> */}
                {/*   <Label htmlFor="password">New Password (Optional)</Label> */}
                {/*   <Input */}
                {/*     id="password" */}
                {/*     type="password" */}
                {/*     placeholder="Leave blank to keep current password" */}
                {/*     {...register('password')} */}
                {/*   /> */}
                {/*   <p className="text-xs text-gray-400 mt-1"> */}
                {/*     Only enter if you want to change it. */}
                {/*   </p> */}
                {/* </div> */}

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gray-900 text-white"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </WebApp>
  )
}
