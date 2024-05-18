import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { redirect } from "next/navigation";

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
};

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
}

import React from 'react'
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import ServerHeader from "./server-header";

export default async function ServerSidebar({ serverId }: { serverId: string }) {
    const profile = await currentProfile()

    if (!profile) return redirect('/')

    const server = await db.server.findUnique({
        where: { id: serverId },
        include: {
            channels: {
                orderBy: { createdAt: 'asc' }
            },
            members: {
                include: { profile: true },
                orderBy: { role: 'asc' }
            }
        }
    })

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = server?.members.filter((member) => member.profileId !== profile.id)

    if (!server) return redirect('/')

    const role = server.members.find((member) => member.profileId === profile.id)?.role

    return (
        <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
            <ServerHeader server={server} role={role} />
            <ScrollArea className='flex-1 px-3'>
                <div className='mt-2'>
                    ServerSearch
                </div>
                <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <p>ServerSection</p>
                        {/* <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text Channels"
                        /> */}
                        <div className="space-y-[2px]">
                            {textChannels.map((channel) => (
                                <p key={channel.id}>ServerChannel</p>
                                // <ServerChannel
                                //     key={channel.id}
                                //     channel={channel}
                                //     role={role}
                                //     server={server}
                                // />
                            ))}
                        </div>
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div>
                        <p>ServerSection</p>
                        {/* <ServerSection sectionType="channels"
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="Audio Channels" /> */}
                        <div className='space-y-[2px]'>
                            {audioChannels?.map((channel) => (
                                <p key={channel.id}>ServerChannel</p>
                                // <ServerChannel  key={channel.id}
                                //     channel={channel}
                                //     role={role}
                                //     server={server} />
                            ))}
                        </div>
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div>
                        <p>ServerSection</p>
                        {/* <ServerSection sectionType="channels"
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="Video Channels" /> */}
                        <div className='space-y-[2px]'>
                            {videoChannels?.map((channel) => (
                                <p key={channel.id}>ServerChannel</p>
                                // <ServerChannel  key={channel.id}
                                //     channel={channel}
                                //     role={role}
                                //     server={server} />
                            ))}
                        </div>
                    </div>
                )}
                {!!members?.length && (
                    <div>
                        <p>ServerSection</p>
                        {/* <ServerSection sectionType="members"
                        server={server}
                        role={role}
                        label="Members" /> */}
                        <div className='space-y-[2px]'>
                            {videoChannels?.map((channel) => (
                                <p key={channel.id}>ServerChannel</p>
                                // <ServerChannel  key={channel.id}
                                //     channel={channel}
                                //     role={role}
                                //     server={server} />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}

