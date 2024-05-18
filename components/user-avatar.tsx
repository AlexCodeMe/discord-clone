import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { cn } from '@/lib/utils'

export default function UserAvatar({
    src, className
}: {
    src?: string
    className?: string
}) {
  return (
    <Avatar className={cn('size-7 md:size-10', className)}>
        <AvatarImage src={src} />
    </Avatar>
  )
}
