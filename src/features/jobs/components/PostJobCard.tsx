import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import React from 'react'

const PostJobCard = ({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) => {
  return (
    <Card className='w-full max-w-155 mx-auto mb-10'>
      <CardHeader>
        <CardTitle>
          <h2 className='font-bold text-xl sm:text-2xl'>
            {title}
          </h2>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

export default PostJobCard