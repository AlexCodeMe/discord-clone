'use client'

import { useModal } from '@/store/use-modal-store'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { useOrigin } from '@/hooks/use-origin'
import axios from 'axios'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { Label } from '../ui/label'

export default function InviteModal() {
    const { onOpen, isOpen, onClose, type, data } = useModal()
    const origin = useOrigin()

    const isModalOpen = isOpen && type === 'invite'
    const { server } = data

    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    const onNew = async () => {
        try {
            setIsLoading(true)

            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)

            onOpen('invite', { server: response.data })
        } catch (error) {
            console.log('onNew - invite-modal', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Invite Friends
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Connect with people who have similar intererests.
                    </DialogDescription>
                </DialogHeader>
                <div className='p-6'>
                    <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                        Server invite link
                    </Label>
                    <div className='flex items-center mt-2 gap-x-2'>
                        <Input value={inviteUrl} disabled={isLoading}
                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0' />
                        <Button disabled={isLoading} onClick={onCopy} size='icon'>
                            {copied ? <Check className='size-4' /> : <Copy className='size-4' />}
                        </Button>

                    </div>
                    <Button variant='link' size='sm' className='text-xs text-zinc-500 mt-4'
                        onClick={onNew} disabled={isLoading}>
                        Generate a new link
                        <RefreshCw className='ml-2 size-4' />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
