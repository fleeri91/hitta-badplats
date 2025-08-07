'use client'

import { APIProvider } from '@vis.gl/react-google-maps'

export default function GoogleMapProvider({
  children,
  ...props
}: React.ComponentProps<typeof APIProvider>) {
  return (
    <APIProvider apiKey={props.apiKey} libraries={['marker']}>
      {children}
    </APIProvider>
  )
}
