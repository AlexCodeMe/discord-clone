'use client'

import { useModal } from '@/store/use-modal-store'
import { Member, MemberRole, Profile, Server } from '@prisma/client'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react'

export type ServerProps = Server & {
    members: (Member & { profile: Profile })[]
}

type Props = {
    server: ServerProps
    role?: MemberRole
}

export default function ServerHeader({
    server, role
}: Props) {
    const { onOpen } = useModal()

    const isAdmin = role === MemberRole.ADMIN
    const isModerator = isAdmin || role === MemberRole.MODERATOR

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild className='focus:outline-none'>
            <button className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
                {server.name}
                <ChevronDown className='size-6 ml-auto' />
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
            {isModerator && (
                <DropdownMenuItem onClick={() => onOpen('invite', { server })}
                    className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'>
                    Invite People
                    <UserPlus className='size-4 ml-auto' />
                </DropdownMenuItem>
            )}
            {isAdmin && (
                <DropdownMenuItem onClick={() => onOpen('editServer', { server })}>
                    Server Settings
                    <Settings className='size-4 ml-auto' />
                </DropdownMenuItem>
            )}
            {isAdmin && (
                <DropdownMenuItem onClick={() => onOpen('members', { server })}>
                    Manage Members
                    <Users className='size-4 ml-auto' />
                </DropdownMenuItem>
            )}
            {isModerator && (
                <DropdownMenuItem onClick={() => onOpen('createChannel', { server })}
                    className='px-3 py-2 text-sm cursor-pointer'>
                    Create Channel
                    <PlusCircle className='size-4 ml-auto' />
                </DropdownMenuItem>
            )}
            {isModerator && (
                <DropdownMenuSeparator />
            )}
            {isAdmin && (
                <DropdownMenuItem onClick={() => onOpen('deleteServer', { server })}
                className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
                Delete Server
                <Trash className='size-4 ml-auto' />
            </DropdownMenuItem>
            )}
            {!isAdmin && (
                <DropdownMenuItem onClick={() => onOpen('leaveServer', { server })}
                className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
                Leave Server
                <LogOut className='size-4 ml-auto' />
            </DropdownMenuItem>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
  )
}