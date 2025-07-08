'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { PencilIcon } from "lucide-react"

export default function EditProfileModal() {
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    website: '',
    location: '',
    about: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div>
      <PencilIcon
        onClick={() => setOpen(true)}
        className="w-4 h-4 text-white hover:text-gray-300 cursor-pointer mb-2"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-[#111] text-white rounded-xl px-6 py-4"
        >
          <DialogHeader>
            <DialogTitle className="text-lg">Edit Profile Details</DialogTitle>
            <p className="text-sm text-gray-400">Write a little bit about you.</p>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right col-span-1">
                First Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className="col-span-3 bg-[#1a1a1a] text-white border border-[#333]"
                placeholder="First name"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right col-span-1">
                Last Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className="col-span-3 bg-[#1a1a1a] text-white border border-[#333]"
                placeholder="Last name"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="about" className="text-right col-span-1 mt-2">
                About Yourself
              </Label>
              <Textarea
                id="about"
                name="about"
                value={profile.about}
                onChange={handleChange}
                className="col-span-3 bg-[#1a1a1a] text-white border border-[#333]"
                placeholder="Tell us something about you..."
                rows={4}
              />
            </div>
          </div>

          <div className="border-t border-[#333] my-4" />

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)} className="text-white cursor-pointer">
              Cancel
            </Button>
            <Button
              className="bg-white text-black hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                console.log("Saved data:", profile)
                setOpen(false)
              }}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
