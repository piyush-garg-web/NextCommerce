'use client'
import UserPanelNavigation from './UserPanelNavigation'

const UserPanelLayout = ({ children }) => {
  return (
    <div className='lg:flex lg:px-32 px-4 my-20 gap-10'>
      <div className='lg:w-72 w-full'>
        <UserPanelNavigation />
      </div>
      <div className='lg:w-[calc(100%-18rem)] w-full'>
        {children}
      </div>
    </div>
  )
}

export default UserPanelLayout
