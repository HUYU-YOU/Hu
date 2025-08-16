import Link from 'next/link';

export default function Messages() {
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',gap:'16px'}}>
      <div>Messagerie à venir…</div>
      <Link href="/">Retour</Link>
    </div>
  );
}
