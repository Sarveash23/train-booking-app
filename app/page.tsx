import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect root path to login page
  redirect('/login');
}
