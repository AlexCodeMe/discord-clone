'use client'

import { useModal } from '@/store/use-modal-store'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { useOrigin } from '@/hooks/use-origin'
import axios from 'axios'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Check, Copy, Gavel, Loader2, MoreVertical, RefreshCw, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { Label } from '../ui/label'
import { useRouter } from 'next/navigation'
import { ServerProps } from '../server/server-header'
import qs from 'query-string'
import { MemberRole } from '@prisma/client'
import { ScrollArea } from '../ui/scroll-area'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarImage } from '../ui/avatar'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500" />
}

export default function MembersModal() {
    const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerProps };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.delete(url);

      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
        setLoadingId(memberId);
        const url = qs.stringifyUrl({
            url: `/api/members/${memberId}`,
            query: {
                serverId: server?.id,
            }
        });

        const response = await axios.patch(url, { role });

        router.refresh();
        onOpen("members", { server: response.data });
    } catch (error) {
        console.log(error);
    } finally {
        setLoadingId("");
    }
}

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Manage Server Members
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className='mt-8 max-h-[420px] pr-6'>
                    {server?.members?.map((member) => (
                        <div key={member.id}
                            className='flex items-center gap-x-2 mb-6'>
                            <Avatar className='size-7 md:size-10'>
                                <AvatarImage src={member.profile.imageUrl} />
                            </Avatar>
                            <div className='flex flex-col gap-y-1'>
                                <div className='text-xs font-semibold flex items-center gap-x-1'>
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className='text-xs text-zinc-500'>
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                                <div className='ml-auto'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className='size-4 text-zinc-500' />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side='left'>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>
                                                    <ShieldQuestion className='size-4 mr-2' />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, 'GUEST')}>
                                                            <Shield className='size-4 mr-2' />
                                                            Guest
                                                            {member.role === "GUEST" && (
                                                                <Check
                                                                    className="h-4 w-4 ml-auto"
                                                                />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, 'MODERATOR')}>
                                                            <ShieldCheck className='size-4 mr-2' />
                                                            Moderator
                                                            {member.role === "MODERATOR" && (
                                                                <Check
                                                                    className="h-4 w-4 ml-auto"
                                                                />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onKick(member.id)}>
                                                <Gavel className='size-4 mr-2' />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className='size-4 text-zinc-500 animate-spin' />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
