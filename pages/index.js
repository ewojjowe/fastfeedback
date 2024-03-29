import Head from 'next/head'
import { Button, Heading, Text, Code } from "@chakra-ui/react"

import { useAuth } from '@/lib/auth'

export default function Home () {
  const auth = useAuth()
  return (
    <div>
      <Head>
        <title>Fast Feedback</title>

        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <main>
        <Heading>
          Fast Feedback
        </Heading>
        
        <Text>
          Current user: <Code>{auth.user ? auth.user.email : ''}</Code>
        </Text>
        {auth.user ? (
          <Button onClick={(e) => {auth.signout()}}>Sign Out</Button>
        ) : (
          <Button onClick={(e) => {auth.signinWithGithub()}}>Sign In</Button>
        )}
      </main>
    </div>
  )
}
