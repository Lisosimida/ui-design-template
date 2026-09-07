import SignInForm from './SignInForm'

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams

  return (
    <main
      className="resume-lab rl-page"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        <SignInForm next={next} />
      </div>
    </main>
  )
}
