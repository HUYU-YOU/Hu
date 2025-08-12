import { getSession } from 'next-auth/react';

export default function ProfilePage({ session }) {
  return <main style={{ padding: 24 }}>Bonjour {session.user?.name || 'Humain'} 👋</main>;
}

export async function getServerSideProps(ctx){
  const session = await getSession(ctx);
  if(!session){
    return { redirect: { destination: '/login', permanent: false } };
  }
  return { props: { session } };
}
