'use client'

import React, { useEffect, useState } from 'react'
import CreateServerModal from '../modals/create-server-modal'
import InviteModal from '../modals/invite-modal'
import EditServerModal from '../modals/edit-server-modal'
import MembersModal from '../modals/members-modal'

export default function ModalProvider() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

  return isMounted ? (
    <>
        <CreateServerModal />
        <InviteModal />
      <EditServerModal />
      <MembersModal />
    </>
  ) : null
}
